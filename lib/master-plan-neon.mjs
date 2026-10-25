// Single-owner adapter. No database credentials or authentication tokens are exposed to clients.
// Provider routes/cookie names must be confirmed against the provisioned instance before enabling.
import {handleAuthProxyRequest,extractNeonAuthCookies} from '@neondatabase/auth/server';
export function config(env=process.env){
 if(env.MASTER_PLAN_AUTH_MODE!=='neon')throw Error('Password sign-in is not enabled.');
 const base=new URL(env.MASTER_PLAN_NEON_AUTH_URL||'');
 const origin=new URL(env.MASTER_PLAN_ORIGIN||'');
 const owner=String(env.MASTER_PLAN_OWNER_EMAIL||'').trim().toLowerCase();
 const ownerId=env.MASTER_PLAN_OWNER_ID,secret=env.MASTER_PLAN_SESSION_SECRET;
 if(base.protocol!=='https:'||base.username||base.password||base.search||base.hash||!/(?:^|\.)neon\.(?:tech|build)$/.test(base.hostname)||origin.protocol!=='https:'||origin.origin!==env.MASTER_PLAN_ORIGIN||!owner.includes('@')||!ownerId||!secret||secret.length<32)throw Error('Password sign-in is not configured.');
 return {base:base.href.replace(/\/$/,''),origin:origin.origin,owner,ownerId,secret};
}
export const authCookies=raw=>extractNeonAuthCookies(new Headers({cookie:raw||''}));
export async function upstream(path,{method='GET',body,cookie=''}={},proxy=handleAuthProxyRequest){
 const c=config();
 const cleanPath=path.replace(/^\//,'').split('?')[0];
 const request=new Request(c.origin+'/api/auth/'+cleanPath+(path.includes('?')?'?'+path.split('?')[1]:''),{method,headers:{'accept':'application/json','origin':c.origin,...(body?{'content-type':'application/json'}:{}),cookie:authCookies(cookie)},...(body?{body:JSON.stringify(body)}:{})});
 return proxy({request,path:cleanPath,baseUrl:c.base,cookieSecret:c.secret,sameSite:'strict',sessionDataTtl:1});
}
export async function ownerSession(cookie,proxy=handleAuthProxyRequest){
 if(!authCookies(cookie))return null;
 const r=await upstream('/get-session?disableCookieCache=true',{cookie},proxy);
 if(!r.ok)return null;
 const value=await r.json(),c=config();
 if(!value?.session||value.session.impersonatedBy||!value?.user||value.user.emailVerified!==true||String(value.user.email||'').toLowerCase()!==c.owner||value.user.id!==c.ownerId||String(value.session.userId)!==c.ownerId)return null;
 const expires=Date.parse(value.session.expiresAt);
 return Number.isFinite(expires)&&expires>Date.now()?value:null;
}
export function actionBody(action,input,owner){
 const password=v=>typeof v==='string'&&v.length>=12&&v.length<=128;
 const otp=v=>typeof v==='string'&&/^[0-9]{6,8}$/.test(v);
 if(action==='login'&&typeof input.password==='string'&&input.password.length>0&&input.password.length<=128)return {path:'/sign-in/email',body:{email:owner,password:input.password}};
 if(action==='send-code')return {path:'/email-otp/request-password-reset',body:{email:owner}};
 if(action==='set-password'&&otp(input.otp)&&password(input.password))return {path:'/email-otp/reset-password',body:{email:owner,otp:input.otp,password:input.password}};
 if(action==='change-password'&&typeof input.currentPassword==='string'&&input.currentPassword.length<=128&&password(input.newPassword))return {path:'/change-password',body:{currentPassword:input.currentPassword,newPassword:input.newPassword,revokeOtherSessions:true},requiresSession:true};
 if(action==='logout')return {path:'/sign-out',body:{}};
 return null;
}
export async function authHandler(req,res,{proxy=handleAuthProxyRequest}={}){
 res.setHeader('Cache-Control','private, no-store, max-age=0');res.setHeader('Vercel-CDN-Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Robots-Tag','noindex, nofollow');
 let c;try{c=config();}catch{return res.status(503).json({error:'Password setup is not ready yet.'});}
 if(req.method==='GET')return res.status(200).json({mode:'password'});
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed.'});
 if(req.headers.origin!==c.origin)return res.status(403).json({error:'Request origin rejected.'});
 if(!(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({error:'JSON required.'});
 let input=req.body;try{if(typeof input==='string'){if(Buffer.byteLength(input)>4096)return res.status(413).json({error:'Request too large.'});input=JSON.parse(input);}if(!input||typeof input!=='object'||Buffer.byteLength(JSON.stringify(input))>4096)throw Error();}catch{return res.status(400).json({error:'Invalid request.'});}
 const action=actionBody(input.action,input,c.owner);if(!action)return res.status(400).json({error:'Check your entries. New passwords must be 12–128 characters.'});
 try{
  if(action.requiresSession&&!await ownerSession(req.headers.cookie,proxy))return res.status(401).json({error:'Sign in again first.'});
  const r=await upstream(action.path,{method:'POST',body:action.body,cookie:req.headers.cookie},proxy);
  if(!r.ok)return res.status(r.status===429?429:400).json({error:r.status===429?'Too many attempts. Wait before trying again.':'Unable to complete sign-in. Check your password or request a fresh email code.'});
  const result=await r.json();
  if(['send-code','set-password','logout'].includes(input.action)&&result?.success!==true)return res.status(502).json({error:'The sign-in provider did not confirm this action. Please try again.'});
  if(input.action==='change-password'&&(result?.user?.id!==c.ownerId||result?.user?.emailVerified!==true||String(result?.user?.email||'').toLowerCase()!==c.owner))return res.status(502).json({error:'The provider did not confirm the owner password change.'});
  let cookies=r.headers.getSetCookie();
  if(input.action==='login'){
   const cookie=cookies.map(x=>x.split(';')[0]).join('; ');
   if(!await ownerSession(cookie,proxy))return res.status(401).json({error:'Owner verification is required before opening the office.'});
  }
  if(input.action==='set-password'){
   const signedIn=await upstream('/sign-in/email',{method:'POST',body:{email:c.owner,password:input.password}},proxy);
   if(!signedIn.ok)return res.status(400).json({error:'Password saved. Sign in again to verify your owner access.'});
   cookies=signedIn.headers.getSetCookie();const cookie=cookies.map(x=>x.split(';')[0]).join('; ');
   if(!await ownerSession(cookie,proxy))return res.status(401).json({error:'Password saved, but owner email verification is still required.'});
   const revoked=await upstream('/revoke-other-sessions',{method:'POST',body:{},cookie},proxy);
   if(!revoked.ok||(await revoked.json())?.status!==true)return res.status(503).json({error:'Password saved, but other sessions could not be revoked. Please retry password recovery.'});
  }
  if(cookies.length)res.setHeader('Set-Cookie',cookies);
  // Never forward provider JSON; it can include raw session tokens or account details.
  return res.status(200).json({ok:true});
 }catch{return res.status(503).json({error:'Sign-in is temporarily unavailable. Please try again.'});}
}

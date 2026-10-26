import {ownerSession,authHandler} from '../lib/master-plan-neon.mjs';
import { createHash, createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
const COOKIE = '__Host-sean-master-plan';
const hash = value => createHash('sha256').update(value).digest('hex');
const equal = (a,b) => typeof a==='string' && typeof b==='string' && a.length===b.length && timingSafeEqual(Buffer.from(a),Buffer.from(b));
function signature(value) { return createHmac('sha256',process.env.MASTER_PLAN_SESSION_SECRET).update(value).digest('hex'); }
function authorized(req) {
  const raw=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1)||'';
  const [expires,nonce,sig]=raw.split('.');
  return /^\d+$/.test(expires||'') && Number(expires)>Date.now() && Number(expires)<=Date.now()+28800000 && /^[a-f0-9]{32}$/.test(nonce||'') && equal(sig,signature(expires+'.'+nonce));
}
function readData() {
  const compressed = process.env.MASTER_PLAN_DATA_GZIP;
  if (!compressed) throw new Error('No snapshot');
  const data=JSON.parse(gunzipSync(Buffer.from(compressed,'base64'),{maxOutputLength:1048576}).toString());
  if(!Array.isArray(data.projects)||!Array.isArray(data.commits)||!Array.isArray(data.builds))throw new Error('Invalid snapshot');
  return {...data, productionReview: {"reviewDate":"2026-10-26","timeZone":"America/Panama","updatedAt":"2026-10-26T12:39:00Z","groups":[{"company":"HM","status":"VOICE & WORKFLOW APPROVED · final MP4 delivered","notes":"Owner approved the voice and factory workflow on Oct 26. The completed 35.083-second HM MP4 (20.8 MB) is in your dot chat; visual sampling and full decoding passed. Assistant listening is not verified. Copy and product-pilot material below remain drafts. Not published to socials.","copy":"Subject: The bills keep showing up\nPreview: Try this before you force another positive thought.\n\nAudio pilot working title: Before the First Scroll\nA one-minute guided pause before opening the day's feeds or messages."},{"company":"Genie","status":"OWNER APPROVED · MP4 delivered","notes":"Owner approved this Genie sample and factory workflow on Oct 26. The 30-second MP4 is in your dot chat. Owner approval is recorded; assistant listening is not verified. Not published to socials."},{"company":"Panama","status":"OWNER APPROVED · MP4 delivered","notes":"Owner approved this Panama sample and factory workflow on Oct 26. The 35.83-second MP4 is in your dot chat. Owner approval is recorded; assistant listening is not verified. Not published to socials."}]}};
}
export default async function handler(req,res) {
  res.setHeader('Cache-Control','private, no-store, max-age=0');
  res.setHeader('Vercel-CDN-Cache-Control','no-store');
  res.setHeader('X-Robots-Tag','noindex, nofollow, noarchive');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(process.env.MASTER_PLAN_AUTH_MODE==='neon') {
    if(req.method==='POST'&&req.body?.action==='logout')return authHandler(req,res);
    if(req.method!=='GET')return res.status(405).json({error:'Use password sign-in.'});
    try{if(!await ownerSession(req.headers.cookie))return res.status(401).json({error:'Sign in to view your master plan.'});}
    catch{return res.status(503).json({error:'Owner sign-in is temporarily unavailable.'});}
    try{return res.status(200).json(readData());}catch{return res.status(503).json({error:'Private snapshot is unavailable. Refresh the server-side snapshot.'});}
  }
  const keyHash=process.env.MASTER_PLAN_ACCESS_KEY_SHA256;
  if(!/^[a-f0-9]{64}$/.test(keyHash||'') || (process.env.MASTER_PLAN_SESSION_SECRET||'').length<32) return res.status(503).json({error:'Private access is not configured.'});
  if(req.method==='POST') {
    const expectedOrigin=process.env.MASTER_PLAN_ORIGIN || (process.env.VERCEL_URL ? 'https://'+process.env.VERCEL_URL : '');
    // Trust only the explicitly configured deployment origin, never a caller-supplied Host.
    if(!expectedOrigin || req.headers.origin!==expectedOrigin) return res.status(403).json({error:'Request origin rejected.'});
    if(!(req.headers['content-type']||'').startsWith('application/json'))return res.status(415).json({error:'JSON required.'});
    let body=req.body;
    if(typeof body==='string'){if(body.length>4096)return res.status(413).json({error:'Request too large.'});try{body=JSON.parse(body);}catch{return res.status(400).json({error:'Invalid request.'});}}
    if(body?.action==='logout') {
      res.setHeader('Set-Cookie',COOKIE+'=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
      return res.status(200).json({ok:true});
    }
    const key=body?.key;
    if(typeof key!=='string'||key.length>256||!equal(hash(key),keyHash))return res.status(401).json({error:'Access key not recognized.'});
    const token=String(Date.now()+28800000)+'.'+randomBytes(16).toString('hex');
    res.setHeader('Set-Cookie',COOKIE+'='+token+'.'+signature(token)+'; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800');
    return res.status(200).json({ok:true});
  }
  if(req.method!=='GET'){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Method not allowed.'});}
  if(!authorized(req))return res.status(401).json({error:'Sign in to view your master plan.'});
  try{return res.status(200).json(readData());}catch{return res.status(503).json({error:'Private snapshot is unavailable. Refresh the server-side snapshot.'});}
}


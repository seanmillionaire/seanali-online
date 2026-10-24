'use strict';
const $=s=>document.querySelector(s);
let snapshot,feed='all',limit=6;
const date=v=>new Intl.DateTimeFormat('en-US',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Panama'}).format(new Date(v));
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const link=(text,url)=>{const a=el('a',text);try{const u=new URL(url);if(u.protocol!=='https:')return el('span',text);a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';}catch{return el('span',text);}return a;};
function lock(){snapshot=undefined;$('#dashboard').hidden=true;$('#login').hidden=false;for(const id of ['activity','projects','priority-list','sources','social-accounts'])$('#'+id).replaceChildren();$('#key').value='';}
async function request(options){const r=await fetch('/api/master-plan',{credentials:'same-origin',cache:'no-store',...options});const body=await r.json();if(!r.ok){const e=new Error(body.error||'Unable to load the plan.');e.status=r.status;throw e;}return body;}
function post(body){return request({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});}
async function load(){try{snapshot=await request();$('#login').hidden=true;$('#dashboard').hidden=false;$('#snapshot').textContent='Updates checked · '+date(snapshot.capturedAt)+' Panama time';const old=Date.now()-Date.parse(snapshot.capturedAt)>86400000;$('#notice').textContent=old?'These updates were checked more than a day ago. I need a fresh check before treating them as today’s status.':'The date above is when the source updates were checked. Prices, sales and the live customer experience still need their own check. A completed build means the code built successfully; it does not mean someone tested the whole experience.';render();}catch(e){if(e.status===401){lock();}else{lock();$('#login-error').textContent=e.message;}}}
const statusLabel = {TEST:'Test next',HOLD:'On hold',SCALE:'Grow it',FIX:'Fix first',KILL:'Stop'};
function disclosure(title,...content){const d=el('details'),sum=el('summary',title),body=el('div',undefined,'inside');body.append(...content);d.append(sum,body);return d;}
function openProject(id){$('#search').value='';$('#type').value='';$('#status').value='';renderProjects();$('#portfolio').open=true;const card=$('#project-'+id);if(card){card.open=true;card.querySelector('.next-step').open=true;card.scrollIntoView({behavior:'smooth',block:'start'});}}
function renderActivity(){
 const groups=new Map();
 for(const e of [...snapshot.commits.map(x=>({...x,kind:'push'})),...snapshot.builds.map(x=>({...x,kind:'build'}))].sort((a,b)=>b.date.localeCompare(a.date))){if(!groups.has(e.repo))groups.set(e.repo,[]);groups.get(e.repo).push(e);}
 const host=$('#activity');host.replaceChildren();
 for(const [repo,events] of groups){
 const project=snapshot.projects.find(p=>p.repo===repo),latest=events[0];
 const themes=[...new Set(events.map(e=>e.meaning||e.displayTitle||e.title))].slice(0,3);
 const summary=el('div');for(const theme of themes)summary.append(el('p',theme));
 summary.append(el('p','Last update · '+date(latest.date),'small'));
 const build=events.find(e=>e.kind==='build');if(build)summary.append(el('p','Latest saved build: '+build.state+' · '+(build.target==='production'?'Production':'Preview'),'small'));
 const next=el('button','Show my next step');next.addEventListener('click',()=>openProject(project.id));if(project)summary.append(next);
 const proof=disclosure('See the original updates');const body=proof.querySelector('.inside');const seen=new Set();for(const e of events){const key=e.sha+e.kind;if(seen.has(key))continue;seen.add(key);body.append(link((e.kind==='build'?'Build · ':'Code · ')+e.title,e.url));}
 summary.append(proof);const row=disclosure(project?.name||repo,summary);row.className='repo-row';row.querySelector('summary').append(el('span',repo,'repo-name'));host.append(row);
 }
}
function clipPanel(p){
 const c=p.clip,box=el('section',undefined,'clip-panel');
 box.append(el('span','MY CONTENT PLAN','eyebrow'),el('h4','Turn this project into clips'),el('p',c.record));
 const angles=el('ol',undefined,'project-steps');for(const angle of c.angles||[])angles.append(el('li',angle));box.append(angles);
 const brief=['Project: '+p.name,'Pack name: '+c.pack,'Clips: '+c.count,'Channel / creator: '+c.creator,'Area of expertise: '+p.description,'What I record: '+c.record,'Ideas to cover:',...(c.angles||[]).map((x,i)=>(i+1)+'. '+x),'Call to action: '+c.cta,'Review before publishing: captions, cuts, vertical framing, claims, destination and playable export.'].join('\n');
 const label=el('label','My ready-to-copy brief'),field=el('textarea');field.readOnly=true;field.value=brief;field.rows=7;field.id='clip-brief-'+p.id;label.htmlFor=field.id;box.append(label,field);
 const actions=el('div',undefined,'clip-actions'),copy=el('button','Copy my brief'),msg=el('p','', 'small');copy.type='button';msg.setAttribute('role','status');
 copy.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(brief);msg.textContent='Copied. Open Clip Factory and use these notes to fill the matching fields.';}catch{field.focus();field.select();msg.textContent='The brief is selected. Copy it, then open Clip Factory.';}});
 actions.append(copy,link('Open Clip Factory ↗',c.url));box.append(actions,msg);
 if(c.hold)box.append(el('p',c.hold,'small'));
 box.append(el('p','I add the video and fill the fields myself. This link does not send the brief, generate clips or publish anything automatically.','small'));
 return box;
}
function renderProjects(){
 const q=$('#search').value.toLowerCase().trim(),type=$('#type').value,status=$('#status').value;
 const projects=snapshot.projects.filter(p=>(!q||[p.name,p.description,...p.offers.map(o=>o.name)].join(' ').toLowerCase().includes(q))&&(!type||p.type===type)&&(!status||p.status===status));
 $('#project-count').textContent=projects.length+' projects';$('#empty').hidden=projects.length>0;const host=$('#projects');host.replaceChildren();
 for(const p of projects){
 const what=disclosure('1. What is this?',el('p',p.description));
 const next=disclosure('2. What do I do first?',el('p',p.next,'big-action'));next.className='next-step';
 if(p.url)next.querySelector('.inside').append(link('Open '+p.name+' ↗',p.url));
 const steps=el('div');(p.steps||[]).forEach((step,i)=>steps.append(disclosure('Step '+(i+1),el('p',step))));next.querySelector('.inside').append(disclosure('Then what?',steps),disclosure('How do I know I’m done?',el('p',p.done||p.metric)));
 const card=disclosure(p.name,what,next);card.id='project-'+p.id;card.className='project';
 if(p.clip)card.querySelector('.inside').append(disclosure('3. Make social clips',clipPanel(p)));
 const more=el('div');more.append(el('p',p.why),el('p',p.metric));for(const o of p.offers)more.append(link(o.name+' ↗',o.url));more.append(link('Original source ↗',p.source));card.querySelector('.inside').append(disclosure('Links & extra details',more));host.append(card);
 }
}
function render(){renderActivity();renderProjects();const social=$('#social-accounts');social.replaceChildren();for(const account of snapshot.socialAccounts||[]){const body=el('div');for(const channel of account.channels)body.append(el('p',channel));body.append(el('p',account.note));social.append(disclosure(account.brand,body));}const pri=$('#priority-list');pri.replaceChildren();snapshot.priorities.forEach((p,i)=>{const body=el('div');body.append(el('p',p.first||p.detail,'big-action'));const a=el('button','Walk me through it →');a.addEventListener('click',()=>openProject(p.project));body.append(a,disclosure('Why this? What does finished look like?',el('p',p.detail),el('p',p.done)));const row=disclosure(String(i+1)+'. '+p.title,body);row.className='priority';pri.append(row);});const sources=$('#sources');sources.replaceChildren(...snapshot.sources.map(s=>link(s.name+' ↗',s.url)));$('#coverage').textContent='Saved plan: '+snapshot.projects.length+' projects. Open only the one I want to work on. Updates are a snapshot, not a live feed.';}
$('#login-form').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button');b.disabled=true;$('#login-error').textContent='';try{await post({key:$('#key').value});$('#key').value='';await load();}catch(err){$('#login-error').textContent=err.message;}finally{b.disabled=false;}});
$('#logout').addEventListener('click',async()=>{try{await post({action:'logout'});lock();}catch(e){$('#notice').textContent='Unable to clear your server session. Close this browser session to lock access.';}});
$('#reload').addEventListener('click',load);
for(const s of ['#search','#type','#status'])$(s).addEventListener('input',renderProjects);
window.addEventListener('pageshow',e=>{if(e.persisted){lock();load();}});
load();

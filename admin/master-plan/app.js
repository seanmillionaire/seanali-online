'use strict';
const $=s=>document.querySelector(s);
let snapshot,feed='all',limit=6;
const date=v=>new Intl.DateTimeFormat('en-US',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Panama'}).format(new Date(v));
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const link=(text,url)=>{const a=el('a',text);try{const u=new URL(url);if(u.protocol!=='https:')return el('span',text);a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';}catch{return el('span',text);}return a;};
function lock(){if(document.querySelector('#tool-frame')){document.querySelector('#tool-frame').src='about:blank';document.querySelector('#tool-workspace').hidden=true;}snapshot=undefined;$('#dashboard').hidden=true;$('#login').hidden=false;for(const id of ['activity','projects','priority-list','sources','social-accounts'])$('#'+id).replaceChildren();$('#key').value='';}
async function request(options){const r=await fetch('/api/master-plan',{credentials:'same-origin',cache:'no-store',...options});const body=await r.json();if(!r.ok){const e=new Error(body.error||'Unable to load the plan.');e.status=r.status;throw e;}return body;}
function post(body){return request({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});}
async function load(){try{snapshot=await request();$('#login').hidden=true;$('#dashboard').hidden=false;$('#snapshot').textContent='Updates checked · '+date(snapshot.capturedAt)+' Panama time';const old=Date.now()-Date.parse(snapshot.capturedAt)>86400000;$('#notice').textContent=old?'These updates were checked more than a day ago. I need a fresh check before treating them as today’s status.':'The date above is when the source updates were checked. Prices, sales and the live customer experience still need their own check. A completed build means the code built successfully; it does not mean someone tested the whole experience.';render();}catch(e){if(e.status===401){lock();}else{lock();$('#login-error').textContent=e.message;}}}
const statusLabel = {TEST:'Test next',HOLD:'On hold',SCALE:'Grow it',FIX:'Fix first',KILL:'Stop'};
function disclosure(title,...content){const d=el('details'),sum=el('summary',title),body=el('div',undefined,'inside');body.append(...content);d.append(sum,body);return d;}
function openProject(id){$('#reference-plan').open=true;$('#search').value='';$('#type').value='';$('#status').value='';renderProjects();$('#portfolio').open=true;const card=$('#project-'+id);if(card){card.open=true;card.querySelector('.next-step').open=true;card.scrollIntoView({behavior:'smooth',block:'start'});}}
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
function render(){renderActivity();renderProjects();renderWorkspace();const social=$('#social-accounts');social.replaceChildren();for(const account of snapshot.socialAccounts||[]){const body=el('div');for(const channel of account.channels)body.append(el('p',channel));body.append(el('p',account.note));social.append(disclosure(account.brand,body));}const pri=$('#priority-list');pri.replaceChildren();snapshot.priorities.forEach((p,i)=>{const body=el('div');body.append(el('p',p.first||p.detail,'big-action'));const a=el('button','Walk me through it →');a.addEventListener('click',()=>openProject(p.project));body.append(a,disclosure('Why this? What does finished look like?',el('p',p.detail),el('p',p.done)));const row=disclosure(String(i+1)+'. '+p.title,body);row.className='priority';pri.append(row);});const sources=$('#sources');sources.replaceChildren(...snapshot.sources.map(s=>link(s.name+' ↗',s.url)));$('#coverage').textContent='Saved plan: '+snapshot.projects.length+' projects. Open only the one I want to work on. Updates are a snapshot, not a live feed.';}
$('#login-form').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button');b.disabled=true;$('#login-error').textContent='';try{await post({key:$('#key').value});$('#key').value='';await load();}catch(err){$('#login-error').textContent=err.message;}finally{b.disabled=false;}});
$('#logout').addEventListener('click',async()=>{try{await post({action:'logout'});lock();}catch(e){$('#notice').textContent='Unable to clear your server session. Close this browser session to lock access.';}});
$('#reload').addEventListener('click',load);
for(const s of ['#search','#type','#status'])$(s).addEventListener('input',renderProjects);
window.addEventListener('pageshow',e=>{if(e.persisted){lock();load();}});
const WORK_KEY='sean-private-workspace-v1';
let workspace={active:'',jobs:{}},activeTool;
try{const saved=JSON.parse(localStorage.getItem(WORK_KEY)||'null');if(saved&&typeof saved.jobs==='object'&&saved.jobs&&!Array.isArray(saved.jobs))workspace=saved;}catch{}
const stepNames=['Choose','Write','Create','Review','Publish','Learn'];
function currentJob(){return workspace.jobs[workspace.active];}
function saveWork(){try{localStorage.setItem(WORK_KEY,JSON.stringify(workspace));$('#day-save-status').textContent='Saved in this browser · '+date(new Date().toISOString())+'. Export for a backup.';}catch{$('#day-save-status').textContent='Browser storage is unavailable. Export my work before leaving.';}}
function syncFields(){const j=currentJob();if(!j)return;j.outcome=$('#day-outcome').value;j.draft=$('#day-draft').value;j.link=$('#day-link').value;j.notes=$('#day-notes').value;j.updatedAt=new Date().toISOString();saveWork();}
// Six real brands, not every repository or product in the reference snapshot.
const brands=[
 {id:'hm',name:'Hypnotic Meditations',aliases:['hm','hypnoticmeditations'],factories:['hm-shorts','hm-audio']},
 {id:'genie',name:'Manifestation Genie',aliases:['reborn-refined','manifestation-genie-app-v1','manifestationgenie'],factories:['clips']},
 {id:'panama',name:'Panama Untold',aliases:['panamauntold'],factories:['clips']},
 {id:'sean',name:'Sean Ali',aliases:['seanali-online','seanali'],factories:['clips']},
 {id:'angelique',name:'Angelique Ali',aliases:['angeliqueali-website','angeliqueali'],factories:['angelique-factory']},
 {id:'swap',name:'Swap Your9to5',aliases:['swapyour9to5'],factories:['clips']}
];
const normalize=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9-]/g,'');
const matches=(p,b)=>[p.id,p.repo?.split('/').pop(),p.name].some(v=>b.aliases.includes(normalize(v)));
const brandFor=p=>brands.find(b=>p&&matches(p,b));
const factoryTools={
 'clips':{id:'clips',name:'Clip my recording',url:'https://sean-ali-clip-factory.darkrain20.chatgpt.site/',description:'Existing Sean Ali Expert Clip Factory. Add this project’s recording; set its creator, topic and CTA before exporting MP4, captions and SEO.',embedded:true,remote:true},
 'angelique-factory':{id:'angelique-factory',name:'Make Angelique clips',url:'https://angelique-panama-video-pack.darkrain20.chatgpt.site/factory',description:'Add an Angelique video. Choose clips, check Spanish or English captions, then download MP4, SRT and SEO.',embedded:true,remote:true},
 'hm-shorts':{id:'hm-shorts',name:'Create meditation shorts',url:'https://hypnotic-meditations-shorts-producer.darkrain20.chatgpt.site/',description:'Choose a theme and voice. Review raw narration before rendering your shorts and publishing pack.',embedded:true,remote:true},
 'hm-audio':{id:'hm-audio',name:'Assemble meditation audio',url:'https://hm-audio-meditation-factory.darkrain20.chatgpt.site/',description:'Bring existing narration, music and ambience. Listen to the finished mix, then export WAV and QA notes. This tool does not generate a voice.',embedded:true,remote:true}
};
const resolvedTool=id=>factoryTools[id]||snapshot.tools?.find(t=>t.id===id);
function renderWorkspace(){
 const select=$('#day-project');select.replaceChildren();
 for(const b of brands){const candidates=snapshot.projects.filter(p=>matches(p,b));const saved=candidates.find(p=>p.id===workspace.active)||candidates.find(p=>workspace.jobs[p.id])||candidates[0];const option=el('option',b.name);option.value=saved?.id||'missing:'+b.id;option.disabled=!saved;select.append(option);}
 if(!brandFor(snapshot.projects.find(p=>p.id===workspace.active)))workspace.active=[...select.options].find(o=>!o.disabled)?.value||'';
 select.value=workspace.active;$('#creative-idea').value=workspace.idea||'';selectProject(workspace.active,false);renderProjectChips();
 const list=$('#tool-list');list.replaceChildren();
 for(const id of ['organic','ideas','images','metricool']){const t=resolvedTool(id);if(t?.url){const box=disclosure(t.name,el('p',t.description));box.querySelector('.inside').append(toolButton(id));list.append(box);}}
}
function renderProjectChips(){
 const host=$('#project-chips');host.replaceChildren();
 for(const option of $('#day-project').options){const b=el('button',option.textContent,'project-chip');b.type='button';b.disabled=option.disabled;b.setAttribute('aria-pressed',String(workspace.focusProject===option.value));b.addEventListener('click',()=>{syncFields();workspace.focusProject=option.value;selectProject(option.value);$('#day-project').value=option.value;renderProjectChips();});host.append(b);}
}
$('#creative-idea').addEventListener('input',()=>{workspace.idea=$('#creative-idea').value;saveWork();});
$('#clear-project').addEventListener('click',()=>{workspace.focusProject='';saveWork();renderStep();renderProjectChips();});
function selectProject(id,persist=true){
 workspace.active=id;const p=snapshot.projects.find(p=>p.id===id);if(!p){$('#workbench').hidden=true;return;}
 if(!currentJob())workspace.jobs[id]={step:0,draft:'',notes:'',link:'',topic:'',review:{}};
 const j=currentJob();$('#day-outcome').value=j.outcome||'';$('#day-draft').value=j.draft||'';$('#day-link').value=j.link||'';$('#day-notes').value=j.notes||'';renderStep();if(persist)saveWork();
}
function toolButton(id){const t=resolvedTool(id);const b=el('button',t?'Open '+t.name:'Tool not available');b.type='button';b.disabled=!t?.url;b.addEventListener('click',()=>openTool(id));return b;}
function openTool(id){const t=resolvedTool(id);if(!t?.url)return;syncFields();if(!t.embedded){location.assign(t.url);return;}
 activeTool=t;$('#tool-note').parentElement.querySelector('#tool-fullscreen')?.remove();if(t.remote){const full=el('button','Open full screen / sign in');full.id='tool-fullscreen';full.addEventListener('click',()=>{syncFields();location.assign(t.url);});$('#tool-note').after(full);}$('#tool-title').textContent=t.name;$('#tool-note').textContent=t.description;$('#tool-workspace').hidden=false;$('#capture-status').textContent=t.remote?'Download my finished asset before closing this tool. Then save its file link in my notes.':'Use “Save output to my dashboard” inside the tool to bring its draft back here.';$('#tool-frame').src=t.remote?t.url:t.url+'?dashboard=1';$('#tool-workspace').scrollIntoView({behavior:'smooth'});
}
function closeTool(){$('#tool-frame').src='about:blank';$('#tool-workspace').hidden=true;activeTool=null;$('#workbench').scrollIntoView({behavior:'smooth'});}
function renderStep(){
 const j=currentJob(),p=snapshot.projects.find(p=>p.id===workspace.active),brand=brandFor(p);if(!j||!brand)return;
 $('#workbench').hidden=false;$('#work-project').textContent=brand.name;$('#work-title').textContent='Open a studio';$('#work-goal').textContent=workspace.focusProject?'A few tools for '+brand.name+'. Switch projects or show all whenever you like.':'Jump into any tool. There is no required order.';$('#work-project').textContent=workspace.focusProject?brand.name:'EXPLORE';
 $('#work-steps').replaceChildren();$('#work-steps').hidden=true;$('#step-back').hidden=true;$('#step-next').hidden=true;
 const body=$('#work-step-body');body.replaceChildren();const actions=el('div',undefined,'factory-actions');
 for(const id of (workspace.focusProject?brand.factories:Object.keys(factoryTools))){const t=resolvedTool(id),card=el('section',undefined,'factory-card');card.append(toolButton(id),el('p',t.description));actions.append(card);}
 body.append(actions);
 if(workspace.focusProject&&!['hm','sean','angelique'].includes(brand.id))body.append(el('p','Uses your existing Expert Clip Factory — not a separate '+brand.name+' factory. Enter '+brand.name+' as the creator and check the offer link in the export.','small'));
 body.append(el('p','Files process in the factory tab. Download the finished pack before closing it. Your project notes stay here.','small'));
 const review=disclosure('Before sharing · review & keep my files',el('p','Watch or listen to the entire final export. A rendered file is not automatically ready for social.'));
 for(const [key,text] of [['truth','The full export plays correctly; voice, cuts and captions are clear.'],['link','The offer, claims and link match this project.'],['brand','The correct brand and channels are selected.']]){const lab=el('label',undefined,'review-check'),input=el('input');input.type='checkbox';input.checked=!!j.review?.[key];input.addEventListener('change',()=>{j.review={...j.review,[key]:input.checked};saveWork();});lab.append(input,el('span',text));review.querySelector('.inside').append(lab);}
 const metricool=resolvedTool('metricool');if(metricool?.url)review.querySelector('.inside').append(toolButton('metricool'));review.querySelector('.inside').append(el('p','Nothing is posted automatically. Save the downloaded-file or published-post link in your notes below.','small'));body.append(review);
 if(workspace.focusProject&&p.clip)body.append(disclosure('Need a recording brief?',clipPanel(p)));
}
$('#day-project').addEventListener('change',e=>{syncFields();closeTool();selectProject(e.target.value);});
$('#start-day').addEventListener('click',()=>{const id=$('#day-project').value;workspace.active=id;if(!currentJob())workspace.jobs[id]={step:0,draft:'',notes:'',link:'',topic:'',review:{}};syncFields();renderStep();$('#workbench').scrollIntoView({behavior:'smooth'});});
for(const id of ['day-outcome','day-draft','day-link','day-notes'])$('#'+id).addEventListener('input',syncFields);
$('#step-next').addEventListener('click',()=>{syncFields();const j=currentJob();if(j.step===3&&!['truth','link','brand'].every(k=>j.review?.[k]))return;j.step=Math.min(5,j.step+1);saveWork();renderStep();});
$('#step-back').addEventListener('click',()=>{syncFields();currentJob().step=Math.max(0,currentJob().step-1);saveWork();renderStep();});
$('#close-tool').addEventListener('click',closeTool);
$('#export-day').addEventListener('click',()=>{syncFields();const p=snapshot.projects.find(p=>p.id===workspace.active),j=currentJob();const blob=new Blob([JSON.stringify({idea:workspace.idea||'',project:p.name,...j},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='my-work-'+p.id+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
window.addEventListener('message',event=>{const frame=$('#tool-frame');if(event.origin!==location.origin||event.source!==frame.contentWindow||!activeTool||!snapshot)return;const message=event.data;if(!message||typeof message!=='object')return;if(message.type==='sean-tool-ready'){const p=snapshot.projects.find(p=>p.id===workspace.active),j=currentJob();frame.contentWindow.postMessage({type:'sean-work-context',project:p?.name,projectId:p?.id,topic:j?.topic||'',outcome:j?.outcome||''},location.origin);}if(message.type==='sean-save-output'&&typeof message.text==='string'){const j=currentJob();if(!j){$('#capture-status').textContent='Start a project above before saving an output.';return;}const addition=message.text.slice(0,60000);j.draft=(j.draft?j.draft+'\n\n--- '+activeTool.name+' ---\n\n':'')+addition;j.draft=j.draft.slice(-60000);$('#day-draft').value=j.draft;saveWork();$('#capture-status').textContent='Saved to my project draft. Return to my creative space whenever you like.';}});

load();


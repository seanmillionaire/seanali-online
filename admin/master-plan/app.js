'use strict';
const $=s=>document.querySelector(s);
let snapshot,feed='all',limit=6;
const date=v=>new Intl.DateTimeFormat('en-US',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Panama'}).format(new Date(v));
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
const link=(text,url)=>{const a=el('a',text);try{const u=new URL(url);if(u.protocol!=='https:')return el('span',text);a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';}catch{return el('span',text);}return a;};
function lock(){stopWorldRotation();const soundtrack=document.querySelector('#office-soundtrack');soundtrack?.querySelector('audio')?.pause();soundtrack?.remove();document.querySelector('#production-review')?.remove();document.querySelector('#daily-email')?.remove();snapshot=undefined;$('#dashboard').hidden=true;$('#login').hidden=false;for(const id of ['activity','projects','priority-list','sources','social-accounts','company-wall','factory-wall','company-jumps'])$('#'+id).replaceChildren();for(const id of ['key','owner-code','owner-new-password','owner-confirm-password','current-password','change-password','change-confirm'])$('#'+id).value='';}
async function readResponse(r){try{return await r.json();}catch{const e=new Error('The office sign-in service is temporarily unavailable. Please try again shortly.');e.status=r.status;throw e;}}
async function request(options){const r=await fetch('/api/master-plan',{credentials:'same-origin',cache:'no-store',...options});const body=await readResponse(r);if(!r.ok){const e=new Error(body.error||'Unable to load the plan.');e.status=r.status;throw e;}return body;}
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
function render(){renderSoundtrack();renderProductionReview();renderDailyEmail();renderActivity();renderProjects();renderWorkspace();const social=$('#social-accounts');social.replaceChildren();for(const account of snapshot.socialAccounts||[]){const body=el('div');for(const channel of account.channels)body.append(el('p',channel));body.append(el('p',account.note));social.append(disclosure(account.brand,body));}const pri=$('#priority-list');pri.replaceChildren();snapshot.priorities.forEach((p,i)=>{const body=el('div');body.append(el('p',p.first||p.detail,'big-action'));const a=el('button','Walk me through it →');a.addEventListener('click',()=>openProject(p.project));body.append(a,disclosure('Why this? What does finished look like?',el('p',p.detail),el('p',p.done)));const row=disclosure(String(i+1)+'. '+p.title,body);row.className='priority';pri.append(row);});const sources=$('#sources');sources.replaceChildren(...snapshot.sources.map(s=>link(s.name+' ↗',s.url)));$('#coverage').textContent='Saved plan: '+snapshot.projects.length+' projects. Open only the one I want to work on. Updates are a snapshot, not a live feed.';}
$('#login-form').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button');b.disabled=true;$('#login-error').textContent='';try{await passwordAction({action:'login',password:$('#key').value});$('#key').value='';await load();}catch(err){$('#login-error').textContent=err.message;}finally{b.disabled=false;}});
async function passwordAction(body){const r=await fetch('/api/master-plan-auth',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const value=await readResponse(r);if(!r.ok)throw Error(value.error||'Unable to update sign-in.');return value;}
$('#send-owner-code').addEventListener('click',async()=>{const button=$('#send-owner-code');button.disabled=true;$('#owner-setup-status').textContent='Sending your code…';try{await passwordAction({action:'send-code'});$('#password-setup-form').hidden=false;$('#owner-setup-status').textContent='Check your owner email for the code, then choose your password here.';}catch(e){$('#owner-setup-status').textContent=e.message;}finally{button.disabled=false;}});
$('#password-setup-form').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button');if($('#owner-new-password').value!==$('#owner-confirm-password').value){$('#owner-setup-status').textContent='The passwords do not match.';return;}b.disabled=true;try{await passwordAction({action:'set-password',otp:$('#owner-code').value.trim(),password:$('#owner-new-password').value});for(const id of ['owner-code','owner-new-password','owner-confirm-password'])$('#'+id).value='';$('#password-setup-form').hidden=true;$('#owner-setup-status').textContent='Password saved. Opening your office…';await load();}catch(e){$('#owner-setup-status').textContent=e.message;}finally{b.disabled=false;}});
$('#password-change-form').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button');if($('#change-password').value!==$('#change-confirm').value){$('#change-status').textContent='The passwords do not match.';return;}b.disabled=true;try{await passwordAction({action:'change-password',currentPassword:$('#current-password').value,newPassword:$('#change-password').value});for(const id of ['current-password','change-password','change-confirm'])$('#'+id).value='';$('#change-status').textContent='Password updated. Other sign-in sessions were revoked.';}catch(e){$('#change-status').textContent=e.message;}finally{b.disabled=false;}});
$('#logout').addEventListener('click',async()=>{try{await post({action:'logout'});lock();}catch(e){$('#notice').textContent='Unable to clear your server session. Close this browser session to lock access.';}});
$('#reload').addEventListener('click',load);
for(const s of ['#search','#type','#status'])$(s).addEventListener('input',renderProjects);
window.addEventListener('pageshow',e=>{if(e.persisted){lock();load();}});
const WORK_KEY='sean-private-workspace-v1';
let workspace={active:'',jobs:{}};
try{const saved=JSON.parse(localStorage.getItem(WORK_KEY)||'null');if(saved&&typeof saved.jobs==='object'&&saved.jobs&&!Array.isArray(saved.jobs))workspace=saved;}catch{}
const stepNames=['Choose','Write','Create','Review','Publish','Learn'];
function currentJob(){return workspace.jobs[workspace.active];}
function saveWork(){try{localStorage.setItem(WORK_KEY,JSON.stringify(workspace));$('#day-save-status').textContent='Saved in this browser · '+date(new Date().toISOString())+'.';}catch{$('#day-save-status').textContent='Not saved — browser storage is unavailable. Copy your notes before leaving.';}}
function syncFields(){const j=currentJob();if(!j)return;j.outcome=$('#day-outcome').value;j.draft=$('#day-draft').value;j.link=$('#day-link').value;j.notes=$('#day-notes').value;j.updatedAt=new Date().toISOString();saveWork();}
// Six real brands, not every repository or product in the reference snapshot.
const brands=[
 {id:'hm',name:'Hypnotic Meditations',aliases:['hm','hypnoticmeditations'],factories:['hm-shorts','hm-audio']},
 {id:'genie',name:'Manifestation Genie',aliases:['reborn-refined','manifestation-genie-app-v1','manifestationgenie'],factories:['genie-shorts']},
 {id:'panama',name:'Panama Untold',aliases:['panamauntold'],factories:['panama-documentary']},
 {id:'sean',name:'Sean Ali',aliases:['seanali-online','seanali'],factories:['clips']},
 {id:'angelique',name:'Angelique Ali',aliases:['angeliqueali-website','angeliqueali'],factories:['angelique-factory']},
 {id:'swap',name:'Swap Your9to5',aliases:['swapyour9to5'],factories:['clips']}
];
const normalize=v=>String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9-]/g,'');
const matches=(p,b)=>[p.id,p.repo?.split('/').pop(),p.name].some(v=>b.aliases.includes(normalize(v)));
const brandFor=p=>brands.find(b=>p&&matches(p,b));
const factoryTools={
 'genie-shorts':{id:'genie-shorts',name:'Manifestation Genie Shorts',url:'https://manifestation-genie-shorts-factory.darkrain20.chatgpt.site/',description:'Choose an authored theme, edit the script, generate local voice and timing, then review and export a 30-second illustrated short. First use downloads the voice model and video engine. Keep this tab open.',remote:true},
 'panama-documentary':{id:'panama-documentary',name:'Panama Untold Shorts & Documentaries',url:'https://panama-untold-documentary-factory.darkrain20.chatgpt.site/',description:'Open your Panama Untold shorts and documentary studio. ChatGPT sign-in may be required in its own tab. Review the finished video before sharing.',remote:true},
 'clips':{id:'clips',name:'Clip my recording',url:'https://sean-ali-clip-factory.darkrain20.chatgpt.site/',description:'Upload your recording, choose UGC, Gold or Smoke, and use your own saved footage. Add an optional custom batch title; script icons follow conservative timed phrases and can be switched off. Original speech stays unchanged. Export clips, SEO and tracker.',remote:true},
 'angelique-factory':{id:'angelique-factory',name:'Make Angelique clips',url:'https://angelique-panama-video-pack.darkrain20.chatgpt.site/',description:'Add an Angelique video. Keep the natural voice pace and check Spanish or English captions. Optional video-only zoom/lightning starts off. Export MP4, SRT, SEO and a batch tracker.',remote:true},
 'hm-shorts':{id:'hm-shorts',name:'Create meditation shorts',url:'https://hypnotic-meditations-shorts-producer.darkrain20.chatgpt.site/',description:'Create guided shorts up to 45 seconds, edit each on-screen title, and optionally blend up to five of your own videos (250 MB total). Review the voice-only hook and quiet meditation transition. Export shorts, raw narration, metadata and tracker.',remote:true},
 'hm-audio':{id:'hm-audio',name:'Make a 60-second meditation',url:'https://hm-audio-meditation-factory.darkrain20.chatgpt.site/',description:'Choose a topic and generate a complete 60-second meditation locally. Listen before unlocking WAV downloads. Own-narration assembly is still available. Export script, metadata and tracker.',remote:true}
};
factoryTools['meta-ads']={id:'meta-ads',name:'AI Meta Ad Factory · Creative Factory',url:new URL('/api/creative-factory?action=app',location.href).href,description:'Photo-ad studio: import your photo or saved scene, edit text and export placements. New AI photo generation is not available.',remote:true};
// The ad studio is a single global capability, never repeated inside worlds.
const pendingStudios=[];
function studioCard(id){const t=factoryTools[id]||pendingStudios.find(x=>x.id===id),card=el('article',undefined,'studio-card');card.setAttribute('data-studio-id',id);if(t?.url){card.append(previewImage(id,t.name));const actions=el('div',undefined,'studio-open-actions'),tab=toolButton(id);tab.className='studio-new-tab';actions.append(tab);card.append(actions);if(['hm-audio','panama-documentary'].includes(id))card.append(el('p','Available hosted studio · ChatGPT sign-in / owner consent may be required.','studio-state'));}else{card.className+=' studio-pending';card.append(el('span',t.status,'studio-state'),el('h3',t.name),el('p',t.description,'studio-blocker'));if(t.source)card.append(link('Source code on GitHub ↗',t.source));}return card;}
// Curated starting ideas, not generated recommendations or scheduled obligations.
const studioDirections={
 hm:[{title:'Make a calming short',tool:'hm-shorts',brief:'Make one guided short (45 seconds or less) around one everyday moment of overwhelm. Start with a clear voice-only hook, then transition into a quiet meditation. Avoid medical promises.'},{title:'Make a one-minute reset',tool:'hm-audio',brief:'Create a complete 60-second meditation around grounding and slowing down. Keep the invitation gentle. Listen to the entire WAV before sharing.'},{title:'A new Meta ad angle',brief:'Plan one fresh meditation-offer ad: one specific everyday problem, one honest benefit, and a reply or destination that matches the verified offer. Review earlier winning ads; no invented guarantees. This is an editable brief, not a launched ad.'}],
 genie:[{title:'Clip a manifestation moment',tool:'clips',brief:'Clip an existing recording around one grounded manifestation practice. Keep the original speech, a strong opening, and the Manifestation Genie identity. Use only footage you own.'},{title:'A new Meta ad angle',brief:'Plan a simple creator-photo or existing-footage ad for the current Manifestation Genie offer. Match the overlay, copy and landing page to the actual offer. Review claims before production; no promised financial outcomes.'},{title:'A longer YouTube idea',brief:'Outline a YouTube story about a manifestation practice: lived problem, personal experiment, useful lesson and grounded next step. Long-form editing is not installed here; this brief is for recording and later production.'}],
 panama:[{title:'Make a destination short',tool:'clips',brief:'Clip owned Panama footage around one destination and one genuinely useful detail. Keep local voices and natural moments. Verify place names and any practical travel advice.'},{title:'A YouTube story',brief:'Outline a Panama Untold destination story: arrival, an unexpected local detail, people and places, and what a visitor should know. Use real footage. This is a recording brief; the short-clip tool is not a long-form editor.'},{title:'A new place to explore',brief:'Choose one Panama destination or local story worth covering next. Note what to film, who could contribute, and what facts need checking. Save source and website links here.'}],
 sean:[{title:'Clip an insight',tool:'clips',brief:'Choose an existing Sean recording with one lived lesson. Speak to the younger version of Sean: the mistake, what changed, and one next move. Preserve original speech and use owned footage.'},{title:'A longer YouTube story',brief:'Outline one personal story for YouTube: the moment I got it wrong, what it cost, what I learned, and what I would tell my younger self. No invented autobiography. Long-form production is a separate step.'},{title:'A new Meta ad angle',brief:'Plan one simple, mobile-first ad using Sean’s real photo or existing footage and CapCut-style text. Match the overlay to the verified offer. Keep it credible and unpolished, not a new generic template.'}],
 angelique:[{title:'Clip a gameplay moment',tool:'angelique-factory',brief:'Pick an Angelique gameplay moment with a clear beginning and payoff. Keep her natural voice pace, check bilingual captions, and avoid covering existing baked-in captions. Watch the finished clip before sharing.'},{title:'Make a day-in-my-world short',tool:'angelique-factory',brief:'Use an existing Angelique video for a short about something she explored, learned or enjoyed—not only games. Preserve the natural voice and personality. Check every caption and the final vertical framing.'},{title:'A longer adventure idea',brief:'Outline a longer Angelique adventure: what we are exploring, a small discovery, a challenge and a genuine ending. This is a filming idea, not an automatic long-form export.'}],
 swap:[{title:'Make one practical short',tool:'clips',brief:'Clip an owned recording about one practical step toward building an independent business. Keep the original voice, make the advice concrete, and avoid income guarantees. Use the Swap Your 9 to 5 identity.'},{title:'A YouTube walkthrough',brief:'Outline a clear walkthrough of one useful business skill: starting point, demonstration, common mistake and next action. Verify all examples. Long-form editing is not installed here.'},{title:'A new Meta ad angle',brief:'Plan one honest ad for a verified Swap Your 9 to 5 offer: audience problem, specific skill or resource, and matching next step. No earnings promises or unverified testimonials. This saves a brief only.'}]
};
const companySites={angelique:'https://angeliqueali.com',hm:'https://hypnoticmeditations.ai',genie:'https://manifestationgenie.ai',panama:'https://panamauntold.com',sean:'https://seanali.online',swap:'https://swapyour9to5.com'};
function previewImage(id,label){const wrap=el('div',undefined,'preview-window');if(['hm-audio','genie-shorts','panama-documentary','meta-ads'].includes(id)){wrap.append(el('p',id==='hm-audio'?'Private audio studio · sign in to see this workspace':'Open the live studio below to see its current workspace','preview-unavailable'));return wrap;}const img=el('img');img.src='/admin/master-plan/previews/'+id+'.jpg';img.alt=label+' — actual website preview';img.loading='lazy';img.width=1200;img.height=750;const unavailable=el('p','Visual preview not available yet. Open the actual site or studio below.','preview-unavailable');unavailable.hidden=true;img.addEventListener('error',()=>{img.hidden=true;unavailable.hidden=false;});wrap.append(img,unavailable);return wrap;}
function projectForBrand(b){const choices=snapshot.projects.filter(p=>matches(p,b));return choices.find(p=>p.id===workspace.active)||choices.find(p=>workspace.jobs[p.id])||choices[0];}
function startDirection(brandId,index){const b=brands.find(x=>x.id===brandId),p=b&&projectForBrand(b),d=studioDirections[brandId]?.[index];if(!p||!d?.tool)return;syncFields();workspace.focusProject=p.id;selectProject(p.id);$('#day-project').value=p.id;workspace.visualBrand=brandId;saveWork();openTool(d.tool);}
const worldMood={
 hm:'Make space for a calmer, clearer day.',genie:'Turn a wish into a meaningful next step.',panama:'Share the places and people worth discovering.',sean:'Share something you wish you knew sooner.',angelique:'Let curiosity lead the adventure.',swap:'Help someone take their next independent step.'
};
const worldRotation={index:0,paused:false,hovered:false,focused:false,editing:false,timer:null};
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function stopWorldRotation(){clearInterval(worldRotation.timer);worldRotation.timer=null;}
function updateWorldRotation(){
 stopWorldRotation();
 const motion=$('#world-motion');motion.textContent=reducedMotion.matches?'Rotation off':worldRotation.paused?'Resume rotation':'Pause rotation';motion.disabled=reducedMotion.matches;motion.setAttribute('aria-pressed',String(worldRotation.paused||reducedMotion.matches));
 if(reducedMotion.matches||worldRotation.paused||worldRotation.hovered||worldRotation.focused||worldRotation.editing||document.hidden||$('#dashboard').hidden)return;
 worldRotation.timer=setInterval(()=>showWorld(worldRotation.index+1),7000);
}
function showWorld(index,manual=false){
 worldRotation.index=(index+brands.length)%brands.length;
 if(manual){worldRotation.paused=true;$('#world-announcement').textContent=brands[worldRotation.index].name;}
 for(const [i,b] of brands.entries()){$('#company-card-'+b.id).hidden=i!==worldRotation.index;const button=$('#world-jump-'+b.id);button.setAttribute('aria-pressed',String(i===worldRotation.index));}
 $('#world-position').textContent=(worldRotation.index+1)+' / '+brands.length;
 updateWorldRotation();
}
function renderVisualHome(){
 const wall=$('#company-wall'),jumps=$('#company-jumps');wall.replaceChildren();jumps.replaceChildren();
 const selected=brands.find(b=>b.id===workspace.visualBrand)||brandFor(snapshot.projects.find(p=>p.id===workspace.active))||brands[0];worldRotation.index=brands.indexOf(selected);
 for(const [i,b] of brands.entries()){
  const card=el('article',undefined,'company-card');card.id='company-card-'+b.id;card.setAttribute('role','group');card.setAttribute('aria-roledescription','slide');card.setAttribute('aria-label',(i+1)+' of '+brands.length+' · '+b.name);
  const preview=previewImage(b.id,b.name);preview.title='Saved website preview · 25 Oct 2026';card.append(preview);
  const body=el('div',undefined,'company-body');body.append(el('span','A WORLD OF POSSIBILITY','eyebrow'),el('h3',b.name),el('p',worldMood[b.id],'world-mood'));
  const visit=link('Explore the website ↗',companySites[b.id]);visit.className='world-site';body.append(visit);
  const directions=el('div',undefined,'direction-list');for(const id of b.factories){const t=factoryTools[id],row=el('div',undefined,'world-studio');row.append(el('h4',t.name));const tab=toolButton(id);tab.textContent='Open studio ↗';row.append(tab);directions.append(row);}body.append(directions);card.append(body);wall.append(card);
  const jump=el('button',b.name);jump.id='world-jump-'+b.id;jump.type='button';jump.setAttribute('aria-controls',card.id);jump.addEventListener('click',()=>showWorld(i,true));jumps.append(jump);
 }
 showWorld(worldRotation.index);
 renderCapabilities();
}
function capabilityCard(title,description,icon,action){
 const card=el('article',undefined,'capability-card'),mark=el('span',icon,'capability-icon');mark.setAttribute('aria-hidden','true');card.append(mark,el('h3',title),el('p',description));action.classList.add('capability-action');card.append(action);return card;
}
function panelAction(label,id){const button=el('button',label,'quiet');button.type='button';button.setAttribute('aria-controls',id);button.addEventListener('click',()=>{const panel=$('#'+id);panel.open=true;panel.querySelector('summary').focus();panel.scrollIntoView({behavior:reducedMotion.matches?'instant':'smooth',block:'start'});});return button;}
function renderCapabilities(){
 const grid=$('#factory-wall');grid.replaceChildren();
 const labels={
 'clips':['Clip my recording','Turn an existing recording into short clips.','✂'],
 'angelique-factory':['Make Angelique clips','Keep her voice and personality in every clip.','☀'],
 'hm-shorts':['Create meditation shorts','Make a short moment of calm to share.','◒'],
 'hm-audio':['Create a meditation','Make and review a 60-second guided audio.','♫'],
 'genie-shorts':['Create Genie shorts','Bring a manifestation practice to the screen.','✧'],
 'panama-documentary':['Tell a Panama story','Open the shorts and documentary studio.','↗'],
 'meta-ads':['AI Meta Ad Factory','Design photo ads with your images and text. New AI image generation is unavailable.','▧']
 };
 for(const [id,t] of Object.entries(factoryTools)){const [title,description,icon]=labels[id],action=toolButton(id);action.textContent='Open studio ↗';grid.append(capabilityCard(title,description,icon,action));}
 const toolNames={organic:['Write a script','Shape scripts and captions in Content Station.','✎'],ideas:['Shape an idea','Turn a rough thought into a campaign brief.','✧'],images:['Design an image','Open the canvas and image-prompt builder.','▧'],metricool:['Plan your posts','Review and schedule in Metricool.','↗']};
 for(const id of ['organic','ideas','images','metricool']){const t=resolvedTool(id);if(t?.url){const [title,description,icon]=toolNames[id],action=toolButton(id);action.textContent='Open tool ↗';grid.append(capabilityCard(title,description,icon,action));}}
 grid.append(capabilityCard('Review prepared work','Open your existing production deliveries and review notes.','✓',panelAction('Open my deliveries ↓','production-review')),capabilityCard('Set the mood','Choose a soundtrack from your Suno music.','♫',panelAction('Choose a song ↓','office-soundtrack')));
}
$('#world-prev').addEventListener('click',()=>showWorld(worldRotation.index-1,true));
$('#world-next').addEventListener('click',()=>showWorld(worldRotation.index+1,true));
$('#world-motion').addEventListener('click',()=>{worldRotation.paused=!worldRotation.paused;updateWorldRotation();});
$('#visual-home').addEventListener('mouseenter',()=>{worldRotation.hovered=true;updateWorldRotation();});
$('#visual-home').addEventListener('mouseleave',()=>{worldRotation.hovered=false;updateWorldRotation();});
$('#visual-home').addEventListener('focusin',()=>{worldRotation.focused=true;updateWorldRotation();});
$('#visual-home').addEventListener('focusout',e=>{worldRotation.focused=$('#visual-home').contains(e.relatedTarget);updateWorldRotation();});
$('#visual-home').addEventListener('keydown',e=>{if(e.target.tagName==='SELECT')return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showWorld(worldRotation.index+(e.key==='ArrowRight'?1:-1),true);}});
let worldTouch=null,worldSwiped=false;
$('#company-wall').addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;worldSwiped=false;worldTouch={x:e.clientX,y:e.clientY};worldRotation.paused=true;updateWorldRotation();},{passive:true});
$('#company-wall').addEventListener('pointerup',e=>{if(!worldTouch)return;const dx=e.clientX-worldTouch.x,dy=e.clientY-worldTouch.y;worldTouch=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4){worldSwiped=true;showWorld(worldRotation.index+(dx<0?1:-1),true);}},{passive:true});
$('#company-wall').addEventListener('pointercancel',()=>{worldTouch=null;});
$('#company-wall').addEventListener('click',e=>{if(worldSwiped){e.preventDefault();worldSwiped=false;}},true);
$('#creative-idea').addEventListener('focus',()=>{worldRotation.editing=true;updateWorldRotation();});
$('#creative-idea').addEventListener('blur',()=>{worldRotation.editing=false;updateWorldRotation();});
reducedMotion.addEventListener('change',updateWorldRotation);
document.addEventListener('visibilitychange',updateWorldRotation);
const resolvedTool=id=>factoryTools[id]||snapshot.tools?.find(t=>t.id===id);
function renderWorkspace(){
 const select=$('#day-project');select.replaceChildren();
 for(const b of brands){const candidates=snapshot.projects.filter(p=>matches(p,b));const saved=candidates.find(p=>p.id===workspace.active)||candidates.find(p=>workspace.jobs[p.id])||candidates[0];const option=el('option',b.name);option.value=saved?.id||'missing:'+b.id;option.disabled=!saved;select.append(option);}
 if(!brandFor(snapshot.projects.find(p=>p.id===workspace.active)))workspace.active=[...select.options].find(o=>!o.disabled)?.value||'';
 select.value=workspace.active;$('#creative-idea').value=workspace.idea||'';selectProject(workspace.active,false);renderProjectChips();renderVisualHome();

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
function toolButton(id){const t=resolvedTool(id);if(!t?.url)return el('span','Tool not available');const a=link('Open '+t.name+' ↗',new URL(t.url,location.href).href);a.className='studio-new-tab';a.addEventListener('click',syncFields);return a;}
function openTool(id){const t=resolvedTool(id);if(!t?.url)return;syncFields();const a=link('Open '+t.name,t.url);if(a.tagName==='A')a.click();}
function renderStep(){ $('#workbench').hidden=true; }
$('#day-project').addEventListener('change',e=>{syncFields();selectProject(e.target.value);});
$('#start-day').addEventListener('click',()=>{const id=$('#day-project').value;workspace.active=id;if(!currentJob())workspace.jobs[id]={step:0,draft:'',notes:'',link:'',topic:'',review:{}};syncFields();renderStep();$('#visual-home').scrollIntoView({behavior:'smooth'});});
for(const id of ['day-outcome','day-draft','day-link','day-notes'])$('#'+id).addEventListener('input',syncFields);
$('#step-next').addEventListener('click',()=>{syncFields();const j=currentJob();if(j.step===3&&!['truth','link','brand'].every(k=>j.review?.[k]))return;j.step=Math.min(5,j.step+1);saveWork();renderStep();});
$('#step-back').addEventListener('click',()=>{syncFields();currentJob().step=Math.max(0,currentJob().step-1);saveWork();renderStep();});
$('#export-day').addEventListener('click',()=>{syncFields();const p=snapshot.projects.find(p=>p.id===workspace.active),j=currentJob();const blob=new Blob([JSON.stringify({idea:workspace.idea||'',project:p.name,...j},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='my-work-'+p.id+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});



load();


function productionCopy(text,label){
 const details=el('details'),summary=el('summary',label||'Copy & captions'),field=el('textarea');field.readOnly=true;field.value=text;field.rows=7;field.setAttribute('aria-label',label||'Copy & captions');
 const button=el('button','Copy text'),status=el('p','','small');button.type='button';status.setAttribute('role','status');button.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(text);status.textContent='Copied.';}catch{field.focus();field.select();status.textContent='Text selected. Copy it with your device.';}});details.append(summary,field,button,status);return details;
}
function completionControls(section,scope){
 const button=el('button','Show completed','quiet');button.type='button';button.setAttribute('aria-pressed',String(!!workspace.showCompleted?.[scope]));
 const apply=()=>{const show=!!workspace.showCompleted?.[scope];button.textContent=show?'Hide completed':'Show completed';button.setAttribute('aria-pressed',String(show));for(const row of section.querySelectorAll('[data-completion-key]')){const done=!!workspace.completionChecks?.[row.dataset.completionKey];row.hidden=done&&!show;row.classList.toggle('is-complete',done);}};
 button.addEventListener('click',()=>{workspace.showCompleted=workspace.showCompleted||{};workspace.showCompleted[scope]=!workspace.showCompleted[scope];saveWork();apply();});section.append(button);section.applyCompletion=apply;return apply;
}
function manualDone(key,labelText,row,section){
 const label=el('label',undefined,'manual-done'),input=el('input');input.type='checkbox';input.checked=!!workspace.completionChecks?.[key];row.dataset.completionKey=key;label.className+=input.checked?' is-done':'';
 input.addEventListener('change',()=>{workspace.completionChecks=workspace.completionChecks||{};workspace.completionChecks[key]=input.checked;label.className='manual-done'+(input.checked?' is-done':'');saveWork();section.applyCompletion?.();});label.append(input,el('span',labelText));return label;
}
function renderProductionReview(){
 let section=$('#production-review');if(!section){section=el('details',undefined,'production-review production-checklist');section.id='production-review';section.setAttribute('aria-labelledby','production-title');$('#office-panels').append(section);}section.className='production-review production-checklist';section.replaceChildren();
 const title=el('h2',"Today's production");title.id='production-title';const summary=el('summary',undefined,'production-toggle');summary.append(title);section.append(summary);const review=snapshot.productionReview;if(review)summary.append(el('span',review.reviewDate+' · Panama time','production-summary-date'));
 if(!review){section.append(el('p','No delivery has been verified yet.'));return;}
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Panama',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 section.append(el('p',review.reviewDate+' · Panama time'+(today===review.reviewDate?'':' · Previous delivery'),'production-date'),el('p','✓ File prepared · Mark Posted or Finished yourself to cross it off. Show completed to undo. Saved in this browser.','small'));
 const applyCompletion=completionControls(section,'production');
 for(const item of review.groups||[]){const group=el('section',undefined,'production-task-group');group.append(el('h3',item.company),el('p',(item.productionDate||review.reviewDate)+' · '+item.status+((item.productionDate||review.reviewDate)===today?'':' · Previous delivery'),'small'));
 for(const asset of item.assets||[]){const row=el('div',undefined,'production-task'),body=el('div',undefined,'production-task-body');const label=asset.duration?'Video prepared: ':'Files prepared: ';body.append(el('strong','✓ '+label+asset.title));const actions=el('div',undefined,'production-task-links');actions.append(link('Open / download ↗',asset.url));if(asset.duration)actions.append(el('span',asset.duration,'small'));body.append(actions);if(asset.copy)body.append(productionCopy(asset.copy));row.append(body,manualDone((item.productionDate||review.reviewDate)+'|'+asset.url,asset.duration?'Posted':'Finished',row,section));group.append(row);}
 if(item.copy||item.notes){const details=disclosure('Copy & notes');if(item.copy)details.querySelector('.inside').append(productionCopy(item.copy,'Draft copy & product brief'));if(item.notes)details.querySelector('.inside').append(el('p',item.notes,'small'));group.append(details);}section.append(group);}
 section.append(disclosure('Access & review details',el('p','Files open in your private Google Drive. Use its download control. You publish manually. Original footage stays untouched; only prior-day managed deliveries move to Trash after a verified replacement.','small'),el('p','Prepared means a verified output file exists. Posted and Finished are your own checkmarks, not platform receipts or quality verification. Earlier Reviewed checks are kept separately and are not converted into Posted or Sent. Assistant listening is not independently verified.','small')));applyCompletion();
}
function renderDailyEmail(){
 let section=$('#daily-email');if(!section){section=el('section',undefined,'daily-email');section.id='daily-email';section.setAttribute('aria-labelledby','daily-email-title');$('#today').before(section);}section.replaceChildren();
 const title=el('h2','Daily email');title.id='daily-email-title';section.append(title);
 section.append(el('p','Review and send today’s AWeber email.','small'));
 const open=link('Open AWeber in new tab ↗','https://www.aweber.com/users/messages');open.className='daily-email-open';section.append(open);
}


// Verified public songs on the owner's official Suno profile. No embedded player or media policy changes.
function renderSoundtrack(){
 if($('#office-soundtrack'))return;
 const box=el('details',undefined,'office-soundtrack');box.id='office-soundtrack';
 box.append(el('summary','My soundtrack'));
 const row=el('div',undefined,'soundtrack-controls'),profile=link('Open my Suno music ↗','https://suno.com/@seanali');
 const label=el('label','Choose a song'),select=el('select');select.id='soundtrack-track';label.htmlFor=select.id;
 const tracks=[["3dc70ba3-090c-4156-abc3-ba71ea4a121c","Todo Va"],["9d2455d4-c45e-42e3-8445-442004b08420","Fruta Tropical"],["676a627c-9db4-4b0d-ae02-f1ee20e2fb48","One-Dub Pulse"],["18c9a7b2-e482-49c4-a46e-836708579ce8","Mentalidad de Campeón"],["1bb1d042-3190-405a-b137-cb49ddacc793","Abundance on Deck"],["65fb719b-d34b-499f-a726-136c3b6c5c4d","Seven-Seven-Seven"],["bab1db9c-8dc3-4201-b6a8-21dd0a4aebe6","Rise in Favor"],["42e71068-9b42-4f6a-bcb5-64d48503a008","Clean Money"],["e0c6b36c-fb7c-4b61-970c-4c6b31bf1278","Caribbean Streets"],["1242d75d-9c4b-4710-a3f3-2c2bd7ca2fcb","Dinero Limpio"],["1863067e-7867-426d-bf4e-308a548f26d9","Give Thanks for the Facts"]];
 for(const [id,title] of tracks){const option=el('option',title);option.value=id;select.append(option);}
 const open=link('Open song on Suno ↗','https://suno.com/song/'+tracks[0][0]);
 select.addEventListener('change',()=>{open.href='https://suno.com/song/'+select.value;open.setAttribute('aria-label','Open '+select.selectedOptions[0].textContent+' on Suno in a new tab');});
 row.append(profile,label,select,open);
 box.append(row,el('p','Music opens in a new tab. In-office playback is unavailable.','small'));
 $('#office-panels').append(box);
}



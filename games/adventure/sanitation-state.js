// Versioned, deterministic sanitation ledger. Only active simulation time advances waste.
// Monetary rewards come from consumed inventory / a claimed completed shift, never a timer.
export const SANITATION_REGIONS=['city','gorgona','colon','chiriqui','east'];
export const SERVICE_TARGETS=[0,12,30,60,100];
export const WASTE_KINDS=['waste','recycle'];
export const SHIFT_TARGET=6,SHIFT_BONUS=8;
const count=(v,max=1e9)=>Number.isFinite(v)?Math.max(0,Math.min(max,Math.floor(v))):0;
const seconds=(v,max=1e9)=>Number.isFinite(v)?Math.max(0,Math.min(max,v)):0;
const validStation=id=>typeof id==='string'&&/^(city|gorgona|colon|chiriqui|east)-[0-3]$/.test(id);
const kind=v=>WASTE_KINDS.includes(v);
const object=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
export const bagCapacity=s=>12+s.bagLevel*6;
export const binCapacity=s=>12+s.binLevel*6;
export const sanitationPoints=s=>s.sorted+Math.floor((s.processed.waste+s.processed.recycle)/8)+s.shifts*4;
export const sanitationRespect=s=>1+[6,18,36,60].filter(n=>s.sorted+s.shifts*3>=n).length;
export const sanitationImpact=s=>s.sorted;
export const sanitationOpen=(s,index)=>Number.isInteger(index)&&index>=0&&index<5&&s.unlocked.includes(SANITATION_REGIONS[index]);
export function unlockSanitation(s){const added=[];for(let i=0;i<5;i++)if(sanitationPoints(s)>=SERVICE_TARGETS[i]&&!s.unlocked.includes(SANITATION_REGIONS[i])){s.unlocked.push(SANITATION_REGIONS[i]);added.push(SANITATION_REGIONS[i]);}return added;}
export function normalizeSanitation(value){
 const raw=object(value),legacy=raw.version!==2,bagLevel=count(raw.bagLevel,2),binLevel=count(raw.binLevel,1);
 const s={version:2,elapsed:seconds(raw.elapsed),earned:count(raw.earned,1e7),spent:count(raw.spent,1e7),sorted:count(raw.sorted),collected:count(raw.collected),shifts:count(raw.shifts),bagLevel,binLevel,
  bag:(Array.isArray(raw.bag)?raw.bag:[]).filter(v=>kind(v)||['sealed:waste','sealed:recycle'].includes(v)).slice(0,12+bagLevel*6),stations:{},trucks:{},unlocked:['city'],processed:{waste:count(raw.processed?.waste),recycle:count(raw.processed?.recycle)},job:null};
 // Keep every previously opened service area; migration never locks a player's route.
 for(let i=1;i<5;i++)if((legacy&&s.elapsed>=i*180)||(Array.isArray(raw.unlocked)&&raw.unlocked.includes(SANITATION_REGIONS[i])))s.unlocked.push(SANITATION_REGIONS[i]);
 for(const [id,value]of Object.entries(object(raw.stations)))if(validStation(id)){
  const p=object(value),oldFill=count(p.fill,12),litter=Array.isArray(p.litter)?p.litter.filter(kind).slice(0,6):Array.from({length:count(p.litter,6)},(_,i)=>i%2?'recycle':'waste');
  s.stations[id]={bins:{waste:legacy?Math.ceil(oldFill/2):count(p.bins?.waste,binCapacity(s)),recycle:legacy?Math.floor(oldFill/2):count(p.bins?.recycle,binCapacity(s))},litter,generation:seconds(p.generation,60),services:count(p.services),sorted:count(p.sorted),beautified:p.beautified===true};
 }
 for(const id of SANITATION_REGIONS){const r=object(raw.trucks?.[id]);s.trucks[id]={distance:seconds(r.distance),stop:count(r.stop,4),phase:seconds(r.phase,12),mode:['service','unload'].includes(r.mode)?r.mode:r.servicing?'service':'drive',load:{waste:legacy?count(r.load,48):count(r.load?.waste,48),recycle:legacy?0:count(r.load?.recycle,48)},cycles:count(r.cycles),waiting:0};}
 const j=object(raw.job);if(j.active===true)s.job={active:true,progress:count(j.progress,SHIFT_TARGET)};
 unlockSanitation(s);return s;
}
export function sanitationStation(s,id){
 if(!validStation(id))return null;
 return s.stations[id]??={bins:{waste:3,recycle:2},litter:['waste','recycle','waste'],generation:0,services:0,sorted:0,beautified:false};
}
const accessible=(s,id)=>validStation(id)&&sanitationOpen(s,SANITATION_REGIONS.indexOf(id.split('-')[0]));
export function advanceWaste(s,ids,dt){
 if(!Number.isFinite(dt)||dt<=0)return;const step=Math.min(dt,60);s.elapsed=Math.min(1e9,s.elapsed+step);
 for(const id of ids){if(!accessible(s,id))continue;const p=sanitationStation(s,id);p.generation+=step;
  while(p.generation>=60){p.generation-=60;for(const k of WASTE_KINDS){if(p.bins[k]<binCapacity(s))p.bins[k]++;else if(p.litter.length<6)p.litter.push(k);}}
 }
}
export function collectLitter(s,id,index=0){
 if(!accessible(s,id)||s.bag.length>=bagCapacity(s))return false;
 const p=s.stations[id];if(!p||!Number.isInteger(index)||index<0||index>=p.litter.length)return false;
 s.bag.push(p.litter.splice(index,1)[0]);return true;
}
// Household bags provide paid work even after the street crew has swept the pavement.
// They are taken from real bin stock and must be delivered to a collection depot.
export function collectHousehold(s,id,k){
 if(!accessible(s,id)||!kind(k)||s.bag.length>=bagCapacity(s))return false;
 const p=s.stations[id];if(!p||p.bins[k]===0)return false;
 p.bins[k]--;s.bag.push('sealed:'+k);return true;
}
const bagKind=v=>v.startsWith('sealed:')?v.slice(7):v;
export function depositSanitation(s,id,index,target,{depot=false}={}){
 if(!accessible(s,id)||!kind(target)||!Number.isInteger(index)||index<0||index>=s.bag.length)return {ok:false,reason:'empty'};
 const item=s.bag[index],k=bagKind(item);if(k!==target)return {ok:false,reason:'wrong-bin'};
 if(item.startsWith('sealed:')&&!depot)return {ok:false,reason:'depot-only'};
 const p=s.stations[id];if(!p)return {ok:false,reason:'empty'};
 if(!depot&&p.bins[k]>=binCapacity(s))return {ok:false,reason:'full'};
 s.bag.splice(index,1);if(depot)s.processed[k]++;else p.bins[k]++;
 s.sorted++;p.sorted++;if(p.sorted>=6)p.beautified=true;
 const coins=k==='recycle'?3:2;s.earned=Math.min(1e7,s.earned+coins);
 if(s.job)s.job.progress=Math.min(SHIFT_TARGET,s.job.progress+1);
 const unlocked=unlockSanitation(s);return {ok:true,coins,unlocked,kind:k};
}
export function startSanitationShift(s){if(s.job)return false;s.job={active:true,progress:0};return true;}
export function claimSanitationShift(s){if(!s.job||s.job.progress<SHIFT_TARGET)return 0;s.job=null;s.shifts++;s.earned=Math.min(1e7,s.earned+SHIFT_BONUS);unlockSanitation(s);return SHIFT_BONUS;}
export function buySanitationUpgrade(s,id,balance){
 const key=id==='bag'?'bagLevel':id==='bins'?'binLevel':null;if(!key)return false;
 const max=id==='bag'?2:1,cost=id==='bag'?(s.bagLevel+1)*20:30;
 if(s[key]>=max||!Number.isFinite(balance)||balance<cost)return false;
 s.spent+=cost;s[key]++;return true;
}
export function serviceStation(s,id,load={waste:0,recycle:0}){
 if(!accessible(s,id))return 0;const p=sanitationStation(s,id);let n=0;
 for(const k of WASTE_KINDS){const room=Math.max(0,48-load[k]),fromBin=Math.min(room,p.bins[k]);p.bins[k]-=fromBin;load[k]+=fromBin;n+=fromBin;
  for(let i=p.litter.length-1;i>=0&&load[k]<48;i--)if(p.litter[i]===k){p.litter.splice(i,1);load[k]++;n++;}}
 p.services++;s.collected+=n;return n;
}
export function unloadSanitation(s,truck){let n=0;for(const k of WASTE_KINDS){n+=truck.load[k];s.processed[k]+=truck.load[k];truck.load[k]=0;}truck.cycles++;unlockSanitation(s);return n;}
export function neighborhoodCleanliness(s,ids){const points=ids.map(id=>s.stations[id]).filter(Boolean);if(!points.length)return null;return Math.round(100*(1-points.reduce((n,p)=>n+p.litter.length,0)/(points.length*6)));}

import {expandWorldPoint,cityX} from './geography.js?v=213';
// Permanent dry-land work sites for Mateo and Sofía. Deterministic positions
// mean finished houses never move when a builder starts a new job.
import {worldIslands,isletHeight,inWater,roadDistance,HIGHWAY_WIDTH} from './explore-state.js?v=213';
import {CITY_ALL_PLOTS,cityOverlap,cityRoadClear} from './city-layout.js?v=213';

export const BUILDER_AREAS=[
 {id:'city',name:'Panama City',x:cityX(120),z:-50,rx:58,rz:48},
 {id:'taboga',name:'Taboga',x:110,z:85,rx:24,rz:20},
 {id:'contadora',name:'Contadora',x:cityX(320),z:125,rx:42,rz:36},
 {id:'bocas',name:'Bocas del Toro',x:-230,z:-200,rx:39,rz:39},
 {id:'colon',name:'Colón',x:-50,z:-365,rx:40,rz:37},
 {id:'guna',name:'San Blas',x:cityX(290),z:-425,rx:12,rz:10}
];
const PROJECT_SIZE={w:3.8,d:3.1};
const CITY_LOTS=[{x:120,z:-89},{x:147,z:-77},{x:114,z:-94},{x:151,z:-29}].map(p=>({...p,x:cityX(p.x)}));
// Restrict the courtyards, visitor attractions, docks, activities and shops.
const protectedLocations={
 taboga:[[86,28,3.6],[90,25,3.8]],
 contadora:[[200,50,3.6]],
 bocas:[[-105,-135,4.8],[-111,-131,3.7]],
 colon:[[-59,-247,9],[-50,-245,4],[-62,-240,3]],
 guna:[[288.7,-425.8,2.1],[291.3,-425.8,2.1],[290,-423.6,2.4]].map(([x,z,r])=>[cityX(x),z,r])
};
for(const [id,pts]of Object.entries(protectedLocations)){const region=({taboga:'islet',contadora:'coconutCoast',bocas:'wilds',colon:'colon'})[id];if(region)protectedLocations[id]=pts.map(([x,z,r])=>{const p=expandWorldPoint(x,z,region);return [p.x,p.z,r];});}
export function builderSiteSafe(area,p,chosen=[]){
 const half=Math.hypot(PROJECT_SIZE.w/2,PROJECT_SIZE.d/2);
 const offset=(x,z)=>Math.hypot((x-area.x)/area.rx,(z-area.z)/area.rz);
 if(area.id!=='city'&&offset(p.x,p.z)>.77)return false;
 if(inWater(p.x,p.z)||isletHeight(p.x,p.z)<.32)return false;
 if(roadDistance(p.x,p.z)<HIGHWAY_WIDTH/2+half+1.65)return false;
 for(const dx of [-1.95,1.95])for(const dz of [-1.6,1.6])
  if(inWater(p.x+dx,p.z+dz)||isletHeight(p.x+dx,p.z+dz)<.20)return false;
 if((protectedLocations[area.id]||[]).some(([x,z,r])=>Math.hypot(x-p.x,z-p.z)<r+half+1))return false;
 const plot={x:p.x,z:p.z,...PROJECT_SIZE};
 if(chosen.some(q=>cityOverlap(q,plot,1.5)))return false;
 if(area.id==='city'){
  if(offset(p.x,p.z)>.96||!cityRoadClear(plot))return false;
  if(CITY_ALL_PLOTS.some(q=>cityOverlap(q,plot,1.6)))return false;
 }return true;
}
function pickIslandSite(area,wanted,claimed){
 // Walk a staggered outward spiral; every chosen house must fit on actual dry terrain.
 const steps=area.id==='city'?[0,2.2,4.4,6.6,8.8,11,13.2,15.4,18.2,22,26,30,34,38]:[0,2.2,4.4,6.6,8.8,11,13.2,15.4,18.2];
 for(const radius of steps){
  const spokes=radius===0?1:24;
  for(let k=0;k<spokes;k++){
   const a=k*2.399963229728653+(area.id==='guna'?.2:0);
   const candidate={x:Math.round((wanted.x+Math.cos(a)*radius)*10)/10,
    z:Math.round((wanted.z+Math.sin(a)*radius)*10)/10};
   if(builderSiteSafe(area,candidate,claimed))return candidate;
  }
 }
 return null;
}
export function planBuilderSites(){
 const claimed=[],positions={mateo:[],sofia:[]};
 for(const region of BUILDER_AREAS){
  // Project pairs per region: both builders make two independent structures.
  for(let round=0;round<2;round++)for(const id of ['mateo','sofia']){
   const step=round*2+(id==='sofia'?1:0);
   let spot;
   if(region.id==='city'){
    const request=CITY_LOTS[step];
    spot=pickIslandSite(region,request,claimed);
   }else{
    const compass=[[-.38,-.25],[.40,-.23],[-.37,.36],[.38,.38]][step];
    spot=pickIslandSite(region,{x:region.x+compass[0]*region.rx,z:region.z+compass[1]*region.rz},claimed);
   }
   if(!spot)continue;
   const site={...spot,...PROJECT_SIZE,id:id+'-'+region.id+'-'+round,region:region.id,regionName:region.name,round,builder:id};
   claimed.push(site);positions[id].push(site);
  }
 }
 return positions;
}
export const BUILDER_SITES=planBuilderSites();
export function builderCycleSite(id,cycle){
 const list=BUILDER_SITES[id]||[];
 return list[Math.min(Math.max(0,Math.floor(Number(cycle)||0)),list.length-1)]||null;
}
export function builderVisibleProjects(saved,id){
 const progress=saved||{},list=BUILDER_SITES[id]||[],past=Array.isArray(progress.completed)?progress.completed:[];
 const result=[],seen=new Set();
 for(const p of past){
  if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.z)||typeof p.id!=='string'||seen.has(p.id))continue;
  const match=list.find(q=>q.id===p.id);
  if(!match)continue;
  seen.add(p.id);result.push({...match,...(builderSiteSafe(BUILDER_AREAS.find(a=>a.id===match.region),p)?{x:p.x,z:p.z}:{})});
 }
 // Migrate earlier builder progress to permanent structures rather than
 // discarding their work when this multi-island contract replaces the old cycle.
 const legacy=Math.max(0,Math.min(list.length,Math.floor(Number(progress.cycle)||0)));
 for(let i=0;i<legacy;i++){if(!seen.has(list[i].id)){result.push({...list[i]});seen.add(list[i].id);}}
 return result;
}

import {mallBlocked,mallClearing} from './colon-mall-layout.js';
import {costaBlocked,costaClearing} from './costa-arriba-layout.js?v=225';
import {homeReserved} from './mansion-state.js?v=225';
import {BUILDER_SITES} from './builder-projects.js?v=225';
import {worldIslands,isletHeight,inWater,roadDistance,HIGHWAY_WIDTH,explorePlaces,exploreItems} from './explore-state.js?v=225';
// Shared render, forest exclusion and collision footprints. No saved destinations move.
let cached;
export function regionalParcels(){
 if(cached)return cached;
 const plots=[],colors=['#e6bd70','#86bbb6','#d68f76','#e7dbb9','#92a98b'];
 function offer(region,x,z,w=5,d=4.5,floors=1,style='plaster'){
  const r=Math.hypot(w,d)/2;
  if(roadDistance(x,z)<HIGHWAY_WIDTH/2+r+1.8||inWater(x,z))return false;
  if(!regionalTrailClear(x,z))return false;
  if(Object.values(BUILDER_SITES).flat().some(p=>Math.hypot(p.x-x,p.z-z)<r+Math.hypot(p.w,p.d)/2+2.5))return false;
  if(region==='wilds'&&Array.from({length:12},(_,i)=>({x:-230+(-9+(i%4)*6)*1.6875,z:-200+(-7+Math.floor(i/4)*7)*1.6875})).some(p=>Math.hypot(p.x-x,p.z-z)<r+2))return false;
  if([...explorePlaces,...exploreItems].some(p=>Math.hypot(p.x-x,p.z-z)<r+2.5))return false;
  if(plots.some(p=>Math.hypot(p.x-x,p.z-z)<r+Math.hypot(p.w,p.d)/2+(region==='gorgona'?1.1:2.5)))return false;
  const ys=[[-1,-1],[1,-1],[-1,1],[1,1]].map(([a,b])=>isletHeight(x+a*w/2,z+b*d/2));
  if(Math.min(...ys)<.35||Math.max(...ys)-Math.min(...ys)>1.8)return false;
  plots.push({id:region+'-'+plots.length,region,x,z,w,d,floors,style,base:Math.max(...ys),color:style==='coastal-apartments'?'#f4f1e7':colors[plots.length%colors.length]});return true;
 }
 // Streets run behind a broad crescent of beach; the original home cove stays open.
 for(const [x,z]of [[-56,8],[-73,8]])offer('gorgona',x,z,12,9,x===-56?21:17,'coastal-apartments');
 for(const z of [-2,-30])for(let x=-85;x<=-28;x+=9)offer('gorgona',x,z,4.8,4.6,1+(plots.length%4===0?1:0));
 for(const [id,count,style]of [['islet',6,'plaster'],['wilds',5,'timber'],['coconutCoast',4,'veranda'],['delRey',2,'timber']]){
  const land=worldIslands.find(p=>p.id===id);let n=0;
  for(let i=0;i<120&&n<count;i++){
   const a=i*2.399963,r=.46+(i%4)*.07,x=land.x+Math.cos(a)*land.rx*r,z=land.z+Math.sin(a)*land.rz*r;
   if(offer(id,x,z,id==='islet'?3.6:4.6,id==='islet'?3.4:4.0,id==='wilds'?2:1,style))n++;
  }
 }
 return cached=plots;
}
export function regionalParcelActive(p,world){return !homeReserved(p.x,p.z,Math.hypot(p.w,p.d)/2)&&!(world?.estate?.buildings||[]).some(b=>Math.hypot(p.x-b.x,p.z-b.z)<Math.hypot(p.w,p.d)/2+8);}
export const regionalBlocked=(x,z,world,margin=.32)=>mallBlocked(x,z,margin)||costaBlocked(x,z,margin)||regionalParcels().some(p=>regionalParcelActive(p,world)&&Math.abs(x-p.x)<p.w/2+margin&&Math.abs(z-p.z)<p.d/2+margin);
export const regionalClearing=(x,z,margin=4)=>mallClearing(x,z,margin)||costaClearing(x,z,margin)||regionalParcels().some(p=>Math.abs(x-p.x)<p.w/2+margin&&Math.abs(z-p.z)<p.d/2+margin);

export function regionalTrailClear(x,z){
 for(const land of worldIslands.filter(p=>['coiba','escudo','cebaco','delRey','wilds','islet'].includes(p.id))){
  const t=(.83-(z-land.z)/land.rz)/1.25;
  if(t>=0&&t<=1&&Math.abs(x-land.x-Math.sin(t*5.1)*land.rx*.17)<2.2)return false;
 }return true;
}

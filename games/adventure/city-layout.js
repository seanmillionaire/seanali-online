import {roadDistance,HIGHWAY_WIDTH} from './explore-state.js?v=168';
// Shared road and parcel clearances for all city scene generators.
export const CITY_STREET_X=[77,105,135,163],CITY_STREET_Z=[-85,-61,-35,-12];
export const CITY_FIXED_PLOTS=[
{id:'football',x:120,z:-23,w:20,d:14,solid:true},
{id:'pizzeria',x:120,z:-48,w:12,d:14,solid:true},
{id:'tower',x:98,z:-79,w:9,d:7,solid:true},
{id:'museum',x:142,z:-79,w:8,d:7,solid:true},
{id:'mural',x:91,z:-73,w:9,d:3,solid:true},
{id:'market',x:150,z:-48,w:6,d:5,solid:true},
{id:'wash',x:88,z:-48,w:6,d:6,solid:false},
{id:'plaza',x:120,z:-73,w:8,d:8,solid:false},
{id:'raspao-centro',x:129,z:-53,w:3,d:3,solid:true},
{id:'raspao-barrio',x:99,z:-18,w:3,d:3,solid:true},
{id:'market-food',x:150,z:-56,w:3,d:3,solid:true}
];
export const cityOverlap=(a,b,gap=.6)=>Math.abs(a.x-b.x)<(a.w+b.w)/2+gap&&Math.abs(a.z-b.z)<(a.d+b.d)/2+gap;
export function cityRoadClear(p){
 // Every intercity highway and Gorgona beach road has its own protected lane.
 // The half diagonal includes every corner of a rectangular house footprint.
 const footprintRadius=Math.hypot(p.w/2,p.d/2);
 if(roadDistance(p.x,p.z)<=HIGHWAY_WIDTH/2+footprintRadius+1.05)return false;
 return !CITY_STREET_X.some(v=>Math.abs(v-p.x)<p.w/2+3.275)
  &&!CITY_STREET_Z.some(v=>Math.abs(v-p.z)<p.d/2+3.275)
  &&Math.abs(Math.hypot((p.x-120)/48.4,(p.z+50)/40)-1)>=.03;
}
export function allocateCityParcel(wanted,claimed,span=34){
 const pts=[];
 for(let dx=-span;dx<=span;dx+=2)for(let dz=-span;dz<=span;dz+=2)
  pts.push({x:wanted.x+dx,z:wanted.z+dz,w:wanted.w,d:wanted.d,score:dx*dx+dz*dz});
 pts.sort((a,b)=>a.score-b.score||a.x-b.x||a.z-b.z);
 const p=pts.find(p=>Math.hypot((p.x-120)/58,(p.z+50)/48)<.95&&cityRoadClear(p)&&!claimed.some(q=>cityOverlap(p,q)));
 if(!p)return null;
 const result={x:p.x,z:p.z,w:p.w,d:p.d};claimed.push(result);return result;
}
const claimed=CITY_FIXED_PLOTS.map(p=>({...p}));
export const CITY_BARRIO_PLOTS=[[82,-24],[84,-15],[90,-5],[103,-5],[116,-5],[124,-15],[124,-25],[80,-29]].map(([x,z])=>allocateCityParcel({x,z,w:4.5,d:4},claimed)).filter(Boolean);
export const CITY_SHOP_PLOTS=[[98,-67],[112,-67],[128,-67],[142,-62],[98,-41.5],[112,-41.5],[133,-29],[146,-33]].map(([x,z])=>allocateCityParcel({x,z,w:7,d:7},claimed)).filter(Boolean);
export const CITY_EXPANSION_PLOTS=[];
for(const dx of [-48,-37,-22,-8,8,22,36,48])for(const dz of [-40,-30,-18,-5,9,21,32,42]){
 const p=allocateCityParcel({x:120+dx,z:-50+dz,w:5.3,d:6.4},claimed,15);
 if(p)CITY_EXPANSION_PLOTS.push(p);
}
export const CITY_ALL_PLOTS=claimed;
export function cityBlocksVehicle(x,z){
 return CITY_ALL_PLOTS.some(p=>p.solid!==false&&Math.abs(x-p.x)<p.w/2+.85&&Math.abs(z-p.z)<p.d/2+.85);
}

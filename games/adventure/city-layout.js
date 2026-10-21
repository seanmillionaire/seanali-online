import {cityX} from './geography.js?v=224';
import {roadDistance,HIGHWAY_WIDTH} from './explore-state.js?v=224';
// Shared road and parcel clearances for all city scene generators.
export const CITY_STREET_X=[77,105,135,163].map(cityX),CITY_STREET_Z=[-85,-61,-35,-12];
export const CITY_FIXED_PLOTS=[
{id:'football',x:cityX(120),z:-23,w:20,d:14,solid:true},
{id:'pizzeria',x:cityX(120),z:-48,w:12,d:14,solid:true},
{id:'tower',x:cityX(97),z:-78,w:9,d:7,solid:true},
{id:'museum',x:cityX(142),z:-79,w:8,d:7,solid:true},
{id:'mural',x:cityX(91),z:-73,w:9,d:3,solid:true},
{id:'market',x:cityX(150),z:-48,w:6,d:5,solid:true},
{id:'wash',x:cityX(88),z:-48,w:6,d:6,solid:false},
{id:'flag-base',x:cityX(120),z:-73,w:2.3,d:2.3,solid:true},
{id:'plaza',x:cityX(120),z:-73,w:8,d:8,solid:false},
{id:'raspao-centro',x:cityX(129),z:-53,w:3,d:3,solid:true},
{id:'raspao-barrio',x:cityX(99),z:-18,w:3,d:3,solid:true},
{id:'market-food',x:cityX(150),z:-56,w:3,d:3,solid:true}
];
export const cityOverlap=(a,b,gap=.6)=>Math.abs(a.x-b.x)<(a.w+b.w)/2+gap&&Math.abs(a.z-b.z)<(a.d+b.d)/2+gap;
export function cityRoadClear(p){
 // Every intercity highway and Gorgona beach road has its own protected lane.
 // The half diagonal includes every corner of a rectangular house footprint.
 const footprintRadius=Math.hypot(p.w/2,p.d/2);
 if(roadDistance(p.x,p.z)<=HIGHWAY_WIDTH/2+footprintRadius+1.05)return false;
 return !CITY_STREET_X.some(v=>Math.abs(v-p.x)<p.w/2+3.275)
  &&!CITY_STREET_Z.some(v=>Math.abs(v-p.z)<p.d/2+3.275)
  &&Math.abs(Math.hypot((p.x-cityX(120))/48.4,(p.z+50)/40)-1)>=.03;
}
export function allocateCityParcel(wanted,claimed,span=34){
 const pts=[];
 for(let dx=-span;dx<=span;dx+=2)for(let dz=-span;dz<=span;dz+=2)
  pts.push({x:wanted.x+dx,z:wanted.z+dz,w:wanted.w,d:wanted.d,score:dx*dx+dz*dz});
 pts.sort((a,b)=>a.score-b.score||a.x-b.x||a.z-b.z);
 const p=pts.find(p=>Math.hypot((p.x-cityX(120))/58,(p.z+50)/48)<.95&&cityRoadClear(p)&&!claimed.some(q=>cityOverlap(p,q)));
 if(!p)return null;
 const result={x:p.x,z:p.z,w:p.w,d:p.d};claimed.push(result);return result;
}
const claimed=CITY_FIXED_PLOTS.map(p=>({...p}));
export const HOSPITAL_PLOT=allocateCityParcel({x:cityX(110),z:-46,w:8,d:9},claimed);
if(!HOSPITAL_PLOT)throw Error('Hospital needs a clear city parcel');
Object.assign(claimed[claimed.length-1],{id:'hospital',solid:true});
export const CITY_BARRIO_PLOTS=[[cityX(82),-24],[cityX(84),-15],[cityX(90),-5],[cityX(103),-5],[cityX(116),-5],[cityX(124),-15],[cityX(124),-25],[cityX(80),-29]].map(([x,z])=>allocateCityParcel({x,z,w:4.5,d:4},claimed)).filter(Boolean);
export const CITY_SHOP_PLOTS=[[cityX(98),-67],[cityX(112),-67],[cityX(128),-67],[cityX(142),-62],[cityX(98),-41.5],[cityX(112),-41.5],[cityX(133),-29],[cityX(146),-33]].map(([x,z])=>allocateCityParcel({x,z,w:7,d:7},claimed)).filter(Boolean);
export const CITY_EXPANSION_PLOTS=[];
// Let the city breathe: leave deliberate gaps between Casco's commercial
// buildings, apartment blocks and open pedestrian squares.
const COLS=[-48,-37,-22,-8,8,22,36,48],ROWS=[-40,-30,-18,-5,9,21,32,42];
for(const [i,dx] of COLS.entries())for(const [j,dz] of ROWS.entries()){
 if((i*3+j*5)%9===0||(i+j*2)%11===6)continue;
 const p=allocateCityParcel({x:cityX(120)+dx,z:-50+dz,w:5.3,d:6.4},claimed,15);
 if(p)CITY_EXPANSION_PLOTS.push(p);
}
export const CITY_ALL_PLOTS=claimed;
export function cityBlocksVehicle(x,z){
 return CITY_ALL_PLOTS.some(p=>p.solid!==false&&Math.abs(x-p.x)<p.w/2+.85&&Math.abs(z-p.z)<p.d/2+.85);
}

// Small street props share the road setbacks used by the parcel planner.
export function cityPropSite(x,z,r=.75){
 const clear=(a,b)=>!CITY_STREET_X.some(v=>Math.abs(v-a)<3.075+r+.55)&&!CITY_STREET_Z.some(v=>Math.abs(v-b)<3.075+r+.55)&&roadDistance(a,b)>HIGHWAY_WIDTH/2+r+.6&&!CITY_ALL_PLOTS.some(p=>p.solid!==false&&Math.abs(a-p.x)<p.w/2+r&&Math.abs(b-p.z)<p.d/2+r);
 for(let d=0;d<=18;d+=.5)for(let i=0;i<(d?32:1);i++){const a=x+Math.cos(i*Math.PI/16)*d,b=z+Math.sin(i*Math.PI/16)*d;if(clear(a,b))return {x:a,z:b};}
 return null;
}

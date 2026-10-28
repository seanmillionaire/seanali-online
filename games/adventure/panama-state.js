import {sanBlasLayout} from './san-blas-layout.js';
import {cityX} from './geography.js';
// Shared geography, traffic paths and durable food progression.
export const SAN_BLAS_ISLANDS=sanBlasLayout(cityX(0));
export const PANAMA_FOODS={pizza:{icon:'🍕',en:'Wood-fired pizza',es:'Pizza al horno'},fish:{icon:'🐟',en:'Fresh fish',es:'Pescado fresco'},plantain:{icon:'🍌',en:'Green plantain',es:'Plátano verde'},rice:{icon:'🍚',en:'Rice',es:'Arroz'},patacones:{icon:'🍌',en:'Patacones',es:'Patacones'},fishPlate:{icon:'🍽️',en:'Fried fish with patacones',es:'Pescado frito con patacones'},coconutRice:{icon:'🥥',en:'Coconut rice',es:'Arroz con coco'},raspao:{icon:'🍧',en:'Raspao',es:'Raspao'}};
export const PANAMA_RECIPES={patacones:{plantain:1},fishPlate:{fish:1,patacones:1},coconutRice:{rice:1,coconut:1}};
const count=n=>Number.isFinite(n)?Math.max(0,Math.min(9999,Math.floor(n))):0;
export function normalizePanama(raw){return {mallOutfits:[...new Set((Array.isArray(raw?.mallOutfits)?raw.mallOutfits:[]).filter(id=>['caribbean','sunshine','coral'].includes(id)))],pantry:Object.fromEntries(Object.keys(PANAMA_FOODS).map(k=>[k,count(raw?.pantry?.[k])])),spent:count(raw?.spent),caught:count(raw?.caught),meals:count(raw?.meals),treasures:[...new Set((Array.isArray(raw?.treasures)?raw.treasures:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<SAN_BLAS_ISLANDS.length))],gathered:Object.fromEntries(Object.entries(raw?.gathered||{}).filter(([k])=>/^plantain-[0-4]$/.test(k)).map(([k,n])=>[k,Math.min(6,count(n))]))};}
export function purchasePanama(world,kind,cost,balance){if(!PANAMA_FOODS[kind]||!Number.isInteger(cost)||cost<=0||balance<cost||world.panama.pantry[kind]>=9999)return false;world.panama.spent+=cost;world.panama.pantry[kind]++;return true;}
export function cookPanama(world,id){const recipe=PANAMA_RECIPES[id],p=world.panama.pantry;if(!recipe||p[id]>=9999||!Object.entries(recipe).every(([k,n])=>(k==='coconut'?world.food.coconut:p[k])>=n))return false;for(const [k,n]of Object.entries(recipe)){if(k==='coconut')world.food.coconut-=n;else p[k]-=n;}p[id]++;return true;}
export function eatPanama(world,id){if(!['patacones','fishPlate','coconutRice','raspao','pizza'].includes(id)||!world.panama.pantry[id])return false;world.panama.pantry[id]--;world.panama.meals++;return true;}
function roundedCityLoop(points){
 const radius=3,arc=points.flatMap((p,i)=>{const prev=points[(i+points.length-1)%points.length],next=points[(i+1)%points.length],before=Math.hypot(prev.x-p.x,prev.z-p.z),after=Math.hypot(next.x-p.x,next.z-p.z),a={x:p.x+(prev.x-p.x)*radius/before,z:p.z+(prev.z-p.z)*radius/before},b={x:p.x+(next.x-p.x)*radius/after,z:p.z+(next.z-p.z)*radius/after};return Array.from({length:9},(_,j)=>{const t=j/8;return {x:(1-t)**2*a.x+2*(1-t)*t*p.x+t*t*b.x,z:(1-t)**2*a.z+2*(1-t)*t*p.z+t*t*b.z};});});
 // Begin on a straight segment so the collection depot stays out of a turn.
 return [...arc.slice(8),...arc.slice(0,8)];
}
export const TRAFFIC_ROUTES=[
 // Each clockwise loop follows the right-hand lane, 1.5 m off the
 // street center. Adjacent loops must not meet head-on on a shared edge.
 [[106.5,-83.5],[133.5,-83.5],[133.5,-62.5],[106.5,-62.5]],
 [[78.5,-59.5],[103.5,-59.5],[103.5,-36.5],[78.5,-36.5]],
 [[136.5,-59.5],[161.5,-59.5],[161.5,-36.5],[136.5,-36.5]]
].map(points=>roundedCityLoop(points.map(([x,z])=>({x:cityX(x),z}))));
export function spaceCityTraffic(vehicles){for(const route of new Set(vehicles.map(car=>car.route))){const lane=vehicles.filter(car=>car.route===route),length=routePose(route,0).length;lane.forEach((car,i)=>car.distance=(12+i*length/lane.length)%length);}}
const routeMetrics=new WeakMap();
// Authored traffic routes are immutable; cache arc lengths instead of rebuilding them per car/frame.
export function routePose(route,distance){
 let data=routeMetrics.get(route);if(!data||data.count!==route.length){const ends=[],lengths=[];let length=0;for(let i=0;i<route.length;i++){const p=route[i],q=route[(i+1)%route.length],n=Math.hypot(q.x-p.x,q.z-p.z);length+=n;lengths.push(n);ends.push(length);}data={ends,lengths,length,count:route.length};routeMetrics.set(route,data);}
 const {length,ends,lengths}=data;if(!length)return {...route[0],heading:0,remaining:0,length:0};const d=((distance%length)+length)%length;let lo=0,hi=ends.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(ends[mid]>=d)hi=mid;else lo=mid+1;}const i=lo,p=route[i],q=route[(i+1)%route.length],along=d-(i?ends[i-1]:0),t=lengths[i]?along/lengths[i]:0;return {x:p.x+(q.x-p.x)*t,z:p.z+(q.z-p.z)*t,heading:Math.atan2(q.x-p.x,q.z-p.z),remaining:lengths[i]-along,length};
}

export function trafficAdvance(car,cars,time,dt){
 const step=Math.min(.08,Math.max(0,Number.isFinite(dt)?dt:0));
 if(!step)return car.distance;
 const pose=routePose(car.route,car.distance),vertical=Math.abs(Math.cos(pose.heading))>.5;
 const green=Math.floor(time/6)%2===(vertical?0:1);
 // Stop the whole hull before the crossing lane, including its 1.5 m offset.
 const safe=car.bus?8:car.utility?5.6:5;
 const signals=vertical?[-85,-73,-61,-48,-35,-23,-12].map(z=>({x:pose.x,z})):[77,91,105,120,135,149,163].map(x=>({x:cityX(x),z:pose.z}));
 const redStop=!green&&signals.some(q=>{const ahead=(q.x-pose.x)*Math.sin(pose.heading)+(q.z-pose.z)*Math.cos(pose.heading);return ahead>safe&&ahead<safe+1.3;});
 // Cars on different streets may be close in 3D yet not block each other.
 // Only follow cars in the same lane, ahead along that route.
 const blocked=cars.some(other=>{
  if(other===car||other.route!==car.route)return false;
  const ahead=routePose(other.route,other.distance);
  const total=pose.length;
  const gap=((other.distance-car.distance)%total+total)%total;
  const halfLength=v=>v.bus?4.8:v.utility?2.35:1.8;
  return gap>.01&&gap<halfLength(car)+halfLength(other)+.8;
 });
 car.trafficRedStopped=redStop;
 if(redStop||blocked){
  car.wait=(car.wait||0)+step;
  // A red light is never a permanent barrier and gridlock clears naturally.
  if(blocked||car.wait<1.9)return car.distance;
 }
 car.wait=0;
 return car.distance+car.speed*step;
}
export function soundFalloff(x,z,source,radius=28){return Math.max(0,1-Math.hypot(x-source.x,z-source.z)/radius)**2;}


import {cityX} from './geography.js?v=188';
// Shared geography, traffic paths and durable food progression.
export const SAN_BLAS_ISLANDS=Array.from({length:28},(_,i)=>{const col=i%7,row=Math.floor(i/7),x=cityX(246)+col*14+(row%2)*2,z=-277+row*21+(col%2)*3;return {id:'guna-'+i,x,z,rx:3.5+(i%3)*.65,rz:2.9+(i%4)*.4,h:.65,guna:true,community:i%7===0,ox:x,oz:z,spread:1,en:'San Blas cay '+(i+1),es:'Cayo de San Blas '+(i+1)};}).filter(p=>Math.hypot(p.x-cityX(290),p.z+245)>17);
export const PANAMA_FOODS={fish:{icon:'🐟',en:'Fresh fish',es:'Pescado fresco'},plantain:{icon:'🍌',en:'Green plantain',es:'Plátano verde'},rice:{icon:'🍚',en:'Rice',es:'Arroz'},patacones:{icon:'🍌',en:'Patacones',es:'Patacones'},fishPlate:{icon:'🍽️',en:'Fried fish with patacones',es:'Pescado frito con patacones'},coconutRice:{icon:'🥥',en:'Coconut rice',es:'Arroz con coco'},raspao:{icon:'🍧',en:'Raspao',es:'Raspao'}};
export const PANAMA_RECIPES={patacones:{plantain:1},fishPlate:{fish:1,patacones:1},coconutRice:{rice:1,coconut:1}};
const count=n=>Number.isFinite(n)?Math.max(0,Math.min(9999,Math.floor(n))):0;
export function normalizePanama(raw){return {pantry:Object.fromEntries(Object.keys(PANAMA_FOODS).map(k=>[k,count(raw?.pantry?.[k])])),spent:count(raw?.spent),caught:count(raw?.caught),meals:count(raw?.meals),treasures:[...new Set((Array.isArray(raw?.treasures)?raw.treasures:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<SAN_BLAS_ISLANDS.length))],gathered:Object.fromEntries(Object.entries(raw?.gathered||{}).filter(([k])=>/^plantain-[0-4]$/.test(k)).map(([k,n])=>[k,Math.min(6,count(n))]))};}
export function purchasePanama(world,kind,cost,balance){if(!PANAMA_FOODS[kind]||!Number.isInteger(cost)||cost<=0||balance<cost||world.panama.pantry[kind]>=9999)return false;world.panama.spent+=cost;world.panama.pantry[kind]++;return true;}
export function cookPanama(world,id){const recipe=PANAMA_RECIPES[id],p=world.panama.pantry;if(!recipe||p[id]>=9999||!Object.entries(recipe).every(([k,n])=>(k==='coconut'?world.food.coconut:p[k])>=n))return false;for(const [k,n]of Object.entries(recipe)){if(k==='coconut')world.food.coconut-=n;else p[k]-=n;}p[id]++;return true;}
export function eatPanama(world,id){if(!['patacones','fishPlate','coconutRice','raspao'].includes(id)||!world.panama.pantry[id])return false;world.panama.pantry[id]--;world.panama.meals++;return true;}
export const TRAFFIC_ROUTES=[
 [[105,-85],[135,-85],[135,-61],[105,-61]],
 [[77,-61],[105,-61],[105,-35],[77,-35]],
 [[135,-61],[163,-61],[163,-35],[135,-35]]
].map(points=>points.map(([x,z])=>({x:cityX(x),z})));
export function routePose(route,distance){let length=0;const lengths=route.map((p,i)=>{const q=route[(i+1)%route.length],n=Math.hypot(q.x-p.x,q.z-p.z);length+=n;return n;});let d=((distance%length)+length)%length;for(let i=0;i<route.length;i++){if(d<=lengths[i]){const p=route[i],q=route[(i+1)%route.length],t=d/lengths[i],heading=Math.atan2(q.x-p.x,q.z-p.z);return {x:p.x+(q.x-p.x)*t,z:p.z+(q.z-p.z)*t,heading,remaining:lengths[i]-d,length};}d-=lengths[i];}return {...route[0],heading:0,remaining:0,length};}
export function trafficAdvance(car,cars,time,dt){
 const step=Math.min(.08,Math.max(0,Number.isFinite(dt)?dt:0));
 if(!step)return car.distance;
 const pose=routePose(car.route,car.distance),vertical=Math.abs(Math.cos(pose.heading))>.5;
 const green=Math.floor(time/6)%2===(vertical?0:1);
 const safe=car.bus?4.6:2.6;
 const signals=vertical?[-85,-73,-61,-48,-35,-23,-12].map(z=>({x:pose.x,z})):[77,91,105,120,135,149,163].map(x=>({x:cityX(x),z:pose.z}));
 const redStop=!green&&signals.some(q=>{const ahead=(q.x-pose.x)*Math.sin(pose.heading)+(q.z-pose.z)*Math.cos(pose.heading);return ahead>safe&&ahead<safe+1.3;});
 // Cars on different streets may be close in 3D yet not block each other.
 // Only follow cars in the same lane, ahead along that route.
 const blocked=cars.some(other=>{
  if(other===car||other.route!==car.route)return false;
  const ahead=routePose(other.route,other.distance);
  const total=pose.length;
  const gap=((other.distance-car.distance)%total+total)%total;
  return gap>.01&&gap<(car.bus||other.bus?7:4.5);
 });
 if(redStop||blocked){
  car.wait=(car.wait||0)+step;
  // A red light is never a permanent barrier and gridlock clears naturally.
  if(car.wait<(blocked?2.6:1.9))return car.distance;
 }
 car.wait=0;
 return car.distance+car.speed*step;
}
export function soundFalloff(x,z,source,radius=28){return Math.max(0,1-Math.hypot(x-source.x,z-source.z)/radius)**2;}

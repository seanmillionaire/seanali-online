import {HIGHWAY_CURVES} from './explore-state.js';
import {highwayLane} from './highway-layout.js';
import {routePose} from './panama-state.js';
import {SHOW_CARS,AMADOR_BAYS,AMADOR_SHIFT,normalizeShowFleet} from './amador-layout.js';
import {worldClock} from './world-clock.js';
// Use the authored highway curves and lane rules of ambient traffic. The
// ambient traffic owner supplies its existing lane loops and swept avoidance.
function nearest(path,p){let at=0;for(let i=1;i<path.length;i++)if(Math.hypot(path[i][0]-p[0],path[i][1]-p[1])<Math.hypot(path[at][0]-p[0],path[at][1]-p[1]))at=i;return at;}
function highwayTour(index){
 const roads=HIGHWAY_CURVES,tag=(id,points=roads[id])=>points.map(p=>({p,lane:highwayLane(id,0,...p)})),approach=tag('amador',[...roads.amador].reverse());
 if(index<2)return [...approach,...tag('cityToGorgona').slice(1),...tag(index===0?'gorgonaBeachAccess':'cityToBaru').slice(1)];
 const west=[247.30208285298175,-29.92481075453291],north=[251.3685015438629,-99.50282286315745],ring=roads.cityFreeway.slice(0,-1),a=nearest(ring,west),b=nearest(ring,north),forward=[],backward=[];
 for(let i=a;;i=(i+1)%ring.length){forward.push(ring[i]);if(i===b)break;}for(let i=a;;i=(i-1+ring.length)%ring.length){backward.push(ring[i]);if(i===b)break;}
 const route=forward.length<backward.length?forward:backward,colon=roads.cityToColon.slice(nearest(roads.cityToColon,north)),northRoad=index===2?colon:colon.slice(0,nearest(colon,roads.costaArriba[0])+1);
 return [...approach,...tag('cityToGorgona',roads.cityToGorgona.slice(1,nearest(roads.cityToGorgona,west)+1)),...tag('cityFreeway',route),...tag('cityToColon',northRoad),...(index===3?tag('costaArriba').slice(1):[])];
}
let cached;
export function showFleetRoutes(trafficLoop){
 if(cached)return cached;
 cached=SHOW_CARS.map((style,i)=>{
  const tour=highwayTour(i),lanes=new Map(tour.map(({p,lane})=>[p.join(','),lane])),loop=trafficLoop(tour.map(t=>t.p),(x,z)=>lanes.get(x+','+z)||1.8),bay=AMADOR_BAYS[i];
  // Dedicated one-way aisle: bays are completely outside the causeway lanes.
  const path=[{x:bay.x,z:bay.z},{x:455.5,z:bay.z},{x:456,z:188+AMADOR_SHIFT},{x:450,z:187+AMADOR_SHIFT},...loop.slice(0,-12),{x:456,z:188.5+AMADOR_SHIFT},{x:464,z:188.5+AMADOR_SHIFT},{x:464,z:bay.z},{x:bay.x,z:bay.z}];
  // Round driveway corners without moving the parked pose or road samples.
  const rounded=[path[0]];for(let j=1;j<path.length-1;j++){const a=path[j-1],b=path[j],c=path[j+1],ab=Math.hypot(b.x-a.x,b.z-a.z),bc=Math.hypot(c.x-b.x,c.z-b.z),r=Math.min(.8,ab/3,bc/3);if(r<.04){rounded.push(b);continue;}const p={x:b.x+(a.x-b.x)*r/ab,z:b.z+(a.z-b.z)*r/ab},q={x:b.x+(c.x-b.x)*r/bc,z:b.z+(c.z-b.z)*r/bc};for(let k=0;k<=4;k++){const t=k/4;rounded.push({x:(1-t)**2*p.x+2*(1-t)*t*b.x+t*t*q.x,z:(1-t)**2*p.z+2*(1-t)*t*b.z+t*t*q.z});}}rounded.push(path.at(-1));return rounded;
 });return cached;
}
export function initializeShowFleet({models,root,state,trafficLoop}){
 const routes=showFleetRoutes(trafficLoop),saved=normalizeShowFleet(state.world.showFleet);state.world.showFleet=saved;
 return SHOW_CARS.map((style,i)=>{const route=routes[i],length=routePose(route,0).length,s=saved[i],g=models.sedan(root,false,false,style);g.name='Amador show car · '+style.name;const distance=s.parked?0:Math.min(s.distance,length-.001);return {id:style.id,g,route,distance,speed:11.5+i*.25,showCar:true,parked:s.parked,save:s,wait:0};});
}
export function showCarAdvance(c,dayTime,dt,peers=[]){
 if(dt<=0)return c.distance;
 const hour=worldClock(dayTime).hour,length=routePose(c.route,0).length;
 // Morning tours finish before the evening meetup; the fixed fleet stays
 // overnight and leaves through the same aisle after 08:00.
 if(c.parked){if(hour<8||hour>=13||peers.some(p=>p!==c&&!p.parked&&(p.showCar?(p.distance<80||routePose(p.route,0).length-p.distance<250):Math.hypot(routePose(p.route,p.distance).x-453,routePose(p.route,p.distance).z-240)<30)))return c.distance;c.parked=false;c.distance=0;}
 const pose=routePose(c.route,c.distance),nearLot=pose.z>160+AMADOR_SHIFT&&pose.x>440,limit=nearLot?2.6:c.speed;
 const next=Math.min(length,c.distance+Math.max(0,dt)*limit);
 return next;
}
export function finishShowCarStep(c,dayTime){
 const length=routePose(c.route,0).length;
 if(c.distance>=length-.001){c.distance=0;c.parked=true;}
 c.save.distance=c.distance;c.save.parked=c.parked;
}

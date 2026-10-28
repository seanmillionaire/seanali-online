import assert from 'node:assert/strict';
import {SHOW_CARS,AMADOR_BAYS,AMADOR_VENUES,normalizeShowFleet,amadorEvening} from '../games/adventure/amador-layout.js';
import {showFleetRoutes,showCarAdvance,finishShowCarStep} from '../games/adventure/amador-fleet.js';
import {trafficLoop} from '../games/adventure/world-ambience.js';
import {routePose} from '../games/adventure/panama-state.js';
import {trafficJamStep} from '../games/adventure/traffic-yield.js';
import {vehicleOverlap} from '../games/adventure/vehicle-contact.js';
import {inWater,roadDistance,normalizeExplore,freshExplore} from '../games/adventure/explore-state.js';
import {iconicBlocked} from '../games/adventure/iconic-layout.js';
const routes=showFleetRoutes(trafficLoop),cars=routes.map((route,i)=>({route,distance:0,parked:true,speed:11.5+i*.25,save:{},showCar:true}));
assert.equal(cars.length,4);assert.equal(SHOW_CARS.length,4);
for(const [i,route]of routes.entries()){
 const length=routePose(route,0).length;assert(length>1000&&length<3000);
 for(let d=0;d<length;d+=.5){const p=routePose(route,d);assert(!inWater(p.x,p.z),'route stays dry '+i+' '+d);for(const f of [-1.8,1.8])for(const side of [-.9,.9])assert(!inWater(p.x+Math.sin(p.heading)*f+Math.cos(p.heading)*side,p.z+Math.cos(p.heading)*f-Math.sin(p.heading)*side),'entire car hull stays on land');assert(!iconicBlocked(p.x,p.z,.9),'route avoids buildings');}
 const bay=AMADOR_BAYS[i];assert(roadDistance(bay.x,bay.z)>5.5,'park outside causeway');
 for(let j=0;j<i;j++)assert(!vehicleOverlap({...bay,length:1.8,width:.9},{...AMADOR_BAYS[j],length:1.8,width:.9}),'separate bays');
}
for(const v of AMADOR_VENUES)for(const dx of [-v.w/2,v.w/2])for(const dz of [-v.d/2,v.d/2]){assert(!inWater(v.x+dx,v.z+dz));assert(roadDistance(v.x+dx,v.z+dz)>5,'buildings outside road');}
const hull=c=>({...routePose(c.route,c.distance),length:1.8,width:.9});
// Drive a complete day with fixed actors. No clock jump moves a car instantly.
let moved=Array(4).fill(0),arrivals=Array(4).fill(false);
for(let tick=0;tick<11000;tick++){
 const dt=.1,dayTime=20+tick*.02; // 08:00 onward, original 20-minute clock
 for(let i=0;i<4;i++){const c=cars[i],old=hull(c),proposed=showCarAdvance(c,dayTime,dt,cars);if(!c.parked)c.distance=trafficJamStep(c,proposed,cars,[],dt,{red:proposed===c.distance});finishShowCarStep(c,dayTime);const next=hull(c);assert(Math.hypot(next.x-old.x,next.z-old.z)<1.3,'continuous swept motion');moved[i]+=Math.hypot(next.x-old.x,next.z-old.z);if(dayTime>=140&&dayTime<170&&c.parked)arrivals[i]=true;}
 for(let i=0;i<4;i++)for(let j=0;j<i;j++)assert(!vehicleOverlap(hull(cars[i]),hull(cars[j])),'fleet hulls remain clear');
}
console.log({moved,arrivals,poses:cars.map(hull),distances:cars.map(c=>c.distance)});assert(moved.every(d=>d>2000),'all cars tour');assert(arrivals.every(Boolean),'all cars join evening meetup');
const saved=freshExplore();saved.showFleet=cars.map((c,i)=>({id:SHOW_CARS[i].id,distance:c.distance,parked:c.parked}));assert.deepEqual(normalizeExplore(JSON.parse(JSON.stringify(saved))).showFleet,saved.showFleet);assert.equal(normalizeShowFleet([{id:'turquoise',distance:Infinity}]).length,4);
const c=cars[0],before=c.distance;assert.equal(showCarAdvance(c,120,0),before);assert(amadorEvening(18)&&!amadorEvening(12));
console.log('PASS fixed fleet, connected dry tours, protected venues/bays, swept day/evening/departure, no overlaps, save/reload');

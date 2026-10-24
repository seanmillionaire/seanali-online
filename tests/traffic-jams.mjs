import assert from 'node:assert/strict';
import {trafficJamStep,trafficMoveClear} from '../games/adventure/traffic-yield.js';
import {routePose,TRAFFIC_ROUTES,trafficAdvance,spaceCityTraffic} from '../games/adventure/panama-state.js';
import {vehicleOverlap} from '../games/adventure/vehicle-contact.js';
const route=[{x:0,z:-50},{x:0,z:50},{x:30,z:50},{x:30,z:-50}];
let c={route,distance:50,speed:4};const obstacle={x:0,z:4.5,heading:0,length:2,width:1};let backed=false;
for(let i=0;i<400;i++){const old=c.distance,next=trafficJamStep(c,c.distance+.2,[c],[obstacle],.05);assert(trafficMoveClear(c,next,[c],[obstacle]));if(next<old)backed=true;assert(Math.abs(next-old)<=.201);c.distance=next;}
assert(!backed,'blocked car never reverses');assert(c.distance>42,'reversing is bounded');
const stopped=c.distance;for(let i=0;i<160;i++)c.distance=trafficJamStep(c,c.distance+.2,[c],[],.05);assert(c.distance>stopped+10,'traffic resumes after obstacle clears');
let red={route,distance:50,speed:4};for(let i=0;i<300;i++)red.distance=trafficJamStep(red,red.distance,[red],[],.05,{red:true});assert.equal(red.distance,50,'recovery does not override a red-light wait');
let boxed={route,distance:50,speed:4};const bounds=[{...obstacle,z:3.99},{...obstacle,z:-3.99}];for(let i=0;i<300;i++)boxed.distance=trafficJamStep(boxed,boxed.distance,[boxed],bounds,.05);assert.equal(boxed.distance,50,'no unsafe escape when boxed in');
assert.equal(trafficJamStep(c,c.distance+1,[c],[],0),c.distance,'pause');
console.log('PASS forward-only recovery, blocked rear, red lights, pause and restart');
const cross=[{x:-50,z:0},{x:50,z:0},{x:50,z:30},{x:-50,z:30}],a={route,distance:47,speed:4},b={route:cross,distance:47,speed:4};let freed=false;
for(let i=0;i<1200;i++){for(const car of [a,b]){const next=trafficJamStep(car,car.distance+.2,[a,b],[],.05);assert(trafficMoveClear(car,next,[a,b],[]));car.distance=next;}if(a.distance>55&&b.distance>55){freed=true;break;}}
assert(freed,'crossing deadlock must clear with both vehicles moving through');console.log('PASS crossing junction jam clears without overlapping vehicles');
// Adjacent clockwise city loops previously shared the exact centerline: a
// collection truck and an opposing taxi could permanently stop head-on.
const truck={route:TRAFFIC_ROUTES[0],distance:32,bus:true,speed:3.4},taxi={route:TRAFFIC_ROUTES[2],distance:90,speed:5};
const hull=c=>({...routePose(c.route,c.distance),length:c.bus?4.8:1.8,width:c.bus?1.15:.9});
for(let i=0;i<2400;i++){
 for(const car of [truck,taxi]){const next=trafficAdvance(car,[truck,taxi],i*.05,.05);car.distance=trafficJamStep(car,next,[truck,taxi],[],.05,{red:car.trafficRedStopped});}
 assert(!vehicleOverlap(hull(truck),hull(taxi)),'adjacent-loop truck and taxi hulls remain separated at the junction');
}
assert(truck.distance>224&&taxi.distance>282,'both vehicles complete two laps with lights, collision avoidance and no reversing');
console.log('PASS adjacent city lanes: truck and taxi complete multiple laps through the shared junction without overlap');

// Reproduce the entire initial fleet, including the collection truck. Sparse
// two-car tests did not catch overlapping spawns or bus rotation gridlock.
const fleet=Array.from({length:13},(_,i)=>{const bus=i>=10,police=i===9,taxi=i<7;return {route:TRAFFIC_ROUTES[bus?(i-10)%3:i%3],bus,utility:i===7||i===8,speed:(bus?6.4:police?5.5:taxi?5.3:4.7)+Math.sin(i*1.73)*.75};});
spaceCityTraffic(fleet);fleet.push({route:TRAFFIC_ROUTES[0],distance:routePose(TRAFFIC_ROUTES[0],0).length*.04,bus:true,speed:3.4});
const initial=fleet.map(c=>c.distance),fleetHull=c=>({...routePose(c.route,c.distance),length:c.bus?4.8:c.utility?2.35:1.8,width:c.bus?1.15:c.utility?1.14:.9});
for(let tick=0;tick<4800;tick++){
 for(const car of fleet){const next=trafficAdvance(car,fleet,tick*.05,.05);car.distance=trafficJamStep(car,next,fleet,[],.05,{red:car.trafficRedStopped});}
 for(let i=0;i<fleet.length;i++)for(let j=i+1;j<fleet.length;j++)assert(!vehicleOverlap(fleetHull(fleet[i]),fleetHull(fleet[j])),'all 14 traffic hulls stay apart');
}
fleet.forEach((car,i)=>assert(car.distance-initial[i]>2*routePose(car.route,0).length,'every vehicle completes multiple laps without permanent gridlock'));
console.log('PASS full 14-vehicle fleet: four simulated minutes, zero overlaps, every vehicle completes multiple laps');

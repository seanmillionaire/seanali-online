import {routePose} from './panama-state.js';
import {vehicleOverlap,vehicleEscapeClear} from './vehicle-contact.js';
const footprint=(car,distance=car.distance)=>({...routePose(car.route,distance),length:car.bus?4.8:car.utility?2.35:1.8,width:car.bus?1.15:car.utility?1.14:.9});
// A taxi caught touching the player creeps away along its road instead of
// remaining a permanent obstacle. No teleporting or passing through another car.
export function trafficYield(car,cars,player,dt){
 const obstacles=(Array.isArray(player)?player:[player]).filter(Boolean),current=footprint(car);if(!obstacles.some(p=>vehicleOverlap(current,p)))return null;
 const step=Math.min(.1,Math.max(0,dt))*4;
 for(const sign of [1]){const distance=car.distance+step*sign,next=footprint(car,distance);
  if(obstacles.every(p=>vehicleEscapeClear(next,p,current))&&cars.every(other=>other===car||vehicleEscapeClear(next,footprint(other),current)))return distance;
 }
 return car.distance;
}

// Sweep the entire proposed move, including corners, against every occupied hull.
export function trafficMoveClear(car,distance,cars,owned=[]){
 const delta=distance-car.distance,steps=Math.max(1,Math.ceil(Math.abs(delta)/.15));
 let current=footprint(car);const obstacles=[...owned,...(car.g?.userData?.pedestrians?.()||[]),...cars.filter(c=>c!==car).map(c=>footprint(c))];
 for(let i=1;i<=steps;i++){
  const next=footprint(car,car.distance+delta*i/steps);
  if(!obstacles.every(p=>vehicleEscapeClear(next,p,current)))return false;
  current=next;
 }
 return true;
}


let nextJamId=0;const jamState=new WeakMap();
// Forward-only recovery: yield, then recheck the lane and creep into safe space.
export function trafficJamStep(car,proposed,cars,obstacles,dt,{red=false}={}){
 dt=Math.min(.1,Math.max(0,dt));if(!dt||red)return car.distance;
 let jam=jamState.get(car);if(!jam){jam={id:nextJamId++,wait:0};jamState.set(car,jam);}
 const escape=trafficYield(car,cars,obstacles,dt),next=Math.max(car.distance,escape??proposed);
 if(next>car.distance&&trafficMoveClear(car,next,cars,obstacles)){jam.wait=0;return next;}
 jam.wait+=dt;if(jam.wait<.8+(jam.id%5)*.17)return car.distance;
 const creep=car.distance+dt*.65;
 return trafficMoveClear(car,creep,cars,obstacles)?creep:car.distance;
}

import {routePose} from './panama-state.js?v=225';
import {vehicleOverlap,vehicleEscapeClear} from './vehicle-contact.js?v=225';
const footprint=(car,distance=car.distance)=>({...routePose(car.route,distance),length:car.bus?4.8:car.utility?2.35:1.8,width:car.bus?1.15:car.utility?1.14:.9});
// A taxi caught touching the player creeps away along its road instead of
// remaining a permanent obstacle. No teleporting or passing through another car.
export function trafficYield(car,cars,player,dt){
 const obstacles=(Array.isArray(player)?player:[player]).filter(Boolean),current=footprint(car);if(!obstacles.some(p=>vehicleOverlap(current,p)))return null;
 const step=Math.min(.1,Math.max(0,dt))*4;
 for(const sign of [1,-1]){const distance=car.distance+step*sign,next=footprint(car,distance);
  if(obstacles.every(p=>vehicleEscapeClear(next,p,current))&&cars.every(other=>other===car||vehicleEscapeClear(next,footprint(other),current)))return distance;
 }
 return car.distance;
}

// Sweep the entire proposed move, including corners, against every occupied hull.
export function trafficMoveClear(car,distance,cars,owned=[]){
 const delta=distance-car.distance,steps=Math.max(1,Math.ceil(Math.abs(delta)/.15));
 let current=footprint(car);
 for(let i=1;i<=steps;i++){
  const next=footprint(car,car.distance+delta*i/steps);
  if(![...owned,...cars.filter(c=>c!==car).map(c=>footprint(c))].every(p=>vehicleEscapeClear(next,p,current)))return false;
  current=next;
 }
 return true;
}

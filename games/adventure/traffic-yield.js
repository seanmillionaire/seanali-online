import {routePose} from './panama-state.js?v=225';
import {vehicleOverlap,vehicleEscapeClear} from './vehicle-contact.js?v=225';
const footprint=(car,distance=car.distance)=>({...routePose(car.route,distance),length:car.bus?4.8:1.8,width:car.bus?1.15:.9});
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

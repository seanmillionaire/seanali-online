// Compress uneventful crossings in time while keeping saved geography intact.
import {inWater} from './explore-state.js?v=211';
import {freshwaterHabitat} from './geography.js?v=211';
export const SAIL_SPEED={harbor:15,offshore:52};
// Probe a corridor, not only the endpoint: small cays must slow the boat too.
export function sailingSpeedLimit(x,z,heading,{water=inWater,fresh=freshwaterHabitat}={}){
 if(fresh(x,z))return SAIL_SPEED.harbor;
 let clearance=64;
 for(let d=4;d<=64;d+=4){
  for(const angle of [0,-.45,.45,Math.PI/2,-Math.PI/2,Math.PI,Math.PI*.75,-Math.PI*.75]){
   const px=x+Math.sin(heading+angle)*d,pz=z+Math.cos(heading+angle)*d;
   if(!water(px,pz)||fresh(px,pz)){clearance=d;break;}
  }
  if(clearance<64)break;
 }
 const t=Math.max(0,Math.min(1,(clearance-12)/44));
 return SAIL_SPEED.harbor+(SAIL_SPEED.offshore-SAIL_SPEED.harbor)*t*t*(3-2*t);
}
export function sailingVelocity(current,limit,input,dt){
 // Braking is much stronger than acceleration; release always stops the boat.
 const wanted=limit*Math.max(0,Math.min(1,input));
 return current+(wanted-current)*(1-Math.exp(-Math.max(0,dt)*(wanted<current?7:2)));
}

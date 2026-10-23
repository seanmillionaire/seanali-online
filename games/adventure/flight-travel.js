// Air travel crosses the enlarged map quickly; slow down near a landing.
export const FLIGHT_SPEED={balloon:42,bird:32,birdFast:42,birdGround:8,balloonClimb:14,birdClimb:10};
export function birdTravelSpeed(altitude,fast=false){return altitude>3?(fast?FLIGHT_SPEED.birdFast:FLIGHT_SPEED.bird):FLIGHT_SPEED.birdGround;}
export function flightStep(x,z,vx,vz,dt,target=null){
 let dx=vx*dt,dz=vz*dt;
 if(target){const tx=target.x-x,tz=target.z-z,d=Math.hypot(tx,tz),step=Math.hypot(dx,dz);
  if(step>=d&&dx*tx+dz*tz>=0)return {x:target.x,z:target.z,arrived:true};
 }
 return {x:x+dx,z:z+dz,arrived:false};
}


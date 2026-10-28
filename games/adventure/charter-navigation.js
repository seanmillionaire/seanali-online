import {steerYacht,yachtHullClear} from './yacht-navigation.js';
export const CHARTER_BERTH={x:510,z:373,heading:-Math.PI/2};
export const CHARTER_KIOSK={x:510,z:364};
// Return along the exact swept, water-safe journey. Rental state is transient;
// it never changes a player's saved land position, inventory or owned boat.
export function createCharterNavigation(water){
 let pose={...CHARTER_BERTH,speed:0},trail=[{...pose}],returning=false;
 function record(p){const a=trail.at(-2),b=trail.at(-1);if(a&&Math.abs((b.x-a.x)*(p.z-b.z)-(b.z-a.z)*(p.x-b.x))<.00001&&(b.x-a.x)*(p.x-b.x)+(b.z-a.z)*(p.z-b.z)>=0)trail[trail.length-1]={...p};else trail.push({...p});}
 return {get pose(){return pose;},get returning(){return returning;},get trailLength(){return trail.length;},returnHome(){returning=true;},resume(){returning=false;},steer(dx,dz,dt){if(returning)return;if(trail.length>=8192){returning=true;return;}const next=steerYacht(pose,dx,dz,dt,water);if(Math.hypot(next.x-pose.x,next.z-pose.z)>.00001)record(next);pose=next;},update(dt){if(!returning||dt<=0)return false;let budget=Math.min(.1,dt)*6;while(budget>0&&trail.length>1){const target=trail[trail.length-2],dx=target.x-pose.x,dz=target.z-pose.z,d=Math.hypot(dx,dz),step=Math.min(budget,d,.2);if(d<.00001){trail.pop();continue;}const desired=Math.atan2(dx,dz),delta=Math.atan2(Math.sin(desired-pose.heading),Math.cos(desired-pose.heading));if(Math.abs(delta)>.05){const turned={...pose,heading:pose.heading+Math.sign(delta)*Math.min(Math.abs(delta),Math.min(.1,dt))};if(yachtHullClear(turned,water))pose=turned;return false;}const next={...pose,x:pose.x+dx/d*step,z:pose.z+dz/d*step,speed:6};if(!yachtHullClear(next,water))return false;pose=next;budget-=step;if(step>=d-.00001)trail.pop();}if(trail.length===1){returning=false;pose={...pose,speed:0};return true;}return false;}};
}

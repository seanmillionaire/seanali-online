import {darienApproachDistance} from './darien-highway.js';
import {jungleContains,jungleTrailPoint,snakeCorridorContains} from './east-jungle-layout.js';
import {inlandWaterDistance} from './rainforest-layout.js';
const hills=[[550,-40,8,24],[583,-92,11,25],[620,-43,16,28],[663,-108,12,23],[706,-50,15,26],[753,-112,10,21],[588,-160,8,20],[690,-164,14,25]];
export function darienRelief(x,z){const t=Math.max(0,Math.min(1,(x-490)/42));let ridge=0;for(const [a,b,h,r]of hills)ridge=Math.max(ridge,h*Math.exp(-((x-a)**2+(z-b)**2)/(r*r)));const trail=jungleTrailPoint(Math.max(0,Math.min(1,(x-550)/180))),clearance=Math.abs(z-trail.z),trailBlend=Math.max(0,Math.min(1,(clearance-3)/8));return 1.1+t*(ridge*trailBlend+(.5+.5*Math.sin(x*.16)*Math.cos(z*.12))*2.2*trailBlend);}
export const JUNGLE_BOULDERS=Array.from({length:100},(_,i)=>{const x=526+((i*73.73)%238),z=-175+((i*41.37)%196),r=2.0+(i%7)*.48;return {x,z,r,h:r*(1.05+(i%3)*.25),seed:i};}).filter(p=>darienApproachDistance(p.x,p.z)>p.r+13&&jungleContains(p.x,p.z)&&inlandWaterDistance(p.x,p.z)>p.r+5&&!snakeCorridorContains(p.x,p.z)&&Math.hypot(p.x-jungleTrailPoint((p.x-550)/180).x,p.z-jungleTrailPoint((p.x-550)/180).z)>p.r+7);
export const darienBoulderClear=(x,z,r=0)=>x<500||x>790||JUNGLE_BOULDERS.every(p=>Math.hypot(x-p.x,z-p.z)>p.r+r);

import {cityX} from './geography.js';

// One terrain-following court surface, shared by visuals and every participant.
export const FOOTBALL_PITCH={x:cityX(120),z:-23,w:20,d:14,lift:.175};
export function footballSurface(height,x,z){
 const p=FOOTBALL_PITCH;
 return Math.abs(x-p.x)<=p.w/2&&Math.abs(z-p.z)<=p.d/2?height(x,z)+p.lift:-Infinity;
}
export function footballGround(height,x,z){return Math.max(height(x,z),footballSurface(height,x,z));}

export const GYM_HEIGHT=4.2;
export const GYM_OBSTACLES=[{x:-8,z:-6,w:2.4,d:4.1},{x:-4.5,z:-6,w:2.4,d:4.1},{x:-12.7,z:5,w:1.4,d:7},{x:11.8,z:9.5,w:4,d:1.5},{x:10,z:4,w:1.4,d:1.4},{x:12,z:4,w:1.4,d:1.4},{x:-12,z:-12,w:1.5,d:1.5},{x:12,z:-12,w:1.5,d:1.5}];
export function stairZone(x,z){return x> -19.4&&x< -15.4&&z> -2&&z<14;}
export function stairHeight(x,z){return stairZone(x,z)?GYM_HEIGHT*Math.max(0,Math.min(1,(12-z)/12)):null;}
export function stairAccess(x,z,floor){if(stairZone(x,z))return true;return x> -15.8&&x< -14&&((floor===1&&z> -2&&z<0)||(floor===0&&z>12&&z<14));}
export function upperCanWalk(x,z){return Math.abs(x)<14.55&&Math.abs(z)<13.55&&!GYM_OBSTACLES.some(b=>Math.abs(x-b.x)<b.w/2+.28&&Math.abs(z-b.z)<b.d/2+.28);}
export function floorAt(x,z,floor=0){return stairZone(x,z)?z<=0?1:z>=12?0:floor:floor;}
export function floorHeight(x,z,floor=0){return stairHeight(x,z)??(floor===1?GYM_HEIGHT:0);}

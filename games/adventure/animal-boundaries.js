import {WORLD_BOUNDS,freshwaterHabitat} from './geography.js?v=224';
import {inWater,roadDistance,HIGHWAY_WIDTH,worldIslands} from './explore-state.js?v=224';
export const waterFriend=id=>id==='dori'||id==='pip';
// Pip can crawl on beaches; Dori needs water beneath her whole body.
export function animalClear(id,x,z,radius=1.4){
 if(!Number.isFinite(x)||!Number.isFinite(z)||Math.hypot(x/(WORLD_BOUNDS.x-2),z/(WORLD_BOUNDS.z-2))>=1||roadDistance(x,z)<=HIGHWAY_WIDTH/2+radius)return false;
 if(freshwaterHabitat(x,z))return false;
 if(id==='pip')return !worldIslands.some(p=>['pizzaCity','colon'].includes(p.id)&&Math.hypot((x-p.x)/(p.rx+radius),(z-p.z)/(p.rz+radius))<1);
 for(let i=0;i<9;i++){const a=i*Math.PI/4,r=i===8?0:radius;if(!inWater(x+Math.sin(a)*r,z+Math.cos(a)*r)||freshwaterHabitat(x+Math.sin(a)*r,z+Math.cos(a)*r))return false;}
 return true;
}
export function recoverAnimal(id,x,z,radius=1.4){
 if(animalClear(id,x,z,radius))return {x,z};
 for(let r=2;r<=32;r+=2)for(let i=0;i<16;i++){const a=i*Math.PI/8,nx=x+Math.sin(a)*r,nz=z+Math.cos(a)*r;if(animalClear(id,nx,nz,radius))return {x:nx,z:nz};}
 // A verified open-water home is also safe for a turtle.
 return {x:8,z:24};
}
export function animalStep(id,x,z,tx,tz,radius=1.4){
 const start=recoverAnimal(id,x,z,radius);x=start.x;z=start.z;
 const distance=Math.hypot(tx-x,tz-z),steps=Math.max(1,Math.ceil(distance/.4)),dx=(tx-x)/steps,dz=(tz-z)/steps;
 for(let i=0;i<steps;i++){if(animalClear(id,x+dx,z+dz,radius)){x+=dx;z+=dz;}else if(Math.abs(dx)>1e-8&&animalClear(id,x+dx,z,radius)){x+=dx;}else if(Math.abs(dz)>1e-8&&animalClear(id,x,z+dz,radius)){z+=dz;}else break;}
 return {x,z};
}

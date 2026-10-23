// Transient charter navigation: rental movement never overwrites the land save.
export function yachtHullClear(p,water){
 // Reserve turning room as well as the hull, so reaching shore cannot
 // trap the vessel with no safe heading to turn back into open water.
 for(let i=0;i<32;i++){const a=i*Math.PI/16;if(!water(p.x+Math.sin(a)*7.4,p.z+Math.cos(a)*7.4))return false;}
 for(const dx of [-4,0,4])for(const dz of [-4,0,4])if(!water(p.x+dx,p.z+dz))return false;
 return true;
}
export function steerYacht(p,dx,dz,dt,water){
 dt=Math.min(.1,Math.max(0,dt));const strength=Math.min(1,Math.hypot(dx,dz));
 if(strength<.08||!dt)return {...p,speed:0};
 const desired=Math.atan2(dx,dz),delta=Math.atan2(Math.sin(desired-p.heading),Math.cos(desired-p.heading));
 const turn=Math.max(-dt,Math.min(dt,delta)),heading=p.heading+turn;
 // Rotate only if the whole hull still fits, even when turning beside shore.
 const turned={...p,heading};if(!yachtHullClear(turned,water))return {...p,speed:0};
 const speed=10*strength*Math.max(0,Math.cos(delta)),distance=speed*dt,n=Math.max(1,Math.ceil(distance/.2));
 let result={...turned,speed};
 for(let i=0;i<n;i++){const next={...result,x:result.x+Math.sin(heading)*distance/n,z:result.z+Math.cos(heading)*distance/n};if(!yachtHullClear(next,water))return {...result,speed:0};result=next;}
 return result;
}

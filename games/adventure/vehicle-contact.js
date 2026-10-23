// Oriented vehicle footprints: keep adjacent lanes open and stop crossing hulls.
export function vehicleOverlap(a,b,margin=.18){
 const axes=[a.heading||0,b.heading||0].flatMap(h=>[[Math.sin(h),Math.cos(h)],[Math.cos(h),-Math.sin(h)]]);
 const radius=(v,axis)=>{const h=v.heading||0;return Math.abs(axis[0]*Math.sin(h)+axis[1]*Math.cos(h))*(v.length||2.35)+Math.abs(axis[0]*Math.cos(h)-axis[1]*Math.sin(h))*(v.width||1.25);};
 return axes.every(axis=>Math.abs((a.x-b.x)*axis[0]+(a.z-b.z)*axis[1])<radius(a,axis)+radius(b,axis)+margin);
}
export function trafficFootprint(v){return {x:v.g.position.x,z:v.g.position.z,heading:v.g.rotation.y,length:v.bus?4.8:v.utility?2.35:1.8,width:v.bus?1.15:v.utility?1.14:.9};}

// Minimum separating translation of oriented hulls, including the safety gap.
export function vehiclePenetration(a,b,margin=.18){
 let depth=Infinity;
 for(const h of [a.heading||0,b.heading||0])for(const axis of [[Math.sin(h),Math.cos(h)],[Math.cos(h),-Math.sin(h)]]){
  const radius=v=>{const h=v.heading||0;return Math.abs(axis[0]*Math.sin(h)+axis[1]*Math.cos(h))*(v.length||2.35)+Math.abs(axis[0]*Math.cos(h)-axis[1]*Math.sin(h))*(v.width||1.25);};
  depth=Math.min(depth,radius(a)+radius(b)+margin-Math.abs((a.x-b.x)*axis[0]+(a.z-b.z)*axis[1]));
 }
 return Math.max(0,depth);
}
export function vehicleEscapeClear(next,obstacle,from){
 const after=vehiclePenetration(next,obstacle);
 if(after===0)return true;
 if(!from)return false;
 // Compare at the requested heading so a direction change can back out of contact.
 const before=vehiclePenetration(from,obstacle),turned=vehiclePenetration({...from,heading:next.heading},obstacle);
 return before>0&&after<=turned+1e-7&&Math.hypot(next.x-obstacle.x,next.z-obstacle.z)>Math.hypot(from.x-obstacle.x,from.z-obstacle.z)+1e-7;
}

// Try both doors and the ends; never deposit the passenger inside a blocked hull.
export function safeVehicleExit(car,canStand){
 const h=car.heading||0,c=Math.cos(h),s=Math.sin(h);
 for(const r of [2.7,3.5,4.5,5.5])for(const [side,along] of [[1,0],[-1,0],[1,1],[-1,1],[0,1],[0,-1],[1,-1],[-1,-1]]){
  const x=car.x+c*side*r+s*along*r,z=car.z-s*side*r+c*along*r;
  if(canStand(x,z))return {x,z};
 }
 return null;
}

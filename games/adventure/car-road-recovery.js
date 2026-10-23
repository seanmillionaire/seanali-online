// Recover onto a nearby road with its direction, never into a random courtyard.
export function nearestRoadParking(origin,paths,clear,maxDistance=80){
 const candidates=[];
 for(const path of paths)for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);if(!length)continue;
  const along=Math.max(0,Math.min(length,((origin.x-a[0])*dx+(origin.z-a[1])*dz)/length));
  for(const shift of [0,-5,5,-10,10]){const t=Math.max(0,Math.min(length,along+shift))/length;
   const p={x:a[0]+dx*t,z:a[1]+dz*t,heading:Math.atan2(dx,dz)};
   p.distance=Math.hypot(p.x-origin.x,p.z-origin.z);if(p.distance<=maxDistance)candidates.push(p);
  }
 }
 candidates.sort((a,b)=>a.distance-b.distance);
 for(const p of candidates)for(const turn of [0,Math.PI]){const pose={x:p.x,z:p.z,heading:p.heading+turn};if(clear(pose))return pose;}
 return null;
}

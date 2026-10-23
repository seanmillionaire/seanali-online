// Keep the entire aircraft above terrain and elevated players, including flight mounts.
export function flightAltitude(height,x,z,dx,dz,playerY=0){
 let floor=Math.max(110,playerY+40);
 for(let d=-300;d<=330;d+=10){
  for(const side of [-18,0,18])floor=Math.max(floor,height(x+dx*d-dz*side,z+dz*d+dx*side)+40);
 }
 return floor;
}
export function clearFlightAltitude(current,playerY,groundY){
 return Math.max(current,playerY+40,groundY+40);
}

// A scenic approach separates the city streets from the jungle tour entrance.
export const DARIEN_APPROACH=[[485,-57],[510,-60],[530,-90],[530,-139],[548,-162],[574,-148],[574,-117],[550,-90],[550,-68]];
export function darienApproachDistance(x,z){let distance=Infinity;for(let i=1;i<DARIEN_APPROACH.length;i++){const a=DARIEN_APPROACH[i-1],b=DARIEN_APPROACH[i],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));distance=Math.min(distance,Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz));}return distance;}

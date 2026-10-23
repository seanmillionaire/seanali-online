// An organic eastern land extension, joined to the existing city's eastern edge.
export const JUNGLE_LOBES=[{x:515,z:-62,rx:57,rz:46},{x:570,z:-58,rx:70,rz:65},{x:640,z:-78,rx:86,rz:86},{x:713,z:-65,rx:75,rz:82},{x:735,z:-132,rx:46,rz:62}];
export const jungleContains=(x,z)=>x>460&&JUNGLE_LOBES.some(p=>Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)<1+.025*Math.sin(x*.09+z*.11));
export const jungleTrailPoint=t=>({x:550+180*t,z:-68-28*Math.sin(t*4.4)-20*t});
export const jungleTrailClear=(x,z)=>Array.from({length:50},(_,i)=>jungleTrailPoint(i/49)).every(p=>Math.hypot(x-p.x,z-p.z)>3.4);
// One large animal follows a broad loop through a visible forest clearing.
export const snakeCorridorContains=(x,z)=>Math.abs(Math.hypot((x-645)/48,(z+104)/23)-1)<.38;
export function giantSnakePose(time=0){const a=time*.022;return {x:645+Math.cos(a)*48,z:-104+Math.sin(a)*23,heading:Math.atan2(-Math.sin(a)*48,Math.cos(a)*23)};}

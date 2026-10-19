export const CRUISE_FARE=10;
export const CRUISE_BOARD={x:-67,z:-56};
export const CRUISE_DOCK={x:-44,z:-74};
// One closed circuit around every island, in navigable open water.
export const CRUISE_STOPS=[
 [-44,-74],[-25,-74],[-25,-145],[-70,-145],[-125,-137],[-175,-110],
 [-190,-55],[-190,10],[-175,80],[-125,135],[-35,150],[65,145],
 [145,100],[180,35],[170,-45],[120,-105],[65,-145],[-25,-145],[-25,-74],[-44,-74]
].map(([x,z])=>({x,z}));
const segments=CRUISE_STOPS.slice(1).map((p,i)=>Math.hypot(p.x-CRUISE_STOPS[i].x,p.z-CRUISE_STOPS[i].z));
export const CRUISE_LENGTH=segments.reduce((a,b)=>a+b,0);
export const CRUISE_SPEED=7;
export function normalizeCruise(raw){
 const tickets=Number.isFinite(raw?.tickets)?Math.max(0,Math.min(9999,Math.floor(raw.tickets))):0;
 return {tickets,completed:Math.min(tickets,Math.max(0,Math.floor(Number(raw?.completed)||0))),
  active:raw?.active===true&&tickets>0,distance:Number.isFinite(raw?.distance)?Math.max(0,Math.min(CRUISE_LENGTH,raw.distance)):0};
}
export function cruisePose(distance){
 let remaining=Math.max(0,Math.min(CRUISE_LENGTH,distance));
 for(let i=0;i<segments.length;i++){
  if(remaining<=segments[i]||i===segments.length-1){
   const a=CRUISE_STOPS[i],b=CRUISE_STOPS[i+1],t=remaining/segments[i];
   return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,heading:Math.atan2(b.x-a.x,b.z-a.z),progress:Math.min(1,distance/CRUISE_LENGTH)};
  }remaining-=segments[i];
 }
}
export function buyCruise(cruise,balance){
 if(cruise.active||cruise.tickets>=9999||balance<CRUISE_FARE)return false;
 cruise.tickets++;cruise.active=true;cruise.distance=0;return true;
}
export function advanceCruise(cruise,dt,active){
 if(!cruise.active||!active)return false;
 cruise.distance=Math.min(CRUISE_LENGTH,cruise.distance+Math.max(0,Math.min(dt,.1))*CRUISE_SPEED);
 if(cruise.distance<CRUISE_LENGTH)return false;
 cruise.active=false;cruise.completed++;cruise.distance=0;return true;
}

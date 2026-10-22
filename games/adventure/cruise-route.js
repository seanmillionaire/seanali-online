import {CANAL_WATERWAY,CANAL_TERMINAL,CANAL_LAYOUT_VERSION} from './geography.js?v=225';
export const CRUISE_FARE=10;
export const CRUISE_BOARD=CANAL_TERMINAL;
export const CRUISE_DOCK={x:285,z:15};
// One vessel makes the Pacific–Atlantic transit and returns to its terminal.
export const CRUISE_STOPS=[...CANAL_WATERWAY.slice(1),...CANAL_WATERWAY.slice(1,-1).reverse()].map(([x,z])=>({x,z}));
const segments=CRUISE_STOPS.slice(1).map((p,i)=>Math.hypot(p.x-CRUISE_STOPS[i].x,p.z-CRUISE_STOPS[i].z));
export const CRUISE_LENGTH=segments.reduce((a,b)=>a+b,0);
export const CRUISE_SPEED=4.5;
export function normalizeCruise(raw){
 const tickets=Number.isFinite(raw?.tickets)?Math.max(0,Math.min(9999,Math.floor(raw.tickets))):0;
 return {layoutVersion:CANAL_LAYOUT_VERSION,tickets,completed:Math.min(tickets,Math.max(0,Math.floor(Number(raw?.completed)||0))),
  active:raw?.active===true&&tickets>0,distance:raw?.layoutVersion===CANAL_LAYOUT_VERSION&&Number.isFinite(raw?.distance)?Math.max(0,Math.min(CRUISE_LENGTH,raw.distance)):0};
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
export function advanceCruise(cruise,dt,active,speed=CRUISE_SPEED){
 if(!cruise.active||!active)return false;
 cruise.distance=Math.min(CRUISE_LENGTH,cruise.distance+Math.max(0,Math.min(dt,.1))*Math.max(0,Math.min(12,Number.isFinite(speed)?speed:CRUISE_SPEED)));
 if(cruise.distance<CRUISE_LENGTH)return false;
 cruise.active=false;cruise.completed++;cruise.distance=0;return true;
}

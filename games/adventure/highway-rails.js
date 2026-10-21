// Selected remote barriers stay outside drivable lanes and away from turnoffs.
import {MAINLAND_ROADS,HIGHWAY_CURVES,HIGHWAY_WIDTH,roadDistance} from './explore-state.js?v=213';
const eligible=new Set(['cityToColon','cityToBaru']);
const roadNodes=Object.entries(MAINLAND_ROADS).flatMap(([id,pts])=>pts.map(([x,z])=>({id,x,z})));
export const HIGHWAY_JUNCTIONS=roadNodes.filter(p=>roadNodes.some(q=>q.id!==p.id&&Math.hypot(q.x-p.x,q.z-p.z)<.01))
 .filter((p,i,a)=>a.findIndex(q=>Math.hypot(q.x-p.x,q.z-p.z)<.01)===i)
 .map(({x,z})=>({x,z}));
export function routePointDistance(x,z,points){
 let best=Infinity;
 for(let i=1;i<points.length;i++){
  const [ax,az]=points[i-1],[bx,bz]=points[i],dx=bx-ax,dz=bz-az,len2=dx*dx+dz*dz;
  const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(len2||1)));
  best=Math.min(best,Math.hypot(x-ax-dx*t,z-az-dz*t));
 }
 return best;
}
export function planHighwayGuardrails(){
 const rails=[],offset=HIGHWAY_WIDTH/2+1.05;
 const shoulder=HIGHWAY_WIDTH/2+.55,crossing=HIGHWAY_WIDTH/2+6;
 for(const [road,points] of Object.entries(HIGHWAY_CURVES)){
  if(!eligible.has(road))continue;
  for(const side of [-1,1]){
   let run=[];
   const flush=()=>{if(run.length>=3)rails.push(...run);run=[];};
   for(let i=1;i<points.length;i++){
    const [ax,az]=points[i-1],[bx,bz]=points[i],dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz);
    if(len<.001){flush();continue;}
    const angle=Math.atan2(dx,dz),ox=Math.cos(angle)*side*offset,oz=-Math.sin(angle)*side*offset;
    const item={road,side,x:(ax+bx)/2+ox,z:(az+bz)/2+oz,angle,length:len+.12,index:i};
    // No barriers on the city exit, Gorgona connector, town, or beach road.
    // Keep only the remote Colón waterside and Barú mountain shoulders.
    if(road==='cityToColon'&&(item.x>42||item.z> -100)){flush();continue;}
    if(road==='cityToBaru'&&item.x> -43){flush();continue;}
    // Check both beam ends and midpoint so curve corners stay off the asphalt.
    const valid=[0,.5,1].every(t=>{
     const x=ax+dx*t+ox,z=az+dz*t+oz;
     if(Math.hypot((x-120)/58,(z+50)/48)<1.22||roadDistance(x,z)<=shoulder)return false;
     if(HIGHWAY_JUNCTIONS.some(p=>Math.hypot(x-p.x,z-p.z)<17))return false;
     return Object.entries(HIGHWAY_CURVES).every(([name,curve])=>name===road||routePointDistance(x,z,curve)>crossing);
    });
    if(!valid){flush();continue;}
    run.push(item);
   }
   flush();
  }
 }
 return rails.map(p=>({...p,post:p.index%2===0}));
}

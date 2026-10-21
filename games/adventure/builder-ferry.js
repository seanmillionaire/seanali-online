import {WORLD_EXTENT} from './geography.js?v=211';
// Water-only ferry navigation for Mateo and Sofia. Coastal ports and ocean
// routes are cached; there is never a boat or building traveling over terrain.
import {inWater} from './explore-state.js?v=211';
import {BUILDER_AREAS} from './builder-projects.js?v=211';
const GRID=12,LEFT=WORLD_EXTENT.left,RIGHT=-WORLD_EXTENT.left,TOP=WORLD_EXTENT.top,BOTTOM=-WORLD_EXTENT.top;
const W=Math.floor((RIGHT-LEFT)/GRID)+1,H=Math.floor((BOTTOM-TOP)/GRID)+1;
let wet=null;
const safe=(x,z)=>inWater(x,z)&&inWater(x+1.3,z)&&inWater(x-1.3,z)&&inWater(x,z+1.3)&&inWater(x,z-1.3);
const clearSegment=(a,b)=>{
 const len=Math.hypot(a.x-b.x,a.z-b.z);
 for(let d=0;d<len;d+=.5){const t=d/(len||1);if(!safe(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t))return false;}
 return safe(b.x,b.z);
};
function grid(){if(wet)return wet;wet=new Uint8Array(W*H);
 for(let z=0;z<H;z++)for(let x=0;x<W;x++)wet[z*W+x]=safe(LEFT+x*GRID,TOP+z*GRID)?1:0;
 return wet;
}
const point=n=>({x:LEFT+(n%W)*GRID,z:TOP+Math.floor(n/W)*GRID});
export function builderWaterPort(area){
 const center=BUILDER_AREAS.find(a=>a.id===area)||area;
 if(!center)return null;
 // The Colón rainforest now sits at the end of a long peninsula. Depart from
 // the OPEN Caribbean, not its internal Gatún lagoon (which has no sea route).
 if(center.id==='colon'&&safe(-56,-435))return {x:-56,z:-435};
 let best=null,score=Infinity;
 for(let ring=1;ring<=10;ring++)for(let k=0;k<64;k++){
  const a=k*Math.PI/32,x=center.x+Math.cos(a)*(center.rx+ring*2.8),
   z=center.z+Math.sin(a)*(center.rz+ring*2.8);
  if(!safe(x,z))continue;
  // Prefer seaward/south-east departures; skip harbors inside activity sites.
  const value=ring*2.8+(Math.sin(a)<0?5:0)+(Math.cos(a)<0?2:0);
  if(value<score){best={x,z};score=value;}
 }
 return best;
}
const cache=new Map();
function findRoute(from,to){
 const start=builderWaterPort(from),finish=builderWaterPort(to);
 if(!start||!finish)return [];
 const occupancy=grid();
 const nearest=(target)=>{
  let best=-1,dist=Infinity;
  for(let j=0;j<occupancy.length;j++){if(!occupancy[j])continue;
   const p=point(j),d=Math.hypot(p.x-target.x,p.z-target.z);
   if(d<dist){dist=d;best=j;}
  }
  return best;
 };
 const first=nearest(start),last=nearest(finish);
 if(first<0||last<0)return [];
 const prev=new Int32Array(W*H).fill(-1),queue=new Int32Array(W*H),visited=new Uint8Array(W*H);
 let tail=1,head=0;queue[0]=first;visited[first]=1;
 const steps=[-1,1,-W,W,-W-1,-W+1,W-1,W+1];
 while(head<tail){
  const n=queue[head++];if(n===last)break;const nx=n%W,nz=Math.floor(n/W);
  for(const delta of steps){const m=n+delta,mx=m%W,mz=Math.floor(m/W);
   if(mx<0||mx>=W||mz<0||mz>=H||Math.abs(mx-nx)>1||Math.abs(mz-nz)>1||visited[m]||!occupancy[m])continue;
   // Prevent diagonal shortcuts through coast tips.
   if(mx!==nx&&mz!==nz&&(!occupancy[nz*W+mx]||!occupancy[mz*W+nx]))continue;
   if(!clearSegment(point(n),point(m)))continue;
   visited[m]=1;prev[m]=n;queue[tail++]=m;
  }
 }
 if(!visited[last])return [];
 const nodes=[];for(let n=last;n!==-1;n=prev[n])nodes.push(point(n));nodes.reverse();
 // Only drop turns when every intervening sample remains in navigable water.
 const visible=clearSegment;
 const complete=[start,...nodes,finish].filter((p,i,a)=>!i||Math.hypot(p.x-a[i-1].x,p.z-a[i-1].z)>.001);
 if(complete.slice(1).some((p,i)=>!visible(complete[i],p)))return [];
 const compressed=[complete[0]];let i=0;
 while(i<complete.length-1){
  let next=i+1;
  for(let j=complete.length-1;j>i+1;j--)if(visible(complete[i],complete[j])){next=j;break;}
  compressed.push(complete[next]);i=next;
 }
 return compressed;
}
export function builderFerryRoute(from,to){
 const key=from+'>'+to;
 if(!cache.has(key))cache.set(key,findRoute(from,to));
 return cache.get(key);
}
export function builderSailPosition(from,to,progress){
 const route=builderFerryRoute(from,to);
 if(route.length<2)return null;
 let total=0;const lengths=route.slice(1).map((p,i)=>{const v=Math.hypot(p.x-route[i].x,p.z-route[i].z);total+=v;return v;});
 let at=Math.max(0,Math.min(1,progress))*total;
 for(let i=0;i<lengths.length;i++){
  if(at<=lengths[i]||i===lengths.length-1){const a=route[i],b=route[i+1],t=Math.min(1,at/(lengths[i]||1));
   return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,heading:Math.atan2(b.x-a.x,b.z-a.z)};
  }at-=lengths[i];
 }
 return null;
}

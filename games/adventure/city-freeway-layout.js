// A broad, closed oval outside downtown and Costa del Este. World-layout v3.
export const CITY_FREEWAY_STOP={id:'cityFreeway',x:430,z:-148,icon:'🛣️',kind:'mainland',en:'City freeway loop',es:'Anillo de la ciudad'};
export const CITY_FREEWAY={left:330,right:430,z:-60,radius:88,width:17.5};
export function freewayDistance(x,z){const f=CITY_FREEWAY;return Math.abs(Math.hypot(x-Math.max(f.left,Math.min(f.right,x)),z-f.z)-f.radius);}
export function freewayLand(x,z){const f=CITY_FREEWAY;return x>f.left-f.radius-16&&x<f.right+f.radius+16&&Math.hypot(x-Math.max(f.left,Math.min(f.right,x)),z-f.z)<f.radius+16;}
function oval(){const f=CITY_FREEWAY,p=[];for(let i=0;i<50;i++)p.push([f.left+(f.right-f.left)*i/50,f.z-f.radius]);for(let i=0;i<160;i++){const a=-Math.PI/2+i*Math.PI/160;p.push([f.right+f.radius*Math.cos(a),f.z+f.radius*Math.sin(a)]);}for(let i=0;i<50;i++)p.push([f.right-(f.right-f.left)*i/50,f.z+f.radius]);for(let i=0;i<160;i++){const a=Math.PI/2+i*Math.PI/160;p.push([f.left+f.radius*Math.cos(a),f.z+f.radius*Math.sin(a)]);}p.push([...p[0]]);return p;}
// Insert the same exact crossing in both paths. Routing, grading, lane paint
// and collisions then share real junctions instead of nearby unconnected roads.
export function integrateCityFreeway(roads){const ring=oval(),ringHits=new Map(),result={...roads};for(const name of ['cityToGorgona','cityToColon']){const path=roads[name],hits=new Map();for(let i=1;i<path.length;i++)for(let j=1;j<ring.length;j++){const a=path[i-1],b=path[i],c=ring[j-1],d=ring[j],ux=b[0]-a[0],uz=b[1]-a[1],vx=d[0]-c[0],vz=d[1]-c[1],den=ux*vz-uz*vx;if(Math.abs(den)<1e-9)continue;const dx=c[0]-a[0],dz=c[1]-a[1],t=(dx*vz-dz*vx)/den,s=(dx*uz-dz*ux)/den;if(t<=1e-8||t>=1-1e-8||s<0||s>=1)continue;const point=[a[0]+ux*t,a[1]+uz*t];if(!hits.has(i))hits.set(i,[]);hits.get(i).push({t,point});if(!ringHits.has(j))ringHits.set(j,[]);ringHits.get(j).push({t:s,point});}result[name]=path.flatMap((p,i)=>[...(hits.get(i)||[]).sort((a,b)=>a.t-b.t).map(h=>h.point),p]);}
 result.cityFreeway=ring.flatMap((p,i)=>[...(ringHits.get(i)||[]).sort((a,b)=>a.t-b.t).map(h=>h.point),p]);result.cityFreewayEast=[[485,-57],[503,-57],[518,-60]];return result;}


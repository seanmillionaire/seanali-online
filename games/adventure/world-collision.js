import {homeLot} from './mansion-state.js?v=211';
import {regionalBlocked} from './regional-layout.js?v=211';
import {CITY_ALL_PLOTS} from './city-layout.js?v=211';
import {districtVehicleBlocked} from './expanded-districts.js?v=211';
import {ruralBlocks} from './rural-towns.js?v=211';
import {estateBlocked} from './estate.js?v=211';
import {traversable} from './explore-state.js?v=211';

// Shared walking/skating solids; speed never changes which objects are solid.
export function createWorldCollision({state,trees=[],rocks=[]}){
 const cells=new Map(),size=12;
 const add=(p)=>{const r=p.r+.32;for(let ix=Math.floor((p.x-r)/size);ix<=Math.floor((p.x+r)/size);ix++)for(let iz=Math.floor((p.z-r)/size);iz<=Math.floor((p.z+r)/size);iz++){const key=ix+','+iz;if(!cells.has(key))cells.set(key,[]);cells.get(key).push(p);}};
 trees.forEach(t=>add({x:t.x,z:t.z,r:Math.max(.16,(t.scale??t.size??1)*.28)}));rocks.forEach(add);
 return {clear(x,z){
  const lot=homeLot(state.world);if(lot&&state.world.mansion.stage>0&&Math.abs(x-lot.x)<10.4&&Math.abs(z-lot.z)<8.7)return false;
  if(regionalBlocked(x,z,state.world)||!traversable(x,z)||ruralBlocks(x,z,.32)||estateBlocked(state.world,x,z)||districtVehicleBlocked(x,z))return false;
  if(CITY_ALL_PLOTS.some(p=>p.solid!==false&&p.id!=='football'&&Math.abs(x-p.x)<p.w/2+.30&&Math.abs(z-p.z)<p.d/2+.30))return false;
  return !(cells.get(Math.floor(x/size)+','+Math.floor(z/size))||[]).some(p=>Math.hypot(p.x-x,p.z-z)<p.r+.32);
 }};
}

// Query the actual rendered road triangles, not the soil below them. Includes
// sloped/curved highway ribbons and city surfaces made by surfaceMesh().
export function createRoadSurfaceSampler(T,scene){
 const cells=new Map(),size=12,a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();let count=0;
 scene.updateMatrixWorld(true);
 scene.traverse(mesh=>{
  if(!mesh.isMesh||!mesh.userData.roadSurface)return;
  const g=mesh.geometry,p=g.attributes.position,ix=g.index?.array||Array.from({length:p.count},(_,i)=>i);
  for(let i=0;i<ix.length;i+=3){a.fromBufferAttribute(p,ix[i]).applyMatrix4(mesh.matrixWorld);b.fromBufferAttribute(p,ix[i+1]).applyMatrix4(mesh.matrixWorld);c.fromBufferAttribute(p,ix[i+2]).applyMatrix4(mesh.matrixWorld);
   const det=(b.z-c.z)*(a.x-c.x)+(c.x-b.x)*(a.z-c.z);if(Math.abs(det)<1e-9)continue;
   const q={ax:a.x,ay:a.y,az:a.z,bx:b.x,by:b.y,bz:b.z,cx:c.x,cy:c.y,cz:c.z,det};count++;
   for(let x=Math.floor(Math.min(a.x,b.x,c.x)/size);x<=Math.floor(Math.max(a.x,b.x,c.x)/size);x++)for(let z=Math.floor(Math.min(a.z,b.z,c.z)/size);z<=Math.floor(Math.max(a.z,b.z,c.z)/size);z++){const key=x+','+z;if(!cells.has(key))cells.set(key,[]);cells.get(key).push(q);}
  }
 });
 return {count,height(x,z){let y=-Infinity;for(const q of cells.get(Math.floor(x/size)+','+Math.floor(z/size))||[]){const u=((q.bz-q.cz)*(x-q.cx)+(q.cx-q.bx)*(z-q.cz))/q.det,v=((q.cz-q.az)*(x-q.cx)+(q.ax-q.cx)*(z-q.cz))/q.det,w=1-u-v;if(u>=-1e-4&&v>=-1e-4&&w>=-1e-4)y=Math.max(y,u*q.ay+v*q.by+w*q.cy);}return y;}};
}

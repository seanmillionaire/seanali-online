import {DESTINATIONS} from './geography.js?v=211';
import {roadDistance,HIGHWAY_WIDTH,isletHeight,inWater,worldIslands} from './explore-state.js?v=211';
// Low-density town parcels leave room for streets, yards, views and future
// player buildings. The planner is shared with forest exclusions and tests.
export const RURAL_TOWNS=[
 {id:'volcanTown',...Object.fromEntries(['x','z'].map((k,i)=>[k,DESTINATIONS.volcanTown.at[i]])),en:'Volcán',es:'Volcán',color:'#dfb27c'},
 {id:'boquete',...Object.fromEntries(['x','z'].map((k,i)=>[k,DESTINATIONS.boquete.at[i]])),en:'Boquete',es:'Boquete',color:'#a6c6a0'}
];
let parcelCache;
export function ruralParcels(){
 if(parcelCache)return parcelCache;
 const plots=[];
 for(const town of RURAL_TOWNS){
  const candidates=[];
  for(let dx=-35;dx<=35;dx+=14)for(let dz=-28;dz<=28;dz+=14)candidates.push({x:town.x+dx,z:town.z+dz});
  candidates.sort((a,b)=>Math.hypot(a.x-town.x,a.z-town.z)-Math.hypot(b.x-town.x,b.z-town.z));
  let count=0;
  for(const p of candidates){
   const w=6,d=6.5,radius=Math.hypot(w,d)/2;
   if(roadDistance(p.x,p.z)<HIGHWAY_WIDTH/2+radius+2||inWater(p.x,p.z))continue;
   const ys=[[-1,-1],[1,-1],[-1,1],[1,1]].map(([sx,sz])=>isletHeight(p.x+sx*w/2,p.z+sz*d/2));
   if(Math.min(...ys)<.2||Math.max(...ys)-Math.min(...ys)>2.2)continue;
   // Keep the trailhead and mountain path separate from town construction.
   const mountain=worldIslands.find(p=>p.id==='sunset');if(Math.hypot((p.x-mountain.x)/mountain.rx,(p.z-mountain.z)/mountain.rz)<.80)continue;
   plots.push({...p,w,d,town:town.id,color:town.color,base:Math.max(...ys)});if(++count===8)break;
  }
 }
 parcelCache=plots;return plots;
}
export const ruralBlocks=(x,z,margin=.85)=>ruralParcels().some(p=>Math.abs(x-p.x)<p.w/2+margin&&Math.abs(z-p.z)<p.d/2+margin);
export function createRuralTowns({T,scene,make,mat,box,geometry,height,state=null}){
 const root=new T.Group();root.name='Western Panama · spacious Volcán and Boquete towns';scene.add(root);
 const stone=mat('#a49b85'),roof=mat('#a65b45'),timber=mat('#735a40'),glass=mat('#98cad4'),wall=mat('#f2deaf');
 const roofs=[roof,mat('#5d8173'),mat('#637a95')];
 const roofGeometry=geometry(new T.BufferGeometry());roofGeometry.setAttribute('position',new T.Float32BufferAttribute([-3.4,3.4,-3.6,3.4,3.4,-3.6,0,5,-3.6,-3.4,3.4,3.6,3.4,3.4,3.6,0,5,3.6],3));roofGeometry.setIndex([0,2,1,3,4,5,0,3,5,0,5,2,2,5,4,2,4,1]);roofGeometry.computeVertexNormals();
 const colors=new Map(RURAL_TOWNS.map(t=>[t.color,mat(t.color)]));
 for(const [i,p]of ruralParcels().entries()){
  if(state?.world?.estate?.buildings?.some(b=>Math.hypot(b.x-p.x,b.z-p.z)<11))continue;
  const house=new T.Group();house.name=p.town+' courtyard home '+i;house.position.set(p.x,p.base,p.z);root.add(house);
  for(const sx of [-1,1])for(const sz of [-1,1]){
   const x=p.x+sx*2.6,z=p.z+sz*2.8,ground=height(x,z),h=Math.max(.15,p.base-ground+.2);
   make(box,stone,sx*2.6,-h/2,sz*2.8,.5,h,.5,house);
  }
  make(box,stone,0,.12,0,p.w,.24,p.d,house);
  make(box,i%2?wall:colors.get(p.color),0,1.8,0,p.w-.3,3.3,p.d-.3,house);
  // One gabled silhouette, with a generous shaded porch facing the lane.
  make(roofGeometry,roofs[i%3],0,0,0,1,1,1,house);
  make(box,timber,0,1.1,3.16,1.1,2.2,.1,house);
  for(const sx of [-1,1])make(box,glass,sx*1.7,2,3.18,.9,1.1,.1,house);
  make(box,stone,0,.06,4.2,3,.12,2,house);
 }
 // Batch static house parts by shared geometry/material for mobile. The
 // parcel planner remains the authoritative collision representation.
 const batches=new Map(),parts=[];root.updateMatrixWorld(true);
 root.traverse(o=>{if(!o.isMesh)return;const key=o.geometry.uuid+o.material.uuid;
  if(!batches.has(key))batches.set(key,{g:o.geometry,m:o.material,items:[]});batches.get(key).items.push(o.matrixWorld.clone());parts.push(o);
 });
 for(const part of parts)part.parent.remove(part);
 for(const {g,m,items}of batches.values()){
  const mesh=new T.InstancedMesh(g,m,items.length);mesh.name='Rural town shared building parts';items.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);
 }
 return {root,batchCount:batches.size};
}

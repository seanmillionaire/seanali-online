import {COASTAL_ESTATES,estateLocal,estateVolumes,estateGroundPlan,estateDockSurface} from './coastal-estates.js';

export function createCoastalEstates({T,scene,mat,box,ball,cylinder,height,inWater}){
 const root=new T.Group();root.name='Remote coastal estates';scene.add(root);
 const materials={stone:mat('#c4b99e'),trim:mat('#f8f0dc'),glass:mat('#457b86',{roughness:.22,metalness:.28}),wood:mat('#76553d'),water:mat('#25b7c7',{roughness:.18,metalness:.18}),leaf:mat('#44805b'),flower:mat('#db8e9c'),roof:mat('#a9634d')};
 const sites=[],air=[],meshes=[];
 for(const p of COASTAL_ESTATES){
  const group=new T.Group();group.name='Coastal estate '+p.id;group.position.set(p.x,0,p.z);group.rotation.y=p.facing===-1?Math.PI:0;root.add(group);
  const at=(x,z)=>({x:p.x+x*p.facing,z:p.z+z*p.facing});
  const ground=(x,z)=>{const q=at(x,z);return height(q.x,q.z);};
  const {base,dockEnd}=estateGroundPlan(p,height);
  const batches=new Map(),wall=mat(p.color),volumes=estateVolumes(p);
  const part=(geo,m,x,y,z,w,h,d,ry=0,rx=0)=>{const key=geo.uuid+m.uuid;if(!batches.has(key))batches.set(key,{geo,m,items:[]});batches.get(key).items.push(new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,0)),new T.Vector3(w,h,d)));};
  const b=(m,x,y,z,w,h,d,ry=0,rx=0)=>part(box,m,x,y,z,w,h,d,ry,rx);
  // Retaining courses reach the sampled ground; decks never float on slopes.
  for(let x=-18;x<=18;x+=6)for(let z=-12;z<=15;z+=5.4){const floor=Math.min(ground(x-3,z-2.7),ground(x+3,z-2.7),ground(x-3,z+2.7),ground(x+3,z+2.7))-.3;b(materials.stone,x,(base+floor)/2,z,6.05,base-floor,5.45);}
  b(materials.trim,0,base+.12,1.5,38,.24,32.5);
  for(const v of volumes){
   b(wall,v.x,base+v.h/2,v.z,v.w,v.h,v.d);b(materials.trim,v.x,base+v.h+.18,v.z,v.w+.8,.36,v.d+.8);
   for(let level=0;level<v.h-1;level+=3){
    b(materials.trim,v.x,base+level+.35,v.z+v.d/2+.6,v.w+.9,.25,1.8);
    for(let x=-v.w/2+1.5;x<v.w/2;x+=2.6){b(materials.glass,v.x+x,base+level+1.8,v.z+v.d/2+.02,1.85,1.85,.06);b(materials.trim,v.x+x,base+level+1.8,v.z+v.d/2+.07,.07,1.9,.08);}
    for(const sign of [-1,1])for(let z=-v.d/2+1.8;z<v.d/2;z+=3)b(materials.glass,v.x+sign*(v.w/2+.02),base+level+1.8,v.z+z,.06,1.8,1.9);
   }
   // Usable roof terraces, with low perimeter planters and shaded seating.
   for(const sign of [-1,1])b(materials.trim,v.x+sign*(v.w/2-.2),base+v.h+.7,v.z,.35,.7,v.d);
   b(materials.leaf,v.x,base+v.h+.65,v.z-v.d/2+.35,v.w-.8,.6,.65);
   if(p.style==='pavilions'){b(materials.wood,v.x,base+v.h+1,v.z,v.w*.8,.18,v.d*.8);for(let j=0;j<6;j++)b(materials.roof,v.x,base+v.h+1.15+j*.22,v.z,v.w+1-j*1.3,.3,v.d+1-j*.8);}
   const q=at(v.x,v.z);air.push({x:q.x,z:q.z,w:v.w,d:v.d,bottom:base,top:base+v.h+.36});
  }
  // Open central promenade: no ornamental closed door that implies an action.
  b(materials.wood,0,base+.3,2,5,.22,11);
  for(const sign of [-1,1])for(let z=-6;z<=4;z+=5){part(cylinder,materials.trim,sign*3.1,base+2.8,z,.25,5.6,.25);b(materials.wood,0,base+5.65,z,7,.2,.22);}
  const poolX=p.style==='terraces'?-7:0;
  b(materials.stone,poolX,base+.35,11,15,.5,8);b(materials.water,poolX,base+.62,11,13.9,.06,6.9);
  for(const x of [-16,16])for(const z of [4,10,16]){b(materials.trim,x,base+.45,z,2.1,.6,1.5);part(ball,materials.leaf,x,base+1.2,z,1.35,1.25,1.0);part(ball,materials.flower,x+.3,base+1.9,z,.4,.3,.4);}
  for(let i=0;i<4;i++){b(materials.wood,9+i*1.8,base+.6,9,.95,.35,2.5);b(materials.trim,9+i*1.8,base+.85,8.5,.9,.15,1.2);}
  // Dock starts beside the pool and reaches actual water, with piles below sea level.
  
  const dockY=.75,start=17.5,length=dockEnd-start,drop=dockY-base-.24,angle=-Math.atan2(drop,length),rampLength=Math.hypot(length,drop);
  b(materials.wood,0,(base+.24+dockY)/2,(start+dockEnd)/2,2.6,.24,rampLength,0,angle);
  for(const x of [-1.2,1.2])b(materials.wood,x,(base+.24+dockY)/2+.85,(start+dockEnd)/2,.1,.12,rampLength,0,angle);
  for(let z=start;z<dockEnd;z+=3){const y=base+.24+drop*(z-start)/length;for(const x of [-1.2,1.2]){const floor=Math.min(-1.8,ground(x,z)-.3);part(cylinder,materials.wood,x,(floor+y+.9)/2,z,.10,y+.9-floor,.10);}}
  b(materials.wood,0,dockY,dockEnd,8,.28,4);
  for(const batch of batches.values()){const mesh=new T.InstancedMesh(batch.geo,batch.m,batch.items.length);batch.items.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.castShadow=false;mesh.receiveShadow=true;group.add(mesh);meshes.push(mesh);}
  sites.push({p,base,volumes,group,dockEnd});
 }
 scene.userData.coastalEstateAir=air;
 const nearby=(x,z)=>sites.find(({p})=>Math.abs(x-p.x)<22&&Math.abs(z-p.z)<20);
 function roofAt(x,z){const s=nearby(x,z);if(!s)return null;const q=estateLocal(s.p,x,z),v=s.volumes.find(v=>Math.abs(q.x-v.x)<v.w/2&&Math.abs(q.z-v.z)<v.d/2);return v?s.base+v.h+.36:null;}
 return {sites,root,roofAt,
  clear(x,z,y=0){const s=nearby(x,z);if(!s)return true;const q=estateLocal(s.p,x,z);return !s.volumes.some(v=>y<s.base+v.h&&Math.abs(q.x-v.x)<v.w/2+.32&&Math.abs(q.z-v.z)<v.d/2+.32);},
  surface(x,z,y=0){for(const site of sites){const dock=estateDockSurface(site.p,site,x,z);if(Number.isFinite(dock))return dock;}const s=nearby(x,z);if(!s)return -Infinity;const q=estateLocal(s.p,x,z);if(Math.abs(q.x)>19||q.z<-14.75||q.z>17.75)return -Infinity;const roof=roofAt(x,z);return roof!==null&&y>=roof-.7?roof:s.base+.24;},
  dispose(){scene.remove(root);delete scene.userData.coastalEstateAir;for(const mesh of meshes)mesh.dispose();}
 };
}

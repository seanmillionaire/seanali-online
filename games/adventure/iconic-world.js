import {AMADOR_BENCHES} from './amador-layout.js';
import {ICONIC_VOLUMES,ICONIC_PLACES,AMADOR_ISLANDS} from './iconic-layout.js';
// A few large readable silhouettes. Shared instance batches, no new texture downloads.
export function createIconicWorld({T,scene,mat,box,cylinder,ball,height,geometry}){
 const root=new T.Group();root.name='Panama iconic places';scene.add(root);const meshes=[],batches=new Map(),air=[];
 const cream=mat('#f3e3c5'),stone=mat('#b6a181'),darkStone=mat('#766b5c'),wood=mat('#805f42'),glass=mat('#548a91'),red=mat('#b46449'),green=mat('#51894b');
 const part=(geo,m,x,y,z,w,h,d,rx=0,ry=0,rz=0)=>{const key=geo.uuid+m.uuid+Math.floor(x/128);if(!batches.has(key))batches.set(key,{geo,m,items:[]});batches.get(key).items.push(new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(w,h,d)));};
 const b=(m,x,y,z,w,h,d,rx=0,ry=0,rz=0)=>part(box,m,x,y,z,w,h,d,rx,ry,rz);
 const base=p=>Math.max(...[-1,1].flatMap(sx=>[-1,1].map(sz=>height(p.x+sx*p.w/2,p.z+sz*p.d/2))));
 for(const p of ICONIC_VOLUMES){
  const y=base(p);air.push({...p,bottom:y,top:y+p.h+2});
  const low=Math.min(height(p.x-p.w/2,p.z-p.d/2),height(p.x+p.w/2,p.z+p.d/2))-.25;b(stone,p.x,(y+low)/2,p.z,p.w+.6,Math.max(.5,y-low),p.d+.6);
  if(p.id==='biomuseo'){
   b(cream,p.x,y+2.1,p.z,17,4.2,12);b(glass,p.x,y+2.3,p.z+6.04,15,3.1,.08);
   const colors=['#ed4d39','#f6ba34','#4c9b5a','#3095bc','#e67932'];
   for(let i=0;i<7;i++){const x=p.x-9+(i%4)*5.2,z=p.z-3+Math.floor(i/4)*6,m=mat(colors[i%colors.length]);b(m,x,y+5.8+(i%3)*1.25,z,8,.35,10,(i%2?1:-1)*.19,(i%3-1)*.3,(i%2?-.18:.22));}
   // Slender columns leave the exterior atrium visually open.
   for(const dx of [-8,0,8])part(cylinder,cream,p.x+dx,y+2.4,p.z+7.8,.18,4.8,.18);
  }else if(p.id==='cathedral'){
   // Open belfry windows use true gaps between piers, not black painted squares.
   b(stone,p.x,y+7,p.z,8,14,8);
   for(const sx of [-1,1])for(const sz of [-1,1])b(stone,p.x+sx*3,y+18,p.z+sz*3,2,8,2);
   for(const level of [14,21.6])b(darkStone,p.x,y+level,p.z,8.5,.6,8.5);
   b(stone,p.x,y+22.2,p.z,8,.65,8);
   for(let i=0;i<6;i++){const z=p.z+i*3.8;b(stone,p.x-12,y+1.8,z,1.4,3.6,1.3);if(i<5)b(stone,p.x-12,y+3.5,z+1.8,1.4,.6,2.8);b(stone,p.x-22,y+.45,z,1.6,.9,2.1);}
  }else{
   b(cream,p.x,y+1.8,p.z,7,3.6,6);b(red,p.x,y+4.1,p.z,7.7,.3,6.8,0,0,p.x<-170?.16:-.16);
   for(const dx of [-1.8,1.8])b(glass,p.x+dx,y+2,p.z+3.03,1.1,1.3,.08);
   b(wood,p.x,y+1.3,p.z+3.07,1.25,2.6,.1);
  }
 }
 const cy=height(-170,-72);b(stone,-170,cy+.05,-72,12,.10,11);
 // Shaded open market; children can walk between the stalls.
 for(const dx of [-7,7])for(const dz of [-7,7]){const x=-170+dx,z=-72+dz,y=height(x,z);b(wood,x,y+.8,z,3.8,1.6,1.7);b(dx<0?red:green,x,y+3.2,z,5,.18,3.5);for(const sx of [-1,1])part(cylinder,wood,x+sx*2,y+1.6,z,.10,3.2,.10);for(let j=0;j<4;j++)part(ball,dx<0?mat('#e9bb45'):green,x-1.2+j*.8,y+1.8,z,.35,.32,.35);}
 // Low waterfront benches mark the causeway's walking/cycling destination.
 for(const p of AMADOR_BENCHES){const x=p.x,z=p.z,y=height(x,z);b(wood,x,y+.7,z,2.5,.25,.8);for(const side of [-1,1])b(darkStone,x+side*.9,y+.35,z,.18,.7,.7);}
 for(const {geo,m,items}of batches.values()){const mesh=new T.InstancedMesh(geo,m,items.length);items.forEach((v,i)=>mesh.setMatrixAt(i,v));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.castShadow=false;mesh.receiveShadow=true;root.add(mesh);meshes.push(mesh);}
 scene.userData.iconicAir=air;
 return {root,dispose(){scene.remove(root);delete scene.userData.iconicAir;meshes.forEach(m=>m.dispose());}};
}

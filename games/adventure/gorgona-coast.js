import {clipLandTriangle} from './terrain-surface.js?v=225';
import {inWater,roadDistance} from './explore-state.js?v=225';
import {regionalClearing} from './regional-layout.js?v=225';
export const GORGONA_FISH_SHACK={x:-92,z:6,w:6,d:4};
export function createGorgonaCoast({T,scene,geometry,mat,box,ball,cylinder,height,models,surfaces}){
 const solids=[];const root=new T.Group();root.name='Nueva Gorgona · Pacific fishing beach';scene.add(root);const batches=new Map(),dummy=new T.Object3D();
 const sand=mat('#bdbbb4',{roughness:1,map:surfaces?.sand}),wood=mat('#8d6747'),white=mat('#f2eee0'),blue=mat('#3387ab'),red=mat('#bf553c'),glass=mat('#47797b'),net=mat('#b8ad8d'),steel=mat('#5e6d73');
 function part(g,m,x,y,z,w,h,d,ry=0,rz=0){const key=g.uuid+m.uuid;if(!batches.has(key))batches.set(key,{g,m,items:[]});dummy.position.set(x,y,z);dummy.rotation.set(0,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();batches.get(key).items.push(dummy.matrix.clone());}
 // Broad gray Pacific sand follows the actual shoreline, with no road or water fill.
 const v=[];for(let x=-103;x<-23;x+=1.5)for(let z=10;z<23;z+=1.5){const q=[[x,z],[x,z+1.5],[x+1.5,z],[x+1.5,z+1.5]];for(const tri of [[0,1,2],[2,1,3]])for(const [px,,pz]of clipLandTriangle(tri.map(i=>[q[i][0],0,q[i][1]]),(x,z)=>!inWater(x,z)&&roadDistance(x,z)>=8))v.push(px,height(px,pz)+.018,pz);}
 const beach=geometry(new T.BufferGeometry());beach.setAttribute('position',new T.Float32BufferAttribute(v,3));beach.computeVertexNormals();root.add(new T.Mesh(beach,sand));
 const hull=geometry(new T.BufferGeometry()),pos=[],ix=[];for(const [z,w,y]of [[-2,.55,.35],[-1,1,.45],[1,.8,.5],[2.5,0,.8]])for(const [x,h]of [[-w,y],[-w*.6,0],[w*.6,0],[w,y]])pos.push(x,h,z);for(let i=0;i<3;i++)for(let j=0;j<3;j++){const n=i*4+j;ix.push(n,n+4,n+1,n+1,n+4,n+5);}hull.setAttribute('position',new T.Float32BufferAttribute(pos,3));hull.setIndex(ix);hull.computeVertexNormals();
 for(const [i,x]of [-99,-83,-44,-29].entries()){const z=16+(i%2)*1.2,y=height(x,z);if(inWater(x,z)||regionalClearing(x,z,1))continue;solids.push({x,z,size:7.8});part(hull,i%2?blue:white,x,y+.08,z,1,1,1,.32);for(const zz of [-1,0,1])part(box,wood,x,y+.45,z+zz,1.6,.12,.28,.32);part(box,steel,x-.5,y+.45,z-2.1,.38,.65,.4,.32);part(ball,net,x+1.5,y+.18,z,1,.16,.7);for(let j=0;j<6;j++)part(cylinder,white,x+1.4+j*.12,y+.3,z,.045,.16,.045);}
 for(const x of [-97,-78,-60,-49,-32]){const z=12.6,y=height(x,z);if(inWater(x,z)||regionalClearing(x,z,.3))continue;part(box,wood,x,y+.55,z,2,.14,.6);part(box,wood,x,y+.95,z-.28,2,.7,.08);for(const dx of [-.8,.8])part(box,steel,x+dx,y+.25,z,.1,.5,.55);}
 const q=GORGONA_FISH_SHACK,y=height(q.x,q.z);part(box,white,q.x,y+1.5,q.z,q.w,3,q.d);part(box,red,q.x,y+3.1,q.z,q.w+.7,.2,q.d+.7);part(box,glass,q.x,y+1.55,q.z+2.05,4,1.3,.08);part(box,wood,q.x,y+.85,q.z+2.35,5,.16,1);for(const x of [-2.7,2.7])part(cylinder,wood,q.x+x,y+1.5,q.z+2.7,.09,3,.09);
 models.sign(root,'🐟 PESCADO · PATACONES',q.x,y+2.7,q.z+2.13,5,.65);models.sign(root,'🏖️ NUEVA GORGONA',-20,height(-20,9)+3,9,5,.7);
 root.userData.solidTrees=solids;scene.userData.gorgonaAir=[{...q,bottom:y,top:y+3.4}];
 for(const b of batches.values()){const m=new T.InstancedMesh(b.g,b.m,b.items.length);b.items.forEach((matrix,i)=>m.setMatrixAt(i,matrix));m.instanceMatrix.needsUpdate=true;m.computeBoundingSphere();root.add(m);}
 const cook=models.person(root,q.x,y,q.z+2.4,7);let time=0;
 return {root,near:(x,z)=>Math.hypot(x-q.x,z-(q.z+4))<2.6?{type:'vendor',kind:'market'}:null,update(dt,active,info){root.visible=!info.indoors;if(active)time+=dt;cook.animate?.(time,true);},dispose(){scene.remove(root);delete scene.userData.gorgonaAir;}};
}

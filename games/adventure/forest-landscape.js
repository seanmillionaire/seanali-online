import {botanicalGeometry,mergeNatureGeometry,leafSurface} from './botanical-geometry.js?v=211';
// High-canopy vegetation batched into just six shared GPU draws, even for
// thousands of individual pines, palms and broadleaf tropical trees.
import {planForestPatches} from './forest-patches.js?v=211';

export function createForestLandscape({T,scene,mat,geometry,height,light=false}){
 const trees=planForestPatches(light ? .63 : 1),group=new T.Group();
 group.userData.solidTrees=trees;
 group.name='Panama forest reserves · giant palms, cloudforest pines and broadleaf canopy';
 scene.add(group);
 const bark=mat('#8b765c',{roughness:1});
 const leafTexture=leafSurface(T),crown=mat('#ffffff',{map:leafTexture,vertexColors:true,side:T.DoubleSide,roughness:.95});
 crown.addEventListener('dispose',()=>leafTexture.dispose());
 const byKind={palm:[],pine:[],natural:[],fern:[]};
 for(const tree of trees)byKind[tree.kind].push(tree);

 const palmCrown=botanicalGeometry(T,geometry,'palm',true);palmCrown.translate(.82,7.2,.27);
 const pineCrown=botanicalGeometry(T,geometry,'pine',true);
 const naturalCrown=botanicalGeometry(T,geometry,'natural',true);naturalCrown.translate(0,6,0);
 const fernCrown=botanicalGeometry(T,geometry,'fern',true);
 const palmCurve=new T.CatmullRomCurve3([
  new T.Vector3(0,0,0),new T.Vector3(.04,2.0,.02),
  new T.Vector3(.38,5.0,.09),new T.Vector3(.82,7.2,.27)
 ]);
 const trunks={
  palm:geometry(new T.TubeGeometry(palmCurve,15,.20,7,false)),
  pine:geometry(new T.CylinderGeometry(.105,.34,9.3,7)),
  natural:geometry(new T.CylinderGeometry(.15,.51,6.1,8))
 };
 trunks.pine.translate(0,4.65,0);
 trunks.natural.translate(0,3.05,0);
 // Visible branch architecture supports the canopy rather than a bare pole.
 const branches=[{geo:trunks.natural}],axis=new T.Vector3(0,1,0);
 for(let i=0;i<6;i++){
  const angle=i*2.399963,from=new T.Vector3(0,3.1+(i%2)*.6,0),to=new T.Vector3(Math.sin(angle)*1.75,5.3+(i%3)*.25,Math.cos(angle)*1.75),direction=to.clone().sub(from);
  const geo=new T.CylinderGeometry(.035,.095,direction.length(),6),matrix=new T.Matrix4().compose(from.clone().add(to).multiplyScalar(.5),new T.Quaternion().setFromUnitVectors(axis,direction.normalize()),new T.Vector3(1,1,1));
  branches.push({geo,matrix});
 }
 trunks.natural=mergeNatureGeometry(T,geometry,branches);for(const part of branches.slice(1))part.geo.dispose();
 const crowns={palm:palmCrown,pine:pineCrown,natural:naturalCrown,fern:fernCrown};
 const dummy=new T.Object3D(),color=new T.Color(),counts={},visibility=[];
 let focusTick=0;
 for(const [kind,items]of Object.entries(byKind)){
  if(!items.length)continue;
  const stems=kind==='fern'?null:new T.InstancedMesh(trunks[kind],bark,items.length);
  const foliage=new T.InstancedMesh(crowns[kind],crown,items.length);
  if(stems){stems.name=kind+' mixed forest trunks';stems.castShadow=false;stems.receiveShadow=false;
   stems.userData.cameraFoliage=true;}
  foliage.name=kind+' layered natural foliage';foliage.castShadow=false;
  foliage.receiveShadow=false;foliage.userData.cameraFoliage=true;
  for(let i=0;i<items.length;i++){
   const t=items[i];
   dummy.position.set(t.x,height(t.x,t.z)-.035,t.z);
   dummy.rotation.set(0,t.heading,0);
   dummy.scale.setScalar(t.size);
   dummy.updateMatrix();
   if(stems)stems.setMatrixAt(i,dummy.matrix);
   foliage.setMatrixAt(i,dummy.matrix);
   color.setRGB(.86+t.tint*.14,.91+t.tint*.09,.79+t.tint*.16);
   foliage.setColorAt(i,color);
  }
  if(stems)stems.instanceMatrix.needsUpdate=true;
  foliage.instanceMatrix.needsUpdate=true;
  if(foliage.instanceColor)foliage.instanceColor.needsUpdate=true;
  stems?.computeBoundingSphere?.();
  foliage.computeBoundingSphere?.();
  if(stems)group.add(stems);group.add(foliage);counts[kind]=items.length;
  visibility.push({items,foliage,stems,factors:new Float32Array(items.length).fill(1)});
 }
 // Never shrink or collide the entire tree. Only fade its leafy canopy when
 // the player or a third-person sightline moves beneath it; keep its trunk
 // visible as a landmark. Cached matrices make this cheap on mobile.
 function updateFocus(x,z,camera=null){
  if(!Number.isFinite(x)||!Number.isFinite(z))return;
  focusTick++;if(focusTick%2)return;
  for(const layer of visibility){
   let changed=false;
   for(let i=0;i<layer.items.length;i++){
    const t=layer.items[i],dx=t.x-x,dz=t.z-z,dist=Math.hypot(dx,dz);
    let fade=dist<3.8? .065:dist<6.2?.22:1;
    if(camera){
     const rayX=camera.position.x-x,rayZ=camera.position.z-z,len=rayX*rayX+rayZ*rayZ;
     const progress=len?Math.max(0,Math.min(1,(dx*rayX+dz*rayZ)/len)):0;
     const width=Math.hypot(dx-rayX*progress,dz-rayZ*progress);
     if(progress>.02&&progress<=1&&width<2.5+t.size*.75)fade=0;
    }
    // Smooth appearance between individual canopies without sudden popping.
    const prev=layer.factors[i],next=prev+(fade-prev)*.42;
    if(Math.abs(next-prev)<.007&&Math.abs(next-fade)<.025)continue;
    layer.factors[i]=next;dummy.position.set(t.x,height(t.x,t.z)-.035,t.z);
    dummy.rotation.set(0,t.heading,0);dummy.scale.setScalar(t.size*Math.max(.045,next));
    dummy.updateMatrix();layer.foliage.setMatrixAt(i,dummy.matrix);
    if(layer.stems){dummy.scale.setScalar(t.size*(fade===0?0:1));dummy.updateMatrix();layer.stems.setMatrixAt(i,dummy.matrix);}
    changed=true;
   }
   if(changed){layer.foliage.instanceMatrix.needsUpdate=true;
    layer.foliage.computeBoundingSphere?.();if(layer.stems){layer.stems.instanceMatrix.needsUpdate=true;layer.stems.computeBoundingSphere?.();}}
  }
 }
 return {group,trees,counts,updateFocus};
}

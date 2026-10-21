import {regionalClearing,regionalTrailClear} from './regional-layout.js?v=224';
import {botanicalGeometry,leafSurface} from './botanical-geometry.js?v=224';
import {ruralBlocks} from './rural-towns.js?v=224';
// Shared three-dimensional foliage; no spherical crowns or stacked cone trees.
import {roadsidePoint} from './explore-state.js?v=224';
export function createNaturalTrees({T,geometry,mat,make,height,scene,surfaces=null}){
 const trees=[],bark=mat('#73634d',{...(surfaces?.wood?{map:surfaces.wood,bumpMap:surfaces.wood}:{}),bumpScale:.13,roughness:1});
 const leafTexture=leafSurface(T);let textureOwner=false;
 const leaves=Object.fromEntries(['palm','pine','natural','banana'].map(kind=>[kind,botanicalGeometry(T,geometry,kind)]));
 const palmCurve=new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3(.1,2.2,0),new T.Vector3(.45,4.8,.1),new T.Vector3(.9,7,.3)]);
 const palmTrunk=geometry(new T.TubeGeometry(palmCurve,14,.19,8,false));
 const pineTrunk=geometry(new T.CylinderGeometry(.085,.32,9.2,9));pineTrunk.translate(0,4.6,0);
 const naturalTrunk=geometry(new T.CylinderGeometry(.12,.37,5.9,9));naturalTrunk.translate(0,2.95,0);
 const bananaTrunk=geometry(new T.CylinderGeometry(.08,.17,3.1,7));bananaTrunk.translate(0,1.55,0);
 const branch=geometry(new T.CylinderGeometry(.07,.15,3.5,6));branch.translate(0,1.75,0);
 const collarGeo=geometry(new T.TorusGeometry(.196,.018,3,9));
 let focus=null;
 function addTree(kind,x,z,scale=1,seed=0,parent=scene){
  if(!leaves[kind])kind='natural';
  // Preserve trees beside every highway, including the Barú approach.
  ({x,z}=roadsidePoint(x,z,Math.max(2,3.5*scale),(x,z)=>!ruralBlocks(x,z,3.5*scale)&&!regionalClearing(x,z,Math.max(2,scale*1.5))&&regionalTrailClear(x,z)));
  const root=new T.Group();root.userData.cameraFoliage=true;root.name=kind==='palm'?'Detailed curved coconut palm':kind==='pine'?'Detailed tall needle pine':kind==='banana'?'Broad-leaf banana plant':'Branching natural rainforest tree';parent.add(root);
  root.position.set(x,height(x,z)-.05,z);root.scale.setScalar(scale);root.rotation.y=seed*2.39996;
  make(kind==='palm'?palmTrunk:kind==='pine'?pineTrunk:kind==='banana'?bananaTrunk:naturalTrunk,bark,0,0,0,1,1,1,root);
  if(kind==='palm'){
   // A single instanced draw supplies the characteristic rings in a palm trunk.
   const collars=new T.InstancedMesh(collarGeo,bark,15),m=new T.Matrix4(),q=new T.Quaternion().setFromEuler(new T.Euler(Math.PI/2,0,0));
   for(let i=0;i<15;i++){const p=palmCurve.getPoint((i+.5)/15);m.compose(p,q,new T.Vector3(1,1,1));collars.setMatrixAt(i,m);}root.add(collars);
  }else if(kind==='natural'){
   for(let i=0;i<5;i++){const b=make(branch,bark,0,3.1,0,1,1,1,root);b.rotation.z=.5+(i%2)*.25;b.rotation.y=i*Math.PI*2/5;}
  }
  const material=mat('#ffffff',{map:leafTexture,bumpMap:leafTexture,bumpScale:.025,vertexColors:true,side:T.DoubleSide,roughness:.86,transparent:true,opacity:1,depthWrite:true});
  if(!textureOwner){material.addEventListener('dispose',()=>leafTexture.dispose());textureOwner=true;}
  const crown=make(leaves[kind],material,kind==='palm'?.9:0,kind==='palm'?7:kind==='natural'?6:kind==='banana'?3.1:0,kind==='palm'?.3:0,1,1,1,root);crown.castShadow=false;
  const tree={root,crown,kind,x,z,scale,tip:kind==='palm'?{x:.9,y:7,z:.3}:{x:0,y:kind==='pine'?8:6,z:0},phase:seed*.9};
  trees.push(tree);return tree;
 }
 function update(time){
  for(const t of trees){
   t.root.visible=true;
   t.crown.rotation.z=Math.sin(time*.9+t.phase)*(t.kind==='palm'?.035:.012);
   const distance=focus?Math.hypot(t.x-focus.x,t.z-focus.z):100;
   let opacity=distance<4?.2:distance<7?.2+(distance-4)*.266:1;
   if(focus?.camera){
    const dx=focus.camera.x-focus.x,dz=focus.camera.z-focus.z,length=dx*dx+dz*dz;
    const u=length?((t.x-focus.x)*dx+(t.z-focus.z)*dz)/length:0;
    const lateral=Math.hypot(t.x-focus.x-u*dx,t.z-focus.z-u*dz);
    const rayY=height(focus.x,focus.z)+1.6+(focus.camera.y-height(focus.x,focus.z)-1.6)*u;
    if(u>0&&u<=1.08&&lateral<3.8*t.scale&&rayY<height(t.x,t.z)+t.tip.y*t.scale+2){opacity=.05;t.root.visible=false;}
   }
   t.crown.material.opacity+=(opacity-t.crown.material.opacity)*.22;t.crown.material.depthWrite=t.crown.material.opacity>.95;
  }
 }
 return {addTree,update,trees,focus:(x,z,camera=null)=>{focus=Number.isFinite(x)&&Number.isFinite(z)?{x,z,camera}:null;}};
}

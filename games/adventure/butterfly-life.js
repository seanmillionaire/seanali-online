import {FOREST_PATCHES,forestSiteClear} from './forest-patches.js?v=211';
import {isletHeight} from './explore-state.js?v=211';
// Small resident populations: sheltered clearings, never a player-following swarm.
export function butterflyHabitats(){
 const habitats=[];
 for(const [i,patch] of FOREST_PATCHES.entries())for(let j=0;j<3;j++){
  for(let attempt=0;attempt<24;attempt++){
   const a=(i*31+j*7+attempt)*2.399963,r=.25+(attempt%5)*.12;
   const x=patch.x+Math.cos(a)*patch.rx*r,z=patch.z+Math.sin(a)*patch.rz*r;
   if(!Array.from({length:17},(_,k)=>{const t=k*Math.PI/8;return forestSiteClear(x+Math.cos(t)*3.5,z+Math.sin(t)*3.5,patch.biome);}).every(Boolean))continue;
   habitats.push({x,z,phase:i*2.7+j*1.9,speed:.38+(j%3)*.075,color:(i+j)%4});break;
  }
 }
 return habitats;
}
export function butterflyPose(h,time){
 const cycle=(time+h.phase*3)%24,rest=cycle>19;
 // Ease to a resting point, then back into flight; no position jumps.
 const flight=cycle<2?cycle/2:cycle>17?Math.max(0,(19-cycle)/2):1;
 const t=time*h.speed+h.phase,a=Math.sin(t)*2.2*flight,b=Math.sin(t*.73+.8)*1.8*flight;
 const x=h.x+a,z=h.z+b;
 return {x,z,y:isletHeight(x,z)+.65+flight*(1.1+.5*Math.sin(t*1.7)),heading:Math.atan2(Math.cos(t)*2.2,Math.cos(t*.73+.8)*1.8*.73),flap:rest?.12:.25+Math.sin(time*19+h.phase)*.95,rest};
}
export function createButterflyLife({T,scene,geometry,mat,ball}){
 const root=new T.Group();root.name='Panama woodland butterflies';scene.add(root);
 const habitats=butterflyHabitats(),count=habitats.length;
 const shape=new T.Shape();shape.moveTo(0,0);shape.bezierCurveTo(.14,.32,.52,.32,.43,.04);shape.bezierCurveTo(.48,-.22,.17,-.30,0,-.06);shape.lineTo(0,0);
 const wingGeo=geometry(new T.ShapeGeometry(shape,7));wingGeo.rotateX(-Math.PI/2);
 const wings=new T.InstancedMesh(wingGeo,mat('#ffffff',{side:T.DoubleSide,roughness:.7}),count*2),spots=new T.InstancedMesh(ball,mat('#f4e9bf'),count*4),bodies=new T.InstancedMesh(ball,mat('#27231a'),count);
 root.add(wings,spots,bodies);root.children.forEach(m=>{m.frustumCulled=false;m.castShadow=false;});
 const palette=['#168be0','#e08a20','#e9ce54','#dcebc4'],d=new T.Object3D(),rotation=new T.Quaternion(),offset=new T.Vector3();let clock=0;
 habitats.forEach((h,i)=>{for(let side=0;side<2;side++)wings.setColorAt(i*2+side,new T.Color(palette[h.color]));});
 function put(mesh,i,x,y,z,sx,sy,sz,heading,roll=0){d.position.set(x,y,z);d.scale.set(sx,sy,sz);d.rotation.set(0,heading,roll);d.updateMatrix();mesh.setMatrixAt(i,d.matrix);}
 function update(dt,active,{x=0,z=0,indoors=false}={}){
  if(active&&!indoors)clock+=Math.min(dt,.1);root.visible=!indoors;
  habitats.forEach((h,i)=>{const p=butterflyPose(h,clock),size=Math.hypot(x-p.x,z-p.z)<85?.8:0;
   put(bodies,i,p.x,p.y,p.z,.035*size,.035*size,.19*size,p.heading);
   for(const side of [-1,1]){const index=i*2+(side>0?1:0),roll=side*p.flap;
    put(wings,index,p.x,p.y,p.z,side*size,size,size,p.heading,roll);rotation.copy(d.quaternion);
    for(let k=0;k<2;k++){offset.set(side*(k?.16:.31)*size,0,(k?.12:-.10)*size).applyQuaternion(rotation);put(spots,index*2+k,p.x+offset.x,p.y+offset.y+.007,p.z+offset.z,.042*size,.009*size,.055*size,p.heading,roll);}
   }
  });root.children.forEach(m=>m.instanceMatrix.needsUpdate=true);
 }
 update(0,false);return {root,count,habitats,update,get clock(){return clock;},dispose(){scene.remove(root);}};
}

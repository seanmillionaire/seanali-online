import {AMADOR_BERTHS} from './amador-marina.js';
import {AMADOR_VENUES,AMADOR_BAYS,AMADOR_SHIFT,amadorEvening} from './amador-layout.js';
import {worldClock} from './world-clock.js';
import {createResidentRoutine} from './resident-routine.js';
import {pedestrianSpace} from './pedestrian-space.js';
import {vehicleOverlap,trafficFootprint} from './vehicle-contact.js';
// Three small independent terraces; no point lights, extra textures or global audio.
export function createAmadorWaterfront(o){
 const {T,scene,models,mat,box,cylinder,ball,make,height,state}=o,root=new T.Group();root.name='Amador waterfront · fish pizza sunset bar';scene.add(root);
 const batches=new Map(),people=[],lamps=[],pedestrians=pedestrianSpace(scene),wood=mat('#876246'),cream=mat('#f1dcb5'),dark=mat('#203c49');
 const part=(geo,m,x,y,z,w,h,d)=>{const key=geo.uuid+m.uuid;if(!batches.has(key))batches.set(key,{geo,m,items:[]});batches.get(key).items.push(new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion(),new T.Vector3(w,h,d)));};
 const b=(m,x,y,z,w,h,d)=>part(box,m,x,y,z,w,h,d);
 b(wood,476,.5,240,22,.3,2.6);b(wood,486,.5,302,2.6,.3,126);
 b(wood,503.5,.5,364,35,.3,2.2);
 for(const berth of AMADOR_BERTHS){b(wood,503.5,.5,berth.z-6,35,.3,2.2);for(const x of [488,502,518])part(cylinder,dark,x,.25,berth.z-6,.14,1.4,.14);}
 models.sign(root,'AMADOR · MARINA',476,2.5,240,9,.8);
 for(const [i,v]of AMADOR_VENUES.entries()){
  const y=height(v.x,v.z),color=mat(v.color),light=mat('#ffe7a1',{emissive:'#ffc55c',emissiveIntensity:.1});lamps.push(light);
  b(cream,v.x,y+1.7,v.z,v.w,3.4,v.d);b(color,v.x,y+3.55,v.z,v.w+.6,.22,v.d+.6);
  b(dark,v.x,y+1.75,v.z+v.d/2+.04,v.w-1.1,1.8,.08);b(wood,v.x,y+.9,v.z+v.d/2+.25,v.w-.6,.15,.5);
  b(color,v.x,y+2.8,v.z+v.d/2+1.2,v.w+.7,.15,2.6);
  models.sign(root,v.sign,v.x,y+3.1,v.z+v.d/2+1.3,v.w,.65);
  // The counter opens onto an unobstructed terrace; tables sit to either side.
  for(const side of [-1,1]){const x=v.x+side*(v.w/2-1),z=v.z+v.d/2+3,ty=height(x,z);part(cylinder,wood,x,ty+.85,z,.7,.12,.7);b(dark,x,ty+.42,z,.09,.84,.09);for(const dz of [-.85,.85]){b(color,x,ty+.45,z+dz,.65,.13,.55);b(dark,x,ty+.22,z+dz,.08,.44,.08);}}
  for(let j=0;j<7;j++)part(ball,light,v.x-v.w/2+j*v.w/6,y+2.65,v.z+v.d/2+2.1,.08,.08,.08);
  for(let j=0;j<2;j++){const home={x:v.x+(j?1:-1)*1.1,z:v.z+v.d/2+2.3},p=models.person(root,home.x,height(home.x,home.z),home.z,100+i*2+j);p.g.name='Amador diner · '+v.id;p.home=home;p.routine=createResidentRoutine(p,{seed:701+i*17+j,height,home,radius:.65,speed:.35,clear:(x,z)=>Math.abs(x-v.x)<v.w/2-.4&&z>v.z+v.d/2+1&&z<v.z+v.d/2+4});people.push(p);}
 }
 // Bounded marked bays, clear access aisles, no furniture in the drive-through.
 const paint=mat('#e9dba8');for(const p of AMADOR_BAYS){for(const dz of [-1.4,1.4])b(paint,p.x,height(p.x,p.z)+.06,p.z+dz,4.4,.035,.08);}
 models.sign(root,'PARKIN · 17:00–23:00',461,height(461,189+AMADOR_SHIFT)+2.4,189+AMADOR_SHIFT,7,.7);
 for(const {geo,m,items}of batches.values()){const mesh=new T.InstancedMesh(geo,m,items.length);items.forEach((v,i)=>mesh.setMatrixAt(i,v));mesh.computeBoundingSphere();mesh.castShadow=false;mesh.receiveShadow=true;root.add(mesh);}
 let clock=0;return {root,people,near(x,z){const v=AMADOR_VENUES.find(v=>Math.hypot(x-v.x,z-v.z-v.d/2-1)<3);return v?{type:'vendor',kind:v.food==='pizza'?'pizza':v.food==='raspao'?'raspao':'market',venue:v.id}:null;},update(dt,active,info,cars=[]){const near=Math.hypot(info.x-435,info.z-135-AMADOR_SHIFT)<170;root.visible=!info.indoors&&near;if(!active||!near)return;clock+=Math.min(.1,dt);const evening=amadorEvening(worldClock(state.world.dayTime).hour);for(const m of lamps)m.emissiveIntensity=evening?1.3:.08;for(const p of people)p.routine.update(dt,active,(x,z)=>Math.hypot(x-info.x,z-info.z)<.9||people.some(q=>q!==p&&Math.hypot(x-q.g.position.x,z-q.g.position.z)<.8)||cars.some(c=>vehicleOverlap({x,z,length:.45,width:.45},trafficFootprint(c))));},dispose(){for(const p of people)pedestrians.remove(p);scene.remove(root);root.traverse(m=>{if(m.isInstancedMesh)m.dispose();});}};
}

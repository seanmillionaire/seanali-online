import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.core.min.js';
import {createGorgonaFamilies} from '../games/adventure/gorgona-families.js';
import {poseBeachSwimmer,turnSwimmer,swimWaterClear} from '../games/adventure/beach-swim-motion.js';
import {inWater,isletHeight} from '../games/adventure/explore-state.js';
const scene=new T.Group(),geometry=g=>g,mat=(color,opts={})=>new T.MeshStandardMaterial({color,...opts});
const make=(geometry,material,x,y,z,w,h,d,parent)=>{const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m;};
const world=createGorgonaFamilies({T,scene,geometry,mat,make,box:new T.BoxGeometry(),ball:new T.SphereGeometry(1,8,6),cylinder:new T.CylinderGeometry(1,1,1,8),height:isletHeight});
const info={x:-40,z:18,indoors:false};world.update(0,false,info);
const swimmers=world.actors.filter(a=>a.activity==='swim');assert.equal(swimmers.length,10);
assert(swimmers.every(a=>a.g.userData.appearance.beachWear==='swimsuit'));
let geometryCount=0;scene.traverse(o=>{if(o.isMesh)geometryCount++;});
let checked=0,shoreViolations=0,minFaceDot=1,minHeadForward=1,partySwimFrames=0,maxChestError=0;
const chest=new T.Vector3(),head=new T.Vector3(),face=new T.Vector3();
for(let f=0;f<7200;f++){
 world.update(1/60,true,info);scene.updateMatrixWorld(true);
 for(const a of world.actors){
  assert(Number.isFinite(a.g.position.x+a.g.position.y+a.g.position.z));
  if(a.g.userData.activity!=='swimming')continue;
  if(a.activity==='party')partySwimFrames++;
  chest.set(0,.99,0).applyMatrix4(a.g.matrixWorld);head.set(0,1.62,0).applyMatrix4(a.g.matrixWorld);
  if(!inWater(chest.x,chest.z)||!inWater(head.x,head.z))shoreViolations++;
  if(a.activity==='swim'){
   assert(swimWaterClear(chest.x,chest.z,inWater,2.3));
   const forward=(head.x-chest.x)*Math.sin(a.heading)+(head.z-chest.z)*Math.cos(a.heading);
   minHeadForward=Math.min(minHeadForward,forward);assert(forward>.5);
   face.set(0,0,1).applyQuaternion(a.g.quaternion);minFaceDot=Math.min(minFaceDot,face.y);assert(face.y<-.8);
   maxChestError=Math.max(maxChestError,Math.abs(chest.y+.045));assert(Math.abs(chest.y+.045)<.04);
  }
  checked++;
 }
}
assert.equal(shoreViolations,0);assert(partySwimFrames>0);
const frozen=world.actors.map(a=>[...a.g.position.toArray(),...a.g.quaternion.toArray()]);world.update(10,false,info);
world.actors.forEach((a,i)=>{if(!['swim','party'].includes(a.activity))return;assert.deepEqual([...a.g.position.toArray(),...a.g.quaternion.toArray()],frozen[i]);});
let count=0;scene.traverse(o=>{if(o.isMesh)count++;});assert.equal(count,geometryCount);
assert(Math.abs(turnSwimmer(Math.PI-.01,-Math.PI+.01,.1)-Math.PI)<.02);
world.dispose();assert.equal(scene.children.length,0);
console.log(JSON.stringify({pass:true,swimmers:swimmers.length,frames:7200,swimmingPosesChecked:checked,partySwimFrames,shoreViolations,minHeadForward,maxChestError,meshCountStable:count},null,2));

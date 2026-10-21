import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {createStableShadows} from '../games/adventure/stable-shadows.js';
const scene=new T.Scene(),sun=new T.DirectionalLight(),renderer={shadowMap:{enabled:true,autoUpdate:false}};
sun.shadow.camera.left=-30;sun.shadow.camera.right=30;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;sun.shadow.mapSize.set(2048,2048);
const rig=createStableShadows({T,scene,sun,renderer});assert(renderer.shadowMap.autoUpdate,'animated casters update every render, independent of decorative motion clock');
const offset=new T.Vector3(-22,38,18),right=new T.Vector3().crossVectors(new T.Vector3(0,1,0),offset.clone().normalize()).normalize(),up=new T.Vector3().crossVectors(offset.clone().normalize(),right).normalize(),texel=60/2048;
let previous=null;
for(let i=0;i<1200;i++){
 const x=i/60*6.5,y=1+Math.sin(i/200)*4,z=-x*.4;rig.update(x,y,z);
 const target=sun.target.position;
 assert(sun.position.clone().sub(target).distanceTo(offset)<1e-9,'light direction remains constant');
 assert(Math.abs(target.dot(right)/texel-Math.round(target.dot(right)/texel))<1e-8,'horizontal texel alignment');assert(Math.abs(target.dot(up)/texel-Math.round(target.dot(up)/texel))<1e-8,'vertical texel alignment');
 assert(target.distanceTo(new T.Vector3(x,y,z))<texel,'player remains centered including raised terrain');
 if(previous)assert(target.distanceTo(previous)<.17,'no seven-metre shadow jumps');previous=target.clone();
}
const before=sun.position.clone();rig.update(NaN,0,0);assert(sun.position.equals(before));renderer.shadowMap.enabled=false;rig.update(9,10,11);assert(sun.position.equals(before),'mobile fallback does not move disabled light maps');rig.dispose();assert(!sun.target.parent);console.log('PASS continuous terrain-aware shadow tracking, stable light direction, texel alignment over 1200 walking frames, disabled-shadow fallback and cleanup');

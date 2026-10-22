import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {VEHICLE_GROUND_PROFILES,vehicleGroundPose,placeGroundVehicle} from '../games/adventure/vehicle-grounding.js';
import {HIGHWAY_CURVES,isletHeight} from '../games/adventure/explore-state.js';
import {roadRibbon,surfaceMesh} from '../games/adventure/road-surfaces.js';
import {highwayWidth} from '../games/adventure/highway-layout.js';
import {createRoadSurfaceSampler} from '../games/adventure/world-collision.js';
const root=new T.Group(),v=new T.Vector3();let checks=0;
function verify(x,z,h,surface,kind){const profile=VEHICLE_GROUND_PROFILES[kind],p=placeGroundVehicle(root,{x,z,heading:h},surface,kind);root.updateMatrixWorld(true);assert(root.matrixWorld.elements.every(Number.isFinite));for(const point of profile.support){v.fromArray(point).applyMatrix4(root.matrixWorld);assert(v.y>=surface(v.x,v.z)+.0249,kind+' contact/body below surface');checks++;}assert(Math.abs(Math.atan2(Math.sin(root.rotation.y-h),Math.cos(root.rotation.y-h)))<1e-10);return p;}
for(const kind of Object.keys(VEHICLE_GROUND_PROFILES))for(let i=0;i<16;i++){
 const h=i*Math.PI/8;
 for(const [gx,gz] of [[0,0],[.45,0],[-.45,0],[0,.45],[0,-.45],[.22,-.27]]){
  const surface=(x,z)=>7+gx*x+gz*z,p=verify(2,-3,h,surface,kind);
  const normal=new T.Vector3(0,1,0).applyQuaternion(root.quaternion),expected=new T.Vector3(-gx,1,-gz).normalize();assert(normal.distanceTo(expected)<1e-10,'bank and pitch follow heading on plane');
  const wheelGaps=VEHICLE_GROUND_PROFILES[kind].contacts.map(pt=>{v.fromArray(pt).applyMatrix4(root.matrixWorld);return v.y-surface(v.x,v.z);});assert(Math.max(...wheelGaps)<.026,'flat/ramp wheels stay on road without floating');
 }
 for(const surface of [(x,z)=>3+.08*z*z,(x,z)=>3-.08*z*z,(x,z)=>3+.07*x*x+.04*z*z])verify(2,-3,h,surface,kind);
}
const scene=new T.Scene(),material=new T.MeshStandardMaterial(),geometries=[];
for(const [id,path] of Object.entries(HIGHWAY_CURVES))scene.add(surfaceMesh(T,g=>(geometries.push(g),g),roadRibbon(path,(x,z)=>highwayWidth(id,x,z),isletHeight),material,'Smooth connected highway asphalt'));
const sampler=createRoadSurfaceSampler(T,scene),surface=(x,z)=>Math.max(isletHeight(x,z),sampler.height(x,z));let routes=0;
const start=performance.now();
for(const [id,path] of Object.entries(HIGHWAY_CURVES))for(let i=1;i<path.length;i+=4){const [x,z]=path[i],a=path[i-1],h=Math.atan2(x-a[0],z-a[1]);for(const kind of Object.keys(VEHICLE_GROUND_PROFILES))for(const direction of [0,Math.PI])verify(x,z,h+direction,surface,kind);routes++;}
const ms=performance.now()-start;for(const g of geometries)g.dispose();material.dispose();
console.log('PASS '+checks+' support checks: all headings, up/down ramps, banks, crests, valleys and '+routes+' real road positions; sedan, bus and both supercar profiles; '+ms.toFixed(0)+'ms road regression');

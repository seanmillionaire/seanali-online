import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {createSanitation} from '../games/adventure/sanitation.js';
import {fresh,normalize} from '../games/adventure/state.js';
import {isletHeight} from '../games/adventure/explore-state.js';
import {routePose} from '../games/adventure/panama-state.js';
import {vehicleOverlap,trafficFootprint} from '../games/adventure/vehicle-contact.js';
const element=()=>({style:{},dataset:{},append(){},remove(){},setAttribute(){},getContext:()=>({fillText(){}})});globalThis.document={createElement:element};
const state=fresh(),scene=new T.Scene(),geometry=g=>g,mat=(color,extra)=>new T.MeshStandardMaterial({color,...extra}),box=new T.BoxGeometry(),ball=new T.SphereGeometry(1,8,6),cylinder=new T.CylinderGeometry(1,1,1,8),make=(geo,m,x,y,z,w,h,d,parent)=>{const g=new T.Mesh(geo,m);g.position.set(x,y,z);g.scale.set(w,h,d);parent.add(g);return g;};
let obstacles=[];const options={T,scene,state,host:element(),panel:element(),height:isletHeight,save(){},refresh(){},joy:{effect(){}},tell(){},prepare(){},navigate(){},geometry,mat,box,ball,cylinder,make,forest:{trees:[]},otherTraffic:()=>obstacles};
let dept=createSanitation(options),truck=dept.vehicles[0],rec=state.world.sanitation.trucks.city;
// Start far enough from a stop to drive; put a stationary car in the same lane.
truck.distance=rec.distance=truck.stops[0].distance+1;rec.stop=1;rec.mode='drive';
const blocker={g:new T.Group(),route:truck.route,distance:truck.distance+9,bus:false};const pose=routePose(blocker.route,blocker.distance);blocker.g.position.set(pose.x,0,pose.z);blocker.g.rotation.y=pose.heading;obstacles=[blocker];
for(let i=0;i<200;i++)dept.update(.05,true,{x:-100,z:100,indoors:false,protected:false});assert(!vehicleOverlap(trafficFootprint(truck),trafficFootprint(blocker)),'truck must not pass through the stopped car');assert(rec.waiting>0,'blocked truck should wait');const stopped=truck.distance;obstacles=[];
for(let i=0;i<60;i++)dept.update(.05,true,{x:-100,z:100,indoors:false,protected:false});assert.notEqual(truck.distance,stopped,'truck continues when obstruction leaves');
// Hidden meshes remain physical traffic; view culling must not turn collisions off.
assert(dept.activeVehicles.includes(truck));truck.g.visible=false;assert(dept.activeVehicles.includes(truck));
// Save after pickup: restarting during the return walk must not load the same stock twice.
truck.distance=rec.distance=truck.stops[0].distance;rec.stop=0;rec.mode='service';rec.phase=5.99;
dept.update(.05,true,{x:-100,z:100});assert(rec.phase>6);const collected=state.world.sanitation.collected,load=rec.load.waste+rec.load.recycle;
const recovered=normalize(JSON.parse(JSON.stringify(state)));dept.dispose();state.world=recovered.world;state.wallet=recovered.wallet;dept=createSanitation(options);for(let i=0;i<20;i++)dept.update(.05,true,{x:-100,z:100});assert.equal(state.world.sanitation.collected,collected);assert.equal(state.world.sanitation.trucks.city.load.waste+state.world.sanitation.trucks.city.load.recycle,load);
const snapshot=JSON.stringify(state.world.sanitation);dept.update(5,false,{x:0,z:0});assert.equal(JSON.stringify(state.world.sanitation),snapshot,'paused time cannot create waste or income');dept.dispose();
console.log('PASS traffic blockage/recovery, offscreen collision membership, partial-service reload, and paused-state conservation');

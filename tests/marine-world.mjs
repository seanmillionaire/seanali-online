import {sanBlasWaters} from '../games/adventure/costa-arriba-layout.js';
import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {SAN_BLAS_ISLANDS} from '../games/adventure/panama-state.js';
import {migrateGeography,WORLD_BOUNDS} from '../games/adventure/geography.js';
import {freshExplore,normalizeExplore,marineWater,inWater} from '../games/adventure/explore-state.js';
import {fishingRoutes,fishingPose,fishingHullClear,createMaritimeLife} from '../games/adventure/maritime-life.js';
import {shippingRoutes,shippingPose,shippingClear,createOceanShipping} from '../games/adventure/ocean-shipping.js';
import {BIRD_FLOCKS,flockPose,createBirdFlocks} from '../games/adventure/bird-flocks.js';
import {roundedOceanGeometry} from '../games/adventure/world-horizon.js';
assert.equal(SAN_BLAS_ISLANDS.length,25);assert(SAN_BLAS_ISLANDS.filter(p=>p.community).length<6);
for(const p of SAN_BLAS_ISLANDS){assert(!inWater(p.x,p.z));for(const q of SAN_BLAS_ISLANDS){if(p===q)continue;assert(Math.hypot(p.x-q.x,p.z-q.z)>Math.max(p.rx,p.rz)+Math.max(q.rx,q.rz)+12,'cays have navigable channels');}}
const c=SAN_BLAS_ISLANDS[0],old={...freshExplore(),sanBlasGeographyVersion:2,x:c.oldX,z:c.oldZ,food:{banana:8,coconut:4},panama:{treasures:[0,2]},boat:{x:c.oldX+5,z:c.oldZ+2,heading:1},estate:{buildings:[{id:81,x:c.oldX,z:c.oldZ,level:3}]},builders:{mateo:{completed:[{id:'a',x:c.oldX,z:c.oldZ}]}}};
const moved=migrateGeography(old);assert.equal(moved.x,c.x);assert.equal(moved.estate.buildings[0].x,c.x);assert.equal(moved.builders.mateo.completed[0].x,c.x);assert.deepEqual(moved.food,old.food);assert.deepEqual(moved.panama,old.panama);assert.deepEqual(migrateGeography(moved),moved,'relocates once');const saved=normalizeExplore(moved);assert.equal(saved.sanBlasGeographyVersion,4);assert.deepEqual(normalizeExplore(saved),saved);
for(const r of fishingRoutes())for(let j=0;j<800;j++){const p=fishingPose(r,j/800*Math.PI*2*r.rx);assert(fishingHullClear(p.x,p.z,p.heading),'fisher full route clear');}
assert(fishingRoutes().length>=10);for(const r of fishingRoutes())assert(!sanBlasWaters(r.x,r.z,5),'no incidental boats in San Blas');assert.equal(new Set(fishingRoutes().map(p=>p.kind)).size,3);
for(const r of shippingRoutes())for(let j=0;j<1200;j++){const p=shippingPose(r,j/1200*Math.PI*2*r.rx);assert(shippingClear(p.x,p.z,p.heading,r.length,r.width),'large vessel full hull remains marine');}
assert(shippingRoutes().some(p=>p.kind==='tanker'));assert(shippingRoutes().some(p=>p.kind==='yacht'));
const scene=new T.Scene(),geometries=[],materials=[],geometry=g=>(geometries.push(g),g),mat=(c,o)=>(materials.push(new T.MeshStandardMaterial({color:c,...o})),materials.at(-1));
const box=geometry(new T.BoxGeometry()),ball=geometry(new T.SphereGeometry(1,8,6)),cylinder=geometry(new T.CylinderGeometry(1,1,1,8));
const make=(geo,m,x=0,y=0,z=0,sx=1,sy=sx,sz=sx,parent=scene)=>{const g=new T.Mesh(geo,m);g.position.set(x,y,z);g.scale.set(sx,sy,sz);parent.add(g);return g;};
const options={T,scene,geometry,mat,box,ball,cylinder,make},fleet=createMaritimeLife(options),shipping=createOceanShipping(options),birds=createBirdFlocks(options);
assert.equal(birds.count,576);assert.equal(birds.root.children.length,3);
const start=shipping.ships[0].g.position.clone();for(let i=0;i<100;i++){fleet.update(.05,true,{x:0,z:75});shipping.update(.05,true,{x:100,z:250});birds.update(.05,true,{x:0,z:35});}assert(shipping.ships[0].g.position.distanceTo(start)>5);const paused=birds.clock;birds.update(20,false);assert.equal(birds.clock,paused);
for(const ship of shipping.ships){
 const fittings=ship.g.children.filter(m=>m.isInstancedMesh);assert(fittings.length>3&&fittings.length<24,'deck detail uses bounded batches');assert(fittings.reduce((n,m)=>n+m.count,0)>200,'railings and fittings present');
 for(const m of fittings)assert([...m.instanceMatrix.array].every(Number.isFinite),'finite deck transforms');
 const clock=ship.wake.uniforms.time.value;shipping.update(1,false);assert.equal(ship.wake.uniforms.time.value,clock,'foam pauses with world');
 let disposed=false;ship.wake.addEventListener('dispose',()=>disposed=true);ship.wake.userData.checkDisposed=()=>assert(disposed,'wake shader disposed');
}
const ocean=geometry(roundedOceanGeometry(T)),p=ocean.attributes.position;let min=Infinity;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),r=Math.hypot(x/(WORLD_BOUNDS.x+900),y/(WORLD_BOUNDS.z+900));assert(r<1.00001,'oval mesh without square corners');if(r<.57)assert(Math.abs(z)<.001,'playable ocean stays level');min=Math.min(min,z);}assert(min<-200);assert(ocean.attributes.normal.getZ(170)>0,'water faces sky');
for(const mesh of birds.root.children)assert([...mesh.instanceMatrix.array].every(Number.isFinite));
fleet.dispose();shipping.dispose();shipping.ships.forEach(s=>s.wake.userData.checkDisposed());birds.dispose();assert.equal(scene.children.length,0);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());
console.log('PASS 25 separated cays, one-time progress/building/boat migration, '+fishingRoutes().length+' fishing boats, '+shippingRoutes().length+' large ships, all hull routes, 576 batched birds, paused simulation, curved ocean horizon and cleanup');

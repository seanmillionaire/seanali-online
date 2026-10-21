import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {createRegionalScenery} from '../games/adventure/regional-scenery.js';
import {regionalParcels,regionalBlocked,regionalClearing,regionalTrailClear} from '../games/adventure/regional-layout.js';
import {planForestPatches} from '../games/adventure/forest-patches.js';
import {freshExplore,normalizeExplore,roadDistance,HIGHWAY_WIDTH,isletHeight,inWater,HIGHWAY_CURVES} from '../games/adventure/explore-state.js';
import {createWorldCollision} from '../games/adventure/world-collision.js';
import {FLIGHT_SPEED,birdTravelSpeed,flightStep} from '../games/adventure/flight-travel.js';
import {REGIONAL_PALETTES} from '../games/adventure/regional-palette.js';
const state={world:freshExplore()},parcels=regionalParcels(),trees=planForestPatches(1),collision=createWorldCollision({state,trees});
assert(parcels.filter(p=>p.region==='gorgona').length>=10);
assert.equal(parcels.filter(p=>p.style==='coastal-apartments').length,2);
for(const p of parcels){assert(roadDistance(p.x,p.z)>HIGHWAY_WIDTH/2+Math.hypot(p.w,p.d)/2+1.7,p.id+' road clearance');assert(regionalBlocked(p.x,p.z,state.world));assert(!collision.clear(p.x,p.z),'visible regional building blocks walking');for(const sx of [-1,1])for(const sz of [-1,1])assert(!inWater(p.x+sx*p.w/2,p.z+sz*p.d/2),'dry full footprint '+p.id);}
for(const t of trees){assert(!regionalClearing(t.x,t.z),'forest respects building yards');assert(regionalTrailClear(t.x,t.z),'forest leaves walking trails');}
for(const id of ['coiba-moist-forest','rey-island-forest','escudo-coastal-forest','cebaco-forest','bocas-jungle'])assert(trees.filter(t=>t.patch===id).length>=20,id+' has forest instead of empty grass');
// Original Gorgona home, lighthouse, dock and boat remain on their authored shore.
assert(!inWater(-1,-5));assert(inWater(6.5,16));assert(inWater(4,17.5));assert(!inWater(-48,17));assert(HIGHWAY_CURVES.gorgonaTownStreet.length>100);
const scene=new T.Scene(),geometries=[],materials=[],surfaces=Object.fromEntries(['wood','plaster','roof','sand'].map(k=>[k,new T.Texture()]));
const geometry=g=>(geometries.push(g),g),mat=(color,o)=>(materials.push(new T.MeshStandardMaterial({color,...o})),materials.at(-1));
const scenery=createRegionalScenery({T,scene,geometry,mat,box:geometry(new T.BoxGeometry()),ball:geometry(new T.SphereGeometry(1,8,6)),cylinder:geometry(new T.CylinderGeometry(1,1,1,8)),height:isletHeight,surfaces,state});
assert.equal(scenery.plots.length,parcels.length);assert(scenery.coffee.length>=30);assert(scenery.batchCount<40,'details remain batched for mobile');assert.equal(scenery.paths.length,6);
scene.updateMatrixWorld(true);scene.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position;assert([...p.array].every(Number.isFinite),'finite scene geometry');if(o.isInstancedMesh)assert([...o.instanceMatrix.array].every(Number.isFinite),'finite transforms');});
for(const p of scenery.paths){const position=p.geometry.attributes.position;for(let i=0;i<position.count;i++)assert(!inWater(position.getX(i),position.getZ(i)),'earth trail remains on land');const normal=p.geometry.attributes.normal;assert(normal.getY(0)>0,'earth trails face upwards');}
const old=state.world;old.food={banana:7,coconut:4};old.collected=['shell0'];old.story.shells=2;old.estate.buildings=[{id:4,type:'villa',x:parcels[0].x,z:parcels[0].z,level:2}];
const saved=normalizeExplore(JSON.parse(JSON.stringify(old)));assert.equal(saved.food.banana,7);assert.equal(saved.food.coconut,4);assert.equal(saved.story.shells,2);assert(saved.collected.includes('shell0'));assert.equal(saved.estate.buildings[0].id,4);assert(!regionalBlocked(parcels[0].x,parcels[0].z,saved),'existing player estate wins over infill');
assert(FLIGHT_SPEED.balloon>=18*2);assert.equal(birdTravelSpeed(7),32);assert.equal(birdTravelSpeed(7,true),42);assert.equal(birdTravelSpeed(2),8);assert.deepEqual(flightStep(0,0,42,0,.1,{x:1,z:0}),{x:1,z:0,arrived:true});
// Repeat a real accelerated flight toward a nearby and distant waypoint: no oscillation.
for(const target of [{x:1,z:2},{x:-230,z:-200}]){let p={x:0,z:0},vx=0,vz=0;for(let i=0;i<1000&&Math.hypot(p.x-target.x,p.z-target.z)>.01;i++){const dx=target.x-p.x,dz=target.z-p.z,d=Math.hypot(dx,dz),ease=1-Math.exp(-.1*6);vx+=(dx/d*42-vx)*ease;vz+=(dz/d*42-vz)*ease;p=flightStep(p.x,p.z,vx,vz,.1,target);}assert(Math.hypot(p.x-target.x,p.z-target.z)<.01,'flight reaches waypoint without overshooting');}
assert.equal(Object.keys(REGIONAL_PALETTES).length,13);
scenery.dispose();assert(!scene.children.length);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());Object.values(surfaces).forEach(t=>t.dispose());
console.log('PASS '+parcels.length+' regional buildings, expanded Gorgona, dry footprints/collisions, '+trees.length+' forest plants, clear trails, '+scenery.coffee.length+' coffee shrubs, batching, original dock, progress preservation and faster flight arrival');

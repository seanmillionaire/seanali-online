import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {COSTA_HOMES,COSTA_ROAD,CRISTO_REEF,ISLA_GRANDE,sanBlasWaters,costaDock} from '../games/adventure/costa-arriba-layout.js';
import {freshExplore,normalizeExplore,HIGHWAY_CURVES,isletHeight,inWater,marineWater,mainlandRoadRoute,boatClear,recoverBoat} from '../games/adventure/explore-state.js';
import {createWorldCollision,createCityAirCollision} from '../games/adventure/world-collision.js';
import {shippingRoutes,shippingPose,shippingClear} from '../games/adventure/ocean-shipping.js';
import {fishingRoutes,fishingPose} from '../games/adventure/maritime-life.js';
import {ghostPose,ghostVisible,createColonGhostShip} from '../games/adventure/colon-ghost-ship.js';
import {createCostaArriba} from '../games/adventure/costa-arriba.js';
import {ROAD_REWARDS,rewardSite} from '../games/adventure/road-rewards.js';
const state={world:freshExplore()},solids=createWorldCollision({state});
for(const p of COSTA_HOMES){assert(!solids.clear(p.x,p.z),'solid house');for(const x of [-p.w/2,p.w/2])for(const z of [-p.d/2,p.d/2])assert(isletHeight(p.x+x,p.z+z)>.05,'dry foundation '+p.id);}
assert(mainlandRoadRoute({x:317,z:-61},{x:176,z:-437}).length>4,'city highway connects to coastal road');
assert(inWater(CRISTO_REEF.x,CRISTO_REEF.z),'statue stands on a sea reef');assert(!inWater(ISLA_GRANDE.x,ISLA_GRANDE.z),'island terrain exists');assert(costaDock(176,-449));assert(!inWater(176,-449));assert(boatClear(180,-449),'valid local jet ski launch');
const old=freshExplore();old.boat={x:110,z:-390,heading:1.7};old.food.banana=11;const migrated=normalizeExplore(old);assert(boatClear(migrated.boat.x,migrated.boat.z));assert(Math.hypot(migrated.boat.x-110,migrated.boat.z+390)<90,'old coastal boats relocate locally');assert.equal(migrated.boat.heading,1.7);assert.equal(migrated.food.banana,11);assert.deepEqual(normalizeExplore(migrated),migrated);
const reward=ROAD_REWARDS.find(p=>p.id==='costa-arriba'),site=rewardSite(reward,(x,z)=>solids.clear(x,z),isletHeight);assert(site,'visible dry jet ski station');assert.deepEqual(recoverBoat(reward.water.x,reward.water.z),reward.water,'never teleports to Gorgona');
for(const r of shippingRoutes())for(let i=0;i<360;i++){const p=shippingPose(r,i/360*Math.PI*2*r.rx);assert(shippingClear(p.x,p.z,p.heading,r.length,r.width));assert(!sanBlasWaters(p.x,p.z,20),'large vessels excluded from archipelago');}
for(const r of fishingRoutes())for(let i=0;i<128;i++){const p=fishingPose(r,i/128*Math.PI*2*r.rx);assert(!sanBlasWaters(p.x,p.z,5),'ambient fishing boats excluded from San Blas');}
for(let d=0;d<630;d+=1){const p=ghostPose(d);assert(p.z< -480);for(const f of [-18,0,18])for(const s of [-4,0,4])assert(marineWater(p.x+Math.sin(p.heading)*f+Math.cos(p.heading)*s,p.z+Math.cos(p.heading)*f-Math.sin(p.heading)*s),'full pirate hull offshore');}
assert(!ghostVisible(60));assert(ghostVisible(180));assert(!ghostVisible(10));
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({fillRect(){},fillText(){}})})};
const scene=new T.Scene(),geo=[],materials=[],geometry=g=>(geo.push(g),g),mat=(c,o={})=>{const m=new T.MeshStandardMaterial({color:c,...Object.fromEntries(Object.entries(o).filter(([,v])=>v!==undefined))});materials.push(m);return m;},box=geometry(new T.BoxGeometry()),ball=geometry(new T.SphereGeometry(1,8,6)),cylinder=geometry(new T.CylinderGeometry(1,1,1,8)),make=(g,m,x=0,y=0,z=0,w=1,h=w,d=w,parent=scene)=>{const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh;};
const models={person(parent,x,y,z){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return {g};}};
const coast=createCostaArriba({T,scene,make,mat,geometry,box,ball,cylinder,height:isletHeight,surfaces:{},models,inWater}),ghost=createColonGhostShip({T,scene,make,mat,geometry,box,ball,cylinder,state});
const air=createCityAirCollision(T,scene,isletHeight);assert(!air.clear(COSTA_HOMES[0].x,3,COSTA_HOMES[0].z),'birds cannot cross houses');assert(coast.blocks(CRISTO_REEF.x,CRISTO_REEF.z),'reef statue blocks boats');ghost.update(1,true,{});assert(!ghost.root.visible);state.world.dayTime=180;ghost.update(1,true,{});assert(ghost.root.visible);assert(ghost.blocks(ghost.root.position.x,ghost.root.position.z));assert(scene.userData.ghostAir.length);state.world.dayTime=10;ghost.update(0,false,{});assert(!ghost.blocks(ghost.root.position.x,ghost.root.position.z));coast.update(.1,true,{x:455,z:-48});assert(!coast.root.visible,'remote Caribbean detail excluded from city rendering');coast.update(.1,true,{x:ISLA_GRANDE.x,z:ISLA_GRANDE.z});assert(coast.root.visible,'full island detail returns on approach');coast.dispose();ghost.dispose();materials.forEach(m=>m.dispose());geo.forEach(g=>g.dispose());
console.log('PASS Costa Arriba roads and dry solid houses, native jet ski, offshore reef, both San Blas fleet exclusions, full pirate route, night-only appearance and collisions');

import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {fruitGroves,createFruitAbundance} from '../games/adventure/fruit-abundance.js';
import {CARIBBEAN_HOMES,GRANDE_HOMES,ISLA_GRANDE} from '../games/adventure/costa-arriba-layout.js';
import {jungleContains,giantSnakePose} from '../games/adventure/east-jungle-layout.js';
import {planForestPatches} from '../games/adventure/forest-patches.js';
import {freshExplore,normalizeExplore,harvestFood,spendFood,exploreItems,boatClear,inWater,isletHeight,roadDistance} from '../games/adventure/explore-state.js';
import {createWorldCollision} from '../games/adventure/world-collision.js';
import {wildlifeEncounter} from '../games/adventure/wildlife-safety.js';
import {returnToHospital,CITY_HOSPITAL} from '../games/adventure/volcano-safety.js';
assert.equal(new Set(exploreItems.map(p=>p.id)).size,exploreItems.length,'one collectible per saved ID; Taboga keeps its legacy IDs');
const world=freshExplore(),solids=createWorldCollision({state:{world}});
assert(ISLA_GRANDE.rx>=60&&ISLA_GRANDE.rz>=40);assert.equal(GRANDE_HOMES.length,24);
for(const p of CARIBBEAN_HOMES){assert(!solids.clear(p.x,p.z),'shared building collision');for(const dx of [-p.w/2,p.w/2])for(const dz of [-p.d/2,p.d/2])assert(!inWater(p.x+dx,p.z+dz),'dry house foundation');}
const groves=fruitGroves();assert(groves.length>300);for(const kind of ['banana','coconut','mango'])assert(groves.filter(p=>p.kind===kind).length>80);assert(groves.filter(p=>p.region==='countryside').length>70);assert(groves.filter(p=>p.region==='islaGrande').length>10);
for(const p of groves){assert(!inWater(p.x,p.z));assert(roadDistance(p.x,p.z)>=17,'fruit crowns clear all traffic lanes');}
assert(planForestPatches().filter(p=>p.patch.startsWith('darien')).length>450);
for(let t=0;t<1000;t+=5){const p=giantSnakePose(t);assert(jungleContains(p.x,p.z),'snake stays within the eastern forest and freshwater habitat');}
const scene=new T.Scene(),materials=[],geometries=[],geometry=g=>(geometries.push(g),g),mat=(color,opts={})=>{const m=new T.MeshStandardMaterial({color,...opts});materials.push(m);return m;};
const trees=createFruitAbundance({T,scene,state:{world},geometry,mat,ball:geometry(new T.SphereGeometry(1,8,6)),cylinder:geometry(new T.CylinderGeometry(1,1,1,8)),height:isletHeight});assert(trees.root.children.length<14,'thousands of fruits share cheap batches');
for(const kind of ['banana','coconut','mango']){const tree=trees.foodTrees.find(p=>p.kind===kind);for(const fruit of tree.fruits){assert(harvestFood(world,tree));fruit.visible=false;assert(!fruit.visible);}assert(!harvestFood(world,tree));const saved=normalizeExplore(JSON.parse(JSON.stringify(world)));assert.equal(saved.harvested[tree.id],tree.fruits.length);assert.equal(saved.food[kind],tree.fruits.length);assert(spendFood(saved,kind));assert.equal(saved.food[kind],tree.fruits.length-1);}
const oldBoat=freshExplore();oldBoat.boat={x:175,z:-487,heading:1.2};const shoreBoat=normalizeExplore(oldBoat);assert(boatClear(shoreBoat.boat.x,shoreBoat.boat.z));assert(Math.hypot(shoreBoat.boat.x-175,shoreBoat.boat.z+487)<90,'boats on newly expanded land recover to the local shore');assert.equal(shoreBoat.boat.heading,1.2);
const legacy=normalizeExplore({inventoryVersion:1,food:{banana:7,coconut:4},foodTotal:{banana:9,coconut:8}});assert.equal(legacy.food.banana,7);assert.equal(legacy.food.coconut,4);assert.equal(legacy.food.mango,0);assert.deepEqual(normalizeExplore(legacy),legacy);
for(const kind of ['shark','crocodile','snake']){const animal={kind,x:0,y:0,z:0,radius:1,length:3,heading:0};assert(wildlifeEncounter({x:4,y:0,z:0},[animal])?.hit===false,'warning before contact');assert(wildlifeEncounter({x:.3,y:0,z:0},[animal])?.hit);assert(!wildlifeEncounter({x:0,y:10,z:0},[animal]));assert(!wildlifeEncounter({x:0,y:0,z:0},[animal],{protected:true}));}
world.mansion.stage=4;const food={...world.food};world.x=650;world.z=-100;returnToHospital(world);assert.equal(world.x,CITY_HOSPITAL.spawn.x);assert.deepEqual(world.food,food);assert.equal(world.mansion.stage,4);
trees.dispose();materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());console.log('PASS 24 Isla Grande homes/dry full footprints, 300+ shared fruit trees with real harvest/eat/save, eastern jungle density, single snake habitat, warnings/contact/ride protection and progress-preserving restart');

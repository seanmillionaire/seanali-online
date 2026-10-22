import assert from 'node:assert/strict';
import {createCruiseHelm,cruiseHullClear,cruiseCameraPose} from '../games/adventure/cruise-helm.js';
import {cruisePose,CRUISE_LENGTH,normalizeCruise,advanceCruise} from '../games/adventure/cruise-route.js';
const helm=createCruiseHelm();let samples=0;
for(const sign of [-1,1])for(let d=0;d<CRUISE_LENGTH;d+=.5){const p=helm.step(d,.1,true,{x:sign,z:-1});assert(cruiseHullClear(p),'full liner clearance '+d);assert(Math.abs(helm.offset)<=7);samples++;}
helm.reset();const a=helm.step(180,.1,true,{x:1,z:0}),b=cruisePose(180);assert(Math.hypot(a.x-b.x,a.z-b.z)>.3,'rudder changes real ship position');const offset=helm.offset,speed=helm.speed;helm.step(180,1,true,{x:-1,z:1},false);assert.equal(helm.offset,offset);assert.equal(helm.speed,speed);
for(let i=0;i<60;i++)helm.step(180,.1,true,{x:0,z:1});assert(helm.speed<.001,'brake stops');for(let i=0;i<60;i++)helm.step(180,.1,true,{x:0,z:-1});assert(helm.speed>11.9,'throttle speeds up');for(let i=0;i<100;i++)helm.step(180,.1,false);assert(Math.abs(helm.offset)<.001,'auto centers safely');const c=normalizeCruise({tickets:1,active:true});assert(!advanceCruise(c,.1,true,0));assert.equal(c.distance,0);advanceCruise(c,.1,true,12);assert(Math.abs(c.distance-1.2)<1e-9);console.log('PASS',samples,'canal hull samples, actual steering, boundaries, throttle, brake, auto centering, pause');

for(const phone of [false,true])for(const manual of [false,true]){const p=cruiseCameraPose({x:0,y:8.62,z:0,heading:1},phone,manual,()=>18,()=>true);assert(p.y<17,'bridge cannot cover the underpass view');}console.log('PASS bridge sightline protection on phone and desktop');

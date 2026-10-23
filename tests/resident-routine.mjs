import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {createResidentRoutine} from '../games/adventure/resident-routine.js';
const make=()=>({g:new T.Group(),arms:[new T.Group(),new T.Group()],legs:[new T.Group(),new T.Group()]});
const p=make(),q=make(),clear=(x,z)=>Math.abs(x)<5&&Math.abs(z)<5;
const a=createResidentRoutine(p,{seed:31,home:{x:0,z:0},height:()=>0,clear,radius:4}),b=createResidentRoutine(q,{seed:49,home:{x:0,z:0},height:()=>0,clear,radius:4});let returned=false,walked=false,different=false;
for(let i=0;i<36000;i++){const before=p.g.position.clone();a.update(1/60);b.update(1/60);assert(clear(p.g.position.x,p.g.position.z));assert(before.distanceTo(p.g.position)<.03,'no teleport');returned ||=p.g.userData.activity==='resting at home';walked ||=p.g.userData.activity==='walking';different ||=p.g.position.distanceTo(q.g.position)>1;}
assert(returned&&walked&&different);const before=p.g.position.clone();a.update(1,false);assert.deepEqual(p.g.position,before);for(let i=0;i<600;i++)a.update(1/60,true,()=>true);assert.deepEqual(p.g.position,before);console.log('PASS independent decisions, walks, home returns, bounded speed, safe routes, pause and yielding over ten minutes');

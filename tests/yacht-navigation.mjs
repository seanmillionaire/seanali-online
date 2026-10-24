import assert from 'node:assert/strict';
import {steerYacht,yachtHullClear} from '../games/adventure/yacht-navigation.js';
const water=(x,z)=>Math.abs(x)<30&&Math.abs(z)<30;
let p={x:0,z:0,heading:0};
for(let i=0;i<30;i++)p=steerYacht(p,0,1,.1,water);
assert(p.z>15&&p.z<23.3,'moves freely and stops before shoreline');assert(yachtHullClear(p,water));
const stopped=steerYacht(p,0,0,.1,water);assert.equal(stopped.z,p.z);assert.equal(stopped.speed,0);
assert.deepEqual(steerYacht(p,1,0,0,water),{...p,speed:0});
for(let i=0;i<100;i++){p=steerYacht(p,-1,0,.1,water);assert(yachtHullClear(p,water));}
assert(p.x< -10,'can turn and travel across water');
let reverse={x:0,z:0,heading:0};for(let i=0;i<60;i++)reverse=steerYacht(reverse,0,-1,.1,water);assert(reverse.z< -10,'can turn around');
let swept=steerYacht({x:0,z:0,heading:0},0,1,9,(x,z)=>z<7.3);assert(swept.z<.6,'long frames cannot tunnel across shore');
console.log('PASS manual steering, release-to-stop, pause, turning, hull clearance and swept shoreline checks');

import assert from 'node:assert/strict';
import {sailingSpeedLimit,sailingVelocity,SAIL_SPEED} from '../games/adventure/ocean-travel.js';
import {boatStep,boatClear} from '../games/adventure/explore-state.js';
const sea={water:()=>true,fresh:()=>false};
assert.equal(sailingSpeedLimit(0,0,0,sea),52);
assert.equal(sailingSpeedLimit(0,0,0,{...sea,fresh:()=>true}),15);
assert.equal(sailingSpeedLimit(0,0,0,{...sea,water:(x,z)=>z<8}),15);
assert(sailingSpeedLimit(0,0,0,{...sea,water:(x,z)=>z<32})<35);
assert.equal(sailingSpeedLimit(0,0,0,{...sea,water:(x,z)=>x<8}),15,'side shores also slow cruise');
let v=0,d=0;for(let i=0;i<300;i++){v=sailingVelocity(v,52,1,1/60);d+=v/60;}
assert(d>230,'open-water five-second crossing exceeds 230 units versus former 67');
v=sailingVelocity(52,15,1,.5);assert(v<17,'shore approach brakes quickly');
v=sailingVelocity(52,52,0,1);assert(v<.1,'release stops cruise');
assert.equal(sailingSpeedLimit(6.5,16,0),SAIL_SPEED.harbor,'home dock remains slow');
assert.equal(sailingSpeedLimit(40,-70,0),SAIL_SPEED.harbor,'canal remains slow');
let p={x:110,z:140};for(let i=0;i<160;i++){p=boatStep(p.x,p.z,0,-52/30);assert(boatClear(p.x,p.z),'fast boat hull never tunnels onto Taboga');}
console.log('PASS offshore 52 / harbor 15, corridor look-ahead, braking, release, canal and swept shoreline collision; 5s crossing = '+d.toFixed(1));

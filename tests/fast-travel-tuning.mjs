import assert from 'node:assert/strict';
import {DRIVE_SPEED,driveByDirection} from '../games/adventure/directional-drive.js';
import {balloonTravelSpeed,flightStep,sweptFlightStep} from '../games/adventure/flight-travel.js';
assert.equal(DRIVE_SPEED.normal,32);assert.equal(DRIVE_SPEED.normalAcceleration,12);assert.equal(balloonTravelSpeed(false),42);assert.equal(balloonTravelSpeed(true),84);assert.equal(balloonTravelSpeed(true,true),12);
for(const dt of [1/120,1/60,1/30,.1,.5]){const car={x:0,z:0,heading:0};let speed=112,largest=0,last=0;for(let i=0;i<100;i++){speed=driveByDirection(car,0,1,speed,dt,true,(x,z)=>{largest=Math.max(largest,z-last);last=z;return z<5;},null,true);}assert(car.z<5,'no thin-wall tunnelling');assert(largest<.151,'swept <= .15');assert.equal(speed,0);}
for(const fast of [false,true]){const c={x:0,z:0,heading:0};let v=0;for(let i=0;i<60;i++)v=driveByDirection(c,0,1,v,1/60,fast,()=>true);assert(Math.abs(v-(fast?42:12))<1e-8);assert.equal(driveByDirection(c,0,0,v,1/60,fast,()=>true),0);}
for(const dt of [.016,.1,.5,2]){const p=flightStep(0,0,84,0,dt,{x:3,z:0});assert(p.x<=3,'balloon target overshoot');}
console.log('PASS normal preserved; fast acceleration 19 -> 42, top 52 -> 78, overdrive 82 -> 112; balloon 42 -> 84; swept car walls at 2–120 FPS; balloon target clamp');

for(const dt of [.1,.5,2]){const p=sweptFlightStep(0,0,84,0,dt,null,x=>x<3||x>4);assert(p.x<3,'low-altitude balloon cannot tunnel through ridge');}

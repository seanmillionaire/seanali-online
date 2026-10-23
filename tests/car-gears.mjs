import assert from 'node:assert/strict';
import {carEngineResponse} from '../games/adventure/car-audio.js';
let s={rpm:0,load:0},shifts=0;for(let frame=0;frame<900;frame++){const v=Math.min(52,frame/12),next=carEngineResponse(s,v,1,1/60);if(next.gear>(s.gear||1))shifts++;s=next;}
assert.equal(shifts,4);assert.equal(s.gear,5);assert(s.rpm<.9);for(let i=0;i<300;i++)s=carEngineResponse(s,40.1+(i%2?.1:-.1),1,1/60);assert.equal(s.gear,5,'threshold hysteresis prevents gear hunting');for(let i=0;i<300;i++)s=carEngineResponse(s,0,0,1/60);assert.equal(s.gear,1);assert(s.rpm<.14);s=carEngineResponse(s,-20,1,.1);assert.equal(s.gear,1,'reverse never upshifts');console.log('PASS four upshifts, stable cruising gear, no hunting, idle return, reverse');

let normal={rpm:0,load:0};for(let f=0;f<400;f++)normal=carEngineResponse(normal,Math.min(32,f/5),1,1/60);assert.equal(normal.gear,5,'normal driving reaches top gear');assert(normal.rpm<.65,'normal cruise is not redline');

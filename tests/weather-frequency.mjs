import assert from 'node:assert/strict';
import {stormCells,stormActivity,regionalWeather} from '../games/adventure/regional-weather.js';
for(let t=0;t<=360;t++)assert(stormCells(t).every(c=>c.strength===0),'clear start');
let wet=0;for(let t=0;t<720;t++)if(stormCells(t).some(c=>c.strength>.04))wet++;
assert(wet<150,`too many wet seconds: ${wet}`);
assert(stormActivity(390)>.9,'showers still occur');
for(let t=0;t<1440;t+=5)for(const c of stormCells(t)){const w=regionalWeather(c.x,c.z,t);assert(w.rain>=0&&w.rain<=1);if(stormCells(t).every(c=>!c.strength))assert.equal(w.rain,0);}
console.log(`PASS clear first six minutes; rain possible ${wet}/720 seconds; bounded rain and dry intervals`);

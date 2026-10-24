import assert from 'node:assert/strict';
import {COIBA_WHALE_ROUTES,coibaWhalePose} from '../games/adventure/perlas-whale.js';
import {marineWater} from '../games/adventure/explore-state.js';
assert.equal(COIBA_WHALE_ROUTES.length,2);
for(let t=0;t<1200;t+=.5){const poses=COIBA_WHALE_ROUTES.map(r=>coibaWhalePose(r,t+r.phase));for(const p of poses)for(let a=0;a<Math.PI*2;a+=Math.PI/8)assert(marineWater(p.x+Math.cos(a)*12,p.z+Math.sin(a)*12),`whale touches land at ${p.x},${p.z}`);assert(Math.hypot(poses[0].x-poses[1].x,poses[0].z-poses[1].z)>24,'whales overlap');}
console.log('PASS two Coiba whales: 20 minutes of open-water hull clearance and separate routes');

import assert from 'node:assert/strict';
import {cacheStartupHeights,isletHeight} from '../games/adventure/explore-state.js';
const points=Array.from({length:12000},(_,i)=>[-700+(i*37.17)%1500,-450+(i*19.71)%800]);
const baseline=points.map(p=>isletHeight(...p)),release=cacheStartupHeights();
for(let repeat=0;repeat<3;repeat++)points.forEach((p,i)=>assert.equal(isletHeight(...p),baseline[i]));release();points.forEach((p,i)=>assert.equal(isletHeight(...p),baseline[i]));
console.log('PASS 48,000 exact terrain comparisons before, during repeated cache reads, and after cache release');

import assert from 'node:assert/strict';
import {COLON_OFFSET,freshwaterHabitat,gatunWater} from '../games/adventure/geography.js';
import {inWater,marineWater,sharkClearance,recoverShark} from '../games/adventure/explore-state.js';
import {MARINE_HABITATS} from '../games/adventure/island-life.js';
import {animalClear} from '../games/adventure/animal-boundaries.js';
import {createCrocodileMotion,stepCrocodile,crocodileClear} from '../games/adventure/colon-wildlife.js';
const localWater=(x,z)=>inWater(x+COLON_OFFSET.x,z+COLON_OFFSET.z);
const reptiles=[];
for(let i=0;i<8;i++)reptiles.push(createCrocodileMotion(i,localWater,reptiles));
const starts=reptiles.map(p=>({...p}));let motion=0;
for(let step=0;step<1200;step++)for(const p of reptiles){const x=p.x,z=p.z;stepCrocodile(p,.05,localWater,null,reptiles);motion+=Math.hypot(x-p.x,z-p.z);assert(crocodileClear(p.x,p.z,p.heading,localWater),'entire crocodile stays in freshwater');assert(freshwaterHabitat(p.x+COLON_OFFSET.x,p.z+COLON_OFFSET.z));}
assert(motion>10,'reptiles continue roaming');assert(new Set(starts.map(p=>p.x.toFixed(1)+','+p.z.toFixed(1))).size>=6,'reptiles have distinct homes');
for(const points of Object.values(MARINE_HABITATS))for(const [x,z]of points)assert(marineWater(x,z),'ocean spawn is marine');
let checked=0;
for(let x=-90;x<10;x+=2)for(let z=-365;z<-300;z+=2)if(gatunWater(x,z)&&inWater(x,z)){
 assert(!marineWater(x,z));assert(sharkClearance(x,z)<13);assert(!animalClear('dori',x,z));assert(!animalClear('pip',x,z));checked++;
}
assert(checked>100);assert(marineWater(8,28),'Gorgona ocean remains available');const r=recoverShark(-55,-318);assert(marineWater(r.x,r.z));
console.log('PASS Gatún freshwater habitat: '+checked+' lake samples exclude marine animals, all eight crocodiles remain in freshwater for 60 seconds, distinct spawns and movement; ocean habitats remain open');

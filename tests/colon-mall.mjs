import assert from 'node:assert/strict';
import {MALL_SHOPS,mallBlocked,MARGARITA_ROAD,mallGround} from '../games/adventure/colon-mall-layout.js';
import {isletHeight,inWater} from '../games/adventure/explore-state.js';
for(const p of MALL_SHOPS){for(let z=-386;z>=-408;z-=.25){assert(!mallBlocked(p.x,z,.5),'open entrance and return route');assert(!inWater(p.x,z));assert(Math.abs(isletHeight(p.x,z)-3.8)<.1);}assert(mallBlocked(p.x,-411));assert(mallBlocked(p.x+6.5,-404));}
for(let i=1;i<MARGARITA_ROAD.length;i++){const a=MARGARITA_ROAD[i-1],b=MARGARITA_ROAD[i];for(let t=0;t<=1;t+=.02){const x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;assert(!inWater(x,z),'dry connecting road');assert(!mallBlocked(x,z,2));}}
assert.equal(mallGround(-30,-334),0,'monkey lake remains untouched');console.log('PASS mall entrance/exit clearance, solid walls, flat dry floors, road connection, lake preservation');
import {buyMallOutfit} from '../games/adventure/mall-shopping.js';
import {normalizePanama} from '../games/adventure/panama-state.js';
import {normalizeMansion} from '../games/adventure/mansion-state.js';
const world={panama:normalizePanama(null),mansion:normalizeMansion(null)};assert(!buyMallOutfit(world,'coral',11));assert(buyMallOutfit(world,'coral',12));assert.equal(world.panama.spent,12);assert.equal(normalizeMansion(world.mansion).outfit,'coral');assert.deepEqual(normalizePanama(world.panama).mallOutfits,['coral']);assert(buyMallOutfit(world,'coral',0));assert.equal(world.panama.spent,12);assert.equal(MALL_SHOPS.length*2,12);console.log('PASS 3x retail area, saved clothing purchase/equip, insufficient funds, no repeat charge');

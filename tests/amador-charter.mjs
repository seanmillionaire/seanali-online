import assert from 'node:assert/strict';
import {createCharterNavigation,CHARTER_BERTH,CHARTER_KIOSK} from '../games/adventure/charter-navigation.js';
import {marineWater,onDock} from '../games/adventure/explore-state.js';
import {yachtHullClear} from '../games/adventure/yacht-navigation.js';
assert(onDock(CHARTER_KIOSK.x,CHARTER_KIOSK.z));assert(yachtHullClear(CHARTER_BERTH,marineWater));
let blocked=false;const c=createCharterNavigation((x,z)=>marineWater(x,z)&&(!blocked||x<520));
for(let i=0;i<250;i++)c.steer(1,.3,.1);assert(Math.hypot(c.pose.x-CHARTER_BERTH.x,c.pose.z-CHARTER_BERTH.z)>50);assert(c.trailLength<=8192);
const before={...c.pose};c.returnHome();assert.deepEqual(c.pose,before,'return request never teleports');assert.equal(c.update(0),false);assert.deepEqual(c.pose,before,'pause');
let done=false;for(let i=0;i<20000&&!done;i++){const old={...c.pose};done=c.update(.1);assert(Math.hypot(old.x-c.pose.x,old.z-c.pose.z)<=.60001);assert(yachtHullClear(c.pose,marineWater));}
assert(done,'returns to marina');assert(Math.hypot(c.pose.x-CHARTER_BERTH.x,c.pose.z-CHARTER_BERTH.z)<.001);
const again={...c.pose};c.resume();c.steer(0,0,.1);assert.equal(c.pose.x,again.x);console.log('PASS actual marina charter: dock access, manual voyage, continuous safe return, pause, bounded trace, resume');

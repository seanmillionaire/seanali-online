import assert from 'node:assert/strict';
import {findClearPlacement} from '../games/adventure/safe-placement.js';
import {createWorldCollision} from '../games/adventure/world-collision.js';
import {freshExplore,inWater} from '../games/adventure/explore-state.js';
import {CITY_ALL_PLOTS} from '../games/adventure/city-layout.js';
import {canDriveOnLand} from '../games/adventure/pizza-city.js';
import {vehiclePoseClear} from '../games/adventure/auto-drive.js';
import {groundTravelStep} from '../games/adventure/travel-mode.js';
const state={world:freshExplore()},solids=createWorldCollision({state});
let plots=0;
for(const p of CITY_ALL_PLOTS.filter(p=>p.solid!==false&&p.id!=='football')){
 const clear=(x,z)=>solids.clear(x,z)&&!inWater(x,z),spot=findClearPlacement(p,clear);assert(spot,p.id+' has a landing');
 assert(clear(spot.x,spot.z));assert(Math.hypot(spot.x-p.x,spot.z-p.z)<80);
 assert([[1,0],[-1,0],[0,1],[0,-1]].some(([x,z])=>{const n=groundTravelStep(spot.x,spot.z,x,z,clear);return Math.hypot(n.x-spot.x,n.z-spot.z)>.4;}),'can move after landing');plots++;
}
const car={x:360,z:-48,heading:.8},clearCar=p=>vehiclePoseClear(p,(x,z)=>canDriveOnLand(x,z)&&solids.hardClear(x,z));
assert(!clearCar(car));const parked=findClearPlacement(car,clearCar,{headings:[.8,0,Math.PI/2]});assert(parked&&clearCar(parked),'whole car moves out of pizzeria');
const vehicleBlock=(x,z)=>Math.abs(x)<1.4&&Math.abs(z)<2.2;const beside=findClearPlacement({x:0,z:0},(x,z)=>!vehicleBlock(x,z));assert(beside&&!vehicleBlock(beside.x,beside.z));
assert.deepEqual(findClearPlacement({x:3,z:4},()=>true),{x:3,z:4},'valid placement stays put');assert.equal(findClearPlacement({x:0,z:0},()=>false,{maxRadius:2}),null,'no unchecked fallback');
console.log('PASS safe landings and movement beside '+plots+' city plots, whole-car recovery, parked-car avoidance, no needless movement and no invalid fallback');
import {vehicleOverlap} from '../games/adventure/vehicle-contact.js';
const other={x:347,z:-50,heading:0,length:2.35,width:1.25},overlap={x:345,z:-50,heading:0,length:2.35,width:1.25};
const separated=findClearPlacement(overlap,p=>clearCar(p)&&!vehicleOverlap({...p,length:2.35,width:1.25},other),{headings:[0,Math.PI/2]});assert(separated);assert(!vehicleOverlap({...separated,length:2.35,width:1.25},other),'recovery cannot overlap the second owned car');

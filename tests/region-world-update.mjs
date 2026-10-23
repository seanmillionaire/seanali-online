import assert from 'node:assert/strict';
import {normalizeExplore,freshExplore,HIGHWAY_CURVES,inWater} from '../games/adventure/explore-state.js';
import {ISLA_GRANDE,ISLA_LIGHTHOUSE,COSTA_HOMES,GRANDE_HOMES} from '../games/adventure/costa-arriba-layout.js';
import {canDriveOnLand} from '../games/adventure/pizza-city.js';
import {createWorldCollision} from '../games/adventure/world-collision.js';
import {vehicleEscapeClear,vehicleOverlap} from '../games/adventure/vehicle-contact.js';
import {trafficMoveClear} from '../games/adventure/traffic-yield.js';
import {DESTINATIONS,CITY_CENTER} from '../games/adventure/geography.js';
const old=freshExplore();delete old.caribbeanLayoutVersion;delete old.tabogaLayoutVersion;old.x=175;old.z=-502;old.boat={x:110,z:112,heading:1};old.food.banana=23;const next=normalizeExplore(old);assert.equal(next.z,ISLA_GRANDE.z);assert.equal(next.food.banana,23);assert.deepEqual(normalizeExplore(next),next);assert(!inWater(ISLA_LIGHTHOUSE.x,ISLA_LIGHTHOUSE.z));
assert(COSTA_HOMES.length>11);for(const houses of [COSTA_HOMES,GRANDE_HOMES]){assert(houses.some(p=>p.stilt));assert(houses.some(p=>!p.stilt));}
const [tx,tz]=DESTINATIONS.islet.at;assert(Math.hypot(tx-CITY_CENTER.x,tz-CITY_CENTER.z)<Math.hypot(tx,tz));
const solids=createWorldCollision({state:{world:freshExplore()}});let samples=0;for(const path of Object.values(HIGHWAY_CURVES))for(const [x,z]of path){assert(canDriveOnLand(x,z)&&solids.hardClear(x,z),`road blocked ${x},${z}`);samples++;}
const route=[{x:0,z:-20},{x:0,z:20},{x:10,z:20},{x:10,z:-20}],taxi={route,distance:0,bus:false},obstacle={x:0,z:-10,heading:0};assert(!trafficMoveClear(taxi,20,[],[obstacle]),'sweep prevents tunneling');assert(trafficMoveClear(taxi,1,[],[obstacle]));assert(vehicleEscapeClear({x:0,z:-1,heading:0},{x:0,z:3,heading:0},{x:0,z:0,heading:0}),'back out of overlapping saved traffic');assert(!vehicleEscapeClear({x:0,z:1,heading:0},{x:0,z:3,heading:0},{x:0,z:0,heading:0}));assert(!vehicleOverlap({x:0,z:0},{x:3,z:0}));
console.log(`PASS one-time island migration, inventory, mixed foundations, island lighthouse, Taboga geography, ${samples} unobstructed road centers, swept traffic and escape`);

for(const [id,path]of Object.entries(HIGHWAY_CURVES))for(let i=1;i<path.length-1;i++){const [x,z]=path[i],a=path[i-1],b=path[i+1],h=Math.atan2(b[0]-a[0],b[1]-a[1]);for(const dx of [-1.25,1.25])for(const dz of [-4,4]){const nx=x+dx*Math.cos(h)+dz*Math.sin(h),nz=z-dx*Math.sin(h)+dz*Math.cos(h);assert(canDriveOnLand(nx,nz)&&solids.hardClear(nx,nz),id+' bus-sized road clearance');}}console.log('PASS car and bus body clearance along every highway');

import assert from 'node:assert/strict';
import {vehicleOverlap} from '../games/adventure/vehicle-contact.js';
const parked={x:0,z:0,heading:0};
assert(vehicleOverlap(parked,{x:0,z:4,heading:0}));
assert(!vehicleOverlap(parked,{x:3,z:0,heading:0}),'adjacent lane stays open');
assert(vehicleOverlap(parked,{x:2,z:0,heading:Math.PI/2}),'crossing car footprint detected');
assert(vehicleOverlap(parked,{x:0,z:6,heading:0,length:4.8,width:1.15}),'long bus nose stops early');
for(const heading of [0,.7,Math.PI/2,Math.PI]){
 let z=12;for(let i=0;i<1000;i++){const next=z-.04;if(!vehicleOverlap(parked,{x:0,z:next,heading}))z=next;}
 assert(!vehicleOverlap(parked,{x:0,z,heading}),'car stays outside the occupied footprint');assert(z>0,'no tunneling through stopped player');
 assert.equal(vehicleOverlap(parked,{x:1,z:3,heading}),vehicleOverlap({x:1,z:3,heading},parked));
}
console.log('PASS stopped car, crossing traffic, long buses, adjacent lanes, symmetric contact and approach stopping');

const {driveByDirection}=await import('../games/adventure/directional-drive.js');
for(const fast of [false,true]){const car={x:0,z:-15,heading:0};let speed=0;for(let i=0;i<1200;i++)speed=driveByDirection(car,0,1,speed,.1,fast,(x,z)=>!vehicleOverlap({x,z,heading:car.heading},parked));assert(car.z<0);assert(!vehicleOverlap(car,parked));}console.log('PASS real driving integration: normal and fast input stop before occupied car');

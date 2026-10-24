import assert from 'node:assert/strict';
import {pedestrianVehicleClear,vehicleOverlap} from '../games/adventure/vehicle-contact.js';
const bus={x:0,z:0,heading:0,length:4.8,width:1.15};
assert(!pedestrianVehicleClear({x:0,z:4.5},[bus]),'bus nose uses the full traffic hull');
for(const heading of [0,.3,Math.PI/2,2.4])for(let x=-7;x<7;x+=.3)for(let z=-7;z<7;z+=.3){const obstacle={...bus,heading},body={x,z,heading:0,length:.45,width:.45};assert.equal(pedestrianVehicleClear(body,[obstacle]),!vehicleOverlap(body,obstacle),'walking and traffic agree on the same gap');}
const contact={x:1.5,z:0};assert(!pedestrianVehicleClear(contact,[bus]));assert(pedestrianVehicleClear({x:1.6,z:0},[bus],contact),'existing contact permits a step outward');assert(!pedestrianVehicleClear({x:1.4,z:0},[bus],contact),'no inward step through a bus');assert(pedestrianVehicleClear({x:1.9,z:0},[bus],contact));
assert(!pedestrianVehicleClear({x:2.8,z:0},[bus,{...bus,x:4}],contact),'escaping one vehicle cannot enter another');
console.log('PASS pedestrian/traffic hull agreement, bus nose, safe contact exit and no pass-through');

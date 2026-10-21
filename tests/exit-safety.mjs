import assert from 'node:assert/strict';
import {safeVehicleExit} from '../games/adventure/vehicle-contact.js';
for(const heading of [0,Math.PI/2,Math.PI,Math.PI*1.5]){
 const car={x:12,z:25,heading},blocked=safeVehicleExit(car,()=>false);assert.equal(blocked,null);
 const side=safeVehicleExit(car,()=>true);assert(Math.hypot(side.x-car.x,side.z-car.z)>2.6);
 let tries=0;const other=safeVehicleExit(car,()=>++tries===2);assert(other);assert.equal(tries,2,'blocked driver door tries passenger door');
}
console.log('PASS safe exits in every orientation, blocked door alternate, no invalid fallback');

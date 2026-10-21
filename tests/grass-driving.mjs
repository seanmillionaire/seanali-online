import assert from 'node:assert/strict';
import {canDriveOnLand} from '../games/adventure/pizza-city.js';
import {roadDistance,HIGHWAY_WIDTH,inWater} from '../games/adventure/explore-state.js';
import {driveByDirection} from '../games/adventure/directional-drive.js';
let tested=0;
for(let x=-300;x<300;x+=3)for(let z=-100;z<30;z+=3){
 if(roadDistance(x,z)<HIGHWAY_WIDTH/2+2||![0,.5,1].every(d=>canDriveOnLand(x+d,z)))continue;
 const car={x,z,heading:0};const speed=driveByDirection(car,1,0,32,1/60,false,canDriveOnLand);
 assert.equal(speed,32);assert.ok(car.x>x);tested++;
}
assert.ok(tested>100);
let water=0;for(let x=-500;x<500;x+=25)for(let z=-400;z<400;z+=25)if(inWater(x,z)){assert.equal(canDriveOnLand(x,z),false);water++;}
const car={x:0,z:0,heading:0};assert.equal(driveByDirection(car,1,0,15,.1,false,()=>false),0);assert.equal(car.x,0);
console.log(`PASS ${tested} off-road grass positions retain full momentum; ${water} water positions blocked; solid collision still stops car`);

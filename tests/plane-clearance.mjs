import assert from 'node:assert/strict';
import {flightAltitude,clearFlightAltitude} from '../games/adventure/plane-clearance.js';
assert.equal(flightAltitude(()=>0,0,0,1,0,0),110);
assert.equal(flightAltitude(()=>0,0,0,1,0,180),220);
assert.equal(flightAltitude((x,z)=>x===100&&z===18?250:0,0,0,1,0),290);
assert.equal(clearFlightAltitude(110,150,0),190);
assert.equal(clearFlightAltitude(190,0,0),190);
assert.equal(clearFlightAltitude(110,0,200),240);
console.log('Plane clearance: ground, mountains, wingspan, airborne player and no descent passed');

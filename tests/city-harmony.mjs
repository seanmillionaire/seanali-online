import assert from 'node:assert/strict';
import {cityPropSite,CITY_STREET_X,CITY_STREET_Z} from '../games/adventure/city-layout.js';
import {cityX} from '../games/adventure/geography.js';
import {TRAFFIC_ROUTES,routePose} from '../games/adventure/panama-state.js';
import {canDriveOnLand} from '../games/adventure/pizza-city.js';
let props=0;
for(const x of CITY_STREET_X)for(const z of CITY_STREET_Z){const p=cityPropSite(x,z,1.8);assert.ok(p);assert.ok(CITY_STREET_X.every(v=>Math.abs(v-p.x)>=5.425));assert.ok(CITY_STREET_Z.every(v=>Math.abs(v-p.z)>=5.425));props++;}
let blocked=[];for(const [i,r] of TRAFFIC_ROUTES.entries())for(let d=0;d<routePose(r,0).length;d+=.5){const p=routePose(r,d);for(const side of [-1,0,1]){const x=p.x+Math.cos(p.heading)*side*1.7,z=p.z-Math.sin(p.heading)*side*1.7;if(!canDriveOnLand(x,z))blocked.push([i,d,x,z]);}}
assert.deepEqual(blocked,[],'traffic routes must be driveable');
console.log('PASS '+props+' intersection prop relocations; every traffic route sampled at 0.5m is driveable');

const {cityStreetSurface}=await import('../games/adventure/road-surfaces.js');
const hill=(x,z)=>3*Math.exp(-(x*x+z*z)/24);
const mesh=cityStreetSurface([{x:0,z:0,w:6,d:35}],hill);
for(let i=0;i<mesh.indices.length;i+=3){const v=mesh.indices.slice(i,i+3).map(n=>mesh.positions.slice(n*3,n*3+3));const x=v.reduce((a,p)=>a+p[0],0)/3,z=v.reduce((a,p)=>a+p[2],0)/3,y=v.reduce((a,p)=>a+p[1],0)/3;assert.ok(y>hill(x,z),'street sunk under terrain');}
console.log('PASS street triangles stay above curved terrain between vertices');

import assert from 'node:assert/strict';
import {highwayWidth,highwayLane,FOUR_LANE_ROADS} from '../games/adventure/highway-layout.js';
import {HIGHWAY_CURVES,isletHeight,freshExplore,nearRoad,inWater} from '../games/adventure/explore-state.js';
import {roadRibbon} from '../games/adventure/road-surfaces.js';
import {trafficLoop} from '../games/adventure/world-ambience.js';
import {createWorldCollision} from '../games/adventure/world-collision.js';
import {planForestPatches} from '../games/adventure/forest-patches.js';
import {canalWater} from '../games/adventure/geography.js';
const solid=createWorldCollision({state:{world:freshExplore()},trees:planForestPatches(1)});let samples=0;
for(const id of FOUR_LANE_ROADS){const path=HIGHWAY_CURVES[id];for(let i=1;i<path.length-1;i+=5){const [x,z]=path[i],[ax,az]=path[i-1],[bx,bz]=path[i+1],l=Math.hypot(bx-ax,bz-az),nx=(bz-az)/l,nz=-(bx-ax)/l,w=highwayWidth(id,x,z);if(w<17.499)continue;assert.equal(w,17.5);for(const offset of [-6.2,-2.3,2.3,6.2]){const px=x+nx*offset,pz=z+nz*offset;assert(nearRoad(px,pz),'outer lanes belong to road');assert(solid.clear(px,pz),'lane unobstructed '+id+' '+px+','+pz);if(canalWater(px,pz))assert(isletHeight(px,pz)>14.5,'bridge widened with ship clearance');else assert(!inWater(px,pz),'dry driving lane');samples++;}}
for(const outer of [false,true]){const loop=trafficLoop(path,(x,z)=>highwayLane(id,outer,x,z));assert(loop.length>path.length*2);assert(loop.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.z)));}
const g=roadRibbon(path,(x,z)=>highwayWidth(id,x,z),isletHeight);assert(g.positions.every(Number.isFinite));}
assert.equal(highwayWidth('cityToBaru',-385,-30),17.5);assert.equal(highwayWidth('cityToBaru',-400,-70),9.5);assert.equal(highwayWidth('gorgonaBeachAccess'),9.5);
console.log('PASS '+samples+' clear, dry four-lane samples; city bridge clearance, two traffic loops per direction, finite tapered geometry and preserved narrow turnoffs');

import assert from 'node:assert/strict';
import {ROAD_REWARDS,rewardSite} from '../games/adventure/road-rewards.js';
import {createWorldCollision} from '../games/adventure/world-collision.js';
import {freshExplore,normalizeExplore,isletHeight,HIGHWAY_CURVES,HIGHWAY_WIDTH,roadDistance,inWater,traversable,recoverBoat} from '../games/adventure/explore-state.js';
import {groundTravelSpeed,groundTravelStep} from '../games/adventure/travel-mode.js';
const world=freshExplore(),solids=createWorldCollision({state:{world}});
for(const r of ROAD_REWARDS){const p=rewardSite(r,(x,z)=>solids.clear(x,z),isletHeight),end=HIGHWAY_CURVES[r.road].at(-1);assert(p,r.id);assert(Math.hypot(p.x-end[0],p.z-end[1])<=22.01);assert(roadDistance(p.x,p.z)>HIGHWAY_WIDTH/2+2);assert(traversable(p.x,p.z)&&!inWater(p.x,p.z)&&solids.clear(p.x,p.z));if(r.kind==='jetski'){const water=recoverBoat(p.x,p.z);assert(inWater(water.x,water.z));assert(Math.hypot(water.x-p.x,water.z-p.z)<30);}}
world.travelMode='scooter';assert.equal(normalizeExplore(world).travelMode,'scooter');assert(groundTravelSpeed('scooter')>groundTravelSpeed('walk'));assert(groundTravelStep(0,0,30,0,x=>x<5).x<5);console.log('PASS seven usable road-end sites, lane clearance, nearby jet-ski water, scooter speed/save compatibility and swept movement');

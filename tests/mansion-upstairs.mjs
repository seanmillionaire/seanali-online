import * as T from '../games/adventure/vendor/three.module.min.js';
import {createCityAirCollision} from '../games/adventure/world-collision.js';
import {createWorldCollision} from '../games/adventure/world-collision.js';
import {freshExplore} from '../games/adventure/explore-state.js';
import assert from 'node:assert/strict';
import {homePath,homeMove,homeCanWalk,normalizeMansion,homeYard,HOME_LOTS} from '../games/adventure/mansion-state.js';
import {GYM_HEIGHT,floorHeight} from '../games/adventure/mansion-floors.js';
import {createWorkout,stepWorkout,tapWorkout,recordWorkout} from '../games/adventure/gym-workout.js';
import {HIGHWAY_CURVES,inWater} from '../games/adventure/explore-state.js';
import {routePointDistance} from '../games/adventure/highway-rails.js';
for(const kind of ['treadmill','yoga']){const w=createWorkout(kind),stats=normalizeMansion(null).gym;assert(!tapWorkout(w),'wait for green');for(let t=0;t<60&&!w.complete;t+=.05){const cue=stepWorkout(w,.05);if(cue.green){assert(tapWorkout(w));assert(!tapWorkout(w),'one successful tap per beat');}}assert(w.complete);assert(recordWorkout(stats,w));assert(!recordWorkout(stats,w),'finish only once');assert.equal(kind==='yoga'?stats.yoga:stats.runs,1);assert.deepEqual(normalizeMansion({gym:stats}).gym,stats);}
for(const target of [{x:-8,z:-3,floor:1},{x:7,z:-5,floor:1}]){const path=homePath({x:0,z:12},target);assert(path.length,'walk to gym');assert(path.some(p=>p.y>0&&p.y<GYM_HEIGHT),'actual stairs');assert.equal(path.at(-1).floor,1);for(let i=1;i<path.length;i++)assert(Math.abs(path[i].y-path[i-1].y)<.3,'no floor teleport');const down=homePath(target,{x:7,z:-7});assert(down.length&&down.at(-1).floor===0,'walk downstairs to dining');}
assert(!homeCanWalk(-8,-6,1),'treadmill solid');assert(homeCanWalk(7,-7,1),'yoga mat walkable');assert.equal(floorHeight(-17.5,6),GYM_HEIGHT/2);assert(homeMove(-17.5,6,0,-.5,0).y>GYM_HEIGHT/2);
for(const lot of HOME_LOTS){const world=freshExplore();world.mansion.lot=lot.id;world.mansion.stage=4;const collision=createWorldCollision({state:{world}});assert(!collision.clear(lot.x-17.5,lot.z+6),'exterior stair structure solid');const id=lot.id==='boquete'?'mansionHighlands':lot.id==='city'?'mansionCity':'mansionGorgona',p=homeYard(lot).car;assert(routePointDistance(p.x,p.z,HIGHWAY_CURVES[id])<.1,'driveway starts at garage');for(const [x,z]of HIGHWAY_CURVES[id]){assert(!inWater(x,z),'driveway dry');assert(collision.clear(x,z),'garage exit clears mansion/stairs');}assert(Object.entries(HIGHWAY_CURVES).some(([other,path])=>other!==id&&!other.startsWith('mansion')&&path.some(q=>Math.hypot(q[0]-HIGHWAY_CURVES[id].at(-1)[0],q[1]-HIGHWAY_CURVES[id].at(-1)[1])<.01)),'driveway joins actual road anchor');}
const scene=new T.Scene();scene.userData.mansionAir={x:0,z:0,w:27,d:25,bottom:0,top:8.35};const air=createCityAirCollision(T,scene,()=>0);assert(!air.clear(0,6,0),'upper gym blocks bird flight');assert(air.clear(0,11,0),'bird can fly above gym roof');
console.log('PASS two timed gym activities, exact-once saved progress, real stair ascent/descent and equipment collision, all three garages connected to dry roads');

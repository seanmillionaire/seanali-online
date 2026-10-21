import assert from 'node:assert/strict';
import {stormCells,regionalWeather} from '../games/adventure/regional-weather.js';
import {offshoreExposure,swellSet,swellHeight} from '../games/adventure/ocean-swells.js';
import {vehicleOverlap,vehicleEscapeClear} from '../games/adventure/vehicle-contact.js';
import {driveByDirection} from '../games/adventure/directional-drive.js';
for(let t=0;t<1200;t+=13){const a=stormCells(t),b=stormCells(t+1);assert.equal(a.length,3);for(let i=0;i<3;i++){assert(Math.hypot(a[i].x-b[i].x,a[i].z-b[i].z)<2);assert(regionalWeather(a[i].x,a[i].z,t).rain>.8,'heavy rain stays with moving fronts');}assert(a.some(c=>Math.abs(c.z)>200));}
assert.equal(swellHeight(360,-50,35,{x:360,y:50},64),0);assert.equal(swellHeight(0,250,35,{x:300,y:250},64),0,'no wave displacement outside render patch');assert(Math.abs(swellHeight(0,250,35,{x:0,y:-250},64))>1,'rendered swell has real height');
assert.equal(offshoreExposure(360,-50,64),0,'city harbor protected');assert.equal(offshoreExposure(0,250,64,true),0,'canal/freshwater protected');assert.equal(offshoreExposure(0,250,20),0,'beaches protected');assert.equal(offshoreExposure(0,250,64),1);assert(swellSet(35)>2.8);assert.equal(swellSet(100),.35,'quiet gaps between wave sets');
// A hull already touching a taxi may move out, but may never drive deeper through it.
for(const h of [0,.5,1.2,Math.PI])for(const deep of [false,true]){
 const taxi={x:0,z:0,heading:h,length:1.8,width:.9};const car={x:Math.sin(h)*(deep?1:3.9),z:Math.cos(h)*(deep?1:3.9),heading:h};assert(vehicleOverlap(car,taxi));
 assert(!vehicleEscapeClear({x:car.x-Math.sin(h)*.1,z:car.z-Math.cos(h)*.1,heading:h},taxi,car));
 let speed=0;for(let i=0;i<90;i++)speed=driveByDirection(car,Math.sin(h),Math.cos(h),speed,.016,false,(x,z,heading,from)=>vehicleEscapeClear({x,z,heading},taxi,from));
 assert(!vehicleOverlap(car,taxi),'real controller escapes shallow/deep taxi contact at any heading');assert(Math.hypot(car.x,car.z)>10);
}
const coincident={x:0,z:0,heading:0},taxi={...coincident};let speed=0;for(let i=0;i<100;i++)speed=driveByDirection(coincident,1,0,speed,.016,false,(x,z,heading,from)=>vehicleEscapeClear({x,z,heading},taxi,from));assert(!vehicleOverlap(coincident,taxi),'old overlapping saves can recover');
console.log('PASS moving storm cores and strong rain, sheltered ports/beaches/freshwater, occasional offshore swells, deep/shallow/rotated taxi escape without tunneling');
const T=await import('../games/adventure/vendor/three.module.min.js'),{positionMoon}=await import('../games/adventure/island-life.js');
for(const aspect of [390/844,1280/800])for(const yaw of [0,1.3,Math.PI,5]){const camera=new T.PerspectiveCamera(60,aspect,.1,1800),moon=new T.Object3D();camera.rotation.set(-.4,yaw,0);camera.updateMatrixWorld();positionMoon(moon,camera);const p=moon.position.clone().project(camera);assert(Math.abs(p.x)<.65&&Math.abs(p.y)<.8,'large moon stays inside phone/desktop view while turning');}
console.log('PASS moon remains within view on phone and desktop at all tested headings');
const {trafficYield}=await import('../games/adventure/traffic-yield.js'),{routePose}=await import('../games/adventure/panama-state.js');
const route=[{x:-100,z:0},{x:100,z:0},{x:100,z:20},{x:-100,z:20}],crowd=[{route,distance:99},{route,distance:101}],player={x:0,z:0,heading:Math.PI/2};
for(let i=0;i<150;i++)for(const car of crowd){const d=trafficYield(car,crowd,player,.016);if(d!==null)car.distance=d;}
for(const car of crowd)assert(!vehicleOverlap({...routePose(route,car.distance),length:1.8,width:.9},player),'two taxis gently separate away from wedged player');
assert(crowd[0].distance<99&&crowd[1].distance>101,'both directions yield along existing lane');
console.log('PASS player wedged between two taxis: both NPCs separate without teleporting');

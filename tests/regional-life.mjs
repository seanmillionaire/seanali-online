import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {regionalWeather,createRegionalWeather} from '../games/adventure/regional-weather.js';
import {CITY_FIXED_PLOTS,cityRoadClear,cityBlocksVehicle} from '../games/adventure/city-layout.js';
import {dogWalkRoutes} from '../games/adventure/east-city-life.js';
import {sanBlasLayout} from '../games/adventure/san-blas-layout.js';
import {migrateGeography} from '../games/adventure/geography.js';
import {explorePlaces,worldIslands} from '../games/adventure/explore-state.js';
const cays=sanBlasLayout();assert(cays.every(c=>c.z<-340));const c=cays[0],raw={geographyVersion:3,colonLayoutVersion:2,sanBlasGeographyVersion:3,x:c.x,z:c.z+180,food:{banana:7},boat:{x:c.x,z:c.z+180},estate:{buildings:[{id:1,x:c.x,z:c.z+180}]},panama:{treasures:[2]}};
const saved=migrateGeography(raw);assert.equal(saved.z,c.z);assert.equal(saved.boat.z,c.z);assert.equal(saved.estate.buildings[0].z,c.z);assert.deepEqual(saved.food,raw.food);assert.deepEqual(saved.panama,raw.panama);assert.deepEqual(migrateGeography(saved),saved);const hub=worldIslands.find(p=>p.id==='crystalCove');for(const id of ['luna','coveBalloon']){const p=explorePlaces.find(p=>p.id===id);assert(Math.hypot(p.x-hub.x,p.z-hub.z)<12);}
let north=0,south=0;for(let t=0;t<600;t+=3){const n=regionalWeather(-50,-365,t),p=regionalWeather(560,125,t),h=regionalWeather(-385,-30,t);north+=n.rain;south+=p.rain;assert(h.mist>p.mist);assert(p.cloud<n.cloud);}assert(north>south*5);assert.equal(dogWalkRoutes().length,8);
const scene=new T.Scene();scene.fog=new T.FogExp2('#aabbcc',.001);const weather=createRegionalWeather({T,scene,geometry:g=>g,height:()=>0});let strikes=0;for(let i=0;i<150;i++){weather.update(.1,true,{x:-50,z:-365});if(weather.root.children[1].visible)strikes++;}assert(strikes>0,"visible storm lightning");assert(scene.userData.regionalWeather.rain>.6);assert(weather.root.children[0].geometry.drawRange.count>1500);const time=weather.clock;weather.update(.1,false,{x:560,z:125});assert.equal(weather.clock,time);weather.update(.1,true,{indoors:true});assert(!weather.root.visible);weather.dispose();assert.equal(scene.fog.density,.001);console.log('PASS northern archipelago migration and landmarks, eight safe dog routes, differentiated weather, rain geometry, pause/interior and cleanup');

const flagBase=CITY_FIXED_PLOTS.find(p=>p.id==='flag-base');assert(cityRoadClear(flagBase),'flag base clear of roads');assert(cityBlocksVehicle(flagBase.x,flagBase.z),'pole base has collision');assert.equal(flagBase.x,360);assert.equal(flagBase.z,-73);

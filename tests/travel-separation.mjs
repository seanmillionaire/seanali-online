import assert from 'node:assert/strict';
import {CITY_CENTER,CITY_EAST_SHIFT,GEOGRAPHY_VERSION,migrateGeography,DESTINATIONS} from '../games/adventure/geography.js';
import {freshExplore,normalizeExplore,MAINLAND_ROADS,isletHeight,worldIslands} from '../games/adventure/explore-state.js';
import {CITY} from '../games/adventure/pizza-city.js';
import {CITY_HOSPITAL} from '../games/adventure/volcano-safety.js';
import {CITY_ALL_PLOTS,CITY_STREET_X,CITY_STREET_Z} from '../games/adventure/city-layout.js';
import {groundTravelSpeed,groundTravelStep} from '../games/adventure/travel-mode.js';
const distance=Math.hypot(CITY_CENTER.x,CITY_CENTER.z);assert(distance>Math.hypot(120,-50)*2.7,'city is substantially farther from Gorgona');assert.deepEqual(DESTINATIONS.home.at,[0,0]);assert.equal(CITY.x,CITY_CENTER.x);assert.equal(CITY_HOSPITAL.x,105+CITY_EAST_SHIFT);assert(CITY_ALL_PLOTS.every(p=>p.x>300),'all parcels follow city');assert(CITY_STREET_X.every(x=>x>300));assert.equal(CITY_STREET_Z.length,4);
for(const id of ['coconutCoast','crystalCove'])assert(worldIslands.find(p=>p.id===id).x>CITY.x,'eastern islands retain their geographic direction');
const progress={geographyVersion:2,colonLayoutVersion:2,sanBlasGeographyVersion:2,x:120,z:-50,food:{banana:7,coconut:3},story:{shells:2},city:{car:{x:114,z:-50,heading:.8},bags:['bag-1'],pizzas:3},estate:{buildings:[{id:42,x:125,z:-47,level:3}]},builders:{mateo:{cycle:4,completed:[{id:'mateo-city-0',region:'city',x:120,z:-89}]}},boat:{x:320,z:180}};
const next=migrateGeography(progress);assert.equal(next.geographyVersion,GEOGRAPHY_VERSION);assert.equal(next.x,360);assert.equal(next.city.car.x,354);assert.equal(next.estate.buildings[0].x,365);assert.equal(next.estate.buildings[0].id,42);assert.equal(next.estate.buildings[0].level,3);assert.equal(next.builders.mateo.completed[0].x,360);assert.equal(next.boat.x,560);assert.deepEqual(next.food,progress.food);assert.deepEqual(next.city.bags,progress.city.bags);assert.equal(next.builders.mateo.cycle,4);assert.deepEqual(migrateGeography(next),next,'no double shift');
for(const [x,z]of [[4,10],[-350,-65],[-50,-365],[110,85]]){const p=migrateGeography({...progress,x,z});assert.equal(p.x,x,'western destinations and home unchanged');assert.equal(p.z,z);}
const saved=normalizeExplore({...freshExplore(),travelMode:'skates'});assert.equal(saved.travelMode,'skates');assert.equal(normalizeExplore({...freshExplore(),travelMode:'garbage'}).travelMode,'walk');
assert(groundTravelSpeed('skates')>groundTravelSpeed('walk')*3);assert.equal(groundTravelSpeed('skates',{boosted:true}),28);assert(groundTravelSpeed('walk',{boosted:true})>groundTravelSpeed('walk',{running:true}));
const wall=(x,z)=>!(x>=1&&x<=1.4&&Math.abs(z)<2);const blocked=groundTravelStep(0,0,2.8,0,wall);assert(blocked.x<1,'fast skating cannot skip a narrow wall');const slide=groundTravelStep(0,0,2.8,2.8,wall);assert(slide.z>2,'can slide around obstacles');
for(const id of ['cityToGorgona','cityToColon'])for(const [x,z]of MAINLAND_ROADS[id])if(x>64)assert(isletHeight(x,z)>0,'longer highway stays dry');
console.log('PASS eye-view travel integration: 363m home/city separation, east-region migration once, progress/structures retained, skates 20m/s + fruit 28m/s, swept movement and connected highways');

import {driveByDirection} from '../games/adventure/directional-drive.js';
import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {HOSPITAL_PLOT,CITY_ALL_PLOTS,cityRoadClear,cityBlocksVehicle,cityOverlap} from '../games/adventure/city-layout.js';
import {CITY_HOSPITAL} from '../games/adventure/volcano-safety.js';
import {createCityAirCollision,createWorldCollision} from '../games/adventure/world-collision.js';
import {freshExplore} from '../games/adventure/explore-state.js';
import {groundTravelStep} from '../games/adventure/travel-mode.js';
assert(cityRoadClear(HOSPITAL_PLOT));assert(CITY_ALL_PLOTS.some(p=>p.id==='hospital'));
for(const p of CITY_ALL_PLOTS)if(p.id!=='hospital')assert(!cityOverlap(p,HOSPITAL_PLOT),'hospital parcel overlaps');
const {x,z}=CITY_HOSPITAL,state={world:freshExplore()},solids=createWorldCollision({state});
assert(cityBlocksVehicle(x,z));assert(!solids.clear(x,z));assert(solids.clear(CITY_HOSPITAL.spawn.x,CITY_HOSPITAL.spawn.z));
for(const dt of [1/60,.1]){const car={x,z:z+8,heading:Math.PI};let speed=0;for(let i=0;i<120;i++)speed=driveByDirection(car,0,-1,speed,dt,true,(px,pz)=>!cityBlocksVehicle(px,pz));assert(car.z>z+HOSPITAL_PLOT.d/2,'fast car stopped outside hospital');}
const scene=new T.Scene(),mesh=new T.Mesh(new T.BoxGeometry(6,4.6,5),new T.MeshBasicMaterial());mesh.position.set(x,2.3,z);scene.add(mesh);
const air=createCityAirCollision(T,scene,()=>0);
assert(!air.clear(x,3,z));assert(air.clear(x,9,z));
const stop=groundTravelStep(x,z+15,0,-30,(px,pz)=>air.clear(px,3,pz));assert(stop.hit);assert(stop.z>z+HOSPITAL_PLOT.d/2);
const over=groundTravelStep(x,z+15,0,-30,(px,pz)=>air.clear(px,9,pz));assert(!over.hit);assert(Math.abs(over.z-(z-15))<1e-6);
mesh.geometry.dispose();mesh.material.dispose();console.log('PASS hospital parcel/road clearance, shared car/walk collision, safe rescue entrance, swept bird wall collision and roof clearance');

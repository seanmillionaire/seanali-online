import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {HIGHWAY_CURVES,MAINLAND_ROADS,freshExplore,isletHeight,terrainHeight,mainlandRoadRoute} from '../games/adventure/explore-state.js';
import {highwayWidth} from '../games/adventure/highway-layout.js';
import {canalWater} from '../games/adventure/geography.js';
import {createWorldCollision} from '../games/adventure/world-collision.js';
import {planForestPatches} from '../games/adventure/forest-patches.js';
import {fruitGroves} from '../games/adventure/fruit-abundance.js';
import {canDriveOnLand} from '../games/adventure/pizza-city.js';
import {vehiclePoseClear,planAutomaticDrive,autoDrivePlaces} from '../games/adventure/auto-drive.js';
import {driveByDirection} from '../games/adventure/directional-drive.js';
import {placeGroundVehicle,VEHICLE_GROUND_PROFILES} from '../games/adventure/vehicle-grounding.js';
import {locationLabel} from '../games/adventure/location-label.js';
const state={world:freshExplore()},solids=createWorldCollision({state,trees:[...planForestPatches(),...fruitGroves()]}),clear=(x,z)=>canDriveOnLand(x,z)&&solids.clear(x,z),ring=HIGHWAY_CURVES.cityFreeway;
assert.deepEqual(ring[0],ring.at(-1));let length=0,turns=[],samples=0,bridge=0;const g=new T.Group();
for(let i=1;i<ring.length;i++){const [ax,az]=ring[i-1],[bx,bz]=ring[i],d=Math.hypot(bx-ax,bz-az),h=Math.atan2(bx-ax,bz-az);length+=d;turns.push(h);assert.equal(highwayWidth('cityFreeway',bx,bz),17.5);for(let t=0;t<1;t+=.25)for(const side of [-6.2,-2.3,2.3,6.2]){const x=ax+(bx-ax)*t+Math.cos(h)*side,z=az+(bz-az)*t-Math.sin(h)*side;for(const reverse of [false,true]){const pose={x,z,heading:h+(reverse?Math.PI:0)};assert(vehiclePoseClear(pose,clear),'full car/lane clearance '+JSON.stringify(pose));placeGroundVehicle(g,pose,isletHeight,'supercar');g.updateMatrixWorld(true);for(const point of VEHICLE_GROUND_PROFILES.supercar.support){const contact=new T.Vector3(...point).applyMatrix4(g.matrixWorld);assert(contact.y>=isletHeight(contact.x,contact.z)+.0249,'tires/body above road');}samples++;}if(canalWater(x,z)){bridge++;assert.equal(terrainHeight(x,z),0);assert(isletHeight(x,z)>14.5);}}}
for(let i=0;i<turns.length;i++){const delta=Math.atan2(Math.sin(turns[(i+1)%turns.length]-turns[i]),Math.cos(turns[(i+1)%turns.length]-turns[i]));assert(Math.abs(delta)<.035,'smooth steering including seam');}assert(length>740&&length<770);assert(bridge>30);
for(const id of ['cityToColon','cityToGorgona','cityFreewayEast']){const common=MAINLAND_ROADS[id].filter(a=>ring.some(b=>a[0]===b[0]&&a[1]===b[1]));assert.equal(common.length,1,id+' exact shared junction');assert(mainlandRoadRoute({x:317,z:-85},{x:ring[0][0],z:ring[0][1]}).length>20);}
// Drive one complete lap using the same manual acceleration/swept collision function.
const car={x:ring[0][0],z:ring[0][1],heading:Math.PI/2};let speed=0,steps=0;for(let i=1;i<ring.length;i++){const [x,z]=ring[i];for(let n=0;n<100&&Math.hypot(car.x-x,car.z-z)>.12;n++){const d=Math.hypot(x-car.x,z-car.z),dt=Math.min(.025,d/Math.max(1,speed));speed=driveByDirection(car,(x-car.x)/d,(z-car.z)/d,speed,dt,false,clear);assert(speed>0,'cruising never blocked');steps++;}}assert(Math.hypot(car.x-ring[0][0],car.z-ring[0][1])<.2,'full lap returns to start');
const destination=autoDrivePlaces(state.world).find(p=>p.id==='cityFreeway');assert(destination);const plan=planAutomaticDrive({x:360,z:-61,heading:Math.PI/2},destination,{world:state.world,clear:p=>vehiclePoseClear(p,clear)});assert(plan,'automatic driving can reach loop');assert(locationLabel(430,-148,'en').includes('Freeway'));
console.log('PASS',Math.round(length)+'m closed four-lane freeway,',samples,'full-car/ground-support checks,',bridge,'open-water bridge samples, three exact junctions, seamless curves and',steps,'manual-physics lap steps; map destination and automatic access');

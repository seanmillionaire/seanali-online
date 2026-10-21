import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {HIGHWAY_CURVES,HIGHWAY_WIDTH,isletHeight,freshExplore,MAINLAND_STOPS} from '../games/adventure/explore-state.js';
import {CITY_STREET_X,CITY_STREET_Z} from '../games/adventure/city-layout.js';
import {canalWater,gatunWater} from '../games/adventure/geography.js';
import {roadRibbon,surfaceMesh} from '../games/adventure/road-surfaces.js';
import {createWorldCollision,createRoadSurfaceSampler} from '../games/adventure/world-collision.js';
import {groundTravelStep,impactPose} from '../games/adventure/travel-mode.js';
import {driveByDirection} from '../games/adventure/directional-drive.js';
import {planForestPatches} from '../games/adventure/forest-patches.js';
const scene=new T.Scene(),geometries=[],geometry=g=>(geometries.push(g),g),material=new T.MeshStandardMaterial(),solids=createWorldCollision({state:{world:freshExplore()},trees:planForestPatches(1)});
let samples=0;for(const [id,path]of Object.entries(HIGHWAY_CURVES)){
 scene.add(surfaceMesh(T,geometry,roadRibbon(path,HIGHWAY_WIDTH,isletHeight),material,'Smooth connected highway asphalt'));
 for(let i=0;i<path.length;i++){
  const [x,z]=path[i];assert(solids.clear(x,z),'road has solid obstruction '+id+' '+x+','+z);
  assert(!(canalWater(x,z)||gatunWater(x,z))||isletHeight(x,z)>0,'road is submerged in canal '+id);samples++;
 }
}
let triangles=0;
scene.traverse(mesh=>{if(!mesh.userData.roadSurface)return;const p=mesh.geometry.attributes.position,ix=mesh.geometry.index.array;
 for(let i=0;i<ix.length;i+=3){const x=(p.getX(ix[i])+p.getX(ix[i+1])+p.getX(ix[i+2]))/3,z=(p.getZ(ix[i])+p.getZ(ix[i+1])+p.getZ(ix[i+2]))/3,y=(p.getY(ix[i])+p.getY(ix[i+1])+p.getY(ix[i+2]))/3;
  assert(y>=isletHeight(x,z)-.03,'pavement must stay above terrain across its whole width at '+x+','+z);triangles++;
 }
});
const pavement=createRoadSurfaceSampler(T,scene);assert(pavement.count>4000);
for(const path of Object.values(HIGHWAY_CURVES))for(const [x,z]of path.filter((_,i)=>i%3===0)){assert(Number.isFinite(pavement.height(x,z)),'rendered pavement is present at every route sample');assert(pavement.height(x,z)>=isletHeight(x,z)-.03,'player stands on road, not below it');}
assert(Math.min(...CITY_STREET_Z.map(z=>Math.abs(z+50)),...CITY_STREET_X.map(x=>Math.abs(x-360)))<16,'capital center has connected local streets');
const distance=(x,z,path)=>Math.min(...path.map(p=>Math.hypot(x-p[0],z-p[1])));
for(const p of MAINLAND_STOPS.filter(p=>!['sunset','pizzaCity'].includes(p.id)))assert(Math.min(...Object.values(HIGHWAY_CURVES).map(path=>distance(p.x,p.z,path)))<16,'mainland region has road access '+p.id);
for(const speed of [6.5,20,28,100])for(const dir of [1,-1]){const start=dir===1?0:10,wall=(x,z)=>!(x>4.9&&x<5.2);const next=groundTravelStep(start,0,dir*speed,0,wall);assert(next.hit&&Math.abs(next.x-start)<5,'swept movement catches thin obstacle at '+speed);}
const city=createWorldCollision({state:{world:freshExplore()},trees:[{x:2,z:2,scale:1}],rocks:[{x:6,z:2,r:1}]});assert(!city.clear(2,2),'trunk solid');assert(!city.clear(6,2),'rock solid');assert(!city.clear(360,-48),'pizzeria solid');assert(city.clear(360,-23),'football field stays playable');
const car={x:0,z:0};assert.equal(driveByDirection(car,1,0,27,1,true,x=>x<2||x>2.3),0);assert(car.x<2,'car cannot skip thin obstacle');
assert.deepEqual(impactPose(0),{lean:0,roll:0,crouch:0,shake:0});assert(impactPose(.375).lean<-.3,'collision has visible recoil');assert.equal(impactPose(.75).lean,0);
material.dispose();geometries.forEach(g=>g.dispose());console.log('PASS '+samples+' clear mainland road samples, '+triangles+' pavement triangles above terrain, rendered surface support, every mainland region access, city/tree/rock solids, swept fast/diagonal movement, car tunnelling and impact pose');

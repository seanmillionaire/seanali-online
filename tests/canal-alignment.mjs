import {highwayWidth} from '../games/adventure/highway-layout.js';
import assert from 'node:assert/strict';
import {CANAL_WATERWAY,CANAL_TERMINAL,CITY_CENTER,canalWater} from '../games/adventure/geography.js';
import {HIGHWAY_CURVES,HIGHWAY_WIDTH,isletHeight,terrainHeight,inWater,navigableWater,boatStep} from '../games/adventure/explore-state.js';
import {CRUISE_DOCK,CRUISE_LENGTH,cruisePose,normalizeCruise} from '../games/adventure/cruise-route.js';
assert(CRUISE_DOCK.z>CITY_CENTER.z);assert(Math.hypot(CANAL_TERMINAL.x-CITY_CENTER.x,CANAL_TERMINAL.z-CITY_CENTER.z)<70);assert(!inWater(CANAL_TERMINAL.x,CANAL_TERMINAL.z));assert(CANAL_WATERWAY.at(-1)[1]<-330);
let crossings=0;
for(const [name,path] of Object.entries(HIGHWAY_CURVES))for(let i=1;i<path.length;i++){
 const a=path[i-1],b=path[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])*2);
 for(let j=0;j<=n;j++){const x=a[0]+(b[0]-a[0])*j/n,z=a[1]+(b[1]-a[1])*j/n;
 if(canalWater(x,z)){crossings++;assert(terrainHeight(x,z)===0,'water below bridge');assert(isletHeight(x,z)>15,'ship clearance '+name+' '+x+','+z);assert(navigableWater(x,z));const moved=boatStep(x,z,.1,0);assert(Math.hypot(moved.x-x,moved.z-z)>.05);}
 }
}
assert(crossings>20);
// Both pavement edges retain ship clearance, rather than testing only lane centers.
for(const [id,path] of Object.entries(HIGHWAY_CURVES))for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);for(const side of [-1,1]){const x=(a[0]+b[0])/2+dz/l*side*highwayWidth(id,(a[0]+b[0])/2,(a[1]+b[1])/2)/2,z=(a[1]+b[1])/2-dx/l*side*highwayWidth(id,(a[0]+b[0])/2,(a[1]+b[1])/2)/2;if(canalWater(x,z))assert(isletHeight(x,z)>14.5,'full bridge width clears ship mast');}}
for(let d=0;d<CRUISE_LENGTH;d+=.5){const p=cruisePose(d);assert(navigableWater(p.x,p.z));}
const saved=normalizeCruise({tickets:7,completed:4,active:true,distance:200});assert.equal(saved.tickets,7);assert.equal(saved.completed,4);assert(saved.active);assert.equal(saved.distance,0);assert.deepEqual(normalizeCruise(saved),saved);
console.log('PASS Pacific terminal, Atlantic outlet, '+crossings+' separated water/road crossing samples, boat passage and cruise save upgrade');

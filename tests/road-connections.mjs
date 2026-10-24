import assert from 'node:assert/strict';
import {HIGHWAY_CURVES,isletHeight} from '../games/adventure/explore-state.js';
import {CITY_STREET_X,CITY_STREET_Z} from '../games/adventure/city-layout.js';
import {nearestRoadParking} from '../games/adventure/car-road-recovery.js';
const paths=[...Object.entries(HIGHWAY_CURVES),...CITY_STREET_X.map(x=>['city NS',[[x,-80],[x,-18]]]),...CITY_STREET_Z.map(z=>['city EW',[[330,z],[390,z]]])];let samples=0,maxGrade=0;
for(const [id,path]of paths)for(let i=1;i<path.length;i++){
 const a=path[i-1],b=path[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz),n=Math.ceil(len/.25);if(!len)continue;
 for(const lane of [-1.4,0,1.4]){let previous;
 for(let k=0;k<=n;k++){const x=a[0]+dx*k/n+dz/len*lane,z=a[1]+dz*k/n-dx/len*lane,y=isletHeight(x,z);assert(Number.isFinite(y));if(previous!==undefined){const grade=Math.abs(y-previous)/(len/n);maxGrade=Math.max(maxGrade,grade);assert(grade<.5,`${id}: abrupt grade ${grade} at ${x},${z}`);}previous=y;samples++;}}
}
const pathsForParking=[[[0,0],[0,40]]];const spot=nearestRoadParking({x:4,z:20},pathsForParking,p=>p.z>=25);assert.deepEqual(spot,{x:0,z:25,heading:0});assert.equal(nearestRoadParking({x:100,z:0},pathsForParking,()=>true),null);
console.log(`PASS ${samples} road/lane height samples, maximum grade ${(100*maxGrade).toFixed(1)}%; deterministic recovery`);

import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {mainlandContains,canalWater,gatunWater,CANAL_WATERWAY} from '../games/adventure/geography.js';
import {terrainHeight,navigableWater,boatStep} from '../games/adventure/explore-state.js';
import {decodeMainland} from '../games/adventure/mainland-loader.js';
// The north/east bank must connect the city mainland to Colón, not appear as
// isolated road islands. These samples previously lay in the unintended bay.
const bank=[[350,-145],[300,-155],[245,-165],[190,-185],[135,-205],[90,-225],[45,-245]];
let dry=0;
for(let i=1;i<bank.length;i++)for(let j=0;j<=40;j++){
 const a=bank[i-1],b=bank[i],x=a[0]+(b[0]-a[0])*j/40,z=a[1]+(b[1]-a[1])*j/40;
 assert(mainlandContains(x,z),'continuous north bank '+x+','+z);
 assert(!canalWater(x,z)&&!gatunWater(x,z));assert(terrainHeight(x,z)>0);assert(!navigableWater(x,z));dry++;
}
// Protect the full 15m-wide cruise hull plus a margin along every canal segment.
let wet=0;
for(let i=1;i<CANAL_WATERWAY.length;i++){
 const a=CANAL_WATERWAY[i-1],b=CANAL_WATERWAY[i],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz);
 for(let j=0;j<=Math.ceil(l);j++)for(const offset of [-10,0,10]){
  const t=j/Math.ceil(l),x=a[0]+dx*t+dz/l*offset,z=a[1]+dz*t-dx/l*offset;
  assert(canalWater(x,z)&&navigableWater(x,z),'open canal '+x+','+z);if(x>=40&&z>=-280&&z<=-100)assert.equal(terrainHeight(x,z),0,'new bank does not fill channel');
  const p=boatStep(x,z,dx/l*.2,dz/l*.2);assert(Math.hypot(p.x-x,p.z-z)>.1);wet++;
 }
}
// Verify the shipped packed terrain contains the new bank, not only collision math.
const bytes=gunzipSync(readFileSync(new URL('../games/adventure/assets/terrain/mainland-v1.pack',import.meta.url)));
const mesh=decodeMainland(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
for(const [x,z]of bank.slice(1,-1)){
 let found=false;for(let i=0;i<mesh.positions.length;i+=3)if(Math.hypot(mesh.positions[i]-x,mesh.positions[i+2]-z)<3&&mesh.positions[i+1]>0){found=true;break;}
 assert(found,'rendered bank covers '+x+','+z);
}
console.log('PASS '+dry+' connected bank samples, '+wet+' full-width water samples, and shipped terrain coverage');

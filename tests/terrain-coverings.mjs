import assert from 'node:assert/strict';
import {terrainPatch} from '../games/adventure/road-surfaces.js';
import {isletHeight} from '../games/adventure/explore-state.js';
import {EXPANDED_DISTRICTS} from '../games/adventure/expanded-districts.js';
let count=0;
for(const area of EXPANDED_DISTRICTS)for(const x of area.xs)for(const z of area.zs){
 const patch=terrainPatch(x,z,5.7,2.75,isletHeight);
 for(let i=0;i<patch.positions.length;i+=3){const [px,y,pz]=patch.positions.slice(i,i+3);assert(Math.abs(y-isletHeight(px,pz)-.175)<1e-9);count++;}
 assert(patch.indices.every(i=>i>=0&&i<patch.positions.length/3));
 for(let i=0;i<patch.indices.length;i+=3){const [a,b,c]=patch.indices.slice(i,i+3).map(v=>patch.positions.slice(v*3,v*3+3));assert((b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2])>0);}
}
console.log(`PASS ${count} covering vertices follow real terrain in all ${EXPANDED_DISTRICTS.length} districts; valid upward triangles`);

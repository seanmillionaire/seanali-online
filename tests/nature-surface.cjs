const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const c=vm.createContext({});vm.runInContext(fs.readFileSync(__dirname+'/../games/adventure/terrain-surface.js','utf8').replaceAll('export ',''),c);
const {clipLandTriangle,coastDistanceField}=c;
const triangle=[[0,1,0,0],[4,1,0,4],[0,1,4,0]];
assert.equal(clipLandTriangle(triangle,()=>true).length,3);
assert.equal(clipLandTriangle(triangle,()=>false).length,0);
const clipped=clipLandTriangle(triangle,(x,z)=>x<2);
assert.equal(clipped.length,6);assert(clipped.every(v=>v[0]<2.001));
assert(clipped.some(v=>Math.abs(v[0]-2)<.001));assert(clipped.every(v=>Math.abs(v[0]-v[3])<1e-7),'UV/color interpolation at shoreline');
const field=coastDistanceField((x,z)=>x<0,150,130);
const value=(x,z)=>field.pixels[(z*150+x)*4];
assert.equal(value(70,65),0);assert(value(76,65)>0);assert(value(80,65)>value(76,65));assert.equal(value(120,65),255);
const source=fs.readFileSync(__dirname+'/../games/adventure/entrance.js','utf8');
assert(source.includes('uniform sampler2D coastMap'));assert(!source.includes('coast=min(coast'));
assert(!source.includes('tri.every(i=>inland'));assert(source.includes('textures.forEach(t=>t.dispose())'));
console.log('PASS clipped dry/partial/wet terrain, shoreline intersections and interpolated details, coast-distance gradients, shared water coastline, texture cleanup');

vm.runInContext(fs.readFileSync(__dirname+'/../games/adventure/geography.js','utf8').replaceAll('export ',''),c);assert.equal(c.gatunWater(0,-110),false,'lake must not flood established Colón forest');assert.equal(c.gatunWater(20,-95),true,'Gatún Lake remains open');

// Exercise the production mainland material partition: preserve every vertex and
// triangle, pave only the city, and retain two batches for mobile rendering.
const city={id:'pizzaCity',x:120,z:-50,rx:58,rz:48};
const centers=[[120,-50],[175,-50],[180,-50],[0,0],[-112,-32],[205,35]];
const mainlandVertices=centers.flatMap(([x,z])=>[x-.1,1,z-.1,x+.1,1,z-.1,x,1,z+.2]);
const groups=[],mainlandGeo={setIndex(value){this.indices=value;},addGroup(start,count,materialIndex){groups.push({start,count,materialIndex});}};
const partition=source.slice(source.indexOf("  const cityLand=worldIslands.find"),source.indexOf('  const mainlandMaterials='));
assert(partition.length>0,'production material partition exists');
vm.runInNewContext(partition,{worldIslands:[city],mainlandVertices,mainlandGeo});
assert.deepEqual([...mainlandGeo.indices].sort((a,b)=>a-b),Array.from({length:18},(_,i)=>i),'all original triangle vertices retained exactly once');
assert.equal(groups.length,2,'only two mainland draw batches');
for(const group of groups)for(let i=group.start;i<group.start+group.count;i+=3){
 const triangle=Math.floor(mainlandGeo.indices[i]/3);
 assert.equal(group.materialIndex,triangle<2?1:0,'city asphalt and other regions grass');
}
console.log('PASS city mainland asphalt coverage, other-region isolation, intact triangles and two draw batches');

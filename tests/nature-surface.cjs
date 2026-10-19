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

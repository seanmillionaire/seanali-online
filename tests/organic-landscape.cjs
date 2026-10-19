// Run with: node tests/organic-landscape.cjs
// Guards the visual terrain against the old hard-edged / mismatched-coastline bug.
const assert=require('node:assert/strict');
(async()=>{
 const {mainlandContains,organicIslandRadius,homeShoreRadius}=await import('../games/adventure/geography.js');
 const {worldIslands,isletHeight,inWater,walkable,roadDistance,nearRoad,volcanoTrailPoint}=await import('../games/adventure/explore-state.js');
 const offshore=worldIslands.filter(p=>!['pizzaCity','colon','sunset'].includes(p.id));
 let samples=0;
 for(const land of offshore)for(let step=0;step<48;step++){
  const a=step*Math.PI/24,shore=organicIslandRadius(land,a),x=Math.cos(a)*land.rx,z=Math.sin(a)*land.rz;
  const innerX=land.x+x*shore*.91,innerZ=land.z+z*shore*.91;
  const outerX=land.x+x*shore*1.07,outerZ=land.z+z*shore*1.07;
  assert(isletHeight(innerX,innerZ)>0||mainlandContains(innerX,innerZ),land.id+' missing soil within boundary');
  assert(!inWater(innerX,innerZ),land.id+' terrain submerged inside boundary');
  if(!mainlandContains(outerX,outerZ))
   assert.equal(isletHeight(outerX,outerZ),0,land.id+' beach rendered beyond the shared coast');
  samples++;
 }
 for(const id of ['wilds','coconutCoast','islet','crystalCove']){
  const land=worldIslands.find(p=>p.id===id),radii=Array.from({length:120},(_,j)=>organicIslandRadius(land,j*Math.PI/60));
  assert(Math.max(...radii)-Math.min(...radii)>.04,id+' coastline regressed into a perfect oval');
 }
 const home=Array.from({length:100},(_,i)=>homeShoreRadius(i*Math.PI/50));
 assert(Math.max(...home)-Math.min(...home)>.06,'home coastline must have coves and headlands');
 for(const a of [0,.6,1.9,3,4.4,5.8]){
  const shore=homeShoreRadius(a),x=20*shore*.94*Math.cos(a),z=14*shore*.94*Math.sin(a);
  assert(!inWater(x,z),'Gorgona beach should be walkable land');
 }
 const baru=worldIslands.find(p=>p.id==='sunset');
 assert(isletHeight(baru.x,baru.z)>20,'a highway must not flatten Volcán Barú');
 const trail=volcanoTrailPoint(.65);
 assert(isletHeight(trail.x,trail.z)>10,'mountain hiking trail must track the sculpted slopes');
 for(let x=-160;x<=240;x+=25)for(let z=-155;z<=60;z+=25)
  assert.equal(nearRoad(x,z,4.75),roadDistance(x,z)<4.75,'optimized road proximity must agree with exact distance');
 assert(walkable(4,10),'Gorgona spawn remains traversable');
 console.log('PASS '+samples+' natural coast and collision checks, no circular beach color boundaries, Barú relief, Gorgona, road query equivalence');
})().catch(error=>{console.error(error);process.exitCode=1;});

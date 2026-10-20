const assert=require('node:assert/strict');
(async()=>{
 const {FOREST_PATCHES,FOREST_CLEARINGS,forestSiteClear,planForestPatches}=await import('../games/adventure/forest-patches.js');
 const {roadDistance,HIGHWAY_WIDTH,isletHeight,HIGHWAY_CURVES}=await import('../games/adventure/explore-state.js');
 const full=planForestPatches(),light=planForestPatches(.53),again=planForestPatches();
 assert(FOREST_PATCHES.length>=16,'wide biome coverage');
 assert(full.length>1300,'huge forests should have >1,300 tall trees');
 assert(light.length>650&&light.length<full.length*.72,'lighter mobile forest density');
 assert.deepEqual(full,again,'forest placements must remain deterministic');
 for(const kind of ['palm','pine','natural'])assert(full.filter(t=>t.kind===kind).length>100,kind+' forest canopy');
 const groups=Object.groupBy(full,t=>t.patch);
 assert(Object.keys(groups).length>=14,'natural woodland clusters in every major region');
 assert(full.some(t=>t.patch.startsWith('gorgona')),'forest behind Gorgona');
 assert(full.some(t=>t.patch.startsWith('baru')||t.patch==='cloud-forest'),'mountain forest');
 assert(full.some(t=>t.patch.startsWith('bocas')),'Bocas jungle forest');
 for(const t of full){
  assert(forestSiteClear(t.x,t.z,t.patch.startsWith('bocas')||t.patch==='colon-forest'?'island':'tropical'),
   'tree planted on restricted land '+t.patch);
  assert(roadDistance(t.x,t.z)>=HIGHWAY_WIDTH/2+11.5,'forest must stay off highway and shoulders');
  assert(isletHeight(t.x,t.z)>=.48,'trees above water');
  assert(FOREST_CLEARINGS.every(p=>Math.hypot(t.x-p.x,t.z-p.z)>=p.r),'no village trees');
  assert(Math.hypot((t.x-120)/65,(t.z+50)/55)>=1.09,'keep Panama City clear');
  assert(t.size>=1.6&&t.size<3.4,'giant forest canopy sizes');
 }
 for(const id of ['cityToGorgona','gorgonaBeachAccess','cityToBaru','cityToColon'])
  assert(HIGHWAY_CURVES[id].length>5,'existing roads retained');
 console.log('PASS '+full.length+' forest trees in '+Object.keys(groups).length+' natural patches (mobile '+light.length+') with road, village and water clearance');
})().catch(e=>{console.error(e);process.exitCode=1});

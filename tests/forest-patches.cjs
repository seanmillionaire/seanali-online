const assert=require('node:assert/strict');
(async()=>{
 const {FOREST_PATCHES,FOREST_CLEARINGS,forestSiteClear,planForestPatches}=await import('../games/adventure/forest-patches.js');
 const {roadDistance,HIGHWAY_WIDTH,isletHeight}=await import('../games/adventure/explore-state.js');
 const full=planForestPatches(),mobile=planForestPatches(.63);
 assert(FOREST_PATCHES.length>=10,'separate forest regions');
 assert(full.length>=200&&full.length<800,'mixed, open vegetation rather than a wall');
 assert(mobile.length>=120&&mobile.length<full.length,'mobile forest is lighter');
 assert.deepEqual(full,planForestPatches(),'stable deterministic layouts');
 for(const kind of ['palm','pine','natural','fern'])
  assert(full.filter(t=>t.kind===kind).length>=5,'preserve mixed '+kind+' vegetation');
 assert(new Set(full.map(t=>t.patch)).size>=8,'forest patches must be scattered');
 for(let i=0;i<full.length;i++){
  const t=full[i],patch=FOREST_PATCHES.find(p=>p.id===t.patch);
  assert(forestSiteClear(t.x,t.z,patch.biome),'safe forest plot '+t.patch);
  assert(roadDistance(t.x,t.z)>=HIGHWAY_WIDTH/2+10,'keep trees off highways');
  assert(isletHeight(t.x,t.z)>=.48,'dry foliage');
  assert(FOREST_CLEARINGS.every(p=>Math.hypot(t.x-p.x,t.z-p.z)>=p.r),'town clearings');
  assert(t.size>.5&&t.size<=2.6,'mixed understory and canopy elevations');
  for(let j=0;j<i;j++)
   assert(Math.hypot(t.x-full[j].x,t.z-full[j].z)>2.2,'no overlapping trunk cluster');
 }
 console.log('PASS '+full.length+' mixed trees/ferns and '+mobile.length+' mobile plants');
})().catch(e=>{console.error(e);process.exitCode=1});

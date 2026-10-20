const assert=require('node:assert/strict');
(async()=>{
 const {BUILDER_SITES,BUILDER_AREAS,builderCycleSite,builderVisibleProjects,builderSiteSafe}=await import('../games/adventure/builder-projects.js');
 const {builderFerryRoute,builderSailPosition,builderWaterPort}=await import('../games/adventure/builder-ferry.js');
 const {inWater,isletHeight,roadDistance,HIGHWAY_WIDTH,normalizeExplore,freshExplore}=await import('../games/adventure/explore-state.js');
 const {cityOverlap,CITY_ALL_PLOTS}=await import('../games/adventure/city-layout.js');
 const {shorelineTiles}=await import('../games/adventure/terrain-surface.js');
 const {mainlandContains}=await import('../games/adventure/geography.js');
 let total=0;
 for(const id of ['mateo','sofia']){
  const sites=BUILDER_SITES[id];assert(sites.length>=11,id+' has ongoing city and island work');
  const regions=new Set(sites.map(x=>x.region));
  for(const region of ['city','taboga','contadora','bocas','colon','guna'])
   assert(regions.has(region),id+' visits '+region);
  for(const site of sites){
   total++;
   const area=BUILDER_AREAS.find(a=>a.id===site.region);
   assert(builderSiteSafe(area,site),id+' has a dry permanent '+site.region+' plot');
   assert(!inWater(site.x,site.z)&&isletHeight(site.x,site.z)>.3,'structures stay on land');
   assert(roadDistance(site.x,site.z)>HIGHWAY_WIDTH/2+2,'road remains clear');
   if(site.region==='city')assert(CITY_ALL_PLOTS.every(p=>!cityOverlap(site,p,1.5)),'no city buildings share a lot');
   const others=[...BUILDER_SITES.mateo,...BUILDER_SITES.sofia].filter(q=>q.id!==site.id&&q.region===site.region);
   assert(others.every(p=>!cityOverlap(site,p,1.5)),site.id+' independent footprint');
  }
  assert.equal(builderCycleSite(id,0).region,'city','builders start in Panama City');
  const old=freshExplore();old.builders={[id]:{cycle:4,elapsed:48,lifeClock:620}};
  const migrated=normalizeExplore(old);
  assert.equal(migrated.builders[id].cycle,4);
  const legacyDone=builderVisibleProjects(migrated.builders[id],id);
  assert.equal(legacyDone.length,4,'old completion cycles migrate to independent persistent homes');
  const stored={...migrated.builders[id],completed:legacyDone.map(s=>({id:s.id,x:s.x,z:s.z,region:s.region}))};
  const reload=normalizeExplore({...old,builders:{[id]:stored}});
  assert.deepEqual(builderVisibleProjects(reload.builders[id],id),legacyDone,'reload keeps all finished buildings in place');
  assert.equal(builderCycleSite(id,4).region,'contadora','progress moves to next island');
 }
 const order=[...new Set(BUILDER_SITES.mateo.map(s=>s.region))];
 for(let i=1;i<order.length;i++){
  const from=order[i-1],to=order[i],route=builderFerryRoute(from,to);
  assert(route.length>=2,from+' to '+to+' has a water route');
  assert(builderWaterPort(from)&&builderWaterPort(to));
  for(let j=1;j<route.length;j++){
   const a=route[j-1],b=route[j],length=Math.hypot(a.x-b.x,a.z-b.z);
   for(let d=0;d<=length;d+=2){
    const t=d/(length||1),x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t;
    assert(inWater(x,z),'ferry must stay afloat between '+from+' and '+to);
   }
   assert(inWater(b.x,b.z),'ferry may not dock inland');
  }
  for(let k=0;k<=30;k++){
   const pos=builderSailPosition(from,to,k/30);
   assert(pos&&inWater(pos.x,pos.z),'animation stays on water at phase '+k+'/30');
  }
 }
 const interior=shorelineTiles(110,-48,3,()=>true);assert.equal(interior.length,1,'keep inland mesh cheap');
 const coast=shorelineTiles(0,0,3,(x)=>x>1.4);
 assert.equal(coast.length,25,'refine coastal cells fivefold');
 const coast2=shorelineTiles(0,0,3,(x,z)=>x+z>2.8);
 assert.equal(coast2.length,25,'diagonal shoreline is smoothed too');
 assert.equal(shorelineTiles(0,0,3,(x,z)=>x+z>2.8,3).length,9,'lightweight mode keeps coastline smooth with fewer cells');
 const kept=normalizeExplore(freshExplore());
 assert(kept&&kept.worldVersion===3,'terrain change preserves saves and world version');
 console.log('PASS '+total+' dry persistent builder plots, legacy/reload continuity, water-only ferry routes and adaptive shorelines');
})().catch(e=>{console.error(e);process.exitCode=1});

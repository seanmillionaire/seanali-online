const assert=require('node:assert/strict');
(async()=>{
 const {COLON_OFFSET,COLON_LAYOUT_VERSION,migrateGeography,mainlandContains,canalWater,gatunWater}=await import('../games/adventure/geography.js');
 const {worldIslands,MAINLAND_ROADS,explorePlaces,isletHeight,inWater,roadDistance,HIGHWAY_WIDTH,freshExplore}=await import('../games/adventure/explore-state.js');
 const {BUILDER_SITES,BUILDER_AREAS,builderSiteSafe}=await import('../games/adventure/builder-projects.js');
 const {builderFerryRoute,builderWaterPort}=await import('../games/adventure/builder-ferry.js');
 const {districtBuildings}=await import('../games/adventure/expanded-districts.js');
 const {MARINE_HABITATS}=await import('../games/adventure/island-life.js');
 const city=worldIslands.find(p=>p.id==='pizzaCity');
 const colon=worldIslands.find(p=>p.id==='colon'),monkey=worldIslands.find(p=>p.id==='monkeyIslet');
 const distance=p=>Math.hypot(p.x-city.x,p.z-city.z);
 assert(distance(colon)>250&&distance(monkey)>215,'Colón and Monkey Island must not read as another city block');
 assert.equal(colon.x,-50);assert.equal(colon.z,-245);assert.equal(monkey.x,-30);assert.equal(monkey.z,-214);
 assert(explorePlaces.some(p=>p.id==='colonCivic'&&p.z<-230),'relocated civic district is available on the map');
 let roadChecks=0;
 for(const id of ['cityToColon','colonCity','colonCivic']){
  const route=MAINLAND_ROADS[id];assert(route.length>=3);
  for(let i=1;i<route.length;i++){
   const a=route[i-1],b=route[i],length=Math.hypot(a[0]-b[0],a[1]-b[1]),n=Math.ceil(length/1.5);
   for(let j=0;j<=n;j++){
    const t=j/n,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;
    assert(mainlandContains(x,z)&&!canalWater(x,z)&&!gatunWater(x,z),'dry '+id+' route '+x.toFixed(2)+','+z.toFixed(2));
    roadChecks++;
   }
  }
 }
 const buildings=districtBuildings();
 assert(buildings.length>=12);
 const builders=[...BUILDER_SITES.mateo,...BUILDER_SITES.sofia];
 for(const b of buildings){
  assert(!inWater(b.x,b.z)&&isletHeight(b.x,b.z)>.05,'dry district building');
  assert(roadDistance(b.x,b.z)>HIGHWAY_WIDTH/2+Math.hypot(b.w,b.d)/2+1.3,'keep the roads clear');
  assert(builders.every(p=>Math.abs(b.x-p.x)>=(b.w+p.w)/2+1.3||Math.abs(b.z-p.z)>=(b.d+p.d)/2+1.3),
   'existing Mateo and Sofía projects are not overwritten');
 }
 for(const id of ['mateo','sofia'])for(const site of BUILDER_SITES[id]){
  const a=BUILDER_AREAS.find(area=>area.id===site.region);
  assert(builderSiteSafe(a,site),'builder must remain on dry, road-clear terrain');
 }
 let ferryChecks=0;
 const routeOrder=['city','taboga','contadora','bocas','colon','guna'];
 for(let i=1;i<routeOrder.length;i++){
  const from=routeOrder[i-1],to=routeOrder[i],route=builderFerryRoute(from,to);
  assert(route.length>=2,'ferry connects '+from+' and '+to);
  assert(builderWaterPort(from)&&builderWaterPort(to),'ferry ports are usable');
  for(let j=1;j<route.length;j++){
   const a=route[j-1],b=route[j],len=Math.hypot(a.x-b.x,a.z-b.z),n=Math.ceil(len/1.5);
   for(let k=0;k<=n;k++){
    const t=k/n,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t;
    assert(inWater(x,z),'ferry cannot cross dry land: '+from+' to '+to);
    ferryChecks++;
   }
  }
 }
 assert.equal(MARINE_HABITATS.dolphins.length,8);
 assert.equal(MARINE_HABITATS.octopuses.length,6);
 for(const [kind,habitats] of Object.entries(MARINE_HABITATS))
  for(const [x,z] of habitats)assert(inWater(x,z),kind+' spawn needs water: '+x+','+z);
 const old={...freshExplore(),colonLayoutVersion:undefined,x:-19,z:-127,
  builders:{mateo:{cycle:6,completed:[{id:'mateo-colon-0',region:'colon',x:-20,z:-130}]}},
  estate:{buildings:[{id:'older-colon-house',x:-18,z:-128}]}};
 const moved=migrateGeography(old);
 assert.deepEqual({x:moved.x,z:moved.z},{x:-59,z:-247});
 assert.equal(moved.builders.mateo.completed[0].x,-60);
 assert.equal(moved.estate.buildings[0].z,-248);
 assert.equal(moved.colonLayoutVersion,COLON_LAYOUT_VERSION);
 assert.deepEqual(migrateGeography(moved),moved,'migration runs only once');
 assert.deepEqual(COLON_OFFSET,{x:-40,z:-120});
 console.log('PASS: +'+roadChecks+' dry roadway samples, '+buildings.length+
  ' spaced buildings, '+ferryChecks+' sea-route samples, ocean animals and idempotent saves');
})().catch(e=>{console.error(e);process.exitCode=1});

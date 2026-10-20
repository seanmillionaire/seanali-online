const assert=require('node:assert/strict');
(async()=>{
 const {districtBuildings,DISTRICT_ROADS,districtGround}=await import('../games/adventure/expanded-districts.js');
 const {MAINLAND_ROADS,HIGHWAY_CURVES,explorePlaces,worldIslands,normalizeExplore,freshExplore}=await import('../games/adventure/explore-state.js');
 const buildings=districtBuildings(),east=buildings.filter(p=>p.district==='panama-east'),colon=buildings.filter(p=>p.district==='colon-port');
 assert(east.length>=30,'new eastern city must have depth and many blocks');
 assert(colon.length>=15,'Colón needs an actual distinct port city');
 for(const p of buildings)assert(districtGround(p.x,p.z),'town building on valid dry land');
 for(const [name,nodes] of Object.entries(DISTRICT_ROADS)){
  assert(MAINLAND_ROADS[name]&&HIGHWAY_CURVES[name].length>5,'connected '+name);
  for(const [x,z] of nodes)assert(districtGround(x,z),'road center on land '+name);
 }
 assert(explorePlaces.some(p=>p.id==='colonCity'),'Colón city independently discoverable');
 assert(explorePlaces.some(p=>p.id==='panamaEast'),'Panama east independently discoverable');
 const restored=normalizeExplore(freshExplore());
 assert(restored&&worldIslands.some(p=>p.id==='monkeyIslet'),'Monkey Island remains accessible');
 console.log('PASS '+east.length+' eastern city buildings, '+colon.length+' Colón buildings, dry highways, map targets and save loading');
})().catch(e=>{console.error(e);process.exitCode=1});

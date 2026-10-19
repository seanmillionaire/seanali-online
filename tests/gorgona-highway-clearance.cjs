// Highway clearance regression: buildings must not seal the City -> Gorgona
// connector, inland turnoff, or the separate coastal access road.
const assert=require('node:assert/strict');
(async()=>{
 const {HIGHWAY_CURVES,HIGHWAY_WIDTH,roadDistance,MAINLAND_ROADS,normalizeExplore,freshExplore}=await import('../games/adventure/explore-state.js');
 const {CITY_ALL_PLOTS,CITY_FIXED_PLOTS,CITY_BARRIO_PLOTS,CITY_SHOP_PLOTS,CITY_EXPANSION_PLOTS}=await import('../games/adventure/city-layout.js');
 const {STREET_VENDORS}=await import('../games/adventure/city-street-life.js');
 const {GORGONA_BUILDER_FINISHED}=await import('../games/adventure/village-builders.js');
 const distance=(x,z,nodes)=>{
  let d=Infinity;
  for(let i=1;i<nodes.length;i++){
   const [ax,az]=nodes[i-1],[bx,bz]=nodes[i],dx=bx-ax,dz=bz-az;
   const t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz||1)));
   d=Math.min(d,Math.hypot(x-ax-t*dx,z-az-t*dz));
  }
  return d;
 };
 assert.deepEqual(MAINLAND_ROADS.cityToGorgona.at(-1),MAINLAND_ROADS.gorgonaBeachAccess[0]);
 assert.deepEqual(MAINLAND_ROADS.cityToBaru[0],MAINLAND_ROADS.cityToGorgona.at(-1));
 const highway=HIGHWAY_CURVES.cityToGorgona;
 for(const p of CITY_ALL_PLOTS){
  const clearance=HIGHWAY_WIDTH/2+Math.hypot(p.w/2,p.d/2)+.9;
  assert(distance(p.x,p.z,highway)>clearance,
   'Panama City–Gorgona highway blocked by '+(p.id||'allocated home')+' at '+p.x+','+p.z);
 }
 for(const p of [...CITY_BARRIO_PLOTS,...CITY_SHOP_PLOTS,...CITY_EXPANSION_PLOTS]){
  const clearance=HIGHWAY_WIDTH/2+Math.hypot(p.w/2,p.d/2)+.9;
  assert(roadDistance(p.x,p.z)>clearance,'Intercity road intersects city house '+JSON.stringify(p));
 }
 assert.equal(CITY_BARRIO_PLOTS.length,8,'all barrio homes retained');
 assert.equal(CITY_SHOP_PLOTS.length,8,'all eight shops retained');
 assert(CITY_EXPANSION_PLOTS.length>=14,'retain neighborhood building density');
 for(const v of STREET_VENDORS){
  const w=3,d=3;assert(distance(v.x,v.z,highway)>HIGHWAY_WIDTH/2+Math.hypot(w/2,d/2)+.8,'vendor blocks Gorgona highway');
 }
 for(const [id,locations] of Object.entries(GORGONA_BUILDER_FINISHED)){
  assert.equal(locations.length,3,'preserve '+id+' completed builds');
  for(const [x,z] of locations)assert(distance(x,z,HIGHWAY_CURVES.gorgonaBeachAccess)>
   HIGHWAY_WIDTH/2+Math.hypot(2.85/2,2.45/2)+.5,id+' builder house blocks beach access');
 }
 const saved=freshExplore();saved.estate.buildings=[{id:7,type:'cottage',x:85,z:-26,level:2}];
 const restored=normalizeExplore(saved);
 const home=restored.estate.buildings[0];
 assert(home&&home.id===7&&home.type==='cottage'&&home.level===2,'preserve purchased/saved building');
 assert(roadDistance(home.x,home.z)>HIGHWAY_WIDTH/2+2.8+1.35,'move previously saved building off the road');
 const second=normalizeExplore(restored);
 assert.equal(second.estate.buildings[0].x,home.x,'existing home migration is idempotent');
 assert.equal(second.estate.buildings[0].z,home.z);
 console.log('PASS Gorgona city highway, eight homes/shops, beach-access builders, saved estate migration, road junctions');
})().catch(e=>{console.error(e);process.exitCode=1});

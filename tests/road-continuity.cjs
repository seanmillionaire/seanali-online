const assert=require('node:assert/strict');
(async()=>{
 const {MAINLAND_ROADS,HIGHWAY_CURVES,HIGHWAY_WIDTH,ROAD_JUNCTIONS,
  roadDistance,inWater,isletHeight}=await import('../games/adventure/explore-state.js');
 const {mainlandContains,canalWater,gatunWater}=await import('../games/adventure/geography.js');
 const {ribbonPlan}=await import('../games/adventure/road-surface.js');
 const {CITY_ALL_PLOTS,CITY_FIXED_PLOTS,CITY_STREET_X,CITY_STREET_Z}=await import('../games/adventure/city-layout.js');
 const {EXPANDED_DISTRICTS,districtBuildings}=await import('../games/adventure/expanded-districts.js');
 const {BUILDER_SITES,BUILDER_AREAS,builderSiteSafe}=await import('../games/adventure/builder-projects.js');
 const {builderFerryRoute}=await import('../games/adventure/builder-ferry.js');

 assert.equal(Object.keys(HIGHWAY_CURVES).length,10,'all intercity and district connectors remain');
 let quads=0,checks=0;
 const highways=Object.values(HIGHWAY_CURVES).flat();
 for(const [id,points] of Object.entries(HIGHWAY_CURVES)){
  const mesh=ribbonPlan(points,{width:HIGHWAY_WIDTH,height:isletHeight});
  assert(mesh.path.length>1&&mesh.indices.length>0,'connected ribbon '+id);
  assert.equal(mesh.indices.length,(mesh.path.length-1)*6,'no torn triangles '+id);
  assert(mesh.positions.every(Number.isFinite),'finite road elevations '+id);
  assert(mesh.indices.every(i=>Number.isInteger(i)&&i>=0&&i<mesh.positions.length/3),'correct triangle indices '+id);
  for(let j=1;j<mesh.path.length;j++)
   assert(Math.hypot(mesh.path[j][0]-mesh.path[j-1][0],mesh.path[j][1]-mesh.path[j-1][1])<1.7,'no missing surface section '+id);
  for(let i=0;i<points.length;i++){
   const [x,z]=points[i],a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)];
   const dx=b[0]-a[0],dz=b[1]-a[1],n=Math.hypot(dx,dz)||1;
   if(id==='cityToColon')for(const sign of [-1,0,1]){
    const px=x+sign*HIGHWAY_WIDTH*.5*dz/n,pz=z-sign*HIGHWAY_WIDTH*.5*dx/n;
    assert(mainlandContains(px,pz)&&!canalWater(px,pz)&&!gatunWater(px,pz),
     'Colón approach and road shoulders cannot run through a canal or sea');
   }
  }
  quads+=mesh.indices.length/6;
 }
 assert(ROAD_JUNCTIONS.some(([x,z])=>x===-47&&z===-269),'the relocated Colón port still has a road junction');
 assert.deepEqual(MAINLAND_ROADS.cityToColon[0],[105,-61],'city-to-Colón highway connects at the Casco grid');
 assert.deepEqual(MAINLAND_ROADS.cityToGorgona[0],[105,-35],'Gorgona access connects at the Casco grid');
 assert.deepEqual(MAINLAND_ROADS.panamaEast[0],[163,-61],'eastern district connects at Casco');
 assert(MAINLAND_ROADS.cityToColon.some(([x,z])=>x===77&&z===-61),'city-to-Colón route bypasses the old tower and mural');
 assert.deepEqual(MAINLAND_ROADS.colonPortConnector.at(-1),[-55,-268],'port grid connects to the coastal highway');
 // No asphalt is allowed to intersect an existing shop, tower, or house.
 const solid=CITY_ALL_PLOTS.filter(p=>p.solid!==false);
 for(const p of solid){
  let nearest=Infinity;
  for(const [x,z] of highways){
   nearest=Math.min(nearest,Math.hypot(Math.max(0,Math.abs(x-p.x)-p.w/2),
    Math.max(0,Math.abs(z-p.z)-p.d/2)));
  }
  assert(nearest>=HIGHWAY_WIDTH/2-.01,'keep highway clear of '+(p.id||'existing city home'));
 }
 let cityRoads=0;
 const laneSafe=(x,z)=>Math.hypot((x-120)/58,(z+50)/48)<.945;
 for(const pts of [...CITY_STREET_X.map(x=>[[x,-92],[x,-8]]),
                   ...CITY_STREET_Z.map(z=>[[68,z],[172,z]])]){
  const ribbon=ribbonPlan(pts,{width:4.8,height:isletHeight,safe:laneSafe});
  assert(ribbon.indices.length>0,'the Casco street grid remains connected');
  for(let i=0;i<ribbon.path.length;i++){
   if(!ribbon.safe[i])continue;
   const [x,z]=ribbon.path[i];
   for(const p of solid){
    const gap=Math.hypot(Math.max(0,Math.abs(x-p.x)-p.w/2),
     Math.max(0,Math.abs(z-p.z)-p.d/2));
    assert(gap>=2.39,'narrow city streets leave building frontage open');
   }
  }
  cityRoads++;
 }
 const port=EXPANDED_DISTRICTS.find(a=>a.id==='colon-port');
 assert(port&&port.xs[0]<=-90&&port.zs.at(-1)<=-256,'Colón grid stays away from the rainforest quests');
 const landmarks=[[-59,-247,5.5],[-52,-237,3],[-38,-228,3],[-48,-259,4]];
 for(const [x,z,r]of landmarks){
  for(const roadX of port.xs)
   if(z>=port.zs[0]&&z<=port.zs.at(-1))
    assert(Math.abs(x-roadX)>=r+2.85,'no road crosses the Colón landmark');
  for(const roadZ of port.zs)
   if(x>=port.xs[0]&&x<=port.xs.at(-1))
    assert(Math.abs(z-roadZ)>=r+2.85,'no road crosses the Colón landmark');
 }
 const lots=districtBuildings(),builders=[...BUILDER_SITES.mateo,...BUILDER_SITES.sofia];
 for(const p of lots)assert(!inWater(p.x,p.z)&&roadDistance(p.x,p.z)>HIGHWAY_WIDTH/2+
  Math.hypot(p.w,p.d)*.5+1.3,'district lots remain dry and clear of roads');
 for(const b of builders){
  const area=BUILDER_AREAS.find(a=>a.id===b.region);
  assert(builderSiteSafe(area,b),'Mateo and Sofia still build on usable ground');
 }
 const order=['city','taboga','contadora','bocas','colon','guna'];
 for(let i=1;i<order.length;i++){
  const route=builderFerryRoute(order[i-1],order[i]);
  assert(route.length>=2,'ferry connects '+order[i-1]+' to '+order[i]);
  for(let j=1;j<route.length;j++){
   const a=route[j-1],b=route[j],len=Math.hypot(a.x-b.x,a.z-b.z),count=Math.ceil(len/2);
   for(let k=0;k<=count;k++){
    const t=k/count,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t;
    assert(inWater(x,z),'no ferry crosses roads or land');
    checks++;
   }
  }
 }
 console.log('PASS '+Object.keys(HIGHWAY_CURVES).length+' continuous highways, '+cityRoads+
 ' city grid streets, '+quads+' contiguous road quads, '+lots.length+
 ' district buildings, '+builders.length+' durable builder sites, '+checks+' ferry samples');
})().catch(e=>{console.error(e);process.exitCode=1;});

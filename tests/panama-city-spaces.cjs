const assert=require('node:assert/strict');

(async()=>{
 const {districtBuildings,districtGround,districtVehicleBlocked,districtDriveable}=await import('../games/adventure/expanded-districts.js');
 const {MAINLAND_ROADS,explorePlaces,inWater,isletHeight,roadDistance,HIGHWAY_WIDTH}=await import('../games/adventure/explore-state.js');
 const {CITY_EXPANSION_PLOTS}=await import('../games/adventure/city-layout.js');
 const {BUILDER_SITES}=await import('../games/adventure/builder-projects.js');
 const {mainlandContains,canalWater,gatunWater}=await import('../games/adventure/geography.js');
 const buildings=districtBuildings(),counts={};
 const builders=[...BUILDER_SITES.mateo,...BUILDER_SITES.sofia];
 assert(buildings.length>=12,'spaced districts should have meaningful buildings');
 for(const p of buildings){
  counts[p.district]=(counts[p.district]||0)+1;
  assert(districtGround(p.x,p.z)&&!inWater(p.x,p.z)&&isletHeight(p.x,p.z)>0,'building is on real dry ground '+p.district);
  for(const sx of [-1,1])for(const sz of [-1,1]){
   const x=p.x+sx*(p.w/2+.2),z=p.z+sz*(p.d/2+.2);
   assert(districtGround(x,z),'every building corner is dry: '+p.district);
  }
  assert(roadDistance(p.x,p.z)>HIGHWAY_WIDTH/2+Math.hypot(p.w,p.d)/2+1.3,
   'highway and building footprints must not overlap: '+p.district);
  assert(districtVehicleBlocked(p.x,p.z),'new structures block cars');
  for(const b of builders){
   const overlap=Math.abs(p.x-b.x)<(p.w+b.w)/2+1.3&&Math.abs(p.z-b.z)<(p.d+b.d)/2+1.3;
   assert(!overlap,'do not overwrite completed or future Mateo/Sofía sites');
  }
 }
 for(const [id,minimum]of [['panama-east',5],['colon-civic',4],['colon-port',1]])
  assert((counts[id]||0)>=minimum,'keep distinct '+id+' neighborhoods');
 assert(CITY_EXPANSION_PLOTS.length>=10&&CITY_EXPANSION_PLOTS.length<22,
  'historic downtown is spacious but not empty');
 assert(districtDriveable(216,-35),'eastern neighborhood streets are driveable');
 assert(explorePlaces.some(p=>p.id==='colonCivic'),'map offers access to expanded Colón');
 const coastPoint={x:52,z:-141};
 assert(mainlandContains(coastPoint.x,coastPoint.z)&&!inWater(coastPoint.x,coastPoint.z),
  'new Colón civic lots extend a real, not floating, coastline');
 const waypoints=MAINLAND_ROADS.colonCivic;
 assert(waypoints.length>=3,'Colón has a connected outward road');
 for(let i=1;i<waypoints.length;i++){
  const a=waypoints[i-1],b=waypoints[i],distance=Math.hypot(a[0]-b[0],a[1]-b[1]);
  for(let step=0;step<=Math.ceil(distance/1.5);step++){
   const t=step/Math.ceil(distance/1.5),x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;
   assert(mainlandContains(x,z)&&!canalWater(x,z)&&!gatunWater(x,z),
    'Colón highway cannot pass over water: '+x.toFixed(2)+','+z.toFixed(2));
  }
 }
 console.log('PASS '+buildings.length+' spaced dry city parcels, drivable streets, connected Colón highway and preserved builder plots');
})().catch(e=>{console.error(e);process.exitCode=1});

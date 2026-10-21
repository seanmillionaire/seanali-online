const assert=require('node:assert/strict');
(async()=>{
 const {cityX}=await import('../games/adventure/geography.js');
 const {HIGHWAY_CURVES,HIGHWAY_WIDTH,roadDistance,isletHeight,volcanoTrailPoint,roadsidePoint,nearRoad}=await import('../games/adventure/explore-state.js');
 const {cityBlocksVehicle,CITY_STREET_X,CITY_STREET_Z}=await import('../games/adventure/city-layout.js');
 const {districtVehicleBlocked,districtDriveable}=await import('../games/adventure/expanded-districts.js');
 const {driveByDirection}=await import('../games/adventure/directional-drive.js');
 const {MAINLAND_ROADS}=await import('../games/adventure/explore-state.js');
 const road=MAINLAND_ROADS.cityToGorgona;
 for(let i=1;i<road.length-1;i++){
  const a=road[i-1],b=road[i],c=road[i+1],u=[b[0]-a[0],b[1]-a[1]],v=[c[0]-b[0],c[1]-b[1]];
  const cos=(u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v));
  assert(Math.acos(Math.max(-1,Math.min(1,cos)))<Math.PI/4,'no sharp kink along city-to-Gorgona road waypoint '+i);
 }
 const canDrive=(x,z)=>(Math.hypot((x-cityX(120))/58,(z+50)/48)<.91||roadDistance(x,z)<HIGHWAY_WIDTH/2-.7||districtDriveable(x,z))&&!cityBlocksVehicle(x,z)&&!districtVehicleBlocked(x,z);
 for(const path of Object.values(HIGHWAY_CURVES))for(const [x,z]of path.filter((_,i)=>i%10===0)){
  const p=roadsidePoint(x,z,3);assert(!nearRoad(p.x,p.z,HIGHWAY_WIDTH/2+4),'scenery footprint outside road');
 }
 let steps=0;
 for(const [id,path]of Object.entries(HIGHWAY_CURVES)){
  for(const route of [path,[...path].reverse()]){
   const car={x:route[0][0],z:route[0][1],heading:0};let speed=0;
   for(const [x,z]of route.slice(1)){
    let i=0;while(Math.hypot(x-car.x,z-car.z)>.12){assert(++i<200,'car blocked on '+id+' at '+car.x+','+car.z);speed=driveByDirection(car,x-car.x,z-car.z,speed,.02,false,canDrive);steps++;}
   }
  }
  for(let i=1;i<path.length;i++){
   const a=path[i-1],b=path[i],length=Math.hypot(a[0]-b[0],a[1]-b[1]);
   assert(Math.abs(isletHeight(...a)-isletHeight(...b))/length<=.305,'reasonable road grade '+id);
  }
 }
 let junctions=0;for(const x of CITY_STREET_X)for(const z of CITY_STREET_Z)if(((x-cityX(120))/58)**2+((z+50)/48)**2<.82){assert(canDrive(x,z),'city junction clear '+x+','+z);junctions++;}
 assert.equal(junctions,12,'exercise every city junction after relocation');
 const trail=volcanoTrailPoint(0);assert(Math.hypot(HIGHWAY_CURVES.cityToBaru.at(-1)[0]-trail.x,HIGHWAY_CURVES.cityToBaru.at(-1)[1]-trail.z)<1e-8,'Baru highway reaches safe hiking trailhead rather than lava crater');
 console.log('PASS '+steps+' real driving-controller steps: all '+Object.keys(HIGHWAY_CURVES).length+' road routes both directions, Gorgona beach access, Baru trailhead, '+junctions+' city junctions, maximum 30% grade');
})().catch(e=>{console.error(e);process.exitCode=1});

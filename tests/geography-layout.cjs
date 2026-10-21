const assert=require('node:assert/strict');
(async()=>{
 const {cityX,DESTINATIONS,movePoint,moveLegacyPoint,GEOGRAPHY_VERSION,WORLD_BOUNDS,COLON_OFFSET}=await import('../games/adventure/geography.js');
 const {worldIslands,explorePlaces,isletHeight,inWater,normalizeExplore,freshExplore,MAINLAND_ROADS,roadDistance}=await import('../games/adventure/explore-state.js');
 const {CITY}=await import('../games/adventure/pizza-city.js');const {CITY_SITES}=await import('../games/adventure/city-expansion.js');const {COLON_SITES,COLON_BRIDGE}=await import('../games/adventure/colon-state.js');
 const {navigableWater}=await import('../games/adventure/explore-state.js');
 const {CRUISE_BOARD,CRUISE_LENGTH,cruisePose,CRUISE_SPEED}=await import('../games/adventure/cruise-route.js');const {CITY_HOSPITAL,BARU,touchesLava,LAVA_POOLS,lavaPoolPose}=await import('../games/adventure/volcano-safety.js');
 const at=id=>worldIslands.find(p=>p.id===id);assert.equal(CITY.x,at('pizzaCity').x);assert.equal(CITY.z,at('pizzaCity').z);
 assert(at('sunset').x<0&&at('sunset').z<0);assert(at('wilds').x>at('sunset').x&&at('wilds').z<at('sunset').z,'Bocas NE of Barú');assert(at('colon').x<CITY.x&&at('colon').z<CITY.z);assert(at('islet').x<CITY.x&&at('islet').z>CITY.z);assert(at('coconutCoast').x>CITY.x&&at('coconutCoast').z>CITY.z);assert(at('crystalCove').x>CITY.x&&at('crystalCove').z<CITY.z);
 for(const p of worldIslands)assert(Math.hypot(p.x/WORLD_BOUNDS.x,p.z/WORLD_BOUNDS.z)<1,'destination reachable inside world bounds: '+p.id);
 assert(!inWater(CRUISE_BOARD.x,CRUISE_BOARD.z),'dry cruise boarding dock');assert(!inWater(CITY_HOSPITAL.spawn.x,CITY_HOSPITAL.spawn.z));assert.equal(BARU.x,at('sunset').x);
 assert.equal(CITY_SITES.find(p=>p.id==='canal').x,CRUISE_BOARD.x);for(const p of COLON_SITES)assert(Math.hypot(p.x+COLON_OFFSET.x-at('colon').x,p.z+COLON_OFFSET.z-at('colon').z)<35);
 assert(Math.hypot(COLON_BRIDGE.b.x+COLON_OFFSET.x-at('monkeyIslet').x,COLON_BRIDGE.b.z+COLON_OFFSET.z-at('monkeyIslet').z)<1);
 let hits=0,heading=cruisePose(0).heading;for(let d=0;d<=CRUISE_LENGTH;d+=CRUISE_SPEED*.1){const p=cruisePose(d),turn=Math.atan2(Math.sin(p.heading-heading),Math.cos(p.heading-heading));heading+=turn*.1*1.8;for(const f of [-17,0,18])for(const side of [-6,0,6]){if(!navigableWater(p.x+Math.sin(heading)*f+Math.cos(heading)*side,p.z+Math.cos(heading)*f-Math.sin(heading)*side))hits++;}}assert.equal(hits,0,'complete turning cruise hull stays in water');
 for(const id of ['pizzaCity','colon','monkeyIslet','wilds','sunset','islet','coconutCoast','crystalCove']){
  const old=DESTINATIONS[id].old,raw={worldVersion:3,inventoryVersion:1,x:old[0],z:old[1],food:{banana:7,coconut:3},city:{car:{x:-106,z:-74},bags:['bag-1']},friends:{completed:['pip']},estate:{buildings:[]}};
  const moved=normalizeExplore(raw);assert.equal(moved.x,DESTINATIONS[id].at[0],id+' save migration');assert.equal(moved.z,DESTINATIONS[id].at[1]);assert.equal(moved.geographyVersion,GEOGRAPHY_VERSION);assert.equal(moved.food.banana,7);assert.deepEqual(moved.friends.completed,['pip']);assert.equal(moved.city.bags.length,1);const again=normalizeExplore(moved);assert.equal(again.x,moved.x,'migration once only');assert.equal(again.z,moved.z);
 }
 assert.equal(freshExplore().city.car.x,cityX(114),'car moves with city');
 assert(explorePlaces.find(p=>p.id==='ollie').x>BARU.x&&explorePlaces.find(p=>p.id==='ollie').z>BARU.z,'Boquete SE of Barú');
 for(const pool of LAVA_POOLS){const p=lavaPoolPose(pool,isletHeight);assert(touchesLava(p.x,p.y,p.z,isletHeight));}
 console.log('PASS accurate relative destination directions, world reachability, city/forest/bridge/dock/hospital alignment, complete turning cruise route, one-time save migration and lava alignment');
})().catch(e=>{console.error(e);process.exitCode=1});

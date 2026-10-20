const assert=require('node:assert/strict'),before=require('./fixtures/world-layout-v1.json');
(async()=>{
 const a=await import('../games/adventure/explore-state.js'),g=await import('../games/adventure/geography.js');
 const {ruralParcels,ruralBlocks}=await import('../games/adventure/rural-towns.js');
 const {BARU,LAVA_POOLS,lavaPoolPose,touchesLava}=await import('../games/adventure/volcano-safety.js');
 const {COLON_BRIDGE}=await import('../games/adventure/colon-state.js');
 const length=p=>p.slice(1).reduce((n,q,i)=>n+Math.hypot(q[0]-p[i][0],q[1]-p[i][1]),0);
 const at=id=>a.worldIslands.find(x=>x.id===id),was=id=>before.islands.find(x=>x.id===id);
 const city=at('pizzaCity');for(const id of ['sunset','wilds','colon','islet','coconutCoast']){
  const p=at(id),old=was(id);assert(Math.hypot(p.x-city.x,p.z-city.z)>Math.hypot(old.x-was('pizzaCity').x,old.z-was('pizzaCity').z)*1.2,'substantial destination separation: '+id);
  assert(p.rx*p.rz>=old.rx*old.rz,'region land never shrinks');assert(!a.inWater(p.x,p.z),'dry region center '+id);
 }
 for(const id of ['cityToBaru','cityToColon','gorgonaBeachAccess'])assert(length(a.MAINLAND_ROADS[id])>before.roads[id]*(id==='cityToColon'?1.3:1.4),'meaningfully longer '+id);
 assert(g.WORLD_BOUNDS.x*g.WORLD_BOUNDS.z>before.bounds.x*before.bounds.z*1.9,'larger traversable world');
 for(const p of a.worldIslands){assert(a.traversable(p.x,p.z),'reachable '+p.id);assert(p.x-p.rx>g.WORLD_EXTENT.left&&p.x+p.rx<g.WORLD_EXTENT.left+g.WORLD_EXTENT.width,'ocean covers '+p.id);}
 assert.equal(g.GEOGRAPHY_VERSION,3);assert.equal(a.freshExplore().geographyVersion,3);
 for(const id of ['sunset','wilds','colon','islet','coconutCoast','coiba','delRey','escudo','cebaco']){
  const p=was(id),raw=structuredClone(before.save);Object.assign(raw,{x:p.x,z:p.z});raw.food={banana:7,coconut:5};raw.friends={completed:['pip'],companion:'mila'};raw.craft={built:['sandcastle'],spent:{shell:3}};
  const next=a.normalizeExplore(raw);assert(Math.hypot(next.x-at(id).x,next.z-at(id).z)<1e-7,'old position follows '+id);assert.equal(next.food.banana,7);assert(next.friends.completed.includes('pip'));assert.equal(next.friends.companion,'mila');assert(next.craft.built.includes('sandcastle'));
  assert.deepEqual(a.normalizeExplore(next),next,'save migration runs once: '+id);
 }
 const raw=structuredClone(before.save);raw.estate={buildings:[{id:7,type:'villa',x:204,z:56,level:2}],charms:3};raw.city.car={x:-155,z:-32,heading:1};raw.builders={mateo:{cycle:3,elapsed:42,completed:[{id:'mateo-contadora-0',region:'contadora',x:206,z:57}]}};
 const saved=a.normalizeExplore(raw);assert.equal(saved.estate.buildings.length,1);assert.equal(saved.estate.buildings[0].id,7);assert.equal(saved.estate.buildings[0].x,g.cityX(326));assert.equal(saved.estate.buildings[0].level,2);assert(saved.city.car.x<-300,'saved highway car follows town');assert.equal(saved.builders.mateo.completed[0].x,g.cityX(329));assert.equal(saved.builders.mateo.cycle,3);assert.equal(saved.builders.mateo.elapsed,42);
 const {roadRibbon}=await import('../games/adventure/road-surfaces.js');
 const land=(x,z)=>g.mainlandContains(x,z)||Math.hypot(x/20,z/14)<g.homeShoreRadius(Math.atan2(z/14,x/20))||a.worldIslands.some(p=>Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)<g.organicIslandRadius(p,Math.atan2((z-p.z)/p.rz,(x-p.x)/p.rx)));
 for(const [id,path]of Object.entries(a.HIGHWAY_CURVES)){
  const data=roadRibbon(path,a.HIGHWAY_WIDTH,()=>0);for(let i=0;i<data.positions.length;i+=3)assert(land(data.positions[i],data.positions[i+2]),'visible ground beneath road edge: '+id);
 }
 const {normalize}=await import('../games/adventure/state.js'),{quests}=await import('../games/adventure/content.js');
 const campaignSave={version:1,started:true,lang:'en',completed:{[quests[0].id]:3},world:structuredClone(before.save),islandLessons:{completed:{[quests[1].id]:2}},song:Array(24).fill(true)};
 const restored=normalize(campaignSave);assert.equal(restored.completed[quests[0].id],3);assert.equal(restored.islandLessons.completed[quests[1].id],2);assert(restored.song.every(Boolean));assert(restored.started);
 const plots=ruralParcels();for(const id of ['volcanTown','boquete'])assert(plots.filter(p=>p.town===id).length>=4,'spacious populated '+id);
 for(const p of plots){assert(ruralBlocks(p.x,p.z));assert(a.roadDistance(p.x,p.z)>a.HIGHWAY_WIDTH/2+Math.hypot(p.w,p.d)/2+1);for(const sx of [-1,1])for(const sz of [-1,1])assert(!a.inWater(p.x+sx*p.w/2,p.z+sz*p.d/2),'whole house remains dry');}
 const monkey=at('monkeyIslet');assert(Math.hypot(COLON_BRIDGE.b.x+g.COLON_OFFSET.x-monkey.x,COLON_BRIDGE.b.z+g.COLON_OFFSET.z-monkey.z)<.01,'bridge follows distant Colón');assert.equal(BARU.x,at('sunset').x);
 for(const pool of LAVA_POOLS){const p=lavaPoolPose(pool,a.isletHeight);assert(touchesLava(p.x,p.y,p.z,a.isletHeight),'lava collision follows mountain');}
 const heights=[[-200,-60],[-150,-30],[-250,-70],[-170,-85]].map(p=>a.isletHeight(...p));assert(Math.max(...heights)-Math.min(...heights)>1,'real rolling mainland terrain');
 console.log('PASS expanded destinations/land/ocean, longer highways, '+plots.length+' spacious town parcels, aligned volcano/Colón bridge, versioned progress/house/builder/car migration, rolling hills');
 console.log(JSON.stringify({worldAreaRatio:g.WORLD_BOUNDS.x*g.WORLD_BOUNDS.z/(before.bounds.x*before.bounds.z),roadLengths:Object.fromEntries(['cityToBaru','cityToColon','gorgonaBeachAccess'].map(id=>[id,{before:before.roads[id],after:length(a.MAINLAND_ROADS[id])}]))}));
})().catch(e=>{console.error(e);process.exitCode=1});

// Repeatable estate + legacy-save integration tests. Run: node tests/island-estate.cjs
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
 const load=f=>import(pathToFileURL(path.resolve(__dirname,'../games/adventure/'+f))+'?v=80');
 const s=await load('explore-state.js'),st=await load('state.js'),e=await load('estate.js');
 const reload=value=>st.normalize(JSON.parse(JSON.stringify(value)));
 let state=st.fresh(),w=state.world;
 assert.equal(w.estate.buildings.length,0);assert.equal(w.estate.charms,0);
 assert(s.addFood(w,'banana',20));assert(s.addFood(w,'coconut',20));
 for(let i=0;i<20;i++)s.earnCoins(state,'city-bag-'+i);
 assert.equal(s.coinBalance(state),100);
 // Keep a real starter-island location and ensure ground is walkable.
 const flat={canStand:s.walkable,height:s.isletHeight};
 const home=e.findEstateSite(w,'cottage',{x:4,z:10},flat);
 assert(home,'starter island provides a build site');
 assert(e.canBuildEstate(w,'cottage',s.coinBalance(state)));
 assert(!e.buildEstate(w,'castle',s.coinBalance(state),home),'castle unlock is not bypassed');
 const starter=e.buildEstate(w,'cottage',s.coinBalance(state),home);
 assert.equal(starter.level,1);assert.equal(w.food.banana,19);assert.equal(w.food.coconut,19);
 assert.equal(s.coinBalance(state),100);
 assert(e.estateBlocked(w,home.x,home.z),'built houses block foot traffic');
 assert(!e.canUpgradeEstate(w,starter.id,0),'cannot upgrade without coins');
 assert(e.upgradeEstate(w,starter.id,s.coinBalance(state)));
 assert.equal(starter.level,2);assert.equal(s.coinBalance(state),90);
 assert(e.upgradeEstate(w,starter.id,s.coinBalance(state)));
 assert.equal(starter.level,3);assert.equal(s.coinBalance(state),70);
 assert(!e.upgradeEstate(w,starter.id,s.coinBalance(state)),'no charging for a fourth level');
 const stock=w.food.banana;
 const market=e.buildEstate(w,'market',s.coinBalance(state),{x:-8,z:-6});
 assert(market);assert.equal(w.food.banana,stock-2);assert.equal(s.coinBalance(state),62);
 const rare=s.exploreItems.filter(i=>['glow','seaTreasure','islandTreasure'].includes(i.kind));
 assert(rare.length>=2);
 assert(s.collectExplore(w,rare[0].id));assert(s.collectExplore(w,rare[1].id));
 assert(!s.collectExplore(w,rare[0].id));assert.equal(w.estate.charms,2);
 const castle=e.buildEstate(w,'castle',s.coinBalance(state),{x:-110,z:49});
 assert(castle);assert.equal(castle.level,1);assert.equal(w.estate.charms,0);
 assert.equal(s.coinBalance(state),32);
 // Coin expenditure must survive normalization; coin rewards are never deducted twice.
 for(let i=0;i<5;i++){state=reload(state);w=state.world;
  assert.equal(s.coinBalance(state),32);
  assert.equal(w.estate.buildings.length,3);assert.equal(w.estate.buildings[0].level,3);
  assert.equal(w.estate.charms,0);assert.equal(new Set(w.estate.buildings.map(b=>b.id)).size,3);
 }
 const oldGem=s.exploreItems.find(i=>i.kind==='islandTreasure');
 const old=reload({version:1,world:{food:{banana:2,coconut:3},collected:[oldGem.id,oldGem.id]}});
 assert.equal(old.world.estate.charms,1);
 assert.equal(reload(old).world.estate.charms,1,'legacy charm credit migrates once');
 assert(!s.collectExplore(old.world,oldGem.id));
 assert.equal(old.world.estate.charms,1);
 assert(!e.canBuildEstate(old.world,'castle',500),'unlock cannot be skipped with old save');
 // Both new purchase paths are atomic when a resource is missing.
 const missing=st.fresh();missing.world.food.banana=1;missing.world.food.coconut=0;
 assert(!e.buildEstate(missing.world,'cottage',500,{x:0,z:0}));
 assert.equal(missing.world.food.banana,1);
 assert.equal(missing.world.estate.buildings.length,0);
 console.log('PASS estates: placement, build tiers, 4-currency spending, repeat/upgrade guards, solid geometry, wallet, reload, old saves, rare pickups');
})().catch(error=>{console.error(error);process.exitCode=1});

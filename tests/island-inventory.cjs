const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
 const load=f=>import(pathToFileURL(path.resolve(__dirname,'../games/adventure/'+f))+'?v=73');
 const a=await load('explore-state.js'),c=await load('island-workshop.js'),st=await load('state.js'),r=await load('region-projects.js');
 const reload=s=>st.normalize(JSON.parse(JSON.stringify(s)));
 let state=st.fresh(),w=state.world;
 const check=n=>{assert.equal(w.food.banana,n);assert.equal(c.craftInventory(w).available.fruit,n);};
 assert(a.collectExplore(w,'fruit0'));check(1);assert(!a.collectExplore(w,'fruit0'));check(1);
 const tree={id:'banana0',kind:'banana',fruits:Array(6).fill(null)};
 for(let i=0;i<6;i++)assert(a.harvestFood(w,tree));
 assert(!a.harvestFood(w,tree));check(7);
 a.earnCoins(state,'fruit0');a.earnCoins(state,'fruit0');assert.equal(a.coinBalance(state),1);
 for(const id of ['wildGem0-0','wildGem0-1'])a.collectExplore(w,id);
 const recipe=c.BUILD_RECIPES.find(x=>x.id==='treehouse');
 assert(!c.commitCraft(w,recipe.id,0,0));check(7);
 assert(c.commitCraft(w,recipe.id,recipe.x,recipe.z));check(5);
 assert(!c.commitCraft(w,recipe.id,recipe.x,recipe.z));check(5);
 assert(a.spendFood(w,'banana'));check(4); // eating
 assert(a.spendFood(w,'banana'));w.city.activities.marketTrades++;check(3);
 assert.equal(w.foodTotal.banana,7);
 const task=r.REGION_PROJECTS.find(x=>x.id==='wilds').tasks.find(x=>x.check.item==='fruit');
 assert.equal(r.taskCount(w,task,state),7,'gathering progress includes trees, survives spending');
 state=reload(state);w=state.world;check(3);assert.equal(w.harvested.banana0,6);
 assert(!a.harvestFood(w,tree));assert(!a.collectExplore(w,'fruit0'));check(3);
 assert(a.spendFood(w,'banana',3));check(0);assert(!a.spendFood(w,'banana'));assert(!c.canCraft(w,'pizzaStand'));
 state=reload(state);w=state.world;check(0);assert.equal(w.foodTotal.banana,7);
 assert(a.addFood(w,'banana',3));check(3);assert(a.addFood(w,'coconut',3));assert(a.spendFood(w,'coconut'));assert.equal(reload(state).world.food.coconut,2);
 // Old stock is two disjoint pools: food + unspent ground pickups. No replay on reload.
 const old={version:1,world:{food:{banana:4},collected:['fruit0','fruit0','fruit1','fruit2'],craft:{built:['treehouse'],spent:{fruit:2}},harvested:{banana0:5}}};
 state=reload(old);w=state.world;check(5);assert.equal(w.foodTotal.banana,7);assert.equal(w.harvested.banana0,5);
 for(let i=0;i<5;i++){state=reload(state);w=state.world;check(5);}
 assert(a.spendFood(w,'banana',5));state=reload(state);w=state.world;check(0);
 // Never infer food from harvest history: it may already have been eaten or traded.
 assert.equal(reload({version:1,world:{harvested:{banana0:6},food:{banana:0}}}).world.food.banana,0);
 for(const [kind,recipeId] of [['shell','sandcastle'],['glow','volcanoCamp'],['seaTreasure','coralNursery'],['islandTreasure',null]]){
  state=st.fresh();w=state.world;
  const items=a.exploreItems.filter(x=>x.kind===kind);
  for(const item of items){assert(a.collectExplore(w,item.id));assert(!a.collectExplore(w,item.id));a.earnCoins(state,item.id);a.earnCoins(state,item.id);}
  assert.equal(c.craftInventory(w).available[kind],items.length);assert.equal(a.coinBalance(state),items.length);
  if(recipeId){for(const gem of a.exploreItems.filter(x=>x.kind==='islandTreasure'))a.collectExplore(w,gem.id);
   const recipe=c.BUILD_RECIPES.find(x=>x.id===recipeId);assert(c.commitCraft(w,recipeId,recipe.x,recipe.z));
   assert.equal(c.craftInventory(w).available[kind],items.length-recipe.need[kind]);assert(!c.commitCraft(w,recipeId,recipe.x,recipe.z));}
  state=reload(state);w=state.world;assert.equal(c.craftInventory(w).available[kind],items.length-(recipeId?c.BUILD_RECIPES.find(x=>x.id===recipeId).need[kind]:0));
 }
 state=reload({version:1,world:{city:{bags:['bag-0','bag-0','bag-23','bag-99']}}});w=state.world;
 assert.equal(c.craftInventory(w).available.moneyBag,2);assert.equal(a.coinBalance(state),10);
 a.syncWallet(state);assert.equal(a.coinBalance(state),10);
 // Shop spends coins, not bags or food; repeat equip and save cannot debit twice.
 for(const item of a.exploreItems)a.earnCoins(state,item.id);
 const balance=a.coinBalance(state);assert(a.buyIslandItem(state,'coral'));assert(a.buyIslandItem(state,'coral'));
 assert.equal(a.coinBalance(reload(state)),balance-15);assert.equal(c.craftInventory(w).available.moneyBag,2);
 // The pizza recipe debits banana, gems and money bags atomically once.
 state=st.fresh();w=state.world;w.city.bags=['bag-0','bag-1'];
 a.addFood(w,'banana',1);a.collectExplore(w,'wildGem0-0');a.collectExplore(w,'wildGem0-1');
 const pizza=c.BUILD_RECIPES.find(x=>x.id==='pizzaStand');
 assert(c.commitCraft(w,pizza.id,pizza.x,pizza.z));assert(!c.commitCraft(w,pizza.id,pizza.x,pizza.z));
 for(const kind of ['fruit','islandTreasure','moneyBag'])assert.equal(c.craftInventory(reload(state).world).available[kind],0);
 for(const oldWorld of [{collected:['fruit0','fruit1']},{food:{banana:2}},{}]){
  const migrated=reload({version:1,world:oldWorld});assert.equal(reload(migrated).world.food.banana,migrated.world.food.banana);
 }
 const corrupted=a.normalizeExplore({inventoryVersion:1,food:{banana:Infinity,coconut:-2},foodTotal:{banana:Infinity},collected:['shell0','shell0','bad'],city:{bags:['bag-0','bag-0']}});
 assert(Number.isFinite(corrupted.food.banana));assert.equal(corrupted.food.coconut,0);assert.equal(corrupted.collected.length,1);
 console.log('PASS inventory integration: ground/tree pickups, duplicate guards, crafting, eat/trade spending, rewards, quests, migration, repeated reload, shells/gems/glow/sea treasure/bags, wallet/shop');
})().catch(e=>{console.error(e);process.exitCode=1});

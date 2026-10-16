const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const ctx={};vm.runInNewContext(fs.readFileSync(__dirname+'/../games/adventure/explore-state.js','utf8').replace(/\bexport /g,'')+';this.api={worldIslands,exploreItems,isletHeight,inWater,walkable,traversable,islandPath,boatClear,boatStep,normalizeExplore,earnCoins,coinBalance,remoteAccess};',ctx);const a=ctx.api;
for(const land of a.worldIslands.slice(1).filter(p=>!p.vehicleOnly)){
 assert(a.walkable(land.x,land.z));assert(!a.inWater(land.x,land.z));assert(a.isletHeight(land.x,land.z)>2);
 const route=a.islandPath({x:4,z:10},land);assert(route.length>20);assert(route.every(p=>a.traversable(p.x,p.z)));assert(Math.hypot(route.at(-1).x-land.x,route.at(-1).z-land.z)<.1);
 const saved=a.normalizeExplore({x:land.x,z:land.z,growth:6});assert.equal(saved.x,land.x);assert.equal(saved.z,land.z);assert.equal(saved.growth,6);
 const shore={x:land.x,z:land.z-land.rz-2};assert(a.boatClear(shore.x,shore.z));const boatSaved=a.normalizeExplore({boat:{...shore,heading:1}});assert.equal(boatSaved.boat.x,shore.x);assert.equal(boatSaved.boat.z,shore.z);
}
let boat={x:6.5,z:20};for(let i=0;i<160;i++)boat=a.boatStep(boat.x,boat.z,.4,.08);assert(boat.x>60,'boat sails far beyond the old boundary');assert(a.boatClear(boat.x,boat.z));
assert(a.inWater(0,-40),'real sea separates the northern island from home');for(const p of a.worldIslands)assert(Math.hypot(p.x,p.z)>70,'destinations are spread across the archipelago');
const gems=a.exploreItems.filter(i=>i.kind==='islandTreasure');assert.equal(gems.length,20);for(const g of gems)assert(!a.inWater(g.x,g.z));const state={};a.earnCoins(state,gems[0].id);a.earnCoins(state,gems[0].id);assert.equal(a.coinBalance(state),1);
assert.equal(a.normalizeExplore({x:1000,z:1000}).x,4);console.log('PASS expanded destinations, walking routes, northern connection, far boat travel, saves and unique treasure rewards.');

assert(!a.remoteAccess({x:10,z:74.3},{x:10,z:74.5}),'swimmers cannot cross current boundary');assert(a.remoteAccess({x:10,z:119},{x:10,z:100}),'boat passengers can walk ashore');assert.equal(a.islandPath({x:4,z:10},{worldVersion:2,x:10,z:100}).length,0,'walking route cannot bypass vehicle requirement');assert(a.islandPath({x:10,z:100},{x:17.5,z:100}).length>0,'return balloon is walkable');assert(a.boatClear(10,119),'arrival point leaves the boat afloat');assert(a.walkable(10,100));assert.equal(a.normalizeExplore({worldVersion:2,x:10,z:100}).z,100);

for(const item of a.exploreItems){if(item.kind==='fruit')assert(Math.hypot((item.x+30)/24,(item.z+85)/25)<1,'picnic food belongs on Banana Island');if(item.kind==='glow')assert(Math.hypot((item.x+100)/25,(item.z-30)/22)<1,'fireflies belong in their forest');if(item.kind==='islandTreasure')assert(Math.hypot((item.x-10)/20,(item.z-100)/16)<1,'crystal treasure belongs in Crystal Cove');}

const legacy=a.normalizeExplore({x:47,z:6,growth:4,food:{banana:3}});assert.equal(legacy.x,105);assert.equal(legacy.z,10);assert.equal(legacy.food.banana,3);assert.equal(a.normalizeExplore(legacy).x,105,'migration runs only once');

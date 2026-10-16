const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');const ctx={};vm.runInNewContext(fs.readFileSync(__dirname+'/../games/adventure/explore-state.js','utf8').replace(/\bexport /g,'')+';this.api={worldIslands,exploreItems,isletHeight,inWater,walkable,traversable,islandPath,boatClear,boatStep,normalizeExplore,earnCoins,coinBalance,remoteAccess};',ctx);const a=ctx.api;
for(const land of a.worldIslands.slice(1).filter(p=>!p.vehicleOnly)){
 assert(a.walkable(land.x,land.z));assert(!a.inWater(land.x,land.z));assert(a.isletHeight(land.x,land.z)>2);
 const route=a.islandPath({x:4,z:10},land);assert(route.length>20);assert(route.every(p=>a.traversable(p.x,p.z)));assert(Math.hypot(route.at(-1).x-land.x,route.at(-1).z-land.z)<.1);
 const saved=a.normalizeExplore({x:land.x,z:land.z,growth:6});assert.equal(saved.x,land.x);assert.equal(saved.z,land.z);assert.equal(saved.growth,6);
 const shore={x:land.x,z:land.z-land.rz-2};assert(a.boatClear(shore.x,shore.z));const boatSaved=a.normalizeExplore({boat:{...shore,heading:1}});assert.equal(boatSaved.boat.x,shore.x);assert.equal(boatSaved.boat.z,shore.z);
}
let boat={x:6.5,z:20};for(let i=0;i<160;i++)boat=a.boatStep(boat.x,boat.z,.4,.08);assert(boat.x>60,'boat sails far beyond the old boundary');assert(a.boatClear(boat.x,boat.z));
for(let z=-12;z>=-34;z-=.25)assert(a.walkable(5,z),'northern land connection is walkable');
const gems=a.exploreItems.filter(i=>i.kind==='islandTreasure');assert.equal(gems.length,20);for(const g of gems)assert(!a.inWater(g.x,g.z));const state={};a.earnCoins(state,gems[0].id);a.earnCoins(state,gems[0].id);assert.equal(a.coinBalance(state),1);
assert.equal(a.normalizeExplore({x:1000,z:1000}).x,4);console.log('PASS expanded destinations, walking routes, northern connection, far boat travel, saves and unique treasure rewards.');

assert(!a.remoteAccess({x:0,z:31.9},{x:0,z:32.1}),'swimmers cannot cross current boundary');assert(a.remoteAccess({x:0,z:60},{x:0,z:48}),'boat passengers can walk ashore');assert.equal(a.islandPath({x:4,z:10},{x:0,z:48}).length,0,'walking route cannot bypass vehicle requirement');assert(a.islandPath({x:0,z:48},{x:5,z:48}).length>0,'return balloon is walkable');assert(a.boatClear(0,60),'arrival point leaves the boat afloat');assert(a.walkable(0,48));assert.equal(a.normalizeExplore({x:0,z:48}).z,48);

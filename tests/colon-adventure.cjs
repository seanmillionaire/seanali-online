const assert=require('node:assert/strict');
(async()=>{
 const {freshExplore,normalizeExplore,walkable,inWater}=await import('../games/adventure/explore-state.js');
 const {buildColon,expandColon,normalizeColon,COLON_BRIDGE}=await import('../games/adventure/colon-state.js');
 const {COLON_OFFSET,DESTINATIONS}=await import('../games/adventure/geography.js');
 const w=freshExplore();w.food={banana:20,coconut:15};
 assert.equal(buildColon(w,'treehouse'),false);assert(buildColon(w,'bridge'));assert.equal(w.food.banana,17);assert.equal(w.food.coconut,13);assert.equal(buildColon(w,'bridge'),false);
 for(const id of ['garden','treehouse','lookout'])assert(buildColon(w,id));assert(expandColon(w));assert(expandColon(w));assert.equal(expandColon(w),false);
 const saved=normalizeExplore(JSON.parse(JSON.stringify(w)));assert.equal(saved.colon.level,3);assert(saved.colon.lookout);assert.equal(normalizeColon({treehouse:true,level:3}).treehouse,false);assert.equal(normalizeColon({banana:[NaN,Infinity,-2,99]}).banana.join(','),'0,0,0,6');
 const b=COLON_BRIDGE;assert(walkable((b.a.x+b.b.x)/2+COLON_OFFSET.x,(b.a.z+b.b.z)/2+COLON_OFFSET.z));for(const id of ['colon','monkeyIslet'])assert(!inWater(...DESTINATIONS[id].at));
 console.log('PASS existing Colón bridge, ordered build costs, duplicate protection, upgrades, normalization and save/reload with current geography');
})().catch(e=>{console.error(e);process.exitCode=1;});

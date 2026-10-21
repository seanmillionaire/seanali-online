const assert=require('node:assert/strict');
(async()=>{
 const {worldIslands,explorePlaces,isletHeight,inWater,traversable,islandPath,freshExplore,normalizeExplore}=await import('../games/adventure/explore-state.js');
 const {WORLD_BOUNDS}=await import('../games/adventure/geography.js');
 const byId=id=>worldIslands.find(p=>p.id===id);
 assert.deepEqual(WORLD_BOUNDS,{x:900,z:760});
 const original=[
  ['islet',110,85],['wilds',-230,-200],['coconutCoast',560,125],
  ['crystalCove',530,-425],['pizzaCity',360,-50],['sunset',-350,-65],['colon',-50,-365]
 ];
 for(const [id,x,z]of original){assert.equal(byId(id).x,x);assert.equal(byId(id).z,z);}
 const remote=['coiba','delRey','escudo','cebaco'];
 const older=worldIslands.filter(p=>!remote.includes(p.id));
 for(const id of remote){
  const island=byId(id);assert(island,'long-distance island '+id);
  assert(island.rx>=29&&island.rz>=26,'spacious new '+id);
  assert(explorePlaces.some(p=>p.id===id),'world map route to '+id);
  assert(isletHeight(island.x,island.z)>.5,'physical land exists at '+id);
  assert(!inWater(island.x,island.z),'center stays dry at '+id);
  assert(traversable(island.x,island.z),'island stays within world bounds');
  const coastSamples=Array.from({length:8},(_,k)=>{
   const a=k*Math.PI/4;
   return {x:island.x+Math.cos(a)*island.rx*.80,z:island.z+Math.sin(a)*island.rz*.80};
  });
  assert(coastSamples.every(p=>traversable(p.x,p.z)),id+' usable surrounding land');
  const separation=Math.min(...older.filter(p=>!p.guna).map(p=>Math.hypot(island.x-p.x,island.z-p.z)-Math.hypot(island.rx,island.rz)-Math.hypot(p.rx,p.rz)));
  assert(separation>20,id+' separated by visible open sea from existing destinations');
 }
 const newer=remote.map(byId);
 for(let i=0;i<newer.length;i++)for(let j=0;j<i;j++)
  assert(Math.hypot(newer[i].x-newer[j].x,newer[i].z-newer[j].z)>newer[i].rx+newer[j].rx+30,'remote islands spaced apart');
 assert(byId('islet').rx>12&&byId('wilds').rx>24&&byId('coconutCoast').rx>23,'more land at established destinations');
 const path=islandPath(byId('coiba'),byId('delRey'));
 assert(path.length>25&&path.length<180,'distant route uses bounded waypoints instead of a giant 1m grid');
 assert(Math.hypot(path.at(-1).x-byId('delRey').x,path.at(-1).z-byId('delRey').z)<.05,'route reaches distant island');
 const restored=normalizeExplore(freshExplore());assert.equal(restored.geographyVersion,3,'old game saves remain compatible');
 console.log('PASS four physically distant islands, larger legacy island space, expanded locations and saved progression');
})().catch(e=>{console.error(e);process.exitCode=1});

const assert=require('node:assert/strict');
(async()=>{
 const {HIGHWAY_CURVES,HIGHWAY_WIDTH,roadDistance}=await import('../games/adventure/explore-state.js');
 const {planHighwayGuardrails,HIGHWAY_JUNCTIONS,routePointDistance}=await import('../games/adventure/highway-rails.js');
 const rails=planHighwayGuardrails();
 assert(rails.length>50,'retain relevant remote highway shoulder rails');
 assert(rails.some(p=>p.road==='cityToBaru')&&rails.some(p=>p.road==='cityToColon'));
 for(const [x,z] of [[32,-14],[85,-26],[-115,-22]])
  assert(HIGHWAY_JUNCTIONS.some(p=>p.x===x&&p.z===z),'known highway turnoff protected');
 for(const p of rails){
  assert(['cityToBaru','cityToColon'].includes(p.road));
  if(p.road==='cityToBaru')assert(p.x<=-43);
  if(p.road==='cityToColon')assert(p.x<=42&&p.z<=-100);
  assert(Math.hypot((p.x-120)/58,(p.z+50)/48)>1.22,'city rail excluded');
  assert(HIGHWAY_JUNCTIONS.every(q=>Math.hypot(p.x-q.x,p.z-q.z)>=17),'junction protected');
  assert(roadDistance(p.x,p.z)>HIGHWAY_WIDTH/2+.55,'rail center outside road');
  for(const [name,curve]of Object.entries(HIGHWAY_CURVES))
   if(name!==p.road)assert(routePointDistance(p.x,p.z,curve)>HIGHWAY_WIDTH/2+6,'do not obstruct '+name);
 }
 for(const route of ['cityToGorgona','gorgonaBeachAccess','canal','boquete'])
  assert(rails.every(p=>p.road!==route),route+' has no rail');
 for(const road of ['cityToColon','cityToBaru'])for(const side of [-1,1]){
  let streak=0,last=0;for(const p of rails.filter(p=>p.road===road&&p.side===side)){
   if(last&&p.index!==last+1){assert(streak>=3);streak=0;}
   streak++;last=p.index;
  }if(streak)assert(streak>=3,'no isolated rail fragment');
 }
 console.log('PASS '+rails.length+' remote rail beams clear of intersections, Gorgona, city and road crossings');
})().catch(e=>{console.error(e);process.exitCode=1});

const assert=require('node:assert/strict');
(async()=>{
 const {smoothHighway,MAINLAND_ROADS,HIGHWAY_CURVES}=await import('../games/adventure/explore-state.js');
 const {roadRibbon,cityStreetSurface}=await import('../games/adventure/road-surfaces.js');
 for(const points of [...Object.values(MAINLAND_ROADS),[[0,0],[100,0],[101,20],[102,-20]],[[0,0],[0,0],[5,5]]]){
  const curve=smoothHighway(points);assert.deepEqual(curve[0],points[0]);assert.deepEqual(curve.at(-1),points.at(-1));
  let start=0;
  for(let i=1;i<points.length;i++){
   if(points[i][0]===points[i-1][0]&&points[i][1]===points[i-1][1])continue;
   const end=curve.findIndex((p,j)=>j>start&&p[0]===points[i][0]&&p[1]===points[i][1]);assert(end>start,'anchor retained');
   for(const p of curve.slice(start,end+1))for(const k of [0,1])assert(p[k]>=Math.min(points[i-1][k],points[i][k])-1e-8&&p[k]<=Math.max(points[i-1][k],points[i][k])+1e-8,'curve cannot overshoot its segment bounds');
   start=end;
  }
  const data=roadRibbon(curve,9.5,(x,z)=>.1*x+.2*z);
  assert(data.positions.every(Number.isFinite));assert(data.indices.every(i=>i<data.positions.length/3));
  for(let i=0;i<data.positions.length;i+=3)assert(Math.abs(data.positions[i+1]-(.1*data.positions[i]+.2*data.positions[i+2]+.13))<1e-8,'terrain following');
 }
 const a=roadRibbon([[0,0],[0,20]],.14,()=>0,{dash:2,gap:3});
 const b=roadRibbon(Array.from({length:21},(_,i)=>[0,i]),.14,()=>0,{dash:2,gap:3});
 const area=d=>{let result=0;for(let i=0;i<d.indices.length;i+=3){const q=d.indices.slice(i,i+3).map(j=>[d.positions[j*3],d.positions[j*3+2]]);result+=Math.abs((q[1][0]-q[0][0])*(q[2][1]-q[0][1])-(q[1][1]-q[0][1])*(q[2][0]-q[0][0]))/2;}return result;};
 assert(Math.abs(area(a)-area(b))<1e-8,'dash coverage independent of sample density');
 const ring=roadRibbon([[0,0],[10,0],[10,10],[0,10],[0,0]],2,()=>0);assert.deepEqual(ring.positions.slice(0,15),ring.positions.slice(-15),'closed ring seam shares identical edge vertices');
 const grid=cityStreetSurface([{x:0,z:0,w:2,d:10},{x:0,z:0,w:10,d:2}],()=>0);
 assert.equal(area(grid),36,'intersection has exactly one pavement layer');
 for(let i=0;i<grid.indices.length;i+=3){const [a,b,c]=grid.indices.slice(i,i+3).map(j=>[grid.positions[j*3],grid.positions[j*3+2]]);assert((b[1]-a[1])*(c[0]-a[0])-(b[0]-a[0])*(c[1]-a[1])>0,'upward winding');}
 assert.deepEqual(HIGHWAY_CURVES.cityToGorgona.at(-1),HIGHWAY_CURVES.gorgonaBeachAccess[0]);
 assert.deepEqual(HIGHWAY_CURVES.cityToBaru[0],HIGHWAY_CURVES.gorgonaBeachAccess[0]);
 console.log('PASS bounded highway curves, exact junctions, terrain-following surfaces, stable painted dashes, single-layer city intersections');
})().catch(e=>{console.error(e);process.exitCode=1});

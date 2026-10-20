// Exact geometry regression: acceleration must not change water, coast or roads.
const assert=require('node:assert/strict');
(async()=>{
 const a=await import('../games/adventure/explore-state.js'),g=await import('../games/adventure/geography.js');
 const segments=Object.values(a.HIGHWAY_CURVES).flatMap(p=>p.slice(1).map((b,i)=>{const [ax,az]=p[i],dx=b[0]-ax,dz=b[1]-az;return {ax,az,dx,dz,inv:1/Math.max(.000001,dx*dx+dz*dz)};}));
 function road(x,z){let best=Infinity;for(const s of segments){const t=Math.max(0,Math.min(1,((x-s.ax)*s.dx+(z-s.az)*s.dz)*s.inv)),dx=x-s.ax-t*s.dx,dz=z-s.az-t*s.dz;best=Math.min(best,dx*dx+dz*dz);}return Math.sqrt(best);}
 function mainland(x,z){if(x<-452||x>g.MAINLAND_EAST||z<-430||z>38)return false;const px=x+1.35*Math.sin(z*.12+x*.009)+.55*Math.sin(z*.34-x*.025),pz=z+1.15*Math.sin(x*.12-z*.012)+.42*Math.sin(x*.29+z*.02);let inside=false;const p=g.SMOOTH_MAINLAND_OUTLINE;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if((a[1]>pz)!==(b[1]>pz)&&px<(b[0]-a[0])*(pz-a[1])/(b[1]-a[1])+a[0])inside=!inside;}return inside;}
 let seed=947;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
 const points=[];for(let i=0;i<12000;i++)points.push([rand()*1400-700,rand()*1200-600]);for(const p of Object.values(a.HIGHWAY_CURVES))for(let i=0;i<p.length;i+=3)points.push([p[i][0]+(rand()-.5)*22,p[i][1]+(rand()-.5)*22]);for(const [x,z]of g.SMOOTH_MAINLAND_OUTLINE)points.push([x,z]);
 for(const [x,z]of points){const d=road(x,z);assert.equal(a.roadDistance(x,z),d,`road distance ${x},${z}`);for(const buffer of [0,4.75,9.75,32])assert.equal(a.nearRoad(x,z,buffer),d<buffer);assert.equal(g.mainlandContains(x,z),mainland(x,z));const canal=(x>20&&x<62&&Math.abs(z+70)<13)||g.CANAL_WATERWAY.slice(1).some((p,i)=>g.segmentDistance(x,z,g.CANAL_WATERWAY[i],p)<23);assert.equal(g.canalWater(x,z),canal);}
 console.log(`PASS indexed road/coast/canal queries match full scans at ${points.length} ocean, shore and road samples`);
})().catch(e=>{console.error(e);process.exit(1)});

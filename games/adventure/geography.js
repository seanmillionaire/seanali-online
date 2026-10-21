import {sanBlasLayout,relocateSanBlasPoint,SAN_BLAS_LAYOUT_VERSION} from './san-blas-layout.js?v=225';
export const CITY_EAST_SHIFT=240;
export const cityX=x=>x+CITY_EAST_SHIFT;
export const CITY_CENTER={x:cityX(120),z:-50};
export const MAINLAND_EAST=272+CITY_EAST_SHIFT;
// North is -Z and east is +X. Distances are compressed for play, not a scale map.
export const GEOGRAPHY_VERSION=3;
// Colón's adventure is authored in local coordinates and placed far north.
export const COLON_OFFSET={x:-40,z:-240};
export const COLON_LAYOUT_VERSION=2;
export const colonWorld=(x,z)=>({x:x+COLON_OFFSET.x,z:z+COLON_OFFSET.z});
export const colonLocal=(x,z)=>({x:x-COLON_OFFSET.x,z:z-COLON_OFFSET.z});
export const WORLD_BOUNDS={x:900,z:760};
export const DESTINATIONS={
 home:{old:[0,0],at:[0,0]},pizzaCity:{old:[-100,-74],at:[cityX(120),-50]},
 colon:{old:[110,-56],at:[-50,-365]},monkeyIslet:{old:[130,-25],at:[-30,-334]},
 wilds:{old:[16,-112],at:[-230,-200]},sunset:{old:[-110,49],at:[-350,-65]},
 islet:{old:[60,-60],at:[110,85]},coconutCoast:{old:[105,10],at:[cityX(320),125]},
 crystalCove:{old:[10,100],at:[cityX(290),-425]},canal:{old:[-44,-74],at:[285,15]},
 volcanTown:{old:[-80,45],at:[-385,-30]},boquete:{old:[-80,45],at:[-290,-50]}
};
export function movePoint(id,x,z){const p=DESTINATIONS[id];return {x:x+p.at[0]-p.old[0],z:z+p.at[1]-p.old[1]};}
const legacyRegions=[['home',21,16],['pizzaCity',58,48],['colon',26,23],['monkeyIslet',8,7],['wilds',24,25],['sunset',38,34],['islet',12,10],['coconutCoast',23,19],['crystalCove',60,50]];
export function moveLegacyPoint(x,z,version=GEOGRAPHY_VERSION){
 let id='home',distance=Infinity;
 for(const [key,rx,rz]of legacyRegions){const p=DESTINATIONS[key].old,d=Math.max(0,Math.hypot((x-p[0])/rx,(z-p[1])/rz)-1);if(d<distance){distance=d;id=key;}}
 const point=movePoint(id,x,z);if(version<3&&['pizzaCity','coconutCoast','crystalCove'].includes(id))point.x-=CITY_EAST_SHIFT;return point;
}
// A wide western mainland and a long Caribbean peninsula. Keep the city's
// authored blocks, Gorgona beach, canal entrance and San Blas intact.
export const MAINLAND_OUTLINE=[[-425,-110],[-365,-130],[-290,-118],[-220,-100],[-145,-110],[-85,-133],[-45,-145],[-58,-235],[-103,-330],[-112,-366],[-99,-398],[-60,-417],[-27,-409],[12,-397],[29,-371],[37,-336],[44,-262],[48,-148],[55,-140],[62,-136],[75,-136],[90,-110],[145,-85],[190,-75],[260,-75],[265,-40],[200,-15],[145,-12],[115,-14],[65,-8],[58,10],[42,20],[26,23],[18,10],[15,9],[-15,9],[-25,20],[-48,22],[-72,19],[-95,16],[-120,16],[-205,8],[-290,12],[-385,26],[-435,0],[-440,-55]].map(([x,z])=>[x>65?cityX(x):x,z]);
// Pacific approach southwest of the city, then northwest to the Caribbean.
export const CANAL_LAYOUT_VERSION=2;
export const CANAL_WATERWAY=[[340,15],[285,15],[235,15],[210,-15],[185,-55],[150,-105],[110,-145],[90,-175],[5,-220],[-45,-275],[-65,-305],[-110,-340],[-150,-365]];
export const CANAL_TERMINAL={x:325,z:-17};
export const WORLD_EXTENT={left:-WORLD_BOUNDS.x,top:-WORLD_BOUNDS.z,width:WORLD_BOUNDS.x*2,height:WORLD_BOUNDS.z*2};
// Scenic low hills separate towns; the road grader uses this same collision
// height field, so countryside never becomes a decorative floating backdrop.
export function mainlandRelief(x,z){
 if(x> -45||z< -150)return 1.1;
 const ridge=Math.exp(-(((x+210)/140)**2+((z+55)/38)**2));
 const hills=(Math.sin(x*.028+z*.017)+Math.cos(z*.043-x*.011)+2)*.6;
 const fade=Math.min(1,Math.max(0,(-x-45)/65));
 return 1.1+fade*(ridge*7+hills);
}
export function segmentDistance(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t);}
const CANAL_SEGMENTS=CANAL_WATERWAY.slice(1).map((b,i)=>{const a=CANAL_WATERWAY[i],dx=b[0]-a[0],dz=b[1]-a[1];return {a,b,dx,dz,minX:Math.min(a[0],b[0])-23,maxX:Math.max(a[0],b[0])+23,minZ:Math.min(a[1],b[1])-23,maxZ:Math.max(a[1],b[1])+23};});
export function canalWater(x,z){

 for(const q of CANAL_SEGMENTS){
  if(x<q.minX||x>q.maxX||z<q.minZ||z>q.maxZ)continue;
  if(segmentDistance(x,z,q.a,q.b)<23)return true;
 }
 return false;
}
export function gatunWater(x,z){return z>-368&&z<-301&&Math.hypot((x+50)/40,(z+365)/37)>=1&&Math.hypot((x+35)/37,(z+335)/22)<1;}
// Inland wildlife uses this shared boundary; navigable water alone is not an ocean habitat.
export const freshwaterHabitat=(x,z)=>gatunWater(x,z)||canalWater(x,z);
// Coastlines have smooth bays, small headlands, and no straight polygon corners.
// Build the smoothed outline once. Gameplay and rendering call the same predicate.
const SMOOTH_MAINLAND=[];
for(let i=0;i<MAINLAND_OUTLINE.length;i++){
 const a=MAINLAND_OUTLINE[(i-1+MAINLAND_OUTLINE.length)%MAINLAND_OUTLINE.length],
  b=MAINLAND_OUTLINE[i],c=MAINLAND_OUTLINE[(i+1)%MAINLAND_OUTLINE.length],
  d=MAINLAND_OUTLINE[(i+2)%MAINLAND_OUTLINE.length];
 for(let j=0;j<10;j++){
  const t=j/10,t2=t*t,t3=t2*t;
  const curve=k=>.5*(2*b[k]+(-a[k]+c[k])*t+(2*a[k]-5*b[k]+4*c[k]-d[k])*t2+(-a[k]+3*b[k]-3*c[k]+d[k])*t3);
  SMOOTH_MAINLAND.push([curve(0),curve(1)]);
 }
}
export const SMOOTH_MAINLAND_OUTLINE=SMOOTH_MAINLAND;
// Bin coastline edges by their vertical span. Ray crossing still uses the
// original coordinates and formula, preserving every bay and shore boundary.
const COAST_STRIP=8,COAST_EDGES=new Map();
for(let i=0,j=SMOOTH_MAINLAND.length-1;i<SMOOTH_MAINLAND.length;j=i++){
 const a=SMOOTH_MAINLAND[i],b=SMOOTH_MAINLAND[j];
 for(let strip=Math.floor(Math.min(a[1],b[1])/COAST_STRIP);strip<=Math.floor(Math.max(a[1],b[1])/COAST_STRIP);strip++){
  if(!COAST_EDGES.has(strip))COAST_EDGES.set(strip,[]);
  COAST_EDGES.get(strip).push([a,b]);
 }
}
export function mainlandContains(x,z){
 // World-scale ocean sampling dominates startup; reject distant water cheaply.
 if(x<-452||x>MAINLAND_EAST||z<-430||z>38)return false;
 // Subtle coordinate warping adds small coastline irregularities without moving
 // roads, saved progress, boats, or the map's major Panama landmarks.
 const px=x+1.35*Math.sin(z*.12+x*.009)+.55*Math.sin(z*.34-x*.025),
  pz=z+1.15*Math.sin(x*.12-z*.012)+.42*Math.sin(x*.29+z*.02);
 let inside=false;
 for(const [a,b] of COAST_EDGES.get(Math.floor(pz/COAST_STRIP))||[]){
  if((a[1]>pz)!==(b[1]>pz)&&px<(b[0]-a[0])*(pz-a[1])/(b[1]-a[1])+a[0])inside=!inside;
 }
 return inside;
}
// Shared, deterministic organic island footprint (not a mathematically perfect ellipse).
// The maximum coastline offset is deliberately low so harbors and trails stay usable.
export function organicIslandRadius(land,angle){
 const phase=land.x*.047+land.z*.029,scale=land.id==='sunset'||land.id==='pizzaCity'?.55:land.guna?1.06:1;
 return 1+scale*(.045*Math.sin(angle*3+phase)+.023*Math.sin(angle*7-phase*.7)
  +.014*Math.sin(angle*11+phase*1.8)+.006*Math.sin(angle*19-phase));
}
// Gorgona's beach outline is also the physical swimming / shore boundary.
export function homeShoreRadius(angle){
 return 1+.047*Math.sin(angle*3+.4)+.027*Math.sin(angle*7-.8)
  +.018*Math.cos(angle*11+1.1)+.009*Math.sin(angle*17);
}
// Version 1 -> 2: authored region offsets/scales, also used by builders and
// saved boats/houses. Never infer migration from the new expanded coastline.
export const WORLD_EXPANSIONS=[
 {id:'canal',from:[40,-70],to:[285,15],rx:1,rz:1,scale:1},
 {id:'sunset',from:[-135,-55],to:[-350,-65],rx:48,rz:43,scale:1.4},
 {id:'volcanTown',from:[-155,-32],to:[-385,-30],rx:16,rz:13,scale:1},
 {id:'boquete',from:[-112,-32],to:[-290,-50],rx:16,rz:13,scale:1},
 {id:'wilds',from:[-105,-135],to:[-230,-200],rx:38,rz:38,scale:1.35},
 {id:'islet',from:[90,25],to:[110,85],rx:24,rz:20,scale:1.45},
 {id:'coconutCoast',from:[200,50],to:[cityX(320),125],rx:39,rz:34,scale:1.5},
 {id:'colon',from:[-50,-245],to:[-50,-365],rx:115,rz:50,scale:1},
 {id:'monkeyIslet',from:[-30,-214],to:[-30,-334],rx:13,rz:12,scale:1},
 {id:'coiba',from:[-260,140],to:[-480,160],rx:45,rz:40,scale:1.4},
 {id:'delRey',from:[273,142],to:[cityX(440),260],rx:42,rz:38,scale:1.4},
 {id:'escudo',from:[-244,-202],to:[-340,-310],rx:39,rz:35,scale:1.4},
 {id:'cebaco',from:[-102,166],to:[-200,260],rx:42,rz:38,scale:1.4}
];
export function expandWorldPoint(x,z,id=null,version=GEOGRAPHY_VERSION){
 if(!Number.isFinite(x)||!Number.isFinite(z))return {x,z};
 const candidates=WORLD_EXPANSIONS.filter(p=>!id||p.id===id).map(p=>({p,d:Math.hypot((x-p.from[0])/p.rx,(z-p.from[1])/p.rz)})).sort((a,b)=>a.d-b.d);
 const best=candidates[0];if(!best||(!id&&best.d>1.35))return {x,z};
 const p=best.p;return {x:p.to[0]+(x-p.from[0])*p.scale-(version<3&&['coconutCoast','delRey'].includes(p.id)?CITY_EAST_SHIFT:0),z:p.to[1]+(z-p.from[1])*p.scale};
}
// Upgrade old saves without resetting the player's buildings, boats or quests.
// Two migrations are independent and run once each, including archived saves.
export function migrateGeography(raw){
 if(!raw||typeof raw!=='object')return raw;
 let moved=raw;
 if(moved.geographyVersion===1&&moved.sanBlasGeographyVersion!==2){
  const migrate=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z)&&Math.hypot((p.x-205)/72,(p.z+130)/56)<1?{...p,x:p.x+85,z:p.z-115}:p;
  moved={...moved,...migrate({x:moved.x,z:moved.z}),boat:migrate(moved.boat),
   estate:moved.estate?{...moved.estate,buildings:(moved.estate.buildings||[]).map(migrate)}:moved.estate,
   sanBlasGeographyVersion:2};
 }
 if(!moved.geographyVersion||moved.geographyVersion<2){
  const next={...moved,geographyVersion:2,worldVersion:3};
  const versionOne=moved.geographyVersion===1;
  const migratePoint=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z)?{...p,...(versionOne?expandWorldPoint(p.x,p.z,null,2):moveLegacyPoint(p.x,p.z,2))}:p;
  if(Number.isFinite(moved.x)&&Number.isFinite(moved.z))Object.assign(next,migratePoint({x:moved.x,z:moved.z}));
  if(moved.boat)next.boat=migratePoint(moved.boat);
  if(moved.city){next.city={...moved.city};if(moved.city.car)next.city.car=versionOne?migratePoint(moved.city.car):{...moved.city.car,...movePoint('pizzaCity',moved.city.car.x,moved.city.car.z),x:movePoint('pizzaCity',moved.city.car.x,moved.city.car.z).x-CITY_EAST_SHIFT};
   if(moved.city.cruise)next.city.cruise={...moved.city.cruise,distance:moved.city.cruise.distance||0};}
  if(moved.estate)next.estate={...moved.estate,buildings:(moved.estate.buildings||[]).map(migratePoint)};
  if(versionOne&&moved.builders)next.builders=Object.fromEntries(Object.entries(moved.builders).map(([id,p])=>[id,p?{...p,completed:(p.completed||[]).map(site=>({...site,...expandWorldPoint(site.x,site.z,({taboga:'islet',contadora:'coconutCoast',bocas:'wilds',colon:'colon'})[site.region]||null,2)}))}:p]));
  moved=next;
 }
 if(moved.geographyVersion<3){
  const east=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.z)&&(p.x>=220||(p.x>=70&&p.x<=278&&p.z>=-115&&p.z<=22))?{...p,x:cityX(p.x)}:p;
  moved={...moved,...east({x:moved.x,z:moved.z}),geographyVersion:GEOGRAPHY_VERSION,
   boat:east(moved.boat),city:moved.city?{...moved.city,car:east(moved.city.car)}:moved.city,
   estate:moved.estate?{...moved.estate,buildings:(moved.estate.buildings||[]).map(east)}:moved.estate,
   builders:moved.builders?Object.fromEntries(Object.entries(moved.builders).map(([id,p])=>[id,p?{...p,completed:(p.completed||[]).map(east)}:p])):moved.builders};
 }
 if(moved.colonLayoutVersion!==COLON_LAYOUT_VERSION){
  const shift=p=>{
   if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.z))return p;
   const colon=Math.hypot((p.x+10)/52,(p.z+125)/42)<1;
   const monkey=Math.hypot((p.x-10)/13,(p.z+94)/11)<1;
   return colon||monkey?{...p,x:p.x+COLON_OFFSET.x,z:p.z+COLON_OFFSET.z}:p;
  };
  moved={...moved,...shift({x:moved.x,z:moved.z}),boat:shift(moved.boat),
   estate:moved.estate?{...moved.estate,buildings:(moved.estate.buildings||[]).map(shift)}:moved.estate,
   builders:moved.builders?Object.fromEntries(Object.entries(moved.builders).map(([id,p])=>
    [id,p?{...p,completed:(p.completed||[]).map(site=>site.region==='colon'?{...site,x:site.x+COLON_OFFSET.x,z:site.z+COLON_OFFSET.z}:site)}:p])):moved.builders,
   colonLayoutVersion:COLON_LAYOUT_VERSION};
 }
 if((moved.sanBlasGeographyVersion||0)<SAN_BLAS_LAYOUT_VERSION){
  const layout=sanBlasLayout(CITY_EAST_SHIFT),move=p=>relocateSanBlasPoint(p,layout,moved.sanBlasGeographyVersion||0);
  moved={...moved,...move({x:moved.x,z:moved.z}),sanBlasGeographyVersion:SAN_BLAS_LAYOUT_VERSION,
   boat:move(moved.boat),estate:moved.estate?{...moved.estate,buildings:(moved.estate.buildings||[]).map(move)}:moved.estate,
   builders:moved.builders?Object.fromEntries(Object.entries(moved.builders).map(([id,b])=>[id,b?{...b,completed:(b.completed||[]).map(move)}:b])):moved.builders};
 }
 return moved;
}

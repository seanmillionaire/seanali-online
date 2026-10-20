import {DESTINATIONS,WORLD_BOUNDS,mainlandContains,canalWater,gatunWater,migrateGeography,segmentDistance,organicIslandRadius,homeShoreRadius,COLON_OFFSET,COLON_LAYOUT_VERSION} from './geography.js?v=180';
import {SAN_BLAS_ISLANDS,normalizePanama} from './panama-state.js?v=173';
import {normalizeCampaign} from './campaign-state.js?v=156';
import {normalizeColon,bridgeDistance,COLON_BRIDGE} from './colon-state.js?v=156';
import {normalizeCruise,CRUISE_FARE} from './cruise-route.js?v=156';
import {normalizeEstate,estateCoinCost,ESTATE_PLANS} from './estate.js?v=156';
// Exploration is independent of lesson order. Every place is open from the start.
export const worldIslands=[
 {id:'islet',x:DESTINATIONS.islet.at[0],z:DESTINATIONS.islet.at[1],rx:17,rz:14,h:2.5,ox:24,oz:-8,spread:2.4,en:'Taboga · Island of Flowers',es:'Isla Taboga · Isla de las Flores'},
 {id:'wilds',x:DESTINATIONS.wilds.at[0],z:DESTINATIONS.wilds.at[1],rx:31,rz:31,h:5,ox:0,oz:-30,spread:1.25,en:'Isla Bastimentos · Bocas del Toro',es:'Isla Bastimentos · Bocas del Toro'},
 {id:'coconutCoast',x:DESTINATIONS.coconutCoast.at[0],z:DESTINATIONS.coconutCoast.at[1],rx:29,rz:25,h:4,ox:47,oz:6,spread:1.35,en:'Isla Contadora · Pearl Islands',es:'Isla Contadora · Las Perlas'},
 {id:'sunset',x:DESTINATIONS.sunset.at[0],z:DESTINATIONS.sunset.at[1],rx:42,rz:37,h:46,ox:-42,oz:8,spread:1.35,en:'Volcán Barú · Chiriquí',es:'Volcán Barú · Chiriquí'},
 {id:'crystalCove',x:DESTINATIONS.crystalCove.at[0],z:DESTINATIONS.crystalCove.at[1],rx:12,rz:10,h:1.2,ox:0,oz:48,spread:1.5,en:'Guna Yala · San Blas',es:'Guna Yala · San Blas'},
 {id:'pizzaCity',x:DESTINATIONS.pizzaCity.at[0],z:DESTINATIONS.pizzaCity.at[1],rx:58,rz:48,h:3.3,ox:-100,oz:-74,spread:1,en:'Panama City · Casco Viejo',es:'Ciudad de Panamá · Casco Viejo'},
 {id:'colon',x:DESTINATIONS.colon.at[0],z:DESTINATIONS.colon.at[1],rx:29,rz:27,h:4,ox:110,oz:-56,spread:1,en:'Colón · Caribbean Coast',es:'Colón · Costa del Caribe'},
 {id:'monkeyIslet',x:DESTINATIONS.monkeyIslet.at[0],z:DESTINATIONS.monkeyIslet.at[1],rx:8,rz:7,h:1.8,ox:130,oz:-25,spread:1,en:'Monkey Island · Gatún Lake',es:'Isla de los Monos · Lago Gatún'},
 ...SAN_BLAS_ISLANDS,
 // Remote open-world islands occupy the empty ocean without relocating the
 // established roads, save coordinates, city buildings or children's quests.
 {id:'coiba',x:-260,z:140,rx:35,rz:30,h:6,ox:-260,oz:140,spread:1,en:'Isla Coiba · Pacific Wilderness',es:'Isla Coiba · Selva del Pacífico'},
 {id:'delRey',x:273,z:142,rx:32,rz:28,h:4,ox:273,oz:142,spread:1,en:'Isla del Rey · Pearl Islands',es:'Isla del Rey · Las Perlas'},
 {id:'escudo',x:-244,z:-202,rx:29,rz:26,h:3,ox:-244,oz:-202,spread:1,en:'Escudo de Veraguas · Wild Caribbean',es:'Escudo de Veraguas · Caribe Salvaje'},
 {id:'cebaco',x:-102,z:166,rx:32,rz:28,h:4,ox:-102,oz:166,spread:1,en:'Isla Cébaco · Open Shores',es:'Isla Cébaco · Costas Abiertas'}
];
const BARU_LAND=worldIslands.find(p=>p.id==='sunset');
export function islandPoint(id,x,z){const p=worldIslands.find(p=>p.id===id);return {x:p.x+(x-p.ox)*p.spread,z:p.z+(z-p.oz)*p.spread};}
// Strong offshore currents require a vehicle to cross; walking remains free after arrival.
export function remoteAccess(from,to){const p=worldIslands.find(i=>i.vehicleOnly);if(!p)return true;const radius=q=>Math.hypot((q.x-p.x)/p.rx,(q.z-p.z)/p.rz);return radius(to)>=1.6||radius(from)<1.6;}
// A connected mainland corridor: Panama City → Gorgona → Colón and
// Gorgona → Volcán → Barú. Offshore island footprints remain separate.
export const MAINLAND_ROADS={
 cityToColon:[[105,-61],[77,-61],[74,-77],[73,-87],[63,-94],[30,-116],[26,-144],[24,-175],[25,-203],[24,-231],[14,-259],[-18,-272],[-47,-269],[-50,-245]],
 // Intercity traffic bypasses the beach. Turn off onto Gorgona's access road.
 cityToGorgona:[[105,-35],[85,-26],[48,-15],[32,-14]],
 gorgonaBeachAccess:[[32,-14],[28,-8],[24,-4],[21,1]],
 cityToBaru:[[32,-14],[-7,-8],[-35,0],[-75,-12],[-115,-22],[-155,-32],[-147,-43],[-135,-55]],
 boquete:[[-115,-22],[-112,-32]],canal:[[85,-26],[66,-65]],
 // Eastern Panama's new neighborhoods, leading outward from downtown.
 panamaEast:[[163,-61],[175,-61],[181,-57],[197,-57],[213,-57],[229,-57],[245,-57]],
 // Colón is a Caribbean city, not simply the Monkey Island nature park.
 colonCity:[[-50,-245],[-57,-251],[-67,-254],[-72,-252]],
 colonPortConnector:[[-47,-269],[-55,-268]],
 colonCivic:[[24,-231],[14,-242],[11,-252]]
};
export const MAINLAND_STOPS=[
 {id:'pizzaCity',x:120,z:-50,en:'Panama City',es:'Ciudad de Panamá'},
 {id:'colon',x:-50,z:-245,en:'Colón',es:'Colón'},
 {id:'colonCity',x:-67,z:-254,en:'Colón Waterfront City',es:'Ciudad de Colón · Malecón'},
 {id:'colonCivic',x:11,z:-252,en:'Colón Port Civic District',es:'Colón · Distrito Cívico del Puerto'},
 {id:'panamaEast',x:214,z:-50,en:'Panama East District',es:'Barrios de Panamá Este'},
 {id:'boquete',x:-112,z:-32,icon:'🌿',es:'Boquete · Chiriquí',en:'Boquete · Chiriquí',kind:'mainland'},
 {id:'volcanTown',x:-155,z:-32,en:'Volcán Town',es:'Pueblo Volcán'},
 {id:'boquete',x:-112,z:-32,en:'Boquete',es:'Boquete'},
 {id:'sunset',x:-135,z:-55,en:'Volcán Barú',es:'Volcán Barú'}
];
export const HIGHWAY_WIDTH=9.5;
// Corners are rounded with bounded quadratic arcs, never overshooting into
// off-road S-bends as uniform Catmull-Rom interpolation did at long segments.
// Preserve shared junction nodes exactly, so distinct roads still meet.
const roadNodeUse=new Map();
for(const [name,points]of Object.entries(MAINLAND_ROADS))for(const [x,z]of points){
 const key=x+','+z,used=roadNodeUse.get(key)||new Set();used.add(name);roadNodeUse.set(key,used);
}
export const ROAD_JUNCTIONS=[...roadNodeUse.entries()].filter(([,ids])=>ids.size>1)
 .map(([point])=>point.split(',').map(Number));
export function smoothHighway(points,spacing=1.6){
 const result=[],add=(p)=>{const q=result.at(-1);if(!q||Math.hypot(q[0]-p[0],q[1]-p[1])>.0001)result.push(p);};
 const line=(a,b)=>{const n=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/spacing));
  for(let j=1;j<=n;j++)add([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);};
 if(!points.length)return result;add([...points[0]]);
 let from=points[0];
 for(let i=1;i<points.length-1;i++){
  const prev=points[i-1],p=points[i],next=points[i+1];
  const lenA=Math.hypot(p[0]-prev[0],p[1]-prev[1]),lenB=Math.hypot(next[0]-p[0],next[1]-p[1]);
  if(lenA<.001||lenB<.001){line(from,p);from=p;continue;}
  const ux=(p[0]-prev[0])/lenA,uz=(p[1]-prev[1])/lenA;
  const vx=(next[0]-p[0])/lenB,vz=(next[1]-p[1])/lenB;
  const dot=ux*vx+uz*vz,shared=roadNodeUse.get(p[0]+','+p[1])?.size>1;
  const trim=shared||dot>.997?0:Math.min(3.1,lenA*.20,lenB*.20);
  if(trim<.02){line(from,p);from=p;continue;}
  const start=[p[0]-ux*trim,p[1]-uz*trim],finish=[p[0]+vx*trim,p[1]+vz*trim];
  line(from,start);
  const n=Math.max(4,Math.ceil(trim*2/spacing));
  for(let j=1;j<=n;j++){
   const t=j/n,u=1-t;
   add([u*u*start[0]+2*u*t*p[0]+t*t*finish[0],
        u*u*start[1]+2*u*t*p[1]+t*t*finish[1]]);
  }
  from=finish;
 }
 if(points.length>1)line(from,points.at(-1));
 return result;
}
export const HIGHWAY_CURVES=Object.fromEntries(Object.entries(MAINLAND_ROADS).map(([id,points])=>[id,smoothHighway(points)]));
// Flatten road polylines once, rather than rebuilding vectors every terrain
// query. Broad-phase boxes prevent distant roads slowing land generation.
const ROAD_SEGMENTS=Object.values(HIGHWAY_CURVES).flatMap(nodes=>nodes.slice(1).map(([bx,bz],i)=>{
 const [ax,az]=nodes[i],dx=bx-ax,dz=bz-az;
 return {ax,az,dx,dz,inv:1/Math.max(.000001,dx*dx+dz*dz),
  minX:Math.min(ax,bx),maxX:Math.max(ax,bx),minZ:Math.min(az,bz),maxZ:Math.max(az,bz)};
}));
export function nearRoad(x,z,buffer=HIGHWAY_WIDTH/2){
 const max2=buffer*buffer;
 for(const q of ROAD_SEGMENTS){
  if(x<q.minX-buffer||x>q.maxX+buffer||z<q.minZ-buffer||z>q.maxZ+buffer)continue;
  const t=Math.max(0,Math.min(1,((x-q.ax)*q.dx+(z-q.az)*q.dz)*q.inv)),
   dx=x-q.ax-t*q.dx,dz=z-q.az-t*q.dz;
  if(dx*dx+dz*dz<max2)return true;
 }
 return false;
}
export function roadDistance(x,z){
 let best=Infinity;
 for(const q of ROAD_SEGMENTS){
  const dx=Math.max(q.minX-x,0,x-q.maxX),dz=Math.max(q.minZ-z,0,z-q.maxZ);
  if(dx*dx+dz*dz>=best)continue;
  const t=Math.max(0,Math.min(1,((x-q.ax)*q.dx+(z-q.az)*q.dz)*q.inv)),
   px=x-q.ax-t*q.dx,pz=z-q.az-t*q.dz;
  best=Math.min(best,px*px+pz*pz);
 }
 return Math.sqrt(best);
}
export function mainlandRoadRoute(from,to){
 const vertices=new Map(),edges=new Map();
 const key=(x,z)=>x+','+z;
 for(const path of Object.values(MAINLAND_ROADS)){
  for(let i=0;i<path.length;i++){
   const [x,z]=path[i],id=key(x,z);vertices.set(id,{x,z});if(!edges.has(id))edges.set(id,[]);
   if(i){const [px,pz]=path[i-1],prev=key(px,pz),distance=Math.hypot(x-px,z-pz);edges.get(id).push({id:prev,distance});edges.get(prev).push({id,distance});}
  }
 }
 const nearest=p=>[...vertices.keys()].reduce((best,k)=>Math.hypot(vertices.get(k).x-p.x,vertices.get(k).z-p.z)<Math.hypot(vertices.get(best).x-p.x,vertices.get(best).z-p.z)?k:best);
 const first=nearest(from),last=nearest(to),distance=new Map([[first,0]]),previous=new Map(),todo=new Set(vertices.keys());
 while(todo.size){let current=null;for(const id of todo)if(current===null||(distance.get(id)??Infinity)<(distance.get(current)??Infinity))current=id;if(current===null||!Number.isFinite(distance.get(current)))break;todo.delete(current);if(current===last)break;for(const next of edges.get(current)||[]){const d=distance.get(current)+next.distance;if(d<(distance.get(next.id)??Infinity)){distance.set(next.id,d);previous.set(next.id,current);}}}
 const path=[last];while(path[0]!==first&&previous.has(path[0]))path.unshift(previous.get(path[0]));
 if(path[0]!==first)return [];
 const points=[...path.map(k=>vertices.get(k)),to],route=[];
 for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/2));for(let j=1;j<=n;j++)route.push({x:a.x+(b.x-a.x)*j/n,z:a.z+(b.z-a.z)*j/n});}
 return route;
}
// Older saved properties may have been built before roads reserved their space.
// Only move an obstructing property, keeping its ID, level, inventory and owner.
// Re-running normalization is idempotent once the property is clear.
export function relocateEstateRoadObstructions(estate){
 const buildings=estate?.buildings||[];let moved=0;
 for(const house of buildings){
  const radius=ESTATE_PLANS.find(p=>p.type===house.type)?.radius||3;
  const clear=HIGHWAY_WIDTH/2+radius+1.35;
  if(roadDistance(house.x,house.z)>clear)continue;
  const originX=house.x,originZ=house.z;
  let relocated=false;
  for(let step=3;step<=30&&!relocated;step+=3)for(let angle=0;angle<24;angle++){
   const a=angle*Math.PI/12,x=originX+Math.cos(a)*step,z=originZ+Math.sin(a)*step;
   if(roadDistance(x,z)<=clear+1.1||!mainlandAt(x,z)||inWater(x,z))continue;
   if(buildings.some(other=>other!==house&&Math.hypot(other.x-x,other.z-z)<radius+(ESTATE_PLANS.find(p=>p.type===other.type)?.radius||3)+1.5))continue;
   house.x=x;house.z=z;moved++;relocated=true;break;
  }
 }
 return moved;
}
export function mainlandAt(x,z){return (mainlandContains(x,z)&&!canalWater(x,z)&&!gatunWater(x,z))||nearRoad(x,z,HIGHWAY_WIDTH/2)||Math.hypot(x/18.7,z/12.5)<=1||worldIslands.some(i=>['pizzaCity','colon','sunset'].includes(i.id)&&Math.hypot((x-i.x)/i.rx,(z-i.z)/i.rz)<1);}
// A sculpted, safely walkable dormant volcano. The center dips to form a real
// bowl-shaped crater; the highest rock is the circular rim around the summit.
export function volcanoRelief(u,v){
 const r=Math.hypot(u,v);
 if(r>=1)return 0;
 const angle=Math.atan2(v,u),core=Math.pow(1-r*r,2.02);
 const slopes=45.0*core;
 const rim=4.65*Math.exp(-Math.pow((r-.19)/.078,2));
 const crater=11.0*Math.exp(-Math.pow(r/.128,4));
 const folded=1.12*Math.sin(angle*8+r*25)*Math.pow(Math.max(0,1-r),2);
 return Math.max(0,.08+slopes+rim-crater+folded);
}
// A spiral climbs from the south beach to the volcano's crater-rim lookout.
// Both the walking path and 3D road meshes use precisely these coordinates.
export function volcanoTrailPoint(progress){
 const p=Math.max(0,Math.min(1,progress)),land=worldIslands.find(i=>i.id==='sunset');
 const a=-Math.PI/2+p*3.4*Math.PI,r=.925-p*.73;
 const x=land.x+Math.cos(a)*land.rx*r,z=land.z+Math.sin(a)*land.rz*r;
 return {x,y:isletHeight(x,z),z,progress:p};
}
// Different topography in every biome. Keep the same coastline/footprints so
// navigation, saved positions, swim transitions and ocean shader stay aligned.
export function isletHeight(x,z){
 // Panama City is one consistent urban grade, not rolling island hills.
 // Keep the coastline transition outside the built city to avoid a vertical wall.
 const urbanRadius=Math.hypot((x-120)/58,(z+50)/48);
 if(urbanRadius<=.96)return 1.6;
 if(bridgeDistance(x-COLON_OFFSET.x,z-COLON_OFFSET.z)<1.5)return COLON_BRIDGE.y;
 
 const monkey=worldIslands.find(i=>i.id==='monkeyIslet'),onMonkey=Math.hypot((x-monkey.x)/monkey.rx,(z-monkey.z)/monkey.rz)<1;
 if(gatunWater(x,z)&&!canalWater(x,z)&&nearRoad(x,z,HIGHWAY_WIDTH/2+.5))return 3.8;
 if((canalWater(x,z)||gatunWater(x,z))&&!onMonkey)return 0;
 // Roads must never carve rectangular flat strips through Gorgona's green hills
  // or punch a straight trench into the volcanic crater.
  const vu=(x-BARU_LAND.x)/BARU_LAND.rx,vv=(z-BARU_LAND.z)/BARU_LAND.rz,
   volcanoDistance2=vu*vu+vv*vv,
   onBaru=volcanoDistance2<1.21&&volcanoDistance2<Math.pow(organicIslandRadius(BARU_LAND,Math.atan2(vv,vu)),2),
   homeDistance=Math.hypot(x/20,z/14),
   inHome=homeDistance<1.11&&homeDistance<homeShoreRadius(Math.atan2(z/14,x/20))*.98;
  if(!onBaru&&!inHome&&nearRoad(x,z,HIGHWAY_WIDTH/2+.5))return .16;
 // A real sea-level canal cut through the eastern city waterfront.
 
 let h=mainlandContains(x,z)&&Math.hypot(x/20,z/14)>1.02?1.1:0;
 for(const land of worldIslands){
  const u=(x-land.x)/land.rx,v=(z-land.z)/land.rz,rawRadius2=u*u+v*v;
  if(rawRadius2>1.22)continue;
  const shore=organicIslandRadius(land,Math.atan2(v,u)),r2=rawRadius2/(shore*shore);
  if(r2>1)continue;
  const core=1-r2,soft=core*core;
  let elevation=.08+core*land.h;
  if(land.id==='islet')elevation=.08+core*1.6+soft*(.45+.3*Math.sin(x*.55)*Math.cos(z*.45));
  else if(land.id==='wilds')elevation+=soft*(2+1.6*Math.sin(x*.2)*Math.cos(z*.16));
  else if(land.id==='coconutCoast')elevation=.08+core*1.85+soft*.55*(1+Math.sin(x*.32+z*.22));
  else if(land.id==='sunset')elevation=volcanoRelief(u,v);
  else if(land.id==='crystalCove'||land.guna)elevation=.12+core*.68+soft*.16;
  else if(land.id==='pizzaCity')elevation=.08+core*2.25+soft*.12*Math.sin(x*.18+z*.13);
  // Natural soil relief has several scales, strongest inland; urban roads and
  // the mapped volcano hiking trail retain their original stable elevations.
  if(!['pizzaCity','colon','sunset'].includes(land.id))
   elevation+=soft*(.19*Math.sin(x*.31+z*.12)+.12*Math.sin(z*.54-x*.23));
  h=Math.max(h,elevation);
 }
 return h;
}
export const explorePlaces=[
 {id:'colonCity',x:-67,z:-254,icon:'🏙️',es:'Ciudad de Colón · Costa Caribe',en:'Colón City · Caribbean Waterfront',kind:'mainland'},
 {id:'colonCivic',x:11,z:-252,icon:'🏘️',es:'Colón · Distrito Cívico y Puerto',en:'Colón · Port and Civic District',kind:'mainland'},
 {id:'panamaEast',x:214,z:-50,icon:'🏙️',es:'Barrios de Panamá Este',en:'Panama City · Eastern Districts',kind:'mainland'},
 {id:'volcanTown',x:-155,z:-32,icon:'🏘️',es:'Pueblo Volcán · Chiriquí',en:'Volcán Town · Chiriquí',kind:'mainland'},
 ...worldIslands.slice(1).filter(p=>!p.guna).map(p=>({id:p.id,x:p.x,z:p.z,icon:({wilds:'🍌',coconutCoast:'🥥',sunset:'🌋',crystalCove:'🏝️',pizzaCity:'🍕',colon:'🌧️',monkeyIslet:'🐒'})[p.id],es:p.es,en:p.en,kind:'islet'})),
 {id:'volcanoTrail',...volcanoTrailPoint(0),icon:'🥾',es:'Sendero del Volcán Barú',en:'Volcán Barú Hiking Trail',kind:'volcano'},
 {id:'volcanoSummit',...volcanoTrailPoint(1),icon:'🌋',es:'Mirador de la Cima · Volcán Barú',en:'Volcán Barú Summit Lookout',kind:'volcano'},
 {id:'coveBalloon',x:290,z:-233,icon:'🎈',es:'Globo de Guna Yala',en:'Guna Yala return balloon',kind:'balloon'},
 {id:'islet',x:24,z:-8,icon:'🦋',es:'Isla Taboga · Flores',en:'Taboga · Island of Flowers',kind:'islet'},
 {id:'pip',x:4,z:9,icon:'🐢',es:'Pip · Playa Gorgona',en:'Pip · Playa Gorgona',kind:'friend'},
 {id:'mila',x:0,z:-26,icon:'🦜',es:'Mila · Bocas del Toro',en:'Mila · Bocas del Toro',kind:'friend'},
 {id:'ollie',x:-112,z:-32,icon:'🪶',es:'Ollie · Boquete',en:'Ollie · Boquete',kind:'friend'},
 {id:'luna',x:290,z:-243,icon:'🦀',es:'Luna · Guna Yala',en:'Luna · Guna Yala',kind:'friend'},
 {id:'garden',x:24,z:-9.5,icon:'🌸',es:'Jardín de Flores de Taboga',en:'Taboga Flower Garden',kind:'garden'},
 {id:'beacon',x:-1,z:-2.5,icon:'✦',es:'Faro de la Aventura · Gorgona',en:'Gorgona Adventure Lighthouse',kind:'beacon'},
 {id:'bounce',x:-4,z:6,icon:'🍄',es:'Honguito de Gorgona',en:'Gorgona Bouncy Mushroom',kind:'bounce'},
 {id:'balloon',x:5,z:-7,icon:'🎈',es:'Globo de Panamá',en:'Panama Balloon Ride',kind:'balloon'},
 {id:'boat',x:4,z:16,icon:'⛵',es:'Muelle de Gorgona',en:'Gorgona Boat Dock',kind:'boat'},
 {id:'swim',x:10,z:10,icon:'🏊',es:'Playa Gorgona',en:'Playa Gorgona',kind:'swim'},
 {id:'wardrobe',x:-15,z:3,icon:'🎩',es:'Mercadito de Gorgona',en:'Gorgona Market',kind:'wardrobe'},
 {id:'chest',x:-15,z:-1,icon:'🎁',es:'Tesoro del Pacífico',en:'Pacific Treasure Chest',kind:'chest'}
];
for(const [id,land] of Object.entries({coveBalloon:'crystalCove',islet:'islet',mila:'wilds',luna:'crystalCove',garden:'islet'})){const p=explorePlaces.find(p=>p.id===id);Object.assign(p,islandPoint(land,p.x,p.z));}
export const exploreItems=[
 ...worldIslands.slice(1).filter(p=>p.id!=='pizzaCity').flatMap((p,j)=>Array.from({length:5},(_,i)=>{
   const angle=(j*5+i)*2.399963229728653,rad=.30+.095*(i%4);
   return {id:'wildGem'+j+'-'+i,x:p.x+Math.cos(angle)*p.rx*rad,z:p.z+Math.sin(angle)*p.rz*rad,
    kind:'islandTreasure',es:'gema de la isla',en:'island gem'};
  })),
 ...Array.from({length:5},(_,i)=>{
  const p=worldIslands.find(land=>land.id==='islet'),a=i*2.399963229728653;
  return {id:'wildGem4-'+i,x:p.x+Math.cos(a)*p.rx*.39,z:p.z+Math.sin(a)*p.rz*.39,
   kind:'islandTreasure',es:'gema de Taboga',en:'Taboga gem'};
 }),
 ...[[276,-262],[303,-261],[310,-234],[268,-233]].map(([x,z],i)=>({id:'sea'+i,x,z,kind:'seaTreasure',es:'tesoro del arrecife de Guna Yala',en:'Guna Yala reef treasure'})),
 ...[[-7,-33],[-3,-35],[3,-35],[7,-33],[0,-38]].map(([x,z],i)=>({id:'fruit'+i,x,z,kind:'fruit',tile:7,es:'plátanos',en:'bananas'})),
 ...[[-48,4],[-45,1],[-39,2],[-36,5],[-49,8]].map(([x,z],i)=>({id:'glow'+i,x,z,kind:'glow',es:'luciérnaga',en:'firefly'})),
 ...[[2,11],[-3,11],[-9,9],[-15,5],[-17,0],[-14,-7],[-7,-11],[2,-11],[10,-9],[15,-4],[17,2],[14,8]].map(([x,z],i)=>({id:'shell'+i,x,z,kind:'shell',es:'concha',en:'shell'}))
];
for(const p of exploreItems){const land={fruit:'wilds',glow:'sunset'}[p.kind];if(land)Object.assign(p,islandPoint(land,p.x,p.z));}
export function normalizeStory(raw){return Object.fromEntries(Object.entries({shells:3,picnic:4,seed:3,song:4,care:2,light:4}).map(([id,length])=>[id,Number.isInteger(raw?.[id])?Math.max(0,Math.min(length,raw[id])):0]));}
export function freshExplore(){return {panama:normalizePanama(null),campaign:normalizeCampaign(null),colon:normalizeColon(null),estate:normalizeEstate(null),inventoryVersion:1,foodTotal:{banana:0,coconut:0},worldVersion:3,geographyVersion:1,sanBlasGeographyVersion:2,colonLayoutVersion:COLON_LAYOUT_VERSION,realms:{found:[],turtle:0,bird:0},journey:{visited:[],meals:0,swim:0,fly:0,rings:[]},x:4,z:10,dayTime:40,story:normalizeStory(null),collected:[],badges:[],hat:0,pet:false,flowers:0,catches:0,pops:0,flight:0,growth:1,food:{coconut:0,banana:0},harvested:{},boat:{x:6.5,z:16,heading:0},regionalProjects:{helped:[]},craft:{built:[],spent:{}},city:{cruise:normalizeCruise(null),bags:[],pizzas:0,car:{x:114,z:-50,heading:0},activities:{deliveries:[],deliveryActive:false,rallyBest:0,rallyWins:0,soccerGoals:0,soccerShots:0,marketTrades:0,muralColors:0,museum:[],carWashes:0}},friends:{visits:[],completed:[],companion:null}};}
export function normalizeExplore(raw){raw=migrateGeography(raw);const s=freshExplore();if(!raw||typeof raw!=='object')return s;const rr=raw.realms||{};s.realms={found:[...new Set((Array.isArray(rr.found)?rr.found:[]).filter(id=>/^(reef-[0-5]|pearl-[0-4]|wind-[0-4]|star-[0-4]|seaChest-0|skyLight-0)$/.test(id)))],turtle:Math.max(0,Math.min(5,Math.floor(Number(rr.turtle)||0))),bird:Math.max(0,Math.min(4,Math.floor(Number(rr.bird)||0)))};const j=raw.journey||{};s.journey={visited:[...new Set((Array.isArray(j.visited)?j.visited:[]).filter(id=>worldIslands.some(p=>p.id===id)))],meals:Math.max(0,Math.min(999,Number(j.meals)||0)),swim:Math.max(0,Math.min(100000,Number(j.swim)||0)),fly:Math.max(0,Math.min(100000,Number(j.fly)||0)),rings:[...new Set((Array.isArray(j.rings)?j.rings:[]).filter(id=>/^(swim|fly)-[0-9]+$/.test(id)))]};// Preserve friendship, a chosen companion, and first-time play rewards across saves.
const FRIEND_IDS=['pip','dori','mila','ollie','luna','kai'],savedFriends=raw.friends||{};
s.friends={
 visits:[...new Set((Array.isArray(savedFriends.visits)?savedFriends.visits:[]).filter(id=>FRIEND_IDS.includes(id)))],
 completed:[...new Set((Array.isArray(savedFriends.completed)?savedFriends.completed:[]).filter(id=>FRIEND_IDS.includes(id)))],
 companion:FRIEND_IDS.includes(savedFriends.companion)?savedFriends.companion:null,
 called:[...new Set((Array.isArray(savedFriends.called)?savedFriends.called:[]).filter(id=>FRIEND_IDS.includes(id)))]
};
const savedCity=raw.city||{},car=savedCity.car||{},withinCity=(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&Math.hypot((x-120)/58,(z+50)/48)<.86;
s.city={cruise:normalizeCruise(savedCity.cruise),bags:[...new Set((Array.isArray(savedCity.bags)?savedCity.bags:[]).filter(id=>/^bag-(?:[0-9]|1[0-9]|2[0-3])$/.test(id)))],
 pizzas:Math.max(0,Math.min(999,Math.floor(Number(savedCity.pizzas)||0))),
 car:withinCity(car.x,car.z)?{x:car.x,z:car.z,heading:Number.isFinite(car.heading)?car.heading:0}:{x:114,z:-50,heading:0},
 activities:{
  deliveries:[...new Set((Array.isArray(savedCity.activities?.deliveries)?savedCity.activities.deliveries:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<3))],
  deliveryActive:savedCity.activities?.deliveryActive===true,
  rallyBest:Math.max(0,Math.min(600,Number(savedCity.activities?.rallyBest)||0)),
  rallyWins:Math.max(0,Math.min(999,Math.floor(Number(savedCity.activities?.rallyWins)||0))),
  soccerGoals:Math.max(0,Math.min(999,Math.floor(Number(savedCity.activities?.soccerGoals)||0))),
  soccerShots:Math.max(0,Math.min(999,Math.floor(Number(savedCity.activities?.soccerShots)||0))),
  marketTrades:Math.max(0,Math.min(999,Math.floor(Number(savedCity.activities?.marketTrades)||0))),
  muralColors:Math.max(0,Math.min(4,Math.floor(Number(savedCity.activities?.muralColors)||0))),
  museum:[...new Set((Array.isArray(savedCity.activities?.museum)?savedCity.activities.museum:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<3))],
  carWashes:Math.max(0,Math.min(999,Math.floor(Number(savedCity.activities?.carWashes)||0)))
 }};
s.panama=normalizePanama(raw.panama);s.colon=normalizeColon(raw.colon);s.campaign=normalizeCampaign(raw.campaign);
s.regionalProjects={helped:[...new Set((Array.isArray(raw.regionalProjects?.helped)?raw.regionalProjects.helped:[]).filter(id=>['home','islet','wilds','coconutCoast','sunset','crystalCove','pizzaCity','colon'].includes(id)))]};
const savedCraft=raw.craft||{},allowedResource=['shell','fruit','glow','islandTreasure','seaTreasure','moneyBag'];
s.craft={built:[...new Set((Array.isArray(savedCraft.built)?savedCraft.built:[]).filter(id=>['sandcastle','butterflyGarden','treehouse','beachCabana','volcanoCamp','coralNursery','pizzaStand'].includes(id)))],
 spent:Object.fromEntries(allowedResource.map(kind=>[kind,Math.max(0,Math.min(999,Math.floor(Number(savedCraft.spent?.[kind])||0)))]))};
s.colonLayoutVersion=COLON_LAYOUT_VERSION;
s.dayTime=Number.isFinite(raw.dayTime)?((raw.dayTime%240)+240)%240:40;s.story=normalizeStory(raw.story);const ids=new Set(exploreItems.map(x=>x.id));s.collected=[...new Set(Array.isArray(raw.collected)?raw.collected.filter(x=>ids.has(x)):[])];s.badges=[...new Set(Array.isArray(raw.badges)?raw.badges.filter(x=>['picnic','glow','song','garden','treasure','beacon','balloon','boat','volcano-summit'].includes(x)):[])];if(Number.isFinite(raw.x)&&Number.isFinite(raw.z)&&(raw.x/WORLD_BOUNDS.x)**2+(raw.z/WORLD_BOUNDS.z)**2<=1){
 s.x=raw.x;s.z=raw.z;
 if(raw.worldVersion===2){
  // Relocate saved characters standing on moved islands while retaining their
  // normalized local positions, coins, pets, and quests.
  if(Math.hypot((s.x+30)/24,(s.z+85)/25)<1){s.x+=46;s.z-=27;}
  else if(Math.hypot((s.x+100)/38,(s.z-30)/34)<1){s.x-=10;s.z+=19;}
 }else if(raw.worldVersion!==3&&!raw.flight){
  const old=worldIslands.find(p=>Math.hypot((s.x-p.ox)/(p.rx/p.spread),(s.z-p.oz)/(p.rz/p.spread))<1);
  if(old)Object.assign(s,islandPoint(old.id,s.x,s.z));
 }
}s.hat=Number.isInteger(raw.hat)?Math.max(0,Math.min(6,raw.hat)):0;s.pet=raw.pet===true;s.flowers=Math.max(0,Math.min(6,Math.floor(Number(raw.flowers)||0)));for(const k of ['catches','pops'])s[k]=Math.max(0,Math.min(9999,Math.floor(Number(raw[k])||0)));s.growth=Number.isFinite(raw.growth)?Math.max(1,Math.min(6,raw.growth)):1;s.flight=Number.isFinite(raw.flight)?Math.max(0,Math.min(40,raw.flight)):0;for(const kind of ['coconut','banana'])s.food[kind]=Math.min(9999,inventoryCount(raw.food?.[kind]));for(const [id,n] of Object.entries(raw.harvested||{})){if(/^(coconut|banana)\d+$/.test(id))s.harvested[id]=Math.max(0,Math.min(6,Math.floor(Number(n)||0)));}if(Number.isFinite(raw.boat?.x)&&Number.isFinite(raw.boat?.z)&&Math.hypot(raw.boat.x/WORLD_BOUNDS.x,raw.boat.z/WORLD_BOUNDS.z)<1&&inWater(raw.boat.x,raw.boat.z)){s.boat={x:raw.boat.x,z:raw.boat.z,heading:Number.isFinite(raw.boat.heading)?raw.boat.heading:0};}Object.assign(s.boat,recoverBoat(s.boat.x,s.boat.z));
// Legacy ground bananas and tree/reward food were independent stocks. Merge only
// the unspent ground stock once; collected IDs remain discovery history.
if(raw.inventoryVersion!==1)s.food.banana+=Math.max(0,countExplore(s,'fruit')-s.craft.spent.fruit);
for(const kind of ['banana','coconut'])s.foodTotal[kind]=Math.max(s.food[kind]+(kind==='banana'?s.craft.spent.fruit:0),raw.inventoryVersion===1?inventoryCount(raw.foodTotal?.[kind]):0);
s.estate=normalizeEstate(raw.estate,s.collected.filter(id=>['islandTreasure','seaTreasure','glow'].includes(exploreItems.find(item=>item.id===id)?.kind)).length);
 relocateEstateRoadObstructions(s.estate);
s.lighthouseOn=typeof raw.lighthouseOn==='boolean'?raw.lighthouseOn:(Array.isArray(raw.badges)&&raw.badges.includes('beacon'));
s.gardenWatered=raw.gardenWatered===true;s.chestOpen=raw.chestOpen===true;
// NPC projects persist across island re-entry and page reloads.
s.builders=Object.fromEntries(['mateo','sofia'].map(id=>[id,{cycle:Math.max(0,Math.min(9999,Math.floor(Number(raw.builders?.[id]?.cycle)||0))),elapsed:Math.max(0,Math.min(95,Number(raw.builders?.[id]?.elapsed)||0)),lifeClock:Math.max(0,Math.min(1e7,Number(raw.builders?.[id]?.lifeClock)||0)),completed:(Array.isArray(raw.builders?.[id]?.completed)?raw.builders[id].completed:[]).filter(p=>p&&typeof p.id==='string'&&/^((mateo|sofia)-(city|taboga|contadora|bocas|colon|guna)-[01])$/.test(p.id)&&Number.isFinite(p.x)&&Number.isFinite(p.z)&&Math.hypot(p.x/WORLD_BOUNDS.x,p.z/WORLD_BOUNDS.z)<1).slice(0,28).map(p=>({id:p.id,region:p.region,x:p.x,z:p.z}))}]));
return s;}
// Food is the single spendable stock. Collection history never gets spent.
function inventoryCount(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(1000000,Math.floor(n))):0;}
export function addFood(world,kind,amount=1){
 if(!['banana','coconut'].includes(kind)||!Number.isInteger(amount)||amount<=0)return false;
 world.food??={banana:0,coconut:0};world.foodTotal??={...world.food};
 if(world.food[kind]+amount>9999)return false;
 world.food[kind]+=amount;world.foodTotal[kind]=inventoryCount(world.foodTotal[kind])+amount;return true;
}
export function spendFood(world,kind,amount=1){
 if(!['banana','coconut'].includes(kind)||!Number.isInteger(amount)||amount<=0||(world.food?.[kind]||0)<amount)return false;
 world.food[kind]-=amount;return true;
}
export function harvestFood(world,tree){
 if(!tree||!['banana','coconut'].includes(tree.kind)||!new RegExp('^'+tree.kind+'\\d+$').test(tree.id))return false;
 const n=world.harvested[tree.id]||0;
 if(n>=tree.fruits.length||!addFood(world,tree.kind))return false;
 world.harvested[tree.id]=n+1;return true;
}
export function collectExplore(s,id){const item=exploreItems.find(x=>x.id===id);if(!item||s.collected.includes(id))return false;if(item.kind==='fruit'&&!addFood(s,'banana',1))return false;s.collected.push(id);if(['islandTreasure','seaTreasure','glow'].includes(item.kind)&&s.estate)s.estate.charms=Math.min(9999,s.estate.charms+1);return true;}
export function badgeExplore(s,id){if(s.badges.includes(id))return false;s.badges.push(id);return true;}
export function countExplore(s,kind){return s.collected.filter(id=>exploreItems.find(x=>x.id===id)?.kind===kind).length;}
// Small navigation grid: a tap walks around cottages instead of through them.
export const worldObstacles=[[-10,5,1.55],[-13,2,1.3],[10,2,1.55],[12,-1,1.2],[9,-4,1.1],[-1,-5,1.5]];
export function walkable(x,z){return (isletHeight(x,z)>0||Math.hypot(x/20,z/14)<=homeShoreRadius(Math.atan2(z/14,x/20)))&&worldObstacles.every(([a,b,r])=>Math.hypot(x-a,z-b)>r+.3);}
// Match the sculpted shoreline; the wider lagoon is navigable, but buildings stay solid.
export function onDock(x,z){return x>=3&&x<=5&&z>=11.8&&z<=17.4;}
export function inWater(x,z){if(onDock(x,z)||isletHeight(x,z)>0)return false;const a=Math.atan2(z/14,x/20);return Math.hypot(x/20,z/14)>homeShoreRadius(a);}
// Keep the hull clear, including saved boats that overlap a shore or world boundary.
export function boatClear(x,z){if(Math.hypot(x/(WORLD_BOUNDS.x-1),z/(WORLD_BOUNDS.z-1))>=1||!inWater(x,z))return false;for(let i=0;i<8;i++){const a=i*Math.PI/4;if(!inWater(x+Math.sin(a)*1.1,z+Math.cos(a)*1.1))return false;}return true;}
export function recoverBoat(x,z){if(boatClear(x,z))return {x,z};for(let r=.15;r<=6;r+=.15)for(let i=0;i<32;i++){const a=i*Math.PI/16,nx=x+Math.sin(a)*r,nz=z+Math.cos(a)*r;if(boatClear(nx,nz))return {x:nx,z:nz};}return {x:6.5,z:16};}
export function boatStep(x,z,dx,dz){const start=recoverBoat(x,z);x=start.x;z=start.z;const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.15));dx/=steps;dz/=steps;
 for(let i=0;i<steps;i++){const candidates=[[dx,dz],...(Math.abs(dx)>=Math.abs(dz)?[[dx,0],[0,dz]]:[[0,dz],[dx,0]])];for(const a of [Math.PI/6,-Math.PI/6,Math.PI/3,-Math.PI/3,Math.PI/2,-Math.PI/2])candidates.push([dx*Math.cos(a)-dz*Math.sin(a),dx*Math.sin(a)+dz*Math.cos(a)]);for(const [mx,mz] of candidates){if(Math.hypot(mx,mz)>.00001&&boatClear(x+mx,z+mz)){x+=mx;z+=mz;break;}}}return {x,z};}
// Sharks steer around shores with clearance for their whole body, not just their center.
export function sharkClearance(x,z){
 const wet=(px,pz)=>inWater(px,pz)&&!nearRoad(px,pz,HIGHWAY_WIDTH/2+2.4);
 let count=wet(x,z)?1:0;
 for(let i=0;i<12;i++){const a=i*Math.PI/6;if(wet(x+Math.sin(a)*1.8,z+Math.cos(a)*1.8))count++;}
 return count;
}
export function sharkStep(x,z,tx,tz,dt,speed,side=1,previousHeading=null){
 const distance=Math.hypot(tx-x,tz-z),step=Math.min(Math.max(0,dt)*speed,distance);
 if(step===0)return {x,z,heading:previousHeading};
 const desired=Math.atan2(tx-x,tz-z),base=previousHeading??desired;
 const turn=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
 let best=null,bestScore=-Infinity;
 // Select the safest forward heading with a persistent turning preference.
 // Never bounce off dry road edges or instantly reverse course each frame.
 for(let i=0;i<=18;i++)for(const sign of i===0?[1]:[side,-side]){
  const candidate=base+sign*i*Math.PI/18;
  const nx=x+Math.sin(candidate)*step,nz=z+Math.cos(candidate)*step;
  if(sharkClearance(nx,nz)!==13)continue;
  const ahead=sharkClearance(x+Math.sin(candidate)*2.5,z+Math.cos(candidate)*2.5);
  if(ahead<12)continue;
  const score=ahead*10-Math.abs(turn(candidate,desired))*2-Math.abs(turn(candidate,base))*8;
  if(score>bestScore){best={x:nx,z:nz,heading:candidate};bestScore=score;}
 }
 return best||{x,z,heading:base};
}
export function traversable(x,z){return Math.hypot(x/WORLD_BOUNDS.x,z/WORLD_BOUNDS.z)<=1&&worldObstacles.every(([a,b,r])=>Math.hypot(x-a,z-b)>r+.3);}
export function islandPath(from,to){
 if(!remoteAccess(from,to))return [];
 // Far islands must not trigger a 100,000-node, one-meter A* grid on phones.
 // In open world ocean / empty countryside use validated spaced waypoints.
 // Short local navigation keeps the existing detailed obstacle-aware search.
 const trip=Math.hypot(to.x-from.x,to.z-from.z);
 if(trip>110){
  // Gentle perpendicular detours avoid cottages near a shoreline; none of
  // these crossings ever expands an enormous all-world A* graph.
  const dx=(to.x-from.x)/trip,dz=(to.z-from.z)/trip;
  for(const offset of [0,12,-12,24,-24,38,-38]){
   const middle={x:(from.x+to.x)/2-dz*offset,z:(from.z+to.z)/2+dx*offset};
   const waypoints=[from,middle,to],path=[];
   let valid=true;
   for(let segment=1;segment<waypoints.length;segment++){
    const a=waypoints[segment-1],b=waypoints[segment],distance=Math.hypot(b.x-a.x,b.z-a.z),
     count=Math.max(1,Math.ceil(distance/7));
    for(let i=1;i<=count;i++){
     const t=i/count,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t;
     if(!traversable(x,z)){valid=false;break;}
     path.push({x,z});
    }
    if(!valid)break;
   }
   if(valid)return path;
  }
  return []; // Require manual boat/navigation when no safe route is available.
 }

 const ocean=Math.abs(from.x)>18||Math.abs(to.x)>18||Math.abs(from.z)>12||Math.abs(to.z)>12||!walkable(from.x,from.z)||!walkable(to.x,to.z),allowed=ocean?traversable:walkable;
 const minX=ocean?Math.max(-WORLD_BOUNDS.x,Math.floor(Math.min(from.x,to.x))-5):-18,maxX=ocean?Math.min(WORLD_BOUNDS.x,Math.ceil(Math.max(from.x,to.x))+5):18,minZ=ocean?Math.max(-WORLD_BOUNDS.z,Math.floor(Math.min(from.z,to.z))-5):-12,maxZ=ocean?Math.min(WORLD_BOUNDS.z,Math.ceil(Math.max(from.z,to.z))+5):12;
 const nodes=[];for(let z=minZ;z<=maxZ;z++)for(let x=minX;x<=maxX;x++)if(allowed(x,z))nodes.push({x,z,key:x+','+z});
 const nearest=p=>nodes.reduce((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)<Math.hypot(b.x-p.x,b.z-p.z)?a:b);
 const start=nearest(from),goal=nearest(to),map=new Map(nodes.map(n=>[n.key,n])),open=[start.key],cost=new Map([[start.key,0]]),came=new Map(),closed=new Set();
 while(open.length){open.sort((a,b)=>(cost.get(a)+Math.hypot(map.get(a).x-goal.x,map.get(a).z-goal.z))-(cost.get(b)+Math.hypot(map.get(b).x-goal.x,map.get(b).z-goal.z)));const key=open.shift(),n=map.get(key);if(key===goal.key){const route=[];let k=key;while(k!==start.key){route.unshift({x:map.get(k).x,z:map.get(k).z});k=came.get(k);}if(allowed(to.x,to.z))route.push(to);return route;}closed.add(key);for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const next=(n.x+dx)+','+(n.z+dz);if(!map.has(next)||closed.has(next))continue;const c=cost.get(key)+1;if(c<(cost.get(next)??Infinity)){cost.set(next,c);came.set(next,key);if(!open.includes(next))open.push(next);}}}return [];
}
// One suggested adventure at a time, alternating places so learning feels like exploring.
export function nextIslandAdventure(state){
 const places=['pip','mila','ollie','luna','garden','beacon'],regions=['harbor','market','jungle','music','garden','summit'];
 const ids=Array.from({length:8},(_,i)=>regions.map(r=>`${r}-${i}`)).flat();
 const completed={...state.completed,...state.islandLessons?.completed},attempts=state.islandLessons?.attempts||{};
 const id=ids.find(id=>attempts[id])||ids.find(id=>!completed[id]);if(!id)return null;
 const region=regions.indexOf(id.split('-')[0]);return {id,region,place:places[region],done:ids.filter(id=>completed[id]).length,resuming:!!attempts[id]};
}
// Fixed rewards keep the wallet explainable and prevent repeat-click farming.
export const islandShop=[{id:'coral',cost:15,hat:4,es:'Sombrero coral',en:'Coral hat'},{id:'ocean',cost:30,hat:5,es:'Sombrero océano',en:'Ocean hat'},{id:'sunshine',cost:45,hat:6,es:'Sombrero sol',en:'Sunshine hat'}];
export function coinValue(id){if(id==='colon-monkey-play')return 12;if(/^region-help-(home|islet|wilds|coconutCoast|sunset|crystalCove|pizzaCity|colon)$/.test(id))return 25;
 if(/^city-(?:rally|soccer|mural|carwash|plaza|canal|delivery-finish)$/.test(id))return 12;
 if(/^city-delivery-[0-2]$/.test(id))return 7;
 if(/^city-market-[1-3]$/.test(id))return 5;
 if(/^city-museum-[0-2]$/.test(id))return 6;
 if(/^craft-build-(sandcastle|butterflyGarden|treehouse|beachCabana|volcanoCamp|coralNursery|pizzaStand)$/.test(id))return 10;if(/^craft-use-(sandcastle|butterflyGarden|treehouse|beachCabana|volcanoCamp|coralNursery|pizzaStand)$/.test(id))return 3;if(/^city-bag-(?:[0-9]|1[0-9]|2[0-3])$/.test(id))return 5;if(id==='city-pizza')return 3;if(/^friend-(pip|dori|mila|ollie|luna|kai)$/.test(id))return 12;if(/^realm-(islands|water|sky)$/.test(id))return 20;if(/^realm-(visit|fruit|butterfly|friends|reef|pearls|turtle|seaChest|wind|stars|bird|skyLight)$/.test(id))return 10;if(/^journey-(explore|food|learn|swim|fly)$/.test(id))return 20;if(/^ring-(swim|fly)-([0-9]|1[0-9])$/.test(id))return 2;if(/^story-(shells|picnic|seed|song|care|light)$/.test(id))return 10;if(/^(harbor|market|jungle|music|garden|summit)-[0-7]$/.test(id))return 10;if(/^flower-[1-6]$/.test(id))return 2;if(['picnic','glow','song'].includes(id))return 15;if(id==='beacon')return 25;if(id==='pet')return 3;if(exploreItems.some(i=>i.id===id))return 1;return 0;}
export function normalizeWallet(raw){const rewards=[...new Set(Array.isArray(raw?.rewards)?raw.rewards.filter(id=>typeof id==='string'&&coinValue(id)>0):[])];let balance=rewards.reduce((n,id)=>n+coinValue(id),0);const items=[];for(const id of Array.isArray(raw?.items)?raw.items:[]){const item=islandShop.find(x=>x.id===id);if(item&&!items.includes(id)&&balance>=item.cost){items.push(id);balance-=item.cost;}}return {rewards,items};}
export function coinBalance(state){const w=state.wallet||{rewards:[],items:[]};return w.rewards.reduce((n,id)=>n+coinValue(id),0)-w.items.reduce((n,id)=>n+(islandShop.find(x=>x.id===id)?.cost||0),0)-estateCoinCost(state.world)-(state.world?.city?.cruise?.tickets||0)*CRUISE_FARE-(state.world?.panama?.spent||0);}
export function earnCoins(state,id){state.wallet??=normalizeWallet(null);const amount=coinValue(id);if(!amount||state.wallet.rewards.includes(id))return 0;state.wallet.rewards.push(id);return amount;}
export function syncWallet(state){state.wallet=normalizeWallet(state.wallet);for(const id of Object.keys({...state.completed,...state.islandLessons?.completed}))earnCoins(state,id);for(let i=1;i<=(state.world?.flowers||0);i++)earnCoins(state,'flower-'+i);for(const id of state.world?.badges||[])earnCoins(state,id);for(const id of state.world?.collected||[])earnCoins(state,id);for(const id of state.world?.city?.bags||[])earnCoins(state,'city-'+id);if(state.world?.city?.pizzas)earnCoins(state,'city-pizza');if(state.world?.pet)earnCoins(state,'pet');for(const id of state.world?.friends?.completed||[])earnCoins(state,'friend-'+id);for(const [id,n] of Object.entries(state.world?.story||{})){if(n>=({shells:3,picnic:4,seed:3,song:4,care:2,light:4})[id])earnCoins(state,"story-"+id);}return state.wallet;}
export function buyIslandItem(state,id){const item=islandShop.find(x=>x.id===id);if(!item)return false;state.wallet??=normalizeWallet(null);if(state.wallet.items.includes(id)){state.world.hat=item.hat;return true;}if(coinBalance(state)<item.cost)return false;state.wallet.items.push(id);state.world.hat=item.hat;return true;}

// Patrol navigation runs on simulation time, independently of decorative motion.
export function recoverShark(x,z){if(sharkClearance(x,z)===13)return {x,z};for(let r=.4;r<=12;r+=.4)for(let i=0;i<24;i++){const a=i*Math.PI/12,nx=x+Math.sin(a)*r,nz=z+Math.cos(a)*r;if(sharkClearance(nx,nz)===13)return {x:nx,z:nz};}return {x:8,z:28};}
export function sharkPatrol(p,dt,target=null){
 if(dt<=0)return {x:p.x,z:p.z};
 if(!inWater(p.x,p.z))Object.assign(p,recoverShark(p.x,p.z));
 p.waypoint??=0;p.watch??=0;p.anchor??={x:p.x,z:p.z};
 function destination(){const cx=p.cx||0,cz=p.cz||0,rx=p.rx||32,rz=p.rz||26;for(let i=0;i<24;i++){const a=p.waypoint/24*Math.PI*2,x=cx+Math.cos(a)*rx,z=cz+Math.sin(a)*rz;if(sharkClearance(x,z)===13)return {x,z};p.waypoint=(p.waypoint+(p.direction||1)+24)%24;}return recoverShark(cx+rx,cz);}
 let dest=target||destination();if(!target&&Math.hypot(dest.x-p.x,dest.z-p.z)<2){p.waypoint=(p.waypoint+(p.direction||1)+24)%24;dest=destination();}
 const next=sharkStep(p.x,p.z,dest.x,dest.z,Math.min(dt,.05),target?12:5,p.side||1,p.heading??null);p.heading=next.heading;p.watch+=dt;
 if(p.watch>=2){if(Math.hypot(next.x-p.anchor.x,next.z-p.anchor.z)<1.2){p.waypoint=(p.waypoint+6)%24;p.side=-(p.side||1);p.detour=4;}p.watch=0;p.anchor={...next};}
 return next;
}


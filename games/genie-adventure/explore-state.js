import {normalizeWishes} from './wish-state.js?v=genie2';
import {normalizeEstate,estateCoinCost} from './estate.js?v=genie2';
// Exploration is independent of lesson order. Every place is open from the start.
export const worldIslands=[
 {id:'islet',x:60,z:-60,rx:12,rz:10,h:2.5,ox:24,oz:-8,spread:2.4,en:'Blossom Moon · Venus',es:'Luna de las Flores · Venus'},
 {id:'wilds',x:16,z:-112,rx:24,rz:25,h:5,ox:0,oz:-30,spread:1.25,en:'Nebulosa Esmeralda',es:'Nebulosa Esmeralda'},
 {id:'coconutCoast',x:105,z:10,rx:23,rz:19,h:4,ox:47,oz:6,spread:1.35,en:'Golden Moon · Saturn',es:'Luna Dorada · Saturno'},
 {id:'sunset',x:-110,z:49,rx:38,rz:34,h:46,ox:-42,oz:8,spread:1.35,en:'Monte Nova · Marte',es:'Monte Nova · Marte'},
 {id:'crystalCove',x:10,z:100,rx:20,rz:16,h:5,ox:0,oz:48,spread:1.5,en:'Santuario de Cristal · Neptuno',es:'Santuario de Cristal · Neptuno',vehicleOnly:true},
 {id:'pizzaCity',x:-100,z:-74,rx:58,rz:48,h:3.3,ox:-100,oz:-74,spread:1,en:'Astral City · Orion',es:'Ciudad Astral · Orión'}
];
export function islandPoint(id,x,z){const p=worldIslands.find(p=>p.id===id);return {x:p.x+(x-p.ox)*p.spread,z:p.z+(z-p.oz)*p.spread};}
// Strong offshore currents require a vehicle to cross; walking remains free after arrival.
export function remoteAccess(from,to){const p=worldIslands.find(i=>i.vehicleOnly),radius=q=>Math.hypot((q.x-p.x)/p.rx,(q.z-p.z)/p.rz);return radius(to)>=1.6||radius(from)<1.6;}
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
 let h=0;
 for(const land of worldIslands){
  const u=(x-land.x)/land.rx,v=(z-land.z)/land.rz,r2=u*u+v*v;
  if(r2>1)continue;
  const core=1-r2,soft=core*core;
  let elevation=.08+core*land.h;
  if(land.id==='islet')elevation=.08+core*1.6+soft*(.45+.3*Math.sin(x*.55)*Math.cos(z*.45));
  else if(land.id==='wilds')elevation+=soft*(2+1.6*Math.sin(x*.2)*Math.cos(z*.16));
  else if(land.id==='coconutCoast')elevation=.08+core*1.85+soft*.55*(1+Math.sin(x*.32+z*.22));
  else if(land.id==='sunset')elevation=volcanoRelief(u,v);
  else if(land.id==='crystalCove')elevation+=soft*(1.9+.7*Math.cos(x*.3+z*.24));
  else if(land.id==='pizzaCity')elevation=.08+core*2.25+soft*.12*Math.sin(x*.18+z*.13);
  h=Math.max(h,elevation);
 }
 return h;
}
export const explorePlaces=[
 ...worldIslands.slice(1).map(p=>({id:p.id,x:p.x,z:p.z,icon:({wilds:'🍌',coconutCoast:'🥥',sunset:'🌋',crystalCove:'💎',pizzaCity:'🍕'})[p.id],es:p.es,en:p.en,kind:'islet'})),
 {id:'volcanoTrail',...volcanoTrailPoint(0),icon:'🥾',es:'Sendero del Monte Nova',en:'Monte Nova Hiking Trail',kind:'volcano'},
 {id:'volcanoSummit',...volcanoTrailPoint(1),icon:'🌋',es:'Mirador de la Cima · Monte Nova',en:'Monte Nova Summit Lookout',kind:'volcano'},
 {id:'coveBalloon',x:5,z:48,icon:'🧞',es:'Vuelo mágico de Neptune',en:'Neptune Flight Portal',kind:'balloon'},
 {id:'islet',x:24,z:-8,icon:'🦋',es:'Luna de Venus · Flores',en:'Blossom Moon · Venus',kind:'islet'},
 {id:'pip',x:4,z:9,icon:'🐢',es:'Pip · Santuario del Genio',en:'Pip · Genie Haven',kind:'friend'},
 {id:'mila',x:0,z:-26,icon:'🦜',es:'Mila · Emerald Nebula',en:'Mila · Emerald Nebula',kind:'friend'},
 {id:'ollie',x:-42,z:12,icon:'🪶',es:'Ollie · Andromeda',en:'Ollie · Andromeda',kind:'friend'},
 {id:'luna',x:0,z:43,icon:'🦀',es:'Luna · Neptune',en:'Luna · Neptune',kind:'friend'},
 {id:'garden',x:24,z:-9.5,icon:'🌸',es:'Jardín de Flores de Venus',en:'Venus Flower Garden',kind:'garden'},
 {id:'beacon',x:-1,z:-2.5,icon:'✦',es:'Faro de la Aventura · Genie Haven',en:'Genie Haven Adventure Lighthouse',kind:'beacon'},
 {id:'bounce',x:-4,z:6,icon:'🍄',es:'Honguito de Genie Haven',en:'Genie Haven Bouncy Mushroom',kind:'bounce'},
 {id:'balloon',x:5,z:-7,icon:'🧞',es:'Vuelo mágico del cosmos',en:'Genie Flight Portal',kind:'balloon'},
 {id:'boat',x:4,z:16,icon:'🚀',es:'Portal del Genio',en:'Genie Haven Boat Dock',kind:'boat'},
 {id:'swim',x:10,z:10,icon:'🏊',es:'Santuario del Genio',en:'Genie Haven',kind:'swim'},
 {id:'wardrobe',x:-15,z:3,icon:'🎩',es:'Mercadito de Genie Haven',en:'Genie Haven Market',kind:'wardrobe'},
 {id:'chest',x:-15,z:-1,icon:'🎁',es:'Tesoro del Pacífico',en:'Pacific Treasure Chest',kind:'chest'}
];
for(const [id,land] of Object.entries({coveBalloon:'crystalCove',islet:'islet',mila:'wilds',ollie:'sunset',luna:'crystalCove',garden:'islet'})){const p=explorePlaces.find(p=>p.id===id);Object.assign(p,islandPoint(land,p.x,p.z));}
export const exploreItems=[
 ...worldIslands.slice(1).filter(p=>p.id!=='pizzaCity').flatMap((p,j)=>Array.from({length:5},(_,i)=>{
   const angle=(j*5+i)*2.399963229728653,rad=.30+.095*(i%4);
   return {id:'wildGem'+j+'-'+i,x:p.x+Math.cos(angle)*p.rx*rad,z:p.z+Math.sin(angle)*p.rz*rad,
    kind:'islandTreasure',es:'gema de la isla',en:'island gem'};
  })),
 ...Array.from({length:5},(_,i)=>{
  const p=worldIslands.find(land=>land.id==='islet'),a=i*2.399963229728653;
  return {id:'wildGem4-'+i,x:p.x+Math.cos(a)*p.rx*.39,z:p.z+Math.sin(a)*p.rz*.39,
   kind:'islandTreasure',es:'gema de Venus',en:'Venus gem'};
 }),
 ...[[32,100],[-12,100],[10,118],[10,82]].map(([x,z],i)=>({id:'sea'+i,x,z,kind:'seaTreasure',es:'tesoro del arrecife de Neptune',en:'Neptune reef treasure'})),
 ...[[-7,-33],[-3,-35],[3,-35],[7,-33],[0,-38]].map(([x,z],i)=>({id:'fruit'+i,x,z,kind:'fruit',tile:7,es:'plátanos',en:'bananas'})),
 ...[[-48,4],[-45,1],[-39,2],[-36,5],[-49,8]].map(([x,z],i)=>({id:'glow'+i,x,z,kind:'glow',es:'luciérnaga',en:'firefly'})),
 ...[[2,11],[-3,11],[-9,9],[-15,5],[-17,0],[-14,-7],[-7,-11],[2,-11],[10,-9],[15,-4],[17,2],[14,8]].map(([x,z],i)=>({id:'shell'+i,x,z,kind:'shell',es:'concha',en:'shell'}))
];
for(const p of exploreItems){const land={fruit:'wilds',glow:'sunset'}[p.kind];if(land)Object.assign(p,islandPoint(land,p.x,p.z));}
export function normalizeStory(raw){return Object.fromEntries(Object.entries({shells:3,picnic:4,seed:3,song:4,care:2,light:4}).map(([id,length])=>[id,Number.isInteger(raw?.[id])?Math.max(0,Math.min(length,raw[id])):0]));}
export function freshExplore(){return {wishes:normalizeWishes(null),estate:normalizeEstate(null),inventoryVersion:1,foodTotal:{banana:0,coconut:0},worldVersion:3,realms:{found:[],turtle:0,bird:0},journey:{visited:[],meals:0,swim:0,fly:0,rings:[]},x:4,z:10,dayTime:40,story:normalizeStory(null),collected:[],badges:[],hat:0,pet:false,flowers:0,catches:0,pops:0,flight:7,growth:1,food:{coconut:0,banana:0},harvested:{},boat:{x:6.5,z:16,heading:0},regionalProjects:{helped:[]},craft:{built:[],spent:{}},city:{bags:[],pizzas:0,car:{x:-106,z:-74,heading:0},activities:{deliveries:[],deliveryActive:false,rallyBest:0,rallyWins:0,soccerGoals:0,soccerShots:0,marketTrades:0,muralColors:0,museum:[],carWashes:0}},friends:{visits:[],completed:[],companion:null}};}
export function normalizeExplore(raw){const s=freshExplore();if(!raw||typeof raw!=='object')return s;s.wishes=normalizeWishes(raw.wishes);const rr=raw.realms||{};s.realms={found:[...new Set((Array.isArray(rr.found)?rr.found:[]).filter(id=>/^(reef-[0-5]|pearl-[0-4]|wind-[0-4]|star-[0-4]|seaChest-0|skyLight-0)$/.test(id)))],turtle:Math.max(0,Math.min(5,Math.floor(Number(rr.turtle)||0))),bird:Math.max(0,Math.min(4,Math.floor(Number(rr.bird)||0)))};const j=raw.journey||{};s.journey={visited:[...new Set((Array.isArray(j.visited)?j.visited:[]).filter(id=>worldIslands.some(p=>p.id===id)))],meals:Math.max(0,Math.min(999,Number(j.meals)||0)),swim:Math.max(0,Math.min(100000,Number(j.swim)||0)),fly:Math.max(0,Math.min(100000,Number(j.fly)||0)),rings:[...new Set((Array.isArray(j.rings)?j.rings:[]).filter(id=>/^(swim|fly)-[0-9]+$/.test(id)))]};// Preserve friendship, a chosen companion, and first-time play rewards across saves.
const FRIEND_IDS=['pip','dori','mila','ollie','luna','kai'],savedFriends=raw.friends||{};
s.friends={
 visits:[...new Set((Array.isArray(savedFriends.visits)?savedFriends.visits:[]).filter(id=>FRIEND_IDS.includes(id)))],
 completed:[...new Set((Array.isArray(savedFriends.completed)?savedFriends.completed:[]).filter(id=>FRIEND_IDS.includes(id)))],
 companion:FRIEND_IDS.includes(savedFriends.companion)?savedFriends.companion:null
};
const savedCity=raw.city||{},car=savedCity.car||{},withinCity=(x,z)=>Number.isFinite(x)&&Number.isFinite(z)&&Math.hypot((x+100)/58,(z+74)/48)<.86;
s.city={bags:[...new Set((Array.isArray(savedCity.bags)?savedCity.bags:[]).filter(id=>/^bag-(?:[0-9]|1[0-9]|2[0-3])$/.test(id)))],
 pizzas:Math.max(0,Math.min(999,Math.floor(Number(savedCity.pizzas)||0))),
 car:withinCity(car.x,car.z)?{x:car.x,z:car.z,heading:Number.isFinite(car.heading)?car.heading:0}:{x:-106,z:-74,heading:0},
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
s.regionalProjects={helped:[...new Set((Array.isArray(raw.regionalProjects?.helped)?raw.regionalProjects.helped:[]).filter(id=>['home','islet','wilds','coconutCoast','sunset','crystalCove','pizzaCity'].includes(id)))]};
const savedCraft=raw.craft||{},allowedResource=['shell','fruit','glow','islandTreasure','seaTreasure','moneyBag'];
s.craft={built:[...new Set((Array.isArray(savedCraft.built)?savedCraft.built:[]).filter(id=>['sandcastle','butterflyGarden','treehouse','beachCabana','volcanoCamp','coralNursery','pizzaStand'].includes(id)))],
 spent:Object.fromEntries(allowedResource.map(kind=>[kind,Math.max(0,Math.min(999,Math.floor(Number(savedCraft.spent?.[kind])||0)))]))};
s.dayTime=Number.isFinite(raw.dayTime)?((raw.dayTime%240)+240)%240:40;s.story=normalizeStory(raw.story);const ids=new Set(exploreItems.map(x=>x.id));s.collected=[...new Set(Array.isArray(raw.collected)?raw.collected.filter(x=>ids.has(x)):[])];s.badges=[...new Set(Array.isArray(raw.badges)?raw.badges.filter(x=>['picnic','glow','song','garden','treasure','beacon','balloon','boat','volcano-summit'].includes(x)):[])];if(Number.isFinite(raw.x)&&Number.isFinite(raw.z)&&(raw.x/200)**2+(raw.z/175)**2<=1){
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
}s.hat=Number.isInteger(raw.hat)?Math.max(0,Math.min(6,raw.hat)):0;s.pet=raw.pet===true;s.flowers=Math.max(0,Math.min(6,Math.floor(Number(raw.flowers)||0)));for(const k of ['catches','pops'])s[k]=Math.max(0,Math.min(9999,Math.floor(Number(raw[k])||0)));s.growth=Number.isFinite(raw.growth)?Math.max(1,Math.min(6,raw.growth)):1;s.flight=Number.isFinite(raw.flight)?Math.max(0,Math.min(80,raw.flight)):0;for(const kind of ['coconut','banana'])s.food[kind]=Math.min(9999,inventoryCount(raw.food?.[kind]));for(const [id,n] of Object.entries(raw.harvested||{})){if(/^(coconut|banana)\d+$/.test(id))s.harvested[id]=Math.max(0,Math.min(6,Math.floor(Number(n)||0)));}if(Number.isFinite(raw.boat?.x)&&Number.isFinite(raw.boat?.z)&&Math.hypot(raw.boat.x/200,raw.boat.z/175)<1&&inWater(raw.boat.x,raw.boat.z)){s.boat={x:raw.boat.x,z:raw.boat.z,heading:Number.isFinite(raw.boat.heading)?raw.boat.heading:0};}Object.assign(s.boat,recoverBoat(s.boat.x,s.boat.z));
// Legacy ground bananas and tree/reward food were independent stocks. Merge only
// the unspent ground stock once; collected IDs remain discovery history.
if(raw.inventoryVersion!==1)s.food.banana+=Math.max(0,countExplore(s,'fruit')-s.craft.spent.fruit);
for(const kind of ['banana','coconut'])s.foodTotal[kind]=Math.max(s.food[kind]+(kind==='banana'?s.craft.spent.fruit:0),raw.inventoryVersion===1?inventoryCount(raw.foodTotal?.[kind]):0);
s.estate=normalizeEstate(raw.estate,s.collected.filter(id=>['islandTreasure','seaTreasure','glow'].includes(exploreItems.find(item=>item.id===id)?.kind)).length);
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
export function walkable(x,z){return (isletHeight(x,z)>0||(x/18.7)**2+(z/12.5)**2<=1)&&worldObstacles.every(([a,b,r])=>Math.hypot(x-a,z-b)>r+.3);}
// Match the sculpted shoreline; the wider lagoon is navigable, but buildings stay solid.
export function onDock(x,z){return x>=3&&x<=5&&z>=11.8&&z<=17.4;}
export function inWater(x,z){if(onDock(x,z)||isletHeight(x,z)>0)return false;const a=Math.atan2(z/14,x/20),shore=1+.035*Math.sin(a*7)+.03*Math.cos(a*5);return Math.hypot(x/20,z/14)>shore;}
// Keep the hull clear, including saved boats that overlap a shore or world boundary.
export function boatClear(x,z){if(Math.hypot(x/199,z/174)>=1||!inWater(x,z))return false;for(let i=0;i<8;i++){const a=i*Math.PI/4;if(!inWater(x+Math.sin(a)*1.1,z+Math.cos(a)*1.1))return false;}return true;}
export function recoverBoat(x,z){if(boatClear(x,z))return {x,z};for(let r=.15;r<=6;r+=.15)for(let i=0;i<32;i++){const a=i*Math.PI/16,nx=x+Math.sin(a)*r,nz=z+Math.cos(a)*r;if(boatClear(nx,nz))return {x:nx,z:nz};}return {x:6.5,z:16};}
export function boatStep(x,z,dx,dz){const start=recoverBoat(x,z);x=start.x;z=start.z;const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.15));dx/=steps;dz/=steps;
 for(let i=0;i<steps;i++){const candidates=[[dx,dz],...(Math.abs(dx)>=Math.abs(dz)?[[dx,0],[0,dz]]:[[0,dz],[dx,0]])];for(const a of [Math.PI/6,-Math.PI/6,Math.PI/3,-Math.PI/3,Math.PI/2,-Math.PI/2])candidates.push([dx*Math.cos(a)-dz*Math.sin(a),dx*Math.sin(a)+dz*Math.cos(a)]);for(const [mx,mz] of candidates){if(Math.hypot(mx,mz)>.00001&&boatClear(x+mx,z+mz)){x+=mx;z+=mz;break;}}}return {x,z};}
// Sharks steer around shores with clearance for their whole body, not just their center.
export function sharkClearance(x,z){let wet=inWater(x,z)?1:0;for(let i=0;i<12;i++){const a=i*Math.PI/6;if(inWater(x+Math.sin(a)*1.4,z+Math.cos(a)*1.4))wet++;}return wet;}
export function sharkStep(x,z,tx,tz,dt,speed,side=1){
 const distance=Math.hypot(tx-x,tz-z),step=Math.min(Math.max(0,dt)*speed,distance);if(step===0)return {x,z};
 const heading=Math.atan2(tx-x,tz-z),current=sharkClearance(x,z);let escape=null,best=-Infinity;
 for(let i=0;i<=12;i++)for(const sign of i===0?[1]:[side,-side]){const a=heading+i*Math.PI/12*sign,dx=Math.sin(a),dz=Math.cos(a),nx=x+dx*step,nz=z+dz*step;if(!inWater(nx,nz))continue;const clearance=sharkClearance(nx,nz),ahead=sharkClearance(x+dx*1.7,z+dz*1.7);
  if(clearance===13&&ahead===13)return {x:nx,z:nz};
  // Recover smoothly if an older position is already too close to a beach.
  const score=clearance*100+ahead-i*.01;if(clearance>=current&&score>best){escape={x:nx,z:nz};best=score;}
 }
 return escape||{x,z};
}
export function traversable(x,z){return Math.hypot(x/200,z/175)<=1&&worldObstacles.every(([a,b,r])=>Math.hypot(x-a,z-b)>r+.3);}
export function islandPath(from,to){
 if(!remoteAccess(from,to))return [];
 const ocean=Math.abs(from.x)>18||Math.abs(to.x)>18||Math.abs(from.z)>12||Math.abs(to.z)>12||!walkable(from.x,from.z)||!walkable(to.x,to.z),allowed=ocean?traversable:walkable;
 const minX=ocean?Math.max(-200,Math.floor(Math.min(from.x,to.x))-5):-18,maxX=ocean?Math.min(200,Math.ceil(Math.max(from.x,to.x))+5):18,minZ=ocean?Math.max(-175,Math.floor(Math.min(from.z,to.z))-5):-12,maxZ=ocean?Math.min(175,Math.ceil(Math.max(from.z,to.z))+5):12;
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
export function coinValue(id){if(/^wish-(shells|picnic|seed|song|care|light)$/.test(id))return 25;if(/^region-help-(home|islet|wilds|coconutCoast|sunset|crystalCove|pizzaCity)$/.test(id))return 25;
 if(/^city-(?:rally|soccer|mural|carwash|plaza|canal|delivery-finish)$/.test(id))return 12;
 if(/^city-delivery-[0-2]$/.test(id))return 7;
 if(/^city-market-[1-3]$/.test(id))return 5;
 if(/^city-museum-[0-2]$/.test(id))return 6;
 if(/^craft-build-(sandcastle|butterflyGarden|treehouse|beachCabana|volcanoCamp|coralNursery|pizzaStand)$/.test(id))return 10;if(/^craft-use-(sandcastle|butterflyGarden|treehouse|beachCabana|volcanoCamp|coralNursery|pizzaStand)$/.test(id))return 3;if(/^city-bag-(?:[0-9]|1[0-9]|2[0-3])$/.test(id))return 5;if(id==='city-pizza')return 3;if(/^friend-(pip|dori|mila|ollie|luna|kai)$/.test(id))return 12;if(/^realm-(islands|water|sky)$/.test(id))return 20;if(/^realm-(visit|fruit|butterfly|friends|reef|pearls|turtle|seaChest|wind|stars|bird|skyLight)$/.test(id))return 10;if(/^journey-(explore|food|learn|swim|fly)$/.test(id))return 20;if(/^ring-(swim|fly)-([0-9]|1[0-9])$/.test(id))return 2;if(/^story-(shells|picnic|seed|song|care|light)$/.test(id))return 10;if(/^(harbor|market|jungle|music|garden|summit)-[0-7]$/.test(id))return 10;if(/^flower-[1-6]$/.test(id))return 2;if(['picnic','glow','song'].includes(id))return 15;if(id==='beacon')return 25;if(id==='pet')return 3;if(exploreItems.some(i=>i.id===id))return 1;return 0;}
export function normalizeWallet(raw){const rewards=[...new Set(Array.isArray(raw?.rewards)?raw.rewards.filter(id=>typeof id==='string'&&coinValue(id)>0):[])];let balance=rewards.reduce((n,id)=>n+coinValue(id),0);const items=[];for(const id of Array.isArray(raw?.items)?raw.items:[]){const item=islandShop.find(x=>x.id===id);if(item&&!items.includes(id)&&balance>=item.cost){items.push(id);balance-=item.cost;}}return {rewards,items};}
export function coinBalance(state){const w=state.wallet||{rewards:[],items:[]};return w.rewards.reduce((n,id)=>n+coinValue(id),0)-w.items.reduce((n,id)=>n+(islandShop.find(x=>x.id===id)?.cost||0),0)-estateCoinCost(state.world);}
export function earnCoins(state,id){state.wallet??=normalizeWallet(null);const amount=coinValue(id);if(!amount||state.wallet.rewards.includes(id))return 0;state.wallet.rewards.push(id);return amount;}
export function syncWallet(state){state.wallet=normalizeWallet(state.wallet);for(const id of state.world?.wishes?.granted||[])earnCoins(state,'wish-'+id);for(const id of Object.keys({...state.completed,...state.islandLessons?.completed}))earnCoins(state,id);for(let i=1;i<=(state.world?.flowers||0);i++)earnCoins(state,'flower-'+i);for(const id of state.world?.badges||[])earnCoins(state,id);for(const id of state.world?.collected||[])earnCoins(state,id);for(const id of state.world?.city?.bags||[])earnCoins(state,'city-'+id);if(state.world?.city?.pizzas)earnCoins(state,'city-pizza');if(state.world?.pet)earnCoins(state,'pet');for(const id of state.world?.friends?.completed||[])earnCoins(state,'friend-'+id);for(const [id,n] of Object.entries(state.world?.story||{})){if(n>=({shells:3,picnic:4,seed:3,song:4,care:2,light:4})[id])earnCoins(state,"story-"+id);}return state.wallet;}
export function buyIslandItem(state,id){const item=islandShop.find(x=>x.id===id);if(!item)return false;state.wallet??=normalizeWallet(null);if(state.wallet.items.includes(id)){state.world.hat=item.hat;return true;}if(coinBalance(state)<item.cost)return false;state.wallet.items.push(id);state.world.hat=item.hat;return true;}

// Patrol navigation runs on simulation time, independently of decorative motion.
export function recoverShark(x,z){if(sharkClearance(x,z)===13)return {x,z};for(let r=.4;r<=12;r+=.4)for(let i=0;i<24;i++){const a=i*Math.PI/12,nx=x+Math.sin(a)*r,nz=z+Math.cos(a)*r;if(sharkClearance(nx,nz)===13)return {x:nx,z:nz};}return {x:25,z:0};}
export function sharkPatrol(p,dt,target=null){
 if(dt<=0)return {x:p.x,z:p.z};
 if(!inWater(p.x,p.z))Object.assign(p,recoverShark(p.x,p.z));
 p.waypoint??=0;p.watch??=0;p.anchor??={x:p.x,z:p.z};
 function destination(){const cx=p.cx||0,cz=p.cz||0,rx=p.rx||32,rz=p.rz||26;for(let i=0;i<24;i++){const a=p.waypoint/24*Math.PI*2,x=cx+Math.cos(a)*rx,z=cz+Math.sin(a)*rz;if(sharkClearance(x,z)===13)return {x,z};p.waypoint=(p.waypoint+(p.direction||1)+24)%24;}return recoverShark(cx+rx,cz);}
 let dest=target||destination();if(!target&&Math.hypot(dest.x-p.x,dest.z-p.z)<2){p.waypoint=(p.waypoint+(p.direction||1)+24)%24;dest=destination();}
 const next=sharkStep(p.x,p.z,dest.x,dest.z,Math.min(dt,.05),target?12:5,p.side||1);p.watch+=dt;
 if(p.watch>=2){if(Math.hypot(next.x-p.anchor.x,next.z-p.anchor.z)<1.2){p.waypoint=(p.waypoint+6)%24;p.side=-(p.side||1);p.detour=4;}p.watch=0;p.anchor={...next};}
 return next;
}

import {WORLD_BOUNDS} from './geography.js';
// Panamá Aventura: visible home-building progression. Keep the original seven
// workshops and treasure histories for existing saves and regional missions.
export const ESTATE_PLANS=[
 {type:'cottage',icon:'🏡',es:'Mi primera casita',en:'My first home',banana:1,coconut:1,coins:0,charms:0,unlock:0,radius:2.8},
 {type:'market',icon:'🏪',es:'Mercado tropical',en:'Tropical market',banana:2,coconut:2,coins:8,charms:0,unlock:0,radius:3.4},
 {type:'villa',icon:'🏠',es:'Villa frente al mar',en:'Beachfront villa',banana:3,coconut:2,coins:18,charms:1,unlock:1,radius:4.4},
 {type:'castle',icon:'🏰',es:'Castillo de mis sueños',en:'My dream castle',banana:4,coconut:3,coins:30,charms:2,unlock:2,radius:6.8}
];
const byType=type=>ESTATE_PLANS.find(p=>p.type===type);
const count=n=>Number.isFinite(Number(n))?Math.max(0,Math.min(9999,Math.floor(Number(n)))):0;
export function normalizeEstate(raw,legacyCharms=0){
 const buildings=[],ids=new Set();
 for(const b of Array.isArray(raw?.buildings)?raw.buildings:[]){
  const p=byType(b?.type);
  if(!p||!Number.isInteger(b?.id)||b.id<0||!Number.isFinite(b.x)||!Number.isFinite(b.z)||Math.hypot(b.x/WORLD_BOUNDS.x,b.z/WORLD_BOUNDS.z)>1||ids.has(b.id)||buildings.length>=32)continue;
  ids.add(b.id);buildings.push({id:b.id,type:p.type,x:b.x,z:b.z,coins:p.coins,level:Math.max(1,Math.min(3,Math.floor(Number(b.level)||1)))});
 }
 return {buildings,charsVersion:1,charms:raw?.charsVersion===1?count(raw.charms):count(legacyCharms),nextId:Math.max(0,...buildings.map(b=>b.id+1),count(raw?.nextId))};
}
export function estateCoinCost(world){
 return (world?.estate?.buildings||[]).reduce((sum,b)=>sum+(byType(b.type)?.coins||0)+(b.level>=2?10:0)+(b.level>=3?20:0),0);
}
export function findEstateSite(world,type,position,{canStand,height}){
 const plan=byType(type);
 if(!plan||!position||!canStand||!height)return null;
 const other=world.estate?.buildings||[];
 // Search counter-clockwise around Angelique, near but not over her character.
 // Building footprints must stay apart and avoid steep cliffs or ocean.
 for(const radius of [plan.radius+2.8,plan.radius+5,plan.radius+8,plan.radius+12]){
  for(let i=0;i<16;i++){
   const a=-Math.PI/2+(i/16)*Math.PI*2; // try the visible area in front of the camera first
   const x=position.x+Math.cos(a)*radius,z=position.z+Math.sin(a)*radius;
   if(!canStand(x,z))continue;
   let flat=true;const h=height(x,z);
   for(let k=0;k<8;k++){const d=k/8*Math.PI*2,px=x+Math.cos(d)*plan.radius*.85,pz=z+Math.sin(d)*plan.radius*.85;
    if(!canStand(px,pz)||Math.abs(height(px,pz)-h)>1.65){flat=false;break;}
   }
   if(!flat||other.some(b=>Math.hypot(b.x-x,b.z-z)<plan.radius+(byType(b.type)?.radius||3)+1.8))continue;
   return {x,z};
  }
 }
 return null;
}
// One free starter home lets a new player BUILD immediately. This is a
// one-time tutorial reward, not an unlimited free property exploit.
export function estateCosts(world,type){
 const p=byType(type);
 if(!p)return null;
 if(world.adminMode)return {banana:0,coconut:0,coins:0,charms:0,starter:false};
 if(type==='cottage'&&!world?.estate?.buildings?.length)return {banana:0,coconut:0,coins:0,charms:0,starter:true};
 return {banana:p.banana,coconut:p.coconut,coins:p.coins,charms:p.charms,starter:false};
}
export function estateMissing(world,type,coins){
 const cost=estateCosts(world,type),have=world?.estate;
 if(!cost||!have)return null;
 return {
  banana:Math.max(0,cost.banana-(world.food?.banana||0)),
  coconut:Math.max(0,cost.coconut-(world.food?.coconut||0)),
  coins:Math.max(0,cost.coins-(coins||0)),
  charms:Math.max(0,cost.charms-have.charms),
  unlock:world.adminMode?0:Math.max(0,(byType(type)?.unlock||0)-(have.buildings?.length||0)),
  cap:(have.buildings?.length||0)>=32
 };
}
export function canBuildEstate(world,type,coins){
 const cost=estateCosts(world,type),lack=estateMissing(world,type,coins);
 return !!cost&&!!lack&&!lack.cap&&!Object.values(lack).some(Boolean);
}
export function buildEstate(world,type,coins,site){
 const p=byType(type),e=world.estate;
 if(!site||!Number.isFinite(site.x)||!Number.isFinite(site.z)||!canBuildEstate(world,type,coins))return null;
 // This is one synchronous transaction: check every input before debiting.
 const cost=estateCosts(world,type);
 world.food.banana-=cost.banana;world.food.coconut-=cost.coconut;e.charms-=cost.charms;
 const entry={id:e.nextId++,type:p.type,x:site.x,z:site.z,coins:p.coins,level:1};
 e.buildings.push(entry);return entry;
}
export function canUpgradeEstate(world,id,coins){
 const b=world.estate?.buildings?.find(b=>b.id===id);
 if(!b||b.level>=3)return false;if(world.adminMode)return true;
 const banana=b.level===1?1:2,coconut=b.level===1?1:2,cost=b.level===1?10:20,charm=b.level===1?0:1;
 return (world.food?.banana||0)>=banana&&(world.food?.coconut||0)>=coconut&&world.estate.charms>=charm&&coins>=cost;
}
export function upgradeEstate(world,id,coins){
 if(!canUpgradeEstate(world,id,coins))return false;
 const b=world.estate.buildings.find(b=>b.id===id),old=b.level;
 if(world.adminMode){b.level++;return true;}
 world.food.banana-=old===1?1:2;world.food.coconut-=old===1?1:2;
 world.estate.charms-=old===1?0:1;b.level++;return true;
}
export function estateBlocked(world,x,z){
 return (world.estate?.buildings||[]).some(b=>Math.hypot(b.x-x,b.z-z)<(byType(b.type)?.radius||3)*.75*(1+(b.level-1)*.16));
}
export function createEstateWorld({T,scene,state,make,mat,geometry,ball,box,cylinder,cone,height,spark,refresh,save,joy,tell}){
 const group=new T.Group();group.name='Persistent Panama estate';scene.add(group);
 const stone=mat('#d8cbaf',{roughness:.96}),stoneDark=mat('#8b978d'),wood=mat('#86654a'),
 plaster=mat('#f8efd8'),blue=mat('#78bacc',{metalness:.12,roughness:.44}),glass=mat('#bfe5ef',{metalness:.18,roughness:.25}),
 green=mat('#4d9971'),darkGreen=mat('#276e5c'),roof=mat('#c56857'),gold=mat('#f8d87e',{metalness:.25,roughness:.4}),
 brown=mat('#745c48'),sand=mat('#ebcf9a'),white=mat('#fffbea');
 const visuals=new Map(),aging=new Map();
 const add=(root,g,m,x,y,z,w,h,d)=>make(g,m,x,y,z,w,h,d,root);
 function create(b,animated=false){
  const plan=byType(b.type);if(!plan)return;
  const root=new T.Group();root.name='Estate '+plan.en+' #'+b.id;
  root.position.set(b.x,height(b.x,b.z)+.05,b.z);group.add(root);
  function block(m,x,y,z,w,h,d){return add(root,box,m,x,y,z,w,h,d);}
  function round(m,x,y,z,w,h,d){return add(root,cylinder,m,x,y,z,w,h,d);}
  function sphere(m,x,y,z,w,h,d){return add(root,ball,m,x,y,z,w,h,d);}
  function pointed(m,x,y,z,w,h,d){return add(root,cone,m,x,y,z,w,h,d);}
  // A planted foundation makes progress visible even on rough terrain.
  round(b.type==='castle'?stoneDark:sand,0,.1,0,plan.radius*1.0,.20,plan.radius*1.0);
  if(b.type==='cottage'){
   block(plaster,0,1.35,0,4,2.5,3.2);pointed(roof,0,3.35,0,3.25,1.65,2.8);
   block(wood,0,.91,1.66,.85,1.75,.12);for(const x of [-1.25,1.25]){block(glass,x,1.65,1.66,.8,.76,.1);block(wood,x,1.65,1.75,.1,.84,.10);}
   block(wood,0,.23,2.1,4,.35,1.45);sphere(green,-2.4,1.05,-.6,.8,1.15,.75);sphere(green,2.4,1.05,-.6,.8,1.15,.75);
  }else if(b.type==='market'){
   for(const x of [-2,2])for(const z of [-1.65,1.65])round(wood,x,1.45,z,.15,2.9,.15);
   block(sand,0,2.9,0,4.7,.26,3.9);for(let i=-2;i<=2;i++)block(i%2?white:roof,i*.87,3.08,0,.87,.08,3.9);
   block(wood,0,1.0,1.22,3.65,1.4,.8);block(gold,0,1.75,1.75,2.4,.18,.45);
   for(let i=0;i<5;i++)sphere(i%2?green:gold,-1.45+i*.75,1.83,1.68,.26,.25,.27);
   block(roof,0,3.73,0,2,.62,.14);
  }else if(b.type==='villa'){
   block(plaster,0,1.45,0,6.8,2.8,5.1);block(white,-.8,3.5,-.6,4.9,2.2,4.3);
   block(roof,-.8,4.72,-.6,5.35,.35,4.6);block(wood,0,.4,3.2,7.4,.65,1.7);
   for(const x of [-2.2,0,2.2]){block(glass,x,1.7,2.6,1.3,1.3,.13);block(wood,x,1.7,2.68,.09,1.45,.14);}
   for(const x of [-2.2,.7])block(glass,x,3.43,1.61,1.6,1.28,.13);
   block(blue,2.7,.18,6,3.7,.13,3.1);block(stone,2.7,.11,6.1,4.1,.12,3.5);
   for(const x of [-4,4]){round(wood,x,1.2,-1.5,.25,2.4,.25);sphere(green,x,2.9,-1.5,1.25,.65,1.2);}
  }else if(b.type==='castle'){
   block(stone,0,2.2,0,10.8,4.4,9.7);block(stoneDark,0,4.2,0,11.2,.55,10.2);
   // Four towers and battlements create an unmistakable large landmark.
   for(const x of [-5.3,5.3])for(const z of [-4.6,4.6]){
    round(stoneDark,x,3.1,z,1.5,6.2,1.5);pointed(roof,x,7.4,z,1.9,2.3,1.9);
    sphere(gold,x,8.67,z,.28,.34,.28);
   }
   for(let i=-4;i<=4;i++){block(stone,i*1.18,4.72,4.9,.76,.88,.85);block(stone,i*1.18,4.72,-4.9,.76,.88,.85);}
   for(let i=-3;i<=3;i++){block(stone,5.4,4.72,i*1.25,.8,.85,.72);block(stone,-5.4,4.72,i*1.25,.8,.85,.72);}
   round(wood,0,1.15,4.93,1.1,2.3,.16);sphere(gold,0,3.75,5.03,.9,.92,.12);
   for(const x of [-3.2,3.2])for(const y of [2.1,3.6])block(glass,x,y,4.92,.7,.95,.16);
   round(brown,0,7.15,0,.12,2.6,.12);block(roof,.57,7.7,0,1.2,.65,.16);
  }
  if(animated){root.scale.setScalar(.06);aging.set(b.id,{time:0,from:.06});}else root.scale.setScalar(1+(b.level-1)*.16);
  visuals.set(b.id,root);
 }
 for(const b of state.world.estate.buildings)create(b);
 return {
  add(entry){create(entry,true);spark?.(entry.x,entry.z,30);joy?.effect?.('finish');save();refresh();},
  upgrade(id){const b=state.world.estate.buildings.find(b=>b.id===id);if(!b)return;const root=visuals.get(id);if(!root)return;aging.set(id,{time:0,from:root.scale.x});spark?.(b.x,b.z,25);joy?.effect?.('finish');save();refresh();},
  nearest(x,z){return state.world.estate.buildings.find(b=>Math.hypot(x-b.x,z-b.z)<(byType(b.type)?.radius||3)+1.8)||null;},
  update(dt){for(const [id,animation]of aging){const b=state.world.estate.buildings.find(b=>b.id===id);if(!b){aging.delete(id);continue;}const next=Math.min(1,animation.time+Math.max(0,dt)*.85),ease=1-Math.pow(1-next,3),target=1+(b.level-1)*.16;visuals.get(id)?.scale.setScalar(animation.from+(target-animation.from)*ease);if(next>=1)aging.delete(id);else aging.set(id,{time:next,from:animation.from});}},
  dispose(){scene.remove(group);aging.clear();visuals.clear();}
 };
}


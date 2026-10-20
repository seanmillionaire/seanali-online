// Isla Aventura: collectible inventory -> visible, persistent structures.
// All meshes are procedural and reuse the game's existing Three.js materials.
import {worldIslands,volcanoTrailPoint,exploreItems,earnCoins,spendFood} from './explore-state.js?v=188';
const at=(id)=>worldIslands.find(p=>p.id===id);
export const RESOURCE_INFO={
 shell:{icon:'🐚',es:'Conchas',en:'Shells'},fruit:{icon:'🍌',es:'Plátanos',en:'Bananas'},
 glow:{icon:'✨',es:'Luciérnagas',en:'Fireflies'},
 islandTreasure:{icon:'💎',es:'Gemas',en:'Gems'},
 seaTreasure:{icon:'🪸',es:'Tesoros del arrecife',en:'Reef treasures'},
 moneyBag:{icon:'💰',es:'Bolsas de dinero',en:'Money bags'}
};
export const BUILD_RECIPES=[
 {id:'sandcastle',island:'home',x:-7,z:-8,icon:'🏰',es:'Castillo de arena',en:'Sandcastle',need:{shell:3},actionEs:'Decorar el castillo',actionEn:'Decorate the castle'},
 {id:'butterflyGarden',island:'islet',x:at('islet').x-4,z:at('islet').z+3,icon:'🦋',es:'Jardín de mariposas',en:'Butterfly garden',need:{shell:2,islandTreasure:1},actionEs:'Soltar mariposas',actionEn:'Release butterflies'},
 {id:'treehouse',island:'wilds',x:at('wilds').x-6,z:at('wilds').z+4,icon:'🌳',es:'Casita en el árbol',en:'Treehouse',need:{fruit:2,islandTreasure:2},actionEs:'Tocar la campana',actionEn:'Ring the treehouse bell'},
 {id:'beachCabana',island:'coconutCoast',x:at('coconutCoast').x+4,z:at('coconutCoast').z+2,icon:'⛱️',es:'Cabaña de playa',en:'Beach cabana',need:{shell:3,islandTreasure:2},actionEs:'Descansar en la hamaca',actionEn:'Relax in the hammock'},
 {id:'volcanoCamp',island:'sunset',x:volcanoTrailPoint(.16).x,z:volcanoTrailPoint(.16).z,icon:'🏕️',es:'Campamento del volcán',en:'Volcano campsite',need:{glow:2,islandTreasure:2},actionEs:'Encender la fogata',actionEn:'Light the campfire'},
 {id:'coralNursery',island:'crystalCove',x:at('crystalCove').x-4,z:at('crystalCove').z-2,icon:'🪸',es:'Vivero de coral',en:'Coral nursery',need:{seaTreasure:2,islandTreasure:2},actionEs:'Cuidar los corales',actionEn:'Care for the coral'},
 {id:'pizzaStand',island:'pizzaCity',x:at('pizzaCity').x+18,z:at('pizzaCity').z+6,icon:'🍕',es:'Puesto de pizza',en:'Pizza stand',need:{moneyBag:2,islandTreasure:2,fruit:1},actionEs:'Preparar una pizza',actionEn:'Make a pizza'}
];
export function craftInventory(world){
 const collected=[...new Set(world.collected||[])],spent=world.craft?.spent||{};
 const total=Object.fromEntries(Object.keys(RESOURCE_INFO).map(k=>[k,k==='fruit'?(world.foodTotal?.banana??world.food?.banana??0):k==='moneyBag'?new Set(world.city?.bags||[]).size:collected.filter(id=>exploreItems.some(item=>item.id===id&&item.kind===k)).length]));
 const available=Object.fromEntries(Object.keys(total).map(k=>[k,Math.max(0,total[k]-(spent[k]||0))]));
 available.fruit=world.food?.banana||0;
 return {total,spent:{...spent,fruit:Math.max(0,total.fruit-available.fruit)},available};
}
export function craftAtSite(world,id,x,z,maxDistance=5){
 const r=BUILD_RECIPES.find(item=>item.id===id);
 return !!r&&Math.hypot(x-r.x,z-r.z)<=maxDistance&&
    (r.island==='home'||worldIslands.some(land=>land.id===r.island&&Math.hypot((x-land.x)/land.rx,(z-land.z)/land.rz)<1));
}
export function canCraft(world,id){
 const r=BUILD_RECIPES.find(item=>item.id===id);if(!r||world.craft?.built?.includes(id))return false;
 const inv=craftInventory(world);
 return Object.entries(r.need).every(([kind,count])=>(inv.available[kind]||0)>=count);
}
export function commitCraft(world,id,x,z){
 if(!craftAtSite(world,id,x,z)||!canCraft(world,id))return false;
 world.craft??={built:[],spent:{}};
 const r=BUILD_RECIPES.find(item=>item.id===id);
 if(r.need.fruit&&!spendFood(world,'banana',r.need.fruit))return false;
 for(const [kind,n]of Object.entries(r.need))world.craft.spent[kind]=(world.craft.spent[kind]||0)+n;
 world.craft.built.push(id);
 return true;
}
export function createIslandWorkshop({T,scene,state,make,mat,geometry,ball,box,cylinder,cone,height,joy,save,refresh,tell,spark,motion=()=>true}){
 const s=state.world,es=state.lang==='es';
 const group=new T.Group();group.name='Angelique island workshops';scene.add(group);
 const plank=mat('#916e4e',{roughness:.95}),wood=mat('#705840',{roughness:.9}),
  sand=mat('#edd7a6',{roughness:1}),grass=mat('#8eba83',{roughness:.95}),
  red=mat('#df7a76'),pink=mat('#eeb1cb'),blue=mat('#78bdd2'),
  leaf=mat('#66a47a'),purple=mat('#9976a2'),gold=mat('#ffe49e',{emissive:'#f3ba64',emissiveIntensity:.25}),
  white=mat('#f8f1d9'),stone=mat('#8d8583',{roughness:.97});
 const objects=new Map(),bills=[];
 const put=(geo,m,x,y,z,a,b,c,p)=>make(geo,m,x,y,z,a,b,c,p);
 function icon3D(parent,emoji,x,y,z,size=2){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
  const context=canvas.getContext('2d');
  if(!context)return;
  context.clearRect(0,0,128,128);context.font='100px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
  context.textAlign='center';context.textBaseline='middle';context.fillText(emoji,64,64);
  const tex=new T.CanvasTexture(canvas);
  const material=new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false,depthTest:false});
  const spr=new T.Sprite(material);spr.position.set(x,y,z);spr.scale.set(size,size,1);parent.add(spr);
  bills.push({tex,material});return spr;
 }
 function prop(kind,root){
  const create=(geo,m,x,y,z,a,b,c)=>put(geo,m,x,y,z,a,b,c,root);
  if(kind==='sandcastle'){
   create(box,sand,0,.47,0,2.2,.92,1.8);
   for(const x of [-1.02,1.02])for(const z of [-.83,.83]){
    create(cylinder,sand,x,.67,z,.57,1.34,.57);
    create(cone,pink,x,1.49,z,.58,.52,.58);
   }
   create(box,wood,0,.34,.95,.6,.65,.08);
   const flag=create(cylinder,wood,0,2.0,0,.055,1.65,.055);
   const tip=create(box,red,.38,2.68,0,.7,.4,.08);tip.rotation.z=-.1;
  }else if(kind==='butterflyGarden'){
   for(let i=0;i<9;i++){const a=i*Math.PI*2/9,x=Math.cos(a)*1.6,z=Math.sin(a)*1.6;
    create(cylinder,leaf,x,.42,z,.055,.84,.055);
    for(let j=0;j<4;j++){const b=j*Math.PI/2;create(ball,i%2?pink:purple,x+Math.sin(b)*.18,.86,z+Math.cos(b)*.18,.18,.20,.09);}
    create(ball,gold,x,.88,z,.10,.10,.10);
   }
   create(cylinder,grass,0,.08,0,2.05,.16,2.05);
   icon3D(root,'🦋',0,2.1,0,2.5);
  }else if(kind==='treehouse'){
   create(cylinder,wood,0,2.2,0,.64,4.45,.64);
   create(box,plank,0,3.35,0,4.2,.30,3.7);
   create(box,sand,0,4.30,0,3.35,1.68,2.9);
   create(cone,red,0,5.52,0,2.7,1.2,2.4);
   create(box,blue,0,4.42,1.51,.72,.76,.07);
   for(let i=0;i<7;i++)create(box,wood,-2.32,.38+i*.41,.95,.65,.085,.13);
   icon3D(root,'🔔',1.1,3.5,2.2,1.5);
  }else if(kind==='beachCabana'){
   for(const x of [-1.85,1.85])for(const z of [-1.45,1.45])create(cylinder,wood,x,1.58,z,.11,3.16,.11);
   create(box,white,0,3.23,0,4.25,.23,3.55);
   for(let i=-2;i<=2;i++)create(box,i%2?blue:red,i*.83,3.40,0,.83,.08,3.55);
   create(box,plank,0,.56,0,2.85,.2,1.35);
   create(box,blue,0,.71,0,2.45,.13,1.06);
   icon3D(root,'⛱️',0,4.6,0,2.2);
  }else if(kind==='volcanoCamp'){
   const tent=create(cone,red,-.9,1.20,0,1.7,2.4,1.7);tent.rotation.y=Math.PI/4;
   const entrance=create(box,wood,-.9,.60,1.25,.65,1.2,.1);
   for(let i=0;i<7;i++){const a=i*Math.PI*2/7;create(ball,stone,1.5+Math.cos(a)*.62,.22,Math.sin(a)*.62,.27,.22,.28);}
   const ember=create(ball,gold,1.5,.52,0,.45,.48,.35);ember.name='Campfire glow';
   icon3D(root,'🔥',1.5,1.50,0,1.2);
   icon3D(root,'🏕️',-.9,3.1,0,2.1);
  }else if(kind==='coralNursery'){
   create(cylinder,blue,0,.15,0,2.2,.3,2.2);
   for(let i=0;i<9;i++){const a=i*Math.PI*2/9,r=.36+(i%3)*.6,x=Math.sin(a)*r,z=Math.cos(a)*r;
    create(cylinder,i%2?pink:purple,x,.58,z,.13,1.06,.13);
    for(const sign of [-1,1]){
     const stem=create(cylinder,i%2?pink:purple,x+sign*.20,.99,z,.10,.63,.1);
     stem.rotation.z=sign*.33;
    }
   }
   icon3D(root,'🪸',0,2.3,0,2.3);
  }else if(kind==='pizzaStand'){
   for(const x of [-1.6,1.6])for(const z of [-1.2,1.2])create(cylinder,wood,x,1.4,z,.1,2.8,.1);
   create(box,red,0,2.9,0,3.8,.22,3.0);
   create(box,plank,0,.82,1.1,3.35,1.1,.73);
   create(box,sand,0,1.44,1.1,2.5,.12,.55);
   const pizza=create(cylinder,gold,0,1.57,1.1,.65,.07,.65);pizza.rotation.x=.1;
   for(let i=0;i<5;i++){const a=i*Math.PI*2/5;create(ball,red,Math.cos(a)*.35,1.64,1.1+Math.sin(a)*.34,.085,.035,.085);}
   icon3D(root,'🍕',0,4.12,0,2.2);
  }
 }
 function buildVisual(recipe){
  const root=new T.Group();root.name='Built '+recipe.en;root.position.set(recipe.x,height(recipe.x,recipe.z),recipe.z);group.add(root);
  prop(recipe.id,root);objects.set(recipe.id,root);
 }
 // Unbuilt workshops show a raised blue building marker, not a large intrusive UI.
 for(const recipe of BUILD_RECIPES){
  const station=new T.Group();station.position.set(recipe.x,height(recipe.x,recipe.z),recipe.z);group.add(station);
  const disk=put(cylinder,s.craft?.built?.includes(recipe.id)?grass:blue,0,.07,0,2.2,.14,2.2,station);
  disk.castShadow=false;
  if(s.craft?.built?.includes(recipe.id))buildVisual(recipe);
  else {put(box,wood,0,.86,0,.22,1.55,.22,station);icon3D(station,'🛠️',0,2.15,0,2.1);}
  objects.set('station-'+recipe.id,station);
 }
 function nearest(x,z,max=4.8){
  return BUILD_RECIPES.map(r=>({...r,distance:Math.hypot(x-r.x,z-r.z)}))
   .filter(r=>r.distance<=max).sort((a,b)=>a.distance-b.distance)[0]||null;
 }
 function build(id,x=s.x,z=s.z){
  if(!commitCraft(s,id,x,z))return false;
  const recipe=BUILD_RECIPES.find(r=>r.id===id);
  const old=objects.get('station-'+id);if(old)group.remove(old);
  buildVisual(recipe);
  earnCoins(state,'craft-build-'+id);
  joy.effect('finish');spark?.(recipe.x,recipe.z,25);
  tell('🛠️ ¡Construiste '+recipe.es+'! ¡Ahora puedes usarlo!',
       '🛠️ You built '+recipe.en+'! Now you can play with it!');
  save();refresh();return true;
 }
 function use(id){
  const r=BUILD_RECIPES.find(r=>r.id===id);
  if(!r||!s.craft?.built?.includes(id)||!craftAtSite(s,id,s.x,s.z))return false;
  const reward=earnCoins(state,'craft-use-'+id);
  joy.effect('correct');spark?.(r.x,r.z,18);
  const g=objects.get(id);if(g)g.userData.activeUntil=performance.now()+2300;
  tell(r.icon+' '+r.actionEs+(reward?' · +3 🪙':'')+'!',
       r.icon+' '+r.actionEn+(reward?' · +3 🪙':'')+'!');
  save();refresh();return true;
 }
 function update(dt,t){
  if(!motion())return;
  for(const r of BUILD_RECIPES){
   const g=objects.get(r.id);
   if(!g)continue;
   const active=(g.userData.activeUntil||0)>performance.now();
   if(active)g.rotation.y=Math.sin(t*7)*.075;
   else g.rotation.y+=(0-g.rotation.y)*Math.min(1,dt*3);
  }
 }
 function dispose(){
  scene.remove(group);
  for(const {tex,material}of bills){tex.dispose();material.dispose();}
 }
 return {nearest,build,use,update,dispose,recipes:BUILD_RECIPES,inventory:()=>craftInventory(s),
   isBuilt:id=>s.craft?.built?.includes(id)===true,canBuild:id=>canCraft(s,id)};
}

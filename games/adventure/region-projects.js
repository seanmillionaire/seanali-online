// A single meaningful, persistent community project for each Panama destination.
// Mini-games and collecting now feed into a clear physical outcome in their region.
import {worldIslands,isletHeight,exploreItems,volcanoTrailPoint} from './explore-state.js?v=73';
import {BUILD_RECIPES} from './island-workshop.js?v=73';
const where=id=>worldIslands.find(x=>x.id===id);
const build=id=>BUILD_RECIPES.find(x=>x.id===id);
const at=id=>{const x=where(id);return {x:x?.x||0,z:x?.z||0};};
export const REGION_PROJECTS=[
 {id:'home',icon:'🐢',es:'Recuperar la playa de Gorgona',en:'Bring Gorgona Beach Back to Life',
  whyEs:'Pip necesita una zona segura y bonita donde todos puedan jugar y aprender junto al mar.',
  whyEn:'Pip needs a beautiful, welcoming beach where friends can play and learn together.',
  resultEs:'¡Gorgona tiene un rincón de juegos nuevo!',resultEn:'Gorgona has a new beach play area!',
  craft:'sandcastle',spot:{x:-7,z:-8},
  tasks:[
   {id:'supplies',icon:'🐚',es:'Recoge 3 conchas para la playa',en:'Collect 3 shells for the beach',check:{kind:'collected',item:'shell',count:3},go:{x:-7,z:-11}},
   {id:'story',icon:'🧩',es:'Resuelve el sendero de conchas con Pip',en:'Solve Pip’s shell trail',check:{kind:'story',story:'shells',count:3},go:{x:2,z:7}},
   {id:'build',icon:'🏰',es:'Construye el castillo de arena',en:'Build the beach sandcastle',check:{kind:'built',id:'sandcastle'},go:{x:-7,z:-8}},
   {id:'activate',icon:'🎮',es:'Decora y abre el castillo a los amigos',en:'Decorate the castle for your friends',check:{kind:'used',id:'sandcastle'},go:{x:-7,z:-8}}
  ]},
 {id:'islet',icon:'🦋',es:'Salvar el jardín de mariposas de Taboga',en:'Restore Taboga’s Butterfly Garden',
  whyEs:'Las mariposas necesitan flores cuidadas. Ayuda a que el jardín vuelva a llenarse de vida.',
  whyEn:'The butterflies need healthy flowers. Bring their garden back to life.',
  resultEs:'¡Las mariposas regresaron a Taboga!',resultEn:'The butterflies returned to Taboga!',
  craft:'butterflyGarden',spot:{x:build('butterflyGarden').x,z:build('butterflyGarden').z},
  tasks:[
   {id:'butterflies',icon:'🦋',es:'Encuentra y atrapa suavemente 2 mariposas',en:'Catch and release 2 butterflies',check:{kind:'counter',key:'catches',count:2},go:at('islet')},
   {id:'story',icon:'🌸',es:'Aprende a cuidar las flores del jardín',en:'Complete the flower-care challenge',check:{kind:'story',story:'care',count:2},go:{x:where('islet').x,z:where('islet').z}},
   {id:'build',icon:'🌷',es:'Construye el nuevo jardín',en:'Build the new butterfly garden',check:{kind:'built',id:'butterflyGarden'},go:{x:build('butterflyGarden').x,z:build('butterflyGarden').z}},
   {id:'activate',icon:'🦋',es:'Libera mariposas en el jardín',en:'Release butterflies into the garden',check:{kind:'used',id:'butterflyGarden'},go:{x:build('butterflyGarden').x,z:build('butterflyGarden').z}}
  ]},
 {id:'wilds',icon:'🌳',es:'Reabrir la casita del bosque en Bocas',en:'Reopen the Bocas Forest Treehouse',
  whyEs:'Los animales del bosque necesitan una casita para reunirse, comer y aprender.',
  whyEn:'The forest friends need a special place to gather, share food, and learn.',
  resultEs:'¡La casa del bosque está abierta!',resultEn:'The forest treehouse is open!',
  craft:'treehouse',spot:{x:build('treehouse').x,z:build('treehouse').z},
  tasks:[
   {id:'supplies',icon:'🍌',es:'Recoge 3 racimos de plátanos',en:'Gather 3 bunches of bananas',check:{kind:'collected',item:'fruit',count:3},go:at('wilds')},
   {id:'story',icon:'🥣',es:'Prepara el picnic comunitario',en:'Prepare the community picnic',check:{kind:'story',story:'picnic',count:4},go:{x:where('wilds').x,z:where('wilds').z}},
   {id:'build',icon:'🌳',es:'Construye la casa en el árbol',en:'Build the treehouse',check:{kind:'built',id:'treehouse'},go:{x:build('treehouse').x,z:build('treehouse').z}},
   {id:'activate',icon:'🔔',es:'Toca la campana y recibe a tus amigos',en:'Ring the bell and welcome your friends',check:{kind:'used',id:'treehouse'},go:{x:build('treehouse').x,z:build('treehouse').z}}
  ]},
 {id:'coconutCoast',icon:'⛱️',es:'Crear un refugio playero en Contadora',en:'Make Contadora a Welcoming Beach',
  whyEs:'Los visitantes necesitan sombra y un sitio para descansar después de explorar.',
  whyEn:'Visitors need shade and a welcoming place to rest after exploring.',
  resultEs:'¡Contadora tiene una nueva cabaña para todos!',resultEn:'Contadora has a beautiful new shelter!',
  craft:'beachCabana',spot:{x:build('beachCabana').x,z:build('beachCabana').z},
  tasks:[
   {id:'gems',icon:'💎',es:'Encuentra 2 gemas de Contadora',en:'Find 2 gems on Contadora',check:{kind:'collectedPrefix',prefix:'wildGem1-',count:2},go:at('coconutCoast')},
   {id:'story',icon:'🥥',es:'Resuelve el reto de compartir cocos',en:'Solve the coconut-sharing challenge',check:{kind:'story',story:'light',count:4},go:at('coconutCoast')},
   {id:'build',icon:'⛱️',es:'Construye la cabaña de playa',en:'Build a beach cabana',check:{kind:'built',id:'beachCabana'},go:{x:build('beachCabana').x,z:build('beachCabana').z}},
   {id:'activate',icon:'🪑',es:'Prepara el refugio para visitantes',en:'Open the shelter to visitors',check:{kind:'used',id:'beachCabana'},go:{x:build('beachCabana').x,z:build('beachCabana').z}}
  ]},
 {id:'sunset',icon:'🌋',es:'Hacer seguro el sendero del Volcán Barú',en:'Make the Volcán Barú Trail Safe',
  whyEs:'Los exploradores necesitan un campamento seguro antes de subir a la cima.',
  whyEn:'Hikers need a safe place to rest before climbing the mountain.',
  resultEs:'¡El campamento del Volcán Barú está listo!',resultEn:'The Volcán Barú campsite is ready!',
  craft:'volcanoCamp',spot:{x:build('volcanoCamp').x,z:build('volcanoCamp').z},
  tasks:[
   {id:'lights',icon:'✨',es:'Encuentra 2 luciérnagas para iluminar la ruta',en:'Find 2 fireflies to light the trail',check:{kind:'collected',item:'glow',count:2},go:at('sunset')},
   {id:'summit',icon:'🥾',es:'Sube a la cima del volcán caminando',en:'Hike to the volcano summit',check:{kind:'badge',id:'volcano-summit'},go:volcanoTrailPoint(0)},
   {id:'build',icon:'🏕️',es:'Construye el campamento del volcán',en:'Build the volcano campsite',check:{kind:'built',id:'volcanoCamp'},go:{x:build('volcanoCamp').x,z:build('volcanoCamp').z}},
   {id:'activate',icon:'🔥',es:'Enciende la fogata para excursionistas',en:'Light the hikers’ campfire',check:{kind:'used',id:'volcanoCamp'},go:{x:build('volcanoCamp').x,z:build('volcanoCamp').z}}
  ]},
 {id:'crystalCove',icon:'🪸',es:'Restaurar la vida marina de Guna Yala',en:'Restore Guna Yala’s Sea Life',
  whyEs:'Los arrecifes necesitan cuidados para que los animales del mar puedan vivir tranquilos.',
  whyEn:'The reefs need care so the sea animals can thrive again.',
  resultEs:'¡El vivero marino de Guna Yala está vivo!',resultEn:'Guna Yala’s marine nursery is thriving!',
  craft:'coralNursery',spot:{x:build('coralNursery').x,z:build('coralNursery').z},
  tasks:[
   {id:'reef',icon:'🪸',es:'Rescata 2 tesoros del arrecife',en:'Recover 2 reef treasures',check:{kind:'collected',item:'seaTreasure',count:2},go:{x:32,z:100}},
   {id:'song',icon:'🎶',es:'Completa el juego de música de Luna',en:'Complete Luna’s sea-music puzzle',check:{kind:'story',story:'song',count:4},go:at('crystalCove')},
   {id:'build',icon:'🪸',es:'Construye el vivero de corales',en:'Build the coral nursery',check:{kind:'built',id:'coralNursery'},go:{x:build('coralNursery').x,z:build('coralNursery').z}},
   {id:'activate',icon:'🐠',es:'Cuida el vivero para los peces',en:'Care for the nursery and its fish',check:{kind:'used',id:'coralNursery'},go:{x:build('coralNursery').x,z:build('coralNursery').z}}
  ]},
 {id:'pizzaCity',icon:'🏘️',es:'Reanimar el barrio de Casco Viejo',en:'Bring Casco Viejo’s Neighborhood to Life',
  whyEs:'Las familias del barrio necesitan ayuda con las entregas y un lugar donde compartir comida.',
  whyEn:'Help the neighborhood families with deliveries and a new place to share food.',
  resultEs:'¡El barrio de Casco Viejo está lleno de vida!',resultEn:'Casco Viejo is full of community life!',
  craft:'pizzaStand',spot:{x:build('pizzaStand').x,z:build('pizzaStand').z},
  tasks:[
   {id:'supplies',icon:'💰',es:'Recoge 2 bolsas para comprar materiales',en:'Collect 2 money bags for materials',check:{kind:'cityBags',count:2},go:at('pizzaCity')},
   {id:'delivery',icon:'🍕',es:'Entrega una pizza a una familia del barrio',en:'Deliver a pizza to a neighborhood family',check:{kind:'cityDelivery',count:1},go:{x:-84,z:-60}},
   {id:'build',icon:'🏠',es:'Construye el puesto comunitario de pizza',en:'Build the community pizza stand',check:{kind:'built',id:'pizzaStand'},go:{x:build('pizzaStand').x,z:build('pizzaStand').z}},
   {id:'activate',icon:'🍕',es:'Prepara pizza y abre el puesto',en:'Make pizza and open your stand',check:{kind:'used',id:'pizzaStand'},go:{x:build('pizzaStand').x,z:build('pizzaStand').z}}
  ]}
];
export function regionForPosition(x,z){
 const near=REGION_PROJECTS.filter(r=>r.id!=='home').map(r=>{
  const l=where(r.id),ratio=Math.hypot((x-l.x)/l.rx,(z-l.z)/l.rz);
  return {r,ratio};
 }).filter(a=>a.ratio<1.0).sort((a,b)=>a.ratio-b.ratio)[0];
 return near?.r.id||'home';
}
export function taskCount(world,task,state){
 const c=task.check;
 if(c.kind==='collected'&&c.item==='fruit')return world.foodTotal?.banana||0;
 if(c.kind==='collected')return (world.collected||[]).filter(id=>exploreItems.some(item=>item.id===id&&item.kind===c.item)).length;
 if(c.kind==='collectedPrefix')return (world.collected||[]).filter(id=>id.startsWith(c.prefix)).length;
 if(c.kind==='counter')return Math.max(0,Number(world[c.key])||0);
 if(c.kind==='story')return world.story?.[c.story]||0;
 if(c.kind==='built')return world.craft?.built?.includes(c.id)?1:0;
 if(c.kind==='used')return state.wallet?.rewards?.includes('craft-use-'+c.id)?1:0;
 if(c.kind==='badge')return world.badges?.includes(c.id)?1:0;
 if(c.kind==='cityBags')return world.city?.bags?.length||0;
 if(c.kind==='cityDelivery')return world.city?.activities?.deliveries?.length||0;
 return 0;
}
export function missionStatus(world,state,id){
 const r=REGION_PROJECTS.find(x=>x.id===id);if(!r)return null;
 const tasks=r.tasks.map(t=>({...t,current:Math.min(t.check.count||1,taskCount(world,t,state)),required:t.check.count||1,complete:taskCount(world,t,state)>=(t.check.count||1)}));
 return {...r,tasks,done:tasks.filter(t=>t.complete).length,complete:tasks.every(t=>t.complete),restored:(world.regionalProjects?.helped||[]).includes(id)};
}
export function restoreRegions(world,state){
 world.regionalProjects??={helped:[]};
 const completed=[];
 for(const r of REGION_PROJECTS){
  if(world.regionalProjects.helped.includes(r.id))continue;
  if(missionStatus(world,state,r.id).complete){
   world.regionalProjects.helped.push(r.id);completed.push(r.id);
  }
 }
 return completed;
}
export function createRegionProjectWorld({T,scene,state,make,ball,box,cone,cylinder,height,mat}){
 const root=new T.Group();root.name='Seven restored places in Panama';scene.add(root);
 const entries=[];
 const natural=mat('#7faa64',{roughness:.96}),stem=mat('#567b54',{roughness:1}),
  wood=mat('#8e714c',{roughness:.88}),stone=mat('#9e9382',{roughness:.95}),
  gold=mat('#efc76b',{emissive:'#a47920',emissiveIntensity:.4}),
  blue=mat('#7ab3c1'),red=mat('#d78784'),pink=mat('#eba6bb');
 const colors=[red,pink,blue,gold];
 for(let k=0;k<REGION_PROJECTS.length;k++){
  const r=REGION_PROJECTS[k],g=new T.Group();g.name='Restored '+r.en;
  g.position.set(r.spot.x+3.6,height(r.spot.x+3.6,r.spot.z+2),r.spot.z+2);
  root.add(g);
  // A community gathering space visibly blooms once the mission is complete.
  make(cylinder,natural,0,.10,0,2.5,.2,2.5,g);
  make(cylinder,stone,0,.25,0,1.2,.3,1.2,g);
  make(cylinder,wood,0,1.60,0,.11,2.6,.11,g);
  make(box,colors[k%4],.68,2.40,0,1.25,.7,.07,g);
  make(ball,gold,0,3,0,.28,.3,.28,g);
  for(let i=0;i<8;i++){
   const a=i*Math.PI*2/8,x=Math.cos(a)*2.1,z=Math.sin(a)*2.1;
   make(cylinder,stem,x,.5,z,.045,.9,.045,g);
   for(let j=0;j<5;j++){
    const a2=j*2*Math.PI/5;
    make(ball,colors[(i+j+k)%4],x+Math.cos(a2)*.22,1.05+Math.sin(a2)*.14,z,.19,.2,.12,g);
   }
  }
  g.visible=(state.world.regionalProjects?.helped||[]).includes(r.id);
  entries.push({g,id:r.id});
 }
 return {
  refresh(){for(const x of entries)x.g.visible=(state.world.regionalProjects?.helped||[]).includes(x.id);},
  dispose(){scene.remove(root);}
 };
}

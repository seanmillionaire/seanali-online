// Five real walkable, furnished interiors. Exterior coordinates are never
// overwritten while inside, so old saves and world navigation remain safe.
export const villageHouses=[
 {id:'seaside',x:-10,z:5,es:'Casita de Playa Gorgona',en:'Gorgona Beach Cottage',icon:'🐚',theme:'sea'},
 {id:'books',x:-13,z:2,es:'Biblioteca de El Valle',en:'El Valle Storybook House',icon:'📚',theme:'books'},
 {id:'music',x:10,z:2,es:'Casa del Tamborito',en:'Tamborito Music House',icon:'🎶',theme:'music'},
 {id:'art',x:12,z:-1,es:'Taller de Arte Panameño',en:'Panamanian Art Studio',icon:'🎨',theme:'art'},
 {id:'cozy',x:9,z:-4,es:'Casita de Juegos de Gorgona',en:'Gorgona Playhouse',icon:'🧸',theme:'play'},
 {id:'pizzeria',x:-84,z:-60,es:'Pizzería de Angelique · Casco Viejo',en:'Angelique’s Pizzeria · Casco Viejo',icon:'🍕',theme:'pizza'}
];
export function createHouseInteriors({T,scene,camera,avatar,host,make,mat,geometry,box,ball,cone,cylinder,surfaces=null,language='en',companionId=()=>null,onEnter=()=>{},onPizza=()=>{},onMessage}){
 const es=language==='es';
 const rooms=new Map(),originZ=280;
 const cssButton=document.createElement('button');
 cssButton.type='button';cssButton.className='house-door-action';cssButton.hidden=true;
 cssButton.textContent='🚪 '+(es?'Entrar en casa':'Enter house');
 cssButton.setAttribute('aria-label',es?'Entrar en la casa cercana':'Enter nearby house');
 host.append(cssButton);
 let active=null,localX=0,localZ=2,lastSpot=null;
 const themes={
 sea:{floor:'#e2caa3',wall:'#cfecf0',back:'#9cd7dd',rug:'#65bbc5',accent:'#efbea5',furniture:'#b1845b'},
 books:{floor:'#a27d5a',wall:'#eddfbf',back:'#c8b9d9',rug:'#aa7ca9',accent:'#e7c776',furniture:'#765a46'},
 music:{floor:'#dab985',wall:'#ffebcd',back:'#e3bddb',rug:'#bc99d8',accent:'#eabb75',furniture:'#9b6d51'},
 art:{floor:'#e7caac',wall:'#f8efd8',back:'#b1d9c4',rug:'#e6a4b2',accent:'#a0bdd9',furniture:'#ae8169'},
 play:{floor:'#efce8e',wall:'#fce9cf',back:'#f8c3bc',rug:'#83d0b7',accent:'#cfb0e4',furniture:'#a4825f'},
 pizza:{floor:'#c69a77',wall:'#f7dec0',back:'#ec9987',rug:'#d5756b',accent:'#e6b45d',furniture:'#85573f'}
 };
 function build(cfg){
  const root=new T.Group();root.name=cfg.en+' interior';root.position.set(0,0,originZ);scene.add(root);root.visible=false;
  const t=themes[cfg.theme],
   floor=mat(t.floor,{map:surfaces?.wood,bumpMap:surfaces?.wood,bumpScale:.045,roughness:.89}),
   walls=mat(t.wall,{map:surfaces?.plaster,bumpMap:surfaces?.plaster,bumpScale:.029,roughness:.98}),
   back=mat(t.back,{map:surfaces?.plaster,bumpMap:surfaces?.plaster,bumpScale:.03,roughness:.98}),
   rug=mat(t.rug,{roughness:1}),accent=mat(t.accent,{roughness:.83}),
   wood=mat(t.furniture,{map:surfaces?.wood,bumpMap:surfaces?.wood,bumpScale:.047,roughness:.87}),
   cream=mat('#fff8e8',{map:surfaces?.plaster}),ink=mat('#455868');
  const prop=(geo,m,x,y,z,sx,sy,sz,parent=root)=>{const mesh=make(geo,m,x,y,z,sx,sy,sz,parent);mesh.castShadow=false;return mesh;};
  // Wide 10m x 9m dollhouse: a real space with an open front and no roof.
  prop(box,floor,0,-.28,0,10.2,.56,9.3);
  prop(box,walls,-5.05,2.7,0,.25,5.5,9.3);
  prop(box,walls,5.05,2.7,0,.25,5.5,9.3);
  prop(box,back,0,2.7,-4.6,10.2,5.5,.25);
  prop(box,walls,-3.65,2.6,4.6,2.9,5.2,.24);
  prop(box,walls,3.65,2.6,4.6,2.9,5.2,.24);
  prop(box,rug,0,.035,0,5.4,.06,3.4);
  // Windows face the open view; picture frames remain visible from above.
  for(const x of [-3.25,3.25]){
   prop(box,cream,x,2.8,-4.39,2.2,2,.12);
   prop(box,accent,x,2.8,-4.29,1.95,1.7,.09);
   prop(box,cream,x,2.8,-4.21,.12,1.8,.13);
   prop(box,cream,x,2.8,-4.19,1.95,.12,.13);
  }
  const props=[];
  function add(id,x,z,esName,enName,esMessage,enMessage,fn){
   props.push({id,x,z,esName,enName,esMessage,enMessage,fn});
  }
  // A bed, a desk, bookshelf, decorations and a different signature toy per house.
  prop(box,wood,-3, .46,-1.65,2.65,.8,2.6);
  prop(box,accent,-3,.91,-1.65,2.35,.22,2.15);
  prop(box,cream,-3,1.10,-2.46,1.95,.18,.6);
  prop(box,wood,2.65,.74,-1.15,2.7,.16,1.35);
  for(const x of [1.7,3.6])prop(box,wood,x,.37,-1.15,.16,.72,1.17);
  prop(box,wood,3.8,1.85,2.25,.78,3.5,2.4);
  for(const y of [.75,1.58,2.4,3.2]){
   prop(box,cream,3.8,y,2.3,.72,.11,2.15);
   for(let i=0;i<4;i++)prop(box,i%2?accent:back,3.79,y+.28,1.56+i*.46,.64,.47,.19);
  }
  add('bed',-3,-1.65,'Cama blandita','Cozy bed','¡Qué cama más suave!','This bed is so cozy!');
  add('books',3.8,2.25,'Libros mágicos','Magic books','¡Había una vez una isla llena de amigos!','Once upon a time, an island was full of friends!');
  if(cfg.theme==='sea'){
   for(let i=0;i<6;i++){const a=i*Math.PI/3;prop(ball,i%2?cream:accent,Math.cos(a)*1.15,.23,Math.sin(a)*1.15,.31,.16,.33);}
   prop(ball,rug,0,.6,-2.8,1.3,.2,.7);
   add('shells',0,0,'Colección de conchas','Shell collection','¡Estas conchas son de toda la isla!','These shells came from all over the island!');
  }else if(cfg.theme==='books'){
   for(let i=0;i<8;i++)prop(box,i%2?accent:back,-.8+i*.25,.68,-2.85,.17,1.1,.28);
   prop(box,wood,0,.65,-2.65,2.8,.16,1.25);
   add('story',0,-2.65,'Libro de cuentos','Storybook','¡Puedes imaginar una nueva aventura!','Imagine a new adventure!');
  }else if(cfg.theme==='music'){
   prop(box,ink,.1,.7,-2.2,3,.32,1.15);
   for(let i=0;i<9;i++)prop(box,i%2?ink:cream,-1.15+i*.3,.91,-1.66,.26,.07,.39);
   add('piano',0,-2,'Piano de colores','Rainbow piano','¡Tocaste una melodía preciosa!','You played a beautiful melody!');
  }else if(cfg.theme==='art'){
   prop(box,wood,.2,1.15,-2.25,2.6,2.1,.19);
   for(let i=0;i<5;i++)prop(ball,[accent,back,rug,cream,ink][i],-.65+i*.43,1.36,-2.08,.23,.25,.1);
   add('paint',.2,-2.25,'Pinturas brillantes','Paint supplies','¡Qué bonito arcoíris pintaste!','You painted a beautiful rainbow!');
  }else if(cfg.theme==='pizza'){
   // Pizza counter, brick oven, ovenside ingredients and circular pizza trays.
   prop(box,wood,0,.75,-2.0,4,.86,1.1);
   prop(box,back,0,2.5,-4.26,4.5,2.7,.38);
   prop(box,cream,0,1.35,-4.00,2.0,1.55,.15);
   for(let i=0;i<3;i++){
    const x=-1.35+i*1.35;
    prop(cylinder,accent,x,1.38,-1.85,.50,.10,.50);
    prop(cylinder,rug,x,1.47,-1.85,.37,.04,.37);
    for(let j=0;j<5;j++){const a=j*1.26;
     prop(ball,i%2?back:accent,x+Math.cos(a)*.28,1.51,-1.85+Math.sin(a)*.28,.075,.042,.075);
    }
   }
   prop(box,wood,-2.65,.65,1.0,1.8,.11,1.8);
   prop(box,wood,2.65,.65,1.0,1.8,.11,1.8);
   for(const x of [-2.65,2.65])prop(cylinder,wood,x,.35,1.0,.12,.6,.12);
   add('pizza',0,-1.85,'🍕 Pedir pizza','🍕 Order a pizza','🍕 ¡Pizza recién hecha!','🍕 Fresh pizza!',onPizza);
  }else{
   for(let i=0;i<5;i++)prop(box,i%2?accent:rug,-1.8+i*.78,.38,-2.1,.64,.77,.65);
   prop(ball,accent,1,.9,-1.8,.65,.9,.54);
   prop(ball,cream,1,1.65,-1.8,.55,.5,.48);
   add('toys',1,-1.8,'Juguetes y osito','Toys and teddy bear','¡El osito quiere jugar contigo!','The teddy bear wants to play with you!');
  }
  // Rooms contain repeatable mini-activities, with tangible changes in the room.
  const activityItems=[];
  const decorateActivity=(name,x,z,color)=>{
   const g=new T.Group();g.position.set(x,.06,z);root.add(g);
   const m=mat(color);
   const pieces=[];
   for(let i=0;i<4;i++)pieces.push(prop(box,i%2?m:accent,(i%2)*.47-.24,.18+Math.floor(i/2)*.33,(Math.floor(i/2)-.5)*.52,.42,.32,.42,g));
   activityItems.push({name,g,pieces});
   return g;
  };
  if(cfg.theme==='sea')decorateActivity('sandcastle',1.5,1.8,'#e9d6a3');
  if(cfg.theme==='books')decorateActivity('library',1.5,1.8,'#a6bcdc');
  if(cfg.theme==='music')decorateActivity('rhythm',1.5,1.8,'#db9ea9');
  if(cfg.theme==='art')decorateActivity('sculpture',1.5,1.8,'#9ed4b4');
  if(cfg.theme==='play')decorateActivity('blocks',1.5,1.8,'#efb86e');
  if(cfg.theme==='pizza')decorateActivity('ingredients',1.5,1.8,'#dca370');
  let steps=0;
  add('activity',1.5,1.8,
   ({sea:'Construir castillo de arena',books:'Ordenar biblioteca',music:'Practicar ritmo',art:'Crear escultura',play:'Construir con bloques',pizza:'Preparar ingredientes'})[cfg.theme],
   ({sea:'Build a sandcastle',books:'Organize the library',music:'Practice rhythm',art:'Sculpt a statue',play:'Stack building blocks',pizza:'Prepare ingredients'})[cfg.theme],
   '¡Tu proyecto ha cambiado de verdad!','Your project really changed!',
   ()=>{steps++;const a=activityItems[0];if(a)a.pieces.forEach((part,i)=>{part.position.y=.18+Math.floor((i+steps)%4/2)*.33;part.rotation.y=steps*.22;});
    onMessage?.((es?'🛠️ Paso ':'🛠️ Step ')+steps+' / 5 · '+(es?'¡Mira cómo cambia!':'Watch it change!'));if(steps>=5){steps=0;onMessage?.(es?'🎉 ¡Proyecto terminado! Puedes empezar otra vez.':'🎉 Project complete! You can build another.');}
   });
  // Additional practical household tasks with visible, reusable props.
  const lamp=prop(cylinder,wood,-.2,1.22,2.6,.12,1.45,.12);
  const glow=prop(ball,accent,-.2,2.02,2.6,.36,.36,.36);glow.material=mat(t.accent,{emissive:t.accent,emissiveIntensity:.0});
  let lightsOn=false;
  add('lamp',-.2,2.6,'Encender lámpara','Switch lamp','Luz encendida','Lamp switched on',()=>{lightsOn=!lightsOn;glow.material.emissiveIntensity=lightsOn?.8:0;onMessage?.(lightsOn?(es?'💡 Encendiste la lámpara.':'💡 You turned the lamp on.'):(es?'🌙 Apagaste la lámpara.':'🌙 You turned the lamp off.'));});
  const warm= new T.PointLight('#ffe2a4',2.5,24);
  warm.position.set(0,4,0);root.add(warm);
  const room={root,props,cfg};rooms.set(cfg.id,room);return room;
 }
 // Lazy-build rooms to preserve frame rate on low-power phones.
 function near(x,z){if(active)return null;return villageHouses.filter(h=>Math.hypot(x-h.x,z-h.z)<4.6).sort((a,b)=>Math.hypot(x-a.x,z-a.z)-Math.hypot(x-b.x,z-b.z))[0]||null;}
 function enter(cfg){
  if(!cfg||active)return false;
  lastSpot={x:cfg.x,z:cfg.z};active=rooms.get(cfg.id)||build(cfg);localX=0;localZ=2.2;
  active.saved=new Map();
  for(const o of scene.children){
   if(o===active.root||o===avatar||o.isLight||o===camera||o.userData?.friendId===companionId())continue;
   active.saved.set(o,o.visible);o.visible=false;
  }
  active.root.visible=true;
  cssButton.hidden=true;
  onEnter(cfg);
  onMessage?.(es?'🏠 ¡Puedes explorar la casa! Mira los muebles.':'🏠 Explore the house! Look at the furniture.');
  return true;
 }
 function leave(){
  if(!active)return;
  active.root.visible=false;
  for(const [o,visible]of active.saved)o.visible=visible;
  active=null;cssButton.hidden=true;
 }
 function move(dx,dz,dt,speed=3.3){
  if(!active)return null;
  if(dx||dz){const len=Math.max(1,Math.hypot(dx,dz));localX=Math.max(-4.25,Math.min(4.25,localX+dx/len*dt*speed));localZ=Math.max(-3.65,Math.min(3.65,localZ+dz/len*dt*speed));}
  return {x:localX,z:originZ+localZ,y:0};
 }
 function position(){return active?{x:localX,z:originZ+localZ,y:0}:null;}
 function nearbyProp(){
  if(!active)return null;
  return active.props.filter(p=>Math.hypot(localX-p.x,localZ-p.z)<1.7).sort((a,b)=>Math.hypot(localX-a.x,localZ-a.z)-Math.hypot(localX-b.x,localZ-b.z))[0]||null;
 }
 function inspect(){
  const p=nearbyProp();if(!p)return false;
  if(p.fn)p.fn();else onMessage?.(es?p.esMessage:p.enMessage);
  return true;
 }
 function updateDoor(x,z,occupied){
  const found=occupied?null:near(x,z);
  cssButton.hidden=!found;
  if(found){cssButton.textContent=found.icon+' '+(es?'Entrar':'Enter')+' · '+(es?found.es:found.en);cssButton.onclick=()=>enter(found);}
 }
 function dispose(){leave();cssButton.remove();for(const r of rooms.values())scene.remove(r.root);}
 return {near,enter,leave,move,position,nearbyProp,inspect,updateDoor,isInside:()=>!!active,current:()=>active?.cfg||null,dispose};
}

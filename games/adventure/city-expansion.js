/* Panama Adventure — substantial zero-dependency Casco Viejo city expansion.
   Roads and landmark buildings are genuine Three.js meshes; activities update
   game state only on meaningful user actions and persist in world.city. */
export const CITY_SITES=[
 {id:'rally',x:-106,z:-88,icon:'🏁',en:'City driving rally',es:'Carrera por la ciudad'},
 {id:'soccer',x:-117,z:-43,icon:'⚽',en:'Football challenge',es:'Reto de fútbol'},
 {id:'market',x:-76,z:-86,icon:'🥭',en:'Panama Fruit Market',es:'Mercado de Frutas de Panamá'},
 {id:'mural',x:-132,z:-88,icon:'🎨',en:'Casco Viejo street art',es:'Murales del Casco Viejo'},
 {id:'museum0',x:-82,z:-102,icon:'🏛️',en:'History exhibit',es:'Exhibición de historia'},
 {id:'museum1',x:-71,z:-97,icon:'🦋',en:'Panama nature exhibit',es:'Exhibición de naturaleza'},
 {id:'museum2',x:-89,z:-105,icon:'🚢',en:'Canal exhibit',es:'Exhibición del Canal'},
 {id:'wash',x:-132,z:-64,icon:'🫧',en:'Drive-through car wash',es:'Lavado de autos'},
 {id:'plaza',x:-99,z:-62,icon:'⛲',en:'Plaza de la Independencia',es:'Plaza de la Independencia'},
 {id:'canal',x:-62,z:-74,icon:'🚢',en:'Panama Canal model',es:'Maqueta del Canal de Panamá'}
];
export const CITY_RALLY=[
 {x:-73,z:-91},{x:-113,z:-107},{x:-143,z:-82},{x:-106,z:-47}
];
export const CITY_DELIVERY=[
 {x:-68,z:-64,en:'Waterfront apartment',es:'Apartamento del malecón'},
 {x:-116,z:-109,en:'Southern neighborhood',es:'Barrio del sur'},
 {x:-138,z:-48,en:'Volcano-view homes',es:'Casas con vista al volcán'}
];
export function createCityExpansion({T,group,scene,state,make,mat,box,ball,cylinder,cone,height,surfaces=null,save,refresh,joy,tell,coinAward,onWash=()=>{}}){
 const city=state.world.city,a=city.activities,es=state.lang==='es',choose=(x,y)=>es?x:y;
 const coord=(dx,dz)=>({x:-100+dx,z:-74+dz});
 const asph=mat('#3c424c',{map:surfaces?.asphalt,bumpMap:surfaces?.asphalt,bumpScale:.035,roughness:1}),
  stripe=mat('#eed89c'),white=mat('#e9ecec'),walk=mat('#bbc5bd',{map:surfaces?.stone}),
  green=mat('#75a783',{map:surfaces?.grass}),grass=mat('#5f9b67'),
  stone=mat('#99948b',{map:surfaces?.stone,bumpMap:surfaces?.stone,bumpScale:.06}),
  wood=mat('#957258',{map:surfaces?.wood}),blue=mat('#64b9cf'),red=mat('#d77c76'),
  gold=mat('#ffdb7f',{emissive:'#b5801f',emissiveIntensity:.18}),
  glass=mat('#b6e2e9',{metalness:.16,roughness:.28}),
  brown=mat('#b88f72',{map:surfaces?.plaster}),dark=mat('#414a4e');
 const palette=['#e9b29c','#93c5b9','#e8d39e','#b7b4d8','#f2c1be','#a9cfbd'].map(c=>mat(c,{map:surfaces?.plaster}));
 const roof=mat('#bb745d',{map:surfaces?.roof});
 const makeObj=(geo,m,x,y,z,w,h,d,parent=group)=>make(geo,m,x,y,z,w,h,d,parent);
 // Aggregate thousands of repeated wall/window/road-mark transforms into a
 // handful of GPU instanced draws rather than one WebGL draw per object.
 const batches=new Map();
 function decorate(geo,m,x,y,z,w,h,d){
  if(typeof T.InstancedMesh!=='function'||typeof T.Object3D!=='function'){
   const obj=makeObj(geo,m,x,y,z,w,h,d);obj.castShadow=false;return;
  }
  let byMat=batches.get(geo);if(!byMat){byMat=new Map();batches.set(geo,byMat);}
  let transforms=byMat.get(m);if(!transforms){transforms=[];byMat.set(m,transforms);}
  transforms.push({x,y,z,w,h,d});
 }
 function flushDecor(){
  if(typeof T.InstancedMesh!=='function'||typeof T.Object3D!=='function')return;
  const dummy=new T.Object3D();
  for(const [geo,byMat]of batches)for(const [material,positions]of byMat){
   const instances=new T.InstancedMesh(geo,material,positions.length);
   instances.name='Casco Viejo batched architecture';instances.castShadow=false;instances.receiveShadow=true;
   positions.forEach((v,i)=>{dummy.position.set(v.x,v.y,v.z);dummy.scale.set(v.w,v.h,v.d);dummy.rotation.set(0,0,0);dummy.updateMatrix();instances.setMatrixAt(i,dummy.matrix);});
   instances.instanceMatrix.needsUpdate=true;group.add(instances);
  }
 }
 const markers=[],sprites=[];
 function icon(parent,emoji,x,y,z,size=2.3){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
  const context=canvas.getContext('2d');if(!context)return;
  context.font='98px "Apple Color Emoji","Segoe UI Emoji",sans-serif';context.textAlign='center';
  context.textBaseline='middle';context.fillText(emoji,64,64);
  const tex=new T.CanvasTexture(canvas),material=new T.SpriteMaterial({map:tex,transparent:true,depthTest:false,depthWrite:false});
  const s=new T.Sprite(material);s.position.set(x,y,z);s.scale.set(size,size,1);parent.add(s);sprites.push({tex,material});return s;
 }
 // Roads follow the island's actual surface with lightweight instancing.
 const chunks=[];
 const road=(x,z,w,d)=>{chunks.push({x,z,w,d});};
 const xs=[-43,-29,-15,0,15,29,43],zs=[-35,-23,-11,2,15,27,38];
 for(const dx of xs)for(let dz=-42;dz<=42;dz+=5){
  const norm=(dx/58)**2+(dz/48)**2;if(norm>.82)continue;
  road(-100+dx,-74+dz,6.0,5.25);
 }
 for(const dz of zs)for(let dx=-52;dx<=52;dx+=5){
  const norm=(dx/58)**2+(dz/48)**2;if(norm>.82)continue;
  road(-100+dx,-74+dz,5.25,6.0);
 }
 // Seaside ring road. Outer street loops around the outer neighborhoods.
 for(let i=0;i<104;i++){
  const angle=(i+.5)/104*Math.PI*2,x=-100+Math.cos(angle)*48.4,z=-74+Math.sin(angle)*40.0;
  const tangent=Math.atan2(Math.cos(angle)*48.4,-Math.sin(angle)*40);
  chunks.push({x,z,w:4.8,d:4.0,rot:-tangent});
 }
 if(typeof T.InstancedMesh==='function'&&typeof T.Object3D==='function'){
  const roads=new T.InstancedMesh(box,asph,chunks.length);roads.name='Casco Viejo connected road network';
  roads.castShadow=false;roads.receiveShadow=true;
  const dummy=new T.Object3D();
  chunks.forEach((r,i)=>{
   dummy.position.set(r.x,height(r.x,r.z)+.095,r.z);dummy.scale.set(r.w,.16,r.d);
   dummy.rotation.y=r.rot||0;dummy.updateMatrix();roads.setMatrixAt(i,dummy.matrix);
  });
  roads.instanceMatrix.needsUpdate=true;group.add(roads);
 }else for(const r of chunks){const m=makeObj(box,asph,r.x,height(r.x,r.z)+.095,r.z,r.w,.16,r.d);m.rotation.y=r.rot||0;m.castShadow=false;}
 // Painted lines and crossings: repeated street detail without large textures.
 for(const dx of xs)for(let k=-34;k<=34;k+=9){
  const x=-100+dx,z=-74+k;if((dx/58)**2+(k/48)**2>.78)continue;
  decorate(box,stripe,x,height(x,z)+.22,z,.11,.035,2.6);
 }
 for(const dz of zs)for(let k=-43;k<=43;k+=10){
  const x=-100+k,z=-74+dz;if((k/58)**2+(dz/48)**2>.78)continue;
  decorate(box,stripe,x,height(x,z)+.22,z,2.6,.035,.11);
 }
 // Seven neighborhoods, ~50 distinct buildings with color and height variation.
 let buildingCount=0;
 const reserved=[...CITY_SITES,{x:-84,z:-60},{x:-106,z:-74},{x:-82,z:-68},{x:-97,z:-75},{x:-100,z:-62},
  ...CITY_DELIVERY,...CITY_RALLY,{x:-82,z:-68}];
 for(const dx of [-48,-37,-22,-8,8,22,36,48])for(const dz of [-40,-30,-18,-5,9,21,32,42]){
  if((dx/58)**2+(dz/48)**2>.76)continue;
  const x=-100+dx,z=-74+dz;
  if(reserved.some(q=>Math.hypot(q.x-x,q.z-z)<9.2))continue;
  // Avoid overlapping original central colorful houses and pizzeria.
  if(Math.abs(dx)<30&&Math.abs(dz)<27&&((dx+22)**2+(dz+20)**2<110||(dx-12)**2+(dz+20)**2<110||(dx-24)**2+(dz+13)**2<90||(dx+25)**2+(dz-18)**2<90||(dx-13)**2+(dz-21)**2<90))continue;
  const y=height(x,z),w=5.1+(buildingCount%3)*.6,d=5.4+(buildingCount%2)*.55,
   floors=2+(buildingCount%4),h=floors*2.15;
  const walls=palette[buildingCount%palette.length],top=buildingCount%4===0?roof:stone;
  decorate(box,walls,x,y+h/2,z,w,h,d);
  decorate(box,top,x,y+h+.19,z,w+.4,.38,d+.4);
  for(let floor=0;floor<floors;floor++)for(const side of [-1,1]){
   decorate(box,glass,x+side*w*.27,y+1.30+floor*2.15,z+d*.508,.78,1.05,.06);
   decorate(box,wood,x+side*w*.27,y+.82+floor*2.15,z+d*.542,.92,.09,.10);
  }
  decorate(box,wood,x,y+.85,z+d*.55,1.15,1.7,.10);
  if(buildingCount%3===0)decorate(box,stone,x,y+2.1,z+d*.72,w*.65,.14,.75);
  buildingCount++;
 }
 // Seaside walkway, lamps and benches make the outskirts worth exploring.
 for(let i=0;i<30;i++){
  const theta=i*2*Math.PI/30,x=-100+Math.cos(theta)*50,z=-74+Math.sin(theta)*41;
  const y=height(x,z);
  decorate(cylinder,dark,x,y+2,z,.10,4,.10);
  decorate(ball,gold,x,y+4.20,z,.35,.40,.35);
  if(i%3===0){
   decorate(box,wood,x,y+.63,z+.9,2.2,.22,.55);
   for(const q of [-.8,.8])decorate(cylinder,wood,x+q,y+.34,z+.9,.08,.65,.08);
  }
 }
 flushDecor();
 // Independence Plaza: fountain and animated centerpiece.
 const plaza=coord(1,12),fountain=new T.Group();fountain.position.set(plaza.x,height(plaza.x,plaza.z),plaza.z);group.add(fountain);
 makeObj(cylinder,stone,0,.38,0,3.8,.7,3.8,fountain);
 const pool=makeObj(cylinder,blue,0,.77,0,3.22,.09,3.22,fountain);pool.castShadow=false;
 makeObj(cylinder,white,0,1.1,0,.52,.85,.52,fountain);
 icon(fountain,'⛲',0,3,0,2.3);
 // Small Panama Canal landmark with a ship and functioning lock channels.
 const canal=coord(38,0),locks=new T.Group();locks.position.set(canal.x,height(canal.x,canal.z),canal.z);group.add(locks);
 makeObj(box,stone,0,.18,0,7,.35,5,locks);
 makeObj(box,blue,0,.4,0,6,.12,1.75,locks);
 for(const side of [-1,1])makeObj(box,wood,0,.85,side*1.23,6,1.3,.25,locks);
 for(const dx of [-1.65,1.65])makeObj(box,white,dx,.62,0,.15,.42,1.8,locks);
 const ship=new T.Group();ship.position.set(0,.68,0);locks.add(ship);
 makeObj(box,red,0,0,0,1.3,.38,.62,ship);makeObj(box,white,0,.40,-.1,.70,.52,.46,ship);
 icon(locks,'🚢',0,2.8,0,1.9);
 // Soccer: visible pitch, striped goal and ball that reacts to shooting.
 const soccer=CITY_SITES.find(q=>q.id==='soccer'),field=new T.Group();
 field.position.set(soccer.x,height(soccer.x,soccer.z),soccer.z);group.add(field);
 makeObj(box,green,0,.10,0,16,.15,11,field);
 for(const side of [-1,1])makeObj(box,white,side*7.65,.20,0,.11,.035,10.8,field);
 for(const side of [-1,1])makeObj(box,white,0,.20,side*5.3,15,.035,.12,field);
 makeObj(box,white,0,.20,0,.11,.04,10.6,field);
 for(const sx of [-2.4,2.4])makeObj(cylinder,white,sx,1.05,-5.35,.07,2,.07,field);
 makeObj(box,white,0,2.1,-5.35,5,.12,.12,field);
 const football=makeObj(ball,white,0,.48,2.7,.40,.40,.40,field);football.name='Kickable Panama football';
 icon(field,'⚽',-5.6,3,3.7,2.2);
 // Produce market, a mural, history museum, and drive-through wash.
 const market=CITY_SITES.find(q=>q.id==='market'),stall=new T.Group();
 stall.position.set(market.x,height(market.x,market.z),market.z);group.add(stall);
 for(const sx of [-1.5,1.5])makeObj(cylinder,wood,sx,1.7,0,.1,3.4,.1,stall);
 makeObj(box,red,0,3.50,0,4.1,.23,3.2,stall);
 makeObj(box,wood,0,1.06,1.15,3.4,.95,.8,stall);
 for(let i=0;i<9;i++)makeObj(ball,i%3===0?gold:i%3===1?red:green,-1.15+(i%3)*1.14,1.67,.70+Math.floor(i/3)*.35,.22,.21,.23,stall);
 icon(stall,'🥭',0,5,0,2.2);
 const mural=CITY_SITES.find(q=>q.id==='mural'),art=new T.Group();
 art.position.set(mural.x,height(mural.x,mural.z),mural.z);group.add(art);
 makeObj(box,brown,0,2.2,0,8,4.5,.6,art);
 const paintTiles=[];
 for(let i=0;i<5;i++)paintTiles.push(makeObj(box,palette[(i+a.muralColors)%palette.length],-3+i*1.5,2.2,.37,1.42,3.12,.09,art));
 icon(art,'🎨',0,5.9,0,2.3);
 const museum=CITY_SITES.find(q=>q.id==='museum0'),history=new T.Group();
 history.position.set(museum.x,height(museum.x,museum.z),museum.z);group.add(history);
 makeObj(box,stone,0,2.2,0,6,4.3,5,history);
 makeObj(box,white,0,4.6,0,7,.5,6,history);
 for(const x of [-2.3,2.3])makeObj(cylinder,white,x,2.0,2.9,.33,3.55,.33,history);
 makeObj(box,wood,0,1.35,2.92,1.5,2.7,.15,history);
 icon(history,'🏛️',0,7.4,0,2.4);
 const wash=CITY_SITES.find(q=>q.id==='wash'),carWash=new T.Group();
 carWash.position.set(wash.x,height(wash.x,wash.z),wash.z);group.add(carWash);
 for(const x of [-2.7,2.7])makeObj(box,blue,x,2.2,0,.4,4.4,5.4,carWash);
 makeObj(box,blue,0,4.4,0,5.9,.5,5.6,carWash);
 for(const x of [-1.7,1.7])makeObj(cylinder,white,x,2.2,0,.35,3.6,.35,carWash);
 icon(carWash,'🫧',0,6.7,0,2.6);
 const bubbleMat=mat('#d8f5ff',{transparent:true,opacity:.72,roughness:.1,depthWrite:false});
 const washBubbles=[];
 for(let i=0;i<15;i++){
  const a=i*Math.PI*2/15,r=.65+(i%3)*.53;
  const b=makeObj(ball,bubbleMat,Math.sin(a)*r,.6+i%4*.54,Math.cos(a)*r,.16+(i%3)*.07,.19+(i%3)*.08,.17,carWash);
  b.visible=false;washBubbles.push({mesh:b,y:.6+i%4*.54,phase:a});
 }
 // Rally gates + delivery doors are visible landmarks throughout the streets.
 const rally=CITY_SITES.find(q=>q.id==='rally');
 function gate(pos,i){
  const y=height(pos.x,pos.z),root=new T.Group();root.position.set(pos.x,y,pos.z);group.add(root);
  for(const x of [-2.15,2.15])makeObj(cylinder,i%2?white:red,x,1.6,0,.12,3.2,.12,root);
  makeObj(box,i%2?red:white,0,3.2,0,4.6,.34,.28,root);
  icon(root,'🏁',0,4.8,0,2.0);
  return root;
 }
 CITY_RALLY.forEach((p,i)=>gate(p,i));
 const rallyStart=gate(rally,-1);
 CITY_DELIVERY.forEach((p,i)=>{
  const y=height(p.x,p.z),root=new T.Group();root.position.set(p.x,y,p.z);group.add(root);
  makeObj(box,wood,0,.48,0,2.15,.95,.85,root);
  icon(root,'📦',0,2.3,0,2);
 });
 // Walking museum exhibits. Each has a separate physical discovery location.
 CITY_SITES.filter(p=>p.id.startsWith('museum')).forEach((p,i)=>{
  const y=height(p.x,p.z);
  makeObj(cylinder,stone,p.x,y+.52,p.z,.72,1.0,.72);
  makeObj(ball,[gold,green,blue][i],p.x,y+1.3,p.z,.37,.37,.37);
  const holder=new T.Group();holder.position.set(p.x,y,p.z);group.add(holder);
  icon(holder,p.icon,0,3,0,1.8);
 });
 const activityLabels=CITY_SITES.filter(q=>!['museum0','plaza','canal'].includes(q.id));
 for(const p of activityLabels){const y=height(p.x,p.z);
  const holder=new T.Group();holder.position.set(p.x,y,p.z);group.add(holder);
  icon(holder,p.icon,0,p.id==='wash'?7:4,0,2.1);markers.push({p,holder});
 }
 const near=(x,z,max=5.5)=>CITY_SITES.filter(q=>Math.hypot(x-q.x,z-q.z)<max)
   .sort((u,v)=>Math.hypot(x-u.x,z-u.z)-Math.hypot(x-v.x,z-v.z))[0]||null;
 const race={active:false,index:0,elapsed:0},soccerAnimation={time:0,scored:false},washCooldown={time:0};
 let cityWaypoint=null;
 function earned(id){return coinAward(id)||0}
 function success(esText,enText,id=null){const coins=id?earned(id):0;joy.effect('correct');
  tell(esText+(coins?' +'+coins+' 🪙':''),enText+(coins?' +'+coins+' 🪙':''));save();refresh();}
 function activityPrompt(x,z,driving=false){
  const place=near(x,z);
  if(!place)return null;
  const title=choose(place.es,place.en);
  if(driving)return place.id==='wash'?'🫧 '+title:null;
  if(place.id==='wash')return '🚙 '+choose('Entra con el auto','Drive through the wash');
  if(place.id==='rally')return race.active?choose('🏁 Carrera en curso','🏁 Race in progress'):'🏁 '+choose('Empezar carrera','Start street rally');
  if(place.id==='soccer')return '⚽ '+choose('¡Patear el balón!','Kick the football');
  if(place.id==='market')return '🥭 '+choose('Intercambiar un plátano','Trade a banana');
  if(place.id==='mural')return '🎨 '+choose('Pintar el mural','Paint the mural');
  if(place.id.startsWith('museum'))return place.icon+' '+choose('Ver exhibición','Explore exhibit');
  if(place.id==='plaza'||place.id==='canal')return place.icon+' '+choose('Descubrir','Explore');
  return '🎮 '+title;
 }
 function beginDelivery(){
  if(a.deliveries.length===3)a.deliveries=[];
  a.deliveryActive=true;save();refresh();
  tell('🍕 ¡Entrega pizzas! Sube al auto y sigue los 📦 por la ciudad.',
   '🍕 Pizza delivery! Drive to the 📦 doorsteps around the city.');
 }
 function interactAt(x,z,driving=false){
  const p=near(x,z);if(!p||driving)return false;
  switch(p.id){
   case 'rally':
    if(race.active){tell('🏁 ¡Sube al auto y cruza los arcos de carrera!','🏁 Drive through the race gates!');return true;}
    race.active=true;race.index=0;race.elapsed=0;
    tell('🏁 ¡Carrera iniciada! Conduce por los 4 arcos 🏁 antes de 120 segundos.',
     '🏁 Rally started! Drive through all four 🏁 gates in 120 seconds.');
    joy.effect('tap');return true;
   case 'soccer':{
    if(soccerAnimation.time>0)return true;
    const shot=Math.abs(Math.sin(performance.now()*.0035));const goal=shot<.76;
    a.soccerShots=Math.min(999,a.soccerShots+1);if(goal)a.soccerGoals=Math.min(999,a.soccerGoals+1);
    soccerAnimation.time=1.35;soccerAnimation.scored=goal;football.position.set(0,.48,2.7);
    if(goal)success('⚽ ¡GOL! '+a.soccerGoals+' / 3','⚽ GOAL! '+a.soccerGoals+' / 3',
      a.soccerGoals===3?'city-soccer':null);
    else success('⚽ ¡Casi! Espera el momento y vuelve a patear.','⚽ So close! Time the next kick.');
    return true;
   }
   case 'market':
    if((state.world.food?.banana||0)<1){
     tell('🥭 El mercado necesita 1 🍌. Busca plátanos en Bocas del Toro.',
      '🥭 Bring 1 🍌 banana from Bocas del Toro to trade at the market.');return true;
    }
    state.world.food.banana--;a.marketTrades=Math.min(999,a.marketTrades+1);
    success('🥭 ¡Vendiste un plátano en el mercado!','🥭 You traded a banana at the market!',
      a.marketTrades<=3?'city-market-'+a.marketTrades:null);return true;
   case 'mural':
    if(a.muralColors>=4){tell('🎨 ¡El mural panameño está terminado!','🎨 Your Panama mural is finished!');return true;}
    a.muralColors++;
    for(let k=0;k<paintTiles.length;k++)paintTiles[k].material=palette[(k+a.muralColors)%palette.length];
    success('🎨 ¡Pintaste el mural! '+a.muralColors+'/4','🎨 You painted the mural! '+a.muralColors+'/4',
      a.muralColors===4?'city-mural':null);return true;
   case 'wash':
    tell('🚙 Entra al túnel con tu carro para lavarlo.','🚙 Drive your car into the wash tunnel.');return true;
   case 'plaza':success('⛲ ¡Descubriste la Plaza de la Independencia!','⛲ You discovered Independence Plaza!','city-plaza');return true;
   case 'canal':success('🚢 ¡Aprendiste sobre las esclusas del Canal de Panamá!','🚢 You discovered the Panama Canal locks!','city-canal');return true;
   default:
    if(p.id.startsWith('museum')){
     const index=Number(p.id.slice(-1));
     if(!a.museum.includes(index)){
      a.museum.push(index);
      const facts=[
       ['Casco Viejo es el barrio histórico de la Ciudad de Panamá.','Casco Viejo is Panama City’s historic neighborhood.'],
       ['Panamá tiene bosques tropicales, playas y una enorme variedad de animales.','Panama has tropical forests, beaches and incredible wildlife.'],
       ['El Canal de Panamá conecta el océano Atlántico con el océano Pacífico.','The Panama Canal connects the Atlantic and Pacific oceans.']
      ];
      success(p.icon+' '+facts[index][0]+' Sello '+a.museum.length+'/3!',
        p.icon+' '+facts[index][1]+' Stamp '+a.museum.length+'/3!','city-museum-'+index);
     }else tell('🏛️ ¡Ya tienes este sello! Busca las otras exposiciones.',
      '🏛️ Stamp collected! Discover the other museum exhibits.');
     return true;
    }
  }
  return false;
 }
 function update(dt,active,{x,z,driving=false,flying=false,indoors=false}={}){
  if(soccerAnimation.time>0){
   soccerAnimation.time=Math.max(0,soccerAnimation.time-dt);
   const t=1-soccerAnimation.time/1.35;
   football.position.y=.48+Math.sin(t*Math.PI)*1.45;
   football.position.z=2.7-(soccerAnimation.scored?7.8:4.2)*t;
   football.position.x=soccerAnimation.scored?0:Math.sin(t*Math.PI)*2.4;
   if(soccerAnimation.time===0)football.position.set(0,.48,2.7);
  }
  pool.rotation.y=Math.sin(performance.now()*.0003)*.012;
  ship.position.z=Math.sin(performance.now()*.0005)*.45;
  for(const b of washBubbles){
   b.mesh.visible=washCooldown.time>9;
   if(b.mesh.visible)b.mesh.position.y=b.y+Math.sin(performance.now()*.005+b.phase)*.23;
  }
  if(cityWaypoint&&Math.hypot(x-cityWaypoint.x,z-cityWaypoint.z)<7.5)cityWaypoint=null;
  if(!active||indoors||flying)return;
  if(race.active&&driving){
   race.elapsed+=dt;
   const next=CITY_RALLY[race.index];
   if(Math.hypot(x-next.x,z-next.z)<5.1){
    race.index++;joy.effect('coin');
    if(race.index>=CITY_RALLY.length){
     a.rallyWins=Math.min(999,a.rallyWins+1);
     a.rallyBest=!a.rallyBest?race.elapsed:Math.min(a.rallyBest,race.elapsed);
     race.active=false;success('🏁 ¡Completaste la carrera en '+race.elapsed.toFixed(1)+'s!',
       '🏁 Rally finished in '+race.elapsed.toFixed(1)+'s!','city-rally');
    }else tell('🏁 ¡Bien! Próximo arco '+(race.index+1)+'/4.',
     '🏁 Great! Next gate '+(race.index+1)+'/4.');
   }
   if(race.active&&race.elapsed>=120){race.active=false;tell('⏱️ Se acabó el tiempo. ¡Inténtalo otra vez!',
    '⏱️ Time is up. Try the rally again!');}
  }
  if(driving&&a.deliveryActive){
   for(let i=0;i<CITY_DELIVERY.length;i++){
    const dest=CITY_DELIVERY[i];
    if(a.deliveries.includes(i)||Math.hypot(x-dest.x,z-dest.z)>4.8)continue;
    a.deliveries.push(i);
    success('🍕 ¡Pizza entregada! '+a.deliveries.length+'/3',
      '🍕 Pizza delivered! '+a.deliveries.length+'/3','city-delivery-'+i);
    if(a.deliveries.length===3){
     a.deliveryActive=false;success('🍕 ¡Todas las pizzas entregadas! ¡Misión completa!',
      '🍕 All three pizzas delivered! Mission complete!','city-delivery-finish');
    }
    break;
   }
  }
  if(driving&&washCooldown.time<=0&&Math.hypot(x-CITY_SITES[7].x,z-CITY_SITES[7].z)<3){
   washCooldown.time=12;a.carWashes=Math.min(999,a.carWashes+1);onWash();
   success('🫧 ¡Carro limpio y brillante!','🫧 Your car is sparkling clean!',
    a.carWashes===1?'city-carwash':null);
  }
  washCooldown.time=Math.max(0,washCooldown.time-dt);
 }
 function status(){
  if(race.active)return '🏁 '+(race.index+1)+'/4  ·  '+Math.ceil(Math.max(0,120-race.elapsed))+'s';
  if(a.deliveryActive)return '🍕 '+a.deliveries.length+'/3  ·  📦';
  if(cityWaypoint)return '📍 '+(es?cityWaypoint.es:cityWaypoint.en);
  return '🏁 '+a.rallyWins+'   ⚽ '+a.soccerGoals+'   🏛️ '+a.museum.length+'/3';
 }
 function goal(){if(race.active)return CITY_RALLY[race.index];
  if(a.deliveryActive)return CITY_DELIVERY.find((_,i)=>!a.deliveries.includes(i))||null;
  return cityWaypoint;
 }
 function setWaypoint(id){
  cityWaypoint=CITY_SITES.find(p=>p.id===id)||null;return cityWaypoint;
 }
 function aimReady(){return Math.abs(Math.sin(performance.now()*.0035))<.76;}
 function dispose(){for(const b of sprites){b.tex.dispose();b.material.dispose();}batches.clear();}
 return {sites:CITY_SITES,near,activityPrompt,interactAt,beginDelivery,update,status,goal,setWaypoint,aimReady,dispose,roadCount:chunks.length,buildingCount};
}

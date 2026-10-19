import {STREET_VENDORS,BARRIO_HOMES} from './city-street-life.js?v=167';
import {CITY_EXPANSION_PLOTS,CITY_STREET_X,CITY_STREET_Z} from './city-layout.js?v=167';
import {createPurpleApartment,PURPLE_APARTMENT} from './purple-apartment.js?v=156';
import {spendFood} from './explore-state.js?v=156';
/* Panama Adventure — substantial zero-dependency Casco Viejo city expansion.
   Roads and landmark buildings are genuine Three.js meshes; activities update
   game state only on meaningful user actions and persist in world.city. */
export const CITY_SITES=[
 {id:'rally',x:(114),z:(-64),icon:'🏁',en:'City driving rally',es:'Carrera por la ciudad'},
 {id:'soccer',x:120,z:-23,icon:'⚽',en:'Football challenge',es:'Reto de fútbol'},
 {id:'market',x:150,z:-48,icon:'🥭',en:'Panama Fruit Market',es:'Mercado de Frutas de Panamá'},
 {id:'mural',x:91,z:-73,icon:'🎨',en:'Casco Viejo street art',es:'Murales del Casco Viejo'},
 {id:'museum0',x:(142),z:(-79),icon:'🏛️',en:'History exhibit',es:'Exhibición de historia'},
 {id:'museum1',x:(152),z:(-77),icon:'🦋',en:'Panama nature exhibit',es:'Exhibición de naturaleza'},
 {id:'museum2',x:(131),z:(-81),icon:'🚢',en:'Canal exhibit',es:'Exhibición del Canal'},
 {id:'wash',x:88,z:-48,icon:'🫧',en:'Drive-through car wash',es:'Lavado de autos'},
 {id:'plaza',x:120,z:-73,icon:'⛲',en:'Plaza de la Independencia',es:'Plaza de la Independencia'},
 {id:'canal',x:66,z:-65,icon:'🚢',en:'Panama Canal cruise terminal',es:'Terminal de cruceros del Canal de Panamá'}
];
export const CITY_RALLY=[
 {x:(147),z:(-67)},{x:(107),z:(-83)},{x:(77),z:(-58)},{x:(114),z:(-23)}
];
export const CITY_DELIVERY=[
 {x:(152),z:(-40),en:'Waterfront apartment',es:'Apartamento del malecón'},
 {x:(104),z:(-85),en:'Southern neighborhood',es:'Barrio del sur'},
 {x:(82),z:(-24),en:'Volcano-view homes',es:'Casas con vista al volcán'}
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
 // Continuous city-grade asphalt foundation; streets read as one urban surface.
 // Deliberately use one mesh rather than hundreds of overlapping road tiles.
 const cityBase=new T.Mesh(new T.CircleGeometry(1,96),asph);
 cityBase.name='Panama City continuous urban asphalt ground';
 cityBase.rotation.x=-Math.PI/2;cityBase.scale.set(52,43,1);
 cityBase.position.set(120,1.64,-50);cityBase.receiveShadow=true;cityBase.castShadow=false;group.add(cityBase);
 // Pave neighborhood ground with the same asphalt; retain all plot geometry
 // and elevations so nearby buildings, roads and activities stay unchanged.
 const urbanPlots=[[98,-19,11,8],[91,-29,7,5],[140,-33,8,6],
  [101,-65,8,6],[132,-67,9,6],[145,-19,7,5],[82,-47,7,5],
  [120,-12,7,5],[153,-55,6,5]];
 const plotGeo=new T.CircleGeometry(1,28);
 for(const [px,pz,rx,rz] of urbanPlots){
  const plot=new T.Mesh(plotGeo,asph);
  plot.name='Asphalt city neighborhood plot';
  plot.rotation.x=-Math.PI/2;plot.scale.set(rx,rz,1);
  plot.position.set(px,1.67,pz);plot.receiveShadow=true;plot.castShadow=false;group.add(plot);
 }
 // Roads follow the island's actual surface with lightweight instancing.
 const chunks=[];
 const road=(x,z,w,d)=>{chunks.push({x,z,w,d});};
 const xs=CITY_STREET_X.map(x=>x-120),zs=CITY_STREET_Z.map(z=>z+50);
 for(const dx of xs)for(let dz=-42;dz<=42;dz+=2.5){
  const norm=(dx/58)**2+(dz/48)**2;if(norm>.82)continue;
  road(120+dx,-50+dz,6.15,3.15);
 }
 for(const dz of zs)for(let dx=-52;dx<=52;dx+=2.5){
  const norm=(dx/58)**2+(dz/48)**2;if(norm>.82)continue;
  road(120+dx,-50+dz,3.15,6.15);
 }
 // Seaside ring road. Outer street loops around the outer neighborhoods.
 for(let i=0;i<104;i++){
  const angle=(i+.5)/104*Math.PI*2,x=(120)+Math.cos(angle)*48.4,z=(-50)+Math.sin(angle)*40.0;
  const tangent=Math.atan2(Math.cos(angle)*48.4,-Math.sin(angle)*40);
  chunks.push({x,z,w:5.7,d:5.0,rot:-tangent});
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
  const x=(120)+dx,z=(-50)+k;if((dx/58)**2+(k/48)**2>.78)continue;
  decorate(box,stripe,x,height(x,z)+.22,z,.11,.035,2.6);
 }
 for(const dz of zs)for(let k=-43;k<=43;k+=10){
  const x=(120)+k,z=(-50)+dz;if((k/58)**2+(dz/48)**2>.78)continue;
  decorate(box,stripe,x,height(x,z)+.22,z,2.6,.035,.11);
 }
 // The layout plan owns each street-free building plot, with shared setbacks.
 let buildingCount=0;
 for(const {x,z} of CITY_EXPANSION_PLOTS){
  const y=height(x,z),w=5.1,d=5.8,floors=2+(buildingCount%4),h=floors*2.15;
  const walls=palette[buildingCount%palette.length],top=buildingCount%4===0?roof:stone;
  decorate(box,walls,x,y+h/2,z,w,h,d);
  decorate(box,top,x,y+h+.19,z,w+.2,.38,d+.2);
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
  const theta=i*2*Math.PI/30,x=(120)+Math.cos(theta)*50,z=(-50)+Math.sin(theta)*41;
  const y=height(x,z);
  decorate(cylinder,dark,x,y+2,z,.10,4,.10);
  decorate(ball,gold,x,y+4.20,z,.35,.40,.35);
  if(i%3===0){
   decorate(box,wood,x,y+.63,z+.9,2.2,.22,.55);
   for(const q of [-.8,.8])decorate(cylinder,wood,x+q,y+.34,z+.9,.08,.65,.08);
  }
 }
 flushDecor();
 createPurpleApartment({T,group,make,mat,box,height});
 // Plaza water feature removed; city streets remain unchanged.
 // Emoji flags are easier to recognize and stay consistent with the game logo.
 const cityFlags=[];
 const flagPositions=[[(120),(-38),9],[(103),(-62),7],[(138),(-63),7],[(98),(-30),7],[(143),(-31),7],[(117),(-84),7.5]];
 for(const [x,z,h] of flagPositions){
  const pole=new T.Group();pole.name='🇵🇦 Bandera de Panamá';pole.position.set(x,height(x,z),z);group.add(pole);
  makeObj(cylinder,stone,0,.25,0,.6,.5,.6,pole);
  makeObj(cylinder,white,0,h/2,0,.085,h,.085,pole);
  makeObj(ball,gold,0,h+.12,0,.2,.2,.2,pole);
  icon(pole,'🇵🇦',1.65,h-1.05,0,3.4);
 }
 // The full-size canal and its single ocean liner are owned by canal-cruise.js.
 // An inhabited city: people cross plazas and sidewalks on independent routes.
 const pedestrians=[];
 for(let i=0;i<8;i++){
  const g=new T.Group();g.name='Casco Viejo pedestrian '+(i+1);group.add(g);
  const clothing=palette[i%palette.length],personSkin=mat(i%2?'#c78c67':'#a87451');
  makeObj(cylinder,clothing,0,1.02,0,.23,.72,.23,g);
  makeObj(ball,personSkin,0,1.67,0,.23,.27,.22,g);
  const legs=[-.13,.13].map(dx=>{const limb=new T.Group();limb.position.set(dx,.72,0);g.add(limb);makeObj(cylinder,dark,0,-.38,0,.095,.64,.095,limb);return limb;});
  pedestrians.push({g,legs,i});
 }
 // Soccer: visible pitch, striped goal and ball that reacts to shooting.
 const soccer=CITY_SITES.find(q=>q.id==='soccer'),field=new T.Group();
 field.position.set(soccer.x,height(soccer.x,soccer.z),soccer.z);group.add(field);
 makeObj(box,asph,0,.10,0,20,.15,14,field);
 for(const side of [-1,1])makeObj(box,white,side*9.9,.20,0,.11,.035,13.7,field);
 for(const side of [-1,1])makeObj(box,white,0,.20,side*6.9,19.7,.035,.12,field);
 makeObj(box,white,0,.20,0,19.7,.04,.11,field);
 for(const sx of [-2.4,2.4])makeObj(cylinder,white,sx,1.05,-6.9,.07,2,.07,field);
 makeObj(box,white,0,2.1,-6.9,5,.12,.12,field);
 const football=makeObj(ball,white,0,.52,4.5,.52,.52,.52,field);football.name='Kickable Panama football';
 icon(field,'⚽',-10,3,6,2.2);
 // Animated teammate/opponent: a full world-scale friend, not an interface icon.
 const teammate=new T.Group();teammate.name='Soccer friend Kai';field.add(teammate);
 const tSkin=mat('#ba8768'),tShirt=mat('#50add0'),tShort=mat('#385d83'),tHair=mat('#49332c');
 makeObj(cylinder,tShirt,0,1.08,0,.23,.58,.23,teammate);
 makeObj(ball,tSkin,0,1.61,0,.23,.27,.23,teammate);
 makeObj(ball,tHair,0,1.79,-.04,.235,.13,.21,teammate);
 const teammateLegs=[-.13,.13].map(v=>{const g=new T.Group();g.position.set(v,.70,0);teammate.add(g);makeObj(cylinder,tShort,0,-.16,0,.13,.34,.13,g);makeObj(cylinder,tSkin,0,-.43,0,.075,.35,.075,g);return g;});
 const teammateArms=[-.32,.32].map(v=>{const g=new T.Group();g.position.set(v,1.3,0);teammate.add(g);makeObj(cylinder,tSkin,0,-.23,0,.07,.48,.07,g);return g;});
 for(const side of [-1,1]){makeObj(box,white,side*9.6,.23,0,.14,.04,13.7,field);makeObj(box,white,0,.23,side*6.8,19.7,.04,.12,field);}
 makeObj(cylinder,white,0,.24,0,2,.04,2,field);
 const soccerBall={vx:0,vz:0,vy:0,cooldown:0,shotCooldown:0,owner:'free'};

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
 const near=(x,z,max=5.5)=>Math.hypot(x-soccer.x-football.position.x,z-soccer.z-football.position.z)<2.7?soccer:CITY_SITES.filter(q=>q.id!=='soccer'&&Math.hypot(x-q.x,z-q.z)<max)
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
    if(soccerBall.shotCooldown>0)return true;
    soccerBall.shotCooldown=.8;
    a.soccerShots=Math.min(999,a.soccerShots+1);soccerBall.cooldown=.8;
    soccerBall.owner='angelique';soccerBall.vx=-football.position.x*1.2;
    soccerBall.vz=-27;soccerBall.vy=3.4;
    tell('⚽ ¡Tiro! Sigue el balón hasta la portería.','⚽ Shot! Follow the ball into the goal.');return true;
   }
   case 'market':
    if(!spendFood(state.world,'banana')){
     tell('🥭 El mercado necesita 1 🍌. Busca plátanos en Bocas del Toro.',
      '🥭 Bring 1 🍌 banana from Bocas del Toro to trade at the market.');return true;
    }
    a.marketTrades=Math.min(999,a.marketTrades+1);
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
  if(!active||indoors)return;
  for(const p of pedestrians){
   const a=performance.now()*.00017*(p.i%3+1)+p.i*1.7;
   const cx=93+(p.i%4)*18,cz=p.i<4?-56:-30;
   const px=cx+Math.cos(a)*.6,pz=cz+Math.sin(a)*.6;
   p.g.position.set(px,height(px,pz),pz);p.g.rotation.y=-a;
   p.legs.forEach((leg,j)=>leg.rotation.x=Math.sin(a*22+j*Math.PI)*.35);
  }
  const nearField=Math.hypot(x-soccer.x,z-soccer.z)<28;
  if(nearField&&active&&!driving&&!flying&&!indoors){
   const px=x-soccer.x,pz=z-soccer.z;
   const bx=football.position.x,bz=football.position.z;
   // Angelique dribbles by walking into the ball; the field itself is playable.
   if(Math.hypot(px-bx,pz-bz)<1.4&&soccerBall.cooldown<=0){
    const dx=bx-px,dz=bz-pz,d=Math.max(.01,Math.hypot(dx,dz));
    soccerBall.vx=dx/d*5.5;soccerBall.vz=dz/d*5.5;soccerBall.vy=1.5;
    soccerBall.owner='angelique';soccerBall.cooldown=.45;
   }
  }
  const goalX=football.position.x,goalZ=football.position.z;
  // Kai runs after the live ball, stops beside it and occasionally passes it.
  const tx=Math.max(-10,Math.min(10,goalX)),tz=Math.max(-7,Math.min(7,goalZ+1.4));
  const diffX=tx-teammate.position.x,diffZ=tz-teammate.position.z,dist=Math.hypot(diffX,diffZ);
  const step=Math.min(dist,dt*2.8);
  if(dist>.2){teammate.position.x+=diffX/dist*step;teammate.position.z+=diffZ/dist*step;teammate.rotation.y=Math.atan2(diffX,diffZ);}
  const swing=dist>.4?Math.sin(performance.now()*.010)*.55:0;
  teammateLegs.forEach((l,i)=>l.rotation.x=swing*(i?1:-1));
  teammateArms.forEach((a,i)=>a.rotation.x=swing*(i?-1:1)*.4);
  soccerBall.cooldown=Math.max(0,soccerBall.cooldown-dt);soccerBall.shotCooldown=Math.max(0,soccerBall.shotCooldown-dt);
  if(dist<1.1&&soccerBall.cooldown===0&&Math.abs(soccerBall.vz)+Math.abs(soccerBall.vx)<2.1){
   soccerBall.vx=(x-soccer.x-football.position.x)*.7;
   soccerBall.vz=(z-soccer.z-football.position.z)*.7;
   soccerBall.vy=1.4;soccerBall.cooldown=1.2;soccerBall.owner='kai';
  }
  if(Math.abs(soccerBall.vx)+Math.abs(soccerBall.vz)+soccerBall.vy>.02){
   football.position.x+=soccerBall.vx*dt;football.position.z+=soccerBall.vz*dt;
   football.position.y=Math.max(.52,football.position.y+soccerBall.vy*dt);
   soccerBall.vy-=dt*11;
   if(football.position.y<=.52){soccerBall.vy=Math.max(0,-soccerBall.vy*.25);soccerBall.vx*=Math.pow(.985,dt*30);soccerBall.vz*=Math.pow(.985,dt*30);}
   soccerBall.vx*=Math.pow(.91,dt*10);soccerBall.vz*=Math.pow(.91,dt*10);
   football.rotation.x+=soccerBall.vz*dt/ .52;football.rotation.z-=soccerBall.vx*dt/.52;
   if(Math.abs(football.position.x)>12.9){football.position.x=Math.sign(football.position.x)*12.9;soccerBall.vx*=-.55;}
   if(football.position.z<-9.15&&Math.abs(football.position.x)<2.4&&football.position.y<2.05){
     football.position.set(0,.52,4.5);soccerBall.vx=soccerBall.vz=soccerBall.vy=0;
     if(soccerBall.owner==='angelique'){a.soccerGoals=Math.min(999,a.soccerGoals+1);success('⚽ ¡Gol de Angelique!','⚽ Angelique scored!',a.soccerGoals===3?'city-soccer':null);}
   }else if(Math.abs(football.position.z)>9.2){football.position.z=Math.sign(football.position.z)*9.2;soccerBall.vz*=-.5;}
  }

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
 return {sites:CITY_SITES,near,activityPrompt,interactAt,beginDelivery,update,status,goal,setWaypoint,aimReady,dispose,roadCount:chunks.length,buildingCount,soccerPosition:()=>({x:soccer.x+football.position.x,z:soccer.z+football.position.z}),npcKick:()=>{if(soccerBall.cooldown>0||Math.hypot(soccerBall.vx,soccerBall.vz)>6)return;soccerBall.owner='barrio';soccerBall.cooldown=1.2;soccerBall.vx=(Math.random()-.5)*8;soccerBall.vz=(football.position.z>0?-1:1)*5;soccerBall.vy=1.8;}};
}


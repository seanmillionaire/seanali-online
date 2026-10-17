import {explorePlaces,earnCoins} from './explore-state.js?v=43';
import {oceanModel} from './ocean-models.js?v=38';
import {createAnimalDetails} from './animal-details.js?v=1';
// Repeatable, optional play with six friends in the 3D world.
export const islandFriends=[
 {id:'pip',icon:'🐢',name:'Pip',where:['Bahía de Pip','Pip’s Bay'],game:['Búsqueda de conchas','Shell hunt'],hello:['¡Angelique! ¿Buscamos conchitas juntos?','Angelique! Shall we look for shells together?']},
 {id:'dori',icon:'🐬',name:'Dori',where:['Muelle de delfines','Dolphin Dock'],game:['Fiesta de burbujas','Bubble splash party'],hello:['¡Hola, Angelique! ¡Vamos a saltar y jugar!','Hi Angelique! Let’s splash and play!']},
 {id:'mila',icon:'🦜',name:'Mila',where:['Isla de Plátanos','Banana Island'],game:['Música de loro','Parrot music'],hello:['¡Pío, pío! ¡Hagamos una canción!','Squawk, squawk! Let’s make a song!']},
 {id:'ollie',icon:'🪶',name:'Ollie',where:['Bosque de Luciérnagas','Firefly Forest'],game:['Luces escondidas','Find the fireflies'],hello:['¡Mis luciérnagas se escondieron!','My firefly friends are hiding!']},
 {id:'luna',icon:'🦀',name:'Luna',where:['Cala Cristal','Crystal Cove'],game:['Baile de cangrejo','Crab dance party'],hello:['¡Angelique! ¡Baila como un cangrejo conmigo!','Angelique! Do the crab dance with me!']},
 {id:'kai',icon:'👦',name:'Kai',where:['Isla de Cocos','Coconut Island'],game:['Pelota de playa','Beach-ball toss'],hello:['¡Hola! ¡Te guardé la pelota de playa!','Hey! I saved the beach ball for you!']}
];
export function createWildlifeFriends({T,scene,camera,host,panel,state,make,mat,geometry,ball,cone,cylinder,height,joy,save,refresh,onTravel,onOpen,onLessons,onMount=()=>{},motion}){
 const s=state.world,es=state.lang==='es',say=(a,b)=>es?a:b,tr=a=>a[es?0:1];
 s.friends??={visits:[],completed:[],companion:null};
 const friends=s.friends,nodes=new Map(),labels=[],temp=new T.Vector3();
 const place=id=>explorePlaces.find(p=>p.id===id);
 const destination=id=>id==='dori'?{x:4,z:16}:id==='kai'?{x:105,z:10}:place(id);
 const home=id=>id==='dori'?{x:8,z:20}:id==='kai'?{x:105,z:10}:place(id);
 const el=(tag,cls='',text)=>{const n=document.createElement(tag);n.className=cls;if(text!==undefined)n.textContent=text;return n;};
 const btn=(text,cls,callback)=>{const b=el('button',cls,text);b.type='button';b.addEventListener('click',()=>{joy.gesture();joy.effect('tap');callback();});return b;};
 const green=mat('#55a878'),cream=mat('#fff1ce'),ink=mat('#26454e'),pink=mat('#e998b9'),gold=mat('#ffd36c'),yellow=mat('#f1b75c');
 const sphere=(g,m,x,y,z,a,b,c)=>make(ball,m,x,y,z,a,b,c,g);
 let time=0,opened=null,step=0,gameActive=false,mounted=null;
 function model(friend){
  const g=new T.Group(),p=home(friend.id);g.name='Playable friend: '+friend.name;g.userData.friendId=friend.id;scene.add(g);
  const moving=[],other={};
  if(friend.id==='pip'||friend.id==='dori'){
   const aquatic=oceanModel(T,{geometry,mat,make,ball},friend.id==='pip'?'Sea turtle':'Dolphin');
   g.add(aquatic.g);aquatic.g.scale.setScalar(friend.id==='pip'?1.45:1.3);moving.push(...aquatic.moving);
   if(friend.id==='pip')sphere(g,cream,0,.3,1.27,.13,.08,.1);
   else sphere(g,cream,0,.12,1.26,.12,.09,.12);
  }else if(friend.id==='mila'||friend.id==='ollie'){
   const parrot=friend.id==='mila',body=mat(parrot?'#42b86d':'#ecf2df'),wings=mat(parrot?'#f3c052':'#b7cae8');
   sphere(g,body,0,1.1,0,parrot?.5:.34,parrot?.7:1,.34);
   sphere(g,body,0,parrot?1.72:2.02,.2,.41,.4,.42);
   const beak=make(cone,yellow,0,parrot?1.55:1.92,.63,.24,.36,.26,g);beak.rotation.x=Math.PI/2;
   for(const sign of [-1,1]){
    sphere(g,ink,sign*.2,parrot?1.79:2.1,.55,.05,.07,.045);
    // Detailed articulated feather wings are supplied by createAnimalDetails.
    sphere(g,yellow,sign*.23,.18,.14,.07,.21,.07);
   }
   if(parrot)sphere(g,pink,0,1.85,-.32,.27,.16,.11);
  }else if(friend.id==='luna'){
   sphere(g,pink,0,.49,0,.66,.38,.54);
   for(const sign of [-1,1]){
    const claw=new T.Group();g.add(claw);claw.position.set(sign*.66,.53,0);
    sphere(claw,pink,sign*.3,0,.2,.3,.25,.29);sphere(claw,cream,sign*.36,.1,.44,.18,.1,.18);
    moving.push(claw);
    for(let i=0;i<3;i++){const leg=make(cylinder,pink,sign*(.49+i*.18),.20,(i-1)*.3,.06,.45,.06,g);leg.rotation.z=sign*.4;}
    sphere(g,cream,sign*.26,1,.4,.16,.23,.16);sphere(g,ink,sign*.26,1.02,.55,.07,.1,.065);
   }
  }else{
   const skin=mat('#c99574'),shirt=mat('#f1a35e'),shorts=mat('#65bdca'),hair=mat('#4a3832');
   sphere(g,shirt,0,1,0,.43,.67,.26);sphere(g,skin,0,1.83,0,.36,.36,.34);
   sphere(g,hair,0,2.13,-.09,.36,.15,.32);
   for(const sign of [-1,1]){
    sphere(g,ink,sign*.15,1.9,.32,.045,.062,.045);
    const arm=sphere(g,skin,sign*.53,1,0,.15,.5,.14);
    sphere(g,shorts,sign*.23,.47,0,.18,.4,.2);
    const leg=sphere(g,skin,sign*.23,.17,0,.12,.34,.12);
    (other.walkers??=[]).push({arm,leg,sign});
   }
   other.ball=sphere(g,pink,.9,.6,.8,.35,.35,.35);
  }
  other.detail=friend.id==='kai'?null:createAnimalDetails({T,id:friend.id,root:g,make,mat,geometry,ball,cone,cylinder});
  g.position.set(p.x,friend.id==='dori'?-0.1:height(p.x,p.z)+(friend.id==='pip'?.36:0),p.z);
  const label=btn(friend.icon+' '+friend.name,'friend-world-label',()=>isNearby(friend.id)?open(friend.id):visit(friend.id));
  label.setAttribute('aria-label',say('Jugar con ','Play with ')+friend.name);host.append(label);labels.push(label);
  const node={g,moving,other,home:{x:p.x,z:p.z},f:friend,cheer:0};nodes.set(friend.id,node);
 }
 islandFriends.forEach(model);
 const directory=btn('🫶 '+say('AMIGOS','FRIENDS'),'friend-peek',openDirectory);
 directory.setAttribute('aria-label',say('Ver amigos y juegos','Meet island friends and play'));host.append(directory);
 function close(){opened=null;gameActive=false;panel.classList.remove('friend-panel');panel.hidden=true;}
 function startPanel(title,info){
  onOpen?.();opened=opened||'directory';panel.replaceChildren();panel.hidden=false;panel.classList.add('friend-panel');
  const x=btn('×','panel-close',close);x.setAttribute('aria-label',say('Cerrar','Close'));
  panel.append(x,el('h2','friend-title',title),el('p','friend-intro',info));
 }
 function visit(id){close();onTravel(destination(id));}
 function isNearby(id){
  const n=nodes.get(id);if(!n)return false;
  return Math.hypot(n.g.position.x-s.x,n.g.position.z-s.z)<(id==='dori'?9:4.6);
 }
 function openDirectory(){
  opened='directory';gameActive=false;
  startPanel('🫶 '+say('¡Mis amigos de la isla!','My island friends!'),say('¡Visítalos y juega con ellos!','Go visit your friends and play together!'));
  const list=el('div','friend-directory');
  for(const f of islandFriends){
   const card=el('div','friend-directory-card');
   card.append(el('span','friend-avatar',f.icon));
   const text=el('div','friend-directory-copy');
   text.append(el('strong','',f.name),el('small','',tr(f.where)),el('span','friend-game-label',f.id==='kai'?tr(f.game):say('Montar · Pasear · Explorar','Ride · Follow · Explore')));
   card.append(text);
   const actions=el('div','friend-directory-actions');
   actions.append(btn('📍 '+say('Visitar','Visit'),'friend-secondary',()=>visit(f.id)));
   if(isNearby(f.id))actions.append(btn('🎮 '+say('Jugar','Play'),'friend-primary',()=>open(f.id)));
   card.append(actions);list.append(card);
  }
  panel.append(list);
 }
 function open(id){
  const f=islandFriends.find(o=>o.id===id);if(!f)return;
  if(!isNearby(id)){visit(id);return;}
  if(!friends.visits.includes(id)){friends.visits.push(id);save();}
  opened=id;gameActive=false;
  startPanel(f.icon+' '+f.name,tr(f.where));
  panel.append(el('div','friend-hero-face',f.icon),el('p','friend-greeting',tr(f.hello)));
  const actions=el('div','friend-choices');
  if(f.id!=='kai')actions.append(btn('🐾 '+say('¡Montar y explorar!','Ride and explore!'),'friend-primary',()=>ride(f.id)));
  else actions.append(btn('🏐 '+tr(f.game),'friend-primary',()=>startGame(f.id)));
  const chosen=friends.companion===id;
  actions.append(btn(chosen?'🏡 '+say('Me quedo aquí','Stay here'):'🤝 '+say('Ven conmigo','Come with me'),'friend-secondary',()=>{
   friends.companion=chosen?null:id;if(id==='pip')s.pet=false;save();joy.effect('friend');open(id);
  }));
  if(['pip','mila','ollie','luna'].includes(id))
   actions.append(btn('⭐ '+say('Aventura opcional','Optional adventure'),'friend-secondary',()=>{close();onLessons(id);}));
  actions.append(btn('🗺️ '+say('Ver a todos','See everyone'),'friend-secondary',openDirectory));
  panel.append(actions);
  if(friends.completed.includes(id))panel.append(el('p','friend-success-note','⭐ '+say('¡Podemos jugar de nuevo!','We can play again!')));
 }
 function done(f){
  gameActive=false;step=0;
  let n=0;
  if(!friends.completed.includes(f.id)){
   friends.completed.push(f.id);n=earnCoins(state,'friend-'+f.id);refresh();save();
  }
  joy.effect('treasure');nodes.get(f.id).cheer=2.3;
  opened=f.id;
  startPanel('🎉 '+say('¡Qué divertido!','That was fun!'),f.icon+' '+f.name+' '+say('es tu amigo. ¡Una estrella para ti!','is your friend! You earned a star!')+(n?' +'+n+' 🪙':''));
  const controls=el('div','friend-choices');
  controls.append(btn('🎮 '+say('Jugar otra vez','Play again'),'friend-primary',()=>startGame(f.id)));
  controls.append(btn('💛 '+say('Ver a mi amigo','See my friend'),'friend-secondary',()=>open(f.id)));
  controls.append(btn('🌴 '+say('Seguir explorando','Keep exploring'),'friend-secondary',close));
  panel.append(controls);
 }
 function startGame(id){
  const f=islandFriends.find(x=>x.id===id);if(!f)return;
  opened=id;gameActive=true;step=0;
  startPanel(f.icon+' '+f.name+' · '+tr(f.game),say('¡Jueguen juntos!','Play together!'));
  const total=id==='pip'?5:id==='dori'?8:id==='mila'?4:id==='ollie'?6:id==='luna'?8:6;
  const instructions={
   pip:['🐚 ¡Toca las cinco conchas!','🐚 Tap all five shells!'],
   dori:['🫧 ¡Revienta ocho burbujas para ver saltar a Dori!','🫧 Pop eight bubbles to make Dori jump!'],
   mila:['🎵 ¡Toca los colores de la canción!','🎵 Tap the colors in Mila’s song!'],
   ollie:['✨ ¡Busca seis luciérnagas entre las hojas!','✨ Find six fireflies in the leaves!'],
   luna:['🦀 ¡Haz ocho pasos de baile!','🦀 Do eight crab dance moves!'],
   kai:['🏐 ¡Pásale la pelota a Kai seis veces!','🏐 Toss Kai the ball six times!']
  };
  panel.append(el('p','friend-game-goal',tr(instructions[id])));
  const progress=el('p','friend-progress','⭐ 0 / '+total),stage=el('div','friend-play-stage');
  panel.append(progress,stage);
  const advance=(b,note)=>{
   if(!gameActive)return;
   if(b){b.disabled=true;b.classList.add('friend-popped');}
   joy.note(note,.24);joy.effect('friend');nodes.get(id).cheer=.8;
   step++;progress.textContent='⭐ '+step+' / '+total;
   if(step>=total)done(f);
  };
  if(['pip','dori','ollie'].includes(id)){
   const grid=el('div','friend-tap-grid'),amount=id==='ollie'?12:total;
   for(let i=0;i<amount;i++){
    const real=id!=='ollie'||i%2===0;
    const icon=id==='pip'?'🐚':id==='dori'?'🫧':real?'✨':'🌿';
    const b=btn(icon,'friend-tap',()=>{
     if(b.disabled||!gameActive)return;
     if(real)advance(b,i%5);
     else{b.textContent='🍃';b.classList.add('friend-wiggle');joy.effect('tap');}
    });
    b.setAttribute('aria-label',id==='pip'?say('Concha','Shell'):id==='dori'?say('Burbuja','Bubble'):real?say('Luciérnaga','Firefly'):say('Hoja','Leaf'));
    grid.append(b);
   }
   stage.append(grid);
  }else if(id==='mila'){
   const notes=[0,1,2,0],colors=['💛','💗','💙'],tones=[0,2,4];
   const line=el('div','friend-melody',notes.map(x=>colors[x]).join('  '));stage.append(line);
   const keys=el('div','friend-music-keys');
   for(let i=0;i<3;i++)keys.append(btn(colors[i],'friend-music-key',()=>{
    if(!gameActive)return;
    if(notes[step]===i)advance(null,tones[i]);
    else{joy.effect('wrong');line.classList.add('friend-wiggle');setTimeout(()=>line.classList.remove('friend-wiggle'),420);}
   }));
   stage.append(keys,el('p','friend-mini-tip',say('Mila canta: amarillo, rosa, azul, amarillo.','Mila sings: yellow, pink, blue, yellow.')));
  }else if(id==='luna'){
   const face=el('div','friend-dance','🦀 💃 🦀'),keys=el('div','friend-dance-keys');stage.append(face);
   for(const [i,symbol]of ['⬅️','➡️','⬆️','⬇️'].entries()){
    keys.append(btn(symbol,'friend-dance-key',()=>{
     face.textContent='🦀 '+symbol+' 🦀';face.classList.remove('friend-bounce');void face.offsetWidth;face.classList.add('friend-bounce');advance(null,i);
    }));
   }
   stage.append(keys);
  }else{
   const ball=btn('🏐','friend-beach-ball',()=>{
    ball.style.transform='translateX('+((step%2?1:-1)*72)+'px) rotate('+(step*35)+'deg)';
    advance(null,step%5);
   });
   stage.append(ball);
  }
  panel.append(btn('× '+say('Terminar juego','Stop playing'),'friend-secondary friend-stop',()=>open(id)));
 }
 function nearest(mode='walk'){
  if(mode==='fly')return null;
  let candidate=null,dist=Infinity;
  for(const f of islandFriends){
   const n=nodes.get(f.id),d=Math.hypot(s.x-n.g.position.x,s.z-n.g.position.z);
   if(d<(f.id==='dori'?9:4.6)&&d<dist){dist=d;candidate=f;}
  }
  return candidate;
 }
 function hit(raycaster){
  for(const n of nodes.values()){
   if(Math.hypot(s.x-n.g.position.x,s.z-n.g.position.z)>12)continue;
   if(raycaster.intersectObject(n.g,true).length)return n.f;
  }
  return null;
 }
 function update(dt,active,{mode='walk',inside=false,mount=null,heading=0,roomPosition=null,mountAltitude=0,moving=false}={}){
  if(document.hidden)return;
  if(motion())time+=Math.min(dt,.05);
  const following=friends.companion;
  for(const n of nodes.values()){
   const id=n.f.id,isRidden=mounted===id&&mount===id,canFollow=following===id&&!isRidden&&(!inside||mode==='house');
   const idleBird=(id==='mila'||id==='ollie')&&!isRidden&&!canFollow;
   const px=isRidden?s.x:canFollow?(mode==='house'&&roomPosition?roomPosition.x-1.35:s.x-1.7):n.home.x+(idleBird?Math.sin(time*.7+n.home.z)*1.3:0),
    pz=isRidden?s.z:canFollow?(mode==='house'&&roomPosition?roomPosition.z+1.25:s.z+1.65):n.home.z+(idleBird?Math.cos(time*.7+n.home.z)*1.15:0);
   if(isRidden){n.g.position.x=px;n.g.position.z=pz;}
   else if(canFollow&&Math.hypot(px-n.g.position.x,pz-n.g.position.z)>28){n.g.position.x=px;n.g.position.z=pz;}
   else{const factor=Math.min(1,dt*(canFollow?2.6:1.2));n.g.position.x+=(px-n.g.position.x)*factor;n.g.position.z+=(pz-n.g.position.z)*factor;}
   n.g.rotation.y=isRidden?heading:canFollow?Math.atan2(s.x-n.g.position.x,s.z-n.g.position.z):Math.sin(time*.6+n.home.x)*.27;
   n.g.scale.setScalar(isRidden?(id==='pip'?2.2:id==='dori'?2.65:id==='luna'?2:1.65):1);
   if(n.cheer>0)n.cheer=Math.max(0,n.cheer-dt);
   const bounce=n.cheer>0?Math.abs(Math.sin((2.5-n.cheer)*10))*.34:0;
   const indoors=canFollow&&mode==='house'&&roomPosition;
   const isBird=id==='mila'||id==='ollie',birdInFlight=isBird&&isRidden&&mountAltitude>0;
   const footHeight=indoors?roomPosition.y:height(n.g.position.x,n.g.position.z);
   const sea=mode==='swim'||mode==='boat'||mode==='mount-water';
   const aquatic=id==='dori'&&(sea||isRidden&&mode==='mount-water');
   n.g.position.y=(indoors?footHeight+(id==='pip'?.36:.25):aquatic?-.15:footHeight+(id==='pip'?.36:id==='dori'?.28:0))
    +bounce+(isRidden?Math.sin(time*5)*.09:id==='dori'?Math.max(0,Math.sin(time*1.7))*.65:Math.sin(time*2+n.home.z)*.055);
   for(const [i,p]of n.moving.entries()){
    if(id==='dori')p.rotation.x=Math.sin(time*5)*.3;
    else p.rotation.z=Math.sin(time*(id==='luna'?4:3)+i)*.2;
   }
   if(birdInFlight)n.g.position.y=(mode==='mount-water'?0:footHeight)+mountAltitude+Math.sin(time*6)*.08;
   else if(isBird&&!indoors)n.g.position.y+= (canFollow?1.8:1.1)+Math.sin(time*3.1)*.22;
   if(canFollow&&mode==='fly'&&s.flight>0)n.g.position.y=s.flight+(id==='dori'?-.5:.3);
   n.other.detail?.animate(time,{moving:isRidden||canFollow||moving||idleBird,flying:birdInFlight||isBird&&!indoors});
   if(n.other.walkers)for(const limb of n.other.walkers){
    const swing=canFollow?Math.sin(time*9)*.48:Math.sin(time*1.4)*.08;
    limb.leg.rotation.x=swing*limb.sign;
    limb.arm.rotation.x=-swing*limb.sign;
   }
   if(n.other.ball)n.other.ball.position.y=.6+Math.sin(time*2)*.12;
  }
  camera.updateMatrixWorld();
  islandFriends.forEach((f,i)=>{
   const n=nodes.get(f.id),label=labels[i],dist=Math.hypot(s.x-n.g.position.x,s.z-n.g.position.z);
   if(dist>24||opened||inside||mode==='fly'||mounted===f.id||mode==='house'){label.hidden=true;return;}
   temp.set(n.g.position.x,n.g.position.y+(f.id==='dori'?1.6:3),n.g.position.z).project(camera);
   if(temp.z>1||temp.z< -1||Math.abs(temp.x)>1.05||Math.abs(temp.y)>1.05){label.hidden=true;return;}
   label.hidden=false;label.style.left=(temp.x*.5+.5)*100+'%';label.style.top=(-temp.y*.5+.5)*100+'%';
  });
  directory.textContent='🫶 '+say('AMIGOS','FRIENDS')+' '+friends.completed.length+'/'+islandFriends.length;
 }
 function ride(id,origin=null){
  if(!['pip','dori','mila','ollie','luna'].includes(id))return false;
  const p=origin||nodes.get(id)?.g.position;
  if(!p)return false;
  mounted=id;friends.companion=id;save();
  onMount(id,{x:p.x,z:p.z});joy.effect('friend');close();
  return true;
 }
 function dismount(){const previous=mounted;mounted=null;if(previous){nodes.get(previous)?.g.scale.setScalar(1);onMount(null);save();}return previous;}
 function dispose(){close();directory.remove();labels.forEach(l=>l.remove());for(const n of nodes.values())scene.remove(n.g);}
 return {nearest,isNearby,open,openDirectory,close,update,hit,ride,dismount,mounted:()=>mounted,isOpen:()=>opened!==null,dispose,hasCompanion:id=>friends.companion===id};
}

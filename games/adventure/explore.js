import {createRealms} from './realms.js?v=43';
import {createJourney} from './journey.js?v=43';
import {oceanModel} from './ocean-models.js?v=38';
import {createIslandLife} from './island-life.js?v=47';
import {createWorldStory} from './world-story.js?v=43';
import {createWorldMap} from './world-map.js?v=3';
import {createWildlifeFriends} from './wildlife-friends.js?v=6';
import {createHouseInteriors} from './house-interiors.js?v=3';
import {createPizzaCity} from './pizza-city.js?v=1';
import {buildIsland} from './entrance.js?v=55';
import {islandPoint,remoteAccess,worldIslands,explorePlaces,exploreItems,normalizeExplore,collectExplore,badgeExplore,countExplore,islandPath,walkable,inWater,onDock,sharkStep,sharkPatrol,recoverShark,boatStep,recoverBoat,traversable,nextIslandAdventure,coinBalance,earnCoins,syncWallet,islandShop,buyIslandItem} from './explore-state.js?v=55';
export function createExplore(host,{state,save,joy,speak=()=>false,paused=()=>false,welcomeMessage=null,openLessons=()=>{},openNext=()=>{},motion,openBook,openHome,load=()=>import('./vendor/three.module.min.js')}){
 const es=state.lang==='es',say=(a,b)=>es?a:b,s=state.world=normalizeExplore(state.world);syncWallet(state);
 let disposed=false,engine=null,control=null,friendSystem=null,houseSystem=null,wildLife=null,cityLife=null,carDriving=false,carSpeed=0,mountId=null,birdAltitude=0,birdTarget=0,birdLanding=false,near=null,ride=s.flight?1:0,flightY=s.flight||0,flightTarget=s.flight||0,flightVX=0,flightVZ=0,route=[],targetPoint=null,keys=new Set(),stick={x:0,z:0},music=[],messageTime=0,autosave=0;
 let pendingRealm=null,waterLanding=null;let swimming=false,inside=false,stair=0,boating=false,boatSpeed=0,foodNear=null,eating=0,energy=0,swimBoost=0,rescueCooldown=0,danger=false,lastShore={x:4,z:10};
 let goal=nextIslandAdventure(state),goalAnnounced='',lastVoice=-Infinity,welcomed=false;
 function guide(){return false;}
 function goalPlace(){return goal?explorePlaces.find(p=>p.id===goal.place):null;}
 function atGoal(){const p=goalPlace();return p&&Math.hypot(s.x-p.x,s.z-p.z)<2.6;}
 function goalWords(){if(!goal)return say('¡Completaste todas las aventuras! Elige un lugar en Descubrir para volver a jugar.','You completed every adventure! Choose a place in Discover to play again.');const names=[say('Pip en el puerto','Pip at the harbor'),say('Mila en el huerto','Mila at the orchard'),say('Ollie en el bosque','Ollie in the grove'),say('Luna junto a la música','Luna by the music notes'),say('el jardín','the garden'),say('el faro','the lighthouse')];return atGoal()?say('¡Aquí estamos, Angelique! Toca Empezar aventura para ayudar.','We’re here, Angelique! Tap Start adventure to help.'):say('Angelique, vamos a ayudar a ','Angelique, let’s help ')+names[goal.region]+say('. Toca Llévame y caminaré contigo.','. Tap Take me there and I’ll walk with you.');}
 function listen(){const words=goalWords();message.textContent=words;message.classList.add('show');messageTime=12;guide(words,true);}
 function followGoal(){if(paused()||ride||control?.falling())return;if(boating){tell('⛵ Flechas para navegar · ⤴ Salir','⛵ Arrows to steer · ⤴ Get out');return;}if(inside){if(stair>=.97)control?.lightBeacon();else tell('👣 Sigue los escalones dorados','👣 Follow the golden steps');return;}if(swimming){route=islandPath(s,lastShore);targetPoint=route.shift()||null;swimBoost=3;return;}if(!goal){showDiscover();return;}if(atGoal()){openNext(goal.id);return;}const p=goalPlace();if(!walkable((s.x+p.x)/2,(s.z+p.z)/2)||!remoteAccess(s,p)){travelTo(p);return;}route=islandPath(s,p);targetPoint=route.shift()||null;panel.hidden=true;guide(say('¡Sígueme! Angelique va al siguiente lugar. Al llegar, toca Empezar aventura.','Follow me! Angelique is walking to the next place. When we arrive, tap Start adventure.'),true);}

 const makeEl=(tag,cls,txt)=>{const e=document.createElement(tag);e.className=cls;if(txt)e.textContent=txt;return e;};
 function paintButton(b,text){
  if(b.dataset.words===text)return;b.dataset.words=text;
  if(!b.matches('.world-small,.world-action,.world-jump,.world-catch,.discover-place,.goal-next')){b.textContent=text;return;}
  let icon=text.match(/^\S\uFE0F?/u)?.[0]||'⭐',label=text.replace(/^[^\p{L}\p{N}]+/u,'').trim();
  const named=(symbol,caption)=>{icon=symbol;label=caption;};
  if(b.classList.contains('food-button'))named('🥥🍌',say('Comida','Food'));
  else if(b.classList.contains('wallet-button'))named('🪙',text.replace(/[^0-9]/g,'')||'0');
  else if(b.classList.contains('helper-toggle'))named(text==='×'?'✕':'🎒',text==='×'?say('Cerrar','Close'):say('Mis cosas','My stuff'));
  else if(/Descubrir|Discover/.test(text))named('🗺️',say('Explorar','Explore'));
  else if(/Historias|Stories/.test(text))named('📖',say('Historias','Stories'));
  else if(text==='⌂')named('🏡',say('Casa','Home'));
  else if(/Ayuda|Help/.test(text))named('🐢',say('Ayuda','Help'));
  else if(b.classList.contains('world-jump')){if(/alto|Higher/.test(text))named('🎈⬆️',say('Subir','Up'));else if(/Bajar|Lower/.test(text))named('🎈⬇️',say('Bajar','Down'));else if(/Salir|out/i.test(text))named('👣',say('Salir','Out'));else if(/nad|swim/i.test(text))named('🏊',say('Rápido','Fast'));else named('👧⬆️',say('Saltar','Jump'));}
  else if(b.classList.contains('world-action')){if(/Reventar|Pop balloon/.test(text))named('💥',say('¡Pop!','Pop!'));else if(/Recoger|Pick/.test(text))label=say('Recoger','Pick');else if(/Board|Subir al/.test(text))label=say('Subir','Ride');else if(/Aventura|Adventure/.test(text))named('⭐',say('Jugar','Play'));else if(/Jugar|Play/.test(text)){label=/Pip|Mila|Ollie|Luna/.test(text)?say('Hola','Hello'):/globo|balloon/i.test(text)?say('Volar','Fly'):/faro|lighthouse/i.test(text)?say('Entrar','Enter'):say('Jugar','Play');}else if(/Burbujas|bubbles/.test(text))label=say('Burbujas','Bubbles');}
  else if(b.classList.contains('goal-next'))named('👣',say('Vamos','Let’s go'));
  else if(b.classList.contains('discover-place')){if(/Little again|Volver a pequeña/.test(text))named('👧',say('Pequeña','Small'));else if(/hat|Sombrero/.test(text))icon='🎩';else if(/×.*Comer|×.*Eat/.test(text))label=text.slice(text.indexOf('×'));else if(text==='⛵')label=say('Barco','Boat');else if(text==='🎈')label=say('Globo','Balloon');else if(text==='🏊')label=say('Nadar','Swim');else label=label.split(' · ')[0];}
  if(/^[\p{L}\p{N}]$/u.test(icon))icon='⭐';
  b.classList.add('picture-button');b.setAttribute('aria-label',text);b.title=text;
  if(b.firstElementChild?.classList.contains('button-picture')){const [picture,caption,full]=b.children;if(picture.textContent!==icon)picture.textContent=icon;if(caption.textContent!==label)caption.textContent=label;full.textContent=text;return;}
  const picture=makeEl('span','button-picture',icon),caption=makeEl('span','button-caption',label),full=makeEl('span','button-original',text);
  picture.setAttribute('aria-hidden','true');caption.setAttribute('aria-hidden','true');full.setAttribute('aria-hidden','true');b.replaceChildren(picture,caption,full);
 }
 const btn=(txt,cls,fn)=>{const b=makeEl('button',cls);b.type='button';paintButton(b,txt);b.onclick=()=>{joy.gesture();fn();};return b;};
 let canvas=makeEl('canvas','explore-canvas');canvas.setAttribute('aria-label',say('Explora con Angelique. Usa flechas o WASD, o toca el suelo.','Explore as Angelique. Use arrows or WASD, or tap the ground.'));canvas.tabIndex=0;
 const hud=makeEl('div','explore-hud'),title=makeEl('div','explore-location',say('Bahía de Pip','Pip’s bay')),bag=makeEl('div','explore-bag'),quest=makeEl('div','explore-hint',say('¡Tu isla, tus reglas! Busca a Pip o explora a tu aire.','Your island, your rules! Find Pip or wander anywhere.'));
 const goalCard=makeEl('section','island-goal'),goalTitle=makeEl('strong',''),goalText=makeEl('p',''),goalButton=btn('','goal-next',followGoal);goalCard.setAttribute('aria-label',say('Tu siguiente aventura','Your next adventure'));goalCard.append(goalTitle,goalText,goalButton);
 const message=makeEl('div','explore-message');message.setAttribute('role','status');message.setAttribute('aria-live','polite');
 const lessonRegions={pip:0,mila:1,ollie:2,luna:3,garden:4,beacon:5};
 const lesson=btn(say('Una aventura','An adventure'),'world-action world-lesson',()=>{if(near&&lessonRegions[near.id]!==undefined)openLessons(lessonRegions[near.id]);});lesson.hidden=true;
 const actions=makeEl('div','explore-actions'),act=btn(say('Saludar','Say hello'),'world-action',interact),jump=btn(say('Saltar ⤴','Jump ⤴'),'world-jump',hop);
 const descend=btn(say('↓ Bajar','↓ Lower'),'world-jump',()=>{if(ride)flightTarget=Math.max(0,flightTarget-5);else if(birdMount()){birdLanding=false;birdTarget=Math.max(1.5,birdTarget-3);}});descend.hidden=true;
 const friendMeet=btn('🐢 '+say('Amigos','Friends'),'world-action friend-hello',()=>{const f=friendSystem?.nearest(boating?'boat':swimming?'swim':'walk');if(f)friendSystem.open(f.id);});friendMeet.hidden=true;friendMeet.setAttribute('aria-label',say('Jugar con un amigo','Play with a friend'));
 const menu=makeEl('div','explore-menu');menu.append(btn('☷ '+say('Descubrir','Discover'),'world-small',showDiscover),btn('▤ '+say('Historias','Stories'),'world-small',openBook),btn('⌂','world-small',openHome));menu.lastChild.setAttribute('aria-label',say('Mi casita','My cottage'));menu.append(btn(say('? Ayuda','? Help'),'world-small',listen));
 const helperToggle=btn('☰','world-small helper-toggle',()=>setHelpers(!host.classList.contains('helpers-open')));menu.id='island-helper-menu';goalCard.id='island-helper-goal';helperToggle.setAttribute('aria-controls','island-helper-menu island-helper-goal');
 function setHelpers(open){host.classList.toggle('helpers-open',open);paintButton(helperToggle,open?'×':'☰');helperToggle.setAttribute('aria-expanded',String(open));helperToggle.setAttribute('aria-label',open?say('Ocultar ayuda','Hide helpers'):say('Mostrar ayuda','Show helpers'));}setHelpers(false);
 goalButton.addEventListener('click',()=>setHelpers(false));
 const walletButton=btn('','world-small wallet-button',showShop);menu.append(walletButton);
 const foodButton=btn('🥥 🍌','world-small food-button',showFood);foodButton.setAttribute('aria-label',say('Mi comida','My food'));menu.append(foodButton);
 const catchButton=btn('🦋','world-catch catch-action',()=>control?.catchNearest());catchButton.hidden=true;actions.append(catchButton);
 const pad=makeEl('div','explore-stick');pad.setAttribute('aria-label',say('Palanca para moverte','Movement joystick'));const knob=makeEl('span','stick-knob');pad.append(knob);const compass=makeEl('span','stick-compass'),stickReadout=makeEl('span','stick-readout');for(const [cls,icon] of [['north','↑'],['east','→'],['south','↓'],['west','←']])compass.append(makeEl('span',cls,icon));compass.setAttribute('aria-hidden','true');pad.append(compass,stickReadout);knob.textContent='✥';
 const directions=makeEl('div','world-arrows');for(const [label,k]of [['↑','ArrowUp'],['←','ArrowLeft'],['↓','ArrowDown'],['→','ArrowRight']]){const b=btn(label,'',()=>{});b.setAttribute('aria-label',say('Mover ','Move ')+({ArrowUp:say('norte','north'),ArrowDown:say('sur','south'),ArrowLeft:say('oeste','west'),ArrowRight:say('este','east')}[k]));b.onpointerdown=e=>{b.setPointerCapture(e.pointerId);keys.add(k);targetPoint=null;joy.gesture();};b.onpointerup=b.onpointercancel=()=>keys.delete(k);directions.append(b);}
 const instructions=makeEl('div','explore-controls',say('Toca el suelo para ir · Flechas / WASD · Espacio para saltar','Tap ground to walk · Arrows / WASD · Space to jump'));
 const panel=makeEl('section','explore-panel');panel.hidden=true;panel.setAttribute('aria-label',say('Descubrimientos','Discoveries'));
 hud.append(title,bag);actions.append(lesson,act,jump,descend,friendMeet);host.append(canvas,hud,quest,goalCard,menu,helperToggle,pad,directions,actions,instructions,message,panel);
 const adventureMap=createWorldMap({host,panel,world:s,islands:worldIslands,places:explorePlaces,language:state.lang,
   onTravel:travelTo,onOpen:()=>{setHelpers(false);blur();targetPoint=null;}});
 refresh();
 const buttonUpdates=new Map();
 function setText(e,t){if(e.tagName==='BUTTON')buttonUpdates.set(e,t);else if(e.textContent!==t)e.textContent=t;}
 function refresh(){paintButton(walletButton,'🪙 '+coinBalance(state));walletButton.setAttribute('aria-label',say('Mis monedas y tienda: ','My coins and shop: ')+coinBalance(state));const lessonCount=Object.keys({...state.completed,...state.islandLessons?.completed}).length;bag.textContent=`${lessonCount?`✦ ${lessonCount}/48 · `:''}🐚 ${countExplore(s,'shell')}/12   🍌 ${countExplore(s,'fruit')}/5   ✦ ${s.badges.length}/8`;}
 function tell(a,b,force=true){guide(say(a,b),force);message.textContent=say(a,b);message.classList.add('show');messageTime=4.5;}
 function reward(id,a,b){if(badgeExplore(s,id)){const coins=earnCoins(state,id);if(coins){joy.effect('coin');a+=` +${coins} monedas.`;b+=` +${coins} coins.`;}joy.effect('finish');control?.spark(s.x,s.z,22);save();refresh();}tell(a,b);}
 function birdMount(){return mountId==='mila'||mountId==='ollie';}
 function landBird(){if(!birdMount())return;
  if(birdAltitude>.6){birdLanding=true;birdTarget=0;tell('🪶 ¡Aterrizamos con cuidado!','🪶 Gliding down to land!');}
  else friendSystem?.dismount();
 }
 function hop(){if(!control||panel.hidden===false||paused())return;if(carDriving){exitCar();return;}if(houseSystem?.isInside()){houseSystem.leave();host.classList.remove('inside-cottage');return;}if(birdMount()){birdLanding=false;birdTarget=Math.min(32,Math.max(birdAltitude,birdTarget)+4);return;}if(mountId){friendSystem?.dismount();return;}if(ride){flightTarget=Math.min(40,flightTarget+5);return;}if(boating){control.disembark();return;}if(swimming){swimBoost=3;return;}control.hop();joy.effect('tap');}
 function boardCar(){if(carDriving||!cityLife?.nearCar(s.x,s.z)||boating||ride||inside||houseSystem?.isInside()||mountId)return;
  carDriving=true;carSpeed=0;swimming=false;bodyScale=1;s.x=s.city.car.x;s.z=s.city.car.z;targetPoint=null;route=[];blur();joy.effect('friend');
  tell('🚙 ¡Angelique conduce! Usa las flechas.','🚙 Angelique is driving! Use the arrows.');save();
 }
 function exitCar(){if(!carDriving)return;carDriving=false;carSpeed=0;
  const a=s.city.car.heading;s.x=s.city.car.x+Math.cos(a)*2.6;s.z=s.city.car.z-Math.sin(a)*2.6;
  if(!cityLife?.canDrive(s.x,s.z)){s.x=s.city.car.x;s.z=s.city.car.z;}
  targetPoint=null;route=[];blur();save();
 }
 function interact(){if(paused()||!panel.hidden||host.querySelector('.journey-panel:not([hidden]),.realm-panel:not([hidden])'))return;
 if(carDriving){exitCar();return;}
 if(!ride&&!boating&&!inside&&!mountId&&!houseSystem?.isInside()&&cityLife?.nearCar(s.x,s.z)){boardCar();return;}
 if(houseSystem?.isInside()){if(!houseSystem.inspect()){houseSystem.leave();host.classList.remove('inside-cottage');}return;}
 if(mountId){if(birdMount())landBird();else friendSystem?.dismount();return;}
 const doorway=houseSystem?.near(s.x,s.z);if(doorway){houseSystem.enter(doorway);return;}
 const wildAnimal=wildLife?.nearestRideable(s.x,s.z);
 if(wildAnimal&&!ride&&!boating&&!control?.boatNear()){wildLife.markRidden(wildAnimal);friendSystem?.ride(wildAnimal.kind==='Dolphin'?'dori':'pip',{x:wildAnimal.g.position.x,z:wildAnimal.g.position.z});return;}
 if(!ride&&!inside&&!foodNear&&!control?.boatNear()){const f=friendSystem?.nearest(boating?'boat':swimming?'swim':'walk');if(f){friendSystem.open(f.id);return;}}
 if(ride){control?.popBalloon();return;}if(boating){control?.disembark();return;}if(inside){if(stair>=.97)control?.lightBeacon();else if(stair<.03&&Math.hypot(s.x+1,s.z+4.1)<.7)control?.leaveTower();return;}if(control?.falling())return;if(control?.boatNear()){control.board();return;}if(foodNear){control?.harvest();return;}if(swimming){followGoal();return;}if(!near)return;joy.effect('friend');const k=near.id;
  if(k==='pip'){s.pet=!s.pet;const coins=s.pet?earnCoins(state,'pet'):0;refresh();save();tell(s.pet?`¡Pip viene contigo!${coins?' +3 monedas por cuidarlo.':''}`:'Pip te espera en el puerto.',s.pet?`Pip is coming with you!${coins?' +3 coins for caring for Pip.':''}`:'Pip will wait at the harbor.');}
  if(k==='mila'){if(countExplore(s,'fruit')===5)reward('picnic','¡Cinco racimos de plátanos! Picnic preparado. ¡Sombrero de fiesta desbloqueado!','Five bunches of bananas! Picnic ready. Party hat unlocked!');else tell(`¿Un picnic? Busca cinco racimos de plátanos: ${countExplore(s,'fruit')}/5.`,`Picnic time? Find five bunches of bananas: ${countExplore(s,'fruit')}/5.`);}
  if(k==='ollie'){if(countExplore(s,'glow')===5)reward('glow','¡La selva brilla! Tus luciérnagas te siguen.','The grove is glowing! Your fireflies follow you.');else tell('¡Las luciérnagas juegan al escondite! Encuentra las cinco luces del bosque.','The fireflies are playing hide-and-seek! Find five lights in the grove.');}
  if(k==='luna'){music=[];tell('¡Haz bailar el arcoíris! Pisa las notas: rosa, dorada, azul.','Make the rainbow dance! Step on pink, gold, blue.');control?.demo();}
  if(k==='garden'){s.flowers=Math.min(6,s.flowers+1);const coins=earnCoins(state,'flower-'+s.flowers);refresh();control?.bloom(s.flowers);save();joy.effect('correct');if(s.flowers===6)reward('garden','¡Un jardín para las mariposas!','A garden for the butterflies!');else tell(`¡Una flor! +${coins} monedas por cuidarla.`,`A flower! +${coins} coins for caring for it.`);}
  if(k==='bounce'){control?.hop(10);joy.effect('treasure');tell('¡Booooing!','Booooing!');}
  if(k==='boat')control?.board();if(near.kind==='balloon')control?.boardBalloon();
  if(k==='wardrobe'){const available=[0,1,...(s.badges.includes('picnic')?[2]:[]),...(s.badges.length>=4?[3]:[]),...islandShop.filter(i=>state.wallet.items.includes(i.id)).map(i=>i.hat)];s.hat=available[(available.indexOf(s.hat)+1)%available.length];control?.dress();save();tell('¡Nuevo estilo! Encuentra más sombreros en tus monedas.','New look! Find more hats by tapping your coins.');}
  if(near.kind==='islet'){if(k==='islet'||k==='crystalCove'){control?.bubbles();tell('🦋 Atrapa y suelta · 🫧 ¡Pop!','🦋 Catch and release · 🫧 Pop!');}else tell(k==='wilds'?'🍌 Recoge plátanos':k==='coconutCoast'?'🥥 Recoge cocos':'✨ Busca luciérnagas',k==='wilds'?'🍌 Pick bananas':k==='coconutCoast'?'🥥 Pick coconuts':'✨ Find fireflies');}if(k==='chest'){control?.bubbles();}if(k==='chest')reward('treasure','¡Un cofre de burbujas! Ven cuando quieras a jugar.','A bubble treasure chest! Come back anytime to play.');
  if(k==='beacon')control?.enterTower();
  if(k==='swim'){route=islandPath(s,{x:15,z:15});targetPoint=route.shift()||null;tell('🏊 Nada · 🏝 Vuelve a la playa','🏊 Swim · 🏝 Return to shore');}
  if(k==='chest'||k==='beacon')control?.spark(near.x,near.z,30);
 }
 function showFood(){if(friendSystem?.isOpen())friendSystem.close();if(adventureMap.isOpen())adventureMap.close(false);setHelpers(false);panel.replaceChildren();panel.hidden=false;blur();targetPoint=null;panel.append(btn('×','panel-close',()=>{panel.hidden=true;}),makeEl('h2','',say('Mi comida','My food')),makeEl('p','',say('Come y crece','Eat and grow')+' · '+s.growth.toFixed(1)+'×'));for(const kind of ['coconut','banana']){const icon=kind==='coconut'?'🥥':'🍌',b=btn(icon+' × '+s.food[kind]+' · '+say('Comer','Eat'),'discover-place',()=>{if(!s.food[kind])return;s.food[kind]--;eating=2;host.classList.add("snack-moment");energy=30;s.journey.meals++;s.growth=Math.min(6,s.growth+.45);control?.snack(kind);save();panel.hidden=true;joy.effect('correct');tell(icon+' ¡Ñam! ↗ '+s.growth.toFixed(1)+'×',icon+' Yum! ↗ '+s.growth.toFixed(1)+'×');});b.disabled=!s.food[kind];panel.append(b);}if(s.growth>1)panel.append(btn(say('↘ Volver a pequeña','↘ Little again'),'discover-place',()=>{s.growth=1;save();panel.hidden=true;}));}
 function showShop(){if(friendSystem?.isOpen())friendSystem.close();if(adventureMap.isOpen())adventureMap.close(false);panel.replaceChildren();panel.hidden=false;blur();targetPoint=null;const close=btn('×','panel-close',()=>{panel.hidden=true;canvas.focus({preventScroll:true});});close.setAttribute('aria-label',say('Cerrar','Close'));panel.append(close,makeEl('h2','',say('Mis monedas','My coins')),makeEl('p','',say(`Tienes ${coinBalance(state)} monedas de la isla.`,`You have ${coinBalance(state)} island coins.`)),makeEl('p','',say('Ayuda a un amigo: 10. Cuida una flor: 2. Prepara el picnic, ilumina el bosque o crea música: 15. Cada buena acción da monedas una vez.','Help a friend: 10. Care for a flower: 2. Prepare the picnic, light the grove, or make music: 15. Each good deed earns coins once.')));const list=makeEl('div','discover-grid');for(const item of islandShop){const owned=state.wallet.items.includes(item.id);const buy=btn((es?item.es:item.en)+' · '+(owned?say('Poner','Wear'):item.cost+' 🪙'),'discover-place',()=>{if(!buyIslandItem(state,item.id))return;save();refresh();control?.dress();joy.effect('coin');showShop();});buy.disabled=!owned&&coinBalance(state)<item.cost;list.append(buy);}panel.append(list);close.focus();guide(say('Tus buenas acciones te dan monedas. Puedes ahorrar o elegir un sombrero.','Your good deeds earn coins. You can save them or choose a hat.'),true);}
 function travelTo(p){
  if(carDriving)exitCar();
  if(houseSystem?.isInside()){houseSystem.leave();host.classList.remove('inside-cottage');}
  if(mountId)friendSystem?.dismount();
  if(friendSystem?.isOpen())friendSystem.close();
  if(adventureMap.isOpen())adventureMap.close(false);
  const land=worldIslands.find(i=>Math.hypot((p.x-i.x)/i.rx,(p.z-i.z)/i.rz)<1),here=land&&Math.hypot((s.x-land.x)/land.rx,(s.z-land.z)/land.rz)<1;
  if(ride){targetPoint={x:p.x,z:p.z};route=[];panel.hidden=true;return;}
  if(boating&&land){const a=Math.atan2(s.x-land.x,s.z-land.z);let dest={x:land.x+Math.sin(a)*(land.rx+3),z:land.z+Math.cos(a)*(land.rz+3)};dest=recoverBoat(dest.x,dest.z);targetPoint=dest;route=[];panel.hidden=true;return;}
  if(land&&!here){panel.replaceChildren(btn('×','panel-close',()=>panel.hidden=true),makeEl('h2','',(es?land.es:land.en)),makeEl('p','',say('¿Cómo quieres explorar?','How will you explore?')));panel.hidden=false;
   for(const [icon,dest] of [['⛵',s.boat],['🎈',explorePlaces.find(p=>p.id==='balloon')],...(remoteAccess(s,p)?[['🏊',p]]:[])])panel.append(btn(icon,'discover-place',()=>{route=islandPath(s,dest);targetPoint=route.shift()||null;panel.hidden=true;}));return;
  }
  if(boating)control?.disembark();const dest=p.id==='boat'?s.boat:p;route=islandPath(s,dest);targetPoint=route.shift()||null;panel.hidden=true;
 }
 function showDiscover(){if(carDriving)exitCar();if(houseSystem?.isInside()){houseSystem.leave();host.classList.remove('inside-cottage');}if(mountId)friendSystem?.dismount();if(friendSystem?.isOpen())friendSystem.close();if(adventureMap.isOpen())adventureMap.close(false);if(inside)control?.leaveTower();guide(say('Elige un lugar y Angelique caminará hasta allí.','Choose a place and Angelique will walk there.'),true);panel.replaceChildren();panel.hidden=false;blur();targetPoint=null;const close=btn('×','panel-close',()=>{panel.hidden=true;canvas.focus({preventScroll:true});});close.setAttribute('aria-label',say('Cerrar','Close'));panel.append(close,makeEl('h2','',say('¿Qué te apetece?','What feels fun?')),makeEl('p','',say('Elige un lugar. 🚶 ⛵ 🎈','Pick a place. 🚶 ⛵ 🎈')));const list=makeEl('div','discover-grid');for(const p of explorePlaces)list.append(btn(`${({wilds:'🍌',coconutCoast:'🥥',sunset:'✨',islet:'🦋',crystalCove:'💎',beacon:'🗼'})[p.id]||p.icon} ${es?p.es:p.en}`,'discover-place',()=>travelTo(p)));panel.append(list);close.focus();}
 function keydown(e){if(paused())return;if(!panel.hidden){if(e.key==='Escape'){if(friendSystem?.isOpen())friendSystem.close();else if(adventureMap.isOpen())adventureMap.close();else{panel.hidden=true;canvas.focus();}}return;}if((e.target.tagName==='BUTTON'&&(e.key===' '||e.key==='Enter'))||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||document.querySelector('dialog[open]'))return;const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' ','e','q','shift'].includes(k)){e.preventDefault();joy.gesture();keys.add(e.key);targetPoint=null;if(!e.repeat&&k===' ')hop();if(!e.repeat&&k==='e')interact();if(!e.repeat&&k==='q'){if(ride)flightTarget=Math.max(0,flightTarget-5);else if(birdMount()){birdLanding=false;birdTarget=Math.max(1.5,birdTarget-3);}}}}
 const keyup=e=>keys.delete(e.key),blur=()=>{keys.clear();stick.x=stick.z=0;knob.style.transform='';};
 document.addEventListener('keydown',keydown);document.addEventListener('keyup',keyup);window.addEventListener('blur',blur);document.addEventListener('visibilitychange',blur);
 function joystick(e){const r=pad.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/40,z=(e.clientY-r.top-r.height/2)/40,l=Math.hypot(x,z),strength=Math.max(0,Math.min(1,(l-.14)/.86));stick={x:l?x/l*strength:0,z:l?z/l*strength:0};knob.style.transform=`translate(${stick.x*32}px,${stick.z*32}px)`;targetPoint=null;}
 pad.onpointerdown=e=>{pad.setPointerCapture(e.pointerId);joy.gesture();joystick(e);};pad.onpointermove=e=>{if(pad.hasPointerCapture(e.pointerId))joystick(e);};pad.onpointerup=pad.onpointercancel=blur;
 // Keep the canvas alive during a temporary GPU reset so Chrome can restore it.
 let recovering=false,attempt=0,recoveryTimer=0,startTimer=0,generation=0;
 const retry=btn(say('Volver a abrir la isla','Reopen the island'),'world-small',()=>start(true));retry.hidden=true;menu.append(retry);
 function ready(){if(disposed)return;recovering=false;clearTimeout(recoveryTimer);host.classList.remove('explore-fallback');host.classList.add('explore-ready');pad.hidden=actions.hidden=directions.hidden=false;menu.firstChild.hidden=false;retry.hidden=true;if(!welcomed){welcomed=true;guide((welcomeMessage?welcomeMessage+' ':'')+goalWords(),true);}}
 function failed(error){if(disposed)return;console.warn('Island exploration unavailable',error?.message||'Graphics context unavailable');recovering=false;clearTimeout(recoveryTimer);engine?.dispose();engine=null;host.classList.remove('explore-ready');host.classList.add('explore-fallback');quest.textContent=say('La isla no terminó de cargar. Vuelve a abrirla; tu progreso está guardado.','The island did not finish loading. Reopen it; your progress is saved.');pad.hidden=actions.hidden=directions.hidden=true;menu.firstChild.hidden=true;retry.hidden=false;}
 function start(light=false){if(disposed)return;const current=++generation;clearTimeout(startTimer);clearTimeout(recoveryTimer);recovering=true;blur();canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored);engine?.dispose();engine=null;control=null;const next=canvas.cloneNode(false);canvas.replaceWith(next);canvas=next;canvas.addEventListener('webglcontextlost',contextLost);canvas.addEventListener('webglcontextrestored',contextRestored);attempt=light?1:0;retry.hidden=true;host.classList.remove('explore-ready','explore-fallback');quest.textContent=say('Abriendo tu isla…','Opening your island…');
  // Give the previous entrance/world context time to release before allocating another.
  startTimer=setTimeout(()=>{Promise.resolve().then(()=>load()).then(T=>{if(disposed||current!==generation)return;try{engine=buildIsland(T,canvas,motion,setup,{light,onError:failed});ready();}catch(error){if(!light)start(true);else failed(error);}}).catch(error=>{if(disposed||current!==generation)return;if(!light)start(true);else failed(error);});},light?250:0);
 }
 const contextLost=e=>{e.preventDefault();if(disposed||recovering)return;recovering=true;blur();save();quest.textContent=say('Reconectando con tu isla…','Reconnecting to your island…');recoveryTimer=setTimeout(()=>{if(attempt===0)start(true);else failed(new Error('Graphics context could not be restored'));},4000);};
 const contextRestored=()=>{if(disposed||!engine)return;ready();engine.resume?.();};
 canvas.addEventListener('webglcontextlost',contextLost);canvas.addEventListener('webglcontextrestored',contextRestored);
 start();
 function setup({T,scene,camera,target,height,make,geometry,mat,ball,cone,cylinder,box,tropical,tower,beam,crystal,dockBoat,sun,ambient,waterMaterial}){
  const gold=mat('#ffd46b'),pink=mat('#ed91b6'),orange=mat('#ef9955'),cream=mat('#fff2d3'),ink=mat('#254550'),purple=mat('#a895ed'),green=mat('#68bd7d');
  const avatar=new T.Group();avatar.name='Angelique';scene.add(avatar);const skin=mat('#bd8e68'),shirt=mat('#b8a6d7'),shorts=mat('#437c80'),hair=mat('#44352a');
  make(geometry(new T.CylinderGeometry(.24,.20,.58,12)),shirt,0,1.06,0,1,1,1,avatar);make(ball,skin,0,1.58,0,.22,.27,.21,avatar);make(ball,hair,0,1.73,-.03,.23,.15,.21,avatar);
  // Angelique's ponytail, ribbon, and lavender adventure outfit.
  const ponytail=new T.Group();ponytail.position.set(0,1.65,-.19);avatar.add(ponytail);make(ball,hair,0,-.15,-.08,.16,.29,.13,ponytail);make(ball,hair,0,-.37,-.09,.1,.18,.1,ponytail);const ribbon=mat('#ed9fbd');for(const x of [-.09,.09])make(ball,ribbon,x,.04,0,.1,.055,.035,ponytail);make(geometry(new T.CylinderGeometry(.20,.34,.32,16)),shirt,0,.75,0,1,1,1,avatar);make(ball,ribbon,.08,1.18,.23,.04,.04,.02,avatar);for(const x of [-.08,.08])make(ball,ink,x,1.6,.2,.018,.02,.01,avatar);
  const legs=[-.13,.13].map(x=>{const leg=new T.Group();leg.position.set(x,.7,0);avatar.add(leg);make(cylinder,shorts,0,-.12,0,.12,.3,.12,leg);make(cylinder,skin,0,-.4,0,.075,.35,.075,leg);make(ball,woodMaterial(),0,-.6,.06,.1,.07,.18,leg);return leg;});
  const arms=[];for(const x of [-.31,.31]){const arm=make(cylinder,skin,x,1.02,0,.065,.56,.065,avatar);arm.rotation.z=x>0?-.13:.13;arms.push(arm);}
  const hat=new T.Group();hat.position.y=1.86;avatar.add(hat);make(cylinder,gold,0,0,0,.35,.04,.35,hat);make(cylinder,gold,0,.1,0,.22,.17,.22,hat);
  function woodMaterial(){return mat('#554835');}
  avatar.traverse(o=>{o.castShadow=false;if(o.isMesh){o.material=mat(o.material.color,{depthTest:false,map:o.material.map});o.renderOrder=20;}});const shadow=make(geometry(new T.CircleGeometry(.35,20)),mat('#264e4c',{transparent:true,opacity:.2,depthWrite:false}),0,0,0);shadow.rotation.x=-Math.PI/2;shadow.castShadow=false;
  const pet=new T.Group();scene.add(pet);tropical.card(8,0,0,0,.9,.65,pet);
  const circle=geometry(new T.TorusGeometry(.55,.06,6,24));const guideBeacon=make(cone,gold,0,0,0,.35,.8,.35);guideBeacon.rotation.z=Math.PI;guideBeacon.castShadow=false;const marker=make(circle,gold,s.x,height(s.x,s.z)+.1,s.z);marker.rotation.x=-Math.PI/2;marker.visible=false;
  let currentHint=0,jumpY=0,velocity=0,towerY=0,towerV=0,airborne=false,stairAngle=0,step=0,lastPad=-1,petX=s.x-1,petZ=s.z+1;
  const entityMeshes=[],collectibles=[],particles=[],blooms=[],pads=[],bubbles=[];let popped=0;const bubbleMaterial=mat('#a8eaf1',{transparent:true,opacity:.45,roughness:.08,metalness:.2,depthWrite:false});
  function sign(p){const g=new T.Group();g.position.set(p.x,height(p.x,p.z),p.z);scene.add(g);const ring=make(circle,gold,0,.12,0,1.5,1,1.5,g);ring.rotation.x=-Math.PI/2;
   if(p.kind==='friend')tropical.card(({pip:8,mila:11,ollie:10,luna:9})[p.id],0,.04,0,p.id==='ollie'?1.1:1.25,p.id==='ollie'?1.8:.95,g);
   if(p.kind==='bounce'){make(cylinder,cream,0,.5,0,.25,1,.25,g);make(ball,mat('#96764d',{map:tropical.grain}),0,1,0,1.05,.3,1.05,g);for(let i=0;i<5;i++)make(ball,cream,Math.sin(i*2)*.6,1.25,Math.cos(i*2)*.6,.12,.04,.12,g);}
   if(p.kind==='balloon'){make(box,gold,0,.5,0,.8,.6,.8,g);make(ball,pink,0,3,0,1.3,1.65,1.3,g);for(const x of [-.4,.4])make(cylinder,cream,x,1.5,0,.025,1.6,.025,g);}
   if(p.kind==='chest'){make(box,gold,0,.4,0,1.1,.7,.8,g);make(box,ink,0,.45,.42,.15,.3,.05,g);}
   if(p.kind==='wardrobe')make(cone,purple,0,1,0,.7,1.5,.7,g);
   entityMeshes.push({p,g,ring});}
  explorePlaces.filter(p=>p.kind!=='friend').forEach(sign);
  for(const item of exploreItems){if(s.collected.includes(item.id))continue;const m=item.kind==='fruit'?tropical.card(item.tile,item.x,height(item.x,item.z)+.12,item.z,.9,1):make(item.kind==='shell'?geometry(new T.SphereGeometry(.3,12,8)):ball,item.kind==='glow'||item.kind==='seaTreasure'||item.kind==='islandTreasure'?gold:cream,item.x,item.kind==='seaTreasure'?-.03:height(item.x,item.z)+.3,item.z,.32,.2,.32);collectibles.push({item,m});}
  const padColors=[pink,gold,mat('#76cbe1')];for(let i=0;i<3;i++){const {x,z}=islandPoint('crystalCove',-2+i*2,51),m=make(cylinder,padColors[i],x,height(x,z)+.12,z,.75,.22,.75);pads.push({x,z,m});}
  const rideBalloon=new T.Group();rideBalloon.name='Angelique balloon';scene.add(rideBalloon);make(box,mat('#9b713e',{map:tropical.grain}),0,.1,0,1.3,.65,1.3,rideBalloon);// Keep the canopy above her head, not intersecting the character model.
  make(ball,pink,0,5.2,0,1.8,2.2,1.8,rideBalloon);for(const x of [-.6,.6])make(cylinder,cream,x,2.1,0,.025,3.6,.025,rideBalloon);rideBalloon.visible=!!ride;
  function boardBalloon(){bodyScale=1;flightVX=flightVZ=0;ride=1;swimming=false;flightY=height(s.x,s.z)+.5;flightTarget=Math.min(40,flightY+9);s.flight=flightY;targetPoint=null;route=[];blur();reward('balloon','🎈 ¡Tú pilotas!','🎈 You’re the pilot!');if(pendingRealm){targetPoint={x:pendingRealm.x,z:pendingRealm.z};flightTarget=pendingRealm.y||12;pendingRealm=null;}save();}
  function clearLanding(){if(traversable(s.x,s.z))return;for(let r=.25;r<=4;r+=.25)for(let i=0;i<24;i++){const a=i/24*Math.PI*2,x=s.x+Math.sin(a)*r,z=s.z+Math.cos(a)*r;if(traversable(x,z)){s.x=x;s.z=z;return;}}}
  function popBalloon(){if(!ride)return;ride=0;s.flight=0;airborne=true;towerY=flightY;towerV=1;targetPoint=null;route=[];blur();rideBalloon.visible=false;spark(s.x,s.z,26,flightY+4);joy.effect('balloon-pop');tell('💥 ¡Pop!','💥 Pop!');save();}
  const rideBoat=dockBoat||new T.Group();if(!dockBoat)scene.add(rideBoat);rideBoat.name='Dock boat';rideBoat.position.set(s.boat.x,.25,s.boat.z);rideBoat.rotation.y=s.boat.heading-Math.PI/2;
  let bodyScale=s.growth,giantDepth=false,riderOverlay=false;
  const snack=new T.Group();snack.name='Angelique snack';snack.position.set(.22,1.45,.3);avatar.add(snack);snack.visible=false;
  const coconutSnack=new T.Group(),bananaSnack=new T.Group();snack.add(coconutSnack,bananaSnack);
  make(ball,mat('#765035',{map:tropical.grain}),0,0,0,.16,.15,.13,coconutSnack);
  make(ball,cream,0,.04,.095,.135,.11,.045,coconutSnack);
  make(ball,mat('#eee3cd'),0,.04,.13,.08,.065,.02,coconutSnack);
  const bananaCurve=geometry(new T.TorusGeometry(.15,.05,6,12,Math.PI*1.25));
  const banana=make(bananaCurve,mat('#ffe57b'),0,0,0,1,1,1,bananaSnack);banana.rotation.z=-.8;
  for(const side of [-1,1]){const peel=make(bananaCurve,gold,side*.035,-.07,-.02,.8,.65,.6,bananaSnack);peel.rotation.z=side*.9;}
  const growthRing=make(geometry(new T.TorusGeometry(.6,.035,6,32)),mat('#ffdf84',{transparent:true,opacity:.8,depthWrite:false}),0,0,0);growthRing.rotation.x=-Math.PI/2;growthRing.visible=false;growthRing.name='Growth glow';
  const foodTrees=tropical.foodTrees||[];for(const tree of foodTrees)tree.fruits.forEach((m,i)=>m.visible=i>=(s.harvested[tree.id]||0));
  let impactLeft=0,impactPower=0,impactX=0,impactZ=0;
  const impactWave=make(geometry(new T.TorusGeometry(1,.055,6,48)),mat('#ffe5ab',{transparent:true,opacity:0,depthWrite:false}),0,0,0);impactWave.name='Giant impact wave';impactWave.rotation.x=-Math.PI/2;impactWave.visible=false;
  const fallenCoconut=mat('#80613c',{map:tropical.grain});
  function giantLanding(){
   if(s.growth<2||inside||boating||ride||inWater(s.x,s.z)||onDock(s.x,s.z))return;
   impactLeft=1.2;impactPower=Math.min(1,(s.growth-1)/5);impactX=s.x;impactZ=s.z;
   impactWave.position.set(s.x,height(s.x,s.z)+.12,s.z);joy.effect('giant-stomp');
   let gathered=0;
   for(const tree of foodTrees){const n=s.harvested[tree.id]||0;if(tree.kind!=='coconut'||Math.hypot(tree.x-s.x,tree.z-s.z)>3+s.growth||n>=tree.fruits.length||s.food.coconut>=99||gathered>=4)continue;
    const pos=tree.fruits[n].getWorldPosition(new T.Vector3());tree.fruits[n].visible=false;s.harvested[tree.id]=n+1;s.food.coconut++;gathered++;
    if(motion()&&particles.length<70){const m=make(ball,fallenCoconut,pos.x,pos.y,pos.z,.24);m.name='Shaken coconut';particles.push({m,vx:(tree.x-s.x)*.5,vz:(tree.z-s.z)*.5,vy:2,life:2,size:.2});}
   }
   if(motion())spark(s.x,s.z,22,height(s.x,s.z)+.3);
   tell(gathered?'💥 ¡BUM! 🥥 +'+gathered:'💥 ¡BUM!',gathered?'💥 BOOM! 🥥 +'+gathered:'💥 BOOM!');
   if(gathered)save();
  }
  function boatNear(){return !inside&&!ride&&Math.hypot(s.x-s.boat.x,s.z-s.boat.z)<3.1;}
  function board(){if(!boatNear())return;bodyScale=1;Object.assign(s.boat,recoverBoat(s.boat.x,s.boat.z));boating=true;swimming=false;boatSpeed=0;s.x=s.boat.x;s.z=s.boat.z;targetPoint=null;route=[];blur();joy.boat?.(true,0);reward('boat','⛵ ¡Tú conduces!','⛵ You’re the captain!');}
  function disembark(){if(!boating)return;boating=false;boatSpeed=0;joy.boat?.(false);const dock=Math.hypot(s.boat.x-6.5,s.boat.z-16)<3;s.x=dock?4:s.boat.x+Math.cos(s.boat.heading)*1.5;s.z=dock?16:s.boat.z-Math.sin(s.boat.heading)*1.5;const edge=Math.max(1,Math.hypot(s.x/169.8,s.z/144.8));s.x/=edge;s.z/=edge;targetPoint=null;blur();save();}
  function harvest(){if(!foodNear)return;const tree=foodNear,n=s.harvested[tree.id]||0;if(n>=tree.fruits.length||s.food[tree.kind]>=99)return;s.harvested[tree.id]=n+1;s.food[tree.kind]++;tree.fruits[n].visible=false;spark(s.x,s.z,8);joy.effect('correct');tell(tree.kind==='coconut'?'🥥 +1 · Toca 🥥 🍌 para comer':'🍌 +1 · Toca 🥥 🍌 para comer',tree.kind==='coconut'?'🥥 +1 · Tap 🥥 🍌 to eat':'🍌 +1 · Tap 🥥 🍌 to eat');save();}
  const picnic=new T.Group();scene.add(picnic);const picnicSpot=islandPoint('wilds',-6,-26);picnic.position.set(picnicSpot.x,height(picnicSpot.x,picnicSpot.z)+.08,picnicSpot.z);make(box,pink,0,0,0,2,.04,1.6,picnic);for(let i=0;i<5;i++)tropical.card(4+i%4,(i%3)*.5-.5,.12,Math.floor(i/3)*.5-.25,.4,.45,picnic);
  const rainbow=new T.Group();const rainbowSpot=islandPoint('crystalCove',9,48);rainbow.position.set(rainbowSpot.x,height(rainbowSpot.x,rainbowSpot.z)+2,rainbowSpot.z);scene.add(rainbow);['#f58da6','#f7b875','#f6de7e','#a3d49b','#8bcbd9','#b6a0e1'].forEach((c,i)=>make(geometry(new T.TorusGeometry(3-i*.16,.1,6,40,Math.PI)),mat(c),0,0,0,1,1,1,rainbow));
  const wish=new T.Group();scene.add(wish);wish.position.set(-1,height(-1,-5)+10,-5);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;make(ball,gold,Math.sin(a)*2,Math.cos(a)*2,0,.15,.15,.15,wish);}wish.visible=false;
  let netTime=0;const net=new T.Group();net.name='Butterfly net';avatar.add(net);net.position.set(.45,1.1,.3);make(cylinder,cream,0,.05,0,.025,.65,.025,net);make(circle,gold,0,.65,0,.65,.65,.65,net);net.visible=false;
  const butterflies=[],catchRing=make(circle,gold,0,0,0);catchRing.name='Butterfly catch ring';catchRing.visible=false;
  const bubbleRimMaterial=mat('#b9edf1',{transparent:true,opacity:.55,depthWrite:false});
  const pickMaterial=mat('#ffffff',{transparent:true,opacity:0,depthWrite:false});
  for(let i=0;i<25;i++){const g=new T.Group();g.name='Butterfly '+i;scene.add(g);const color=mat(['#edaa48','#77c9d4','#d58fc8'][i%3],{side:T.DoubleSide});make(ball,ink,0,0,0,.045,.12,.04,g);const wings=[-1,1].map(side=>{const wing=new T.Group();g.add(wing);make(ball,color,side*.19,.05,0,.25,.19,.025,wing);make(ball,color,side*.14,-.12,0,.17,.14,.025,wing);for(const y of [-.1,.07])make(ball,cream,side*.25,y,.027,.045,.045,.012,wing);return wing;});const hit=make(ball,pickMaterial,0,0,0,.7,.7,.7,g);hit.castShadow=false;butterflies.push({g,wings,hit,cooldown:0});}
  function catchButterfly(b){if(!b||b.cooldown>0||!b.g.visible||ride||inside||boating||airborne||Math.hypot(s.x-b.g.position.x,s.z-b.g.position.z)>3)return;b.cooldown=8;netTime=1.2;s.catches=Math.min(9999,s.catches+1);spark(b.g.position.x,b.g.position.z,12,b.g.position.y);joy.note(s.catches%5,.3);tell('🦋 '+s.catches+' · ¡Vuela libre!','🦋 '+s.catches+' · Fly free!');save();}
  function catchNearest(){if(paused()||document.hidden||!panel.hidden)return;const b=butterflies.filter(b=>b.g.visible&&b.cooldown===0).sort((a,b)=>a.g.position.distanceTo(avatar.position)-b.g.position.distanceTo(avatar.position))[0];if(b&&Math.hypot(s.x-b.g.position.x,s.z-b.g.position.z)<3)catchButterfly(b);else{const i=bubbles.findIndex(b=>Math.hypot(s.x-b.m.position.x,s.z-b.m.position.z)<3);if(i>=0)popBubble(i);}}
  // The lighthouse opens as a cutaway at its actual location, with a walkable spiral stair.
  const interior=new T.Group();interior.name='Lighthouse interior';interior.position.set(-1,height(-1,-5),-5);interior.visible=inside;if(tower)tower.visible=!inside;scene.add(interior);
  const stairMaterial=mat('#c6a676'),wallMaterial=mat('#e4dfcc',{side:T.DoubleSide}),railMaterial=mat('#6d8585');
  make(geometry(new T.CylinderGeometry(1.6,1.6,6.4,32,1,true,Math.PI*.5,Math.PI)),wallMaterial,0,3.2,0,1,1,1,interior);
  make(cylinder,stairMaterial,0,.04,0,1.6,.12,1.6,interior);make(cylinder,railMaterial,0,3.2,0,.12,6.4,.12,interior);
  for(let i=0;i<40;i++){const a=i/39*Math.PI*4,y=.15+i/39*6.1;const tread=make(box,stairMaterial,Math.sin(a)*.9,y,Math.cos(a)*.9,.95,.12,.52,interior);tread.rotation.y=a;make(cylinder,railMaterial,Math.sin(a)*1.4,y+.35,Math.cos(a)*1.4,.025,.7,.025,interior);}
  for(const radius of [.45,1.4]){const points=[];for(let i=0;i<=80;i++){const a=i/80*Math.PI*4;points.push(new T.Vector3(Math.sin(a)*radius,.85+i/80*6.1,Math.cos(a)*radius));}make(geometry(new T.TubeGeometry(new T.CatmullRomCurve3(points),80,.035,5,false)),railMaterial,0,0,0,1,1,1,interior);}
  make(cylinder,stairMaterial,0,6.4,0,1.7,.15,1.7,interior);const lantern=make(ball,gold,0,7.3,0,.35,.5,.35,interior);
  const beamCopy=make(geometry(new T.ConeGeometry(1.5,14,20,1,true)),mat('#ffed9d',{transparent:true,opacity:.16,depthWrite:false,side:T.DoubleSide}),0,7.3,-7,1,1,1,interior);beamCopy.rotation.x=Math.PI/2;beamCopy.visible=false;beamCopy.castShadow=false;
  const seaLife=[];
  const patrols=[{x:0,z:0,rx:32,rz:26},...worldIslands.map(p=>({x:p.x,z:p.z,rx:p.rx+8,rz:p.rz+8}))];
  patrols.forEach((p,i)=>{const {g,moving}=oceanModel(T,{geometry,mat,make,ball},'Reef shark');g.name='Reef shark '+(i+1);scene.add(g);const a=i*Math.PI*.4,spawn=recoverShark(p.x+Math.cos(a)*p.rx,p.z+Math.sin(a)*p.rz);g.position.set(spawn.x,-.22,spawn.z);seaLife.push({g,tail:moving[0],a,nav:{...spawn,cx:p.x,cz:p.z,rx:p.rx,rz:p.rz,waypoint:Math.round(a/(Math.PI*2)*24)%24,direction:i%2?-1:1}});});
  const ripple=make(geometry(new T.TorusGeometry(.65,.025,5,28)),mat('#e2fffa',{transparent:true,opacity:.65,depthWrite:false}),0,-.03,0);ripple.rotation.x=-Math.PI/2;ripple.castShadow=false;ripple.visible=false;
  if(s.badges.includes('beacon')){if(beam)beam.material.opacity=.22;if(crystal)crystal.material.emissiveIntensity=1.1;beamCopy.visible=true;}
  function enterTower(){inside=true;swimming=false;stair=0;stairAngle=0;towerY=.22;towerV=0;airborne=false;targetPoint=null;route=[];blur();s.x=-1;s.z=-4.1;interior.visible=true;if(tower)tower.visible=false;host.classList.add('inside-lighthouse');tell('👣 Sigue los escalones · ⤴ Salta','👣 Follow the steps · ⤴ Jump');save();}
  function leaveTower(falling=false){inside=false;interior.visible=false;if(tower)tower.visible=true;host.classList.remove('inside-lighthouse');if(falling){airborne=true;towerY+=height(-1,-5);}else{s.x=-1;s.z=-2.5;towerY=0;towerV=0;}targetPoint=null;route=[];save();}
  function lightBeacon(){if(!inside||stair<.97)return;beamCopy.visible=true;if(beam)beam.material.opacity=.22;if(crystal)crystal.material.emissiveIntensity=1.1;reward('beacon','✨ ¡Luz para los barcos!','✨ A light for the boats!');}
  const desired=new T.Vector3();
  const raycaster=new T.Raycaster(),plane=new T.Plane(new T.Vector3(0,1,0),0),hit=new T.Vector3();
  const walkTo=e=>{if(!panel.hidden||paused())return;const r=canvas.getBoundingClientRect();raycaster.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);const buddy=friendSystem?.hit(raycaster);if(buddy){friendSystem.open(buddy.id);joy.gesture();return;}
 const swimFriend=!mountId&&!boating&&!ride&&!houseSystem?.isInside()?wildLife?.hit(raycaster,s.x,s.z):null;
 if(swimFriend){wildLife.markRidden(swimFriend);friendSystem?.ride(swimFriend.kind==='Dolphin'?'dori':'pip',{x:swimFriend.g.position.x,z:swimFriend.g.position.z});joy.gesture();return;}
 const storyHit=!ride&&!boating&&!inside&&!airborne?story.hit(raycaster):null;if(storyHit){route=islandPath(s,storyHit);targetPoint=route.shift()||null;joy.gesture();canvas.focus({preventScroll:true});return;}const bubbleHit=raycaster.intersectObjects(bubbles.map(b=>b.hit),false)[0];if(bubbleHit){popBubble(bubbles.findIndex(b=>b.hit===bubbleHit.object));joy.gesture();return;}const butterflyHit=raycaster.intersectObjects(butterflies.filter(b=>b.g.visible&&b.cooldown===0).map(b=>b.hit),false)[0];if(butterflyHit){const b=butterflies.find(b=>b.hit===butterflyHit.object);if(!ride&&!boating&&!inside&&!airborne&&Math.hypot(s.x-b.g.position.x,s.z-b.g.position.z)>=3){route=islandPath(s,b.g.position);targetPoint=route.shift()||null;}else catchButterfly(b);joy.gesture();return;}if(inside){plane.constant=-(height(-1,-5)+towerY);if(raycaster.ray.intersectPlane(plane,hit)){targetPoint={x:hit.x,z:hit.z};route=[];}plane.constant=0;return;}if(raycaster.ray.intersectPlane(plane,hit)){// Refine the ground intersection for the raised island.
    for(let i=0;i<3;i++){plane.constant=inWater(hit.x,hit.z)?0:-height(hit.x,hit.z);raycaster.ray.intersectPlane(plane,hit);}plane.constant=0;
    const radius=Math.sqrt((hit.x/170)**2+(hit.z/145)**2);const destination={x:hit.x/Math.max(1,radius),z:hit.z/Math.max(1,radius)};route=boating||ride?[]:islandPath(s,destination);targetPoint=boating||ride?destination:route.shift()||null;marker.position.set(destination.x,inWater(destination.x,destination.z)?.04:height(destination.x,destination.z)+.1,destination.z);marker.visible=!!targetPoint;joy.gesture();canvas.focus({preventScroll:true});}};canvas.addEventListener('pointerdown',walkTo);
  function spark(x,z,n=12,y=height(x,z)+.7){for(let i=0;i<n&&particles.length<70;i++){const m=make(ball,i%2?gold:pink,x,y,z,.09);particles.push({m,vx:(Math.random()-.5)*4,vz:(Math.random()-.5)*4,vy:2+Math.random()*3,life:1.4});}}
  function popBubble(i){if(i<0||paused()||document.hidden||!panel.hidden)return;const b=bubbles.splice(i,1)[0];scene.remove(b.m);joy.note((popped++)%5,.2);s.pops=Math.min(9999,s.pops+1);spark(b.m.position.x,b.m.position.z,8,b.m.position.y);tell('🫧 '+s.pops+' · ¡Pop!','🫧 '+s.pops+' · Pop!',false);save();}
  function blowBubbles(){for(let i=0;i<10&&bubbles.length<20;i++){const x=s.x+(Math.random()-.5)*4,z=s.z+(Math.random()-.5)*4,m=make(ball,bubbleMaterial,x,height(x,z)+1+Math.random()*2,z,.3+Math.random()*.25);m.name='Catchable bubble';const rim=make(circle,bubbleRimMaterial,0,0,0,.95,.95,.95,m);make(ball,cream,-.28,.3,.7,.12,.22,.04,m);const hit=make(ball,pickMaterial,0,0,0,1.7,1.7,1.7,m);hit.castShadow=false;bubbles.push({m,hit,rim,life:24});}}
  function bloom(n){while(blooms.length<n){const i=blooms.length,{x,z}=islandPoint('islet',24+Math.sin(i*2.4)*1.8,-8+Math.cos(i*2.4)*1.2);blooms.push(tropical.card(15,x,height(x,z),z,1,1));}}
  function dress(){hat.visible=s.hat>0;hat.traverse(o=>{if(o.isMesh)o.material.color.set(['#b9a474','#b9a474','#a57252','#687b54','#db8b85','#4c9fa8','#edbe4d'][s.hat]);});}
  camera.fov=60;camera.updateProjectionMatrix();
  control={catchNearest,falling:()=>airborne,boardBalloon,popBalloon,board,disembark,boatNear,harvest,snack:(kind)=>{coconutSnack.visible=kind==='coconut';bananaSnack.visible=kind==='banana';spark(s.x,s.z,16,avatar.position.y+bodyScale*1.4);},enterTower,leaveTower,lightBeacon,bubbles:blowBubbles,hop:(v=5)=>{if(inside){if(towerV===0)towerV=v;}else if(!airborne&&jumpY<.1)velocity=v+(s.growth>=2?Math.min(4,s.growth-1):0);},spark,bloom,dress,demo:()=>{music=[];spark(pads[1].x,pads[1].z,8);}};bloom(s.flowers);dress();
  const life=createIslandLife({T,scene,camera,state,make,mat,geometry,ball,cone,box,sun,ambient,waterMaterial,inWater,sharkStep});wildLife=life;
  cityLife=createPizzaCity({T,scene,camera,state,height,make,mat,geometry,ball,box,cylinder,cone,joy,save,refresh,tell:(msg)=>tell(msg,msg)});
  cityLife.attach(host);cityLife.setCoinAward(id=>earnCoins(state,id));
  houseSystem=createHouseInteriors({T,scene,camera,avatar,host,make,mat,geometry,box,ball,cone,cylinder,height,language:state.lang,companionId:()=>s.friends?.companion,onPizza:()=>cityLife?.order(),
    onEnter:()=>{if(carDriving)exitCar();if(mountId)friendSystem?.dismount();swimming=false;boating=false;ride=0;s.flight=0;blur();route=[];targetPoint=null;host.classList.add('inside-cottage');},
    onMessage:m=>tell(m,m)
  });
  friendSystem=createWildlifeFriends({T,scene,camera,host,panel,state,make,mat,geometry,ball,cone,cylinder,box,height,joy,save,refresh,motion,
    onMount:(id,position)=>{if(!id)wildLife?.unmark();
      mountId=id;birdAltitude=0;birdTarget=0;birdLanding=false;
      if(id==='mila'||id==='ollie'){birdAltitude=2.2;birdTarget=7.5;}
      targetPoint=null;route=[];blur();if(id){if(boating){boating=false;joy.boat?.(false);}if(ride){ride=0;s.flight=0;}swimming=false;airborne=false;jumpY=0;velocity=0;bodyScale=1;
       if(position){s.x=position.x;s.z=position.z;}
       if(id==='mila'||id==='ollie')tell('🪽 ¡Vamos a volar! Espacio sube, Q baja, E aterriza.','🪽 Time to fly! Space climbs, Q descends, E lands.');
       else tell('🐾 ¡Vamos de paseo! ¡Usa las flechas para viajar!','🐾 Let’s ride! Use the arrows to explore!');}
       else tell('👣 ¡Volvemos a caminar!','👣 Back on our feet!');},
    onTravel:p=>travelTo(p),
    onOpen:()=>{if(adventureMap.isOpen())adventureMap.close(false);setHelpers(false);blur();targetPoint=null;},
    onLessons:id=>{if(lessonRegions[id]!==undefined)openLessons(lessonRegions[id]);}
  });
  const story=createWorldStory({T,scene,host,state,height,save,joy,spark,openNext,motion,refresh:id=>{earnCoins(state,'story-'+id);bloom(s.flowers);refresh();},active:()=>!paused()&&!document.hidden&&panel.hidden&&!inside&&!swimming&&!boating&&!ride&&!airborne&&!document.querySelector('dialog[open]')});
  const realms=createRealms({T,scene,host,state,make,geometry,mat,ball,box,cylinder,height,save,joy,spark,refresh,tell,navigate:(realm,dest)=>{if(!dest)return;setHelpers(false);if(dest.action==='food'){if(s.food.banana+s.food.coconut)showFood();else travelTo(explorePlaces.find(p=>p.id==='wilds'));return;}if(dest.action==='learn'){followGoal();return;}if(realm==='sky'){if(boating)disembark();if(ride){targetPoint={x:dest.x,z:dest.z};route=[];flightTarget=dest.y||12;}else{pendingRealm=dest;const launch=explorePlaces.filter(p=>p.kind==='balloon').sort((a,b)=>Math.hypot(a.x-s.x,a.z-s.z)-Math.hypot(b.x-s.x,b.z-s.z))[0];route=islandPath(s,launch);targetPoint=route.shift()||null;tell('🎈 Sube al globo para explorar el cielo','🎈 Board the balloon to explore the sky');}return;}if(realm==='islands'){travelTo(dest);return;}if(ride){waterLanding=dest;targetPoint={x:dest.x,z:dest.z};route=[];flightTarget=Math.max(8,flightY);return;}if(boating)disembark();route=islandPath(s,dest);targetPoint=route.shift()||null;tell('🌊 Sigue el brillo · Nada para descubrir','🌊 Follow the glow · Swim to discover');}});
  const journey=createJourney({T,scene,host,state,avatar,make,geometry,mat,height,save,joy,spark,refresh,realms,seek:kind=>{if(kind==='explore')showDiscover();else if(kind==='food'){if(s.food.banana+s.food.coconut)showFood();else travelTo(explorePlaces.find(p=>p.id==='wilds'));}else if(kind==='learn')followGoal();else{const dest=kind==='fly'?explorePlaces.find(p=>p.id==='balloon'):{x:11,z:20};route=islandPath(s,dest);targetPoint=route.shift()||null;}}});
  function update(dt,time){if(disposed)return;dt=Math.min(dt,.05);if(messageTime>0){messageTime-=dt;if(messageTime<=0)message.classList.remove('show');}
   const down=(...ks)=>ks.some(k=>keys.has(k));let dx=stick.x+(down('ArrowRight','d','D')?1:0)-(down('ArrowLeft','a','A')?1:0),dz=stick.z+(down('ArrowDown','s','S')?1:0)-(down('ArrowUp','w','W')?1:0);
   if(targetPoint&&panel.hidden){const x=targetPoint.x-s.x,z=targetPoint.z-s.z,d=Math.hypot(x,z);if(d<.25){targetPoint=route.shift()||null;marker.visible=!!targetPoint;}else{dx=x/d;dz=z/d;}}
   if(paused()||journey.isOpen()||document.querySelector('dialog[open]')){keys.clear();stick.x=stick.z=0;dx=dz=0;}const active=!paused()&&!document.hidden&&panel.hidden&&!journey.isOpen()&&!document.querySelector('dialog[open]');if(active){currentHint=Math.max(0,currentHint-dt);swimBoost=Math.max(0,swimBoost-dt);rescueCooldown=Math.max(0,rescueCooldown-dt);}const speed=houseSystem?.isInside()?0:carDriving?0:mountId?(mountId==='dori'?10.5:8):inside?2:swimming?(swimBoost>0||down('Shift')?6:3.3):(down('Shift')||energy>0?7:4.7),len=Math.hypot(dx,dz);if(active&&houseSystem?.isInside()){const p=houseSystem.move(dx,dz,dt);if(len)avatar.rotation.y=Math.atan2(dx,dz);}
   if(len>0&&active&&!carDriving&&!ride&&!inside&&!boating&&!houseSystem?.isInside()){dx/=Math.max(1,len);dz/=Math.max(1,len);let nx=s.x+dx*speed*dt,nz=s.z+dz*speed*dt;const edge=Math.sqrt((nx/170)**2+(nz/145)**2);if(edge>1){nx/=edge;nz/=edge;}if(!airborne&&!mountId&&!remoteAccess(s,{x:nx,z:nz})){nx=s.x;nz=s.z;if(currentHint===0){tell('🌊 Corrientes fuertes · ⛵ 🎈','🌊 Strong currents · ⛵ 🎈');currentHint=5;}}if(mountId||airborne||traversable(nx,nz)){s.x=nx;s.z=nz;}else if(traversable(nx,s.z))s.x=nx;else if(traversable(s.x,nz))s.z=nz;avatar.rotation.y=Math.atan2(dx,dz);step+=dt*12;autosave+=dt;if(autosave>2){save();autosave=0;}}
   let landed=false;if(active&&dt>0&&(jumpY>0||velocity>0)){const aboveGround=jumpY>0;velocity-=15*dt;jumpY=Math.max(0,jumpY+velocity*dt);if(jumpY===0){velocity=0;landed=aboveGround;}}
   if(birdMount()&&active){
    const to=birdLanding?0:birdTarget,pace=birdLanding?5.8:6.4;
    birdAltitude+=Math.sign(to-birdAltitude)*Math.min(Math.abs(to-birdAltitude),dt*pace);
    if(birdLanding&&birdAltitude<=.35){friendSystem?.dismount();birdAltitude=0;}
   }
   const wasSwimming=swimming;swimming=!inside&&!ride&&!boating&&!carDriving&&!airborne&&!mountId&&!houseSystem?.isInside()&&inWater(s.x,s.z);if(!swimming&&!inside&&!ride&&walkable(s.x,s.z))lastShore={x:s.x,z:s.z};
   host.classList.toggle('is-swimming',swimming);if(swimming&&!wasSwimming)tell('🏊 Nada · 🦈 ¡Cuidado con las aletas!','🏊 Swim · 🦈 Watch for fins!');
   if(active){energy=Math.max(0,energy-dt);eating=Math.max(0,eating-dt);}host.classList.toggle("snack-moment",eating>0);
   if(carDriving){
    if(active){const car=s.city.car,desired=len?Math.atan2(dx,dz):car.heading;
     const change=Math.atan2(Math.sin(desired-car.heading),Math.cos(desired-car.heading));
     car.heading+=change*Math.min(1,dt*4.2);
     carSpeed+=((len?19:0)-carSpeed)*Math.min(1,dt*(len?3.5:5));
     const nx=car.x+Math.sin(car.heading)*carSpeed*dt,nz=car.z+Math.cos(car.heading)*carSpeed*dt;
     if(cityLife.canDrive(nx,nz)){car.x=nx;car.z=nz;}else carSpeed=0;
     s.x=car.x;s.z=car.z;avatar.rotation.y=car.heading;
     autosave+=dt;if(autosave>2){save();autosave=0;}
    }
    cityLife.updateCar();
   }
   if(boating){if(active){const input=Math.min(1,len),desiredHeading=len?Math.atan2(dx,dz):s.boat.heading;const delta=Math.atan2(Math.sin(desiredHeading-s.boat.heading),Math.cos(desiredHeading-s.boat.heading));s.boat.heading+=delta*Math.min(1,dt*3);boatSpeed+=(input*15-boatSpeed)*Math.min(1,dt*2);const moveX=len?dx/len:Math.sin(s.boat.heading),moveZ=len?dz/len:Math.cos(s.boat.heading);const next=boatStep(s.boat.x,s.boat.z,moveX*boatSpeed*dt,moveZ*boatSpeed*dt);if(Math.hypot(next.x-s.boat.x,next.z-s.boat.z)<.00001)boatSpeed=0;s.boat.x=next.x;s.boat.z=next.z;s.x=s.boat.x;s.z=s.boat.z;autosave+=dt;if(autosave>2){save();autosave=0;}}joy.boat?.(active,boatSpeed/16);rideBoat.position.set(s.boat.x,.25,s.boat.z);rideBoat.rotation.y=s.boat.heading-Math.PI/2;avatar.rotation.y=s.boat.heading;}
   if(inside&&active){
    const oldAngle=Math.atan2(s.x+1,s.z+5),onStairs=stair<.97;
    let nx=s.x+dx/Math.max(1,len)*speed*dt,nz=s.z+dz/Math.max(1,len)*speed*dt;
    let radius=Math.hypot(nx+1,nz+5);
    if(onStairs){
     // Solid inner and outer rails keep imperfect joystick movement on the treads.
     const angle=radius>.001?Math.atan2(nx+1,nz+5):oldAngle;
     radius=Math.max(.65,Math.min(1.15,radius));
     const delta=Math.atan2(Math.sin(angle-oldAngle),Math.cos(angle-oldAngle));
     const next=Math.max(0,Math.min(Math.PI*4,stairAngle+delta));
     stairAngle=next;stair=next/(Math.PI*4);
     nx=-1+Math.sin(next)*radius;nz=-5+Math.cos(next)*radius;
    }
    s.x=nx;s.z=nz;
    const support=stair>=.97?6.48:.22+stair*6.1;
    if(towerV!==0||towerY>support+.03){towerV-=12*dt;towerY+=towerV*dt;if(towerY<=support){towerY=support;towerV=0;}}else towerY=support;
    if(len){avatar.rotation.y=Math.atan2(dx,dz);step+=dt*10;}
    // The open lookout still allows deliberate walking and jumping off the edge.
    if(!onStairs&&radius>1.75)leaveTower(true);
   }
   let ax=s.x,az=s.z,ay=boating?.74:swimming?-.95+(motion()?Math.sin(time*3)*.04:0):onDock(ax,az)?.58+jumpY:height(ax,az)+jumpY;
   if(houseSystem?.isInside()){const p=houseSystem.position();ax=p.x;az=p.z;ay=p.y;}
   if(carDriving){ay=height(s.city.car.x,s.city.car.z)+1.08;ax=s.x;az=s.z-.25;}
   if(mountId){ay=(inWater(s.x,s.z)?0:height(s.x,s.z))+birdAltitude+
      (mountId==='dori'?1.28:mountId==='pip'?.98:mountId==='luna'?1.4:birdMount()?2.0:2.25);}
   if(boating){ax-=Math.sin(s.boat.heading)*.45;az-=Math.cos(s.boat.heading)*.45;}
   if(inside)ay=height(-1,-5)+towerY;
   if(airborne){const floor=inWater(ax,az)?-.95:onDock(ax,az)?.58:height(ax,az);if(active){towerV-=12*dt;towerY+=towerV*dt;}ay=towerY;if(ay<=floor){landed=active;airborne=false;towerV=0;clearLanding();ax=s.x;az=s.z;ay=inWater(ax,az)?-.95:onDock(ax,az)?.58:height(ax,az);jumpY=0;velocity=0;}}
   danger=false;for(const shark of seaLife){const g=shark.g;const dist=Math.hypot(g.position.x-s.x,g.position.z-s.z);const chase=swimming&&dist<8&&rescueCooldown===0;
    if(active){shark.nav.x=g.position.x;shark.nav.z=g.position.z;shark.nav.detour=Math.max(0,(shark.nav.detour||0)-dt);const next=sharkPatrol(shark.nav,dt,chase&&!shark.nav.detour?{x:s.x,z:s.z}:null),mx=next.x-g.position.x,mz=next.z-g.position.z;if(Math.hypot(mx,mz)>.00001)g.rotation.y=Math.atan2(mx,mz);g.position.x=next.x;g.position.z=next.z;}shark.tail.rotation.y=motion()?Math.sin(time*(chase?16:8)+shark.a)*.38:0;
    if(chase)danger=true;if(chase&&dist<1.25&&active){s.x=lastShore.x;s.z=lastShore.z;ax=s.x;az=s.z;ay=height(ax,az);swimming=false;danger=false;rescueCooldown=8;s.growth=1;bodyScale=1;eating=0;energy=0;targetPoint=null;route=[];blur();tell('🐢 Pip te llevó a la playa. ¡Pequeña y a salvo!','🐢 Pip brought you to shore. Small again. Safe!');save();}}
   host.classList.toggle('shark-nearby',danger);ripple.visible=swimming;ripple.position.set(ax,-.03,az);ripple.scale.setScalar(1+(motion()?Math.sin(time*4)*.12:0));arms.forEach((arm,i)=>{arm.rotation.x=mountId?-.7:swimming&&motion()?Math.sin(time*7+i*Math.PI)*.9:0;});

   if(ride){if(active){const ease=1-Math.exp(-dt*6);flightVX+=(dx/Math.max(1,len)*18-flightVX)*ease;flightVZ+=(dz/Math.max(1,len)*18-flightVZ)*ease;let nx=s.x+flightVX*dt,nz=s.z+flightVZ*dt;const edge=Math.max(1,Math.hypot(nx/169.8,nz/144.8));s.x=nx/edge;s.z=nz/edge;if(len)avatar.rotation.y=Math.atan2(dx,dz);if(waterLanding&&Math.hypot(s.x-waterLanding.x,s.z-waterLanding.z)<3){flightTarget=.4;waterLanding=null;}const floor=inWater(s.x,s.z)?.4:onDock(s.x,s.z)?.58:height(s.x,s.z);const clearance=Math.hypot(s.x+1,s.z+5)<2.5?height(-1,-5)+9:floor;const destination=Math.max(flightTarget,clearance+.5);flightY+=Math.sign(destination-flightY)*Math.min(Math.abs(destination-flightY),dt*4);s.flight=flightY;autosave+=dt;if(autosave>2){save();autosave=0;}if(flightTarget<=floor+.5&&flightY<=floor+.6){ride=0;s.flight=0;clearLanding();swimming=inWater(s.x,s.z);tell('🎈 ¡Aterrizaste!','🎈 Landed!');save();}}ax=s.x;az=s.z;ay=flightY+.68;}
   if(active){impactLeft=Math.max(0,impactLeft-dt);if(landed)giantLanding();}
   const impactStrength=motion()?impactPower*impactLeft/1.2:0,impactPhase=(1.2-impactLeft)*22;
   impactWave.visible=impactStrength>0;impactWave.scale.setScalar(1+(1.2-impactLeft)*(5+impactPower*5));impactWave.material.opacity=impactStrength*.75;
   tropical.setImpact?.(impactX,impactZ,impactStrength,impactPhase);
   // Keep saved giant size on foot; fit seats and the narrow lighthouse while using them.
   const sizeGoal=inside||boating||ride||mountId||carDriving||houseSystem?.isInside()?1:s.growth;
   if(active||dt===0)bodyScale=motion()&&dt>0?bodyScale+(sizeGoal-bodyScale)*(1-Math.exp(-dt*2.8)):sizeGoal;
   avatar.scale.setScalar(bodyScale);shadow.scale.setScalar(bodyScale);
   if(giantDepth!==(bodyScale>1.05)){giantDepth=bodyScale>1.05;avatar.traverse(o=>{if(o.isMesh&&!riderOverlay)o.material.depthTest=giantDepth;});}
   // The sea is a transparent shader drawn after opaque geometry. During rides,
   // render Angelique in the LAST transparent layer so water, sails, and basket
   // cannot hide her when the camera or vehicle moves.
   const riding=boating||!!ride||!!mountId||carDriving;
   if(riderOverlay!==riding){
    riderOverlay=riding;
    avatar.traverse(o=>{if(!o.isMesh)return;
     const material=o.material;
     material.transparent=riding;
     material.depthWrite=!riding;
     material.depthTest=riding?false:giantDepth;
     material.needsUpdate=true;
     o.renderOrder=riding?100:20;
     o.frustumCulled=!riding;
    });
   }
   if(swimming)ay-=.95*(bodyScale-1);
   growthRing.visible=eating>0&&motion();growthRing.position.set(ax,ay+.08,az);growthRing.scale.setScalar(bodyScale*(1+(2-eating)*.55));growthRing.material.opacity=eating*.4;
   avatar.position.set(ax,ay,az);shadow.position.set(ax,houseSystem?.isInside()?0:height(ax,az)+.05,az);shadow.visible=!ride&&!swimming&&!inside&&!boating&&!airborne&&!mountId&&!carDriving&&!houseSystem?.isInside();legs.forEach((l,i)=>{l.visible=!swimming;l.rotation.x=carDriving?-.58:mountId?-.65:len>0?Math.sin(step+i*Math.PI)*.55:0;});rideBalloon.visible=!!ride;rideBalloon.position.set(s.x,flightY,s.z);rideBalloon.rotation.z=motion()?Math.sin(time*1.2)*.035:0;snack.visible=eating>0;snack.position.y=1.45+(motion()?Math.sin(eating*10)*.08:0);snack.scale.setScalar(.55+.45*Math.min(1,eating/2));if(eating>0)arms[1].rotation.x=-1.4;
   rainbow.visible=s.badges.includes('song');picnic.visible=s.badges.includes('picnic');wish.visible=s.badges.includes('beacon');wish.rotation.y=time*.2;pet.visible=s.pet&&!friendSystem?.hasCompanion('pip')&&!inside&&!boating&&!ride;petX+=(s.x-1-petX)*Math.min(1,dt*3);petZ+=(s.z+1-petZ)*Math.min(1,dt*3);pet.position.set(petX,inWater(petX,petZ)?-.05:height(petX,petZ)+Math.abs(Math.sin(step))*.1,petZ);pet.rotation.y=avatar.rotation.y;
   const phone=canvas.clientWidth<780;
   if(houseSystem?.isInside())desired.set(ax,ay+10,az+15);
   else if(inside&&stair>=.97)desired.set(7,ay+7,10);
   else if(inside)desired.set(-1,ay+4.2,4);
   else if(riding){
    // A lower, wider ride camera keeps the whole girl, boat or balloon in shot.
    // Follow fast enough that she cannot slide off a narrow phone screen.
    desired.set(ax,ay+(ride?14:mountId?15:carDriving?13:12),az+(phone?35:32));
   }else desired.set(ax,ay+(phone?24:20)+(bodyScale-1)*2,az+(phone?32:27)+(bodyScale-1)*2);
   camera.position.lerp(desired,houseSystem?.isInside()?1:dt===0?1:1-Math.exp(-dt*(riding?18:5)));
   if(riding)camera.position.x=ax;
   target.set(ax,ay+(houseSystem?.isInside()?1.0:riding?(ride?2.25:mountId?1.6:1.3):.7*bodyScale),az-(houseSystem?.isInside()?1.2:0));if(impactStrength>0){camera.position.x+=Math.sin(impactPhase*1.7)*impactStrength*.18;camera.position.y+=Math.cos(impactPhase*1.3)*impactStrength*.14;}
   near=null;let distance=2.6;for(const e of entityMeshes){const d=Math.hypot(s.x-e.p.x,s.z-e.p.z);if(d<distance){near=e.p;distance=d;}e.ring.material=d<2.6?pink:gold;e.ring.position.y=.14+(motion()?Math.sin(time*2)*.04:0);}
   if(inside||swimming||boating||ride||carDriving||airborne||mountId||houseSystem?.isInside())near=null;act.hidden=!near||!!ride;setText(act,near?near.icon+' '+(es?near.es:near.en)+' · '+say('Jugar','Play'):'');jump.disabled=false;setText(title,near?(es?near.es:near.en):(()=>{const land=worldIslands.find(p=>Math.hypot((s.x-p.x)/p.rx,(s.z-p.z)/p.rz)<1);return land?(es?land.es:land.en):say('Angelique · explora a tu aire','Angelique · wander anywhere');})());const region=near?lessonRegions[near.id]:undefined;lesson.hidden=region===undefined||!!ride;setText(lesson,region===undefined?'':say('✦ Aventura con ','✦ Adventure with ')+({pip:'Pip',mila:'Mila',ollie:'Ollie',luna:'Luna',garden:say('el jardín','the garden'),beacon:say('el faro','the lighthouse')}[near.id]));ponytail.rotation.x=Math.sin(step)*Math.min(len,1)*.16;
   for(let i=collectibles.length-1;i>=0;i--){const c=collectibles[i];if(motion()&&c.item.kind==='glow'){c.m.position.y=height(c.item.x,c.item.z)+.6+Math.sin(time*2+i)*.15;}if(!ride&&!inside&&!boating&&!airborne&&Math.hypot(s.x-c.item.x,s.z-c.item.z)<.9){if(collectExplore(s,c.item.id)){earnCoins(state,c.item.id);scene.remove(c.m);collectibles.splice(i,1);spark(s.x,s.z);joy.note(countExplore(s,c.item.kind)%5,.18);tell(`${countExplore(s,c.item.kind)} · ${c.item.es} / ${c.item.en}  ✦`,`${countExplore(s,c.item.kind)} · ${c.item.en} / ${c.item.es}  ✦`,false);save();refresh();}}}
   let padIndex=pads.findIndex(p=>Math.hypot(s.x-p.x,s.z-p.z)<.75);if(padIndex!==lastPad&&padIndex>=0&&!ride&&!inside){joy.note([0,2,4][padIndex],.4);spark(pads[padIndex].x,pads[padIndex].z,8);music.push(padIndex);music=music.slice(-3);if(music.join(',')==='0,1,2')reward('song','¡Inventaste la canción del arcoíris!','You made the rainbow song!');}lastPad=padIndex;
   butterflies.forEach((b,i)=>{if(active)b.cooldown=Math.max(0,b.cooldown-dt);b.g.visible=b.cooldown<6.5;const {x:cx,z:cz}=islandPoint('islet',24+Math.sin(i*2.4)*(i<5?.25:2.6),-8+Math.cos(i*2.4)*(i<5?.2:1.9));const t=motion()?time:0;b.g.position.set(cx+Math.sin(t*.6+i)*1.4,height(cx,cz)+1.5+Math.cos(t*.8+i)*.35,cz+Math.cos(t*.6+i)*1.1);b.wings.forEach((w,j)=>w.rotation.y=motion()?Math.sin(time*9)*(j?1:-1)*.8:0);});
   const closest=butterflies.filter(b=>b.g.visible&&b.cooldown===0&&Math.hypot(s.x-b.g.position.x,s.z-b.g.position.z)<3).sort((a,b)=>a.g.position.distanceTo(avatar.position)-b.g.position.distanceTo(avatar.position))[0];const nearbyBubble=bubbles.some(b=>Math.hypot(s.x-b.m.position.x,s.z-b.m.position.z)<3);catchButton.hidden=(!closest&&!nearbyBubble)||!!ride||inside||boating||swimming||airborne;setText(catchButton,closest?say('🦋 Atrapar','🦋 Catch'):say('🫧 ¡Pop!','🫧 Pop'));catchRing.visible=!!closest&&!catchButton.hidden;if(active)netTime=Math.max(0,netTime-dt);net.visible=netTime>0;net.rotation.z=Math.sin(netTime*5)*.6;if(catchRing.visible){catchRing.position.copy(closest.g.position);catchRing.lookAt(camera.position);catchRing.scale.setScalar(.9);}
   if(active&&!inside&&!boating&&!airborne&&!ride&&Math.hypot(s.x+4,s.z-6)<.75&&jumpY===0&&velocity===0){velocity=10;joy.effect('tap');}
   for(let i=bubbles.length-1;i>=0;i--){const b=bubbles[i];if(active)b.life-=dt;if(active&&motion())b.m.position.y+=dt*.08;b.rim.lookAt(camera.position);if(b.life<=0){scene.remove(b.m);bubbles.splice(i,1);}else if(active&&!ride&&!inside&&!boating&&Math.hypot(s.x-b.m.position.x,s.z-b.m.position.z)<1&&Math.abs(ay+1-b.m.position.y)<1)popBubble(i);}
   for(let i=particles.length-1;active&&i>=0;i--){const p=particles[i];p.life-=dt;if(p.life<=0){scene.remove(p.m);particles.splice(i,1);continue;}p.vy-=5*dt;p.m.position.x+=p.vx*dt;p.m.position.y+=p.vy*dt;p.m.position.z+=p.vz*dt;p.m.scale.setScalar(Math.max(.01,p.life*(p.size||.08)));}
   goal=nextIslandAdventure(state);const destination=goalPlace(),arrived=atGoal();guideBeacon.visible=!!destination;if(destination)guideBeacon.position.set(destination.x,height(destination.x,destination.z)+3.5+(motion()?Math.sin(time*2)*.2:0),destination.z);
   setText(goalTitle,goal?say(`TU SIGUIENTE PASO · ${Math.min(goal.done+1,48)}/48`,`YOUR NEXT STEP · ${Math.min(goal.done+1,48)}/48`):say('¡LO LOGRASTE!','YOU DID IT!'));
   const subjects=[say('Ayuda a Pip con los números.','Help Pip with numbers.'),say('Prepara comida con Mila.','Get food ready with Mila.'),say('Descubre la naturaleza con Ollie.','Discover nature with Ollie.'),say('Haz música con Luna.','Make music with Luna.'),say('Cuida el jardín de la amistad.','Care for the friendship garden.'),say('Lleva tus ideas al faro.','Bring your ideas to the lighthouse.')];
   setText(goalText,goal?(arrived?say('¡Llegaste! Empecemos.','You’re here! Let’s begin.'):subjects[goal.region]):say('Todas las aventuras están completas. Puedes volver a jugar.','Every adventure is complete. You can play again.'));
   setText(goalButton,goal?(arrived?say('▶ Empezar aventura','▶ Start adventure'):say('➜ Llévame','➜ Take me there')):say('Explorar otra vez','Explore again'));goalButton.disabled=!!ride;
   const announcement=goal?goal.id+':'+arrived:'complete';if(goalAnnounced!==announcement&&!paused()&&!ride&&panel.hidden&&!document.querySelector('dialog[open]')&&guide(goalWords()))goalAnnounced=announcement;
   foodNear=!inside&&!swimming&&!boating&&!ride&&!airborne&&!mountId&&!houseSystem?.isInside()?foodTrees.find(t=>Math.hypot(t.x-s.x,t.z-s.z)<2&&(s.harvested[t.id]||0)<t.fruits.length):null;
   if(near?.kind==='balloon'){foodNear=null;}if(near?.kind==='islet')setText(act,({wilds:'🍌',coconutCoast:'🥥',sunset:'✨'})[near.id]||'🫧');
   if(near?.id==='beacon')setText(act,say('🚪 Entrar al faro','🚪 Enter lighthouse'));
   pad.classList.toggle('flight-stick',!!ride||birdMount());pad.classList.toggle('steering',(!!ride||birdMount())&&len>.05);setText(knob,ride?'🎈':birdMount()?'🪽':'✥');setText(stickReadout,ride?'↕ '+Math.round(flightY)+' m':birdMount()?'↕ '+Math.round(birdAltitude)+' m':'');pad.style.setProperty('--heading',Math.atan2(dx,-dz)+'rad');
   descend.hidden=!ride&&!birdMount();for(const e of entityMeshes)if(e.p.id==='balloon')e.g.visible=!ride;
   if(ride){setText(title,say('🎈 Angelique, piloto','🎈 Pilot Angelique'));act.hidden=false;setText(act,say('💥 Reventar globo','💥 Pop balloon'));setText(jump,say('↑ Más alto','↑ Higher'));setText(instructions,say('Flechas para volar · Espacio ↑ · Q ↓ · E 💥','Arrows to fly · Space ↑ · Q ↓ · E 💥'));}
   else if(carDriving){setText(title,say('🚙 ¡Ciudad Pizza!','🚙 Pizza City Driver'));act.hidden=false;setText(act,say('👣 Salir del auto','👣 Get out of car'));setText(jump,say('👣 Bajar','👣 Exit car'));setText(instructions,say('🚙 Flechas para conducir · Espacio / E para salir','🚙 Arrows to drive · Space / E to exit'));}
   else if(mountId){setText(title,(birdMount()?'🪽 ':'🐾 ')+(birdMount()?say('Volando con ','Flying with '):say('Paseando con ','Riding with '))+(mountId==='dori'?'Dori':mountId==='pip'?'Pip':mountId==='luna'?'Luna':mountId==='mila'?'Mila':'Ollie'));
    setText(act,birdMount()?say('🛬 Aterrizar','🛬 Land'):say('👣 Bajar del animal','👣 Hop off'));act.hidden=false;
    setText(jump,birdMount()?say('🪽 Subir','🪽 Climb'):say('👣 Bajar','👣 Dismount'));
    setText(instructions,birdMount()?say('Flechas: volar · Espacio: subir · Q: bajar · E: aterrizar','Arrows: fly · Space: climb · Q: descend · E: land'):say('Flechas para pasear · E para bajar','Arrows to ride · E to hop off'));}
   else if(houseSystem?.isInside()){const furniture=houseSystem.nearbyProp();setText(title,houseSystem.current()?.[es?'es':'en']||'🏠');setText(act,furniture?'👀 '+(es?furniture.esName:furniture.enName):say('🚪 Salir de casa','🚪 Leave house'));act.hidden=false;setText(jump,say('🚪 Salir','🚪 Exit'));setText(instructions,say('Camina por la casa · Toca los muebles · Salir','Walk inside · Explore furniture · Exit'));}
   else if(boating){setText(title,say('⛵ Angelique, capitana','⛵ Captain Angelique'));setText(goalTitle,say('NAVEGA A TU AIRE','SAIL ANYWHERE'));setText(goalText,say('Palanca / flechas para conducir.','Joystick / arrows to drive.'));setText(goalButton,say('⛵ Cómo navegar','⛵ Steering help'));act.hidden=false;setText(act,say('🏊 Salir del barco','🏊 Get out'));setText(jump,say('⤴ Saltar al agua','⤴ Jump out'));setText(instructions,say('Suelta para frenar · Explora toda la laguna','Release to slow down · Explore the lagoon'));}
   else if(inside){setText(title,say('Dentro del faro','Inside the lighthouse'));setText(goalTitle,stair>=.97?say('EL MIRADOR','THE LOOKOUT'):say('SIGUE LOS ESCALONES','FOLLOW THE STEPS'));setText(goalText,stair>=.97?say('Camina, salta y explora.','Walk, jump and explore.'):say('Muévete alrededor de la escalera dorada.','Walk around the golden staircase.'));setText(goalButton,stair>=.97?say('✨ Encender luz','✨ Light beacon'):say('👣 Ayuda','👣 Help'));act.hidden=stair<.97&&(stair>=.03||Math.hypot(s.x+1,s.z+4.1)>=.7);setText(act,stair>=.97?say('✨ Encender luz','✨ Light beacon'):say('🚪 Salir','🚪 Exit'));setText(jump,say('Saltar ⤴','Jump ⤴'));setText(instructions,say('Flechas / palanca para caminar · Espacio para saltar','Arrows / joystick to walk · Space to jump'));}
   else if(swimming){setText(title,say('🏊 Laguna','🏊 Lagoon'));setText(goalTitle,danger?say('🦈 ¡A LA PLAYA!','🦈 BACK TO SHORE!'):say('🏊 EXPLORA EL MAR','🏊 EXPLORE THE SEA'));setText(goalText,danger?say('Aléjate de la aleta.','Swim away from the fin.'):say('Mira las aletas. La playa está cerca.','Watch for fins. Shore is nearby.'));setText(goalButton,say('🏝 A la playa','🏝 Back to shore'));act.hidden=true;setText(jump,say('🏊 Nadar rápido','🏊 Swim fast'));setText(instructions,say('Palanca / flechas para nadar · Botón para ir más rápido','Joystick / arrows to swim · Tap Swim fast for a burst'));}
   else {setText(jump,say('Saltar ⤴','Jump ⤴'));setText(instructions,say('Toca el suelo para ir · Flechas / WASD · Espacio para saltar','Tap ground to walk · Arrows / WASD · Space to jump'));}
   if(!inside&&!boating&&!ride&&!mountId&&!carDriving&&!houseSystem?.isInside()&&cityLife?.nearCar(s.x,s.z)){act.hidden=false;setText(act,say('🚙 Subir al auto','🚙 Drive car'));}
   else if(!inside&&!boating&&!ride&&!mountId&&!carDriving&&!houseSystem?.isInside()&&boatNear()){act.hidden=false;setText(act,say('⛵ Subir al barco','⛵ Board boat'));}
   else if(!inside&&!boating&&!ride&&!mountId&&!houseSystem?.isInside()&&houseSystem?.near(s.x,s.z)){const h=houseSystem.near(s.x,s.z);act.hidden=false;setText(act,h.icon+' '+say('Entrar a casa','Enter house'));}
   else if(!inside&&!boating&&!ride&&!mountId&&!houseSystem?.isInside()&&wildLife?.nearestRideable(s.x,s.z)){const a=wildLife.nearestRideable(s.x,s.z);act.hidden=false;setText(act,(a.kind==='Dolphin'?'🐬':'🐢')+' '+say('Montar animal','Ride animal'));}
   else if(foodNear){act.hidden=false;setText(act,foodNear.kind==='coconut'?say('🥥 Recoger coco','🥥 Pick coconut'):say('🍌 Recoger plátano','🍌 Pick banana'));}guideBeacon.visible=guideBeacon.visible&&!inside&&!boating&&!ride;
   houseSystem?.updateDoor(s.x,s.z,!!mountId||!!ride||boating||carDriving||inside||houseSystem?.isInside());
   const playful=mountId||carDriving||houseSystem?.isInside()?null:friendSystem?.nearest(ride?'fly':boating?'boat':swimming?'swim':'walk');
   friendMeet.hidden=!playful||!!ride||inside||airborne||!!mountId||houseSystem?.isInside()||!panel.hidden||!host.classList.contains('explore-ready');
   if(playful){setText(friendMeet,playful.icon+' '+playful.name+' · '+(playful.id==='kai'?say('Saludar','Say hi'):say('Montar','Ride')));friendMeet.setAttribute('aria-label',say('Jugar con ','Play with ')+playful.name);}
   goalCard.hidden=boating||carDriving||inside||!!ride||airborne||near?.kind==='islet'||netTime>0;quest.hidden=true;
   adventureMap.update(false,avatar.rotation.y);
   friendSystem?.update(dt,active,{mode:houseSystem?.isInside()?'house':mountId?(inWater(s.x,s.z)?'mount-water':'mount'):ride?'fly':boating?'boat':swimming?'swim':'walk',inside:inside||houseSystem?.isInside(),mount:mountId,heading:avatar.rotation.y,roomPosition:houseSystem?.position(),mountAltitude:birdAltitude,moving:len>.1});
   cityLife?.update(dt,active,{x:s.x,z:s.z,driving:carDriving,flying:!!ride||birdAltitude>2,indoors:inside||houseSystem?.isInside()});
   life.update(dt,active,motion());realms.update(dt,active,ride?'fly':swimming?'swim':boating?'boat':'walk',ay);journey.update(dt,active,ride?'fly':swimming?'swim':boating?'boat':'walk',ay);story.update(dt,time);if(host.classList.contains("story-nearby")){lesson.hidden=true;guideBeacon.visible=false;}
   for(const [button,words] of buttonUpdates)paintButton(button,words);buttonUpdates.clear();
  }
  return {update,dispose(){cityLife?.dispose();cityLife=null;houseSystem?.dispose();houseSystem=null;friendSystem?.dispose();friendSystem=null;wildLife=null;realms.dispose();journey.dispose();life.dispose();story.dispose();canvas.removeEventListener('pointerdown',walkTo);control=null;}};
 }
 function dispose(){if(disposed)return;adventureMap.dispose();host.classList.remove('inside-lighthouse','is-swimming','shark-nearby');joy.boat?.(false);disposed=true;generation++;clearTimeout(startTimer);clearTimeout(recoveryTimer);canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored);save();engine?.dispose();engine=null;document.removeEventListener('keydown',keydown);document.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',blur);keys.clear();}
 return {dispose};
}

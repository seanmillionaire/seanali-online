import {cruiseCameraPose} from './cruise-helm.js';
import {loadMainlandData} from './mainland-loader.js';
import {createRoadPaintQuery} from './startup-queries.js';
import {createAutomaticDriver,planAutomaticDrive,vehiclePoseClear,autoDrivePlaces} from './auto-drive.js';
import {drivingCameraPose,chaseDriveInput} from './driving-camera.js';
import {createRainforestWorld} from './rainforest-world.js';
import {ownedCars,carName} from './estate-cars.js';
import {safeVehicleExit} from './vehicle-contact.js';
import {jungleContains} from './east-jungle-layout.js';
import {createEastJungleLife} from './east-jungle-life.js';
import {wildlifeEncounter,SAFETY_LESSONS} from './wildlife-safety.js';
import {createFruitAbundance} from './fruit-abundance.js';
import {highwayWidth,FOUR_LANE_ROADS} from './highway-layout.js?v=225';
import {createRoadRewards,createRewardModels} from './road-rewards.js?v=225';
import {worldClock} from './world-clock.js?v=225';
import {createCanalBridges} from './canal-bridges.js?v=235';
import {createMansionLife} from './mansion-life.js?v=225';
import {HOME_OUTFITS} from './mansion-state.js?v=225';
import {sailingSpeedLimit,sailingVelocity} from './ocean-travel.js?v=225';
import {regionalClearing} from './regional-layout.js?v=225';
import {createRegionalScenery} from './regional-scenery.js?v=225';
import {FLIGHT_SPEED,birdTravelSpeed,flightStep} from './flight-travel.js?v=225';
import {createCityAirCollision,createWorldCollision,createRoadSurfaceSampler} from './world-collision.js?v=225';
import {adventureIcon} from './adventure-icons.js?v=225';
import {createTouchJoystick} from './touch-joystick.js?v=225';
import {groundTravelSpeed,groundTravelStep,impactPose} from './travel-mode.js?v=225';
import {createRuralTowns,ruralBlocks} from './rural-towns.js?v=225';
import {roadRibbon,surfaceMesh} from './road-surfaces.js?v=225';
import {touchesLava,returnToHospital,createCityHospital} from './volcano-safety.js?v=225';
import {locationLabel} from './location-label.js?v=225';
import {waterFriend,animalStep} from './animal-boundaries.js?v=225';
import {MAINLAND_ROADS,HIGHWAY_CURVES,HIGHWAY_WIDTH,bridgeDeckHeight,mainlandAt,mainlandRoadRoute,roadDistance,roadsidePoint} from './explore-state.js?v=225';
import {planHighwayGuardrails} from './highway-rails.js?v=225';
import {createPanamaLife} from './panama-life.js?v=225';
import {createCloseCamera} from './close-camera.js?v=225';
import {WORLD_BOUNDS,freshwaterHabitat,canalWater} from './geography.js?v=225';
import {createExtendedDistricts} from './expanded-districts.js?v=225';
import {createCampaign} from './campaign.js?v=225';
import {createColonAdventure} from './colon-adventure.js?v=225';
import {createCanalCruise} from './canal-cruise.js?v=225';
import {createRealms} from './realms.js?v=225';
import {createJourney} from './journey.js?v=225';
import {oceanModel} from './ocean-models.js?v=225';
import {createIslandLife,naturalSharkPatrol as sharkPatrol} from './island-life.js?v=225';
import {createWorldStory,islandStories} from './world-story.js?v=225';
import {REGION_PROJECTS,regionForPosition,missionStatus,restoreRegions,createRegionProjectWorld} from './region-projects.js?v=225';
import {createWorldMap} from './world-map.js?v=225';
import {createWildlifeFriends} from './wildlife-friends.js?v=225';
import {createVillageBuilders} from './village-builders.js?v=225';
import {createHouseInteriors} from './house-interiors.js?v=225';
import {createPizzaCity} from './pizza-city.js?v=225';
import {driveByDirection} from './directional-drive.js?v=225';
import {createIslandWorkshop,BUILD_RECIPES,RESOURCE_INFO} from './island-workshop.js?v=225';
import {ESTATE_PLANS,estateCosts,estateMissing,findEstateSite,canBuildEstate,buildEstate,canUpgradeEstate,upgradeEstate,estateBlocked,createEstateWorld} from './estate.js?v=225';
import {buildIsland} from './entrance.js?v=225';
import {islandPoint,remoteAccess,worldIslands,explorePlaces,exploreItems,volcanoTrailPoint,normalizeExplore,spendFood,harvestFood,collectExplore,badgeExplore,countExplore,islandPath,walkable,inWater,onDock,sharkStep,recoverShark,boatStep,recoverBoat,traversable,nextIslandAdventure,coinBalance,earnCoins,syncWallet,islandShop,buyIslandItem} from './explore-state.js?v=225';
export function createExplore(host,{state,save,joy,speak=()=>false,paused=()=>false,welcomeMessage=null,openLessons=()=>{},openNext=()=>{},motion,openBook,openHome,load=()=>import('./vendor/three.module.min.js')}){
 const es=state.lang==='es',say=(a,b)=>es?a:b,s=state.world=normalizeExplore(state.world);syncWallet(state);
 let disposed=false,engine=null,control=null,builderSystem=null,friendSystem=null,houseSystem=null,mansionLife=null,wildLife=null,cityLife=null,panamaLife=null,cruiseLife=null,colonLife=null,workshop=null,estateWorld=null,regionWorld=null,carDriving=false,carSpeed=0,mountId=null,birdAltitude=0,birdTarget=0,birdLanding=false,near=null,ride=s.flight?1:0,flightY=s.flight||0,flightTarget=s.flight||0,flightVX=0,flightVZ=0,route=[],targetPoint=null,keys=new Set(),music=[],messageTime=0,autosave=0;
 let roadRewards=null,rewardJet=false,rewardReturn=null;let pendingRealm=null,waterLanding=null;let swimming=false,inside=false,stair=0,boating=false,boatSpeed=0,sailLimit=15,sailProbe=0,sailHeading=0,stepDistance=0,soundX=s.x,soundZ=s.z,fallSoundPlayed=false,foodNear=null,eating=0,energy=0,swimBoost=0,rescueCooldown=0,danger=false,lastShore={x:4,z:10};
 let closeView=false,cameraSnap=true;try{closeView=localStorage.getItem('isla-adventure-camera-v1')==='close';}catch{}
 let regionFocusMode=false;
 let goal=nextIslandAdventure(state),goalAnnounced='',lastVoice=-Infinity,welcomed=false;
 function guide(){return false;}
 function goalPlace(){return goal?explorePlaces.find(p=>p.id===goal.place):null;}
 function atGoal(){const p=goalPlace();return p&&Math.hypot(s.x-p.x,s.z-p.z)<2.6;}
 function goalWords(){if(!goal)return say('¡Completaste todas las aventuras! Elige un lugar en Descubrir para volver a jugar.','You completed every adventure! Choose a place in Discover to play again.');const names=[say('las conchas de la playa','the beach shell trail'),say('Mila en el huerto','Mila at the orchard'),say('Ollie en el bosque','Ollie in the grove'),say('Luna junto a la música','Luna by the music notes'),say('el jardín','the garden'),say('el faro','the lighthouse')];return atGoal()?say('¡Aquí estamos, Angelique! Toca Empezar aventura para ayudar.','We’re here, Angelique! Tap Start adventure to help.'):say('Angelique, vamos a ayudar a ','Angelique, let’s help ')+names[goal.region]+say('. Toca Llévame y caminaré contigo.','. Tap Take me there and I’ll walk with you.');}
 function listen(){
  panel.replaceChildren();panel.hidden=false;blur();setHelpers(false);
  panel.append(btn('×','panel-close',()=>{panel.hidden=true;canvas.focus();}),makeEl('h2','',say('🧭 Juega a tu manera','🧭 Play your way')));
  for(const [a,b] of [
   ['🕹️ Camina con las flechas o la palanca. Toca el suelo para caminar allí.','🕹️ Move with arrows or the joystick. Tap the ground to walk there.'],
   ['✨ Acércate a algo: el botón de acción te dice qué puedes hacer.','✨ Go near something: the action button tells you what you can do.'],
   ['🗺️ Abre el mapa para elegir un lugar. Navega desde un muelle para visitar islas.','🗺️ Open the map to choose a place. Sail from a dock to visit islands.'],
   ['🛼 Usa patines para ir más rápido. Cambia a caminar cuando quieras.','🛼 Use skates to move faster. Switch back to walking anytime.'],
   ['🏡 Elige tu mansión gratis o gana monedas para comprar o construir.','🏡 Choose a free mansion or earn coins to buy or build one.'],
   ['💾 Tu progreso se guarda solo. Las aventuras son opcionales.','💾 Progress saves automatically. Adventures are optional.']])panel.append(makeEl('p','',say(a,b)));
 }
 function followGoal(){if(cruiseLife?.isActive())return;if(paused()||ride||control?.falling())return;if(boating){tell('⛵ Flechas para navegar · ⤴ Salir','⛵ Arrows to steer · ⤴ Get out');return;}if(inside){if(stair>=.97)control?.lightBeacon();else tell('👣 Sigue los escalones dorados','👣 Follow the golden steps');return;}if(swimming){route=islandPath(s,lastShore);targetPoint=route.shift()||null;swimBoost=3;return;}if(!goal){showDiscover();return;}if(atGoal()){openNext(goal.id);return;}const p=goalPlace();if(!walkable((s.x+p.x)/2,(s.z+p.z)/2)||!remoteAccess(s,p)){travelTo(p);return;}route=islandPath(s,p);targetPoint=route.shift()||null;panel.hidden=true;guide(say('¡Sígueme! Angelique va al siguiente lugar. Al llegar, toca Empezar aventura.','Follow me! Angelique is walking to the next place. When we arrive, tap Start adventure.'),true);}

 const makeEl=(tag,cls,txt)=>{const e=document.createElement(tag);e.className=cls;if(txt)e.textContent=['h2','h3','h4','p'].includes(tag)&&/^[\p{L}\p{N}]/u.test(txt)?'💡 '+txt:txt;return e;};
 function paintButton(b,text){
  // Every gameplay action keeps its full accessible label, while the visible
  // button uses an unmistakable large emoji + a short readable caption.
  if(b.dataset.words===text)return;
  b.dataset.words=text;
  if(!b.matches('.world-small,.world-action,.world-jump,.world-catch,.discover-place,.goal-next')){
   b.textContent=text;return;
  }
  const emoji=/^[\p{Extended_Pictographic}\uFE0F\u200D]+/u.exec(text);
  let icon=emoji?.[0]||'⭐';
  let label=text.replace(/^[^\p{L}\p{N}]+/u,'').trim();
  const named=(symbol,caption)=>{icon=symbol;label=caption;};
  if(b.classList.contains('food-button'))named('🥥',say('Comida','Food'));
  else if(b.classList.contains('wallet-button'))named('🪙',text.replace(/\D/g,'')||'0');
  else if(b.classList.contains('craft-bag-button'))named('🎒',say('Construir','Build')+(text.match(/\d+\/\d+/)?.[0]?' '+text.match(/\d+\/\d+/)[0]:''));
  else if(b.classList.contains('city-guide-button'))named('🏙️',say('Ciudad','City'));
  else if(b.classList.contains('helper-toggle'))named(text==='×'?'✕':'🧭',text==='×'?say('Cerrar','Close'):say('Menú','Menu'));
  else if(/Lugares|Places/.test(text))named('📍',say('Lugares','Places'));
   else if(/Descubrir|Discover|Explorar|Explore/.test(text))named('🗺️',say('Mapa','Map'));
  else if(/Historias|Stories/.test(text))named('📖',say('Historias','Stories'));
  else if(text==='⌂')named('🏡',say('Casa','Home'));
  else if(/Ayuda|Help/.test(text))named('💡',say('Ayuda','Help'));
  else if(b.classList.contains('world-catch'))named('🦋',say('Atrapar','Catch'));
  else if(b.classList.contains('world-jump')){
   if(/Outside to yard|Salir al jard/i.test(text))named('🚪',say('Al jardín','To yard'));
   else if(/alto|Higher|Subir(?! al)|Climb|Up/.test(text))named('⬆️',say('Subir','Up'));
   else if(/Bajar|Lower|Descend/.test(text))named('⬇️',say('Bajar','Down'));
   else if(/Salir|out|Exit/.test(text))named('👣',say('Salir','Exit'));
   else if(/normal/i.test(text))named('🏊',say('Lento','Slow'));
   else if(/nad|swim/i.test(text))named('🏊',say('Rápido','Fast'));
   else named('🦘',say('Saltar','Jump'));
  }else if(b.classList.contains('world-action')){
   if(/Enter house.*gym|Entrar a casa.*gimnasio/i.test(text))named('⬇️',say('Gimnasio','Into gym'));
   else if(/raspao/i.test(text))named('🍧','Raspao');
   else if(/Pescar|Catch fish/.test(text))named('🎣',say('Pescar','Fish'));
   else if(/Cocinar|Cook a meal/.test(text))named('🔥',say('Cocinar','Cook'));
   else if(/policía|officer/i.test(text))named('👮',say('Hablar','Talk'));
   else if(/Reventar|Pop balloon/.test(text))named('🎈',say('¡Pop!','Pop!'));
   else if(/Patear|Shoot|fútbol|Football/i.test(text))named('⚽',say('Patear','Kick'));
   else if(/Carrera|Rally|rally|race/i.test(text))named('🏁',say('Carrera','Race'));
   else if(/Pintar|Paint|mural/i.test(text))named('🎨',say('Pintar','Paint'));
   else if(/Intercambiar|Trade|market|Mercado/i.test(text))named('🥭',say('Vender','Trade'));
   else if(/Pizza|pizza|Pizzería|Pizzeria/i.test(text))named('🍕',say('Pizza','Pizza'));
   else if(/Construir|Build/.test(text))named('🛠️',say('Construir','Build'));
   else if(/Drive.*Ferrari|Conducir.*Ferrari/.test(text))named('🏎️','Ferrari');
   else if(/Drive.*Lamborghini|Conducir.*Lamborghini/.test(text))named('🏎️','Lamborghini');
   else if(/Carro|auto|car|Drive/.test(text))named('🚙',/salir|out|exit/i.test(text)?say('Salir','Exit'):say('Conducir','Drive'));
   else if(/Recoger|Pick/.test(text))named(/coco|coconut|🥥/i.test(text)?'🥥':/plátano|banana|🍌/i.test(text)?'🍌':'🐚',say('Recoger','Pick up'));
   else if(/Board|Subir al|Ride/.test(text))named(/barco|boat|⛵/i.test(text)?'⛵':'🐢',say('Subir','Ride'));
   else if(/Salir|Exit|Leave/.test(text))named('🚪',say('Salir','Leave'));
   else if(/Aventura|Adventure/.test(text))named('⭐',say('Jugar','Play'));
   else if(/Jugar|Play/.test(text))named('🎮',say('Jugar','Play'));
   else if(/Burbujas|bubbles/.test(text))named('🫧',say('Burbujas','Bubbles'));
   else if(/Entrar|Enter/.test(text))named('🚪',say('Entrar','Enter'));
   else if(/Ver|Explore|Discover|Descubrir/.test(text))named('🔎',say('Explorar','Explore'));
   else if(/Amigos|Friends|Saludar|hello/i.test(text))named('🐢',say('Amigos','Friends'));
  }else if(b.classList.contains('goal-next'))named('👣',say('¡Vamos!','Let’s go!'));
  else if(b.classList.contains('discover-place')){
   if(/Little again|Volver a pequeña/.test(text))named('👧',say('Pequeña','Small'));
   else if(/hat|Sombrero/.test(text))named('🎩',say('Sombrero','Hat'));
   else if(/×.*Comer|×.*Eat/.test(text))label=text.slice(text.indexOf('×'));
   else if(text==='⛵')named('⛵',say('Barco','Boat'));
   else if(text==='🎈')named('🎈',say('Globo','Balloon'));
   else if(text==='🏊')named('🏊',say('Nadar','Swim'));
   else if(/Ir a construir|Go build/.test(text))named('🛠️',say('Ir a construir','Go build'));
   else if(/Build now|Construir ahora/.test(text))named('🛠️',say('Construir','Build'));
   else if(/Visitar|Visit/.test(text))named('📍',say('Visitar','Visit'));
   else label=label.split(' · ')[0];
  }
  if(!label)label=say('Jugar','Play');
  b.dataset.uiKind=/🏡|Casa|Home|mansión|mansion/i.test(icon+' '+label)?'home':/🫶|📱|Amigos|Friends|amigas/i.test(icon+' '+label)?'friends':/🍧|🍕|🍳|🍌|🥥|Comida|Food|Eat|Comer/.test(icon+' '+label)?'food':/🎮|🎨|Activities|Actividades/.test(icon+' '+label)?'play':'explore';
  b.classList.add('picture-button');
  b.setAttribute('aria-label',text);b.title=text;
  if(b.firstElementChild?.classList.contains('button-picture')){
   const [picture,caption,full]=b.children;
   if(picture.dataset.icon!==icon){picture.innerHTML=adventureIcon(icon);picture.dataset.icon=icon;}
   if(caption.textContent!==label)caption.textContent=label;
   full.textContent=text;return;
  }
  const picture=makeEl('span','button-picture'),caption=makeEl('span','button-caption',label),full=makeEl('span','button-original',text);
  picture.innerHTML=adventureIcon(icon);picture.dataset.icon=icon;picture.setAttribute('aria-hidden','true');caption.setAttribute('aria-hidden','true');full.setAttribute('aria-hidden','true');
  b.replaceChildren(picture,caption,full);
 }
 const btn=(txt,cls,fn)=>{const b=makeEl('button',cls);b.type='button';paintButton(b,txt);b.onclick=()=>{joy.gesture();fn();};return b;};
 const loading=makeEl('div','world-loading');loading.setAttribute('role','status');loading.setAttribute('aria-live','polite');loading.append(makeEl('span','loading-sun','☀️'),makeEl('div','loading-postcard','🇵🇦 '+say('¡Tu Panamá te espera!','Your Panama awaits!')),makeEl('div','loading-note',say('🌴 Preparando tu aventura…','🌴 Getting your adventure ready…')));host.append(loading);
 let canvas=makeEl('canvas','explore-canvas');canvas.setAttribute('aria-label',say('Explora con Angelique. Usa flechas o WASD, o toca el suelo.','Explore as Angelique. Use arrows or WASD, or tap the ground.'));canvas.tabIndex=0;
 const hud=makeEl('div','explore-hud'),title=makeEl('div','explore-location','🏖️ '+say('Playa Gorgona','Playa Gorgona')),bag=makeEl('div','explore-bag'),quest=makeEl('div','explore-hint',say('¡Panamá te espera! Disfruta la playa de Gorgona o explora a tu aire.','Panama awaits! Enjoy Gorgona beach or explore anywhere.'));
 const goalCard=makeEl('section','island-goal'),goalTitle=makeEl('strong',''),goalText=makeEl('p',''),goalButton=btn('','goal-next',()=>{if(regionFocusMode)showRegionProject();else followGoal();});goalCard.setAttribute('aria-label',say('Tu siguiente aventura','Your next adventure'));goalCard.append(goalTitle,goalText,goalButton);
 const regionStatus=makeEl('div','region-help-status');regionStatus.hidden=true;
 regionStatus.setAttribute('aria-live','off');regionStatus.setAttribute('aria-label',say('Progreso para ayudar la región','Regional restoration progress'));
 let lastMissionRegion='';
 const message=makeEl('div','explore-message');message.setAttribute('role','status');message.setAttribute('aria-live','polite');
 const volcanoStatus=makeEl('div','volcano-hike-status');volcanoStatus.hidden=true;
 volcanoStatus.setAttribute('role','status');volcanoStatus.setAttribute('aria-live','off');
 const volcano=worldIslands.find(i=>i.id==='sunset');
 const volcanoPath=Array.from({length:101},(_,i)=>volcanoTrailPoint(i/100));
 const onVolcano=(x,z)=>Math.hypot((x-volcano.x)/volcano.rx,(z-volcano.z)/volcano.rz)<.99;
 const summitGoal=volcanoTrailPoint(1);
 const lessonRegions={mila:1,ollie:2,luna:3,garden:4,beacon:5};
 const lesson=btn(say('Una aventura','An adventure'),'world-action world-lesson',()=>{if(near&&lessonRegions[near.id]!==undefined)openLessons(lessonRegions[near.id]);});lesson.hidden=true;
 const actions=makeEl('div','explore-actions'),act=btn(say('Saludar','Say hello'),'world-action',interact),jump=btn(say('Saltar ⤴','Jump ⤴'),'world-jump',hop);
 const descend=btn(say('↓ Bajar','↓ Lower'),'world-jump',()=>{if(ride)flightTarget=Math.max(0,flightTarget-5);else if(birdMount()){birdLanding=false;birdTarget=Math.max(1.5,birdTarget-3);}});descend.hidden=true;
 const friendMeet=btn('🐢 '+say('Amigos','Friends'),'world-action friend-hello',()=>{const f=friendSystem?.nearest(boating?'boat':swimming?'swim':'walk');if(f)friendSystem.open(f.id);});friendMeet.hidden=true;friendMeet.setAttribute('aria-label',say('Jugar con un amigo','Play with a friend'));
 const rideQuick=btn('🐾 '+say('Montar','Ride'),'world-action animal-ride-quick',()=>{
  if(mountId){friendSystem?.dismount();return;}
  const f=friendSystem?.nearest(swimming?'swim':'walk');
  if(f&&f.id!=='kai')friendSystem.ride(f.id);
 });
 rideQuick.hidden=true;
 rideQuick.setAttribute('aria-label',say('Montar o bajar de un amigo animal','Ride or dismount an animal friend'));
 const menu=makeEl('div','explore-menu');menu.append(btn('☷ '+say('Lugares','Places'),'world-small',showDiscover),btn('▤ '+say('Historias','Stories'),'world-small',()=>campaign.open()),btn('⌂','world-small',openHome));menu.lastChild.setAttribute('aria-label',say('Mi casita','My cottage'));menu.append(btn(say('? Ayuda','? Help'),'world-small',listen));
 const helperToggle=btn('☰','world-small helper-toggle',()=>setHelpers(!host.classList.contains('helpers-open')));menu.id='island-helper-menu';goalCard.id='island-helper-goal';helperToggle.setAttribute('aria-controls','island-helper-menu island-helper-goal');
 function setHelpers(open){host.classList.toggle('helpers-open',open);paintButton(helperToggle,open?'×':'☰');helperToggle.setAttribute('aria-expanded',String(open));helperToggle.setAttribute('aria-label',open?say('Ocultar ayuda','Hide helpers'):say('Mostrar ayuda','Show helpers'));}setHelpers(false);
 goalButton.addEventListener('click',()=>setHelpers(false));
 const walletButton=btn('','world-small wallet-button',showShop);menu.append(walletButton);
 const craftButton=btn('🎒 '+say('Mochila','Bag'),'world-small craft-bag-button',()=>showBag());craftButton.setAttribute('aria-label',say('Mochila para construir','Building and crafting bag'));menu.append(craftButton);
  const bagShortcut=btn('🎒','mobile-bag-shortcut',()=>showBag());
  bagShortcut.append(makeEl('span','mobile-bag-caption',say('Mochila','Bag')));
  bagShortcut.setAttribute('aria-label',say('Abrir mochila, inventario y materiales','Open backpack, inventory and materials'));
  bagShortcut.title=say('Mi mochila','My backpack');
 const regionButton=btn('🌍 '+say('Ayudar','Help'),'world-small region-help-button',()=>showRegionProject());
 regionButton.setAttribute('aria-label',say('Misión para ayudar esta región','Mission to help this region'));menu.append(regionButton);
 const cityGuideButton=btn('🏙️ '+say('Ciudad','City'),'world-small city-guide-button',showCityGuide);
 cityGuideButton.setAttribute('aria-label',say('Explorar actividades de Ciudad de Panamá','Explore Panama City activities'));
 cityGuideButton.hidden=true;menu.append(cityGuideButton);
 const foodButton=btn('🥥 🍌','world-small food-button',showFood);foodButton.setAttribute('aria-label',say('Mi comida','My food'));menu.append(foodButton);
 const friendMenu=btn(say('🫶 Amigos','🫶 Friends'),'world-small friend-menu-button',()=>friendSystem?.openDirectory());menu.append(friendMenu);
 const estateMenu=btn(say('🏗️ Mi pueblo','🏗️ My village'),'world-small estate-menu-button',showEstate);menu.append(estateMenu);
 const cameraButton=btn('','camera-view-toggle',toggleCamera);
 function paintCamera(){cameraButton.textContent=closeView?say('🔭 Vista amplia','🔭 Wide view'):say('👁 Primera persona','👁 First person');cameraButton.setAttribute('aria-label',closeView?say('Cambiar a vista amplia','Switch to wide camera view'):say('Mirar por los ojos de Angelique','See through Angelique’s eyes'));cameraButton.setAttribute('aria-pressed',String(closeView));host.classList.toggle('close-camera-view',closeView);}
 function toggleCamera(){if(cruiseLife?.isActive())return;closeView=!closeView;cameraSnap=true;control?.resetCamera?.();blur();try{localStorage.setItem('isla-adventure-camera-v1',closeView?'close':'wide');}catch{}paintCamera();tell(closeView?'👁 Arrastra el paisaje para mirar · Flechas para moverte':'🔭 Vista amplia',closeView?'👁 Drag the scenery to look · Arrows to move':'🔭 Wide view');}
 host.append(cameraButton);paintCamera();
 const automaticDriver=createAutomaticDriver();
 const autoDriveBar=makeEl('div','auto-drive-bar');autoDriveBar.hidden=true;
 const autoDriveButton=btn(say('🚘 Llévame','🚘 Drive me'),'',showDrivePicker);
 const autoDriveLabel=makeEl('span','auto-drive-label');autoDriveLabel.setAttribute('aria-live','polite');
 const autoDriveStop=btn(say('🕹️ Yo conduzco','🕹️ I’ll drive'),'auto-drive-stop',()=>stopAutomaticDrive(true));
 autoDriveBar.append(autoDriveButton,autoDriveLabel,autoDriveStop);host.append(autoDriveBar);
 function stopAutomaticDrive(notify=false){const was=automaticDriver.state.active;automaticDriver.stop();carSpeed=0;targetPoint=null;route=[];if(was&&notify)tell('🕹️ Tú conduces','🕹️ You’re driving');}
 function showDrivePicker(){if(!carDriving)return;setHelpers(false);if(adventureMap.isOpen())adventureMap.close(false);if(friendSystem?.isOpen())friendSystem.close();blur();panel.classList.remove('estate-panel');panel.replaceChildren();panel.hidden=false;
  const close=btn('×','panel-close',()=>{panel.hidden=true;canvas.focus({preventScroll:true});});close.setAttribute('aria-label',say('Cerrar destinos','Close destinations'));panel.append(close,makeEl('h2','',say('📍 ¿Adónde vamos?','📍 Where to?')));
  const choices=makeEl('div','auto-drive-choices');for(const p of autoDrivePlaces(s))choices.append(btn(p.icon+' '+say(p.es,p.en),'auto-drive-choice',()=>control?.startAutoDrive?.(p)));
  choices.append(btn(say('🗺️ Más lugares en el mapa','🗺️ More places on the map'),'auto-drive-choice',()=>{panel.hidden=true;adventureMap.open();}));panel.append(choices,btn(say('🕹️ Yo conduzco','🕹️ I’ll drive'),'auto-drive-choice',()=>{stopAutomaticDrive();panel.hidden=true;canvas.focus({preventScroll:true});}));
 }
 const hornButton=btn(say('📣 Bocina','📣 Horn'),'car-horn',()=>joy.recordedSound?.('horn',{volume:.45}));hornButton.hidden=true;host.append(hornButton);
 const mobileDock=makeEl('nav','mobile-game-dock');mobileDock.setAttribute('aria-label',say('Controles del mundo','World controls'));
 const dockMap=btn(say('🗺️ Mapa','🗺️ Map'),'mobile-dock-map',()=>{setHelpers(false);adventureMap.open();});
 const dockBuild=btn(say('🎒 Mochila','🎒 Backpack'),'mobile-dock-build',()=>showBag());
 const dockFriend=btn(say('🫶 Amigos','🫶 Friends'),'mobile-dock-friend',openPhone);
 const dockPhone=btn(say('📱 Teléfono','📱 Phone'),'mobile-dock-phone',openPhone);
 function openPhone(){
  if(!friendSystem){tell('📱 Cargando contactos…','📱 Loading contacts…');return;}
  if(adventureMap.isOpen())adventureMap.close(false);
  if(friendSystem.isOpen())friendSystem.close();
  setHelpers(false);blur();targetPoint=null;route=[];
  panel.replaceChildren();panel.hidden=false;panel.classList.remove('friend-panel');
  const close=btn('×','panel-close',()=>{panel.hidden=true;canvas.focus({preventScroll:true});});
  close.setAttribute('aria-label',say('Cerrar teléfono','Close phone'));
  panel.append(close,makeEl('h2','',say('📱 Teléfono de Angelique','📱 Angelique’s Phone')));
  panel.append(makeEl('p','',say('🫶 Llama a un amigo para jugar. 🏡 Envíalo a casa cuando quieras.','🫶 Call a friend to play. 🏡 Send them home whenever you like.')));
  const active=friendSystem.called();
  if(active.length||friendSystem.companion())panel.append(btn('🏡 '+say('Enviar amigo a casa','Send friend home'),'discover-place',()=>{
   if(friendSystem.sendHome())tell('🏡 ¡Tu amigo vuelve a casa!','🏡 Your friend is going home!');
   openPhone();
  }));
  const contacts=[['mila','🦜','Mila'],['ollie','🪶','Ollie'],['luna','🦀','Luna'],['kai','👦','Kai']];
  for(const [id,icon,name] of contacts){
   const joined=active.includes(id);
   const b=btn(icon+' '+name+' · '+(joined?say('🏡 Enviar a casa','🏡 Send home'):say('📞 Llamar','📞 Call')),'discover-place',()=>{
    if(joined){friendSystem.sendFriendHome(id);tell('🏡 ¡Hasta luego, '+name+'!','🏡 See you later, '+name+'!');}
    else {friendSystem.callFriend(id);tell('📞 ¡'+name+' viene a jugar!','📞 '+name+' is joining you!');}
    openPhone();
   });
   panel.append(b);
  }
 }
 const dockMore=btn(say('☰ Más','☰ More'),'mobile-dock-more',()=>setHelpers(!host.classList.contains('helpers-open')));
 mobileDock.append(dockBuild,dockMap,dockFriend);
 const setDockLabel=(control,icon,label)=>{
  const signature=icon+':'+label;
  if(control.dataset.dockLabel===signature)return;
  control.dataset.dockLabel=signature;
  const glyph=makeEl('span','mobile-dock-icon');glyph.innerHTML=adventureIcon(icon);control.replaceChildren(glyph,makeEl('span','mobile-dock-caption',label));
 };
 setDockLabel(dockMap,'🗺️',say('Mapa','Map'));
 setDockLabel(dockBuild,'🎒',say('Mochila','Backpack'));
 setDockLabel(dockFriend,'🫶',say('Amigos','Friends'));
 setDockLabel(dockPhone,'📱',say('Teléfono','Phone'));
 setDockLabel(dockMore,'☰',say('Más','More'));
 const phoneMenuButton=btn('📱 '+say('Teléfono','Phone'),'phone-menu-button',openPhone);menu.append(phoneMenuButton);
 const mobileShade=btn('×','mobile-menu-shade',()=>setHelpers(false));mobileShade.setAttribute('aria-label',say('Cerrar menú','Close menu'));
 
 const catchButton=btn('🦋','world-catch catch-action',()=>control?.catchNearest());catchButton.hidden=true;actions.append(catchButton);
 const pad=makeEl('div','explore-stick');pad.setAttribute('aria-label',say('Arrastra para moverte. Puedes salir del círculo. Suelta para parar.','Drag to move. You can drag beyond the circle. Release to stop.'));const knob=makeEl('span','stick-knob');pad.append(knob);const compass=makeEl('span','stick-compass'),stickReadout=makeEl('span','stick-readout');for(const [cls,icon] of [['north','↑'],['east','→'],['south','↓'],['west','←']])compass.append(makeEl('span',cls,icon));compass.setAttribute('aria-hidden','true');pad.append(compass,stickReadout);knob.textContent='🕹️';
 const directionPointers=new Map();
 const directions=makeEl('div','world-arrows');directions.setAttribute('role','group');directions.setAttribute('aria-label',say('Flechas para moverte','Movement arrows'));for(const [label,k]of [['↑','ArrowUp'],['←','ArrowLeft'],['↓','ArrowDown'],['→','ArrowRight']]){const b=btn(label,'',()=>{});b.textContent=label;b.setAttribute('aria-label',say('Mover ','Move ')+({ArrowUp:say('norte','north'),ArrowDown:say('sur','south'),ArrowLeft:say('oeste','west'),ArrowRight:say('este','east')}[k]));b.dataset.direction=k;b.setAttribute('aria-pressed','false');
  b.onpointerdown=e=>{if(e.button!==0||paused()||!panel.hidden)return;e.preventDefault();e.stopPropagation();directionPointers.set(e.pointerId,{button:b,key:k});b.setAttribute('aria-pressed','true');targetPoint=null;route=[];joy.gesture();try{b.setPointerCapture(e.pointerId);}catch{}canvas.focus({preventScroll:true});};
  b.onpointerup=b.onpointercancel=b.onlostpointercapture=releaseDirection;directions.append(b);}
 // A speed toggle avoids requiring a second finger while steering.
 let fastMode=false;
 const speedToggle=btn('', 'movement-speed',()=>{});
 speedToggle.setAttribute('aria-pressed','false');
 function toggleSpeed(){if(paused()||!panel.hidden)return;if(carDriving||swimming){fastMode=!fastMode;}else{s.travelMode=['skates','scooter'].includes(s.travelMode)?'walk':'skates';fastMode=false;save();tell(s.travelMode==='skates'?'🛼 ¡A patinar! La fruta te da un impulso extra.':'👟 Caminando',s.travelMode==='skates'?'🛼 Let’s skate! Fruit gives you an extra boost.':'👟 Walking');}joy.gesture();}
 speedToggle.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();e.stopPropagation();toggleSpeed();};
 speedToggle.onclick=e=>{if(e.detail===0)toggleSpeed();};
 directions.append(speedToggle);
 // Touch actions fire immediately, including while another finger holds an arrow.
 jump.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();e.stopPropagation();joy.gesture();hop();};
 jump.onclick=e=>{if(e.detail===0){joy.gesture();hop();}};
 const instructions=makeEl('div','explore-controls',say('👣 Toca para caminar · 🕹️ Flechas / WASD · ⤴ Espacio','👣 Tap to walk · 🕹️ Arrows / WASD · ⤴ Space'));
 const panel=makeEl('section','explore-panel');panel.hidden=true;panel.setAttribute('aria-label',say('Descubrimientos','Discoveries'));
 const clock=makeEl('div','world-clock'),clockTime=makeEl('time','world-clock-time'),clockSchedule=makeEl('span','world-clock-schedule', '🌅 7 AM · 🌇 7 PM');
 clock.append(clockTime,clockSchedule);clock.title=say('Un día completo = 20 minutos. El reloj descansa al abrir menús.','A full day = 20 minutes. The clock pauses in menus.');
 hud.append(title);host.append(clock);actions.append(lesson,act,jump,descend,friendMeet,rideQuick);host.append(canvas,hud,volcanoStatus,regionStatus,quest,goalCard,mobileShade,menu,helperToggle,bagShortcut,pad,directions,actions,instructions,message,panel,mobileDock);
 const adventureMap=createWorldMap({host,panel,world:s,islands:worldIslands,places:explorePlaces,language:state.lang,isDriving:()=>carDriving,
   onTravel:travelTo,onOpen:()=>{setHelpers(false);blur();targetPoint=null;}});
 const prepareStory=()=>{if(adventureMap.isOpen())adventureMap.close(false);friendSystem?.close?.();setHelpers(false);blur();targetPoint=null;route=[];};
 const campaign=createCampaign({host,panel,state,save,joy,prepare:prepareStory,onObjective:storyObjective,onFinish:()=>control?.spark(s.x,s.z,35)});
 function useWorkshop(id){if(campaign.work(id,()=>workshop?.use(id)))return true;return workshop?.use(id);}
 function storyObjective(task){
  let p=task.go;const kind=task.check.kind;
  if(kind==='built'){
   const recipe=BUILD_RECIPES.find(r=>r.id===task.check.id),stock=workshop?.inventory?.().available||{};
   const missing=recipe&&Object.entries(recipe.need).find(([key,n])=>(stock[key]||0)<n);
   if(missing){const resource=missing[0],items=exploreItems.filter(i=>i.kind===resource&&!s.collected.includes(i.id));items.sort((a,b)=>Math.hypot(a.x-s.x,a.z-s.z)-Math.hypot(b.x-s.x,b.z-s.z));const point=items[0]||(resource==='fruit'?control?.foodPoint('banana'):null);if(point){travelTo(point);tell('🎒 Recoge materiales para construir: '+resource,'🎒 Gather building supplies: '+resource);return;}}
  }
  if(kind==='story')p=islandStories.find(q=>q.id===task.check.story)||p;
  if(kind==='collected'||kind==='collectedPrefix'){const items=exploreItems.filter(i=>(kind==='collected'?i.kind===task.check.item:i.id.startsWith(task.check.prefix))&&!s.collected.includes(i.id));items.sort((a,b)=>Math.hypot(a.x-s.x,a.z-s.z)-Math.hypot(b.x-s.x,b.z-s.z));p=items[0]||p;}
  if(p&&Math.hypot(s.x-p.x,s.z-p.z)>5){travelTo(p);tell('📍 Sigue la marca dorada. Abre la historia al llegar.','📍 Follow the golden marker. Open the story when you arrive.');return;}
  if(kind==='foodTotal'){const point=control?.foodPoint(task.check.item||task.check.food||'banana');if(point)travelTo(point);else interact();return;}
  if(kind==='handIn'){campaign.open();return;}
  if(kind==='story'){control?.playStory(task.check.story);return;}
  if(kind==='built'){showBag(task.check.id);return;}
  if(kind==='used'){useWorkshop(task.check.id);return;}
  if(kind==='colon'||kind==='festivalMonkeys'){colonLife?.interact(s.x,s.z);return;}
  if(kind==='cityDelivery'){showCityGuide();return;}
  if(kind==='festivalCruise'){cruiseLife?.board();return;}
  if(kind==='festivalBeacon'){interact();return;}
  tell('🎯 '+task.es+' · Explora y usa las acciones cercanas.','🎯 '+task.en+' · Explore and use nearby actions.');
 }
 refresh();
 const buttonUpdates=new Map();
 function setText(e,t){if(e.tagName==='BUTTON')buttonUpdates.set(e,t);else if(e.textContent!==t)e.textContent=t;}
 function refresh(){paintButton(craftButton,'🎒 '+say('Mochila','Bag')+' '+(s.craft?.built?.length||0)+'/7');paintButton(walletButton,'🪙 '+coinBalance(state));walletButton.setAttribute('aria-label',say('Mis monedas y tienda: ','My coins and shop: ')+coinBalance(state));const total=s.estate?.buildings?.length||0;bag.textContent=`🍌 ${s.food.banana}   🥥 ${s.food.coconut}   🥭 ${s.food.mango||0}   🪙 ${coinBalance(state)}   🍀 ${s.estate?.charms||0}`;dockBuild.setAttribute('aria-label',say('Abrir mochila','Open backpack'));
 const companion=friendSystem?.companion?.()||s.friends?.companion;
 const names={pip:'Pip',dori:'Dori',mila:'Mila',ollie:'Ollie',luna:'Luna',kai:'Kai'};
 setDockLabel(dockFriend,companion?'🏡':'🫶',companion?say('A casa','Go home'):say('Amigos','Friends'));
 dockFriend.classList.toggle('has-companion',!!companion);
 dockFriend.setAttribute('aria-label',companion?say('Enviar a ','Send ')+(names[companion]||say('mi amigo','my friend'))+say(' a casa',' home'):say('Abrir mis amigos','Open my friends'));}
 function tell(a,b,force=true){guide(say(a,b),force);message.textContent=say(a,b);message.classList.add('show');messageTime=4.5;}
 function reward(id,a,b){if(badgeExplore(s,id)){const coins=earnCoins(state,id);if(coins){joy.effect('coin');a+=` +${coins} monedas.`;b+=` +${coins} coins.`;}joy.effect('finish');control?.spark(s.x,s.z,22);save();refresh();}tell(a,b);}
 function birdMount(){return mountId==='mila'||mountId==='ollie';}
 function landBird(){if(!birdMount())return;
  if(birdAltitude>.6){birdLanding=true;birdTarget=0;tell('🪶 ¡Aterrizamos con cuidado!','🪶 Gliding down to land!');}
  else friendSystem?.dismount();
 }
 function leaveHouse(){if(houseSystem?.current()?.mansion)mansionLife.exitToYard();else houseSystem?.leave();host.classList.remove('inside-cottage');}
 function hop(){if(mansionLife?.workoutActive())return;if(cruiseLife?.isActive())return;if(!control||panel.hidden===false||paused())return;if(carDriving){exitCar();return;}if(houseSystem?.isInside()){leaveHouse();return;}if(birdMount()){birdLanding=false;birdTarget=Math.min(32,Math.max(birdAltitude,birdTarget)+4);return;}if(mountId){friendSystem?.dismount();return;}if(ride){flightTarget=Math.min(130,flightTarget+12);return;}if(boating){control.disembark();return;}if(swimming){fastMode=!fastMode;swimBoost=0;return;}colonLife?.onPlayerJump();control.hop();joy.effect('jump');}
 function boardCar(){if(carDriving||!cityLife?.nearCar(s.x,s.z)||boating||ride||inside||houseSystem?.isInside()||mountId)return;
  cityLife.selectNearby(s.x,s.z);stopAutomaticDrive();carDriving=true;carSpeed=0;closeView=false;paintCamera();cameraSnap=true;swimming=false;control?.normalizeRider?.();s.x=s.city.car.x;s.z=s.city.car.z;targetPoint=null;route=[];blur();joy.effect('friend');
  tell('🏎️ '+carName(s.city.car.model,true)+' · ⚡ Velocidad extra','🏎️ '+carName(s.city.car.model)+' · ⚡ Extra speed');save();
 }
 function exitCar(){if(!carDriving)return;
  const spot=control?.carExit?.();if(!spot){tell('🚙 Busca espacio para bajar','🚙 Move to an open space to get out');return;}
  stopAutomaticDrive();carDriving=false;carSpeed=0;s.x=spot.x;s.z=spot.z;
  targetPoint=null;route=[];blur();save();
 }
 function interact(){if(mansionLife?.workoutActive())return;if(cruiseLife?.isActive())return;
 if(!paused()&&panel.hidden&&!ride&&!boating&&!inside&&!mountId&&!carDriving&&!houseSystem?.isInside()&&cruiseLife?.near(s.x,s.z)){blur();swimming=false;cruiseLife.board();return;}
if(paused()||!panel.hidden||host.querySelector('.journey-panel:not([hidden]),.realm-panel:not([hidden])'))return;
 if(carDriving){exitCar();return;}
 const prize=!ride&&!boating&&!inside&&!mountId&&!swimming&&!houseSystem?.isInside()&&roadRewards?.nearest(s.x,s.z);if(prize){control.useRoadReward(prize);return;}
 if(!ride&&!inside&&!mountId&&!carDriving&&!houseSystem?.isInside()&&panamaLife?.interact(s.x,s.z))return;
 if(!ride&&!boating&&!inside&&!mountId&&!carDriving&&!houseSystem?.isInside()&&colonLife?.interact(s.x,s.z))return;
 if(!ride&&!boating&&!inside&&!mountId&&!houseSystem?.isInside()&&cityLife?.nearCar(s.x,s.z)){boardCar();return;}
 if(houseSystem?.isInside()){if(!houseSystem.inspect())leaveHouse();return;}
 if(mountId){if(birdMount())landBird();else friendSystem?.dismount();return;}
 const doorway=houseSystem?.near(s.x,s.z);if(doorway){houseSystem.enter(doorway);return;}
 const station=!ride&&!boating&&!inside&&!swimming&&!mountId&&!carDriving&&workshop?.nearest(s.x,s.z);
 if(station){if(workshop.isBuilt(station.id))useWorkshop(station.id);else showBag(station.id);return;}
 if(!ride&&!boating&&!inside&&!mountId&&!carDriving&&!houseSystem?.isInside()&&cityLife?.interactActivity(s.x,s.z,false))return;
 if(!ride&&!boating&&!inside&&!mountId&&!carDriving&&estateWorld?.nearest(s.x,s.z)){showEstate();return;}
 if(!ride&&!inside&&!foodNear&&!control?.boatNear()){const f=friendSystem?.nearest(boating?'boat':swimming?'swim':'walk');if(f){friendSystem.open(f.id);return;}}
 if(!ride&&!carDriving&&mansionLife?.nearBalloon(s.x,s.z)){mansionLife.balloonTrip();return;}if(ride){control?.popBalloon();return;}if(boating){control?.disembark();return;}if(inside){if(stair>=.97)control?.lightBeacon();else if(stair<.03&&Math.hypot(s.x+1,s.z+4.1)<.7)control?.leaveTower();return;}if(control?.falling())return;if(control?.boatNear()){control.board();return;}if(foodNear){control?.harvest();return;}if(swimming){followGoal();return;}
 if(near?.kind==='volcano'){
  joy.effect('tap');
  if(near.id==='volcanoTrail')tell('🥾 ¡Sendero del Volcán Barú! Sigue las marcas doradas para subir.',
    '🥾 Volcán Barú trail! Follow the golden markers to climb.');
  else tell('🌋 ¡Cima del Volcán Barú! ¡Mira todo Panamá desde aquí!',
    '🌋 Volcán Barú summit! Look out over your Panama adventure!');
  return;
 }
 if(near?.id==='costaArriba'){travelTo({id:'costaArriba',x:176,z:-437,en:'La Guaira · Isla Grande pier',es:'La Guaira · Muelle de Isla Grande'});return;}
 if(!near)return;joy.effect('friend');const k=near.id;
  if(k==='pip'){s.pet=false;save();tell('Observa la tortuga desde el sendero.','Watch the turtle from the trail.');}
  if(k==='mila'){if(s.foodTotal.banana>=5)reward('picnic','¡Cinco racimos de plátanos! Picnic preparado. ¡Sombrero de fiesta desbloqueado!','Five bunches of bananas! Picnic ready. Party hat unlocked!');else tell(`¿Un picnic? Busca cinco racimos de plátanos: ${s.foodTotal.banana}/5.`,`Picnic time? Find five bunches of bananas: ${s.foodTotal.banana}/5.`);}
  if(k==='ollie'){if(countExplore(s,'glow')===5)reward('glow','¡La selva brilla! Tus luciérnagas te siguen.','The grove is glowing! Your fireflies follow you.');else tell('¡Las luciérnagas juegan al escondite! Encuentra las cinco luces del bosque.','The fireflies are playing hide-and-seek! Find five lights in the grove.');}
  if(k==='luna'){music=[];tell('¡Haz bailar el arcoíris! Pisa las notas: rosa, dorada, azul.','Make the rainbow dance! Step on pink, gold, blue.');control?.demo();}
  if(k==='garden'){if(s.flowers>=6){s.gardenWatered=!s.gardenWatered;control?.bloom(s.gardenWatered?6:4);tell(s.gardenWatered?'💧 ¡Jardín regado! Las flores brillan.':'🌷 ¡Dejamos descansar las flores!','💧 Garden watered! The flowers brighten.');save();}else{s.flowers=Math.min(6,s.flowers+1);const coins=earnCoins(state,'flower-'+s.flowers);refresh();control?.bloom(s.flowers);save();joy.effect('correct');if(s.flowers===6)reward('garden','¡Un jardín para las mariposas!','A garden for the butterflies!');else tell(`¡Una flor! +${coins} monedas por cuidarla.`,`A flower! +${coins} coins for caring for it.`);}}
  if(k==='bounce'){control?.hop(10);joy.effect('treasure');tell('¡Booooing!','Booooing!');}
  if(k==='boat')control?.board();if(near.kind==='balloon')control?.boardBalloon();
  if(k==='wardrobe'){const available=[0,1,...(s.badges.includes('picnic')?[2]:[]),...(s.badges.length>=4?[3]:[]),...islandShop.filter(i=>state.wallet.items.includes(i.id)).map(i=>i.hat)];s.hat=available[(available.indexOf(s.hat)+1)%available.length];control?.dress();save();tell('¡Nuevo estilo! Encuentra más sombreros en tus monedas.','New look! Find more hats by tapping your coins.');}
  if(near.kind==='islet'){if(k==='islet'||k==='crystalCove'){control?.bubbles();tell('🦋 Atrapa y suelta · 🫧 ¡Pop!','🦋 Catch and release · 🫧 Pop!');}else tell(k==='wilds'?'🍌 Recoge plátanos':k==='coconutCoast'?'🥥 Recoge cocos':'✨ Busca luciérnagas',k==='wilds'?'🍌 Pick bananas':k==='coconutCoast'?'🥥 Pick coconuts':'✨ Find fireflies');}if(k==='chest'){s.chestOpen=!s.chestOpen;control?.bubbles();if(s.chestOpen)reward('treasure','🎁 ¡Abriste el cofre! Salen burbujas.','🎁 You opened the chest! Bubbles float out.');else tell('🔒 Cofre cerrado. Vuelve a abrirlo.','🔒 Chest closed. Open it again.');save();}
  if(k==='beacon')control?.enterTower();
  if(k==='swim'){route=islandPath(s,{x:15,z:15});targetPoint=route.shift()||null;tell('🏊 Nada · 🏝 Vuelve a la playa','🏊 Swim · 🏝 Return to shore');}
  if(k==='chest'||k==='beacon')control?.spark(near.x,near.z,30);
 }
 function showCityGuide(){
  if(!cityLife)return;
  if(adventureMap.isOpen())adventureMap.close(false);
  if(friendSystem?.isOpen())friendSystem.close(false);
  setHelpers(false);panel.replaceChildren();panel.hidden=false;blur();targetPoint=null;route=[];
  const close=btn('×','panel-close',()=>{panel.hidden=true;canvas.focus({preventScroll:true});});
  const a=s.city.activities||{},card=makeEl('div','city-guide-list');
  panel.append(close,makeEl('h2','',say('🏙️ Explora Ciudad de Panamá','🏙️ Explore Panama City')),
    makeEl('p','',say('Camina o conduce hasta las señales. Hay actividades de verdad con premios y progreso guardado.',
      'Walk or drive to the signs. Play real activities, earn rewards, and save your progress.')));
  const progress={
   rally:'🏁 '+(a.rallyWins||0)+(a.rallyBest?' · '+a.rallyBest.toFixed(1)+'s':''),
   soccer:'⚽ '+(a.soccerGoals||0)+' '+say('goles','goals'),
   market:'🥭 '+(a.marketTrades||0)+' '+say('ventas','trades'),
   mural:'🎨 '+(a.muralColors||0)+'/4',
   museum0:'🏛️ '+(a.museum?.length||0)+'/3',
   museum1:'🏛️ '+(a.museum?.length||0)+'/3',
   museum2:'🏛️ '+(a.museum?.length||0)+'/3',
   wash:'🫧 '+(a.carWashes||0),
   plaza:'⛲',canal:'🚢'
  };
  for(const p of cityLife.activitySites||[]){
   const item=makeEl('section','city-guide-card'),title=makeEl('strong','',p.icon+' '+(es?p.es:p.en));
   item.append(title,makeEl('span','city-guide-progress',progress[p.id]||''));
   const distance=Math.round(Math.hypot(s.x-p.x,s.z-p.z));
   item.append(btn('📍 '+say('Ir al lugar','Go there')+' · '+distance+'m','discover-place',()=>{
    panel.hidden=true;
    cityLife.setWaypoint(p.id);
    if(!carDriving&&!ride&&!boating&&!inside&&!houseSystem?.isInside()){
     route=[];targetPoint={x:p.x,z:p.z};
    }
    tell('📍 '+p.es+' · '+distance+'m','📍 '+p.en+' · '+distance+'m');
   }));
   card.append(item);
  }
  panel.append(card);
 }
 function showRegionProject(regionId=regionForPosition(s.x,s.z)){
  if(friendSystem?.isOpen())friendSystem.close();
  if(adventureMap.isOpen())adventureMap.close(false);
  setHelpers(false);panel.replaceChildren();panel.hidden=false;blur();targetPoint=null;route=[];
  const m=missionStatus(s,state,regionId);
  if(!m){panel.hidden=true;return;}
  const close=btn('×','panel-close',()=>{panel.hidden=true;canvas.focus({preventScroll:true});});
  close.setAttribute('aria-label',say('Cerrar misión','Close mission'));
  panel.append(close,makeEl('div','region-project-heading',m.icon+' '+say('UNA MISIÓN PARA ESTA REGIÓN','ONE MISSION TO HELP THIS PLACE')),
   makeEl('h2','',es?m.es:m.en),makeEl('p','region-project-why',es?m.whyEs:m.whyEn));
  const bar=makeEl('div','region-project-progress');
  const fill=makeEl('span','region-project-progress-fill');fill.style.width=(m.done/4*100)+'%';bar.append(fill);
  bar.setAttribute('role','progressbar');bar.setAttribute('aria-valuemin','0');bar.setAttribute('aria-valuemax','4');bar.setAttribute('aria-valuenow',String(m.done));
  panel.append(bar,makeEl('p','region-project-count',m.done+'/4 · '+(m.restored?say('✅ Región restaurada','✅ Region restored'):say('Ayuda a esta región a recuperarse','Help this region recover'))));
  if(m.restored)panel.append(makeEl('p','region-project-victory','🎉 '+(es?m.resultEs:m.resultEn)));
  const steps=makeEl('div','region-project-steps');
  for(const [i,step]of m.tasks.entries()){
   const card=makeEl('section','region-project-step'+(step.complete?' done':''));
   card.append(makeEl('div','region-project-step-title',(step.complete?'✅':step.icon)+' '+(i+1)+'. '+(es?step.es:step.en)));
   card.append(makeEl('p','region-project-meter',step.current+'/'+step.required+' '+(step.complete?say('¡Listo!','Done!'):say('completado','completed'))));
   if(!step.complete){
    card.append(btn(say('📍 Ir a ayudar','📍 Take me there'),'discover-place region-project-action',()=>{
     panel.hidden=true;
     if(step.check.kind==='cityDelivery'){showCityGuide();return;}
     const recipe=['built','used'].includes(step.check.kind)?BUILD_RECIPES.find(x=>x.id===step.check.id):null;
     if(recipe&&Math.hypot(s.x-recipe.x,s.z-recipe.z)<5){
      if(step.check.kind==='used'&&workshop?.isBuilt(recipe.id)){useWorkshop(recipe.id);return;}
      showBag(recipe.id);return;
     }
     let p=step.go;
     if(step.check.kind==='story')p=islandStories.find(x=>x.id===step.check.story)||p;
     if(!p)return;
     if(m.id==='pizzaCity'&&step.check.kind==='cityBags')p=explorePlaces.find(x=>x.id==='pizzaCity')||p;
     travelTo(p);
    }));
   }
   steps.append(card);
  }
  panel.append(steps,makeEl('p','region-project-reward',say('🎁 Completa todo: el paisaje se transforma y ganas 25 monedas. Los juegos anteriores siguen contando.',
    '🎁 Complete the project: watch the landscape come alive and earn 25 coins. Your earlier activities still count.')));
  const other=makeEl('div','region-project-other');
  other.append(makeEl('h3','',say('Explora otra región','Choose another region')));
  for(const r of REGION_PROJECTS){
   const status=missionStatus(s,state,r.id);
   other.append(btn(r.icon+' '+(r.id==='home'?'Gorgona':r.id==='islet'?'Taboga':r.id==='wilds'?'Bocas':r.id==='coconutCoast'?'Contadora':r.id==='sunset'?'Volcán Barú':r.id==='crystalCove'?'Guna Yala':r.id==='colon'?'Colón':'Casco Viejo')+' '+status.done+'/4','discover-place',()=>showRegionProject(r.id)));
  }
  panel.append(other);
 }
 function showBag(focusId=null){panel.classList.remove('estate-panel','mansion-panel');
  if(friendSystem?.isOpen())friendSystem.close();
  if(adventureMap.isOpen())adventureMap.close(false);
  setHelpers(false);panel.replaceChildren();panel.hidden=false;blur();targetPoint=null;route=[];
  const close=btn('×','panel-close',()=>{panel.hidden=true;canvas.focus({preventScroll:true});});
  close.setAttribute('aria-label',say('Cerrar mochila','Close bag'));
  panel.append(close,makeEl('h2','',say('🎒 ¿Qué quieres hacer?','🎒 What would you like to do?')),
   makeEl('p','',say('🌴 Tu Panamá, a tu ritmo. Elige algo divertido.','🌴 Your Panama, your pace. Pick something fun.')));
  if(!focusId){
   const hub=makeEl('div','backpack-world-hub');
   const card=(icon,label,detail,fn)=>{const b=btn(icon+' '+label,'backpack-world-tile',fn);b.dataset.uiKind=({'🏡':'home','📱':'friends','🍌':'food','🛼':'gear','🎮':'play'})[icon]||'explore';b.append(makeEl('small','play-benefit',detail));hub.append(b);};
   card('🗺️',say('Explorar','Explore'),say('📍 Elige playa, ciudad o montaña','📍 Choose beach, city or mountains'),()=>{panel.hidden=true;adventureMap.open();});
   card('🏡',say('Mi mansión','My mansion'),say('🐶 Cocina, juega y cuida a tu perro','🐶 Cook, play and care for your dog'),()=>mansionLife?.show());
   card('🛼',say('Mis herramientas','My gear'),say('⚡ Muévete rápido y mira de cerca','⚡ Move faster and look closer'),showGear);
   card('🍌',say('Comer','Eat'),say('⚡ Fruta para un impulso de energía','⚡ Fruit gives an energy boost'),showFood);
   card('📱',say('Invitar amigos','Invite friends'),say('🫶 Llama a alguien para jugar','🫶 Call someone to join you'),openPhone);
   card('🎮',say('Actividades','Activities'),say('✨ Juegos y proyectos opcionales','✨ Optional games and projects'),showActivities);
   panel.append(hub,btn(say('🧭 Cómo jugar','🧭 How to play'),'discover-place',listen));return;
  }
  panel.append(btn(say('🎮 Volver a actividades','🎮 Back to activities'),'discover-place',showActivities));
  const workshopSection=makeEl('section','backpack-workshops');
  workshopSection.append(makeEl('h3','',say('🛠️ Materiales y construcciones','🛠️ Materials and construction')));
  panel.append(workshopSection);
  if(!workshop){panel.append(makeEl('p','',say('Cargando talleres…','Loading workshops…')));return;}
  const inv=workshop.inventory(),stock=makeEl('div','craft-resource-list');
  for(const [kind,meta]of Object.entries(RESOURCE_INFO).filter(([kind])=>BUILD_RECIPES.find(r=>r.id===focusId)?.need[kind]))stock.append(makeEl('span','craft-resource',meta.icon+' '+(es?meta.es:meta.en)+' '+inv.available[kind]+'/'+inv.total[kind]));
  const extras=makeEl('details','backpack-extra-treasures');
  extras.append(makeEl('summary','',say('🐚 Ver otros tesoros y materiales','🐚 More treasures and materials')),stock);
  workshopSection.append(extras,makeEl('h3','',say('🏗️ Talleres y construcciones clásicas','🏗️ Classic workshops and builds')));
  const cards=makeEl('div','craft-recipe-grid');
  for(const r of BUILD_RECIPES.filter(r=>r.id===focusId)){
   const built=workshop.isBuilt(r.id),here=workshop.nearest(s.x,s.z,5)?.id===r.id;
   const card=makeEl('section','craft-recipe'+(built?' is-built':'')+(r.id===focusId?' is-highlighted':''));
   const region=worldIslands.find(x=>x.id===r.island);
   card.append(makeEl('h4','',r.icon+' '+(es?r.es:r.en)));
   card.append(makeEl('p','craft-location','📍 '+(region?(es?region.es:region.en):'Playa Gorgona')));
   const needs=Object.entries(r.need).map(([k,n])=>RESOURCE_INFO[k].icon+' '+(inv.available[k]||0)+'/'+n).join(' · ');
   card.append(makeEl('p','craft-ingredients',built?say('✅ Construido y guardado','✅ Built and saved'):needs));
   const text=built?(here?say('🎮 Jugar aquí','🎮 Play here'):say('📍 Visitar','📍 Visit')):
    here?(workshop.canBuild(r.id)?say('🛠️ Construir ahora','🛠️ Build now'):say('🔎 Buscar materiales','🔎 Find supplies')):
    say('📍 Ir a construir','📍 Go build');
   card.append(btn(text,'discover-place craft-recipe-action',()=>{
    if(built&&here){panel.hidden=true;useWorkshop(r.id);return;}
    if(!built&&here&&workshop.canBuild(r.id)){workshop.build(r.id,s.x,s.z);showBag(r.id);return;}
    if(!built&&here){tell('🎒 Recoge más materiales para construir aquí.','🎒 Find more supplies to build here.');return;}
    panel.hidden=true;travelTo({...r,kind:'workshop'});
   }));
   cards.append(card);
  }
  workshopSection.append(cards);
 }
 function showGear(){
  panel.replaceChildren();panel.hidden=false;blur();
  panel.append(btn('×','panel-close',()=>panel.hidden=true),makeEl('h2','',say('🛼 Mis herramientas','🛼 My gear')));
  for(let [label,detail,fn] of [
   [['skates','scooter'].includes(s.travelMode)?say('👟 Caminar','👟 Walk'):say('🛼 Usar patines','🛼 Put on skates'),say('⚡ Patina más rápido por tierra.','⚡ Skate faster on land.'),()=>{panel.hidden=true;toggleSpeed();}],
   [closeView?say('🔭 Vista amplia','🔭 Wide view'):say('👁️ Primera persona','👁️ First person'),say('🔎 Mira el mundo con los ojos de Angelique.','🔎 See the world through Angelique’s eyes.'),()=>{panel.hidden=true;toggleCamera();}],
   [say('🧢 Cambiar sombrero','🧢 Change hat'),say('🪙 Elige un estilo con tus monedas.','🪙 Choose a style with your coins.'),showShop]
  ]){const b=btn(label,'discover-place',fn);if(/🛼|👟/.test(label)&&(carDriving||swimming||boating||ride||mountId)){b.disabled=true;detail=say('🏝️ Baja a tierra para usar patines.','🏝️ Step onto land to use skates.');}panel.append(b,makeEl('p','',detail));}
  panel.append(btn(say('🎒 Volver','🎒 Back'),'discover-place',()=>showBag()));
 }
 function showActivities(index=0){
  panel.replaceChildren();panel.hidden=false;blur();
  const choices=[['🏙️',say('Jugar en la ciudad','Play in the city'),showCityGuide],['📖',say('Historia del festival','Festival story'),()=>campaign.open()],['🌱',say('Cuidar esta región','Care for this region'),()=>showRegionProject()],...BUILD_RECIPES.map(r=>[r.icon,es?r.es:r.en,()=>showBag(r.id)])];
  const [icon,label,fn]=choices[index];
  panel.append(btn('×','panel-close',()=>panel.hidden=true),makeEl('h2','',icon+' '+label),makeEl('p','',say('🎮 Idea ','🎮 Idea ')+(index+1)+' / '+choices.length),btn(say('✨ Elegir esta actividad','✨ Choose this activity'),'discover-place',fn));
  if(index>0)panel.append(btn(say('⬅️ Anterior','⬅️ Previous'),'discover-place',()=>showActivities(index-1)));
  if(index<choices.length-1)panel.append(btn(say('➡️ Otra idea','➡️ Another idea'),'discover-place',()=>showActivities(index+1)));
  panel.append(btn(say('🎒 Volver','🎒 Back'),'discover-place',()=>showBag()));
 }
 function showEstate(){
  if(friendSystem?.isOpen())friendSystem.close();
  if(adventureMap.isOpen())adventureMap.close(false);
  setHelpers(false);panel.replaceChildren();panel.hidden=false;blur();targetPoint=null;route=[];
  panel.classList.add('estate-panel');
  panel.append(btn('×','panel-close',()=>{panel.hidden=true;panel.classList.remove('estate-panel');canvas.focus({preventScroll:true});}),
    makeEl('div','estate-eyebrow',say('MI PROPIO MUNDO','MY OWN WORLD')),
    makeEl('h2','',say('🏰 Construye tu imperio','🏰 Build your own empire')),
    makeEl('p','estate-intro',say('¡Construye algo de verdad! Tu creación aparece aquí en 3D y seguirá allí cuando vuelvas.','Build something real! Your creation appears here in 3D and stays when you return.')));
  const owns=s.estate?.buildings?.length||0;
  const meter=makeEl('div','estate-progress');meter.append(makeEl('strong','',say('🏡 Mis construcciones','🏡 My buildings')),makeEl('b','',owns+'/32'));panel.append(meter);
  const inv=makeEl('div','estate-wallet');for(const [icon,n,label]of [['🍌',s.food.banana,say('Plátanos','Bananas')],['🥥',s.food.coconut,say('Cocos','Coconuts')],['🪙',coinBalance(state),say('Monedas','Coins')],['🍀',s.estate.charms,say('Suerte','Lucky charms')]]){const e=makeEl('span','estate-currency',icon+' '+n);e.title=label;inv.append(e);}panel.append(inv);
  const plans=makeEl('div','estate-plans');
  for(const p of ESTATE_PLANS){
   const ok=canBuildEstate(s,p.type,coinBalance(state));
   const card=makeEl('section','estate-plan'+(ok?' estate-ready':'')),front=makeEl('div','estate-plan-head');
   front.append(makeEl('span','estate-emoji',p.icon),makeEl('strong','',es?p.es:p.en));card.append(front);
   const cost=estateCosts(s,p.type),missing=estateMissing(s,p.type,coinBalance(state));
   const costs=makeEl('div','estate-costs',cost.starter?say('🎁 PRIMERA CASA GRATIS','🎁 FIRST HOME FREE'):`🍌 ${cost.banana}  🥥 ${cost.coconut}  🪙 ${cost.coins}  🍀 ${cost.charms}`);card.append(costs);
   const feedback=makeEl('p','estate-feedback');feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');
   if(owns<p.unlock)card.append(makeEl('p','estate-locked',say('🔒 Construye '+p.unlock+' antes','🔒 Build '+p.unlock+' other buildings first')));
   const action=btn(ok?(cost.starter?say('🎁 ¡Construir mi primera casa!','🎁 Build my first home!'):say('✨ Construir aquí','✨ Build here')):say('🔎 ¿Qué necesito?','🔎 What do I need?'),'estate-build-button',()=>{
    if(!estateWorld){feedback.textContent=say('⏳ Espera a que cargue el mundo.','⏳ Wait for the 3D world to load.');return;}
    if(!canBuildEstate(s,p.type,coinBalance(state))){
      const lack=estateMissing(s,p.type,coinBalance(state));
      const parts=[];
      if(lack.cap)parts.push(say('Máximo de construcciones','Building limit reached'));
      if(lack.unlock)parts.push(say('Construye '+lack.unlock+' edificio(s) primero','Build '+lack.unlock+' building(s) first'));
      for(const [kind,icon] of [['banana','🍌'],['coconut','🥥'],['coins','🪙'],['charms','🍀']])if(lack[kind])parts.push(icon+' '+lack[kind]);
      feedback.textContent=say('Te falta: ','You need: ')+parts.join(' · ')+'. '+say('Usa "Buscar recursos" abajo.','Tap "Find supplies" below.');
      return;
    }
    action.disabled=true;
    if(carDriving)exitCar();
    if(mountId)friendSystem?.dismount();
    if(boating||ride||swimming||inside||houseSystem?.isInside()){
      action.disabled=false;feedback.textContent=say('🏝️ Primero baja a tierra firme. Cierra este panel y usa Salir.','🏝️ Step onto land first. Close this panel and use Exit.');return;
    }
    const site=findEstateSite(s,p.type,{x:s.x,z:s.z},{canStand:(x,z)=>!regionalClearing(x,z,p.radius||3)&&walkable(x,z)&&!inWater(x,z)&&roadDistance(x,z)>HIGHWAY_WIDTH/2+(p.radius||3)+1.35,height:(x,z)=>isletHeight(x,z)>0?isletHeight(x,z):0});
    if(!site){action.disabled=false;feedback.textContent=say('🏝️ Aquí no cabe. Camina hasta un espacio abierto y prueba otra vez.','🏝️ Not enough open space here. Walk to a clear area and try again.');return;}
    const entry=buildEstate(s,p.type,coinBalance(state),site);
    if(!entry){action.disabled=false;feedback.textContent=say('Inténtalo de nuevo.','Please try again.');return;}
    estateWorld.add(entry);save();refresh();panel.hidden=true;panel.classList.remove('estate-panel');
    control?.showBuild?.(entry);tell('🎉 ¡Lo construiste! ¡Ahí está tu nueva casa!','🎉 You built it! There is your new building!');
    targetPoint=null;route=[];
   });card.append(action,feedback);plans.append(card);
  }
  panel.append(plans);
  if(owns){
   panel.append(makeEl('h3','estate-upgrade-heading',say('⭐ Mejora mis propiedades','⭐ Upgrade my properties')));
   const upgrades=makeEl('div','estate-upgrades');
   for(const b of s.estate.buildings.slice(-8).reverse()){
    const p=ESTATE_PLANS.find(p=>p.type===b.type),row=makeEl('div','estate-upgrade-row');
    row.append(makeEl('strong','',p.icon+' '+(es?p.es:p.en)+' · Lv '+b.level+'/3'));
    const valid=canUpgradeEstate(s,b.id,coinBalance(state));
    const nextCost=b.level===1?'🍌1 🥥1 🪙10':b.level===2?'🍌2 🥥2 🪙20 🍀1':'';
    const btnUp=btn(b.level===3?say('✅ Al máximo','✅ Maxed out'):say('⬆️ Mejorar','⬆️ Upgrade')+' · '+nextCost,'estate-upgrade-button',()=>{
      if(!canUpgradeEstate(s,b.id,coinBalance(state)))return;
      btnUp.disabled=true;
      if(!upgradeEstate(s,b.id,coinBalance(state))){btnUp.disabled=false;return;}
      estateWorld?.upgrade(b.id);save();refresh();showEstate();
      tell('✨ ¡Tu propiedad es más grande ahora!','✨ Your property just grew!');
    });btnUp.disabled=!valid;row.append(btnUp,btn(say('👁️ Ver en el mundo','👁️ See in the world'),'estate-view-button',()=>{panel.hidden=true;panel.classList.remove('estate-panel');control?.showBuild?.(b);tell('🏡 ¡Esta es tu propiedad!','🏡 Here is your property!');}));upgrades.append(row);
   }
   panel.append(upgrades);
  }
  panel.append(btn(say('🍌 🥥 ¿Dónde consigo recursos?','🍌 🥥 Where do I find supplies?'),'estate-find-link',()=>{panel.classList.remove('estate-panel');showDiscover();}),
    btn(say('🧰 Ver construcciones clásicas','🧰 See classic workshops'),'estate-legacy-link',()=>{panel.classList.remove('estate-panel');showBag();}));

 }
 function showFood(){if(panamaLife){panamaLife.openFood();return;}if(friendSystem?.isOpen())friendSystem.close();if(adventureMap.isOpen())adventureMap.close(false);setHelpers(false);panel.replaceChildren();panel.hidden=false;blur();targetPoint=null;panel.append(btn('×','panel-close',()=>{panel.hidden=true;}),makeEl('h2','',say('Mi comida','My food')),makeEl('p','',say('🍌 Comparte tus plátanos: comer · construir · mercado','🍌 Share your bananas: eat · build · market')),makeEl('p','',say('Come y crece','Eat and grow')+' · '+s.growth.toFixed(1)+'×'));for(const kind of ['coconut','banana']){const icon=kind==='coconut'?'🥥':'🍌',b=btn(icon+' × '+s.food[kind]+' · '+say('Comer','Eat'),'discover-place',()=>{if(!spendFood(s,kind))return;eating=2;host.classList.add("snack-moment");energy=30;tell('🍌 Impulso de fruta · 30 segundos','🍌 Fruit boost · 30 seconds');s.journey.meals++;s.growth=Math.min(6,s.growth+.45);control?.snack(kind);save();refresh();panel.hidden=true;joy.effect('correct');tell(icon+' ¡Ñam! ↗ '+s.growth.toFixed(1)+'× · Impulso: 30s',icon+' Yum! ↗ '+s.growth.toFixed(1)+'× · Speed boost: 30s');});b.disabled=!s.food[kind];panel.append(b);}if(s.growth>1)panel.append(btn(say('↘ Volver a pequeña','↘ Little again'),'discover-place',()=>{s.growth=1;save();panel.hidden=true;}));}
 function showShop(){if(friendSystem?.isOpen())friendSystem.close();if(adventureMap.isOpen())adventureMap.close(false);panel.replaceChildren();panel.hidden=false;blur();targetPoint=null;const close=btn('×','panel-close',()=>{panel.hidden=true;canvas.focus({preventScroll:true});});close.setAttribute('aria-label',say('Cerrar','Close'));panel.append(close,makeEl('h2','',say('Mis monedas','My coins')),makeEl('p','',say(`Tienes ${coinBalance(state)} monedas de la isla.`,`You have ${coinBalance(state)} island coins.`)),makeEl('p','',say('Ayuda a un amigo: 10. Cuida una flor: 2. Prepara el picnic, ilumina el bosque o crea música: 15. Cada buena acción da monedas una vez.','Help a friend: 10. Care for a flower: 2. Prepare the picnic, light the grove, or make music: 15. Each good deed earns coins once.')));const list=makeEl('div','discover-grid');for(const item of islandShop){const owned=state.wallet.items.includes(item.id);const buy=btn((es?item.es:item.en)+' · '+(owned?say('Poner','Wear'):item.cost+' 🪙'),'discover-place',()=>{if(!buyIslandItem(state,item.id))return;save();refresh();control?.dress();joy.effect('coin');showShop();});buy.disabled=!owned&&coinBalance(state)<item.cost;list.append(buy);}panel.append(list);close.focus();guide(say('Tus buenas acciones te dan monedas. Puedes ahorrar o elegir un sombrero.','Your good deeds earn coins. You can save them or choose a hat.'),true);}
 function travelTo(p){if(cruiseLife?.isActive())return;
  if(carDriving){control?.startAutoDrive?.(p);return;}
  if(houseSystem?.isInside()){houseSystem.leave();host.classList.remove('inside-cottage');}
  if(mountId)friendSystem?.dismount();
  if(friendSystem?.isOpen())friendSystem.close();
  if(adventureMap.isOpen())adventureMap.close(false);
  const land=worldIslands.find(i=>Math.hypot((p.x-i.x)/i.rx,(p.z-i.z)/i.rz)<1),here=land&&Math.hypot((s.x-land.x)/land.rx,(s.z-land.z)/land.rz)<1;
  if(p.id==='islaGrande'&&!boating&&!ride&&mainlandAt(s.x,s.z)){const dock={x:176,z:-437};route=mainlandRoadRoute(s,dock);targetPoint=route.shift()||dock;panel.hidden=true;tell('⚓ Sigue la costa. Usa la moto acuática de La Guaira para ir a Isla Grande.','⚓ Follow the coast. Use the La Guaira jet ski to reach Isla Grande.');return;}
  if(['volcanTown','boquete','colonCity','colonCivic','panamaEast','costaArriba'].includes(p.id)&&mainlandAt(s.x,s.z)){
   route=mainlandRoadRoute(s,p);targetPoint=route.shift()||p;panel.hidden=true;
   tell('🛣️ Sigue la carretera hacia '+p.es+'.','🛣️ Follow the road to '+p.en+'.');return;
  }
  if(ride){targetPoint={x:p.x,z:p.z};route=[];panel.hidden=true;return;}
  if(boating&&land){const a=Math.atan2(s.x-land.x,s.z-land.z);let dest={x:land.x+Math.sin(a)*(land.rx+3),z:land.z+Math.cos(a)*(land.rz+3)};dest=recoverBoat(dest.x,dest.z);targetPoint=dest;route=[];panel.hidden=true;return;}
  if(land&&!here){panel.replaceChildren(btn('×','panel-close',()=>panel.hidden=true),makeEl('h2','',(es?land.es:land.en)),makeEl('p','',say('¿Cómo quieres explorar?','How will you explore?')));panel.hidden=false;
   if(mainlandAt(s.x,s.z)&&['pizzaCity','colon','sunset'].includes(land.id)){
    panel.append(btn(say('🛣️ Seguir la carretera','🛣️ Follow the road'),'discover-place',()=>{
     const destination={x:p.x,z:p.z};
     route=mainlandRoadRoute(s,destination);
     targetPoint=route.shift()||destination;panel.hidden=true;
     tell('🛣️ Sigue la carretera terrestre.','🛣️ Follow the mainland road.');
    }));
    return;
   }
   if(land.id==='pizzaCity')panel.append(btn(say('🏙️ ¡Visitar Ciudad de Panamá ahora!','🏙️ Visit Panama City now'),'discover-place',()=>{
    s.x=s.city.car.x+3.2;s.z=s.city.car.z+1.1;swimming=false;targetPoint=null;route=[];
    panel.hidden=true;blur();save();refresh();
    tell('🏙️ ¡Bienvenida al Casco Viejo! 🚙 🏁 ⚽ 🍕','🏙️ Welcome to Casco Viejo! 🚙 🏁 ⚽ 🍕');
   }));
   panel.append(makeEl('p','',say('🏝️ Las islas solo se alcanzan en barco. Busca el muelle, sube a bordo y navega hasta la costa.','🏝️ Offshore islands require water travel. Find a dock, board a boat and sail to shore.')));
   panel.append(btn(say('⛵ Ir al barco','⛵ Go to boat'),'discover-place',()=>{const dest=s.boat;route=islandPath(s,dest);targetPoint=route.shift()||dest;panel.hidden=true;}));return;
  }
  if(boating)control?.disembark();const dest=p.id==='boat'?s.boat:p;route=islandPath(s,dest);targetPoint=route.shift()||null;panel.hidden=true;
 }
 function showDiscover(){panel.classList.remove('estate-panel');if(carDriving)exitCar();if(houseSystem?.isInside()){houseSystem.leave();host.classList.remove('inside-cottage');}if(mountId)friendSystem?.dismount();if(friendSystem?.isOpen())friendSystem.close();if(adventureMap.isOpen())adventureMap.close(false);if(inside)control?.leaveTower();guide(say('Elige un lugar y Angelique caminará hasta allí.','Choose a place and Angelique will walk there.'),true);panel.replaceChildren();panel.hidden=false;blur();targetPoint=null;const close=btn('×','panel-close',()=>{panel.hidden=true;canvas.focus({preventScroll:true});});close.setAttribute('aria-label',say('Cerrar','Close'));panel.append(close,makeEl('h2','',say('🗺️ ¿Adónde vamos?','🗺️ Where shall we go?')),makeEl('p','',say('🌴 Elige un lugar para explorar a tu ritmo.','🌴 Choose somewhere to explore at your pace.')));
 panel.append(btn('🌍 '+say('Ayudar al lugar donde estoy','Help the region I’m visiting'),'discover-place',()=>showRegionProject()));const list=makeEl('div','discover-grid');for(const p of explorePlaces)list.append(btn(`${({wilds:'🍌',coconutCoast:'🥥',sunset:'✨',islet:'🦋',crystalCove:'💎',beacon:'🗼'})[p.id]||p.icon} ${es?p.es:p.en}`,'discover-place',()=>travelTo(p)));panel.append(list);close.focus();}
 function keydown(e){if(paused())return;if(!panel.hidden){if(e.key==='Escape'){if(friendSystem?.isOpen())friendSystem.close();else if(adventureMap.isOpen())adventureMap.close();else{panel.hidden=true;canvas.focus();}}return;}if((e.target.tagName==='BUTTON'&&(e.key===' '||e.key==='Enter'))||['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)||document.querySelector('dialog[open]'))return;const k=e.key.toLowerCase();if(k==='h'&&carDriving&&!e.repeat){e.preventDefault();joy.recordedSound?.('horn',{volume:.45});return;}if(k==='v'&&!e.repeat){e.preventDefault();toggleCamera();return;}if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d',' ','e','q','shift'].includes(k)){e.preventDefault();joy.gesture();keys.add(e.key);targetPoint=null;if(!e.repeat&&k===' ')hop();if(!e.repeat&&k==='e')interact();if(!e.repeat&&k==='q'){if(ride)flightTarget=Math.max(0,flightTarget-5);else if(birdMount()){birdLanding=false;birdTarget=Math.max(1.5,birdTarget-3);}}}}
 function releaseDirection(e){
  const held=directionPointers.get(e.pointerId);if(!held)return;
  directionPointers.delete(e.pointerId);
  held.button.setAttribute('aria-pressed',String([...directionPointers.values()].some(p=>p.button===held.button)));
  if(held.button.hasPointerCapture(e.pointerId))held.button.releasePointerCapture(e.pointerId);
 }
 let joystickControl=null;
 const keyup=e=>keys.delete(e.key),blur=()=>{
  control?.cancelLook?.();
  fastMode=false;keys.clear();for(const pointerId of [...directionPointers.keys()])releaseDirection({pointerId});
  joystickControl?.reset();targetPoint=null;route=[];
 };
 document.addEventListener('keydown',keydown);document.addEventListener('keyup',keyup);window.addEventListener('blur',blur);document.addEventListener('visibilitychange',blur);
 joystickControl=createTouchJoystick({pad,knob,enabled:()=>!disposed&&!paused()&&panel.hidden,onStart:()=>{joy.gesture();targetPoint=null;route=[];}});
 window.addEventListener('pointerup',releaseDirection);
 window.addEventListener('pointercancel',releaseDirection);
 window.addEventListener('pagehide',blur);
 // Keep the canvas alive during a temporary GPU reset so Chrome can restore it.
 let recovering=false,attempt=0,recoveryTimer=0,startTimer=0,generation=0;
 const retry=btn(say('Volver a abrir la isla','Reopen the island'),'world-small',()=>start(true));retry.hidden=true;menu.append(retry);
 function ready(){if(disposed)return;recovering=false;clearTimeout(recoveryTimer);host.classList.remove('explore-fallback');host.classList.add('explore-ready');pad.hidden=actions.hidden=directions.hidden=false;menu.firstChild.hidden=false;retry.hidden=true;if(!welcomed){welcomed=true;guide((welcomeMessage?welcomeMessage+' ':'')+goalWords(),true);}}
 function failed(error){if(disposed)return;console.warn('Island exploration unavailable',error||'Graphics context unavailable');recovering=false;clearTimeout(recoveryTimer);engine?.dispose();engine=null;host.classList.remove('explore-ready');host.classList.add('explore-fallback');canvas.hidden=true;quest.hidden=false;quest.textContent=say('La isla no terminó de cargar. Vuelve a abrirla; tu progreso está guardado.','The island did not finish loading. Reopen it; your progress is saved.');pad.hidden=actions.hidden=directions.hidden=true;menu.firstChild.hidden=true;retry.hidden=false;}
 function start(light=false){if(disposed)return;const current=++generation;clearTimeout(startTimer);clearTimeout(recoveryTimer);recovering=true;blur();canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored);engine?.dispose();engine=null;control=null;const next=canvas.cloneNode(false);canvas.replaceWith(next);canvas=next;canvas.hidden=false;quest.hidden=false;canvas.addEventListener('webglcontextlost',contextLost);canvas.addEventListener('webglcontextrestored',contextRestored);attempt=light?1:0;retry.hidden=true;host.classList.remove('explore-ready','explore-fallback');quest.textContent=say('☀️ Preparando tu Panamá…','☀️ Getting Panama ready…');
  // Give the previous entrance/world context time to release before allocating another.
  startTimer=setTimeout(()=>{Promise.all([load(),loadMainlandData()]).then(([T,mainland])=>{if(disposed||current!==generation)return;try{engine=buildIsland(T,canvas,motion,setup,{light,onError:failed,mainland});ready();}catch(error){if(!light)start(true);else failed(error);}}).catch(error=>{if(disposed||current!==generation)return;if(!light)start(true);else failed(error);});},light?250:0);
 }
 const contextLost=e=>{e.preventDefault();if(disposed||recovering)return;recovering=true;blur();save();quest.textContent=say('Reconectando con tu isla…','Reconnecting to your island…');recoveryTimer=setTimeout(()=>{if(attempt===0)start(true);else failed(new Error('Graphics context could not be restored'));},4000);};
 const contextRestored=()=>{if(disposed||!engine)return;ready();engine.resume?.();};
 canvas.addEventListener('webglcontextlost',contextLost);canvas.addEventListener('webglcontextrestored',contextRestored);
 start();
 function setup({T,scene,camera,target,height,make,geometry,mat,ball,cone,cylinder,box,renderer,tropical,tower,beam,crystal,dockBoat,sun,ambient,waterMaterial,surfaces}){
  const setupAt=performance.now(),startup=scene.userData.startupTimings;
  let pavement=null;const vehicleRoadHeight=(x,z)=>Math.max(height(x,z),pavement?.height(x,z)??-Infinity,mansionLife?.parkingHeight(x,z)??-Infinity);
  createRuralTowns({T,scene,make,mat,box,geometry,height,state});
  const regionalScenery=createRegionalScenery({T,scene,geometry,mat,box,ball,cylinder,height,surfaces,state});let detailedDistricts=null;
  function loadNearbyScenery(){if(!detailedDistricts&&s.x>200)detailedDistricts=createExtendedDistricts({T,scene,make,mat,box,cylinder,height,surfaces});}
  const gold=mat('#bba16b',{metalness:.18,roughness:.61}),pink=mat('#9d6550',{map:surfaces.plaster}),orange=mat('#b68151'),cream=mat('#d9d4bf'),ink=mat('#263b40'),purple=mat('#65717e'),green=mat('#627a58');
  // Continuous new asphalt ribbons follow each sampled highway curve.
  // Shared geometry avoids the seams, overlaps and square patches of road boxes.
  const routeAsphalt=mat('#303943',{roughness:.91}),routeStripe=mat('#f4eee1',{roughness:.9});
  const roadEdge=mat('#e9e4d6',{roughness:.94});
  createCanalBridges({T,scene,geometry,mat,make,box});
  const highwayPaths=Object.values(HIGHWAY_CURVES),roadPaint=createRoadPaintQuery(HIGHWAY_CURVES,highwayWidth);
  for(const [id,path]of Object.entries(HIGHWAY_CURVES)){
   const width=(x,z)=>highwayWidth(id,x,z);
   const paintClear=roadPaint(id);
   const pavement=surfaceMesh(T,geometry,roadRibbon(path,width,height),routeAsphalt,'Smooth connected highway asphalt');pavement.userData.highwayId=id;pavement.userData.lanes=FOUR_LANE_ROADS.has(id)?4:2;scene.add(pavement);
   if(FOUR_LANE_ROADS.has(id)){
    const yellow=mat('#f4c84d',{roughness:.9});
    for(const side of [-1,1]){
     scene.add(surfaceMesh(T,geometry,roadRibbon(path,.12,height,{offset:side*.22,lift:.15,include:paintClear}),yellow,'Highway opposing traffic divider'));
     scene.add(surfaceMesh(T,geometry,roadRibbon(path,.12,height,{offset:(x,z)=>side*(width(x,z)/4+.12),lift:.15,dash:2.5,gap:4.5,include:(x,z)=>width(x,z)>13&&paintClear(x,z)}),routeStripe,'Highway same-direction lane divider'));
    }
   }else if(!id.startsWith('mansion'))scene.add(surfaceMesh(T,geometry,roadRibbon(path,.14,height,{lift:.145,dash:1.6,gap:5.4,include:paintClear}),routeStripe,'Highway center markings'));
   for(const side of [-1,1])scene.add(surfaceMesh(T,geometry,roadRibbon(path,.085,height,{offset:(x,z)=>side*(width(x,z)/2-.34),lift:.15,include:paintClear}),roadEdge,'Continuous highway edge markings'));
  }
  for(const [x,z,esText,enText]of [[64,-19,'GORGONA →  |  BARÚ ←','GORGONA →  |  BARÚ ←'],[100,-48,'CIUDAD →  |  GORGONA ←','CITY →  |  GORGONA ←'],[-300,-32,'BOQUETE →  |  VOLCÁN ←','BOQUETE →  |  VOLCÁN ←'],[24,-351,'COLÓN ←  |  PUERTO →','COLÓN ←  |  PORT →']]){
   const p=roadsidePoint(x,z,1.8),y=height(p.x,p.z),canvas=document.createElement('canvas');canvas.width=768;canvas.height=160;const ctx=canvas.getContext('2d');ctx.fillStyle='#1b5743';ctx.fillRect(0,0,768,160);ctx.strokeStyle='#f2f0d9';ctx.lineWidth=6;ctx.strokeRect(6,6,756,148);ctx.fillStyle='#f2f0d9';ctx.font='600 44px system-ui';ctx.textAlign='center';ctx.fillText(es?esText:enText,384,94,730);
   const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const paint=mat('#ffffff',{map:texture});paint.addEventListener('dispose',()=>texture.dispose());
   make(box,paint,p.x,y+2.6,p.z,4.6,.95,.09);for(const side of [-1,1])make(cylinder,roadEdge,p.x+side*1.6,y+1.25,p.z,.045,2.5,.045);
  }
  // Terrain-side barriers only, never at junctions or along Gorgona access.
  const railMetal=mat('#a9afb1',{roughness:.66,metalness:.52}),railPost=mat('#555f65',{roughness:.78});
  for(const rail of planHighwayGuardrails()){
   // Guarantee that even previously cached rail plans cannot block Gorgona's
   // approach: no beam may intersect either side of the road lane.
   if(roadDistance(rail.x,rail.z)<HIGHWAY_WIDTH/2+1.05)continue;
   const y=height(rail.x,rail.z);
   const beam=make(box,railMetal,rail.x,y+1.02,rail.z,.15,.17,rail.length);
   beam.rotation.y=rail.angle;beam.castShadow=false;
   if(rail.post){const post=make(box,railPost,rail.x,y+.55,rail.z,.17,1.1,.17);post.castShadow=false;}
  }
  const avatar=new T.Group();avatar.name='Angelique';scene.add(avatar);const skin=mat('#bd8e68'),shirt=mat('#b8a6d7',{roughness:.92}),shorts=mat('#437c80',{roughness:.9}),hair=mat('#35291f',{roughness:.8});
  make(geometry(new T.CylinderGeometry(.225,.19,.58,20)),shirt,0,1.06,0,1,1,1,avatar);make(ball,skin,0,1.58,0,.22,.27,.21,avatar);make(ball,hair,0,1.73,-.03,.23,.15,.21,avatar);
  // Angelique's ponytail, ribbon, and lavender adventure outfit.
  const ponytail=new T.Group();ponytail.position.set(0,1.65,-.19);avatar.add(ponytail);make(ball,hair,0,-.15,-.08,.16,.29,.13,ponytail);make(ball,hair,0,-.37,-.09,.1,.18,.1,ponytail);const ribbon=mat('#ed9fbd');for(const x of [-.09,.09])make(ball,ribbon,x,.04,0,.1,.055,.035,ponytail);const dressSkirt=make(geometry(new T.CylinderGeometry(.20,.34,.32,16)),shirt,0,.75,0,1,1,1,avatar);make(ball,ribbon,.08,1.18,.23,.04,.04,.02,avatar);
  const legs=[-.13,.13].map(x=>{const leg=new T.Group();leg.position.set(x,.7,0);avatar.add(leg);make(cylinder,shorts,0,-.12,0,.12,.3,.12,leg);make(cylinder,skin,0,-.4,0,.075,.35,.075,leg);return leg;});
  const pajamaLegs=legs.map(leg=>make(cylinder,shirt,0,-.3,0,.13,.66,.13,leg));pajamaLegs.forEach(p=>p.visible=false);
  const rollerblades=new T.Group();rollerblades.name='Angelique rollerblades';avatar.add(rollerblades);
  const skateBoot=mat('#8a719e'),skateFrame=mat('#ced6d1'),skateWheel=mat('#45565a');
  const wheelGeo=geometry(new T.CylinderGeometry(.065,.065,.055,10));
  for(const side of [-1,1]){
   make(box,skateBoot,side*.14,.145,.08,.23,.17,.39,rollerblades);make(box,skateFrame,side*.14,.085,.09,.10,.035,.43,rollerblades);
   for(let i=0;i<4;i++){const wheel=make(wheelGeo,skateWheel,side*.14,.052,-.08+i*.115,1,1,1,rollerblades);wheel.rotation.z=Math.PI/2;}
  }
  // Articulated shoulders keep sleeves, hands and accessories together in motion.
  const shoe=mat('#ece6dc',{roughness:.8}),sole=mat('#6b5b66'),eyes=mat('#332920'),eyeWhite=mat('#eee9df'),lip=mat('#975e56'),seam=mat('#d8c0f0'),sock=mat('#f9f0ee');
  const arms=[];
  for(const side of [-1,1]){
   const arm=new T.Group();arm.position.set(side*.265,1.29,0);avatar.add(arm);arms.push(arm);
   make(ball,shirt,0,-.045,0,.073,.10,.078,arm);
   make(cylinder,skin,side*.025,-.23,0,.053,.30,.056,arm);
   make(ball,skin,side*.025,-.37,.005,.056,.057,.056,arm);
   make(cylinder,skin,side*.035,-.46,.018,.047,.20,.048,arm);
   make(ball,skin,side*.035,-.585,.025,.052,.07,.04,arm);
   make(ball,skin,side*-.012,-.565,.052,.022,.04,.022,arm);
   for(let i=0;i<3;i++)make(box,lip,side*.035-.021+i*.021,-.61,.062,.004,.023,.003,arm);
   arm.rotation.z=side*-.09;
  }
  make(ball,skin,0,1.37,.018,.085,.115,.085,avatar);
  make(box,seam,0,.83,.205,.36,.022,.012,avatar);
  for(const side of [-1,1]){
   const x=side*.14,leg=legs[side===-1?0:1];
   make(ball,skin,side*.213,1.58,.005,.038,.06,.033,avatar);
   make(ball,eyeWhite,side*.083,1.62,.197,.033,.019,.009,avatar);
   make(ball,eyes,side*.083,1.62,.207,.015,.018,.006,avatar);
   make(ball,eyeWhite,side*.079,1.627,.214,.004,.004,.002,avatar);
   make(ball,hair,side*.085,1.668,.192,.044,.009,.008,avatar);
   make(ball,sock,0,-.535,.015,.078,.07,.082,leg);
   make(ball,shoe,0,-.61,.07,.10,.075,.16,leg);
   make(box,sole,0,-.666,.08,.18,.025,.27,leg);
   for(let i=0;i<3;i++)make(box,seam,0,-.56,.09+i*.035,.11,.008,.008,leg);
  }
  make(ball,skin,0,1.55,.207,.029,.042,.034,avatar);
  make(ball,lip,0,1.473,.199,.039,.008,.009,avatar);
  // Fine swept hair strands follow the scalp and ponytail, rather than separate round tufts.
  const highlight=mat('#574333',{roughness:.8});
  function strand(points,parent=avatar,r=.004){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const mesh=make(geometry(new T.TubeGeometry(curve,10,r,4,false)),highlight,0,0,0,1,1,1,parent);mesh.name='Hair strand';return mesh;}
  for(let i=0;i<9;i++){const x=-.18+i*.045;strand([[x*.4,1.859,-.01],[x*.85,1.80,.11],[x,1.69,.15],[x*.95,1.58,.07]]);}
  for(let i=0;i<7;i++){const x=-.09+i*.03;strand([[x,.03,-.08],[x*1.2,-.18,-.18],[x*.55,-.43,-.10]],ponytail,.0035);}
  // Slightly smaller head and restrained ribbon keep her young without a toddler silhouette.
  const head=new T.Group();head.name='Angelique detailed face and hair';head.position.y=1.58;avatar.add(head);
  for(const child of [...avatar.children])if(child!==head&&(child.position.y>=1.44||child.name==='Hair strand')){avatar.remove(child);child.position.y-=1.58;head.add(child);}
  head.scale.set(.80,.86,.84);
  for(const child of ponytail.children)if(child.material===ribbon)child.scale.multiplyScalar(.65);
  // Stitched placket, collar, hem and small buttons read clearly at phone scale.
  for(const side of [-1,1]){const collar=make(box,seam,side*.062,1.31,.17,.105,.055,.012,avatar);collar.rotation.z=side*.4;}
  make(box,seam,0,1.12,.217,.012,.27,.012,avatar);
  for(const y of [1.22,1.13,1.04])make(ball,sole,0,y,.23,.009,.009,.005,avatar);
  const hem=make(geometry(new T.CylinderGeometry(.318,.326,.018,24)),seam,0,-.145,0,1,1,1,dressSkirt);
  // The hem inherits outfit visibility and the skirt's party-dress scale.
  const hat=new T.Group();hat.position.y=1.86;avatar.add(hat);make(cylinder,gold,0,0,0,.35,.04,.35,hat);make(cylinder,gold,0,.1,0,.22,.17,.22,hat);
  function woodMaterial(){return mat('#554835');}
  avatar.userData.originalAngelique=true;
  // Proper depth and shadows let the explorer belong to the same world as terrain.
  avatar.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  const shadow=make(geometry(new T.CircleGeometry(.35,20)),mat('#264e4c',{transparent:true,opacity:.2,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}),0,0,0);shadow.rotation.x=-Math.PI/2;shadow.castShadow=false;shadow.receiveShadow=false;
  const pet=new T.Group();scene.add(pet);
  const circle=geometry(new T.TorusGeometry(.55,.06,6,24));const guideBeacon=make(cone,gold,0,0,0,.35,.8,.35);guideBeacon.rotation.z=Math.PI;guideBeacon.castShadow=false;const marker=make(circle,gold,s.x,height(s.x,s.z)+.1,s.z);marker.rotation.x=-Math.PI/2;marker.visible=false;
  let crashRemaining=0,crashCooldown=0,crashX=0,crashZ=0;
  let currentHint=0,jumpY=0,velocity=0,towerY=0,towerV=0,airborne=false,stairAngle=0,step=0,lastPad=-1,petX=s.x-1,petZ=s.z+1;
  const entityMeshes=[],collectibles=[],particles=[],blooms=[],pads=[],bubbles=[];let popped=0;const bubbleMaterial=mat('#a8eaf1',{transparent:true,opacity:.45,roughness:.08,metalness:.2,depthWrite:false});
  function sign(p){const g=new T.Group();g.position.set(p.x,height(p.x,p.z),p.z);scene.add(g);const ring=make(circle,mat('#bba16b',{transparent:true,opacity:.38,depthWrite:false}),0,.06,0,1.1,.20,1.1,g);ring.rotation.x=-Math.PI/2;
   if(p.kind==='friend')tropical.card(({pip:8,mila:11,ollie:10,luna:9})[p.id],0,.04,0,p.id==='ollie'?1.1:1.25,p.id==='ollie'?1.8:.95,g);
   if(p.kind==='bounce'){
    const rim=make(geometry(new T.TorusGeometry(1,.045,8,36)),mat('#8b9694',{metalness:.65,roughness:.45}),0,.46,0,1,1,1,g);rim.rotation.x=-Math.PI/2;
    make(cylinder,ink,0,.45,0,.91,.025,.91,g);for(let i=0;i<6;i++){const a=i*Math.PI/3;make(cylinder,cream,Math.sin(a)*.92,.23,Math.cos(a)*.92,.025,.46,.025,g);}
   }
   if(p.kind==='balloon'){make(box,gold,0,.5,0,.8,.6,.8,g);make(ball,pink,0,3,0,1.3,1.65,1.3,g);for(const x of [-.4,.4])make(cylinder,cream,x,1.5,0,.025,1.6,.025,g);}
   if(p.kind==='chest'){const timber=mat('#65523a',{map:surfaces.wood});make(box,timber,0,.4,0,1.1,.7,.8,g);for(const side of [-1,1])make(box,ink,side*.36,.4,.41,.045,.72,.025,g);make(box,gold,0,.45,.42,.12,.18,.03,g);}
   if(p.kind==='wardrobe'){make(box,purple,0,.85,0,.95,1.65,.60,g);for(const side of [-1,1]){make(box,ink,side*.235,.85,.315,.44,1.54,.025,g);make(cylinder,gold,side*.09,.88,.345,.015,.19,.015,g);}}
   entityMeshes.push({p,g,ring});}
  explorePlaces.filter(p=>p.kind!=='friend').forEach(sign);
  for(const item of exploreItems){if(s.collected.includes(item.id))continue;const m=item.kind==='fruit'?tropical.card(item.tile,item.x,height(item.x,item.z)+.12,item.z,.9,1):make(item.kind==='shell'?geometry(new T.SphereGeometry(.3,12,8)):ball,item.kind==='glow'||item.kind==='seaTreasure'||item.kind==='islandTreasure'?gold:cream,item.x,item.kind==='seaTreasure'?-.03:height(item.x,item.z)+.3,item.z,.32,.2,.32);collectibles.push({item,m});}
  const padColors=[pink,gold,mat('#76cbe1')];for(let i=0;i<3;i++){const {x,z}=islandPoint('crystalCove',-2+i*2,51),m=make(cylinder,padColors[i],x,height(x,z)+.12,z,.75,.22,.75);pads.push({x,z,m});}
  const rideBalloon=new T.Group();rideBalloon.name='Angelique balloon';scene.add(rideBalloon);make(box,mat('#9b713e',{map:tropical.grain}),0,.1,0,1.3,.65,1.3,rideBalloon);// Keep the canopy above her head, not intersecting the character model.
  make(ball,pink,0,5.2,0,1.8,2.2,1.8,rideBalloon);for(const x of [-.6,.6])make(cylinder,cream,x,2.1,0,.025,3.6,.025,rideBalloon);rideBalloon.visible=!!ride;
  function boardBalloon(clearance=.5){bodyScale=1;flightVX=flightVZ=0;ride=1;swimming=false;flightY=height(s.x,s.z)+Math.max(.5,clearance);flightTarget=Math.min(130,flightY+14);s.flight=flightY;targetPoint=null;route=[];blur();reward('balloon','🎈 ¡Tú pilotas!','🎈 You’re the pilot!');if(pendingRealm){targetPoint={x:pendingRealm.x,z:pendingRealm.z};flightTarget=pendingRealm.y||12;pendingRealm=null;}save();}
  function clearLanding(){if(traversable(s.x,s.z))return;for(let r=.25;r<=4;r+=.25)for(let i=0;i<24;i++){const a=i/24*Math.PI*2,x=s.x+Math.sin(a)*r,z=s.z+Math.cos(a)*r;if(traversable(x,z)){s.x=x;s.z=z;return;}}}
  function popBalloon(){if(!ride)return;ride=0;s.flight=0;airborne=true;towerY=flightY;towerV=1;targetPoint=null;route=[];blur();rideBalloon.visible=false;spark(s.x,s.z,26,flightY+4);joy.effect('balloon-pop');tell('💥 ¡Pop!','💥 Pop!');save();}
  const rideBoat=dockBoat||new T.Group();if(!dockBoat)scene.add(rideBoat);rideBoat.name='Dock boat';rideBoat.position.set(s.boat.x,.25,s.boat.z);rideBoat.rotation.y=s.boat.heading-Math.PI/2;
  let bodyScale=s.growth,giantDepth=true,riderOverlay=false;
  const snack=new T.Group();snack.name='Angelique snack';snack.position.set(.22,1.45,.3);avatar.add(snack);snack.visible=false;
  const coconutSnack=new T.Group(),bananaSnack=new T.Group(),mangoSnack=new T.Group();snack.add(coconutSnack,bananaSnack,mangoSnack);make(ball,mat('#ffb529'),0,0,0,.15,.21,.12,mangoSnack);mangoSnack.visible=false;
  make(ball,mat('#765035',{map:tropical.grain}),0,0,0,.16,.15,.13,coconutSnack);
  make(ball,cream,0,.04,.095,.135,.11,.045,coconutSnack);
  make(ball,mat('#eee3cd'),0,.04,.13,.08,.065,.02,coconutSnack);
  const bananaCurve=geometry(new T.TorusGeometry(.15,.05,6,12,Math.PI*1.25));
  const banana=make(bananaCurve,mat('#ffe57b'),0,0,0,1,1,1,bananaSnack);banana.rotation.z=-.8;
  for(const side of [-1,1]){const peel=make(bananaCurve,gold,side*.035,-.07,-.02,.8,.65,.6,bananaSnack);peel.rotation.z=side*.9;}
  const growthRing=make(geometry(new T.TorusGeometry(.6,.035,6,32)),mat('#ffdf84',{transparent:true,opacity:.8,depthWrite:false}),0,0,0);growthRing.rotation.x=-Math.PI/2;growthRing.visible=false;growthRing.name='Growth glow';
  const abundance=createFruitAbundance({T,scene,geometry,mat,ball,cylinder,height,state});const foodTrees=[...(tropical.foodTrees||[]),...abundance.foodTrees];for(const tree of foodTrees)tree.fruits.forEach((m,i)=>m.visible=i>=(s.harvested[tree.id]||0));
  let impactLeft=0,impactPower=0,impactX=0,impactZ=0;
  const impactWave=make(geometry(new T.TorusGeometry(1,.055,6,48)),mat('#ffe5ab',{transparent:true,opacity:0,depthWrite:false}),0,0,0);impactWave.name='Giant impact wave';impactWave.rotation.x=-Math.PI/2;impactWave.visible=false;
  const fallenCoconut=mat('#80613c',{map:tropical.grain});
  function giantLanding(){
   if(s.growth<2||inside||boating||ride||inWater(s.x,s.z)||onDock(s.x,s.z))return;
   impactLeft=1.2;impactPower=Math.min(1,(s.growth-1)/5);impactX=s.x;impactZ=s.z;
   impactWave.position.set(s.x,height(s.x,s.z)+.12,s.z);joy.effect('giant-stomp');
   let gathered=0;
   for(const tree of foodTrees){const n=s.harvested[tree.id]||0;if(tree.kind!=='coconut'||Math.hypot(tree.x-s.x,tree.z-s.z)>3+s.growth||n>=tree.fruits.length||s.food.coconut>=9999||gathered>=4)continue;
    const pos=tree.fruits[n].getWorldPosition(new T.Vector3());if(!harvestFood(s,tree))continue;tree.fruits[n].visible=false;gathered++;
    if(motion()&&particles.length<70){const m=make(ball,fallenCoconut,pos.x,pos.y,pos.z,.24);m.name='Shaken coconut';particles.push({m,vx:(tree.x-s.x)*.5,vz:(tree.z-s.z)*.5,vy:2,life:2,size:.2});}
   }
   if(motion())spark(s.x,s.z,22,height(s.x,s.z)+.3);
   tell(gathered?'💥 ¡BUM! 🥥 +'+gathered:'💥 ¡BUM!',gathered?'💥 BOOM! 🥥 +'+gathered:'💥 BOOM!');
   if(gathered){save();refresh();}
  }
  function boatNear(){return !inside&&!ride&&Math.hypot(s.x-s.boat.x,s.z-s.boat.z)<3.1;}
  function board(){if(!boatNear())return;bodyScale=1;Object.assign(s.boat,recoverBoat(s.boat.x,s.boat.z));boating=true;swimming=false;boatSpeed=0;sailProbe=0;sailLimit=15;s.x=s.boat.x;s.z=s.boat.z;targetPoint=null;route=[];blur();joy.boat?.(true,0);reward('boat','⛵ ¡Tú conduces!','⛵ You’re the captain!');}
  function disembark(){if(!boating)return;if(rewardJet){boating=false;rewardJet=false;boatSpeed=0;joy.boat?.(false);if(rewardReturn){s.x=rewardReturn.x;s.z=rewardReturn.z;}targetPoint=null;blur();save();return;}boating=false;boatSpeed=0;joy.boat?.(false);const dock=Math.hypot(s.boat.x-6.5,s.boat.z-16)<3;s.x=dock?4:s.boat.x+Math.cos(s.boat.heading)*1.5;s.z=dock?16:s.boat.z-Math.sin(s.boat.heading)*1.5;const edge=Math.max(1,Math.hypot(s.x/(WORLD_BOUNDS.x-1),s.z/(WORLD_BOUNDS.z-1)));s.x/=edge;s.z/=edge;targetPoint=null;blur();save();}
  function harvest(){if(!foodNear)return;const tree=foodNear,n=s.harvested[tree.id]||0;if(!harvestFood(s,tree))return;tree.fruits[n].visible=false;spark(s.x,s.z,8);joy.effect('correct');const icon=tree.kind==='coconut'?'🥥':tree.kind==='mango'?'🥭':'🍌';tell(icon+' +1 · 🎒 Comer',icon+' +1 · 🎒 Eat');save();refresh();}
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
  const patrols=[{x:0,z:0,rx:30,rz:24},
   ...[{x:-300,z:110,rx:40,rz:28},{x:220,z:160,rx:45,rz:32},{x:440,z:240,rx:40,rz:30},{x:-200,z:350,rx:40,rz:28}],
   ...worldIslands.filter(p=>['islet','wilds','coconutCoast','crystalCove','colon','coiba','delRey','escudo','cebaco'].includes(p.id)||(p.guna&&Number(p.id.split('-')[1])%6===0))
    .map(p=>({x:p.x,z:p.z,rx:p.rx+9,rz:p.rz+9}))];
  patrols.forEach((p,i)=>{const {g,moving}=oceanModel(T,{geometry,mat,make,ball},'Reef shark');g.name='Reef shark '+(i+1);g.scale.setScalar(1.38+(i%3)*.12);scene.add(g);const a=i*Math.PI*.4,spawn=recoverShark(p.x+Math.cos(a)*p.rx,p.z+Math.sin(a)*p.rz);g.position.set(spawn.x,-.22,spawn.z);seaLife.push({g,tail:moving[0],a,nav:{...spawn,cx:p.x,cz:p.z,rx:p.rx,rz:p.rz,waypoint:Math.round(a/(Math.PI*2)*24)%24,direction:i%2?-1:1}});});
  const ripple=make(geometry(new T.TorusGeometry(.65,.025,5,28)),mat('#e2fffa',{transparent:true,opacity:.65,depthWrite:false}),0,-.03,0);ripple.rotation.x=-Math.PI/2;ripple.castShadow=false;ripple.visible=false;
  if(typeof s.lighthouseOn!=='boolean')s.lighthouseOn=s.badges.includes('beacon');
   function syncLighthouse(){if(beam){beam.visible=s.lighthouseOn;beam.material.opacity=s.lighthouseOn?.22:0;}if(crystal)crystal.material.emissiveIntensity=s.lighthouseOn?1.1:.05;beamCopy.visible=!!s.lighthouseOn;}
   syncLighthouse();
  function enterTower(){inside=true;swimming=false;stair=0;stairAngle=0;towerY=.22;towerV=0;airborne=false;targetPoint=null;route=[];blur();s.x=-1;s.z=-4.1;interior.visible=true;if(tower)tower.visible=false;host.classList.add('inside-lighthouse');tell('👣 Sigue los escalones · ⤴ Salta','👣 Follow the steps · ⤴ Jump');save();}
  function leaveTower(falling=false){inside=false;interior.visible=false;if(tower)tower.visible=true;host.classList.remove('inside-lighthouse');if(falling){airborne=true;towerY+=height(-1,-5);}else{s.x=-1;s.z=-2.5;towerY=0;towerV=0;}targetPoint=null;route=[];save();}
  function lightBeacon(){if(!inside||stair<.97)return;s.lighthouseOn=!s.lighthouseOn;syncLighthouse();if(s.lighthouseOn){reward('beacon','💡 ¡Faro encendido! La luz guía los barcos.','💡 Lighthouse ON! The light guides the boats.');}else tell('🌙 Faro apagado. Pulsa otra vez para encenderlo.','🌙 Lighthouse OFF. Press again to turn it on.');save();}
  if(startup)startup.roadsAndModels=performance.now()-setupAt;
  const closeCamera=createCloseCamera({T,scene,camera,avatar});
  const desired=new T.Vector3();let buildReveal=null;
  const raycaster=new T.Raycaster(),plane=new T.Plane(new T.Vector3(0,1,0),0),hit=new T.Vector3();
  const walkTo=e=>{if(cruiseLife?.isActive())return;if(!panel.hidden||paused())return;const r=canvas.getBoundingClientRect();raycaster.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),camera);
  if(houseSystem?.current()?.mansion){plane.constant=0;if(raycaster.ray.intersectPlane(plane,hit))houseSystem.walkTo(hit.x,hit.z-280);joy.gesture();return;}
  if(!carDriving&&!ride&&!boating&&!mountId&&!inside&&!houseSystem?.isInside()&&cityLife?.hitCar(raycaster,s.x,s.z)){
   if(cityLife.nearCar(s.x,s.z))boardCar();
   else{route=[];targetPoint={x:s.city.car.x,z:s.city.car.z};}
   joy.gesture();return;
  }
  const moneyTarget=!ride&&!boating&&!inside&&!houseSystem?.isInside()?cityLife?.hitBag(raycaster,s.x,s.z):null;
  if(moneyTarget){route=[];targetPoint={x:moneyTarget.x,z:moneyTarget.z};joy.gesture();return;}
  const buddy=friendSystem?.hit(raycaster);if(buddy){friendSystem.open(buddy.id);joy.gesture();return;}
 const storyHit=!ride&&!boating&&!inside&&!airborne?story.hit(raycaster):null;if(storyHit){route=islandPath(s,storyHit);targetPoint=route.shift()||null;joy.gesture();canvas.focus({preventScroll:true});return;}const bubbleHit=raycaster.intersectObjects(bubbles.map(b=>b.hit),false)[0];if(bubbleHit){popBubble(bubbles.findIndex(b=>b.hit===bubbleHit.object));joy.gesture();return;}const butterflyHit=raycaster.intersectObjects(butterflies.filter(b=>b.g.visible&&b.cooldown===0).map(b=>b.hit),false)[0];if(butterflyHit){const b=butterflies.find(b=>b.hit===butterflyHit.object);if(!ride&&!boating&&!inside&&!airborne&&Math.hypot(s.x-b.g.position.x,s.z-b.g.position.z)>=3){route=islandPath(s,b.g.position);targetPoint=route.shift()||null;}else catchButterfly(b);joy.gesture();return;}if(inside){plane.constant=-(height(-1,-5)+towerY);if(raycaster.ray.intersectPlane(plane,hit)){targetPoint={x:hit.x,z:hit.z};route=[];}plane.constant=0;return;}if(raycaster.ray.intersectPlane(plane,hit)){// Refine the ground intersection for the raised island.
    for(let i=0;i<3;i++){plane.constant=inWater(hit.x,hit.z)?0:-height(hit.x,hit.z);raycaster.ray.intersectPlane(plane,hit);}plane.constant=0;
    if(carDriving){control.startAutoDrive({x:hit.x,z:hit.z,icon:'📍',en:'Map point',es:'Punto del mapa'});joy.gesture();return;}
    const radius=Math.sqrt((hit.x/170)**2+(hit.z/145)**2);const destination={x:hit.x/Math.max(1,radius),z:hit.z/Math.max(1,radius)};route=boating||ride||carDriving?[]:islandPath(s,destination);targetPoint=boating||ride||carDriving?destination:route.shift()||null;marker.position.set(destination.x,inWater(destination.x,destination.z)?.04:height(destination.x,destination.z)+.1,destination.z);marker.visible=!!targetPoint;joy.gesture();canvas.focus({preventScroll:true});}};  let lookPointer=null;
  const lookDown=e=>{if(!closeView){walkTo(e);return;}if(e.button!==0||lookPointer||!panel.hidden||paused()||cruiseLife?.isActive())return;e.preventDefault();lookPointer={id:e.pointerId,x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,drag:false};canvas.setPointerCapture?.(e.pointerId);};
  const lookMove=e=>{const p=lookPointer;if(!p||p.id!==e.pointerId)return;const moved=Math.hypot(e.clientX-p.startX,e.clientY-p.startY)>6;if(moved)p.drag=true;if(p.drag){closeCamera.look(e.clientX-p.x,e.clientY-p.y);targetPoint=null;route=[];avatar.rotation.y=closeCamera.heading();}p.x=e.clientX;p.y=e.clientY;};
  const lookUp=e=>{const p=lookPointer;if(!p||p.id!==e.pointerId)return;lookPointer=null;if(canvas.hasPointerCapture?.(e.pointerId))canvas.releasePointerCapture(e.pointerId);if(e.type==='pointerup'&&!p.drag)walkTo(e);};
  canvas.addEventListener('pointerdown',lookDown);canvas.addEventListener('pointermove',lookMove);canvas.addEventListener('pointerup',lookUp);canvas.addEventListener('pointercancel',lookUp);canvas.addEventListener('lostpointercapture',lookUp);

  function spark(x,z,n=12,y=height(x,z)+.7){for(let i=0;i<n&&particles.length<70;i++){const m=make(ball,i%2?gold:pink,x,y,z,.09);particles.push({m,vx:(Math.random()-.5)*4,vz:(Math.random()-.5)*4,vy:2+Math.random()*3,life:1.4});}}
  function popBubble(i){if(i<0||paused()||document.hidden||!panel.hidden)return;const b=bubbles.splice(i,1)[0];scene.remove(b.m);joy.note((popped++)%5,.2);s.pops=Math.min(9999,s.pops+1);spark(b.m.position.x,b.m.position.z,8,b.m.position.y);tell('🫧 '+s.pops+' · ¡Pop!','🫧 '+s.pops+' · Pop!',false);save();}
  function blowBubbles(){for(let i=0;i<10&&bubbles.length<20;i++){const x=s.x+(Math.random()-.5)*4,z=s.z+(Math.random()-.5)*4,m=make(ball,bubbleMaterial,x,height(x,z)+1+Math.random()*2,z,.3+Math.random()*.25);m.name='Catchable bubble';const rim=make(circle,bubbleRimMaterial,0,0,0,.95,.95,.95,m);make(ball,cream,-.28,.3,.7,.12,.22,.04,m);const hit=make(ball,pickMaterial,0,0,0,1.7,1.7,1.7,m);hit.castShadow=false;bubbles.push({m,hit,rim,life:24});}}
  function bloom(n){while(blooms.length<n){const i=blooms.length,{x,z}=islandPoint('islet',24+Math.sin(i*2.4)*1.8,-8+Math.cos(i*2.4)*1.2);blooms.push(tropical.card(15,x,height(x,z),z,1,1));}}
  function dress(){const outfit=s.mansion.outfit;dressSkirt.visible=!['swim','pajamas'].includes(outfit);dressSkirt.scale.set(outfit==='party'?1.2:1,outfit==='party'?1.4:1,outfit==='party'?1.2:1);pajamaLegs.forEach(p=>p.visible=outfit==='pajamas');shorts.color.set(outfit==='swim'?'#42bfd0':'#437c80');shirt.color.set(HOME_OUTFITS.find(o=>o.id===s.mansion.outfit)?.color||'#b8a6d7');hat.visible=s.hat>0;hat.traverse(o=>{if(o.isMesh)o.material.color.set(['#b9a474','#b9a474','#a57252','#687b54','#db8b85','#4c9fa8','#edbe4d'][s.hat]);});}
  camera.fov=60;camera.updateProjectionMatrix();
  control={cancelLook:()=>{lookPointer=null;},resetCamera:()=>{closeCamera.reset(avatar.rotation.y);lookPointer=null;},catchNearest,showBuild:(b)=>{if(!b)return;buildReveal={x:b.x,z:b.z,remaining:3.8};blur();targetPoint=null;route=[];},falling:()=>airborne,normalizeRider:()=>{bodyScale=1;},boardBalloon,popBalloon,board,disembark,boatNear,harvest,snack:(kind)=>{coconutSnack.visible=kind==='coconut';bananaSnack.visible=kind==='banana';mangoSnack.visible=kind==='mango';spark(s.x,s.z,16,avatar.position.y+bodyScale*1.4);},enterTower,leaveTower,lightBeacon,bubbles:blowBubbles,hop:(v=5)=>{if(inside){if(towerV===0)towerV=v;}else if(!airborne&&jumpY<.1)velocity=v+(s.growth>=2?Math.min(4,s.growth-1):0);},spark,bloom,dress,demo:()=>{music=[];spark(pads[1].x,pads[1].z,8);}};bloom(s.flowers);dress();
  const life=createIslandLife({T,scene,camera,state,make,mat,geometry,ball,cone,box,sun,ambient,waterMaterial,inWater,sharkStep});wildLife=life;
  cityLife=createPizzaCity({T,scene,camera,state,height,roadHeight:vehicleRoadHeight,make,mat,geometry,ball,box,cylinder,cone,surfaces,joy,save,refresh,tell:(msg)=>tell(msg,msg)});
  // Focused headlights let the road remain visible without brightening the night sky.
  const driverSeat=new T.Vector3();const drivingLamps=[-1,1].map(side=>{const light=new T.SpotLight('#fff0d2',95,42,.38,.65,1.5);light.name='Lamborghini night headlight';light.visible=false;scene.add(light,light.target);return {side,light};});
  const hospital=createCityHospital({T,scene,make,mat,box,height});
  cruiseLife=createCanalCruise({T,scene,host,state,make,mat,box,ball,cylinder,height,save,refresh,joy,tell:(msg)=>tell(msg,msg)});
  colonLife=createColonAdventure({T,scene,host,state,make,geometry,mat,box,ball,cylinder,cone,height,save,refresh,joy,tell:msg=>tell(msg,msg),forest:tropical.forest,motion});
  cityLife.attach(host);cityLife.setCoinAward(id=>earnCoins(state,id));
  workshop=createIslandWorkshop({T,scene,state,make,mat,geometry,ball,box,cylinder,cone,height,joy,save,refresh,tell,spark,motion});
  estateWorld=createEstateWorld({T,scene,state,make,mat,geometry,ball,box,cylinder,cone,height,joy,save,refresh,tell,spark});
  regionWorld=createRegionProjectWorld({T,scene,state,make,mat,ball,box,cone,cylinder,height});
  refresh();
  houseSystem=createHouseInteriors({contextAction:true,T,scene,camera,avatar,host,make,mat,geometry,box,ball,cone,cylinder,height,surfaces,joy,language:state.lang,companionId:()=>s.friends?.companion,onPizza:()=>houseSystem?.current()?.id==='dream-restaurant'?mansionLife?.restaurant():panamaLife?.watchOrder('pizza',()=>cityLife?.order()),
    buildCustom:cfg=>mansionLife.buildInterior(cfg),extraHouses:()=>[...(mansionLife?.houses()||[]),...colonLife.houses(),...(panamaLife?.homes()||[])],treehouseLevel:()=>s.colon.level,onTreehouseUpgrade:()=>colonLife.expand(),estateBuildings:()=>s.estate?.buildings||[],
    workshopBuildings:()=>workshop?.recipes?.filter(b=>workshop.isBuilt(b.id))||[],
    onUseWorkshop:id=>{const r=workshop?.recipes?.find(r=>r.id===id);if(!r)return false;const result=useWorkshop(id);if(!result)tell('🛠️ ¡Usa el taller!','🛠️ Use your workshop!');return result;},
    onUpgrade:id=>{
     if(!canUpgradeEstate(s,id,coinBalance(state)))return false;
     if(!upgradeEstate(s,id,coinBalance(state)))return false;
     estateWorld?.upgrade(id);save();refresh();joy.effect('finish');return true;
    },
    onEnter:()=>{avatar.rotation.y=Math.PI;closeCamera.reset(Math.PI);closeCamera.invalidate();cameraSnap=true;if(carDriving)exitCar();if(mountId)friendSystem?.dismount();swimming=false;boating=false;ride=0;s.flight=0;blur();route=[];targetPoint=null;host.classList.add('inside-cottage');},
    onMessage:m=>tell(m,m)
  });
  mansionLife=createMansionLife({T,scene,avatar,arms,legs,state,host,panel,make,mat,geometry,box,ball,cylinder,height,surfaces,save,refresh,joy,coinBalance,roadDistance,isDriving:()=>carDriving,canPark:(x,z)=>cityLife.canDrive(x,z),onPark:()=>cityLife.updateCar(),launchBalloon:()=>boardBalloon(18),dress,
   prepare:()=>{if(friendSystem?.isOpen())friendSystem.close();if(adventureMap.isOpen())adventureMap.close(false);setHelpers(false);blur();targetPoint=null;route=[];},
   navigate:p=>{if(carDriving)exitCar();if(mountId)friendSystem?.dismount();if(inside)leaveTower();boating=false;ride=0;s.flight=0;swimming=false;s.x=p.x;s.z=p.z;lastShore={x:p.x,z:p.z};cameraSnap=true;save();},
   selectCar:model=>cityLife.selectModel(model),placeRoom:(x,z,floor=0)=>houseSystem.place(x,z,floor),canWalk:(x,z)=>solids.clear(x,z)&&!inWater(x,z),walkRoom:(x,z,floor=0)=>houseSystem.walkTo(x,z,floor),isHome:()=>houseSystem.current()?.mansion,enter:cfg=>houseSystem.enter(cfg),leave:()=>{houseSystem.leave();host.classList.remove('inside-cottage');},onMeal:()=>{energy=30;eating=2;s.journey.meals++;}});
  builderSystem=createVillageBuilders({T,scene,host,state,make,mat,ball,box,cylinder,height,save,onTravel:p=>travelTo(p),language:state.lang});
  friendSystem=createWildlifeFriends({T,scene,camera,host,panel,state,make,mat,geometry,ball,cone,cylinder,box,height,joy,save,refresh,motion,airClear:(x,y,z)=>airSolids.clear(x,y,z),
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
  const story=createWorldStory({T,scene,host,state,height,save,joy,spark,openNext,motion,panel,preparePanel:prepareStory,refresh:id=>{earnCoins(state,'story-'+id);bloom(s.flowers);refresh();},active:()=>!paused()&&!document.hidden&&panel.hidden&&!inside&&!swimming&&!boating&&!ride&&!airborne&&!document.querySelector('dialog[open]')});
  control.playStory=id=>story.open(id);
  control.foodPoint=kind=>foodTrees.filter(t=>t.kind===kind&&(s.harvested[t.id]||0)<t.fruits.length).sort((a,b)=>Math.hypot(a.x-s.x,a.z-s.z)-Math.hypot(b.x-s.x,b.z-s.z))[0];
  const festival=new T.Group();festival.name='Panama Friendship Festival';scene.add(festival);const festivalParts=[];
  for(let i=0;i<9;i++){const x=-5+i*1.4,z=11.5+Math.sin(i*.8),y=height(x,z);const part=new T.Group();festival.add(part);make(cylinder,mat('#79553a'),x,y+1.6,z,.07,3.2,.07,part);make(ball,mat(['#f7ce62','#f29a86','#85c6ad'][i%3]),x,y+3.1,z,.27,.36,.27,part);festivalParts.push(part);}
  const festivalTable=new T.Group();festival.add(festivalTable);make(box,mat('#a87549'),1,height(1,12)+.9,12,3,.18,1.3,festivalTable);for(const x of [0,2])make(box,mat('#79553a'),x,height(1,12)+.4,12,.12,.8,.7,festivalTable);

  panamaLife=createPanamaLife({roadHeight:vehicleRoadHeight,T,scene,renderer,sun,waterMaterial,surfaces,host,panel,state,save,refresh,joy,tell,make,mat,geometry,box,ball,cylinder,cone,height,inWater,forest:tropical.forest,prepare:prepareStory,navigate:travelTo,football:()=>cityLife.soccerPosition(),npcKick:()=>cityLife.npcKick(),onEat:()=>{energy=30;eating=2;tell('🍌 Impulso de fruta · 30 segundos','🍌 Fruit boost · 30 seconds');s.journey.meals++;control?.snack('panama');},eatLegacy:kind=>{if(!spendFood(s,kind))return false;energy=30;eating=2;tell('🍌 Impulso de fruta · 30 segundos','🍌 Fruit boost · 30 seconds');s.journey.meals++;s.growth=Math.min(6,s.growth+.45);control?.snack(kind);save();refresh();return true;}});
  const realms=createRealms({T,scene,host,state,make,geometry,mat,ball,box,cylinder,height,save,joy,spark,refresh,tell,navigate:(realm,dest)=>{if(!dest)return;setHelpers(false);if(dest.action==='food'){if(s.food.banana+s.food.coconut+(s.food.mango||0))showFood();else travelTo(explorePlaces.find(p=>p.id==='wilds'));return;}if(dest.action==='learn'){followGoal();return;}if(realm==='sky'){if(boating)disembark();if(ride){targetPoint={x:dest.x,z:dest.z};route=[];flightTarget=dest.y||12;}else{pendingRealm=dest;const launch=explorePlaces.filter(p=>p.kind==='balloon').sort((a,b)=>Math.hypot(a.x-s.x,a.z-s.z)-Math.hypot(b.x-s.x,b.z-s.z))[0];route=islandPath(s,launch);targetPoint=route.shift()||null;tell('🎈 Sube al globo para explorar el cielo','🎈 Board the balloon to explore the sky');}return;}if(realm==='islands'){travelTo(dest);return;}if(ride){waterLanding=dest;targetPoint={x:dest.x,z:dest.z};route=[];flightTarget=Math.max(8,flightY);return;}if(boating)disembark();route=islandPath(s,dest);targetPoint=route.shift()||null;tell('🌊 Sigue el brillo · Nada para descubrir','🌊 Follow the glow · Swim to discover');}});
  const journey=createJourney({T,scene,host,state,avatar,make,geometry,mat,height,save,joy,spark,refresh,realms,seek:kind=>{if(kind==='explore')showDiscover();else if(kind==='food'){if(s.food.banana+s.food.coconut+(s.food.mango||0))showFood();else travelTo(explorePlaces.find(p=>p.id==='wilds'));}else if(kind==='learn')followGoal();else{const dest=kind==='fly'?explorePlaces.find(p=>p.id==='balloon'):{x:11,z:20};route=islandPath(s,dest);targetPoint=route.shift()||null;}}});
   let closeWalkX=0,closeWalkZ=0;
  function respawnAtHospital(cause=null){
   if(mountId)friendSystem?.dismount();if(carDriving)exitCar();
   ride=0;boating=false;airborne=false;swimming=false;inside=false;mountId=null;
   s.flight=0;flightY=flightTarget=flightVX=flightVZ=0;boatSpeed=carSpeed=0;
   jumpY=velocity=towerY=towerV=birdAltitude=birdTarget=0;birdLanding=false;
   energy=eating=impactLeft=0;rescueCooldown=4;bodyScale=1;returnToHospital(s);lastShore={x:s.x,z:s.z};
   camera.position.set(s.x,height(s.x,s.z)+24,s.z+32);target.set(s.x,height(s.x,s.z)+1,s.z);
   cameraSnap=true;closeCamera.invalidate();targetPoint=null;route=[];buildReveal=null;blur();
   host.classList.remove('inside-lighthouse','inside-cottage','is-swimming','shark-nearby');joy.boat?.(false);
   save();refresh();tell('🏥 ¡A salvo! Volviste al hospital de Ciudad de Panamá.','🏥 Safe again! You are back at Panama City Hospital.');
   if(cause){const lesson=SAFETY_LESSONS[cause];prepareStory();panel.replaceChildren(makeEl('h2','',say('💔 La aventura terminó','💔 Your adventure ended')),makeEl('p','',lesson.icon+' '+say(lesson.es,lesson.en)),makeEl('p','',say('🏥 Vuelves al hospital. Tu casa y tu progreso siguen guardados.','🏥 Restart at the hospital. Your home and progress are saved.')),btn(say('💛 Volver a jugar','💛 Try again'),'discover-place',()=>{panel.hidden=true;canvas.focus();}));panel.hidden=false;joy.effect('impact',{strength:1});}

  }
  if(startup)startup.homeAndSystems=performance.now()-setupAt;
  const jungleLife=createEastJungleLife({T,scene,geometry,mat,make,ball,cylinder,box,height,inWater});let wildlifeWarningTime=0;
  pavement=createRoadSurfaceSampler(T,scene);cityLife.updateCar();const solidTrees=[...tropical.forest.trees],solidRocks=[];
  scene.traverse(o=>{if(o.userData.solidTrees)solidTrees.push(...o.userData.solidTrees);if(o.userData.solidRock){const b=new T.Box3().setFromObject(o),c=b.getCenter(new T.Vector3());solidRocks.push({x:c.x,z:c.z,r:Math.min(2,Math.max(b.max.x-b.min.x,b.max.z-b.min.z)*.42)});}});
  const rainforestWorld=createRainforestWorld({T,scene,geometry,mat,make,ball,box,cylinder,height,state,save,refresh,tell,trees:solidTrees,onBoost:()=>{energy=45;eating=2;}});
  if(startup)startup.terrainQueries=performance.now()-setupAt;
  const solids=createWorldCollision({state,trees:solidTrees,rocks:solidRocks});jungleLife.setClear((x,z)=>solids.clear(x,z));
  const autoStaticClear=p=>vehiclePoseClear(p,(x,z)=>cityLife.canDrive(x,z)&&solids.clear(x,z)&&rainforestWorld.clear(x,z));
  const autoTrafficClear=(p,from)=>autoStaticClear(p)&&cityLife.parkedClear(p.x,p.z,p.heading,from)&&jungleLife.trafficClear(p.x,p.z,p.heading,from)&&(panamaLife?.trafficClear(p.x,p.z,p.heading,from)??true);
  control.startAutoDrive=p=>{if(!carDriving)return;const plan=planAutomaticDrive(s.city.car,p,{world:s,clear:p=>autoStaticClear(p)&&cityLife.parkedClear(p.x,p.z,p.heading,s.city.car)});
   if(!plan){tell('🛣️ Conduce hasta un espacio abierto e inténtalo de nuevo.','🛣️ Drive to an open space and try again.');return;}
   automaticDriver.start(plan);carSpeed=0;targetPoint=null;route=[];blur();panel.hidden=true;setHelpers(false);if(adventureMap.isOpen())adventureMap.close(false);if(friendSystem?.isOpen())friendSystem.close();closeView=false;paintCamera();cameraSnap=true;canvas.focus({preventScroll:true});
   tell('🚘 Vamos a '+plan.destination.es+' · 🕹️ Mueve para conducir','🚘 Going to '+plan.destination.en+' · 🕹️ Move to take over');
  };
  // New land/homes can surround an older saved position. Start beside the
  // obstruction instead of trapping an existing player inside a new trunk/wall.
  const grande=worldIslands.find(p=>p.id==='islaGrande');
  if(!s.flight&&!inWater(s.x,s.z)&&(jungleContains(s.x,s.z)||Math.hypot((s.x-grande.x)/grande.rx,(s.z-grande.z)/grande.rz)<1)&&!solids.clear(s.x,s.z)){
   let recovered=false;for(let r=.6;r<=14&&!recovered;r+=.6)for(let i=0;i<32;i++){const a=i*Math.PI/16,x=s.x+Math.sin(a)*r,z=s.z+Math.cos(a)*r;if(!inWater(x,z)&&solids.clear(x,z)){s.x=x;s.z=z;recovered=true;cameraSnap=true;break;}}
  }
  if(startup)startup.staticCollision=performance.now()-setupAt;
  const airSolids=createCityAirCollision(T,scene,height);
  const rewardModels=createRewardModels({T,make,mat,geometry,box,ball,cylinder}),scooter=rewardModels.scooter(avatar),jet=rewardModels.jetski(scene);scooter.visible=jet.visible=false;
  roadRewards=createRoadRewards({T,scene,make,mat,box,ball,cylinder,height,clear:(x,z)=>solids.clear(x,z),models:rewardModels,lang:state.lang});
  control.useRoadReward=p=>{blur();targetPoint=null;route=[];if(p.kind==='scooter'){s.travelMode='scooter';save();tell('🛴 ¡A pasear! · 👟 Caminar para bajar','🛴 Let’s ride! · 👟 Walk to hop off');}
   else if(p.kind==='balloon')boardBalloon();else{const start=recoverBoat(p.water?.x??p.x,p.water?.z??p.z);rewardReturn={x:s.x,z:s.z};Object.assign(s.boat,start);s.x=start.x;s.z=start.z;rewardJet=true;s.travelMode='walk';board();tell('🌊 ¡Moto acuática! · ⤴ Volver a la orilla','🌊 Jet ski! · ⤴ Return to shore');}joy.effect('friend');};
  function vehicleBlocks(x,z){
   const vehicles=[...(panamaLife?.ambience?.cars||[]),...(panamaLife?.city?.vehicles||[]),...jungleLife.vehicles];
   for(const vehicle of vehicles){const p=vehicle.g.position,angle=vehicle.g.rotation.y,dx=x-p.x,dz=z-p.z;
    const across=dx*Math.cos(angle)-dz*Math.sin(angle),along=dx*Math.sin(angle)+dz*Math.cos(angle);
    if(Math.abs(across)<(vehicle.bus?1.5:1.2)&&Math.abs(along)<(vehicle.bus?4:2.0))return true;
   }
   return ownedCars(s.city).some(p=>{const dx=x-p.x,dz=z-p.z,angle=p.heading||0;return Math.abs(dx*Math.cos(angle)-dz*Math.sin(angle))<1.4&&Math.abs(dx*Math.sin(angle)+dz*Math.cos(angle))<2.2;});
  }
  control.carExit=()=>safeVehicleExit(s.city.car,(x,z)=>solids.clear(x,z)&&!inWater(x,z)&&!vehicleBlocks(x,z)&&colonLife.canWalk(x,z));
  const groundHeight=(x,z)=>Math.max(height(x,z),pavement.height(x,z),mansionLife?.surface(x,z)??-Infinity);
  function impact(nx,nz,speed){
   if(speed<8||crashCooldown>0)return;
   host.classList.add('collision-impact');crashRemaining=.75;crashCooldown=1.6;crashX=nx;crashZ=nz;energy=0;targetPoint=null;route=[];closeWalkX=closeWalkZ=0;carSpeed=0;
   tell('💥 ¡Pum! ¡Ay! Baja la velocidad y mira por dónde vas.','💥 Smash! Ouch! Slow down and watch where you’re going.');joy.effect(carDriving?'crash':'impact',{strength:Math.min(1,speed/22)});
  }
  function update(dt,time){if(disposed)return;loadNearbyScenery();dt=Math.min(dt,.1);if(messageTime>0){messageTime-=dt;if(messageTime<=0)message.classList.remove('show');}
   const skating=['skates','scooter'].includes(s.travelMode)&&!swimming&&!inside&&!boating&&!ride&&!mountId&&!carDriving&&!houseSystem?.isInside();
   speedToggle.textContent=swimming?(fastMode?say('Lento','Slow'):say('Rápido','Fast')):skating?say('👟 Caminar','👟 Walk'):say('🛼 Patinar','🛼 Skate');speedToggle.setAttribute('aria-label',swimming?(fastMode?say('Nadar normal','Swim normally'):say('Nadar rápido','Swim fast')):skating?(s.travelMode==='scooter'?say('Bajar del scooter','Hop off scooter'):say('Quitarse los patines','Take off rollerblades')):say('Ponerse los patines','Put on rollerblades'));speedToggle.setAttribute('aria-pressed',String(skating||fastMode));speedToggle.hidden=cruiseLife?.isActive()||!!ride||!!mountId||boating||inside||!!houseSystem?.isInside();
    if(carDriving){speedToggle.textContent=fastMode?say('🚙 Normal','🚙 Normal'):say('🏎️ Rápido','🏎️ Fast');speedToggle.setAttribute('aria-label',fastMode?say('Conducir normal','Drive normally'):say('Activar velocidad rápida','Enable fast driving'));}
   const stick=joystickControl.read(dt);
   const down=(...ks)=>ks.some(k=>keys.has(k)||[...directionPointers.values()].some(p=>p.key===k));let dx=stick.x+(down('ArrowRight','d','D')?1:0)-(down('ArrowLeft','a','A')?1:0),dz=stick.z+(down('ArrowDown','s','S')?1:0)-(down('ArrowUp','w','W')?1:0);
   if(carDriving&&automaticDriver.state.active&&panel.hidden&&Math.hypot(dx,dz)>.15)stopAutomaticDrive(true);
   const cruise=cruiseLife.update(dt,!paused()&&!document.hidden&&panel.hidden&&!journey.isOpen()&&!host.classList.contains('helpers-open')&&!friendSystem?.isOpen()&&!document.querySelector('dialog[open]'),{x:dx,z:dz});
   const cruising=cruise.active;if(cruising){bodyScale=1;targetPoint=null;route=[];jumpY=0;velocity=0;airborne=false;swimming=false;}
   const closeControls=closeView&&!cruising&&!ride&&!boating&&!carDriving&&!mountId&&!inside;
   // Keep the existing keyboard damping; the thumb controller already smooths its input.
   const smoothClose=closeControls&&!targetPoint&&!houseSystem?.isInside()&&!stick.x&&!stick.z;
   if(smoothClose){
    const k=1-Math.exp(-dt*14);
    closeWalkX+=(dx-closeWalkX)*k;closeWalkZ+=(dz-closeWalkZ)*k;
    if(Math.abs(closeWalkX)<.012)closeWalkX=0;
    if(Math.abs(closeWalkZ)<.012)closeWalkZ=0;
    dx=closeWalkX;dz=closeWalkZ;
   }else{closeWalkX=0;closeWalkZ=0;}
   if(closeControls&&!targetPoint){
    const canSteer=!paused()&&!document.hidden&&panel.hidden&&!host.classList.contains('helpers-open')&&!friendSystem?.isOpen()&&!journey.isOpen()&&!document.querySelector('dialog[open]');
    const input=closeCamera.drive(dx,dz,canSteer?dt:0);dx=canSteer?input.x:0;dz=canSteer?input.z:0;
   }
   if(targetPoint&&panel.hidden&&!cruising){const x=targetPoint.x-s.x,z=targetPoint.z-s.z,d=Math.hypot(x,z);if(d<.25){targetPoint=route.shift()||null;marker.visible=!!targetPoint;}else{dx=x/d;dz=z/d;}}
   if(paused()||document.hidden||!panel.hidden||host.classList.contains('helpers-open')||friendSystem?.isOpen()||journey.isOpen()||document.querySelector('dialog[open]')){blur();dx=dz=0;}if(mansionLife?.workoutActive())dx=dz=0;const worldActive=!paused()&&!document.hidden&&panel.hidden&&!host.classList.contains('helpers-open')&&!friendSystem?.isOpen()&&!journey.isOpen()&&!document.querySelector('dialog[open]'),active=!cruising&&worldActive;if(active){crashCooldown=Math.max(0,crashCooldown-dt);crashRemaining=Math.max(0,crashRemaining-dt);host.classList.toggle('collision-impact',crashRemaining>0);currentHint=Math.max(0,currentHint-dt);swimBoost=Math.max(0,swimBoost-dt);rescueCooldown=Math.max(0,rescueCooldown-dt);}const speed=crashRemaining>0?0:houseSystem?.isInside()?0:carDriving?0:mountId?(birdMount()?birdTravelSpeed(birdAltitude,fastMode||down('Shift')):mountId==='dori'?10.5:8):inside?2:swimming?(swimBoost>0||fastMode||down('Shift')?6:3.3):groundTravelSpeed(skating?s.travelMode:'walk',{running:fastMode||down('Shift'),boosted:energy>0}),len=Math.hypot(dx,dz);if(active&&houseSystem?.isInside()){const p=houseSystem.move(dx,dz,dt);if(p?.moving&&!len){avatar.rotation.y=p.heading;step+=dt*10;}if(len)avatar.rotation.y=closeControls?closeCamera.heading():Math.atan2(dx,dz);}
   if(len>0&&active&&!carDriving&&!ride&&!inside&&!boating&&!houseSystem?.isInside()){dx/=Math.max(1,len);dz/=Math.max(1,len);const moved=flightStep(s.x,s.z,dx*speed,dz*speed,dt,targetPoint);let nx=moved.x,nz=moved.z;const edge=Math.hypot(nx/WORLD_BOUNDS.x,nz/WORLD_BOUNDS.z);if(edge>1){nx/=edge;nz/=edge;}if(!airborne&&!mountId&&!remoteAccess(s,{x:nx,z:nz})){nx=s.x;nz=s.z;if(currentHint===0){tell('🌊 Corrientes fuertes · ⛵ 🎈','🌊 Strong currents · ⛵ 🎈');currentHint=5;}}const canMove=(px,pz)=>(mansionLife?.outsideWalk(px,pz)??solids.clear(px,pz))&&!vehicleBlocks(px,pz)&&rainforestWorld.clear(px,pz)&&colonLife.canWalk(px,pz);if(waterFriend(mountId)){const next=animalStep(mountId,s.x,s.z,nx,nz,3.3);s.x=next.x;s.z=next.z;}else if(airborne){s.x=nx;s.z=nz;}else if(birdMount()){const y=height(s.x,s.z)+birdAltitude+1;const next=groundTravelStep(s.x,s.z,nx-s.x,nz-s.z,(px,pz)=>airSolids.clear(px,y,pz));s.x=next.x;s.z=next.z;if(next.hit)impact(next.normalX,next.normalZ,speed);}else{const next=groundTravelStep(s.x,s.z,nx-s.x,nz-s.z,canMove);s.x=next.x;s.z=next.z;if(next.hit)impact(next.normalX,next.normalZ,speed);}const facing=Math.atan2(dx,dz);const turn=Math.atan2(Math.sin(facing-avatar.rotation.y),Math.cos(facing-avatar.rotation.y));avatar.rotation.y+=turn*Math.min(1,dt*11);if(closeView&&targetPoint)closeCamera.face(avatar.rotation.y);step+=dt*12;autosave+=dt;if(autosave>2){save();autosave=0;}}
   let landed=false,landingSpeed=0;if(active&&dt>0&&(jumpY>0||velocity>0)){const aboveGround=jumpY>0;velocity-=15*dt;jumpY=Math.max(0,jumpY+velocity*dt);if(jumpY===0){landingSpeed=Math.abs(velocity);velocity=0;landed=aboveGround;}}
   if(birdMount()&&active){
    const roof=mansionLife?.roofAt(s.x,s.z),roofAltitude=roof==null?null:Math.max(0,roof-height(s.x,s.z)-2),landingRoof=birdLanding&&roofAltitude!==null&&birdAltitude>=roofAltitude;
    const to=birdLanding?(landingRoof?roofAltitude:0):birdTarget,pace=birdLanding?5.8:FLIGHT_SPEED.birdClimb;
    const nextAltitude=birdAltitude+Math.sign(to-birdAltitude)*Math.min(Math.abs(to-birdAltitude),dt*pace);
    if(landingRoof||airSolids.clear(s.x,height(s.x,s.z)+nextAltitude+1,s.z))birdAltitude=nextAltitude;else{birdTarget=birdAltitude;birdLanding=false;}
    if(birdLanding&&(landingRoof?birdAltitude<=roofAltitude+.02:birdAltitude<=.35)){if(landingRoof)mansionLife.landRoof(s.x,s.z);friendSystem?.dismount();birdAltitude=0;birdLanding=false;}
   }
   const wasSwimming=swimming;swimming=!cruising&&!inside&&!ride&&!boating&&!carDriving&&!airborne&&!mountId&&!houseSystem?.isInside()&&inWater(s.x,s.z);if(!cruising&&!swimming&&!inside&&!ride&&walkable(s.x,s.z))lastShore={x:s.x,z:s.z};
   host.classList.toggle('is-swimming',swimming);if(swimming&&!wasSwimming){if(active)joy.effect('splash');if(freshwaterHabitat(s.x,s.z))tell('🐊 Lago de agua dulce · Observa los cocodrilos desde la orilla.','🐊 Freshwater lake · Watch crocodiles from the shore.');else tell('🏊 Nada · 🦈 ¡Cuidado con las aletas!','🏊 Swim · 🦈 Watch for fins!');}
   if(active){energy=Math.max(0,energy-dt);eating=Math.max(0,eating-dt);}host.classList.toggle("snack-moment",eating>0);

   if(carDriving){
    if(active){const car=s.city.car;const incoming=carSpeed;const wanted=Math.hypot(dx,dz);
     if(automaticDriver.state.active){const trip=automaticDriver.state.plan;carSpeed=automaticDriver.update(dt,car,autoTrafficClear);if(automaticDriver.state.status==='arrived'){save();tell(trip.dropoff?'📍 Llegamos al acceso por carretera · 👣 Baja para explorar':'📍 ¡Llegamos! · 👣 Baja para explorar',trip.dropoff?'📍 Road access reached · 👣 Get out to explore':'📍 We’re here! · 👣 Get out to explore');}}else{
     // Chase view controls follow the car, with smooth steering and true reverse.
     const input=targetPoint?{x:dx,z:dz,heading:null}:chaseDriveInput(dx,dz,car.heading,dt);
     carSpeed=driveByDirection(car,crashRemaining>0?0:input.x,crashRemaining>0?0:input.z,carSpeed,dt,fastMode,(x,z,heading,from)=>cityLife.canDrive(x,z)&&cityLife.parkedClear(x,z,heading,from)&&jungleLife.trafficClear(x,z,heading,from)&&rainforestWorld.clear(x,z)&&solids.clear(x,z)&&(panamaLife?.trafficClear(x,z,heading,from)??true),input.heading);
     if(carSpeed===0&&incoming>8&&wanted>.12)impact(-Math.sin(car.heading),-Math.cos(car.heading),incoming);}
     s.x=car.x;s.z=car.z;avatar.rotation.y=car.heading;
     autosave+=dt;if(autosave>2){save();autosave=0;}
    }
    cityLife.updateCar(active?carSpeed:0,active?dt:0);
   }
   drivingLamps.forEach(({side,light})=>{light.visible=carDriving&&worldClock(s.dayTime).night;const car=cityLife.car;driverSeat.set(side*.68,.15,1.94).applyQuaternion(car.quaternion).add(car.position);light.position.copy(driverSeat);driverSeat.set(side*.68,-.30,24).applyQuaternion(car.quaternion).add(car.position);light.target.position.copy(driverSeat);});
   const soundTravel=Math.hypot(s.x-soundX,s.z-soundZ);soundX=s.x;soundZ=s.z;
   if(active&&!carDriving&&!ride&&!mountId&&!boating&&!cruising&&!airborne&&jumpY===0&&soundTravel<5){
    stepDistance+=soundTravel;const stride=swimming?2.2:skating?5:.95;
    if(stepDistance>=stride){stepDistance%=stride;joy.effect(swimming?'swim':skating?'skate':'footstep');}
   }else stepDistance=0;
   // Moving white trail behind the boat, fading naturally after disembarking.
   if(waterMaterial?.uniforms?.wakeStrength){
    const uniforms=waterMaterial.uniforms;
    uniforms.wakePosition.value.set(s.boat.x,s.boat.z);
    uniforms.wakeDirection.value.set(Math.sin(s.boat.heading),Math.cos(s.boat.heading));
    const force=boating?Math.min(1,boatSpeed/11):0;
    uniforms.wakeStrength.value+=(force-uniforms.wakeStrength.value)*Math.min(1,dt*3.6);
   }
   if(boating){if(active){const input=Math.min(1,len),desiredHeading=len?Math.atan2(dx,dz):s.boat.heading;const delta=Math.atan2(Math.sin(desiredHeading-s.boat.heading),Math.cos(desiredHeading-s.boat.heading));s.boat.heading+=delta*Math.min(1,dt*3);sailProbe-=dt;if(sailProbe<=0||Math.abs(Math.atan2(Math.sin(desiredHeading-sailHeading),Math.cos(desiredHeading-sailHeading)))>.2){sailLimit=sailingSpeedLimit(s.boat.x,s.boat.z,desiredHeading);sailHeading=desiredHeading;sailProbe=.2;}const remaining=targetPoint?Math.hypot(targetPoint.x-s.boat.x,targetPoint.z-s.boat.z):Infinity;boatSpeed=sailingVelocity(boatSpeed,Math.min(sailLimit,Math.max(0,remaining*2)),input,dt);const moveX=len?dx/len:Math.sin(s.boat.heading),moveZ=len?dz/len:Math.cos(s.boat.heading);const next=boatStep(s.boat.x,s.boat.z,moveX*Math.min(boatSpeed*dt,remaining),moveZ*Math.min(boatSpeed*dt,remaining),(x,z)=>!panamaLife?.costa?.blocks(x,z)&&!panamaLife?.ghost?.blocks(x,z)&&!panamaLife?.shipping?.blocks(x,z)&&!panamaLife?.maritime?.blocks(x,z)&&!cruiseLife.blocks(x,z));if(Math.hypot(next.x-s.boat.x,next.z-s.boat.z)<.00001){if(boatSpeed>8)joy.effect('impact',{strength:Math.min(1,boatSpeed/30)});boatSpeed=0;}s.boat.x=next.x;s.boat.z=next.z;s.x=s.boat.x;s.z=s.boat.z;autosave+=dt;if(autosave>2){save();autosave=0;}}joy.boat?.(active,Math.min(1,boatSpeed/30));rideBoat.position.set(s.boat.x,.25+(waterMaterial?.userData.surfaceHeight?.(s.boat.x,s.boat.z)||0),s.boat.z);rideBoat.rotation.y=s.boat.heading-Math.PI/2;avatar.rotation.y=s.boat.heading;}
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
    if(len){avatar.rotation.y=closeControls&&!targetPoint?closeCamera.heading():Math.atan2(dx,dz);if(closeView&&targetPoint)closeCamera.face(avatar.rotation.y);step+=dt*10;}
    // The open lookout still allows deliberate walking and jumping off the edge.
    if(!onStairs&&radius>1.75)leaveTower(true);
   }
   let ax=s.x,az=s.z,ay=boating?.74:swimming?-.95+(motion()?Math.sin(time*3)*.04:0):onDock(ax,az)?.58+jumpY:groundHeight(ax,az)+jumpY;
   if(boating||swimming)ay+=waterMaterial?.userData.surfaceHeight?.(s.x,s.z)||0;
   if(cruising){ax=cruise.x;az=cruise.z;ay=cruise.y;avatar.rotation.y=cruise.heading;}
   if(houseSystem?.isInside()){const p=houseSystem.position();ax=p.x;az=p.z;ay=p.y;}
   if(carDriving){const car=cityLife.car;driverSeat.set(-.38,-.97,-.25).applyQuaternion(car.quaternion).add(car.position);ax=driverSeat.x;ay=driverSeat.y;az=driverSeat.z;}
   if(mountId){ay=(inWater(s.x,s.z)?0:height(s.x,s.z))+birdAltitude+
      (mountId==='dori'?1.28:mountId==='pip'?.98:mountId==='luna'?1.4:birdMount()?2.0:2.25);}
   if(boating){ax-=Math.sin(s.boat.heading)*.45;az-=Math.cos(s.boat.heading)*.45;}
   if(inside)ay=height(-1,-5)+towerY;
   if(airborne){if(active&&!fallSoundPlayed){joy.effect('fall');fallSoundPlayed=true;}const roof=mansionLife?.roofAt(ax,az),floor=roof!==null&&roof!==undefined&&towerY>=roof-.1?roof:inWater(ax,az)?-.95:onDock(ax,az)?.58:groundHeight(ax,az);if(active){towerV-=12*dt;towerY+=towerV*dt;}ay=towerY;if(ay<=floor){if(roof!=null&&floor===roof)mansionLife.landRoof(ax,az);landed=active;landingSpeed=Math.abs(towerV);airborne=false;towerV=0;clearLanding();ax=s.x;az=s.z;ay=inWater(ax,az)?-.95:onDock(ax,az)?.58:groundHeight(ax,az);jumpY=0;velocity=0;}}
   danger=false;for(const shark of seaLife){const g=shark.g;const dist=Math.hypot(g.position.x-s.x,g.position.z-s.z);g.visible=dist<190;if(!g.visible)continue;const chase=swimming&&dist<8&&rescueCooldown===0;
    if(worldActive){shark.nav.x=g.position.x;shark.nav.z=g.position.z;shark.nav.detour=Math.max(0,(shark.nav.detour||0)-dt);const next=sharkPatrol(shark.nav,dt,chase&&!shark.nav.detour?{x:s.x,z:s.z}:null),mx=next.x-g.position.x,mz=next.z-g.position.z;if(Math.hypot(mx,mz)>.00001)g.rotation.y=Math.atan2(mx,mz);g.position.x=next.x;g.position.z=next.z;}g.position.y=-.10+Math.sin(time*1.4+shark.a)*.075;
    shark.tail.rotation.y=motion()?Math.sin(time*(chase?16:8)+shark.a)*.38:0;
    if(chase){danger=true;if(wildlifeWarningTime===0){const lesson=SAFETY_LESSONS.shark;tell('⚠️ 🦈 '+lesson.es,'⚠️ 🦈 '+lesson.en);wildlifeWarningTime=8;}}if(chase&&dist<1.25&&active){respawnAtHospital('shark');ax=s.x;az=s.z;ay=height(ax,az);danger=false;}}
   host.classList.toggle('shark-nearby',danger);ripple.visible=swimming;ripple.position.set(ax,-.03,az);ripple.scale.setScalar(1+(motion()?Math.sin(time*4)*.12:0));arms.forEach((arm,i)=>{arm.rotation.x=mountId?-.7:swimming&&motion()?Math.sin(time*7+i*Math.PI)*.9:0;});

   if(ride){if(active){const ease=1-Math.exp(-dt*6);flightVX+=(dx/Math.max(1,len)*FLIGHT_SPEED.balloon-flightVX)*ease;flightVZ+=(dz/Math.max(1,len)*FLIGHT_SPEED.balloon-flightVZ)*ease;const moved=flightStep(s.x,s.z,flightVX,flightVZ,dt,targetPoint);let nx=moved.x,nz=moved.z;if(moved.arrived)flightVX=flightVZ=0;const edge=Math.max(1,Math.hypot(nx/(WORLD_BOUNDS.x-1),nz/(WORLD_BOUNDS.z-1)));s.x=nx/edge;s.z=nz/edge;if(len)avatar.rotation.y=Math.atan2(dx,dz);if(waterLanding&&Math.hypot(s.x-waterLanding.x,s.z-waterLanding.z)<3){flightTarget=.4;waterLanding=null;}const roof=mansionLife?.roofAt(s.x,s.z),floor=roof!=null&&flightY>=roof-.1?roof:inWater(s.x,s.z)?.4:onDock(s.x,s.z)?.58:groundHeight(s.x,s.z);const clearance=Math.hypot(s.x+1,s.z+5)<2.5?height(-1,-5)+9:floor;const destination=Math.max(flightTarget,clearance+.5);flightY+=Math.sign(destination-flightY)*Math.min(Math.abs(destination-flightY),dt*FLIGHT_SPEED.balloonClimb);s.flight=flightY;autosave+=dt;if(autosave>2){save();autosave=0;}if(flightTarget<=floor+.5&&flightY<=floor+.6){if(roof!=null&&floor===roof)mansionLife.landRoof(s.x,s.z);ride=0;s.flight=0;clearLanding();swimming=inWater(s.x,s.z);tell('🎈 ¡Aterrizaste!','🎈 Landed!');save();}}ax=s.x;az=s.z;ay=ride?flightY+.68:swimming?-.95:groundHeight(ax,az);}
   jungleLife.update(dt,worldActive,{x:ax,y:ay,z:az,indoors:!!houseSystem?.isInside()||inside,protected:!!(cruising||ride||boating||carDriving||airborne||mountId)});
   rainforestWorld.update(dt,worldActive,{x:ax,y:ay,z:az,indoors:!!houseSystem?.isInside()||inside,protected:!!(cruising||ride||boating||carDriving||airborne||mountId)});
   if(active){wildlifeWarningTime=Math.max(0,wildlifeWarningTime-dt);const encounter=wildlifeEncounter({x:ax,y:ay,z:az},[...(colonLife?.hazards()||[]),...jungleLife.hazards()],{protected:!!(ride||boating||carDriving||airborne||mountId||inside||houseSystem?.isInside())||rescueCooldown>0});if(encounter){if(encounter.hit){respawnAtHospital(encounter.kind);ax=s.x;az=s.z;ay=height(ax,az);landed=false;}else if(wildlifeWarningTime===0){const lesson=SAFETY_LESSONS[encounter.kind];tell('⚠️ '+lesson.icon+' '+lesson.es,'⚠️ '+lesson.icon+' '+lesson.en);wildlifeWarningTime=8;}}}
   if(active&&touchesLava(ax,ay,az,height)){respawnAtHospital();ax=s.x;az=s.z;ay=height(ax,az);landed=false;}
   if(active){impactLeft=Math.max(0,impactLeft-dt);if(landed){joy.effect(inWater(ax,az)?'splash':'land',{strength:Math.min(1,landingSpeed/15)});fallSoundPlayed=false;giantLanding();}}
   const impactStrength=motion()?impactPower*impactLeft/1.2:0,impactPhase=(1.2-impactLeft)*22;
   impactWave.visible=impactStrength>0;impactWave.scale.setScalar(1+(1.2-impactLeft)*(5+impactPower*5));impactWave.material.opacity=impactStrength*.75;
   tropical.setImpact?.(impactX,impactZ,impactStrength,impactPhase);
   // Keep saved giant size on foot; fit seats and the narrow lighthouse while using them.
   const sizeGoal=cruising||inside||boating||ride||mountId||carDriving||houseSystem?.isInside()?1:s.growth;
   if(active||dt===0)bodyScale=motion()&&dt>0?bodyScale+(sizeGoal-bodyScale)*(1-Math.exp(-dt*2.8)):sizeGoal;
   rollerblades.visible=skating&&s.travelMode==='skates';scooter.visible=skating&&s.travelMode==='scooter';jet.visible=boating&&rewardJet;rideBoat.visible=!jet.visible;if(jet.visible){jet.position.set(s.boat.x,.15+(waterMaterial?.userData.surfaceHeight?.(s.boat.x,s.boat.z)||0),s.boat.z);jet.rotation.y=s.boat.heading;}avatar.scale.setScalar(bodyScale);shadow.scale.setScalar(bodyScale);
   if(!giantDepth){giantDepth=true;avatar.traverse(o=>{if(o.isMesh&&!riderOverlay)o.material.depthTest=giantDepth;});}
   // The sea is a transparent shader drawn after opaque geometry. During rides,
   // render Angelique in the LAST transparent layer so water, sails, and basket
   // cannot hide her when the camera or vehicle moves.
   const riding=cruising||boating||!!ride||!!mountId||carDriving;
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
   avatar.traverse(o=>{if(!o.isMesh)return;const m=o.material,transparent=riding&&!closeView;if(m.transparent!==transparent){m.transparent=transparent;m.needsUpdate=true;}m.depthTest=closeView?true:riding?false:giantDepth;m.depthWrite=closeView||!riding;});
   if(swimming)ay-=.95*(bodyScale-1);
   growthRing.visible=eating>0&&motion();growthRing.position.set(ax,ay+.08,az);growthRing.scale.setScalar(bodyScale*(1+(2-eating)*.55));growthRing.material.opacity=eating*.4;
   if(crashRemaining>0){
    const pose=impactPose(crashRemaining);avatar.rotation.x=pose.lean;avatar.rotation.z=pose.roll;
    if(active&&!carDriving&&!mountId&&!ride&&!airborne){const n=groundTravelStep(s.x,s.z,crashX*dt*2,crashZ*dt*2,(x,z)=>solids.clear(x,z)&&!inWater(x,z));s.x=n.x;s.z=n.z;ax=s.x;az=s.z;ay=groundHeight(ax,az)+jumpY;}
   }else{avatar.rotation.x=0;avatar.rotation.z=0;}
   if(carDriving){avatar.quaternion.copy(cityLife.car.quaternion);if(crashRemaining>0){const recoil=impactPose(crashRemaining);avatar.rotateX(recoil.lean);avatar.rotateZ(recoil.roll);}}
   avatar.position.set(ax,ay,az);shadow.position.set(ax,houseSystem?.isInside()?0:height(ax,az)+.05,az);shadow.visible=!renderer.shadowMap.enabled&&!cruising&&!ride&&!swimming&&!inside&&!boating&&!airborne&&!mountId&&!carDriving&&!houseSystem?.isInside();legs.forEach((l,i)=>{l.visible=!swimming;l.rotation.x=scooter.visible?0:carDriving?-.58:mountId?-.65:len>0?Math.sin(step+i*Math.PI)*(skating?.14:.55):0;});rideBalloon.visible=!!ride;rideBalloon.position.set(s.x,flightY,s.z);rideBalloon.rotation.z=motion()?Math.sin(time*1.2)*.035:0;snack.visible=eating>0;snack.position.y=1.45+(motion()?Math.sin(eating*10)*.08:0);snack.scale.setScalar(.55+.45*Math.min(1,eating/2));arms.forEach((arm,i)=>{arm.rotation.x=crashRemaining>0?-1.0:eating>0&&i===1?-1.4:scooter.visible?-.65:carDriving?-.55:len>0&&!mountId?-Math.sin(step+i*Math.PI)*.30:0;});
   mansionLife?.pose(time);
   rainbow.visible=s.badges.includes('song');picnic.visible=s.badges.includes('picnic');wish.visible=s.badges.includes('beacon');wish.rotation.y=time*.2;pet.visible=false;if(pet.visible){const p=animalStep('pip',petX,petZ,petX+(s.x-1-petX)*Math.min(1,dt*3),petZ+(s.z+1-petZ)*Math.min(1,dt*3));petX=p.x;petZ=p.z;}pet.position.set(petX,inWater(petX,petZ)?-.05:height(petX,petZ)+Math.abs(Math.sin(step))*.1,petZ);pet.rotation.y=avatar.rotation.y;
   const phone=canvas.clientWidth<780;
   if(cruising){const p=cruiseCameraPose({x:ax,y:ay,z:az,heading:cruise.heading},phone,cruise.helm,bridgeDeckHeight,canalWater);desired.set(p.x,p.y,p.z);}
   else if(houseSystem?.isInside())desired.set(ax,ay+10,az+15);
   else if(inside&&stair>=.97)desired.set(7,ay+7,10);
   else if(inside)desired.set(-1,ay+4.2,4);
   else if(carDriving){const p=drivingCameraPose(ax,ay,az,s.city.car.heading,phone);desired.set(p.x,p.y,p.z);}
   else if(riding){
    // A lower, wider ride camera keeps the whole girl, boat or balloon in shot.
    // Follow fast enough that she cannot slide off a narrow phone screen.
    desired.set(ax,ay+(ride?14:mountId?15:carDriving?13:12),az+(phone?35:32));
   }else desired.set(ax,ay+(phone?9:8)+(bodyScale-1)*2,az+(phone?16:14)+(bodyScale-1)*2);
   if(onVolcano(s.x,s.z)&&!houseSystem?.isInside()){
    // Keep the camera out of the 46-unit mountain while hiking steep slopes.
    desired.y=Math.max(desired.y,height(desired.x,desired.z)+7);
    if(!riding){desired.z=az+(phone?41:37);desired.y=Math.max(ay+23,height(desired.x,desired.z)+9);}
   }
   // Briefly show the actual built property, then smoothly follow Angelique again.
   const showingBuild=!!buildReveal&&buildReveal.remaining>0;
   if(showingBuild){
    const bh=height(buildReveal.x,buildReveal.z);
    desired.set(buildReveal.x,bh+(phone?22:18),buildReveal.z+(phone?30:25));
    buildReveal.remaining=Math.max(0,buildReveal.remaining-(active?dt:0));
   }
   autoDriveBar.hidden=!carDriving||!panel.hidden;host.classList.toggle('is-driving',carDriving);const autoState=automaticDriver.state;autoDriveBar.classList.toggle('is-automatic',autoState.active);autoDriveStop.hidden=!autoState.active;autoDriveLabel.hidden=!autoState.active;autoDriveLabel.textContent=autoState.active?(autoState.status==='waiting'?say('🚦 Esperando','🚦 Waiting'): '📍 '+say(autoState.plan.destination.es,autoState.plan.destination.en)):'';
   hornButton.hidden=!carDriving||!panel.hidden;joy.carEngine?.(carSpeed,carDriving&&active);
   const usingClose=closeView&&!cruising&&!showingBuild&&!mansionLife?.workoutActive();
   cameraButton.hidden=cruising;
   if(!usingClose)camera.position.lerp(desired,houseSystem?.isInside()&&!showingBuild?1:dt===0?1:1-Math.exp(-dt*(showingBuild?5:riding?18:5)));
   if(riding&&!carDriving&&!cruising&&!showingBuild)camera.position.x=ax;
   target.set(ax,ay+(carDriving?1.8:houseSystem?.isInside()?1.0:riding?(ride?2.25:mountId?1.6:1.3):.7*bodyScale),az-(houseSystem?.isInside()?1.2:0));
   if(carDriving&&!usingClose&&!showingBuild){const p=drivingCameraPose(ax,ay,az,s.city.car.heading,phone);target.set(p.lookX,p.lookY,p.lookZ);}
   if(crashRemaining>0&&motion())camera.position.x+=impactPose(crashRemaining).shake;
   if(showingBuild)target.set(buildReveal.x,height(buildReveal.x,buildReveal.z)+2.2,buildReveal.z);if(impactStrength>0){camera.position.x+=Math.sin(impactPhase*1.7)*impactStrength*.18;camera.position.y+=Math.cos(impactPhase*1.3)*impactStrength*.14;}
   if(usingClose){
    if(riding)closeCamera.face(avatar.rotation.y);
    closeCamera.place(desired,target,ax,ay,az,bodyScale);
    // Match her eyes directly; camera smoothing would trail behind her head.
    camera.position.copy(desired);camera.near=.045;
   }else{if(cameraSnap)camera.position.copy(desired);camera.near=.2;}
   // Protect the entire sightline, not just the camera endpoint, on all terrain.
   if(!usingClose&&!houseSystem?.isInside()&&!inside&&!cruising){
    for(let i=1;i<=16;i++){
     const t=i/16,x=target.x+(camera.position.x-target.x)*t,z=target.z+(camera.position.z-target.z)*t;
     const floor=height(x,z)+.3+1.5*t;
     camera.position.y=Math.max(camera.position.y,target.y+(floor-target.y)/t);
    }
   }
   const nextFov=usingClose?72:60;if(camera.fov!==nextFov){camera.fov=nextFov;camera.updateProjectionMatrix();}cameraSnap=false;
   avatar.visible=!usingClose;
   near=null;let distance=2.6;for(const e of entityMeshes){const d=Math.hypot(s.x-e.p.x,s.z-e.p.z);if(d<distance){near=e.p;distance=d;}e.ring.material=d<2.6?pink:gold;e.ring.position.y=.14+(motion()?Math.sin(time*2)*.04:0);}
   if(inside||swimming||boating||ride||carDriving||airborne||mountId||houseSystem?.isInside())near=null;act.hidden=!near||!!ride;setText(act,near?near.id==='costaArriba'?say('⚓ Ir al muelle de Isla Grande','⚓ Walk to Isla Grande pier'):near.kind==='volcano'?(near.id==='volcanoSummit'?say('🌋 Ver cima','🌋 Summit view'):say('🥾 Comenzar subida','🥾 Start hike')):near.icon+' '+(es?near.es:near.en)+' · '+say('Jugar','Play'):'');jump.disabled=false;jump.hidden=false;const region=near?lessonRegions[near.id]:undefined;lesson.hidden=region===undefined||!!ride;setText(lesson,region===undefined?'':say('✦ Aventura con ','✦ Adventure with ')+({pip:'Pip',mila:'Mila',ollie:'Ollie',luna:'Luna',garden:say('el jardín','the garden'),beacon:say('el faro','the lighthouse')}[near.id]));ponytail.rotation.x=Math.sin(step)*Math.min(len,1)*.16;
   for(let i=collectibles.length-1;i>=0;i--){const c=collectibles[i];if(motion()&&c.item.kind==='glow'){c.m.position.y=height(c.item.x,c.item.z)+.6+Math.sin(time*2+i)*.15;}if(!ride&&!inside&&!boating&&!airborne&&Math.hypot(s.x-c.item.x,s.z-c.item.z)<.9){if(collectExplore(s,c.item.id)){earnCoins(state,c.item.id);scene.remove(c.m);collectibles.splice(i,1);spark(s.x,s.z);joy.note(countExplore(s,c.item.kind)%5,.18);tell(`+1 · ${c.item.es} · 🎒 ${workshop.inventory().available[c.item.kind]}`,`+1 · ${c.item.en} · 🎒 ${workshop.inventory().available[c.item.kind]}`,false);save();refresh();}}}
   let padIndex=pads.findIndex(p=>Math.hypot(s.x-p.x,s.z-p.z)<.75);if(padIndex!==lastPad&&padIndex>=0&&!ride&&!inside){joy.note([0,2,4][padIndex],.4);spark(pads[padIndex].x,pads[padIndex].z,8);music.push(padIndex);music=music.slice(-3);if(music.join(',')==='0,1,2')reward('song','¡Inventaste la canción del arcoíris!','You made the rainbow song!');}lastPad=padIndex;
   butterflies.forEach((b,i)=>{if(active)b.cooldown=Math.max(0,b.cooldown-dt);b.g.visible=b.cooldown<6.5;const {x:cx,z:cz}=islandPoint('islet',24+Math.sin(i*2.4)*(i<5?.25:2.6),-8+Math.cos(i*2.4)*(i<5?.2:1.9));const t=motion()?time:0;b.g.position.set(cx+Math.sin(t*.6+i)*1.4,height(cx,cz)+1.5+Math.cos(t*.8+i)*.35,cz+Math.cos(t*.6+i)*1.1);b.wings.forEach((w,j)=>w.rotation.y=motion()?Math.sin(time*9)*(j?1:-1)*.8:0);});
   const closest=butterflies.filter(b=>b.g.visible&&b.cooldown===0&&Math.hypot(s.x-b.g.position.x,s.z-b.g.position.z)<3).sort((a,b)=>a.g.position.distanceTo(avatar.position)-b.g.position.distanceTo(avatar.position))[0];const nearbyBubble=bubbles.some(b=>Math.hypot(s.x-b.m.position.x,s.z-b.m.position.z)<3);catchButton.hidden=(!closest&&!nearbyBubble)||!!ride||inside||boating||swimming||airborne;setText(catchButton,closest?say('🦋 Atrapar','🦋 Catch'):say('🫧 ¡Pop!','🫧 Pop'));catchRing.visible=!!closest&&!catchButton.hidden;if(active)netTime=Math.max(0,netTime-dt);net.visible=netTime>0;net.rotation.z=Math.sin(netTime*5)*.6;if(catchRing.visible){catchRing.position.copy(closest.g.position);catchRing.lookAt(camera.position);catchRing.scale.setScalar(.9);}
   if(active&&!inside&&!boating&&!airborne&&!ride&&Math.hypot(s.x+4,s.z-6)<.75&&jumpY===0&&velocity===0){velocity=10;joy.effect('tap');}
   for(let i=bubbles.length-1;i>=0;i--){const b=bubbles[i];if(active)b.life-=dt;if(active&&motion())b.m.position.y+=dt*.08;b.rim.lookAt(camera.position);if(b.life<=0){scene.remove(b.m);bubbles.splice(i,1);}else if(active&&!ride&&!inside&&!boating&&Math.hypot(s.x-b.m.position.x,s.z-b.m.position.z)<1&&Math.abs(ay+1-b.m.position.y)<1)popBubble(i);}
   for(let i=particles.length-1;active&&i>=0;i--){const p=particles[i];p.life-=dt;if(p.life<=0){scene.remove(p.m);particles.splice(i,1);continue;}p.vy-=5*dt;p.m.position.x+=p.vx*dt;p.m.position.y+=p.vy*dt;p.m.position.z+=p.vz*dt;p.m.scale.setScalar(Math.max(.01,p.life*(p.size||.08)));}
   goal=nextIslandAdventure(state);const destination=campaign.waypoint(),arrived=atGoal();guideBeacon.visible=!!destination;if(destination)guideBeacon.position.set(destination.x,height(destination.x,destination.z)+3.5+(motion()?Math.sin(time*2)*.2:0),destination.z);
   setText(goalTitle,goal?say(`TU SIGUIENTE PASO · ${Math.min(goal.done+1,48)}/48`,`YOUR NEXT STEP · ${Math.min(goal.done+1,48)}/48`):say('¡LO LOGRASTE!','YOU DID IT!'));
   const subjects=[say('Cuenta las conchas de la playa.','Count the beach shells.'),say('Prepara comida con Mila.','Get food ready with Mila.'),say('Descubre la naturaleza con Ollie.','Discover nature with Ollie.'),say('Haz música con Luna.','Make music with Luna.'),say('Cuida el jardín de la amistad.','Care for the friendship garden.'),say('Lleva tus ideas al faro.','Bring your ideas to the lighthouse.')];
   setText(goalText,goal?(arrived?say('¡Llegaste! Empecemos.','You’re here! Let’s begin.'):subjects[goal.region]):say('Todas las aventuras están completas. Puedes volver a jugar.','Every adventure is complete. You can play again.'));
   setText(goalButton,goal?(arrived?say('▶ Empezar aventura','▶ Start adventure'):say('➜ Llévame','➜ Take me there')):say('Explorar otra vez','Explore again'));goalButton.disabled=!!ride;
   const announcement=goal?goal.id+':'+arrived:'complete';if(goalAnnounced!==announcement&&!paused()&&!ride&&panel.hidden&&!document.querySelector('dialog[open]')&&guide(goalWords()))goalAnnounced=announcement;
   foodNear=!inside&&!swimming&&!boating&&!ride&&!airborne&&!mountId&&!houseSystem?.isInside()?foodTrees.find(t=>Math.hypot(t.x-s.x,t.z-s.z)<3.2&&(s.harvested[t.id]||0)<t.fruits.length):null;
   if(near?.kind==='balloon'){foodNear=null;}if(near?.kind==='islet')setText(act,({wilds:'🍌',coconutCoast:'🥥',sunset:'🌋'})[near.id]||'🫧');
   if(near?.id==='beacon')setText(act,say('🚪 Entrar al faro','🚪 Enter lighthouse'));
   pad.classList.toggle('flight-stick',!!ride||birdMount());pad.classList.toggle('steering',(!!ride||birdMount())&&len>.05);setText(knob,ride?'🎈':birdMount()?'🪽':'✥');setText(stickReadout,ride?'↕ '+Math.round(flightY)+' m':birdMount()?'↕ '+Math.round(birdAltitude)+' m':'');pad.style.setProperty('--heading',Math.atan2(dx,-dz)+'rad');
   descend.hidden=!ride&&!birdMount();for(const e of entityMeshes)if(e.p.id==='balloon')e.g.visible=!ride;
   if(cruising){act.hidden=jump.hidden=true;setText(knob,'⚓');setText(stickReadout,say('Gira el barco','Steer the ship'));setText(instructions,say('⚓ ← → Girar · ↑ Rápido · ↓ Frenar','⚓ ← → Steer · ↑ Faster · ↓ Brake'));}
   else if(ride){act.hidden=false;setText(act,say('💥 Reventar globo','💥 Pop balloon'));setText(jump,say('↑ Más alto','↑ Higher'));setText(instructions,say('Flechas para volar · Espacio ↑ · Q ↓ · E 💥','Arrows to fly · Space ↑ · Q ↓ · E 💥'));}
   else if(!ride&&!boating&&!carDriving&&!mountId&&!houseSystem?.isInside()&&mansionLife?.nearBalloon(s.x,s.z)){act.hidden=false;setText(act,say('🎈 Volar en mi globo','🎈 Fly my balloon'));}
   else if(carDriving){jump.hidden=true;act.hidden=false;setText(act,say('👣 Salir del auto','👣 Get out of car'));setText(jump,say('👣 Bajar','👣 Exit car'));setText(knob,'🚙');setText(stickReadout,automaticDriver.state.active?say('Mueve para tomar el control','Move to take over'):say('Mueve para conducir','Move to drive'));setText(instructions,automaticDriver.state.active?say('🚘 Conducción automática · 🕹️ Mueve para conducir','🚘 Automatic driving · 🕹️ Move to take over'):say('🚙 Arriba: avanzar · Abajo: retroceder · Lados: girar','🚙 Up: forward · Down: reverse · Left/right: steer'));}
   else if(mountId){jump.hidden=!birdMount();
    setText(act,birdMount()?say('🛬 Aterrizar','🛬 Land'):say('👣 Bajar del animal','👣 Hop off'));act.hidden=false;
    setText(jump,birdMount()?say('🪽 Subir','🪽 Climb'):say('👣 Bajar','👣 Dismount'));
    setText(instructions,birdMount()?say('Flechas: volar · Espacio: subir · Q: bajar · E: aterrizar','Arrows: fly · Space: climb · Q: descend · E: land'):say('Flechas para pasear · E para bajar','Arrows to ride · E to hop off'));}
   else if(houseSystem?.isInside()){const furniture=houseSystem.nearbyProp();setText(act,furniture?'👀 '+(es?furniture.esName:furniture.enName):say('🚪 Salir de casa','🚪 Leave house'));act.hidden=!furniture;setText(jump,houseSystem.current()?.mansion?say('🚪 Salir al jardín','🚪 Outside to yard'):say('🚪 Salir','🚪 Exit'));setText(instructions,say('Camina por la casa · Toca los muebles · Salir','Walk inside · Explore furniture · Exit'));}
   else if(boating){jump.hidden=true;setText(goalTitle,say('NAVEGA A TU AIRE','SAIL ANYWHERE'));setText(goalText,boatSpeed>20?say('Travesía rápida · Más lento al llegar a la costa.','Fast crossing · Slows near shore.'):say('Velocidad de puerto · Acelera en mar abierto.','Harbor speed · Accelerates offshore.'));setText(goalButton,say('⛵ Cómo navegar','⛵ Steering help'));act.hidden=false;setText(act,say('🏊 Salir del barco','🏊 Get out'));setText(jump,say('⤴ Saltar al agua','⤴ Jump out'));setText(instructions,say('Suelta para frenar · Travesías rápidas en mar abierto','Release to brake · Faster open-water crossings'));}
   else if(inside){setText(goalTitle,stair>=.97?say('EL MIRADOR','THE LOOKOUT'):say('SIGUE LOS ESCALONES','FOLLOW THE STEPS'));setText(goalText,stair>=.97?(s.lighthouseOn?say('💡 Luz encendida · Pulsa para apagar','💡 Light ON · Press to switch OFF'):say('🌙 Luz apagada · Pulsa para encender','🌙 Light OFF · Press to switch ON')):say('Muévete alrededor de la escalera dorada.','Walk around the golden staircase.'));setText(goalButton,stair>=.97?say('✨ Encender luz','✨ Light beacon'):say('👣 Ayuda','👣 Help'));act.hidden=stair<.97&&(stair>=.03||Math.hypot(s.x+1,s.z+4.1)>=.7);setText(act,stair>=.97?say('✨ Encender luz','✨ Light beacon'):say('🚪 Salir','🚪 Exit'));setText(jump,say('Saltar ⤴','Jump ⤴'));setText(instructions,say('Flechas / palanca para caminar · Espacio para saltar','Arrows / joystick to walk · Space to jump'));}
   else if(swimming){setText(goalTitle,danger?say('🦈 ¡A LA PLAYA!','🦈 BACK TO SHORE!'):freshwaterHabitat(s.x,s.z)?say('🐊 LAGO DE AGUA DULCE','🐊 FRESHWATER LAKE'):say('🏊 EXPLORA EL MAR','🏊 EXPLORE THE SEA'));setText(goalText,danger?say('Aléjate de la aleta.','Swim away from the fin.'):freshwaterHabitat(s.x,s.z)?say('Observa los cocodrilos desde la orilla.','Watch crocodiles from the shore.'):say('Mira las aletas. La playa está cerca.','Watch for fins. Shore is nearby.'));setText(goalButton,say('🏝 A la playa','🏝 Back to shore'));act.hidden=true;setText(jump,fastMode?say('🏊 Nadar normal','🏊 Swim normally'):say('🏊 Nadar rápido','🏊 Swim fast'));setText(instructions,say('Flechas para nadar · Rápido / Lento cambia la velocidad','Arrows to swim · Fast / Slow changes your speed'));}
   else {setText(jump,say('Saltar ⤴','Jump ⤴'));setText(instructions,say('👣 Toca para caminar · 🕹️ Flechas / WASD · ⤴ Espacio','👣 Tap to walk · 🕹️ Arrows / WASD · ⤴ Space'));}
   setText(title,locationLabel(s.x,s.z,state.lang,{cruising,interior:houseSystem?.isInside()?houseSystem.current()?.[es?'es':'en']:null,tower:inside}));
   const prize=!cruising&&!inside&&!boating&&!swimming&&!ride&&!mountId&&!carDriving&&!houseSystem?.isInside()&&roadRewards?.nearest(s.x,s.z);
   if(prize){act.hidden=false;setText(act,prize.icon+' '+say('Usar ','Use ')+prize[es?'es':'en']);}
   else if(!cruising&&!inside&&!boating&&!ride&&!mountId&&!carDriving&&!houseSystem?.isInside()&&colonLife?.prompt(s.x,s.z)){act.hidden=false;setText(act,colonLife.prompt(s.x,s.z));}
   else if(!cruising&&!inside&&!boating&&!ride&&!mountId&&!carDriving&&!houseSystem?.isInside()&&cruiseLife?.near(s.x,s.z)){act.hidden=false;setText(act,cruiseLife.prompt());}
   else if(!inside&&!boating&&!ride&&!mountId&&!carDriving&&!houseSystem?.isInside()&&cityLife?.nearCar(s.x,s.z)){act.hidden=false;setText(act,'🏎️ '+say('Conducir ','Drive ')+cityLife.carName(s.x,s.z));}
   else if(!inside&&!boating&&!ride&&!mountId&&!carDriving&&!houseSystem?.isInside()&&boatNear()){act.hidden=false;setText(act,say('⛵ Subir al barco','⛵ Board boat'));}
   else if(!inside&&!boating&&!ride&&!mountId&&!houseSystem?.isInside()&&houseSystem?.near(s.x,s.z)){const h=houseSystem.near(s.x,s.z);act.hidden=false;setText(act,h.icon+' '+say('Entrar a casa','Enter house')+(h.entryFloor===1?say(' · gimnasio',' · Upstairs gym'):''));}

   else if(!inside&&!boating&&!swimming&&!ride&&!mountId&&!carDriving&&!houseSystem?.isInside()&&workshop?.nearest(s.x,s.z)){
    const spot=workshop.nearest(s.x,s.z);act.hidden=false;
    setText(act,spot.icon+' '+(workshop.isBuilt(spot.id)?say('🎮 Jugar aquí','🎮 Play here'):say('🛠️ Construir','🛠️ Build')));
   }
   else if(!inside&&!boating&&!swimming&&!ride&&!mountId&&!carDriving&&!houseSystem?.isInside()&&cityLife?.activityPrompt(s.x,s.z)){
    act.hidden=false;setText(act,cityLife.activityPrompt(s.x,s.z));
   }
   else if(foodNear){act.hidden=false;setText(act,foodNear.kind==='coconut'?say('🥥 Recoger coco','🥥 Pick coconut'):foodNear.kind==='mango'?say('🥭 Recoger mango','🥭 Pick mango'):say('🍌 Recoger plátano','🍌 Pick banana'));}
   else if(!inside&&!boating&&!ride&&!mountId&&!carDriving&&!swimming&&estateWorld?.nearest(s.x,s.z)){act.hidden=false;setText(act,say('🏡 Ver mi propiedad','🏡 My property'));}
   if(!inside&&!ride&&!mountId&&!carDriving&&!houseSystem?.isInside()&&panamaLife?.prompt(s.x,s.z)){act.hidden=false;setText(act,panamaLife.prompt(s.x,s.z));}
   guideBeacon.visible=guideBeacon.visible&&!cruising&&!inside&&!boating&&!ride;
   houseSystem?.updateDoor(s.x,s.z,!!mountId||!!ride||boating||carDriving||inside||houseSystem?.isInside());
   const playful=cruising||mountId||carDriving||houseSystem?.isInside()?null:friendSystem?.nearest(ride?'fly':boating?'boat':swimming?'swim':'walk');
   friendMeet.hidden=!playful||!!ride||inside||airborne||!!mountId||houseSystem?.isInside()||!panel.hidden||!host.classList.contains('explore-ready');
   const rideable=playful&&!['kai','pip','dori'].includes(playful.id)&&!inside&&!boating&&!ride&&!carDriving&&!houseSystem?.isInside()&&!airborne&&panel.hidden;
   rideQuick.hidden=!(rideable||mountId)||(!mountId&&!act.hidden&&/Ride|Montar|Board|Subir/.test(act.dataset.words||''));
   if(mountId)setText(rideQuick,say('👣 Bajar','👣 Dismount'));
   else if(rideable)setText(rideQuick,'🐾 '+say('Montar ','Ride ')+playful.name);
   if(playful){setText(friendMeet,playful.icon+' '+playful.name+' · '+(['pip','dori'].includes(playful.id)?say('Observar','Observe'):playful.id==='kai'?say('Saludar','Say hi'):say('Montar','Ride')));friendMeet.setAttribute('aria-label',say('Jugar con ','Play with ')+playful.name);}
   goalCard.hidden=boating||carDriving||inside||!!ride||airborne||near?.kind==='islet'||netTime>0;quest.hidden=true;
   adventureMap.update(false,avatar.rotation.y);
   friendSystem?.update(dt,worldActive,{mode:houseSystem?.isInside()?'house':mountId?(inWater(s.x,s.z)?'mount-water':'mount'):ride?'fly':boating?'boat':swimming?'swim':'walk',inside:inside||houseSystem?.isInside(),mount:mountId,heading:avatar.rotation.y,roomPosition:houseSystem?.position(),mountAltitude:birdAltitude,moving:len>.1,cruise});
   // Hiking a physically climbable spiral earns a one-time summit keepsake.
   const onMountain=onVolcano(s.x,s.z)&&!houseSystem?.isInside()&&!inside;
   volcanoStatus.hidden=!onMountain;
   if(onMountain){
    let nearest=volcanoPath[0],distance=Infinity;
    for(const point of volcanoPath){
     const d=Math.hypot(s.x-point.x,s.z-point.z);
     if(d<distance){distance=d;nearest=point;}
    }
    volcanoStatus.textContent=distance<4.7
     ?'🌋 Volcán Barú · '+(es?'Sendero':'Hike')+' '+Math.round(nearest.progress*100)+'% 🥾'
     :'🌋 Volcán Barú · '+(es?'Busca el sendero 🥾':'Find the trail 🥾');
    const walking=active&&!ride&&!boating&&!carDriving&&!mountId&&!airborne;
    if(walking&&Math.hypot(s.x-summitGoal.x,s.z-summitGoal.z)<3.2&&badgeExplore(s,'volcano-summit')){
     save();refresh();joy.effect('finish');
     tell('🌋 ¡Llegaste a la cima del Volcán Barú! ¡Qué vista tan increíble!',
       '🌋 You climbed Volcán Barú! What an incredible view!');
    }
   }
   mansionLife?.update(dt,worldActive,houseSystem?.position(),houseSystem?.isInside());
   tropical.forest.focus(houseSystem?.isInside()?NaN:s.x,s.z,camera.position);
   colonLife.update(dt,worldActive,{inside:!!houseSystem?.isInside(),cruising});
   workshop?.update(dt,time);estateWorld?.update(dt);builderSystem?.update(dt,time,active);builderSystem?.projectLabels(camera);
   cityLife?.update(dt,worldActive,{x:s.x,z:s.z,driving:carDriving,flying:!!ride||birdAltitude>2,indoors:inside||houseSystem?.isInside()});
   cityGuideButton.hidden=!cityLife?.isHere(s.x,s.z)||inside||houseSystem?.isInside();
   abundance.update(!!houseSystem?.isInside()||inside);life.update(dt,worldActive,motion(),{x:ax,y:ay,z:az,indoors:!!houseSystem?.isInside()||inside,protected:!!(cruising||ride||boating||carDriving||airborne||mountId)});
  const clockNow=worldClock(s.dayTime);setText(clockTime,`${clockNow.icon} ${clockNow.time}`);clockTime.dateTime=clockNow.isoTime;clockTime.setAttribute('aria-label',say('Hora del mundo: ','World time: ')+clockNow.time);realms.update(dt,active,ride?'fly':swimming?'swim':boating?'boat':'walk',ay);journey.update(dt,active,ride?'fly':swimming?'swim':boating?'boat':'walk',ay);story.update(dt,time);realms.setTourView(cruising);journey.setTourView(cruising);if(host.classList.contains("story-nearby")){lesson.hidden=true;guideBeacon.visible=false;}
   // The previous small chapter lessons are still playable, but they now
   // contribute to a single tangible project in each Panama location.
   const regionId=regionForPosition(s.x,s.z),mission=missionStatus(s,state,regionId);
   const newRestorations=restoreRegions(s,state);
   if(newRestorations.length){
    for(const id of newRestorations)earnCoins(state,'region-help-'+id);
    regionWorld?.refresh();save();refresh();joy.effect('finish');
    const local=newRestorations.find(id=>id===regionId);
    if(local){
     const win=missionStatus(s,state,local);
     tell('🎉 '+win.resultEs+' +25 🪙','🎉 '+win.resultEn+' +25 🪙');
    }
   }
   const moving=!!ride||!!boating||!!inside||!!carDriving||!!mountId||!!swimming||!!houseSystem?.isInside();
   regionFocusMode=!moving;
   regionStatus.hidden=inWater(s.x,s.z)||!!inside||!!houseSystem?.isInside();
   regionStatus.textContent=mission.icon+' '+(mission.restored?say('¡Región restaurada!','Region restored!'):say('Ayudar la región','Help this region'))+' · '+mission.done+'/4';
   if(lastMissionRegion!==regionId){
    lastMissionRegion=regionId;
    paintButton(regionButton,'🌍 '+(mission.restored?'✓':mission.done+'/4'));
   }else if(regionButton.dataset.projectProgress!==(mission.done+':'+mission.restored)){
    paintButton(regionButton,'🌍 '+(mission.restored?'✓':mission.done+'/4'));
   }
   regionButton.dataset.projectProgress=mission.done+':'+mission.restored;
   if(regionFocusMode){
    const remaining=mission.tasks.find(x=>!x.complete);
    const copy=mission.restored?(es?mission.resultEs:mission.resultEn):(remaining?(es?remaining.es:remaining.en):say('¡Todo listo! Tu región está floreciendo.','All set! Your region is thriving.'));
    setText(goalTitle,mission.icon+' '+say('TU MISIÓN EN ESTA REGIÓN','YOUR REGIONAL MISSION')+' · '+mission.done+'/4');
    setText(goalText,copy);
    setText(goalButton,mission.restored?say('🌍 Ver regiones','🌍 View regions'):say('🌱 Ver mi misión','🌱 See my mission'));
    goalButton.disabled=false;
   }
   act.classList.toggle('has-target',!act.hidden&&panel.hidden);
   panamaLife?.update(dt,worldActive,{x:s.x,z:s.z,indoors:!!houseSystem?.isInside()||inside,protected:!!(cruising||ride||boating||carDriving||airborne||mountId)});
   joy.soundscape?.({x:s.x,z:s.z,indoors:!!houseSystem?.isInside()||inside,driving:carDriving,boating:boating||cruising,flying:!!ride,night:worldClock(s.dayTime).night,rain:scene.userData.regionalWeather?.rain||0,active:worldActive});
   festivalParts.forEach((p,i)=>p.visible=i<s.campaign.chapter);festivalTable.visible=s.campaign.chapter===9;
   campaign.update();host.classList.toggle('inside-mansion',!!houseSystem?.current()?.mansion);houseSystem?.presentation(usingClose);houseSystem?.hideOutside();
   for(const [button,words] of buttonUpdates)paintButton(button,words);buttonUpdates.clear();
  }
  return {update,playerPosition:()=>({x:s.x,y:avatar.position.y,z:s.z}),dispose(){rainforestWorld.dispose();jungleLife.dispose();abundance.dispose();roadRewards?.dispose();scene.remove(jet);regionalScenery?.dispose();detailedDistricts?.dispose();hospital.dispose();scene.remove(festival);panamaLife?.dispose();panamaLife=null;builderSystem?.dispose();builderSystem=null;estateWorld?.dispose();estateWorld=null;regionWorld?.dispose();regionWorld=null;workshop?.dispose();workshop=null;volcanoStatus.remove();colonLife?.dispose();colonLife=null;cruiseLife?.dispose();cruiseLife=null;cityLife?.dispose();cityLife=null;mansionLife?.dispose();mansionLife=null;houseSystem?.dispose();houseSystem=null;friendSystem?.dispose();friendSystem=null;wildLife=null;realms.dispose();journey.dispose();life.dispose();story.dispose();canvas.removeEventListener('pointerdown',lookDown);canvas.removeEventListener('pointermove',lookMove);canvas.removeEventListener('pointerup',lookUp);canvas.removeEventListener('pointercancel',lookUp);canvas.removeEventListener('lostpointercapture',lookUp);control=null;}};
 }
 function dispose(){if(disposed)return;automaticDriver.stop();autoDriveBar.remove();joy.carEngine?.(0,false);hornButton.remove();cameraButton.remove();host.classList.remove('close-camera-view','is-driving');campaign.dispose();adventureMap.dispose();host.classList.remove('inside-lighthouse','is-swimming','shark-nearby');joy.boat?.(false);disposed=true;joystickControl.dispose();generation++;clearTimeout(startTimer);clearTimeout(recoveryTimer);canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',contextRestored);save();engine?.dispose();engine=null;document.removeEventListener('keydown',keydown);document.removeEventListener('keyup',keyup);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',blur);window.removeEventListener('pointerup',releaseDirection);window.removeEventListener('pointercancel',releaseDirection);window.removeEventListener('pagehide',blur);blur();}
 return {dispose};
}


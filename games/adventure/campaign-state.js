import {movePoint,DESTINATIONS,CANAL_TERMINAL} from './geography.js';
import {ISLA_LIGHTHOUSE as LH} from './costa-arriba-layout.js';
export const FESTIVAL_CHAPTERS=[
 {id:'welcome',project:'home',speaker:'Pip',icon:'🐢',place:'Gorgona',home:{x:3,z:9},
  en:'A beach to come home to',es:'Una playa para volver',
  introEn:'Angelique arrives with an invitation to the Panama Friendship Festival. Last night’s storm scattered the preparations across the islands. Pip has stayed behind to welcome everyone, but the beach is not ready. Help him build the first gathering place.',
  introEs:'Angelique llega con una invitación al Festival de la Amistad de Panamá. La tormenta de anoche dispersó los preparativos por las islas. Pip espera a los invitados, pero la playa no está lista. Ayúdalo a construir el primer lugar de reunión.',
  endEn:'“Now our friends have somewhere to meet!” Pip gives Angelique a letter for Taboga: the festival still needs flowers.',
  endEs:'«¡Ahora nuestros amigos tienen dónde reunirse!» Pip le da a Angelique una carta para Taboga: al festival todavía le faltan flores.'},
 {id:'flowers',project:'islet',speaker:'Pip',icon:'🦋',place:'Taboga',home:{x:60,z:-57},
  en:'An invitation for the butterflies',es:'Una invitación para las mariposas',
  introEn:'Taboga’s garden is quiet after the storm. Pip’s letter asks Angelique to bring the butterflies back and grow a garden worth celebrating. The flowers will become the festival’s decorations.',
  introEs:'El jardín de Taboga está silencioso después de la tormenta. La carta de Pip pide que vuelvan las mariposas y que crezca un jardín digno de celebrar. Las flores decorarán el festival.',
  endEn:'The butterflies return. Among the flowers is a message from Mila: the forest friends in Bocas are hungry and their meeting place needs rebuilding.',
  endEs:'Las mariposas regresan. Entre las flores hay un mensaje de Mila: los amigos de Bocas tienen hambre y necesitan reconstruir su lugar de reunión.'},
 {id:'picnic',project:'wilds',speaker:'Mila',icon:'🍌',place:'Bocas',home:{x:16,z:-112},
  en:'Mila’s forest feast',es:'El banquete del bosque de Mila',
  introEn:'Mila wants every guest to have a place at the festival table. Gather bananas, follow her picnic recipe, and reopen the forest treehouse. When the bell rings, the forest friends will know they are invited.',
  introEs:'Mila quiere que todos los invitados tengan un lugar en la mesa. Recoge plátanos, sigue su receta y reabre la casa del bosque. Cuando suene la campana, los animales sabrán que están invitados.',
  endEn:'The treehouse bell rings through the forest. A monkey arrives with a rain-soaked invitation from Colón: its troop cannot reach the celebration yet.',
  endEs:'La campana suena por el bosque. Un mono llega con una invitación mojada de Colón: su grupo todavía no puede llegar a la celebración.'},
 {id:'monkeys',project:'colon',speaker:'The monkey troop',speakerEs:'Los monos',icon:'🐒',place:'Colón',home:{x:122,z:-39},
  en:'The monkeys’ missing crossing',es:'El cruce perdido de los monos',
  introEn:'Colón’s monkeys have plenty of energy, but the crossing and their treetop home need care. Repair the bridge, restore their rain garden, build the treehouse, and open the lookout. Then learn their jumping greeting to invite the whole troop.',
  introEs:'Los monos de Colón tienen mucha energía, pero necesitan reparar el cruce y su hogar. Arregla el puente, restaura el jardín, construye la casa y abre el mirador. Después aprende su saludo de saltos para invitar al grupo.',
  endEn:'The monkeys answer Angelique’s greeting with a chorus of jumps. They are coming! Contadora must now prepare a resting place for the arriving guests.',
  endEs:'Los monos responden al saludo con muchos saltos. ¡Vendrán! Ahora Contadora necesita preparar un lugar de descanso para los invitados.'},
 {id:'shelter',project:'coconutCoast',speaker:'Mila',icon:'🥥',place:'Contadora',home:{x:105,z:10},
  en:'Shade for every guest',es:'Sombra para cada invitado',
  introEn:'The travelers have a long journey ahead. Mila asks Angelique to solve the coconut-sharing challenge and build a beach shelter. A good celebration begins by making everyone feel welcome.',
  introEs:'A los viajeros les espera un viaje largo. Mila pide resolver el reto de compartir cocos y construir un refugio. Una buena celebración empieza haciendo que todos se sientan bienvenidos.',
  endEn:'The hammocks are ready. Ollie sends word from Volcán Barú: the mountain guests need a safe trail and a warm camp before they can leave.',
  endEs:'Las hamacas están listas. Ollie avisa desde el Volcán Barú: los invitados de la montaña necesitan una ruta segura y un campamento cálido.'},
 {id:'mountain',project:'sunset',speaker:'Ollie',icon:'🌋',place:'Volcán Barú',home:{x:-129,z:62},
  en:'A light on the mountain',es:'Una luz en la montaña',
  introEn:'Ollie will guide the mountain friends to the festival, but first the trail must be safe. Find the fireflies, reach the summit, and build a camp where tired explorers can rest.',
  introEs:'Ollie guiará a los amigos de la montaña hasta el festival, pero primero hay que asegurar la ruta. Encuentra luciérnagas, llega a la cima y construye un campamento para descansar.',
  endEn:'The campfire is lit. From the summit, Angelique hears Luna’s unfinished melody drifting across the sea. The festival needs its song.',
  endEs:'La fogata está encendida. Desde la cima, Angelique escucha la melodía incompleta de Luna sobre el mar. Al festival le falta su canción.'},
 {id:'music',project:'crystalCove',speaker:'Luna',icon:'🎶',place:'Guna Yala',home:{x:10,z:100},
  en:'Luna’s song for the sea',es:'La canción de Luna para el mar',
  introEn:'Luna cannot celebrate while the reef is struggling. Help its sea life, build the coral nursery, and finish her melody. The islands will share one song when the festival opens.',
  introEs:'Luna no puede celebrar mientras el arrecife necesita ayuda. Cuida la vida marina, construye el vivero y termina su melodía. Todas las islas compartirán una canción.',
  endEn:'The nursery fills with life and Luna’s song is complete. The last preparations are in Panama City: food must reach the families and a ship must be ready.',
  endEs:'El vivero cobra vida y la canción está terminada. Los últimos preparativos están en la ciudad: hay que entregar comida y preparar un barco.'},
 {id:'city',project:'pizzaCity',speaker:'Mila',icon:'🍕',place:'Casco Viejo',home:{x:-84,z:-55},
  en:'The city’s invitation',es:'La invitación de la ciudad',
  introEn:'The neighborhood is busy preparing for the festival. Help a family with a pizza delivery and open a community pizza stand. The captain is waiting at the Panama Canal for the final voyage.',
  introEs:'El barrio está preparando el festival. Ayuda a una familia con una entrega de pizza y abre un puesto comunitario. El capitán espera en el Canal de Panamá para el viaje final.',
  endEn:'The city is ready. Only the lighthouse remains dark. Its beam will tell every island that the Friendship Festival can begin.',
  endEs:'La ciudad está lista. Solo falta encender el faro. Su luz anunciará a todas las islas que el Festival de la Amistad puede empezar.'},
 {id:'festival',speaker:'Pip',icon:'🏮',place:'Gorgona',home:{x:3,z:9},
  en:'Bring the islands together',es:'Reúne a todas las islas',
  introEn:'Every island has contributed something real: a welcome, flowers, food, shelter, a safe path, and a song. Light Isla Grande’s lighthouse, take the captain’s full-map cruise, and return to Pip to open the festival.',
  introEs:'Cada isla ha aportado algo: una bienvenida, flores, comida, refugio, una ruta y una canción. Enciende el faro de Isla Grande, completa el crucero por todo el mapa y vuelve con Pip para abrir el festival.',
  endEn:'The lanterns glow across Gorgona. The friends gather around the places Angelique helped build. The festival belongs to every island—and there will always be more adventures to share.',
  endEs:'Las linternas iluminan Gorgona. Los amigos se reúnen en los lugares que Angelique ayudó a construir. El festival pertenece a todas las islas y siempre habrá más aventuras para compartir.'}
].map(ch=>({...ch,home:movePoint(ch.project||'home',ch.home.x,ch.home.z)}));
export const FESTIVAL_WORK={
 sandcastle:{icons:['🧱','🐚','🚩'],order:[0,0,1,2],en:['Shape the base','Raise the walls','Place the shells','Raise the welcome flag'],es:['Forma la base','Levanta los muros','Coloca las conchas','Izar la bandera']},
 butterflyGarden:{icons:['🌱','💧','🦋'],order:[0,1,0,2],en:['Plant the first flowers','Water the soil','Plant the border','Release the butterflies'],es:['Planta las flores','Riega la tierra','Planta el borde','Libera las mariposas']},
 treehouse:{icons:['🪵','🪜','🔔'],order:[0,1,0,2],en:['Fit the floorboards','Secure the ladder','Prepare the meeting table','Ring the invitation bell'],es:['Coloca el suelo','Asegura la escalera','Prepara la mesa','Toca la campana']},
 beachCabana:{icons:['🪵','⛱️','🪑'],order:[0,1,2,2],en:['Secure the frame','Stretch the shade','Set out the first seat','Prepare the hammock'],es:['Asegura la estructura','Extiende la sombra','Coloca el asiento','Prepara la hamaca']},
 volcanoCamp:{icons:['🪵','🪨','🔥'],order:[1,0,0,2],en:['Make a safe stone ring','Gather the first logs','Arrange the campfire','Light the hikers’ fire'],es:['Haz un círculo de piedras','Reúne leña','Prepara la fogata','Enciende el fuego']},
 coralNursery:{icons:['🪸','💧','🐠'],order:[0,1,0,2],en:['Place the first coral','Clean the water channel','Settle the young coral','Welcome the fish'],es:['Coloca el coral','Limpia el canal','Cuida el coral joven','Recibe a los peces']},
 pizzaStand:{icons:['🫓','🍅','🧀','🔥'],order:[0,1,2,3],en:['Shape the dough','Spread the tomato','Add the cheese','Bake the festival pizza'],es:['Prepara la masa','Añade tomate','Añade queso','Hornea la pizza']}
};
export function normalizeCampaign(raw){
 const chapter=Number.isFinite(raw?.chapter)?Math.max(0,Math.min(FESTIVAL_CHAPTERS.length,Math.floor(raw.chapter))):0;
 return {introSeen:raw?.introSeen===true,started:raw?.started===true||chapter>0,chapter,accepted:raw?.accepted===true,
  work:Object.fromEntries(Object.keys(FESTIVAL_WORK).map(id=>[id,Number.isInteger(raw?.work?.[id])?Math.max(0,Math.min(4,raw.work[id])):0]))};
}
export function campaignSnapshot(state,missionStatus){
 const world=state.world,c=world.campaign,chapter=FESTIVAL_CHAPTERS[c.chapter];
 if(!chapter)return {finished:true,index:FESTIVAL_CHAPTERS.length,total:FESTIVAL_CHAPTERS.length,tasks:[],done:0,ready:true,chapter:null};
 let tasks=chapter.project?missionStatus(world,state,chapter.project).tasks.map(t=>({...t})): [
  {id:'beacon',icon:'💡',es:'Enciende el faro de Isla Grande',en:'Light Isla Grande’s lighthouse',check:{kind:'festivalBeacon'},go:{x:LH.x,z:LH.z+2.5},current:world.badges.includes('beacon')?1:0,required:1,complete:world.badges.includes('beacon')},
  {id:'cruise',icon:'🚢',es:'Completa el crucero por todo el mapa · 10 monedas',en:'Complete the full-map cruise · 10 coins',check:{kind:'festivalCruise'},go:{...CANAL_TERMINAL},current:Math.min(1,world.city.cruise.completed),required:1,complete:world.city.cruise.completed>0}
 ];
 if(chapter.id==='monkeys')tasks.push({id:'greeting',icon:'🐒',es:'Aprende el saludo de saltos de los monos',en:'Learn the monkeys’ jumping greeting',check:{kind:'festivalMonkeys'},go:{x:DESTINATIONS.colon.at[0],z:DESTINATIONS.colon.at[1]},current:Math.min(1,world.colon.monkeyGames),required:1,complete:world.colon.monkeyGames>0});
 return {finished:false,index:c.chapter,total:FESTIVAL_CHAPTERS.length,chapter,tasks,done:tasks.filter(t=>t.complete).length,ready:tasks.every(t=>t.complete),task:tasks.find(t=>!t.complete)||null};
}
export function acceptCampaign(world){const c=world.campaign;if(c.chapter>=FESTIVAL_CHAPTERS.length)return false;c.started=true;c.accepted=true;c.introSeen=true;return true;}
export function turnInCampaign(state,snapshot){
 const c=state.world.campaign;if(!c.started||!c.accepted||snapshot.finished||!snapshot.ready||snapshot.index!==c.chapter)return false;
 if(Math.hypot(state.world.x-snapshot.chapter.home.x,state.world.z-snapshot.chapter.home.z)>5.5)return false;
 c.chapter++;c.accepted=false;return true;
}
export function stepFestivalWork(campaign,id,choice){
 const activity=FESTIVAL_WORK[id];if(!activity)return 'ignore';
 const stage=campaign.work[id]||0;if(stage>=activity.order.length)return 'done';
 if(choice!==activity.order[stage])return 'retry';
 campaign.work[id]=stage+1;return stage+1===activity.order.length?'complete':'next';
}


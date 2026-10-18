import {islandStories} from './world-story.js?v=genie2';
import {addFood,earnCoins} from './explore-state.js?v=genie2';

// The six existing physical puzzles now fulfill six specific visitors' wishes.
// Keep their stable story IDs so earlier progress still counts.
export const WISHES=[
 {id:'shells',name:'Pip',icon:'🐢',en:'I wish I could find my way home',es:'Deseo encontrar el camino a casa',taskEn:'Light a safe path: step on 1, 2, then 3',taskEs:'Ilumina el camino: pisa 1, 2 y 3',resultEn:'Pip can find his way home. The Haven Light is restored.',resultEs:'Pip puede volver a casa. La Luz del Santuario volvió a brillar.'},
 {id:'picnic',name:'Mila',icon:'🦜',en:'I wish no visitor would go hungry',es:'Deseo que ningún visitante pase hambre',taskEn:'Prepare a feast: banana, bowl, banana, honey',taskEs:'Prepara la comida: plátano, cuenco, plátano, miel',resultEn:'Mila has a feast to share. The Emerald Light is restored.',resultEs:'Mila tiene comida para compartir. La Luz Esmeralda volvió a brillar.'},
 {id:'seed',name:'Ollie',icon:'🪶',en:'I wish life would return to my lonely realm',es:'Deseo que la vida vuelva a mi reino',taskEn:'Grow a star garden: seed, water, sunlight',taskEs:'Crea un jardín estelar: semilla, agua, sol',resultEn:'Ollie’s star garden blooms. The Nova Light is restored.',resultEs:'El jardín estelar de Ollie florece. La Luz Nova volvió a brillar.'},
 {id:'song',name:'Luna',icon:'🦀',en:'I wish the stars could sing again',es:'Deseo que las estrellas vuelvan a cantar',taskEn:'Follow the melody: pink, blue, yellow, pink',taskEs:'Sigue la melodía: rosa, azul, amarillo, rosa',resultEn:'Luna’s stars have their song back. The Neptune Light is restored.',resultEs:'Las estrellas de Luna vuelven a cantar. La Luz de Neptuno volvió a brillar.'},
 {id:'care',name:'Sol',icon:'🦋',en:'I wish my butterflies had a home',es:'Deseo un hogar para mis mariposas',taskEn:'Care for their flowers: water, then sunlight',taskEs:'Cuida las flores: agua y después sol',resultEn:'Sol’s butterflies have a thriving home. The Venus Light is restored.',resultEs:'Las mariposas de Sol tienen un hogar. La Luz de Venus volvió a brillar.'},
 {id:'light',name:'Nova',icon:'✨',en:'I wish our scattered lights would come home',es:'Deseo que nuestras luces vuelvan a casa',taskEn:'Gather the light: step on 3, 1, 2, then 3',taskEs:'Reúne la luz: pisa 3, 1, 2 y 3',resultEn:'Nova’s lost light has returned. The Saturn Light is restored.',resultEs:'La luz perdida de Nova ha vuelto. La Luz de Saturno volvió a brillar.'}
];
export const wishStory=id=>islandStories.find(q=>q.id===id);
export function wishProgress(state,id){const q=wishStory(id);return Math.min(q?.order.length||0,state.world.story[id]||0);}
export function grantWish(state,id){
 const q=wishStory(id),w=state.world,granted=w.wishes.granted;
 if(!q||granted.includes(id)||wishProgress(state,id)<q.order.length||w.flight>0||Math.hypot(w.x-q.x,w.z-q.z)>4.5)return false;
 granted.push(id);earnCoins(state,'wish-'+id);w.estate.charms=Math.min(9999,w.estate.charms+1);addFood(w,'banana',2);addFood(w,'coconut',2);return true;
}
export function createWishes({T,scene,host,panel,state,make,mat,geometry,ball,height,save,joy,spark,refresh,travel,closeHelpers,grounded}){
 const es=state.lang==='es',say=(a,b)=>es?a:b,w=state.world;
 const group=new T.Group();group.name='Six restored cosmic wish lights';scene.add(group);
 const lights=WISHES.map((wish,i)=>{const q=wishStory(wish.id),g=new T.Group();group.add(g);g.position.set(q.x,height(q.x,q.z)+3.7,q.z-2);
  const color=['#ffe49e','#82ead2','#bdedb3','#c6bcff','#f7afd2','#96e3fa'][i],material=mat(color,{emissive:color,emissiveIntensity:1.1,roughness:.3});
  make(ball,material,0,0,0,.45,.45,.45,g);const ring=make(geometry(new T.TorusGeometry(.78,.045,6,32)),material,0,0,0,1,1,1,g);
  return {id:wish.id,g,ring};});
 const hud=document.createElement('button');hud.type='button';hud.className='wish-hud';const heading=document.createElement('strong'),hint=document.createElement('span');hud.append(heading,hint);host.append(hud);
 let selected=w.wishes.granted.length<6?WISHES.find(q=>!w.wishes.granted.includes(q.id)).id:WISHES[0].id,last='',clock=.25;
 const button=(words,cls,fn)=>{const b=document.createElement('button');b.type='button';b.className=cls;b.textContent=words;b.onclick=()=>{joy.gesture();fn();};return b;};
 const element=(tag,cls,words)=>{const n=document.createElement(tag);n.className=cls;n.textContent=words;return n;};
 function open(id=selected){selected=id;closeHelpers();panel.classList.remove('estate-panel');panel.classList.add('wish-panel');panel.replaceChildren();panel.hidden=false;
  const close=button('×','panel-close',()=>{panel.hidden=true;panel.classList.remove('wish-panel');});close.setAttribute('aria-label',say('Cerrar deseos','Close wishes'));panel.append(close);
  const count=w.wishes.granted.length,all=count===6;panel.append(element('div','wish-eyebrow',say('TU PROPÓSITO COMO GENIO','YOUR PURPOSE AS A GENIE')),element('h2','',all?say('El cosmos vuelve a brillar','The cosmos shines again'):say('Restaura El Cosmos','Restore The Cosmos')),element('p','wish-summary',all?say('Ayudaste a los seis visitantes. Ahora puedes seguir explorando y construir tu reino.','You helped all six visitors. Keep exploring and build your cosmic realm.'):say('Ayuda a seis visitantes. Cada deseo enciende una luz del cosmos.','Six visitors need your help. Grant their wishes to bring the lost lights home.')));
  panel.append(element('p','wish-total',`✨ ${count}/6 `+say('deseos concedidos','wishes granted')));
  const nav=element('div','wish-visitors','');for(const wish of WISHES){const b=button((w.wishes.granted.includes(wish.id)?'✓ ':wish.icon+' ')+wish.name,'wish-visitor',()=>open(wish.id));b.setAttribute('aria-pressed',String(wish.id===id));nav.append(b);}panel.append(nav);
  const wish=WISHES.find(q=>q.id===id),q=wishStory(id),done=w.wishes.granted.includes(id),progress=wishProgress(state,id),ready=progress===q.order.length;
  const card=element('article','wish-card','');card.append(element('h3','',wish.icon+' '+wish.name),element('p','wish-quote','“'+(es?wish.es:wish.en)+'”'));
  if(done)card.append(element('p','wish-result','✓ '+(es?wish.resultEs:wish.resultEn)));
  else{card.append(element('p','wish-task',es?wish.taskEs:wish.taskEn),element('div','wish-sequence',q.order.map((tile,i)=>(i<progress?'✓ ':'')+q.icons[tile]).join(' → ')),element('p','wish-meter',`${progress}/${q.order.length} `+say('pasos completados','steps complete')));
   const near=grounded()&&Math.hypot(w.x-q.x,w.z-q.z)<=4.5;
   if(ready&&near)card.append(button(say('✨ Conceder deseo','✨ Grant wish'),'wish-primary',()=>{if(!grounded()||!grantWish(state,id))return;save();refresh();spark(q.x,q.z,30);joy.effect('finish');last='';selected=WISHES.find(q=>!w.wishes.granted.includes(q.id))?.id||id;open(id);}));
   else card.append(button(ready?say('🧞 Volver con '+wish.name,'🧞 Return to '+wish.name):say('🧞 Ayudar a '+wish.name,'🧞 Help '+wish.name),'wish-primary',()=>{panel.hidden=true;panel.classList.remove('wish-panel');travel({x:q.x-1.8,z:q.z});}));
   card.append(element('p','wish-instruction',ready?say('Aterriza junto al visitante y toca Conceder deseo.','Land beside the visitor, then tap Grant wish.'):say('Aterriza. Toca las fichas del suelo en ese orden o camina sobre ellas. Después vuelve a Deseos.','Land. Tap the ground tiles in that order, or walk over them. Then open Wishes again.')));
  }
  panel.append(card,element('p','wish-reward',say('Cada deseo: 25 monedas · 1 amuleto · 2 plátanos · 2 cocos','Each wish: 25 coins · 1 charm · 2 bananas · 2 coconuts')));close.focus({preventScroll:true});
 }
 hud.onclick=()=>{joy.gesture();open();};
 return {open,update(dt,time){clock+=dt;if(clock<.25)return;clock=0;for(const light of lights){const done=w.wishes.granted.includes(light.id);light.g.visible=done;light.ring.rotation.y=time*.3;}
  const count=w.wishes.granted.length;let wish=WISHES.find(q=>!w.wishes.granted.includes(q.id));const nearby=WISHES.find(q=>{const p=wishStory(q.id);return !w.wishes.granted.includes(q.id)&&Math.hypot(w.x-p.x,w.z-p.z)<7;});if(nearby)wish=nearby;
  if(wish)selected=wish.id;const q=wish&&wishStory(wish.id),n=wish?wishProgress(state,wish.id):0;
  const title=count===6?say('✨ Cosmos restaurado · 6/6','✨ Cosmos restored · 6/6'):`✨ ${count}/6 `+say('deseos','wishes')+' · '+wish.name;
  const subtitle=wish?(n===q.order.length?say('¡Listo! Vuelve y concede su deseo','Ready! Return and grant their wish'):say('Siguiente: ','Next: ')+q.icons[q.order[n]]+' · '+say('Toca para ayudar','Tap to help')):say('Todos tienen su luz. Sigue explorando.','Everyone has their light. Keep exploring.');
  const key=title+subtitle;if(key!==last){heading.textContent=title;hint.textContent=subtitle;hud.setAttribute('aria-label',title+'. '+subtitle);last=key;}
 },dispose(){hud.remove();scene.remove(group);panel.classList.remove('wish-panel');}};
}

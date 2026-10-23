import {phoneGuide,CLEANUP_GUIDE} from './phone-guide.js';
import {bagCapacity,binCapacity,SHIFT_TARGET,SHIFT_BONUS,SERVICE_TARGETS,sanitationOpen,sanitationPoints,sanitationRespect,sanitationImpact,neighborhoodCleanliness} from './sanitation-state.js';
export function createSanitationPanel({host,panel,state,s,prepare,onAction,nearby,onFoot,routes,vehicles,navigate,showRoute,balance}){
 const es=state.lang==='es',say=(a,b)=>es?a:b,el=(tag,text,cls='')=>{const n=document.createElement(tag);n.textContent=text;n.className=cls;return n;};
 let guided=false,view='home',message='',content=null,returnFocus=null,disposed=false;
 const launcher=el('button','♻️','soft sanitation-launch');launcher.type='button';launcher.setAttribute('aria-label',say('Departamento de aseo y reciclaje','Garbage and recycling department'));Object.assign(launcher.style,{position:'absolute',left:'12px',top:'210px',zIndex:22,width:'44px',height:'44px',borderRadius:'14px'});/* Entry lives in the phone Work app and the nearby world action. */launcher.onclick=()=>open();
 const style=el('style',`.sanitation-content{width:100%;min-width:0}.sanitation-content .sanitation-metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0}.sanitation-content .sanitation-metric{padding:10px;border-radius:12px;background:#e2f0e5;overflow-wrap:anywhere}.sanitation-content .sanitation-tabs{display:flex;gap:5px;flex-wrap:wrap;margin:12px 0}.sanitation-content .sanitation-tabs button{flex:1;min-height:44px;padding:9px;border-radius:10px}.sanitation-content .sanitation-tabs [aria-pressed=true]{background:#bce5c9!important;border-bottom-color:#19694f!important;color:#16492d!important}.sanitation-content .sanitation-row{padding:12px 0;border-top:1px solid #cadacf}.sanitation-content button.discover-place{width:100%;min-height:48px;margin:4px 0;white-space:normal;text-align:left}.sanitation-content .sanitation-message{background:#fff0c6;border-radius:10px;padding:10px}.sanitation-content progress{width:100%;height:16px;accent-color:#237953}.sanitation-content .sanitation-small{font-size:14px;line-height:1.45}.sanitation-content h3{margin:12px 0 7px}.sanitation-content button:focus-visible{outline:3px solid #237bab;outline-offset:2px}`);host.append(style);
 function button(parent,label,fn,disabled=false){const b=el('button',label,'discover-place');b.type='button';b.disabled=disabled;b.onclick=()=>{if(disposed||panel.hidden||!panel.contains(content))return;fn();};parent.append(b);return b;}
 function perform(type,payload){message=onAction(type,payload);render();}
 function close(){panel.hidden=true;delete panel.dataset.sanitation;content=null;returnFocus?.isConnected&&returnFocus.focus({preventScroll:true});}
 function open(next='home'){if(disposed)return;returnFocus=document.activeElement;prepare();view=next==='home'&&!guided?'guide':next;message='';panel.hidden=false;panel.classList.remove('estate-panel','island-map-open');panel.dataset.sanitation='true';render();content.querySelector('h2')?.focus({preventScroll:true});}
 function routeName(r){return es?r.es:r.en;}
 function go(p,ri){close();showRoute(ri);const access=p.path.at(-1);navigate({x:access.x,z:access.z});}
 function render(){
  if(disposed)return;panel.replaceChildren();content=el('div','','sanitation-content');panel.append(content);const closeButton=button(content,'×',close);closeButton.className='panel-close';closeButton.setAttribute('aria-label',say('Cerrar','Close'));
  const h=el('h2',say('♻️ Aseo y reciclaje','♻️ Garbage & recycling'));h.tabIndex=-1;content.append(h);
  if(view==='guide'){phoneGuide({parent:content,steps:CLEANUP_GUIDE,es,onDone:()=>{guided=true;if(!s.job)message=onAction('start');findWork();},onClose:()=>{guided=true;view='home';render();}});return;}
  button(content,say('👣 Muéstrame cómo','👣 Show me how'),()=>{view='guide';render();});
  const tabs=el('nav','','sanitation-tabs');tabs.setAttribute('aria-label',say('Secciones de aseo','Sanitation sections'));for(const [id,esName,enName]of [['home','🧤 Mi trabajo','🧤 My work'],['near','🧴 Recoger','🧴 Collect']]){const b=button(tabs,say(esName,enName),()=>{view=id;message='';render();});b.setAttribute('aria-pressed',String(view===id));}content.append(tabs);
  if(message){const note=el('p',message,'sanitation-message');note.setAttribute('role','status');content.append(note);}
  const near=nearby(state.world.x,state.world.z);
  if(view==='home'){
   const j=s.job,ready=j&&j.progress>=SHIFT_TARGET;
   content.append(el('div',ready?'🎉🪙':'🧴➡️♻️','guide-picture'));
   content.append(el('h3',ready?say('¡Buen trabajo!','Great work!'):say('Limpia el barrio','Clean the neighborhood')));
   content.append(el('p',ready?say('Tu bono está listo.','Your bonus is ready.'):say('Recoge → separa → gana monedas.','Pick up → sort → earn coins.')));
   if(j){const bar=el('progress','');bar.max=SHIFT_TARGET;bar.value=j.progress;bar.setAttribute('aria-label',say('Objetos separados','Items sorted'));content.append(bar,el('p',j.progress+'/'+SHIFT_TARGET+' ✅'));}
   if(ready)button(content,say(`🪙 Recibir ${SHIFT_BONUS}`,`🪙 Get ${SHIFT_BONUS}`),()=>perform('claim'));
   else button(content,say('📍 Llévame al trabajo','📍 Take me to work'),()=>{if(!s.job)message=onAction('start');findWork();});
   const details=el('details','','phone-extra');details.append(el('summary',say('🛠️ Equipo y progreso','🛠️ Equipment & progress')));content.append(details);
   details.append(el('p',say(`Turnos completados: ${s.shifts} · Ganado en aseo: ${s.earned} monedas.`,`Completed shifts: ${s.shifts} · Sanitation earnings: ${s.earned} coins.`),'sanitation-small'));
   button(details,say('🚛 Ver rutas','🚛 View routes'),()=>{view='routes';render();});
   details.append(el('h3',say('🛠️ Equipo útil','🛠️ Useful equipment')));
   button(details,s.bagLevel>=2?say('🎒 Bolsa máxima · 24','🎒 Largest bag · 24'):say(`🎒 Bolsa de ${bagCapacity(s)+6} · ${(s.bagLevel+1)*20} 🪙`,`🎒 ${bagCapacity(s)+6}-item bag · ${(s.bagLevel+1)*20} 🪙`),()=>perform('upgrade','bag'),s.bagLevel>=2||balance()<(s.bagLevel+1)*20);
   button(details,s.binLevel?say('🗑️ Contenedores ampliados · 18 por tipo','🗑️ Expanded bins · 18 per stream'):say('🗑️ Ampliar todos los contenedores · 30 🪙','🗑️ Expand all bins · 30 🪙'),()=>perform('upgrade','bins'),!!s.binLevel||balance()<30);
   details.append(el('p',say('Las plantas aparecen en un punto después de 6 aportes. Las cuadrillas recuerdan tu ayuda.','Planters appear at a collection point after 6 contributions. Crews remember your help.'),'sanitation-small'));
  }
  if(view==='near'){
   if(!onFoot())content.append(el('p',say('👣 Baja del vehículo para ayudar.','👣 Hop out of your vehicle to help.')));
   if(!near){content.append(el('p',say('Acércate a los contenedores señalados.','Walk up to a marked collection point.')));button(content,say('📍 Mostrar el punto más cercano','📍 Show nearest collection point'),()=>findWork());}
   else{
    const data=s.stations[near.id],r=routes[near.region];content.append(el('h3',(near.depot?'🏭 ':'🗑️ ')+routeName(r)));
    for(let i=0;i<Math.min(1,data.litter.length);i++){const k=data.litter[i];button(content,k==='recycle'?say('🧴 Recoger envase reciclable','🧴 Pick up recyclable container'):say('🥡 Recoger residuos','🥡 Pick up waste'),()=>perform('pickup',{id:near.id,index:i}),!onFoot()||s.bag.length>=bagCapacity(s));}
    if(!data.litter.length)content.append(el('p',say('✨ ¡Limpio! Lleva una bolsa al centro.','✨ Clean! Take a bag to the depot.')));
    if(!data.litter.length&&!near.depot)for(const k of ['waste','recycle'])button(content,(k==='waste'?'🗑️ ':'♻️ ')+say('Recoger bolsa doméstica → centro','Collect household bag → depot'),()=>perform('household',{id:near.id,kind:k}),!onFoot()||s.bag.length>=bagCapacity(s)||!data.bins[k]);
    const crew=el('details','','phone-extra');crew.append(el('summary',say('🚛 Ayuda del camión','🚛 Truck help')));content.append(crew);
    button(crew,say('🚛 Solicitar recogida de contenedores','🚛 Request bin collection'),()=>perform('request',near.id),!onFoot());
   }
   content.append(el('h3',say('🎒 Tu carga','🎒 Your load')+' · '+s.bag.length+'/'+bagCapacity(s)));
   if(!s.bag.length)content.append(el('p',say('Tu bolsa está vacía. Recoge un objeto para empezar.','Your bag is empty. Pick up an item to begin.')));
   if(s.bag.length){const item=s.bag[0],sealed=item.startsWith('sealed:'),k=sealed?item.slice(7):item;content.append(el('p',(k==='recycle'?'🧴 ':'🥡 ')+(sealed?say('Bolsa doméstica: entrega en el centro.','Household bag: deliver to the depot.'):say('Elige el contenedor correcto.','Choose the correct bin.'))));
    for(const target of ['waste','recycle'])button(content,target==='waste'?say('🗑️ Depositar residuos · +2 🪙','🗑️ Deposit waste · +2 🪙'):say('♻️ Depositar reciclaje · +3 🪙','♻️ Deposit recycling · +3 🪙'),()=>perform('deposit',{id:near?.id,index:0,target}),!near||!onFoot());
    if(sealed||near&&Object.values(s.stations[near.id].bins).some(n=>n>=binCapacity(s)))button(content,say('🏭 Ir al centro de transferencia','🏭 Go to transfer depot'),()=>{const r=near?routes[near.region]:routes.find(r=>sanitationOpen(s,r.ri)&&r.stops.length);if(r?.stops.length)go(r.stops[0],r.ri);});
   }
  }
  if(view==='routes'){
   content.append(el('p',say('🌎 Sigue ayudando para abrir más barrios.','🌎 Keep helping to open more neighborhoods.')));
   content.append(el('p','🌎 '+sanitationPoints(s)+' '+say('puntos de servicio','service points')+' · ♻️ '+s.processed.recycle+' · 🗑️ '+s.processed.waste));
   for(const r of routes){const row=el('section','','sanitation-row'),active=sanitationOpen(s,r.ri),clean=neighborhoodCleanliness(s,r.stops.map(p=>p.id)),v=vehicles.find(v=>v.ri===r.ri),rec=s.trucks[r.id];row.append(el('h3',(active?'🚛 ':'🔒 ')+routeName(r)));
    if(!active)row.append(el('p',say(`Se abre con ${SERVICE_TARGETS[r.ri]} puntos de servicio.`,`Opens at ${SERVICE_TARGETS[r.ri]} service points.`)));
    else if(!r.stops.length)row.append(el('p',say('No hay un acceso seguro en esta zona. Las demás rutas siguen trabajando.','No safe access is available here. Other routes keep working.')));
    else{const status=rec.mode==='service'?say('Recogiendo','Collecting'):rec.mode==='unload'?say('Descargando y separando','Unloading and separating'):rec.waiting>2?say('Cediendo el paso','Yielding to traffic'):say('En ruta','On route');row.append(el('p',`${clean}% `+say('limpio','clean')+' · '+status+' · '+(rec.load.waste+rec.load.recycle)+'/96 '+say('a bordo','on board')));
     button(row,say('🗺️ Mostrar ruta y centro','🗺️ Show route & depot'),()=>go(r.stops[0],r.ri));
     const next=v?.stops[Math.min(rec.stop,v.stops.length-1)];if(next)row.append(el('p',say('Próxima parada: ','Next stop: ')+(next.depot?say('Centro de transferencia','Transfer depot'):say('Punto ','Collection point ')+(v.stops.indexOf(next)+1))+' · '+rec.cycles+' '+say('vueltas completas','completed rounds'),'sanitation-small'));
    }content.append(row);
   }
   button(content,say('Ocultar ruta del suelo','Hide ground route'),()=>{showRoute(null);message=say('Ruta oculta.','Route hidden.');render();});
  }
 }
 function findWork(){const points=routes.filter(r=>sanitationOpen(s,r.ri)).flatMap(r=>r.stops);points.sort((a,b)=>Math.hypot(a.x-state.world.x,a.z-state.world.z)-Math.hypot(b.x-state.world.x,b.z-state.world.z));const p=points.find(p=>s.stations[p.id].litter.length||!p.depot&&Object.values(s.stations[p.id].bins).some(n=>n>0))||points[0];if(p)go(p,p.region);}
 return {open,close,refresh(){if(content&&panel.contains(content)&&!panel.hidden)render();},isOpen:()=>!!content&&panel.contains(content)&&!panel.hidden,dispose(){disposed=true;launcher.remove();style.remove();if(content&&panel.contains(content))close();}};
}

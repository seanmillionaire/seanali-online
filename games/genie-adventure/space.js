import {PLANETS,FRAGMENT_SITES,planetById,screenMotion,collectFragment,grantPlanetWish} from './space-state.js?v=space3';
import {createSpaceScene} from './space-scene.js?v=space3';
const load=()=>import('/games/adventure/vendor/three.module.min.js');
const node=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text!==undefined)n.textContent=text;return n;};

export function createEntrance(host,{motion=()=>true}={}){
 const canvas=node('canvas','space-canvas');canvas.setAttribute('aria-label','A spherical planet in deep space');host.prepend(canvas);let engine,disposed=false,frame=0;
 load().then(T=>{if(disposed)return;engine=createSpaceScene(T,canvas);const p=PLANETS[0],c=new T.Vector3().fromArray(p.center);let time=0,last=0;
  const tick=stamp=>{if(disposed)return;const dt=last?Math.min((stamp-last)/1000,.05):0;last=stamp;if(motion())time+=dt;engine.camera.position.set(235+Math.sin(time*.04)*15,145,285);engine.camera.lookAt(c);engine.draw();frame=requestAnimationFrame(tick);};host.classList.add('world-ready');frame=requestAnimationFrame(tick);
 }).catch(()=>host.classList.add('world-fallback'));
 return {flyIn(done){done();},skip(){},dispose(){disposed=true;cancelAnimationFrame(frame);engine?.dispose();canvas.remove();}};
}

export function createExplore(host,{state,save,joy,motion=()=>true}){
 const es=state.lang==='es',say=(a,b)=>es?a:b,s=state.world.space,w=state.world.wishes;
 host.className='planet-world';
 const canvas=node('canvas','space-canvas');canvas.tabIndex=0;canvas.setAttribute('aria-label',say('Exploración planetaria. Flechas para moverte con la cámara.','Planetary exploration. Arrow keys move relative to the camera.'));
 const location=node('div','space-location'),modeLabel=node('span','space-mode'),nameLabel=node('strong','space-name');location.append(modeLabel,nameLabel);
 const missionButton=node('button','space-mission');missionButton.type='button';const missionTitle=node('strong',''),missionHint=node('span','');missionButton.append(missionTitle,missionHint);
 const nav=node('nav','space-nav'),missionNav=node('button','space-nav-mission',say('Misión','Mission')),planetNav=node('button','space-nav-planets',say('Planetas','Planets'));nav.append(missionNav,planetNav);
 const action=node('button','space-action'),altitude=node('div','space-altitude'),higher=node('button','', '↑'),lower=node('button','','↓');higher.setAttribute('aria-label',say('Ascender','Ascend'));lower.setAttribute('aria-label',say('Descender','Descend'));altitude.append(higher,lower);
 const joystick=node('div','space-stick'),knob=node('span','space-knob');joystick.append(knob);joystick.setAttribute('aria-label',say('Palanca: movimiento relativo a la cámara','Joystick: movement relative to camera'));joystick.setAttribute('role','group');
 const stickHint=node('span','space-stick-hint',say('MOVER','MOVE'));joystick.append(stickHint);
 const panel=node('section','space-panel');panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label',say('Misión y destinos','Mission and destinations'));
 const toast=node('div','space-toast');toast.setAttribute('role','status');const travelUI=node('div','space-travel'),travelWords=node('span',''),travelMeter=node('progress','');travelMeter.max=1;travelUI.append(travelWords,travelMeter);travelUI.hidden=true;
 const help=node('p','space-control-hint',say('Flechas / WASD para moverte · Espacio para actuar · Arrastra para mirar','Arrows / WASD move · Space to act · Drag to look'));
 host.append(canvas,location,missionButton,panel,nav,joystick,action,altitude,toast,travelUI,help);
 let engine,T,disposed=false,frame=0,last=0,time=0,autosave=0,toastTime=0,selected=s.planet,travel=null,walkTarget=null,stick={x:0,y:0},vertical=0,keys=new Set(),pointer=null,drag=null,fragmentMeshes=[],lastUI='',planetPosition,normal;
 const persist=()=>{if(engine)s.position=engine.avatar.position.toArray();save();};
 const message=words=>{toast.textContent=words;toast.classList.add('visible');toastTime=4;};
 const current=()=>planetById(s.planet),done=id=>w.granted.includes(id),fragments=id=>w.fragments[id];
 const button=(text,cls,fn)=>{const b=node('button',cls,text);b.type='button';b.onclick=()=>{joy.gesture();fn();};return b;};
 const clear=()=>{keys.clear();stick={x:0,y:0};vertical=0;knob.style.transform='translate(0,0)';};
 function closePanel(){panel.hidden=true;clear();canvas.focus({preventScroll:true});}
 function openPanel(title){clear();panel.replaceChildren();panel.hidden=false;const close=button('×','space-close',closePanel);close.setAttribute('aria-label',say('Cerrar','Close'));const h=node('h2','',title);h.id='space-panel-title';panel.setAttribute('aria-labelledby',h.id);panel.append(close,h);close.focus();}
 function mission(id=s.planet){selected=id;const p=planetById(id),complete=done(id),n=fragments(id).length;openPanel(say('Restaura Las Seis Luces','Restore The Six Lights'));
  panel.append(node('p','space-panel-lead',say('Viaja entre planetas. Ayuda a cada visitante y restaura su luz.','Fly between planets. Help each visitor and restore their light.')),node('div','space-total',w.granted.length+'/6 '+say('luces restauradas','lights restored')));
  const card=node('article','space-mission-card');card.append(node('div','space-eyebrow',p.name+' / '+p.visitor),node('h3','',es?p.wishEs:p.wish));
  card.append(node('p','',complete?say('Este planeta vuelve a brillar. Su visitante ya tiene lo que necesitaba.','This planet’s light is restored. Its visitor has what they needed.'):es?p.taskEs:p.task));
  if(!complete){const steps=node('div','space-objective-steps');for(let i=0;i<3;i++)steps.append(node('i',fragments(id).includes(i)?'complete':''));card.append(steps,node('p','space-fragment-count',n+'/3 '+say('fragmentos recuperados','fragments recovered')));}
  let label,fn;
  if(complete){const next=PLANETS.find(p=>!done(p.id));label=next?say('Siguiente Planeta','Next Planet'):say('Explorar El Sistema','Explore The System');fn=()=>next?mission(next.id):destinations();}
  else if(s.planet!==id){label=say('Volar A ','Fly To ')+p.name;fn=()=>{closePanel();startTravel(id);};}
  else if(s.mode!=='walk'){const near=engine.avatar.position.distanceTo(new T.Vector3().fromArray(p.center))<p.radius+400;label=near?say('Aterrizar Para Ayudar','Land To Help'):say('Volar A ','Fly To ')+p.name;fn=()=>{closePanel();land(id);};}
  else if(n<3){label=say('Localizar Fragmento','Locate Fragment');fn=()=>{closePanel();const i=[0,1,2].find(i=>!fragments(id).includes(i));delete s.targetSurface;walkTarget=FRAGMENT_SITES[i];};}
  else if(Math.hypot(...s.local)>9){label=say('Volver Con ','Return To ')+p.visitor;fn=()=>{closePanel();delete s.targetSurface;walkTarget=[0,0];};}
  else{label=say('Conceder Deseo','Grant Wish');fn=()=>{closePanel();grant();};}
  card.append(button(label,'space-primary',fn));panel.append(card);
  if(w.granted.length===6)panel.append(node('p','space-complete-note',say('El cosmos vuelve a brillar. Has cumplido tu misión.','The cosmos shines again. Your mission is complete.')));
 }
 function destinations(){openPanel(say('Sistema Planetario','Planetary System'));panel.append(node('p','space-panel-lead',say('Los planetas están separados por el espacio profundo. Solo puedes viajar volando.','The planets are separated by deep space. Flight is the only way between them.')));
  const list=node('div','space-destinations');for(const p of PLANETS){const b=button('','space-destination',()=>{if(p.id===s.planet){closePanel();if(s.mode==='flight'){if(engine.avatar.position.distanceTo(new T.Vector3().fromArray(p.center))<p.radius+400)enterOrbit(p.id);else startTravel(p.id);}else mission(p.id);}else{closePanel();startTravel(p.id);}});const orb=node('span','planet-preview');orb.style.setProperty('--planet-color',p.color);const words=node('span','');words.append(node('strong','',p.name),node('small','',done(p.id)?say('Luz restaurada','Light restored'):p.visitor+' · '+say('Necesita tu ayuda','Needs your help')));b.append(orb,words,node('span','space-destination-arrow',p.id===s.planet?say('Aquí','Here'):'↗'));list.append(b);}panel.append(list);
 }
 function setPosition(pos){engine.avatar.position.copy(pos);s.position=pos.toArray();}
 function enterOrbit(id){s.planet=id;s.mode='orbit';s.orbit=0;travel=null;walkTarget=null;clear();persist();lastUI='';}
 function land(id=s.planet){if(!engine)return;if(id!==s.planet||engine.avatar.position.distanceTo(new T.Vector3().fromArray(current().center))>current().radius+400){startTravel(id);return;}s.mode='walk';s.local=[0,22];s.surface=new T.Vector3(0,Math.sqrt(1-(22/current().radius)**2),22/current().radius).toArray();travel=null;walkTarget=null;clear();setPosition(engine.surfacePoint(current(),0,22,1));persist();lastUI='';message(say('Aterrizaste en ','Landed on ')+current().name);}
 function alignFlightView(){const back=engine.camera.position.clone().sub(engine.avatar.position);s.yaw=Math.atan2(back.x,back.z);}
 function launch(){alignFlightView();const p=current(),c=new T.Vector3().fromArray(p.center);normal.copy(engine.avatar.position).sub(c).normalize();s.mode='flight';setPosition(c.addScaledVector(normal,p.radius+80));walkTarget=null;clear();persist();lastUI='';}
 function startTravel(id){if(!engine)return;const p=planetById(id),from=engine.avatar.position.clone(),to=new T.Vector3().fromArray(p.center).add(new T.Vector3(0,p.radius+150,p.radius*.5));
  travel={id,from,to,elapsed:0,duration:Math.max(3,from.distanceTo(to)/2600)};s.mode='flight';walkTarget=null;clear();joy.effect('travel');lastUI='';}
 function grant(){if(!grantPlanetWish(state,s.planet))return;joy.effect('finish');persist();lastUI='';message(say('Deseo concedido. La luz de ','Wish granted. ')+current().name+say(' vuelve a brillar.',' shines again.'));if(w.granted.length===6)mission();}
 function contextAction(){if(!engine||!panel.hidden||travel)return;if(s.mode==='walk'){if(!done(s.planet)&&Math.hypot(...s.local)<9){if(fragments(s.planet).length===3)grant();else mission();}else launch();}else if(s.mode==='orbit')land();else{const closest=nearestPlanet();if(closest.distance<closest.p.radius+400)enterOrbit(closest.p.id);else destinations();}}
 function nearestPlanet(){return PLANETS.map(p=>({p,distance:engine.avatar.position.distanceTo(new T.Vector3().fromArray(p.center))})).sort((a,b)=>a.distance-b.distance)[0];}
 missionButton.onclick=missionNav.onclick=()=>{joy.gesture();mission();};planetNav.onclick=()=>{joy.gesture();destinations();};action.onclick=()=>{joy.gesture();contextAction();};
 const altPress=(b,n)=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);vertical=n;travel=null;joy.gesture();};b.onpointerup=b.onpointercancel=()=>vertical=0;};altPress(higher,1);altPress(lower,-1);
 joystick.onpointerdown=e=>{e.preventDefault();if(!panel.hidden)return;pointer=e.pointerId;joystick.setPointerCapture(pointer);joy.gesture();moveStick(e);};
 function moveStick(e){if(pointer!==e.pointerId)return;const r=joystick.getBoundingClientRect(),x=(e.clientX-r.left-r.width/2)/(r.width*.34),y=(e.clientY-r.top-r.height/2)/(r.height*.34),len=Math.max(1,Math.hypot(x,y));stick={x:x/len,y:y/len};knob.style.transform=`translate(${stick.x*25}px,${stick.y*25}px)`;travel=null;walkTarget=null;}
 joystick.onpointermove=moveStick;joystick.onpointerup=joystick.onpointercancel=()=>{pointer=null;stick={x:0,y:0};knob.style.transform='translate(0,0)';};
 function keydown(e){if(e.target.closest('button,input,select,textarea')&&[' ','Enter'].includes(e.key))return;if(e.key==='Escape'){closePanel();return;}if(!panel.hidden||document.querySelector('dialog[open]'))return;const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','q','e',' ','shift'].includes(k)){e.preventDefault();joy.gesture();if(!e.repeat&&k===' '){contextAction();return;}keys.add(k);travel=null;walkTarget=null;}}
 function keyup(e){keys.delete(e.key.toLowerCase());}
 document.addEventListener('keydown',keydown);document.addEventListener('keyup',keyup);window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
 canvas.onpointerdown=e=>{if(!panel.hidden)return;drag={x:e.clientX,y:e.clientY,moved:false};canvas.setPointerCapture(e.pointerId);};canvas.onpointermove=e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>2)drag.moved=true;s.yaw-=dx*.006;drag.x=e.clientX;};canvas.onpointerup=e=>{if(!drag)return;if(!drag.moved)tapWorld(e);drag=null;};canvas.onpointercancel=()=>drag=null;
 function tapWorld(e){if(!engine||s.mode!=='walk')return;const r=canvas.getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),engine.camera);const objects=fragmentMeshes.filter(f=>f.planet===s.planet&&!fragments(s.planet).includes(f.index));const hit=ray.intersectObjects(objects.map(f=>f.mesh),false)[0];if(hit){delete s.targetSurface;walkTarget=FRAGMENT_SITES[objects.find(f=>f.mesh===hit.object).index];return;}const surface=engine.planets.find(p=>p.p.id===s.planet).surface,ground=ray.intersectObject(surface,false)[0];if(ground){const p=current(),local=ground.point.clone().sub(new T.Vector3().fromArray(p.center)).normalize();s.targetSurface=local.toArray();walkTarget=[local.x*p.radius,local.z*p.radius];}}
 function ui(){const p=current(),n=fragments(p.id).length,count=w.granted.length,key=[p.id,s.mode,n,count,!!travel].join(':');if(key===lastUI)return;lastUI=key;
  modeLabel.textContent=s.mode==='walk'?say('SUPERFICIE','SURFACE'):s.mode==='orbit'?say('EN ÓRBITA','IN ORBIT'):say('ESPACIO PROFUNDO','DEEP SPACE');const nearby=s.mode==='flight'&&!travel?nearestPlanet():null;nameLabel.textContent=travel?planetById(travel.id).name:nearby&&nearby.distance>nearby.p.radius+400?say('Espacio Interplanetario','Interplanetary Space'):nearby?nearby.p.name:p.name;
  missionTitle.textContent=count===6?say('Las seis luces están restauradas','All six lights restored'):say('Restaura las seis luces','Restore the six lights')+' · '+count+'/6';missionHint.textContent=done(p.id)?say('Abre Planetas para continuar','Open Planets to continue'):p.visitor+' · '+(n===3?say('Vuelve para conceder el deseo','Return to grant the wish'):n+'/3 '+say('fragmentos','fragments'));
  action.disabled=!!travel;action.textContent=s.mode==='walk'?(Math.hypot(...s.local)<9&&!done(p.id)?(n===3?say('Conceder Deseo','Grant Wish'):say('Hablar','Talk')):say('Despegar','Launch')):s.mode==='orbit'?say('Aterrizar','Land'):(nearby&&nearby.distance<nearby.p.radius+400?say('Entrar En Órbita','Enter Orbit'):say('Planetas','Planets'));altitude.hidden=s.mode!=='flight'||!!travel;travelUI.hidden=!travel;
 }
 load().then(three=>{if(disposed)return;T=three;engine=createSpaceScene(T,canvas);planetPosition=new T.Vector3();normal=new T.Vector3(0,1,0);setPosition(new T.Vector3().fromArray(s.position));
  for(const p of PLANETS)FRAGMENT_SITES.forEach(([x,z],index)=>{const mesh=engine.make(engine.geo(new T.OctahedronGeometry(1.3,0)),engine.mat(p.light,{emissive:p.light,emissiveIntensity:.7}),0,0,0);mesh.position.copy(engine.surfacePoint(p,x,z,3));mesh.name=p.name+' fragment '+index;fragmentMeshes.push({planet:p.id,index,mesh});});host.classList.add('explore-ready');tick(0);
 }).catch(error=>{console.warn('Planet renderer unavailable',error);message(say('No se pudo abrir el mundo. Vuelve a cargar.','The world could not load. Reload to try again.'));});
 function tick(stamp){if(disposed||!engine)return;const dt=last?Math.min(.05,(stamp-last)/1000):0;last=stamp;time+=dt;const active=panel.hidden&&!document.hidden&&!document.querySelector('dialog[open]'),p=current(),c=planetPosition.fromArray(p.center),avatar=engine.avatar;
  const x=stick.x+(keys.has('arrowright')||keys.has('d')?1:0)-(keys.has('arrowleft')||keys.has('a')?1:0),y=stick.y+(keys.has('arrowdown')||keys.has('s')?1:0)-(keys.has('arrowup')||keys.has('w')?1:0),hasInput=Math.hypot(x,y)>.05;
  if(s.mode==='orbit'){if(active&&motion())s.orbit+=dt*.11;const radial=new T.Vector3(Math.sin(s.orbit)*.8,.65,Math.cos(s.orbit)*.8).normalize();avatar.position.copy(c).addScaledVector(radial,p.radius+115);normal.copy(radial);if(active&&hasInput){alignFlightView();s.mode='flight';travel=null;lastUI='';}}
  if(s.mode==='walk'){
   normal.fromArray(s.surface).normalize();if(normal.lengthSq()<.5)normal.set(0,1,0);
   let movement=screenMotion(T,engine.camera,normal,x,y);
   if(walkTarget&&!hasInput){const targetNormal=s.targetSurface?new T.Vector3().fromArray(s.targetSurface):new T.Vector3(walkTarget[0],Math.sqrt(Math.max(1,p.radius*p.radius-walkTarget[0]**2-walkTarget[1]**2)),walkTarget[1]).normalize();const gap=normal.angleTo(targetNormal)*p.radius;if(gap<.55){walkTarget=null;delete s.targetSurface;}else movement.copy(targetNormal).projectOnPlane(normal).normalize();}
   if(active){normal.addScaledVector(movement,dt*12/p.radius).normalize();s.surface=normal.toArray();s.local=[normal.x*p.radius,normal.z*p.radius];}
   avatar.position.copy(c).addScaledVector(normal,p.radius+1);avatar.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),normal);
   if(active&&normal.y>0){for(let i=0;i<3;i++)if(collectFragment(state,p.id,i)){joy.effect('pair');persist();lastUI='';message(fragments(p.id).length===3?say('Vuelve con ','Return to ')+p.visitor:fragments(p.id).length+'/3 '+say('fragmentos recuperados','fragments recovered'));}}
  }else if(s.mode==='flight'){
   if(travel&&active){travel.elapsed+=dt;const f=Math.min(1,travel.elapsed/travel.duration),ease=f*f*(3-2*f);avatar.position.lerpVectors(travel.from,travel.to,ease);avatar.position.y+=Math.sin(f*Math.PI)*800;const direction=travel.to.clone().sub(travel.from).normalize();s.yaw=Math.atan2(-direction.x,-direction.z);travelWords.textContent=say('Volando a ','Crossing deep space to ')+planetById(travel.id).name;travelMeter.value=f;if(f===1){const id=travel.id;enterOrbit(id);message(say('En órbita de ','Entered orbit around ')+current().name);}}
   else if(active){const movement=screenMotion(T,engine.camera,new T.Vector3(0,1,0),x,y);const nearest=nearestPlanet(),cruise=Math.max(70,Math.min(2300,(nearest.distance-nearest.p.radius-25)*4));avatar.position.addScaledVector(movement,dt*cruise*(keys.has('shift')?1.8:1));avatar.position.y+=(vertical+(keys.has('e')?1:0)-(keys.has('q')?1:0))*dt*600;for(const other of PLANETS){const oc=new T.Vector3().fromArray(other.center),out=avatar.position.clone().sub(oc),limit=other.radius+20;if(out.length()<limit)avatar.position.copy(oc).addScaledVector(out.normalize(),limit);}}
   normal.set(0,1,0);avatar.quaternion.identity();
  }
  const flying=s.mode!=='walk';avatar.scale.setScalar(s.mode==='orbit'?2.4:s.mode==='flight'?1.5:1);if(flying)avatar.quaternion.identity();engine.legs.visible=!flying;engine.tail.visible=flying;engine.tail.rotation.z=motion()?Math.sin(time)*.05:0;
  const up=s.mode==='walk'?normal.clone():s.mode==='orbit'?avatar.position.clone().sub(c).normalize():new T.Vector3(0,1,0);
  const east=new T.Vector3().crossVectors(up,new T.Vector3(0,0,1)).normalize();if(east.lengthSq()<.1)east.set(1,0,0);const north=new T.Vector3().crossVectors(up,east).normalize();const back=north.multiplyScalar(-Math.cos(s.yaw)).addScaledVector(east,Math.sin(s.yaw));
  if(s.mode==='orbit'){
   const angle=s.orbit+s.yaw,orbitCamera=c.clone().add(new T.Vector3(Math.sin(angle)*p.radius*4.8,p.radius*2.2,Math.cos(angle)*p.radius*4.8));
   engine.camera.position.copy(orbitCamera);engine.camera.up.set(0,1,0);engine.camera.lookAt(c.clone().add(new T.Vector3(0,p.radius*.35,0)));
  }else{
   const cameraPos=avatar.position.clone().addScaledVector(up,s.mode==='walk'?40:85).addScaledVector(back,s.mode==='walk'?58:170);
   if(s.mode==='flight'||dt===0)engine.camera.position.copy(cameraPos);else engine.camera.position.lerp(cameraPos,1-Math.exp(-dt*10));engine.camera.up.copy(up);engine.camera.lookAt(avatar.position.clone().addScaledVector(up,3));
  }
  engine.camera.updateMatrixWorld();
  for(const v of engine.planets){v.beacon.visible=done(v.p.id);if(motion())v.ring.rotation.y=time*.2;}
  for(const f of fragmentMeshes){f.mesh.visible=!done(f.planet)&&!fragments(f.planet).includes(f.index);if(motion())f.mesh.rotation.y=time*.5;}
  if(toastTime>0){toastTime-=dt;if(toastTime<=0)toast.classList.remove('visible');}autosave+=dt;if(autosave>1){autosave=0;persist();}
  // Context wording changes with physical proximity, rather than stale menu labels.
  lastUI='';ui();engine.draw();frame=requestAnimationFrame(tick);
 }
 return {dispose(){disposed=true;cancelAnimationFrame(frame);persist();document.removeEventListener('keydown',keydown);document.removeEventListener('keyup',keyup);window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear);engine?.dispose();}};
}

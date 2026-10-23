import {createParkinGatherings} from './parkin-gatherings.js';
import {createLeisureVisits} from './leisure-visits.js';
import {placeGroundVehicle} from './vehicle-grounding.js';
import {createFruitEmojis} from './fruit-emojis.js';
import {PURPLE_APARTMENT as A} from './purple-apartment.js';
import {jungleTrailPoint} from './east-jungle-layout.js';
// All visits are transient: saved position remains at the safe entrance/boat.
export function createWorldExperiences(o){
 const {T,scene,host,state,height,make,mat,box,cylinder,prepare,ghost,jungle}=o;const leisure=createLeisureVisits(o),parkin=createParkinGatherings(o);
 const es=state.lang==='es',say=(a,b)=>es?a:b,root=new T.Group();root.name='Rivage glass elevator and private roof';scene.add(root);
 const base=height(A.x,A.z),top=base+A.floors*A.floorHeight+8,stone=mat('#ddd9d4'),metal=mat('#b8c6cc',{metalness:.7,roughness:.2}),glass=mat('#b4e4ef',{transparent:true,opacity:.19,depthWrite:false,roughness:.1}),water=mat('#38bbd3',{transparent:true,opacity:.8,roughness:.15});
 const emblems=createFruitEmojis(T);emblems.sprite('coconut',A.x+2.7,top+.85,A.z,.55,root);emblems.sprite('pineapple',A.x+2.3,top+.85,A.z,.6,root);
 const piece=(m,x,y,z,w,h,d,parent=root)=>make(box,m,x,y,z,w,h,d,parent);
 piece(stone,A.x,top-.25,A.z,8,.35,5.8);piece(water,A.x-1.5,top+.05,A.z,2.3,.12,3.7);
 for(const dx of [-3.8,3.8])piece(glass,A.x+dx,top+.6,A.z,.08,1.2,5.7);
 for(const dz of [-2.8,2.8])piece(glass,A.x,top+.6,A.z+dz,7.7,1.2,.08);
 for(const dz of [-1.5,1.5]){piece(stone,A.x+1.8,top+.35,A.z+dz,1.3,.18,1.9);const back=piece(metal,A.x+1.8,top+.65,A.z+dz-.65,1.3,.7,.12);back.rotation.x=-.2;}
 piece(metal,A.x+2.5,top+.65,A.z,1,.1,.8);for(const dz of [-2.2,2.2]){piece(metal,A.x-3.2,top+.35,A.z+dz,.7,.7,.7);make(cylinder,mat('#287940'),A.x-3.2,top+1.15,A.z+dz,.45,1.2,.45,root);}
 const cabin=new T.Group();cabin.name='Rivage panoramic glass lift';root.add(cabin);piece(metal,0,0,0,2.4,.16,2,cabin);piece(metal,0,2.65,0,2.4,.12,2,cabin);
 for(const side of [-1,1]){piece(glass,side*1.15,1.3,0,.05,2.6,2,cabin);piece(metal,side*1.15,1.3,.95,.06,2.6,.06,cabin);}piece(glass,0,1.3,1,2.3,2.6,.04,cabin);cabin.position.set(A.x,base+.25,A.z+4.2);
 const ui=document.createElement('div');ui.className='world-visit-controls';ui.hidden=true;host.append(ui);let mode=null,time=0,page=0,roofMode='view',roofX=0,roofZ=1.9,roofHeading=Math.PI,roofJump=0,roofVelocity=0,roofTarget=null;
 const cards=[['🏴‍☠️ 1668 · Portobelo','Henry Morgan attacked Portobelo in 1668. The town’s forts defended an important trading port.','Henry Morgan atacó Portobelo en 1668. Sus fuertes defendían un puerto comercial importante.'],['🏰 Portobelo · San Lorenzo','Portobelo’s forts protected its bay. San Lorenzo guarded the mouth of the Chagres River.','Los fuertes de Portobelo protegían su bahía. San Lorenzo vigilaba la desembocadura del río Chagres.'],['🧭 History, not a treasure legend','The ghost ship is imaginary. The forts and the people’s history are real—and worth protecting.','El barco fantasma es imaginario. Los fuertes y la historia de su gente son reales y merecen protección.']];
 function button(text,fn){const b=document.createElement('button');b.textContent=text;b.onclick=fn;ui.append(b);return b;}
 function draw(){host.classList.toggle('rooftop-free',mode==='roof');ui.replaceChildren();if(!mode)return;const title=document.createElement('strong');title.textContent=(mode==='lift'||mode==='down')?say('🛗 Rivage · Ascensor panorámico','🛗 Rivage · Glass elevator'):mode==='roof'?say('🌇 Terraza privada','🌇 Private rooftop'):mode==='jungle'?say('🚙 Safari guiado · Mantén distancia','🚙 Guided jungle tour · Keep your distance'):cards[page][0];ui.append(title);
  if(mode==='pirate'){const p=document.createElement('p');p.textContent=cards[page][es?2:1];ui.append(p);button(say('🧭 Siguiente cubierta','🧭 Next deck'),()=>{page=(page+1)%cards.length;draw();});const a=document.createElement('a');a.href='https://whc.unesco.org/en/list/135/';a.target='_blank';a.rel='noopener';a.textContent=say('📖 Historia · UNESCO','📖 History · UNESCO');ui.append(a);}

  button(mode==='roof'?say('🛗 Bajar a la calle','🛗 Return to street'):say('🚪 Salir','🚪 Exit'),()=>{if(mode==='roof'){mode='down';time=0;draw();}else leave();});
 }
 function leave(){leisure.leave();mode=null;ui.hidden=true;host.classList.remove('world-visit-active','rooftop-free');cabin.position.y=base+.25;}
 let liftDoorLatched=false;
 function autoDoor(x,z){const close=Math.hypot(x-A.x,z-A.z-4.5)<1.8;if(Math.hypot(x-A.x,z-A.z-4.5)>4)liftDoorLatched=false;if(close&&!liftDoorLatched&&!mode&&!leisure.active){liftDoorLatched=true;enter('lift');}}
 function near(x,z){if(mode||leisure.active)return null;const activity=leisure.near(x,z);if(activity)return activity;if(Math.hypot(x-A.x,z-A.z-4.5)<3)return 'lift';if(Math.hypot(x-550,z+68)<7)return 'jungle';if(ghost.root.visible&&Math.hypot(x-ghost.root.position.x,z-ghost.root.position.z)<30)return 'pirate';return null;}
 function enter(kind){if(!kind)return false;prepare();if(leisure.enter(kind))return true;mode=kind;time=0;page=0;roofMode='view',roofX=0,roofZ=1.9,roofHeading=Math.PI,roofJump=0,roofVelocity=0,roofTarget=null;ui.hidden=false;host.classList.add('world-visit-active');draw();return true;}
 function pose(){if(leisure.active)return leisure.pose();if(!mode)return null;if(mode==='jungle'){const u=Math.min(1,time/85),t=(1-Math.cos(u*Math.PI*2))*.45,p=jungleTrailPoint(t),q=jungleTrailPoint(Math.min(.91,t+.003)),heading=Math.atan2(q.x-p.x,q.z-p.z)+(u>.5?Math.PI:0);return {...p,y:height(p.x,p.z)+.45,heading};}
  if(mode==='pirate'){const p=ghost.root.position,h=ghost.root.rotation.y,z=[5,-6,-11][page];return {x:p.x+Math.sin(h)*z,y:p.y+(page===2?6.2:3.35),z:p.z+Math.cos(h)*z,heading:h};}
  if(mode==='roof')return {x:A.x+roofX,y:top+(inPool()?-.6:0)+roofJump,z:A.z+roofZ,heading:roofHeading};
  const t=Math.min(1,time/13),smooth=t*t*(3-2*t),y=mode==='down'?top-(top-base-.25)*smooth:base+.25+(top-base-.25)*smooth;return {x:A.x,y,z:A.z+4.2,heading:0};
 }
 function inPool(){return roofX>-2.65&&roofX<-.35&&Math.abs(roofZ)<1.85;}
 function roofClear(x,z){return Math.abs(x)<=3.45&&Math.abs(z)<=2.45&&!(Math.abs(x-1.8)<.9&&Math.abs(Math.abs(z)-1.5)<1.05)&&!(Math.abs(x-2.5)<.75&&Math.abs(z)<.65)&&!(x< -2.65&&Math.abs(z)>1.65);}
 function moveRoof(dx,dz,dt){if(mode!=='roof')return;dt=Math.min(.05,Math.max(0,dt));if(Math.hypot(dx,dz)>.05)roofTarget=null;else if(roofTarget){dx=roofTarget.x-roofX;dz=roofTarget.z-roofZ;if(Math.hypot(dx,dz)<.12){roofTarget=null;dx=dz=0;}}
 const length=Math.hypot(dx,dz),speed=inPool()?1.5:2.8;if(length>.01){const step=Math.min(speed*dt,length),nx=roofX+dx/length*step,nz=roofZ+dz/length*step;if(roofClear(nx,roofZ))roofX=nx;if(roofClear(roofX,nz))roofZ=nz;roofHeading=Math.atan2(dx,dz);}
 if(roofJump>0||roofVelocity>0){roofVelocity-=12*dt;roofJump=Math.max(0,roofJump+roofVelocity*dt);if(!roofJump)roofVelocity=0;}}
 return {autoDoor,root,leisure,parkin,near,moveRoof,get freeYacht(){return leisure.freeYacht;},steerYacht:(dx,dz,dt)=>leisure.steer(dx,dz,dt),sailTo:(x,z)=>leisure.sailTo(x,z),get freeRoof(){return mode==='roof';},roofTo(x,z){if(mode==='roof')roofTarget={x:x-A.x,z:z-A.z};},jump(){if(mode==='roof'&&!roofJump&&!inPool())roofVelocity=4;},enter,roofAt(x,z){return Math.abs(x-A.x)<4&&Math.abs(z-A.z)<2.9?top:null;},landingTarget(x,y,z){return !mode&&y>=top-.1&&Math.hypot(x-A.x,z-A.z)<18?{x:A.x,z:A.z,y:top}:null;},landRoof(){state.world.x=A.x;state.world.z=A.z+4.5;return enter('roof');},get active(){return !!mode||leisure.active;},prompt(x,z){const n=near(x,z);if(n==='horse'||n==='yacht')return leisure.prompt(x,z);return n==='lift'?say('🛗 Entrar a Rivage','🛗 Enter Rivage'):n==='jungle'?say('🚙 Tour de la selva','🚙 Jungle tour'):n==='pirate'?say('🏴‍☠️ Explorar barco','🏴‍☠️ Explore ship'):null;},update(dt,active){leisure.update(dt,active);parkin.update(dt,active);if(!mode)return;if(active)time+=dt;if(mode==='lift'&&time>=13){mode='roof';time=0;draw();}if(mode==='down'&&time>=13||mode==='jungle'&&time>=85||mode==='pirate'&&!ghost.root.visible)leave();},pose,view(camera,target){const p=pose();if(!p)return;if(leisure.freeYacht){const boat=leisure.vesselPose;camera.position.set(boat.x-Math.sin(boat.heading)*18+Math.cos(boat.heading)*8,10,boat.z-Math.cos(boat.heading)*18-Math.sin(boat.heading)*8);target.set(boat.x,1,boat.z);return;}const lifting=mode==='lift'||mode==='down';if(lifting){cabin.position.y=p.y;camera.position.set(p.x,p.y+1.5,p.z+.1);target.set(p.x+8,p.y-12,p.z+50);}else if(mode==='roof'){camera.position.set(p.x-10,p.y+13,p.z-12);target.set(p.x+3,p.y-2,p.z+4);}else{camera.position.set(p.x+Math.cos(p.heading)*7-Math.sin(p.heading)*8,p.y+(mode==='roof'?6:4),p.z-Math.sin(p.heading)*7-Math.cos(p.heading)*8);target.set(p.x,p.y+1,p.z);}
  if(mode==='jungle'){const jeep=jungle.vehicles[0]?.g;if(jeep){jeep.visible=true;placeGroundVehicle(jeep,p,height,'jeep');}}
 },get seated(){return leisure.seated||mode==='jungle';},get swimming(){return mode==='roof'&&inPool();},get hideAvatar(){return mode==='lift'||mode==='down';},dispose(){leave();leisure.dispose();parkin.dispose();emblems.dispose();ui.remove();scene.remove(root);}};
}


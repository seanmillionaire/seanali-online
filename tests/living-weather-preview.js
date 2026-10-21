import {createWorldCollision} from '../games/adventure/world-collision.js';
import {vehicleEscapeClear,vehicleOverlap} from '../games/adventure/vehicle-contact.js';
import {canDriveOnLand} from '../games/adventure/pizza-city.js';
import {positionMoon} from '../games/adventure/island-life.js';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {fresh} from '../games/adventure/state.js';
import {createExplore} from '../games/adventure/explore.js';
const state=fresh();state.lang='en';state.world.x=360;state.world.z=-65;state.world.dayTime=60;
let scene,camera,view='city',fixedTime=35,holdLightning=false,errors=[];const output=document.querySelector('output');
addEventListener('error',e=>errors.push(e.message));addEventListener('unhandledrejection',e=>errors.push(String(e.reason)));
const W={...T,WebGLRenderer:class extends T.WebGLRenderer{constructor(o){super(o);const draw=this.render.bind(this);this.render=(s,c)=>{scene=s;camera=c;if(holdLightning)s.traverse(g=>{if(g.name.startsWith('Travelling thunderstorm'))g.children.forEach(c=>{if(c.name==='Lightning shaft'||c.isLineSegments&&c.material.toneMapped===false)c.visible=true;});});
 const water=s.getObjectByName('Rounded ocean horizon');if(water)water.material.uniforms.time.value+=fixedTime;
 if(view){const v=c.clone();if(view==='city'){v.position.set(390,19,15);v.lookAt(355,4,-75);}else if(view==='storm'){v.position.set(-50,18,-295);v.lookAt(-60,30,-365);}else{v.position.set(50,7,280);v.lookAt(-5,2,220);}v.updateMatrixWorld();
 // The normal camera-relative celestial system uses the preview camera too.
 const sky=s.getObjectByName('Sun moon and stars'),moon=s.getObjectByName('Moon');if(sky&&moon){sky.position.copy(v.position);positionMoon(moon,v);}if(water)water.material.uniforms.oceanFocus.value.set(v.position.x,-v.position.z);draw(s,v);
 }else draw(s,c);};}}};
createExplore(document.querySelector('main'),{state,save(){},joy:{effect(){},gesture(){},note(){},boat(){}},motion:()=>true,load:()=>Promise.resolve(W),openBook(){},openHome(){}});
const set=(name,fn)=>document.querySelector('#'+name).onclick=fn;
set('night',()=>{state.world.dayTime=180;view='city';output.textContent='Midnight · automatic clock continues';});set('day',()=>{state.world.dayTime=60;view='city';output.textContent='Noon';});set('storm',()=>{state.world.x=-50;state.world.z=-365;state.world.dayTime=65;view='storm';output.textContent='Moving northern storm · watch lightning';});set('ocean',()=>{state.world.x=0;state.world.z=250;state.world.dayTime=60;view='ocean';output.textContent='Offshore swell set';});set('play',()=>{view=null;output.textContent='Normal gameplay camera';});set('hide',()=>document.querySelector('aside').hidden=true);
set('verify',async()=>{try{const assert=(v,m)=>{if(!v)throw Error(m);},wait=ms=>new Promise(r=>setTimeout(r,ms));state.world.dayTime=180;await wait(600);assert(scene.getObjectByName('Moon').visible,'moon visible');assert(!scene.getObjectByName('Sun').visible,'sun below horizon');const lights=scene.children.filter(x=>x.isLight);assert(lights.some(l=>l.isHemisphereLight&&l.intensity>=.6&&l.intensity<1),'readable moonlit fill');assert(scene.environmentIntensity>=.08&&scene.environmentIntensity<.2,'moonlit reflections');assert(scene.getObjectByName('Offshore rolling wave sets'),'3D swell geometry');assert(scene.children.some(g=>g.name.startsWith('Regional weather')),'storm system');assert(!errors.length,errors.join('; '));output.textContent='PASS full game night, large moon, cinematic lighting/reflections, moving storms, swell renderer, no errors';}catch(e){output.textContent='FAIL '+e.message;console.error(e);}});

set('taxi',async()=>{let key;const wait=ms=>new Promise(r=>setTimeout(r,ms));try{
 view=null;state.world.dayTime=180;
 const taxis=[];scene.traverse(g=>{if(g.name==='Panama yellow taxi')taxis.push(g);});
 const solids=createWorldCollision({state});const taxi=taxis.find(g=>{const h=g.rotation.y;return [3.6,4,7,10,14].every(d=>canDriveOnLand(g.position.x+Math.sin(h)*d,g.position.z+Math.cos(h)*d)&&solids.clear(g.position.x+Math.sin(h)*d,g.position.z+Math.cos(h)*d));});if(!taxi)throw Error('no open taxi lane');
 const h=taxi.rotation.y,p=state.world.city.car;p.x=taxi.position.x+Math.sin(h)*3.6;p.z=taxi.position.z+Math.cos(h)*3.6;p.heading=h;state.world.x=p.x;state.world.z=p.z;await wait(400);
 const b=[...document.querySelectorAll('.world-action')].find(b=>!b.hidden&&b.textContent.includes('Drive Lamborghini'));if(!b)throw Error('drive prompt');b.click();await wait(300);
 const forward=Math.abs(Math.sin(h))>.7?(Math.sin(h)>0?'ArrowRight':'ArrowLeft'):(Math.cos(h)>0?'ArrowDown':'ArrowUp'),start={x:p.x,z:p.z};let moved=0;
 for(const direction of [...new Set([forward,'ArrowDown','ArrowUp','ArrowLeft','ArrowRight'])]){key=direction;document.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true}));await wait(1200);document.dispatchEvent(new KeyboardEvent('keyup',{key,bubbles:true}));key=null;moved=Math.hypot(p.x-start.x,p.z-start.z);if(moved>1&&!vehicleOverlap(p,{x:taxi.position.x,z:taxi.position.z,heading:taxi.rotation.y,length:1.8,width:.9}))break;}
 if(moved<1||vehicleOverlap(p,{x:taxi.position.x,z:taxi.position.z,heading:taxi.rotation.y,length:1.8,width:.9}))throw Error('car still touching original taxi: '+moved.toFixed(2));if(!scene.children.some(o=>o.name==='Lamborghini night headlight'&&o.visible))throw Error('headlights');if(errors.length)throw Error(errors.join('; '));output.textContent='PASS actual driving escaped taxi contact '+moved.toFixed(1)+'m, night headlights active, no errors';
 }catch(e){output.textContent='FAIL '+e.message;console.error(e);}finally{if(key)document.dispatchEvent(new KeyboardEvent('keyup',{key,bubbles:true}));}});

set('bolt',async()=>{view='storm';state.world.x=-50;state.world.z=-365;state.world.dayTime=65;output.textContent='Waiting for natural lightning phase…';for(let i=0;i<230;i++){let lit=false;scene.traverse(g=>{if(g.name.startsWith('Travelling thunderstorm'))lit ||=g.children.some(c=>c.isLineSegments&&c.material.toneMapped===false&&c.visible);});if(lit){holdLightning=true;output.textContent='Natural lightning geometry held for visual inspection';return;}await new Promise(r=>setTimeout(r,100));}});

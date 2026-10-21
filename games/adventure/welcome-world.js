import {createExplore} from './explore.js?v=225';
import {fresh} from './state.js?v=225';
// Warm the actual game once. The welcome camera is only a temporary view;
// entering hands ownership of the same canvas, scene and GPU resources to Play.
export function createWelcomeWorld(host,{motion=()=>true,state:initial,options={}}={}){
 const stage=document.createElement('main');stage.className='explore-world welcome-world';stage.setAttribute('aria-hidden','true');stage.inert=true;host.prepend(stage);
 const state=initial?JSON.parse(JSON.stringify(initial)):fresh(),savedTime=state.world.dayTime;state.world.dayTime=60;
 let preview=true,taken=false,disposed=false,elapsed=0,last=0,arriving=true,arrivalTime=0;
 const caption=document.createElement('div');caption.className='arrival-guide-card';caption.setAttribute('role','status');caption.textContent=state.lang==='es'?'🇵🇦 Bienvenida a tu Panamá, Angelique':'🇵🇦 Welcome to your Panama, Angelique';
 const skip=document.createElement('button');skip.type='button';skip.className='arrival-skip';skip.textContent=state.lang==='es'?'👣 Jugar ahora':'👣 Play now';skip.onclick=finishArrival;
 function finishArrival(){if(!arriving)return;arriving=false;stage.classList.remove('guided-arrival');caption.remove();skip.remove();options.joy?.welcomeAudio?.(false);}
 let game=null;
 function ensureGame(){if(game)return;stage.classList.add('guided-arrival');game=createExplore(stage,{...options,state,save(){if(!preview)options.save?.();},paused:()=>preview||arriving||!!options.paused?.(),motion,joy:options.joy||{effect(){},gesture(){},note(){},boat(){}},openBook:options.openBook||(()=>{}),openHome:options.openHome||(()=>{}),load:async()=>{
  const T=await import('./vendor/three.module.min.js');
  return {...T,WebGLRenderer:class extends T.WebGLRenderer{constructor(settings){super(settings);const render=this.render.bind(this),view=new T.PerspectiveCamera();this.render=(scene,camera)=>{
   if(!preview){
    if(!arriving){render(scene,camera);return;}
    const now=performance.now();if(last&&!document.hidden)arrivalTime+=Math.min((now-last)/1000,.1);last=now;
    const duration=motion()?4.8:.7,t=Math.min(1,arrivalTime/duration),ease=t*t*(3-2*t),avatar=scene.getObjectByName('Angelique');
    view.copy(camera);if(motion()){view.position.y+=(1-ease)*20;view.position.z+=(1-ease)*12;if(avatar){const focus=avatar.position.clone();focus.y+=1;view.lookAt(focus);view.quaternion.slerp(camera.quaternion,ease);}}
    const visible=avatar?.visible;if(avatar)avatar.visible=true;render(scene,view);if(avatar)avatar.visible=visible;
    if(t>=1)finishArrival();return;
   }
   const now=performance.now();if(motion()&&last&&!document.hidden)elapsed+=Math.min((now-last)/1000,.1);last=now;
   view.copy(camera);view.position.set(440+Math.sin(elapsed*.035)*10,64,38);view.lookAt(385,16,-58);view.updateMatrixWorld();
   const avatar=scene.getObjectByName('Angelique'),visible=avatar?.visible;if(avatar)avatar.visible=false;
   render(scene,view);if(avatar)avatar.visible=visible;if(!disposed)host.classList.add('showcase-ready');
  };}}};
 }});stage.append(caption,skip);}
 return {flyIn(done){ensureGame();done();},skip(){finishArrival();},takeGame(){if(taken||disposed)return null;ensureGame();taken=true;preview=false;last=0;arrivalTime=0;state.world.dayTime=savedTime;stage.classList.remove('welcome-world');stage.removeAttribute('aria-hidden');stage.inert=false;return {host:stage,game,state};},dispose(){disposed=true;if(!taken){game?.dispose();stage.remove();options.joy?.welcomeAudio?.(false);}host.classList.remove('showcase-ready');}};
}

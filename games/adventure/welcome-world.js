import {createExplore} from './explore.js?v=224';
import {fresh} from './state.js?v=224';
// Warm the actual game once. The welcome camera is only a temporary view;
// entering hands ownership of the same canvas, scene and GPU resources to Play.
export function createWelcomeWorld(host,{motion=()=>true,state:initial,options={}}={}){
 const stage=document.createElement('main');stage.className='explore-world welcome-world';stage.setAttribute('aria-hidden','true');stage.inert=true;host.prepend(stage);
 const state=initial?JSON.parse(JSON.stringify(initial)):fresh(),savedTime=state.world.dayTime;state.world.dayTime=60;
 let preview=true,taken=false,disposed=false,elapsed=0,last=0;
 const game=createExplore(stage,{...options,state,save(){if(!preview)options.save?.();},paused:()=>preview||!!options.paused?.(),motion,joy:options.joy||{effect(){},gesture(){},note(){},boat(){}},openBook:options.openBook||(()=>{}),openHome:options.openHome||(()=>{}),load:async()=>{
  const T=await import('./vendor/three.module.min.js');
  return {...T,WebGLRenderer:class extends T.WebGLRenderer{constructor(settings){super(settings);const render=this.render.bind(this),view=new T.PerspectiveCamera();this.render=(scene,camera)=>{
   if(!preview){render(scene,camera);return;}
   const now=performance.now();if(motion()&&last&&!document.hidden)elapsed+=Math.min((now-last)/1000,.1);last=now;
   view.copy(camera);view.position.set(440+Math.sin(elapsed*.035)*10,64,38);view.lookAt(385,16,-58);view.updateMatrixWorld();
   const avatar=scene.getObjectByName('Angelique'),visible=avatar?.visible;if(avatar)avatar.visible=false;
   render(scene,view);if(avatar)avatar.visible=visible;if(!disposed)host.classList.add('showcase-ready');
  };}}};
 }});
 return {flyIn(done){done();},skip(){},takeGame(){if(taken||disposed)return null;taken=true;preview=false;state.world.dayTime=savedTime;stage.classList.remove('welcome-world');stage.removeAttribute('aria-hidden');stage.inert=false;return {host:stage,game,state};},dispose(){disposed=true;if(!taken){game.dispose();stage.remove();}host.classList.remove('showcase-ready');}};
}

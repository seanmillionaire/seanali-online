import {createExplore} from './explore.js?v=213';
import {fresh} from './state.js?v=213';
// A separate, unsaved world previews the same renderer and scenery as gameplay.
export function createWelcomeWorld(host,{motion=()=>true}={}){
 const stage=document.createElement('div');stage.className='welcome-world';stage.setAttribute('aria-hidden','true');stage.inert=true;host.prepend(stage);
 const state=fresh();state.sound=false;let disposed=false,elapsed=0,last=0;
 const game=createExplore(stage,{state,save(){},paused:()=>true,motion,joy:{effect(){},gesture(){},note(){},boat(){}},openBook(){},openHome(){},load:async()=>{
  const T=await import('./vendor/three.module.min.js');
  return {...T,WebGLRenderer:class extends T.WebGLRenderer{constructor(options){super(options);const render=this.render.bind(this),view=new T.PerspectiveCamera();this.render=(scene,camera)=>{
   const now=performance.now();if(motion()&&last&&!document.hidden)elapsed+=Math.min((now-last)/1000,.1);last=now;
   view.copy(camera);view.position.set(440+Math.sin(elapsed*.035)*10,64,38);view.lookAt(385,16,-58);view.updateMatrixWorld();
   scene.getObjectByName('Angelique')?.traverse(o=>{o.visible=false;});render(scene,view);if(!disposed)host.classList.add('showcase-ready');
  };}}};
 }});
 Object.assign(state.world,{x:360,z:-66,dayTime:60});
 return {flyIn(done){done();},skip(){},dispose(){disposed=true;game.dispose();stage.remove();host.classList.remove('showcase-ready');}};
}

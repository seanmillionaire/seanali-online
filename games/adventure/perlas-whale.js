import {createFruitEmojis} from './fruit-emojis.js';
import {marineWater} from './explore-state.js?v=225';
export const PERLAS_WHALE_HOME={x:560,z:125,radius:115};
export function whaleHabitat(x,z){return Math.hypot(x-560,z-125)<115&&marineWater(x,z);}
export function createPerlasWhale({T,scene}){
 const atlas=createFruitEmojis(T),g=atlas.sprite('whale',610,2,180,15,scene);g.name='One visiting Las Perlas whale';g.material.fog=false;let seed=7319,time=0,remaining=8,visible=false,target=null;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 function choose(){for(let i=0;i<100;i++){const a=random()*Math.PI*2,r=40+random()*68,x=560+Math.cos(a)*r,z=125+Math.sin(a)*r;if(whaleHabitat(x,z)&&Array.from({length:20},(_,j)=>whaleHabitat(g.position.x+(x-g.position.x)*j/19,g.position.z+(z-g.position.z)*j/19)).every(Boolean)){target={x,z};return;}}target=null;}
 g.visible=false;
 return {g,update(dt,active,info){if(active){dt=Math.min(.1,Math.max(0,dt));time+=dt;remaining-=dt;if(remaining<=0){visible=!visible;remaining=visible?16+random()*16:28+random()*55;}if(!target)choose();if(target){const dx=target.x-g.position.x,dz=target.z-g.position.z,d=Math.hypot(dx,dz);if(d<.3)target=null;else{const step=Math.min(d,dt*2.3);g.position.x+=dx/d*step;g.position.z+=dz/d*step;g.material.rotation=Math.sin(time*.35)*.035;}}g.position.y=7.2+Math.sin(time*.8)*.45;g.material.opacity=visible?Math.min(1,remaining/2):0;}g.visible=visible&&!info.indoors&&Math.hypot(info.x-g.position.x,info.z-g.position.z)<220;},dispose(){g.removeFromParent();atlas.dispose();}};
}

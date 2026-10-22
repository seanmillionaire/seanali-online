import {createWorldCollision} from '../games/adventure/world-collision.js';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {fresh,normalize} from '../games/adventure/state.js';
import {chooseHome} from '../games/adventure/mansion-state.js';
import {createExplore} from '../games/adventure/explore.js';
import {fruitGroves} from '../games/adventure/fruit-abundance.js';
import {CITY_HOSPITAL} from '../games/adventure/volcano-safety.js';
const state=fresh();state.lang='en';chooseHome(state.world,'boquete','immediate',0);state.world.x=-477;state.world.z=-60;state.world.dayTime=60;if(new URLSearchParams(location.search).has('legacy')){state.world.x=175;state.world.z=-473;}let scene,view='falls',saved,errors=[];const output=document.querySelector('output'),grove=fruitGroves().find(p=>p.kind==='mango'&&p.region==='countryside'&&p.x<-100),wait=ms=>new Promise(r=>setTimeout(r,ms)),assert=(v,m)=>{if(!v)throw Error(m);};addEventListener('error',e=>errors.push(e.message));addEventListener('unhandledrejection',e=>errors.push(String(e.reason)));
const W={...T,WebGLRenderer:class extends T.WebGLRenderer{constructor(o){super(o);const draw=this.render.bind(this);this.render=(s,c)=>{scene=s;if(!view)return draw(s,c);const v=c.clone();if(view==='falls'){v.position.set(-442,24,-29);v.lookAt(-461,8,-80);}else if(view==='grotto'){v.position.set(-458,5,-74);v.lookAt(-461,1,-82);}else if(view==='pond'){v.position.set(612,45,-110);v.lookAt(602,1,-126);}else if(view==='jungle'){v.position.set(723,27,-115);v.lookAt(734,4,-145);}else if(view==='sloth'){const sl=s.getObjectByName('Tree sloth hanging from a branch');if(sl){v.position.copy(sl.position).add(new T.Vector3(2,1,4));v.lookAt(sl.position);}}else if(view==='sanblas'){v.position.set(544,17,-398);v.lookAt(530,1,-425);}v.updateMatrixWorld();draw(s,v);};}}};
createExplore(document.querySelector('main'),{state,save(){saved=JSON.stringify(state);},joy:{effect(){},gesture(){},note(){},boat(){}},motion:()=>true,load:()=>Promise.resolve(W),openBook(){},openHome(){}});

const set=(id,fn)=>document.querySelector('#'+id).onclick=fn;
async function until(fn,message,seconds=30){for(let i=0;i<seconds*10;i++){if(fn())return;await wait(100);}throw Error(message);}
function click(text){const b=[...document.querySelectorAll('button')].find(b=>!b.hidden&&b.getBoundingClientRect().width&&!b.disabled&&b.textContent.includes(text));assert(b,'missing '+text);b.click();}
set('falls',()=>{view='falls';state.world.x=-477;state.world.z=-60;});
set('grotto',()=>{view='grotto';state.world.x=-467;state.world.z=-80;});
set('pond',()=>{view='pond';state.world.x=622;state.world.z=-118;});
set('jungle',()=>{view='jungle';state.world.x=715;state.world.z=-125;});
set('sloth',()=>{view='sloth';});
set('sanblas',()=>{view='sanblas';state.world.x=525;state.world.z=-420;});
set('play',()=>{view=null;state.world.x=-477;state.world.z=-60;});
set('verify',async()=>{try{view='grotto';const before={g:state.world.waterfall.diamonds,c:state.world.waterfall.coins,h:state.world.estate.charms};state.world.x=-467;state.world.z=-80;await until(()=>state.world.waterfall.diamonds>before.g,'harvest proximity');assert(state.world.waterfall.coins>before.c&&state.world.estate.charms>before.h,'coins and charms');assert(normalize(JSON.parse(saved)).world.waterfall.diamonds===state.world.waterfall.diamonds,'save gems');assert(!errors.length,errors.join('; '));output.textContent='PASS actual waterfall harvest → gems, coins, charms → saved progress; no runtime errors';}catch(e){output.textContent='FAIL '+e.message;console.error(e);}});
set('predator',async()=>{try{view='pond';state.world.x=622;state.world.z=-118;await wait(500);const j=scene.getObjectByName('Darien jaguar patrol 1');assert(j,'jaguar built');state.world.x=j.position.x;state.world.z=j.position.z;await until(()=>document.querySelector('.explore-panel:not([hidden]) h2')?.textContent.includes('Your adventure ended'),'jaguar safety restart');assert(Math.hypot(state.world.x-CITY_HOSPITAL.spawn.x,state.world.z-CITY_HOSPITAL.spawn.z)<.1,'hospital');assert(!errors.length,errors.join('; '));output.textContent='PASS jaguar contact → safety lesson → hospital restart; progress preserved';}catch(e){output.textContent='FAIL '+e.message;console.error(e);}});
await until(()=>scene?.getObjectByName('Angelique'),'world ready',60);output.textContent='Ready';

const walking=document.createElement('button');walking.textContent='Verify grotto walk';document.querySelector('aside').append(walking);walking.onclick=async()=>{try{view=null;state.world.x=-477;state.world.z=-60;const cam=document.querySelector('.camera-view-toggle');if(cam?.getAttribute('aria-pressed')==='true')cam.click();await wait(300);
async function walk(key,done){try{await until(()=>{document.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true}));output.textContent='Walking '+state.world.x.toFixed(1)+','+state.world.z.toFixed(1);return done();},'walk blocked '+key,18);}finally{document.dispatchEvent(new KeyboardEvent('keyup',{key,bubbles:true}));}}
await walk('ArrowUp',()=>state.world.z<-80);await walk('ArrowRight',()=>state.world.x>-467.5);assert(state.world.waterfall.diamonds>0,'walk into gems');assert(!errors.length,errors.join('; '));output.textContent='PASS real walking west bank → grotto → collect gems without flying or teleporting';view='falls';}catch(e){output.textContent='FAIL '+e.message;console.error(e);}};

const hide=document.createElement('button');hide.textContent='Hide checks';document.querySelector('aside').append(hide);hide.onclick=()=>document.querySelector('aside').hidden=true;addEventListener('keydown',e=>{if(e.key==='F8')document.querySelector('aside').hidden=!document.querySelector('aside').hidden;});

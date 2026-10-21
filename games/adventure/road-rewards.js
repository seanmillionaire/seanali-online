import {HIGHWAY_CURVES,HIGHWAY_WIDTH,roadDistance,traversable,inWater} from './explore-state.js?v=224';
export const ROAD_REWARDS=[
 {id:'baru',road:'cityToBaru',kind:'balloon',icon:'🎈',es:'Vuelo sobre Barú',en:'Barú sky ride'},
 {id:'volcan',road:'volcanTownStreet',kind:'scooter',icon:'🛴',es:'Scooter de Volcán',en:'Volcán scooter'},
 {id:'boquete',road:'boqueteStreet',kind:'scooter',icon:'🛴',es:'Scooter de Boquete',en:'Boquete scooter'},
 {id:'gorgona',road:'gorgonaBeachAccess',kind:'jetski',icon:'🌊',es:'Moto acuática',en:'Jet ski'},
 {id:'west',road:'gorgonaTownStreet',kind:'scooter',icon:'🛴',es:'Paseo por la costa',en:'Coastal scooter'},
 {id:'colon',road:'colonCity',kind:'balloon',icon:'🎈',es:'Vuelo por el Caribe',en:'Caribbean sky ride'},
 {id:'east',road:'panamaEast',kind:'scooter',icon:'🛴',es:'Scooter de la ciudad',en:'City scooter'}
];
export function rewardSite(reward,clear=()=>true,height=null){
 const path=HIGHWAY_CURVES[reward.road],[x,z]=path.at(-1),[px,pz]=path.at(-2),heading=Math.atan2(x-px,z-pz),candidates=[];
 for(let d=6;d<=22;d+=2)for(let i=0;i<24;i++){const a=heading+i*Math.PI/12,q={x:x+Math.sin(a)*d,z:z+Math.cos(a)*d};if(roadDistance(q.x,q.z)<HIGHWAY_WIDTH/2+2.5||inWater(q.x,q.z)||!traversable(q.x,q.z))continue;if(height){const levels=[[0,0],[3,0],[-3,0],[0,3],[0,-3]].map(([dx,dz])=>height(q.x+dx,q.z+dz));if(Math.max(...levels)-Math.min(...levels)>.6)continue;}if([[0,0],[2,0],[-2,0],[0,2],[0,-2]].every(([dx,dz])=>clear(q.x+dx,q.z+dz)))candidates.push({...q,heading,score:d+Math.abs(i-12)*.02});}
 return candidates.sort((a,b)=>a.score-b.score)[0]||null;
}
export function createRewardModels({T,make,mat,geometry,box,ball,cylinder}){
 const yellow=mat('#ffd14b',{metalness:.35,roughness:.3}),teal=mat('#06acb2',{metalness:.35,roughness:.28}),dark=mat('#243642'),chrome=mat('#dce6e6',{metalness:.8,roughness:.2});
 function scooter(parent){const g=new T.Group();g.name='Rideable mountain scooter';parent.add(g);make(box,teal,0,.22,0,.34,.13,1.15,g);for(const z of [-.46,.46]){const w=make(cylinder,dark,0,.18,z,.18,.12,.18,g);w.rotation.z=Math.PI/2;}make(cylinder,chrome,0,.68,.43,.035,.94,.035,g);make(box,dark,0,1.15,.43,.7,.07,.08,g);make(ball,yellow,0,.9,.48,.07,.07,.04,g);return g;}
 function jetski(parent){const g=new T.Group();g.name='Rideable coastal jet ski';parent.add(g);make(ball,teal,0,.23,0,.68,.32,1.5,g);make(ball,yellow,0,.42,.58,.56,.24,.82,g);make(box,dark,0,.49,-.25,.39,.16,1.05,g);make(cylinder,chrome,0,.68,.55,.045,.45,.045,g);make(box,dark,0,.88,.55,.72,.09,.13,g);for(const x of [-.46,.46])make(box,chrome,x,.34,-.3,.14,.07,1.2,g);return g;}
 return {scooter,jetski};
}
export function createRoadRewards(o){
 const {T,scene,make,mat,box,ball,cylinder,height,clear,models,lang}=o,root=new T.Group();root.name='Main road destination rewards';scene.add(root);const resources=[],stations=[];
 for(const reward of ROAD_REWARDS){const site=rewardSite(reward,clear,height);if(!site)continue;const p={...reward,...site},g=new T.Group();g.name=reward.en;g.position.set(p.x,height(p.x,p.z),p.z);root.add(g);make(cylinder,mat('#f5d88a'),0,.2,0,2.2,.4,2.2,g);
  if(p.kind==='scooter'){const display=models.scooter(g);display.position.y=.4;display.rotation.y=Math.PI/2;display.scale.setScalar(1.4);}else if(p.kind==='jetski'){const display=models.jetski(g);display.position.y=.4;display.rotation.y=Math.PI/2;}else{make(box,mat('#aa774c'),0,.45,0,1.3,.8,1.1,g);make(ball,mat('#f4b743'),0,4.8,0,1.8,2.3,1.8,g);for(const x of [-.5,.5])make(cylinder,mat('#e4d8b9'),x,2,0,.025,3,.025,g);}
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=192;const ctx=canvas.getContext('2d');ctx.fillStyle='#153e43';ctx.fillRect(0,0,768,192);ctx.fillStyle='#ffe6a1';ctx.textAlign='center';ctx.font='bold 48px sans-serif';ctx.fillText(p.icon+' '+p[lang==='es'?'es':'en'],384,78);ctx.fillStyle='white';ctx.font='36px sans-serif';ctx.fillText(lang==='es'?'✨ ¡Pruébalo gratis!':'✨ Free to try!',384,145);const tex=new T.CanvasTexture(canvas),material=new T.SpriteMaterial({map:tex,depthTest:true,fog:false});const sign=new T.Sprite(material);sign.position.set(0,p.kind==='balloon'?8:4.1,0);sign.scale.set(6.8,1.7,1);g.add(sign);resources.push(tex,material);stations.push(p);
 }
 return {root,stations,nearest(x,z){return stations.find(p=>Math.hypot(x-p.x,z-p.z)<4.8);},dispose(){scene.remove(root);resources.forEach(r=>r.dispose());}};
}

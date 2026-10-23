import {createFruitEmojis} from './fruit-emojis.js';
import {animalBuilder,animalSurface,animalLoft} from './animal-craft.js';
export function landAnimalModels(o){
 const emblems=createFruitEmojis(o.T);
 const {T,mat}=o,{p,link,tube,finish}=animalBuilder(o),scales=animalSurface(T,mat),furMap=animalSurface(T,mat,'fur'),hide=mat('#4f6742',{roughness:.86,bumpMap:scales,bumpScale:.035}),pale=mat('#9eaa73',{roughness:.9}),dark=mat('#15221b'),claw=mat('#b6aa83'),amber=mat('#b59a47',{roughness:.38}),fur=mat('#8a8170',{roughness:1,bumpMap:furMap,bumpScale:.035}),face=mat('#c2b598'),mask=mat('#504c3f');
 function reptile(parent,frog=false){const g=new T.Group();parent.add(g);g.name=frog?'Darién forest frog':'Darién green iguana';const legs=[];
  if(frog)p(hide,0,.26,-.04,.18,.13,.24,g);else o.make(animalLoft(T,o.geometry,[[-2.1,.10,.003,.003],[-1.45,.16,.04,.035],[-.8,.21,.10,.09],[-.4,.26,.19,.17],[0,.27,.22,.19],[.4,.29,.15,.13],[.59,.35,.17,.14],[.8,.34,.13,.095],[.87,.34,.005,.005]],81),hide,0,0,0,1,1,1,g);p(pale,0,.18,.12,frog?.14:.16,.10,frog?.18:.44,g);if(frog)p(hide,0,.31,.20,.17,.10,.12,g);
  for(const s of [-1,1]){p(amber,s*(frog?.12:.13),frog?.38:.43,frog?.22:.66,.041,.038,.043,g);p(dark,s*(frog?.13:.145),frog?.39:.44,frog?.25:.685,.020,.022,.018,g);if(!frog){p(pale,s*.16,.29,.55,.065,.07,.07,g);link(dark,[s*.13,.30,.63],[s*.13,.30,.82],.007,.006,g);}for(const z of frog?[-.16,.14]:[-.32,.35]){const leg=new T.Group();leg.position.set(s*.16,.23,z);g.add(leg);link(hide,[0,0,0],[s*.20,-.07,-.16],frog?.075:.06,.04,leg);link(hide,[s*.20,-.07,-.16],[s*.23,-.18,.04],.04,.025,leg);for(let j=0;j<4;j++){const toe=s*(.18+j*.035);link(pale,[s*.23,-.18,.04],[toe,-.21,.20+j*.012],.016,.005,leg);if(!frog)link(claw,[toe,-.21,.20+j*.012],[toe,-.21,.25+j*.012],.008,.001,leg);}legs.push(leg);}}
  let tail=null;if(!frog){const dewlap=p(pale,0,.19,.59,.028,.17,.18,g);dewlap.rotation.x=.35;tail=new T.Group();tail.position.set(0,.11,-1.95);g.add(tail);link(hide,[0,0,0],[.04,-.03,-.20],.025,.001,tail);for(let i=0;i<14;i++){const z=-.53+i*.078,h=.10+Math.sin(i/13*Math.PI)*.06;link(pale,[0,.40,z],[0,.40+h,z-.025],.028,.001,g);}}
  else for(let i=0;i<12;i++){const a=i*2.4;p(mask,Math.cos(a)*.12,.34+(i%2)*.025,Math.sin(a)*.16,.023,.009,.032,g);}
  finish(g);return {g,legs,tail};
 }
 function sloth(parent){const g=new T.Group();g.name='Living three-toed tree sloth';parent.add(g);
  p(fur,0,-.16,0,.38,.24,.27,g);const head=new T.Group();head.position.set(.38,-.13,.03);g.add(head);p(fur,0,0,0,.20,.19,.20,head);p(face,.06,-.025,.12,.16,.13,.10,head);
  for(const side of [-1,1]){p(mask,.07+side*.075,.005,.20,.065,.04,.018,head);p(dark,.07+side*.075,.008,.217,.016,.018,.01,head);}p(dark,.07,-.05,.218,.028,.025,.018,head);
  const limbs=[];for(const x of [-.25,.25])for(const z of [-.20,.20]){const limb=new T.Group();limb.position.set(x,-.08,z);g.add(limb);link(fur,[0,0,0],[.06,.30,0],.08,.055,limb);link(fur,[.06,.30,0],[.10,.57,0],.055,.035,limb);for(let k=0;k<3;k++)tube(claw,[[.10,.57,(k-1)*.027],[.15,.61,(k-1)*.027],[.20,.56,(k-1)*.027]],.012,limb);limbs.push(limb);}
  finish(g);return {g,animate(time){const cycle=time*.18;g.position.x=Math.sin(cycle*.25)*.48;g.rotation.z=Math.sin(cycle)*.025;head.rotation.y=Math.sin(cycle*.65)*.20;head.rotation.z=Math.sin(cycle*.4)*.06;limbs.forEach((l,i)=>{l.rotation.z=Math.sin(cycle+i*Math.PI*.5)*.10;l.rotation.x=Math.sin(cycle+i*Math.PI)*.035;});}};
 }
 function turtle(parent){const g=new T.Group();g.name='Beach nesting turtle';g.userData.nativeEmoji='turtle';parent.add(g);emblems.sprite('turtle',0,.50,0,1.15,g);return {g};}
 return {reptile,sloth,turtle,dispose:()=>emblems.dispose()};
}
export function detailedDog(o,parent){const {T,mat}=o,{p,link,tube,finish}=animalBuilder({...o,geometry:o.geometry||((g)=>g)}),g=new T.Group();g.name='Coco · Angelique’s dog';parent.add(g);const map=animalSurface(T,mat,'fur'),fur=mat('#b58a51',{roughness:.93,bumpMap:map,bumpScale:.025}),cream=mat('#dcc79b',{roughness:1}),dark=mat('#292820'),nose=mat('#1e2321',{roughness:.4}),eye=mat('#62482b'),pink=mat('#7d5145');
 p(fur,0,.54,-.03,.24,.26,.56,g);p(cream,0,.57,.32,.22,.28,.23,g);p(fur,0,.85,.40,.205,.235,.25,g);p(cream,0,.76,.64,.16,.12,.23,g);p(nose,0,.80,.85,.075,.053,.04,g);const legs=[];
 for(const s of [-1,1]){p(eye,s*.135,.94,.58,.041,.035,.027,g);p(nose,s*.14,.942,.603,.022,.025,.012,g);const ear=p(fur,s*.21,.83,.33,.085,.25,.15,g);ear.rotation.z=s*.15;link(dark,[s*.04,.72,.77],[s*.13,.74,.71],.006,.005,g);for(const z of [-.36,.32]){const leg=new T.Group();leg.position.set(s*.18,.48,z);g.add(leg);p(fur,0,-.08,-.015,.08,.20,.10,leg);link(fur,[0,-.17,0],[0,-.39,.03],.057,.042,leg);p(cream,0,-.42,.08,.075,.052,.12,leg);for(let j=0;j<3;j++)p(dark,(j-1)*.035,-.435,.17,.008,.012,.023,leg);legs.push(leg);}}
 const tail=new T.Group();tail.position.set(0,.64,-.49);g.add(tail);tube(fur,[[0,0,0],[0,.10,-.24],[.05,.30,-.40],[.10,.41,-.43]],.07,tail);for(let i=0;i<5;i++)p(cream,.025,.09+i*.05,-.22-i*.04,.08,.07,.12,tail);
 link(mat('#77634b'),[-.18,.69,.34],[.18,.69,.34],.026,.026,g);p(mat('#baab75',{metalness:.5,roughness:.4}),0,.66,.45,.035,.045,.012,g);finish(g);return {g,legs,tail};}


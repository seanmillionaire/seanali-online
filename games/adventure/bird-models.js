import {animalBuilder,featherWingGeometry,animalSurface,animalLoft} from './animal-craft.js';
const modelCache=new WeakMap();
function birdRig(g,wings,parrot){function animate(t,{flying=false,moving=false}={}){const flap=flying?Math.sin(t*(parrot?9:7.5))*.63:0;wings.forEach((w,i)=>{const s=i===0?-1:1;w.rotation.z=s*(flying?.15+flap:-1.24);w.rotation.y=s*(flying?-.1:.27);});g.rotation.x=flying?.72:0;const feet=g.getObjectByName('Flight feet');if(feet)feet.rotation.x=flying?1.15:0;}animate(0);return {g,wings,animate};}
export function createDetailedBird(o,parent,kind='toucan'){
 let cache=modelCache.get(o.geometry);if(!cache)modelCache.set(o.geometry,cache=new Map());if(cache.has(kind)){const g=cache.get(kind).clone(true);parent.add(g);return birdRig(g,[-1,1].map(s=>g.getObjectByName('Flight wing '+s)),kind==='parrot');}
 const {T,mat,geometry,make}=o,{p,link,finish}=animalBuilder(o),g=new T.Group();parent.add(g);g.name=kind==='toucan'?'Darién toucan':'Detailed '+kind;const owl=kind==='owl',parrot=kind==='parrot',heron=kind==='heron',map=animalSurface(T,mat,'fur');
 const primary=mat(owl?'#756c56':parrot?'#307249':heron?'#a6ada3':'#202b28',{roughness:.88,bumpMap:map,bumpScale:.012}),light=mat(owl?'#c4bba2':parrot?'#7a9b43':heron?'#d6d7ca':'#d7b537'),dark=mat('#1d2927'),beak=mat(parrot?'#b9a273':owl?'#84794f':heron?'#ad9259':'#78a54b'),tip=mat('#b5593c'),feet=mat(kind==='toucan'?'#657e87':'#84785b'),iris=mat(owl?'#9b823e':'#3c3b25',{roughness:.3});
 const bodyGeo=animalLoft(T,geometry,[[-.48,.47,.01,.02],[-.31,.54,.16,.19],[-.02,.59,.22,.29],[.20,.64,.18,.25],[.32,.73,.08,.16],[.34,.78,.01,.02]],49,16),colors=[],base=new T.Color(),mainColor=primary.color,bibColor=light.color;for(let i=0;i<bodyGeo.attributes.position.count;i++){const z=bodyGeo.attributes.position.getZ(i),x=bodyGeo.attributes.position.getX(i);base.copy(!owl&&z>.16&&Math.abs(x)<.18?bibColor:mainColor);colors.push(base.r,base.g,base.b);}bodyGeo.setAttribute('color',new T.Float32BufferAttribute(colors,3));make(bodyGeo,mat('#ffffff',{vertexColors:true,roughness:.9}),0,0,0,1,1,1,g);p(primary,0,.94,.17,.17,.18,.19,g);
 if(owl)for(const s of [-1,1]){p(light,s*.085,.96,.327,.11,.14,.034,g);p(iris,s*.086,.976,.356,.042,.048,.018,g);p(dark,s*.086,.978,.371,.024,.030,.010,g);}
 else for(const s of [-1,1]){p(light,s*.143,.98,.264,.028,.031,.015,g);p(iris,s*.153,.984,.275,.018,.020,.012,g);p(dark,s*.159,.985,.283,.009,.012,.005,g);}
 if(kind==='toucan'){const bill=animalLoft(T,geometry,[[.29,.94,.05,.07],[.40,.96,.10,.14],[.62,.95,.10,.13],[.82,.91,.05,.09],[.90,.88,.002,.008]],41,14),colors=[];for(let i=0;i<bill.attributes.position.count;i++){const z=bill.attributes.position.getZ(i),color=z>.71?tip.color:z<.36?light.color:beak.color;colors.push(color.r,color.g,color.b);}bill.setAttribute('color',new T.Float32BufferAttribute(colors,3));make(bill,mat('#ffffff',{vertexColors:true,roughness:.65}),0,0,0,1,1,1,g);link(dark,[-.10,.85,.37],[-.027,.85,.85],.007,.003,g);link(dark,[.10,.85,.37],[.027,.85,.85],.007,.003,g);}
 else if(heron){link(beak,[0,.95,.31],[0,.92,.83],.055,.001,g);}
 else{p(beak,0,.88,.37,.072,.10,.13,g);p(dark,0,.84,.44,.053,.073,.058,g);}
 for(let i=-2;i<=2;i++){const tail=p(primary,i*.055,.39,-.48,.055,.04,(parrot?.48:.27)-Math.abs(i)*.03,g);tail.rotation.y=i*.06;}
 const feetRig=new T.Group();feetRig.name='Flight feet';feetRig.position.set(0,.38,0);g.add(feetRig);
 for(const s of [-1,1]){link(feet,[s*.09,0,0],[s*.09,-.26,.04],.025,.017,feetRig);for(const z of [-.10,.17])for(const dx of [-.025,.025])link(feet,[s*.09,-.26,.04],[s*.09+dx,-.30,z],.014,.006,feetRig);}
 const wings=[],wingGeo=featherWingGeometry(T,geometry);
 for(const s of [-1,1]){const w=new T.Group();w.name='Flight wing '+s;w.position.set(s*.19,.69,-.03);g.add(w);const mesh=make(wingGeo,primary,0,0,0,s*.52,.65,.65,w);mesh.material.side=T.DoubleSide;for(let j=0;j<6;j++){const cover=p(primary,s*(.12+j*.07),.005,-.02-j*.025,.085,.022,.14,w);cover.rotation.y=s*.2;}wings.push(w);}
 finish(g);cache.set(kind,g.clone(true));return birdRig(g,wings,parrot);
}


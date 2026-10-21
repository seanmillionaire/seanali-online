import {createHuman} from './character-model.js?v=213';
// Shared recognizable street people, vehicles and plated food; no image downloads.
export function panamaModels({T,make,mat,box,ball,cylinder,cone,geometry}){
 const white=mat('#eeeae3'),dark=mat('#25333e'),glass=mat('#536c73',{metalness:.12,roughness:.17,transparent:true,opacity:.80}),skin=[mat('#a96e43'),mat('#c99465'),mat('#744830')],blue=mat('#204b78'),red=mat('#da363b'),yellow=mat('#f5c857'),silver=mat('#bfc9cb',{metalness:.78,roughness:.23}),foodGold=mat('#e6b347'),fishSkin=mat('#b5a477'),green=mat('#79a752');
 const textures=[];
 const part=(g,m,x,y,z,w,h,d,parent)=>make(g,m,x,y,z,w,h,d,parent);
 function sign(parent,words,x,y,z,w=2,h=.5){if(typeof document==='undefined')return null;const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');if(!ctx)return null;ctx.fillStyle='#193f73';ctx.fillRect(0,0,512,128);for(let i=0;i<18;i++){ctx.fillStyle=i%2?'#f0c33e':'#d9353c';ctx.beginPath();ctx.arc(i*34,118,18,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#fff4ca';ctx.font='900 45px sans-serif';ctx.textAlign='center';ctx.fillText(words,256,78,490);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;textures.push(texture);return part(box,mat('#ffffff',{map:texture,roughness:.7}),x,y,z,w,h,.04,parent);}
 function person(parent,x,y,z,index=0,police=false){const human=createHuman({T,make,mat,geometry},{index,police});human.g.position.set(x,y,z);parent.add(human.g);return human;}

 // Reusable beveled profiles give the cars a hood, boot and sloped glass.
 const profile=(points,width)=>{const shape=new T.Shape();points.forEach(([z,y],i)=>i?shape.lineTo(z,y):shape.moveTo(z,y));shape.closePath();const g=new T.ExtrudeGeometry(shape,{depth:width,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035});g.rotateY(-Math.PI/2);g.translate(width/2,0,0);return geometry(g);};
 const carBody=profile([[-1.62,.48],[-1.64,.75],[-1.2,.89],[.95,.89],[1.63,.71],[1.65,.48]],1.57),carCabin=profile([[-1.08,.87],[-.69,1.36],[.38,1.36],[.91,.87]],1.34),tire=geometry(new T.TorusGeometry(.255,.075,6,16));
 const lamp=mat('#fff7d0',{emissive:'#fff0b2',emissiveIntensity:.35}),tail=mat('#b92b24',{emissive:'#c42219',emissiveIntensity:.2}),rubber=mat('#161d22',{roughness:1});
 let artDisposed=false;const mural=new T.TextureLoader().load('/games/adventure/assets/diablo-mural.jpg',t=>{if(artDisposed)t.dispose();},undefined,()=>{});mural.colorSpace=T.SRGBColorSpace;mural.anisotropy=4;textures.push(mural);const muralPaint=mat('#ffffff',{map:mural,roughness:.47});
 function details(g){const d=new T.Group();d.name='Nearby vehicle craftsmanship';g.add(d);g.userData.visualDetail=d;return d;}
 function wheel(parent,x,y,z,r=.33){const t=part(tire,rubber,x,y,z,r/.33,r/.33,r/.33,parent);t.rotation.y=Math.PI/2;const rim=part(cylinder,silver,x,y,z,r*.57,.025,r*.57,parent);rim.rotation.z=Math.PI/2;return t;}
 // A vehicle is rigid: merge its static pieces by material to reduce phone draw calls.
 function batchVehicle(parent){const groups=new Map();for(const mesh of [...parent.children]){if(!mesh.isMesh)continue;mesh.updateMatrix();const g=mesh.geometry.clone().applyMatrix4(mesh.matrix),key=mesh.material;let a=groups.get(key);if(!a)groups.set(key,a=[]);a.push(g);parent.remove(mesh);}for(const [material,parts]of groups){const arrays={position:[],normal:[],uv:[]},indices=[];let offset=0;for(const g of parts){for(const name of Object.keys(arrays))arrays[name].push(...g.attributes[name].array);const ix=g.index?g.index.array:Array.from({length:g.attributes.position.count},(_,i)=>i);for(const i of ix)indices.push(i+offset);offset+=g.attributes.position.count;g.dispose();}const g=geometry(new T.BufferGeometry());for(const [name,data]of Object.entries(arrays))g.setAttribute(name,new T.Float32BufferAttribute(data,name==='uv'?2:3));g.setIndex(indices);part(g,material,0,0,0,1,1,1,parent);}}
 const taxiYellow=mat('#fbd21e',{roughness:.4,metalness:.08}),taxiBlack=mat('#171d20'),taxiWhite=mat('#fefdf0');
 function sedan(parent,police=false,taxi=false){const g=new T.Group();parent.add(g);g.name=police?'Moving police patrol car':taxi?'Panama yellow taxi':'Moving white Kia-style sedan';
  const bodyColor=taxi?taxiYellow:mat('#dddeda',{metalness:.27,roughness:.26});
  part(carBody,bodyColor,0,0,0,1,1,1,g);part(carCabin,glass,0,0,0,1,1,1,g);part(box,bodyColor,0,1.4,-.12,1.32,.055,1.05,g);
  const d=details(g);const upholstery=mat('#323838',{roughness:.97});for(const sign of [-1,1]){part(box,upholstery,sign*.33,.78,-.25,.48,.16,.7,d);part(box,upholstery,sign*.33,1.05,-.5,.46,.48,.15,d);part(box,upholstery,sign*.33,1.25,-.5,.25,.17,.12,d);}part(box,dark,0,.91,.57,1.28,.12,.22,d);for(const side of [-1,1]){for(const z of [-1.02,1.04])wheel(g,side*.83,.34,z);part(box,bodyColor,side*.7,1.1,-.2,.05,.47,.065,g);part(box,bodyColor,side*.79,.89,.62,.25,.12,.17,d);part(box,dark,side*.8,.65,-.1,.012,.025,2.4,d);part(box,silver,side*.81,.81,-.52,.025,.025,.17,d);part(box,silver,side*.81,.81,.43,.025,.025,.17,d);part(box,lamp,side*.55,.7,1.63,.43,.1,.035,g);part(box,tail,side*.56,.71,-1.64,.38,.11,.035,g);for(const z of [-.96,.15])part(box,dark,side*.81,.65,z,.014,.35,.012,d);}
  part(box,dark,0,.59,1.67,.79,.18,.035,g);for(let i=0;i<4;i++)part(box,silver,0,.53+i*.04,1.69,.74,.012,.02,d);part(box,white,0,.48,1.71,.32,.1,.014,d);part(box,silver,0,.83,1.63,.11,.04,.02,d);part(box,dark,0,.56,-1.68,.5,.12,.03,d);
  if(taxi&&!police){
   for(const side of [-1,1]){
    // Highly visible black/white taxi door stripe on both sides.
    part(box,taxiBlack,side*.817,.68,-.11,.033,.235,1.55,g);
    part(box,taxiWhite,side*.84,.68,-.11,.036,.115,1.42,g);
    part(box,taxiBlack,side*.865,.68,-.11,.039,.035,1.42,g);
   }
   part(box,taxiWhite,0,1.53,-.19,.78,.22,.42,g);
   part(box,taxiBlack,0,1.65,-.19,.62,.045,.31,g);
  }
  let emergencyLights=[];
  if(police){
   for(const side of [-1,1]){
    part(box,blue,side*.827,.68,-.12,.025,.21,2.5,g);
    const badge=sign(d,'POLICÍA',side*.846,.72,0,1.25,.23);if(badge)badge.rotation.y=side*Math.PI/2;
    part(box,silver,side*.69,.55,1.83,.08,.45,.1,d);
   }
   part(box,dark,0,.52,1.86,1.45,.09,.12,d);
   part(cylinder,dark,.55,1.77,-1,.025,.95,.025,d);
   part(box,dark,0,1.47,-.1,1.2,.07,.3,g);
   for(const side of [-1,1]){
    const lens=mat(side<0?'#ff354b':'#308aff',{emissive:side<0?'#ff102d':'#1166ff',emissiveIntensity:2,roughness:.2});
    emergencyLights.push(lens);
    part(box,lens,side*.35,1.57,-.1,.5,.16,.26,g);
    part(box,lens,side*.38,.66,1.7,.18,.08,.04,g);
    part(box,lens,side*.5,1.14,-.79,.2,.07,.045,g);
   }
  }
  batchVehicle(d);batchVehicle(g);g.userData.emergencyLights=emergencyLights;return g;
 }
 function bus(parent){const g=new T.Group();g.name='Detailed Diablo Rojo bus';parent.add(g);const d=details(g);
  // Conventional school-bus silhouette: long passenger cabin and protruding bonnet.
  part(box,red,0,1.22,-.6,2.27,1.8,5.9,g);part(ball,red,0,2.32,-.6,1.16,.38,2.96,g);part(box,yellow,0,.65,0,2.35,.3,7.3,g);part(box,red,0,1.03,2.94,2.13,.62,1.33,g);part(box,glass,0,2.03,2.38,2.06,.87,.045,g);part(box,silver,0,1.8,2.42,.055,1.32,.035,d);
  for(const side of [-1,1]){for(let i=0;i<7;i++){const z=-2.94+i*.75;part(box,glass,side*1.15,1.97,z,.035,.7,.58,g);part(box,silver,side*1.177,1.6,z,.025,.035,.63,d);}part(box,muralPaint,side*1.165,1.13,-.55,.026,.64,5.5,g);for(const y of [.77,1.48])part(box,silver,side*1.185,y,-.55,.035,.035,5.7,d);for(const z of [-2.3,2.43])wheel(g,side*1.22,.47,z,.47);
   part(cylinder,silver,side*1.06,2.5,-3.23,.095,2.7,.095,g);part(box,silver,side*1.38,1.91,2.19,.28,.4,.13,d);part(box,silver,side*1.19,1.94,2.25,.38,.035,.035,d);for(let i=0;i<6;i++)part(ball,[yellow,red,blue][i%3],side*1.1,2.64,-2.8+i*.85,.07,.07,.07,d);part(ball,lamp,side*.81,1.1,3.64,.18,.18,.06,g);part(ball,tail,side*.82,1.29,-3.57,.13,.13,.04,d);}
  const route=sign(g,'PANAMÁ • SAN MIGUELITO',0,2.61,2.43,2.08,.28);part(box,silver,0,.9,3.62,1.36,.65,.08,g);for(let i=0;i<8;i++)part(box,dark,0,.65+i*.07,3.67,1.15,.025,.014,d);part(box,silver,0,.44,3.68,2.28,.17,.15,g);part(box,white,0,.43,3.78,.45,.1,.015,d);for(const x of [-.67,.67]){const horn=part(cone,silver,x,2.65,2.3,.13,.4,.13,d);horn.rotation.x=Math.PI/2;}batchVehicle(d);batchVehicle(g);return g;
 }
 function meal(parent,id,x=0,y=0,z=0,scale=1){const g=new T.Group();g.name='3D Panamanian food: '+id;g.position.set(x,y,z);g.scale.setScalar(scale);parent.add(g);if(id==='raspao'){part(ball,white,0,.5,0,.26,.22,.26,g);for(let i=0;i<8;i++)part(ball,white,Math.sin(i*2.4)*.17,.58+(i%3)*.04,Math.cos(i*2.4)*.17,.075,.065,.075,g);part(cone,white,0,.25,0,.2,.5,.2,g).rotation.z=Math.PI;part(ball,red,0,.55,0,.25,.19,.25,g);part(cylinder,yellow,.1,.75,0,.025,.5,.025,g);}else if(id==='fish'||id==='fishPlate'){part(cylinder,white,0,0,0,.72,.06,.6,g);const fish=part(ball,fishSkin,0,.18,0,.53,.13,.21,g);part(cone,fishSkin,-.55,.17,0,.2,.35,.2,g).rotation.z=Math.PI/2;part(ball,dark,.39,.24,.12,.025,.025,.025,g);for(const side of [-1,1]){const fin=part(cone,foodGold,-.1,.2,side*.22,.12,.25,.07,g);fin.rotation.x=side*Math.PI/2;}for(let i=0;i<4;i++){const score=part(box,foodGold,-.23+i*.14,.305,0,.025,.018,.28,g);score.rotation.y=.3;}part(ball,green,.5,.13,-.34,.14,.07,.14,g);if(id==='fishPlate')for(let i=0;i<4;i++)part(cylinder,foodGold,-.4+i*.25,.12,.39,.14,.08,.14,g);}else if(id==='patacones'){part(cylinder,white,0,0,0,.65,.06,.6,g);for(let i=0;i<6;i++)part(cylinder,foodGold,Math.sin(i*2.4)*.37,.12,Math.cos(i*2.4)*.32,.19,.08,.17,g);}else if(id==='coconutRice'||id==='rice'){part(cylinder,white,0,0,0,.6,.08,.6,g);part(ball,white,0,.16,0,.42,.22,.4,g);for(let i=0;i<5;i++)part(ball,foodGold,Math.sin(i)*.3,.28,Math.cos(i)*.25,.035,.025,.03,g);}else{for(let i=0;i<3;i++){const b=part(ball,green,(i-1)*.15,.2,0,.09,.35,.1,g);b.rotation.z=.3;}}return g;}
 return {sign,person,sedan,bus,meal,dispose:()=>{artDisposed=true;textures.forEach(t=>t.dispose());},colors:{white,dark,glass,blue,red,yellow,green,skin,silver}};
}

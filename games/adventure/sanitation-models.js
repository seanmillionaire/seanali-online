import {pedestrianSpace} from './pedestrian-space.js';
import {createHuman} from './character-model.js';
export function sanitationModels(options){
 const {T,scene,make,mat,geometry,box,ball,cylinder,height}=options;
 const root=new T.Group();root.name='Autonomous garbage and recycling department';scene.add(root);
 const pedestrians=pedestrianSpace(scene);const textures=[],materials=[],iconCache=new Map();
 const material=(c,extra={})=>{const m=mat(c,extra);materials.push(m);return m;};
 const green=material('#277b57',{roughness:.6}),blue=material('#237bab'),dark=material('#252c30'),silver=material('#cad3d1',{metalness:.65,roughness:.35}),white=material('#eeeadd'),orange=material('#ffb32c',{emissive:'#e87805',emissiveIntensity:.7});
 const part=(g,m,x,y,z,w,h,d,parent)=>make(g,m,x,y,z,w,h,d,parent);
 const shape=new T.Shape();[[-2.72,.68],[-2.72,1.95],[-2.35,2.42],[.72,2.42],[1.0,2.13],[1.0,.68]].forEach(([z,y],i)=>i?shape.lineTo(z,y):shape.moveTo(z,y));shape.closePath();const compactor=geometry(new T.ExtrudeGeometry(shape,{depth:2.08,bevelEnabled:true,bevelSize:.07,bevelThickness:.07,bevelSegments:2,steps:1}));compactor.rotateY(-Math.PI/2);compactor.translate(1.04,0,0);
 const glass=material('#426674',{metalness:.18,roughness:.17,transparent:true,opacity:.28}),red=material('#b82d29',{emissive:'#6e1510',emissiveIntensity:.4});
 function icon(text,parent,x,y,z,size=.65){
  let m=iconCache.get(text);if(!m){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');ctx.font='96px "Apple Color Emoji","Segoe UI Emoji",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,64,67);const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;textures.push(tx);m=new T.SpriteMaterial({map:tx,transparent:true,depthWrite:false});materials.push(m);iconCache.set(text,m);}
  const p=new T.Sprite(m);p.position.set(x,y,z);p.scale.set(size,size,1);parent.add(p);return p;
 }
 function bin(parent,x,kind){const g=new T.Group();g.position.x=x;parent.add(g);const paint=kind==='recycle'?blue:green;part(box,paint,0,.46,0,.6,.82,.55,g);const lid=part(box,dark,0,.9,-.02,.66,.08,.63,g);part(box,silver,0,.77,-.32,.38,.04,.05,g);for(const side of [-1,1]){const w=part(cylinder,dark,side*.26,.12,-.21,.11,.07,.11,g);w.rotation.z=Math.PI/2;}icon(kind==='recycle'?'♻️':'🗑️',g,0,.6,.31,.35);return {g,lid};}

 function truck(ri,name){
  const beacon=material('#ffb32c',{emissive:'#e87805',emissiveIntensity:1});
  const g=new T.Group();g.name=name+' collection truck';root.add(g);g.userData.pedestrians=()=>pedestrians.near(g.position.x,g.position.z);
  part(box,dark,0,.48,0,2,.18,6.4,g);part(compactor,ri%2?blue:green,0,0,0,1,1,1,g);part(box,white,0,.85,2,2.1,.8,1.8,g);part(box,white,0,2,2,2.1,.1,1.8,g);for(const x of [-1,1])for(const z of [1.15,2.85])part(box,white,x,1.6,z,.08,.8,.08,g);part(box,glass,0,1.65,2.92,1.8,.65,.035,g);part(box,silver,0,.65,3,2.25,.17,.15,g);
  for(const side of [-1,1]){for(const z of [-2,-.85,2]){const wheel=part(cylinder,dark,side*1.05,.43,z,.43,.24,.43,g);wheel.rotation.z=Math.PI/2;const rim=part(cylinder,silver,side*1.19,.43,z,.22,.025,.22,g);rim.rotation.z=Math.PI/2;}part(box,silver,side*1.09,1.15,-.9,.035,.14,3.55,g);part(box,white,side*.75,.9,2.96,.35,.16,.06,g);part(box,silver,side*1.2,1.65,2.6,.26,.3,.13,g);part(ball,beacon,side*.65,2.05,2,.16,.13,.16,g);}
  for(const side of [-1,1]){part(box,glass,side*1.065,1.65,2,.025,.62,1.25,g);part(box,silver,side*1.085,1.2,2.35,.025,.045,.22,g);for(const z of [-2.1,-.9,.3])part(box,silver,side*1.12,1.55,z,.04,1.45,.045,g);part(box,dark,side*1.12,.62,2,.25,.15,1.4,g);part(box,red,side*.85,.9,-2.9,.18,.3,.06,g);part(cylinder,silver,side*.75,1.32,-2.88,.055,1.35,.055,g);}
  part(box,dark,0,.95,2.97,.95,.32,.04,g);for(let k=0;k<4;k++)part(box,silver,0,.83+k*.075,3,.9,.025,.025,g);for(let k=0;k<6;k++){const strip=part(box,k%2?orange:red,-.75+k*.3,.56,-2.94,.24,.18,.03,g);strip.rotation.z=-.5;}
  const hopper=part(box,dark,0,1.05,-2.82,1.85,.65,.16,g);icon('♻️',g,0,2.65,-.7,.8);
  const driverSkin=material(['#d2a582','#8b6046','#ad7854'][ri%3]);part(ball,orange,-.48,1.43,2.35,.2,.24,.14,g);part(ball,driverSkin,-.48,1.76,2.35,.13,.15,.12,g);part(ball,dark,-.48,1.86,2.32,.14,.06,.12,g);for(const x of [-.64,-.32])part(ball,driverSkin,x,1.43,2.65,.05,.05,.06,g);g.userData.occupants=1;const truck={g,hopper,beacon};
  const human=createHuman(options,{index:ri+24,outfitColor:'#ed8b26',pantsColor:'#304449'});human.g.name='Sanitation crew · '+name;root.add(human.g);part(ball,material('#f6bc38'),0,1.76,0,.14,.055,.13,human.g);const sack=part(ball,dark,.3,.75,.18,.18,.27,.18,human.g);truck.sack=sack;part(box,silver,0,1.13,.14,.39,.055,.025,human.g);part(box,silver,0,1.30,.14,.39,.045,.025,human.g);truck.worker=human;return truck;
 }

 function station(p){
  const g=new T.Group();g.name='Sanitation '+p.id;g.position.set(p.x,height(p.x,p.z),p.z);root.add(g);
  const waste=bin(g,-.55,'waste'),recycle=bin(g,.55,'recycle'),litter=[];
  for(let i=0;i<6;i++){const a=i*2.4;const sprite=icon(i%2?'🧴':'🥡',g,Math.cos(a)*1.45,.22,Math.sin(a)*1.45,.38);litter.push(sprite);}
  const planter=new T.Group();g.add(planter);part(box,green,0,.18,-.8,1.4,.3,.45,planter);for(const x of [-.45,0,.45])icon('🌿',planter,x,.6,-.8,.6);planter.visible=false;
  if(p.depot){for(const x of [-1,1])part(cylinder,silver,x,1.25,-.45,.04,2.5,.04,g);part(box,green,0,2.5,-.45,2.15,.12,.85,g);icon('♻️',g,0,2.15,-.46,.65);}
  const marker=icon(p.depot?'🏭':'📍',g,0,p.depot?3.1:2.2,0,.7);marker.visible=false;
  return {g,waste,recycle,litter,planter,marker};
 }
 function routeLine(route){const points=[];for(let i=0;i<route.length;i++){const a=route[i],b=route[(i+1)%route.length],n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/4));for(let j=0;j<n;j++){const t=j/n,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t;points.push(new T.Vector3(x,(options.roadHeight||height)(x,z)+.12,z));}}
  const geo=geometry(new T.BufferGeometry().setFromPoints(points)),m=new T.LineBasicMaterial({color:'#f8d65c',transparent:true,opacity:.85});materials.push(m);const line=new T.LineLoop(geo,m);line.visible=false;root.add(line);return line;
 }
 return {root,truck,station,routeLine,setLitter(sprite,kind){sprite.material=iconCache.get(kind==='recycle'?'🧴':'🥡');},dispose(){scene.remove(root);textures.forEach(t=>t.dispose());materials.forEach(m=>m.dispose());}};
}

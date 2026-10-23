import {homeReserved} from './mansion-state.js';
import {createResidentRoutine} from './resident-routine.js';
import {createCostaResident} from './costa-residents.js';
import {createCongoGathering} from './costa-congo.js';
import {roadDistance,HIGHWAY_WIDTH} from './explore-state.js';
import {COSTA_HOMES,CARIBBEAN_HOMES,GRANDE_HOMES,CARIBBEAN_COLORS,COSTA_PIER,CRISTO_REEF,ISLA_GRANDE,ISLA_LIGHTHOUSE,costaBlocked} from './costa-arriba-layout.js';
export function createCostaArriba({T,scene,make,mat,geometry,box,ball,cylinder,height,surfaces,models,inWater,forest,state,joy,motion}){
 const congo=createCongoGathering({T,scene,make,mat,geometry,box,ball,cylinder,height,surfaces,state,joy,motion});
 const root=new T.Group();root.name='Costa Arriba · Caribbean barrio and Isla Grande reef';scene.add(root);
 const trim=mat('#f8edd5',{map:surfaces?.plaster,roughness:.8}),wood=mat('#775239',{map:surfaces?.wood}),glass=mat('#245766',{roughness:.22,metalness:.15}),metal=mat('#7a989b',{roughness:.7,metalness:.25}),dark=mat('#483b2e'),leaf=mat('#28733d'),pots=mat('#bc7354'),stone=mat('#b7b3a0',{map:surfaces?.rock});
 const batches=new Map(),dummy=new T.Object3D();
 function part(geo,m,x,y,z,w,h,d,ry=0,rz=0){const key=geo.uuid+m.uuid;if(!batches.has(key))batches.set(key,{geo,m,items:[]});dummy.position.set(x,y,z);dummy.rotation.set(0,ry,rz);dummy.scale.set(w,h,d);dummy.updateMatrix();batches.get(key).items.push(dummy.matrix.clone());}
 const roofGeo=geometry(new T.BufferGeometry());roofGeo.setAttribute('position',new T.Float32BufferAttribute([-.5,0,-.5,.5,0,-.5,0,.3,-.5,-.5,0,.5,.5,0,.5,0,.3,.5],3));roofGeo.setIndex([0,2,1,3,4,5,0,3,5,0,5,2,2,5,4,2,4,1]);roofGeo.computeVertexNormals();
 const air=[];
 for(const [i,p]of CARIBBEAN_HOMES.entries()){
  const accent=mat(CARIBBEAN_COLORS[(i+3)%8],{roughness:.7}),wall=mat(p.color,{map:surfaces?.plaster,roughness:.7}),roof=mat(i%2?'#98776f':'#6c9196',{metalness:.25,roughness:.72}),base=Math.max(...[-1,1].flatMap(a=>[-1,1].map(b=>height(p.x+a*3.5,p.z+b*3))))+(p.stilt?1.5:.18),H=p.floors*2.7;
  const put=(g,m,x,y,z,w,h,d,rz=0)=>{const scale=p.scale||1;x*=scale;y*=scale;z*=scale;w*=scale;h*=scale;d*=scale;const c=Math.cos(p.heading),s=Math.sin(p.heading);part(g,m,p.x+x*c+z*s,base+y,p.z+z*c-x*s,w,h,d,p.heading,rz);};
  if(p.stilt)for(const x of [-3.3,0,3.3])for(const z of [-2.7,2.8]){const c=Math.cos(p.heading),s=Math.sin(p.heading),px=p.x+x*(p.scale||1)*c+z*(p.scale||1)*s,pz=p.z+z*(p.scale||1)*c-x*(p.scale||1)*s,ground=height(px,pz);part(box,wood,px,(ground+base)/2,pz,.24,base-ground,.24);}
  if(!p.stilt)put(box,stone,0,-.3,0,7.6,.6,7.1);
  put(box,trim,0,0,0,7.7,.2,7.2);put(box,wall,0,H/2,-.8,7.1,H,5.4);
  // Painted horizontal weatherboards, corner trim and shaded louvered windows.
  for(let floor=0;floor<p.floors;floor++){
   const y=floor*2.7;
   for(let j=0;j<13;j++)put(box,trim,0,y+.18+j*.195,1.92,7.08,.018,.025);
   for(const x of [-2.1,2.1]){put(box,trim,x,y+1.45,1.95,1.6,1.65,.13);put(box,glass,x,y+1.45,2.03,1.35,1.4,.05);for(const sign of [-1,1]){put(box,accent,x+sign*.99,y+1.45,2.06,.45,1.56,.08);for(let slat=0;slat<7;slat++)put(box,trim,x+sign*.99,y+.85+slat*.18,2.13,.42,.04,.035);}}
   put(box,dark,0,y+1.04,1.95,1.03,2.08,.12);put(box,accent,0,y+1.04,2.03,.87,1.94,.07);put(ball,metal,.31,y+1.03,2.09,.045,.045,.045);
   put(box,wood,0,y+.1,2.75,7.7,.12,1.6);put(box,trim,0,y+1.05,3.45,7.6,.09,.09);
   for(let j=0;j<19;j++){const x=-3.5+j*.39;if(Math.abs(x)<.9&&floor===0)continue;put(box,trim,x,y+.62,3.45,.055,.84,.055);}
   for(const x of [-3.5,3.5]){put(box,trim,x,y+1.4,3.35,.12,2.8,.12);put(box,trim,x,y+1.05,2.75,.08,.08,1.45);}
   for(const side of [-1,1])for(const z of [-2.2,.3]){put(box,trim,side*3.59,y+1.45,z,.08,1.4,1.4);put(box,glass,side*3.64,y+1.45,z,.04,1.17,1.17);put(box,trim,side*3.67,y+1.45,z,.03,.04,1.2);}
  }
  put(roofGeo,roof,0,H+.15,-.3,8.1,5.6,7.9);put(box,trim,0,H+1.87,-.3,.14,.12,8);
  for(let j=0;j<14;j++)for(const sign of [-1,1])put(box,metal,sign*2,H+.99,-4+j*.57,4.34,.035,.035,-sign*.395);
  for(const x of [-3.5,3.5])put(box,trim,x,H-.05,0,.12,.18,7.7);
  for(let j=0;j<(p.stilt?8:1);j++)put(box,p.stilt?wood:stone,0,-.18-j*.18,3.8+j*.27,1.5,.18,.32);
  for(const x of [-2.9,2.9]){put(cylinder,pots,x,.24,3.05,.23,.4,.23);put(ball,leaf,x,.63,3.05,.4,.45,.3);}
  // Porch seats and a small table make each yard feel lived in.
  put(box,wood,2,.43,2.8,1,.12,.65);put(box,wood,2,.8,2.53,1,.75,.08);for(const sx of [-.4,.4])put(box,wood,2+sx,.2,2.8,.07,.4,.5);
  air.push({x:p.x,z:p.z,w:p.w,d:p.d,bottom:height(p.x,p.z),top:base+(H+1.9)*(p.scale||1)});
 }
 air.push({x:CRISTO_REEF.x,z:CRISTO_REEF.z,w:3.2,d:.8,bottom:-1,top:5.5});scene.userData.costaAir=air;
 const pier=COSTA_PIER;for(let i=0;i<40;i++){const z=pier.z-pier.d/2+i*pier.d/40;part(box,wood,pier.x,.5,z,pier.w,.16,pier.d/40-.025);if(i%8===0)for(const side of [-1,1])part(cylinder,wood,pier.x+side*(pier.w/2-.12),-.1,z,.12,2,.12);}
 // Concrete reef cross, with a dark bronze figure: an original, respectful interpretation.
 const {x,z}=CRISTO_REEF;part(cylinder,stone,x,-.45,z,1.4,1.4,1.3);part(box,stone,x,2.65,z,.32,5.7,.30);part(box,stone,x,4.25,z,3.15,.28,.30);
 const bronze=mat('#33251f',{metalness:.33,roughness:.72}),cloth=mat('#e0d9c5',{roughness:.93});
 part(ball,bronze,x,3.92,z+.26,.23,.3,.23);part(ball,bronze,x,3.22,z+.27,.33,.63,.20);part(box,cloth,x,2.62,z+.28,.65,.65,.38);
 for(const side of [-1,1]){part(cylinder,bronze,x+side*.77,3.88,z+.25,.09,1.35,.09,0,-side*1.12);part(ball,bronze,x+side*1.4,4.17,z+.25,.11,.12,.10);part(cylinder,bronze,x+side*.13,2.05,z+.25,.1,1.05,.1);part(ball,bronze,x+side*.13,1.53,z+.38,.11,.09,.2);}
 // Reef stones remain submerged; the cross is anchored, never floating.
 for(let i=0;i<7;i++)part(ball,stone,x+Math.sin(i*2.4)*1.4,-.4,z+Math.cos(i*2.4)*1.2,.5,.45,.5);
 // A small timber landing on Isla Grande, separate from the reef landmark.
 for(let i=0;i<18;i++)part(box,wood,175,.5,ISLA_GRANDE.z+41+i*.3,2.4,.16,.27);
 for(const z of [ISLA_GRANDE.z+41,ISLA_GRANDE.z+44,ISLA_GRANDE.z+46])for(const side of [-1,1])part(cylinder,wood,175+side*1.05,-.35,z,.1,2,.1);
 for(const {geo,m,items}of batches.values()){const mesh=new T.InstancedMesh(geo,m,items.length);mesh.name='Costa Arriba crafted architecture';items.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);}
 for(let i=0;i<24;i++){const x=45+i*6.2,z=-413-i*.7+Math.sin(i*2.4)*5;if(!inWater(x,z)&&!costaBlocked(x,z,3)&&roadDistance(x,z)>9)forest?.addTree('palm',x,z,.65+(i%3)*.09,12000+i,root);}
 for(let i=0;i<65;i++){const a=i*2.399963,r=.25+(i%8)*.08,x=175+Math.cos(a)*58*r,z=ISLA_GRANDE.z+Math.sin(a)*36*r;if(Math.hypot(x-ISLA_LIGHTHOUSE.x,z-ISLA_LIGHTHOUSE.z)>20&&!inWater(x,z)&&!costaBlocked(x,z,2.7)&&Math.hypot(x-175,z-ISLA_GRANDE.z-41)>4)forest?.addTree('palm',x,z,.62+(i%4)*.12,13000+i,root);}
 const resources=[];function sign(text,x,z){const canvas=document.createElement('canvas');canvas.width=768;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#125a62';ctx.fillRect(0,0,768,128);ctx.fillStyle='#fff0b8';ctx.font='bold 51px sans-serif';ctx.textAlign='center';ctx.fillText(text,384,83);const tex=new T.CanvasTexture(canvas),m=new T.SpriteMaterial({map:tex,fog:false});resources.push(tex,m);const sprite=new T.Sprite(m);sprite.position.set(x,height(x,z)+3,z);sprite.scale.set(10,1.67,1);root.add(sprite);}
 sign('🏘️ Costa Arriba →',48,-370);sign('⚓ La Guaira · Isla Grande',179,-433);sign('🌴 Isla Grande · Pueblo Caribe',175,ISLA_GRANDE.z+38);
 const safe=(x,z)=>!homeReserved(x,z,1)&&!inWater(x,z)&&!costaBlocked(x,z,.6)&&roadDistance(x,z)>HIGHWAY_WIDTH/2+1.2;
 const residents=COSTA_HOMES.slice(0,14).flatMap((p,i)=>{const q=[[0,6],[0,-6],[6,0],[-6,0]].map(([x,z])=>({x:p.x+x,z:p.z+z})).find(q=>safe(q.x,q.z));if(!q)return [];const g=createCostaResident({T,make,mat,geometry,ball,cylinder},i);g.g.position.set(q.x,height(q.x,q.z),q.z);root.add(g.g);return [{...g,x:q.x,z:q.z,phase:i*1.7}];});
 for(const [i,p]of residents.entries())p.routine=createResidentRoutine(p,{seed:430+i*137,home:{x:p.x,z:p.z},height,clear:safe,radius:5});
 let time=0;return {root,congo,residents,homes:CARIBBEAN_HOMES,blocks:(x,z,margin=1.3)=>Math.hypot(x-CRISTO_REEF.x,z-CRISTO_REEF.z)<1.4+margin,update(dt,active,{x,z,indoors=false}){congo.update(dt,active,{x,z,indoors});root.visible=!indoors&&Math.hypot(x-100,z+420)<300;if(active)time+=dt;if(!root.visible)return;for(const p of residents){p.routine.update(dt,active,(nx,nz)=>residents.some(q=>q!==p&&Math.hypot(q.g.position.x-nx,q.g.position.z-nz)<.75)||Math.hypot(x-nx,z-nz)<.85);p.g.visible=Math.hypot(p.x-x,p.z-z)<120;}},dispose(){congo.dispose();resources.forEach(r=>r.dispose());delete scene.userData.costaAir;scene.remove(root);}};
}


import {ruralBlocks} from './rural-towns.js?v=225';
import {regionalParcels,regionalParcelActive,regionalClearing} from './regional-layout.js?v=225';
import {worldIslands,roadDistance,HIGHWAY_WIDTH,inWater} from './explore-state.js?v=225';
// Grounded built forms interpreted from reference settings, not exact replicas
// of private properties. Shared instancing keeps fine details inexpensive.
export function createRegionalScenery({T,scene,geometry,mat,box,ball,cylinder,height,surfaces,state}){
 const root=new T.Group();root.name='Regional Panama · coastal neighborhoods, timber balconies and coffee farms';scene.add(root);
 const wood=mat('#806044',{map:surfaces.wood,roughness:.94}),trim=mat('#f0e9d4',{map:surfaces.plaster}),glass=mat('#56858e',{roughness:.26,metalness:.18}),iron=mat('#465352'),metal=mat('#888e8a',{roughness:.72,metalness:.22}),tile=mat('#a65d43',{map:surfaces.roof}),leaf=mat('#347b3c'),leafLight=mat('#559345'),cherry=mat('#b43b31'),flower=mat('#ce5793');
 const batches=new Map();
 function part(geo,m,x,y,z,w,h,d,ry=0,rz=0){
  const key=geo.uuid+m.uuid;if(!batches.has(key))batches.set(key,{geo,m,items:[]});
  const matrix=new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(0,ry,rz)),new T.Vector3(w,h,d));batches.get(key).items.push(matrix);
 }
 const roofGeo=geometry(new T.BufferGeometry());
 roofGeo.setAttribute('position',new T.Float32BufferAttribute([-.5,0,-.5,.5,0,-.5,0,.26,-.5,-.5,0,.5,.5,0,.5,0,.26,.5],3));roofGeo.setIndex([0,2,1,3,4,5,0,3,5,0,5,2,2,5,4,2,4,1]);roofGeo.computeVertexNormals();
 const wallMaterials=new Map();
 const plots=regionalParcels().filter(p=>regionalParcelActive(p,state.world));
 for(const [i,p]of plots.entries()){
  const {x,z,w,d}=p,y=p.base,key=p.color+p.style;
  if(!wallMaterials.has(key))wallMaterials.set(key,mat(p.color,{map:p.style==='timber'?surfaces.wood:surfaces.plaster,roughness:.95}));
  const wall=wallMaterials.get(key),storey=2.55,h=p.floors*storey;
  // Foundations meet the actual slope at every corner.
  for(const sx of [-1,1])for(const sz of [-1,1]){const px=x+sx*(w/2-.3),pz=z+sz*(d/2-.3),floor=height(px,pz),depth=Math.max(.18,y-floor+.18);part(box,wood,px,y-depth/2,pz,.35,depth,.35);}
  part(box,trim,x,y+.12,z,w,.24,d);
  part(box,wall,x,y+h/2+.22,z,w-.55,h,d-1.0);
  if(p.style==='coastal-apartments')part(box,trim,x,y+h+.35,z,w,.23,d);
  else part(roofGeo,p.style==='timber'?metal:tile,x,y+h+.25,z,w+.15,Math.min(w,5),d+.15);
  for(let floor=0;floor<p.floors;floor++){
   const fy=y+floor*storey,front=z+(d-1)/2+.025;
   if(p.style==='timber')for(let j=0;j<12;j++)part(box,wood,x,fy+.4+j*.17,front,w-.6,.025,.035);
   for(const side of [-1,1]){
    const wx=x+side*w*.27;part(box,trim,wx,fy+1.5,front+.03,w*.25,1.34,.10);part(box,glass,wx,fy+1.5,front+.10,w*.21,1.15,.045);
    part(box,trim,wx,fy+1.5,front+.14,.035,1.18,.035);
    if(p.style==='timber'||p.style==='coastal-apartments'){
     part(box,trim,wx,fy+.45,front+.42,w*.37,.13,.78);part(box,iron,wx,fy+1.15,front+.78,w*.37,.045,.045);
     for(let j=0;j<6;j++)part(box,iron,wx-w*.15+j*w*.06,fy+.82,front+.78,.028,.65,.028);
    }else{
     part(box,wood,wx,fy+.82,front+.18,w*.3,.10,.3);part(ball,i%2?flower:leafLight,wx+.2,fy+1.01,front+.2,.3,.24,.24);
    }
   }
   part(box,trim,x,fy+storey+.15,z,w-.4,.10,d-.85);
  }
  // Side elevations stay detailed when approaching along the coast. All
  // additions fit the shared parcel envelope, keeping paths and yards clear.
  for(let floor=0;floor<p.floors;floor++)for(const side of [-1,1]){
   const fy=y+floor*storey,wx=x+side*((w-.55)/2+.035);
   for(const offset of [-.23,.23]){
    const wz=z+d*offset;
    part(box,trim,wx,fy+1.5,wz,.10,1.34,.97);
    part(box,glass,wx+side*.06,fy+1.5,wz,.045,1.13,.77);
    part(box,trim,wx+side*.09,fy+1.5,wz,.04,.045,.80);
    if(p.style==='timber')for(const shutter of [-1,1]){
     part(box,wood,wx+side*.10,fy+1.5,wz+shutter*.56,.07,1.22,.30);
     for(let slat=0;slat<6;slat++)part(box,trim,wx+side*.15,fy+1.02+slat*.18,wz+shutter*.56,.025,.035,.28);
    }
   }
   if(p.style==='coastal-apartments')part(box,metal,wx+side*.13,fy+.58,z,.25,.43,.70);
  }
  if(p.style!=='coastal-apartments'){
   const rise=Math.min(w,5)*.26,roofY=y+h+.25;
   // Ridge cap and eaves distinguish pitched clay/metal roofs from flat slabs.
   part(box,p.style==='timber'?metal:tile,x,roofY+rise+.025,z,.13,.08,d+.22);
   for(const side of [-1,1])part(box,wood,x+side*(w+.15)/2,roofY,z,.10,.13,d+.20);
   // Narrow seams on corrugated Bocas roofs follow the actual roof pitch.
   if(p.style==='timber')for(let j=0;j<9;j++)for(const side of [-1,1]){
    const half=(w+.15)/2,len=Math.hypot(half,rise),rz=-side*Math.atan2(rise,half);
    part(box,metal,x+side*half/2,roofY+rise/2+.035,z-d*.45+j*d*.1125,len,.025,.025,0,rz);
   }
  }
  const front=z+d/2-.42;part(box,wood,x,y+1.1,front,.9,1.8,.09);part(box,trim,x,y+.15,front+.4,1.3,.18,.85);
  // A shallow veranda fits inside the reserved footprint.
  if(p.floors<3){part(box,metal,x,y+2.2,front+.1,w-.4,.10,.7);for(const sx of [-1,1])part(box,wood,x+sx*(w/2-.5),y+1.1,front+.35,.07,2.1,.07);}
  if(p.region==='gorgona'){
   part(box,iron,x+w*.35,y+h+.56,z-.5,.55,.8,.55);
   // Rain gutters, downpipe, meter and a shaded water tap.
   part(cylinder,metal,x-w/2+.2,y+h/2,z+d/2-.45,.035,h,.035);part(box,trim,x+w*.36,y+1.25,front,.23,.3,.1);
  }
 }
 // Coffee is cultivated in the Chiriquí highlands, not on every tropical island.
 const coffee=[];
 for(const [cx,cz]of [[-322,-40],[-311,-67],[-407,-39]])for(let row=0;row<5;row++)for(let k=0;k<9;k++){
  const x=cx+k*1.7,z=cz+row*2.0+Math.sin(k*.8)*.45;
  if(ruralBlocks(x,z,2)||inWater(x,z)||roadDistance(x,z)<HIGHWAY_WIDTH/2+4||regionalClearing(x,z,2)||Math.hypot(x+350,z+65)<42)continue;
  const y=height(x,z);coffee.push({x,z});part(cylinder,wood,x,y+.5,z,.04,1,.04);
  for(let j=0;j<5;j++){const a=j*2.4;part(ball,j%2?leaf:leafLight,x+Math.sin(a)*.34,y+.7+(j%2)*.25,z+Math.cos(a)*.34,.45,.27,.29,a);if(j%2===0)part(ball,cherry,x+Math.sin(a)*.24,y+.66,z+Math.cos(a)*.24,.065,.065,.065);}
 }
 // Forest islands retain open arrival clearings and narrow footpaths.
 const paths=[];
 for(const land of worldIslands.filter(p=>['coiba','escudo','cebaco','delRey','wilds','islet'].includes(p.id))){
  const pos=[],uv=[],idx=[];
  for(let i=0;i<=48;i++){
   const t=i/48,z=land.z+land.rz*(.83-t*1.25),x=land.x+Math.sin(t*5.1)*land.rx*.17;
   for(const side of [-1,1]){const px=x+side*.48;pos.push(px,height(px,z)+.055,z);uv.push((side+1)/2,t*20);}
   if(i<48){const n=i*2;idx.push(n,n+1,n+2,n+1,n+3,n+2);}
  }
  const g=geometry(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  const path=new T.Mesh(g,mat('#b5a282',{map:surfaces.sand,roughness:1}));path.name=land.en+' narrow earth footpath';path.receiveShadow=true;path.userData.roadSurface=true;root.add(path);paths.push(path);
 }
 for(const {geo,m,items}of batches.values()){
  const mesh=new T.InstancedMesh(geo,m,items.length);mesh.name='Batched region details';items.forEach((matrix,i)=>mesh.setMatrixAt(i,matrix));mesh.instanceMatrix.needsUpdate=true;mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingSphere();root.add(mesh);
 }
 return {root,plots,coffee,paths,batchCount:batches.size,dispose(){scene.remove(root);}};
}

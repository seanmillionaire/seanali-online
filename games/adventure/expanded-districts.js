// Space-first city districts beyond the original Casco Viejo loop.
// All plots are deterministic, stay on dry land and leave existing gameplay
// landmarks, highways and saved building locations untouched.
import {mainlandContains,canalWater,gatunWater} from './geography.js?v=178';
import {roadDistance,HIGHWAY_WIDTH} from './explore-state.js?v=178';

export const EXPANDED_DISTRICTS=[
 {id:'panama-east',name:'Panama City · modern eastern neighborhoods',
  xs:[174,187,201,216,231,246,261],zs:[-83,-68,-52,-35,-19],
  kind:'modern'},
 {id:'colon-civic',name:'Colón · spaced civic and port neighborhoods',
  xs:[15,30,45,60,75],zs:[-148,-134,-120],kind:'civic'},
 {id:'colon-port',name:'Colón · Caribbean port and historic blocks',
  xs:[-38,-26,-13,0,13],zs:[-148,-136,-123,-110],
  kind:'caribbean'}
];
export const DISTRICT_ROADS={
 panamaEast:[[163,-61],[175,-61],[181,-57],[197,-57],[213,-57],[229,-57],[245,-57]],
 colonAccess:[[-10,-125],[-17,-131],[-27,-134],[-32,-132]]
};
const within=(r,x,z)=>x>=r.xs[0]&&x<=r.xs.at(-1)&&z>=r.zs[0]&&z<=r.zs.at(-1);
export function districtGround(x,z){return mainlandContains(x,z)&&!canalWater(x,z)&&!gatunWater(x,z);}
function nearStreet(area,x,z){return area.xs.some(k=>Math.abs(k-x)<3.25)||area.zs.some(k=>Math.abs(k-z)<3.25);}
const sizeFor=(area,i,j)=>{
 const modern=area.kind==='modern',signature=(i*11+j*7)%9;
 const landmark=modern&&i>=2&&signature%3===0;
 const w=landmark?5.3:modern?5.0:4.5,d=landmark?6.2:modern?5.7:5.3;
 const floors=landmark?11+((i+j)%5)*2:modern?3+((i*3+j*5)%5):2+((i*5+j)%3);
 return {w,d,h:floors*(landmark?2.45:2.25),floors,landmark,signature};
};
export function districtBuildings(){
 const plots=[];
 for(const area of EXPANDED_DISTRICTS)for(let i=0;i<area.xs.length-1;i++)for(let j=0;j<area.zs.length-1;j++){
  // More room between destinations: leave about a third of the blocks
  // as civic squares, pedestrian courtyards and landscaped pockets.
  if(area.kind==='modern'&&((i*7+j*5)%7===0||(i+2*j)%11===5||i===0))continue;
  if(area.kind==='civic'&&(i+j*2)%7===0)continue;
  const x=(area.xs[i]+area.xs[i+1])/2,z=(area.zs[j]+area.zs[j+1])/2;
  // Preserve the waterfall walkway and lookout already owned by the Colón quests.
  if(area.id==='colon-port'&&(Math.hypot(x+19,z+116)<8||Math.hypot(x+8,z+139)<7))continue;
  const dims=sizeFor(area,i,j);
  if(!districtGround(x,z)||roadDistance(x,z)<HIGHWAY_WIDTH/2+Math.hypot(dims.w,dims.d)*.5+1.3)continue;
  if([[1,1],[-1,1],[1,-1],[-1,-1]].some(([sx,sz])=>!districtGround(x+sx*(dims.w/2+.2),z+sz*(dims.d/2+.2))))continue;
  // Keep at least 1m of daylight between the facade and the road edge.
  const clearX=(area.xs[i+1]-area.xs[i])/2-dims.w/2-2.8;
  const clearZ=(area.zs[j+1]-area.zs[j])/2-dims.d/2-2.8;
  if(clearX<.5||clearZ<.5)continue;
  plots.push({district:area.id,x,z,i,j,...dims,style:(i*7+j*3)%6});
 }
 return plots;
}
const DISTRICT_PLOTS=districtBuildings();
export function districtVehicleBlocked(x,z){
 return DISTRICT_PLOTS.some(p=>Math.abs(x-p.x)<p.w/2+1.25&&Math.abs(z-p.z)<p.d/2+1.25);
}
export function districtDriveable(x,z){
 return EXPANDED_DISTRICTS.some(a=>within(a,x,z)&&districtGround(x,z)&&nearStreet(a,x,z));
}
export function districtNeighborhood(x,z){
 return EXPANDED_DISTRICTS.find(a=>within(a,x,z)&&districtGround(x,z))?.id||null;
}
export function createExtendedDistricts({T,scene,make,mat,box,cylinder,height}){
 const group=new T.Group();
 group.name='Panama detailed districts · eastern skyline, civic plazas and Colón waterfront';
 scene.add(group);
 const buildings=DISTRICT_PLOTS,counts={city:0,colon:0,parks:0};
 const walls=[
  '#e4c6a8','#d4dfd7','#e8d4ba','#b1c5cc','#dfb4a9','#eee2c7'
 ].map(c=>mat(c,{roughness:.93}));
 const glass=mat('#8eb7c1',{roughness:.29,metalness:.14}),
  reflective=mat('#5e98b6',{roughness:.22,metalness:.24}),
  charcoal=mat('#383f45',{roughness:.9}),
  asphalt=mat('#454a4e',{roughness:1}),
  stone=mat('#b6b9ae',{roughness:1}),
  pale=mat('#e7ddd0',{roughness:.87}),
  yellow=mat('#f3d58c',{roughness:1}),
  line=mat('#f5f2e9',{roughness:1}),
  rust=mat('#a96d55',{roughness:.86}),
  brick=mat('#b46f55',{roughness:.95}),
  terracotta=mat('#cc8767',{roughness:1}),
  trunk=mat('#76563c',{roughness:1}),
  leaf=mat('#39805b',{roughness:.96});
 const batch=new Map();
 function put(geo,material,x,y,z,w,h,d){
  let layer=batch.get(geo);if(!layer)batch.set(geo,layer=new Map());
  let list=layer.get(material);if(!list)layer.set(material,list=[]);
  list.push({x,y,z,w,h,d});
 }
 function boxAt(m,x,y,z,w,h,d){put(box,m,x,y,z,w,h,d);}
 function pavement(x,z,w,d){
  const y=height(x,z);
  boxAt(stone,x,y+.095,z,w,.16,d);
 }
 // Roads are built in one instanced draw per material; corner samples must
 // be dry so no artificial squares hang over the sea or the canal.
 function street(m,x,z,w,d){
  if(!districtGround(x,z)||!districtGround(x+w*.43,z+d*.43)||!districtGround(x-w*.43,z-d*.43))return;
  boxAt(m,x,height(x,z)+.074,z,w,.13,d);
 }
 for(const area of EXPANDED_DISTRICTS){
  const minZ=area.zs[0],maxZ=area.zs.at(-1),minX=area.xs[0],maxX=area.xs.at(-1);
  for(const x of area.xs)for(let z=minZ;z<=maxZ;z+=2.6){
   street(asphalt,x,z,5.7,2.75);
   if(Math.round((z-minZ)/2.6)%6===2&&districtGround(x,z))boxAt(yellow,x,height(x,z)+.157,z,.12,.018,1.05);
  }
  for(const z of area.zs)for(let x=minX;x<=maxX;x+=2.6){
   street(asphalt,x,z,2.75,5.7);
   if(Math.round((x-minX)/2.6)%6===2&&districtGround(x,z))boxAt(line,x,height(x,z)+.158,z,1.05,.018,.12);
  }
  // Zebra crossings identify full intersections rather than random white tiles.
  for(const x of area.xs)for(const z of area.zs){
   if(!districtGround(x,z))continue;
   const y=height(x,z);
   for(let k=-2;k<=2;k++)boxAt(line,x+k*.68,y+.173,z+4.3,.35,.021,1.16);
  }
 }
 const seed=(i,j)=>((i*29+j*17+13)%17)/17;
 function frontage(b,y){
  const wall=walls[b.style],front=b.z+b.d/2;
  boxAt(wall,b.x,y+b.h/2,b.z,b.w,b.h,b.d);
  if(b.landmark){
   // Distinct concrete podium + slim glazed Panama City towers.
   boxAt(reflective,b.x,y+b.h*.53,b.z,b.w*.72,b.h*.92,b.d*.84);
   boxAt(pale,b.x,y+3.5,front+.17,b.w+.75,.29,.6);
  }
  boxAt(terracotta,b.x,y+b.h+.17,b.z,b.w+.42,.32,b.d+.4);
  boxAt(charcoal,b.x,y+1.3,front+.14,1.22,2.33,.16);
  const rows=Math.min(18,Math.floor((b.h-1.3)/2.4));
  const wgap=b.landmark?1.23:1.66;
  for(let k=0;k<rows;k++)for(let side of [-1,0,1]){
   const wx=b.x+side*wgap,wy=y+2.1+k*2.38;
   if(wx>b.x+b.w*.5-.42||wx<b.x-b.w*.5+.42)continue;
   boxAt(k%3===0?reflective:glass,wx,wy,front+.10,.88,1.25,.13);
   boxAt(pale,wx,wy+.7,front+.19,1.02,.13,.19);
   if(k>0&&k%2===0&&!b.landmark){
    boxAt(stone,wx,wy-.82,front+.56,1.3,.14,.8);
    boxAt(charcoal,wx,wy-.43,front+.96,1.3,.06,.06);
    for(const d of [-.49,0,.49])boxAt(charcoal,wx+d,wy-.58,front+.96,.035,.38,.035);
   }
  }
  // Downspouts, awning bands, low railing and roof machinery.
  boxAt(pale,b.x-b.w*.5+.19,y+b.h*.5,front+.14,.17,b.h,.16);
  if(!b.landmark)for(let k=0;k<6;k++)boxAt(k%2?walls[b.style]:brick,b.x-b.w*.42+(k+.5)*b.w*.14,y+2.8,front+.44,b.w*.14,.08,.78);
  boxAt(charcoal,b.x+b.w*.20,y+b.h+.72,b.z-.6,.83,.95,.78);
  if(b.landmark)boxAt(charcoal,b.x,y+b.h+1.3,b.z,.18,2.6,.18);
 }
 for(const b of buildings){
  const y=height(b.x,b.z),modern=b.district==='panama-east';
  pavement(b.x,b.z,b.w+1.25,b.d+1.25);
  frontage(b,y);
  // Shop fronts are distinct from upper stories.
  if(!b.landmark&&b.signature%3===1){
   boxAt(glass,b.x+1.35,y+1.2,b.z+b.d/2+.13,1.13,1.65,.15);
   boxAt(rust,b.x,y+2.95,b.z+b.d/2+.38,b.w*.85,.37,.59);
  }
  if(modern)counts.city++;else counts.colon++;
 }
 // Irregular open plazas: blank lots deliberately remain walkable.
 for(const area of EXPANDED_DISTRICTS)for(let i=0;i<area.xs.length-1;i++)for(let j=0;j<area.zs.length-1;j++){
  if(!(area.kind==='modern'?((i*7+j*5)%7===0||(i+2*j)%11===5||i===0):
       area.kind==='civic'?(i+j*2)%7===0:(i+j)%4===0))continue;
  const x=(area.xs[i]+area.xs[i+1])/2,z=(area.zs[j]+area.zs[j+1])/2;
  if(!districtGround(x,z)||roadDistance(x,z)<HIGHWAY_WIDTH/2+5.5)continue;
  const y=height(x,z),spanX=area.xs[i+1]-area.xs[i]-6,spanZ=area.zs[j+1]-area.zs[j]-6;
  if(spanX<6||spanZ<6)continue;
  pavement(x,z,spanX,spanZ);counts.parks++;
  const modern=area.kind==='modern';
  // Seating plazas and palms are limited to each square, not sprinkled
  // on highway lanes. A few planter boxes soften the formerly flat asphalt.
  for(const q of [-1,1]){
   const px=x+q*(spanX*.31),pz=z+q*(spanZ*.27);
   boxAt(terracotta,px,y+.32,pz,1.8,.5,1.45);
   put(cylinder,trunk,px,y+1.8,pz,.22,3.1,.22);
   // A tiny asymmetric leafy crown; tall palms stay clear of the streets.
   put(cylinder,leaf,px,y+3.55,pz,modern?1.15:1.35,1.05,1.15);
  }
  boxAt(stone,x,y+.31,z,spanX*.65,.18,.72);
  for(const side of [-1,1]){
   boxAt(rust,x+side*spanX*.18,y+.68,z,.95,.22,.45);
   boxAt(charcoal,x+side*spanX*.18,y+.52,z,.075,.29,.3);
  }
 }
 // Colón waterfront: cargo sheds, promenades and port identity beside its city.
 for(let i=0;i<5;i++){
  const x=-33+i*8,z=-146,y=height(x,z);
  if(!districtGround(x,z)||!districtGround(x,-142))continue;
  boxAt(stone,x,y+.10,-142,5.0,.18,3.6);
  boxAt(brick,x,y+1.65,-143,4.4,3.0,3.1);
  boxAt(charcoal,x,y+3.34,-143,4.7,.32,3.45);
  for(let k=-1;k<=1;k++)boxAt(glass,x+k*1.1,y+1.94,-141.39,.7,.92,.10);
 }
 if(districtGround(-33,-139)){
  const y=height(-33,-139);
  put(cylinder,pale,-33,y+5.1,-139,1.55,10.2,1.55);
  put(cylinder,rust,-33,y+10.6,-139,2.15,.6,2.15);
 }
 // Two handfuls of street lights, bollards and shaded bus shelters.
 for(const area of EXPANDED_DISTRICTS)for(let i=1;i<area.xs.length-1;i+=2)for(let j=1;j<area.zs.length-1;j+=2){
  const x=area.xs[i]+4.25,z=area.zs[j]+4.5;
  if(!districtGround(x,z)||roadDistance(x,z)<9)continue;
  const y=height(x,z);
  put(cylinder,charcoal,x,y+2.15,z,.14,4.3,.14);
  boxAt(yellow,x,y+4.33,z,.70,.21,.68);
  if(seed(i,j)>.45){
   boxAt(stone,x+2.4,y+.18,z,2.7,.22,1.35);
   boxAt(pale,x+2.4,y+2.2,z,3.0,.2,1.58);
   for(const q of [-1,1])put(cylinder,charcoal,x+2.4+q*1.25,y+1.23,z,.09,2.25,.09);
  }
 }
 // Batch all repeated city pieces: a few dozen draw calls rather than
 // thousands of individual window, roof, street and pavement meshes.
 const obj=new T.Object3D(),resources=[];
 for(const [geo,materials]of batch)for(const [material,items]of materials){
  if(!items.length)continue;
  const inst=new T.InstancedMesh(geo,material,items.length);
  inst.name='Panama spaced streets and detailed architecture';
  inst.castShadow=false;inst.receiveShadow=true;
  items.forEach((p,i)=>{obj.position.set(p.x,p.y,p.z);obj.rotation.set(0,0,0);obj.scale.set(p.w,p.h,p.d);obj.updateMatrix();inst.setMatrixAt(i,obj.matrix);});
  inst.instanceMatrix.needsUpdate=true;inst.computeBoundingSphere?.();
  group.add(inst);resources.push(inst);
 }
 return {group,count:counts,dispose:()=>{scene.remove(group);resources.forEach(m=>m.dispose?.());}};
}

import {animalLoft} from './animal-craft.js';
import {marineWater} from './explore-state.js';
export const PERLAS_WHALE_HOME={x:560,z:125,radius:115};
export function whaleHabitat(x,z){return Math.hypot(x-560,z-125)<115&&marineWater(x,z);}

// Original procedural sculpture. Anatomy references: NOAA Fisheries / NPS
// humpback profiles (long pectorals, low dorsal hump, notched flukes, throat pleats).
// The 70-second cycle is compressed for play; no downloaded models or textures.
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),smooth=t=>{t=clamp(t);return t*t*(3-2*t);};
export function humpbackMotion(time){
 const t=((time%70)+70)%70;let depth=-.84,pitch=0;
 if(t<14){depth+=Math.sin(t*.65)*.055*Math.sin(t/14*Math.PI);pitch=Math.sin(t*.4)*.012*Math.sin(t/14*Math.PI);}
 else if(t<26){const p=(t-14)/12;depth-=7.2*smooth(p);pitch=.25*Math.sin(p*Math.PI);}
 else if(t<55){depth=-8.04+.16*Math.sin((t-26)/29*Math.PI*2);pitch=.008*Math.sin(t*.2);}
 else{const p=(t-55)/15;depth=-8.04+7.2*smooth(p);pitch=-.17*Math.sin(p*Math.PI);}
 // Two separate short exhalations while the blowholes clear the surface.
 let breath=0,breathAge=0;for(const start of [1,7.5]){const age=t-start;if(age>0&&age<1.9){breath=Math.sin(age/1.9*Math.PI);breathAge=age;}}
 return {depth,pitch,roll:Math.sin(time*.19)*.018,stroke:time*1.18,breath,breathAge};
}

function mergeParts(T,parts){
 const attributes={position:[],normal:[],uv:[],color:[]},indices=[];let offset=0;
 for(const g of parts){for(const name of Object.keys(attributes))attributes[name].push(...g.attributes[name].array);const ix=g.index?.array||Array.from({length:g.attributes.position.count},(_,i)=>i);for(const i of ix)indices.push(i+offset);offset+=g.attributes.position.count;g.dispose();}
 const g=new T.BufferGeometry();for(const [name,a]of Object.entries(attributes))g.setAttribute(name,new T.Float32BufferAttribute(a,name==='uv'?2:3));g.setIndex(indices);return g;
}
function skinColors(T,geo,kind='body'){
 const p=geo.attributes.position,c=[],dark=new T.Color('#26363c'),pale=new T.Color('#c1c7bd');
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i),noise=Math.sin(x*.81+z*1.14)*Math.sin(z*.73-y*1.11),mark=Math.sin(x*2.1+z*.8)+.4*Math.sin(z*3.1+x*3.2);
  let white=kind==='flipper'?smooth((-y+.018)*15)*(.68+.25*smooth(Math.abs(x)/5)):kind==='fluke'?smooth((-y-.01)*18)*(.62+.35*smooth(mark)) :smooth((-y-.45-mark*.09)*2.2)*smooth((z+5)/3);
  if(kind==='flipper')white=Math.max(white,smooth((Math.abs(x)-3.9)*1.3)*.56);
  const color=dark.clone().lerp(pale,clamp(white));color.multiplyScalar(1+noise*.07);
  c.push(color.r,color.g,color.b);
 }
 geo.setAttribute('color',new T.Float32BufferAttribute(c,3));return geo;
}
// A thin curved hydrofoil, not a stretched sphere. Each station gives x,y,
// leading/trailing Z and thickness; closed rings provide smooth lit edges.
function foil(T,stations,rings=25,sides=12,side=1,edge='leading'){
 const pos=[],uv=[],ix=[];
 for(let i=0;i<rings;i++){
  const t=i/(rings-1),f=t*(stations.length-1),k=Math.min(stations.length-2,Math.floor(f)),a=stations[k],b=stations[k+1],v=a.map((x,n)=>x+(b[n]-x)*(f-k));
  const center=(v[2]+v[3])/2,chord=(v[2]-v[3])/2;
  for(let j=0;j<=sides;j++){const angle=j/sides*Math.PI*2,lead=Math.cos(angle),scallop=(edge==='none'?0:Math.max(0,edge==='trailing'?-lead:lead))*(edge==='trailing'?.035:.065)*Math.sin(t*Math.PI*18)*Math.sin(t*Math.PI);
   pos.push(side*v[0],v[1]+Math.sin(angle)*Math.max(.004,v[4]),center+lead*chord+scallop);uv.push(t,j/sides);
   if(i<rings-1&&j<sides){const q=i*(sides+1)+j,n=q+sides+1;if(side>0)ix.push(q,n,q+1,q+1,n,n+1);else ix.push(q,q+1,n,q+1,n+1,n);}
  }
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();return g;
}
function texturedSkin(T){
 const size=128,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const v=128+Math.sin(x*.39+y*.17)*9+Math.sin(x*2.1-y*1.17)*5+Math.sin(x*.11-y*.27)*8,i=(y*size+x)*4;data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;}
 const map=new T.DataTexture(data,size,size);map.wrapS=map.wrapT=T.RepeatWrapping;map.repeat.set(3,6);map.generateMipmaps=true;map.minFilter=T.LinearMipmapLinearFilter;map.needsUpdate=true;return map;
}
function bodyRig(T,geometry,material){
 const parts=[];
 const body=animalLoft(T,g=>g,[[-8.65,0,.32,.15],[-7.4,0,.43,.35],[-5.7,.02,.67,.64],[-3.3,.02,1.25,1.13],[-.5,0,1.8,1.53],[2.4,-.02,1.92,1.48],[4.7,-.08,1.67,1.14],[6.3,-.16,1.35,.69],[7.7,-.28,.72,.3],[8.35,-.3,.02,.02]],60,24);
 skinColors(T,body);parts.push(body);
 const flukeStations=[[0,0,-7.95,-8.8,.12],[.8,0,-7.72,-10.05,.17],[1.95,.03,-7.92,-10.4,.14],[3.15,.07,-8.2,-9.87,.09],[4.25,.12,-8.94,-8.96,.005]];
 for(const side of [-1,1])parts.push(skinColors(T,foil(T,flukeStations,26,12,side,'trailing'),'fluke'));
 // Low, broad, swept dorsal fin and head tubercles become part of one draw.
 const dorsal=foil(T,[[0,0,-1.3,-3.5,.16],[.3,0,-1.6,-3.16,.12],[.65,0,-2.1,-2.94,.06],[.82,0,-2.72,-2.74,.002]],16,8,1,'none');
 const dp=dorsal.attributes.position;for(let i=0;i<dp.count;i++){const x=dp.getX(i),y=dp.getY(i);dp.setXYZ(i,-y,x+1.32,dp.getZ(i));}dorsal.computeVertexNormals();skinColors(T,dorsal);parts.push(dorsal);
 const bumps=[];for(let row=-1;row<=1;row++)for(let i=0;i<7;i++){const z=5.65+i*.34,x=row*(1.06-i*.12),y=-.16+.69*Math.sqrt(Math.max(0,1-(x/1.35)**2))-(z-6.3)*.24;bumps.push([x,y,z,.067+(i%3)*.006]);}
 for(const [x,y,z,r]of bumps){const g=new T.SphereGeometry(r,6,4);g.scale(1,.65,1);g.translate(x,y,z);skinColors(T,g);parts.push(g);}
 const merged=geometry(mergeParts(T,parts));merged.name='Continuous humpback body, sculpted flukes and anatomy';
 const p=merged.attributes.position,indices=[],weights=[];
 for(let i=0;i<p.count;i++){
  const z=p.getZ(i);let a=0,b=1,t=clamp((-z-1.2)/2.1);
  if(z< -3.3){a=1;b=2;t=clamp((-z-3.3)/2.9);}if(z< -6.2){a=2;b=3;t=clamp((-z-6.2)/2.2);}
  indices.push(a,b,0,0);weights.push(1-t,t,0,0);
 }
 merged.setAttribute('skinIndex',new T.Uint16BufferAttribute(indices,4));merged.setAttribute('skinWeight',new T.Float32BufferAttribute(weights,4));
 const bones=Array.from({length:4},()=>new T.Bone());bones[1].position.z=-3.3;bones[2].position.z=-2.9;bones[3].position.z=-2.2;for(let i=1;i<bones.length;i++)bones[i-1].add(bones[i]);
 const mesh=new T.SkinnedMesh(merged,material);mesh.name='Humpback continuous flexing body';mesh.add(bones[0]);mesh.bind(new T.Skeleton(bones));mesh.castShadow=true;mesh.frustumCulled=false;return {mesh,bones};
}

export function createPerlasWhale({T,scene,whaleRoute=null}){
 const g=new T.Group();g.name=whaleRoute?.name||'Las Perlas · giant humpback whale';g.rotation.order='YXZ';scene.add(g);const geometries=[],materials=[];
 const geometry=geo=>(geometries.push(geo),geo),bump=texturedSkin(T),skin=new T.MeshStandardMaterial({color:'#ffffff',vertexColors:true,roughness:.39,metalness:.07,bumpMap:bump,bumpScale:.035}),dark=new T.MeshStandardMaterial({color:'#101c20',roughness:.34});materials.push(skin,dark);
 const {mesh:body,bones}=bodyRig(T,geometry,skin);g.add(body);
 const fins=[];for(const side of [-1,1]){
  const fin=new T.Group();fin.name=side<0?'Humpback left pectoral':'Humpback right pectoral';fin.position.set(side*1.58,-.55,3.4);g.add(fin);
  const geo=geometry(skinColors(T,foil(T,[[0,0,.72,-.65,.16],[1.25,-.09,.68,-.98,.17],[2.6,-.25,.2,-1.3,.13],[4.1,-.36,-.62,-1.72,.085],[5.65,-.28,-1.8,-1.84,.004]],29,12,side),'flipper'));
  geo.name='Long tapered humpback pectoral hydrofoil';const m=new T.Mesh(geo,skin);m.castShadow=true;fin.add(m);fins.push(fin);
 }
 // Mouth seam, small eyes, paired blowholes and ventral pleats: one compact draw.
 const details=[];function ellipsoid(x,y,z,sx,sy,sz){const a=new T.SphereGeometry(1,8,6);a.scale(sx,sy,sz);a.translate(x,y,z);skinColors(T,a);details.push(a);}
 for(const side of [-1,1]){ellipsoid(side*1.43,-.03,5.68,.085,.07,.115);ellipsoid(side*.19,1.105,4.9,.095,.018,.24);const curve=new T.CatmullRomCurve3([[side*1.58,-.47,4.7],[side*1.33,-.47,6.1],[side*.72,-.43,7.65],[0,-.31,8.3]].map(a=>new T.Vector3(...a))),line=new T.TubeGeometry(curve,22,.023,4,false);skinColors(T,line);details.push(line);}
 const bp=body.geometry.attributes.position,sections=Array.from({length:60},(_,r)=>{const q=r*25;return {z:bp.getZ(q),y:(bp.getY(q)+bp.getY(q+12))/2,w:bp.getX(q+6),h:(bp.getY(q)-bp.getY(q+12))/2};});
 function underside(z,x){let k=0;while(k<sections.length-2&&sections[k+1].z<z)k++;const a=sections[k],b=sections[k+1],t=clamp((z-a.z)/(b.z-a.z)),y=a.y+(b.y-a.y)*t,w=a.w+(b.w-a.w)*t,h=a.h+(b.h-a.h)*t;return y-h*Math.sqrt(Math.max(.02,1-(x/w)**2));}
 for(let i=-7;i<=7;i++){const x=i*.16,points=[];for(let j=0;j<=16;j++){const t=j/16,z=.1+t*7.45,xx=x*(1-.58*t);points.push(new T.Vector3(xx,underside(z,xx)-.014,z));}const a=new T.TubeGeometry(new T.CatmullRomCurve3(points),16,.018,3,false);skinColors(T,a);details.push(a);}
 const detailsGeo=geometry(mergeParts(T,details)),detailsMesh=new T.Mesh(detailsGeo,dark);detailsMesh.name='Humpback mouth, eyes, blowholes and throat pleats';g.add(detailsMesh);
 const sprayPositions=new Float32Array(28*3),sprayGeo=geometry(new T.BufferGeometry());sprayGeo.setAttribute('position',new T.BufferAttribute(sprayPositions,3));
 const mist=new Uint8Array(32*32*4);for(let y=0;y<32;y++)for(let x=0;x<32;x++){const i=(y*32+x)*4,r=Math.hypot((x-15.5)/15.5,(y-15.5)/15.5);mist[i]=mist[i+1]=mist[i+2]=255;mist[i+3]=Math.round(255*(1-smooth(r)));}
 const sprayMap=new T.DataTexture(mist,32,32);sprayMap.needsUpdate=true;
 const sprayMaterial=new T.PointsMaterial({color:'#e8f1f0',map:sprayMap,size:.48,transparent:true,opacity:0,depthWrite:false});materials.push(sprayMaterial);const spray=new T.Points(sprayGeo,sprayMaterial);spray.name='Brief bushy humpback exhalation';spray.position.set(0,1.15,4.9);g.add(spray);
 let time=whaleRoute?.phase||0,heading=0;g.position.set(610,-.84,180);if(whaleRoute){const p=coibaWhalePose(whaleRoute,time);g.position.set(p.x,-.84,p.z);heading=p.heading;}
 const footprintClear=(x,z)=>{if(!whaleHabitat(x,z))return false;for(let i=0;i<16;i++){const a=i*Math.PI/8;if(!whaleHabitat(x+Math.cos(a)*12.5,z+Math.sin(a)*12.5))return false;}return true;};
 function pose(){
  const m=humpbackMotion(time);g.position.y=m.depth;g.rotation.set(m.pitch,heading,m.roll);bones[1].rotation.x=Math.sin(m.stroke)*.065;bones[2].rotation.x=Math.sin(m.stroke-.5)*.11;bones[3].rotation.x=Math.sin(m.stroke-.95)*.16;
  fins.forEach((f,i)=>{const side=i?1:-1;f.rotation.z=side*(-.075+Math.sin(time*.37+i*.6)*.045);f.rotation.x=Math.sin(time*.23+i)*.025;});
  spray.visible=m.breath>0;sprayMaterial.opacity=m.breath*.3;
  if(spray.visible){const age=m.breathAge;for(let i=0;i<28;i++){const phase=(i*.618)%1,r=.12+phase*.62,k=i*3,angle=i*2.4;sprayPositions[k]=Math.sin(angle)*r*(.35+age*.5)+age*.17;sprayPositions[k+1]=.1+phase*(1.7+age*.35);sprayPositions[k+2]=Math.cos(angle)*r*(.35+age*.5);}sprayGeo.attributes.position.needsUpdate=true;sprayGeo.computeBoundingSphere();}
 }
 pose();g.userData.whaleAnatomy={length:18.75,pectoralLength:5.65,flukeSpan:8.5,bodyRig:'continuous-four-bone',procedural:true};
 return {g,update(dt,active,info={}){
  const step=clamp(Number.isFinite(dt)?dt:0,0,.1);if(active){time+=step;if(whaleRoute){const p=coibaWhalePose(whaleRoute,time);g.position.x=p.x;g.position.z=p.z;heading=p.heading;}
   else{const nx=g.position.x+Math.sin(heading)*step*1.8,nz=g.position.z+Math.cos(heading)*step*1.8;if(footprintClear(nx,nz,heading)){g.position.x=nx;g.position.z=nz;}else heading+=step*.28;}
  }
  g.visible=!info.indoors&&Math.hypot((info.x??g.position.x)-g.position.x,(info.z??g.position.z)-g.position.z)<250;if(g.visible)pose();
 },dispose(){g.removeFromParent();body.skeleton.dispose();geometries.forEach(x=>x.dispose());materials.forEach(x=>x.dispose());bump.dispose();sprayMap.dispose();}};
}

// Two separate open-water loops south of Coiba, off Chiriquí.
export const COIBA_WHALE_ROUTES=[
 {name:'Coiba · western humpback',x:-535,z:245,radius:24,phase:0},
 {name:'Coiba · eastern humpback',x:-425,z:245,radius:26,phase:19}
];
export function coibaWhalePose(route,time){const a=time*1.6/route.radius;return {x:route.x+Math.cos(a)*route.radius,z:route.z+Math.sin(a)*route.radius,heading:-a};}

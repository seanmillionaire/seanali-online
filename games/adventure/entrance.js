import {roundedOceanGeometry} from './world-horizon.js?v=224';
import {createStableShadows} from './stable-shadows.js?v=224';
import {landscapeMaterial} from './landscape-material.js?v=224';
import {createAtmosphere} from './atmosphere.js?v=224';
import {MAINLAND_EAST,cityX} from './geography.js?v=224';
import {clipLandTriangle,coastDistanceField,shorelineTiles} from './terrain-surface.js?v=224';
import {mainlandContains,canalWater,gatunWater,freshwaterHabitat,organicIslandRadius,homeShoreRadius,WORLD_EXTENT} from './geography.js?v=224';
import {createActiveVolcano} from './active-volcano.js?v=224';
import {worldIslands,isletHeight,terrainHeight,volcanoTrailPoint,roadsidePoint,nearRoad,HIGHWAY_WIDTH} from './explore-state.js?v=224';
import {createTropical} from './tropical.js?v=224';
import {createForestLandscape} from './forest-landscape.js?v=224';
import {createSurfaceTextures} from './surface-textures.js?v=224';
import {installPolyHavenMaterials} from './polyhaven-materials.js?v=224';
/* Optional real-time 3D arrival. The adventure remains playable without WebGL. */
export function createEntrance(host,{motion,label,onMode=()=>{},load=()=>import('./vendor/three.module.min.js')}={}) {
  let disposed=false,world=null,pending=null;
  const canvas=document.createElement('canvas');canvas.className='world-canvas';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',label||'Angelique’s fantasy Panama, from Gorgona to Taboga and Bocas del Toro');host.prepend(canvas);
  function fallback(){if(disposed)return;world?.dispose();world=null;canvas.remove();host.classList.remove('world-ready');host.classList.add('world-fallback');onMode('fallback');if(pending){const done=pending;pending=null;done();}}
  const lost=event=>{event.preventDefault();fallback();};canvas.addEventListener('webglcontextlost',lost);
  if(!window.WebGL2RenderingContext){fallback();}else load().then(THREE=>{if(disposed)return;try{world=buildIsland(THREE,canvas,motion||(()=>true));host.classList.add('world-ready');onMode('3d');if(pending)world.flyIn(finish);}catch{fallback();}}).catch(fallback);
  function finish(){if(!pending||disposed)return;const done=pending;pending=null;done();}
  return {
    flyIn(done){if(disposed||pending)return;pending=done;if(!world||!motion?.()){finish();return;}world.flyIn(finish);},
    skip(){finish();},
    dispose(){if(disposed)return;disposed=true;pending=null;canvas.removeEventListener('webglcontextlost',lost);world?.dispose();world=null;canvas.remove();}
  };
}
export function buildIsland(T,canvas,motion,setup,{light=false,onError=()=>{}}={}) {
  const renderer=new T.WebGLRenderer({canvas,antialias:!light,alpha:false,powerPreference:'default'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,light?1:1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;
  renderer.shadowMap.enabled=!light;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=!light;renderer.shadowMap.needsUpdate=true;
  const scene=new T.Scene();scene.background=new T.Color('#b0d3e2');scene.fog=new T.FogExp2('#b8d6dd',.0022);
  const camera=new T.PerspectiveCamera(48,1,.2,1800),sun=new T.DirectionalLight('#fff0d2',3.0);sun.position.set(-22,38,18);sun.castShadow=true;sun.shadow.mapSize.set(light?1024:2048,light?1024:2048);sun.shadow.camera.left=-30;sun.shadow.camera.right=30;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;sun.shadow.normalBias=.055;sun.shadow.bias=-.00015;const ambient=new T.HemisphereLight('#c9edff','#58623c',1.45);scene.add(sun,ambient);
  const shadows=createStableShadows({T,sun,renderer,scene});
  const textures=new Set(),geometries=new Set(),materials=new Set(),clouds=[],bobbing=[],volcanoes=[];let seed=4107;
  const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const geometry=g=>{geometries.add(g);return g;};
  const mat=(color,extra={})=>{const m=new T.MeshStandardMaterial({color,roughness:.88,...extra});materials.add(m);return m;};
  const make=(g,m,x=0,y=0,z=0,sx=1,sy=sx,sz=sx,parent=scene)=>{const mesh=new T.Mesh(g,m);if(g.userData?.solidRock)mesh.userData.solidRock=true;mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
  const ball=geometry(new T.SphereGeometry(1,16,12)),cone=geometry(new T.ConeGeometry(1,1,8)),cylinder=geometry(new T.CylinderGeometry(1,1,1,12)),box=geometry(new T.BoxGeometry(1,1,1));
  const sand=mat('#e8c895'),green=mat('#568d58'),darkGreen=mat('#246b57'),leaf=mat('#79a05b'),trunk=mat('#855b42'),stone=mat('#84958c'),cream=mat('#fff0ca'),wood=mat('#986b44'),red=mat('#ce826c'),blue=mat('#579c9d'),violet=mat('#a99ac0'),gold=mat('#ffda83',{emissive:'#efb449',emissiveIntensity:.32});
  function height(x,z){const ground=isletHeight(x,z);if(ground>0)return ground;const edge=Math.sqrt((x/20)**2+(z/14)**2);const hill=6*Math.exp(-((x+1)**2/30+(z+5)**2/22));return Math.max(.1,(1-edge*edge)*2.8)+hill;}
  // A sculpted, vertex-colored island; this is geometry, not a picture on a plane.
  const surfaces=createSurfaceTextures(T);
  const tropical=createTropical({T,scene,camera,height,geometry,mat,make,ball,renderer,surfaces});
  for(const [material,surface,bump] of [[sand,surfaces.sand,.07],[green,surfaces.grass,.10],
    [darkGreen,surfaces.grass,.10],[leaf,surfaces.grass,.09],[trunk,surfaces.wood,.08],
    [stone,surfaces.stone,.11],[cream,surfaces.plaster,.035],[wood,surfaces.wood,.065]]){
    material.map=surface;material.bumpMap=surface;material.bumpScale=bump;material.needsUpdate=true;
  }
  const positions=[],colors=[],uvs=[],indices=[],rings=72,segments=216;
   const blend=(from,to,value)=>{const t=Math.max(0,Math.min(1,(value-from)/(to-from)));return t*t*(3-2*t);};
  for(let ring=0;ring<=rings;ring++)for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2,r=ring/rings,shore=homeShoreRadius(a),x=Math.cos(a)*20*r*shore,z=Math.sin(a)*14*r*shore,y=ring===rings?.08:height(x,z);positions.push(x,y,z);uvs.push(x*.18,z*.18);const patch=r+.043*Math.sin(x*.28+z*.18)+.027*Math.cos(x*.13-z*.49);
   const c=new T.Color('#527842').lerp(new T.Color('#789454'),blend(.30,.77,patch));
   c.lerp(new T.Color('#e5d5ad'),blend(.75,.94,patch));
   c.lerp(new T.Color('#969784'),blend(4.5,7,y)*.7);
   c.multiplyScalar(.92+.10*Math.sin(x*.23+z*.13)*Math.cos(z*.38-x*.09)+rand()*.055);colors.push(c.r,c.g,c.b);}
  for(let j=0;j<rings;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,b=a+segments+1;indices.push(a,a+1,b,b,a+1,b+1);}
  const terrain=geometry(new T.BufferGeometry());terrain.setAttribute('position',new T.Float32BufferAttribute(positions,3));terrain.setAttribute('color',new T.Float32BufferAttribute(colors,3));terrain.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));terrain.setIndex(indices);terrain.computeVertexNormals();make(terrain,landscapeMaterial({T,mat,surfaces,region:'gorgona'}));
  // Five deliberately different destinations: shape, silhouette, color and landmarks.
  // All decorations use the same physical x/z coordinates as player navigation.
  const erodedRock=new T.SphereGeometry(1,20,12),rockPosition=erodedRock.attributes.position;
  for(let i=0;i<rockPosition.count;i++){const x=rockPosition.getX(i),y=rockPosition.getY(i),z=rockPosition.getZ(i),n=.89+.08*Math.sin(x*7+z*3)*Math.sin(y*5-z*4)+.03*Math.cos(z*9+x*5);rockPosition.setXYZ(i,x*n,y*n,z*n);}
  erodedRock.computeVertexNormals();const rockGeo=geometry(erodedRock);rockGeo.userData.solidRock=true;
  const crystalGeo=geometry(new T.ConeGeometry(1,1,5));
  const ringGeo=geometry(new T.TorusGeometry(1,.12,8,24));
  const barkDark=mat('#58462f',{map:surfaces.wood,bumpMap:surfaces.wood,bumpScale:.075});
  const jungleLeaf=mat('#297c43',{side:T.DoubleSide});
  const jungleLime=mat('#8dbd4e',{side:T.DoubleSide});
  const meadowPink=mat('#ed8ebc'),meadowLilac=mat('#b5a1e9'),meadowCream=mat('#fff3ca');
  const meadowStem=mat('#548d49'),meadowBud=mat('#f4cc55',{emissive:'#d8953d',emissiveIntensity:.22});
  const beachWood=mat('#a5794b',{map:surfaces.wood,bumpMap:surfaces.wood,bumpScale:.055}),beachAwning=mat('#fff1bd',{map:surfaces.plaster});
  const beachCoral=mat('#ffad82'),beachBlue=mat('#58b6cc'),beachShell=mat('#fff3d9');
  const forestBark=mat('#504059',{map:surfaces.wood,bumpMap:surfaces.wood,bumpScale:.06}),forestPine=mat('#296556',{map:surfaces.grass}),forestPineShade=mat('#2e5265',{map:surfaces.grass});
  const forestGlow=mat('#ffe99e',{emissive:'#ffcc51',emissiveIntensity:1.15});
  const mushroomPink=mat('#d888bd',{emissive:'#7e427b',emissiveIntensity:.4});
  const mushroomViolet=mat('#9875d2',{emissive:'#5642a5',emissiveIntensity:.45});
  const crystalStone=mat('#617b9a'),crystalBlue=mat('#5bc9ec',{emissive:'#338cbf',emissiveIntensity:.6,roughness:.3,metalness:.18});
  const crystalMint=mat('#9bebd8',{emissive:'#43bba8',emissiveIntensity:.55,roughness:.27});
  const crystalLavender=mat('#b1a1e7',{emissive:'#7356c9',emissiveIntensity:.5});
  const crystalWhite=mat('#e5f9ff',{emissive:'#8bd3eb',emissiveIntensity:.45});
  const position=(land,u,v)=>({x:land.x+u*land.rx,z:land.z+v*land.rz});
  const place=(land,u,v)=>{const p=position(land,u,v);return {...p,y:height(p.x,p.z)};};
  const ellipseMats={
   islet:['#c1dfa4','#80c990','#f5d2ad'],
   wilds:['#3b8050','#3d6d41','#d0bd7c'],
   coconutCoast:['#f2dfad','#d9df99','#f5e8c7'],
   sunset:['#3c4a3e','#6e675b','#8f8a82'],
   crystalCove:['#eee8d0','#f5edda','#fff6df'],
   pizzaCity:['#3c424c','#3c424c','#3c424c']
  };
  function meadowFlower(x,z,n,scale=1){
   const y=height(x,z),petal=n%2?meadowPink:meadowLilac;
   make(cylinder,meadowStem,x,y+.65*scale,z,.045,.95*scale,.045);
   for(let k=0;k<6;k++){
    const a=k*Math.PI/3;
    const p=make(ball,petal,x+Math.cos(a)*.47*scale,y+1.25*scale+Math.sin(a)*.47*scale,z,.28*scale,.34*scale,.14*scale);
    p.rotation.z=a-Math.PI/2;
   }
   make(ball,meadowBud,x,y+1.25*scale,z,.22*scale,.22*scale,.23*scale);
  }
  function meadowButterfly(x,z,i){
   const y=height(x,z)+2.6+(i%3)*.36;
   const hue=i%2?meadowLilac:meadowPink;
   make(ball,barkDark,x,y,z,.06,.45,.08);
   for(const side of [-1,1]){
    const wing=make(ball,hue,x+side*.5,y+.23,z,.48,.67,.10);
    wing.rotation.z=side*.35;
    const lower=make(ball,meadowCream,x+side*.35,y-.33,z,.30,.35,.09);
    lower.rotation.z=side*-.3;
   }
  }
  function jungleTree(x,z,i){tropical.forest.addTree(i%7===0?'pine':i%4===0?'natural':'palm',x,z,1+(i%3)*.13,i);}
  function beachShade(x,z,i){
   const y=height(x,z),g=new T.Group();g.name='Canvas beach parasol and recliner';g.position.set(x,y,z);scene.add(g);
   const fabric=mat(i%2?'#8c9a91':'#c3b99e',{map:surfaces.plaster,side:T.DoubleSide,roughness:.98});
   make(cylinder,beachWood,0,1.22,0,.045,2.44,.045,g);make(cone,fabric,0,2.45,0,1.5,.40,1.5,g);
   for(let j=0;j<8;j++){const a=j*Math.PI/4,arm=make(cylinder,beachWood,Math.cos(a)*.70,2.36,Math.sin(a)*.70,.012,1.46,.012,g);arm.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(Math.cos(a),-.14,Math.sin(a)).normalize());}
   // A recliner with canvas stretched between two folding timber rails.
   make(box,fabric,.05,.28,0,1.25,.035,.64,g);const back=make(box,fabric,-.68,.47,0,.55,.035,.64,g);back.rotation.z=-.60;
   for(const side of [-1,1]){make(box,beachWood,.05,.24,side*.37,1.4,.055,.05,g);for(const sx of [-.48,.48]){const leg=make(box,beachWood,sx,.15,side*.37,.045,.33,.045,g);leg.rotation.z=sx>0?-.3:.3;}}
  }
  function fireflyTree(x,z,i){
   tropical.forest.addTree('pine',x,z,1.08+(i%3)*.16,i);
   if(i%2===0)make(ball,forestGlow,x+1,height(x,z)+8,z-.6,.15,.15,.15);
  }
  function glowMushroom(x,z,i){
   const y=height(x,z),s=.7+(i%3)*.24;
   make(cylinder,meadowCream,x,y+.4*s,z,.12*s,.8*s,.12*s);
   make(ball,i%2?mushroomPink:mushroomViolet,x,y+.88*s,z,.55*s,.28*s,.55*s);
  }
  function crystalSpire(x,z,i,s=1){
   const y=height(x,z),tall=(1.6+i%4*.75)*s;
   const m=[crystalBlue,crystalMint,crystalLavender,crystalWhite][i%4];
   const spike=make(crystalGeo,m,x,y+tall*.46,z,.55*s,tall,.55*s);
   spike.rotation.z=(i%4-1.5)*.1;
   if(i%3===0){
    make(crystalGeo,crystalWhite,x+.5*s,y+.48*s,z-.35*s,.27*s,1*s,.27*s).rotation.z=.23;
   }
  }
  for(const land of worldIslands){
   const shades=(land.guna?['#eee8d0','#f5edda','#fff6df']:ellipseMats[land.id])||['#36804b','#549d55','#eadab1'],iv=[],ic=[],ii=[],iu=[];
   const rings=land.id==='sunset'?64:land.guna?14:28,segments=land.id==='sunset'?192:land.id==='pizzaCity'?192:land.guna?60:128;
   for(let ring=0;ring<=rings;ring++)for(let j=0;j<=segments;j++){
    const a=j/segments*Math.PI*2,r=ring/rings;
    const shore=organicIslandRadius(land,a);
     const x=land.x+Math.cos(a)*land.rx*r*shore,z=land.z+Math.sin(a)*land.rz*r*shore,y=isletHeight(x,z);
    iv.push(x,y,z);iu.push(x*.18,z*.18);
    // Overlapping diffuse color transitions, rather than circular color bands.
     // Spatial noise also breaks up artificial rings on aerial views.
     const patch=r+.045*Math.sin(x*.29+z*.17)+.033*Math.sin(x*.62-z*.35);
     const base=land.id==='sunset'
      ?new T.Color('#5c5350').lerp(new T.Color('#777267'),blend(.23,.57,patch))
       .lerp(new T.Color('#657a63'),blend(.51,.79,patch))
       .lerp(new T.Color('#b2aa96'),blend(.80,.98,patch))
      :new T.Color(shades[0]).lerp(new T.Color(shades[1]),blend(.36,.76,patch))
       .lerp(new T.Color(shades[2]),blend(.75,.96,patch));
     base.multiplyScalar(.93+.07*Math.sin(x*.19+z*.21)*Math.cos(z*.32-x*.13)+rand()*.055);
     ic.push(base.r,base.g,base.b);
    if(ring<rings&&j<segments){const n=ring*(segments+1)+j;ii.push(n,n+1,n+segments+1,n+segments+1,n+1,n+segments+2);}
   }
   const g=geometry(new T.BufferGeometry());
   const clipped=[],clippedColors=[],clippedUV=[],clippedIndices=[],vertexLookup=new Map();
   for(let n=0;n<ii.length;n+=3){
    const triangle=ii.slice(n,n+3).map(k=>[...iv.slice(k*3,k*3+3),...ic.slice(k*3,k*3+3),...iu.slice(k*2,k*2+2)]);
    for(const v of clipLandTriangle(triangle,(x,z)=>isletHeight(x,z)>0)){
     const key=v.map(n=>n.toFixed(5)).join(',');let index=vertexLookup.get(key);
     if(index===undefined){index=clipped.length/3;vertexLookup.set(key,index);clipped.push(v[0],Math.max(.025,isletHeight(v[0],v[2])),v[2]);clippedColors.push(...v.slice(3,6));clippedUV.push(...v.slice(6,8));}clippedIndices.push(index);
    }
   }
   g.setAttribute('position',new T.Float32BufferAttribute(clipped,3));
   g.setAttribute('color',new T.Float32BufferAttribute(clippedColors,3));
   g.setAttribute('uv',new T.Float32BufferAttribute(clippedUV,2));
   g.setIndex(clippedIndices);g.computeVertexNormals();
   // Match the existing city terrain geometry and height; only its surface changes.
   const islandTexture=land.id==='pizzaCity'?surfaces.asphalt:land.id==='coconutCoast'||land.id==='crystalCove'||land.guna?surfaces.sand:land.id==='crystalCove'||land.id==='sunset'?surfaces.stone:surfaces.grass;
   const island=make(g,land.id==='pizzaCity'?mat('#b8c1b1',{roughness:.95}):landscapeMaterial({T,mat,surfaces,base:['coconutCoast','crystalCove'].includes(land.id)?'sand':'grass',region:land.guna?'guna':land.id}));
   island.name=land.en;

   if(land.id==='islet'){
    // Butterfly Meadow: low rolling pastel hills, oversized wildflowers,
    // a ribbon of butterflies, and a flower garden rather than palm trees.
    for(let i=0;i<9;i++){
     const a=i*2.4,p=place(land,Math.sin(a)*.65,Math.cos(a)*.62);
     meadowFlower(p.x,p.z,i,.28+(i%3)*.07);
    }
    for(let i=0;i<16;i++){
     const a=i*2.4,p=place(land,Math.sin(a)*(.25+(i%3)*.19),Math.cos(a)*(.25+(i%3)*.19));
     tropical.card(15,p.x,p.y,p.z,1.5,1.5);
    }
    for(let i=0;i<5;i++){
     const a=i*2.5,p=place(land,Math.sin(a)*.3,Math.cos(a)*.35);
     meadowButterfly(p.x,p.z,i);
    }
    // The original flower activities remain; San Pedro's homes and gardens
    // are rendered by the shared regional scenery planner.
   }else if(land.id==='wilds'){
    // Banana Jungle: huge broad-leaf canopy, layered vines and fruit
    // everywhere, with a little treehouse shelter in the dense green.
    for(let i=0;i<5;i++){
     const a=i*2.39996,r=.43+(i%3)*.12,p=place(land,Math.sin(a)*r,Math.cos(a)*r);
     tropical.forest.addTree(i%3===0?'natural':'palm',p.x,p.z,.64+(i%3)*.11,i);
    }
    for(let i=0;i<19;i++){
     const a=i*2.4,r=.23+(i%4)*.17,p=place(land,Math.sin(a)*r,Math.cos(a)*r);
     tropical.card(1,p.x,p.y,p.z,2.9+(i%3)*.5,3.2+(i%3)*.35);
    }
    // Colorful timber balconies replace the generic raised jungle shelter.
    for(let i=0;i<5;i++){
     const p=place(land,-.65+i*.22,.08);
     tropical.card(7,p.x,p.y+.08,p.z,.75,1);
    }
   }else if(land.id==='coconutCoast'){
    // Sunshine Beach: pale sand, a dense ring of palms, bright beach
    // parasols and surfboards; deliberately flat and open for boating.
    for(let i=0;i<9;i++){
     const a=i*2.4,r=.37+(i%4)*.16,p=place(land,Math.sin(a)*r,Math.cos(a)*r);
     tropical.palm(p.x,p.z,.75+(i%3)*.13,true);
    }
    for(let i=0;i<5;i++){
     const a=i*2.4,p=place(land,Math.sin(a)*.38,Math.cos(a)*.36);
     beachShade(p.x,p.z,i);
    }
    for(let i=0;i<7;i++){
     const a=i*2.4,p=place(land,Math.sin(a)*.75,Math.cos(a)*.68);
     const board=make(box,i%2?beachBlue:beachCoral,p.x,p.y+.75,p.z,.24,1.48,.12);
     board.rotation.z=Math.sin(a)*.25;
     make(ball,beachShell,p.x+.38,p.y+.1,p.z+.2,.4,.19,.32);
    }
    for(let i=0;i<7;i++){
     const a=i*2.4,p=place(land,Math.sin(a)*.60,Math.cos(a)*.63);
     tropical.card(4,p.x,p.y,p.z,.7,.7);
    }
   }else if(land.id==='sunset'){
    // Volcán Barú: the tallest mountain in this fantasy archipelago.
    // Terrain is the real, walkable collision surface, not a decorative cone.
    const basalt=mat('#645d56',{map:surfaces.stone,bumpMap:surfaces.stone,bumpScale:.20,roughness:1}),
      gravel=mat('#bd9f79',{map:surfaces.sand,bumpMap:surfaces.sand,bumpScale:.10,roughness:1}),
      signWood=mat('#866445',{map:surfaces.wood,bumpMap:surfaces.wood,bumpScale:.075});
    // A wide, continuous stone hiking path that sits exactly on the terrain.
    const vertices=[],texcoords=[],triangles=[],steps=220;
    for(let i=0;i<=steps;i++){
      const t=i/steps,p=volcanoTrailPoint(t),prev=volcanoTrailPoint(Math.max(0,t-1/steps)),
        next=volcanoTrailPoint(Math.min(1,t+1/steps));
      const tx=next.x-prev.x,tz=next.z-prev.z,length=Math.max(.001,Math.hypot(tx,tz));
      const normalX=tz/length,normalZ=-tx/length;
      for(const side of [-1,1]){
       const width=t>.92?1.00:1.32;
       const x=p.x+normalX*width*side,z=p.z+normalZ*width*side;
       vertices.push(x,isletHeight(x,z)+.16,z);
       texcoords.push(side===1?1:0,t*26);
      }
      if(i<steps){const n=i*2;triangles.push(n,n+2,n+1,n+1,n+2,n+3);}
    }
    const pathGeo=geometry(new T.BufferGeometry());
    pathGeo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
    pathGeo.setAttribute('uv',new T.Float32BufferAttribute(texcoords,2));
    pathGeo.setIndex(triangles);pathGeo.computeVertexNormals();
    const trail=make(pathGeo,gravel);trail.name='Volcán Barú continuous walkable spiral hiking trail';
    trail.castShadow=false;trail.receiveShadow=true;
    // Painted stone waymarkers and short rail fences keep the trail readable.
    for(let k=0;k<=20;k++){
     const p=volcanoTrailPoint(k/20),mark=roadsidePoint(p.x,p.z,.2),h=isletHeight(mark.x,mark.z);
     const marker=make(cylinder,signWood,mark.x,h+.48,mark.z,.10,.96,.10);
     marker.name='Volcán Barú trail marker '+k;
     make(ball,k%5===0?gold:cream,mark.x,h+1.05,mark.z,.18,.18,.18);
     if(k>0&&k<20&&k%3===0){
      const next=volcanoTrailPoint((k+.15)/20),dirX=next.x-p.x,dirZ=next.z-p.z;
      const d=Math.max(.001,Math.hypot(dirX,dirZ));
      const sideX=dirZ/d,sideZ=-dirX/d;
      for(const sign of [-1,1]){
       const x=p.x+sideX*1.8*sign,z=p.z+sideZ*1.8*sign,y=isletHeight(x,z);
       if(nearRoad(x,z,HIGHWAY_WIDTH/2+.5))continue;
       make(cylinder,signWood,x,y+.60,z,.10,1.20,.10);
       make(ball,gold,x,y+1.27,z,.15,.15,.15);
      }
     }
    }
    // Jagged basalt outcrops along the slope, but outside the hiking lane.
    for(let i=0;i<56;i++){
     const angle=i*2.3999632,r=.22+(i%9)*.079;
     const size=.60+(i%5)*.30;
     const {x,z}=roadsidePoint(land.x+Math.cos(angle)*land.rx*r,land.z+Math.sin(angle)*land.rz*r,size);
     const y=isletHeight(x,z);
     const rock=make(rockGeo,basalt,x,y+.43*size,z,size*.75,size,size*.65);
     rock.rotation.y=angle;rock.rotation.z=Math.sin(i*7)*.15;
    }
    // Lower slopes are still Chiriquí cloud forest, with pines and ferns.
    for(let i=0;i<19;i++){
     const angle=i*2.4,r=.78+(i%3)*.043,p=place(land,Math.sin(angle)*r,Math.cos(angle)*r);
     fireflyTree(p.x,p.z,i);
    }
    volcanoes.push(createActiveVolcano({T,scene,x:land.x,z:land.z,height:isletHeight,light}));
    // Safe summit lookout at the end of the hiking trail.
    const summit=volcanoTrailPoint(1);
    const platform=make(cylinder,signWood,summit.x,summit.y+.13,summit.z,1.60,.24,1.60);
    platform.name='Volcán Barú summit lookout';platform.castShadow=false;
    const flagPost=make(cylinder,signWood,summit.x+.88,summit.y+1.62,summit.z,.075,3.0,.075);
    flagPost.name='Volcán Barú summit flag';
    const flag=make(box,red,summit.x+1.42,summit.y+2.57,summit.z,.96,.62,.065);
    flag.name='Red summit flag of Volcán Barú';
    make(ball,gold,summit.x+.88,summit.y+3.2,summit.z,.20,.20,.20);
    const start=volcanoTrailPoint(0);
    make(cylinder,signWood,start.x,start.y+.87,start.z,.17,1.7,.17);
    const entranceSign=make(box,wood,start.x,start.y+1.82,start.z,3.2,1.12,.20);
    entranceSign.name='🥾 Sendero al Volcán Barú · trail begins';
   }else if(land.id==='crystalCove'){
    // Guna Yala is low white sand; palms and community life are added by San Blas life.
   }
   if(land.vehicleOnly){
    // Keep the existing strong-current boundary visible without adding a wall.
    for(let i=0;i<16;i++){
     const a=i*Math.PI/8,x=land.x+Math.sin(a)*land.rx*1.6,z=land.z+Math.cos(a)*land.rz*1.6;
     make(ball,gold,x,0,z,.16,.25,.16);
    }
   }
  }
  // Transparent lagoon, a visible sandy seabed, and small irregular wave highlights.
  // Layered moving water: soft vertex swell + screen-space foam/caustics.
  // Compact shader avoids reflection render passes and protects mobile FPS.
  const coast=coastDistanceField((x,z)=>terrainHeight(x,z)>0||Math.hypot(x/20,z/14)<homeShoreRadius(Math.atan2(z/14,x/20)),512,448,WORLD_EXTENT);
  // Reuse the coast texture's green channel for the authoritative freshwater boundary.
  for(let j=0;j<coast.height;j++)for(let i=0;i<coast.width;i++){
   const x=WORLD_EXTENT.left+(i+.5)*WORLD_EXTENT.width/coast.width,z=WORLD_EXTENT.top+(j+.5)*WORLD_EXTENT.height/coast.height;
   coast.pixels[(j*coast.width+i)*4+1]=freshwaterHabitat(x,z)?255:0;
  }
  const coastTexture=new T.DataTexture(coast.pixels,coast.width,coast.height,T.RGBAFormat);
  coastTexture.magFilter=coastTexture.minFilter=T.LinearFilter;coastTexture.needsUpdate=true;textures.add(coastTexture);
  const waterMaterial=new T.ShaderMaterial({
    transparent:true,depthWrite:false,
    uniforms:{
      time:{value:0},daylight:{value:1},coastMap:{value:coastTexture},
      wakePosition:{value:new T.Vector2(-999,-999)},
      wakeDirection:{value:new T.Vector2(0,1)},
      wakeStrength:{value:0}
    },
    vertexShader:`
      uniform float time;
      varying vec3 pos;
      void main(){
        vec3 p=position;
        p.z+=sin(p.x*.42+p.y*.22+time*1.1)*.042
            +cos(p.y*.38-p.x*.14+time*.75)*.035
            +sin(p.x*.16-p.y*.26-time*.85)*.045;
        pos=p;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
      }`,
    fragmentShader:`
      uniform float time;
      uniform float daylight;
      uniform sampler2D coastMap;
      uniform vec2 wakePosition;
      uniform vec2 wakeDirection;
      uniform float wakeStrength;
      varying vec3 pos;
      float swells(vec2 p){
        // Broad wind patches bend the wave trains so the sea does not read
        // as a repeating straight stripe texture at the horizon.
        p+=vec2(sin(p.y*.071+p.x*.029-time*.08),
                cos(p.x*.063-p.y*.037+time*.06))*2.8;
        return sin(p.x*.91+p.y*.33+time*.96)*.24
         +sin(p.x*-.43+p.y*1.31-time*.72)*.18
         +sin(p.x*2.22-p.y*.84+time*1.31)*.07
         +sin(p.x*5.8+p.y*4.4-time*1.8)*.02;
      }
      void main(){
        vec2 p=pos.xy;
        float shoreDistance=texture2D(coastMap,(vec2(p.x,-p.y)+vec2(${-WORLD_EXTENT.left}.,${-WORLD_EXTENT.top}.))/vec2(${WORLD_EXTENT.width}.,${WORLD_EXTENT.height}.)).r*64.;
        float depth=smoothstep(1.5,24.,shoreDistance);
        float detailFade=1.-smoothstep(.12,.8,length(fwidth(p)));
        float swell=swells(p);
        vec3 normal=normalize(vec3(
          (swell-swells(p+vec2(.16,0.)))*2.6,
          1.,
          (swell-swells(p+vec2(0.,.16)))*2.6
        ));
        normal=normalize(mix(vec3(0.,1.,0.),normal,detailFade));
        vec3 eye=normalize(cameraPosition-vec3(p.x,-.12,-p.y));
        float fresnel=pow(1.-max(dot(normal,eye),0.),4.5);
        vec3 water=mix(vec3(.08,.62,.67),vec3(.018,.22,.43),depth);
        float guna=1.-smoothstep(48.,72.,length((p-vec2(${cityX(290)}.,245.))*vec2(.40,.57)));
        water=mix(water,mix(vec3(.22,.80,.76),vec3(.025,.40,.57),depth),guna*.72);
        float bocas=1.-smoothstep(55.,100.,length(p-vec2(-230.,200.)));
        water=mix(water,mix(vec3(.10,.65,.60),vec3(.025,.27,.44),depth),bocas*.7);
        float gorgona=(1.-smoothstep(65.,130.,abs(p.x+20.)))*(1.-smoothstep(25.,75.,abs(p.y)));
        water=mix(water,mix(vec3(.13,.50,.53),vec3(.025,.28,.48),depth),gorgona*.65);
        // The canal/lake read as freshwater, never as a coral lagoon.
        float canalLake=texture2D(coastMap,(vec2(p.x,-p.y)+vec2(${-WORLD_EXTENT.left}.,${-WORLD_EXTENT.top}.))/vec2(${WORLD_EXTENT.width}.,${WORLD_EXTENT.height}.)).g;
        water=mix(water,mix(vec3(.18,.39,.31),vec3(.055,.25,.25),depth),canalLake*.85);
        // Turquoise color ripples move across the sandy shallows.
        float ripples=sin(p.x*1.2+p.y*.46+time*.8)*sin(p.y*1.24-p.x*.31-time*.9);
        water+=vec3(.004,.012,.012)*ripples*(1.-depth)*detailFade;
        // Small sun glints and broad, softened specular reflection.
        vec3 sun=normalize(vec3(-.46,1.,.39));
        float glare=pow(max(dot(normal,normalize(sun+eye)),0.),100.);
        water+=vec3(.94,.87,.68)*glare*.38;
        float sparkle=pow(max(0.,sin(p.x*5.6+time*1.8)*sin(p.y*6.4-time*1.1)),13.);
        water+=vec3(.07,.11,.10)*sparkle*(.15+.5*(1.-depth))*detailFade;
        // Moving caustics make the turquoise shallows look refractive.
        float caustic=pow(max(0.,sin(p.x*2.1+sin(p.y*.93)+time*.64)*
          sin(p.y*2.4+sin(p.x*1.15)-time*.52)),6.);
        water+=vec3(.012,.026,.021)*caustic*(1.-depth)*detailFade;
        // Two breathing foam lines break continuously along each shoreline.
        float foamBand=exp(-pow((shoreDistance-1.2)/1.1,2.));
        float foamDetail=.58+.42*detailFade*sin(p.x*2.3+sin(p.y*1.4)+time*1.9)*
                               sin(p.y*2.1-time*1.24);
        float shoreFoam=foamBand*smoothstep(.23,.82,foamDetail);
        float incoming=exp(-pow((shoreDistance-2.2-.4*sin(time*1.18+p.x*.6))/.55,2.));
        shoreFoam=clamp(shoreFoam*.65+incoming*.26,0.,.83)*(1.-canalLake*.92);
        // Triangular white wake stays BEHIND a moving boat and slowly fades.
        vec2 delta=vec2(p.x,-p.y)-wakePosition;
        float back=-dot(delta,wakeDirection);
        float across=abs(dot(delta,vec2(-wakeDirection.y,wakeDirection.x)));
        float trail=smoothstep(.0,2.3,back)*(1.-smoothstep(12.,21.,back));
        float wakeWidth=.25+back*.20;
        float foamWake=trail*(1.-smoothstep(wakeWidth,wakeWidth+.74,across));
        float rippledWake=foamWake*(.7+.3*sin(back*4.3-across*7.+time*6.));
        water=mix(water,vec3(.82,.97,.96),clamp(shoreFoam*.52+rippledWake*wakeStrength*.56,0.,.83));
        water=mix(water,vec3(.51,.78,.89),fresnel*.38);
        water*=mix(vec3(.34,.50,.71),vec3(1.),daylight);
        float alpha=mix(.29,.94,smoothstep(.6,18.,shoreDistance));
        gl_FragColor=vec4(water,alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const atmosphere=createAtmosphere({T,scene,geometry,camera,waterMaterial});
  materials.add(waterMaterial);const water=make(geometry(roundedOceanGeometry(T)),waterMaterial,0,-.12,0);water.name='Rounded ocean horizon';water.rotation.x=-Math.PI/2;water.castShadow=false;water.receiveShadow=false;water.renderOrder=2;
  const bedGeometry=geometry(roundedOceanGeometry(T));const bedUV=bedGeometry.attributes.uv;for(let i=0;i<bedUV.count;i++)bedUV.setXY(i,bedUV.getX(i)*16,bedUV.getY(i)*16);const seabed=make(bedGeometry,mat('#b3c8b0',{map:surfaces.sand,bumpMap:surfaces.sand,bumpScale:.05,roughness:1}),0,-1.4,0);seabed.rotation.x=-Math.PI/2;seabed.castShadow=false;
  // A sandy path winding from the landing cove to the lighthouse.
  const pathPoints=[new T.Vector3(4,.4,12),new T.Vector3(3,height(3,8)+.07,8),new T.Vector3(7,height(7,4)+.08,4),new T.Vector3(4,height(4,0)+.08,0),new T.Vector3(0,height(0,-3)+.08,-3),new T.Vector3(-1,height(-1,-5)+.08,-5)];
  const pathCurve=new T.CatmullRomCurve3(pathPoints),pathVertices=[],pathUV=[],pathIndex=[];
  for(let i=0;i<=80;i++){const t=i/80,p=pathCurve.getPoint(t),d=pathCurve.getTangent(t);for(const side of [-1,1]){const x=p.x+d.z*.43*side,z=p.z-d.x*.43*side;pathVertices.push(x,height(x,z)+.035,z);pathUV.push(side===1?1:0,t*12);}if(i<80){const n=i*2;pathIndex.push(n,n+2,n+1,n+1,n+2,n+3);}}
  const pathGeometry=geometry(new T.BufferGeometry());pathGeometry.setAttribute('position',new T.Float32BufferAttribute(pathVertices,3));pathGeometry.setAttribute('uv',new T.Float32BufferAttribute(pathUV,2));pathGeometry.setIndex(pathIndex);pathGeometry.computeVertexNormals();make(pathGeometry,sand);
  const houseRoof=mat('#a27760',{map:surfaces.roof,bumpMap:surfaces.roof,bumpScale:.085,roughness:.94});
  function house(x,z,color,scale=1){
   const y=height(x,z),g=new T.Group();g.name='Gorgona coastal cottage';g.position.set(x,y,z);g.rotation.y=-.3;g.scale.setScalar(scale);scene.add(g);
   const plaster=mat('#d2c9b7',{map:surfaces.plaster,bumpMap:surfaces.plaster,bumpScale:.025}),trim=mat('#6a786c',{roughness:.86}),window=mat('#384d52',{metalness:.12,roughness:.18}),roofMetal=mat('#6d716b',{metalness:.35,roughness:.65});
   make(box,stone,0,.1,0,2.6,.2,2.1,g);make(box,plaster,0,1.1,0,2.5,2,2,g);
   for(const side of [-1,1]){const roof=make(box,roofMetal,side*.70,2.32,0,1.54,.09,2.30,g);roof.rotation.z=side*-.30;
    for(let i=0;i<17;i++){const rib=make(box,roofMetal,side*.70,2.38,-1.08+i*.135,1.55,.018,.019,g);rib.rotation.z=side*-.30;}
    make(box,trim,side*1.30,2.08,0,.07,.14,2.28,g);
    const wx=side*.78;make(box,trim,wx,1.24,1.025,.60,.75,.055,g);make(box,window,wx,1.24,1.06,.48,.60,.02,g);make(box,trim,wx,1.24,1.08,.025,.61,.025,g);make(box,trim,wx,1.24,1.08,.49,.025,.025,g);
    make(box,trim,wx,.84,1.08,.68,.06,.15,g);
   }
   make(box,trim,0,.95,1.025,.60,1.70,.06,g);make(box,wood,0,.93,1.063,.48,1.55,.024,g);make(ball,stone,.16,.94,1.09,.022,.022,.025,g);make(box,stone,0,.13,1.13,.78,.16,.25,g);
   for(let i=0;i<5;i++)make(box,wood,0,.30+i*.27,1.08,.40,.008,.012,g);
   make(box,trim,0,2.59,0,.10,.10,2.32,g);
   return g;
  }
  house(-10,5,wood,.95);house(-13,2,wood,.8);house(10,2,wood,.95);house(12,-1,wood,.75);house(9,-4,wood,.65);
  // Lighthouse, its rotating crystal, and a soft sweeping beam.
  const tower=new T.Group(),ty=height(-1,-5);tower.position.set(-1,ty,-5);scene.add(tower);make(cylinder,stone,0,.25,0,2.1,.5,2.1,tower);make(geometry(new T.CylinderGeometry(.8,1.25,6,24)),cream,0,3.3,0,1,1,1,tower);make(cylinder,red,0,3.6,0,1.03,.5,1.03,tower);make(cylinder,stone,0,6.35,0,1.4,.25,1.4,tower);make(cylinder,gold,0,7.1,0,.86,1.3,.86,tower);make(cone,red,0,8,0,1.5,1.1,1.5,tower);
  const crystal=make(ball,gold,0,7.1,0,.25,.35,.25,tower);
  for(let i=0;i<4;i++){const a=i/4*Math.PI*2;make(cylinder,wood,Math.sin(a),7.1,Math.cos(a),.07,1.4,.07,tower);}make(box,wood,0,1,1.2,.6,1.8,.1,tower);
  const beamMat=new T.MeshBasicMaterial({color:'#ffe9ad',transparent:true,opacity:.07,depthWrite:false,side:T.DoubleSide});materials.add(beamMat);const beam=make(geometry(new T.ConeGeometry(4,32,24,1,true)),beamMat,0,7.1,0,1,1,1,tower);beam.geometry.translate(0,-16,0);beam.rotation.z=Math.PI/2;beam.castShadow=false;beam.receiveShadow=false;
  // Low-cost mainland mesh connects the real regions; lake and canal cuts stay open.
  const mainlandVertices=[],mainlandUV=[];
  const dryMainland=(x,z)=>mainlandContains(x,z)&&!canalWater(x,z)&&!gatunWater(x,z);
  const inland=(x,z)=>dryMainland(x,z)&&Math.hypot(x/20,z/14)>.90&&!worldIslands.some(p=>Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)<.90);
  // Overlap the existing region meshes slightly from below: no empty moat or z-fighting.
  // Subdivide waterline edges fivefold to remove blocky land endings without
  // multiplying all inland polygons; clip the final boundary precisely.
  for(let x=-454;x<MAINLAND_EAST+1;x+=3)for(let z=-432;z<39;z+=3)
  if(z>=-167||(x>=-125&&x<=80))for(const [sx,sz,size] of shorelineTiles(x,z,3,inland,light?3:5)){
   const corners=[[sx,0,sz],[sx+size,0,sz],[sx,0,sz+size],[sx+size,0,sz+size]];
   for(const tri of [[0,2,1],[1,2,3]]){
    const vertices=clipLandTriangle(tri.map(i=>corners[i]),inland);
    const emit=(px,py,pz)=>{mainlandVertices.push(px,py,pz);mainlandUV.push(px*.18,pz*.18);};
    for(const [px,,pz] of vertices)emit(px,Math.max(.025,terrainHeight(px,pz)-.075),pz);
    // Close the exposed shore down to the seabed instead of leaving a floating sheet.
    for(let k=0;k<vertices.length;k+=3)for(let e=0;e<3;e++){
     const a=vertices[k+e],b=vertices[k+(e+1)%3],dx=b[0]-a[0],dz=b[2]-a[2],len=Math.hypot(dx,dz);
     if(len<.001)continue;
     const mx=(a[0]+b[0])/2,mz=(a[2]+b[2])/2,nx=-dz/len*.015,nz=dx/len*.015;
     if(dryMainland(mx+nx,mz+nz)===dryMainland(mx-nx,mz-nz))continue;
     const ay=Math.max(.025,terrainHeight(a[0],a[2])-.075),by=Math.max(.025,terrainHeight(b[0],b[2])-.075);
     for(const v of [[a[0],ay,a[2]],[a[0],-1.4,a[2]],[b[0],by,b[2]],[b[0],by,b[2]],[a[0],-1.4,a[2]],[b[0],-1.4,b[2]]])emit(...v);
    }
   }
  }
  const mainlandGeo=geometry(new T.BufferGeometry());mainlandGeo.setAttribute('position',new T.Float32BufferAttribute(mainlandVertices,3));mainlandGeo.setAttribute('uv',new T.Float32BufferAttribute(mainlandUV,2));mainlandGeo.computeVertexNormals();
  // The mainland also shows between the city's organic edge and its streets.
  // Select a material per existing triangle, without moving land or collision heights.
  const cityLand=worldIslands.find(p=>p.id==='pizzaCity');
  const mainlandIndices=[[],[]];
  for(let i=0;i<mainlandVertices.length;i+=9){
   const x=(mainlandVertices[i]+mainlandVertices[i+3]+mainlandVertices[i+6])/3,
    z=(mainlandVertices[i+2]+mainlandVertices[i+5]+mainlandVertices[i+8])/3;
   // Curved district edges replace the old square asphalt cutouts while
   // keeping the downtown highway and every saved structure in place.
   const eastCoast=Math.hypot((x-cityX(216))/61,(z+51)/41),
    colonCoast=Math.min(Math.hypot((x+55)/35,(z+246)/26),Math.hypot((x-7)/43,(z+249)/29));
   const eastEdge=.99+.022*Math.sin(x*.21+z*.14),
    colonEdge=1+.024*Math.cos(x*.24-z*.16);
   const urban=Math.hypot((x-cityLand.x)/cityLand.rx,(z-cityLand.z)/cityLand.rz)<=1||
    eastCoast<eastEdge||colonCoast<colonEdge;
   mainlandIndices[urban?1:0].push(i/3,i/3+1,i/3+2);
  }
  // Two draw groups preserve every triangle while keeping mobile rendering cheap.
  mainlandGeo.setIndex(mainlandIndices.flat());
  mainlandGeo.addGroup(0,mainlandIndices[0].length,0);
  mainlandGeo.addGroup(mainlandIndices[0].length,mainlandIndices[1].length,1);
  const mainlandMaterials=[landscapeMaterial({T,mat,surfaces,vertexColors:false}),
   mat('#3c424c',{map:surfaces.asphalt,bumpMap:surfaces.asphalt,bumpScale:.035,roughness:1})];
  const mainlandMesh=make(mainlandGeo,mainlandMaterials,0,0,0,1,1,1);mainlandMesh.name='Connected Panama mainland · Pacific and Caribbean coasts';mainlandMesh.castShadow=false;
  // Large, irregular forestry corridors: rainforest palms and emergent broadleaf
  // giants on the Pacific mainland, montane pines toward Volcán Barú.
  // Six batched meshes keep the dense canopy inexpensive on mobile devices.
  const forestLandscape=createForestLandscape({T,scene,mat,geometry,height,light});
  // The dock, moored boat, and a moving sailboat out on the water.
  for(let i=0;i<15;i++){make(box,wood,4,.42,12+i*.36,2,.16,.28);if(i%4===0)for(const dx of [-.9,.9])make(cylinder,wood,4+dx,.23,12+i*.36,.1,1.25,.1);}
  function boat(x,z,s){
   const g=new T.Group();g.name='Timber sailing dinghy';g.position.set(x,.25,z);g.scale.setScalar(s);scene.add(g);
   const hullPositions=[],hullUV=[],hullIndices=[],stations=24,steps=12;
   for(let i=0;i<=stations;i++){const t=i/stations,long=(t-.5)*3.6,width=Math.pow(Math.sin(t*Math.PI),.62)*.70+.015;
    for(let j=0;j<=steps;j++){const a=j/steps*Math.PI;hullPositions.push(long,.18-Math.sin(a)*.42,width*Math.cos(a));hullUV.push(t*2,j/steps);if(i<stations&&j<steps){const n=i*(steps+1)+j;hullIndices.push(n,n+1,n+steps+1,n+1,n+steps+2,n+steps+1);}}
   }
   const hullGeo=geometry(new T.BufferGeometry());hullGeo.setAttribute('position',new T.Float32BufferAttribute(hullPositions,3));hullGeo.setAttribute('uv',new T.Float32BufferAttribute(hullUV,2));hullGeo.setIndex(hullIndices);hullGeo.computeVertexNormals();
   const hull=make(hullGeo,mat('#a49b82',{map:surfaces.wood,side:T.DoubleSide,roughness:.82}),0,0,0,1,1,1,g);hull.name='Curved timber hull';
   for(const sign of [-1,1]){const points=Array.from({length:25},(_,i)=>{const t=i/24;return new T.Vector3((t-.5)*3.6,.19,sign*(Math.pow(Math.sin(t*Math.PI),.62)*.70+.015));});make(geometry(new T.TubeGeometry(new T.CatmullRomCurve3(points),32,.035,6,false)),wood,0,0,0,1,1,1,g);}
   for(const bx of [-.85,0,.85])make(box,wood,bx,.07,0,.32,.06,1.0,g);
   make(cylinder,wood,0,1.7,0,.035,3.3,.035,g);
   const shape=new T.Shape();shape.moveTo(0,0);shape.lineTo(0,2.8);shape.quadraticCurveTo(-.40,1.2,-1.5,.15);shape.closePath();const sail=make(geometry(new T.ShapeGeometry(shape)),mat('#d8d6c6',{map:surfaces.plaster,side:T.DoubleSide,roughness:.97}),.07,.3,0,1,1,1,g);sail.name='Canvas mainsail';
   const rope=mat('#a99d7a');for(const bx of [-1.5,1.5]){const curve=new T.LineCurve3(new T.Vector3(0,3.3,0),new T.Vector3(bx,.2,0));make(geometry(new T.TubeGeometry(curve,1,.009,4,false)),rope,0,0,0,1,1,1,g);}
   g.rotation.y=-.3;bobbing.push({g,y:.25,z});return g;
  }
  const dockBoat=boat(6.5,16,.75);dockBoat.name='Dock boat';const sailboat=boat(-18,21,1.2);
  // Distant islets and glowing motes give the approach a sense of depth.
  const motePositions=[];for(let i=0;i<60;i++)motePositions.push((rand()-.5)*40,1+rand()*10,(rand()-.5)*30);const motesGeo=geometry(new T.BufferGeometry());motesGeo.setAttribute('position',new T.Float32BufferAttribute(motePositions,3));const moteMat=new T.PointsMaterial({color:'#d8d6c6',size:.025,transparent:true,opacity:.18,depthWrite:false});materials.add(moteMat);const motes=new T.Points(motesGeo,moteMat);scene.add(motes);
  let frame=0,last=0,lastDraw=0,time=0,volcanoTime=0,disposed=false,flight=null,finish=null,width=1,heightPx=1,px=0,py=0;
  const target=new T.Vector3(),startCam=new T.Vector3(),startLook=new T.Vector3(),endCam=new T.Vector3(7,6.5,24),endLook=new T.Vector3(2,3.7,4);
  function resize(){const r=canvas.parentElement.getBoundingClientRect();width=Math.max(1,r.width);heightPx=Math.max(1,r.height);renderer.setSize(width,heightPx,false);camera.aspect=width/heightPx;camera.setViewOffset(width,heightPx,width>780?-width*.17:0,width>780?0:heightPx*.13,width,heightPx);if(setup)camera.clearViewOffset();camera.updateProjectionMatrix();if(!motion())draw();}
  function pose(){const phone=width<780;camera.position.set(phone?39:35,phone?34:25,phone?66:51);target.set(0,3,0);}
  function draw(){if(renderer.getContext?.().isContextLost())return;renderer.render(scene,camera);}
  function tick(stamp){frame=0;if(disposed||document.hidden||renderer.getContext?.().isContextLost())return;if(lastDraw&&stamp-lastDraw<1000/30-.5){frame=requestAnimationFrame(tick);return;}lastDraw=stamp;const elapsed=last?(stamp-last)/1000:0,dt=Math.min(elapsed,.1);last=stamp;const moving=motion();if(moving)time+=dt;if(explorer||moving)volcanoTime+=dt;
    try{
    if(flight!==null){flight+=elapsed;const p=moving?Math.min(flight/3.2,1):1,e=p*p*(3-2*p);camera.position.lerpVectors(startCam,endCam,e);target.lerpVectors(startLook,endLook,e);camera.clearViewOffset();camera.updateProjectionMatrix();canvas.parentElement.style.setProperty('--arrival',String(p));if(p===1){const done=finish;finish=null;flight=null;done?.();if(disposed)return;}}
    else if(!explorer){pose();if(moving){camera.position.x+=Math.sin(time*.13)*1.3+px*1.2;camera.position.y+=Math.sin(time*.24)*.4-py*.5;}}
    if(explorer)explorer.update(dt,time);atmosphere.update(time);const player=explorer?.playerPosition?.();if(player){shadows.update(player.x,player.y??height(player.x,player.z),player.z);forestLandscape.updateFocus(player.x,player.z,camera);}camera.lookAt(target);volcanoes.forEach(v=>v.update(volcanoTime));tropical.update(motion()?time:0);waterMaterial.uniforms.time.value=time;crystal.rotation.y=time*.35;beam.rotation.y=time*.22;
    clouds.forEach(c=>{c.g.position.x=c.x+Math.sin(time*.03+c.z)*3;});bobbing.forEach((b,i)=>{b.g.position.y=b.y+Math.sin(time*1.2+i)*.12;b.g.rotation.z=Math.sin(time+i)*.025;});sailboat.position.x=-18+Math.sin(time*.04)*4;motes.rotation.y=Math.sin(time*.1)*.03;
    draw();}catch(error){onError(error);return;}if(explorer||moving||flight!==null)frame=requestAnimationFrame(tick);
  }
  function wake(){if(!disposed&&!document.hidden&&!frame){last=0;frame=requestAnimationFrame(tick);}}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else wake();}
  function pointer(e){if(!motion()||flight!==null)return;const r=canvas.getBoundingClientRect();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;}
  const observer=new ResizeObserver(resize),bodyObserver=new MutationObserver(wake);observer.observe(canvas.parentElement);bodyObserver.observe(document.body,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',visibility);canvas.parentElement.addEventListener('pointermove',pointer,{passive:true});
  let explorer,polyhaven;
  try{explorer=setup?.({T,scene,camera,target,height,make,geometry,mat,ball,cone,cylinder,box,renderer,tropical,tower,beam,crystal,dockBoat,sun,ambient,waterMaterial,surfaces});
  pose();camera.lookAt(target);resize();if(explorer){camera.clearViewOffset();camera.updateProjectionMatrix();explorer.update(0,0);}draw();wake();
  // Optional environment textures arrive after the world is already playable.
  polyhaven=installPolyHavenMaterials(T,{surfaces,scene,materials,renderer,redraw:wake});
  }catch(error){dispose();throw error;}
  return {
    resume(){renderer.shadowMap.needsUpdate=true;wake();},
    flyIn(done){if(disposed)return;startCam.copy(camera.position);startLook.copy(target);flight=0;finish=done;wake();},
    dispose
  };
  function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);finish=null;explorer?.dispose();shadows.dispose();atmosphere.dispose();volcanoes.forEach(v=>v.dispose());tropical.dispose();polyhaven?.dispose();surfaces.dispose();observer.disconnect();bodyObserver.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.parentElement?.removeEventListener('pointermove',pointer);textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());sun.shadow.map?.dispose();renderer.dispose();renderer.forceContextLoss();}
}

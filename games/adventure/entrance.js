import {clipLandTriangle,coastDistanceField} from './terrain-surface.js?v=156';
import {mainlandContains,canalWater,gatunWater,organicIslandRadius,homeShoreRadius} from './geography.js?v=157';
import {createActiveVolcano} from './active-volcano.js?v=156';
import {worldIslands,isletHeight,volcanoTrailPoint} from './explore-state.js?v=164';
import {createTropical} from './tropical.js?v=159';
import {createSurfaceTextures} from './surface-textures.js?v=156';
import {installPolyHavenMaterials} from './polyhaven-materials.js?v=156';
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
  renderer.shadowMap.enabled=!light;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
  const scene=new T.Scene();scene.background=new T.Color('#b0d3e2');scene.fog=new T.FogExp2('#b8d6dd',.0022);
  const camera=new T.PerspectiveCamera(42,1,.2,550),sun=new T.DirectionalLight('#fff0d2',3.0);sun.position.set(-22,38,18);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-30;sun.shadow.camera.right=30;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;sun.shadow.normalBias=.1;const ambient=new T.HemisphereLight('#c9edff','#58623c',1.45);scene.add(sun,ambient);
  const textures=new Set(),geometries=new Set(),materials=new Set(),clouds=[],bobbing=[],volcanoes=[];let seed=4107;
  const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const geometry=g=>{geometries.add(g);return g;};
  const mat=(color,extra={})=>{const m=new T.MeshStandardMaterial({color,roughness:.88,...extra});materials.add(m);return m;};
  const make=(g,m,x=0,y=0,z=0,sx=1,sy=sx,sz=sx,parent=scene)=>{const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
  const ball=geometry(new T.SphereGeometry(1,16,12)),cone=geometry(new T.ConeGeometry(1,1,8)),cylinder=geometry(new T.CylinderGeometry(1,1,1,12)),box=geometry(new T.BoxGeometry(1,1,1));
  const sand=mat('#e8c895'),green=mat('#568d58'),darkGreen=mat('#246b57'),leaf=mat('#79a05b'),trunk=mat('#855b42'),stone=mat('#84958c'),cream=mat('#fff0ca'),wood=mat('#986b44'),red=mat('#ce826c'),blue=mat('#579c9d'),violet=mat('#a99ac0'),gold=mat('#ffda83',{emissive:'#efb449',emissiveIntensity:.32});
  function height(x,z){if(isletHeight(x,z)>0)return isletHeight(x,z);const edge=Math.sqrt((x/20)**2+(z/14)**2);const hill=6*Math.exp(-((x+1)**2/30+(z+5)**2/22));return Math.max(.1,(1-edge*edge)*2.8)+hill;}
  // A sculpted, vertex-colored island; this is geometry, not a picture on a plane.
  const surfaces=createSurfaceTextures(T);
  const tropical=createTropical({T,scene,camera,height,geometry,mat,make,ball,renderer,surfaces});
  for(const [material,surface,bump] of [[sand,surfaces.sand,.07],[green,surfaces.grass,.10],
    [darkGreen,surfaces.grass,.10],[leaf,surfaces.grass,.09],[trunk,surfaces.wood,.08],
    [stone,surfaces.stone,.11],[cream,surfaces.plaster,.035],[wood,surfaces.wood,.065]]){
    material.map=surface;material.bumpMap=surface;material.bumpScale=bump;material.needsUpdate=true;
  }
  const positions=[],colors=[],uvs=[],indices=[],rings=52,segments=144;
   const blend=(from,to,value)=>{const t=Math.max(0,Math.min(1,(value-from)/(to-from)));return t*t*(3-2*t);};
  for(let ring=0;ring<=rings;ring++)for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2,r=ring/rings,shore=homeShoreRadius(a),x=Math.cos(a)*20*r*shore,z=Math.sin(a)*14*r*shore,y=ring===rings?.08:height(x,z);positions.push(x,y,z);uvs.push(x*.18,z*.18);const patch=r+.043*Math.sin(x*.28+z*.18)+.027*Math.cos(x*.13-z*.49);
   const c=new T.Color('#527842').lerp(new T.Color('#789454'),blend(.30,.77,patch));
   c.lerp(new T.Color('#e5d5ad'),blend(.75,.94,patch));
   c.lerp(new T.Color('#969784'),blend(4.5,7,y)*.7);
   c.multiplyScalar(.92+.10*Math.sin(x*.23+z*.13)*Math.cos(z*.38-x*.09)+rand()*.055);colors.push(c.r,c.g,c.b);}
  for(let j=0;j<rings;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,b=a+segments+1;indices.push(a,a+1,b,b,a+1,b+1);}
  const terrain=geometry(new T.BufferGeometry());terrain.setAttribute('position',new T.Float32BufferAttribute(positions,3));terrain.setAttribute('color',new T.Float32BufferAttribute(colors,3));terrain.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));terrain.setIndex(indices);terrain.computeVertexNormals();make(terrain,mat('#ffffff',{vertexColors:true,map:surfaces.grass,bumpMap:surfaces.grass,bumpScale:.13,roughness:.98}));
  // Five deliberately different destinations: shape, silhouette, color and landmarks.
  // All decorations use the same physical x/z coordinates as player navigation.
  const rockGeo=geometry(new T.IcosahedronGeometry(1,1));
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
   pizzaCity:['#e2dfba','#87b07e','#ead7af']
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
   const y=height(x,z);
   const color=i%2?beachBlue:beachCoral;
   make(cylinder,beachWood,x,y+1.22,z,.08,2.44,.08);
   const canopy=make(cone,color,x,y+2.5,z,1.5,.53,1.5);
   canopy.rotation.y=i*.45;
   make(box,beachShell,x,y+.16,z,1.5,.14,.8);
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
   const rings=land.id==='sunset'?62:land.guna?10:20,segments=land.id==='sunset'?144:land.guna?32:80;
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
   const islandTexture=land.id==='coconutCoast'||land.id==='crystalCove'||land.guna?surfaces.sand:land.id==='crystalCove'||land.id==='sunset'?surfaces.stone:surfaces.grass;
   const island=make(g,mat('#ffffff',{vertexColors:true,map:islandTexture,bumpMap:islandTexture,bumpScale:land.id==='crystalCove'?.14:.09,roughness:.96}));
   island.name=land.en;

   if(land.id==='islet'){
    // Butterfly Meadow: low rolling pastel hills, oversized wildflowers,
    // a ribbon of butterflies, and a flower garden rather than palm trees.
    for(let i=0;i<9;i++){
     const a=i*2.4,p=place(land,Math.sin(a)*.65,Math.cos(a)*.62);
     meadowFlower(p.x,p.z,i,.82+(i%3)*.17);
    }
    for(let i=0;i<16;i++){
     const a=i*2.4,p=place(land,Math.sin(a)*(.25+(i%3)*.19),Math.cos(a)*(.25+(i%3)*.19));
     tropical.card(15,p.x,p.y,p.z,1.5,1.5);
    }
    for(let i=0;i<5;i++){
     const a=i*2.5,p=place(land,Math.sin(a)*.3,Math.cos(a)*.35);
     meadowButterfly(p.x,p.z,i);
    }
    const p=place(land,-.45,-.16);
    make(ringGeo,meadowLilac,p.x,p.y+2.25,p.z,2.1,2.1,.65);
   }else if(land.id==='wilds'){
    // Banana Jungle: huge broad-leaf canopy, layered vines and fruit
    // everywhere, with a little treehouse shelter in the dense green.
    for(let i=0;i<11;i++){
     const a=i*2.39996,r=.43+(i%3)*.12,p=place(land,Math.sin(a)*r,Math.cos(a)*r);
     jungleTree(p.x,p.z,i);
    }
    for(let i=0;i<19;i++){
     const a=i*2.4,r=.23+(i%4)*.17,p=place(land,Math.sin(a)*r,Math.cos(a)*r);
     tropical.card(1,p.x,p.y,p.z,2.9+(i%3)*.5,3.2+(i%3)*.35);
    }
    const den=place(land,.22,.18);
    make(box,beachWood,den.x,den.y+2.0,den.z,3.5,.3,3);
    for(const u of [-1.5,1.5])for(const v of [-1.2,1.2])
     make(cylinder,barkDark,den.x+u,den.y+1,den.z+v,.14,2,.14);
    make(cone,jungleLime,den.x,den.y+3.45,den.z,3,1.3,2.9);
    for(let i=0;i<5;i++){
     const p=place(land,-.65+i*.22,.08);
     tropical.card(7,p.x,p.y+.08,p.z,.75,1);
    }
   }else if(land.id==='coconutCoast'){
    // Sunshine Beach: pale sand, a dense ring of palms, bright beach
    // parasols and surfboards; deliberately flat and open for boating.
    for(let i=0;i<22;i++){
     const a=i*2.4,r=.37+(i%4)*.16,p=place(land,Math.sin(a)*r,Math.cos(a)*r);
     tropical.palm(p.x,p.z,1.05+(i%3)*.23,true);
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
     const p=volcanoTrailPoint(k/20),h=isletHeight(p.x,p.z);
     const marker=make(cylinder,signWood,p.x,h+.48,p.z,.10,.96,.10);
     marker.name='Volcán Barú trail marker '+k;
     make(ball,k%5===0?gold:cream,p.x,h+1.05,p.z,.18,.18,.18);
     if(k>0&&k<20&&k%3===0){
      const next=volcanoTrailPoint((k+.15)/20),dirX=next.x-p.x,dirZ=next.z-p.z;
      const d=Math.max(.001,Math.hypot(dirX,dirZ));
      const sideX=dirZ/d,sideZ=-dirX/d;
      for(const sign of [-1,1]){
       const x=p.x+sideX*1.8*sign,z=p.z+sideZ*1.8*sign,y=isletHeight(x,z);
       make(cylinder,signWood,x,y+.60,z,.10,1.20,.10);
       make(ball,gold,x,y+1.27,z,.15,.15,.15);
      }
     }
    }
    // Jagged basalt outcrops along the slope, but outside the hiking lane.
    for(let i=0;i<56;i++){
     const angle=i*2.3999632,r=.22+(i%9)*.079;
     const x=land.x+Math.cos(angle)*land.rx*r,z=land.z+Math.sin(angle)*land.rz*r;
     const y=isletHeight(x,z),size=.60+(i%5)*.30;
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
  const coast=coastDistanceField((x,z)=>isletHeight(x,z)>0||Math.hypot(x/20,z/14)<homeShoreRadius(Math.atan2(z/14,x/20)));
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
        return sin(p.x*.91+p.y*.33+time*.96)*.24
         +sin(p.x*-.43+p.y*1.31-time*.72)*.18
         +sin(p.x*2.22-p.y*.84+time*1.31)*.07
         +sin(p.x*5.8+p.y*4.4-time*1.8)*.02;
      }
      void main(){
        vec2 p=pos.xy;
        float shoreDistance=texture2D(coastMap,(vec2(p.x,-p.y)+vec2(375.,325.))/vec2(750.,650.)).r*64.;
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
        vec3 water=mix(vec3(.12,.72,.64),vec3(.016,.21,.36),depth);
        float guna=1.-smoothstep(48.,72.,length((p-vec2(205.,130.))*vec2(1.,1.2)));
        water=mix(water,mix(vec3(.25,.78,.72),vec3(.015,.42,.52),depth),guna*.72);
        // Turquoise color ripples move across the sandy shallows.
        float ripples=sin(p.x*1.2+p.y*.46+time*.8)*sin(p.y*1.24-p.x*.31-time*.9);
        water+=vec3(.014,.044,.043)*ripples*(1.-depth)*detailFade;
        // Small sun glints and broad, softened specular reflection.
        vec3 sun=normalize(vec3(-.46,1.,.39));
        float glare=pow(max(dot(normal,normalize(sun+eye)),0.),100.);
        water+=vec3(.94,.87,.68)*glare*.38;
        float sparkle=pow(max(0.,sin(p.x*5.6+time*1.8)*sin(p.y*6.4-time*1.1)),13.);
        water+=vec3(.07,.11,.10)*sparkle*(.15+.5*(1.-depth))*detailFade;
        // Moving caustics make the turquoise shallows look refractive.
        float caustic=pow(max(0.,sin(p.x*2.1+sin(p.y*.93)+time*.64)*
          sin(p.y*2.4+sin(p.x*1.15)-time*.52)),6.);
        water+=vec3(.035,.075,.06)*caustic*(1.-depth)*detailFade;
        // Two breathing foam lines break continuously along each shoreline.
        float foamBand=exp(-pow((shoreDistance-1.2)/1.1,2.));
        float foamDetail=.58+.42*detailFade*sin(p.x*2.3+sin(p.y*1.4)+time*1.9)*
                               sin(p.y*2.1-time*1.24);
        float shoreFoam=foamBand*smoothstep(.23,.82,foamDetail);
        float incoming=exp(-pow((shoreDistance-2.2-.4*sin(time*1.18+p.x*.6))/.55,2.));
        shoreFoam=clamp(shoreFoam*.65+incoming*.26,0.,.83);
        // Triangular white wake stays BEHIND a moving boat and slowly fades.
        vec2 delta=vec2(p.x,-p.y)-wakePosition;
        float back=-dot(delta,wakeDirection);
        float across=abs(dot(delta,vec2(-wakeDirection.y,wakeDirection.x)));
        float trail=smoothstep(.0,2.3,back)*(1.-smoothstep(12.,21.,back));
        float wakeWidth=.25+back*.20;
        float foamWake=trail*(1.-smoothstep(wakeWidth,wakeWidth+.74,across));
        float rippledWake=foamWake*(.7+.3*sin(back*4.3-across*7.+time*6.));
        water=mix(water,vec3(.82,.97,.96),clamp(shoreFoam*.52+rippledWake*wakeStrength*.56,0.,.83));
        water=mix(water,vec3(.51,.78,.89),fresnel*.52);
        water*=mix(vec3(.34,.50,.71),vec3(1.),daylight);
        float alpha=mix(.29,.94,smoothstep(.6,18.,shoreDistance));
        gl_FragColor=vec4(water,alpha);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  materials.add(waterMaterial);const water=make(geometry(new T.PlaneGeometry(750,650,112,96)),waterMaterial,0,-.12,0);water.rotation.x=-Math.PI/2;water.castShadow=false;water.receiveShadow=false;water.renderOrder=2;
  const bedGeometry=geometry(new T.PlaneGeometry(700,480));const bedUV=bedGeometry.attributes.uv;for(let i=0;i<bedUV.count;i++)bedUV.setXY(i,bedUV.getX(i)*16,bedUV.getY(i)*16);const seabed=make(bedGeometry,mat('#b3c8b0',{map:surfaces.sand,bumpMap:surfaces.sand,bumpScale:.05,roughness:1}),0,-1.4,0);seabed.rotation.x=-Math.PI/2;seabed.castShadow=false;
  // A sandy path winding from the landing cove to the lighthouse.
  const pathPoints=[new T.Vector3(4,.4,12),new T.Vector3(3,height(3,8)+.07,8),new T.Vector3(7,height(7,4)+.08,4),new T.Vector3(4,height(4,0)+.08,0),new T.Vector3(0,height(0,-3)+.08,-3),new T.Vector3(-1,height(-1,-5)+.08,-5)];
  const pathCurve=new T.CatmullRomCurve3(pathPoints),pathVertices=[],pathUV=[],pathIndex=[];
  for(let i=0;i<=80;i++){const t=i/80,p=pathCurve.getPoint(t),d=pathCurve.getTangent(t);for(const side of [-1,1]){const x=p.x+d.z*.43*side,z=p.z-d.x*.43*side;pathVertices.push(x,height(x,z)+.035,z);pathUV.push(side===1?1:0,t*12);}if(i<80){const n=i*2;pathIndex.push(n,n+2,n+1,n+1,n+2,n+3);}}
  const pathGeometry=geometry(new T.BufferGeometry());pathGeometry.setAttribute('position',new T.Float32BufferAttribute(pathVertices,3));pathGeometry.setAttribute('uv',new T.Float32BufferAttribute(pathUV,2));pathGeometry.setIndex(pathIndex);pathGeometry.computeVertexNormals();make(pathGeometry,sand);
  const houseRoof=mat('#a27760',{map:surfaces.roof,bumpMap:surfaces.roof,bumpScale:.085,roughness:.94});
  function house(x,z,color,scale=1){const y=height(x,z),g=new T.Group();g.position.set(x,y,z);g.rotation.y=-.3;scene.add(g);make(box,cream,0,1*scale,0,2.5*scale,2*scale,2*scale,g);const roof=make(cone,houseRoof,0,2.55*scale,0,2.25*scale,1.3*scale,1.7*scale,g);roof.rotation.y=Math.PI/4;make(box,wood,0,.7*scale,1.015*scale,.55*scale,1.4*scale,.06,g);for(const side of [-1,1])make(box,gold,side*.75*scale,1.25*scale,1.03*scale,.4*scale,.5*scale,.06,g);make(cylinder,stone,.8*scale,2.8*scale,-.4*scale,.25*scale,1.5*scale,.25*scale,g);return g;}
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
  // Clip boundary triangles rather than dropping whole grid cells at the coast.
  for(let x=-196;x<270;x+=3)for(let z=-151;z<26;z+=3){
   const corners=[[x,0,z],[x+3,0,z],[x,0,z+3],[x+3,0,z+3]];
   for(const tri of [[0,2,1],[1,2,3]]){
    const vertices=clipLandTriangle(tri.map(i=>corners[i]),inland);
    const emit=(px,py,pz)=>{mainlandVertices.push(px,py,pz);mainlandUV.push(px*.18,pz*.18);};
    for(const [px,,pz] of vertices)emit(px,Math.max(.025,height(px,pz)-.075),pz);
    // Close the exposed shore down to the seabed instead of leaving a floating sheet.
    for(let k=0;k<vertices.length;k+=3)for(let e=0;e<3;e++){
     const a=vertices[k+e],b=vertices[k+(e+1)%3],dx=b[0]-a[0],dz=b[2]-a[2],len=Math.hypot(dx,dz);
     if(len<.001)continue;
     const mx=(a[0]+b[0])/2,mz=(a[2]+b[2])/2,nx=-dz/len*.015,nz=dx/len*.015;
     if(dryMainland(mx+nx,mz+nz)===dryMainland(mx-nx,mz-nz))continue;
     const ay=Math.max(.025,height(a[0],a[2])-.075),by=Math.max(.025,height(b[0],b[2])-.075);
     for(const v of [[a[0],ay,a[2]],[a[0],-1.4,a[2]],[b[0],by,b[2]],[b[0],by,b[2]],[a[0],-1.4,a[2]],[b[0],-1.4,b[2]]])emit(...v);
    }
   }
  }
  const mainlandGeo=geometry(new T.BufferGeometry());mainlandGeo.setAttribute('position',new T.Float32BufferAttribute(mainlandVertices,3));mainlandGeo.setAttribute('uv',new T.Float32BufferAttribute(mainlandUV,2));mainlandGeo.computeVertexNormals();
  const mainlandMesh=make(mainlandGeo,mat('#829e69',{map:surfaces.grass,bumpMap:surfaces.grass,bumpScale:.055,roughness:1}),0,0,0,1,1,1);mainlandMesh.name='Connected Panama mainland · Pacific and Caribbean coasts';mainlandMesh.castShadow=false;
  // The dock, moored boat, and a moving sailboat out on the water.
  for(let i=0;i<15;i++){make(box,wood,4,.42,12+i*.36,2,.16,.28);if(i%4===0)for(const dx of [-.9,.9])make(cylinder,wood,4+dx,.23,12+i*.36,.1,1.25,.1);}
  function boat(x,z,s){const g=new T.Group();g.position.set(x,.25,z);scene.add(g);make(ball,wood,0,0,0,1.8*s,.35*s,.7*s,g);make(cylinder,cream,0,1.7*s,0,.055*s,3.3*s,.055*s,g);const shape=new T.Shape();shape.moveTo(0,0);shape.lineTo(0,2.8*s);shape.lineTo(-1.5*s,.15*s);shape.closePath();make(geometry(new T.ShapeGeometry(shape)),mat('#ffe7b5',{side:T.DoubleSide}),.07,.3*s,0,1,1,1,g);g.rotation.y=-.3;bobbing.push({g,y:.25,z});return g;}
  const dockBoat=boat(6.5,16,.75);dockBoat.name='Dock boat';const sailboat=boat(-18,21,1.2);
  // Distant islets and glowing motes give the approach a sense of depth.
  const motePositions=[];for(let i=0;i<60;i++)motePositions.push((rand()-.5)*40,1+rand()*10,(rand()-.5)*30);const motesGeo=geometry(new T.BufferGeometry());motesGeo.setAttribute('position',new T.Float32BufferAttribute(motePositions,3));const moteMat=new T.PointsMaterial({color:'#fff0ab',size:.12,transparent:true,opacity:.8,depthWrite:false});materials.add(moteMat);const motes=new T.Points(motesGeo,moteMat);scene.add(motes);
  let frame=0,last=0,lastDraw=0,time=0,volcanoTime=0,disposed=false,flight=null,finish=null,width=1,heightPx=1,px=0,py=0;
  const target=new T.Vector3(),startCam=new T.Vector3(),startLook=new T.Vector3(),endCam=new T.Vector3(7,6.5,24),endLook=new T.Vector3(2,3.7,4);
  function resize(){const r=canvas.parentElement.getBoundingClientRect();width=Math.max(1,r.width);heightPx=Math.max(1,r.height);renderer.setSize(width,heightPx,false);camera.aspect=width/heightPx;camera.setViewOffset(width,heightPx,width>780?-width*.17:0,width>780?0:heightPx*.13,width,heightPx);if(setup)camera.clearViewOffset();camera.updateProjectionMatrix();if(!motion())draw();}
  function pose(){const phone=width<780;camera.position.set(phone?39:35,phone?34:25,phone?66:51);target.set(0,3,0);}
  function draw(){if(renderer.getContext?.().isContextLost())return;renderer.render(scene,camera);}
  function tick(stamp){frame=0;if(disposed||document.hidden||renderer.getContext?.().isContextLost())return;if(lastDraw&&stamp-lastDraw<1000/30-.5){frame=requestAnimationFrame(tick);return;}lastDraw=stamp;const elapsed=last?(stamp-last)/1000:0,dt=Math.min(elapsed,.1);last=stamp;const moving=motion();if(moving)time+=dt;if(explorer||moving)volcanoTime+=dt;
    try{
    if(flight!==null){flight+=elapsed;const p=moving?Math.min(flight/3.2,1):1,e=p*p*(3-2*p);camera.position.lerpVectors(startCam,endCam,e);target.lerpVectors(startLook,endLook,e);camera.clearViewOffset();camera.updateProjectionMatrix();canvas.parentElement.style.setProperty('--arrival',String(p));if(p===1){const done=finish;finish=null;flight=null;done?.();if(disposed)return;}}
    else if(!explorer){pose();if(moving){camera.position.x+=Math.sin(time*.13)*1.3+px*1.2;camera.position.y+=Math.sin(time*.24)*.4-py*.5;}}
    if(explorer)explorer.update(dt,time);camera.lookAt(target);volcanoes.forEach(v=>v.update(volcanoTime));tropical.update(motion()?time:0);waterMaterial.uniforms.time.value=time;crystal.rotation.y=time*.35;beam.rotation.y=time*.22;
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
  function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);finish=null;explorer?.dispose();volcanoes.forEach(v=>v.dispose());tropical.dispose();polyhaven?.dispose();surfaces.dispose();observer.disconnect();bodyObserver.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.parentElement?.removeEventListener('pointermove',pointer);textures.forEach(t=>t.dispose());geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());sun.shadow.map?.dispose();renderer.dispose();renderer.forceContextLoss();}
}

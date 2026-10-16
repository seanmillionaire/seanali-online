import {worldIslands,isletHeight} from './explore-state.js?v=33';
import {createTropical} from './tropical.js?v=33';
/* Optional real-time 3D arrival. The adventure remains playable without WebGL. */
export function createEntrance(host,{motion,label,onMode=()=>{},load=()=>import('./vendor/three.module.min.js')}={}) {
  let disposed=false,world=null,pending=null;
  const canvas=document.createElement('canvas');canvas.className='world-canvas';canvas.setAttribute('role','img');canvas.setAttribute('aria-label',label||'A magical island in a moving sea');host.prepend(canvas);
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
  const scene=new T.Scene();scene.background=new T.Color('#a4c9de');scene.fog=new T.FogExp2('#b0d1dc',.004);
  const camera=new T.PerspectiveCamera(42,1,.2,300),sun=new T.DirectionalLight('#fff0d2',3.0);sun.position.set(-22,38,18);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-30;sun.shadow.camera.right=30;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;sun.shadow.normalBias=.1;scene.add(sun,new T.HemisphereLight('#c9edff','#58623c',1.45));
  const geometries=new Set(),materials=new Set(),clouds=[],bobbing=[];let seed=4107;
  const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const geometry=g=>{geometries.add(g);return g;};
  const mat=(color,extra={})=>{const m=new T.MeshStandardMaterial({color,roughness:.88,...extra});materials.add(m);return m;};
  const make=(g,m,x=0,y=0,z=0,sx=1,sy=sx,sz=sx,parent=scene)=>{const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
  const ball=geometry(new T.SphereGeometry(1,16,12)),cone=geometry(new T.ConeGeometry(1,1,8)),cylinder=geometry(new T.CylinderGeometry(1,1,1,12)),box=geometry(new T.BoxGeometry(1,1,1));
  const sand=mat('#e8c895'),green=mat('#568d58'),darkGreen=mat('#246b57'),leaf=mat('#79a05b'),trunk=mat('#855b42'),stone=mat('#84958c'),cream=mat('#fff0ca'),wood=mat('#986b44'),red=mat('#ce826c'),blue=mat('#579c9d'),violet=mat('#a99ac0'),gold=mat('#ffda83',{emissive:'#efb449',emissiveIntensity:.32});
  function height(x,z){if(isletHeight(x,z)>0)return isletHeight(x,z);const edge=Math.sqrt((x/20)**2+(z/14)**2);const hill=6*Math.exp(-((x+1)**2/30+(z+5)**2/22));return Math.max(.1,(1-edge*edge)*2.8)+hill;}
  // A sculpted, vertex-colored island; this is geometry, not a picture on a plane.
  const tropical=createTropical({T,scene,camera,height,geometry,mat,make,ball,renderer});
  sand.map=wood.map=stone.map=trunk.map=cream.map=tropical.grain;wood.bumpMap=stone.bumpMap=trunk.bumpMap=tropical.grain;wood.bumpScale=.035;stone.bumpScale=.12;trunk.bumpScale=.06;
  const positions=[],colors=[],uvs=[],indices=[],rings=48,segments=128;
  for(let ring=0;ring<=rings;ring++)for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2,r=ring/rings,shore=1+.035*Math.sin(a*7)+.03*Math.cos(a*5),x=Math.cos(a)*20*r*shore,z=Math.sin(a)*14*r*shore,y=ring===rings?.08:height(x,z);positions.push(x,y,z);uvs.push(x*.18,z*.18);const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};const c=new T.Color('#527842').lerp(new T.Color('#789454'),smooth(.3,.77,r));c.lerp(new T.Color('#e5d5ad'),smooth(.75,.91,r));c.lerp(new T.Color('#969784'),smooth(4.5,7,y)*.7);c.multiplyScalar(.96+rand()*.08);colors.push(c.r,c.g,c.b);}
  for(let j=0;j<rings;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,b=a+segments+1;indices.push(a,a+1,b,b,a+1,b+1);}
  const terrain=geometry(new T.BufferGeometry());terrain.setAttribute('position',new T.Float32BufferAttribute(positions,3));terrain.setAttribute('color',new T.Float32BufferAttribute(colors,3));terrain.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));terrain.setIndex(indices);terrain.computeVertexNormals();make(terrain,mat('#ffffff',{vertexColors:true,map:tropical.grain,bumpMap:tropical.grain,bumpScale:.16,roughness:.98}));
  // A reachable offshore island, sharing the same shoreline used by movement and boats.
  for(const land of worldIslands){
   const iv=[],ic=[],ii=[],iu=[];for(let ring=0;ring<=16;ring++)for(let j=0;j<=64;j++){
    const a=j/64*Math.PI*2,r=ring/16,x=land.x+Math.cos(a)*land.rx*r,z=land.z+Math.sin(a)*land.rz*r;
    iv.push(x,isletHeight(x,z),z);iu.push(x*.18,z*.18);const c=new T.Color(r>.78?'#eddbac':land.id==='wilds'?'#4d8455':'#72a65c');ic.push(c.r,c.g,c.b);
    if(ring<16&&j<64){const n=ring*65+j;ii.push(n,n+1,n+65,n+65,n+1,n+66);}
   }
   const ig=geometry(new T.BufferGeometry());ig.setAttribute('position',new T.Float32BufferAttribute(iv,3));ig.setAttribute('color',new T.Float32BufferAttribute(ic,3));ig.setAttribute('uv',new T.Float32BufferAttribute(iu,2));ig.setIndex(ii);ig.computeVertexNormals();const island=make(ig,mat('#ffffff',{vertexColors:true,map:tropical.grain}));island.name=land.en;
   const small=land.id==='islet';
   for(let i=0;i<(small?2:12);i++){const a=i*2.4,r=.3+(i%3)*.22,x=land.x+Math.sin(a)*land.rx*r,z=land.z+Math.cos(a)*land.rz*r;tropical.palm(x,z,.75+(i%3)*.2);}
   for(let i=0;i<(small?7:16);i++){const x=land.x+Math.sin(i*2.4)*land.rx*.6,z=land.z+Math.cos(i*2.4)*land.rz*.6;tropical.card(i%4===0?1:15,x,height(x,z),z,i%4===0?2.2:.9,i%4===0?2.8:1);}
   if(land.vehicleOnly){
    const crystalMat=mat('#78e6e0',{emissive:'#259dba',emissiveIntensity:.35,roughness:.22,metalness:.12});
    for(let i=0;i<7;i++){const a=i*Math.PI*2/7,x=land.x+Math.sin(a)*6,z=land.z+Math.cos(a)*5;const crystal=make(geometry(new T.ConeGeometry(.7,3,5)),crystalMat,x,height(x,z)+1.1,z,1,1+(i%3)*.3,1);crystal.rotation.z=Math.sin(a)*.2;}
    // Buoys outline the strong-current area, well outside the beach and landing zone.
    for(let i=0;i<16;i++){const a=i*Math.PI/8,x=land.x+Math.sin(a)*land.rx*1.6,z=land.z+Math.cos(a)*land.rz*1.6;make(ball,gold,x,0,z,.16,.25,.16);}
   }
   if(!small){
    // A walk-through stone arch marks each island's central bubble clearing.
    for(const side of [-1,1])make(box,stone,land.x+side*2,height(land.x+side*2,land.z)+1.8,land.z,.8,3.6,1);
    make(box,stone,land.x,height(land.x,land.z)+3.5,land.z,4.8,.7,1);
    for(let i=0;i<3;i++){const x=land.x-4+i*2,z=land.z+5;const fruits=[];tropical.card(1,x,height(x,z),z,3.2,3.8);for(let j=0;j<6;j++)fruits.push(tropical.card(7,x+(j%3-1)*.23,height(x,z)+2.1-Math.floor(j/3)*.3,z+.2,.5,.65));tropical.foodTrees.push({id:'banana'+(5+(worldIslands.indexOf(land)-1)*3+i),kind:'banana',x,z,fruits});}
    for(let i=0;i<4;i++)tropical.card(i%2?8:9,land.x+(i-1.5)*3,height(land.x+(i-1.5)*3,land.z-4),land.z-4,1.1,.8);
   }
  }
  // Transparent lagoon, a visible sandy seabed, and small irregular wave highlights.
  const waterMaterial=new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{time:{value:0}},vertexShader:`uniform float time;varying vec3 pos;void main(){vec3 p=position;p.z+=sin(p.x*.5+time*.6)*.025+cos(p.y*.7+time*.5)*.025;pos=p;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:`uniform float time;varying vec3 pos;
float swell(vec2 p){return sin(p.x*1.7+p.y*.8+time*.8)*.45+sin(p.x*-.9+p.y*2.2-time*.65)*.3+sin(p.x*4.8+p.y*3.1+time)*.12;}
void main(){
 vec2 p=pos.xy;float coast=min(length(p/vec2(20.,14.)),length((p-vec2(24.,8.))/vec2(4.,3.)));float depth=smoothstep(.95,2.9,coast);
 float h=swell(p),hx=swell(p+vec2(.04,0.)),hy=swell(p+vec2(0.,.04));vec3 n=normalize(vec3((h-hx)*1.5,1.,(h-hy)*1.5));
 vec3 view=normalize(cameraPosition-vec3(p.x,-.12,-p.y));float fresnel=pow(1.-max(dot(n,view),0.),4.);
 vec3 c=mix(vec3(.12,.68,.59),vec3(.015,.19,.30),depth);c=mix(c,vec3(.55,.78,.88),fresnel*.65);
 vec3 halfSun=normalize(normalize(vec3(-.5,1.,.45))+view);float spec=pow(max(dot(n,halfSun),0.),180.);c+=vec3(1.,.88,.61)*spec*.65*(1.-smoothstep(25.,65.,length(p)));
 float caustic=pow(max(0.,sin(p.x*2.4+sin(p.y*1.5)+time*.6)*sin(p.y*2.6+sin(p.x*1.8)-time*.4)),9.);c+=vec3(.12,.22,.13)*caustic*(1.-depth);
 float edge=exp(-pow((coast-1.025)/.055,2.));float foam=smoothstep(.55,.95,sin(coast*110.-time*1.1+sin(p.x*.8)*.6));c=mix(c,vec3(.83,.95,.88),edge*foam*.45);
 gl_FragColor=vec4(c,mix(.42,.98,smoothstep(1.,2.2,coast)));
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`});
  materials.add(waterMaterial);const water=make(geometry(new T.PlaneGeometry(500,500,64,64)),waterMaterial,0,-.12,0);water.rotation.x=-Math.PI/2;water.castShadow=false;water.receiveShadow=false;water.renderOrder=2;
  const bedGeometry=geometry(new T.PlaneGeometry(220,180));const bedUV=bedGeometry.attributes.uv;for(let i=0;i<bedUV.count;i++)bedUV.setXY(i,bedUV.getX(i)*16,bedUV.getY(i)*16);const seabed=make(bedGeometry,mat('#b3c8b0',{map:tropical.grain,roughness:1}),0,-1.4,0);seabed.rotation.x=-Math.PI/2;seabed.castShadow=false;
  // A sandy path winding from the landing cove to the lighthouse.
  const pathPoints=[new T.Vector3(4,.4,12),new T.Vector3(3,height(3,8)+.07,8),new T.Vector3(7,height(7,4)+.08,4),new T.Vector3(4,height(4,0)+.08,0),new T.Vector3(0,height(0,-3)+.08,-3),new T.Vector3(-1,height(-1,-5)+.08,-5)];
  const pathCurve=new T.CatmullRomCurve3(pathPoints),pathVertices=[],pathUV=[],pathIndex=[];
  for(let i=0;i<=80;i++){const t=i/80,p=pathCurve.getPoint(t),d=pathCurve.getTangent(t);for(const side of [-1,1]){const x=p.x+d.z*.43*side,z=p.z-d.x*.43*side;pathVertices.push(x,height(x,z)+.035,z);pathUV.push(side===1?1:0,t*12);}if(i<80){const n=i*2;pathIndex.push(n,n+2,n+1,n+1,n+2,n+3);}}
  const pathGeometry=geometry(new T.BufferGeometry());pathGeometry.setAttribute('position',new T.Float32BufferAttribute(pathVertices,3));pathGeometry.setAttribute('uv',new T.Float32BufferAttribute(pathUV,2));pathGeometry.setIndex(pathIndex);pathGeometry.computeVertexNormals();make(pathGeometry,sand);
  function house(x,z,color,scale=1){const y=height(x,z),g=new T.Group();g.position.set(x,y,z);g.rotation.y=-.3;scene.add(g);make(box,cream,0,1*scale,0,2.5*scale,2*scale,2*scale,g);const roof=make(cone,color,0,2.55*scale,0,2.25*scale,1.3*scale,1.7*scale,g);roof.rotation.y=Math.PI/4;make(box,wood,0,.7*scale,1.015*scale,.55*scale,1.4*scale,.06,g);for(const side of [-1,1])make(box,gold,side*.75*scale,1.25*scale,1.03*scale,.4*scale,.5*scale,.06,g);make(cylinder,stone,.8*scale,2.8*scale,-.4*scale,.25*scale,1.5*scale,.25*scale,g);return g;}
  house(-10,5,wood,.95);house(-13,2,wood,.8);house(10,2,wood,.95);house(12,-1,wood,.75);house(9,-4,wood,.65);
  // Lighthouse, its rotating crystal, and a soft sweeping beam.
  const tower=new T.Group(),ty=height(-1,-5);tower.position.set(-1,ty,-5);scene.add(tower);make(cylinder,stone,0,.25,0,2.1,.5,2.1,tower);make(geometry(new T.CylinderGeometry(.8,1.25,6,24)),cream,0,3.3,0,1,1,1,tower);make(cylinder,red,0,3.6,0,1.03,.5,1.03,tower);make(cylinder,stone,0,6.35,0,1.4,.25,1.4,tower);make(cylinder,gold,0,7.1,0,.86,1.3,.86,tower);make(cone,red,0,8,0,1.5,1.1,1.5,tower);
  const crystal=make(ball,gold,0,7.1,0,.25,.35,.25,tower);
  for(let i=0;i<4;i++){const a=i/4*Math.PI*2;make(cylinder,wood,Math.sin(a),7.1,Math.cos(a),.07,1.4,.07,tower);}make(box,wood,0,1,1.2,.6,1.8,.1,tower);
  const beamMat=new T.MeshBasicMaterial({color:'#ffe9ad',transparent:true,opacity:.07,depthWrite:false,side:T.DoubleSide});materials.add(beamMat);const beam=make(geometry(new T.ConeGeometry(4,32,24,1,true)),beamMat,0,7.1,0,1,1,1,tower);beam.geometry.translate(0,-16,0);beam.rotation.z=Math.PI/2;beam.castShadow=false;beam.receiveShadow=false;
  // The dock, moored boat, and a moving sailboat out on the water.
  for(let i=0;i<15;i++){make(box,wood,4,.42,12+i*.36,2,.16,.28);if(i%4===0)for(const dx of [-.9,.9])make(cylinder,wood,4+dx,.23,12+i*.36,.1,1.25,.1);}
  function boat(x,z,s){const g=new T.Group();g.position.set(x,.25,z);scene.add(g);make(ball,wood,0,0,0,1.8*s,.35*s,.7*s,g);make(cylinder,cream,0,1.7*s,0,.055*s,3.3*s,.055*s,g);const shape=new T.Shape();shape.moveTo(0,0);shape.lineTo(0,2.8*s);shape.lineTo(-1.5*s,.15*s);shape.closePath();make(geometry(new T.ShapeGeometry(shape)),mat('#ffe7b5',{side:T.DoubleSide}),.07,.3*s,0,1,1,1,g);g.rotation.y=-.3;bobbing.push({g,y:.25,z});return g;}
  const dockBoat=boat(6.5,16,.75);dockBoat.name='Dock boat';const sailboat=boat(-18,21,1.2);
  // Distant islets and glowing motes give the approach a sense of depth.
  const motePositions=[];for(let i=0;i<60;i++)motePositions.push((rand()-.5)*40,1+rand()*10,(rand()-.5)*30);const motesGeo=geometry(new T.BufferGeometry());motesGeo.setAttribute('position',new T.Float32BufferAttribute(motePositions,3));const moteMat=new T.PointsMaterial({color:'#fff0ab',size:.12,transparent:true,opacity:.8,depthWrite:false});materials.add(moteMat);const motes=new T.Points(motesGeo,moteMat);scene.add(motes);
  let frame=0,last=0,lastDraw=0,time=0,disposed=false,flight=null,finish=null,width=1,heightPx=1,px=0,py=0;
  const target=new T.Vector3(),startCam=new T.Vector3(),startLook=new T.Vector3(),endCam=new T.Vector3(7,6.5,24),endLook=new T.Vector3(2,3.7,4);
  function resize(){const r=canvas.parentElement.getBoundingClientRect();width=Math.max(1,r.width);heightPx=Math.max(1,r.height);renderer.setSize(width,heightPx,false);camera.aspect=width/heightPx;camera.setViewOffset(width,heightPx,width>780?-width*.17:0,width>780?0:heightPx*.13,width,heightPx);if(setup)camera.clearViewOffset();camera.updateProjectionMatrix();if(!motion())draw();}
  function pose(){const phone=width<780;camera.position.set(phone?39:35,phone?34:25,phone?66:51);target.set(0,3,0);}
  function draw(){if(renderer.getContext?.().isContextLost())return;renderer.render(scene,camera);}
  function tick(stamp){frame=0;if(disposed||document.hidden||renderer.getContext?.().isContextLost())return;if(lastDraw&&stamp-lastDraw<1000/30){frame=requestAnimationFrame(tick);return;}lastDraw=stamp;const elapsed=last?(stamp-last)/1000:0,dt=Math.min(elapsed,.05);last=stamp;const moving=motion();if(moving)time+=dt;
    if(flight!==null){flight+=elapsed;const p=moving?Math.min(flight/3.2,1):1,e=p*p*(3-2*p);camera.position.lerpVectors(startCam,endCam,e);target.lerpVectors(startLook,endLook,e);camera.clearViewOffset();camera.updateProjectionMatrix();canvas.parentElement.style.setProperty('--arrival',String(p));if(p===1){const done=finish;finish=null;flight=null;done?.();if(disposed)return;}}
    else if(!explorer){pose();if(moving){camera.position.x+=Math.sin(time*.13)*1.3+px*1.2;camera.position.y+=Math.sin(time*.24)*.4-py*.5;}}
    if(explorer)explorer.update(dt,time);camera.lookAt(target);tropical.update(time);waterMaterial.uniforms.time.value=time;crystal.rotation.y=time*.35;beam.rotation.y=time*.22;
    clouds.forEach(c=>{c.g.position.x=c.x+Math.sin(time*.03+c.z)*3;});bobbing.forEach((b,i)=>{b.g.position.y=b.y+Math.sin(time*1.2+i)*.12;b.g.rotation.z=Math.sin(time+i)*.025;});sailboat.position.x=-18+Math.sin(time*.04)*4;motes.rotation.y=Math.sin(time*.1)*.03;
    try{draw();}catch(error){onError(error);return;}if(explorer||moving||flight!==null)frame=requestAnimationFrame(tick);
  }
  function wake(){if(!disposed&&!document.hidden&&!frame){last=0;frame=requestAnimationFrame(tick);}}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else wake();}
  function pointer(e){if(!motion()||flight!==null)return;const r=canvas.getBoundingClientRect();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;}
  const observer=new ResizeObserver(resize),bodyObserver=new MutationObserver(wake);observer.observe(canvas.parentElement);bodyObserver.observe(document.body,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',visibility);canvas.parentElement.addEventListener('pointermove',pointer,{passive:true});
  let explorer;
  try{explorer=setup?.({T,scene,camera,target,height,make,geometry,mat,ball,cone,cylinder,box,renderer,tropical,tower,beam,crystal,dockBoat});
  pose();camera.lookAt(target);resize();if(explorer){camera.clearViewOffset();camera.updateProjectionMatrix();explorer.update(0,0);}draw();wake();}catch(error){dispose();throw error;}
  return {
    resume(){renderer.shadowMap.needsUpdate=true;wake();},
    flyIn(done){if(disposed)return;startCam.copy(camera.position);startLook.copy(target);flight=0;finish=done;wake();},
    dispose
  };
  function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);finish=null;explorer?.dispose();tropical.dispose();observer.disconnect();bodyObserver.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.parentElement?.removeEventListener('pointermove',pointer);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());sun.shadow.map?.dispose();renderer.dispose();renderer.forceContextLoss();}
}

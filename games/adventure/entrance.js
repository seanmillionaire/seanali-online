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
function buildIsland(T,canvas,motion) {
  const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.17;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
  const scene=new T.Scene();scene.background=new T.Color('#9dc5cc');scene.fog=new T.FogExp2('#a7c8cc',.008);
  const camera=new T.PerspectiveCamera(42,1,.2,300),sun=new T.DirectionalLight('#ffe3aa',3.2);sun.position.set(-22,38,18);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-30;sun.shadow.camera.right=30;sun.shadow.camera.top=30;sun.shadow.camera.bottom=-30;sun.shadow.normalBias=.1;scene.add(sun,new T.HemisphereLight('#e7efff','#2e6d61',2.6));
  const geometries=new Set(),materials=new Set(),clouds=[],bobbing=[];let seed=4107;
  const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const geometry=g=>{geometries.add(g);return g;};
  const mat=(color,extra={})=>{const m=new T.MeshStandardMaterial({color,roughness:.88,...extra});materials.add(m);return m;};
  const make=(g,m,x=0,y=0,z=0,sx=1,sy=sx,sz=sx,parent=scene)=>{const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
  const ball=geometry(new T.IcosahedronGeometry(1,1)),cone=geometry(new T.ConeGeometry(1,1,8)),cylinder=geometry(new T.CylinderGeometry(1,1,1,12)),box=geometry(new T.BoxGeometry(1,1,1));
  const sand=mat('#e8c895'),green=mat('#568d58'),darkGreen=mat('#246b57'),leaf=mat('#79a05b'),trunk=mat('#855b42'),stone=mat('#84958c'),cream=mat('#fff0ca'),wood=mat('#986b44'),red=mat('#ce826c'),blue=mat('#579c9d'),violet=mat('#a99ac0'),gold=mat('#ffda83',{emissive:'#efb449',emissiveIntensity:.32});
  function height(x,z){const edge=Math.sqrt((x/20)**2+(z/14)**2);const hill=6*Math.exp(-((x+1)**2/30+(z+5)**2/22));return Math.max(.1,(1-edge*edge)*2.8)+hill;}
  // A sculpted, vertex-colored island; this is geometry, not a picture on a plane.
  const positions=[],colors=[],indices=[],rings=25,segments=100;
  for(let ring=0;ring<=rings;ring++)for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2,r=ring/rings,shore=1+.035*Math.sin(a*7)+.03*Math.cos(a*5),x=Math.cos(a)*20*r*shore,z=Math.sin(a)*14*r*shore,y=ring===rings?.08:height(x,z);positions.push(x,y,z);const c=new T.Color(r>.9?'#eacb91':r>.81?'#a7bb72':y>6?'#9caaa0':r>.5?'#719b62':'#82a365');c.multiplyScalar(.97+rand()*.08);colors.push(c.r,c.g,c.b);}
  for(let j=0;j<rings;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,b=a+segments+1;indices.push(a,a+1,b,b,a+1,b+1);}
  const terrain=geometry(new T.BufferGeometry());terrain.setAttribute('position',new T.Float32BufferAttribute(positions,3));terrain.setAttribute('color',new T.Float32BufferAttribute(colors,3));terrain.setIndex(indices);terrain.computeVertexNormals();make(terrain,mat('#ffffff',{vertexColors:true}));
  // Shader-driven waves and sunlit turquoise water.
  const waterMaterial=new T.ShaderMaterial({uniforms:{time:{value:0}},vertexShader:`uniform float time; varying vec3 pos; void main(){vec3 p=position;p.z+=sin(p.x*.3+time*.8)*.12+cos(p.y*.25+time*.65)*.13;pos=p;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}`,fragmentShader:`uniform float time; varying vec3 pos; void main(){float wave=sin(pos.x*.65+pos.y*.32+time*.9)*cos(pos.y*.7-time*.65);float dist=length(pos.xy*vec2(.8,1.1));vec3 deep=vec3(.035,.29,.39);vec3 shallow=vec3(.16,.64,.65);vec3 c=mix(shallow,deep,smoothstep(15.,75.,dist));float glint=pow(max(0.,wave),18.)*.17;c+=glint*vec3(.8,1.,.9);float shore=(1.-smoothstep(19.,24.,dist))*smoothstep(16.,20.,dist);c+=shore*.12*(.5+.5*sin(dist*4.-time*1.5));gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>}`});
  materials.add(waterMaterial);const water=make(geometry(new T.PlaneGeometry(500,500,64,64)),waterMaterial,0,-.12,0);water.rotation.x=-Math.PI/2;water.castShadow=false;water.receiveShadow=false;
  // A sandy path winding from the landing cove to the lighthouse.
  const pathPoints=[new T.Vector3(4,.4,12),new T.Vector3(3,height(3,8)+.07,8),new T.Vector3(7,height(7,4)+.08,4),new T.Vector3(4,height(4,0)+.08,0),new T.Vector3(0,height(0,-3)+.08,-3),new T.Vector3(-1,height(-1,-5)+.08,-5)];
  const pathCurve=new T.CatmullRomCurve3(pathPoints),pathGeometry=geometry(new T.TubeGeometry(pathCurve,65,.48,6,false));make(pathGeometry,sand);
  // Grove canopy and trunks are instanced to keep phone draw calls low.
  const trees=[],treeCount=85;
  for(let n=0;trees.length<treeCount&&n<1000;n++){const x=(rand()-.5)*34,z=(rand()-.5)*22;if((x/18)**2+(z/12)**2>.83||Math.abs(x)<4&&z<0||x>0&&x<10&&z>-3||x<-8&&z>3)continue;trees.push([x,height(x,z),z,.65+rand()*.55]);}
  const trunks=new T.InstancedMesh(cylinder,trunk,trees.length),crowns=new T.InstancedMesh(ball,darkGreen,trees.length*2),dummy=new T.Object3D();scene.add(trunks,crowns);trunks.castShadow=true;crowns.castShadow=true;crowns.receiveShadow=true;
  trees.forEach(([x,y,z,s],i)=>{dummy.position.set(x,y+s,z);dummy.scale.set(.16*s,2*s,.16*s);dummy.updateMatrix();trunks.setMatrixAt(i,dummy.matrix);for(let k=0;k<2;k++){dummy.position.set(x+(k?.5:0),y+(2.2+k*.5)*s,z);dummy.scale.set(1.2*s,(k?1.1:1.5)*s,1.15*s);dummy.rotation.y=rand()*3;dummy.updateMatrix();crowns.setMatrixAt(i*2+k,dummy.matrix);crowns.setColorAt(i*2+k,new T.Color(['#2d7860','#488963','#78a369','#57965f'][i%4]));}});
  function house(x,z,color,scale=1){const y=height(x,z),g=new T.Group();g.position.set(x,y,z);g.rotation.y=-.3;scene.add(g);make(box,cream,0,1*scale,0,2.5*scale,2*scale,2*scale,g);const roof=make(cone,color,0,2.55*scale,0,2.25*scale,1.3*scale,1.7*scale,g);roof.rotation.y=Math.PI/4;make(box,wood,0,.7*scale,1.015*scale,.55*scale,1.4*scale,.06,g);for(const side of [-1,1])make(box,gold,side*.75*scale,1.25*scale,1.03*scale,.4*scale,.5*scale,.06,g);make(cylinder,stone,.8*scale,2.8*scale,-.4*scale,.25*scale,1.5*scale,.25*scale,g);return g;}
  house(-10,5,red,.95);house(-13,2,blue,.8);house(10,2,violet,.95);house(12,-1,red,.75);house(9,-4,blue,.65);
  // Orchard fruit and the heart garden connect the arrival to the six story places.
  for(let i=0;i<9;i++){const x=-12+(i%3)*2,z=-2+Math.floor(i/3)*2,y=height(x,z);make(cylinder,trunk,x,y+.65,z,.12,1.3,.12);make(ball,leaf,x,y+1.6,z,1.15);for(let k=0;k<2;k++)make(ball,gold,x+.45*(k?1:-1),y+1.7,z+.8,.17);}
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,x=11+Math.cos(a)*2.4,z=7+Math.sin(a)*1.7,y=height(x,z);make(cylinder,trunk,x,y+.5,z,.12,1,.12);make(ball,mat(i%2?'#e9afbb':'#d992b2'),x,y+1.4,z,.9,1,.9);}
  // Lighthouse, its rotating crystal, and a soft sweeping beam.
  const tower=new T.Group(),ty=height(-1,-5);tower.position.set(-1,ty,-5);scene.add(tower);make(cylinder,stone,0,.25,0,2.1,.5,2.1,tower);make(geometry(new T.CylinderGeometry(.8,1.25,6,14)),cream,0,3.3,0,1,1,1,tower);make(cylinder,red,0,3.6,0,1.03,.5,1.03,tower);make(cylinder,stone,0,6.35,0,1.4,.25,1.4,tower);make(cylinder,gold,0,7.1,0,.86,1.3,.86,tower);make(cone,red,0,8,0,1.5,1.1,1.5,tower);
  const crystal=make(geometry(new T.OctahedronGeometry(.65)),gold,0,9,0,1,1.5,1,tower);
  for(let i=0;i<4;i++){const a=i/4*Math.PI*2;make(cylinder,wood,Math.sin(a),7.1,Math.cos(a),.07,1.4,.07,tower);}make(box,wood,0,1,1.2,.6,1.8,.1,tower);
  const beamMat=new T.MeshBasicMaterial({color:'#ffe9ad',transparent:true,opacity:.07,depthWrite:false,side:T.DoubleSide});materials.add(beamMat);const beam=make(geometry(new T.ConeGeometry(4,32,24,1,true)),beamMat,0,7.1,0,1,1,1,tower);beam.geometry.translate(0,-16,0);beam.rotation.z=Math.PI/2;beam.castShadow=false;beam.receiveShadow=false;
  // The dock, moored boat, and a moving sailboat out on the water.
  for(let i=0;i<15;i++){make(box,wood,4,.42,12+i*.36,2,.16,.28);if(i%4===0)for(const dx of [-.9,.9])make(cylinder,wood,4+dx,.23,12+i*.36,.1,1.25,.1);}
  function boat(x,z,s){const g=new T.Group();g.position.set(x,.25,z);scene.add(g);make(ball,wood,0,0,0,1.8*s,.35*s,.7*s,g);make(cylinder,cream,0,1.7*s,0,.055*s,3.3*s,.055*s,g);const shape=new T.Shape();shape.moveTo(0,0);shape.lineTo(0,2.8*s);shape.lineTo(-1.5*s,.15*s);shape.closePath();make(geometry(new T.ShapeGeometry(shape)),mat('#ffe7b5',{side:T.DoubleSide}),.07,.3*s,0,1,1,1,g);g.rotation.y=-.3;bobbing.push({g,y:.25,z});return g;}
  boat(6.5,16,.75);const sailboat=boat(-18,21,1.2);
  // Floating cloud banks are translucent clusters of real 3D volumes.
  const cloudMat=mat('#fff6e4',{transparent:true,opacity:.76,depthWrite:false});
  for(let i=0;i<8;i++){const g=new T.Group(),x=(i-3.5)*13,z=-23+(i%3)*19,y=15+rand()*8;g.position.set(x,y,z);scene.add(g);for(let k=0;k<4;k++){const c=make(ball,cloudMat,k*2,Math.sin(k)*.7,0,2.7,1.1,1.8,g);c.castShadow=false;c.receiveShadow=false;}clouds.push({g,x,z,speed:.3+rand()*.3});}
  // Distant islets and glowing motes give the approach a sense of depth.
  for(let i=0;i<5;i++){const x=-70+i*32,z=-50-rand()*25;make(ball,stone,x,.3,z,8+rand()*6,4+rand()*5,7);make(ball,green,x,2,z,7+rand()*3,2.5,6);}
  const motePositions=[];for(let i=0;i<60;i++)motePositions.push((rand()-.5)*40,1+rand()*10,(rand()-.5)*30);const motesGeo=geometry(new T.BufferGeometry());motesGeo.setAttribute('position',new T.Float32BufferAttribute(motePositions,3));const moteMat=new T.PointsMaterial({color:'#fff0ab',size:.12,transparent:true,opacity:.8,depthWrite:false});materials.add(moteMat);const motes=new T.Points(motesGeo,moteMat);scene.add(motes);
  let frame=0,last=0,lastDraw=0,time=0,disposed=false,flight=null,finish=null,width=1,heightPx=1,px=0,py=0;
  const target=new T.Vector3(),startCam=new T.Vector3(),startLook=new T.Vector3(),endCam=new T.Vector3(7,6.5,24),endLook=new T.Vector3(2,3.7,4);
  function resize(){const r=canvas.parentElement.getBoundingClientRect();width=Math.max(1,r.width);heightPx=Math.max(1,r.height);renderer.setSize(width,heightPx,false);camera.aspect=width/heightPx;camera.setViewOffset(width,heightPx,width>780?-width*.17:0,width>780?0:heightPx*.13,width,heightPx);camera.updateProjectionMatrix();if(!motion())draw();}
  function pose(){const phone=width<780;camera.position.set(phone?39:35,phone?34:25,phone?66:51);target.set(0,3,0);}
  function draw(){renderer.render(scene,camera);}
  function tick(stamp){frame=0;if(disposed||document.hidden)return;if(lastDraw&&stamp-lastDraw<1000/30){frame=requestAnimationFrame(tick);return;}lastDraw=stamp;const dt=last?Math.min((stamp-last)/1000,.05):0;last=stamp;const moving=motion();if(moving)time+=dt;
    if(flight!==null){flight+=dt;const p=moving?Math.min(flight/3.2,1):1,e=p*p*(3-2*p);camera.position.lerpVectors(startCam,endCam,e);target.lerpVectors(startLook,endLook,e);camera.clearViewOffset();camera.updateProjectionMatrix();canvas.parentElement.style.setProperty('--arrival',String(p));if(p===1){const done=finish;finish=null;flight=null;done?.();if(disposed)return;}}
    else {pose();if(moving){camera.position.x+=Math.sin(time*.13)*1.3+px*1.2;camera.position.y+=Math.sin(time*.24)*.4-py*.5;}}
    camera.lookAt(target);waterMaterial.uniforms.time.value=time;crystal.rotation.y=time*.35;beam.rotation.y=time*.22;
    clouds.forEach(c=>{c.g.position.x=c.x+Math.sin(time*.03+c.z)*3;});bobbing.forEach((b,i)=>{b.g.position.y=b.y+Math.sin(time*1.2+i)*.12;b.g.rotation.z=Math.sin(time+i)*.025;});sailboat.position.x=-18+Math.sin(time*.04)*4;motes.rotation.y=Math.sin(time*.1)*.03;
    draw();if(moving||flight!==null)frame=requestAnimationFrame(tick);
  }
  function wake(){if(!disposed&&!document.hidden&&!frame){last=0;frame=requestAnimationFrame(tick);}}
  function visibility(){if(document.hidden){cancelAnimationFrame(frame);frame=0;last=0;}else wake();}
  function pointer(e){if(!motion()||flight!==null)return;const r=canvas.getBoundingClientRect();px=(e.clientX-r.left)/r.width-.5;py=(e.clientY-r.top)/r.height-.5;}
  const observer=new ResizeObserver(resize),bodyObserver=new MutationObserver(wake);observer.observe(canvas.parentElement);bodyObserver.observe(document.body,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',visibility);canvas.parentElement.addEventListener('pointermove',pointer,{passive:true});
  pose();camera.lookAt(target);resize();draw();wake();
  return {
    flyIn(done){if(disposed)return;startCam.copy(camera.position);startLook.copy(target);flight=0;finish=done;wake();},
    dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);finish=null;observer.disconnect();bodyObserver.disconnect();document.removeEventListener('visibilitychange',visibility);canvas.parentElement?.removeEventListener('pointermove',pointer);geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());renderer.dispose();renderer.forceContextLoss();}
  };
}

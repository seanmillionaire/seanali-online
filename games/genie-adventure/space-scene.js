import {PLANETS} from './space-state.js?v=space5';

export function createSpaceScene(T,canvas){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'default'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,innerWidth<780?1.5:2));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
 const scene=new T.Scene();scene.background=new T.Color('#080e1c');
 const camera=new T.PerspectiveCamera(48,1,.1,50000);scene.add(camera);
 const ambient=new T.HemisphereLight('#f1f7ff','#53637e',1.25);scene.add(ambient);const sun=new T.DirectionalLight('#fff1dc',3.2);sun.position.set(-300,500,250);scene.add(sun);
 const objects=[],materials=[],textures=[],geometries=[];let environmentTarget;
 const fill=new T.DirectionalLight('#89bfff',1.3);fill.position.set(300,150,-400);scene.add(fill);
 const geo=g=>(geometries.push(g),g),mat=(color,extra={})=>{const m=new T.MeshStandardMaterial({color,roughness:.83,...extra});materials.push(m);return m;};
 const sphere=geo(new T.SphereGeometry(1,128,80)),small=geo(new T.SphereGeometry(1,32,24)),cone=geo(new T.ConeGeometry(1,1,12)),cylinder=geo(new T.CylinderGeometry(1,1,1,16));
 const make=(g,m,x=0,y=0,z=0,sx=1,sy=sx,sz=sx,parent=scene)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;};
 function texture(p){
  const c=document.createElement('canvas');c.width=1024;c.height=512;const ctx=c.getContext('2d'),image=ctx.createImageData(c.width,c.height),data=image.data;
  const seed=PLANETS.indexOf(p)*337+71,base=[1,3,5].map(i=>parseInt(p.color.slice(i,i+2),16));
  const hash=(x,y,z)=>{let h=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(z,2147483647)^seed;h=Math.imul(h^(h>>>13),1274126177);return ((h^(h>>>16))>>>0)/4294967295;};
  const smooth=t=>t*t*(3-2*t),lerp=(a,b,t)=>a+(b-a)*t;
  function noise(x,y,z){const ix=Math.floor(x),iy=Math.floor(y),iz=Math.floor(z),u=smooth(x-ix),v=smooth(y-iy),w=smooth(z-iz);return lerp(lerp(lerp(hash(ix,iy,iz),hash(ix+1,iy,iz),u),lerp(hash(ix,iy+1,iz),hash(ix+1,iy+1,iz),u),v),lerp(lerp(hash(ix,iy,iz+1),hash(ix+1,iy,iz+1),u),lerp(hash(ix,iy+1,iz+1),hash(ix+1,iy+1,iz+1),u),v),w);}
  // Sample a 3D field on the sphere, so neither the UV seam nor its poles pinch.
  const craters=Array.from({length:38},(_,i)=>{const a=i*2.399+seed,b=Math.acos(1-2*(i+.5)/38);return [Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a),.0004+(i%7)*.0018];});
  for(let py=0;py<c.height;py++){const theta=py/(c.height-1)*Math.PI,sy=Math.cos(theta),rad=Math.sin(theta);for(let px=0;px<c.width;px++){const phi=px/(c.width-1)*Math.PI*2,sx=rad*Math.cos(phi),sz=rad*Math.sin(phi);const broad=noise(sx*3+7,sy*3+4,sz*3+9),detail=noise(sx*15+4,sy*15+8,sz*15+5),grain=noise(sx*120+7,sy*120+3,sz*120+8);let shade=.64+broad*.49+detail*.17+grain*.06,white=0;
   if(p.kind==='rock')for(const [cx,cy,cz,r]of craters){const d=1-(sx*cx+sy*cy+sz*cz);if(d<r){const q=d/r;shade-=.26*(1-q);if(q>.73)shade+=.17*(1-Math.abs(q-.86)/.14);}}
   if(p.kind==='bands')shade=.72+.18*Math.sin(sy*39+broad*4)+detail*.11+grain*.04;
   if(p.kind==='cloud')white=Math.max(0,noise(sx*7+2,sy*7+6,sz*7+1)-.57)*95;
   if(p.kind==='ice'){white=Math.max(0,Math.abs(sy)-.2)*24;shade+=Math.max(0,.09-Math.abs(detail-.5))*.8;}
   const at=(py*c.width+px)*4;for(let ch=0;ch<3;ch++)data[at+ch]=Math.min(255,base[ch]*shade+white);data[at+3]=255;
  }}ctx.putImageData(image,0,0);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;textures.push(t);return t;
 }


 // A local HDR lighting studio supplies real material reflections without a CDN.
 const studio=new T.Scene();studio.background=new T.Color('#293a50');
 for(const [x,y,z,color,intensity]of [[-8,9,5,'#fff2d8',6],[8,3,-7,'#81bfff',4],[0,-8,0,'#10192c',1]]){const panel=new T.Mesh(new T.PlaneGeometry(12,12),new T.MeshBasicMaterial({color,side:T.DoubleSide}));panel.material.color.multiplyScalar(intensity);panel.position.set(x,y,z);panel.lookAt(0,0,0);studio.add(panel);}
 const pmrem=new T.PMREMGenerator(renderer);environmentTarget=pmrem.fromScene(studio,.12);scene.environment=environmentTarget.texture;pmrem.dispose();studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 const skyCanvas=document.createElement('canvas');skyCanvas.width=2048;skyCanvas.height=1024;const skyCtx=skyCanvas.getContext('2d');skyCtx.fillStyle='#030714';skyCtx.fillRect(0,0,2048,1024);
 let skySeed=902;const skyRand=()=>{skySeed=(skySeed*1664525+1013904223)>>>0;return skySeed/4294967296;};
 for(let i=0;i<155;i++){const x=skyRand()*2048,y=512+Math.sin(x/2048*Math.PI*4)*160+(skyRand()-.5)*240,r=40+skyRand()*180;const gradient=skyCtx.createRadialGradient(x,y,0,x,y,r);gradient.addColorStop(0,i%3?'rgba(38,67,111,.09)':'rgba(101,48,117,.1)');gradient.addColorStop(1,'rgba(0,0,0,0)');skyCtx.fillStyle=gradient;skyCtx.fillRect(x-r,y-r,r*2,r*2);}
 for(let i=0;i<6500;i++){const x=skyRand()*2048,y=skyRand()*1024;skyCtx.fillStyle=`rgba(206,222,246,${.15+skyRand()*.65})`;const size=skyRand()>.995?1.8:.45+skyRand()*.55;skyCtx.fillRect(x,y,size,size);}
 const skyTexture=new T.CanvasTexture(skyCanvas);skyTexture.colorSpace=T.SRGBColorSpace;skyTexture.mapping=T.EquirectangularReflectionMapping;textures.push(skyTexture);const skyDome=make(geo(new T.SphereGeometry(44000,64,40)),new T.MeshBasicMaterial({map:skyTexture,side:T.BackSide,depthWrite:false}),0,0,0);materials.push(skyDome.material);skyDome.renderOrder=-100;
 const planets=PLANETS.map(p=>{const root=new T.Group();root.name='Planet '+p.name;root.position.fromArray(p.center);scene.add(root);const terrain=texture(p);const surface=make(sphere,mat('#ffffff',{map:terrain,bumpMap:terrain,bumpScale:p.kind==='rock'?2.6:.9,roughness:p.kind==='ice'?.32:.91,metalness:p.kind==='ice'?.18:.03}),0,0,0,p.radius,p.radius,p.radius,root);surface.name=p.name+' spherical surface';surface.rotation.x=.74;surface.rotation.z=.31;terrain.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  const haloMaterial=new T.ShaderMaterial({uniforms:{glow:{value:new T.Color(p.light)}},vertexShader:'varying vec3 n;varying vec3 v;void main(){vec4 mv=modelViewMatrix*vec4(position,1.0);n=normalize(normalMatrix*normal);v=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',fragmentShader:'uniform vec3 glow;varying vec3 n;varying vec3 v;void main(){float f=pow(1.0-abs(dot(normalize(n),normalize(v))),3.0);gl_FragColor=vec4(glow,f*.27);}',transparent:true,depthWrite:false,side:T.FrontSide});materials.push(haloMaterial);make(sphere,haloMaterial,0,0,0,p.radius*1.035,p.radius*1.035,p.radius*1.035,root);
  if(p.id==='light'){const ring=make(geo(new T.RingGeometry(p.radius*1.45,p.radius*2.15,100)),mat('#cbb596',{side:T.DoubleSide,transparent:true,opacity:.42,roughness:1}),0,0,0,1,1,1,root);ring.rotation.x=1.08;ring.rotation.y=.3;}
  if(p.kind==='rock'||p.kind==='ice'){
   const rockGeo=geo(new T.IcosahedronGeometry(1,1));const rockMat=mat(p.kind==='ice'?'#aacbd4':'#686c76',{roughness:p.kind==='ice'?.3:.98,metalness:.08});const rubble=new T.InstancedMesh(rockGeo,rockMat,160);rubble.name=p.name+' surface geology';root.add(rubble);const dummy=new T.Object3D();
   for(let i=0;i<160;i++){const y=1-2*(i+.5)/160,angle=i*2.399963;const n=new T.Vector3(Math.sqrt(1-y*y)*Math.cos(angle),y,Math.sqrt(1-y*y)*Math.sin(angle));if(n.y>.89)n.y=-n.y;const size=.6+(i%9)*.37;dummy.position.copy(n).multiplyScalar(p.radius+size*.25);dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n);dummy.rotateY(i*1.7);dummy.scale.set(size,size*.65,size*.85);dummy.updateMatrix();rubble.setMatrixAt(i,dummy.matrix);}rubble.instanceMatrix.needsUpdate=true;
  }
  const visitor=new T.Group();visitor.name=p.visitor+' cosmic visitor';root.add(visitor);visitor.position.set(0,p.radius+2,0);const robe=mat('#d8d4e5',{emissive:p.light,emissiveIntensity:.2});make(small,robe,0,2.8,0,1.15,1.5,.75,visitor);make(cylinder,robe,0,1.5,0,.8,2.5,.7,visitor);make(small,mat('#b3c8df'),0,5,0,.7,.83,.7,visitor);for(const x of [-1.1,1.1])make(cylinder,robe,x,2.8,0,.23,1.9,.23,visitor);
  const beacon=new T.Group();root.add(beacon);beacon.position.set(0,p.radius+10,0);const glow=mat(p.light,{emissive:p.light,emissiveIntensity:1.8});make(small,glow,0,0,0,2.3,2.3,2.3,beacon);const ring=make(geo(new T.TorusGeometry(4,.16,8,48)),glow,0,0,0,1,1,1,beacon);beacon.visible=false;
  // A real mission structure: three installed energy modules power an orbital relay.
  const relay=new T.Group();relay.name=p.name+' planetary relay';root.add(relay);relay.position.set(0,p.radius+.25,-6);
  const alloy=mat('#7f92a7',{metalness:.7,roughness:.35});make(cylinder,alloy,0,.4,0,5,.8,5,relay);
  const relayParts=[];for(let i=0;i<3;i++){const module=new T.Group();module.name='Energy module '+(i+1);relay.add(module);const angle=i*Math.PI*2/3;module.position.set(Math.cos(angle)*3,0,Math.sin(angle)*3);make(cylinder,alloy,0,2,0,.45,4,.45,module);make(small,glow,0,4.2,0,.8,1.2,.8,module);module.visible=false;relayParts.push(module);}
  make(geo(new T.TorusGeometry(3.5,.12,8,48)),mat(p.light,{emissive:p.light,emissiveIntensity:.5,transparent:true,opacity:.35}),0,5,0,1,1,1,relay).rotation.x=Math.PI/2;
  return {p,root,surface,visitor,beacon,ring,relay,relayParts};});
 // Locally hosted planetary imagery upgrades the procedural fallback once decoded.
 let disposed=false;const loader=new T.TextureLoader();
 for(const [id,file,tint]of [['shells','moon','#b9c5d2'],['seed','moon','#b9785e'],['picnic','earth','#ffffff']])loader.load('./textures/'+file+'.webp',map=>{if(disposed){map.dispose();return;}map.colorSpace=T.SRGBColorSpace;map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures.push(map);const material=planets.find(v=>v.p.id===id).surface.material;material.map=map;material.color.set(tint);material.needsUpdate=true;},undefined,()=>{});
 let seed=41;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};const coords=[];for(let i=0;i<2400;i++){const a=rand()*Math.PI*2,b=Math.acos(rand()*2-1),r=22000+rand()*8000;coords.push(Math.sin(b)*Math.cos(a)*r,Math.cos(b)*r,Math.sin(b)*Math.sin(a)*r);}
 const stars=new T.Points(geo(new T.BufferGeometry()),new T.PointsMaterial({color:'#d2deed',size:3.5,sizeAttenuation:true}));materials.push(stars.material);stars.geometry.setAttribute('position',new T.Float32BufferAttribute(coords,3));scene.add(stars);
 // A readable adult male genie, without the toy balloon or animal companions.
 const avatar=new T.Group();avatar.name='Kyro';scene.add(avatar);const blue=mat('#63b4ce',{roughness:.4,metalness:.15}),dark=mat('#24354e',{roughness:.72}),gold=mat('#d8b56f',{metalness:.92,roughness:.23}),hair=mat('#172b3e');
 make(small,blue,0,2.7,0,1,1.35,.52,avatar);make(small,blue,0,4.4,0,.56,.78,.53,avatar);make(small,hair,0,4.95,-.12,.68,.3,.6,avatar);make(cone,hair,0,3.8,.49,.22,.4,.16,avatar);
 for(const x of [-.25,.25])make(small,mat('#132637'),x,4.5,.6,.07,.08,.035,avatar);
 for(const x of [-1.1,1.1]){make(cylinder,blue,x,2.65,0,.25,1.65,.25,avatar);make(cylinder,gold,x,2,0,.3,.26,.3,avatar);}
 make(cylinder,gold,0,1.7,0,.85,.24,.65,avatar);const legs=new T.Group();avatar.add(legs);for(const x of [-.4,.4]){make(cylinder,dark,x,1,0,.33,1.5,.33,legs);make(small,gold,x,.25,.2,.35,.18,.6,legs);}
 const contact=make(geo(new T.CircleGeometry(1,48)),new T.MeshBasicMaterial({color:'#07121c',transparent:true,opacity:.22,depthWrite:false}),0,.04,0,1.8,1.1,1,avatar);materials.push(contact.material);contact.rotation.x=-Math.PI/2;contact.name='Ground contact shadow';
 // Facial planes, shoulder caps, layered cloth and engraved metal read in close view.
 make(small,blue,0,4.1,.2,.43,.36,.4,avatar);make(small,blue,0,4.42,.55,.12,.19,.19,avatar);
 for(const side of [-1,1]){make(small,blue,side*.57,4.39,0,.14,.23,.13,avatar);make(small,blue,side*.94,3.15,0,.42,.43,.43,avatar);make(small,blue,side*1.1,1.78,.02,.26,.3,.2,avatar);make(small,gold,side*.62,4.3,0,.16,.21,.065,avatar);}
 const collar=make(geo(new T.TorusGeometry(.61,.09,10,40)),gold,0,3.57,0,1,1,1,avatar);collar.rotation.x=Math.PI/2;
 for(let i=0;i<5;i++)make(cylinder,gold,0,1.66+i*.055,0,.87,.022,.67,avatar);
 const coat=make(geo(new T.CylinderGeometry(.77,1,1.35,32,1,true)),dark,0,1.05,-.05,1,1,1,legs);coat.material.side=T.DoubleSide;
 const tail=new T.Group();avatar.add(tail);for(let i=0;i<9;i++)make(small,mat('#87d6ed',{emissive:'#66accb',emissiveIntensity:.6,transparent:true,opacity:1-i*.1}),Math.sin(i)*.2,1.5-i*.4,-i*.12,.7-i*.06,.35,.65-i*.05,tail);
 const fragments=new T.Group();scene.add(fragments);
 function surfacePoint(p,x,z,offset=0){const n=new T.Vector3(x,Math.sqrt(Math.max(1,p.radius*p.radius-x*x-z*z)),z).normalize();return n.multiplyScalar(p.radius+offset).add(new T.Vector3().fromArray(p.center));}
 function resize(){const r=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,r.width),Math.max(1,r.height),false);camera.aspect=r.width/Math.max(1,r.height);camera.updateProjectionMatrix();}
 const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
 return {T,scene,camera,renderer,planets,avatar,legs,tail,fragments,make,mat,geo,sphere:small,surfacePoint,draw:()=>renderer.render(scene,camera),dispose(){disposed=true;ro.disconnect();environmentTarget?.dispose();textures.forEach(t=>t.dispose());materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());renderer.dispose();renderer.forceContextLoss();}};
}

import {LAVA_POOLS,lavaPoolPose} from './volcano-safety.js?v=225';
// Molten crater pools and continuous vents, aligned with the lava hazard surfaces.
export function createActiveVolcano({T,scene,x,z,height,light=false}){
 const root=new T.Group();root.name='Volcán Barú · living lava pools and smoking vents';scene.add(root);
 const vents=LAVA_POOLS.map(pool=>lavaPoolPose(pool,height,x,z)),floor=vents[0].y-9,materials=[],geometries=[];
 const geo=g=>(geometries.push(g),g),material=m=>(materials.push(m),m);
 const lavaMaterial=material(new T.ShaderMaterial({uniforms:{time:{value:0}},side:T.DoubleSide,
  vertexShader:`varying vec2 p;void main(){p=position.xy;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
  fragmentShader:`precision highp float;varying vec2 p;uniform float time;
   float hash(vec2 v){return fract(sin(dot(v,vec2(127.1,311.7)))*43758.5453);}
   float noise(vec2 v){vec2 i=floor(v),f=fract(v);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
   float fbm(vec2 v){float n=0.,a=.5;for(int i=0;i<4;i++){n+=a*noise(v);v=v*2.03+vec2(7.3,4.8);a*=.5;}return n;}
   void main(){vec2 uv=p*1.15;float t=time*.035;float warp=fbm(uv*.8+vec2(t,-t));float cells=fbm(uv*2.1+warp*1.8+vec2(-t,t*.6));float seams=1.-smoothstep(.015,.095,abs(cells-.49));float molten=smoothstep(.40,.67,fbm(uv+vec2(t*.4,t)));
    vec3 crust=vec3(.045,.018,.016)*(1.+fbm(uv*16.)*.8);vec3 red=mix(vec3(.8,.035,.002),vec3(1.65,.36,.015),molten);vec3 col=mix(crust,red,.42+seams*.58);col+=seams*vec3(.32,.075,.006);
    float edge=smoothstep(3.25,4.35,length(p));col=mix(col,crust,edge*.94);gl_FragColor=vec4(col,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`}));
 const lava=new T.Mesh(geo(new T.CircleGeometry(4.35,light?48:96)),lavaMaterial);lava.rotation.x=-Math.PI/2;lava.scale.y=.88;lava.position.set(x,floor+9,z);lava.name='Slow red magma with cooling basalt crust';root.add(lava);
 const pools=[lava];
 for(const pool of LAVA_POOLS.slice(1)){const p=lavaPoolPose(pool,height,x,z),mesh=new T.Mesh(lava.geometry,lavaMaterial);mesh.rotation.x=-Math.PI/2;mesh.scale.set(p.radius/4.35,p.rz/4.35,1);mesh.position.set(p.x,p.y,p.z);mesh.name='Glowing molten lava vent pool';root.add(mesh);pools.push(mesh);}
 const basalt=material(new T.MeshStandardMaterial({color:'#352e2a',roughness:1})),ochre=material(new T.MeshStandardMaterial({color:'#a29152',roughness:1}));
 const rockGeo=geo(new T.DodecahedronGeometry(1,1));
 for(let i=0;i<36;i++){const a=i*2.399963,r=4.3+(i%5)*.35,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r*.88;const rock=new T.Mesh(rockGeo,i%6===0?ochre:basalt);rock.position.set(px,height(px,pz)+.08,pz);rock.scale.set(.3+(i%3)*.15,.17+(i%4)*.1,.25+(i%5)*.08);rock.rotation.set(i*.31,a,i*.19);rock.name=i%6===0?'Sulfur-stained vent rock':'Scorched fractured basalt';root.add(rock);}
 // Soft irregular density texture avoids opaque spheres and hard particle edges.
 const size=96,pixels=new Uint8Array(size*size*4);
 for(let iy=0;iy<size;iy++)for(let ix=0;ix<size;ix++){const u=ix/size*2-1,v=iy/size*2-1;let density=0;for(let k=0;k<7;k++){const a=k*2.39996,cx=Math.cos(a)*.29,cy=Math.sin(a)*.29;density+=Math.exp(-((u-cx)**2+(v-cy)**2)*(6+k%3))*.20;}const edge=Math.max(0,1-u*u-v*v),grain=.83+.17*Math.sin(ix*.83+iy*.71)*Math.sin(ix*.21-iy*.37),o=(iy*size+ix)*4;pixels[o]=218;pixels[o+1]=215;pixels[o+2]=207;pixels[o+3]=Math.min(255,Math.round(density*edge*grain*255));}
 const texture=new T.DataTexture(pixels,size,size,T.RGBAFormat);texture.colorSpace=T.SRGBColorSpace;texture.needsUpdate=true;
 const smoke=[];for(let i=0;i<(light?14:26);i++){const m=material(new T.SpriteMaterial({map:texture,transparent:true,opacity:0,depthWrite:false,color:'#8d8880',rotation:i*2.4}));const sprite=new T.Sprite(m);sprite.name='Slow drifting volcanic smoke';sprite.renderOrder=3;root.add(sprite);smoke.push(sprite);}
 const glow=new T.PointLight('#ff4814',light?5:9,14,2);glow.position.set(x,floor+10,z);root.add(glow);
 function update(time){lavaMaterial.uniforms.time.value=time;glow.intensity=(light?7:11)*(1+Math.sin(time*1.4)*.12);smoke.forEach((s,i)=>{const age=(i/smoke.length+time*.026)%1,a=i*2.39996,r=.35+(i%3)*.36;const vent=vents[i%vents.length],width=1.6+age*7.5;s.position.set(vent.x+Math.cos(a)*r+age*4.2+Math.sin(age*6+i)*age*.65,vent.y+1+age*20,vent.z+Math.sin(a)*r+age*1.8);s.scale.set(width,width*(1.15+age*.25),1);s.material.opacity=Math.sin(age*Math.PI)*.55;s.material.rotation=i*2.4+age*.35;});}
 update(0);
 return {root,lava,pools,smoke,update,dispose(){scene.remove(root);texture.dispose();geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());}};
}

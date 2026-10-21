// A distant, softly clouded tropical sky. It adds one draw call, no reflection pass.
export function createAtmosphere({T,scene,geometry,camera,waterMaterial}){
 const pixels=new Uint8Array(128*64*4);
 for(let y=0;y<64;y++)for(let x=0;x<128;x++){const h=y/63,cloud=Math.max(0,Math.sin(x*.13)+Math.sin(x*.27+y*.19))*.10;const sky=h<.52,fade=sky?Math.pow(h/.52,.65):0;
  const a=sky?[83+105*fade,126+80*fade,160+58*fade]:[65,71,58];const i=(y*128+x)*4;pixels.set([...a.map(v=>Math.min(255,v*(1+cloud))),255],i);}
 const environment=new T.DataTexture(pixels,128,64,T.RGBAFormat);environment.mapping=T.EquirectangularReflectionMapping;environment.colorSpace=T.SRGBColorSpace;environment.needsUpdate=true;scene.environment=environment;scene.environmentIntensity=.35;
 const material=new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{weather:{value:0},time:{value:0},daylight:waterMaterial.uniforms.daylight},vertexShader:`varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
 uniform float time;uniform float daylight;uniform float weather;varying vec3 direction;
 float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
 float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
 float fbm(vec2 p){float n=0.,a=.5;for(int i=0;i<4;i++){n+=noise(p)*a;p=p*2.03+13.1;a*=.5;}return n;}
 void main(){vec3 d=normalize(direction);float h=max(0.,d.y);float day=clamp(daylight,0.,1.);
 vec3 horizon=mix(vec3(.006,.012,.028),vec3(.64,.75,.80),day);vec3 zenith=mix(vec3(.001,.003,.012),vec3(.22,.43,.63),day);vec3 sky=mix(horizon,zenith,pow(h,.58));
 vec2 p=d.xz/max(.14,d.y)*1.8+vec2(time*.0018,0.);float clouds=smoothstep(.49,.72,fbm(p))*smoothstep(.015,.14,d.y);float edge=fbm(p*2.8);
 vec3 cloud=mix(vec3(.012,.019,.033),vec3(.88,.90,.88),day)*(.88+edge*.12);sky=mix(sky,cloud,clouds*.80);
 sky=mix(sky,mix(vec3(.006,.009,.018),vec3(.23,.29,.34)+clouds*.1,day),weather*.72);
 gl_FragColor=vec4(sky,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`});
 const mesh=new T.Mesh(geometry(new T.SphereGeometry(1400,32,20)),material);mesh.name='Tropical atmospheric sky';mesh.renderOrder=-5;mesh.frustumCulled=false;scene.add(mesh);
 return {update(time){mesh.position.copy(camera.position);scene.environmentIntensity=.09+.26*waterMaterial.uniforms.daylight.value;material.uniforms.time.value=time;material.uniforms.weather.value=scene.userData.regionalWeather?.cloud||0;},dispose(){scene.remove(mesh);scene.environment=null;environment.dispose();material.dispose();}};
}

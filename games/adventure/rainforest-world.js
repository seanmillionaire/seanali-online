import {createFruitEmojis} from './fruit-emojis.js';
import {landAnimalModels} from './land-animal-models.js';
import {createDetailedBird} from './bird-models.js';
import {roadRibbon,surfaceMesh} from './road-surfaces.js';
import {RAINFOREST_FALLS,CHIRIQUI_FALL,WATERFALL_CRYSTALS,claimWaterfall,replenishWaterfall,natureSiteClear,JUNGLE_PONDS,DARIEN_RIVERS} from './rainforest-layout.js';
export function createRainforestWorld(o){
 const {T,scene,geometry,mat,make,ball,box,cylinder,height,state,save,refresh,tell,onBoost,trees=[]}=o;
 const root=new T.Group();root.name='Panama waterfalls and tree-dwelling sloths';scene.add(root);
 const stone=mat('#58675f',{roughness:.97}),moss=mat('#264b2e'),bark=mat('#5b4939'),fur=mat('#8b806b'),face=mat('#d7c8a4'),dark=mat('#27291f'),white=mat('#f1fcff',{emissive:'#bceaff',emissiveIntensity:.12}),gem=mat('#8de8ff',{metalness:.6,roughness:.1,emissive:'#37a9d4',emissiveIntensity:.7});
 const rockGeo=geometry(new T.IcosahedronGeometry(1,1)),diamondGeo=geometry(new T.OctahedronGeometry(.48,0)),solidRocks=[],falls=[],sloths=[],perches=[],bins=new Set();let time=0,saveAt=0,waterBuilt=false;
 const p=(g,m,x,y,z,w,h,d,parent=root)=>make(g,m,x,y,z,w,h,d,parent);
 const land=landAnimalModels(o),emblems=createFruitEmojis(T);
 const waterMat=new T.ShaderMaterial({uniforms:{time:{value:0}},transparent:true,depthWrite:false,side:T.DoubleSide,vertexShader:'varying vec2 v;void main(){v=uv;vec3 p=position;p.z+=sin(uv.y*23.)*.05;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}',fragmentShader:'varying vec2 v;uniform float time;void main(){float flow=sin(v.x*137.+sin(v.y*24.+time*7.)*2.)*.5+.5;float ripple=sin(v.y*100.+time*18.+v.x*7.)*.5+.5;float edge=smoothstep(0.,.13,v.x)*smoothstep(0.,.13,1.-v.x);vec3 color=mix(vec3(.16,.56,.64),vec3(.86,.98,1.),flow*.7+ripple*.3);gl_FragColor=vec4(color,(.43+flow*.45)*edge);#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'});
 // Shader include directives must start on their own lines.
 waterMat.fragmentShader=waterMat.fragmentShader.replace(';#include',';\n#include');
 const riverMat=mat('#2d7b73',{roughness:.24,metalness:.16,transparent:true,opacity:.88});
 const foamMat=new T.PointsMaterial({color:'#e3f6f4',size:.32,transparent:true,opacity:.65,depthWrite:false});
 function buildFall(f){const g=new T.Group();g.name=f.id==='chiriqui'?'Chiriqui hidden waterfall and crystal grotto':'Darien rainforest waterfall';root.add(g);const curtainZ=f.z+(f.id==='chiriqui'?6:5);const pool=p(geometry(new T.CircleGeometry(1,64)),mat('#297d77',{roughness:.26,metalness:.2,transparent:true,opacity:.85}),f.pool.x,.045,f.pool.z,f.pool.rx,f.pool.rz,1,g);pool.rotation.x=-Math.PI/2;pool.castShadow=false;
  for(let i=0;i<42;i++){const side=i%2?-1:1,x=f.x+side*(12+i%3*1.8),z=f.z-2-(i%5)*1.2,y=(i%7)*(f.top/7);const r=p(rockGeo,i%4===0?moss:stone,x,y+1,z,2.2,1.8,2.0,g);r.rotation.set(i*.2,i*.7,i*.12);if(i<8)solidRocks.push({x,z,r:1.8});}
  for(let row=0;row<2;row++)for(let j=0;j<11;j++)p(rockGeo,j%3?stone:moss,f.x-9+j*1.8,f.top-.5+Math.sin(j*2.1)*.32,curtainZ-1.5-row*2.3,1.6,1.0,2,g);if(f.id==='chiriqui')p(box,dark,f.x,3.5,f.z-2.7,19,7,.6,g);
  for(let i=0;i<5;i++){const curtain=p(geometry(new T.PlaneGeometry(f.width/3,f.top,6,18)),waterMat,f.x+(i-2)*f.width/5,f.top/2+.15,curtainZ+.05+i%2*.12,1,1,1,g);curtain.castShadow=false;}
  const feeder=p(geometry(new T.PlaneGeometry(f.width*.75,9)),riverMat,f.x,f.top+.12,f.z-2,1,1,1,g);feeder.rotation.x=-Math.PI/2;feeder.castShadow=false;
  for(let i=0;i<24;i++){const a=i*2.4,r=9+(i%3)*1.1,x=f.pool.x+Math.cos(a)*r,z=f.pool.z+Math.sin(a)*r*.85;if(Math.abs(z-f.z)>5)p(rockGeo,i%3?stone:moss,x,.12,z,1.1,.55,.8,g);}
  const particles=geometry(new T.BufferGeometry()),points=new Float32Array(150*3);particles.setAttribute('position',new T.BufferAttribute(points,3));const spray=new T.Points(particles,foamMat);spray.name='Waterfall mist and splash';g.add(spray);
  const crystals=f.id==='chiriqui'?WATERFALL_CRYSTALS.map(c=>{const mesh=emblems.sprite('diamond',c.x,height(c.x,c.z)+.7,c.z,1.05,g);mesh.name='Replenishing grotto diamond '+c.id;return {c,mesh};}):[];
  const birds=[];for(let i=0;i<(f.id==='chiriqui'?24:10);i++){const a=createDetailedBird(o,g,i%3?'parrot':'toucan');a.g.name='Waterfall bird in flight';a.g.scale.setScalar(.65);birds.push({b:a.g,animate:a.animate,i});}
  for(let i=0;i<8;i++){const a=i*2.4,x=f.pool.x+Math.cos(a)*(f.pool.rx+2),z=f.pool.z+Math.sin(a)*(f.pool.rz+2),l=land.reptile(g).g;l.name='Waterfall iguana on riverbank rocks';l.position.set(x,height(x,z)+.02,z);l.rotation.y=a;l.scale.setScalar(.8);}
  falls.push({f,g,points,particles,birds,crystals});return falls.at(-1);
 }
 for(const tree of trees){const size=tree.size||tree.scale||1,key=Math.floor(tree.x/45)+','+Math.floor(tree.z/45);if(tree.kind!=='natural'||bins.has(key)||!natureSiteClear(tree.x,tree.z,1)||size<.8)continue;bins.add(key);perches.push({x:tree.x,z:tree.z,size});}
 function buildSloth(t,i){const {g}=land.sloth(root);g.position.set(t.x+1.3*t.size,height(t.x,t.z)+4.2*t.size,t.z+.4*t.size);g.scale.setScalar(.85);for(const z of [-.40,.31]){const branch=p(cylinder,bark,-.2,.58,z,.075,2.8,.075,g);branch.rotation.z=Math.PI/2;}sloths.push({g,t,i});return g;}
 function update(dt,active,player){if(active)time+=dt;root.visible=!player.indoors;if(player.indoors)return;
  waterMat.uniforms.time.value=time;if(player.x>460&&!waterBuilt){waterBuilt=true;for(const path of DARIEN_RIVERS)root.add(surfaceMesh(T,geometry,roadRibbon(path,7.6,()=>0,{lift:.045}),riverMat,'Darien freshwater river current'));for(const pond of JUNGLE_PONDS){const mesh=p(geometry(new T.CircleGeometry(1,48)),mat('#244c3c',{roughness:.3,metalness:.15}),pond.x,.04,pond.z,pond.rx,pond.rz,1);mesh.rotation.x=-Math.PI/2;mesh.castShadow=false;}}for(const f of RAINFOREST_FALLS)if(Math.hypot(player.x-f.x,player.z-f.z)<150&&!falls.some(a=>a.f===f))buildFall(f);
  for(let i=0;i<perches.length;i++){const t=perches[i];if(!t.g&&Math.hypot(t.x-player.x,t.z-player.z)<95)t.g=buildSloth(t,i);if(t.g){t.g.visible=Math.hypot(t.x-player.x,t.z-player.z)<105;t.g.rotation.z=Math.sin(time*.12+i)*.035;}}
  for(const a of falls){a.g.visible=Math.hypot(player.x-a.f.x,player.z-a.f.z)<170;if(!a.g.visible)continue;for(let i=0;i<150;i++){const phase=(time*.55+i*.137)%1;a.points[i*3]=a.f.x+Math.sin(i*12.3+time)*a.f.width*.48;a.points[i*3+1]=.15+Math.sin(phase*Math.PI)*(1+i%4*.3);a.points[i*3+2]=a.f.z+(a.f.id==='chiriqui'?6:5)+phase*3+(i%7)*.12;}a.particles.attributes.position.needsUpdate=true;
   for(const {b,animate,i}of a.birds){const t=time*(.17+i%3*.035)+i*2.4;b.position.set(a.f.x+Math.cos(t)*(11+i%4*3),a.f.top+3+Math.sin(t*.7)*3,a.f.z+Math.sin(t)*(9+i%5));b.rotation.y=Math.atan2(-Math.sin(t),Math.cos(t));animate(time+i,{flying:true});}
   for(const {c,mesh}of a.crystals){mesh.visible=!state.world.waterfall.claimed.includes(c.id);mesh.position.y=height(c.x,c.z)+.7+Math.sin(time*1.5+c.id)*.08;if(active&&mesh.visible&&!player.protected&&Math.hypot(c.x-player.x,c.z-player.z)<1.2&&Math.abs(player.y-height(c.x,c.z))<2&&claimWaterfall(state.world,c.id)){mesh.visible=false;onBoost?.();tell('💎 +3 gemas · 🍀 +2 amuletos · 🪙 +5 · ⚡ Impulso','💎 +3 gems · 🍀 +2 charms · 🪙 +5 · ⚡ Boost');save();refresh();}}
  }
  if(active){if(replenishWaterfall(state.world,dt)){save();refresh();}if(state.world.waterfall.claimed.length&&time-saveAt>5){saveAt=time;save();}}
 }
 return {root,falls,perches,sloths,solidRocks,clear:(x,z)=>!solidRocks.some(r=>Math.hypot(r.x-x,r.z-z)<r.r+.35),update,dispose(){emblems.dispose();land.dispose();scene.remove(root);waterMat.dispose();foamMat.dispose();}};
}

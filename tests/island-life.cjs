const assert=require('node:assert/strict');
(async()=>{
 const T=await import('../games/adventure/vendor/three.module.min.js'),{createIslandLife,islandDaylight}=await import('../games/adventure/island-life.js'),{normalizeExplore,inWater}=await import('../games/adventure/explore-state.js');
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(),sun=new T.DirectionalLight(),ambient=new T.HemisphereLight(),waterMaterial={uniforms:{daylight:{value:1}}},state={world:normalizeExplore({dayTime:60})};scene.background=new T.Color();scene.fog=new T.FogExp2();
 const materials=[],geometries=[],geometry=g=>(geometries.push(g),g),mat=(color,options={})=>{const m=new T.MeshStandardMaterial({color,...options});materials.push(m);return m;},ball=geometry(new T.SphereGeometry(1,8,6)),cone=geometry(new T.ConeGeometry()),box=geometry(new T.BoxGeometry());
 const make=(g,m,x=0,y=0,z=0,sx=1,sy=sx,sz=sx,parent=scene)=>{const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;};
 const life=createIslandLife({T,scene,camera,state,make,mat,geometry,ball,cone,box,sun,ambient,waterMaterial,inWater});life.update(0,true,false);
 assert(scene.getObjectByName('Sun').visible);assert(!scene.getObjectByName('Moon').visible);assert.equal(scene.getObjectByName('Ocean wildlife').children.length,41);
 const turtle=scene.getObjectByName('Sea turtle 1'),before=turtle.position.clone();life.update(.05,false,false);assert(turtle.position.equals(before));assert.equal(state.world.dayTime,60);life.update(.05,true,false);assert(!turtle.position.equals(before));assert.equal(state.world.dayTime,60.01);
 state.world.dayTime=180;life.update(0,true,true);assert(scene.getObjectByName('Moon').visible);assert(!scene.getObjectByName('Sun').visible);assert(ambient.intensity>=1.15);assert(waterMaterial.uniforms.daylight.value>=.42);
 life.update(30,false,true);assert.equal(state.world.dayTime,180);assert.equal(normalizeExplore(JSON.parse(JSON.stringify(state.world))).dayTime,180);
 // The celestial orbit is in the world, independent of camera yaw.
 const moon=scene.getObjectByName('Moon'),position=moon.position.clone();camera.rotation.y=1.7;life.update(0,false,false);assert(moon.position.equals(position));assert(!camera.getObjectByName('Sun moon and stars'));
 for(const time of [-480,0,40,60,150,180,225,239.99,10000]){const light=islandDaylight(time);assert(light.day>=0&&light.day<=1);assert(light.phase>=0&&light.phase<1);}
 life.dispose();assert(!scene.getObjectByName('Sun moon and stars'));assert(!scene.getObjectByName('Ocean wildlife'));materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());console.log('PASS gradual daylight, bright moonlit night, wildlife, pause, saved phase, world-space sky and cleanup');
})().catch(e=>{console.error(e);process.exitCode=1;});

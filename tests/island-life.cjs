const assert=require('node:assert/strict');
(async()=>{
 const {worldClock,MORNING_TIME}=await import('../games/adventure/world-clock.js');
 for(const [phase,time,night] of [[0,'6:00 AM',true],[60,'12:00 PM',false],[120,'6:00 PM',false],[180,'12:00 AM',true],[240,'6:00 AM',true],[-60,'12:00 AM',true],[119.99,'5:59 PM',false],[10,'7:00 AM',false],[130,'7:00 PM',true]]){assert.equal(worldClock(phase).time,time);assert.equal(worldClock(phase).night,night);}
 assert.equal(worldClock(MORNING_TIME).time,'8:00 AM');assert.equal(worldClock(NaN).time,'10:00 AM');
 const T=await import('../games/adventure/vendor/three.module.min.js'),{createIslandLife,islandDaylight}=await import('../games/adventure/island-life.js'),{normalizeExplore,inWater}=await import('../games/adventure/explore-state.js');
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(),sun=new T.DirectionalLight(),ambient=new T.HemisphereLight(),waterMaterial={uniforms:{daylight:{value:1}}},state={world:normalizeExplore({dayTime:60})};scene.background=new T.Color();scene.fog=new T.FogExp2();
 const materials=[],geometries=[],geometry=g=>(geometries.push(g),g),mat=(color,options={})=>{const m=new T.MeshStandardMaterial({color,...options});materials.push(m);return m;},ball=geometry(new T.SphereGeometry(1,8,6)),cone=geometry(new T.ConeGeometry()),box=geometry(new T.BoxGeometry());
 const make=(g,m,x=0,y=0,z=0,sx=1,sy=sx,sz=sx,parent=scene)=>{const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;};
 const life=createIslandLife({T,scene,camera,state,make,mat,geometry,ball,cone,box,sun,ambient,waterMaterial,inWater});life.update(0,true,false);
 assert(scene.getObjectByName('Sun').visible);assert(!scene.getObjectByName('Moon').visible);assert(scene.getObjectByName('Ocean wildlife').children.length>=41);
 const turtle=scene.getObjectByName('Sea turtle 1'),before=turtle.position.clone();life.update(.05,false,false);assert(turtle.position.equals(before));assert.equal(state.world.dayTime,60);life.update(.05,true,false);assert(!turtle.position.equals(before));assert.equal(state.world.dayTime,60.01);
 state.world.dayTime=180;life.update(0,true,true);assert(scene.getObjectByName('Moon').visible);assert(!scene.getObjectByName('Sun').visible);assert(ambient.intensity>=.6&&ambient.intensity<1);assert.equal(waterMaterial.uniforms.daylight.value,0);
 const key=scene.getObjectByName('Cinematic night action light');life.update(0,false,true,{x:5,y:9,z:12});assert(key.intensity>0);assert.equal(key.target.position.y,9.5);const stars=scene.getObjectByName('Slowly drifting stars'),angle=stars.rotation.y;life.update(1,true,true,{x:6,y:10,z:13});assert(stars.rotation.y>angle);assert.equal(key.position.x,6);life.update(0,false,true,{x:6,y:10,z:13,indoors:true});assert.equal(key.intensity,0);state.world.dayTime=180;
 life.update(30,false,true);assert.equal(state.world.dayTime,180);assert.equal(normalizeExplore(JSON.parse(JSON.stringify(state.world))).dayTime,180);
 // The large moon remains in view when steering at night.
 const moon=scene.getObjectByName('Moon'),position=moon.position.clone();camera.rotation.y=1.7;life.update(0,false,false);assert(!moon.position.equals(position));assert(!camera.getObjectByName('Sun moon and stars'));
 for(const time of [-480,0,40,60,150,180,225,239.99,10000]){const light=islandDaylight(time);assert(light.day>=0&&light.day<=1);assert(light.phase>=0&&light.phase<1);}
 state.world.dayTime=60;life.update(1200,true,false);assert.equal(state.world.dayTime,60);
 life.dispose();assert(!scene.getObjectByName('Sun moon and stars'));assert(!scene.getObjectByName('Ocean wildlife'));materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());console.log('PASS gradual daylight, dark moonlit night, wildlife, pause, saved phase, moon visible while steering and cleanup');
})().catch(e=>{console.error(e);process.exitCode=1;});

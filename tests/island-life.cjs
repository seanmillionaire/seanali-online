const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
(async()=>{const root=path.resolve(__dirname,'../games/adventure'),scope={};vm.runInNewContext(['explore-state.js','ocean-models.js','island-life.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8').replace(/^import .*;\n/gm,'').replace(/\bexport /g,'')).join('\n')+';this.api={normalizeExplore,islandDaylight,createIslandLife,inWater,sharkStep};',scope);const a=scope.api,T=await import(pathToFileURL(path.join(root,'vendor/three.module.min.js')));
// Night is paused for all save phases, including previous nighttime saves.
for(const time of [-480,0,40,60,150,180,200,225,239.99,10000]){
 const light=a.islandDaylight(time);
 assert.equal(light.day,1,'bright daytime at '+time);
 assert.equal(light.night,false,'no nighttime at '+time);
 assert.equal(light.twilight,0,'no twilight at '+time);
}
assert.equal(a.islandDaylight(180).phase,.25,'fixed midday regardless of old save');
const scene=new T.Scene(),camera=new T.PerspectiveCamera(),sun=new T.DirectionalLight(),ambient=new T.HemisphereLight(),waterMaterial={uniforms:{daylight:{value:1}}},state={world:a.normalizeExplore({dayTime:60})};scene.background=new T.Color();scene.fog=new T.FogExp2();const materials=[],geometries=[],geometry=g=>(geometries.push(g),g),mat=(color,options={})=>{const m=new T.MeshStandardMaterial({color,...options});materials.push(m);return m;},ball=geometry(new T.SphereGeometry(1,8,6)),cone=geometry(new T.ConeGeometry()),box=geometry(new T.BoxGeometry());const make=(g,m,x=0,y=0,z=0,sx=1,sy=sx,sz=sx,parent=scene)=>{const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;};
const life=a.createIslandLife({T,scene,camera,state,make,mat,geometry,ball,cone,box,sun,ambient,waterMaterial,inWater:a.inWater,sharkStep:a.sharkStep});life.update(0,true,false);assert(camera.getObjectByName('Sun').visible);assert(!camera.getObjectByName('Moon').visible);assert.equal(scene.getObjectByName('Ocean wildlife').children.length,36);const turtle=scene.getObjectByName('Sea turtle 1'),before=turtle.position.clone();life.update(.05,false,false);assert(turtle.position.equals(before));assert.equal(state.world.dayTime,60);life.update(.05,true,false);assert(!turtle.position.equals(before),'wildlife still swims with decorative motion disabled');assert.equal(state.world.dayTime,60,'daytime clock stays paused during movement');
// An existing saved night must immediately render as bright day, then stay day.
state.world.dayTime=180;life.update(0,true,true);
assert(camera.getObjectByName('Sun').visible);
assert(!camera.getObjectByName('Moon').visible);
assert.equal(waterMaterial.uniforms.daylight.value,1);
assert.equal(state.world.dayTime,60,'old night saved phase resets to midday');
assert.equal(sun.intensity,3,'sunlight stays bright');
assert(ambient.intensity>=1.4,'ambient daylight stays bright');
life.update(30,false,true);assert.equal(state.world.dayTime,60,'paused game remains daytime');
life.update(0,true,false);assert(camera.getObjectByName('Sun').visible,'daylight with reduced motion');
const saved=a.normalizeExplore(JSON.parse(JSON.stringify(state.world)));
assert.equal(saved.dayTime,60,'daytime state survives save and reload');
state.world.dayTime=239.99;life.update(.05,true,true);
assert.equal(state.world.dayTime,60,'old cycle boundary never starts night');
life.dispose();assert(!camera.getObjectByName('Sun moon and stars'));assert(!scene.getObjectByName('Ocean wildlife'));materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());console.log('PASS daylight-only mode across old saves and cycles, sun/moon, water lighting, wildlife, pause, reduced motion, save and cleanup.');})().catch(e=>{console.error(e);process.exitCode=1;});

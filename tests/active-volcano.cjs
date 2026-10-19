const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
 const base=path.resolve(__dirname,'../games/adventure'),T=await import(pathToFileURL(path.join(base,'vendor/three.module.min.js'))),{createActiveVolcano}=await import(pathToFileURL(path.join(base,'active-volcano.js'))),{LAVA_POOLS,lavaPoolPose,BARU}=await import(pathToFileURL(path.join(base,'volcano-safety.js'))),{isletHeight}=await import(pathToFileURL(path.join(base,'explore-state.js')));
 for(const light of [false,true]){
  const scene=new T.Scene(),v=createActiveVolcano({T,scene,x:BARU.x,z:BARU.z,height:isletHeight,light});
  assert.equal(v.smoke.length,light?14:26);assert.equal(v.pools.length,3);
  v.pools.forEach((mesh,i)=>{const p=lavaPoolPose(LAVA_POOLS[i],isletHeight);assert.equal(mesh.position.y,p.y);});
  assert(v.lava.position.y>40,'lava visible above the road-height cut');
  v.update(80);const p=v.smoke[0].position.clone();v.update(80);assert(p.equals(v.smoke[0].position),'paused time stays still');
  for(let t=0;t<300;t+=.7){v.update(t);for(const [i,s]of v.smoke.entries()){const vent=lavaPoolPose(LAVA_POOLS[i%LAVA_POOLS.length],isletHeight);assert(s.position.y>=vent.y+1&&s.position.y<vent.y+21);assert(s.material.opacity>=0&&s.material.opacity<=.55);assert(Number.isFinite(s.scale.x));}}
  let disposed=false;v.lava.geometry.addEventListener('dispose',()=>disposed=true);v.dispose();assert.equal(scene.children.length,0);assert(disposed);
 }
 console.log('PASS three visible lava pools, animated smoke from each vent, quality modes, frozen time and resource cleanup');
})().catch(e=>{console.error(e);process.exit(1)});

const assert=require('node:assert/strict');
(async()=>{
 const T=await import('../games/adventure/vendor/three.module.min.js'),{createCloseCamera,closeMovement,EYE_HEIGHT,EYE_FORWARD}=await import('../games/adventure/close-camera.js');
 const avatar=new T.Group(),rig=createCloseCamera({avatar}),p=new T.Vector3(),look=new T.Vector3();
 for(const scale of [1,2.7,6])for(const yaw of [0,.8,Math.PI,-2]){
  rig.reset(yaw);rig.place(p,look,17,4,-23,scale);
  assert(Math.abs(p.x-(17+Math.sin(yaw)*EYE_FORWARD*scale))<1e-9);
  assert.equal(p.y,4+EYE_HEIGHT*scale);assert(Math.abs(p.z-(-23+Math.cos(yaw)*EYE_FORWARD*scale))<1e-9);
  assert(Math.abs(Math.atan2(look.x-p.x,look.z-p.z)-yaw)<1e-9,'look direction originates at her eyes');
 }
 rig.reset(0);rig.look(100,100000);rig.place(p,look,0,0,0);assert(Number.isFinite(look.y));rig.reset(0);rig.place(p,look,0,0,0);assert.equal(look.y,EYE_HEIGHT);assert.equal(p.z,EYE_FORWARD,'no rear or shoulder camera offset');
 const v=closeMovement(0,-1,Math.PI/2);assert(Math.abs(v.x-1)<1e-9&&Math.abs(v.z)<1e-9);
 console.log('PASS true eye-position camera at all avatar sizes/headings, pitch limits, reset and first-person movement');
})().catch(e=>{console.error(e);process.exit(1)});

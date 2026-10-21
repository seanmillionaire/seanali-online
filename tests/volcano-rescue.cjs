const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
(async()=>{
 const {LAVA_POOLS,lavaPoolPose,touchesLava,returnToHospital,CITY_HOSPITAL,BARU}=await import('../games/adventure/volcano-safety.js');
 const {isletHeight,inWater,traversable,volcanoTrailPoint}=await import('../games/adventure/explore-state.js');
 assert(lavaPoolPose(LAVA_POOLS[0],isletHeight).y>40,'highway must not bury crater lava');
 for(const pool of LAVA_POOLS){const p=lavaPoolPose(pool,isletHeight);assert(touchesLava(p.x,p.y,p.z,isletHeight));assert(touchesLava(p.x,p.y-10,p.z,isletHeight));assert(!touchesLava(p.x,p.y+2,p.z,isletHeight),'flight above lava safe');}
 for(let i=0;i<=100;i++){const p=volcanoTrailPoint(i/100);assert(!touchesLava(p.x,p.y,p.z,isletHeight),'hiking trail stays safe');}
 const world={x:BARU.x,z:BARU.z,growth:3,flight:4,food:{banana:5},collected:['a'],city:{cruise:{tickets:2}},badges:['picnic']};
 returnToHospital(world);assert.deepEqual({x:world.x,z:world.z},CITY_HOSPITAL.spawn);assert.equal(world.flight,0);assert.equal(world.growth,1);assert.equal(world.food.banana,5);assert.equal(world.city.cruise.tickets,2);assert.deepEqual(world.badges,['picnic']);
 assert(!inWater(world.x,world.z));assert(traversable(world.x,world.z));assert(!touchesLava(world.x,isletHeight(world.x,world.z),world.z,isletHeight));
 const src=fs.readFileSync(__dirname+'/../games/adventure/explore.js','utf8');
 const fn=src.slice(src.indexOf('  function respawnAtHospital(){'),src.indexOf('  const pavement=createRoadSurfaceSampler'));
 const context=vm.createContext({s:world,mountId:'mila',carDriving:true,friendSystem:{dismount(){}},exitCar(){},returnToHospital,lastShore:null,cameraSnap:false,closeCamera:{invalidate(){}},camera:{position:{set(){}}},target:{set(){}},height:()=>2,blur(){},host:{classList:{remove(){}}},joy:{boat(){}},save(){},refresh(){},tell(){}});
 vm.runInContext('let ride=1,boating=true,airborne=true,swimming=true,inside=true,flightY=10,flightTarget=20,flightVX=4,flightVZ=5,boatSpeed=3,carSpeed=4,jumpY=2,velocity=5,towerY=12,towerV=3,birdAltitude=8,birdTarget=10,birdLanding=true,energy=8,eating=2,impactLeft=1,rescueCooldown=0,bodyScale=3,targetPoint={},route=[1],buildReveal={};'+fn+'respawnAtHospital();',context);
 assert.equal(vm.runInContext('[ride,flightY,flightTarget,flightVX,flightVZ,boatSpeed,carSpeed,jumpY,velocity,towerY,towerV,birdAltitude,birdTarget,energy,eating].every(n=>n===0)',context),true);
 assert.equal(vm.runInContext('!boating&&!airborne&&!swimming&&!inside&&!mountId&&cameraSnap&&route.length===0&&!targetPoint',context),true);
 assert(src.includes('touchesLava(ax,ay,az,height)'));
 console.log('PASS three matching lava surfaces, safe hiking/flight, hospital on dry walkable ground, transport/input reset and progress preservation');
})().catch(e=>{console.error(e);process.exitCode=1});

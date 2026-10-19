const assert=require('node:assert/strict');
(async()=>{
 const {createCrocodileMotion,stepCrocodile,crocodileClear}=await import('../games/adventure/colon-wildlife.js');
 const {inWater}=await import('../games/adventure/explore-state.js');
 const animals=[];for(let i=0;i<8;i++)animals.push(createCrocodileMotion(i,inWater,animals));
 for(let i=0;i<8;i++)for(let j=0;j<i;j++)assert(Math.hypot(animals[i].x-animals[j].x,animals[i].z-animals[j].z)>7,'separate spawns');
 const starts=animals.map(a=>({...a}));let variation=animals.map(()=>0);
 for(let i=0;i<1200;i++)for(const [j,a]of animals.entries()){
  const before={...a};stepCrocodile(a,.1,inWater,null,animals);
  assert(Math.hypot(a.x-before.x,a.z-before.z)<=.151,'no crocodile teleports');
  assert(Math.abs(Math.atan2(Math.sin(a.heading-before.heading),Math.cos(a.heading-before.heading)))<=.066,'gradual turns');
  assert(crocodileClear(a.x,a.z,a.heading,inWater),'whole body stays in water');
  variation[j]=Math.max(variation[j],Math.abs(Math.hypot((a.x+10)/32,(a.z+125)/29)-1));
 }
 for(const [j,a]of animals.entries()){assert(a.travel>3,'each crocodile keeps wandering');assert(variation[j]>.02,'leaves the old oval route');}
 const a=createCrocodileMotion(0,inWater);stepCrocodile(a,.1,inWater,{x:a.x+10,z:a.z});assert.equal(a.mode,'watch');
 for(let i=0;i<30;i++)stepCrocodile(a,.1,inWater,{x:a.x+4,z:a.z});assert.equal(a.mode,'give-space');assert(a.attention>.9);
 const before=JSON.stringify(a);stepCrocodile(a,0,inWater);assert.equal(JSON.stringify(a),before,'pause does not change motion');
 const {naturalSharkPatrol}=await import('../games/adventure/island-life.js');
 const p={x:8,z:28,cx:0,cz:0,rx:32,rz:26,waypoint:0};
 let traveled=0;for(let i=0;i<100;i++){const n=naturalSharkPatrol(p,.1);traveled+=Math.hypot(n.x-p.x,n.z-p.z);Object.assign(p,n);assert(inWater(p.x,p.z));}
 assert(traveled>1);console.log('PASS eight independent crocodiles over two minutes: no snaps, smooth turns, full-body water clearance, path variation, proximity response, pause; shark wandering');
})().catch(e=>{console.error(e);process.exitCode=1});

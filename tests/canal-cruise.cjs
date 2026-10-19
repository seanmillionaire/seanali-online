const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const base=__dirname+'/../games/adventure/';
const route=fs.readFileSync(base+'cruise-route.js','utf8').replaceAll('export ','');
const physics=fs.readFileSync(base+'explore-state.js','utf8').replace(/^import .*$/gm,'').replaceAll('export ','');
const ctx=vm.createContext({normalizeEstate:()=>({buildings:[]}),estateCoinCost:()=>0});
vm.runInContext(fs.readFileSync(base+'panama-state.js','utf8').replaceAll('export ','')+'\n'+fs.readFileSync(base+'campaign-state.js','utf8').replaceAll('export ','')+'\n'+fs.readFileSync(base+'colon-state.js','utf8').replaceAll('export ','')+'\n'+route+'\n'+physics,ctx);
const evaluate=s=>vm.runInContext(s,ctx);
assert.equal(evaluate('normalizeCruise(null).tickets'),0);
assert.equal(evaluate('normalizeCruise({tickets:Infinity,active:true}).active'),false);
evaluate('var c=normalizeCruise(null);');
assert.equal(evaluate('buyCruise(c,9)'),false);
assert.equal(evaluate('buyCruise(c,10)'),true);
assert.equal(evaluate('buyCruise(c,100)'),false,'no duplicate charges');
evaluate('advanceCruise(c,.05,false)');assert.equal(evaluate('c.distance'),0);
evaluate('advanceCruise(c,.05,true)');assert(evaluate('c.distance>0'));
evaluate('c=normalizeCruise(JSON.parse(JSON.stringify(c)))');assert(evaluate('c.active&&c.tickets===1&&c.distance>0'));
evaluate('var world=freshExplore();world.city.cruise=c;var state={world,wallet:{rewards:["city-bag-0","city-bag-1","city-bag-2","city-bag-3","city-bag-4"],items:[]}}');
assert.equal(evaluate('coinBalance(state)'),evaluate('state.wallet.rewards.reduce((sum,id)=>sum+coinValue(id),0)-10'));
assert.equal(evaluate('normalizeExplore(world).city.cruise.tickets'),1);
evaluate('c.distance=CRUISE_LENGTH-.01');assert.equal(evaluate('advanceCruise(c,.05,true)'),true);
assert.equal(evaluate('advanceCruise(c,.05,true)'),false);assert.equal(evaluate('c.completed'),1);
assert.equal(evaluate('cruisePose(0).x===CRUISE_DOCK.x&&cruisePose(CRUISE_LENGTH).z===CRUISE_DOCK.z'),true);
assert.equal(evaluate('walkable(CRUISE_BOARD.x,CRUISE_BOARD.z)'),true,'boarding terminal on land');
assert.equal(evaluate('inWater(-50,-74)'),true,'canal carved to sea level');
const collisions=evaluate(`(()=>{
 const hits=[];
 for(let i=0;i<=3000;i++){
  const p=cruisePose(CRUISE_LENGTH*i/3000);
  for(const forward of [-17,0,18])for(const side of [-6,0,6]){
   const x=p.x+Math.sin(p.heading)*forward+Math.cos(p.heading)*side;
   const z=p.z+Math.cos(p.heading)*forward-Math.sin(p.heading)*side;
   if(!inWater(x,z))hits.push({i,x,z});
  }
 }return hits;
})()`);
assert.equal(collisions.length,0,'full hull stays in water: '+JSON.stringify(collisions.slice(0,3)));
const turnHits=evaluate(`(()=>{
 let heading=cruisePose(0).heading;const hits=[];
 for(let d=0;d<=CRUISE_LENGTH;d+=CRUISE_SPEED*.05){
  const p=cruisePose(d),turn=Math.atan2(Math.sin(p.heading-heading),Math.cos(p.heading-heading));heading+=turn*.05*1.8;
  for(const f of [-17,18])for(const side of [-6,6]){
   const x=p.x+Math.sin(heading)*f+Math.cos(heading)*side,z=p.z+Math.cos(heading)*f-Math.sin(heading)*side;
   if(!inWater(x,z))hits.push({d,x,z});
  }
 }return hits;
})()`);
assert.equal(turnHits.length,0,'turning hull clears land: '+JSON.stringify(turnHits.slice(0,3)));
console.log('PASS fares, wallet deductions, save/reload, pause, one full lap, return dock and 27,009 hull water samples');

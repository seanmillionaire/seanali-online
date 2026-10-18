const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),base=__dirname+'/../games/adventure/';
const read=f=>fs.readFileSync(base+f,'utf8').replace(/^import .*$/gm,'').replaceAll('export ','');
const ctx=vm.createContext({normalizeEstate:()=>({buildings:[]}),estateCoinCost:()=>0});
vm.runInContext(['colon-state.js','cruise-route.js','explore-state.js','colon-wildlife.js'].map(read).join('\n'),ctx);
const run=s=>vm.runInContext(s,ctx);
assert.equal(run('BLACK_MONKEY_COUNT'),28);assert.equal(run('COAST_CROCODILE_COUNT'),8);
const bad=run(`(()=>{
 const failures=[];
 for(let time=0;time<600;time+=1.7)for(let i=0;i<COAST_CROCODILE_COUNT;i++){
  const p=shoreCrocodilePose(i,time,inWater);
  if(Math.hypot((p.x-110)/32,(p.z+56)/29)>1.01)failures.push('outside coast');
  for(const f of [-4,0,3])for(const side of [-1.1,1.1]){
   if(!inWater(p.x+Math.sin(p.heading)*f+Math.cos(p.heading)*side,p.z+Math.cos(p.heading)*f-Math.sin(p.heading)*side))failures.push('land');
  }
 }
 return failures;
})()`);
assert.equal(bad.length,0,'crocodile bodies always stay in coastal water');
run('var play={active:true,score:0,start:10,lastCycle:-1};');
assert.equal(run('recordMonkeyJump(play,10).scored'),true);
assert.equal(run('recordMonkeyJump(play,10.1).scored'),false,'same jump cannot count twice');
assert.equal(run('recordMonkeyJump(play,12).scored'),false,'wait for the leap cue');
assert.equal(run('recordMonkeyJump(play,13.3).scored'),true);
assert.equal(run('recordMonkeyJump(play,16.5).complete'),true);
assert.equal(run('play.active'),false);
assert.equal(run('normalizeColon({monkeyGames:4}).monkeyGames'),4);
run('var state={world:freshExplore(),wallet:normalizeWallet(null)};');
assert.equal(run("earnCoins(state,'colon-monkey-play')"),12);
assert.equal(run("earnCoins(state,'colon-monkey-play')"),0,'no replay reward farming');
assert.equal(run("normalizeWallet(state.wallet).rewards.includes('colon-monkey-play')"),true);
const monkey=run(`(()=>{
 const anchors=[{x:100,z:-50,y:3},{x:108,z:-52,y:8},{x:113,z:-60,y:4},{x:105,z:-65,y:7}];
 const m={a:anchors[0],b:anchors[1],t:0,duration:1,seed:123};let moves=0,last=stepMonkey(m,0,anchors);
 for(let i=0;i<2000;i++){const p=stepMonkey(m,.016,anchors);if(!Number.isFinite(p.y)||p.y<2.9||p.y>12)return false;if(Math.hypot(p.x-last.x,p.z-last.z)>.01)moves++;last=p;}
 return moves>1800;
})()`);
assert(monkey,'monkeys keep moving and jumping through valid routes');
console.log('PASS 28 black monkeys, 8 water-only coastal crocodiles, 17k hull samples, jump game scoring, saved progress, one-time rewards and fast monkey motion');

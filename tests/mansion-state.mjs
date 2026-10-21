import {fresh as freshApp,normalize as normalizeApp} from '../games/adventure/state.js';
import assert from 'node:assert/strict';
import {freshExplore,normalizeExplore,coinBalance,inWater,roadDistance} from '../games/adventure/explore-state.js';
import {HOME_LOTS,chooseHome,constructHome,homeReady,homeCanWalk,homeMove,normalizeMansion} from '../games/adventure/mansion-state.js';
for(const lot of HOME_LOTS)for(let x=-13;x<=13;x+=2)for(let z=-12;z<=12;z+=2){assert(!inWater(lot.x+x,lot.z+z),'dry lot');assert(roadDistance(lot.x+x,lot.z+z)>6,'lot clears public road');}
const s={world:freshExplore(),wallet:{rewards:Array.from({length:12},(_,i)=>'city-bag-'+i),items:[]}};
assert.equal(coinBalance(s),60);assert(!chooseHome(s.world,'city','buy',coinBalance(s)));assert.equal(s.world.mansion.lot,null);
assert(chooseHome(s.world,'gorgona','build',coinBalance(s)));assert(!chooseHome(s.world,'city','immediate',999));for(let i=0;i<3;i++)assert(constructHome(s.world,coinBalance(s)));assert(!constructHome(s.world,coinBalance(s)));assert.equal(coinBalance(s),0);assert(!homeReady(s.world));
s.wallet.rewards.push('beacon');assert(constructHome(s.world,coinBalance(s)));assert(homeReady(s.world));assert(!constructHome(s.world,999));assert.equal(coinBalance(s),5);
Object.assign(s.world.mansion,{outfit:'evening',meals:3,plates:2,dogName:'Luna',gameBest:9,lights:false});const normalized=normalizeExplore(JSON.parse(JSON.stringify(s.world)));assert.deepEqual(normalized.mansion,s.world.mansion);assert.deepEqual(normalizeExplore(normalized),normalized);
const immediate=freshExplore();assert(chooseHome(immediate,'boquete','immediate',0));assert(homeReady(immediate));assert.equal(immediate.mansion.spent,0);
const old=normalizeExplore({food:{banana:8,coconut:5},mansion:null});assert.equal(old.mansion.lot,null);assert.deepEqual(old.food,{banana:8,coconut:5});
// Flood all walkable cells from the entry; every activity must be reachable.
const points=[[-7,-9],[6,-9],[-6,1],[9,-1],[-8,9],[8,8],[5,10.5],[0,10],[0,-11]],visited=new Set(['0,12']),queue=[[0,12]];
while(queue.length){const [x,z]=queue.shift();for(const [dx,dz] of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){const a=x+dx,b=z+dz,key=a+','+b;if(!visited.has(key)&&homeCanWalk(a,b)){visited.add(key);queue.push([a,b]);}}}
for(const [x,z] of points)assert(visited.has(x+','+z),'activity reachable '+x+','+z);
const blocked=homeMove(0,0,-12,0);assert(blocked.x>-7.8,'furniture stops long movement');assert.equal(normalizeMansion({lot:'fake',stage:4}).stage,0);
const occupied=freshExplore();occupied.estate.buildings.push({id:1,type:'cottage',x:439,z:-36,level:1});assert(!chooseHome(occupied,'city','immediate',999),'preserve earlier homes');
const app=freshApp();app.world=s.world;app.wallet=s.wallet;app.started=true;const reloaded=normalizeApp(JSON.parse(JSON.stringify(app)));assert.deepEqual(reloaded.world.mansion,app.world.mansion,'full app save restores home');assert.equal(coinBalance(reloaded),coinBalance(app));
console.log('PASS all 3 plots, free/immediate and earned paths, atomic costs, construction cap, old/save round trip, all rooms reachable, swept furniture collision');

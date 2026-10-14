const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const scope={};vm.runInNewContext(fs.readFileSync(__dirname+'/../games/adventure/explore-state.js','utf8').replace(/\bexport /g,'')+'\nthis.next=nextIslandAdventure;',scope);
const s={completed:{},islandLessons:{completed:{},attempts:{}}};const seen=new Set();
for(let i=0;i<48;i++){const next=scope.next(s);assert(next);assert(!seen.has(next.id));assert.equal(next.done,i);if(i<6)assert.equal(next.region,i);seen.add(next.id);s.islandLessons.completed[next.id]=3;}
assert.equal(scope.next(s),null);delete s.islandLessons.completed['market-0'];assert.equal(scope.next(s).id,'market-0');s.completed['market-0']=3;assert.equal(scope.next(s),null);s.islandLessons.attempts['jungle-2']={stage:1};assert.equal(scope.next(s).id,'jungle-2');assert(scope.next(s).resuming);console.log('PASS next-step progression visits all 48 adventures, respects story rewards, resumes paused activities, and handles completion.');

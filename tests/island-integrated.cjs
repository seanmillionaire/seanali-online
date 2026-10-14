const {boot,solve}=require('./island-adventure.cjs'),assert=require('node:assert/strict');
for(const lang of ['en','es']){
 let c=boot(lang);c.d.querySelector('.welcome .primary').click();c.g.state.world.x=11;c.g.state.world.z=7;
 c.g.startQuest(c.g.quests[0]);solve(c);const story=JSON.stringify(c.g.state.active);
 c.g.setScreen('explore');c.g.openLessons(4);assert.equal(c.d.querySelectorAll('.quest-row:not(:disabled)').length,8,'garden activities open without story gates');c.d.querySelector('#dialog').close();
 // Visit every region in reverse order: every original activity is reachable freely.
 for(const q of [...c.g.quests].reverse()){
  c.g.startIslandQuest(q);assert(c.d.querySelector('.island-lesson'));assert(c.d.querySelector('.explore-world'));
  for(let stage=0;stage<3;stage++)solve(c);
  assert(c.g.state.islandLessons.completed[q.id]);assert(!c.d.querySelector('.island-lesson'));assert(c.d.querySelector('.explore-world'));assert.equal(c.g.state.world.x,11);assert.equal(c.g.state.world.z,7);assert.equal(JSON.stringify(c.g.state.active),story,'story attempt remains unchanged');
 }
 assert.equal(Object.keys(c.g.state.islandLessons.completed).length,48);assert.equal(c.g.state.world.flowers,6);
 c.g.startIslandQuest(c.g.quests[8]);solve(c);assert.equal(c.g.state.islandLessons.attempts['market-0'].stage,1);c.g.setScreen('explore');c.g.startIslandQuest(c.g.quests[16]);solve(c);
 const saved=c.w.localStorage.getItem('isla-adventure-v1');c.close();c=boot(lang,saved);assert.equal(Object.keys(c.g.state.islandLessons.completed).length,48);assert.equal(c.g.state.islandLessons.attempts['market-0'].stage,1);c.g.startIslandQuest(c.g.quests[8]);assert.equal(c.g.task.type,'choice');assert.equal(c.g.state.islandLessons.attempts['market-0'].stage,1);c.close();console.log(`PASS ${lang}: all 144 island activity stages, free region access, return position, garden rewards, independent story save, multiple paused adventures, reload.`);
}

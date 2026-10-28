const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const root=__dirname+'/../games/adventure/';const read=f=>fs.readFileSync(root+f,'utf8').replace(/^import .*$/gm,'').replaceAll('export ','');
(async()=>{const modules=await Promise.all(['campaign-state.js','colon-state.js','cruise-route.js','explore-state.js','island-workshop.js','region-projects.js'].map(f=>import(root+f)));const ctx=vm.createContext(Object.assign({},...modules));const run=s=>vm.runInContext(s,ctx);
assert.equal(run('normalizeCampaign(null).chapter'),0);assert.equal(run('normalizeCampaign({chapter:Infinity}).chapter'),0);
run('var state={world:freshExplore(),wallet:{rewards:[]}};');assert.equal(run('campaignSnapshot(state,missionStatus).ready'),false);
assert.equal(run('acceptCampaign(state.world)'),true);
assert.equal(run('turnInCampaign(state,campaignSnapshot(state,missionStatus))'),false);
run("state.world.collected=exploreItems.filter(x=>x.kind==='shell').slice(0,3).map(x=>x.id);state.world.story.shells=3;state.world.craft.built=['sandcastle'];state.wallet.rewards=['craft-use-sandcastle'];");
assert.equal(run('campaignSnapshot(state,missionStatus).ready'),true);
run('state.world.x=30;state.world.z=20');assert.equal(run('turnInCampaign(state,campaignSnapshot(state,missionStatus))'),false);
run('state.world.x=3;state.world.z=9');assert.equal(run('turnInCampaign(state,campaignSnapshot(state,missionStatus))'),true);assert.equal(run('state.world.campaign.chapter'),1);assert.equal(run('state.world.campaign.accepted'),false);
assert.equal(run("stepFestivalWork(state.world.campaign,'sandcastle',2)"),'retry');assert.equal(run("state.world.campaign.work.sandcastle"),0);
for(const choice of [0,0,1,2])run(`stepFestivalWork(state.world.campaign,'sandcastle',${choice})`);
assert.equal(run('normalizeExplore(state.world).campaign.work.sandcastle'),4);
run("state.world.campaign.chapter=8;state.world.campaign.accepted=true;state.world.badges=['beacon'];state.world.city.cruise.completed=1");assert.equal(run('turnInCampaign(state,campaignSnapshot(state,missionStatus))'),true);assert.equal(run('campaignSnapshot(state,missionStatus).finished'),true);
assert.equal(run('turnInCampaign(state,campaignSnapshot(state,missionStatus))'),false);
console.log('PASS legacy saves, chapter gates, return distance, work persistence, wrong choice, finale, duplicate hand-in');

})().catch(e=>{console.error(e);process.exitCode=1});

const {JSDOM}=require('jsdom'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'../games/adventure'),T=await import(pathToFileURL(path.join(root,'vendor/three.module.min.js')));
 const source=['world-story.js','explore-state.js'].map(f=>fs.readFileSync(path.join(root,f),'utf8').replace(/\bexport /g,'')).join('\n');
 for(const lang of ['en','es']){
  const dom=new JSDOM('<main></main>',{runScripts:'outside-only'}),w=dom.window;w.eval(source+'\nwindow.api={islandStories,normalizeExplore,normalizeStory,stepStory,createWorldStory,earnCoins,coinBalance,syncWallet};');const a=w.api,host=w.document.querySelector('main'),state={lang,world:a.normalizeExplore(null)},scene=new T.Scene();let enabled=true,saved=0,opened=[];a.syncWallet(state);
  const story=a.createWorldStory({T,scene,host,state,height:()=>0,save:()=>saved++,joy:{effect(){},note(){},gesture(){}},spark(){},refresh:id=>a.earnCoins(state,'story-'+id),openNext:id=>opened.push(id),active:()=>enabled,motion:()=>false});
  function move(x,z){state.world.x=x;state.world.z=z;story.update(.03,0);}
  for(const q of a.islandStories){
   move(q.x,q.z+1);const wrong=(q.order[0]+1)%3;move(q.x+(wrong-1)*1.8,q.z);assert.equal(state.world.story[q.id],0,'wrong tile never progresses');
   for(let i=0;i<q.order.length;i++){move(q.x,q.z+1);move(q.x+(q.order[i]-1)*1.8,q.z);assert.equal(state.world.story[q.id],i+1,q.id+' advances on the requested tile');story.update(.03,0);assert.equal(state.world.story[q.id],i+1,'standing on a tile never advances twice');}
   assert(!host.querySelector('.story-more').hidden);host.querySelector('.story-more').click();assert.equal(opened.at(-1),q.region+'-0','the trail continues into its original lesson');
   move(q.x,q.z+1);move(q.x+(q.order[0]-1)*1.8,q.z);assert.equal(state.world.story[q.id],q.order.length);
  }
  assert.equal(a.coinBalance(state),60,'six unique rewards');assert.equal(state.world.food.banana,3);assert.equal(state.world.flowers,2);assert.equal(Object.keys(state.islandLessons?.completed||{}).length,0,'world tasks do not fake original lesson completions');
  const restored=a.normalizeExplore(JSON.parse(JSON.stringify(state.world)));assert.deepEqual(JSON.parse(JSON.stringify(restored.story)),JSON.parse(JSON.stringify(state.world.story)));a.syncWallet(state);const balance=a.coinBalance(state);a.syncWallet(state);assert.equal(a.coinBalance(state),balance,'reload does not duplicate coins');
  enabled=false;story.update(.03,0);assert(host.querySelector('.world-story').hidden,'vehicle and modal mode hides story HUD');enabled=true;host.classList.add('snack-moment');story.update(.03,0);assert(host.querySelector('.world-story').hidden,'eating remains unobstructed');
  assert(saved>0);story.dispose();assert(!host.querySelector('.world-story'));assert(!scene.getObjectByName('Living story trails'));dom.window.close();
 }
 console.log('PASS world story choices, six trails, bilingual cues, rewards, save/reload, lesson handoff, uncluttered eating and cleanup.');
})().catch(e=>{console.error(e);process.exitCode=1;});

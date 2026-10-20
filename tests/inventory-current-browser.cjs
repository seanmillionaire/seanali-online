const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const b=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const p=await b.newPage();let errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto((process.env.BASE_URL||'http://127.0.0.1:8765')+'/404.html',{waitUntil:'domcontentloaded'});
await p.evaluate(async()=>{document.documentElement.innerHTML='<head><link rel="stylesheet" href="/games/adventure/style.css"><link rel="stylesheet" href="/games/adventure/mobile-play.css"></head><body><main></main></body>';document.body.dataset.scene='explore';const st=await import('/games/adventure/state.js?v=188'),a=await import('/games/adventure/explore-state.js?v=188'),e=await import('/games/adventure/explore.js?v=188');window.audit={st,a,e};window.boot=raw=>{audit.game?.dispose();const host=document.querySelector('main');host.className='explore-world';host.replaceChildren();audit.state=st.normalize(raw||st.fresh());const s=audit.state;s.lang='en';if(!raw)Object.assign(s.world,a.islandPoint('wilds',-9,-37));audit.game=e.createExplore(host,{state:s,save:()=>localStorage.setItem(st.SAVE_KEY,JSON.stringify(s)),joy:{effect(){},note(){},gesture(){},boat(){}},motion:()=>false,openBook(){},openHome(){}});};boot();});
await p.waitForSelector('.explore-ready',{timeout:120000});await p.waitForTimeout(1000);await p.evaluate(()=>document.querySelectorAll('.panel-close').forEach(e=>{if(e.getBoundingClientRect().width)e.click()}));await p.waitForSelector('.world-action:not([hidden])',{timeout:30000});const act=p.locator('.world-action.has-target[data-words*="Pick banana"]');
await act.click();await p.waitForFunction(()=>audit.state.world.food.banana===1);
await p.locator('.mobile-dock-build').click();assert.match(await p.locator('.explore-panel').innerText(),/🍌 1/);await p.locator('.explore-panel button').filter({hasText:/^🍌 Food$/}).click();
assert.match(await p.locator('.explore-panel').innerText(),/Bananas × 1/);
await p.locator('.explore-panel .discover-place').filter({hasText:'🍌 Bananas'}).click();await p.waitForFunction(()=>audit.state.world.food.banana===0);await p.locator('.panel-close:visible').click();
assert.equal(await p.evaluate(()=>audit.state.world.food.banana),0);
await p.locator('.world-action.has-target[data-words*="Pick banana"]').click();
await p.waitForFunction(()=>audit.state.world.food.banana===1);
await p.evaluate(()=>boot(JSON.parse(localStorage.getItem(audit.st.SAVE_KEY))));await p.waitForTimeout(2000);assert.equal(await p.evaluate(()=>audit.state.world.food.banana),1);await p.evaluate(()=>document.querySelectorAll('.panel-close').forEach(e=>{if(e.getBoundingClientRect().width)e.click()}));await p.locator('.mobile-dock-build').click();
for(const [width,height] of [[320,568],[375,667],[390,844],[430,844],[768,1024],[1440,900]]){
 await p.setViewportSize({width,height});if(process.env.SCREENSHOT_DIR)await p.screenshot({path:process.env.SCREENSHOT_DIR+'/inventory-'+width+'.png'});
 const fits=await p.locator('.explore-panel').evaluate(e=>e.getBoundingClientRect().right<=innerWidth+1&&e.getBoundingClientRect().left>=-1);
 assert(fits,'bag fits viewport '+width);
}
assert.deepEqual(errors,[]);console.log('PASS real Chrome WebGL UI: harvest -> HUD/food, eat -> HUD, reharvest -> saved reload, bag fits six viewport sizes; no page errors');await b.close();})().catch(e=>{console.error(e);process.exit(1)});

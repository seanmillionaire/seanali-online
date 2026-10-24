const { chromium } = require('playwright');
const fs=require('node:fs'); const path=require('node:path'); const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
// Isolated control contract test using the complete production CSS cascade and
// the actual input module. This is not an integrated game/performance test.
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
 const results=[];
 for(const [width,height,touch] of [[320,568,true],[390,844,true],[844,390,true],[768,1024,true],[1024,768,true],[1366,768,false]]){
  for(const legacyViewport of [false,true]){
   const context=await browser.newContext({viewport:{width,height},hasTouch:touch});const page=await context.newPage();
   const css=['style.css','mobile-play.css','expedition.css'].map(f=>fs.readFileSync(path.join(root,'games/adventure',f),'utf8')).join('\n');
   // Model a browser that rejects small/dynamic viewport unit declarations.
   const supportedCss=legacyViewport?css.replace(/[^{};]+:[^{};]*(?:svh|dvh|svw|dvw)[^{};]*(?=[;}])/g,''):css;
   await page.setContent(`<style>${supportedCss}</style><body data-scene="explore"><main class="explore-world phone-interface explore-ready"><canvas class="explore-canvas"></canvas><div class="explore-stick"><span class="stick-knob">🕹️</span></div><div class="world-arrows"><button class="movement-speed">Walk</button></div><div class="explore-actions"><button class="picture-button world-jump">Jump</button></div><section class="explore-panel" hidden></section></main></body>`);
   const js=fs.readFileSync(path.join(root,'games/adventure/touch-joystick.js'),'utf8').replaceAll('export function','function');
   await page.addScriptTag({content:js+`;window.stick=createTouchJoystick({pad:document.querySelector('.explore-stick'),knob:document.querySelector('.stick-knob')});`});
   const layout=await page.evaluate(()=>Object.fromEntries(['.explore-world','.explore-stick','.world-jump','.movement-speed'].map(sel=>{const el=document.querySelector(sel),r=el.getBoundingClientRect(),s=getComputedStyle(el);return [sel,{x:r.x,y:r.y,w:r.width,h:r.height,display:s.display,visibility:s.visibility,hit:!!document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest(sel)}]})));
   const control=layout['.explore-stick'];
   const visible=control.w>=44&&control.h>=44&&control.y>=0&&control.y+control.h<=height&&control.visibility==='visible'&&control.hit;
   const record={width,height,touch,legacyViewport,visible,layout};results.push(record);
   if(process.env.BASELINE!=='1'){assert.ok(visible,JSON.stringify(record));for(const sel of ['.world-jump','.movement-speed']){const c=layout[sel];assert.ok(c.w>=44&&c.h>=44&&c.x>=0&&c.y>=0&&c.x+c.w<=width&&c.y+c.h<=height&&c.visibility==='visible'&&c.hit,sel+JSON.stringify(record));}}
   if(visible){const x=control.x+control.w/2,y=control.y+control.h/2;const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+60,y}]});const vector=await page.evaluate(()=>window.stick.read(.2));assert.ok(vector.x>.9&&Math.abs(vector.z)<.01);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert.deepEqual(await page.evaluate(()=>window.stick.read(.2)),{x:0,z:0});
    await page.locator('.explore-panel').evaluate(el=>el.hidden=false);assert.equal(await page.locator('.explore-stick').evaluate(el=>getComputedStyle(el).visibility),'hidden');await page.locator('.explore-panel').evaluate(el=>el.hidden=true);assert.equal(await page.locator('.explore-stick').evaluate(el=>getComputedStyle(el).visibility),'visible');
   }
   await context.close();
  }
 }
 console.log(JSON.stringify(results,null,2));await browser.close();
})();

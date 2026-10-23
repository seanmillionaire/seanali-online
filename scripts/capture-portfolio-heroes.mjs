/** Capture real desktop hero screenshots from the public portfolio websites. */
import { chromium } from 'playwright';
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
const sites = [
  ['angelique-ali','https://angeliqueali.com/'],
  ['kimberly-ali','https://kimberlyali.es/'],
  ['sean-ali','https://seanali.online/'],
  ['hypnotic-meditations','https://hypnoticmeditations.ai/'],
  ['manifestation-genie','https://manifestationgenie.ai/'],
  ['try-the-script','https://trythescript.com/'],
  ['swap-your-9-to-5','https://swapyour9to5.com/'],
  ['panama-untold','https://panamauntold.com/'],
  ['sean-ali-games','https://seanali.online/games/'],
];
const output = path.resolve('assets/portfolio');
await mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true,channel:'chrome',args:['--disable-dev-shm-usage']});
const context = await browser.newContext({viewport:{width:1440,height:900},deviceScaleFactor:1,locale:'en-US',reducedMotion:'reduce'});
let success=0;
try {
  for (const [name,url] of sites) {
    const page=await context.newPage();
    try {
      const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:35000});
      if (!response || response.status() >= 400) throw new Error('HTTP '+(response ? response.status() : 'no response'));
      await page.waitForTimeout(2700);
      await page.evaluate(async()=>{if(document.fonts)await Promise.race([document.fonts.ready,new Promise(ok=>setTimeout(ok,1800))]);scrollTo(0,0)});
      const destination=path.join(output,name+'.jpg');
      await page.screenshot({path:destination,type:'jpeg',quality:86,animations:'disabled',clip:{x:0,y:0,width:1440,height:900},timeout:20000});
      if ((await stat(destination)).size<2500) throw new Error('Screenshot too small');
      success++;
      console.log('Captured '+name+' from '+page.url());
    } catch(error) {
      console.error('Capture unavailable for '+name+': '+String(error.message || error));
    } finally {await page.close()}
  }
} finally {await browser.close()}
console.log('Saved '+success+'/'+sites.length+' real website screenshots');
if(success===0)process.exitCode=1;

const {JSDOM}=require('jsdom'),fs=require('node:fs'),assert=require('node:assert/strict');
const source=['explore-state.js','explore.js'].map(f=>fs.readFileSync(`${__dirname}/../games/adventure/${f}`,'utf8').replace(/^import .*;\n/gm,'').replace(/\bexport /g,'')).join('\n');
async function boot(failures=0){
 const dom=new JSDOM('<main></main>',{runScripts:'outside-only'}),w=dom.window;let builds=0,freed=0,resumes=0,loads=0,options=[];
 // No WebGL2 constructor check: actual renderer creation determines support.
 w.setTimeout=(fn,ms)=>setTimeout(fn,ms?1:0);w.clearTimeout=clearTimeout;
 w.buildIsland=(T,canvas,motion,setup,opts)=>{builds++;options.push(opts);if(builds<=failures)throw Error('GPU allocation failed');return {dispose(){freed++;},resume(){resumes++;}};};
 w.eval(source+'\nwindow.createExplore=createExplore');const state={lang:'en',world:{x:5,z:3,flowers:4}};
 const game=w.createExplore(w.document.querySelector('main'),{state,save(){},joy:{gesture(){}},motion:()=>true,load:()=>{loads++;return Promise.resolve({});},openBook(){},openHome(){}});
 const settle=()=>new Promise(r=>setTimeout(r,30));await settle();
 return {w,game,state,settle,get builds(){return builds},get freed(){return freed},get resumes(){return resumes},options,close(){game.dispose();w.close();}};
}
(async()=>{
 let c=await boot(1);assert.equal(c.builds,2);assert(c.options[1].light);assert(c.w.document.querySelector('.explore-ready'));assert.equal(c.state.world.flowers,4);c.close();
 c=await boot();let canvas=c.w.document.querySelector('canvas');canvas.dispatchEvent(new c.w.Event('webglcontextlost',{cancelable:true}));assert(canvas.isConnected,'retain canvas for native restoration');canvas.dispatchEvent(new c.w.Event('webglcontextrestored'));await c.settle();assert.equal(c.builds,1);assert.equal(c.resumes,1);assert.equal(c.freed,0);c.close();
 c=await boot();canvas=c.w.document.querySelector('canvas');canvas.dispatchEvent(new c.w.Event('webglcontextlost',{cancelable:true}));await c.settle();assert.equal(c.builds,2);assert.notEqual(canvas,c.w.document.querySelector('canvas'));assert(c.options[1].light);assert.equal(c.freed,1);c.close();
 c=await boot(2);assert(c.w.document.querySelector('.explore-fallback'));const retry=[...c.w.document.querySelectorAll('button')].find(b=>b.textContent==='Reopen the island');assert(!retry.hidden);retry.click();await c.settle();assert(c.w.document.querySelector('.explore-ready'));assert(retry.hidden);c.close();
 c=await boot();canvas=c.w.document.querySelector('canvas');canvas.dispatchEvent(new c.w.Event('webglcontextlost',{cancelable:true}));c.game.dispose();await c.settle();assert.equal(c.builds,1,'navigation cancels recovery');c.close();
 console.log('PASS GPU initialization retry, native context restoration, timed lightweight recovery, manual retry, saved progress, cancellation.');
})().catch(e=>{console.error(e);process.exitCode=1;});

const {JSDOM}=require('jsdom'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.resolve(__dirname,'../games/adventure/entrance.js'),'utf8').replace(/\bexport /g,'');
function setup(){const dom=new JSDOM('<main></main>',{runScripts:'outside-only'});dom.window.eval(source+'\nwindow.createEntrance=createEntrance;');return dom;}
(async()=>{
 let dom=setup(),w=dom.window,host=w.document.querySelector('main'),calls=0,loaded=false;
 let entrance=w.createEntrance(host,{motion:()=>true,load:()=>{loaded=true;return Promise.resolve({});}});
 assert(host.classList.contains('world-fallback'));assert(!host.querySelector('canvas'));assert(!loaded,'unsupported browser must not download 3D library');entrance.flyIn(()=>calls++);assert.equal(calls,1);entrance.skip();assert.equal(calls,1);entrance.dispose();entrance.flyIn(()=>calls++);assert.equal(calls,1);dom.window.close();
 dom=setup();w=dom.window;host=w.document.querySelector('main');w.WebGL2RenderingContext=function(){};
 entrance=w.createEntrance(host,{motion:()=>true,load:()=>Promise.reject(new Error('network unavailable'))});await new Promise(r=>setTimeout(r,0));assert(host.classList.contains('world-fallback'));assert(!host.querySelector('canvas'));let passed=false;entrance.flyIn(()=>passed=true);assert(passed,'failed 3D load must not block entry');entrance.dispose();w.close();
 dom=setup();w=dom.window;host=w.document.querySelector('main');w.WebGL2RenderingContext=function(){};let resolve;const load=new Promise(r=>resolve=r);entrance=w.createEntrance(host,{motion:()=>true,load:()=>load});entrance.dispose();resolve({});await new Promise(r=>setTimeout(r,0));assert(!host.querySelector('canvas'));assert(!host.classList.contains('world-ready'));w.close();
 console.log('PASS: no-WebGL fallback without download, failed-load recovery, entry callback exactly once, skip safety, disposed async load cancellation.');
})().catch(e=>{console.error(e);process.exitCode=1;});

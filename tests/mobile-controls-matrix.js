import {createTouchJoystick} from '../games/adventure/touch-joystick.js';
const results=[],table=document.querySelector('#results'),progress=document.querySelector('#progress');
const sizes=[[320,568],[390,844],[844,390],[768,1024],[1024,768],[1366,768]];
const legacy=css=>css.replace(/[^{};]+:[^{};]*(?:svh|dvh|svw|dvw)[^{};]*(?=[;}])/g,'');
const original=css=>css.replace('.explore-world{height:100vh;height:100svh;height:var(--phone-vh,100vh);width:100%;','.explore-world{height:100svh;width:100%;');
let lastFrame;
function metric(doc,selector){const el=doc.querySelector(selector),r=el.getBoundingClientRect(),s=doc.defaultView.getComputedStyle(el);return {x:r.x,y:r.y,width:r.width,height:r.height,display:s.display,visibility:s.visibility,hit:!!doc.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest(selector)};}
async function fixture(css,width,height,kind){
 lastFrame?.remove();const frame=document.createElement('iframe');lastFrame=frame;frame.id='fixture';frame.width=width;frame.height=height;frame.title=kind+' '+width+'×'+height;
 const loaded=new Promise(resolve=>frame.addEventListener('load',resolve,{once:true}));
 frame.srcdoc=`<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css.replaceAll('</style','<\\/style')}</style><body data-scene="explore"><main class="explore-world phone-interface explore-ready"><canvas class="explore-canvas"></canvas><div class="explore-stick"><span class="stick-knob">🕹️</span></div><div class="world-arrows"><button class="movement-speed">Walk</button></div><div class="explore-actions"><button class="picture-button world-jump"><span class="button-picture">⤴</span><span class="button-caption">Jump</span></button></div><section class="explore-panel" hidden><h2>Phone panel</h2></section></main></body></html>`;
 document.body.append(frame);await loaded;await new Promise(resolve=>frame.contentWindow.requestAnimationFrame(()=>resolve()));
 const doc=frame.contentDocument,win=frame.contentWindow,pad=doc.querySelector('.explore-stick'),panel=doc.querySelector('.explore-panel');
 const selectors=['.explore-world','.explore-stick','.world-jump','.movement-speed'],layout=Object.fromEntries(selectors.map(sel=>[sel,metric(doc,sel)]));
 const onScreen=c=>c.width>=44&&c.height>=44&&c.x>=0&&c.y>=0&&c.x+c.width<=width+.5&&c.y+c.height<=height+.5&&c.visibility==='visible'&&c.hit;
 const visible=selectors.slice(1).every(sel=>onScreen(layout[sel])),checks={};
 const joystick=createTouchJoystick({pad,knob:doc.querySelector('.stick-knob'),eventTarget:win,enabled:()=>panel.hidden});
 const r=pad.getBoundingClientRect(),x=r.x+r.width/2,y=r.y+r.height/2;
 const fire=(target,type,extra={})=>target.dispatchEvent(new win.PointerEvent(type,{pointerId:11,pointerType:'touch',button:0,buttons:1,clientX:x,clientY:y,bubbles:true,cancelable:true,...extra}));
 fire(pad,'pointerdown');fire(win,'pointermove',{clientX:x+65});const vector=joystick.read(.2);checks.syntheticDrag=vector.x>.9&&Math.abs(vector.z)<.01;
 fire(win,'pointerup',{pointerId:12});checks.secondFingerPreserves=joystick.read(.2).x>.9;
 fire(win,'pointerup');const released=joystick.read(.2);checks.releaseStops=released.x===0&&released.z===0;
 fire(pad,'pointerdown');fire(win,'pointermove',{clientX:x+65});panel.hidden=false;const paused=joystick.read(.2);checks.panelDisablesInput=paused.x===0&&paused.z===0;
 checks.panelVisibility=win.getComputedStyle(pad).visibility;checks.smallViewportPanelHides=width>780||checks.panelVisibility==='hidden';
 panel.hidden=true;checks.panelCloseRestores=win.getComputedStyle(pad).visibility==='visible';joystick.dispose();
 return {kind,width,height,coarsePointer:win.matchMedia('(pointer:coarse)').matches,visible,layout,checks,pass:visible&&Object.values(checks).filter(v=>typeof v==='boolean').every(Boolean)};
}
try{
 const css=(await Promise.all(['style.css','mobile-play.css','expedition.css'].map(async name=>{const r=await fetch('../games/adventure/'+name,{cache:'no-store'});if(!r.ok)throw Error('CSS unavailable: '+name);return r.text();}))).join('\n');
 for(const [width,height]of sizes){
  progress.textContent='Testing '+width+' × '+height+'…';
  const before=await fixture(legacy(original(css)),width,height,'Original legacy-unit model');
  const fixed=await fixture(legacy(css),width,height,'Fixed legacy-unit model');
  const current=await fixture(css,width,height,'Current production cascade');
  const baselineReproduced=before.layout['.explore-world'].height===0&&!before.visible;
  const record={width,height,baselineReproduced,before,fixed,current,pass:baselineReproduced&&fixed.pass&&current.pass};results.push(record);
  const row=table.insertRow();for(const [value,ok]of [[`${width} × ${height}`,true],[current.pass?'PASS':'FAIL',current.pass],[fixed.pass?'PASS':'FAIL',fixed.pass],[`${before.layout['.explore-world'].height}px (expected 0)`,baselineReproduced],[`${fixed.layout['.explore-world'].height}px`,fixed.pass],[Object.values(current.checks).filter(v=>typeof v==='boolean').every(Boolean)?'PASS (synthetic)':'FAIL',current.pass]]){const cell=row.insertCell();cell.textContent=value;cell.className=ok?'pass':'fail';}
 }
 const passes=results.filter(r=>r.pass).length;progress.textContent=`${passes}/${sizes.length} viewport cases passed. Synthetic pointer events only; no real-device or 3D claim.`;progress.className=passes===sizes.length?'pass':'fail';
 document.querySelector('#detail').textContent=JSON.stringify(results,null,2);document.documentElement.dataset.testResult=passes===sizes.length?'pass':'fail';window.controlMatrixResults=results;
 lastFrame.hidden=true;const button=document.querySelector('#preview');button.hidden=false;button.onclick=()=>{lastFrame.hidden=false;lastFrame.style.cssText='position:relative;opacity:1;pointer-events:auto;z-index:0;border:2px solid #365;max-width:none';lastFrame.scrollIntoView();};
}catch(error){if(lastFrame)lastFrame.hidden=true;progress.textContent='TEST ERROR: '+error.message;progress.className='fail';document.documentElement.dataset.testResult='error';document.querySelector('#detail').textContent=error.stack;}

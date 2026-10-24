import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../games/adventure/touch-joystick.js',import.meta.url),'utf8');
const {createTouchJoystick,joystickVector}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
class Events {handlers=new Map(); addEventListener(k,f){this.handlers.set(k,f)} removeEventListener(k){this.handlers.delete(k)} fire(k,e={}){this.handlers.get(k)?.({preventDefault(){},stopPropagation(){},button:0,pointerId:1,pointerType:'touch',clientX:50,clientY:50,...e})}}
const pad=new Events(),events=new Events(),knob={style:{}};let enabled=true,started=0;
pad.classList={add(){},remove(){}};pad.getBoundingClientRect=()=>({width:104,height:104});let capture=null;pad.setPointerCapture=id=>capture=id;pad.hasPointerCapture=id=>capture===id;pad.releasePointerCapture=()=>capture=null;
const stick=createTouchJoystick({pad,knob,eventTarget:events,enabled:()=>enabled,onStart:()=>started++});
assert.deepEqual(joystickVector(0,0,40),{x:0,z:0});pad.fire('pointerdown');assert.equal(started,1);
events.fire('pointermove',{clientX:140});let v=stick.read(.2);assert.ok(v.x>.9&&v.z===0);
// Another finger can tap an action without dropping the active steering finger.
events.fire('pointerup',{pointerId:2});assert.ok(stick.read(.2).x>.9);
events.fire('pointercancel');assert.deepEqual(stick.read(.2),{x:0,z:0});assert.equal(capture,null);
pad.fire('pointerdown');events.fire('pointermove',{clientY:160});assert.ok(stick.read(.2).z>.9);enabled=false;assert.deepEqual(stick.read(.2),{x:0,z:0});enabled=true;
pad.fire('pointerdown');events.fire('pointermove',{clientX:160});stick.reset();assert.deepEqual(stick.read(.2),{x:0,z:0});
stick.dispose();assert.equal(pad.handlers.size,0);assert.equal(events.handlers.size,0);
console.log('PASS: joystick saturation, cardinal input, independent second finger, cancel, pause/reset and listener cleanup');

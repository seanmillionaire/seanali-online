import assert from 'node:assert/strict';
import {createTouchJoystick,joystickVector} from '../games/adventure/touch-joystick.js';
const windowEvents=new EventTarget(),pad=new EventTarget(),held=new Set();let allowed=true,starts=0,releases=0;
pad.style={};pad.classList={add:n=>held.add(n),remove:n=>held.delete(n)};pad.getBoundingClientRect=()=>({width:120,height:120});pad.setPointerCapture=()=>{throw Error('tablet capture unavailable');};pad.hasPointerCapture=()=>false;pad.releasePointerCapture=()=>releases++;
const knob={style:{}},control=createTouchJoystick({pad,knob,eventTarget:windowEvents,enabled:()=>allowed,onStart:()=>starts++});
const event=(type,extra={})=>Object.assign(new Event(type,{cancelable:true}),{pointerId:1,pointerType:'touch',button:0,buttons:1,clientX:100,clientY:600,...extra});
pad.dispatchEvent(event('pointerdown'));assert.equal(starts,1);assert.deepEqual(control.read(.1),{x:0,z:0},'landing off center does not accidentally move');
windowEvents.dispatchEvent(event('pointermove',{clientX:-300,clientY:600}));let p;for(let i=0;i<180;i++)p=control.read(1/60);assert(p.x<-.999&&p.z===0,'holding far beyond the circle continues full left');
pad.dispatchEvent(event('lostpointercapture'));windowEvents.dispatchEvent(event('pointermove',{clientX:-200,clientY:606}));assert(control.read(.1).x<-.99,'lost capture does not stop a held finger');
windowEvents.dispatchEvent(event('pointerup',{pointerId:2}));assert(control.read(.1).x<-.99,'second finger releasing does not stop steering');
windowEvents.dispatchEvent(event('pointermove',{clientX:150,clientY:550}));for(let i=0;i<15;i++)p=control.read(1/60);assert(p.x>.5&&p.z<-.5,'diagonal turns remain available');
windowEvents.dispatchEvent(event('pointerup'));assert.deepEqual(control.read(.016),{x:0,z:0},'release stops immediately');assert.equal(knob.style.transform,'');assert(!held.size);
for(const type of ['pointercancel','disabled','reset']){pad.dispatchEvent(event('pointerdown'));windowEvents.dispatchEvent(event('pointermove',{clientX:200}));control.read(.1);if(type==='pointercancel')windowEvents.dispatchEvent(event(type));else if(type==='disabled')allowed=false;else control.reset();assert.deepEqual(control.read(.1),{x:0,z:0});allowed=true;}
assert.deepEqual(joystickVector(2,1,48),{x:0,z:0});assert.equal(joystickVector(48,4,48).z,0,'small thumb wobble keeps straight travel');assert(Math.abs(joystickVector(48,48,48).x-Math.SQRT1_2)<1e-9);
control.dispose();pad.dispatchEvent(event('pointerdown'));assert.deepEqual(control.read(.1),{x:0,z:0},'disposed listeners cannot restart movement');
console.log('PASS continuous out-of-ring tracking, capture failure/loss, diagonal turns, cardinal guide, dead zone, second finger, immediate release/cancel/reset/pause and disposal');

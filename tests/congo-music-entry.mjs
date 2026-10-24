import assert from 'node:assert/strict';
import {createSoundtrack,REGIONAL_PLAYLISTS} from '../games/adventure/soundtrack.js';
globalThis.document={hidden:false};
const storage=new Map();globalThis.sessionStorage={getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)};
const node=()=>({gain:{value:0,setTargetAtTime(){}},connect(n){return n;},disconnect(){}});
const context={currentTime:0,createGain:node,createMediaElementSource:node};
let media=[],blocked=false;
class AudioMock{constructor(){this.paused=true;this.currentTime=0;media.push(this);}play(){if(blocked)return Promise.reject(Error('blocked'));this.paused=false;return Promise.resolve();}pause(){this.paused=true;}removeAttribute(){this.src='';}load(){}}
const make=()=>createSoundtrack({enabled:()=>true,volume:()=>1,environment:()=>({context,output:{}}),createAudio:()=>new AudioMock()});
const flush=()=>new Promise(r=>setImmediate(r));
let music=make();music.unlock();await flush();
music.update({x:120,z:-419});await flush();assert.equal(music.status.key,'congo','dance arrival starts immediately without advancing the clock');
const count=media.length;for(let i=0;i<10;i++)music.update({x:120,z:-419});await flush();assert.equal(media.length,count,'standing at the dance does not restart the song');
music.update({x:120,z:-380});music.next();await flush();music.update({x:120,z:-419});await flush();assert.equal(music.status.key,'congo','returning to the gathering restores dance music');music.destroy();
console.log('PASS immediate Congo arrival, no restart while standing, return to dance');

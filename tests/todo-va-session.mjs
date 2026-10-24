import assert from 'node:assert/strict';
import {createSoundtrack,REGIONAL_PLAYLISTS} from '../games/adventure/soundtrack.js';
globalThis.document={hidden:false};
const storage=new Map();globalThis.sessionStorage={getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v)};
const node=()=>({gain:{value:0,setTargetAtTime(){}},connect(n){return n;},disconnect(){}});
const context={currentTime:0,createGain:node,createMediaElementSource:node};
let media=[],blocked=true;
class AudioMock{constructor(){this.paused=true;this.currentTime=0;media.push(this);}play(){if(blocked)return Promise.reject(Error('blocked'));this.paused=false;return Promise.resolve();}pause(){this.paused=true;}removeAttribute(){this.src='';}load(){}}
const make=()=>createSoundtrack({enabled:()=>true,volume:()=>1,environment:()=>({context,output:{}}),createAudio:()=>new AudioMock()});
const flush=()=>new Promise(r=>setImmediate(r));
for(const r of ['city','bocas','west','chiriqui','interior','pacific','home'])assert(!REGIONAL_PLAYLISTS[r].includes('todoVa'));
let music=make();music.focus('colon');await flush();assert.equal(storage.size,0,'failed autoplay does not consume session');blocked=false;music.sync();await flush();assert.equal(music.status.key,'todoVa');assert.equal(storage.size,1);const song=media.at(-1);
music.update('city');await flush();assert(song.paused&&!song.src,'stop immediately outside Colón, without region debounce');assert.notEqual(music.status.key,'todoVa');
music.focus('colon');await flush();assert.notEqual(music.status.key,'todoVa','returning cannot replay');music.destroy();
music=make();music.focus('colon');await flush();assert.notEqual(music.status.key,'todoVa','new controller retains session limit');for(let i=0;i<12;i++){music.next();await flush();assert.notEqual(music.status.key,'todoVa');}music.destroy();
console.log('PASS Colón-only Todo Va, immediate exit stop, autoplay retry, once per session across revisits and controller recreation');

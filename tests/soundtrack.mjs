import assert from 'node:assert/strict';
import {createSoundtrack,musicRegion,TRACKS} from '../games/adventure/soundtrack.js';
let time=0,enabled=true,volume=.6,hidden=false,tick;
globalThis.document={get hidden(){return hidden;}};globalThis.setInterval=f=>(tick=f,1);globalThis.clearInterval=()=>{tick=null;};
const gain=()=>({gain:{value:0,setTargetAtTime(v){assert(v>=0&&v<=1);}},connect(n){return n;},disconnect(){}});
const context={currentTime:0,createGain:gain,createMediaElementSource:gain};const audios=[];
class Media{constructor(){this.paused=true;this.ended=false;this.duration=180;this.currentTime=0;audios.push(this);}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}removeAttribute(){this.src='';}load(){}}
const music=createSoundtrack({enabled:()=>enabled,volume:()=>volume,environment:()=>({context,output:{}}),createAudio:()=>new Media(),now:()=>time});
assert.equal(audios.length,0);music.update('home');music.sync();assert.equal(audios.length,0,'gesture required');music.unlock();music.sync();await Promise.resolve();assert.equal(music.status.players,1,'only one initial stream');assert(music.status.playing);
time=16;music.update('drive');time=19;music.update('drive');await Promise.resolve();assert.equal(music.status.mood,'drive');assert.equal(music.status.players,2);time+=4;tick();assert.equal(music.status.players,1,'old stream released after crossfade');assert.equal(music.status.title,TRACKS.drive.title);
audios.at(-1).currentTime=178;tick();await Promise.resolve();assert.equal(music.status.players,2,'next recording starts before the previous song ends');time+=4;tick();assert.equal(music.status.players,1);

for(let i=0;i<8;i++)music.next();await Promise.resolve();assert(music.status.players<=2,'rapid skips bounded');
enabled=false;music.sync();assert(audios.every(a=>a.paused),'mute pauses every stream');enabled=true;music.sync();assert(music.status.playing);hidden=true;music.sync();assert(audios.every(a=>a.paused));hidden=false;music.sync();volume=0;music.sync();assert(!music.status.playing);volume=.8;music.sync();assert(music.status.playing);
assert.equal(musicRegion({indoors:true,driving:true}),'home');assert.equal(musicRegion({driving:true}),'drive');assert.equal(musicRegion({boating:true}),'ocean');assert.equal(musicRegion({x:-385}),'adventure');assert.equal(musicRegion({rain:.8}),'adventure');assert.equal(musicRegion({x:350,z:-60}),'city');assert.equal(musicRegion({night:true}),'night');music.destroy();assert(audios.every(a=>a.paused));assert.equal(tick,null);console.log('PASS seven-track soundtrack: gesture, adaptive moods, stable transitions, bounded crossfade/skip, independent music mute, hidden-tab silence and disposal');

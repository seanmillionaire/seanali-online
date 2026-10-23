import assert from 'node:assert/strict';
import {createSoundtrack,musicRegion,TRACKS,REGIONAL_PLAYLISTS} from '../games/adventure/soundtrack.js';
let time=0,enabled=true,volume=.6,hidden=false,tick;
globalThis.document={get hidden(){return hidden;}};globalThis.setInterval=f=>(tick=f,1);globalThis.clearInterval=()=>{tick=null;};
const gain=()=>({gain:{value:0,setTargetAtTime(v){assert(v>=0&&v<=1);}},connect(n){return n;},disconnect(){}});
const context={currentTime:0,createGain:gain,createMediaElementSource:gain};const audios=[];
class Media{constructor(){this.paused=true;this.ended=false;this.duration=180;this.currentTime=0;audios.push(this);}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}removeAttribute(){this.src='';}load(){}}
const music=createSoundtrack({enabled:()=>enabled,volume:()=>volume,environment:()=>({context,output:{}}),createAudio:()=>new Media(),now:()=>time});
assert.equal(audios.length,0);music.update('home');music.sync();assert.equal(audios.length,0,'gesture required');music.unlock();music.sync();await Promise.resolve();assert.equal(music.status.players,1,'only one initial stream');assert(music.status.playing);
time=16;music.update('drive');time=19;music.update('drive');assert.equal(music.status.mood,'west','brief boundary crossing does not change playlist');time=28;music.update('drive');await Promise.resolve();assert.equal(music.status.mood,'drive');assert.equal(music.status.players,1,'region changes must not interrupt the current song');assert.equal(music.status.title,TRACKS.cumbia.title);
audios.at(-1).currentTime=178;tick();await Promise.resolve();assert.equal(music.status.players,2,'next recording starts before the previous song ends');time+=4;tick();assert.equal(music.status.players,1);

// Colón selects the supplied song at a natural boundary, without restarting it on every update.
const beforeColon=music.status.title;
time=40;music.update({x:-50,z:-365});time=51;music.update({x:-50,z:-365});
assert.equal(music.status.mood,'colon');assert.equal(music.status.title,beforeColon,'Colón entry preserves the current song');
audios.at(-1).currentTime=178;tick();await Promise.resolve();
assert.equal(music.status.title,'Todo Va');assert(audios.at(-1).src.endsWith('/music/todo-va.mp3'));assert.equal(music.status.players,2);
time=55;tick();assert.equal(music.status.players,1);const colonAudio=audios.at(-1);
for(time=56;time<70;time++)music.update({x:-50,z:-365});
assert.equal(audios.at(-1),colonAudio,'staying in Colón must not restart the song');
colonAudio.currentTime=178;tick();await Promise.resolve();assert.equal(music.status.title,TRACKS.reggae.title,'Colón keeps its existing music in the mix');
time+=4;tick();
for(const region of ['city','west','bocas'])assert(REGIONAL_PLAYLISTS[region].includes('todoVa'));

for(let i=0;i<8;i++)music.next();await Promise.resolve();assert(music.status.players<=2,'rapid skips bounded');
enabled=false;music.sync();assert(audios.every(a=>a.paused),'mute pauses every stream');enabled=true;music.sync();assert(music.status.playing);hidden=true;music.sync();assert(audios.every(a=>a.paused));hidden=false;music.sync();volume=0;music.sync();assert(!music.status.playing);volume=.8;music.sync();assert(music.status.playing);
for(const [point,region] of [[{x:350,z:-60},'city'],[{x:-50,z:-365},'colon'],[{x:-230,z:-200},'bocas'],[{x:-385,z:-30},'chiriqui'],[{x:-200,z:260},'interior'],[{x:350,z:-425},'guna'],[{x:560,z:143},'pacific'],[{x:0,z:0},'west']]){
 for(const activity of [{},{driving:true},{boating:true},{flying:true},{night:true},{rain:.9}])assert.equal(musicRegion({...point,...activity}),region);
 assert.equal(musicRegion({...point,indoors:true}),'home');
}
music.hold(true);music.next();assert(audios.every(a=>a.paused),'queued region skip does not interrupt a theme');music.hold(false);await Promise.resolve();assert(music.status.playing,'queued region skip starts after theme');music.destroy();assert(audios.every(a=>a.paused));assert.equal(tick,null);console.log('PASS regional soundtrack: gesture, adaptive moods, stable transitions, bounded crossfade/skip, independent music mute, hidden-tab silence and disposal');
// Fruta Tropical needs real instrumental listening, across region changes and manual skips.
time=0;enabled=true;volume=.6;hidden=false;
const late=createSoundtrack({enabled:()=>enabled,volume:()=>volume,environment:()=>({context,output:{}}),createAudio:()=>new Media(),now:()=>time});
late.unlock();await Promise.resolve();late.update('home');time=12;late.update('home');
for(let i=0;i<12;i++){late.next();await Promise.resolve();assert.notEqual(late.status.title,'Fruta Tropical','skipping cannot bypass instrumental warm-up');time+=4;tick();}
for(let i=0;i<121;i++){audios.at(-1).currentTime+=1;time++;tick();}
assert(late.status.instrumentalSeconds>=120);
for(let i=0;i<3&&late.status.title!=='Fruta Tropical';i++){late.next();await Promise.resolve();time+=4;tick();}
assert.equal(late.status.title,'Fruta Tropical');assert(audios.at(-1).src.endsWith('/fruta-tropical.mp3'));
late.destroy();console.log('PASS Fruta Tropical follows at least two minutes of audible instrumentals; skips cannot unlock it early');
// Congo is a dedicated regional transition and explicit dance selection; no competing player.
time=0;const costa=createSoundtrack({enabled:()=>true,volume:()=>.6,environment:()=>({context,output:{}}),createAudio:()=>new Media(),now:()=>time});costa.unlock();await Promise.resolve();costa.update({x:120,z:-419});time=11;costa.update({x:120,z:-419});await Promise.resolve();assert.equal(costa.status.key,'congo');assert.equal(costa.status.mood,'costa');time+=4;tick();assert.equal(costa.status.players,1);const recording=audios.at(-1);costa.focus('costa');await Promise.resolve();assert.equal(audios.at(-1),recording,'joining never restarts a playing Congo song');costa.hold(true);costa.focus('city');assert(!costa.status.playing,'morning priority still holds region');costa.hold(false);await Promise.resolve();assert.equal(costa.status.key,'salsa');costa.destroy();console.log('PASS Costa dedicated crossfade, join without restart and morning priority');
// A visit has one Congo opener, then the owner's instrumental and Todo Va.
time=0;const visit=createSoundtrack({enabled:()=>true,volume:()=>.6,environment:()=>({context,output:{}}),createAudio:()=>new Media(),now:()=>time});
visit.focus('costa');await Promise.resolve();assert.equal(visit.status.key,'congo');
for(const key of ['theme','todoVa','reggae','salsa','reggae','reggae']){time+=4;tick();visit.next();await Promise.resolve();assert.equal(visit.status.key,key);visit.focus('costa');await Promise.resolve();assert.equal(visit.status.key,key,'dance join cannot replay opener');}
visit.update('colon');time+=11;visit.update('colon');await Promise.resolve();visit.update('costa');time+=11;visit.update('costa');await Promise.resolve();assert.equal(visit.status.key,'congo','new visit earns a new opener');visit.destroy();
console.log('PASS once-per-visit Congo, theme, Todo Va, continuing regional rotation and return visit');
time=0;const boundary=createSoundtrack({enabled:()=>true,volume:()=>.6,environment:()=>({context,output:{}}),createAudio:()=>new Media(),now:()=>time});boundary.focus('costa');await Promise.resolve();const leaving=audios.at(-1);time=4;tick();boundary.update({x:-50,z:-365});assert.equal(boundary.status.mood,'colon','leaving Costa has no ten-second delay');await Promise.resolve();assert.equal(boundary.status.key,'todoVa');time+=.7;tick();assert(leaving.paused&&!leaving.src,'Congo released within 0.7 seconds');boundary.destroy();console.log('PASS immediate regional exit and short independent Congo fade');

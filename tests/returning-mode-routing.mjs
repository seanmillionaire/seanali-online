import assert from 'node:assert/strict';
import {routeMode,loadGameMode,modeSaveKey,STORY_SAVE_KEY} from '../games/adventure/game-mode.js';
import {fresh,SAVE_KEY} from '../games/adventure/state.js';
import {ADMIN_ACTIVE_KEY,ADMIN_SAVE_KEY} from '../games/adventure/phone-admin.js';
for(const path of ['/games/','/games/panama/','/games/panama','/games/panama/index.html'])assert.equal(routeMode(path,'?mode=admin'),'live','regular path must not silently become admin');
for(const mode of ['story','admin'])for(const suffix of ['','/','/index.html'])assert.equal(routeMode('/games/panama/'+mode+suffix,'?mode=admin'),mode,'explicit page owns its mode');
const normal=fresh();Object.assign(normal,{started:true,cityChapter:null,playerName:'Returning'});Object.assign(normal.world,{x:42,z:-21,flight:0});normal.world.panama.pantry.plantain=9;
const admin=structuredClone(normal);Object.assign(admin,{adminMode:true,gameMode:'admin'});Object.assign(admin.world,{adminMode:true,flight:110});admin.world.panama.pantry.plantain=17;
const story=fresh();story.cityChapter.step=2;story.cityChapter.started=true;story.world.panama.pantry.plantain=3;
const data=new Map([[SAVE_KEY,JSON.stringify(normal)],[ADMIN_SAVE_KEY,JSON.stringify(admin)],[STORY_SAVE_KEY,JSON.stringify(story)],[ADMIN_ACTIVE_KEY,'1']]);
const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,String(v))};
for(const mode of ['admin','live','story','live','admin','story']){const before=new Map(data),s=loadGameMode(storage,mode);assert.equal(s.adminMode,mode==='admin');assert.equal(s.world.adminMode,mode==='admin');assert.equal(s.world.panama.pantry.plantain,{live:9,admin:17,story:3}[mode]);if(mode==='live'){assert.equal(s.world.x,42);assert.equal(s.world.z,-21);assert.equal(s.world.flight,0);}if(mode==='story')assert.equal(s.cityChapter.step,2);storage.setItem(modeSaveKey(mode),JSON.stringify(s));for(const other of ['live','story','admin'])if(other!==mode)assert.equal(data.get(modeSaveKey(other)),before.get(modeSaveKey(other)),'inactive save remains byte-identical');}
assert.equal(data.get(ADMIN_ACTIVE_KEY),'1','legacy flag need not be erased to isolate paths');
console.log('PASS canonical paths override stale query, HTML aliases, returning admin/live/story transitions and byte-identical inactive saves');

// A legacy flag in the live payload never grants admin authority, and saved travel is preserved.
const airborne=JSON.parse(data.get(SAVE_KEY));airborne.adminMode=true;airborne.world.adminMode=true;airborne.world.flight=110;storage.setItem(SAVE_KEY,JSON.stringify(airborne));const repaired=loadGameMode(storage,'live');assert.equal(repaired.adminMode,false);assert.equal(repaired.world.adminMode,false);assert.equal(repaired.world.flight,110);assert.equal(repaired.world.panama.pantry.plantain,9);assert.equal(repaired.world.x,42);
console.log('PASS stale admin flags cleared in loaded live state without erasing saved flight, position or inventory');

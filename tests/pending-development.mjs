import assert from 'node:assert/strict';
import {arrivalSequence} from '../games/adventure/arrival-sequence.js';
import {writeProtectedSave,readProtectedSave} from '../games/adventure/save-protection.js';
import {FESTIVAL_CHAPTERS,turnInCampaign} from '../games/adventure/campaign-state.js';
import {DESTINATIONS} from '../games/adventure/geography.js';
import {fresh} from '../games/adventure/state.js';
for(const ch of FESTIVAL_CHAPTERS){const p=DESTINATIONS[ch.project||'home'].at;assert(Math.hypot(ch.home.x-p[0],ch.home.z-p[1])<35,ch.id);const state=fresh();state.world.campaign={chapter:FESTIVAL_CHAPTERS.indexOf(ch),started:true,accepted:true};const snap={chapter:ch,index:state.world.campaign.chapter,ready:true};Object.assign(state.world,ch.home);assert(turnInCampaign(state,snap));assert(!turnInCampaign(state,snap));}
assert(!arrivalSequence({elapsed:20,story:true,motion:true,audio:{kind:'morning',playing:true}}).done);
for(const x of [{elapsed:20,heard:true},{elapsed:8,audio:{error:'failed'}},{elapsed:300,audio:{kind:'morning',playing:true}}])assert(arrivalSequence({story:true,motion:true,...x}).done);
assert(arrivalSequence({elapsed:.1,story:false,motion:false}).done);
const m=new Map(),storage={getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,v)},a={world:{coins:9}},b={world:{coins:12}};
writeProtectedSave(storage,'story',a);writeProtectedSave(storage,'story',b);m.set('story','corrupt');assert.deepEqual(readProtectedSave(storage,'story'),a);assert.equal(readProtectedSave(storage,'admin'),null);writeProtectedSave(storage,'story',b);assert.deepEqual(JSON.parse(m.get('story-previous')),a);const before=m.get('story');assert.throws(()=>writeProtectedSave({...storage,setItem(){throw Error('quota')}},'story',a));assert.equal(m.get('story'),before);
console.log('PASS nine hand-ins, bounded arrival, isolated save recovery and quota protection');

m.set('legacy',JSON.stringify({lang:'es',completed:{old:3}}));assert.deepEqual(readProtectedSave(storage,'legacy'),{lang:'es',completed:{old:3}});

import assert from 'node:assert/strict';import vm from 'node:vm';import {readFileSync} from 'node:fs';
let clock=0,config,syncs=0;
const source=readFileSync('games/adventure/delight.js','utf8').replace(/^import .*;\n/gm,'').replace(/\bexport /g,'').replaceAll('import.meta.url',"'https://example.com/delight.js'");
const c=vm.createContext({performance:{now:()=>clock*1000},localStorage:{getItem:()=>null},document:{hidden:false,addEventListener(){},removeEventListener(){}},window:{},clearTimeout(){},setTimeout(){return 1;},createSoundtrack:o=>(config=o,{sync(){syncs++;},update(){},unlock(){},destroy(){},get status(){return {};}}),console});
vm.runInContext(source+'\nthis.joy=createDelight({soundEnabled:()=>true,motionEnabled:()=>true});',c);
c.joy.setScene('welcome');c.joy.welcomeAudio(true);c.joy.gesture();assert(!config.enabled(),'music held during loading and arrival');assert.equal(c.joy.voiceCount,0);
c.joy.setScene('explore');assert(!config.enabled(),'changing the screen must not release music');
clock=20;c.joy.welcomeAudio(false);assert(config.enabled());assert.equal(config.volume(),0,'one quiet second after the zoom');clock=21;assert.equal(config.volume(),0);clock=21.1;const previousSyncs=syncs;c.joy.soundscape({active:false});assert(syncs>previousSyncs,'music starts after the silent delay without another tap');clock=24;assert(Math.abs(config.volume()-.29)<1e-9,'six second music fade');clock=27;assert.equal(config.volume(),.58);assert(syncs>0);
console.log('PASS silent welcome/arrival, no automatic voices, delayed six-second music fade and saved volume target');

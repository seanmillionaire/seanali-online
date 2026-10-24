import {fresh,normalize,SAVE_KEY} from './state.js';
import {ADMIN_SAVE_KEY,dialAdmin} from './phone-admin.js';
import {CITY_START} from './city-chapter-state.js';
export const STORY_SAVE_KEY='isla-adventure-story-v1';
export const STORY_START={x:288,z:-67};
export function routeMode(pathname,search=''){
 const query=new URLSearchParams(search).get('mode');
 if(/\/story\/?$/.test(pathname))return 'story';
 if(/\/admin\/?$/.test(pathname)||query==='admin')return 'admin';
 return 'live';
}
export const modeSaveKey=mode=>mode==='story'?STORY_SAVE_KEY:mode==='admin'?ADMIN_SAVE_KEY:SAVE_KEY;
export function loadGameMode(storage,mode){
 const key=modeSaveKey(mode);let raw=null;try{raw=JSON.parse(storage.getItem(key));}catch{}
 // Explicit routes own their saves. A previous admin session cannot hijack live/story.
 if(mode==='admin'&&!raw){raw=JSON.parse(JSON.stringify(loadGameMode(storage,'live')));raw.adminMode=true;raw.world.adminMode=true;raw.world.sanitation.unlocked=['city','gorgona','colon','chiriqui','east'];storage.setItem(ADMIN_SAVE_KEY,JSON.stringify(raw));}
 const state=normalize(raw);
 state.gameMode=mode;state.adminMode=mode==='admin';state.world.adminMode=state.adminMode;
 if(!raw){state.lang=storage.getItem('seanGameLang')==='en'?'en':'es';}
 if(mode==='story'){
  if(!raw){Object.assign(state.world,STORY_START,{flight:0,dayTime:60});state.cityChapter.arrivalSeen=false;}
 }else{
  // Preserve accidental early story progress before restoring unrestricted live play.
  if(mode==='live'&&raw?.cityChapter&&!storage.getItem(STORY_SAVE_KEY))storage.setItem(STORY_SAVE_KEY,JSON.stringify({...raw,gameMode:'story',adminMode:false}));
  state.cityChapter=null;
 }
 return state;
}

import {quests} from './content.js';
export const SAVE_KEY='isla-adventure-v1';
export function fresh(){return {version:1,started:false,lang:'es',sound:true,motion:true,completed:{},active:null,discovered:[],palette:0,song:Array(24).fill(false),seen:[]};}
export function normalize(raw){const s=fresh();if(!raw||raw.version!==1)return s;s.started=raw.started===true;s.lang=raw.lang==='en'?'en':'es';s.sound=raw.sound!==false;s.motion=raw.motion!==false;s.palette=Number.isInteger(raw.palette)&&raw.palette>=0&&raw.palette<4?raw.palette:0;
 for(const q of quests){const v=raw.completed?.[q.id];if(Number.isInteger(v)&&v>=1&&v<=3)s.completed[q.id]=v;else break;}
 s.discovered=Array.isArray(raw.discovered)?[...new Set(raw.discovered.filter(n=>Number.isInteger(n)&&n>=0&&n<6))]:[];
 s.seen=Array.isArray(raw.seen)?[...new Set(raw.seen.filter(n=>Number.isInteger(n)&&n>=0&&n<6))]:[];
 if(Array.isArray(raw.song)&&raw.song.length===24)s.song=raw.song.map(v=>v===true);
 if(raw.active&&quests.some(q=>q.id===raw.active.id)&&Number.isInteger(raw.active.stage)&&raw.active.stage>=0&&raw.active.stage<3&&quests.findIndex(q=>q.id===raw.active.id)<=Object.keys(s.completed).length)s.active={id:raw.active.id,stage:raw.active.stage,mistakes:Math.max(0,Math.min(99,Number(raw.active.mistakes)||0))};return s;}
export function completedCount(s){return Object.keys(s.completed).length;}
export function lightCount(s){return Math.floor(completedCount(s)/8);}
export function totalStars(s){return Object.values(s.completed).reduce((a,b)=>a+b,0);}
export function unlocked(s,index){return index<=completedCount(s);}
export function award(s,id,mistakes){const rank=Math.max(1,3-Math.floor(mistakes/2));s.completed[id]=Math.max(s.completed[id]||0,rank);s.active=null;return rank;}

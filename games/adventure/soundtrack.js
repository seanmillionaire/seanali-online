import {costaContains,ISLA_GRANDE} from './costa-arriba-layout.js';
// Full-length recordings stream on demand; only two players exist during a crossfade.
export const TRACKS={
 theme:{file:'panama-menu-theme',extension:'mp3',title:'Panamá Aventura · Instrumental'},
 congo:{file:'los-congos-de-panama',extension:'mp3',title:'Los Congos de Panamá'},
 frutaTropical:{file:'fruta-tropical',extension:'mp3',title:'Fruta Tropical'},
 todoVa:{file:'todo-va',extension:'mp3',title:'Todo Va'},
 salsa:{file:'no-frills-salsa',extension:'mp3',title:'No Frills Salsa'},
 reggae:{file:'montego',extension:'mp3',title:'Montego'},
 cumbia:{file:'no-frills-cumbia',extension:'mp3',title:'No Frills Cumbia'},
 city:{file:'beachfront-celebration',title:'Beachfront Celebration'},
 ocean:{file:'chee-zee-beach',title:'Chee Zee Beach'},
 home:{file:'casa-bossa-nova',title:'Casa Bossa Nova'},
 explore:{file:'carefree',title:'Carefree'},
 adventure:{file:'heroic-age',title:'Heroic Age'},
 drive:{file:'rising-tide',title:'Rising Tide'},
 night:{file:'easy-lemon',title:'Easy Lemon'}
};
// Regional identity wins over transport, weather and time of day.
// Game scoring includes licensed instrumentals and owner-supplied songs.
// Colón leads with Todo Va at the next natural song boundary; entering a region never cuts a song short.
export const REGIONAL_PLAYLISTS={
 costa:['congo','theme','todoVa','reggae','salsa','frutaTropical'],
 city:['salsa','todoVa','reggae','frutaTropical'],colon:['todoVa','reggae','salsa','frutaTropical'],bocas:['reggae','todoVa','ocean','city','frutaTropical'],
 west:['cumbia','salsa','todoVa','reggae','frutaTropical'],interior:['cumbia','frutaTropical'],chiriqui:['cumbia','salsa','frutaTropical'],
 guna:['ocean','night','frutaTropical'],pacific:['ocean','city','frutaTropical'],home:['home','night','frutaTropical']
};
export const MUSIC_LABELS={costa:'🥁 Costa Arriba · Congo panameño',city:'🏙️ Panamá · Salsa / reggae',colon:'🚢 Colón · Reggae / salsa',bocas:'🏝️ Bocas · Reggae / island grooves',west:'🏖️ Panamá Oeste · Cumbia / salsa',interior:'🌿 Interior · Cumbia',chiriqui:'🌋 Chiriquí · Cumbia / salsa',guna:'🐚 Guna Yala · Island instrumental',pacific:'⛵ Pacífico · Island instrumental',home:'🏡 Casa · Bossa nova'};
export function musicRegion({indoors=false,x=0,z=0}={}){
 if(indoors)return 'home';
 if(costaContains(x,z))return 'costa';
 if(Math.hypot((x-ISLA_GRANDE.x)/ISLA_GRANDE.rx,(z-ISLA_GRANDE.z)/ISLA_GRANDE.rz)<1.08)return 'colon';
 if(z< -140&&x< -140)return 'bocas';
 if(z< -300&&x>160)return 'guna';
 if(z< -170)return 'colon';
 if(x>285&&x<520&&z>-130&&z<25)return 'city';
 if(x< -260&&z<60)return 'chiriqui';
 if(x< -110)return 'interior';
 if(z>55)return 'pacific';
 return 'west';
}
export function createSoundtrack({enabled,volume,environment,createAudio=()=>new Audio(),now=()=>performance.now()/1000}){
 let held=false,queuedNext=false;let players=[],current=null,mood='west',candidate=mood,candidateAt=0,lastChange=-Infinity,unlocked=false,destroyed=false,duckUntil=0,timer=null,error='',serial=0;
 const rotations={...REGIONAL_PLAYLISTS,explore:['explore','city'],ocean:['ocean','city'],adventure:['adventure','explore'],drive:['drive','city'],night:['night','home']};let costaStep=0;let sequence=0,nightLevel=1,instrumentalSeconds=0;
 // Fruta Tropical follows two minutes of actual instrumental playback, never loading or skipping.
 const vocals=new Set(['todoVa','frutaTropical','congo']);
 function pick(index){const list=rotations[mood];const key=mood==='costa'?(costaStep<3?list[costaStep]:list[3+(costaStep-3)%3]):list[index%list.length];return key==='frutaTropical'&&instrumentalSeconds<120?(mood==='costa'?'reggae':list.find(k=>!vocals.has(k))):key;}
 function nextKey(){if(mood==='costa')costaStep++;return pick(++sequence);}
 function countListening(){if(!current)return;const position=current.audio.currentTime,delta=position-(current.lastPosition??position);if(delta>0&&delta<2&&!current.audio.paused&&!vocals.has(current.key))instrumentalSeconds+=delta;current.lastPosition=position;}
 function release(p){p.audio.pause();p.audio.removeAttribute('src');p.audio.load();p.node.disconnect();p.gain.disconnect();players=players.filter(v=>v!==p);}
 function running(){return !held&&unlocked&&!destroyed&&enabled()&&!document.hidden&&volume()>0;}
 function tick(){countListening();if(!running()){for(const p of players)p.audio.pause();return;}
  if(current&&!current.pending&&Number.isFinite(current.audio.duration)&&current.audio.duration-current.audio.currentTime<3.5&&players.length===1)start(nextKey());
  const t=now(),level=volume()*nightLevel*(t<duckUntil?.24:1)*.65;
  for(const p of [...players]){if(p.exitAt!==undefined){const remaining=Math.max(0,1-(t-p.exitAt)/.6);p.gain.gain.setTargetAtTime(level*remaining,p.context.currentTime,.025);if(!remaining)release(p);continue;}if(p.audio.paused&&!p.audio.ended&&!p.pending)p.audio.play().catch(()=>{});const blend=Math.min(1,Math.max(0,(t-p.fadeAt)/3));p.gain.gain.setTargetAtTime(level*(p===current?blend:1-blend),p.context.currentTime,.08);if(p!==current&&blend===1)release(p);}
 }
 async function start(key){if(!running())return;const env=environment();if(!env)return;const request=++serial;
  // Bound memory and streams even when a child rapidly changes modes.
  for(const p of [...players])if(p!==current&&p.exitAt===undefined)release(p);
  const audio=createAudio();audio.preload='auto';audio.playbackRate=key==='congo'?1.1:1;audio.preservesPitch=true;audio.src=new URL('./assets/audio/music/'+TRACKS[key].file+'.'+(TRACKS[key].extension||'m4a'),import.meta.url).href;
  const gain=env.context.createGain(),node=env.context.createMediaElementSource(audio);gain.gain.value=0;node.connect(gain).connect(env.output);
  const p={audio,gain,node,context:env.context,key,fadeAt:now(),pending:true,lastPosition:0};players.push(p);
  audio.onended=()=>{if(current===p&&running()&&!players.some(v=>v.pending))start(nextKey());};
  audio.onerror=()=>{error='Track unavailable: '+TRACKS[key].title;if(p!==current&&players.includes(p))release(p);};
  try{await audio.play();if(destroyed||request!==serial||!running()){if(players.includes(p))release(p);return;}p.pending=false;const t=now();for(const v of players)v.fadeAt=t;current=p;lastChange=t;error='';tick();}catch{error='Tap music to resume';if(players.includes(p))release(p);}
 }
 function sync(){if(!running()){serial++;for(const p of [...players]){if(p!==current)release(p);else p.audio.pause();}return;}if(!current&&!players.some(p=>p.pending))start(pick(0));else tick();}
 function unlock(){unlocked=true;if(timer===null)timer=setInterval(tick,100);sync();}
 function update(info){if(typeof info==='object')nightLevel=info.night?.72:1;const next=typeof info==='string'?info:musicRegion(info);if(!rotations[next])return;if(next!==candidate){candidate=next;candidateAt=now();}if(mood==='costa'&&next!=='costa'){mood=next;sequence=0;serial++;for(const p of [...players]){if(p.key==='congo'&&!p.pending)p.exitAt=now();else if(p.pending)release(p);}if(current?.key==='congo')current=null;if(held)queuedNext=true;else if(!current)start(pick(0));tick();return;}if(next!==mood&&now()-candidateAt>10){const previous=mood;mood=next;sequence=-1;if(next==='costa')costaStep=0;if(current&&(next==='costa'||previous==='costa')){if(held)queuedNext=true;else{sequence=0;start(pick(0));}}}}
 return {focus(region){if(!rotations[region])return;if(region==='costa'&&mood==='costa'){sync();return;}if(region==='costa')costaStep=0;mood=candidate=region;candidateAt=now();sequence=0;if(current?.key===pick(0))return;if(held){queuedNext=true;sequence=-1;}else if(unlocked)start(pick(0));else unlock();},hold(value){held=!!value;if(!held&&queuedNext){queuedNext=false;start(sequence<0?pick(++sequence):nextKey());}else sync();},unlock,sync,update,duck(seconds=4){duckUntil=now()+seconds;},next(){if(held){queuedNext=true;return;}if(!unlocked)unlock();else start(nextKey());},get status(){return {mood,key:current?.key||'',region:MUSIC_LABELS[mood]||'',title:current?TRACKS[current.key].title:'',playing:!!current&&!current.audio.paused,players:players.length,time:current?.audio.currentTime||0,readyState:current?.audio.readyState||0,instrumentalSeconds,error};},destroy(){destroyed=true;serial++;clearInterval(timer);for(const p of [...players])release(p);current=null;}};
}

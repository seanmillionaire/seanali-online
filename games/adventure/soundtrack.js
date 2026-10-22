// Full-length recordings stream on demand; only two players exist during a crossfade.
export const TRACKS={
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
// Game scoring includes licensed instrumentals and the owner-supplied Todo Va recording.
// Colón leads with Todo Va at the next natural song boundary; entering a region never cuts a song short.
export const REGIONAL_PLAYLISTS={
 city:['salsa','todoVa','reggae'],colon:['todoVa','reggae','salsa'],bocas:['reggae','todoVa','ocean','city'],
 west:['cumbia','salsa','todoVa','reggae'],interior:['cumbia'],chiriqui:['cumbia','salsa'],
 guna:['ocean','night'],pacific:['ocean','city'],home:['home','night']
};
export const MUSIC_LABELS={city:'🏙️ Panamá · Salsa / reggae',colon:'🚢 Colón · Reggae / salsa',bocas:'🏝️ Bocas · Reggae / island grooves',west:'🏖️ Panamá Oeste · Cumbia / salsa',interior:'🌿 Interior · Cumbia',chiriqui:'🌋 Chiriquí · Cumbia / salsa',guna:'🐚 Guna Yala · Island instrumental',pacific:'⛵ Pacífico · Island instrumental',home:'🏡 Casa · Bossa nova'};
export function musicRegion({indoors=false,x=0,z=0}={}){
 if(indoors)return 'home';
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
 const rotations={...REGIONAL_PLAYLISTS,explore:['explore','city'],ocean:['ocean','city'],adventure:['adventure','explore'],drive:['drive','city'],night:['night','home']};let sequence=0,nightLevel=1;
 function release(p){p.audio.pause();p.audio.removeAttribute('src');p.audio.load();p.node.disconnect();p.gain.disconnect();players=players.filter(v=>v!==p);}
 function running(){return !held&&unlocked&&!destroyed&&enabled()&&!document.hidden&&volume()>0;}
 function tick(){if(!running()){for(const p of players)p.audio.pause();return;}
  if(current&&!current.pending&&Number.isFinite(current.audio.duration)&&current.audio.duration-current.audio.currentTime<3.5&&players.length===1)start(rotations[mood][++sequence%rotations[mood].length]);
  const t=now(),level=volume()*nightLevel*(t<duckUntil?.24:1)*.65;
  for(const p of [...players]){if(p.audio.paused&&!p.audio.ended&&!p.pending)p.audio.play().catch(()=>{});const blend=Math.min(1,Math.max(0,(t-p.fadeAt)/3));p.gain.gain.setTargetAtTime(level*(p===current?blend:1-blend),p.context.currentTime,.08);if(p!==current&&blend===1)release(p);}
 }
 async function start(key){if(!running())return;const env=environment();if(!env)return;const request=++serial;
  // Bound memory and streams even when a child rapidly changes modes.
  for(const p of [...players])if(p!==current)release(p);
  const audio=createAudio();audio.preload='auto';audio.src=new URL('./assets/audio/music/'+TRACKS[key].file+'.'+(TRACKS[key].extension||'m4a'),import.meta.url).href;
  const gain=env.context.createGain(),node=env.context.createMediaElementSource(audio);gain.gain.value=0;node.connect(gain).connect(env.output);
  const p={audio,gain,node,context:env.context,key,fadeAt:now(),pending:true};players.push(p);
  audio.onended=()=>{if(current===p&&running()&&!players.some(v=>v.pending))start(rotations[mood][++sequence%rotations[mood].length]);};
  audio.onerror=()=>{error='Track unavailable: '+TRACKS[key].title;if(p!==current&&players.includes(p))release(p);};
  try{await audio.play();if(destroyed||request!==serial||!running()){if(players.includes(p))release(p);return;}p.pending=false;const t=now();for(const v of players)v.fadeAt=t;current=p;lastChange=t;error='';tick();}catch{error='Tap music to resume';if(players.includes(p))release(p);}
 }
 function sync(){if(!running()){serial++;for(const p of [...players]){if(p!==current)release(p);else p.audio.pause();}return;}if(!current&&!players.some(p=>p.pending))start(rotations[mood][0]);else tick();}
 function unlock(){unlocked=true;if(timer===null)timer=setInterval(tick,100);sync();}
 function update(info){if(typeof info==='object')nightLevel=info.night?.72:1;const next=typeof info==='string'?info:musicRegion(info);if(!rotations[next])return;if(next!==candidate){candidate=next;candidateAt=now();}if(next!==mood&&now()-candidateAt>10){mood=next;sequence=-1;}}
 return {hold(value){held=!!value;if(!held&&queuedNext){queuedNext=false;start(rotations[mood][++sequence%rotations[mood].length]);}else sync();},unlock,sync,update,duck(seconds=4){duckUntil=now()+seconds;},next(){if(held){queuedNext=true;return;}if(!unlocked)unlock();else start(rotations[mood][++sequence%rotations[mood].length]);},get status(){return {mood,region:MUSIC_LABELS[mood]||'',title:current?TRACKS[current.key].title:'',playing:!!current&&!current.audio.paused,players:players.length,time:current?.audio.currentTime||0,readyState:current?.audio.readyState||0,error};},destroy(){destroyed=true;serial++;clearInterval(timer);for(const p of [...players])release(p);current=null;}};
}

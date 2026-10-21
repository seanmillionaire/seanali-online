// Full-length recordings stream on demand; only two players exist during a crossfade.
export const TRACKS={
 city:{file:'beachfront-celebration',title:'Beachfront Celebration'},
 ocean:{file:'chee-zee-beach',title:'Chee Zee Beach'},
 home:{file:'casa-bossa-nova',title:'Casa Bossa Nova'},
 explore:{file:'carefree',title:'Carefree'},
 adventure:{file:'heroic-age',title:'Heroic Age'},
 drive:{file:'rising-tide',title:'Rising Tide'},
 night:{file:'easy-lemon',title:'Easy Lemon'}
};
export function musicRegion({indoors=false,driving=false,boating=false,flying=false,x=0,z=0,night=false,rain=0}={}){
 if(indoors)return 'home';if(driving)return 'drive';if(flying||x<-240||rain>.6)return 'adventure';if(boating||z>60||z<-310)return 'ocean';if(night)return 'night';if(x>285&&x<520&&z>-130&&z<25)return 'city';return 'explore';
}
export function createSoundtrack({enabled,volume,environment,createAudio=()=>new Audio(),now=()=>performance.now()/1000}){
 let players=[],current=null,mood='explore',candidate=mood,candidateAt=0,lastChange=-Infinity,unlocked=false,destroyed=false,duckUntil=0,timer=null,error='',serial=0;
 const rotations={city:['city','home'],ocean:['ocean','city'],home:['home','night'],explore:['explore','city'],adventure:['adventure','explore'],drive:['drive','city'],night:['night','home']};let sequence=0;
 function release(p){p.audio.pause();p.audio.removeAttribute('src');p.audio.load();p.node.disconnect();p.gain.disconnect();players=players.filter(v=>v!==p);}
 function running(){return unlocked&&!destroyed&&enabled()&&!document.hidden&&volume()>0;}
 function tick(){if(!running()){for(const p of players)p.audio.pause();return;}
  if(current&&!current.pending&&Number.isFinite(current.audio.duration)&&current.audio.duration-current.audio.currentTime<3.5&&players.length===1)start(rotations[mood][++sequence%2]);
  const t=now(),level=volume()*(t<duckUntil?.24:1)*.65;
  for(const p of [...players]){if(p.audio.paused&&!p.audio.ended&&!p.pending)p.audio.play().catch(()=>{});const blend=Math.min(1,Math.max(0,(t-p.fadeAt)/3));p.gain.gain.setTargetAtTime(level*(p===current?blend:1-blend),p.context.currentTime,.08);if(p!==current&&blend===1)release(p);}
 }
 async function start(key){if(!running())return;const env=environment();if(!env)return;const request=++serial;
  // Bound memory and streams even when a child rapidly changes modes.
  for(const p of [...players])if(p!==current)release(p);
  const audio=createAudio();audio.preload='auto';audio.src=new URL('./assets/audio/music/'+TRACKS[key].file+'.m4a',import.meta.url).href;
  const gain=env.context.createGain(),node=env.context.createMediaElementSource(audio);gain.gain.value=0;node.connect(gain).connect(env.output);
  const p={audio,gain,node,context:env.context,key,fadeAt:now(),pending:true};players.push(p);
  audio.onended=()=>{if(current===p&&running()&&!players.some(v=>v.pending))start(rotations[mood][++sequence%2]);};
  audio.onerror=()=>{error='Track unavailable: '+TRACKS[key].title;if(p!==current&&players.includes(p))release(p);};
  try{await audio.play();if(destroyed||request!==serial||!running()){if(players.includes(p))release(p);return;}p.pending=false;const t=now();for(const v of players)v.fadeAt=t;current=p;lastChange=t;error='';tick();}catch{error='Tap music to resume';if(players.includes(p))release(p);}
 }
 function sync(){if(!running()){serial++;for(const p of [...players]){if(p!==current)release(p);else p.audio.pause();}return;}if(!current&&!players.some(p=>p.pending))start(mood);else tick();}
 function unlock(){unlocked=true;if(timer===null)timer=setInterval(tick,100);sync();}
 function update(info){const next=typeof info==='string'?info:musicRegion(info);if(!TRACKS[next])return;if(next!==candidate){candidate=next;candidateAt=now();}if(next!==mood&&now()-candidateAt>2&&now()-lastChange>12){mood=next;sequence=0;if(current?.key!==mood)start(mood);}}
 return {unlock,sync,update,duck(seconds=4){duckUntil=now()+seconds;},next(){if(!unlocked)unlock();else start(rotations[mood][++sequence%2]);},get status(){return {mood,title:current?TRACKS[current.key].title:'',playing:!!current&&!current.audio.paused,players:players.length,time:current?.audio.currentTime||0,readyState:current?.audio.readyState||0,error};},destroy(){destroyed=true;serial++;clearInterval(timer);for(const p of [...players])release(p);current=null;}};
}

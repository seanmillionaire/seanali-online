import {createCarAudio} from './car-audio.js';
import {createThemeAudio,morningThemeDue,normalizeMorningTheme} from './theme-audio.js';
import {createRegionalAmbience} from './regional-ambience.js';
import {createSoundtrack} from './soundtrack.js?v=225';
/* Recorded foley, activity-aware soundtrack, and independent music/effects mix. */
export function createDelight({soundEnabled,motionEnabled,storage}) {
  let context,master,ambience,limiter,scene='quiet',unlocked=false,ambientTimer=null,phrase=0;
  const voices=new Set();
  let boatRequested=false,boatPosition=0,boatBus=null,boatNodes=[],boatMotor=null,boatHarmonic=null;
  let welcomeHeld=false,musicRevealAt=-Infinity,welcomeMusicPending=false,theme=null;
  let audioMenu=false,carGreetingTimer=null,carVoiceSerial=0,carSpeaking=false,carVoiceState='idle';
  function welcomeAudio(held){welcomeHeld=held;welcomeMusicPending=!held;if(!held)musicRevealAt=performance.now()/1000+1;sync();}
  let preferences={music:.58,effects:.8};try{const stored=JSON.parse((storage??localStorage).getItem('panama-audio-v1'));for(const k of ['music','effects'])if(Number.isFinite(stored?.[k]))preferences[k]=Math.max(0,Math.min(1,stored[k]));}catch{}
  const soundtrack=createSoundtrack({enabled:()=>unlocked&&soundEnabled()&&!destroyed&&!welcomeHeld&&scene!=='welcome',volume:()=>preferences.music*Math.max(0,Math.min(1,(performance.now()/1000-musicRevealAt)/6)),environment:()=>context?{context,output:limiter}:null});
  theme=createThemeAudio({allowed:()=>unlocked&&soundEnabled()&&!destroyed&&!welcomeHeld&&ready(),volume:()=>preferences.music,environment:()=>context?{context,output:limiter}:null,onPriority:(held,exclusive)=>{soundtrack.hold(held);if(master&&context){master.gain.cancelScheduledValues(context.currentTime);master.gain.setValueAtTime(exclusive||welcomeHeld?0:preferences.effects,context.currentTime);}if(exclusive)window.speechSynthesis?.cancel();}});
  function worldTheme(world,save,active=true){world.morningTheme??=normalizeMorningTheme();const day=world.morningTheme.day;if(active&&scene==='explore'&&!welcomeHeld&&morningThemeDue(world)&&!theme.exclusive)theme.morning(()=>{world.morningTheme.played=Math.max(world.morningTheme.played,day);save?.();});}
  function cancelCarGreeting(){clearTimeout(carGreetingTimer);carGreetingTimer=null;carVoiceSerial++;if(carSpeaking)window.speechSynthesis?.cancel();carSpeaking=false;carVoiceState='idle';}
  function carGreeting(language='en',delay=0){clearTimeout(carGreetingTimer);const token=++carVoiceSerial;carVoiceState='queued';const greet=()=>theme.afterMorning(()=>{if(token!==carVoiceSerial||!soundEnabled()||document.hidden||destroyed||!('speechSynthesis'in window))return;window.speechSynthesis.cancel();soundtrack.duck(5);theme.duck(5);const u=new SpeechSynthesisUtterance(language==='es'?'Hola, Angelique. ¿Adónde quieres ir?':'Hi, Angelique. Where do you want to go?');u.lang=language==='es'?'es-PA':'en-US';const voices=window.speechSynthesis.getVoices();u.voice=voices.find(v=>v.localService&&v.lang.startsWith(language))||voices.find(v=>v.lang.startsWith(language))||null;u.rate=.95;u.volume=preferences.effects;u.onstart=()=>{carVoiceState='speaking';};u.onend=()=>{carSpeaking=false;carVoiceState='spoken';};u.onerror=()=>{carSpeaking=false;carVoiceState='unavailable';};carSpeaking=true;window.speechSynthesis.speak(u);});if(delay>0)carGreetingTimer=setTimeout(greet,delay);else greet();}
  function setAudioLevels(values){for(const k of ['music','effects'])if(Number.isFinite(values[k]))preferences[k]=Math.max(0,Math.min(1,values[k]));try{(storage??localStorage).setItem('panama-audio-v1',JSON.stringify(preferences));}catch{}sync();}
  function ready(){
    if(!soundEnabled()||document.hidden)return false;
    try {
      if(!context){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;context=new Audio();master=context.createGain();master.gain.value=preferences.effects;limiter=context.createDynamicsCompressor();limiter.threshold.value=-12;limiter.knee.value=18;limiter.ratio.value=4;limiter.attack.value=.008;limiter.release.value=.22;master.connect(limiter);limiter.connect(context.destination);ambience=context.createGain();ambience.gain.value=.24;ambience.connect(master);
      }
      if(context.state==='suspended')context.resume().catch(()=>{});
      return true;
    }catch{return false;}
  }
  const recordings=new Map(),loading=new Map();let destroyed=false,footIndex=0;
  function loadRecording(name){
   if(loading.has(name))return loading.get(name);
   const job=fetch(new URL('./assets/audio/'+name+(['city-ambience','surf-ambience','birds-ambience','door','whoosh','rain','thunder','coins','body-impact','celebration','sports-start','sports-idle','sports-roar','tire-screech'].includes(name)?'.m4a':'.mp3'),import.meta.url)).then(r=>{if(!r.ok)throw Error('audio unavailable');return r.arrayBuffer();}).then(b=>context.decodeAudioData(b)).then(b=>{if(!destroyed)recordings.set(name,b);return b;}).catch(()=>null);
   loading.set(name,job);return job;
  }
  function recordedSound(name,{volume=.35,rate=1,offset=0,duration=null}={}){
   if(theme.exclusive||welcomeHeld||!unlocked||!soundEnabled()||document.hidden||destroyed||volume<.005||!ready()||voices.size>32)return false;
   const buffer=recordings.get(name);if(!buffer){const requested=performance.now();loadRecording(name).then(b=>{if(b&&performance.now()-requested<900)recordedSound(name,{volume,rate,offset,duration});});return false;}
   const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.playbackRate.value=Math.max(.7,Math.min(1.4,rate));
   const from=Math.min(Math.max(0,offset),Math.max(0,buffer.duration-.05)),length=Math.min(duration??buffer.duration,buffer.duration-from),now=context.currentTime;
   gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(Math.min(.65,volume),now+.01);gain.gain.setValueAtTime(Math.min(.65,volume),now+Math.max(.015,length/rate-.08));gain.gain.linearRampToValueAtTime(0,now+length/rate);
   source.connect(gain).connect(master);voices.add(source);source.onended=()=>{voices.delete(source);source.disconnect();gain.disconnect();};source.start(now,from,length);return true;
  }
  const carAudio=createCarAudio({environment:()=>({context,output:master}),load:name=>recordings.get(name)||loadRecording(name),allowed:()=>unlocked&&soundEnabled()&&!document.hidden&&!destroyed&&!welcomeHeld&&!theme.exclusive&&preferences.effects>0&&ready(),duck:seconds=>{soundtrack.duck(seconds);theme.duck(seconds);}});
  function carEnter(model){if(unlocked&&ready())carAudio.enter(model);}
  function carLeave(){carAudio.leave();}
  function carEngine(speed=0,active=false,options={}){carAudio.update(speed,active,options);}
  function voice(freq,duration=.2,{volume=.11,type='sine',delay=0,end=freq,ambient=false}={}){
    if(theme.exclusive||welcomeHeld||!ready()||voices.size>40)return;
    const at=context.currentTime+delay,o=context.createOscillator(),g=context.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,at);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),at+duration);
    g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(volume,at+.015);g.gain.exponentialRampToValueAtTime(.0001,at+duration);
    o.connect(g).connect(ambient?ambience:master);o.start(at);o.stop(at+duration+.03);voices.add(o);
    o.onended=()=>{voices.delete(o);o.disconnect();g.disconnect();};
  }
  function noise(duration,volume,filter,frequency,ambient=false){
    if(theme.exclusive||welcomeHeld||!ready()||voices.size>40)return;const at=context.currentTime,buffer=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate),data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1);
    const o=context.createBufferSource(),f=context.createBiquadFilter(),g=context.createGain();o.buffer=buffer;f.type=filter;f.frequency.value=frequency;
    g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(volume,at+Math.min(duration/3,.6));g.gain.exponentialRampToValueAtTime(.0001,at+duration);
    o.connect(f).connect(g).connect(ambient?ambience:master);o.start();voices.add(o);o.onended=()=>{voices.delete(o);o.disconnect();f.disconnect();g.disconnect();};
  }
  function stopBoat(){for(const n of boatNodes){try{n.stop?.();}catch{}n.disconnect();}boatNodes=[];boatMotor=null;boatBus=null;}
  function startBoat(){if(boatBus||!boatRequested||!unlocked||!ready())return;const buffer=recordings.get('engine');if(!buffer){loadRecording('engine');return;}boatBus=context.createGain();boatBus.gain.value=.1;const filter=context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=650;boatMotor=context.createBufferSource();boatMotor.buffer=buffer;boatMotor.loop=true;boatMotor.connect(filter).connect(boatBus).connect(master);boatNodes=[boatMotor,filter,boatBus];boatMotor.start();tuneBoat();}
  function tuneBoat(){if(!boatMotor||!context)return;const speed=Math.min(1,Math.max(0,boatPosition));boatMotor.playbackRate.setTargetAtTime(.7+speed*.6,context.currentTime,.2);boatBus.gain.setTargetAtTime(.09+speed*.15,context.currentTime,.2);}
  function boat(active,position=0){boatRequested=active;boatPosition=position;if(!active){stopBoat();return;}if(!soundEnabled()||document.hidden)return;startBoat();tuneBoat();}
  let rainSource=null,rainGain=null;
  function rainSound(amount=0){if(!unlocked||!soundEnabled()||document.hidden)amount=0;if(amount<.025){if(rainSource){rainSource.stop();rainSource.disconnect();rainGain.disconnect();rainSource=rainGain=null;}return;}if(!ready())return;const b=recordings.get('rain');if(!b){loadRecording('rain');return;}if(!rainSource){rainSource=context.createBufferSource();rainSource.buffer=b;rainSource.loop=true;rainGain=context.createGain();rainGain.gain.value=0;rainSource.connect(rainGain).connect(master);rainSource.start();}rainGain.gain.setTargetAtTime(Math.min(.26,amount*.28),context.currentTime,.7);}
  const regional=createRegionalAmbience({environment:()=>context?{context,output:master}:null,load:name=>{const b=recordings.get(name);if(!b)loadRecording(name);return b;},allowed:()=>!destroyed&&!welcomeHeld&&unlocked&&soundEnabled()&&!document.hidden&&scene==='explore'&&ready()});
  function soundscape(info){audioMenu=info.active===false;theme.setMenu(audioMenu);theme.sync();regional.update(info);if(welcomeMusicPending&&!welcomeHeld&&performance.now()/1000>musicRevealAt){soundtrack.sync();welcomeMusicPending=false;}soundtrack.update(info);rainSound(info.active===false?0:info.rain||0);}
  const scale=[261.63,293.66,329.63,392,440,523.25,659.25];
  function note(n=0,duration=.3,kind='sine'){
    const f=scale[((n%7)+7)%7];voice(f,duration,{volume:.15,type:kind});voice(f*2,duration*.55,{volume:.034});voice(f*3,duration*.32,{volume:.013});
  }
  function drum(n){if(n%3===0)voice(140,.22,{end:45,volume:.26});else if(n%3===1){noise(.14,.13,'highpass',1800);voice(185,.1,{type:'triangle',volume:.06});}else noise(.065,.095,'highpass',6500);}
  const lastEffect=new Map();
  function effect(name,{strength=1}={}){
    if(theme.exclusive||!unlocked||!soundEnabled()||document.hidden)return;
    if(['finish','treasure','arrival'].includes(name)){theme.celebrate();return;}
    const stamp=performance.now()/1000,cooldown=({footstep:.23,swim:.55,skate:.55,crash:.8,impact:.3,land:.25,fall:1.2,splash:.4,finish:2,treasure:2,thunder:12,door:.4,tap:.08})[name]||0;
    if(stamp-(lastEffect.get(name)??-Infinity)<cooldown)return;
    lastEffect.set(name,stamp);const power=Math.max(.15,Math.min(1,strength));
    const cues={crash:['crash',.62,2.5],impact:['body-impact',.48,.8],land:['body-impact',.26,.55],footstep:['footsteps',.15,.28],skate:['footsteps',.08,.4],swim:['splash',.22,.7],splash:['splash',.5,1.7],drive:['engine',.25,1],jump:['whoosh',.16,.45],fall:['whoosh',.4,.7],boat:['engine',.2,1.8],'giant-stomp':['body-impact',.62,.8],'balloon-pop':['body-impact',.5,.5],door:['door',.4,2],thunder:['thunder',.5,9],coin:['coins',.28,.8],correct:['coins',.2,.7],pair:['coins',.16,.5],friend:['door',.12,.18],travel:['whoosh',.2,.7],tap:['door',.09,.09],wrong:['body-impact',.08,.12]};
    const cue=cues[name];if(!cue)return;const [sound,volume,duration]=cue;
    recordedSound(sound,{volume:volume*power,duration,offset:sound==='footsteps'?(footIndex++%30)*.55:0,rate:name==='thunder'?1:.96+(footIndex%4)*.025});
    if(['crash','treasure','finish','thunder'].includes(name))soundtrack.duck(name==='thunder'?3:1.8);
  }
  let cityAmbient=false,lastStreetSound=0;
  function stopTheme(){soundtrack.sync();}
  function stopAmbient(){clearTimeout(ambientTimer);ambientTimer=null;}
  function ambientPhrase(){soundtrack.sync();}
  function sync(){
    theme.sync();
    if(!soundEnabled()||document.hidden||preferences.effects===0){carAudio.silence();}if(!soundEnabled()||document.hidden){regional.stop();carEngine(0,false);stopBoat();rainSound(0);stopAmbient();soundtrack.sync();if(context){for(const o of voices){try{o.stop();o.disconnect();}catch{}}voices.clear();context.suspend().catch(()=>{});}return;}
    if(unlocked&&ready()){master.gain.setTargetAtTime(welcomeHeld||theme.exclusive?0:preferences.effects,context.currentTime,welcomeHeld?.04:1.2);soundtrack.sync();if(boatRequested)startBoat();}
  }
  function gesture(){const first=!unlocked;unlocked=true;if(ready()){soundtrack.unlock();if(first)for(const name of ['horn','engine','footsteps','crash','splash','whoosh','body-impact','coins','door'])loadRecording(name);}sync();}
  function setScene(next){if(next!==scene)stopTheme();if(next!=='explore'){regional.stop();carEngine(0,false);boatRequested=false;stopBoat();}scene=next;audioMenu=['welcome','map','home','journal','reward','ending'].includes(scene);theme.setMenu(audioMenu);stopAmbient();if(ambience&&context){ambience.gain.cancelScheduledValues(context.currentTime);ambience.gain.setTargetAtTime(['map','home','welcome'].includes(scene)?.24:.0001,context.currentTime,.12);}if(unlocked){if(scene!=='explore')ambientPhrase();}}
  function duck(){soundtrack.duck(5);}
  const visibility=()=>{if(document.hidden)window.speechSynthesis?.cancel();sync();};document.addEventListener('visibilitychange',visibility);
  function setCityAmbient(isCity){
    const next=!!isCity;if(cityAmbient===next)return;
    cityAmbient=next;
    if(next)stopTheme();
    else if(scene==='explore')stopTheme();
  }
  function streetSound({traffic=.45,chatter=.35}={}){
    if(!cityAmbient||!unlocked||!soundEnabled()||document.hidden||!ready())return;
    const now=context.currentTime;if(now-lastStreetSound<1.6)return;
    lastStreetSound=now;
    recordedSound('engine',{volume:Math.min(.12,traffic*.15),duration:1.4,offset:2,rate:.85+Math.random()*.25});
  }
  function panamaSound({music=0,horn=0,step=0,cheer=0}={}){
   if(music<=.005&&horn<=.005&&cheer<=.04)return;
   if(!unlocked||!soundEnabled()||document.hidden||!ready())return;
   if(horn>.005)recordedSound('horn',{volume:Math.min(.5,horn*.55),rate:.88+Math.random()*.22});

  }
  return {worldTheme,carGreeting,cancelCarGreeting,carEnter,carLeave,prepareCarAudio(){if(unlocked&&ready())carAudio.preload();},get carAudioStatus(){return carAudio.status;},get carAssistantStatus(){return carVoiceState;},get themeStatus(){return theme.status;},get morningExclusive(){return theme.exclusive;},welcomeAudio,soundscape,setAudioLevels,get audioLevels(){return {...preferences};},get ambienceStatus(){return regional.status;},get soundtrackStatus(){return soundtrack.status;},nextTrack(){soundtrack.next();},recordedSound,carEngine,panamaSound,setCityAmbient,streetSound,boat,get boatActive(){return !!boatBus;},note,drum,effect,gesture,sync,setScene,duck,get voiceCount(){return voices.size;},get ambientScheduled(){return ambientTimer!==null;},destroy(){destroyed=true;carAudio.destroy();cancelCarGreeting();theme.destroy();regional.dispose();soundtrack.destroy();rainSound(0);carEngine(0,false);recordings.clear();boatRequested=false;stopBoat();stopAmbient();stopTheme();document.removeEventListener('visibilitychange',visibility);context?.close();}};
}
export function burst(target,{motion=true,big=false}={}){
  if(!motion||!target?.isConnected)return;
  const box=target.getBoundingClientRect(),layer=document.createElement('div');layer.className='joy-burst';layer.setAttribute('aria-hidden','true');layer.style.left=box.left+box.width/2+'px';layer.style.top=box.top+box.height/2+'px';
  for(let i=0;i<(big?22:10);i++){const p=document.createElement('i'),angle=i*Math.PI*2/(big?22:10),distance=(big?110:52)*(0.7+Math.random()*.5);p.style.setProperty('--x',Math.cos(angle)*distance+'px');p.style.setProperty('--y',Math.sin(angle)*distance+'px');p.style.setProperty('--turn',Math.random()*240+'deg');p.style.setProperty('--particle',['#ffd36d','#79cdb8','#edb3cb','#b5b0ff'][i%4]);p.textContent=i%3===0?'✦':'';layer.append(p);}document.body.append(layer);setTimeout(()=>layer.remove(),1000);
}
export function livingWorld(host){
 const layer=document.createElement('div');layer.className='living-world';layer.setAttribute('aria-hidden','true');
 const items=[['cloud',8,12],['cloud cloud-two',63,5],['seabird',62,15],['seabird bird-two',69,13],['water-glimmer',10,85],['water-glimmer glimmer-two',82,85],['waterfall',37,22],['waterfall fall-two',65,51],['island-boat',13,78],['butterfly',72,64],['butterfly butterfly-two',26,40],['lighthouse-beam',58,9]];
 for(const [cls,x,y]of items){const n=document.createElement('i');n.className=cls;n.style.left=x+'%';n.style.top=y+'%';layer.append(n);}
 for(let i=0;i<16;i++){const f=document.createElement('i');f.className='firefly';f.style.left=(13+(i*17)%76)+'%';f.style.top=(20+(i*13)%62)+'%';f.style.setProperty('--delay',-(i*.61)+'s');f.style.setProperty('--drift',((i%2?1:-1)*(10+i))+'px');layer.append(f);}
 host.append(layer);
}
export function foxPortrait(){
 const holder=document.createElement('span');holder.className='fox-friend';holder.setAttribute('aria-hidden','true');
 holder.innerHTML='<svg viewBox="0 0 120 126" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="61" cy="117" rx="34" ry="5" fill="#78956a" opacity=".18"/><g class="fox-tail"><path d="M76 105C119 112 123 72 103 61C108 89 75 73 72 94" fill="#d88942"/><path d="M103 61C107 72 103 79 97 82C113 89 119 70 103 61" fill="#fff2d7"/></g><g class="fox-body"><ellipse cx="61" cy="91" rx="25" ry="25" fill="#df9349"/><ellipse cx="61" cy="97" rx="15" ry="17" fill="#fff1d6"/><path d="M39 43L29 6L53 26M70 25L94 7L86 46" fill="#df9349" stroke="#df9349" stroke-width="6" stroke-linejoin="round"/><path d="M36 16L42 37L49 29M76 30L83 37L89 18" fill="#774c46"/><path d="M27 48C27 17 96 16 96 49C96 72 73 87 61 87C47 86 27 71 27 48Z" fill="#eea150"/><path d="M29 52C46 48 52 61 61 66C72 55 84 49 95 53C89 77 69 87 61 87C50 86 35 76 29 52Z" fill="#fff4df"/><g class="fox-eyes"><ellipse cx="45" cy="50" rx="3.4" ry="5" fill="#263e36"/><ellipse cx="77" cy="50" rx="3.4" ry="5" fill="#263e36"/></g><path d="M57 66Q61 62 66 66L61 71Z" fill="#3d4038"/><path d="M55 76Q61 81 68 75" stroke="#72503f" stroke-width="2" stroke-linecap="round"/><ellipse cx="38" cy="61" rx="6" ry="3" fill="#e7836c" opacity=".5"/><ellipse cx="84" cy="61" rx="6" ry="3" fill="#e7836c" opacity=".5"/><path d="M38 84Q61 98 84 83L79 99L59 102L37 96Z" fill="#3a8b80"/><path d="M76 92L87 110L71 105L65 94Z" fill="#32776e"/><circle cx="59" cy="94" r="5" fill="#f8d381"/><path d="M45 114H36M76 114H85" stroke="#b87539" stroke-width="9" stroke-linecap="round"/></g></svg>';
 return holder;
}

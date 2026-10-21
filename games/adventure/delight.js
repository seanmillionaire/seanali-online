/* Local recorded foley and vehicle audio, with lightweight UI/music support. */
export function createDelight({soundEnabled,motionEnabled}) {
  let context,master,ambience,scene='quiet',unlocked=false,ambientTimer=null,phrase=0;
  const voices=new Set();
  let boatRequested=false,boatPosition=0,boatBus=null,boatNodes=[],boatMotor=null,boatHarmonic=null;
  function ready(){
    if(!soundEnabled()||document.hidden)return false;
    try {
      if(!context){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;context=new Audio();master=context.createGain();master.gain.value=.65;master.connect(context.destination);ambience=context.createGain();ambience.gain.value=.24;ambience.connect(master);
        musicBus=context.createGain();musicBus.gain.value=.0001;musicBus.connect(master);
        musicNoise=context.createBuffer(1,Math.ceil(context.sampleRate*.12),context.sampleRate);
        const noiseData=musicNoise.getChannelData(0);
        for(let i=0;i<noiseData.length;i++)noiseData[i]=Math.random()*2-1;}
      if(context.state==='suspended')context.resume().catch(()=>{});
      return true;
    }catch{return false;}
  }
  const recordings=new Map(),loading=new Map();let destroyed=false,engineSource=null,engineGain=null,footIndex=0;
  function loadRecording(name){
   if(loading.has(name))return loading.get(name);
   const job=fetch(new URL('./assets/audio/'+name+'.mp3',import.meta.url)).then(r=>{if(!r.ok)throw Error('audio unavailable');return r.arrayBuffer();}).then(b=>context.decodeAudioData(b)).then(b=>{if(!destroyed)recordings.set(name,b);return b;}).catch(()=>null);
   loading.set(name,job);return job;
  }
  function recordedSound(name,{volume=.35,rate=1,offset=0,duration=null}={}){
   if(!unlocked||!soundEnabled()||document.hidden||destroyed||volume<.005||!ready()||voices.size>32)return false;
   const buffer=recordings.get(name);if(!buffer){loadRecording(name);return false;}
   const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.playbackRate.value=Math.max(.7,Math.min(1.4,rate));
   const from=Math.min(Math.max(0,offset),Math.max(0,buffer.duration-.05)),length=Math.min(duration??buffer.duration,buffer.duration-from),now=context.currentTime;
   gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(Math.min(.65,volume),now+.01);gain.gain.setValueAtTime(Math.min(.65,volume),now+Math.max(.015,length/rate-.08));gain.gain.linearRampToValueAtTime(0,now+length/rate);
   source.connect(gain).connect(master);voices.add(source);source.onended=()=>{voices.delete(source);source.disconnect();gain.disconnect();};source.start(now,from,length);return true;
  }
  function carEngine(speed=0,active=false){
   if(!active||!unlocked||!soundEnabled()||document.hidden||destroyed){if(engineSource){try{engineSource.stop();}catch{}engineSource.disconnect();engineGain.disconnect();engineSource=engineGain=null;}return;}
   if(!ready())return;const b=recordings.get('engine');if(!b){loadRecording('engine');return;}
   if(!engineSource){engineSource=context.createBufferSource();engineSource.buffer=b;engineSource.loop=true;engineGain=context.createGain();engineGain.gain.value=0;engineSource.connect(engineGain).connect(master);engineSource.start();}
   engineSource.playbackRate.setTargetAtTime(.8+Math.min(27,Math.abs(speed))/45,context.currentTime,.15);engineGain.gain.setTargetAtTime(.09+Math.min(27,Math.abs(speed))*.003,context.currentTime,.12);
  }
  function voice(freq,duration=.2,{volume=.11,type='sine',delay=0,end=freq,ambient=false}={}){
    if(!ready()||voices.size>40)return;
    const at=context.currentTime+delay,o=context.createOscillator(),g=context.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,at);o.frequency.exponentialRampToValueAtTime(Math.max(20,end),at+duration);
    g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(volume,at+.015);g.gain.exponentialRampToValueAtTime(.0001,at+duration);
    o.connect(g).connect(ambient?ambience:master);o.start(at);o.stop(at+duration+.03);voices.add(o);
    o.onended=()=>{voices.delete(o);o.disconnect();g.disconnect();};
  }
  function noise(duration,volume,filter,frequency,ambient=false){
    if(!ready()||voices.size>40)return;const at=context.currentTime,buffer=context.createBuffer(1,Math.ceil(context.sampleRate*duration),context.sampleRate),data=buffer.getChannelData(0);
    for(let i=0;i<data.length;i++)data[i]=(Math.random()*2-1);
    const o=context.createBufferSource(),f=context.createBiquadFilter(),g=context.createGain();o.buffer=buffer;f.type=filter;f.frequency.value=frequency;
    g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(volume,at+Math.min(duration/3,.6));g.gain.exponentialRampToValueAtTime(.0001,at+duration);
    o.connect(f).connect(g).connect(ambient?ambience:master);o.start();voices.add(o);o.onended=()=>{voices.delete(o);o.disconnect();f.disconnect();g.disconnect();};
  }
  // A small procedural soundscape: outboard harmonics, hull wash and gull calls.
  // One looping mono buffer is shared by the water layer; no large sound downloads.
  function stopBoat(){for(const n of boatNodes){try{n.stop?.();}catch{}n.disconnect();}boatNodes=[];boatMotor=boatHarmonic=null;if(boatBus){boatBus.disconnect();boatBus=null;}}
  function startBoat(){if(boatBus||!boatRequested||!unlocked||!ready())return;const at=context.currentTime;boatBus=context.createGain();boatBus.gain.value=.72;boatBus.connect(master);
    const attach=n=>{boatNodes.push(n);return n;};
    const motorGain=attach(context.createGain()),low=attach(context.createBiquadFilter());low.type='lowpass';low.frequency.value=420;motorGain.gain.value=.032;low.connect(motorGain).connect(boatBus);
    boatMotor=attach(context.createOscillator());boatMotor.type='sawtooth';boatMotor.connect(low);boatMotor.start();
    const harmonicGain=attach(context.createGain());harmonicGain.gain.value=.018;harmonicGain.connect(boatBus);boatHarmonic=attach(context.createOscillator());boatHarmonic.type='sine';boatHarmonic.connect(harmonicGain);boatHarmonic.start();
    const buffer=context.createBuffer(1,Math.ceil(context.sampleRate*2),context.sampleRate),data=buffer.getChannelData(0);let brown=0;for(let i=0;i<data.length;i++){const white=Math.random()*2-1;brown=(brown+.025*white)/1.025;data[i]=(brown*3+white*.18)*(.65+.25*Math.sin(i/context.sampleRate*Math.PI*2));}
    const water=attach(context.createBufferSource()),wash=attach(context.createBiquadFilter()),waterGain=attach(context.createGain());water.buffer=buffer;water.loop=true;wash.type='lowpass';wash.frequency.value=1900;waterGain.gain.value=.24;water.connect(wash).connect(waterGain).connect(boatBus);water.start();
    // Uneven two-part gull cries, with a quieter overtone, away from the motor.
    for(const offset of [.6,3.4,6.8]){if(offset<boatPosition*9)continue;const when=at+offset-boatPosition*9;for(const harmonic of [1,2]){const bird=attach(context.createOscillator()),gain=attach(context.createGain());bird.type='sine';bird.frequency.setValueAtTime(950*harmonic,when);bird.frequency.exponentialRampToValueAtTime(1450*harmonic,when+.15);bird.frequency.exponentialRampToValueAtTime(780*harmonic,when+.55);bird.frequency.exponentialRampToValueAtTime(1100*harmonic,when+.7);bird.frequency.exponentialRampToValueAtTime(650*harmonic,when+1);gain.gain.setValueAtTime(.0001,when);gain.gain.linearRampToValueAtTime(harmonic===1?.024:.004,when+.1);gain.gain.exponentialRampToValueAtTime(.0001,when+1);bird.connect(gain).connect(boatBus);bird.start(when);bird.stop(when+1.05);}}
    tuneBoat();
  }
  function tuneBoat(){if(!boatMotor||!context)return;const speed=Math.min(1,Math.max(0,boatPosition)),at=context.currentTime;boatMotor.frequency.setTargetAtTime(42+speed*48,at,.18);boatHarmonic.frequency.setTargetAtTime(84+speed*96,at,.18);}
  function boat(active,position=0){boatRequested=active;boatPosition=position;if(!active){stopBoat();return;}if(!soundEnabled()||document.hidden)return;startBoat();tuneBoat();}
  const scale=[261.63,293.66,329.63,392,440,523.25,659.25];
  function note(n=0,duration=.3,kind='sine'){
    const f=scale[((n%7)+7)%7];voice(f,duration,{volume:.15,type:kind});voice(f*2,duration*.55,{volume:.034});voice(f*3,duration*.32,{volume:.013});
  }
  function drum(n){if(n%3===0)voice(140,.22,{end:45,volume:.26});else if(n%3===1){noise(.14,.13,'highpass',1800);voice(185,.1,{type:'triangle',volume:.06});}else noise(.065,.095,'highpass',6500);}
  const lastEffect=new Map();
  function effect(name,{strength=1}={}){
    if(!unlocked||!soundEnabled()||document.hidden)return;
    const stamp=performance.now()/1000,cooldown=({footstep:.23,swim:.55,skate:.55,crash:.8,impact:.3,land:.25,fall:1.2,splash:.4})[name]||0;
    if(stamp-(lastEffect.get(name)??-Infinity)<cooldown)return;
    lastEffect.set(name,stamp);const power=Math.max(.15,Math.min(1,strength));
    if(['crash','impact','land','footstep','swim','splash','skate','drive','jump','fall'].includes(name)){
     const sound=['crash','impact'].includes(name)?'crash':['swim','splash'].includes(name)?'splash':name==='drive'?'engine':'footsteps';
     const duration=name==='crash'?2:name==='splash'?1.7:name==='drive'?.6:.28;
     recordedSound(sound,{volume:(name==='footstep'?.16:name==='crash'?.5:.25)*power,duration,offset:sound==='footsteps'?(footIndex++%30)*.55:0,rate:.94+(footIndex%4)*.035});return;
    }
    if(['tap','correct','coin','wrong','pair','friend','travel'].includes(name))return;

    if(name==='crash'){noise(.24,.24*power,'lowpass',1800);voice(105,.35,{end:28,volume:.22*power,type:'triangle'});noise(.12,.10*power,'highpass',2600);return;}
    if(name==='impact'||name==='land'){noise(.13,.11*power,'lowpass',700);voice(110,.19,{end:35,volume:.13*power});return;}
    if(name==='footstep'){noise(.055,.045*power,'bandpass',850);voice(95,.06,{end:60,volume:.018*power});return;}
    if(name==='skate'){noise(.25,.035*power,'highpass',1200);return;}
    if(name==='swim'){noise(.24,.065*power,'bandpass',1300);return;}
    if(name==='splash'){noise(.55,.19*power,'lowpass',2100);voice(180,.18,{end:55,volume:.055*power});return;}
    if(name==='fall'){noise(.6,.07*power,'bandpass',800);voice(360,.65,{end:70,volume:.045*power,type:'triangle'});return;}
    if(name==='jump'){voice(180,.12,{end:330,volume:.035,type:'triangle'});return;}
    if(name==='boat'){voice(95,.9,{end:75,volume:.11,type:'sawtooth'});return;}

    if(name==='giant-stomp'){noise(.28,.12,'lowpass',220);voice(90,.38,{end:28,volume:.14,type:'sine'});return;}
    if(name==='balloon-pop'){noise(.12,.13,'highpass',900);voice(160,.16,{end:45,volume:.1,type:'triangle'});return;}
    if(name==='arrival'){noise(2.8,.055,'lowpass',1200);[0,2,4,5,6].forEach((n,i)=>voice(scale[n],1.1,{delay:i*.42,volume:.09}));return;}
    if(name==='coin'){voice(1260,.12,{volume:.07});voice(1880,.22,{delay:.07,volume:.055});return;}
    if(name==='tap'){voice(570,.065,{end:820,volume:.045});return;}
    if(name==='correct'){[0,2,4].forEach((n,i)=>voice(scale[n]*2,.42,{delay:i*.085,volume:.09}));voice(523.25,.6,{volume:.04});return;}
    if(name==='treasure'||name==='finish'){[0,2,4,5,6].forEach((n,i)=>{voice(scale[n]*2,.65,{delay:i*.11,volume:.085});voice(scale[n],.75,{delay:i*.11,volume:.035});});return;}
    if(name==='pair'){voice(660,.15,{volume:.09});voice(990,.24,{volume:.08,delay:.09});return;}
    if(name==='wrong'){voice(220,.17,{end:165,volume:.075,type:'triangle'});return;}
    if(name==='drive'){voice(85,.23,{end:150,volume:.07,type:'triangle'});noise(.18,.018,'lowpass',700);return;}
    if(name==='friend'){voice(600,.12,{end:850,volume:.055});voice(740,.19,{end:1100,volume:.045,delay:.12});return;}
    if(name==='travel'){[0,2,5].forEach((n,i)=>voice(scale[n],.25,{delay:i*.07,volume:.06}));}
  }
  // Light, upbeat island-adventure theme. Synthesized locally: no audio downloads,
  // no licensing dependencies, and no music before a user gesture.
  const THEME_BEAT=60/116;
  const themeMelodies=[
    [72,76,79,76,74,79,81,79],
    [69,72,77,81,79,77,76,null],
    [71,74,79,83,81,79,74,71],
    [76,72,69,72,76,79,76,null],
    [79,76,72,74,76,79,81,79],
    [81,77,76,72,76,77,79,null],
    [79,74,71,74,79,81,83,79],
    [76,72,69,72,74,76,72,null]
  ];
  const themeHarmony=[
    {bass:48,chord:[60,64,67]}, // C
    {bass:41,chord:[60,65,69]}, // F
    {bass:43,chord:[59,62,67]}, // G
    {bass:45,chord:[60,64,69]}, // Am
    {bass:48,chord:[60,64,67]},
    {bass:41,chord:[60,65,69]},
    {bass:43,chord:[59,62,67]},
    {bass:48,chord:[60,64,67]}
  ];
  let musicBus=null,musicNoise=null,musicTimer=null,nextMusicTime=0,musicBar=0,cityAmbient=false,lastStreetSound=0;
  const musicNodes=new Set();
  const midi=n=>440*Math.pow(2,(n-69)/12);
  function musicSound(freq,at,len,volume,type='sine',drop=1){
    if(!context||!musicBus||musicNodes.size>110)return;
    const oscillator=context.createOscillator(),gain=context.createGain();
    oscillator.type=type;
    oscillator.frequency.setValueAtTime(freq,at);
    if(drop!==1)oscillator.frequency.exponentialRampToValueAtTime(Math.max(25,freq*drop),at+len);
    gain.gain.setValueAtTime(.0001,at);
    gain.gain.exponentialRampToValueAtTime(volume,at+.008);
    gain.gain.exponentialRampToValueAtTime(.0001,at+len);
    oscillator.connect(gain).connect(musicBus);
    oscillator.start(at);oscillator.stop(at+len+.02);
    musicNodes.add(oscillator);
    oscillator.onended=()=>{musicNodes.delete(oscillator);oscillator.disconnect();gain.disconnect();};
  }
  function musicHat(at,volume=.035){
    if(!musicNoise||!musicBus||musicNodes.size>110)return;
    const source=context.createBufferSource(),filter=context.createBiquadFilter(),gain=context.createGain(),duration=.075;
    source.buffer=musicNoise;filter.type='highpass';filter.frequency.value=4700;
    gain.gain.setValueAtTime(.0001,at);
    gain.gain.linearRampToValueAtTime(volume,at+.003);
    gain.gain.exponentialRampToValueAtTime(.0001,at+duration);
    source.connect(filter).connect(gain).connect(musicBus);
    source.start(at);source.stop(at+duration+.01);
    musicNodes.add(source);
    source.onended=()=>{musicNodes.delete(source);source.disconnect();filter.disconnect();gain.disconnect();};
  }
  function scheduleTheme(at){
    for(let offset=0;offset<2;offset++){
      const bar=(musicBar+offset)%8,start=at+offset*4*THEME_BEAT;
      const melody=themeMelodies[bar],harmony=themeHarmony[bar];
      // Bright marimba/steelpan-like lead with deliberate gaps so effects stay audible.
      melody.forEach((note,i)=>{
        if(note===null)return;
        musicSound(midi(note),start+i*THEME_BEAT/2,.22, i%2===0?.09:.07,'sine');
        if(i===0||i===4)musicSound(midi(note+12),start+i*THEME_BEAT/2,.11,.016,'triangle');
      });
      // Off-beat island chords, warm bouncing bass and light hand percussion.
      for(const point of [0.5,2.5])
        for(const note of harmony.chord)musicSound(midi(note),start+point*THEME_BEAT,.24,.027,'triangle');
      for(let beat=0;beat<4;beat++){
        musicSound(midi(harmony.bass+(beat===2?7:0)),start+beat*THEME_BEAT,.34,beat===0?.115:.084,'sine');
        if(beat%2===0)musicSound(125,start+beat*THEME_BEAT,.16,.08,'sine',.4);
        else musicHat(start+beat*THEME_BEAT,.065);
        musicHat(start+(beat+.5)*THEME_BEAT,beat===3?.055:.038);
      }
    }
    musicBar=(musicBar+2)%8;
  }
  function stopTheme(){
    if(musicTimer!==null)clearTimeout(musicTimer);
    musicTimer=null;nextMusicTime=0;musicBar=0;
    if(context&&musicBus){
      const now=context.currentTime;
      musicBus.gain.cancelScheduledValues(now);
      musicBus.gain.setTargetAtTime(.0001,now,.025);
      for(const node of musicNodes){try{node.stop(now+.08);}catch{}}
    }
  }
  function runTheme(){
    musicTimer=null;
    if(!unlocked||!soundEnabled()||document.hidden||(scene!=='explore'||cityAmbient)||!ready())return;
    const now=context.currentTime;
    if(nextMusicTime<now-.4)nextMusicTime=now+.1;
    while(nextMusicTime<now+.7){
      scheduleTheme(nextMusicTime);
      nextMusicTime+=8*THEME_BEAT;
    }
    musicTimer=setTimeout(runTheme,250);
  }
  function startTheme(){
    if(!unlocked||scene!=='explore'||cityAmbient||!ready())return;
    if(musicTimer!==null)return;
    const now=context.currentTime;
    musicBus.gain.cancelScheduledValues(now);
    musicBus.gain.setTargetAtTime(.4,now,.15);
    if(nextMusicTime===0)nextMusicTime=now+.15;
    runTheme();
  }
  function stopAmbient(){clearTimeout(ambientTimer);ambientTimer=null;}
  function ambientPhrase(){
    stopAmbient();if(!unlocked||!soundEnabled()||document.hidden||!['map','home','welcome'].includes(scene)||!ready())return;
    // Quiet surf, a few distant birds, and a sparse five-note music-box phrase.
    noise(3.8,.1,'lowpass',450,true);
    const melody=[[0,2,4,2],[2,4,5,4],[0,4,2,0],[4,5,2,0]][phrase++%4];
    melody.forEach((n,i)=>voice(scale[n],1.6,{volume:.035,delay:1+i*.65,ambient:true}));
    voice(1700,.12,{end:2400,volume:.028,delay:.5,ambient:true});voice(2200,.16,{end:1600,volume:.02,delay:.7,ambient:true});
    ambientTimer=setTimeout(ambientPhrase,6500);
  }
  function sync(){
    if(!soundEnabled()||document.hidden){carEngine(0,false);stopBoat();stopAmbient();stopTheme();if(context){for(const o of voices){try{o.stop();o.disconnect();}catch{}}voices.clear();context.suspend().catch(()=>{});}return;}
    if(unlocked&&ready()){master.gain.setValueAtTime(.65,context.currentTime);if(scene!=='explore')ambientPhrase();if(boatRequested)startBoat();}
  }
  function gesture(){if(!unlocked){unlocked=true;sync();if(ready())for(const name of ['horn','siren','engine','footsteps','crash','splash'])loadRecording(name);}}
  function setScene(next){if(next!==scene)stopTheme();if(next!=='explore'){carEngine(0,false);boatRequested=false;stopBoat();}scene=next;stopAmbient();if(ambience&&context){ambience.gain.cancelScheduledValues(context.currentTime);ambience.gain.setTargetAtTime(['map','home','welcome'].includes(scene)?.24:.0001,context.currentTime,.12);}if(unlocked){if(scene!=='explore')ambientPhrase();}}
  function duck(){if(!ambience||!context)return;const at=context.currentTime;if(boatBus){boatBus.gain.cancelScheduledValues(at);boatBus.gain.setTargetAtTime(.18,at,.08);boatBus.gain.setTargetAtTime(.72,at+4,.4);}ambience.gain.cancelScheduledValues(at);ambience.gain.setTargetAtTime(.025,at,.08);if(['map','home','welcome'].includes(scene))ambience.gain.setTargetAtTime(.24,at+4,.7);if(musicBus&&scene==='explore'){musicBus.gain.cancelScheduledValues(at);musicBus.gain.setTargetAtTime(.07,at,.08);musicBus.gain.setTargetAtTime(.4,at+5,.55);}}
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
   if(music>.005&&!cityAmbient){const v=Math.min(1,music);if([0,6,8,14].includes(step))voice(78,.16,{volume:v*.32,end:38});if([4,10,12].includes(step))noise(.075,v*.15,'highpass',1500);if(step%2===0)noise(.035,v*.055,'highpass',5500);if([0,3,8,11].includes(step))voice([110,110,98,123][Math.floor(step/4)],.16,{volume:v*.11,type:'triangle',end:55});}
   if(horn>.005)recordedSound('horn',{volume:Math.min(.5,horn*.55),rate:.88+Math.random()*.22});
   if(cheer>.04&&step===0)voice(780,.15,{volume:cheer*.08,end:1100,type:'triangle'});
  }
  return {recordedSound,carEngine,panamaSound,setCityAmbient,streetSound,boat,get boatActive(){return !!boatBus;},note,drum,effect,gesture,sync,setScene,duck,get voiceCount(){return voices.size;},get ambientScheduled(){return ambientTimer!==null;},destroy(){destroyed=true;carEngine(0,false);recordings.clear();boatRequested=false;stopBoat();stopAmbient();stopTheme();document.removeEventListener('visibilitychange',visibility);context?.close();}};
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

/* Small, self-contained sound and motion layer. No downloads, tracking, or audio files. */
export function createDelight({soundEnabled,motionEnabled}) {
  let context,master,ambience,scene='quiet',unlocked=false,ambientTimer=null,phrase=0;
  const voices=new Set();
  let boatRequested=false,boatPosition=0,boatBus=null,boatNodes=[],boatMotor=null,boatHarmonic=null;
  function ready(){
    if(!soundEnabled()||document.hidden)return false;
    try {
      if(!context){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;context=new Audio();master=context.createGain();master.gain.value=.65;master.connect(context.destination);ambience=context.createGain();ambience.gain.value=.24;ambience.connect(master);
        musicBus=context.createGain();musicBus.gain.value=.0001;const velvet=context.createBiquadFilter();velvet.type='lowpass';velvet.frequency.value=1600;musicBus.connect(velvet);velvet.connect(master);const reverb=context.createConvolver(),wet=context.createGain(),impulse=context.createBuffer(2,context.sampleRate*3,context.sampleRate);for(let ch=0;ch<2;ch++){const d=impulse.getChannelData(ch);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2.5)*.4;}reverb.buffer=impulse;wet.gain.value=.22;velvet.connect(reverb);reverb.connect(wet).connect(master);
        musicNoise=context.createBuffer(1,Math.ceil(context.sampleRate*.12),context.sampleRate);
        const noiseData=musicNoise.getChannelData(0);
        for(let i=0;i<noiseData.length;i++)noiseData[i]=Math.random()*2-1;}
      if(context.state==='suspended')context.resume().catch(()=>{});
      return true;
    }catch{return false;}
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
  function tuneBoat(){if(!boatMotor||!context)return;const speed=Math.sin(Math.PI*Math.min(1,Math.max(0,boatPosition))),at=context.currentTime;boatMotor.frequency.setTargetAtTime(42+speed*48,at,.18);boatHarmonic.frequency.setTargetAtTime(84+speed*96,at,.18);}
  function boat(active,position=0){boatRequested=active;boatPosition=position;if(!active){stopBoat();return;}if(!soundEnabled()||document.hidden)return;startBoat();tuneBoat();}
  const scale=[261.63,293.66,329.63,392,440,523.25,659.25];
  function note(n=0,duration=.3,kind='sine'){
    const f=scale[((n%7)+7)%7];voice(f,duration,{volume:.15,type:kind});voice(f*2,duration*.55,{volume:.034});voice(f*3,duration*.32,{volume:.013});
  }
  function drum(n){if(n%3===0)voice(140,.22,{end:45,volume:.26});else if(n%3===1){noise(.14,.13,'highpass',1800);voice(185,.1,{type:'triangle',volume:.06});}else noise(.065,.095,'highpass',6500);}
  function effect(name){
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
  // Slow, beat-free cosmic meditation. Long sine pads and sparse glass bells;
  // no island melody, bass pulse, hats, or percussion in the background score.
  const THEME_BEAT=1.5;
  const themeHarmony=[[48,55,62,64],[45,52,59,62],[41,48,55,60],[43,50,57,62]];
  let musicBus=null,musicNoise=null,musicTimer=null,nextMusicTime=0,musicBar=0;
  const musicNodes=new Set();
  const midi=n=>440*Math.pow(2,(n-69)/12);
  function musicSound(freq,at,len,volume,{bell=false,detune=0}={}){
    if(!context||!musicBus||musicNodes.size>80)return;
    const oscillator=context.createOscillator(),gain=context.createGain();
    oscillator.type='sine';oscillator.frequency.setValueAtTime(freq,at);oscillator.detune.value=detune;
    gain.gain.setValueAtTime(.0001,at);
    gain.gain.exponentialRampToValueAtTime(volume,at+(bell?.08:2.8));
    if(!bell)gain.gain.setValueAtTime(volume*.8,at+len*.45);
    gain.gain.exponentialRampToValueAtTime(.0001,at+len);
    oscillator.connect(gain).connect(musicBus);oscillator.start(at);oscillator.stop(at+len+.03);
    musicNodes.add(oscillator);oscillator.onended=()=>{musicNodes.delete(oscillator);oscillator.disconnect();gain.disconnect();};
  }
  function scheduleTheme(at){
    const chord=themeHarmony[musicBar%themeHarmony.length];
    chord.forEach((n,i)=>{musicSound(midi(n),at+i*.18,17,.032,{detune:-3});musicSound(midi(n),at+i*.18,17,.022,{detune:3});});
    const bell=chord[2]+12;musicSound(midi(bell),at+4.5,7,.036,{bell:true});
    musicSound(midi(chord[3]+12),at+10,8,.025,{bell:true});musicBar++;
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
    if(!unlocked||!soundEnabled()||document.hidden||!['explore','welcome','home','map'].includes(scene)||!ready())return;
    const now=context.currentTime;
    if(nextMusicTime<now-.4)nextMusicTime=now+.1;
    while(nextMusicTime<now+.7){
      scheduleTheme(nextMusicTime);
      nextMusicTime+=12;
    }
    musicTimer=setTimeout(runTheme,250);
  }
  function startTheme(){
    if(!unlocked||!['explore','welcome','home','map'].includes(scene)||!ready())return;
    if(musicTimer!==null)return;
    const now=context.currentTime;
    musicBus.gain.cancelScheduledValues(now);
    musicBus.gain.setTargetAtTime(.58,now,1.5);
    if(nextMusicTime===0)nextMusicTime=now+.15;
    runTheme();
  }
  function stopAmbient(){clearTimeout(ambientTimer);ambientTimer=null;}
  function ambientPhrase(){stopAmbient();if(unlocked&&soundEnabled()&&!document.hidden)startTheme();}
  function sync(){
    if(!soundEnabled()||document.hidden){stopBoat();stopAmbient();stopTheme();if(context){for(const o of voices){try{o.stop();}catch{}}context.suspend().catch(()=>{});}return;}
    if(unlocked&&ready()){master.gain.setValueAtTime(.65,context.currentTime);if(scene==='explore')startTheme();else ambientPhrase();if(boatRequested)startBoat();}
  }
  function gesture(){if(!unlocked){unlocked=true;sync();}}
  function setScene(next){if(next!==scene)stopTheme();if(next!=='explore'){boatRequested=false;stopBoat();}scene=next;stopAmbient();if(ambience&&context){ambience.gain.cancelScheduledValues(context.currentTime);ambience.gain.setTargetAtTime(['map','home','welcome'].includes(scene)?.24:.0001,context.currentTime,.12);}if(unlocked){if(scene==='explore')startTheme();else ambientPhrase();}}
  function duck(){if(!ambience||!context)return;const at=context.currentTime;if(boatBus){boatBus.gain.cancelScheduledValues(at);boatBus.gain.setTargetAtTime(.18,at,.08);boatBus.gain.setTargetAtTime(.72,at+4,.4);}ambience.gain.cancelScheduledValues(at);ambience.gain.setTargetAtTime(.025,at,.08);if(['map','home','welcome'].includes(scene))ambience.gain.setTargetAtTime(.24,at+4,.7);if(musicBus&&scene==='explore'){musicBus.gain.cancelScheduledValues(at);musicBus.gain.setTargetAtTime(.07,at,.08);musicBus.gain.setTargetAtTime(.58,at+5,1.5);}}
  const visibility=()=>{if(document.hidden)window.speechSynthesis?.cancel();sync();};document.addEventListener('visibilitychange',visibility);
  return {boat,get boatActive(){return !!boatBus;},note,drum,effect,gesture,sync,setScene,duck,get voiceCount(){return voices.size;},get ambientScheduled(){return ambientTimer!==null;},destroy(){boatRequested=false;stopBoat();stopAmbient();stopTheme();document.removeEventListener('visibilitychange',visibility);context?.close();}};
}

/* Small, self-contained sound and motion layer. No downloads, tracking, or audio files. */
export function createDelight({soundEnabled,motionEnabled}) {
  let context,master,ambience,scene='quiet',unlocked=false,ambientTimer=null,phrase=0;
  const voices=new Set();
  function ready(){
    if(!soundEnabled()||document.hidden)return false;
    try {
      if(!context){const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return false;context=new Audio();master=context.createGain();master.gain.value=.65;master.connect(context.destination);ambience=context.createGain();ambience.gain.value=.24;ambience.connect(master);}
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
  const scale=[261.63,293.66,329.63,392,440,523.25,659.25];
  function note(n=0,duration=.3,kind='sine'){
    const f=scale[((n%7)+7)%7];voice(f,duration,{volume:.15,type:kind});voice(f*2,duration*.55,{volume:.034});voice(f*3,duration*.32,{volume:.013});
  }
  function drum(n){if(n%3===0)voice(140,.22,{end:45,volume:.26});else if(n%3===1){noise(.14,.13,'highpass',1800);voice(185,.1,{type:'triangle',volume:.06});}else noise(.065,.095,'highpass',6500);}
  function effect(name){
    if(name==='arrival'){noise(2.8,.055,'lowpass',1200);[0,2,4,5,6].forEach((n,i)=>voice(scale[n],1.1,{delay:i*.42,volume:.09}));return;}
    if(name==='tap'){voice(570,.065,{end:820,volume:.045});return;}
    if(name==='correct'){[0,2,4].forEach((n,i)=>voice(scale[n]*2,.42,{delay:i*.085,volume:.09}));voice(523.25,.6,{volume:.04});return;}
    if(name==='treasure'||name==='finish'){[0,2,4,5,6].forEach((n,i)=>{voice(scale[n]*2,.65,{delay:i*.11,volume:.085});voice(scale[n],.75,{delay:i*.11,volume:.035});});return;}
    if(name==='pair'){voice(660,.15,{volume:.09});voice(990,.24,{volume:.08,delay:.09});return;}
    if(name==='wrong'){voice(220,.17,{end:165,volume:.075,type:'triangle'});return;}
    if(name==='drive'){voice(85,.23,{end:150,volume:.07,type:'triangle'});noise(.18,.018,'lowpass',700);return;}
    if(name==='friend'){voice(600,.12,{end:850,volume:.055});voice(740,.19,{end:1100,volume:.045,delay:.12});return;}
    if(name==='travel'){[0,2,5].forEach((n,i)=>voice(scale[n],.25,{delay:i*.07,volume:.06}));}
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
    if(!soundEnabled()||document.hidden){stopAmbient();if(context){for(const o of voices){try{o.stop();}catch{}}context.suspend().catch(()=>{});}return;}
    if(unlocked&&ready()){master.gain.setValueAtTime(.65,context.currentTime);ambientPhrase();}
  }
  function gesture(){if(!unlocked){unlocked=true;sync();}}
  function setScene(next){scene=next;stopAmbient();if(ambience&&context){ambience.gain.cancelScheduledValues(context.currentTime);ambience.gain.setTargetAtTime(['map','home','welcome'].includes(scene)?.24:.0001,context.currentTime,.12);}if(unlocked)ambientPhrase();}
  function duck(){if(!ambience||!context)return;const at=context.currentTime;ambience.gain.cancelScheduledValues(at);ambience.gain.setTargetAtTime(.025,at,.08);if(['map','home','welcome'].includes(scene))ambience.gain.setTargetAtTime(.24,at+4,.7);}
  const visibility=()=>{if(document.hidden)window.speechSynthesis?.cancel();sync();};document.addEventListener('visibilitychange',visibility);
  return {note,drum,effect,gesture,sync,setScene,duck,get voiceCount(){return voices.size;},get ambientScheduled(){return ambientTimer!==null;},destroy(){stopAmbient();document.removeEventListener('visibilitychange',visibility);context?.close();}};
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

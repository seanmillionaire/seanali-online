// Pedal response is separate from wheel speed, so a quick key tap makes an audible rev.
export function carEngineResponse(previous,speed,throttle,dt=1/60){
 const step=Math.max(0,Math.min(.1,dt)),v=Math.min(1,Math.abs(speed)/52),pedal=Math.max(0,Math.min(1,throttle));
 const target=.12+pedal*.55+v*(pedal>.05?.25:.17),rpm=previous.rpm+(target-previous.rpm)*(1-Math.exp(-step/(target>previous.rpm?.10:.32)));
 const load=previous.load+(pedal-previous.load)*(1-Math.exp(-step/(pedal>previous.load?.055:.14)));
 return {rpm,load};
}
// Recorded engine layers. Entry is explicit: pausing/resuming cannot restart ignition.
export function createCarAudio({environment,load,allowed,duck=()=>{},now=()=>performance.now()/1000}){
 let occupied=false,model='lamborghini',serial=0,loops=[],start=null,skid=null,previous=null,lastSkid=-Infinity,starts=0,skids=0,rpm=0,loadLevel=0;
 const profile=()=>model==='ferrari'?{pitch:1.12,idle:.28,roar:.62}:{pitch:.94,idle:.34,roar:.68};
 function stop(node){if(!node)return;try{node.source.stop();}catch{}node.source.disconnect();node.gain.disconnect();}
 function stopLoops(){loops.forEach(stop);loops=[];previous=null;rpm=0;loadLevel=0;}
 function oneShot(buffer,volume,rate,onEnd){const {context,output}=environment(),source=context.createBufferSource(),gain=context.createGain(),t=context.currentTime,d=buffer.duration/rate;source.buffer=buffer;source.playbackRate.value=rate;gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(volume,t+.015);gain.gain.setValueAtTime(volume,t+Math.max(.02,d-.12));gain.gain.linearRampToValueAtTime(0,t+d);source.connect(gain).connect(output);const node={source,gain};source.onended=()=>{source.disconnect();gain.disconnect();onEnd?.(node);};source.start();return node;}
 function preload(){for(const key of ['sports-start','sports-idle','sports-roar','tire-screech'])load(key);}
 async function enter(next='lamborghini'){
  leave();occupied=true;model=next==='ferrari'?'ferrari':'lamborghini';const ticket=serial;preload();if(!allowed())return;
  const buffer=await load('sports-start');if(!buffer||ticket!==serial||!occupied||!allowed())return;
  duck(4);starts++;start=oneShot(buffer,.82,profile().pitch,node=>{if(start===node)start=null;});
 }
 function leave(){serial++;occupied=false;stop(start);stop(skid);start=skid=null;stopLoops();}
 function update(speed=0,active=false,{dt=1/60,model:next=model,throttle}={}){
  if(!active||!allowed()){stopLoops();return;}
  model=next==='ferrari'?'ferrari':'lamborghini';const idle=load('sports-idle'),roar=load('sports-roar');
  // load() returns a decoded buffer once cached, otherwise null (also starts loading).
  if(!idle||!roar||typeof idle.then==='function'||typeof roar.then==='function')return;
  const {context,output}=environment(),p=profile();
  if(!loops.length)for(const buffer of [idle,roar]){const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.loop=true;gain.gain.value=0;source.connect(gain).connect(output);source.start();loops.push({source,gain});}
  const v=Math.abs(speed),delta=dt>0&&dt<=.2&&previous!==null?(v-previous)/dt:0,acceleration=Math.max(0,Math.min(1,delta/35));
  const pedal=Number.isFinite(throttle)?throttle:Math.max(v>1?.35:0,acceleration),response=carEngineResponse({rpm,load:loadLevel},speed,pedal,dt);rpm=response.rpm;loadLevel=response.load;
  const voiceDuck=start?.source? .45:1;
  loops[0].source.playbackRate.setTargetAtTime(p.pitch*(.76+rpm*.4),context.currentTime,.05);
  loops[1].source.playbackRate.setTargetAtTime(p.pitch*(.67+rpm*.82),context.currentTime,.045);
  loops[0].gain.gain.setTargetAtTime(p.idle*(1-loadLevel*.3)*voiceDuck,context.currentTime,.08);
  loops[1].gain.gain.setTargetAtTime((.025+p.roar*(loadLevel*.7+rpm*.3))*voiceDuck,context.currentTime,.06);
  if(v>1||loadLevel>.1)duck(1.2);
  // Release/reverse/hard stops squeal; parking, pause and ordinary gradual auto braking do not.
  if(previous>12&&delta< -18&&now()-lastSkid>1.4&&!skid){const b=load('tire-screech');if(b&&typeof b.then!=='function'){lastSkid=now();skids++;duck(1.5);skid=oneShot(b,.4+Math.min(.25,previous/100),p.pitch,node=>{if(skid===node)skid=null;});}}
  previous=v;
 }
 return {enter,leave,update,preload,silence(){serial++;stop(start);stop(skid);start=skid=null;stopLoops();},get status(){return {model,occupied,running:loops.length===2,starting:!!start,braking:!!skid,starts,skids,rpm,throttle:loadLevel};},destroy:leave};
}

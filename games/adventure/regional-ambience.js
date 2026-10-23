import {cityX} from './geography.js';
import {worldIslands,inWater} from './explore-state.js';
const clamp=x=>Math.max(0,Math.min(1,x));
export function regionalAmbienceMix(info){
 if(!info||info.active===false||info.indoors||!Number.isFinite(info.x)||!Number.isFinite(info.z))return {city:0,surf:0,birds:0};
 const {x,z}=info;
 const urban=Math.max(clamp(1-Math.hypot((x-cityX(145))/110,(z+50)/75)),clamp(1-Math.hypot((x+25)/110,(z+374)/48)));
 const gorgona=clamp(1-Math.hypot((x+40)/100,(z-16)/30));
 const island=Math.max(0,...worldIslands.filter(p=>!['sunset','pizzaCity','monkeyIslet'].includes(p.id)).map(p=>clamp(1-Math.abs(Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)-.85)/.9)));
 const surf=Math.max(gorgona,island)*(1-urban*.8),birds=(1-Math.max(urban,surf*.85))*(inWater(x,z)?.05:1)*(info.night?.12:1);
 return {city:urban*.48,surf:surf*.32,birds:birds*.16};
}
// Three lazy buffers, independent of music; soft region boundaries never reset a loop.
export function createRegionalAmbience({environment,load,allowed}){
 const nodes=new Map();let requested={city:0,surf:0,birds:0};
 function stop(){for(const {source,gain}of nodes.values()){try{source.stop();}catch{}source.disconnect();gain.disconnect();}nodes.clear();}
 function update(info){requested=regionalAmbienceMix(info);if(!allowed()){stop();return;}
  const env=environment();if(!env)return;const {context,output}=env;
  for(const [id,amount]of Object.entries(requested)){let node=nodes.get(id);if(!node&&amount>.012){const buffer=load(id+'-ambience');if(!buffer)continue;const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;source.loop=true;gain.gain.value=0;source.connect(gain).connect(output);source.start();node={source,gain};nodes.set(id,node);}if(node)node.gain.gain.setTargetAtTime(amount,context.currentTime,1.5);}
 }
 return {update,stop,get status(){return {mix:{...requested},playing:[...nodes.keys()]};},dispose(){stop();}};
}


import assert from 'node:assert/strict';
import {sustainedEngineBuffer} from '../games/adventure/car-audio.js';
const context={createBuffer(ch,length,sampleRate){const data=Array.from({length:ch},()=>new Float32Array(length));return {length,sampleRate,numberOfChannels:ch,getChannelData:i=>data[i]};}};
const b=context.createBuffer(2,48000*3,48000);for(let c=0;c<2;c++)for(let i=0;i<b.length;i++){const t=i/48000;b.getChannelData(c)[i]=Math.sin(t*2*Math.PI*160)*(.12+.3*Math.sin(Math.PI*t/3)**2);}
const loop=sustainedEngineBuffer(context,b);assert.equal(loop.numberOfChannels,2);assert(loop.length<b.length/2);for(let c=0;c<2;c++){const a=loop.getChannelData(c);assert(Math.abs(a[0]-a.at(-1))<.02,'loop boundary is continuous');assert(a.every(Number.isFinite));}console.log('PASS sustained recorded segment, stereo preservation, smooth loop boundary');

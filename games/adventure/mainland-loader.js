import {MAINLAND_REVISION} from './mainland-revision.js';
let pending;
const COAST_BYTES=512*448*4,MAX_DECODED_BYTES=64*1024*1024;
export function decodeMainland(buffer){
 // Validate the header before constructing any header-sized typed arrays.
 if(!(buffer instanceof ArrayBuffer)||buffer.byteLength<20||buffer.byteLength>MAX_DECODED_BYTES)throw Error('Invalid mainland geometry');
 const h=new Uint32Array(buffer,0,5),vertices=h[1]/3;
 if(h[0]!==0x50414e43||!h[1]||h[1]%3||h[2]!==vertices*2||!h[3]||h[3]%3||h[4]%3||h[4]>h[3]||buffer.byteLength!==20+(h[1]+h[2]+h[3])*4+COAST_BYTES)throw Error('Invalid mainland geometry');
 for(const [start,length,stride,index]of [[20,h[1],3,false],[20+h[1]*4,h[2],2,false],[20+(h[1]+h[2])*4,h[3],1,true]]){
  const a=new Uint32Array(buffer,start,length);
  for(let i=0;i<a.length;i++){const n=a[i],delta=(n>>>1)^-(n&1);a[i]=delta+(i>=stride?a[i-stride]:0);if(index&&a[i]>=vertices)throw Error('Invalid mainland index');}
  if(!index){const floats=new Float32Array(buffer,start,length);for(let i=0;i<floats.length;i++)if(!Number.isFinite(floats[i]))throw Error('Invalid mainland vertex');}
 }
 return {coast:{width:512,height:448,pixels:new Uint8Array(buffer,20+(h[1]+h[2]+h[3])*4)},positions:new Float32Array(buffer,20,h[1]),uv:new Float32Array(buffer,20+h[1]*4,h[2]),indices:new Uint32Array(buffer,20+(h[1]+h[2])*4,h[3]),firstCount:h[4]};
}
async function readBounded(stream,signal){
 if(!stream)throw Error('Mainland response has no body');
 const reader=stream.getReader(),chunks=[];let size=0;
 const abort=()=>{reader.cancel(signal.reason).catch(()=>{});};signal.addEventListener('abort',abort,{once:true});
 try{
  for(;;){if(signal.aborted)throw Error('Mainland request timed out');const {done,value}=await reader.read();if(signal.aborted)throw Error('Mainland request timed out');if(done)break;size+=value.byteLength;if(size>MAX_DECODED_BYTES)throw Error('Mainland geometry is too large');chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}return bytes.buffer;
 }finally{signal.removeEventListener('abort',abort);reader.cancel().catch(()=>{});reader.releaseLock();}
}
// Native gzip stays first choice; older browsers lazily load the pinned decoder.
// Tests may inject an equivalent decoder without changing production behavior.
export function loadMainlandData({inflate,timeoutMs=45000}={}){
 if(!pending){
  const controller=new AbortController();let timer;
  // Race also bounds a fetch/decoder implementation that fails to honor abort.
  const timeout=new Promise((_,reject)=>{timer=setTimeout(()=>{controller.abort();reject(Error('Mainland request timed out'));},timeoutMs);});
  const attempt=(async()=>{
   const response=await fetch('/games/adventure/assets/terrain/mainland-v1.pack?v='+MAINLAND_REVISION,{signal:controller.signal,priority:'high'});
   if(!response.ok)throw Error('Mainland unavailable');
   let raw,decompressor;
   try{if(typeof DecompressionStream!=='undefined')decompressor=new DecompressionStream('gzip');}catch{/* Older partial API: use the same packed terrain through our decoder. */}
   if(decompressor)raw=await readBounded(response.body.pipeThrough(decompressor),controller.signal);
   else {
    const decode=inflate||(await import('./vendor/mainland-inflate.js')).inflateGzip;
    const compressed=await readBounded(response.body,controller.signal),bytes=await decode(new Uint8Array(compressed),{maxBytes:MAX_DECODED_BYTES,signal:controller.signal});
    if(bytes.byteLength>MAX_DECODED_BYTES)throw Error('Mainland geometry is too large');
    raw=bytes instanceof ArrayBuffer?bytes:bytes.byteOffset===0&&bytes.byteLength===bytes.buffer.byteLength?bytes.buffer:bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);
   }
   if(controller.signal.aborted)throw Error('Mainland request timed out');return decodeMainland(raw);
  })();
  const request=Promise.race([attempt,timeout]).catch(()=>{if(pending===request)pending=undefined;return null;}).finally(()=>clearTimeout(timer));
  pending=request;
 }
 return pending;
}

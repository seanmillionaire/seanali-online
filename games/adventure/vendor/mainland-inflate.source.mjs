// Build with fflate 0.8.2 + esbuild: bundle, format=esm, minify, target=es2020.
// Only the streaming gzip decoder is retained; see fflate.LICENSE.txt.
import {Gunzip} from 'fflate';
const crcTable=new Uint32Array(256);
for(let i=0;i<256;i++){let c=i;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;crcTable[i]=c;}
export async function inflateGzip(bytes,{maxBytes=64*1024*1024,signal}={}){
 if(!(bytes instanceof Uint8Array)||bytes.length<18||bytes[0]!==31||bytes[1]!==139||bytes[2]!==8)throw Error('Invalid mainland gzip');
 const trailer=new DataView(bytes.buffer,bytes.byteOffset+bytes.length-8,8),expectedCRC=trailer.getUint32(0,true),expectedSize=trailer.getUint32(4,true);
 if(expectedSize>maxBytes)throw Error('Mainland geometry is too large');
 const chunks=[];let size=0,crc=0xffffffff;
 const decoder=new Gunzip(chunk=>{
  size+=chunk.length;if(size>maxBytes)throw Error('Mainland geometry is too large');
  for(let i=0;i<chunk.length;i++)crc=crcTable[(crc^chunk[i])&255]^(crc>>>8);
  chunks.push(chunk);
 });
 // Small compressed chunks bound temporary inflate growth. Yield regularly so
 // older phones can paint progress and the enclosing timeout can interrupt.
 for(let offset=0;offset<bytes.length;offset+=16384){
  if(signal?.aborted)throw Error('Mainland request timed out');
  const end=Math.min(bytes.length,offset+16384);decoder.push(bytes.subarray(offset,end),end===bytes.length);
  if(offset&&offset%262144===0)await new Promise(resolve=>setTimeout(resolve,0));
 }
 if(size!==expectedSize||((crc^0xffffffff)>>>0)!==expectedCRC)throw Error('Invalid mainland gzip checksum');
 const result=new Uint8Array(size);let offset=0;for(const chunk of chunks){result.set(chunk,offset);offset+=chunk.length;}return result;
}

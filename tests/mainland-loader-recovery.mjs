import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gzipSync,gunzipSync} from 'node:zlib';
const source=(await readFile(new URL('../games/adventure/mainland-loader.js',import.meta.url),'utf8')).replace("import {MAINLAND_REVISION} from './mainland-revision.js';","const MAINLAND_REVISION='test';").replace("'./vendor/mainland-inflate.js'",JSON.stringify(new URL('../games/adventure/vendor/mainland-inflate.js',import.meta.url).href));let revision=0;
const fresh=()=>import('data:text/javascript;base64,'+Buffer.from(source+'\n//'+revision++).toString('base64'));
function pack({indices=[0,1,2]}={}){
 const p=new Float32Array([0,0,0,1,0,0,0,0,1]),uv=new Float32Array([0,0,1,0,0,1]),idx=new Uint32Array(indices),buffer=new ArrayBuffer(20+(p.length+uv.length+idx.length)*4+512*448*4);
 new Uint32Array(buffer,0,5).set([0x50414e43,p.length,uv.length,idx.length,3]);let at=20;
 for(const [raw,stride]of [[p,3],[uv,2],[idx,1]]){const a=new Uint32Array(raw.buffer),out=new Uint32Array(buffer,at,a.length);for(let i=0;i<a.length;i++){const d=(a[i]-(i>=stride?a[i-stride]:0))|0;out[i]=((d<<1)^(d>>31))>>>0;}at+=a.byteLength;}
 return buffer;
}
const originalFetch=globalThis.fetch,originalDS=globalThis.DecompressionStream;
try{
 const {decodeMainland}=await fresh();assert.equal(decodeMainland(pack()).positions.length,9);
 for(const buf of [new ArrayBuffer(0),new ArrayBuffer(19),new ArrayBuffer(20)])assert.throws(()=>decodeMainland(buf),/Invalid mainland/);
 const huge=pack();new Uint32Array(huge,0,5)[1]=0xffffffff;assert.throws(()=>decodeMainland(huge),/Invalid mainland/);
 assert.throws(()=>decodeMainland(pack({indices:[0,1,99]})),/Invalid mainland index/);
 let calls=0;const compressed=gzipSync(new Uint8Array(pack()));globalThis.fetch=async()=>{if(++calls===1)throw Error('offline');return new Response(compressed);};
 const recovery=await fresh();assert.equal(await recovery.loadMainlandData(),null);const recovered=await recovery.loadMainlandData();assert.ok(recovered);assert.equal(calls,2);assert.equal(await recovery.loadMainlandData(),recovered);assert.equal(calls,2);
 let release;calls=0;globalThis.fetch=()=>{calls++;return new Promise(r=>release=r);};const shared=await fresh(),a=shared.loadMainlandData(),b=shared.loadMainlandData();assert.equal(a,b);release(new Response(compressed));assert.ok(await a);assert.equal(calls,1);
 // A hung fetch must settle, clear its cached promise, and allow a later retry.
 let signal;globalThis.fetch=(_url,options)=>{signal=options.signal;return new Promise(()=>{});};const timed=await fresh();assert.equal(await timed.loadMainlandData({timeoutMs:5}),null);assert.equal(signal.aborted,true);globalThis.fetch=async()=>new Response(compressed);assert.ok(await timed.loadMainlandData());
 // The body/decompression phase is bounded too, not just receipt of headers.
 globalThis.fetch=async()=>new Response(new ReadableStream({start(){}}));const bodyTimeout=await fresh();assert.equal(await bodyTimeout.loadMainlandData({timeoutMs:5}),null);
 // Unsupported-native path is explicit and can use an approved decoder lazily.
 globalThis.DecompressionStream=undefined;calls=0;globalThis.fetch=async()=>{calls++;return new Response(compressed);};const legacy=await fresh();assert.ok(await legacy.loadMainlandData());assert.equal(calls,1);
 globalThis.DecompressionStream=originalDS;
 let successSignal;globalThis.fetch=async(_url,options)=>{successSignal=options.signal;return new Response(compressed);};const cleanup=await fresh();assert.ok(await cleanup.loadMainlandData({timeoutMs:100}));await new Promise(r=>setTimeout(r,120));assert.equal(successSignal.aborted,false);
 // Verify both paths against the real shipped world, not just a tiny fixture.
 const realPack=await readFile(new URL('../games/adventure/assets/terrain/mainland-v1.pack',import.meta.url));
 globalThis.fetch=async()=>new Response(realPack);const native=await fresh(),nativeWorld=await native.loadMainlandData();assert.ok(nativeWorld);
 globalThis.DecompressionStream=undefined;const fallback=await fresh(),fallbackWorld=await fallback.loadMainlandData();assert.ok(fallbackWorld);
 for(const key of ['positions','uv','indices'])assert.deepEqual(fallbackWorld[key],nativeWorld[key]);assert.deepEqual(fallbackWorld.coast.pixels,nativeWorld.coast.pixels);assert.equal(fallbackWorld.firstCount,nativeWorld.firstCount);
 assert.equal(await fallback.loadMainlandData({inflate:()=>{throw Error('must not decode twice')}}),fallbackWorld);
 // A present-but-unsupported native constructor also falls back safely.
 globalThis.DecompressionStream=class{constructor(){throw Error('gzip unsupported')}};const partial=await fresh();assert.ok(await partial.loadMainlandData());
 globalThis.DecompressionStream=undefined;
 const {inflateGzip}=await import('../games/adventure/vendor/mainland-inflate.js');
 const badChecksum=Buffer.from(realPack);badChecksum[badChecksum.length-8]^=1;await assert.rejects(inflateGzip(badChecksum),/checksum/);
 await assert.rejects(inflateGzip(new Uint8Array([1,2,3])),/gzip/);
 await assert.rejects(inflateGzip(realPack,{maxBytes:1024}),/too large/);
 const aborted=new AbortController();aborted.abort();await assert.rejects(inflateGzip(realPack,{signal:aborted.signal}),/timed out/);
 globalThis.fetch=async()=>new Response(badChecksum);const corrupt=await fresh();assert.equal(await corrupt.loadMainlandData(),null);globalThis.fetch=async()=>new Response(realPack);assert.ok(await corrupt.loadMainlandData());
 console.log('PASS: bounded header/index decode; offline retry; cache/coalescing; hung fetch/body timeout and retry; native-less vendored decoder, gzip CRC/size/abort validation; success timer cleanup; actual terrain native/fallback byte equality, '+nativeWorld.positions.length/3+' vertices');
}finally{globalThis.fetch=originalFetch;globalThis.DecompressionStream=originalDS;}

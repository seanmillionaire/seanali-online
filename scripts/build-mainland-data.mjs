import {buildMainlandData,buildCoastData} from '../games/adventure/mainland-data.js';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {writeFileSync} from 'node:fs';
function encode(buffer,stride){const a=new Uint32Array(buffer),out=new Uint32Array(a.length);for(let i=0;i<a.length;i++){const delta=(a[i]-(i>=stride?a[i-stride]:0))|0;out[i]=(delta<<1)^(delta>>31);}return Buffer.from(out.buffer);}
const d=buildMainlandData(),coast=buildCoastData(),header=new Uint32Array([0x50414e43,d.positions.length,d.uv.length,d.indices.length,d.firstCount]),b=Buffer.concat([Buffer.from(header.buffer),encode(d.positions.buffer,3),encode(d.uv.buffer,2),encode(d.indices.buffer,1),Buffer.from(coast.pixels)]);const compressed=gzipSync(b,{level:9});writeFileSync('games/adventure/assets/terrain/mainland-v1.pack',compressed);writeFileSync('games/adventure/mainland-revision.js',"export const MAINLAND_REVISION='"+createHash('sha256').update(compressed).digest('hex').slice(0,12)+"';\n");console.log('Exact mainland geometry',b.length,'bytes ->',compressed.length,'compressed bytes');

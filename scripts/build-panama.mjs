// ESBUILD_BIN may point to a local esbuild 0.25.12 binary.
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const dir=mkdtempSync(join(tmpdir(),'panama-build-')),meta=join(dir,'meta.json'),bundle='games/adventure/app.bundle.js';
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
try{
 const run=spawnSync(process.env.ESBUILD_BIN||'esbuild',['games/adventure/app.js','--bundle','--minify','--format=esm','--target=es2020','--external:./vendor/*','--outfile='+bundle,'--metafile='+meta],{stdio:'inherit'});
 if(run.error)throw run.error;if(run.status!==0)throw Error('Bundle failed');
 const info=JSON.parse(readFileSync(meta)),inputs=Object.fromEntries([...new Set(Object.keys(info.inputs).map(p=>p.split('?')[0]))].sort().map(p=>[p,hash(p)]));
 const digest=hash(bundle);writeFileSync('games/adventure/bundle-manifest.json',JSON.stringify({esbuild:'0.25.12',bundle,digest,inputs},null,2)+'\n');
 const path='games/panama/index.html';let html=readFileSync(path,'utf8').replace(/<link rel="modulepreload" href="\/games\/adventure\/explore.js\?v=\d+">/g,'');
 html=html.replace(/\/games\/adventure\/app(?:\.bundle)?\.js\?v=[a-z\d]+/g,'/games/adventure/app.bundle.js?v='+digest.slice(0,12));writeFileSync(path,html);
 console.log(Object.keys(inputs).length+' source modules bundled; revision '+digest.slice(0,12));
}finally{rmSync(dir,{recursive:true,force:true});}

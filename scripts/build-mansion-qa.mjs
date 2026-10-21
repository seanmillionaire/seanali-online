// Run from the repository root with the same ESBUILD_BIN used by build-panama.mjs.
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const file='tests/.mansion-upstairs-qa.js';
const run=spawnSync(process.env.ESBUILD_BIN||'esbuild',['tests/mansion-upstairs-preview.js','--bundle','--format=esm','--target=es2022','--external:../games/adventure/vendor/*','--external:./vendor/*','--outfile='+file],{stdio:'inherit'});
if(run.error)throw run.error;if(run.status!==0)process.exit(run.status||1);
const hash=createHash('sha256').update(readFileSync(file)).digest('hex').slice(0,10),html='tests/mansion-upstairs-preview.html';
writeFileSync(html,readFileSync(html,'utf8').replace(/\.mansion-upstairs-qa.js(?:\?v=[a-z0-9]+)?/g,'.mansion-upstairs-qa.js?v='+hash));
console.log('Mansion browser QA ready at /tests/mansion-upstairs-preview.html');

// Run from the repository root with the same ESBUILD_BIN used by build-panama.mjs.
import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const file='tests/.rainforest-qa.js';
const run=spawnSync(process.env.ESBUILD_BIN||'esbuild',['tests/rainforest-preview.js','--bundle','--format=esm','--target=es2022','--external:../games/adventure/vendor/*','--external:./vendor/*','--outfile='+file],{stdio:'inherit'});
if(run.error)throw run.error;if(run.status!==0)process.exit(run.status||1);
const hash=createHash('sha256').update(readFileSync(file)).digest('hex').slice(0,10),html='tests/rainforest-preview.html';
writeFileSync(html,readFileSync(html,'utf8').replace(/\.rainforest-qa.js(?:\?v=[a-z0-9]+)?/g,'.rainforest-qa.js?v='+hash));
console.log('Rainforest browser QA ready at /tests/rainforest-preview.html');

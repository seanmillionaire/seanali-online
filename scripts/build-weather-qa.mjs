import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const file='tests/.living-weather-qa.js',run=spawnSync(process.env.ESBUILD_BIN||'esbuild',['tests/living-weather-preview.js','--bundle','--format=esm','--target=es2022','--external:../games/adventure/vendor/*','--external:./vendor/*','--outfile='+file],{stdio:'inherit'});
if(run.error)throw run.error;if(run.status!==0)process.exit(run.status||1);
const hash=createHash('sha256').update(readFileSync(file)).digest('hex').slice(0,10),html='tests/living-weather-preview.html';writeFileSync(html,readFileSync(html,'utf8').replace(/\.living-weather-qa.js(?:\?v=[a-z0-9]+)?/g,'.living-weather-qa.js?v='+hash));

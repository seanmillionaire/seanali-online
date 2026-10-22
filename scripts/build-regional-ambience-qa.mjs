import {spawnSync} from 'node:child_process';
const r=spawnSync(process.env.ESBUILD_BIN||'esbuild',['tests/regional-ambience-preview.js','--bundle','--format=esm','--outfile=games/adventure/.regional-ambience-qa.js'],{stdio:'inherit'});if(r.error)throw r.error;process.exit(r.status||0);

import {spawnSync} from 'node:child_process';
const r=spawnSync(process.env.ESBUILD_BIN||'esbuild',['tests/animal-realism-preview.js','--bundle','--format=esm','--target=es2022','--external:../games/adventure/vendor/*','--external:./vendor/*','--outfile=tests/.animal-realism-qa.js'],{stdio:'inherit'});if(r.error)throw r.error;if(r.status)process.exit(r.status);

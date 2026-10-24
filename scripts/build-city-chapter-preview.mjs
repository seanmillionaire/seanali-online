import {spawnSync} from 'node:child_process';
const result=spawnSync(process.env.ESBUILD_BIN||'esbuild',['tests/city-chapter-world-entry.mjs','--bundle','--format=esm','--external:/games/adventure/vendor/*','--outfile=games/adventure/qa-chapter-world.js'],{stdio:'inherit'});
if(result.error)throw result.error;process.exit(result.status??1);

import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const manifest=JSON.parse(readFileSync('games/adventure/bundle-manifest.json'));const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
for(const [path,digest] of Object.entries({...manifest.inputs,[manifest.bundle]:manifest.digest}))assert.equal(hash(path),digest,'Rebuild Panama bundle after editing '+path);
assert(readFileSync('games/panama/index.html','utf8').includes('app.bundle.js?v='+manifest.digest.slice(0,12)));
console.log('PASS production bundle matches all source files and cache revision');

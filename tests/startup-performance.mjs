import assert from 'node:assert/strict';
import {isletHeight,cacheStartupHeights} from '../games/adventure/explore-state.js';
import {createSurfaceTextures} from '../games/adventure/surface-textures.js';
import * as T from '../games/adventure/vendor/three.module.min.js';
const points=Array.from({length:2000},(_,i)=>({x:-480+(i*37)%1100,z:-420+(i*19)%700}));const before=points.map(p=>isletHeight(p.x,p.z));const release=cacheStartupHeights();for(let repeat=0;repeat<3;repeat++)assert.deepEqual(points.map(p=>isletHeight(p.x,p.z)),before);release();assert.deepEqual(points.map(p=>isletHeight(p.x,p.z)),before);
for(const size of [128,256]){const textures=createSurfaceTextures(T,{size});for(const key of ['sand','grass','wood','stone','asphalt','roof','plaster']){assert.equal(textures[key].image.width,size);assert.equal(textures[key].image.data.length,size*size*4);assert.equal(textures[key].generateMipmaps,true);}textures.dispose();}console.log('PASS exact cached terrain queries, cache release, full/mobile fallback textures');

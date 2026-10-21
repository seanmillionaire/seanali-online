import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {landscapeMaterial} from '../games/adventure/landscape-material.js';
import {VISITOR_HABITATS} from '../games/adventure/world-ambience.js';
import {worldIslands,marineWater} from '../games/adventure/explore-state.js';
import {MARINE_HABITATS} from '../games/adventure/island-life.js';
const surfaces={grass:new T.Texture(),sand:new T.Texture(),stone:new T.Texture()},mat=(c,o)=>new T.MeshStandardMaterial({color:c,...o});
const swatches={};
for(const region of ['mainland','wilds','colon','sunset','crystalCove','coconutCoast']){
 const material=landscapeMaterial({T,mat,surfaces,region}),shader={uniforms:{},vertexShader:'#include <common>\n#include <begin_vertex>',fragmentShader:'#include <common>\n#include <map_fragment>\n#include <color_fragment>\n#include <normal_fragment_maps>'};material.onBeforeCompile(shader);
 assert(shader.fragmentShader.includes('uniform vec3 regionalGreen;'));assert(shader.fragmentShader.includes('regionalSand'));assert(shader.vertexShader.includes('landscapePosition='));swatches[region]={green:shader.uniforms.regionalGreen.value.getHexString(),sand:shader.uniforms.regionalSand.value.getHexString(),key:material.customProgramCacheKey()};material.dispose();
}
assert.notEqual(swatches.wilds.green,swatches.sunset.green,'Bocas rainforest and Chiriqui highlands differ');assert.notEqual(swatches.colon.green,swatches.mainland.green,'Caribbean green differs from Pacific mainland');assert.notEqual(swatches.crystalCove.sand,swatches.mainland.sand,'Guna Yala sand is distinct');assert.equal(new Set(Object.values(swatches).map(s=>s.key)).size,6,'regional shaders cannot reuse the wrong cached palette');
for(const island of worldIslands.filter(i=>i.guna&&!i.community))assert(!VISITOR_HABITATS.some(h=>h.x===island.x&&h.z===island.z),'uninhabited cays remain unpopulated');
assert.equal(MARINE_HABITATS.dolphins.length,3);for(const [x,z]of MARINE_HABITATS.dolphins)for(const [dx,dz]of [[0,0],[12,0],[-12,0],[0,12],[0,-12]])assert(marineWater(x+dx,z+dz),'dolphin habitat remains offshore');
Object.values(surfaces).forEach(t=>t.dispose());console.log('PASS distinct regional palettes/shader cache, uninhabited Guna Yala cays, three offshore dolphin habitats');

import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {createHuman} from '../games/adventure/character-model.js';
const geometries=[],materials=[],geometry=g=>(geometries.push(g),g),mat=(c,o={})=>{const m=new T.MeshStandardMaterial({color:c,...o});materials.push(m);return m;},make=(g,m,x,y,z,sx,sy,sz,parent)=>{const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;},options={T,geometry,mat,make};
const hero=createHuman(options,{hero:true}),visitor=createHuman(options,{index:2}),officer=createHuman(options,{index:1,police:true});
for(const person of [hero,visitor,officer]){
 person.g.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(person.g);assert(bounds.min.y>-.02,'shoes stay at ground level');assert(bounds.max.y<1.95,'human remains at existing world scale');assert(bounds.max.x-bounds.min.x<.65,'fits existing narrow doorways and paths');
 person.legs[0].rotation.x=.45;person.animate(4,true);person.g.updateMatrixWorld(true);assert(person.knees.some(k=>k.rotation.x>.01),'walking bends articulated knees');assert(person.arms.every(a=>a.isGroup),'arms rotate at shoulder pivots');
 person.g.traverse(mesh=>{if(!mesh.isMesh)return;assert(mesh.material.depthTest,'people obey world occlusion');assert(mesh.geometry.attributes.position.array.every(Number.isFinite),'finite character geometry');});
}
const oldGeo=geometries.length;createHuman(options,{index:2});assert.equal(geometries.length,oldGeo,'crowd shares mesh resources');assert.equal(hero.g.name,'Angelique');assert(hero.ponytail.visible);assert(officer.hat.visible);assert(!visitor.hat.visible);
let fabricDisposed=false;hero.materials.outfit.map.addEventListener('dispose',()=>fabricDisposed=true);materials.forEach(m=>m.dispose());assert(fabricDisposed,'fabric GPU texture is released with the world');geometries.forEach(g=>g.dispose());console.log('PASS grounded human scale, doorway clearance, articulated walking, proper depth, shared geometry and texture cleanup');

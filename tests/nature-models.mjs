import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {oceanModel} from '../games/adventure/ocean-models.js';
import {botanicalGeometry} from '../games/adventure/botanical-geometry.js';
import {createNatureDecor} from '../games/adventure/nature-decor.js';
const scene=new T.Scene(),resources=[],materials=[],geometry=g=>{resources.push(g);return g;},mat=(color,o={})=>{const m=new T.MeshStandardMaterial({color,...o});materials.push(m);return m;},make=(geo,m,x=0,y=0,z=0,sx=1,sy=sx,sz=sx,parent=scene)=>{const mesh=new T.Mesh(geo,m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;};
const api={geometry,mat,make},models=new Map();
for(const [kind,limbs,budget]of [['Octopus',8,28],['Sea turtle',4,16],['Dolphin',1,12],['Manta ray',2,12],['Reef fish',1,8]]){
 const model=oceanModel(T,api,kind);models.set(kind,model);assert.equal(model.moving.length,limbs,kind+' articulated limbs');
 let calls=0;model.g.traverse(o=>{if(o.isMesh){calls++;for(const key of ['position','normal'])assert([...o.geometry.attributes[key].array].every(Number.isFinite),kind+' finite '+key);}});assert(calls<=budget,kind+' phone draw budget');
 const before=resources.length,second=oceanModel(T,api,kind);assert.equal(resources.length,before,kind+' reuses shared geometry');assert.notEqual(second.moving[0],model.moving[0],'instances animate independently');
}
const octopus=models.get('Octopus');for(const arm of octopus.moving){const tube=arm.children.find(o=>o.isMesh&&!o.isInstancedMesh).geometry,p=tube.attributes.position;const thickness=j=>new T.Vector3().fromBufferAttribute(p,j*9).distanceTo(new T.Vector3().fromBufferAttribute(p,j*9+4));assert(thickness(23)<thickness(2)*.20,'arm tapers smoothly toward its tip');const suckers=arm.children.find(o=>o.isInstancedMesh);assert.equal(suckers.count,22,'paired small suckers share a draw');}
const turtle=models.get('Sea turtle').g.getObjectByName('Continuous patterned carapace');assert(turtle.material.map,'shell has growth plates and seams on one curved surface');let disposed=false;turtle.material.map.addEventListener('dispose',()=>disposed=true);
for(const kind of ['palm','natural','pine','banana','fern']){const close=botanicalGeometry(T,geometry,kind),far=botanicalGeometry(T,geometry,kind,true);assert(far.index.count<close.index.count,kind+' simplified distance foliage');for(const geo of [close,far]){assert(geo.attributes.color);assert([...geo.attributes.position.array].every(Number.isFinite));}}
const decor=createNatureDecor(T,geometry);for(const tile of [1,2,3,9,10,11,14,15]){const g=decor(tile);g.computeBoundingBox();assert.equal(g.boundingBox.min.y,0,'grounded sculpted prop '+tile);assert(g.boundingBox.max.z-g.boundingBox.min.z>.05,'prop has real depth');assert.equal(decor(tile),g,'prop geometry shared');}
materials.forEach(m=>m.dispose());assert(disposed,'shell texture released with its owning material');resources.forEach(g=>g.dispose());
console.log('PASS species anatomy, tapered arms/suckers, continuous shell, shared resources, independent rigs, distant foliage, 3D props and phone draw budgets');

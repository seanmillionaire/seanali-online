import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {exteriorMansion,mansionInterior} from '../games/adventure/mansion-models.js';
import {HOME_LOTS,homeCanWalk,homePath} from '../games/adventure/mansion-state.js';
import {isletHeight} from '../games/adventure/explore-state.js';
const scene=new T.Scene(),materials=[],geometries=[],mat=(color,o={})=>{const m=new T.MeshStandardMaterial({color,...Object.fromEntries(Object.entries(o).filter(([,v])=>v!==undefined))});materials.push(m);return m;},geometry=g=>(geometries.push(g),g);
const box=geometry(new T.BoxGeometry()),ball=geometry(new T.SphereGeometry(1,12,8)),cylinder=geometry(new T.CylinderGeometry(1,1,1,12));
const make=(geo,m,x=0,y=0,z=0,a=1,b=a,c=a,parent=scene)=>{const mesh=new T.Mesh(geo,m);mesh.position.set(x,y,z);mesh.scale.set(a,b,c);parent.add(mesh);return mesh;};
const o={T,scene,make,mat,geometry,box,ball,cylinder,height:isletHeight};
for(const lot of HOME_LOTS){let count=0;for(let stage=0;stage<=4;stage++){const root=exteriorMansion(o,lot,stage,'pearl');if(stage===0)count=root.children.length;if(stage===4)assert(root.children.length>count*2,'completed property adds structure and fittings');assert(Number.isFinite(root.position.y));scene.remove(root);}}
let action;const room=mansionInterior(o,{mansion:true},id=>action=id);assert.equal(room.props.length,17);for(const p of room.props){assert(homeCanWalk(p.x,p.z,p.floor||0));assert(homePath({x:0,z:12},p).length>0);p.fn();assert.equal(action,p.id);}assert.equal(room.partitions.length,12);assert(!room.ceiling.visible);scene.updateMatrixWorld(true);scene.traverse(o=>{assert(o.matrixWorld.elements.every(Number.isFinite),'finite model transform');});assert(room.root.getObjectByName('Coco · Angelique’s dog'));materials.forEach(m=>m.dispose());geometries.forEach(g=>g.dispose());console.log('PASS three estate models/five build stages, furnished interior, seventeen usable activities on two floors, navigable doorways, dog and cutaway/full-ceiling model');

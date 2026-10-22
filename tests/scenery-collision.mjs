import assert from 'node:assert/strict';
import {fresh} from '../games/adventure/state.js';
import {createWorldCollision} from '../games/adventure/world-collision.js';
import {groundTravelStep} from '../games/adventure/travel-mode.js';
const state=fresh(),base=createWorldCollision({state});
// Use a real dry, unbuilt clearing; compare scenery against unchanged hard solids.
const p={x:0,z:0};assert(base.clear(p.x,p.z));
const fern=createWorldCollision({state,trees:[{...p,kind:'fern',size:5}]}),tree=createWorldCollision({state,trees:[{...p,kind:'palm',size:2}]}),rock=createWorldCollision({state,rocks:[{...p,r:1}]});
assert(fern.clear(0,0),'ferns are passable');assert(!tree.clear(0,0),'visible trunk stays solid');assert(tree.hardClear(0,0),'trunk is a soft contact');assert(tree.clear(.6,0),'no oversized invisible palm halo');assert(!tree.clear(.4,0));assert(!rock.hardClear(0,0),'boulders remain hard');assert(!tree.hardClear(360,-48),'building remains hard');
const clear=(x,z)=>Math.hypot(x,z)>=1,soft=(x,z)=>!clear(x,z)?{x:0,z:0}:null;
const graze=groundTravelStep(-2,.8,4,0,clear,soft);assert(graze.slid&&graze.x>1,'glancing movement slides around trunk');assert(Math.hypot(graze.x,graze.z)>=1,'no trunk penetration');assert(!graze.hit,'graze does not cause crash');
const headOn=groundTravelStep(-2,0,4,0,clear,soft);assert(headOn.hit&&headOn.softHit&&headOn.x< -1,'direct trunk contact gently stops');
const wall=(x,z)=>x<0;const hard=groundTravelStep(-2,0,4,0,wall);assert(hard.hit&&!hard.softHit&&hard.x<0,'buildings still stop swept movement');
const mixed=(x,z)=>clear(x,z)&&z<.95;const corner=groundTravelStep(-2,.8,4,0,mixed,soft);assert(corner.z<.95,'soft sliding cannot bypass another solid');
console.log('PASS passable ferns, narrow trunk contact, gentle head-on stop, glancing slide, solid rocks/buildings and no tunneling into adjacent obstacles');
const T=await import('../games/adventure/vendor/three.module.min.js'),{createForestLandscape}=await import('../games/adventure/forest-landscape.js'),{createNaturalTrees}=await import('../games/adventure/natural-trees.js');
const scene=new T.Scene(),owned=[],geometry=g=>(owned.push(g),g),mat=(color,more)=>(new T.MeshStandardMaterial({color,...more})),make=(g,m,x,y,z,w=1,h=1,d=1,parent=scene)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.scale.set(w,h,d);parent.add(o);return o;},forest=createForestLandscape({T,scene,geometry,mat,height:()=>0,light:true}),stem=scene.getObjectByName('palm mixed forest trunks'),palm=forest.trees.find(t=>t.kind==='palm'),before=new T.Matrix4(),after=new T.Matrix4();stem.getMatrixAt(0,before);const camera={position:new T.Vector3(palm.x-10,8,palm.z)};forest.updateFocus(palm.x+2,palm.z,camera);forest.updateFocus(palm.x+2,palm.z,camera);stem.getMatrixAt(0,after);assert.deepEqual(after.elements,before.elements,'forest trunks do not vanish while canopies fade');
const natural=createNaturalTrees({T,scene,geometry,mat,make,height:()=>0}),visible=natural.addTree('palm',0,0,1,0);natural.focus(visible.x+2,visible.z,{x:visible.x-10,y:5,z:visible.z});natural.update(0);assert(visible.root.visible,'individual tree trunk remains visible');assert(!visible.crown.visible,'only canopy hides from camera');owned.forEach(g=>g.dispose());
console.log('PASS instanced and individual trunks stay visible during camera canopy clearing');

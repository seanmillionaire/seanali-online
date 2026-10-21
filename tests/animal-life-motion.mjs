import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {createIslandLife} from '../games/adventure/island-life.js';
import {inWater,marineWater,roadDistance} from '../games/adventure/explore-state.js';
const scene=new T.Scene(),camera=new T.PerspectiveCamera();const life=createIslandLife({T,scene,camera,state:{world:{}},geometry:g=>g,mat:(c,o={})=>new T.MeshStandardMaterial({color:c,...o}),make:(g,m,x,y,z,sx,sy,sz,parent=scene)=>{const n=new T.Mesh(g,m);n.position.set(x,y,z);n.scale.set(sx,sy,sz);parent.add(n);return n;},ball:new T.SphereGeometry(1,8,6),cone:new T.ConeGeometry(1,1,8),box:new T.BoxGeometry(),inWater});
const group=scene.getObjectByName('Ocean wildlife');life.update(0,true,true);const starts=group.children.map(a=>a.position.clone());let distances=group.children.map(()=>0);let last=starts.map(p=>p.clone());
for(let i=0;i<600;i++){life.update(1/30,true,true);group.children.forEach((a,j)=>{distances[j]+=Math.hypot(a.position.x-last[j].x,a.position.z-last[j].z);last[j].copy(a.position);});}

assert(group.children.length>=140,'expanded ocean populations');assert(group.children.filter(a=>a.name.startsWith('Octopus')).length>=12);
for(const [i,a]of group.children.entries()){
 assert(a.visible,a.name+' visible');assert(distances[i]>.5,a.name+' continues roaming');
 assert(marineWater(a.position.x,a.position.z),a.name+' remains in marine water, outside Gatún/canal freshwater');
 assert(roadDistance(a.position.x,a.position.z)>4.75,a.name+' stays off roads');
}
// Put Angelique near each swimmer; observation must not stop forward movement.
for(const a of group.children){
 let travel=0,last=a.position.clone();
 for(let i=0;i<100;i++){life.update(.1,true,true,{x:a.position.x+3,z:a.position.z+2});travel+=Math.hypot(a.position.x-last.x,a.position.z-last.z);last.copy(a.position);}
 assert(travel>.5,a.name+' moves during ten seconds of nearby observation');
}
life.dispose();console.log('PASS '+group.children.length+' swimmers move, including nearby observation with distant culling; water/road boundaries preserved');

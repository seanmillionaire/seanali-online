import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {createGorgonaFamilies} from '../games/adventure/gorgona-families.js';
import {isletHeight,inWater} from '../games/adventure/explore-state.js';
const scene=new T.Scene(),geometry=g=>g,mat=(color,p)=>new T.MeshStandardMaterial({color,...p}),make=(geo,m,x,y,z,w,h,d,parent)=>{const g=new T.Mesh(geo,m);g.position.set(x,y,z);g.scale.set(w,h,d);parent.add(g);return g;};
const f=createGorgonaFamilies({T,scene,geometry,mat,make,box:new T.BoxGeometry(),ball:new T.SphereGeometry(),cylinder:new T.CylinderGeometry(),height:isletHeight});
f.update(0,true,{x:55,z:20});const guests=f.actors.filter(a=>a.activity==='party'),trips=guests.filter(a=>a.swimTrip);console.log('Groups',f.parties.length,'guests',guests.length,'swimmers',trips.length);assert(f.parties.length>=4);assert(guests.length>=24);assert(trips.length>=5);const seen=new Map(trips.map(a=>[a,new Set()]));
for(let i=0;i<1100;i++){f.update(.1,true,{x:55,z:20});for(const a of trips){seen.get(a).add(a.g.userData.activity);if(a.g.userData.activity==='swimming')assert(inWater(a.g.position.x,a.g.position.z));}}
for(const set of seen.values()){for(const activity of ['socializing','walking to/from water','swimming'])assert(set.has(activity));for(const activity of set)assert(['socializing','walking to/from water','swimming','wading'].includes(activity));}const positions=guests.map(a=>a.g.position.clone());f.update(5,false,{x:55,z:20});guests.forEach((a,i)=>assert(a.g.position.equals(positions[i])));f.dispose();assert.equal(scene.children.length,0);console.log('PASS socializing, shoreline walk, swimming, returning, pause and cleanup');

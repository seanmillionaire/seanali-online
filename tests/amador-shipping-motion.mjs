import {CHARTER_BERTH} from '../games/adventure/charter-navigation.js';
import {vehicleOverlap} from '../games/adventure/vehicle-contact.js';
import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {createOceanShipping} from '../games/adventure/ocean-shipping.js';
const scene=new T.Scene(),box=new T.BoxGeometry(),cylinder=new T.CylinderGeometry(1,1,1,8),ball=new T.SphereGeometry(1,8,6);
const shipping=createOceanShipping({T,scene,box,cylinder,ball,geometry:g=>g,mat:(color,o)=>new T.MeshStandardMaterial({color,...o}),make:(geo,mat,x,y,z,w,h,d,parent)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m;}});
const yachts=shipping.ships.filter(b=>b.path),visits=new Set(),departures=new Set();let maximum=0;
for(let i=0;i<15000;i++){const prev=yachts.map(b=>b.g.position.clone());shipping.update(.2,true,{x:0,z:0});for(let a=0;a<shipping.ships.length;a++)for(let b=0;b<a;b++){const hull=q=>({x:q.g.position.x,z:q.g.position.z,heading:q.g.rotation.y,length:q.r.length/2,width:q.r.width/2});assert(!vehicleOverlap(hull(shipping.ships[a]),hull(shipping.ships[b])),'ship hull overlap');}yachts.forEach((b,j)=>{assert(!vehicleOverlap({x:b.g.position.x,z:b.g.position.z,heading:b.g.rotation.y,length:b.r.length/2,width:b.r.width/2},{...CHARTER_BERTH,length:6.5,width:2.2}),'parked charter remains clear');maximum=Math.max(maximum,b.g.position.distanceTo(prev[j]));if(b.direction===-1)visits.add(j);if(visits.has(j)&&b.direction===1)departures.add(j);});}
console.log({visits:[...visits],departures:[...departures],maximum,positions:yachts.map(b=>({d:b.d,total:b.total,hold:b.hold,x:b.g.position.x,z:b.g.position.z}))});assert(maximum<1);assert.equal(visits.size,4);assert.equal(departures.size,4);shipping.dispose();console.log('PASS actual shipping owner: bounded movement and all four visit/depart');

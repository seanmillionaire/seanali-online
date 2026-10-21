import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {createCanalCruise} from '../games/adventure/canal-cruise.js';
import {freshExplore,inWater,isletHeight,coinBalance} from '../games/adventure/explore-state.js';
import {CRUISE_BOARD} from '../games/adventure/cruise-route.js';
class Element{constructor(){this.style={};this.classList={toggle(){},remove(){}};}append(){}setAttribute(){}remove(){}getContext(){return {fillRect(){},fillText(){}};}}
globalThis.document={createElement:()=>new Element()};
const scene=new T.Scene(),state={lang:'en',world:freshExplore(),wallet:{rewards:Array.from({length:5},(_,i)=>'city-bag-'+i),items:[]}},host=new Element(),geometries=[],materials=[];
const box=new T.BoxGeometry(),ball=new T.SphereGeometry(1,8,6),cylinder=new T.CylinderGeometry(1,1,1,8),mat=color=>new T.MeshStandardMaterial({color}),make=(geo,m,x,y,z,sx,sy,sz,parent=scene)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;};
const cruise=createCanalCruise({T,scene,host,state,make,mat,box,ball,cylinder,height:isletHeight,save(){},refresh(){},joy:{effect(){},gesture(){}},tell(){}});
for(let i=0;i<150;i++)cruise.update(.1,true);assert(cruise.ambientDistance>0,'single ship departs automatically');const dist=cruise.ambientDistance;cruise.update(1,false);assert.equal(cruise.ambientDistance,dist,'ambient cruise respects pause');
Object.assign(state.world,CRUISE_BOARD);assert.equal(cruise.board(),false,'no teleport to a moving vessel');assert.equal(state.world.city.cruise.tickets,0,'queued ticket not charged');const before=coinBalance(state);let boarded=false;
for(let i=0;i<5000;i++){
 const result=cruise.update(.1,true),p=cruise.ship.position,a=cruise.ship.rotation.y;
 for(const f of [-17,0,18])for(const s of [-6,0,6])assert(inWater(p.x+Math.sin(a)*f+Math.cos(a)*s,p.z+Math.cos(a)*f-Math.sin(a)*s),'ambient turning hull stays in water');
 if(result.active){boarded=true;break;}
}
assert(boarded,'waiting passenger boards on return');assert.equal(state.world.city.cruise.tickets,1);assert.equal(coinBalance(state),before-10);assert.equal(cruise.ambientDistance,0);assert.equal(cruise.root.children.filter(o=>o.name==='Angelique · enormous Panama cruise ship').length,1);
cruise.dispose();console.log('PASS one moving canal liner, idle departures, full-hull clearance throughout transit, pause, queued boarding on return and exactly one fare');

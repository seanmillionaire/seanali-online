import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {createGunaCommunity} from '../games/adventure/guna-community.js';
import {createChiriquiLife} from '../games/adventure/chiriqui-life.js';
import {freshExplore,isletHeight,inWater,roadDistance} from '../games/adventure/explore-state.js';
const scene=new T.Scene(),geometries=[],materials=[],geometry=g=>(geometries.push(g),g),mat=(c,o={})=>{const m=new T.MeshStandardMaterial({color:c,...Object.fromEntries(Object.entries(o).filter(([,v])=>v!==undefined))});materials.push(m);return m;},box=geometry(new T.BoxGeometry()),ball=geometry(new T.SphereGeometry(1,10,8)),cylinder=geometry(new T.CylinderGeometry(1,1,1,10)),make=(g,m,x=0,y=0,z=0,w=1,h=w,d=w,parent=scene)=>{const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh;};
const state={world:freshExplore()},options={T,scene,geometry,mat,box,ball,cylinder,make,height:isletHeight,state,models:{meal(parent){const g=new T.Group();parent.add(g);return g;}},forest:{trees:[]}};let eaten=0;const community=createGunaCommunity({...options,onEat(){eaten++;}});assert.equal(community.actors.length,6);for(const a of community.actors)assert(!inWater(a.x,a.z));for(let frame=0;frame<1800;frame++){
 community.update(1/60,true,{x:530,z:-429});
 for(let i=0;i<6;i++){
  const a=community.actors[i],b=community.actors[i^1],delta=b.g.position.clone().sub(a.g.position);delta.y=0;
  assert(delta.length()>1,'partners keep comfortable spacing');
  assert(new T.Vector3(Math.sin(a.g.rotation.y),0,Math.cos(a.g.rotation.y)).dot(delta.normalize())>.99,'partners face each other');
  assert(!inWater(a.g.position.x,a.g.position.z),'steps stay on land');
  for(let j=i+1;j<6;j++)assert(a.g.position.distanceTo(community.actors[j].g.position)>.65,'couples never overlap');
 }
}
assert.notEqual(community.actors[0].legs[0].rotation.x,community.actors[2].legs[0].rotation.x,'couples have independent timing');
const paused=community.actors.map(a=>a.g.position.toArray());community.update(5,false,{x:530,z:-429});assert.deepEqual(community.actors.map(a=>a.g.position.toArray()),paused);
assert.equal(community.interact(),'dance');community.update(9,true,{x:530,z:-429});assert(community.readyMeal);assert.equal(community.interact(),'meal');community.update(3.1,true,{x:530,z:-429});assert.equal(eaten,1);assert.equal(state.world.panama.meals,1);assert(!community.joined);community.interact();community.pose({avatar:new T.Group(),arms:[],legs:[],moving:true,allowed:true});assert(!community.joined);for(const [dayTime,visible] of [[9.99,false],[10,true],[129.99,true],[130,false],[230,false]]){state.world.dayTime=dayTime;community.update(.01,true,{x:530,z:-429});assert.equal(community.root.visible,visible);assert.equal(community.near(530,-429),visible);if(!visible)assert(!community.joined);}community.dispose();
const farms=createChiriquiLife(options);for(const kind of ['cow','rooster','snake','iguana'])assert(farms.animals.some(a=>a.kind===kind));for(const a of farms.animals){assert(!inWater(a.x,a.z));assert(roadDistance(a.x,a.z)>12);}farms.update(.1,true,{x:-390,z:-70});farms.dispose();console.log('PASS Guna dry dance placement, join/meal reward/exit and Chiriquí animal types/dry road clearance');

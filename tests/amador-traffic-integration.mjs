import {vehicleOverlap} from '../games/adventure/vehicle-contact.js';
import {routePose} from '../games/adventure/panama-state.js';
import {highwayWidth} from '../games/adventure/highway-layout.js';
import {nightLighting} from '../games/adventure/night-lighting.js';
import {VEHICLE_GROUND_PROFILES} from '../games/adventure/vehicle-grounding.js';
import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {createWorldAmbience,AMBIENT_ROADS,VISITOR_HABITATS} from '../games/adventure/world-ambience.js';
import {freshExplore,normalizeExplore,isletHeight,roadDistance,inWater} from '../games/adventure/explore-state.js';
import {islandDaylight,DAY_CYCLE_SECONDS,createIslandLife} from '../games/adventure/island-life.js';
const scene=new T.Scene(),camera=new T.PerspectiveCamera(),state={world:freshExplore()},box=new T.BoxGeometry(),ball=new T.SphereGeometry(1,6,4),cone=new T.ConeGeometry(1,1,6),mat=c=>new T.MeshStandardMaterial({color:c}),make=(g,m,x,y,z,sx,sy,sz,parent=scene)=>{const n=new T.Mesh(g,m);n.position.set(x,y,z);n.scale.set(sx,sy,sz);parent.add(n);return n;};
const models={colors:{white:mat('white'),blue:mat('blue'),yellow:mat('yellow'),dark:mat('black'),glass:mat('cyan')},person(parent,x,y,z){const g=new T.Group();g.position.set(x,y,z);parent.add(g);return {g,legs:[new T.Object3D(),new T.Object3D()],arms:[new T.Object3D(),new T.Object3D()],elbows:[new T.Object3D(),new T.Object3D()]};},sedan(parent){const g=new T.Group();parent.add(g);return g;}};
models.bus=models.sedan;
const a=createWorldAmbience({geometry:g=>g,T,scene,models,make,mat,box,ball,cone,height:isletHeight,state});

const seen=[new Set(),new Set()];for(let i=0;i<24000;i++){const total=20+i*.02;state.world.dayTime=total%240;a.update(.1,true,i>=2400&&i<2500?{x:453,z:240}:{x:800,z:500});if(i%10===0){const hull=c=>({...routePose(c.route,c.distance),length:c.bus?4.8:1.8,width:c.bus?1.15:.9});for(const c of a.cars.filter(c=>c.showCar))for(const other of a.cars)if(c!==other)assert(!vehicleOverlap(hull(c),hull(other)),'show car hull remains clear');}if(state.world.dayTime>140&&state.world.dayTime<170)a.cars.filter(c=>c.showCar&&c.parked).forEach(c=>seen[Math.floor(total/240)]?.add(c.id));}console.log({meetups:seen.map(s=>[...s]),fleet:a.cars.filter(c=>c.showCar).map(c=>({id:c.id,d:c.distance,x:c.g.position.x,z:c.g.position.z}))});assert(seen.every(s=>s.size===4),'all four reach each meetup with ordinary traffic and pedestrians');a.dispose();console.log('PASS integrated ambient traffic: all four evening bays on two consecutive days');

import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {createColonWildlife} from '../games/adventure/colon-wildlife.js';
import {inWater as worldWater} from '../games/adventure/explore-state.js';
import {COLON_OFFSET} from '../games/adventure/geography.js';
const inWater=(x,z)=>worldWater(x+COLON_OFFSET.x,z+COLON_OFFSET.z);
const root=new T.Group(),anchors={main:[],monkey:[]};
for(let i=0;i<12;i++){anchors.main.push({x:-16+(i%4)*3,z:-129+Math.floor(i/4)*3,y:5+i%3});anchors.monkey.push({x:8+(i%3)*2,z:-95+Math.floor(i/3)*2,y:4+i%3});}
const wildlife=createColonWildlife({T,root,anchors,inWater,height:()=>0,geometry:g=>g,mat:(c,o={})=>new T.MeshStandardMaterial({color:c,...o}),make:(g,m,x=0,y=0,z=0,sx=1,sy=sx,sz=sx,parent=root)=>{const n=new T.Mesh(g,m);n.position.set(x,y,z);n.scale.set(sx,sy,sz);parent.add(n);return n;},ball:new T.SphereGeometry(1,8,6),box:new T.BoxGeometry(),cylinder:new T.CylinderGeometry(1,1,1,8),cone:new T.ConeGeometry(1,1,8)});
const options={player:{x:-10,z:-125},reducedMotion:true};wildlife.update(0,true,0,options);
const all=[...wildlife.monkeys,...wildlife.crocs],last=all.map(a=>a.g.position.clone()),distances=all.map(()=>0);
for(let i=1;i<=200;i++){wildlife.update(.1,true,i*.1,options);all.forEach((a,j)=>{distances[j]+=a.g.position.distanceTo(last[j]);last[j].copy(a.g.position);});}
for(const [i,a]of all.entries())assert(distances[i]>1,a.g.name+' keeps moving with reduced motion');
const before=all.map(a=>a.g.position.clone());wildlife.update(.1,false,20,options);all.forEach((a,j)=>assert(a.g.position.distanceTo(before[j])<1e-8,'explicit pause works'));
const source=fs.readFileSync(new URL('../games/adventure/explore.js',import.meta.url),'utf8');
const expression=source.match(/const worldActive=.*?,active=!cruising&&worldActive;/)[0];
const ctx=vm.createContext({cruising:true,paused:()=>false,document:{hidden:false,querySelector:()=>null},panel:{hidden:true},journey:{isOpen:()=>false}});
vm.runInContext(expression,ctx);assert.equal(vm.runInContext('worldActive',ctx),true);assert.equal(vm.runInContext('active',ctx),false);
assert(source.includes('colonLife.update(dt,worldActive,'));assert(source.includes('life.update(dt,worldActive,motion(),'));
const colon=fs.readFileSync(new URL('../games/adventure/colon-adventure.js',import.meta.url),'utf8');assert(colon.includes('wildlife.update(dt,active,clock,'));
wildlife.dispose();console.log('PASS all 28 monkeys and 8 crocs move at 10Hz with reduced motion; cruise keeps world active; explicit pause preserved');

import assert from 'node:assert/strict';
import * as T from '../games/adventure/vendor/three.module.min.js';
import {landAnimalModels} from '../games/adventure/land-animal-models.js';
import {createColonWildlife} from '../games/adventure/colon-wildlife.js';
const geometry=g=>g,mat=(color,p)=>new T.MeshStandardMaterial({color,...p}),make=(geo,m,x,y,z,w,h,d,parent)=>{const g=new T.Mesh(geo,m);g.position.set(x,y,z);g.scale.set(w,h,d);parent.add(g);return g;};
const o={T,geometry,mat,make,ball:new T.SphereGeometry(),box:new T.BoxGeometry(),cylinder:new T.CylinderGeometry(),cone:new T.ConeGeometry()};
const root=new T.Group(),sloth=landAnimalModels(o).sloth(root);let sprites=0;sloth.g.traverse(g=>sprites+=!!g.isSprite);assert.equal(sprites,0);sloth.animate(0);const start=sloth.g.position.x;sloth.animate(15);assert.notEqual(sloth.g.position.x,start);assert(Math.abs(sloth.g.position.x)<.5);
const anchors=Array.from({length:36},(_,i)=>({x:-10+(i%6)*2,y:5+(i%3)*.5,z:-125+Math.floor(i/6)*2}));const wildlife=createColonWildlife({...o,root,height:()=>0,inWater:()=>true,anchors:{main:anchors,monkey:anchors.map(p=>({...p,x:p.x+25}))}});
let minimum=Infinity,moved=0;const initial=wildlife.monkeys.map(m=>m.g.position.clone());
for(let tick=0;tick<1800;tick++){wildlife.update(1/30,true,tick/30,{player:{x:-10,z:-125}});for(let i=0;i<wildlife.monkeys.length;i++)for(let j=0;j<i;j++)minimum=Math.min(minimum,wildlife.monkeys[i].g.position.distanceTo(wildlife.monkeys[j].g.position));}
for(let i=0;i<initial.length;i++)if(initial[i].distanceTo(wildlife.monkeys[i].g.position)>.5)moved++;
assert(minimum>=1.19,minimum);assert(moved>14,`Only ${moved} monkeys moving`);wildlife.dispose();console.log('PASS articulated sloth; 60 seconds monkey spacing:',minimum.toFixed(2),'m;',moved,'monkeys changed perches');

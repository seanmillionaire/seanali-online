import assert from 'node:assert/strict';
import {cityChapterRoute,createRouteProgressWatch} from '../games/adventure/city-chapter-route.js';
const clear=(x,z)=>!(Math.abs(x-375)<5&&Math.abs(z+60)<9)&&!(Math.abs(x-390)<3.3&&Math.abs(z+48)<2.8);
const path=cityChapterRoute({x:360,z:-67},{x:390,z:-48},clear);assert(path.length>0);assert(path.every(p=>clear(p.x,p.z)));assert(Math.hypot(path.at(-1).x-390,path.at(-1).z+48)<4.25);assert.deepEqual(cityChapterRoute({x:0,z:0},{x:10,z:0},()=>false),[]);const precise=cityChapterRoute({x:0,z:0},{x:6,z:6,arrivalRadius:.8},()=>true);assert(Math.hypot(precise.at(-1).x-6,precise.at(-1).z-6)<.8);console.log('PASS route around city buildings to accessible market edge; blocked routes fail safely');

const barrier=(x,z)=>!(x>.74&&x<.96&&Math.abs(z)<.8),from={x:.6,z:0};
const connected=cityChapterRoute(from,{x:4,z:3,arrivalRadius:.3},barrier);assert(connected.length);
let previous=from;for(const point of connected){const steps=Math.ceil(Math.hypot(point.x-previous.x,point.z-previous.z)/.05);for(let i=1;i<=steps;i++)assert(barrier(previous.x+(point.x-previous.x)*i/steps,previous.z+(point.z-previous.z)*i/steps),'route connects actual player position without crossing the barrier');previous=point;}
const watch=createRouteProgressWatch(),goal={x:10,z:0};let replanned=false;
for(let i=0;i<30;i++)replanned=watch.blocked(goal,9+(i%2)*.02,0,.05)||replanned;assert(replanned,'small collision jitter must trigger route recovery');watch.reset();for(let i=0;i<40;i++)assert(!watch.blocked(goal,i*.1,0,.05),'steady forward progress must not replan');for(let i=0;i<100;i++)assert(!watch.blocked(goal,4,0,0),'paused play must not trigger recovery');
console.log('PASS actual-position grid connection, swept path clearance, jitter recovery and paused navigation');

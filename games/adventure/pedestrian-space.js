import {vehicleEscapeClear,vehicleOverlap} from './vehicle-contact.js';
const spaces=new WeakMap();
export function pedestrianSpace(scene){
 if(spaces.has(scene))return spaces.get(scene);
 const people=new Set();
 const near=(x,z,r=12)=>{const out=[];for(const p of people){const g=p.g;if(!g.visible)continue;let parent=g.parent,visible=true;while(parent){if(!parent.visible){visible=false;break;}parent=parent.parent;}if(!visible)continue;const dx=g.position.x-x,dz=g.position.z-z;if(dx*dx+dz*dz<r*r)out.push({x:g.position.x,z:g.position.z,heading:g.rotation.y,length:.42,width:.42,pedestrian:true});}return out;};
 const api={add(p){people.add(p);return p;},remove(p){people.delete(p);},near,clear(p,from){return near(p.x,p.z,7).every(q=>from?vehicleEscapeClear(p,q,from):!vehicleOverlap(p,q));}};spaces.set(scene,api);return api;
}

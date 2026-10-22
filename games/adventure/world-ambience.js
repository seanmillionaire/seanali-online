import {placeGroundVehicle} from './vehicle-grounding.js';
import {ownedCars} from './estate-cars.js';
import {trafficYield} from './traffic-yield.js?v=225';
import {FOUR_LANE_ROADS,highwayLane} from './highway-layout.js?v=225';
import {vehicleOverlap} from './vehicle-contact.js?v=225';
import {regionalBlocked} from './regional-layout.js?v=225';
import {HIGHWAY_CURVES,roadDistance,HIGHWAY_WIDTH,worldIslands,inWater,traversable,isletHeight} from './explore-state.js?v=225';
import {ruralBlocks} from './rural-towns.js?v=225';
import {estateBlocked} from './estate.js?v=225';
import {routePose} from './panama-state.js?v=225';

// Return along the opposite lane, turning inside the road at each terminus.
export function trafficLoop(points,lane=1.8){
 const laneAt=i=>typeof lane==='function'?lane(...points[i]):lane;
 const side=(i)=>{const a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],d=Math.hypot(b[0]-a[0],b[1]-a[1])||1;return {x:(b[1]-a[1])/d,z:-(b[0]-a[0])/d};};
 const path=points.map((p,i)=>{const n=side(i),lane=laneAt(i);return {x:p[0]+n.x*lane,z:p[1]+n.z*lane};});
 function turn(i,sign){const p=points[i],n=side(i),lane=laneAt(i);for(let j=1;j<=12;j++){const a=(sign<0?Math.PI:0)+j*Math.PI/12;path.push({x:p[0]+lane*(n.x*Math.cos(a)+-n.z*Math.sin(a)),z:p[1]+lane*(n.z*Math.cos(a)+n.x*Math.sin(a))});}}
 turn(points.length-1,1);
 for(let i=points.length-2;i>=0;i--){const n=side(i),lane=laneAt(i);path.push({x:points[i][0]-n.x*lane,z:points[i][1]-n.z*lane});}
 turn(0,-1);return path;
}
export const AMBIENT_ROADS=['cityToGorgona','gorgonaBeachAccess','cityToColon','cityToBaru','panamaEast'];
export const VISITOR_HABITATS=[{id:'Gorgona beach',x:4,z:10,rx:13,rz:3},{id:'Nueva Gorgona town',x:-55,z:-8,rx:34,rz:12},{id:'Gorgona western beach',x:-48,z:15,rx:24,rz:3},
 ...worldIslands.filter(p=>!['sunset','pizzaCity','monkeyIslet'].includes(p.id)&&(!p.guna||p.community)).map(p=>({id:p.en||p.id,x:p.x,z:p.z,rx:p.rx*.76,rz:p.rz*.76})),
 {id:'Boquete walkers',x:-290,z:-42,rx:18,rz:16},{id:'Volcán visitors',x:-385,z:-18,rx:18,rz:14}].filter(h=>!h.id.startsWith('Gorgona')&&h.id!=='Nueva Gorgona town'&&h.id!=='Playa Gorgona');

export function createWorldAmbience({T,scene,models,make,mat,box,ball,cone,height,roadHeight=height,state,forest}){
 const root=new T.Group();root.name='Living Panama · visitors traffic and flyovers';scene.add(root);
 const cars=[],people=[],routes=AMBIENT_ROADS.flatMap(id=>(FOUR_LANE_ROADS.has(id)?[0,1]:[0]).map(lane=>({id,lane,path:trafficLoop(HIGHWAY_CURVES[id],(x,z)=>highwayLane(id,lane,x,z))})));
 for(const r of routes){const total=routePose(r.path,0).length,count=r.id==='gorgonaBeachAccess'?2:r.id==='panamaEast'?2:4;
  for(let i=0;i<count;i++){const bus=r.id!=='gorgonaBeachAccess'&&i===0,g=bus?models.bus(root):models.sedan(root,false,i%3===0);g.name=(bus?'Diablo Rojo route · ':'Roaming car · ')+r.id+' '+(i+1);cars.push({g,route:r.path,distance:total*(i+.2)/count,bus,speed:r.id==='gorgonaBeachAccess'?4:7+i*.65,id:r.id});}}
 // Keep each walk on dry, unobstructed ground with room for the whole body.
 function clear(x,z){
  if(regionalBlocked(x,z,state.world,.65)||inWater(x,z)||!traversable(x,z)||roadDistance(x,z)<HIGHWAY_WIDTH/2+1||ruralBlocks(x,z,.65)||estateBlocked(state.world,x,z))return false;
  if(forest?.trees.some(t=>Math.hypot(t.x-x,t.z-z)<.8+t.scale*.35))return false;
  const y=height(x,z);return [[.55,0],[-.55,0],[0,.55],[0,-.55]].every(([dx,dz])=>!inWater(x+dx,z+dz)&&Math.abs(height(x+dx,z+dz)-y)<.38);
 }
 for(const [hi,h]of VISITOR_HABITATS.entries()){
  if(h.id.startsWith('Gorgona')||h.id==='Nueva Gorgona town'||h.id==='Playa Gorgona')continue; // Dedicated families now use this beach.
  const count=h.rx>15?3:2;
  for(let k=0;k<count;k++){
   let spawn=null;
   for(let n=0;n<90;n++){const a=(n+k*23+hi*11)*2.399963,r=.35+(n%9)*.065,x=h.x+Math.cos(a)*h.rx*r,z=h.z+Math.sin(a)*h.rz*r;
    if(clear(x,z)&&people.every(p=>Math.hypot(p.g.position.x-x,p.g.position.z-z)>1.6)){spawn={x,z};break;}}
   if(!spawn)continue;
   const p=models.person(root,spawn.x,height(spawn.x,spawn.z),spawn.z,k+hi);p.g.name='Visitor · '+h.id+' '+(k+1);p.habitat=h;p.index=people.length;p.home=spawn;p.seed=1231+p.index*7919;p.goal=null;p.wait=k*1.4;p.walk=0;
   // Sunhats and cameras make tourists readable from the normal play camera.
   if(k%2===0){if(p.hat)p.hat.visible=true;make(box,models.colors.dark,0,1.16,.17,.12,.075,.06,p.g);}
   if(k===count-1){p.g.scale.setScalar(.75);p.child=true;}
   people.push(p);
  }
 }
 const plane=new T.Group();plane.name='Occasional passenger plane';root.add(plane);const white=models.colors.white,blue=models.colors.blue;
 make(ball,white,0,0,0,1,.85,5.4,plane);make(box,white,0,0,-.5,11,.18,1.6,plane);make(box,blue,0,.25,-4,4,.15,1,plane);make(box,blue,0,1,-4,.15,2,1.8,plane);make(ball,models.colors.glass,0,.35,4,.65,.4,.7,plane);
 for(const sign of [-1,1])make(ball,blue,sign*2.8,-.5,.1,.4,.42,1.2,plane);
 plane.scale.setScalar(2.8);plane.visible=false;let clock=0,flyAt=45,flight=null,flights=0;
 const random=p=>{p.seed=(p.seed*1664525+1013904223)>>>0;return p.seed/4294967296;};
 function update(dt,active,{x=0,z=0,indoors=false}={}){
  root.visible=!indoors;if(!active)return;dt=Math.max(0,Math.min(dt,.1));clock+=dt;
  // Simulation continues off camera, so arriving in another town reveals moving life.
  const poses=cars.map(c=>routePose(c.route,c.distance));
  cars.forEach((c,i)=>{const p=poses[i],ahead=(q)=>{const dx=q.x-p.x,dz=q.z-p.z;return dx*Math.sin(p.heading)+dz*Math.cos(p.heading)>0&&Math.hypot(dx,dz)<(c.bus?12:9)&&Math.abs(dx*Math.cos(p.heading)-dz*Math.sin(p.heading))<1.8;};
   const blocked=(!indoors&&ahead({x,z}))||poses.some((q,j)=>j!==i&&ahead(q)&&(Math.cos(q.heading-p.heading)>.5||j<i));
   const yielding=trafficYield(c,cars,ownedCars(state.world.city),dt);const next=routePose(c.route,c.distance+dt*c.speed);if(yielding!==null)c.distance=yielding;else if(!blocked&&ownedCars(state.world.city).every(p=>!vehicleOverlap({...next,length:c.bus?4.8:1.8,width:c.bus?1.15:.9},p)))c.distance+=dt*c.speed;
   const q=routePose(c.route,c.distance);placeGroundVehicle(c.g,q,roadHeight,c.bus?'bus':'sedan');
   const detail=c.g.userData.visualDetail;if(detail)detail.visible=Math.hypot(q.x-x,q.z-z)<28;c.g.visible=Math.hypot(q.x-x,q.z-z)<155;
  });
  for(const p of people){const pos=p.g.position,near=Math.hypot(pos.x-x,pos.z-z);p.g.visible=near<105;
   // Revalidate after player construction; never place a visitor inside a new home.
   if(!clear(pos.x,pos.z)){p.g.visible=false;p.goal=null;continue;}
   let moving=false;
   if(p.wait>0)p.wait-=dt;
   else{
    if(!p.goal){for(let j=0;j<10;j++){const a=random(p)*Math.PI*2,d=2+random(p)*5,tx=pos.x+Math.sin(a)*d,tz=pos.z+Math.cos(a)*d,h=p.habitat;
      if(Math.hypot((tx-h.x)/h.rx,(tz-h.z)/h.rz)<1&&clear(tx,tz)&&Array.from({length:12},(_,i)=>clear(pos.x+(tx-pos.x)*(i+1)/12,pos.z+(tz-pos.z)*(i+1)/12)).every(Boolean)){p.goal={x:tx,z:tz};break;}}
     if(!p.goal)p.wait=2+random(p)*3;
    }
    if(p.goal){const dx=p.goal.x-pos.x,dz=p.goal.z-pos.z,d=Math.hypot(dx,dz),step=Math.min(d,dt*(p.child?1.05:.65));
     if(d<.12){p.goal=null;p.wait=3+random(p)*8;}
     else{const nx=pos.x+dx/d*step,nz=pos.z+dz/d*step;
      if(clear(nx,nz)&&people.every(q=>q===p||Math.hypot(q.g.position.x-nx,q.g.position.z-nz)>.8)&&(indoors||Math.hypot(nx-x,nz-z)>1)){
       pos.set(nx,height(nx,nz),nz);const heading=Math.atan2(dx,dz);p.g.rotation.y+=Math.atan2(Math.sin(heading-p.g.rotation.y),Math.cos(heading-p.g.rotation.y))*Math.min(1,dt*4);p.walk+=dt*5;moving=true;
      }else{p.goal=null;p.wait=1.5;}
     }
    }
   }
   p.animate?.(p.walk,moving);p.legs.forEach((l,j)=>l.rotation.x=moving?Math.sin(p.walk+j*Math.PI)*.4:0);
   p.arms.forEach((a,j)=>a.rotation.x=moving?-Math.sin(p.walk+j*Math.PI)*.2:p.index%3===0?-.9:0);
  }
  if(!flight&&clock>=flyAt){const angle=(flights++*1.7+.45),dx=Math.cos(angle),dz=Math.sin(angle);flight={t:0,x,z,dx,dz,y:Math.max(110,height(x,z)+95)};plane.rotation.y=Math.atan2(dx,dz);}
  if(flight){flight.t+=dt;const d=-280+flight.t*15;plane.position.set(flight.x+flight.dx*d,flight.y,flight.z+flight.dz*d);plane.visible=Math.hypot(plane.position.x-x,plane.position.z-z)<400;
   if(d>310){flight=null;plane.visible=false;flyAt=clock+150+(flights%3)*20;}}
 }
 update(0,true,{x:state.world.x,z:state.world.z});
 return {root,cars,people,plane,clear,update,get clock(){return clock;},dispose(){scene.remove(root);}};
}

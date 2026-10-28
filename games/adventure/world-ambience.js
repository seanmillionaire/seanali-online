import {initializeShowFleet,showCarAdvance,finishShowCarStep} from './amador-fleet.js';
import {pedestrianSpace} from './pedestrian-space.js';
import {flightAltitude,clearFlightAltitude} from './plane-clearance.js';
import {setHumanAge} from './character-model.js';
import {createResidentRoutine} from './resident-routine.js';
import {homeReserved} from './mansion-state.js';
import {placeGroundVehicle} from './vehicle-grounding.js';
import {ownedCars} from './estate-cars.js';
import {trafficJamStep} from './traffic-yield.js';
import {FOUR_LANE_ROADS,highwayLane} from './highway-layout.js';
import {regionalBlocked} from './regional-layout.js';
import {HIGHWAY_CURVES,roadDistance,HIGHWAY_WIDTH,worldIslands,inWater,traversable,isletHeight} from './explore-state.js';
import {ruralBlocks} from './rural-towns.js';
import {estateBlocked} from './estate.js';
import {routePose} from './panama-state.js';

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
export const AMBIENT_ROADS=['cityToGorgona','cityToColon','cityToBaru','panamaEast','amador'];
export const VISITOR_HABITATS=[{id:'Gorgona beach',x:4,z:10,rx:13,rz:3},{id:'Nueva Gorgona town',x:-55,z:-8,rx:34,rz:12},{id:'Gorgona western beach',x:-48,z:15,rx:24,rz:3},
 ...worldIslands.filter(p=>!['sunset','pizzaCity','monkeyIslet'].includes(p.id)&&(!p.guna||p.community)).map(p=>({id:p.en||p.id,x:p.x,z:p.z,rx:p.rx*.38,rz:p.rz*.38})),
 {id:'Boquete walkers',x:-290,z:-42,rx:18,rz:16},{id:'Volcán visitors',x:-385,z:-18,rx:18,rz:14}].filter(h=>!h.id.startsWith('Gorgona')&&h.id!=='Nueva Gorgona town'&&h.id!=='Playa Gorgona');

export function createWorldAmbience({T,scene,models,make,mat,geometry,box,ball,cone,height,roadHeight=height,state,forest,otherTraffic=()=>[]}){
 const root=new T.Group();root.name='Living Panama · visitors traffic and flyovers';scene.add(root);
 const cars=[],people=[],routes=AMBIENT_ROADS.flatMap(id=>(FOUR_LANE_ROADS.has(id)?[0,1]:[0]).map(lane=>({id,lane,path:trafficLoop(id==='cityToGorgona'?[...HIGHWAY_CURVES.cityToGorgona,...HIGHWAY_CURVES.gorgonaBeachAccess.slice(1)]:id==='cityToBaru'?[...HIGHWAY_CURVES.cityToGorgona,...HIGHWAY_CURVES.cityToBaru.slice(1)]:HIGHWAY_CURVES[id],(x,z)=>id==='cityToGorgona'&&HIGHWAY_CURVES.gorgonaBeachAccess.some(p=>p[0]===x&&p[1]===z)?1.8:highwayLane(id,lane,x,z))})));
 for(const r of routes){const total=routePose(r.path,0).length,count=1;
  for(let i=0;i<count;i++){const bus=r.id!=='amador'&&r.id!=='gorgonaBeachAccess'&&r.lane===0&&i===0,g=bus?models.bus(root):models.sedan(root,false,(i+r.lane)%3===0);g.name=(bus?'Diablo Rojo route · ':'Roaming car · ')+r.id+' '+(i+1);cars.push({g,route:r.path,distance:total*((i+.12+r.lane*.43+.17*Math.sin(i*2.39+r.id.length))/count),bus,speed:r.id==='gorgonaBeachAccess'?3.6+i*.55:6.4+((i*7+r.lane*3+r.id.length)%11)*.23,id:r.id});}}
 const showCars=initializeShowFleet({models,root,state,trafficLoop});cars.push(...showCars);const pedestrians=pedestrianSpace(scene);
 // A bounded reservation at shared forks prevents opposing turns from
 // entering together. This uses the same cars and swept avoidance owner.
 const junctions=[[50,-20],[247.30208285298175,-29.92481075453291],[251.3685015438629,-99.50282286315745],[-10,-370],[345,-35],[453,240],[-370,-108]].map(([x,z],i)=>({x,z,r:i===3?55:i===0||i===6?40:20,owner:null}));
 const junctionDistance=(j,p)=>Math.hypot(p.x-j.x,p.z-j.z);
 for(const c of cars)if(!c.showCar){let n=0;while(junctions.some(j=>junctionDistance(j,routePose(c.route,c.distance))<j.r+14)&&n++<200)c.distance+=2;}
 // Keep each walk on dry, unobstructed ground with room for the whole body.
 function clear(x,z){
  if(homeReserved(x,z,1)||regionalBlocked(x,z,state.world,.65)||inWater(x,z)||!traversable(x,z)||roadDistance(x,z)<HIGHWAY_WIDTH/2+1||ruralBlocks(x,z,.65)||estateBlocked(state.world,x,z))return false;
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
   const p=models.person(root,spawn.x,height(spawn.x,spawn.z),spawn.z,k+hi);p.g.name='Resident · '+h.id+' '+(k+1);p.habitat=h;p.index=people.length;p.home=spawn;p.seed=1231+p.index*7919;p.goal=null;p.wait=k*1.4;p.walk=0;
   // Residents stay near their neighborhood; families include a younger walker.
   if(k===count-1){setHumanAge(p,'kid',p.index);p.child=true;}
   p.routine=createResidentRoutine(p,{seed:p.seed,home:spawn,height,radius:7,speed:p.child?1.05:.75,clear:(x,z)=>clear(x,z)&&Math.hypot((x-h.x)/h.rx,(z-h.z)/h.rz)<1});people.push(p);
  }
 }
 const plane=new T.Group();plane.name='Occasional passenger plane';root.add(plane);const white=models.colors.white,blue=models.colors.blue;
 // Tapered swept wings, individual cabin windows, nacelles and navigation lights.
 make(ball,white,0,0,0,1,.85,5.4,plane);make(ball,models.colors.glass,0,.35,4,.65,.4,.7,plane);
 const wing=(side,z,span,chord)=>{const shape=new T.Shape();shape.moveTo(0,0);shape.lineTo(side*span,-chord*1.6);shape.lineTo(side*span,-chord*1.9);shape.lineTo(0,-chord);shape.closePath();const geo=geometry(new T.ExtrudeGeometry(shape,{depth:.10,bevelEnabled:false}));geo.rotateX(Math.PI/2);const g=make(geo,white,0,0,z,1,1,1,plane);g.name='Swept lifting surface';};
 for(const side of [-1,1]){wing(side,1,5.5,1.3);wing(side,-3.3,2.3,.7);
  make(box,blue,side*5.35,.35,-1.15,.09,.8,.5,plane).rotation.z=-side*.15;
  for(let i=0;i<15;i++){const z=3.3-i*.43,w=Math.sqrt(Math.max(.1,1-z*z/30));make(ball,models.colors.glass,side*w*.98,.24,z,.025,.12,.095,plane).name='Recessed passenger window';}
  for(const z of [3.65,-2.9]){make(box,blue,side*.89,-.04,z,.025,.66,.34,plane).name='Cabin door outline';make(box,white,side*.91,-.04,z,.028,.60,.28,plane);}
  make(ball,white,side*2.8,-.6,.3,.49,.5,1.25,plane).name='Engine nacelle';
  const ring=make(geometry(new T.TorusGeometry(.36,.055,8,20)),white,side*2.8,-.6,1.36,1,1,1,plane);ring.name='Engine intake rim';make(ball,models.colors.glass,side*2.8,-.6,1.34,.32,.32,.04,plane);
  for(let j=0;j<8;j++){const blade=make(box,blue,side*2.8,-.6,1.39,.035,.59,.025,plane);blade.rotation.z=j*Math.PI/8;}
  for(let i=0;i<3;i++)make(box,blue,side*(1.8+i),-.11,-1.2-i*.25,.06,.05,.8,plane).name='Flap track fairing';
  make(ball,side<0?mat('#e5413d',{emissive:'#e5413d'}):mat('#42c56d',{emissive:'#42c56d'}),side*5.5,.08,-1.2,.09,.07,.09,plane).name='Wingtip navigation light';
 }
 make(box,blue,0,1,-4,.15,2,1.8,plane);make(box,white,0,.9,1.5,.045,.4,.2,plane).name='Communications antenna';
 plane.scale.setScalar(2.8);plane.visible=false;let clock=0,flyAt=45,flight=null,flights=0;

 const random=p=>{p.seed=(p.seed*1664525+1013904223)>>>0;return p.seed/4294967296;};
 function update(dt,active,{x=0,z=0,y=height(x,z),indoors=false}={}){
  root.visible=!indoors;if(!active)return;dt=Math.max(0,Math.min(dt,.1));clock+=dt;
  // Simulation continues off camera, so arriving in another town reveals moving life.
  const poses=cars.map(c=>routePose(c.route,c.distance));
  for(const j of junctions){if(j.owner&&(j.owner.parked||junctionDistance(j,routePose(j.owner.route,j.owner.distance))>j.r+10))j.owner=null;if(!j.owner)j.owner=cars.filter((c,i)=>!c.parked&&junctionDistance(j,poses[i])<j.r+10).sort((a,b)=>junctionDistance(j,routePose(a.route,a.distance))-junctionDistance(j,routePose(b.route,b.distance)))[0]||null;}
  cars.forEach((c,i)=>{const p=poses[i],ahead=(q)=>{const dx=q.x-p.x,dz=q.z-p.z;return dx*Math.sin(p.heading)+dz*Math.cos(p.heading)>0&&Math.hypot(dx,dz)<(c.bus?12:9)&&Math.abs(dx*Math.cos(p.heading)-dz*Math.sin(p.heading))<1.8;};
   const blocked=(!indoors&&ahead({x,z}))||poses.some((q,j)=>j!==i&&ahead(q)&&Math.cos(q.heading-p.heading)>.7); // Shared swept hull checks arbitrate cars; a broad look-ahead cone deadlocks crossing lanes.
   const obstacles=[...ownedCars(state.world.city),...pedestrians.near(p.x,p.z,12),...(!indoors?[{x,z,length:.45,width:.45}]:[])];
   c.pending=(c.pending||0)+dt;const nearbyBefore=Math.hypot(p.x-x,p.z-z),interval=nearbyBefore>180?.4:nearbyBefore>90?.1:0;
   if(dt>0&&c.pending<interval)return;const steps=Math.max(1,Math.ceil(c.pending/.1)),step=c.pending/steps;c.pending=0;
   for(let tick=0;tick<steps;tick++){const proposed=c.showCar?showCarAdvance(c,state.world.dayTime,step,cars):c.distance+step*c.speed;
    const entering=junctions.some(j=>j.owner&&j.owner!==c&&junctionDistance(j,routePose(c.route,c.distance))>=j.r+4&&junctionDistance(j,routePose(c.route,proposed))<j.r+4);
    if(!c.parked)c.distance=trafficJamStep(c,blocked||entering?c.distance:proposed,[...cars,...otherTraffic()],obstacles,step,{red:blocked||entering||proposed===c.distance});
    if(c.showCar)finishShowCarStep(c,state.world.dayTime);
   }
   const q=routePose(c.route,c.distance),nearby=Math.hypot(q.x-x,q.z-z);if(nearby<165)placeGroundVehicle(c.g,q,roadHeight,c.bus?'bus':'sedan');else{c.g.position.x=q.x;c.g.position.z=q.z;c.g.rotation.y=q.heading;}
   const detail=c.g.userData.visualDetail;if(detail)detail.visible=Math.hypot(q.x-x,q.z-z)<28;c.g.visible=Math.hypot(q.x-x,q.z-z)<155;
  });
  for(const p of people){const pos=p.g.position,near=Math.hypot(pos.x-x,pos.z-z);p.g.visible=near<105;p.pending=(p.pending||0)+dt;if(near>120&&p.pending<.5)continue;const visitorDt=near>120?Math.min(.5,p.pending):dt;p.pending=0;
   // Revalidate after player construction; never place a visitor inside a new home.
   if(!clear(pos.x,pos.z)){p.g.visible=false;p.goal=null;continue;}
   p.routine.update(visitorDt,active,(nx,nz)=>people.some(q=>q!==p&&Math.hypot(q.g.position.x-nx,q.g.position.z-nz)<.8)||(!indoors&&Math.hypot(nx-x,nz-z)<1));
  }
  if(!flight&&clock>=flyAt){const angle=(flights++*1.7+.45),dx=Math.cos(angle),dz=Math.sin(angle);flight={t:0,x,z,dx,dz,y:flightAltitude(height,x,z,dx,dz,y)};plane.rotation.y=Math.atan2(dx,dz);}
  if(flight){flight.t+=dt;const d=-280+flight.t*15;const px=flight.x+flight.dx*d,pz=flight.z+flight.dz*d;flight.y=clearFlightAltitude(flight.y,y,height(px,pz));plane.position.set(px,flight.y,pz);plane.visible=Math.hypot(plane.position.x-x,plane.position.z-z)<400;
   if(d>310){flight=null;plane.visible=false;flyAt=clock+150+(flights%3)*20;}}
 }
 update(0,true,{x:state.world.x,z:state.world.z});
 return {root,cars,showCars,people,plane,clear,update,get clock(){return clock;},dispose(){scene.remove(root);}};
}


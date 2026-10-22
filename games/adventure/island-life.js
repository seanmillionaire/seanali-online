import {nightLighting} from './night-lighting.js';
import {worldClock,DAY_CYCLE_SECONDS} from './world-clock.js?v=225';
export {DAY_CYCLE_SECONDS} from './world-clock.js?v=225';
import {cityX} from './geography.js?v=225';
import {worldIslands,marineWater,roadDistance,HIGHWAY_WIDTH,sharkClearance,sharkStep,recoverShark} from './explore-state.js?v=225';
import {oceanModel} from './ocean-models.js?v=225';
// Saved clock keeps its original 240-unit format; one full day takes 20 minutes.
export const NIGHT_MODE_ENABLED=true;
export function positionMoon(moon,camera){
 const side=Math.min(85,320*Math.tan((camera.fov||60)*Math.PI/360)*(camera.aspect||1)*.45);
 moon.position.set(-side,105,-320).applyQuaternion(camera.quaternion);moon.quaternion.copy(camera.quaternion);
}

// Named and inspectable natural marine habitats. All start in navigable
// water and remain near attractions instead of hidden in the deep ocean.
export const MARINE_HABITATS={
 dolphins:[[-100,-170],[cityX(230),50],[-8,-428]],
 octopuses:[[-17,26],[cityX(120),24],[-118,-178],[cityX(200),85],[cityX(278),-228],[6,-424],[-480,225],[-340,-265],[-200,325],[680,320],[110,128],[560,178],[430,-320],[620,-180]].filter(([x,z])=>marineWater(x,z))
};
export function islandDaylight(seconds){
 if(!NIGHT_MODE_ENABLED)return {phase:.25,day:1,night:false,twilight:0};
 const clock=worldClock(seconds),phase=(clock.phase-1/24+1)%1,night=clock.night;
 const elevation=Math.sin(phase*Math.PI*2);
 const t=Math.max(0,Math.min(1,(elevation+.25)/.55)),day=t*t*(3-2*t);
 return {phase,day,night,twilight:4*day*(1-day),elevation};
}
export function createIslandLife({T,scene,camera,state,make,mat,geometry,ball,cone,box,sun,ambient,waterMaterial,inWater}){
 const s=state.world,animals=[],group=new T.Group();group.name='Ocean wildlife';scene.add(group);let ridden=null;
 const nightSky=new T.Color('#020510'),daySky=new T.Color('#a4c9de'),dusk=new T.Color('#ce9b96'),moonLight=new T.Color('#b8ceff'),dayLight=new T.Color('#fff0d2'),sunsetLight=new T.Color('#ffcf9c'),nightAmbient=new T.Color('#8da6d1'),dayAmbient=new T.Color('#c9edff');
 function animal(kind,x,z,i){const {g,moving}=oceanModel(T,{geometry,mat,make,ball},kind);g.name=kind+' '+(i+1);group.add(g);g.position.set(x,-.3,z);
  if(kind==='Dolphin')g.scale.setScalar(1.35);
  if(kind==='Octopus')g.scale.setScalar(.94);
  animals.push({g,moving,x,z,phase:kind==='Reef fish'?Math.floor(i/6)*1.7+(i%6)*.08:i*1.7,kind,seed:923+i*7919+(kind.length*131),attention:0,t:0,heading:i*2.39996,waypoint:null,stuck:0,travel:0});}
 [[8,24],[-170,0],[108,30],[cityX(200),75]].forEach(([x,z],i)=>animal('Sea turtle',x,z,i));
 // Small dolphin pods visit beaches, docks and distant islands, rather than
 // remaining invisible far away in four arbitrary offshore coordinates.
 MARINE_HABITATS.dolphins.forEach(([x,z],i)=>animal('Dolphin',x,z,i));
 [[-8,24],[130,14],[-140,-145],[cityX(200),-90]].forEach(([x,z],i)=>animal('Manta ray',x,z,i));
 // Visible shallow-water octopuses with independently moving arms.
 MARINE_HABITATS.octopuses.forEach(([x,z],i)=>animal('Octopus',x,z,i));
 const shoals=[[-11,24],[108,25],[-135,-130],[cityX(220),75],[-300,90],[30,155],[260,160],[460,230],[-460,240],[-340,-260],[-170,325],[670,315],...worldIslands.filter(p=>p.guna).filter((_,i)=>i%3===0).map(p=>[p.x+p.rx+7,p.z])].filter(([x,z])=>marineWater(x,z));
 shoals.forEach(([x,z],i)=>{for(let k=0;k<6;k++)animal('Reef fish',x+(k%3)*.7,z+Math.floor(k/3)*.7,i*6+k);});

 // Celestial bodies travel across the upper camera view, away from Angelique and controls.
 const sky=new T.Group();sky.name='Sun moon and stars';scene.add(sky);const owned=[];
 const basic=(color,extra={})=>{const m=new T.MeshBasicMaterial({color,depthTest:true,depthWrite:false,fog:false,toneMapped:false,...extra});owned.push(m);return m;};
 const sunBody=new T.Mesh(ball,basic('#ffe39c')),moon=new T.Mesh(ball,basic('#e3f1ff'));sunBody.name='Sun';moon.name='Moon';sunBody.scale.setScalar(12);moon.scale.setScalar(18);sky.add(sunBody,moon);sunBody.renderOrder=30;moon.renderOrder=30;for(let i=0;i<10;i++){const a=i*Math.PI/5,ray=new T.Mesh(cone,basic('#ffd16e'));ray.position.set(Math.sin(a)*1.4,Math.cos(a)*1.4,0);ray.rotation.z=-a;ray.scale.set(.13,.45,.1);ray.renderOrder=30;sunBody.add(ray);}
 for(let i=0;i<4;i++){const crater=new T.Mesh(ball,basic('#a6bad1'));crater.scale.set(.2,.15,.025);crater.renderOrder=31;crater.position.set(Math.sin(i*2)*.55,Math.cos(i*2)*.5,.85);moon.add(crater);}
 const starDome=new T.Group();starDome.name='Slowly drifting stars';sky.add(starDome);let skyTime=0;
 const focus=new T.SpotLight('#e0edff',0,105,Math.PI*.34,1,1);focus.name='Cinematic night action light';focus.castShadow=false;focus.decay=0;focus.distance=450;focus.angle=Math.PI*.42;const fill=new T.HemisphereLight('#d8e8ff','#778882',0);fill.name='Night visibility fill';scene.add(focus,focus.target,fill);
 const starMaterial=basic('#dceeff',{transparent:true,opacity:0}),stars=[];for(let i=0;i<64;i++){const star=new T.Mesh(ball,starMaterial);star.position.set(Math.sin(i*9.7)*550,100+(i%11)*36,Math.cos(i*9.7)*550);star.scale.setScalar(.65+(i%3)*.25);starDome.add(star);stars.push(star);}
 // Sky follows position only: turning the camera keeps the sun fixed on the horizon.
 function nearestRideable(x,z,limit=6.8){
  return animals.filter(a=>(a.kind==='Dolphin'||a.kind==='Sea turtle')&&a!==ridden&&a.g.visible)
   .map(a=>({animal:a,distance:Math.hypot(a.g.position.x-x,a.g.position.z-z)}))
   .filter(e=>e.distance<limit).sort((a,b)=>a.distance-b.distance)[0]?.animal||null;
 }
 function hit(raycaster,x,z){
  for(const a of animals){
   if((a.kind!=='Dolphin'&&a.kind!=='Sea turtle')||a===ridden||Math.hypot(a.g.position.x-x,a.g.position.z-z)>12)continue;
   if(raycaster.intersectObject(a.g,true).length)return a;
  }
  return null;
 }
 function markRidden(a){ridden=a;if(a)a.g.visible=false;}
 function unmark(){ridden=null;}
 return {nearestRideable,hit,markRidden,unmark,update(dt,active,motion,player=null){if(!Number.isFinite(s.dayTime))s.dayTime=40;if(active&&Number.isFinite(dt)&&dt>0)s.dayTime=(s.dayTime+dt*240/DAY_CYCLE_SECONDS)%240;const {phase,day,night,twilight}=islandDaylight(s.dayTime),sunset=twilight;
  if(scene.background?.isColor)scene.background.copy(nightSky).lerp(daySky,day).lerp(dusk,sunset*.35);if(scene.fog)scene.fog.color.copy(scene.background);
  const lighting=nightLighting(day);fill.intensity=lighting.fill;
  if(sun){sun.intensity=lighting.moon;sun.color.copy(moonLight).lerp(dayLight,day).lerp(sunsetLight,twilight*.5);}if(ambient){ambient.intensity=lighting.ambient;ambient.color.copy(nightAmbient).lerp(dayAmbient,day);}if(waterMaterial?.uniforms.daylight)waterMaterial.uniforms.daylight.value=day;
  sky.position.copy(camera.position);
  if(active)skyTime+=Math.max(0,dt);starDome.rotation.y=skyTime*.006;starDome.rotation.z=Math.sin(skyTime*.012)*.025;
  focus.intensity=player&&!player.indoors?lighting.focus:0;focus.position.set(player?.x??0,(player?.y??0)+23,(player?.z??0)+12);focus.target.position.set(player?.x??0,(player?.y??0)+.5,player?.z??0);
  const angle=phase*Math.PI*2;
  sunBody.position.set(-Math.cos(angle)*650,Math.sin(angle)*650,-290);
  // Keep the large moon in the upper view at night, including when steering.
  positionMoon(moon,camera);
  sunBody.visible=sunBody.position.y>-24;moon.visible=night||day<.4;
  sunBody.rotation.z=-angle;starMaterial.opacity=(1-day)*.65;
  const roadClear=(x,z,r=.7)=>roadDistance(x,z)>HIGHWAY_WIDTH/2+r;
  const waterClear=(x,z,r=.7)=>roadClear(x,z,r)&&[[0,0],[r,0],[-r,0],[0,r],[0,-r]].every(([ox,oz])=>marineWater(x+ox,z+oz));
  for(const a of animals){
   if(player&&Math.hypot(a.g.position.x-player.x,a.g.position.z-player.z)>180){a.g.visible=false;continue;}
   if(active)a.t+=dt;
   const t=a.t,isDolphin=a.kind==='Dolphin',isFish=a.kind==='Reef fish';
   const safeWater=(x,z,r=.7)=>waterClear(x,z,isDolphin?Math.max(12,r):r);
   const speed=isDolphin?3.4:isFish?1.2:a.kind==='Octopus'?.48:a.kind==='Manta ray'?1.65:.95;
   const radius=isDolphin?2:isFish?.3:a.kind==='Octopus'?1.1:.85;
   const px=player?.x,pz=player?.z,notice=Number.isFinite(px)&&Number.isFinite(pz)?Math.hypot(px-a.g.position.x,pz-a.g.position.z):Infinity;
   const observing=notice<(isDolphin?13:isFish?5:10);
   // Nearby wildlife watches Angelique without abandoning safe-water boundaries.
   // Fish remain shy; dolphins and turtles slow down to observe.
   if(active)a.attention+=((observing?1:0)-a.attention)*(1-Math.exp(-dt*2));
   const tooClose=notice<(isFish?2.5:isDolphin?4:3),wantedWeight=a.attention*(tooClose?-.6:isFish?-.18:.22);
   a.watchWeight??=0;a.pace??=1;
   if(active){const ease=1-Math.exp(-dt*2);a.watchWeight+=(wantedWeight-a.watchWeight)*ease;a.pace+=((tooClose?1.1:1-a.attention*(isFish?.08:.25))-a.pace)*ease;}
   const watchWeight=a.watchWeight;
   // Spawn recovery prevents underwater NPCs from beginning trapped inside an island.
   if(!safeWater(a.g.position.x,a.g.position.z,radius)){
    let found=false;
    for(let j=0;j<24;j++){
     const angle=j*2.399963,dist=2+(j%7)*3.2;
     const nx=a.g.position.x+Math.cos(angle)*dist,nz=a.g.position.z+Math.sin(angle)*dist;
     if(safeWater(nx,nz,radius)){a.g.position.x=nx;a.g.position.z=nz;found=true;break;}
    }
    if(!found){a.g.visible=false;continue;}
    a.waypoint=null;
   }
   if(active){
    const chooseWaypoint=()=>{
     // Pick stable goals inside a local roaming territory, biased away from coastlines.
     for(let j=0;j<24;j++){
      a.seed=(a.seed*1664525+1013904223)>>>0;const random=a.seed/4294967296;
      const angle=a.heading+(random-.5)*(j<12?2.7:Math.PI*2);
      const dist=a.kind==='Octopus'?2+random*4:6+random*12,tx=a.g.position.x+Math.sin(angle)*dist,tz=a.g.position.z+Math.cos(angle)*dist;
      if(Math.hypot(tx-a.x,tz-a.z)<(a.kind==='Octopus'?9:isFish?13:30)&&safeWater(tx,tz,radius+1.3)&&safeWater((tx+a.g.position.x)/2,(tz+a.g.position.z)/2,radius)){
       a.waypoint={x:tx,z:tz};a.travel=0;return;
      }
     }
     // No clear target: safely wait and try again on the next update.
     a.waypoint=null;
    };
    if(!a.waypoint||Math.hypot(a.waypoint.x-a.g.position.x,a.waypoint.z-a.g.position.z)<1.4||a.travel>16)chooseWaypoint();
    if(a.waypoint){
     const dx=a.waypoint.x-a.g.position.x,dz=a.waypoint.z-a.g.position.z,d=Math.hypot(dx,dz);
     const desired=Math.atan2(dx,dz);
     const playerHeading=observing?Math.atan2(px-a.g.position.x,pz-a.g.position.z):desired;
     const blended=desired+Math.atan2(Math.sin(playerHeading-desired),Math.cos(playerHeading-desired))*watchWeight;
     const delta=Math.atan2(Math.sin(blended-a.heading),Math.cos(blended-a.heading));
     a.heading+=Math.max(-dt*1.8,Math.min(dt*1.8,delta));
     const step=Math.min(speed*dt*(1+Math.sin(t*.31+a.phase)*.13)*a.pace,Math.max(0,d-.15));
     const nx=a.g.position.x+Math.sin(a.heading)*step,nz=a.g.position.z+Math.cos(a.heading)*step;
     if(safeWater(nx,nz,radius)){
      a.g.position.x=nx;a.g.position.z=nz;a.stuck=0;a.travel+=step;
     }else{
      a.stuck+=dt;
      // A road is a hard boundary: reflect the swimming direction away
      // from its closest edge, rather than repeatedly pushing through it.
      if(!roadClear(nx,nz,radius)){
       const e=.5,gx=roadDistance(a.g.position.x+e,a.g.position.z)-roadDistance(a.g.position.x-e,a.g.position.z);
       const gz=roadDistance(a.g.position.x,a.g.position.z+e)-roadDistance(a.g.position.x,a.g.position.z-e);
       const mag=Math.hypot(gx,gz)||1,nxOut=gx/mag,nzOut=gz/mag;
       const vx=Math.sin(a.heading),vz=Math.cos(a.heading),dot=vx*nxOut+vz*nzOut;
       const rx=vx-2*Math.min(0,dot)*nxOut,rz=vz-2*Math.min(0,dot)*nzOut;
       a.waypoint={x:a.g.position.x+rx*8,z:a.g.position.z+rz*8};a.travel=0;a.stuck=0;
      }else{
       a.waypoint=null;a.travel=0;a.stuck=0;
      }
     }
    }
   }
   a.g.rotation.y=a.heading;
   a.g.visible=a!==ridden&&safeWater(a.g.position.x,a.g.position.z,.2);
   // Separate gentle swimming strokes from occasional dolphin surfacing.
   const pulse=Math.sin(t*(isDolphin?2.0:isFish?4:1.8)+a.phase);
   a.g.position.y=isDolphin?-.48+Math.pow(Math.max(0,pulse),10)*.24:
    a.kind==='Octopus'?-.83+Math.sin(t*.8+a.phase)*.025:-.36+Math.sin(t*1.1+a.phase)*.07;
   if(isDolphin)a.g.rotation.x=-Math.max(0,pulse)*.12;
   a.moving.forEach((f,i)=>{
    const phase=t*(isDolphin?3.2:isFish?5.5:2.2)+i*1.65+a.phase;
    if(a.kind==='Octopus'){
     f.rotation.y=i*Math.PI/4+(motion?Math.sin(phase)*.085:0);
     f.rotation.x=motion?Math.sin(phase*1.12)*.075:0;
    }else if(a.kind==='Sea turtle'||a.kind==='Manta ray')f.rotation.z=motion?Math.sin(phase)*.15:0;
    else if(isDolphin)f.rotation.x=motion?Math.sin(phase)*.19:0;
    else f.rotation.y=motion?Math.sin(phase)*.16:0;
   });
  }
 },dispose(){scene.remove(sky,group,focus,focus.target,fill);focus.dispose();fill.dispose();owned.forEach(m=>m.dispose());}};
}

// Sharks choose individual safe goals rather than replaying a ring of waypoints.
export function naturalSharkPatrol(p,dt,target=null){
 if(dt<=0)return {x:p.x,z:p.z,heading:p.heading};
 if(sharkClearance(p.x,p.z)!==13)Object.assign(p,recoverShark(p.x,p.z));
 p.roamSeed??=(173+(p.cx||0)*131+(p.cz||0)*317+(p.waypoint||0)*7919)>>>0;
 p.roamTime=(p.roamTime||0)+dt;
 const random=()=>{p.roamSeed=(p.roamSeed*1664525+1013904223)>>>0;return p.roamSeed/4294967296;};
 if(!p.roamGoal||Math.hypot(p.roamGoal.x-p.x,p.roamGoal.z-p.z)<3){
  p.roamGoal=null;
  for(let i=0;i<16;i++){
   const a=random()*Math.PI*2,r=.4+random()*.6,x=(p.cx||0)+Math.cos(a)*(p.rx||32)*r,z=(p.cz||0)+Math.sin(a)*(p.rz||26)*r;
   if(Math.hypot(x-p.x,z-p.z)>5&&sharkClearance(x,z)===13){p.roamGoal={x,z};break;}
  }
 }
 const goal=target||p.roamGoal||{x:p.x+Math.sin(p.heading||0)*3,z:p.z+Math.cos(p.heading||0)*3};
 const speed=target?10:3.4+Math.sin(p.roamTime*.23+(p.cx||0))*.6;
 const next=sharkStep(p.x,p.z,goal.x,goal.z,Math.min(dt,.1),speed,p.side||1,p.heading??null);
 p.heading=next.heading;p.roamWatch=(p.roamWatch||0)+dt;
 if(p.roamWatch>2){if(p.roamAnchor&&Math.hypot(next.x-p.roamAnchor.x,next.z-p.roamAnchor.z)<.5){p.roamGoal=null;p.side=-(p.side||1);p.detour=3;}p.roamAnchor={...next};p.roamWatch=0;}
 return next;
}

import {roadDistance,HIGHWAY_WIDTH,sharkClearance,sharkStep,recoverShark} from './explore-state.js?v=178';
import {oceanModel} from './ocean-models.js?v=182';
// Temporary gameplay switch. Re-enable the cycle by setting this to true.
// Disabled mode forces bright midday even when an old save resumes at night.
export const NIGHT_MODE_ENABLED=false;
export function islandDaylight(seconds){
 if(!NIGHT_MODE_ENABLED)return {phase:.25,day:1,night:false,twilight:0};
 const phase=((seconds%240)+240)%240/240;
 const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
 const darkness=smooth(.69,.74,phase)*(1-smooth(.89,.96,phase));
 const day=1-darkness;
 return {phase,day,night:phase>=.72&&phase<.92,twilight:4*day*(1-day)};
}
export function createIslandLife({T,scene,camera,state,make,mat,geometry,ball,cone,box,sun,ambient,waterMaterial,inWater}){
 const s=state.world,animals=[],group=new T.Group();group.name='Ocean wildlife';scene.add(group);let ridden=null;
 const nightSky=new T.Color('#172c50'),daySky=new T.Color('#a4c9de'),dusk=new T.Color('#ce9b96');
 function animal(kind,x,z,i){const {g,moving}=oceanModel(T,{geometry,mat,make,ball},kind);g.name=kind+' '+(i+1);group.add(g);g.position.set(x,-.3,z);
  if(kind==='Dolphin')g.scale.setScalar(1.35);
  if(kind==='Octopus')g.scale.setScalar(1.18);
  animals.push({g,moving,x,z,phase:kind==='Reef fish'?Math.floor(i/6)*1.7+(i%6)*.08:i*1.7,kind,seed:923+i*7919+(kind.length*131),attention:0,t:0,heading:i*2.39996,waypoint:null,stuck:0,travel:0});}
 [[8,24],[-170,0],[108,30],[200,75]].forEach(([x,z],i)=>animal('Sea turtle',x,z,i));
 // Small dolphin pods visit beaches, docks and distant islands, rather than
 // remaining invisible far away in four arbitrary offshore coordinates.
 [[13,19],[24,27],[-100,-170],[-127,-172],[205,-100],[230,50],[275,-220],[-70,-294]].forEach(([x,z],i)=>animal('Dolphin',x,z,i));
 [[-8,24],[130,14],[-140,-145],[200,-90]].forEach(([x,z],i)=>animal('Manta ray',x,z,i));
 // Visible shallow-water octopuses with independently moving arms.
 [[14,22],[105,24],[-118,-178],[200,85],[278,-228],[-60,-288]].forEach(([x,z],i)=>animal('Octopus',x,z,i));
 for(let i=0;i<24;i++){const spots=[[11,20],[108,25],[-135,-130],[220,75]],p=spots[Math.floor(i/6)];animal('Reef fish',p[0]+(i%3)*.7,p[1]+Math.floor(i%6/3)*.7,i);}
 // Celestial bodies travel across the upper camera view, away from Angelique and controls.
 const sky=new T.Group();sky.name='Sun moon and stars';camera.add(sky);if(!camera.parent)scene.add(camera);const owned=[];
 const basic=(color,extra={})=>{const m=new T.MeshBasicMaterial({color,depthTest:false,depthWrite:false,fog:false,toneMapped:false,...extra});owned.push(m);return m;};
 const sunBody=new T.Mesh(ball,basic('#ffe39c')),moon=new T.Mesh(ball,basic('#e3f1ff'));sunBody.name='Sun';moon.name='Moon';sunBody.scale.setScalar(.25);moon.scale.setScalar(.22);sky.add(sunBody,moon);sunBody.renderOrder=30;moon.renderOrder=30;for(let i=0;i<10;i++){const a=i*Math.PI/5,ray=new T.Mesh(cone,basic('#ffd16e'));ray.position.set(Math.sin(a)*1.4,Math.cos(a)*1.4,0);ray.rotation.z=-a;ray.scale.set(.13,.45,.1);ray.renderOrder=30;sunBody.add(ray);}
 for(let i=0;i<4;i++){const crater=new T.Mesh(ball,basic('#a6bad1'));crater.scale.set(.2,.15,.025);crater.renderOrder=31;crater.position.set(Math.sin(i*2)*.55,Math.cos(i*2)*.5,.85);moon.add(crater);}
 const starMaterial=basic('#dceeff',{transparent:true,opacity:0}),stars=[];for(let i=0;i<22;i++){const star=new T.Mesh(ball,starMaterial);star.position.set(Math.sin(i*9.7)*2,1.8+(i%7)*.17,-10.8);star.scale.setScalar(.012+(i%3)*.005);sky.add(star);stars.push(star);}
 // Keep the cycle logic available for a future feature toggle, but do not run it now.
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
 return {nearestRideable,hit,markRidden,unmark,update(dt,active,motion,player=null){if(!NIGHT_MODE_ENABLED)s.dayTime=60;else if(active&&Number.isFinite(dt)&&dt>0)s.dayTime=(s.dayTime+dt)%240;const {phase,day,night,twilight}=islandDaylight(s.dayTime),sunset=twilight;
  if(scene.background?.isColor)scene.background.copy(nightSky).lerp(daySky,day).lerp(dusk,sunset*.35);if(scene.fog)scene.fog.color.copy(scene.background);
  if(sun){sun.intensity=.5+day*2.5;sun.color.set(night?'#9fbcff':'#fff0d2');}if(ambient){ambient.intensity=.85+day*.6;ambient.color.set(night?'#99b8ed':'#c9edff');}if(waterMaterial?.uniforms.daylight)waterMaterial.uniforms.daylight.value=day;
  sunBody.visible=!night;moon.visible=night;const arc=(phase%.5)*2;for(const body of [sunBody,moon])body.position.set((arc-.5)*2.6,2.1+Math.sin(arc*Math.PI)*.4,-10);starMaterial.opacity=(1-day)*.8;
  const roadClear=(x,z,r=.7)=>roadDistance(x,z)>HIGHWAY_WIDTH/2+r;
  const safeWater=(x,z,r=.7)=>roadClear(x,z,r)&&[[0,0],[r,0],[-r,0],[0,r],[0,-r]].every(([ox,oz])=>inWater(x+ox,z+oz));
  for(const a of animals){
   if(active)a.t+=dt;
   const t=a.t,isDolphin=a.kind==='Dolphin',isFish=a.kind==='Reef fish';
   const speed=isDolphin?3.4:isFish?1.2:a.kind==='Octopus'?.48:a.kind==='Manta ray'?1.65:.95;
   const radius=isFish?.3:a.kind==='Octopus'?1.1:.85;
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
      const dist=6+random*12,tx=a.g.position.x+Math.sin(angle)*dist,tz=a.g.position.z+Math.cos(angle)*dist;
      if(safeWater(tx,tz,radius+1.3)&&safeWater((tx+a.g.position.x)/2,(tz+a.g.position.z)/2,radius)){
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
   a.g.position.y=isDolphin?-.23+Math.pow(Math.max(0,pulse),10)*.82:
    a.kind==='Octopus'?-.11+Math.sin(t*.8+a.phase)*.07:-.36+Math.sin(t*1.1+a.phase)*.07;
   if(isDolphin)a.g.rotation.x=-Math.max(0,pulse)*.12;
   a.moving.forEach((f,i)=>{
    const phase=t*(isDolphin?3.2:isFish?5.5:2.2)+i*1.65+a.phase;
    if(a.kind==='Octopus'){
     f.rotation.y=i*Math.PI/4+(motion?Math.sin(phase)*.16:0);
     f.rotation.x=motion?Math.sin(phase*1.12)*.20:0;
    }else if(a.kind==='Sea turtle'||a.kind==='Manta ray')f.rotation.z=motion?Math.sin(phase)*.15:0;
    else if(isDolphin)f.rotation.x=motion?Math.sin(phase)*.19:0;
    else f.rotation.y=motion?Math.sin(phase)*.16:0;
   });
  }
 },dispose(){camera.remove(sky);scene.remove(group);owned.forEach(m=>m.dispose());}};
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

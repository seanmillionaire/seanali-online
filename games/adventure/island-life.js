import {oceanModel} from './ocean-models.js?v=73';
export function islandDaylight(seconds){const phase=((seconds%240)+240)%240/240,elevation=Math.sin(phase*Math.PI*2);return {phase,day:Math.max(0,Math.min(1,elevation*2+.15)),night:elevation<0};}
export function createIslandLife({T,scene,camera,state,make,mat,geometry,ball,cone,box,sun,ambient,waterMaterial,inWater}){
 const s=state.world,animals=[],group=new T.Group();group.name='Ocean wildlife';scene.add(group);let ridden=null;
 const nightSky=new T.Color('#172c50'),daySky=new T.Color('#a4c9de'),dusk=new T.Color('#ce9b96');
 function animal(kind,x,z,i){const {g,moving}=oceanModel(T,{geometry,mat,make,ball},kind);g.name=kind+' '+(i+1);group.add(g);g.position.set(x,-.3,z);animals.push({g,moving,x,z,phase:kind==='Reef fish'?Math.floor(i/6)*1.7+(i%6)*.08:i*1.7,kind,t:0});}
 [[8,19],[-58,24],[77,-51],[113,37]].forEach(([x,z],i)=>animal('Sea turtle',x,z,i));
 [[13,28],[-35,-42],[45,58],[75,12]].forEach(([x,z],i)=>animal('Dolphin',x,z,i));
 [[-8,24],[38,-27],[-55,-12],[13,73]].forEach(([x,z],i)=>animal('Manta ray',x,z,i));
 for(let i=0;i<24;i++){const spots=[[11,20],[72,-43],[-64,27],[90,38]],p=spots[Math.floor(i/6)];animal('Reef fish',p[0]+(i%3)*.7,p[1]+Math.floor(i%6/3)*.7,i);}
 // Celestial bodies travel across the upper camera view, away from Angelique and controls.
 const sky=new T.Group();sky.name='Sun moon and stars';camera.add(sky);if(!camera.parent)scene.add(camera);const owned=[];
 const basic=(color,extra={})=>{const m=new T.MeshBasicMaterial({color,depthTest:false,depthWrite:false,fog:false,toneMapped:false,...extra});owned.push(m);return m;};
 const sunBody=new T.Mesh(ball,basic('#ffe39c')),moon=new T.Mesh(ball,basic('#e3f1ff'));sunBody.name='Sun';moon.name='Moon';sunBody.scale.setScalar(.25);moon.scale.setScalar(.22);sky.add(sunBody,moon);sunBody.renderOrder=30;moon.renderOrder=30;for(let i=0;i<10;i++){const a=i*Math.PI/5,ray=new T.Mesh(cone,basic('#ffd16e'));ray.position.set(Math.sin(a)*1.4,Math.cos(a)*1.4,0);ray.rotation.z=-a;ray.scale.set(.13,.45,.1);ray.renderOrder=30;sunBody.add(ray);}
 for(let i=0;i<4;i++){const crater=new T.Mesh(ball,basic('#a6bad1'));crater.scale.set(.2,.15,.025);crater.renderOrder=31;crater.position.set(Math.sin(i*2)*.55,Math.cos(i*2)*.5,.85);moon.add(crater);}
 const starMaterial=basic('#dceeff',{transparent:true,opacity:0}),stars=[];for(let i=0;i<22;i++){const star=new T.Mesh(ball,starMaterial);star.position.set(Math.sin(i*9.7)*2,1.8+(i%7)*.17,-10.8);star.scale.setScalar(.012+(i%3)*.005);sky.add(star);stars.push(star);}
 // Keep Panamá Aventura in bright midday until the day/night feature is re-enabled.
 // Reset stored nighttime positions too, so returning players always see daylight.
 const PERMANENT_DAYTIME = 60;
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
 return {nearestRideable,hit,markRidden,unmark,update(dt,active,motion){s.dayTime=PERMANENT_DAYTIME;const {phase,day,night}=islandDaylight(s.dayTime),sunset=1-Math.min(1,Math.abs(Math.sin(phase*Math.PI*2))*5);
  if(scene.background?.isColor)scene.background.copy(nightSky).lerp(daySky,day).lerp(dusk,sunset*.35);if(scene.fog)scene.fog.color.copy(scene.background);
  if(sun){sun.intensity=.5+day*2.5;sun.color.set(night?'#9fbcff':'#fff0d2');}if(ambient){ambient.intensity=.85+day*.6;ambient.color.set(night?'#99b8ed':'#c9edff');}if(waterMaterial?.uniforms.daylight)waterMaterial.uniforms.daylight.value=day;
  sunBody.visible=!night;moon.visible=night;const arc=(phase%.5)*2;for(const body of [sunBody,moon])body.position.set((arc-.5)*2.6,2.1+Math.sin(arc*Math.PI)*.4,-10);starMaterial.opacity=(1-day)*.8;
  for(const a of animals){if(active)a.t+=dt;const t=a.t,x=a.x+Math.sin(t*.08+a.phase)*(a.kind==='Dolphin'?16:6),z=a.z+Math.cos(t*.08+a.phase)*(a.kind==='Dolphin'?12:5);
   if(active){const dx=x-a.g.position.x,dz=z-a.g.position.z,d=Math.hypot(dx,dz),step=Math.min(d,dt*(a.kind==='Dolphin'?4.5:a.kind==='Reef fish'?1.4:.8)),nx=a.g.position.x+dx/Math.max(d,.001)*step,nz=a.g.position.z+dz/Math.max(d,.001)*step,r=a.kind==='Reef fish'?.4:1.3;if([[0,0],[r,0],[-r,0],[0,r],[0,-r]].every(([ox,oz])=>inWater(nx+ox,nz+oz))){if(d>.001)a.g.rotation.y=Math.atan2(dx,dz);a.g.position.x=nx;a.g.position.z=nz;}else a.phase+=dt;}
   a.g.visible=a!==ridden&&inWater(a.g.position.x,a.g.position.z);if(a.kind==='Dolphin')a.g.rotation.x=motion?-Math.cos(t*.6+a.phase)*Math.pow(Math.max(0,Math.sin(t*.6+a.phase)),4)*.45:0;a.g.position.y=a.kind==='Dolphin'?(motion?-.2+Math.pow(Math.max(0,Math.sin(t*.6+a.phase)),8)*1.3:-.1):-.3;
   a.moving.forEach((f,i)=>{if(a.kind==='Sea turtle'||a.kind==='Manta ray')f.rotation.z=motion?Math.sin(t*3+i)*.18:0;else if(a.kind==='Dolphin')f.rotation.x=motion?Math.sin(t*5)*.3:0;else f.rotation.y=motion?Math.sin(t*7)*.3:0;});
  }
 },dispose(){camera.remove(sky);scene.remove(group);owned.forEach(m=>m.dispose());}};
}

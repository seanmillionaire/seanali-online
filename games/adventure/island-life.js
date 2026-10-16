export function islandDaylight(seconds){const phase=((seconds%240)+240)%240/240,elevation=Math.sin(phase*Math.PI*2);return {phase,day:Math.max(0,Math.min(1,elevation*2+.15)),night:elevation<0};}
export function createIslandLife({T,scene,camera,state,make,mat,geometry,ball,cone,box,sun,ambient,waterMaterial,inWater}){
 const s=state.world,animals=[],group=new T.Group();group.name='Ocean wildlife';scene.add(group);
 const nightSky=new T.Color('#172c50'),daySky=new T.Color('#a4c9de'),dusk=new T.Color('#ce9b96');
 const seaGreen=mat('#587b51'),shell=mat('#60744b'),grey=mat('#7198a3'),belly=mat('#d4e4dd'),rayColor=mat('#547e87'),fishColors=['#e4bd48','#e18b55','#4bafd0'].map(c=>mat(c));
 const fin=geometry(new T.ConeGeometry(.5,1,3));
 function animal(kind,x,z,i){const g=new T.Group();g.name=kind+' '+(i+1);group.add(g);const moving=[];
  if(kind==='Sea turtle'){make(ball,shell,0,0,0,.55,.22,.72,g);make(ball,belly,0,-.13,0,.46,.09,.6,g);make(ball,seaGreen,0,.02,.72,.18,.14,.25,g);for(const side of [-1,1])for(const end of [-1,1]){const f=make(ball,seaGreen,side*.55,-.04,end*.36,.4,.045,.15,g);f.rotation.y=side*end*.5;moving.push(f);}for(const side of [-1,1])make(ball,mat('#142b29'),side*.1,.09,.88,.025,.025,.025,g);}
  else if(kind==='Dolphin'){make(ball,grey,0,0,0,.35,.32,1.2,g);make(ball,belly,0,-.19,.1,.28,.1,1,g);make(ball,grey,0,.02,1,.15,.12,.5,g);const dorsal=make(fin,grey,0,.43,-.1,.65,.65,.5,g);dorsal.rotation.x=-.35;for(const side of [-1,1]){const f=make(ball,grey,side*.35,-.12,.2,.35,.06,.13,g);f.rotation.y=side*.5;}const tail=make(ball,grey,0,0,-1.15,.55,.07,.22,g);moving.push(tail);}
  else if(kind==='Manta ray'){make(ball,rayColor,0,0,0,.45,.12,.7,g);for(const side of [-1,1]){const wing=make(ball,rayColor,side*.6,0,-.05,.8,.06,.45,g);moving.push(wing);}const tail=make(box,rayColor,0,-.01,-1.1,.04,.04,1.3,g);}
  else{const color=fishColors[i%3];make(ball,color,0,0,0,.12,.21,.42,g);const tail=make(fin,color,0,0,-.45,.55,.55,.35,g);tail.rotation.x=Math.PI/2;moving.push(tail);make(ball,belly,.105,.06,.22,.026,.026,.026,g);}
  g.position.set(x,kind==='Dolphin'?-.15:-.3,z);animals.push({g,moving,x,z,phase:i*1.7,kind,t:0});
 }
 [[8,19],[-22,-12],[17,-15]].forEach(([x,z],i)=>animal('Sea turtle',x,z,i));
 [[13,23],[-25,-18]].forEach(([x,z],i)=>animal('Dolphin',x,z,i));
 [[-8,20],[22,10],[-20,-17]].forEach(([x,z],i)=>animal('Manta ray',x,z,i));
 for(let i=0;i<12;i++){const x=i<6?11:20,z=i<6?19:-15;animal('Reef fish',x+(i%3)*.7,z+Math.floor(i%6/3)*.7,i);}
 // Celestial bodies travel across the upper camera view, away from Angelique and controls.
 const sky=new T.Group();sky.name='Sun moon and stars';camera.add(sky);if(!camera.parent)scene.add(camera);const owned=[];
 const basic=(color,extra={})=>{const m=new T.MeshBasicMaterial({color,depthTest:false,depthWrite:false,fog:false,toneMapped:false,...extra});owned.push(m);return m;};
 const sunBody=new T.Mesh(ball,basic('#ffe39c')),moon=new T.Mesh(ball,basic('#e3f1ff'));sunBody.name='Sun';moon.name='Moon';sunBody.scale.setScalar(.25);moon.scale.setScalar(.22);sky.add(sunBody,moon);sunBody.renderOrder=30;moon.renderOrder=30;for(let i=0;i<10;i++){const a=i*Math.PI/5,ray=new T.Mesh(cone,basic('#ffd16e'));ray.position.set(Math.sin(a)*1.4,Math.cos(a)*1.4,0);ray.rotation.z=-a;ray.scale.set(.13,.45,.1);ray.renderOrder=30;sunBody.add(ray);}
 for(let i=0;i<4;i++){const crater=new T.Mesh(ball,basic('#a6bad1'));crater.scale.set(.2,.15,.025);crater.renderOrder=31;crater.position.set(Math.sin(i*2)*.55,Math.cos(i*2)*.5,.85);moon.add(crater);}
 const starMaterial=basic('#dceeff',{transparent:true,opacity:0}),stars=[];for(let i=0;i<22;i++){const star=new T.Mesh(ball,starMaterial);star.position.set(Math.sin(i*9.7)*2,1.8+(i%7)*.17,-10.8);star.scale.setScalar(.012+(i%3)*.005);sky.add(star);stars.push(star);}
 return {update(dt,active,motion){if(active)s.dayTime=(s.dayTime+dt)%240;const {phase,day,night}=islandDaylight(s.dayTime),sunset=1-Math.min(1,Math.abs(Math.sin(phase*Math.PI*2))*5);
  if(scene.background?.isColor)scene.background.copy(nightSky).lerp(daySky,day).lerp(dusk,sunset*.35);if(scene.fog)scene.fog.color.copy(scene.background);
  if(sun){sun.intensity=.5+day*2.5;sun.color.set(night?'#9fbcff':'#fff0d2');}if(ambient){ambient.intensity=.85+day*.6;ambient.color.set(night?'#99b8ed':'#c9edff');}if(waterMaterial?.uniforms.daylight)waterMaterial.uniforms.daylight.value=day;
  sunBody.visible=!night;moon.visible=night;const arc=(phase%.5)*2;for(const body of [sunBody,moon])body.position.set((arc-.5)*2.6,2.1+Math.sin(arc*Math.PI)*.4,-10);starMaterial.opacity=(1-day)*.8;
  for(const a of animals){if(active)a.t+=dt;const t=a.t,x=a.x+Math.sin(t*.16+a.phase)*3,z=a.z+Math.cos(t*.16+a.phase)*2;
   if(active){const dx=x-a.g.position.x,dz=z-a.g.position.z,d=Math.hypot(dx,dz),step=Math.min(d,dt*(a.kind==='Dolphin'?2.4:a.kind==='Reef fish'?1.4:.8)),nx=a.g.position.x+dx/Math.max(d,.001)*step,nz=a.g.position.z+dz/Math.max(d,.001)*step,r=a.kind==='Reef fish'?.4:1.3;if([[0,0],[r,0],[-r,0],[0,r],[0,-r]].every(([ox,oz])=>inWater(nx+ox,nz+oz))){if(d>.001)a.g.rotation.y=Math.atan2(dx,dz);a.g.position.x=nx;a.g.position.z=nz;}else a.phase+=dt;}
   a.g.visible=inWater(a.g.position.x,a.g.position.z);a.g.position.y=a.kind==='Dolphin'?(motion?-.2+Math.pow(Math.max(0,Math.sin(t*.6+a.phase)),8)*1.3:-.1):-.3;
   a.moving.forEach((f,i)=>{if(a.kind==='Sea turtle'||a.kind==='Manta ray')f.rotation.z=motion?Math.sin(t*3+i)*.18:0;else f.rotation.y=motion?Math.sin(t*7)*.3:0;});
  }
 },dispose(){camera.remove(sky);scene.remove(group);owned.forEach(m=>m.dispose());}};
}

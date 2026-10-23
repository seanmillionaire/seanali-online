const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};
// Six clear minutes on arrival; short showers within a twelve-minute cycle.
// Staggered cells leave at least nine minutes with no rain anywhere between fronts.
export function stormActivity(time,index=0){
 const phase=((Math.max(0,time)-360-index*30)%720+720)%720;
 return smooth(0,15,phase)*(1-smooth(75,90,phase));
}
// Continuous world-space fronts: rain travels with the cloud, never with the player.
export function stormCells(time){
 return [
  {x:-60+320*Math.sin(time*.004),z:-365+95*Math.sin(time*.005),radius:98},
  {x:330+240*Math.sin(time*.0027+2),z:-240+155*Math.sin(time*.0033+1),radius:84},
  {x:-260+440*Math.sin(time*.0023+.5),z:250+120*Math.sin(time*.0031),radius:110}
 ].map((c,i)=>({...c,id:i,strength:(.82+.18*Math.sin(time*.019+i*2)**2)*stormActivity(time,i)}));
}
export function regionalWeather(x,z,time){
 const north=clamp((-z-110)/160),highland=Math.exp(-(((x+345)/100)**2+((z+65)/65)**2)),perlas=Math.exp(-(((x-600)/140)**2+((z-180)/120)**2));
 const rain=stormCells(time).reduce((r,c)=>Math.max(r,(1-smooth(c.radius*.38,c.radius,Math.hypot(x-c.x,z-c.z)))*c.strength),0);
 return {rain,mist:highland*.003+north*.00015+rain*.0008,cloud:clamp(.04+north*.06+highland*.16+rain*.75-perlas*.03),wind:1.5+rain*9+Math.sin(time*.23)*1.2,storm:rain>.6,region:highland>.45?'highlands':perlas>.35?'perlas':north>.55?'caribbean':'pacific'};
}
export function createRegionalWeather({T,scene,geometry,height,sun,joy}){
 const root=new T.Group();root.name='Regional weather · drifting rain and lightning';scene.add(root);
 const count=2400,positions=new Float32Array(count*6),geo=geometry(new T.BufferGeometry());geo.setAttribute('position',new T.BufferAttribute(positions,3));
 const rainMaterial=new T.LineBasicMaterial({color:'#d0e2ef',transparent:true,opacity:.65,depthWrite:false}),rain=new T.LineSegments(geo,rainMaterial);rain.frustumCulled=false;root.add(rain);

 const flash=new T.PointLight('#c2d7ff',0,130,1.5);root.add(flash);
 // Distant fronts stay visible outside local rain, with their own rain curtains.
 const cloudMaterial=new T.MeshLambertMaterial({color:'#475363',transparent:true,opacity:.86,depthWrite:false});
 const fronts=stormCells(0).map((c,i)=>{const g=new T.Group();g.name='Travelling thunderstorm '+(i+1);root.add(g);
  const cloudGeo=geometry(new T.SphereGeometry(1,20,12));
  for(let j=0;j<7;j++){const m=new T.Mesh(cloudGeo,cloudMaterial);m.position.set(Math.sin(j*2.4)*c.radius*.42,84+(j%3)*7,Math.cos(j*2.4)*c.radius*.32);m.scale.set(c.radius*.48,12+(j%2)*6,c.radius*.38);g.add(m);}
  const pts=new Float32Array(360*6),geo=geometry(new T.BufferGeometry());geo.setAttribute('position',new T.BufferAttribute(pts,3));
  const material=new T.LineBasicMaterial({color:'#a0b5c6',transparent:true,opacity:.25,depthWrite:false});const curtain=new T.LineSegments(geo,material);curtain.frustumCulled=false;g.add(curtain);
  const bg=geometry(new T.BufferGeometry()),bp=new Float32Array(18*6);bg.setAttribute('position',new T.BufferAttribute(bp,3));const bm=new T.LineBasicMaterial({color:'#edf3ff',transparent:true,opacity:1,toneMapped:false});const shaftMaterial=new T.MeshBasicMaterial({color:'#e5edff',toneMapped:false,fog:false}),shaft=new T.InstancedMesh(geometry(new T.CylinderGeometry(1,1,1,6)),shaftMaterial,18);shaft.name='Lightning shaft';shaft.frustumCulled=false;shaft.visible=false;g.add(shaft);const bolt=new T.LineSegments(bg,bm);bolt.frustumCulled=false;bolt.visible=false;g.add(bolt);
  return {g,pts,geo,material,bg,bp,bm,bolt,shaft,shaftMaterial,last:-1,thunder:-1};
 });
 const baseFog=scene.fog?.density??.001;let lastX=Infinity,lastZ=Infinity;const groundGrid=new Float32Array(100);const boltTransform=new T.Object3D(),up=new T.Vector3(0,1,0),direction=new T.Vector3();let clock=0,current={rain:0,mist:0,cloud:0};
 function update(dt,active,{x=0,z=0,indoors=false,tutorialRain=0}={}){
  if(active&&!indoors)clock+=Math.min(dt,.1);root.visible=!indoors;
  const target=indoors?{rain:0,mist:0,cloud:0}:regionalWeather(x,z,clock),ease=1-Math.exp(-Math.max(0,dt)*1.8);
  if(!indoors&&tutorialRain>0){target.rain=Math.max(target.rain,tutorialRain);target.cloud=Math.max(target.cloud,tutorialRain*.8);}
  for(const k of ['rain','mist','cloud'])current[k]+=(target[k]-current[k])*ease;
  scene.userData.regionalWeather={...current};if(sun)sun.intensity*=1-current.cloud*.6;if(scene.fog)scene.fog.density=baseFog+current.mist+current.rain*.002;
  rain.visible=current.rain>.04;geo.setDrawRange(0,Math.floor(count*current.rain)*2);rainMaterial.opacity=.35+current.rain*.4;
  if(Math.hypot(x-lastX,z-lastZ)>4){lastX=x;lastZ=z;for(let a=0;a<10;a++)for(let b=0;b<10;b++)groundGrid[a*10+b]=height(x-40+a*8,z-40+b*8);}
  for(let i=0;i<count;i++){const px=x+((i*17.713+clock*(target.wind||0))%54)-27,pz=z+((i*23.131+clock*.8)%54)-27,ground=groundGrid[Math.max(0,Math.min(9,Math.round((px-lastX+40)/8)))*10+Math.max(0,Math.min(9,Math.round((pz-lastZ+40)/8)))],y=ground+((i*3.79-clock*(22+current.rain*13))%35+35)%35,k=i*6;positions.set([px,y,pz,px-.18-current.rain*.3,y+1.4+current.rain*2,pz+.13],k);}geo.attributes.position.needsUpdate=true;
  let anyFlash=false;
  stormCells(clock).forEach((c,i)=>{const f=fronts[i];f.g.position.set(c.x,0,c.z);f.g.visible=c.strength>.01;if(!f.g.visible){f.thunder=-1;return;}
   for(let j=0;j<360;j++){const a=j*2.39996,r=Math.sqrt((j*.618034)%1)*c.radius*.68,px=Math.cos(a)*r,pz=Math.sin(a)*r,y=12+((j*3.79-clock*25)%65+65)%65;f.pts.set([px,y,pz,px-1.2,y+9,pz+.7],j*6);}f.geo.attributes.position.needsUpdate=true;
   const period=17+i*3,cycle=Math.floor((clock+i*6)/period),phase=(clock+i*6)%period,lit=c.strength>.5&&active&&!indoors&&(phase<.18||(phase>.34&&phase<.45));
   f.bolt.visible=f.shaft.visible=lit;const dist=Math.hypot(x-c.x,z-c.z);if(lit){anyFlash ||=dist<150;
    const bx=Math.sin(cycle*7+i)*24,bz=Math.cos(cycle*3+i)*20,ground=height(c.x+bx,c.z+bz);
    for(let j=0;j<18;j++){const y=98-j*(98-ground)/18,dx=Math.sin(j*7.1+cycle)*3;f.bp.set([bx+dx,y,bz,bx+Math.sin((j+1)*7.1+cycle)*3,y-(98-ground)/18,bz+.3],j*6);}f.bg.attributes.position.needsUpdate=true;
    for(let j=0;j<18;j++){const k=j*6;direction.set(f.bp[k+3]-f.bp[k],f.bp[k+4]-f.bp[k+1],f.bp[k+5]-f.bp[k+2]);const length=direction.length();boltTransform.position.set((f.bp[k]+f.bp[k+3])/2,(f.bp[k+1]+f.bp[k+4])/2,(f.bp[k+2]+f.bp[k+5])/2);boltTransform.quaternion.setFromUnitVectors(up,direction.normalize());boltTransform.scale.set(.18,length,.18);boltTransform.updateMatrix();f.shaft.setMatrixAt(j,boltTransform.matrix);}f.shaft.instanceMatrix.needsUpdate=true;
    if(f.last!==cycle){f.last=cycle;f.thunder=clock+dist/70;}
   }
   if(f.thunder>=0&&clock>=f.thunder){if(dist<230&&active&&!indoors)joy?.effect('thunder');f.thunder=-1;}
  });
  // A nearby strike lights its cloud; distant lightning does not bleach clear regions.
  flash.intensity=anyFlash?65:0;flash.position.set(x,38,z);

 }
 return {root,update,get current(){return {...current};},get clock(){return clock;},dispose(){scene.remove(root);rainMaterial.dispose();cloudMaterial.dispose();fronts.forEach(f=>{f.material.dispose();f.bm.dispose();f.shaftMaterial.dispose();});delete scene.userData.regionalWeather;if(scene.fog)scene.fog.density=baseFog;}};
}


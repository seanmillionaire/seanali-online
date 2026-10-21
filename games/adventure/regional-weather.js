const clamp=v=>Math.max(0,Math.min(1,v));
export function regionalWeather(x,z,time){
 const north=clamp((-z-110)/160),highland=Math.exp(-(((x+345)/100)**2+((z+65)/65)**2)),perlas=Math.exp(-(((x-600)/140)**2+((z-180)/120)**2));
 const front=.5+.5*Math.sin(time*.014+x*.004-z*.003-1.6),shower=clamp((front-.94)/.06);
 const rain=clamp((.35+north*.59)*shower*(1-highland*.75)*(1-perlas*.9));
 return {rain,mist:highland*.003+north*.00015+rain*.0008,cloud:clamp( .04+north*.06+highland*.16+rain*.65-perlas*.03),wind:1.5+rain*5+Math.sin(time*.23)*1.2,storm:north>.65&&rain>.65,region:highland>.45?'highlands':perlas>.35?'perlas':north>.55?'caribbean':'pacific'};
}
export function createRegionalWeather({T,scene,geometry,height,sun,joy}){
 const root=new T.Group();root.name='Regional weather · drifting rain and lightning';scene.add(root);
 const count=2400,positions=new Float32Array(count*6),geo=geometry(new T.BufferGeometry());geo.setAttribute('position',new T.BufferAttribute(positions,3));
 const rainMaterial=new T.LineBasicMaterial({color:'#d0e2ef',transparent:true,opacity:.65,depthWrite:false}),rain=new T.LineSegments(geo,rainMaterial);rain.frustumCulled=false;root.add(rain);
 const boltGeo=geometry(new T.BufferGeometry()),boltPoints=new Float32Array(18*6);boltGeo.setAttribute('position',new T.BufferAttribute(boltPoints,3));const boltMaterial=new T.LineBasicMaterial({color:'#edf1ff',transparent:true,opacity:.95,depthWrite:false}),bolt=new T.LineSegments(boltGeo,boltMaterial);bolt.frustumCulled=false;root.add(bolt);
 const flash=new T.PointLight('#c2d7ff',0,130,1.5);root.add(flash);
 const baseFog=scene.fog?.density??.001;let lastX=Infinity,lastZ=Infinity;const groundGrid=new Float32Array(100);let thunderCycle=-1;let clock=0,current={rain:0,mist:0,cloud:0};
 function update(dt,active,{x=0,z=0,indoors=false}={}){
  if(active&&!indoors)clock+=Math.min(dt,.1);root.visible=!indoors;
  const target=indoors?{rain:0,mist:0,cloud:0}:regionalWeather(x,z,clock),ease=1-Math.exp(-Math.max(0,dt)*1.8);
  for(const k of ['rain','mist','cloud'])current[k]+=(target[k]-current[k])*ease;
  scene.userData.regionalWeather={...current};if(sun)sun.intensity*=1-current.cloud*.6;if(scene.fog)scene.fog.density=baseFog+current.mist+current.rain*.002;
  rain.visible=current.rain>.04;geo.setDrawRange(0,Math.floor(count*current.rain)*2);rainMaterial.opacity=.35+current.rain*.4;
  if(Math.hypot(x-lastX,z-lastZ)>4){lastX=x;lastZ=z;for(let a=0;a<10;a++)for(let b=0;b<10;b++)groundGrid[a*10+b]=height(x-40+a*8,z-40+b*8);}
  for(let i=0;i<count;i++){const px=x+((i*17.713+clock*(target.wind||0))%54)-27,pz=z+((i*23.131+clock*.8)%54)-27,ground=groundGrid[Math.max(0,Math.min(9,Math.round((px-lastX+40)/8)))*10+Math.max(0,Math.min(9,Math.round((pz-lastZ+40)/8)))],y=ground+((i*3.79-clock*(22+current.rain*13))%35+35)%35,k=i*6;positions.set([px,y,pz,px-.18-current.rain*.3,y+1.4+current.rain*2,pz+.13],k);}geo.attributes.position.needsUpdate=true;
  const phase=clock%23,lit=active&&!indoors&&target.storm&&phase>13&&phase<13.16;bolt.visible=lit;flash.intensity=lit?90:0;
  if(lit&&thunderCycle!==Math.floor(clock/23)){thunderCycle=Math.floor(clock/23);joy?.effect('thunder');}
  if(lit){const bx=x+42,bz=z-30,ground=height(bx,bz);for(let i=0;i<18;i++){const k=i*6,y=ground+65-i*3.6,dx=Math.sin(i*7.1+Math.floor(clock/23))*2.7;boltPoints.set([bx+dx,y,bz,bx+Math.sin((i+1)*7.1+Math.floor(clock/23))*2.7,y-3.6,bz+.3],k);}boltGeo.attributes.position.needsUpdate=true;flash.position.set(bx,ground+25,bz);}
 }
 return {root,update,get clock(){return clock;},dispose(){scene.remove(root);rainMaterial.dispose();boltMaterial.dispose();delete scene.userData.regionalWeather;if(scene.fog)scene.fog.density=baseFog;}};
}

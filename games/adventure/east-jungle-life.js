import {JUNGLE_BOULDERS} from './darien-terrain.js';
import {predatorStep,predatorAlert} from './predator-motion.js';
import {jungleModels} from './jungle-models.js';
import {JUNGLE_PONDS,inlandWaterDistance} from './rainforest-layout.js';
import {jungleTrailPoint} from './east-jungle-layout.js';
import {placeGroundVehicle} from './vehicle-grounding.js';
import {vehicleEscapeClear} from './vehicle-contact.js';
import {giantSnakePose,jungleContains} from './east-jungle-layout.js';
import {createNatureDecor} from './nature-decor.js?v=225';
function buildEastJungleLife({T,scene,geometry,mat,make,ball,cylinder,box,height,inWater,clear=()=>true}){
 const root=new T.Group();root.name='Darién eastern jungle · living wildlife';scene.add(root);
 const brown=mat('#674830'),cream=mat('#c4a779'),black=mat('#20251a'),green=mat('#426c30'),gold=mat('#d4b849'),red=mat('#b2334a'),bark=mat('#6d5438');
 const p=(g,m,x,y,z,w,h,d,parent)=>make(g,m,x,y,z,w,h,d,parent);
 const stone=mat('#596357',{roughness:1}),moss=mat('#344c30',{roughness:1}),rockGeo=geometry(new T.IcosahedronGeometry(1,1));
 for(const r of JUNGLE_BOULDERS){const rock=p(rockGeo,r.seed%3?stone:moss,r.x,height(r.x,r.z)+r.h*.34,r.z,r.r,r.h,r.r*.86,root);rock.name='Darién rugged moss boulder';rock.rotation.set(r.seed*.17,r.seed*.73,r.seed*.12);}
 const animals=[],predators=[],crocs=[],jeeps=[],models=jungleModels({T,geometry,mat,make,ball,box,cylinder});
 // Jaguars stalk through cover; humans stay on a narrow service track.
 for(let i=0;i<4;i++){let x=565+i*57,z=-50-i*22;for(let j=0;j<80;j++){const r=Math.sqrt(j)*1.6,a=j*2.4,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;if(jungleContains(px,pz)&&!inWater(px,pz)&&clear(px,pz)){x=px;z=pz;break;}}const a=models.jaguar(root,i);a.g.position.set(x,height(x,z),z);predators.push({...a,x,z,phase:i*1.8});}
 for(let i=0;i<6;i++){const pond=JUNGLE_PONDS[i%JUNGLE_PONDS.length],a=models.crocodile(root);crocs.push({...a,pond,phase:i*2.4});}
 for(let i=0;i<2;i++){const a=models.jeep(root,i);jeeps.push({...a,bus:false,phase:i*Math.PI/2});}
 for(let i=0;i<16;i++){
  const g=new T.Group();g.name=i<10?'Darién green iguana':'Darién forest frog';root.add(g);const x=537+(i%7)*32,z=-20-Math.floor(i/7)*43,isLizard=i<10;
  p(ball,green,0,.25,0,isLizard?.23:.18,.18,isLizard?.65:.22,g);p(ball,green,0,.32,.55,.17,.16,.23,g);
  for(const side of [-1,1]){p(ball,gold,side*.11,.4,.68,.045,.045,.035,g);p(ball,black,side*.12,.4,.71,.02,.028,.015,g);for(const z of [-.35,.35]){const leg=p(cylinder,green,side*.29,.12,z,.05,.45,.05,g);leg.rotation.z=side*.9;}}
  if(isLizard){const tail=p(geometry(new T.ConeGeometry(.18,1.7,7)),green,0,.2,-1.1,1,1,1,g);tail.rotation.x=-Math.PI/2;}
  animals.push({g,x,z,limbs:[],kind:isLizard?'iguana':'frog',phase:i*1.7});
 }
 const decor=createNatureDecor(T,geometry),birdMat=mat('#ffffff',{vertexColors:true});
 for(let i=0;i<24;i++){const g=new T.Group();g.name='Darién toucan';root.add(g);p(decor(11),birdMat,0,0,0,1,1,1,g);const wings=[-1,1].map(s=>p(ball,black,s*.38,.06,0,.45,.035,.18,g));animals.push({wings,g,x:550+(i%6)*29,z:-112-Math.floor(i/6)*9,limbs:[],kind:'toucan',phase:i*1.3});}
 const snake=new T.Group();snake.name='One giant jungle snake';root.add(snake);const snakeSkin=mat('#667046',{roughness:.6}),body=new T.InstancedMesh(ball,mat('#ffffff',{roughness:.64}),54);body.name='Living giant snake body';body.frustumCulled=false;snake.add(body);
 const head=new T.Group();snake.add(head);p(ball,snakeSkin,0,.5,0,1.05,.58,1.6,head);p(ball,cream,0,.24,.37,.92,.20,1.28,head);
 for(const side of [-1,1]){p(ball,gold,side*.76,.82,.64,.19,.15,.2,head);p(ball,black,side*.85,.84,.76,.045,.13,.05,head);}
 const tongue=p(box,red,0,.38,1.65,.09,.04,.8,head);const dummy=new T.Object3D(),color=new T.Color(),segments=[];let time=0;const snakeNav=giantSnakePose(0),snakeHome={...snakeNav},snakeTrail=Array.from({length:100},(_,i)=>giantSnakePose(-i*.38));
 const trail=new T.Group();trail.name='Eastern jungle walking trail';root.add(trail);const pathMesh=new T.InstancedMesh(ball,bark,95),pathDummy=new T.Object3D();trail.add(pathMesh);
 // A narrow, visible woodland path meets the existing eastern city road.
 for(let i=0;i<95;i++){const t=i/94,x=490+240*t,z=-57-28*Math.sin(t*4.4)-20*t;if(!inWater(x,z)){pathDummy.position.set(x,height(x,z)+.01,z);pathDummy.scale.set(2.8,.025,2.8);pathDummy.updateMatrix();pathMesh.setMatrixAt(i,pathDummy.matrix);}}
 pathMesh.instanceMatrix.needsUpdate=true;pathMesh.computeBoundingSphere();
 function update(dt,active,player){root.visible=!player.indoors&&player.x>460&&player.x<825&&player.z> -230&&player.z<80;if(!root.visible)return;if(active)time+=dt;
  for(const a of animals){const x=a.x+Math.sin(time*.26+a.phase)*3,z=a.z+Math.cos(time*.21+a.phase)*2;a.g.visible=Math.hypot(player.x-x,player.z-z)<105;if(!a.g.visible)continue;if(!a.initialized){for(let j=0;j<30;j++){const xx=a.x+Math.cos(j*2.4)*(j*.35),zz=a.z+Math.sin(j*2.4)*(j*.35);if(clear(xx,zz)&&!inWater(xx,zz)){a.x=xx;a.z=zz;a.g.position.set(xx,height(xx,zz),zz);a.initialized=true;break;}}}
  if(!inWater(x,z)&&jungleContains(x,z)&&(a.kind==='toucan'||clear(x,z))){a.g.position.set(x,height(x,z)+(a.kind==='toucan'?18+Math.sin(time*.8+a.phase)*3:0),z);a.g.rotation.y=Math.atan2(Math.cos(time*.26+a.phase),-Math.sin(time*.21+a.phase));a.limbs.forEach((l,i)=>l.rotation.x=Math.sin(time*4+i*Math.PI)*.55);a.wings?.forEach((w,i)=>w.rotation.z=Math.sin(time*8+a.phase)*(i?1:-1)*.7);}}
  segments.length=0;
  for(const a of predators){const pos=a.g.position,d=Math.hypot(player.x-pos.x,player.z-pos.z),stalk=predatorAlert(pos,a,player);const tx=stalk?player.x:a.x+Math.sin(time*.10+a.phase)*11,tz=stalk?player.z:a.z+Math.cos(time*.08+a.phase)*9,dx=tx-pos.x,dz=tz-pos.z,len=Math.hypot(dx,dz),next=predatorStep(pos,{x:tx,z:tz},active?dt:0,stalk?7.2:2.1,(x,z)=>jungleContains(x,z)&&!inWater(x,z)&&clear(x,z));if(next.moving){pos.set(next.x,height(next.x,next.z),next.z);a.g.rotation.y=next.heading;}a.legs.forEach((l,i)=>l.rotation.x=active?Math.sin(time*(stalk?10:4)+i*Math.PI)*.45:0);a.tail.rotation.y=Math.sin(time*1.2+a.phase)*.15;if(a.jaw)a.jaw.rotation.x=stalk?.30:0;a.g.visible=d<110;segments.push({kind:'jaguar',x:pos.x,y:pos.y+.6,z:pos.z,radius:1.15,length:3.0,warningRadius:24,heading:a.g.rotation.y});}
  for(const a of crocs){const t=time*.12+a.phase,alert=predatorAlert(a.g.position,a.pond,player,{notice:24,leash:27}),target=alert?player:{x:a.pond.x+Math.cos(t)*a.pond.rx*.55,z:a.pond.z+Math.sin(t)*a.pond.rz*.50};if(!a.initialized){a.g.position.set(a.pond.x,.015,a.pond.z);a.initialized=true;}const next=predatorStep(a.g.position,target,active?dt:0,alert?3.8:1.5,(x,z)=>inlandWaterDistance(x,z)<0&&Math.hypot((x-a.pond.x)/a.pond.rx,(z-a.pond.z)/a.pond.rz)<.88);const x=next.x,z=next.z;a.g.position.set(x,.015,z);if(next.moving)a.g.rotation.y=next.heading;a.tail.rotation.y=Math.sin(time*1.5+a.phase)*.08;a.g.visible=Math.hypot(player.x-x,player.z-z)<110;segments.push({kind:'crocodile',x,y:.2,z,radius:.9,length:4.5,warningRadius:18,heading:a.g.rotation.y});}
  for(const a of jeeps){const clock=a.time||0,u=(a.phase? .39:.15)+Math.sin(clock*.12)*.08,p=jungleTrailPoint(u),next=jungleTrailPoint(u+.001),heading=Math.atan2(next.x-p.x,next.z-p.z)+(Math.cos(clock*.12)<0?Math.PI:0);const safe=Math.hypot(player.x-p.x,player.z-p.z)>6;if(safe||!a.started){const old=a.g.rotation.y,turn=Math.atan2(Math.sin(heading-old),Math.cos(heading-old));placeGroundVehicle(a.g,{...p,heading:a.started?old+turn*Math.min(1,dt*3):heading},height,'jeep');a.started=true;if(active)a.time=clock+dt;}a.g.visible=Math.hypot(player.x-a.g.position.x,player.z-a.g.position.z)<125;}
  const target=predatorAlert(snakeNav,snakeHome,player,{notice:34,leash:100})?player:giantSnakePose(time),nextSnake=predatorStep(snakeNav,target,active?dt:0,target===player?4.9:2.4,(x,z)=>jungleContains(x,z)&&!inWater(x,z)&&clear(x,z));if(nextSnake.moving){Object.assign(snakeNav,nextSnake);if(Math.hypot(snakeNav.x-snakeTrail[0].x,snakeNav.z-snakeTrail[0].z)>.18){snakeTrail.unshift({...snakeNav});snakeTrail.length=Math.min(180,snakeTrail.length);}}const pose=snakeNav;

  for(let i=0;i<54;i++){let travel=0,index=0;while(index<snakeTrail.length-1&&travel<i*.40){travel+=Math.hypot(snakeTrail[index].x-snakeTrail[index+1].x,snakeTrail[index].z-snakeTrail[index+1].z);index++;}const sample=snakeTrail[index],x=sample.x,z=sample.z,y=height(x,z)+.42,r=Math.max(.13,.78*(1-i/63));dummy.position.set(x,y,z);dummy.rotation.set(0,pose.heading,0);dummy.scale.set(r,.44*(1-i/70),.56);dummy.updateMatrix();body.setMatrixAt(i,dummy.matrix);body.setColorAt(i,color.set(i%7<2?'#27372a':'#667046'));segments.push({kind:'snake',x,y,z,radius:r,warningRadius:21});if(i===0){head.position.set(x,y-.05,z);head.rotation.y=pose.heading;}}
  tongue.scale.z=.35+Math.max(0,Math.sin(time*8))*.7;body.instanceMatrix.needsUpdate=true;body.instanceColor.needsUpdate=true;
 }
 return {root,animals,snake,predators,crocs,jeeps,trafficClear:(x,z,heading,from)=>jeeps.every(a=>vehicleEscapeClear({x,z,heading},{x:a.g.position.x,z:a.g.position.z,heading:a.g.rotation.y,length:2.25,width:1.3},from)),hazards:()=>segments,update,dispose(){scene.remove(root);}};
}

// Wildlife details are built on first arrival, so a new game need not load them.
export function createEastJungleLife(options){let life=null;return {setClear(fn){options.clear=fn;},update(dt,active,player){if(!life&&player.x>460&&player.x<825&&player.z> -230&&player.z<80&&!player.indoors)life=buildEastJungleLife(options);life?.update(dt,active,player);},get vehicles(){return life?.jeeps||[];},trafficClear:(x,z,heading,from)=>life?.trafficClear(x,z,heading,from)??true,hazards:()=>life?.hazards()||[],dispose(){life?.dispose();}};}

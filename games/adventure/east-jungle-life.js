import {groundAnimal} from './animal-craft.js';
import {createAnaconda,anacondaRadius} from './anaconda-model.js';
import {landAnimalModels} from './land-animal-models.js';
import {createDetailedBird} from './bird-models.js';
import {ruggedRockGeometry,ruggedRockSurface} from './rugged-rocks.js';
import {JUNGLE_BOULDERS} from './darien-terrain.js';
import {predatorStep,predatorAlert} from './predator-motion.js';
import {jungleModels} from './jungle-models.js';
import {JUNGLE_PONDS,DARIEN_RIVERS,inlandWaterDistance} from './rainforest-layout.js';
import {jungleTrailPoint} from './east-jungle-layout.js';
import {placeGroundVehicle} from './vehicle-grounding.js';
import {vehicleEscapeClear} from './vehicle-contact.js';
import {giantSnakePose,jungleContains} from './east-jungle-layout.js';
function buildEastJungleLife({T,scene,geometry,mat,make,ball,cylinder,box,height,inWater,clear=()=>true}){
 const root=new T.Group();root.name='Darién eastern jungle · living wildlife';scene.add(root);
 const bark=mat('#6d5438');
 const p=(g,m,x,y,z,w,h,d,parent)=>make(g,m,x,y,z,w,h,d,parent);
 const rockSurface=ruggedRockSurface(T),rockMaterial={map:rockSurface.color,bumpMap:rockSurface.bump,bumpScale:.14,vertexColors:true,roughness:1},stone=mat('#ffffff',rockMaterial),moss=mat('#bac5ad',rockMaterial),rockVariants=Array.from({length:8},(_,i)=>ruggedRockGeometry(T,geometry,i));
 stone.addEventListener('dispose',()=>{rockSurface.color.dispose();rockSurface.bump.dispose();});
 for(const r of JUNGLE_BOULDERS){const rock=p(rockVariants[r.seed%8],r.seed%3?stone:moss,r.x,height(r.x,r.z)+r.h*.34,r.z,r.r,r.h,r.r*.86,root);rock.name='Darién rugged moss boulder';rock.rotation.set((r.seed%3-1)*.09,r.seed*.73,(r.seed%5-2)*.04);rock.userData.fracturedRock=true;}
 const animals=[],predators=[],crocs=[],jeeps=[],models=jungleModels({T,geometry,mat,make,ball,box,cylinder});
 const catGround=(x,z)=>jungleContains(x,z)&&!inWater(x,z)&&clear(x,z)&&Math.max(...[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dz])=>Math.abs(height(x+dx,z+dz)-height(x,z))))<.85;
 // Jaguars stalk through cover; humans stay on a narrow service track.
 for(let i=0;i<4;i++){let x=565+i*57,z=-50-i*22;for(let j=0;j<80;j++){const r=Math.sqrt(j)*1.6,a=j*2.4,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;if(catGround(px,pz)){x=px;z=pz;break;}}const a=models.jaguar(root,i);a.g.position.set(x,height(x,z),z);predators.push({...a,x,z,phase:i*1.8});}
 for(let i=0;i<6;i++){const pond=JUNGLE_PONDS[i%JUNGLE_PONDS.length],a=models.crocodile(root);crocs.push({...a,pond,phase:i*2.4});}
 for(const [i,[x,z]]of DARIEN_RIVERS[0].filter((_,i)=>i%2===1).entries()){const a=models.crocodile(root);crocs.push({...a,pond:{x,z,rx:9,rz:9},phase:i*1.7,river:true});}
 for(let i=0;i<2;i++){const a=models.jeep(root,i);jeeps.push({...a,bus:false,phase:i*Math.PI/2});}
 const land=landAnimalModels({T,geometry,mat,make,ball,cylinder});
 for(let i=0;i<16;i++){const isLizard=i<10,a=land.reptile(root,!isLizard);animals.push({...a,x:537+(i%7)*32,z:-20-Math.floor(i/7)*43,limbs:a.legs,kind:isLizard?'iguana':'frog',phase:i*1.7});}
 for(let i=0;i<24;i++){const a=createDetailedBird({T,geometry,mat,make,ball,cylinder},root,'toucan');animals.push({...a,x:550+(i%6)*29,z:-112-Math.floor(i/6)*9,limbs:[],kind:'toucan',phase:i*1.3});}
 const anaconda=createAnaconda({T,geometry,mat,make,ball,cylinder},root),snake=anaconda.g;
 const segments=[];let time=0;const snakeNav=giantSnakePose(0),snakeHome={...snakeNav},snakeTrail=Array.from({length:180},(_,i)=>giantSnakePose(-i*.38));
 const trail=new T.Group();trail.name='Eastern jungle walking trail';root.add(trail);const pathMesh=new T.InstancedMesh(ball,bark,95),pathDummy=new T.Object3D();trail.add(pathMesh);
 // A narrow, visible woodland path meets the existing eastern city road.
 for(let i=0;i<240;i++){const p=jungleTrailPoint(i/239),q=jungleTrailPoint((i+.5)/239);if(inlandWaterDistance(p.x,p.z)<6){const deck=make(box,bark,p.x,height(p.x,p.z)-.10,p.z,5.8,.2,.95,trail);deck.rotation.y=Math.atan2(q.x-p.x,q.z-p.z);}}
 for(let i=0;i<95;i++){const {x,z}=jungleTrailPoint(i/94);if(!inWater(x,z)){pathDummy.position.set(x,height(x,z)+.01,z);pathDummy.scale.set(2.8,.025,2.8);pathDummy.updateMatrix();pathMesh.setMatrixAt(i,pathDummy.matrix);}}
 pathMesh.instanceMatrix.needsUpdate=true;pathMesh.computeBoundingSphere();
 function update(dt,active,player){root.visible=!player.indoors&&player.x>460&&player.x<825&&player.z> -230&&player.z<80;if(!root.visible)return;if(active)time+=dt;
  for(const a of animals){const pace=.62+(a.phase%1)*.7,animalTime=time*pace,x=a.x+Math.sin(animalTime*.26+a.phase)*(a.kind==='toucan'?12:3),z=a.z+Math.cos(animalTime*.21+a.phase)*(a.kind==='toucan'?9:2);a.g.visible=Math.hypot(player.x-x,player.z-z)<105;if(!a.g.visible)continue;if(!a.initialized){for(let j=0;j<30;j++){const xx=a.x+Math.cos(j*2.4)*(j*.35),zz=a.z+Math.sin(j*2.4)*(j*.35);if(clear(xx,zz)&&!inWater(xx,zz)){a.x=xx;a.z=zz;a.g.position.set(xx,height(xx,zz),zz);a.initialized=true;break;}}}
  if(!inWater(x,z)&&jungleContains(x,z)&&(a.kind==='toucan'||clear(x,z))){a.g.position.set(x,height(x,z)+(a.kind==='toucan'?18+Math.sin(time*.8+a.phase)*3:0),z);a.g.rotation.y=Math.atan2(Math.cos(animalTime*.26+a.phase)*.26,-Math.sin(animalTime*.21+a.phase)*.21);a.limbs.forEach((l,i)=>l.rotation.x=Math.sin(animalTime*(a.kind==='frog'?2:3)+[0,Math.PI,Math.PI,0][i])*(a.kind==='frog'?.20:.12));if(a.kind==='frog')a.g.position.y+=Math.pow(Math.max(0,Math.sin(time*2+a.phase)),5)*.13;a.animate?.(time+a.phase,{flying:true});if(a.tail)a.tail.rotation.y=Math.sin(time*2+a.phase)*.08;}}
  segments.length=0;
  for(const a of predators){const pos=a.g.position,d=Math.hypot(player.x-pos.x,player.z-pos.z),stalk=predatorAlert(pos,a,player);const tx=stalk?player.x:a.x+Math.sin(time*.10+a.phase)*11,tz=stalk?player.z:a.z+Math.cos(time*.08+a.phase)*9,dx=tx-pos.x,dz=tz-pos.z,len=Math.hypot(dx,dz),next=predatorStep(pos,{x:tx,z:tz},active?dt:0,stalk?7.2+a.phase*.12:1.4+a.phase*.18,catGround);if(next.moving){pos.set(next.x,height(next.x,next.z),next.z);a.g.rotation.y=next.heading;}groundAnimal(a.g,height,2.3,.75);a.walk=(a.walk||0)+(next.moving?dt*(stalk?10:4)*(1+a.phase*.025):0);a.legs.forEach((l,i)=>{const phase=a.walk+[0,Math.PI,Math.PI,0][i];l.rotation.x=next.moving?Math.sin(phase)*.42:0;if(l.userData.knee)l.userData.knee.rotation.x=next.moving?Math.max(0,Math.cos(phase))*.40:0;});a.tail.rotation.y=Math.sin(time*1.2+a.phase)*.15;if(a.jaw)a.jaw.rotation.x=stalk?.30:0;a.g.visible=d<110;segments.push({kind:'jaguar',x:pos.x,y:pos.y+.6,z:pos.z,radius:1.15,length:3.0,warningRadius:24,heading:a.g.rotation.y});}
  for(const a of crocs){const t=time*.12+a.phase,alert=predatorAlert(a.g.position,a.pond,player,{notice:24,leash:27}),target=alert?player:{x:a.pond.x+Math.cos(t)*a.pond.rx*.55,z:a.pond.z+Math.sin(t)*a.pond.rz*.50};if(!a.initialized){a.g.position.set(a.pond.x,.015,a.pond.z);a.initialized=true;}const next=predatorStep(a.g.position,target,active?dt:0,alert?3.8:1.5,(x,z)=>inlandWaterDistance(x,z)<0&&Math.hypot((x-a.pond.x)/a.pond.rx,(z-a.pond.z)/a.pond.rz)<.88);const x=next.x,z=next.z;a.g.position.set(x,.015,z);if(next.moving)a.g.rotation.y=next.heading;a.tail.rotation.y=Math.sin(time*1.5+a.phase)*.08;a.g.visible=Math.hypot(player.x-x,player.z-z)<110;segments.push({kind:'crocodile',x,y:.2,z,radius:.9,length:4.5,warningRadius:18,heading:a.g.rotation.y});}
  for(const [i,a]of jeeps.entries()){const p=jungleTrailPoint(.02+i*.055);p.z+=9;placeGroundVehicle(a.g,{...p,heading:Math.PI/2},height,'jeep');a.g.visible=Math.hypot(player.x-p.x,player.z-p.z)<150;}

  const target=predatorAlert(snakeNav,snakeHome,player,{notice:34,leash:100})?player:giantSnakePose(time),nextSnake=predatorStep(snakeNav,target,active?dt:0,target===player?4.9:2.4,(x,z)=>jungleContains(x,z)&&!inWater(x,z)&&clear(x,z));if(nextSnake.moving){Object.assign(snakeNav,nextSnake);if(Math.hypot(snakeNav.x-snakeTrail[0].x,snakeNav.z-snakeTrail[0].z)>.18){snakeTrail.unshift({...snakeNav});snakeTrail.length=Math.min(180,snakeTrail.length);}}const pose=snakeNav;

  const liveTrail=[{...snakeNav},...snakeTrail];const centers=anaconda.update(liveTrail,height,time,pose.heading,(x,z)=>jungleContains(x,z)&&!inWater(x,z)&&clear(x,z));
  for(let i=0;i<54;i++){const t=i/53,c=centers[Math.round(t*(centers.length-1))];segments.push({kind:'snake',x:c.x,y:c.y,z:c.z,radius:anacondaRadius(t),warningRadius:21});}

 }
 return {root,animals,snake,predators,crocs,jeeps,trafficClear:(x,z,heading,from)=>jeeps.every(a=>vehicleEscapeClear({x,z,heading},{x:a.g.position.x,z:a.g.position.z,heading:a.g.rotation.y,length:2.25,width:1.3},from)),hazards:()=>segments,update,dispose(){land.dispose();scene.remove(root);}};
}

// Wildlife details are built on first arrival, so a new game need not load them.
export function createEastJungleLife(options){let life=null;return {setClear(fn){options.clear=fn;},update(dt,active,player){if(!life&&player.x>460&&player.x<825&&player.z> -230&&player.z<80&&!player.indoors)life=buildEastJungleLife(options);life?.update(dt,active,player);},get vehicles(){return life?.jeeps||[];},trafficClear:(x,z,heading,from)=>life?.trafficClear(x,z,heading,from)??true,hazards:()=>life?.hazards()||[],dispose(){life?.dispose();}};}

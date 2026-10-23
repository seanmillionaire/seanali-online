import {createResidentRoutine} from './resident-routine.js';
import {gorgonaShoreZ} from './gorgona-shore.js';
import {regionalBlocked} from './regional-layout.js';
import {createHuman,setHumanAge} from './character-model.js';
import {inWater,roadDistance} from './explore-state.js';
export const BEACH_MATCH={x:-34,z:17,half:6,depth:2.3};
export function createGorgonaFamilies(o){
 const {T,geometry,mat,make,box,ball,cylinder,height,scene}=o,root=new T.Group();root.name='Gorgona family beach day';scene.add(root);
 const actors=[],shade=mat('#e8d9b5'),wood=mat('#9e7950'),white=mat('#fff9e6'),water=mat('#6dbacf'),red=mat('#d56554'),blue=mat('#5da4b5');let time=0,built=false,velocity=0,score=0,football;
 const put=(geo,m,x,y,z,w,h,d,parent=root)=>make(geo,m,x,y,z,w,h,d,parent);
 function person(x,z,i,activity,child=false,familyId=0,member=0){if(activity!=='swim'&&(inWater(x,z)||regionalBlocked(x,z)||roadDistance(x,z)<9))return;const h=createHuman(o,{index:i,beach:true,skinTone:[[5,6,5,6,4],[2,3,2,3,1],[0,2,1,2,0],[4,5,4,5,3],[3,4,2,3,4]][familyId%5][member%5],beachHair:member%3===0?'curls':member%3===1?'bun':'short',beachWear:member%3===1?'sundress':activity==='swim'?'swimsuit':'tee-shorts'}),g=h.g;g.name='Beach family · '+activity;g.position.set(x,height(x,z),z);setHumanAge(h,child?'kid':'adult',member);g.userData.familyId=familyId;g.userData.child=child;root.add(g);const actor={...h,x,z,i,activity,child,familyId,member};if(activity==='stroll')actor.routine=createResidentRoutine(actor,{seed:950+i*157,home:{x,z},height,radius:3,clear:(x,z)=>!inWater(x,z)&&!regionalBlocked(x,z)&&roadDistance(x,z)>9});actors.push(actor);return h;}
 function build(){built=true;
  for(const [group,cx]of [-87,-70,-54,-39,-27].entries()){const cz=gorgonaShoreZ(cx)-3.6;
   if(inWater(cx,cz))continue;
   put(box,group%2?blue:red,cx,height(cx,cz)+.04,cz,3.2,.035,2.1);
   put(cylinder,wood,cx+1.7,height(cx+1.7,cz)+1.1,cz,.045,2.2,.045);
   const canopy=put(geometry(new T.ConeGeometry(2.1,.65,12)),group%2?blue:shade,cx+1.7,height(cx+1.7,cz)+2.3,cz,1,1,1);canopy.name='Beach sun umbrella';
   for(let j=0;j<5;j++){const x=cx+(j%3-1)*1.05,z=cz+(j<3?-.7:.8),p=person(x,z,group*5+j,j===1?'drink':'picnic',j>=2,group,j);if(!p)continue;p.g.rotation.y=j?1.5:-1.5;if(j<3){p.legs.forEach(l=>l.rotation.x=-Math.PI/2);p.knees.forEach(k=>k.rotation.x=0);p.g.position.y=height(x,z)+.10-.86*p.g.scale.y;p.g.userData.seated=true;}const hand=p.elbows[1];hand.rotation.x=-1.3;put(cylinder,j===1?water:white,0,-.27,.07,.07,.16,.07,hand);}
   put(box,white,cx-.6,height(cx-.6,cz)+.15,cz, .55,.25,.4);put(cylinder,white,cx+.45,height(cx+.45,cz)+.09,cz,.25,.035,.25);for(let j=0;j<3;j++)put(ball,red,cx+.3+j*.14,height(cx,cz)+.13,cz,.09,.05,.07);
  }
  for(let i=0;i<10;i++){const x=-85+Math.floor(i/2)*20+(i%2)*1.4;let z=18;while(z<38&&!inWater(x,z))z+=.5;if(z>=38)continue;person(x,z+1.2,i+30,'swim',i%2===1,Math.floor(i/2),i%2);}
  for(let i=0;i<4;i++)person(-57+(i%2)*1.1,14.7+Math.floor(i/2)*1.5,55+i,'stroll',i%2===1,3,i%2);
  const c=BEACH_MATCH;football=put(ball,white,c.x,height(c.x,c.z)+.25,c.z,.25,.25,.25);football.name='Playable Gorgona beach football';
  for(const side of [-1,1]){const x=c.x+side*c.half;for(const dz of [-1,1])put(cylinder,wood,x,height(x,c.z+dz)+.65,c.z+dz,.045,1.3,.045);const bar=put(cylinder,wood,x,height(x,c.z)+1.3,c.z,.045,2,.045);bar.rotation.x=Math.PI/2;}
  for(let i=0;i<4;i++)person(c.x+(i%2?3:-3),c.z+(i<2?-1.5:1.5),i+44,'football',i%2===0,i%4,i%3);
 }
 function kick(x,z){if(!football||Math.hypot(x-football.position.x,z-football.position.z)>3)return false;velocity=(x<football.position.x?1:-1)*5.2;return true;}
 function update(dt,active,info){root.visible=!info.indoors&&Math.hypot(info.x+40,info.z-10)<160;if(!root.visible)return;if(!built)build();if(active)time+=dt;
  for(const a of actors){if(a.activity==='swim'){a.g.position.y=-.08+Math.sin(time*1.6+a.i)*.04;a.g.rotation.x=-Math.PI/2;a.arms.forEach((arm,i)=>arm.rotation.x=Math.sin(time*1.8+a.i+i*Math.PI)*.9);a.legs.forEach((l,i)=>l.rotation.x=Math.sin(time*2+i*Math.PI)*.3);a.g.position.x=a.x+Math.sin(time*.22+a.i)*.8;}else if(a.activity==='stroll'){a.routine.update(dt,active,(x,z)=>Math.hypot(x-info.x,z-info.z)<.85);}else if(a.activity==='football'){const x=a.x+Math.sin(time*.5+a.i)*.65,z=a.z+Math.cos(time*.4+a.i)*.35;if(!inWater(x,z)){a.g.position.set(x,height(x,z),z);a.g.rotation.y=Math.atan2(football.position.x-x,football.position.z-z);a.legs.forEach((l,i)=>l.rotation.x=Math.sin(time*4+i*Math.PI)*.4);a.animate(time*4,true);}}else{a.g.rotation.y+=active?Math.sin(time*.3+a.i)*dt*.04:0;a.elbows[1].rotation.x=-1.3-Math.max(0,Math.sin(time*.65+a.i))*.25;}}
  if(active&&football){football.position.x+=velocity*dt;velocity*=Math.exp(-dt*.45);football.position.y=height(football.position.x,football.position.z)+.25+Math.abs(Math.sin(time*8))*Math.min(.4,Math.abs(velocity)*.05);football.rotation.z-=velocity*dt*2;if(Math.abs(football.position.x-BEACH_MATCH.x)>BEACH_MATCH.half){score++;football.position.x=BEACH_MATCH.x;velocity=0;}if(!velocity&&time%9<dt&&Math.hypot(info.x-football.position.x,info.z-football.position.z)>3)velocity=score%2?-3.5:3.5;}
 }
 return {root,actors,get ball(){return football;},get score(){return score;},kick,near:(x,z)=>football&&Math.hypot(x-football.position.x,z-football.position.z)<2.6?{type:'beachSoccer'}:null,update,dispose(){scene.remove(root);}};
}

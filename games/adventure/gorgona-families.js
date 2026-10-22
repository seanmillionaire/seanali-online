import {createHuman} from './character-model.js';
import {inWater,roadDistance} from './explore-state.js';
export const BEACH_MATCH={x:-34,z:17,half:6,depth:2.3};
export function createGorgonaFamilies(o){
 const {T,geometry,mat,make,box,ball,cylinder,height,scene}=o,root=new T.Group();root.name='Gorgona family beach day';scene.add(root);
 const actors=[],shade=mat('#e8d9b5'),wood=mat('#9e7950'),white=mat('#fff9e6'),water=mat('#6dbacf'),red=mat('#d56554'),blue=mat('#5da4b5');let time=0,built=false,velocity=0,score=0,football;
 const put=(geo,m,x,y,z,w,h,d,parent=root)=>make(geo,m,x,y,z,w,h,d,parent);
 function person(x,z,i,activity,child=false){if(activity!=='swim'&&(inWater(x,z)||roadDistance(x,z)<9))return;const h=createHuman(o,{index:i,beach:true}),g=h.g;g.name='Beach family · '+activity;g.position.set(x,height(x,z),z);g.scale.setScalar(child?.78:1.08);root.add(g);actors.push({...h,x,z,i,activity,child});return h;}
 function build(){built=true;
  for(const [group,cx]of [-83,-48,-16,14].entries()){const cz=group===3?8:13;
   if(inWater(cx,cz))continue;
   put(box,group%2?blue:red,cx,height(cx,cz)+.04,cz,3.2,.035,2.1);
   put(cylinder,wood,cx+1.7,height(cx+1.7,cz)+1.1,cz,.045,2.2,.045);
   const canopy=put(geometry(new T.ConeGeometry(2.1,.65,12)),group%2?blue:shade,cx+1.7,height(cx+1.7,cz)+2.3,cz,1,1,1);canopy.name='Beach sun umbrella';
   for(let j=0;j<3;j++){const x=cx+(j-1)*1.0,z=cz+(j%2?-.6:.6),p=person(x,z,group*3+j,j===1?'drink':'picnic',j===2);if(!p)continue;p.g.rotation.y=j?1.5:-1.5;p.legs.forEach(l=>l.rotation.x=-1.2);p.knees.forEach(k=>k.rotation.x=1.3);p.g.position.y-=.55;const hand=p.elbows[1];hand.rotation.x=-1.3;put(cylinder,j===1?water:white,0,-.27,.07,.07,.16,.07,hand);}
   put(box,white,cx-.6,height(cx-.6,cz)+.15,cz, .55,.25,.4);put(cylinder,white,cx+.45,height(cx+.45,cz)+.09,cz,.25,.035,.25);for(let j=0;j<3;j++)put(ball,red,cx+.3+j*.14,height(cx,cz)+.13,cz,.09,.05,.07);
  }
  for(let i=0;i<7;i++){const x=-86+i*14;let z=18;while(z<38&&!inWater(x,z))z+=.5;if(z>=38)continue;person(x,z+1.2,i+15,'swim',i%3===0);}
  const c=BEACH_MATCH;football=put(ball,white,c.x,height(c.x,c.z)+.25,c.z,.25,.25,.25);football.name='Playable Gorgona beach football';
  for(const side of [-1,1]){const x=c.x+side*c.half;for(const dz of [-1,1])put(cylinder,wood,x,height(x,c.z+dz)+.65,c.z+dz,.045,1.3,.045);const bar=put(cylinder,wood,x,height(x,c.z)+1.3,c.z,.045,2,.045);bar.rotation.x=Math.PI/2;}
  for(let i=0;i<4;i++)person(c.x+(i%2?3:-3),c.z+(i<2?-1.5:1.5),i+24,'football',i%2===0);
 }
 function kick(x,z){if(!football||Math.hypot(x-football.position.x,z-football.position.z)>3)return false;velocity=(x<football.position.x?1:-1)*5.2;return true;}
 function update(dt,active,info){root.visible=!info.indoors&&Math.hypot(info.x+40,info.z-10)<160;if(!root.visible)return;if(!built)build();if(active)time+=dt;
  for(const a of actors){if(a.activity==='swim'){a.g.position.y=-.08+Math.sin(time*1.6+a.i)*.04;a.g.rotation.x=-Math.PI/2;a.arms.forEach((arm,i)=>arm.rotation.x=Math.sin(time*1.8+a.i+i*Math.PI)*.9);a.legs.forEach((l,i)=>l.rotation.x=Math.sin(time*2+i*Math.PI)*.3);a.g.position.x=a.x+Math.sin(time*.22+a.i)*.8;}else if(a.activity==='football'){const x=a.x+Math.sin(time*.5+a.i)*.65,z=a.z+Math.cos(time*.4+a.i)*.35;if(!inWater(x,z)){a.g.position.set(x,height(x,z),z);a.g.rotation.y=Math.atan2(football.position.x-x,football.position.z-z);a.legs.forEach((l,i)=>l.rotation.x=Math.sin(time*4+i*Math.PI)*.4);a.animate(time*4,true);}}else{a.g.rotation.y+=active?Math.sin(time*.3+a.i)*dt*.04:0;a.elbows[1].rotation.x=-1.3-Math.max(0,Math.sin(time*.65+a.i))*.25;}}
  if(active&&football){football.position.x+=velocity*dt;velocity*=Math.exp(-dt*.45);football.position.y=height(football.position.x,football.position.z)+.25+Math.abs(Math.sin(time*8))*Math.min(.4,Math.abs(velocity)*.05);football.rotation.z-=velocity*dt*2;if(Math.abs(football.position.x-BEACH_MATCH.x)>BEACH_MATCH.half){score++;football.position.x=BEACH_MATCH.x;velocity=0;}if(!velocity&&time%9<dt&&Math.hypot(info.x-football.position.x,info.z-football.position.z)>3)velocity=score%2?-3.5:3.5;}
 }
 return {root,actors,get ball(){return football;},get score(){return score;},kick,near:(x,z)=>football&&Math.hypot(x-football.position.x,z-football.position.z)<2.6?{type:'beachSoccer'}:null,update,dispose(){scene.remove(root);}};
}

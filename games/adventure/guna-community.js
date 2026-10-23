import {gunaDancePose} from './guna-dance.js';
import {worldClock} from './world-clock.js';
import {createHuman} from './character-model.js';
import {cityX} from './geography.js';
export const GUNA_GATHERING={x:cityX(290),z:-430};
export function createGunaResident(o,index=0){
 const {T,make,mat,geometry,box,ball,cylinder}=o,woman=index%2===0;
 const h=createHuman(o,{index,gender:woman?'woman':'man',skinTone:2+index%3,beach:true,beachWear:woman?'sundress':'tee-shorts',beachHair:woman?'long':'short',outfitColor:woman?'#ba3444':'#e9dcca',pantsColor:'#384d67'});
 const red=mat('#b63e39'),yellow=mat('#dfb744'),blue=mat('#345b79'),black=mat('#382e2b');
 const part=(g,m,x,y,z,w,ht,d,parent=h.g)=>make(g,m,x,y,z,w,ht,d,parent);
 if(woman){part(ball,red,0,1.73,-.04,.145,.10,.14);part(box,red,0,1.55,-.14,.27,.33,.025);
  // Original layered geometric blouse panel, inspired by mola construction.
  part(box,black,0,1.1,.135,.30,.27,.012);for(let i=0;i<4;i++){const w=.27-i*.05,ht=.23-i*.04;for(const side of [-1,1]){part(box,i%2?red:yellow,side*w/2,1.1,.145+i*.001,.015,ht,.008);part(box,i%2?red:yellow,0,1.1+side*ht/2,.145+i*.001,w,.015,.008);}}
  for(const limb of [...h.elbows,...h.knees])for(let k=0;k<7;k++)part(cylinder,k%2?yellow:blue,0,-.08-k*.027,0,.052,.019,.056,limb);
 }else{for(let k=0;k<5;k++){const flute=part(cylinder,yellow,(k-2)*.022,1.20,.28,.012,.22+k*.025,.012);flute.rotation.x=.5;}}
 h.g.name='Guna community resident';h.g.userData.guna=true;h.batch();return h;
}
export function createGunaCommunity(o){
 const {T,scene,height,models,joy={},onEat,save,refresh,state}=o,root=new T.Group();root.name='Guna Yala · community dance and meal';scene.add(root);const site=GUNA_GATHERING,actors=[];
 for(let i=0;i<6;i++){const h=createGunaResident(o,i),x=site.x+(Math.floor(i/2)-1)*1.8,z=site.z+(i%2?-.65:.65);h.g.position.set(x,height(x,z),z);root.add(h.g);actors.push({...h,x,z});}
 const timber=o.mat('#8d6847');o.make(o.box,timber,site.x,height(site.x,site.z)+.55,site.z+2,1.6,.12,1,root);for(const side of [-1,1])o.make(o.cylinder,timber,site.x+side*.6,height(site.x,site.z)+.26,site.z+2,.07,.52,.07,root);
 const food=models.meal(root,'fishPlate',site.x,height(site.x,site.z)+.65,site.z+2,.7);food.visible=false;
 let time=0,joined=false,elapsed=0,eating=0,avatarRef=null;
 const open=()=>!worldClock(state?.world?.dayTime).night;
 const near=(x,z)=>open()&&Math.hypot(x-site.x,z-site.z)<4;
 function leave(){joined=false;eating=0;food.visible=false;if(avatarRef)avatarRef.rotation.z=0;}
 return {root,actors,site,near,get joined(){return joined;},get readyMeal(){return joined&&elapsed>8;},get eating(){return eating>0;},interact(){if(!open()){leave();return 'leave';}if(!joined){joined=true;elapsed=0;joy.gesture?.();return 'dance';}if(elapsed>8&&!eating){eating=3;food.visible=true;return 'meal';}leave();return 'leave';},pose({avatar,arms,legs,moving,allowed}){if(!joined)return false;if(moving||!allowed){leave();return false;}avatarRef=avatar;if(!eating){const p=gunaDancePose(time,.5,0);avatar.position.set(site.x+p.x,height(site.x+p.x,site.z+p.z)+p.hop,site.z+p.z);avatar.rotation.y=p.heading;}avatar.rotation.z=eating?0:Math.sin(time*4)*.045;arms.forEach((a,i)=>a.rotation.x=eating?-1.1:Math.sin(time*4+i*Math.PI)*.22-.35);legs.forEach((l,i)=>l.rotation.x=eating?0:Math.sin(time*4+i*Math.PI)*.19);return true;},update(dt,active,info){root.visible=open()&&!info.indoors&&Math.hypot(info.x-site.x,info.z-site.z)<150;if(joined&&(!near(info.x,info.z)||info.indoors))leave();if(!active||!root.visible)return;time+=dt;if(joined)elapsed+=dt;// Each couple shares a phrase, with a delayed response from the partner.
 // Small grounded steps replace the former synchronized whole-row sway.
 for(const [i,a]of actors.entries()){
  const pair=Math.floor(i/2),side=i%2?1:-1,p=gunaDancePose(time,pair,side),beat=p.beat,phrase=time*.7;
  a.g.position.set(site.x+p.x,height(site.x+p.x,site.z+p.z)+p.hop,site.z+p.z);
  a.g.rotation.y=p.heading;a.g.rotation.z=Math.sin(beat)*.025;
  a.g.userData.dancePartner=actors[i^1].g.uuid;
  a.legs.forEach((leg,k)=>{const lift=Math.max(0,Math.sin(beat+k*Math.PI));leg.rotation.x=-lift*.20;leg.rotation.z=0;a.knees[k].rotation.x=lift*.35;});
  a.arms.forEach((arm,k)=>{arm.rotation.x=i%2?-.72+Math.sin(beat+k)*.035:-.22+Math.sin(beat+k*Math.PI)*.13;arm.rotation.z=(k?1:-1)*(.10+.025*Math.sin(phrase));a.elbows[k].rotation.x=i%2?-.55:-.25-.08*Math.sin(beat+k);});
 }
 if(eating){eating=Math.max(0,eating-dt);if(!eating){state.world.panama.meals++;onEat?.();save?.();refresh?.();leave();}}},leave,dispose(){leave();scene.remove(root);}};
}


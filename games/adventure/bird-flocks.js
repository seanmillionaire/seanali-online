import {featherWingGeometry} from './animal-craft.js';
import {isletHeight} from './explore-state.js?v=225';
// Large mixed-size family groups, rendered in three shared GPU batches.
export const BIRD_FLOCKS=[[-30,35],[180,70],[420,50],[-310,-80],[-220,-205],[-70,-350],[490,-425],[640,-440],[-460,155],[-200,245],[655,230],[20,-160]].map(([x,z],i)=>({x,z,count:36+(i%3)*12,rx:70+(i%4)*20,rz:38+(i%3)*14,phase:i*1.7,speed:.018+(i%3)*.004}));
export function flockPose(f,time){const a=f.phase+time*f.speed,x=f.x+Math.cos(a)*f.rx,z=f.z+Math.sin(a)*f.rz;return {x,z,y:Math.max(24,...[[0,0],[-35,0],[35,0],[0,-35],[0,35]].map(([dx,dz])=>isletHeight(x+dx,z+dz)+26))+Math.sin(a*.7)*4,heading:Math.atan2(-Math.sin(a)*f.rx,Math.cos(a)*f.rz)};}
export function createBirdFlocks({T,scene,geometry,mat,ball,box}){
 const root=new T.Group();root.name='Panama bird families';scene.add(root);
 const count=BIRD_FLOCKS.reduce((n,f)=>n+f.count,0),plumage=mat('#ffffff',{vertexColors:false,roughness:.9}),body=new T.InstancedMesh(ball,plumage,count),wings=new T.InstancedMesh(featherWingGeometry(T,geometry),mat('#ffffff',{side:T.DoubleSide,roughness:.9}),count*2),beaks=new T.InstancedMesh(ball,mat('#ad966b'),count),heads=new T.InstancedMesh(ball,plumage,count),tails=new T.InstancedMesh(geometry(new T.ConeGeometry(1,1,5)),mat('#ffffff',{roughness:.9}),count);root.add(body,wings,beaks,heads,tails);for(const m of root.children){m.frustumCulled=false;m.castShadow=false;m.name='Batched bird families';}
 const tint=new T.Color();let bird=0;for(const [fi,f]of BIRD_FLOCKS.entries())for(let i=0;i<f.count;i++,bird++){const forest=fi===3||fi===4||fi===5||fi===11,color=forest?'#375c42':fi%3===0?'#d2d4c8':'#47534a',wing=forest?'#304d3a':fi%3===0?'#6d786f':'#303f38';body.setColorAt(bird,tint.set(color));heads.setColorAt(bird,tint.set(color));tails.setColorAt(bird,tint.set(wing));for(let j=0;j<2;j++)wings.setColorAt(bird*2+j,tint.set(wing));}
 const d=new T.Object3D();let clock=0;
 function put(m,i,x,y,z,sx,sy,sz,heading=0,roll=0){d.position.set(x,y,z);d.scale.set(sx,sy,sz);d.rotation.set(0,heading,roll);d.updateMatrix();m.setMatrixAt(i,d.matrix);}
 function update(dt,active,{x=0,z=0,indoors=false}={}){if(active)clock+=dt;root.visible=!indoors;if(indoors)return;let index=0;
  for(const [fi,f]of BIRD_FLOCKS.entries()){if(Math.hypot(x-f.x,z-f.z)>280+Math.max(f.rx,f.rz))continue;const p=flockPose(f,clock),visible=Math.hypot(x-p.x,z-p.z)<280;if(!visible)continue;const forest=fi===3||fi===4||fi===5||fi===11,birdColor=forest?'#375c42':fi%3===0?'#d2d4c8':'#47534a',wingColor=forest?'#304d3a':fi%3===0?'#6d786f':'#303f38';
   for(let i=0;i<f.count;i++,index++){
    for(const m of [body,heads])m.setColorAt(index,tint.set(birdColor));tails.setColorAt(index,tint.set(wingColor));for(let k=0;k<2;k++)wings.setColorAt(index*2+k,tint.set(wingColor));
    const family=Math.floor(i/6),member=i%6,side=member%2?1:-1,rank=Math.ceil(member/2),scale=(member>3?.65:1)*(visible?1:0),angle=family*2.4;
    const ox=Math.cos(angle)*(3+family*2)+side*rank*1.8,oz=Math.sin(angle)*(3+family*2)-rank*2,px=p.x+Math.cos(p.heading)*ox+Math.sin(p.heading)*oz,pz=p.z-Math.sin(p.heading)*ox+Math.cos(p.heading)*oz,py=p.y+Math.sin(clock*.8+family)*.7+(family%3)*1.8;
    const phase=clock*(member>3?5.8:4.2)+family*.8+member*.25,gliding=Math.sin(clock*.34+family+i*.11)>.28,flap=gliding?.08:Math.sin(phase)*.56;
    put(body,index,px,py,pz,.15*scale,.13*scale,.38*scale,p.heading);
    const forward=(distance)=>[px+Math.sin(p.heading)*distance*scale,pz+Math.cos(p.heading)*distance*scale];const hp=forward(.33),bp=forward(.47),tp=forward(-.42);
    put(heads,index,hp[0],py+.07*scale,hp[1],.115*scale,.105*scale,.15*scale,p.heading);
    put(beaks,index,bp[0],py+.05*scale,bp[1],.040*scale,.035*scale,.14*scale,p.heading);
    put(tails,index,tp[0],py-.015*scale,tp[1],.16*scale,.30*scale,.035*scale,p.heading,0); // tapered tail fan
    // Cone axis runs along Y; turn it into the flight direction, beneath yaw.
    d.rotation.set(Math.PI/2,p.heading,0,'YXZ');d.updateMatrix();tails.setMatrixAt(index,d.matrix);
    for(const s of [-1,1])put(wings,index*2+(s>0?1:0),px+Math.cos(p.heading)*s*.12*scale,py+.035*scale,pz-Math.sin(p.heading)*s*.12*scale,s*.72*scale,.85*scale,.67*scale,p.heading,s*flap);

   }
  }for(const m of root.children){m.count=m===wings?index*2:index;m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;}
 }
 update(0,false);return {root,count,update,get clock(){return clock;},dispose(){scene.remove(root);}};
}

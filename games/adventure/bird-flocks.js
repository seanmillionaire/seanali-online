import {isletHeight} from './explore-state.js?v=213';
// Large mixed-size family groups, rendered in three shared GPU batches.
export const BIRD_FLOCKS=[[-30,35],[180,70],[420,50],[-310,-80],[-220,-205],[-70,-350],[490,-425],[640,-440],[-460,155],[-200,245],[655,230],[20,-160]].map(([x,z],i)=>({x,z,count:36+(i%3)*12,rx:70+(i%4)*20,rz:38+(i%3)*14,phase:i*1.7,speed:.018+(i%3)*.004}));
export function flockPose(f,time){const a=f.phase+time*f.speed,x=f.x+Math.cos(a)*f.rx,z=f.z+Math.sin(a)*f.rz;return {x,z,y:Math.max(24,...[[0,0],[-35,0],[35,0],[0,-35],[0,35]].map(([dx,dz])=>isletHeight(x+dx,z+dz)+26))+Math.sin(a*.7)*4,heading:Math.atan2(-Math.sin(a)*f.rx,Math.cos(a)*f.rz)};}
export function createBirdFlocks({T,scene,geometry,mat,ball,box}){
 const root=new T.Group();root.name='Panama bird families';scene.add(root);
 const count=BIRD_FLOCKS.reduce((n,f)=>n+f.count,0),body=new T.InstancedMesh(ball,mat('#d9d8c8'),count),wings=new T.InstancedMesh(box,mat('#50564e'),count*2),beaks=new T.InstancedMesh(box,mat('#c49b63'),count);root.add(body,wings,beaks);for(const m of root.children){m.frustumCulled=false;m.castShadow=false;m.name='Batched bird families';}
 const d=new T.Object3D();let clock=0;
 function put(m,i,x,y,z,sx,sy,sz,heading=0,roll=0){d.position.set(x,y,z);d.scale.set(sx,sy,sz);d.rotation.set(0,heading,roll);d.updateMatrix();m.setMatrixAt(i,d.matrix);}
 function update(dt,active,{x=0,z=0,indoors=false}={}){if(active)clock+=dt;root.visible=!indoors;let index=0;
  for(const f of BIRD_FLOCKS){const p=flockPose(f,clock),visible=Math.hypot(x-p.x,z-p.z)<280;
   for(let i=0;i<f.count;i++,index++){
    const family=Math.floor(i/6),member=i%6,side=member%2?1:-1,rank=Math.ceil(member/2),scale=(member>3?.65:1)*(visible?1:0),angle=family*2.4;
    const ox=Math.cos(angle)*(3+family*2)+side*rank*1.8,oz=Math.sin(angle)*(3+family*2)-rank*2,px=p.x+Math.cos(p.heading)*ox+Math.sin(p.heading)*oz,pz=p.z-Math.sin(p.heading)*ox+Math.cos(p.heading)*oz,py=p.y+Math.sin(clock*.8+family)*.7+(family%3)*1.8;
    const flap=Math.sin(clock*(member>3?5.8:4.2)+family*.8+member*.25)*.48;
    put(body,index,px,py,pz,.18*scale,.14*scale,.46*scale,p.heading);
    put(beaks,index,px+Math.sin(p.heading)*.5,py,pz+Math.cos(p.heading)*.5,.07*scale,.065*scale,.24*scale,p.heading);
    for(const s of [-1,1])put(wings,index*2+(s>0?1:0),px+Math.cos(p.heading)*s*.51*scale,py+Math.sin(flap)*.34,pz-Math.sin(p.heading)*s*.51*scale,.95*scale,.04*scale,.29*scale,p.heading,s*flap);
   }
  }for(const m of root.children)m.instanceMatrix.needsUpdate=true;
 }
 update(0,false);return {root,count,update,get clock(){return clock;},dispose(){scene.remove(root);}};
}

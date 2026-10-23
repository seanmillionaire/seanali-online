// Independent, seeded decisions. Routes are validated before anyone starts walking.
export function createResidentRoutine(person,{seed=1,home,height,clear=()=>true,radius=5,speed=.85,points=null}){
 let rng=seed>>>0,goal=null,wait=0,phase=seed*.37,visits=0,velocity=0,age=0;
 const random=()=>{rng=(rng*1664525+1013904223)>>>0;return rng/4294967296;};
 wait=random()*7;const pace=speed*(.8+random()*.4);
 const pos=person.g.position,origin={...home};
 const routeClear=(q)=>{const d=Math.hypot(q.x-pos.x,q.z-pos.z),n=Math.max(1,Math.ceil(d/.35));for(let i=1;i<=n;i++)if(!clear(pos.x+(q.x-pos.x)*i/n,pos.z+(q.z-pos.z)*i/n))return false;return true;};
 function choose(){
  const returning=visits%3===2;
  for(let n=0;n<16;n++){
   const a=random()*Math.PI*2,d=radius*(.25+random()*.75),q=returning?origin:points?points[Math.floor(random()*points.length)]:{x:origin.x+Math.sin(a)*d,z:origin.z+Math.cos(a)*d};
   if(Math.hypot(q.x-pos.x,q.z-pos.z)>.4&&routeClear(q)){goal={...q};person.g.userData.activity=returning?'returning home':'walking';return;}
   if(returning)break;
  }
  wait=2+random()*5;
 }
 return {get goal(){return goal;},get home(){return origin;},get phase(){return phase;},update(dt,active=true,blocked=()=>false){
  if(!active)return;dt=Math.min(.1,Math.max(0,dt));age+=dt;let moving=false;
  if(wait>0){wait-=dt;velocity=0;}else{
   if(!goal)choose();
   if(goal){const dx=goal.x-pos.x,dz=goal.z-pos.z,d=Math.hypot(dx,dz);velocity+= (Math.min(pace,d*2)-velocity)*Math.min(1,dt*3);
    const step=Math.min(d,velocity*dt),x=pos.x+dx/(d||1)*step,z=pos.z+dz/(d||1)*step;
    if(d<.08){visits++;goal=null;wait=visits%3===0?12+random()*22:3+random()*10;person.g.userData.activity=visits%3===0?'resting at home':'looking around';}
    else if(clear(x,z)&&!blocked(x,z)){pos.set(x,height(x,z),z);const heading=Math.atan2(dx,dz);person.g.rotation.y+=Math.atan2(Math.sin(heading-person.g.rotation.y),Math.cos(heading-person.g.rotation.y))*Math.min(1,dt*4);phase+=step*5.8;moving=true;}
    else{goal=null;wait=.8+random()*2;velocity=0;}
   }
  }
  person.animate?.(phase,moving);
  person.legs.forEach((l,i)=>l.rotation.x=moving?Math.sin(phase+i*Math.PI)*.33:0);
  person.arms.forEach((a,i)=>a.rotation.x=moving?-Math.sin(phase+i*Math.PI)*.18:-.08+Math.sin(age*.57+seed+i)*.025);
  person.g.rotation.z=moving?Math.sin(phase)*.012:Math.sin(age*.43+seed)*.008;
 }};
}

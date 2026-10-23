export const normalizeTravelMode=mode=>['skates','scooter'].includes(mode)?mode:'walk';
export function groundTravelSpeed(mode,{running=false,boosted=false}={}){
 const speed=mode==='scooter'?17:mode==='skates'?20:running?9:6.5;
 return boosted?speed*(mode==='skates'?1.4:1.65):speed;
}
// Sweep the complete movement, so faster skating cannot jump through a narrow
// building, yard or terrain boundary between the frame's start and endpoint.
export function groundTravelStep(x,z,dx,dz,clear,softObstacle=null){
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.12)),sx=dx/steps,sz=dz/steps;
 let hit=false,softHit=false,slid=false,normalX=0,normalZ=0;
 for(let i=0;i<steps;i++){
  if(clear(x+sx,z+sz)){x+=sx;z+=sz;}
  else{const obstacle=softObstacle?.(x+sx,z+sz);if(obstacle){const rx=x-obstacle.x,rz=z-obstacle.z,r=Math.hypot(rx,rz)||1,nx=rx/r,nz=rz/r,dot=Math.min(0,sx*nx+sz*nz),tx=sx-dot*nx,tz=sz-dot*nz;if(Math.hypot(tx,tz)>.00001&&clear(x+tx,z+tz)){x+=tx;z+=tz;slid=true;continue;}softHit=true;}hit=true;const d=Math.hypot(sx,sz)||1;normalX=-sx/d;normalZ=-sz/d;break;}
 }
 return {x,z,hit,softHit,slid,normalX,normalZ};
}

export function impactPose(remaining,duration=.75){
 if(remaining<=0||remaining>=duration)return {lean:0,roll:0,crouch:0,shake:0};
 const progress=Math.max(0,Math.min(1,1-remaining/duration)),strength=Math.sin(progress*Math.PI);
 return {lean:-strength*.40,roll:Math.sin(progress*Math.PI*3)*strength*.12,crouch:strength*.12,shake:Math.sin(progress*Math.PI*7)*strength*.045};
}


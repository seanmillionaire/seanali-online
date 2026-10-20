export const normalizeTravelMode=mode=>mode==='skates'?'skates':'walk';
export function groundTravelSpeed(mode,{running=false,boosted=false}={}){
 const speed=mode==='skates'?20:running?9:6.5;
 return boosted?speed*(mode==='skates'?1.4:1.65):speed;
}
// Sweep the complete movement, so faster skating cannot jump through a narrow
// building, yard or terrain boundary between the frame's start and endpoint.
export function groundTravelStep(x,z,dx,dz,clear){
 const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.3)),sx=dx/steps,sz=dz/steps;
 for(let i=0;i<steps;i++){
  if(clear(x+sx,z+sz)){x+=sx;z+=sz;}
  else if(Math.abs(sx)>1e-9&&clear(x+sx,z))x+=sx;
  else if(Math.abs(sz)>1e-9&&clear(x,z+sz))z+=sz;
 }
 return {x,z};
}

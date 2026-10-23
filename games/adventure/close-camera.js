// First-person camera at the midpoint of Angelique's eyes. No chase arm.
export const EYE_HEIGHT=1.62,EYE_FORWARD=.22;
export function closeMovement(x,z,yaw){return {x:x*Math.cos(yaw)-z*Math.sin(yaw),z:-x*Math.sin(yaw)-z*Math.cos(yaw)};}
export function createCloseCamera({avatar}){
 let yaw=avatar.rotation.y,pitch=0;
 function place(position,look,x,y,z,scale=1){
  const sin=Math.sin(yaw),cos=Math.cos(yaw);
  position.set(x+sin*EYE_FORWARD*scale,y+EYE_HEIGHT*scale,z+cos*EYE_FORWARD*scale);
  look.set(position.x+sin*8*scale,position.y+Math.tan(pitch)*8*scale,position.z+cos*8*scale);
 }
 return {place,movement:(x,z)=>closeMovement(x,z,yaw),heading:()=>yaw,drive(turn,forward,dt){yaw-=Math.max(-1,Math.min(1,turn))*Math.max(0,dt)*1.65;return closeMovement(0,forward,yaw);},face(angle){yaw=angle;},look(dx,dy){yaw-=dx*.004;pitch=Math.max(-1.05,Math.min(1.05,pitch-dy*.003));},reset(angle){yaw=angle;pitch=0;},invalidate(){}};
}


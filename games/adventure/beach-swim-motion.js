// Gorgona swimmers reuse the existing articulated human rig; no extra meshes,
// textures, physics bodies or per-frame path allocations.
const TAU=Math.PI*2;
export function swimWaterClear(x,z,inWater,radius=2.6){
 if(!inWater(x,z))return false;
 for(let i=0;i<12;i++){const a=i*TAU/12;if(!inWater(x+Math.sin(a)*radius,z+Math.cos(a)*radius))return false;}
 return true;
}
export function swimLoopClear(x,z,rx,rz,inWater){
 for(let i=0;i<64;i++){const a=i*TAU/64;if(!swimWaterClear(x+Math.sin(a)*rx,z+Math.cos(a)*rz,inWater))return false;}
 return true;
}
export function turnSwimmer(current,target,dt){
 return current+Math.atan2(Math.sin(target-current),Math.cos(target-current))*(1-Math.exp(-Math.max(0,dt)*3));
}
export function poseBeachSwimmer(a,t,x,z,heading,blend=1,groundY=0){
 if(!a.swimRestArms)a.swimRestArms=a.arms.map(arm=>arm.quaternion.clone());
 const g=a.g,s=g.scale.y,phase=t*(a.child?2.6:2.1)+a.i*1.73;
 // Prone (+PI/2), not the old face-up/backwards -PI/2 pose. YXZ keeps
 // world heading independent of body pitch, including on the return to shore.
 const breath=Math.pow(Math.max(0,Math.sin(phase*.5)),8),pitch=(Math.PI/2-.13-.11*breath)*blend;
 const roll=(Math.sin(phase)*.12+breath*.17)*blend;
 g.rotation.set(pitch,heading,0,'YXZ');g.rotateY(roll);
 // Rotate around the chest rather than the feet. Keep chest on the same
 // water plane used by the ocean, with a small (centimetres) buoyancy cycle.
 const chest=.99*s,forward=chest*Math.sin(pitch),bob=Math.sin(t*1.6+a.i)*.018;
 g.position.set(x-Math.sin(heading)*forward,(1-blend)*groundY+blend*(-.045+bob)-chest*(Math.cos(pitch)-(1-blend)),z-Math.cos(heading)*forward);
 for(let i=0;i<2;i++){
  const p=phase+i*Math.PI,side=i===0?-1:1;
  // Alternating reach/catch/pull/recovery, with bent elbows rather than
  // swinging both rigid arms around the idle walking pose.
  a.arms[i].rotation.set(Math.PI+p%TAU,0,side*(.10+.12*Math.max(0,Math.sin(p))));
  a.arms[i].quaternion.slerp(a.swimRestArms[i],1-blend);
  a.elbows[i].rotation.x=(-.18-.9*Math.max(0,Math.sin(p)))*blend;
  a.legs[i].rotation.x=Math.sin(phase*3+i*Math.PI)*.16*blend;
  a.knees[i].rotation.x=Math.max(0,-Math.sin(phase*3+i*Math.PI))*.22*blend;
 }
 g.userData.activity=blend>.5?'swimming':'wading';
}

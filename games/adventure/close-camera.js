// Head-height follow camera: independent of motion effects and world saves.
export function closeMovement(x,z,yaw){return {x:x*Math.cos(yaw)-z*Math.sin(yaw),z:-x*Math.sin(yaw)-z*Math.cos(yaw)};}
export function createCloseCamera({T,scene,camera,avatar}){
 let yaw=avatar.rotation.y,pitch=0,solids=null;const origin=new T.Vector3(),offset=new T.Vector3(),ray=new T.Raycaster();
 function visible(o){for(let p=o;p;p=p.parent){if(!p.visible||p===avatar)return false;}return true;}
 function place(position,look,x,y,z,scale=1){
  const sin=Math.sin(yaw),cos=Math.cos(yaw);origin.set(x,y+1.75*scale,z);
  position.set(x-sin*1.95*scale+cos*Math.min(.65,.48+camera.aspect*.12)*scale,y+2.18*scale,z-cos*1.95*scale-sin*Math.min(.65,.48+camera.aspect*.12)*scale);
  if(!solids){solids=[];scene.traverse(o=>{if(o.isMesh&&o.material&&!Array.isArray(o.material)&&!o.material.transparent)solids.push(o);});scene.updateMatrixWorld(true);}
  offset.copy(position).sub(origin);const distance=offset.length();ray.set(origin,offset.normalize());ray.near=.06;ray.far=distance+.12;
  const hit=ray.intersectObjects(solids.filter(visible),false)[0];if(hit)position.copy(origin).addScaledVector(offset,Math.max(.1,hit.distance-.18));
  look.set(x+sin*8*scale,y+1.75*scale+Math.tan(pitch)*8*scale,z+cos*8*scale);
 }
 return {place,movement:(x,z)=>closeMovement(x,z,yaw),heading:()=>yaw,face(angle){yaw=angle;},look(dx,dy){yaw-=dx*.004;pitch=Math.max(-.75,Math.min(.85,pitch-dy*.003));},reset(angle){yaw=angle;pitch=0;},invalidate(){solids=null;}};
}

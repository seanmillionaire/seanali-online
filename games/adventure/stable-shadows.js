// One owner for the moving directional shadow volume. Snap in light space so
// static world shadows do not crawl across shadow-map pixels as the player walks.
export function createStableShadows({T,sun,renderer,scene}){
 const offset=new T.Vector3(-22,38,18),direction=offset.clone().normalize();
 const right=new T.Vector3().crossVectors(new T.Vector3(0,1,0),direction).normalize();
 const up=new T.Vector3().crossVectors(direction,right).normalize();
 const center=new T.Vector3(),snapped=new T.Vector3();
 scene.add(sun.target);
 renderer.shadowMap.autoUpdate=false;let lastShadow=-Infinity;
 const camera=sun.shadow.camera;camera.near=.5;camera.far=150;camera.updateProjectionMatrix();
 function update(x,y,z,time=performance.now()/1000){
  if(!renderer.shadowMap.enabled||![x,y,z].every(Number.isFinite))return;
  const interval=scene.userData.renderBudget?.shadowInterval||0;if(time-lastShadow<interval)return;lastShadow=time;renderer.shadowMap.needsUpdate=true;
  center.set(x,y,z);
  const texelX=(camera.right-camera.left)/sun.shadow.mapSize.x;
  const texelY=(camera.top-camera.bottom)/sun.shadow.mapSize.y;
  const horizontal=center.dot(right),vertical=center.dot(up);
  snapped.copy(center).addScaledVector(right,Math.round(horizontal/texelX)*texelX-horizontal).addScaledVector(up,Math.round(vertical/texelY)*texelY-vertical);
  sun.target.position.copy(snapped);sun.position.copy(snapped).add(offset);
  sun.target.updateMatrixWorld();sun.updateMatrixWorld();
 }
 return {update,dispose(){scene.remove(sun.target);}};
}

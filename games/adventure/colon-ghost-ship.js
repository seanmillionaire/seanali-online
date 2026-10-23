import {createFruitEmojis} from './fruit-emojis.js';
import {worldClock} from './world-clock.js';
export function ghostPose(distance){const a=distance/100;return {x:-15+Math.cos(a)*100,z:-505+Math.sin(a)*23,heading:Math.atan2(-Math.sin(a)*100,Math.cos(a)*23)};}
export const ghostVisible=time=>worldClock(time).night;
export function createColonGhostShip({T,scene,make,mat,geometry,box,ball,cylinder,state,waterMaterial}){
 const root=new T.Group();root.name='Secret Colón night pirate ship';root.visible=false;scene.add(root);
 const timber=mat('#372b25',{roughness:.95,emissive:'#3c4b47',emissiveIntensity:.15}),trim=mat('#9b8353',{metalness:.25,emissive:'#424a40',emissiveIntensity:.12}),black=mat('#171c20'),sailMat=mat('#666b69',{side:T.DoubleSide,roughness:1,emissive:'#586461',emissiveIntensity:.18}),window=mat('#8d9e68',{emissive:'#82945b',emissiveIntensity:1.1}),bone=mat('#cbc8b5',{emissive:'#48534b',emissiveIntensity:.3});
 const length=36,width=8,shape=new T.Shape();shape.moveTo(-3,-18);shape.lineTo(3,-18);shape.quadraticCurveTo(5,-4,3.8,8);shape.quadraticCurveTo(3.1,16,0,18);shape.quadraticCurveTo(-3.1,16,-3.8,8);shape.quadraticCurveTo(-5,-4,-3,-18);
 const hull=geometry(new T.ExtrudeGeometry(shape,{depth:3.3,bevelEnabled:true,bevelSize:.18,bevelThickness:.12,bevelSegments:2,curveSegments:12,steps:1}));hull.rotateX(Math.PI/2);make(hull,timber,0,3.2,0,1,1,1,root);
 const deck=geometry(new T.ShapeGeometry(shape));deck.rotateX(Math.PI/2);make(deck,trim,0,3.25,0,1,1,1,root);
 const p=(g,m,x,y,z,w,h,d,rz=0)=>{const n=make(g,m,x,y,z,w,h,d,root);n.rotation.z=rz;return n;};
 p(box,timber,0,4.6,-12.5,6.5,2.8,7);p(box,trim,0,6.05,-12.5,6.9,.18,7.4);
 for(const side of [-1,1]){p(box,trim,side*3.8,4.1,-1,.11,.12,28);for(let z=-15;z<=12;z+=1.5)p(cylinder,trim,side*3.8,3.7,z,.055,.85,.055);for(let z=-10;z<=10;z+=3){p(box,black,side*4.01,2,z,.04,.7,1);p(cylinder,black,side*4.2,2,z,.16,.8,.16).rotation.z=Math.PI/2;}for(let z=-14;z<=-11;z+=1.2)p(box,window,side*3.29,4.9,z,.05,.55,.65);}
 const emblems=createFruitEmojis(T);emblems.sprite('pirate',0,25,0,3.2,root);emblems.sprite('compass',0,6.6,-12,1.3,root);
 const lanternGlow=mat('#a7e3b0',{emissive:'#73df9d',emissiveIntensity:2.1});for(const side of [-1,1])for(const z of [-14,13]){for(const dy of [-.4,.4])p(box,black,side*3.1,4.8+dy,z,.5,.06,.5);for(const dx of [-.23,.23])for(const dz of [-.23,.23])p(box,black,side*3.1+dx,4.8,z+dz,.04,.8,.04);p(ball,lanternGlow,side*3.1,4.8,z,.19,.28,.19);}
 const sails=[];
 for(const [i,z]of [-9,0,10].entries()){
  const H=i===1?22:18;p(cylinder,timber,0,H/2+3,z,.13,H,.13);p(cylinder,trim,0,H+3,z,.18,.3,.18);
  for(const [j,y]of [H*.58+3,H*.83+3].entries()){
   const w=j?6:8.5;p(cylinder,timber,0,y,z,.085,w+.8,.085,Math.PI/2);
   const cloth=new T.Shape();cloth.moveTo(-w/2,0);cloth.lineTo(w/2,0);cloth.lineTo(w*.46,-3.5);cloth.lineTo(w*.2,-3.9);cloth.lineTo(w*.08,-3.4);cloth.lineTo(-w*.02,-4.2);cloth.lineTo(-w*.12,-3.5);cloth.lineTo(-w*.38,-4);cloth.lineTo(-w/2,-3.6);cloth.closePath();
   const sail=p(geometry(new T.ShapeGeometry(cloth,8)),sailMat,0,y,z+.12,1,1,1);sails.push({sail,y,z,phase:i+j});
  }
  for(const side of [-1,1])for(const end of [-14,14]){const a=new T.Vector3(side*3.5,3.5,end),b=new T.Vector3(0,H+1,z),curve=new T.LineCurve3(a,b);p(geometry(new T.TubeGeometry(curve,1,.027,4,false)),trim,0,0,0,1,1,1);}
 }

 // Batch all rigid pieces; only six cloth sails remain independent for wind motion.
 const moving=new Set(sails.map(s=>s.sail)),batches=new Map();for(const mesh of [...root.children]){if(!mesh.isMesh||moving.has(mesh))continue;mesh.updateMatrix();const key=mesh.geometry.uuid+mesh.material.uuid;if(!batches.has(key))batches.set(key,{geo:mesh.geometry,m:mesh.material,items:[]});batches.get(key).items.push(mesh.matrix.clone());root.remove(mesh);}
 for(const {geo,m,items}of batches.values()){const mesh=new T.InstancedMesh(geo,m,items.length);items.forEach((v,i)=>mesh.setMatrixAt(i,v));mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();root.add(mesh);}
 let distance=0,time=0;function update(dt,active,{indoors=false}={}){root.visible=!indoors&&ghostVisible(state.world.dayTime);if(active){time+=dt;distance+=dt*2.5;}const q=ghostPose(distance);root.position.set(q.x,.08+(waterMaterial?.userData.surfaceHeight?.(q.x,q.z)||0),q.z);root.rotation.set(Math.sin(time*.4)*.012,q.heading,Math.sin(time*.31)*.016);scene.userData.ghostAir=root.visible?[{x:q.x,z:q.z,w:Math.abs(Math.cos(q.heading))*8+Math.abs(Math.sin(q.heading))*36,d:Math.abs(Math.sin(q.heading))*8+Math.abs(Math.cos(q.heading))*36,bottom:0,top:26}]:[];for(const s of sails){s.sail.rotation.y=Math.sin(time*.8+s.phase)*.06;s.sail.position.z=s.z+.15+Math.sin(time*.9+s.phase)*.18;}}
 function blocks(x,z,margin=1.3){if(!root.visible)return false;const h=root.rotation.y,dx=x-root.position.x,dz=z-root.position.z;return Math.abs(dx*Math.cos(h)-dz*Math.sin(h))<width/2+margin&&Math.abs(dx*Math.sin(h)+dz*Math.cos(h))<length/2+margin;}
 update(0,false);return {root,update,blocks,dispose(){emblems.dispose();delete scene.userData.ghostAir;scene.remove(root);root.traverse(o=>{if(o.isInstancedMesh)o.dispose();});}};
}


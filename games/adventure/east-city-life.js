import {createResidentRoutine} from './resident-routine.js';
import {homeReserved} from './mansion-state.js';
import {makeDog} from './mansion-models.js?v=225';
import {EXPANDED_DISTRICTS,districtGround,districtVehicleBlocked} from './expanded-districts.js?v=225';
import {cityBlocksVehicle} from './city-layout.js?v=225';
import {inWater,roadDistance,isletHeight} from './explore-state.js?v=225';
export function dogWalkRoutes(){
 const furniture=[];for(const area of EXPANDED_DISTRICTS.filter(a=>a.kind==='modern'))for(let i=0;i<area.xs.length-1;i++)for(let j=0;j<area.zs.length-1;j++){
  if(!((i*7+j*5)%7===0||(i+2*j)%11===5||i===0))continue;
  const x=(area.xs[i]+area.xs[i+1])/2,z=(area.zs[j]+area.zs[j+1])/2,sx=area.xs[i+1]-area.xs[i]-6,sz=area.zs[j+1]-area.zs[j]-6;
  if(!districtGround(x,z)||roadDistance(x,z)<10.25||sx<6||sz<6)continue;
  furniture.push({x,z,w:sx*.65+1,d:1.7});for(const side of [-1,1])furniture.push({x:x+side*sx*.31,z:z+side*sz*.27,w:2.8,d:2.45});
 }

 const result=[],clear=(x,z)=>!homeReserved(x,z,2)&&!inWater(x,z)&&roadDistance(x,z)>6.4&&!districtVehicleBlocked(x,z)&&!cityBlocksVehicle(x,z)&&!furniture.some(p=>Math.abs(x-p.x)<p.w/2&&Math.abs(z-p.z)<p.d/2);
 for(let x=404;x<500;x+=3)for(let z=-88;z<-18;z+=3){
  if(result.length>=8)return result;
  if(result.some(p=>Math.hypot(p.x-x,p.z-z)<15))continue;
  if(Array.from({length:25},(_,i)=>{const dz=-4+i/3;return [-1.3,0,1.3].every(dx=>clear(x+dx,z+dz)&&Math.abs(isletHeight(x+dx,z+dz)-isletHeight(x,z))<.4);}).every(Boolean))result.push({x,z});
 }
 return result;
}
export function createEastCityLife(options){
 const {T,scene,models,geometry,height}=options,root=new T.Group();root.name='East city · neighbors walking their dogs';scene.add(root);
 const routes=dogWalkRoutes(),walkers=routes.map((r,i)=>{
  const person=models.person(root,r.x,height(r.x,r.z),r.z,i+2),dog=makeDog(options,root);dog.g.name='Neighborhood dog '+(i+1);dog.g.scale.setScalar(.62+(i%3)*.07);
  const points=new Float32Array(9),geo=geometry(new T.BufferGeometry());geo.setAttribute('position',new T.BufferAttribute(points,3));const material=new T.LineBasicMaterial({color:['#284f71','#ae4935','#617c4b'][i%3]}),leash=new T.Line(geo,material);leash.frustumCulled=false;root.add(leash);const routine=createResidentRoutine(person,{seed:700+i*193,home:r,height,points:[{x:r.x,z:r.z-4},{x:r.x,z:r.z},{x:r.x,z:r.z+4}],clear:(x,z)=>Math.abs(x-r.x)<.1&&Math.abs(z-r.z)<=4.01&&!homeReserved(x,z,2),speed:.8});return {r,person,dog,leash,points,geo,material,routine};
 });
 const canvas=document.createElement('canvas');canvas.width=600;canvas.height=400;const ctx=canvas.getContext('2d');
 ctx.fillStyle='#fff';ctx.fillRect(0,0,600,400);ctx.fillStyle='#d51f35';ctx.fillRect(300,0,300,200);ctx.fillStyle='#0755a0';ctx.fillRect(0,200,300,200);
 function star(x,y,color){ctx.fillStyle=color;ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?22:55;ctx.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);}ctx.closePath();ctx.fill();}star(150,100,'#0755a0');star(450,300,'#d51f35');
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;
 const flagMaterial=new T.MeshStandardMaterial({map:texture,side:T.DoubleSide,roughness:.85}),metal=new T.MeshStandardMaterial({color:'#c4cbd0',metalness:.75,roughness:.3}),stone=new T.MeshStandardMaterial({color:'#ddd6c7',roughness:.9});
 const pole=new T.Group();pole.name='Panama flag · grounded Independence Plaza pole';pole.position.set(360,height(360,-73),-73);root.add(pole);
 function part(g,m,y){const mesh=new T.Mesh(geometry(g),m);mesh.position.y=y;mesh.castShadow=true;mesh.receiveShadow=true;pole.add(mesh);return mesh;}
 part(new T.CylinderGeometry(1,1.15,.5,24),stone,.25);part(new T.CylinderGeometry(.18,.32,54,20),metal,27.5);part(new T.SphereGeometry(.38,16,12),metal,54.6);
 const cloth=geometry(new T.PlaneGeometry(18,12,30,16));cloth.translate(9,46.8,0);const flag=new T.Mesh(cloth,flagMaterial);flag.name='🇵🇦 Panama City pole-mounted flag';flag.castShadow=true;pole.add(flag);const vertices=cloth.attributes.position;let clock=0;
 function update(dt,active,{x=0,z=0,indoors=false}={}){if(active&&!indoors)clock+=Math.min(dt,.1);root.visible=!indoors;
  walkers.forEach(({r,person,dog,leash,points,geo,routine},i)=>{const before=person.g.position.z;routine.update(dt,active&&!indoors,(px,pz)=>Math.hypot(px-x,pz-z)<1);const pz=person.g.position.z,moving=Math.abs(pz-before)>.0001,visible=Math.hypot(r.x-x,pz-z)<125;person.g.visible=dog.g.visible=leash.visible=visible;
   dog.g.position.set(r.x+1,height(r.x+1,pz),pz+.5);dog.g.rotation.y=person.g.rotation.y;dog.legs.forEach((l,j)=>l.rotation.x=moving?Math.sin(routine.phase*1.4+[0,Math.PI,Math.PI,0][j])*.3:0);dog.tail.rotation.z=Math.sin(clock*4+i)*.25;
   const y=person.g.position.y;points.set([r.x+.2,y+.95,pz,r.x+.65,y+.65,pz+.25,r.x+1,dog.g.position.y+.6,pz+.5]);geo.attributes.position.needsUpdate=true;
  });for(let i=0;i<vertices.count;i++){const x=vertices.getX(i),y=vertices.getY(i);vertices.setZ(i,(x/18)*(.8*Math.sin(x*.55-clock*2.1)+.25*Math.sin(y*.8+x*.7-clock*2.7)));}vertices.needsUpdate=true;cloth.computeVertexNormals();
 }
 update(0,false);return {root,walkers,update,dispose(){scene.remove(root);texture.dispose();flagMaterial.dispose();metal.dispose();stone.dispose();walkers.forEach(w=>w.material.dispose());}};
}

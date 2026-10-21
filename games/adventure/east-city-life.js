import {makeDog} from './mansion-models.js?v=211';
import {EXPANDED_DISTRICTS,districtGround,districtVehicleBlocked} from './expanded-districts.js?v=211';
import {cityBlocksVehicle} from './city-layout.js?v=211';
import {inWater,roadDistance,isletHeight} from './explore-state.js?v=211';
export function dogWalkRoutes(){
 const furniture=[];for(const area of EXPANDED_DISTRICTS.filter(a=>a.kind==='modern'))for(let i=0;i<area.xs.length-1;i++)for(let j=0;j<area.zs.length-1;j++){
  if(!((i*7+j*5)%7===0||(i+2*j)%11===5||i===0))continue;
  const x=(area.xs[i]+area.xs[i+1])/2,z=(area.zs[j]+area.zs[j+1])/2,sx=area.xs[i+1]-area.xs[i]-6,sz=area.zs[j+1]-area.zs[j]-6;
  if(!districtGround(x,z)||roadDistance(x,z)<10.25||sx<6||sz<6)continue;
  furniture.push({x,z,w:sx*.65+1,d:1.7});for(const side of [-1,1])furniture.push({x:x+side*sx*.31,z:z+side*sz*.27,w:2.8,d:2.45});
 }

 const result=[],clear=(x,z)=>!inWater(x,z)&&roadDistance(x,z)>6.4&&!districtVehicleBlocked(x,z)&&!cityBlocksVehicle(x,z)&&!furniture.some(p=>Math.abs(x-p.x)<p.w/2&&Math.abs(z-p.z)<p.d/2);
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
  const points=new Float32Array(9),geo=geometry(new T.BufferGeometry());geo.setAttribute('position',new T.BufferAttribute(points,3));const material=new T.LineBasicMaterial({color:['#284f71','#ae4935','#617c4b'][i%3]}),leash=new T.Line(geo,material);leash.frustumCulled=false;root.add(leash);return {r,person,dog,leash,points,geo,material};
 });
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=320;const ctx=canvas.getContext('2d');ctx.font='240px "Apple Color Emoji","Segoe UI Emoji",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('🇵🇦',256,160);
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const flagMaterial=new T.SpriteMaterial({map:texture,transparent:true,depthTest:true,fog:false,toneMapped:false}),flag=new T.Sprite(flagMaterial);flag.name='🇵🇦 Panama City sky landmark';flag.position.set(360,160,-50);flag.scale.set(64,40,1);root.add(flag);let clock=0;
 function update(dt,active,{x=0,z=0,indoors=false}={}){if(active&&!indoors)clock+=Math.min(dt,.1);root.visible=!indoors;
  walkers.forEach(({r,person,dog,leash,points,geo},i)=>{const phase=clock*.16+i*1.3,pz=r.z+Math.cos(phase)*4,moving=Math.abs(Math.sin(phase))>.12,heading=Math.sin(phase)>0?Math.PI:0,visible=Math.hypot(r.x-x,pz-z)<125;person.g.visible=dog.g.visible=leash.visible=visible;
   person.g.position.set(r.x,height(r.x,pz),pz);person.g.rotation.y+=Math.atan2(Math.sin(heading-person.g.rotation.y),Math.cos(heading-person.g.rotation.y))*Math.min(1,dt*3);person.animate?.(clock*4+i,moving);
   dog.g.position.set(r.x+1,height(r.x+1,pz),pz+.5);dog.g.rotation.y=person.g.rotation.y;dog.legs.forEach((l,j)=>l.rotation.x=moving?Math.sin(clock*6+j*Math.PI)*.3:0);dog.tail.rotation.z=Math.sin(clock*4+i)*.25;
   const y=person.g.position.y;points.set([r.x+.2,y+.95,pz,r.x+.65,y+.65,pz+.25,r.x+1,dog.g.position.y+.6,pz+.5]);geo.attributes.position.needsUpdate=true;
  });flag.scale.x=64+Math.sin(clock*.7)*.65;flag.position.y=160+Math.sin(clock*.25)*.5;
 }
 update(0,false);return {root,walkers,update,dispose(){scene.remove(root);texture.dispose();flagMaterial.dispose();walkers.forEach(w=>w.material.dispose());}};
}

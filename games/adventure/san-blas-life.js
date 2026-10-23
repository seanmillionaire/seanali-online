import {createFruitEmojis} from './fruit-emojis.js';
import {createGunaCommunity,createGunaResident} from './guna-community.js';
import {cityX} from './geography.js';
import {SAN_BLAS_ISLANDS,routePose} from './panama-state.js';
export const SAN_BLAS_SERVICES={vendor:{x:cityX(285),z:-422},cook:{x:cityX(293),z:-422},fish:{x:cityX(290),z:-418}};
export function createSanBlasLife({T,scene,make,mat,geometry,box,ball,cylinder,cone,height,inWater,forest,models,state,surfaces,...extra}){
 const options={T,scene,make,mat,geometry,box,ball,cylinder,cone,height,inWater,forest,models,state,surfaces,...extra};const community=createGunaCommunity(options);
 const root=new T.Group();root.name='San Blas · separated white-sand cays and living beaches';scene.add(root);const main={x:cityX(290),z:(-425),rx:10,rz:8,community:true},islands=[main,...SAN_BLAS_ISLANDS],wood=mat('#916c46',{map:surfaces?.wood,bumpMap:surfaces?.wood,bumpScale:.05}),thatch=mat('#a89565',{map:surfaces?.grass,bumpMap:surfaces?.grass,bumpScale:.12}),white=mat('#f4eacb'),dark=mat('#513c2f');
 let detailParent=root;const islandDetails=[];
 const piece=(g,m,x,y,z,w,h,d,parent=detailParent)=>make(g,m,x,y,z,w,h,d,parent);
 const cane=mat('#baa37b',{map:surfaces?.wood,roughness:1});
 const roof=geometry(new T.BufferGeometry());roof.setAttribute('position',new T.Float32BufferAttribute([-1.2,0,-1.1,1.2,0,-1.1,0,.8,-.8,-1.2,0,1.1,1.2,0,1.1,0,.8,.8],3));roof.setIndex([0,2,1,3,4,5,0,3,5,0,5,2,2,5,4,2,4,1]);roof.computeVertexNormals();
 for(const [i,p]of islands.entries()){
  const detail=new T.Group();detail.name='San Blas cay detail '+i;root.add(detail);islandDetails.push({p,detail});detailParent=detail;
  for(let k=0;k<(p.community?4:2+i%5);k++){const a=k*2.4+i,x=p.x+Math.sin(a)*p.rx*.46,z=p.z+Math.cos(a)*p.rz*.43;if(Math.hypot(x-530,z+430)<7)continue;forest.addTree('palm',x,z,.57+(i%3)*.08,i*3+k,detail);}
  if(p.community){for(let k=0;k<2;k++){const x=p.x+(k?1.3:-1.3),z=p.z-.8,y=height(x,z);piece(box,wood,x,y+1.0,z,1.8,2,1.7);piece(roof,thatch,x,y+2.05,z,1,1,1);piece(box,dark,x,y+.7,z+.86,.5,1.4,.03);for(let j=0;j<11;j++){const wx=x-.84+j*.168;if(Math.abs(wx-x)<.32)continue;piece(box,cane,wx,y+1,z+.87,.055,1.9,.04);}}const resident=createGunaResident(options,i);resident.g.position.set(p.x,height(p.x,p.z+1.4),p.z+1.4);detail.add(resident.g);}
  // Light submerged sand and coral patches remain underwater between cays.
  for(let k=0;k<3;k++){const a=k*2.1+i,x=p.x+Math.cos(a)*(p.rx+1.8),z=p.z+Math.sin(a)*(p.rz+1.8);if(!inWater(x,z))continue;piece(cylinder,white,x,-.7,z,1.3,.08,1.0);const coral=piece(ball,mat(['#de9a83','#a899c9','#d6bb77'][(i+k)%3]),x,-.43,z,.35,.35,.3);coral.name='Shallow-water coral';}
 }
 detailParent=root;
 const crabBodyMat=mat('#aa5538'),clawMat=mat('#c47248'),eyeMat=mat('#201f22'),holeMat=mat('#5a4531');
 const crabs=islands.flatMap((p,i)=>Array.from({length:i===0?6:2},(_,k)=>({p,a:i*1.3+k*2.8,phase:k*1.7+i,hide:1,flee:0})));
 const emblems=createFruitEmojis(T),crabIcons=crabs.map(c=>(c.icon={x:0,y:0,z:0,size:.55}));const crabBatch=emblems.batch('crab',crabIcons,root);crabBatch.frustumCulled=false;const holes=new T.InstancedMesh(cylinder,holeMat,crabs.length);root.add(holes);holes.frustumCulled=false;
 const dummy=new T.Object3D();function instance(mesh,index,x,y,z,sx,sy,sz,angle=0){dummy.position.set(x,y,z);dummy.scale.set(sx,sy,sz);dummy.rotation.set(0,angle,0);dummy.updateMatrix();mesh.setMatrixAt(index,dummy.matrix);}
 const fish=[];const fishMats=['#efd152','#4bb9bd','#e88957'].map(c=>mat(c));for(let i=0;i<36;i++){const p=islands[i%islands.length],g=new T.Group();g.name='Tropical fish in San Blas shallows';root.add(g);piece(ball,fishMats[i%3],0,0,0,.24,.13,.08,g);const tail=piece(cone,fishMats[i%3],-.29,0,0,.13,.25,.09,g);tail.rotation.z=Math.PI/2;fish.push({g,p,i,tail,a:i*2.4});}
 const boats=[]; // Regional fishing traffic is owned by maritime-life.js.

 const treasures=SAN_BLAS_ISLANDS.filter((p,i)=>i%5===0).map((p,i)=>{const x=p.x+p.rx*.4,z=p.z,y=height(x,z),mesh=new T.Group();root.add(mesh);piece(box,wood,x,y+.22,z,.6,.42,.4,mesh);piece(box,models.colors.yellow,x,y+.43,z,.62,.07,.42,mesh);return {x,z,id:i,mesh};});
 let clock=0;function update(dt,active,{x,z,indoors=false}={}){community.update(dt,active,{x,z,indoors});root.visible=!indoors&&islands.some(p=>Math.hypot(x-p.x,z-p.z)<220);for(const {p,detail}of islandDetails)detail.visible=Math.hypot(x-p.x,z-p.z)<200;if(!active||!root.visible)return;clock+=dt;
  crabs.forEach((c,i)=>{const px=c.p.x+Math.cos(c.a)*c.p.rx*.83,pz=c.p.z+Math.sin(c.a)*c.p.rz*.83,near=Math.hypot(x-px,z-pz)<3.5;if(near)c.flee=3;else c.flee=Math.max(0,c.flee-dt);const delta=Math.atan2(Math.sin(c.phase-c.a),Math.cos(c.phase-c.a));c.a+=c.flee?delta*Math.min(1,dt*8):dt*.065*(i%2?1:-1);c.hide+=((c.flee&&Math.abs(delta)<.15?.04:1)-c.hide)*Math.min(1,dt*4);const scale=.12+.88*c.hide,y=height(px,pz)+.1;Object.assign(c.icon,{x:px,y:y+.16*scale,z:pz,size:.62*scale});c.icon.visible=c.hide>.1;instance(holes,i,c.p.x+Math.cos(c.phase)*c.p.rx*.88,height(c.p.x+Math.cos(c.phase)*c.p.rx*.88,c.p.z+Math.sin(c.phase)*c.p.rz*.88)+.012,c.p.z+Math.sin(c.phase)*c.p.rz*.88,.19,.014,.16);
  });for(const mesh of [holes])mesh.instanceMatrix.needsUpdate=true;
  for(const f of fish){f.a+=dt*(.35+(f.i%3)*.09);const px=f.p.x+Math.cos(f.a)*(f.p.rx+1.5),pz=f.p.z+Math.sin(f.a)*(f.p.rz+1.5);f.g.visible=inWater(px,pz);f.g.position.set(px,-.22-Math.sin(clock+f.i)*.06,pz);f.g.rotation.y=-f.a-Math.PI/2;f.tail.rotation.y=Math.sin(clock*9+f.i)*.35;}

  for(const t of treasures)t.mesh.visible=!state.world.panama.treasures.includes(t.id);
 }
 function near(x,z){const treasure=treasures.find(t=>!state.world.panama.treasures.includes(t.id)&&Math.hypot(x-t.x,z-t.z)<1.9);if(treasure)return {type:'treasure',...treasure};if(Math.hypot(x-cityX(285),z-SAN_BLAS_SERVICES.vendor.z)<2.5)return {type:'islandVendor'};if(Math.hypot(x-cityX(293),z-SAN_BLAS_SERVICES.cook.z)<2.5)return {type:'cook'};if(Math.hypot(x-cityX(290),z-SAN_BLAS_SERVICES.fish.z)<2.7)return {type:'fish'};return null;}
 const fireX=SAN_BLAS_SERVICES.cook.x,fireZ=SAN_BLAS_SERVICES.cook.z,y=height(fireX,fireZ);piece(cylinder,dark,fireX,y+.15,fireZ,.6,.3,.6);piece(box,wood,fireX,y+.43,fireZ,.6,.13,.5);models.meal(root,'fishPlate',fireX,y+.59,fireZ,.6);
 models.meal(root,'coconutRice',cityX(285),height(SAN_BLAS_SERVICES.vendor.x,SAN_BLAS_SERVICES.vendor.z)+.7,SAN_BLAS_SERVICES.vendor.z,.7);piece(box,wood,cityX(285),height(SAN_BLAS_SERVICES.vendor.x,SAN_BLAS_SERVICES.vendor.z)+.4,SAN_BLAS_SERVICES.vendor.z,1.5,.7,1.2);
 const stand=SAN_BLAS_SERVICES.vendor,standY=height(stand.x,stand.z);const host=createGunaResident(options,4);host.g.position.set(stand.x,standY,stand.z-1);root.add(host.g);for(const dx of [-1.2,1.2])piece(cylinder,wood,stand.x+dx,standY+1.2,stand.z-1,.06,2.4,.06);piece(roof,thatch,stand.x,standY+2.5,stand.z-1,1.35,1.1,1.1);
 update(0,true,{x:cityX(290),z:(-425)});return {root,community,crabs,fish,boats,islands,near,update,dispose(){emblems.dispose();community.dispose();scene.remove(root);}};
}


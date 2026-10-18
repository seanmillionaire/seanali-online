// Shared three-dimensional foliage; no spherical crowns or stacked cone trees.
export function createNaturalTrees({T,geometry,mat,make,height,scene,surfaces=null}){
 const trees=[],bark=mat('#73634d',{...(surfaces?.wood?{map:surfaces.wood,bumpMap:surfaces.wood}:{}),bumpScale:.13,roughness:1});
 function meshData(){return {p:[],c:[]};}
 function tri(d,a,b,c,tone){for(const p of [a,b,c]){d.p.push(...p);d.c.push(.58*tone,tone,.47*tone);}}
 function finish(d){const g=geometry(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(d.p,3));g.setAttribute('color',new T.Float32BufferAttribute(d.c,3));g.computeVertexNormals();return g;}
 function leaf(d,origin,angle,length,width,drop,tone){
  const point=(t,side)=>{const r=t*length;return [origin[0]+Math.sin(angle)*r+Math.cos(angle)*side,origin[1]+Math.sin(t*Math.PI)*.12-drop*t*t-Math.abs(side)*.18,origin[2]+Math.cos(angle)*r-Math.sin(angle)*side];};
  for(let j=0;j<3;j++){const t=j/3,u=(j+1)/3,w=width*Math.sin((t+.06)*Math.PI),v=width*Math.sin(u*Math.PI);
   for(const side of [-1,1]){tri(d,point(t,0),point(t,side*w),point(u,side*v),tone);tri(d,point(t,0),point(u,side*v),point(u,0),tone*.94);}
  }
 }
 const palmLeaves=meshData();
 for(let frond=0;frond<11;frond++){
  const angle=frond*Math.PI*2/11,L=3.6+(frond%3)*.33;
  for(let j=1;j<19;j++){
   const t=j/19,r=L*t,origin=[Math.sin(angle)*r,.6*Math.sin(t*Math.PI)-1.55*t*t,Math.cos(angle)*r];
   const len=(.22+.8*Math.sin(t*Math.PI))*(1-.2*t);
   for(const side of [-1,1])leaf(palmLeaves,origin,angle+side*(1.0+.16*t),len,.075,.24,.48+(frond%3)*.09+(j%2)*.06);
   // The continuous central rib keeps the long frond silhouette readable.
   leaf(palmLeaves,[Math.sin(angle)*r,origin[1]+.015,Math.cos(angle)*r],angle,.26,.023,.02,.55);
  }
 }
 const broadLeaves=meshData(),pineLeaves=meshData(),bananaLeaves=meshData();
 for(let i=0;i<7;i++)leaf(bananaLeaves,[0,(i%3)*.1,0],i*Math.PI*2/7,2.2+(i%3)*.25,.4,.65,.62+(i%2)*.06);
 for(let i=0;i<430;i++){
  const a=i*2.39996,r=.5+(i%17)/17*2.4,h=1.15*Math.sin(i*1.7);
  leaf(broadLeaves,[Math.sin(a)*r,h,Math.cos(a)*r],a+.7,.7+(i%4)*.12,.18,.08,.46+(i%5)*.055);
 }
 for(let level=0;level<10;level++){
  const y=2.5+level*.65,r=(1-level/11)*2.7;
  for(let limb=0;limb<7;limb++){const a=limb*Math.PI*2/7+level*.4;
   for(let j=1;j<=7;j++){const t=j/7,origin=[Math.sin(a)*r*t,y-.42*t,Math.cos(a)*r*t];
    for(const side of [-1,1])leaf(pineLeaves,origin,a+side*1.1,.55*(1-t*.55),.065,.09,.32+(level%3)*.04);
   }
  }
 }
 const leaves={palm:finish(palmLeaves),pine:finish(pineLeaves),natural:finish(broadLeaves),banana:finish(bananaLeaves)};
 const palmCurve=new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3(.1,2.2,0),new T.Vector3(.45,4.8,.1),new T.Vector3(.9,7,.3)]);
 const palmTrunk=geometry(new T.TubeGeometry(palmCurve,14,.19,8,false));
 const pineTrunk=geometry(new T.CylinderGeometry(.085,.32,9.2,9));pineTrunk.translate(0,4.6,0);
 const naturalTrunk=geometry(new T.CylinderGeometry(.12,.37,5.9,9));naturalTrunk.translate(0,2.95,0);
 const bananaTrunk=geometry(new T.CylinderGeometry(.08,.17,3.1,7));bananaTrunk.translate(0,1.55,0);
 const branch=geometry(new T.CylinderGeometry(.07,.15,3.5,6));branch.translate(0,1.75,0);
 const collarGeo=geometry(new T.TorusGeometry(.196,.018,3,9));
 let focus=null;
 function addTree(kind,x,z,scale=1,seed=0,parent=scene){
  if(!leaves[kind])kind='natural';
  const root=new T.Group();root.name=kind==='palm'?'Detailed curved coconut palm':kind==='pine'?'Detailed tall needle pine':kind==='banana'?'Broad-leaf banana plant':'Branching natural rainforest tree';parent.add(root);
  root.position.set(x,height(x,z)-.05,z);root.scale.setScalar(scale);root.rotation.y=seed*2.39996;
  make(kind==='palm'?palmTrunk:kind==='pine'?pineTrunk:kind==='banana'?bananaTrunk:naturalTrunk,bark,0,0,0,1,1,1,root);
  if(kind==='palm'){
   // A single instanced draw supplies the characteristic rings in a palm trunk.
   const collars=new T.InstancedMesh(collarGeo,bark,15),m=new T.Matrix4(),q=new T.Quaternion().setFromEuler(new T.Euler(Math.PI/2,0,0));
   for(let i=0;i<15;i++){const p=palmCurve.getPoint((i+.5)/15);m.compose(p,q,new T.Vector3(1,1,1));collars.setMatrixAt(i,m);}root.add(collars);
  }else if(kind==='natural'){
   for(let i=0;i<5;i++){const b=make(branch,bark,0,3.2,0,1,1,1,root);b.rotation.z=.5+(i%2)*.25;b.rotation.y=i*Math.PI*2/5;}
  }
  const material=mat('#709264',{vertexColors:true,side:T.DoubleSide,roughness:.96,transparent:true,opacity:1,depthWrite:true});
  const crown=make(leaves[kind],material,kind==='palm'?.9:0,kind==='palm'?7:kind==='natural'?6:kind==='banana'?3.1:0,kind==='palm'?.3:0,1,1,1,root);crown.castShadow=false;
  const tree={root,crown,kind,x,z,scale,tip:kind==='palm'?{x:.9,y:7,z:.3}:{x:0,y:kind==='pine'?8:6,z:0},phase:seed*.9};
  trees.push(tree);return tree;
 }
 function update(time){
  for(const t of trees){
   t.crown.rotation.z=Math.sin(time*.9+t.phase)*(t.kind==='palm'?.035:.012);
   const distance=focus?Math.hypot(t.x-focus.x,t.z-focus.z):100;
   let opacity=distance<4?.2:distance<7?.2+(distance-4)*.266:1;
   if(focus?.camera){
    const dx=focus.camera.x-focus.x,dz=focus.camera.z-focus.z,length=dx*dx+dz*dz;
    const u=length?((t.x-focus.x)*dx+(t.z-focus.z)*dz)/length:0;
    const lateral=Math.hypot(t.x-focus.x-u*dx,t.z-focus.z-u*dz);
    const rayY=height(focus.x,focus.z)+1.6+(focus.camera.y-height(focus.x,focus.z)-1.6)*u;
    if(u>0&&u<1&&lateral<3.8*t.scale&&rayY<height(t.x,t.z)+t.tip.y*t.scale+2&&rayY>height(t.x,t.z)+2)opacity=.12;
   }
   t.crown.material.opacity+=(opacity-t.crown.material.opacity)*.22;t.crown.material.depthWrite=t.crown.material.opacity>.95;
  }
 }
 return {addTree,update,trees,focus:(x,z,camera=null)=>{focus=Number.isFinite(x)&&Number.isFinite(z)?{x,z,camera}:null;}};
}

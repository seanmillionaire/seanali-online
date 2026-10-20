// High-canopy vegetation batched into just six shared GPU draws, even for
// thousands of individual pines, palms and broadleaf tropical trees.
import {planForestPatches} from './forest-patches.js?v=170';

export function createForestLandscape({T,scene,mat,geometry,height,light=false}){
 const trees=planForestPatches(light ? .53 : 1),group=new T.Group();
 group.name='Panama forest reserves · giant palms, cloudforest pines and broadleaf canopy';
 scene.add(group);
 const bark=mat('#8b765c',{roughness:1});
 const crown=mat('#ffffff',{vertexColors:true,side:T.DoubleSide,roughness:.95});
 const byKind={palm:[],pine:[],natural:[]};
 for(const tree of trees)byKind[tree.kind].push(tree);

 const vertex=(points,colors,p,tone)=>{
  points.push(p[0],p[1],p[2]);
  colors.push(.76*tone,tone,.70*tone);
 };
 const triangle=(p,c,a,b,d,tone)=>{vertex(p,c,a,tone);vertex(p,c,b,tone*.95);vertex(p,c,d,tone*.91);};
 const mesh=(draw)=>{
  const p=[],c=[];draw(p,c);
  const geo=geometry(new T.BufferGeometry());
  geo.setAttribute('position',new T.Float32BufferAttribute(p,3));
  geo.setAttribute('color',new T.Float32BufferAttribute(c,3));
  geo.computeVertexNormals();
  return geo;
 };
 // Banana-shaped palm fronds with narrow drooping blades and leaflets.
 const palmCrown=mesh((p,c)=>{
  const N=12;
  for(let i=0;i<N;i++){
   const a=i*2*Math.PI/N,dx=Math.cos(a),dz=Math.sin(a),px=-dz,pz=dx;
   const bend=.66+(i%4)*.09,reach=3.6+(i%4)*.25;
   const point=t=>[.82+dx*t*reach,7.2+Math.sin(t*Math.PI)*.7-bend*t*t*2.25,.27+dz*t*reach];
   for(let k=0;k<8;k++){
    const t=k/8,next=(k+1)/8,A=point(t),B=point(next);
    const w=.12+.34*Math.sin((t+.02)*Math.PI);
    const left=[A[0]+px*w,A[1]-.13*t,A[2]+pz*w],right=[A[0]-px*w,A[1]-.13*t,A[2]-pz*w];
    triangle(p,c,A,left,B,.78+(i%3)*.075);
    triangle(p,c,A,B,right,.76+(i%4)*.06);
    for(const sign of [-1,1]){
     const tip=[A[0]+dx*(.68+.26*Math.sin(t*Math.PI))+px*sign*(.24+.30*Math.sin(t*Math.PI)),
      A[1]-.15-.35*t,A[2]+dz*(.68+.26*Math.sin(t*Math.PI))+pz*sign*(.24+.30*Math.sin(t*Math.PI))];
     const outer=[A[0]+px*sign*.18,A[1],A[2]+pz*sign*.18];
     triangle(p,c,A,outer,tip,.78+(k%3)*.035);
    }
   }
  }
 });
 // Pine boughs are individual radial, swept needle sprays, not stacked cones.
 const pineCrown=mesh((p,c)=>{
  for(let tier=0;tier<13;tier++){
   const y=2.4+tier*.52,rad=(1-tier/14)*2.9;
   for(let j=0;j<9;j++){
    const a=(j+tier*.23)*Math.PI*2/9,dx=Math.cos(a),dz=Math.sin(a),sx=-dz,sz=dx;
    const arm=rad*(.84+(j%3)*.11),end=[dx*arm,y-.47,dz*arm];
    const base=[dx*.12,y+.16,dz*.12],left=[end[0]+sx*.24,y-.33,end[2]+sz*.24],
     right=[end[0]-sx*.24,y-.30,end[2]-sz*.24],top=[dx*arm*.66,y+.52,dz*arm*.66];
    triangle(p,c,base,left,top,.70+(tier%4)*.065);
    triangle(p,c,base,top,right,.71+(j%4)*.055);
    triangle(p,c,base,end,left,.79);
    triangle(p,c,base,right,end,.76);
   }
  }
 });
 // Layered irregular broadleaf boughs, with individual leaf-spray silhouettes.
 const naturalCrown=mesh((p,c)=>{
  for(let branch=0;branch<28;branch++){
   const a=branch*2.399963,r=.65+(branch%7)*.34;
   const x=Math.cos(a)*r,z=Math.sin(a)*r,y=5.35+(branch%6)*.38;
   for(let leaf=0;leaf<5;leaf++){
    const direction=a+leaf*.71+branch*.14,dx=Math.cos(direction),dz=Math.sin(direction);
    const px=-dz,pz=dx,reach=.67+(leaf%3)*.25;
    const A=[x*.77,y-.16,z*.77],tip=[x+dx*reach,y+.18+(leaf%3)*.16,z+dz*reach];
    const left=[x+px*.33,y+.16,z+pz*.33],right=[x-px*.32,y+.03,z-pz*.32];
    triangle(p,c,A,left,tip,.71+(branch%5)*.052);
    triangle(p,c,A,tip,right,.75+(leaf%4)*.05);
   }
  }
 });
 const palmCurve=new T.CatmullRomCurve3([
  new T.Vector3(0,0,0),new T.Vector3(.04,2.0,.02),
  new T.Vector3(.38,5.0,.09),new T.Vector3(.82,7.2,.27)
 ]);
 const trunks={
  palm:geometry(new T.TubeGeometry(palmCurve,15,.20,7,false)),
  pine:geometry(new T.CylinderGeometry(.105,.34,9.3,7)),
  natural:geometry(new T.CylinderGeometry(.15,.51,6.1,8))
 };
 trunks.pine.translate(0,4.65,0);
 trunks.natural.translate(0,3.05,0);
 const crowns={palm:palmCrown,pine:pineCrown,natural:naturalCrown};
 const dummy=new T.Object3D(),color=new T.Color(),counts={};
 for(const [kind,items]of Object.entries(byKind)){
  if(!items.length)continue;
  const stems=new T.InstancedMesh(trunks[kind],bark,items.length);
  const foliage=new T.InstancedMesh(crowns[kind],crown,items.length);
  stems.name=kind+' giant forest trunks';
  foliage.name=kind+' layered natural foliage';
  stems.castShadow=false;foliage.castShadow=false;
  stems.receiveShadow=false;foliage.receiveShadow=false;
  for(let i=0;i<items.length;i++){
   const t=items[i];
   dummy.position.set(t.x,height(t.x,t.z)-.035,t.z);
   dummy.rotation.set(0,t.heading,0);
   dummy.scale.setScalar(t.size);
   dummy.updateMatrix();
   stems.setMatrixAt(i,dummy.matrix);
   foliage.setMatrixAt(i,dummy.matrix);
   if(kind==='pine')color.setHSL(.335+t.tint*.045,.31+t.tint*.09,.28+t.tint*.08);
   else if(kind==='palm')color.setHSL(.315+t.tint*.04,.43+t.tint*.09,.35+t.tint*.09);
   else color.setHSL(.29+t.tint*.085,.34+t.tint*.15,.31+t.tint*.12);
   foliage.setColorAt(i,color);
  }
  stems.instanceMatrix.needsUpdate=true;
  foliage.instanceMatrix.needsUpdate=true;
  if(foliage.instanceColor)foliage.instanceColor.needsUpdate=true;
  stems.computeBoundingSphere?.();
  foliage.computeBoundingSphere?.();
  group.add(stems,foliage);counts[kind]=items.length;
 }
 return {group,trees,counts};
}

// Pure geometry shared by highway and city surfaces. UV distance stays stable on curves.
export function roadRibbon(path,width,height,{offset=0,lift=.13,dash=0,gap=0,include=()=>true}={}){
 const positions=[],uv=[],indices=[];let distance=0;
 const closed=path.length>2&&Math.hypot(path[0][0]-path.at(-1)[0],path[0][1]-path.at(-1)[1])<1e-6;
 for(let i=1;i<path.length;i++){
  const a=path[i-1],b=path[i],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz);
  if(length<1e-6)continue;
  const normal=(index)=>{
   const p=path[closed&&index===0?path.length-2:Math.max(0,index-1)],q=path[closed&&index===path.length-1?1:Math.min(path.length-1,index+1)];
   const l=Math.hypot(q[0]-p[0],q[1]-p[1])||1;return [(q[1]-p[1])/l,-(q[0]-p[0])/l];
  };
  const n0=normal(i-1),n1=normal(i);
  let t=0;
  while(t<length-1e-8){
   const phase=dash?(distance+t)%(dash+gap):0;
   const step=dash?Math.min(length-t,(phase<dash?dash:dash+gap)-phase):length;
   if(step<1e-8)break;
   if((!dash||phase<dash)&&include(a[0]+dx*(t+step/2)/length,a[1]+dz*(t+step/2)/length)){
    const base=positions.length/3;
    for(const d of [t,t+step]){
     const f=d/length,nx=n0[0]*(1-f)+n1[0]*f,nz=n0[1]*(1-f)+n1[1]*f;
     const norm=Math.hypot(nx,nz)||1;
     for(const side of [-1,1]){
      const x=a[0]+dx*f+nx/norm*(offset+side*width/2),z=a[1]+dz*f+nz/norm*(offset+side*width/2);
      positions.push(x,height(x,z)+lift,z);uv.push(side<0?0:1,distance+d);
     }
    }
    indices.push(base,base+2,base+1,base+1,base+2,base+3);
   }
   t+=step;
  }
  distance+=length;
 }
 return {positions,uv,indices};
}
export function surfaceMesh(T,geometry,data,material,name){
 const geo=geometry(new T.BufferGeometry());
 geo.setAttribute('position',new T.Float32BufferAttribute(data.positions,3));
 geo.setAttribute('uv',new T.Float32BufferAttribute(data.uv,2));
 geo.setIndex(data.indices);geo.computeVertexNormals();
 const mesh=new T.Mesh(geo,material);mesh.name=name;mesh.receiveShadow=true;mesh.castShadow=false;return mesh;
}
// Split a rectangle union at every boundary. Each pavement cell appears once,
// including junctions, so crossing streets cannot flicker against each other.
export function cityStreetSurface(rectangles,height){
 const xs=[...new Set(rectangles.flatMap(r=>[r.x-r.w/2,r.x+r.w/2]))].sort((a,b)=>a-b);
 const zs=[...new Set(rectangles.flatMap(r=>[r.z-r.d/2,r.z+r.d/2]))].sort((a,b)=>a-b);
 const positions=[],uv=[],indices=[];
 for(let i=1;i<xs.length;i++)for(let j=1;j<zs.length;j++){
  const x=(xs[i-1]+xs[i])/2,z=(zs[j-1]+zs[j])/2;
  if(!rectangles.some(r=>Math.abs(x-r.x)<r.w/2&&Math.abs(z-r.z)<r.d/2))continue;
  const base=positions.length/3;
  for(const [px,pz] of [[xs[i-1],zs[j-1]],[xs[i-1],zs[j]],[xs[i],zs[j-1]],[xs[i],zs[j]]]){
   positions.push(px,height(px,pz)+.175,pz);uv.push(px*.2,pz*.2);
  }
  indices.push(base,base+1,base+2,base+2,base+1,base+3);
 }
 return {positions,uv,indices};
}

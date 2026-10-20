// Continuous terrain-aware road ribbons with predictable joins and batched markings.
// One surface geometry per route, rather than dozens of skewed overlapping boxes.
export function sampleRoadLine(points,step=1.6){
 const out=[];
 if(!Array.isArray(points)||!points.length)return out;
 out.push([Number(points[0][0]),Number(points[0][1])]);
 for(let i=1;i<points.length;i++){
  const a=out[out.length-1],b=points[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]);
  if(len<.001)continue;
  const n=Math.ceil(len/step);
  for(let j=1;j<=n;j++)out.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);
 }
 return out;
}
export function ribbonPlan(points,{width=9.5,height=()=>0,lift=.13,offset=0,safe=null,step=1.6}={}){
 const path=sampleRoadLine(points,step),v=[],uv=[],indices=[],at=[],distances=[0];
 for(let i=1;i<path.length;i++)distances.push(distances.at(-1)+Math.hypot(path[i][0]-path[i-1][0],path[i][1]-path[i-1][1]));
 for(let i=0;i<path.length;i++){
  const [x,z]=path[i],a=path[Math.max(0,i-1)],b=path[Math.min(path.length-1,i+1)];
  const dx=b[0]-a[0],dz=b[1]-a[1],n=Math.hypot(dx,dz)||1;
  const ox=dz/n,oz=-dx/n;
  // Clamp the join to avoid twisted quads when the underlying path bends.
  const left=[x+ox*(offset-width*.5),z+oz*(offset-width*.5)];
  const right=[x+ox*(offset+width*.5),z+oz*(offset+width*.5)];
  const good=!safe||(safe(x,z)&&safe(...left)&&safe(...right));
  for(const [px,pz] of [left,right]){v.push(px,height(px,pz)+lift,pz);uv.push(px*.09,pz*.09);}
  at.push(good);
  if(i&&at[i-1]&&good){
   const j=i*2;indices.push(j-2,j,j-1,j-1,j,j+1);
  }
 }
 return {path,positions:v,uv,indices,distances,safe:at};
}
function mergePlan(dst,plan){
 const count=dst.positions.length/3;
 dst.positions.push(...plan.positions);dst.uv.push(...plan.uv);
 for(const i of plan.indices)dst.indices.push(count+i);
}
function stripMesh({T,geometry,group,mat,parts,name,renderOrder=4}){
 if(!parts.indices.length)return null;
 const geo=geometry(new T.BufferGeometry());
 geo.setAttribute('position',new T.Float32BufferAttribute(parts.positions,3));
 geo.setAttribute('uv',new T.Float32BufferAttribute(parts.uv,2));
 geo.setIndex(parts.indices);geo.computeVertexNormals();
 const mesh=new T.Mesh(geo,mat);
 mesh.name=name;mesh.receiveShadow=true;mesh.castShadow=false;mesh.renderOrder=renderOrder;
 group.add(mesh);return mesh;
}
export function createRoadSurface({
 T,geometry,group,points,width=9.5,height,asphalt,paint=null,
 edgePaint=null,lift=.13,step=1.6,safe=null,junctions=[],markings=true
}){
 const ground=ribbonPlan(points,{width,height,lift,step,safe});
 const empty=()=>({positions:[],uv:[],indices:[]});
 const result={surface:stripMesh({T,geometry,group,mat:asphalt,parts:ground,name:'Seamless continuous road asphalt'}),
  stripes:null,edges:null,points:ground.path,quads:ground.indices.length/6};
 if(!markings||ground.path.length<2)return result;
 const edge=empty(),dashes=empty(),border=width/2-.32;
 const withinJunction=(x,z)=>junctions.some(([jx,jz])=>Math.hypot(x-jx,z-jz)<width*.8);
 const createMark=(a,b,w,offset,part,raise)=>{
  const p=ribbonPlan([a,b],{width:w,height,lift:raise,offset,step:1.0,safe});
  if(p.indices.length)mergePlan(part,p);
 };
 // Edge lines follow exactly the same sampled centerline. Keep their joins
 // continuous and their borders inside the safe, solid asphalt surface.
 if(edgePaint)for(const side of [-1,1]){
  const p=ribbonPlan(ground.path,{width:.10,height,lift:lift+.018,offset:side*border,step,safe});
  mergePlan(edge,p);
 }
 if(paint){
  let s=0;const max=ground.distances.at(-1);
  // Physical-distance based markings keep a constant dash rhythm even where
  // a route changes curvature or the original waypoints are uneven.
  while(s<max){
   const end=Math.min(max,s+2.7);
   const sample=d=>{
    const distances=ground.distances;
    let i=1;while(i<distances.length-1&&distances[i]<d)i++;
    const a=ground.path[i-1],b=ground.path[i],seg=distances[i]-distances[i-1];
    const t=seg?Math.max(0,Math.min(1,(d-distances[i-1])/seg)):0;
    return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
   };
   const first=sample(s),last=sample(end),mid=sample((s+end)/2);
   if(!withinJunction(...mid))createMark(first,last,.14,0,dashes,lift+.038);
   s+=7.2;
  }
 }
 if(paint)result.stripes=stripMesh({T,geometry,group,mat:paint,parts:dashes,name:'Road center dashes · even spacing',renderOrder:5});
 if(edgePaint)result.edges=stripMesh({T,geometry,group,mat:edgePaint,parts:edge,name:'Road edge lines · continuous',renderOrder:5});
 return result;
}

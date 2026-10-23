// Shared shoreline clipping keeps visible ground out of navigable water.
// Vertex data is [x,y,z,...attributes]; intersections preserve colors and UVs.
export function clipLandTriangle(vertices,isLand){
 const result=[];
 for(let i=0;i<3;i++){
  const a=vertices[i],b=vertices[(i+1)%3],inside=isLand(a[0],a[2]),next=isLand(b[0],b[2]);
  if(inside)result.push(a);
  if(inside!==next){
   let lo=0,hi=1;
   for(let n=0;n<12;n++){const t=(lo+hi)/2;if(isLand(a[0]+(b[0]-a[0])*t,a[2]+(b[2]-a[2])*t)===inside)lo=t;else hi=t;}
   const t=(lo+hi)/2;result.push(a.map((v,k)=>v+(b[k]-v)*t));
  }
 }
 const triangles=[];
 for(let i=1;i+1<result.length;i++)triangles.push(result[0],result[i],result[i+1]);
 return triangles;
}
// A compact coast-distance texture replaces the obsolete ellipse-only shader.
// Calculated once at load; water animation needs one lookup per fragment.
export function coastDistanceField(isLand,width=384,height=320,extent={left:-375,top:-325,width:750,height:650}){
 const distances=new Float32Array(width*height),pixels=new Uint8Array(width*height*4),dx=extent.width/width,dz=extent.height/height,diagonal=Math.hypot(dx,dz);
 for(let j=0;j<height;j++)for(let i=0;i<width;i++)distances[j*width+i]=isLand((i+.5)*dx+extent.left,(j+.5)*dz+extent.top)?0:1000;
 for(let j=0;j<height;j++)for(let i=0;i<width;i++){
  const k=j*width+i;let d=distances[k];if(i)d=Math.min(d,distances[k-1]+dx);if(j)d=Math.min(d,distances[k-width]+dz);if(i&&j)d=Math.min(d,distances[k-width-1]+diagonal);if(j&&i+1<width)d=Math.min(d,distances[k-width+1]+diagonal);distances[k]=d;
 }
 for(let j=height-1;j>=0;j--)for(let i=width-1;i>=0;i--){
  const k=j*width+i;let d=distances[k];if(i+1<width)d=Math.min(d,distances[k+1]+dx);if(j+1<height)d=Math.min(d,distances[k+width]+dz);if(i+1<width&&j+1<height)d=Math.min(d,distances[k+width+1]+diagonal);if(i&&j+1<height)d=Math.min(d,distances[k+width-1]+diagonal);distances[k]=d;
  const encoded=Math.round(Math.min(64,d)/64*255);pixels.set([encoded,encoded,encoded,255],k*4);
 }
 return {pixels,width,height};
}

// Adaptive shoreline tessellation. Leave inland triangles light, but replace
// each coastal grid cell with fine triangles where the waterline crosses.
// This follows the SAME land predicate as swimming and island geometry.
export function shorelineTiles(x,z,size,isLand,coastDivisions=5){
 const samples=[[0,0],[1,0],[0,1],[1,1],[.5,.5],[.5,0],[0,.5],[1,.5],[.5,1]];
 const first=isLand(x,z);
 const edge=samples.some(([u,v])=>isLand(x+size*u,z+size*v)!==first);
 const divisions=edge?Math.max(2,Math.min(6,Math.floor(coastDivisions))):1,tiles=[],step=size/divisions;
 for(let i=0;i<divisions;i++)for(let j=0;j<divisions;j++)
  tiles.push([x+i*step,z+j*step,step]);
 return tiles;
}


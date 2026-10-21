// Irregular, separated cay groups. IDs and treasure order remain stable.
// Coordinates are compressed interpretations, not surveyed island locations.
export const SAN_BLAS_LAYOUT_VERSION=4;
export function sanBlasLayout(eastShift=240){
 return Array.from({length:28},(_,i)=>{
  const col=i%7,row=Math.floor(i/7),oldX=246+eastShift+col*14+(row%2)*2,oldZ=-277+row*21+(col%2)*3;
  const dx=oldX-(290+eastShift),dz=oldZ+245;
  return {id:'guna-'+i,oldX,oldZ,x:290+eastShift+dx*2.65+Math.sin(i*2.4)*5,
   z:-425+dz*2.05+Math.sin(col*1.8+row)*7,rx:3.5+(i%3)*.65,rz:2.9+(i%4)*.4,
   h:.65,guna:true,community:i%7===0,en:'San Blas cay '+(i+1),es:'Cayo de San Blas '+(i+1)};
 }).filter(p=>Math.hypot(p.oldX-(290+eastShift),p.oldZ+245)>17).map(p=>({...p,ox:p.x,oz:p.z,spread:1}));
}
export function relocateSanBlasPoint(p,layout,version=2){
 if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.z))return p;
 const source=layout.map(c=>version>=3?{...c,oldX:c.x,oldZ:c.z+180}:c);
 const cay=source.map(c=>({c,d:Math.hypot((p.x-c.oldX)/(c.rx+2),(p.z-c.oldZ)/(c.rz+2))})).filter(q=>q.d<1.15).sort((a,b)=>a.d-b.d)[0]?.c;
 if(cay)return {...p,x:p.x+cay.x-cay.oldX,z:p.z+cay.z-cay.oldZ};
 return Math.hypot((p.x-530)/19,(p.z+245)/17)<1.3?{...p,z:p.z-180}:p;
}

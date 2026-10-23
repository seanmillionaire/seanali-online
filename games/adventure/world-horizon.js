import {WORLD_BOUNDS} from './geography.js';
// Keep gameplay flat; round the far ocean beyond the playable oval into a
// low globe-like horizon. No rectangular terrain/water corners remain.
export function roundedOceanGeometry(T,rings=40,sectors=160){
 const positions=[],uv=[],indices=[],rx=WORLD_BOUNDS.x+900,rz=WORLD_BOUNDS.z+900;
 for(let ring=0;ring<=rings;ring++)for(let i=0;i<=sectors;i++){
  const r=ring/rings,a=i/sectors*Math.PI*2,x=Math.cos(a)*rx*r,y=Math.sin(a)*rz*r,drop=Math.max(0,(r-.58)/.42)**2*260;
  positions.push(x,y,-drop);uv.push((x/rx+1)/2,(y/rz+1)/2);
  if(ring<rings&&i<sectors){const n=ring*(sectors+1)+i;indices.push(n,n+sectors+1,n+1,n+1,n+sectors+1,n+sectors+2);}
 }
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return g;
}


// Shared, small procedural surfaces and static mesh batches. No fetched assets.
const surfaces=new WeakMap(),smoothSources=new WeakMap(),wingSources=new WeakMap();
export function animalSurface(T,mat,kind='scales'){
 let cache=surfaces.get(mat);if(!cache)surfaces.set(mat,cache=new Map());if(cache.has(kind))return cache.get(kind);
 const size=128,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  let v;if(kind==='fur'){v=191+Math.sin(x*1.7+y*.21)*13+Math.sin(x*.53+y*.11)*18+((x*17+y*31)%19);}
  else{const row=Math.floor(y/8),u=(x+(row%2)*6)%12/12,vv=y%8/8,edge=Math.abs(u-.5)*1.5+Math.abs(vv-.5);v=215+(edge>.79?-60:Math.sin(u*Math.PI)*15)+Math.sin(x*7+y*13)*5;}
  const k=(y*size+x)*4;data[k]=data[k+1]=data[k+2]=Math.max(0,Math.min(255,v));data[k+3]=255;
 }
 const map=new T.DataTexture(data,size,size);map.wrapS=map.wrapT=T.RepeatWrapping;map.generateMipmaps=true;map.minFilter=T.LinearMipmapLinearFilter;map.magFilter=T.LinearFilter;map.needsUpdate=true;
 // Grayscale data stays linear for bump detail; material color supplies the tint.
 const owner=mat('#ffffff');owner.addEventListener('dispose',()=>{map.dispose();cache.delete(kind);});cache.set(kind,map);return map;
}
export function compactAnimal(T,geometry,root){
 for(const child of root.children)if(child.isGroup)compactAnimal(T,geometry,child);
 const byMaterial=new Map();for(const mesh of [...root.children]){if(!mesh.isMesh||mesh.isInstancedMesh||Array.isArray(mesh.material))continue;mesh.updateMatrix();const source=mesh.geometry.index?mesh.geometry.toNonIndexed():mesh.geometry.clone();source.applyMatrix4(mesh.matrix);const group=byMaterial.get(mesh.material)||[];group.push(source);byMaterial.set(mesh.material,group);root.remove(mesh);}
 for(const [material,parts]of byMaterial){const arrays={position:[],normal:[],uv:[],...(material.vertexColors?{color:[]}: {})};for(const p of parts){for(const name of Object.keys(arrays)){const a=p.attributes[name];if(a)for(const n of a.array)arrays[name].push(n);else for(let i=0;i<p.attributes.position.count;i++)arrays[name].push(...(name==='color'?[1,1,1]:[0,0]));}p.dispose();}const g=geometry(new T.BufferGeometry());for(const [name,data]of Object.entries(arrays))g.setAttribute(name,new T.Float32BufferAttribute(data,name==='uv'?2:3));const mesh=new T.Mesh(g,material);mesh.name='Batched animal anatomy';root.add(mesh);}
 return root;
}
export function animalBuilder({T,geometry,mat,make,ball,cylinder}){
 let smooth=smoothSources.get(geometry);if(!smooth){smooth=geometry(new T.SphereGeometry(1,16,12));smoothSources.set(geometry,smooth);}const up=new T.Vector3(0,1,0);
 const p=(m,x,y,z,w,h,d,parent)=>make(smooth,m,x,y,z,w,h,d,parent);
 const link=(m,a,b,r1,r2,parent)=>{const av=new T.Vector3(...a),bv=new T.Vector3(...b),dir=bv.clone().sub(av),mesh=make(geometry(new T.CylinderGeometry(r2,r1,dir.length(),8)),m,0,0,0,1,1,1,parent);mesh.position.copy(av.add(bv).multiplyScalar(.5));mesh.quaternion.setFromUnitVectors(up,dir.normalize());return mesh;};
 const tube=(m,points,r,parent)=>make(geometry(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),16,r,7,false)),m,0,0,0,1,1,1,parent);
 return {p,link,tube,finish:g=>compactAnimal(T,geometry,g)};
}
// A thin, cambered wing outline, with a scalloped trailing edge and fingered tip.
export function featherWingGeometry(T,geometry){
 if(wingSources.has(geometry))return wingSources.get(geometry);
 const shape=new T.Shape();shape.moveTo(0,.13);shape.bezierCurveTo(.4,.32,.82,.26,1.05,.05);shape.lineTo(1.45,-.18);shape.lineTo(1.21,-.18);shape.lineTo(1.38,-.32);shape.lineTo(1.11,-.26);shape.lineTo(1.22,-.43);shape.lineTo(.98,-.34);shape.lineTo(1.03,-.51);shape.lineTo(.80,-.41);shape.lineTo(.83,-.55);shape.bezierCurveTo(.5,-.47,.22,-.36,0,-.23);shape.closePath();
 const g=new T.ExtrudeGeometry(shape,{depth:.024,bevelEnabled:false,steps:1});g.rotateX(Math.PI/2);g.computeVertexNormals();g.name='Cambered feather flight wing';const result=geometry(g);wingSources.set(geometry,result);return result;
}
// Continuous cross-section sculpture for shoulders, ribcage, neck and muzzle.
// Stations are [forwardZ, centerY, halfWidth, halfHeight], tail to nose.
export function animalLoft(T,geometry,stations,rings=65,sides=16){
 const pos=[],uv=[],ix=[],cubic=(a,b,c,d,t)=>.5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);
 for(let i=0;i<rings;i++){const f=i/(rings-1)*(stations.length-1),k=Math.min(stations.length-2,Math.floor(f)),t=f-k,v=[];for(let n=0;n<4;n++)v[n]=cubic(stations[Math.max(0,k-1)][n],stations[k][n],stations[k+1][n],stations[Math.min(stations.length-1,k+2)][n],t);for(let j=0;j<=sides;j++){const a=j/sides*Math.PI*2;pos.push(Math.sin(a)*Math.max(.002,v[2]),v[1]+Math.cos(a)*Math.max(.002,v[3]),v[0]);uv.push(j/sides,i/(rings-1));if(i<rings-1&&j<sides){const q=i*(sides+1)+j,n=q+sides+1;ix.push(q,n,q+1,q+1,n,n+1);}}}
 const g=geometry(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();g.name='Continuous anatomical sculpture';return g;
}
export function groundAnimal(g,height,length=2,width=.7){const {x,z}=g.position,h=g.rotation.y,s=Math.sin(h),c=Math.cos(h),front=height(x+s*length*.5,z+c*length*.5),rear=height(x-s*length*.5,z-c*length*.5),left=height(x-c*width*.5,z+s*width*.5),right=height(x+c*width*.5,z-s*width*.5);g.rotation.order='YXZ';g.rotation.x=-Math.max(-.6,Math.min(.6,Math.atan2(front-rear,length)));g.rotation.z=Math.max(-.4,Math.min(.4,Math.atan2(right-left,width)));}

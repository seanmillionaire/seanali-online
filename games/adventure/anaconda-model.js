// Skull/eye reference: https://nationalzoo.si.edu/animals/green-anaconda
import {animalBuilder,animalSurface} from './animal-craft.js';
export const ANACONDA_RINGS=161,ANACONDA_SIDES=16,ANACONDA_LENGTH=21.2;
export function anacondaRadius(t){return .035+.64*Math.pow(Math.sin(Math.PI*(.16+.84*t)),.72)*(1-.48*t);}
// Arc-length interpolation removes the old bead-to-bead snapping. Each ring
// follows its own local heading and samples the visible ground under its belly.
export function sampleSnakeTrail(trail,distance){
 let left=distance;for(let i=1;i<trail.length;i++){const a=trail[i-1],b=trail[i],d=Math.hypot(b.x-a.x,b.z-a.z);if(d<1e-6)continue;if(left<=d){const f=left/d;return {x:a.x+(b.x-a.x)*f,z:a.z+(b.z-a.z)*f,heading:Math.atan2(a.x-b.x,a.z-b.z)};}left-=d;}
 const p=trail.at(-1)||{x:0,z:0,heading:0};return {...p};
}
export function createAnaconda(o,parent){
 const {T,geometry,mat}=o,{p,link,finish}=animalBuilder(o),g=new T.Group();g.name='One giant jungle snake';parent.add(g);const head=new T.Group();head.name='Anaconda head · dorsal eyes and nostrils';g.add(head);
 const map=animalSurface(T,mat),skin=mat('#626442',{roughness:.67,bumpMap:map,bumpScale:.025}),belly=mat('#b0a279',{roughness:.88}),dark=mat('#17231a'),eye=mat('#8b793c',{roughness:.3}),black=mat('#0d1510'),mouth=mat('#3a3b25');
 // A compact elongated skull; small eyes sit high, rather than on cartoon stalks.
 p(skin,0,.08,.18,.45,.225,.74,head);p(skin,0,.055,.70,.35,.17,.38,head);p(belly,0,-.07,.45,.37,.07,.62,head);
 for(const s of [-1,1]){p(eye,s*.29,.235,.53,.068,.05,.065,head);p(black,s*.297,.26,.56,.035,.025,.029,head);p(skin,s*.29,.27,.48,.095,.035,.11,head);p(black,s*.18,.19,.93,.035,.016,.032,head);const stripe=p(dark,s*.391,.09,-.08,.025,.065,.28,head);stripe.rotation.y=s*.22;for(let k=0;k<6;k++)link(mouth,[s*(.32+k*.003),-.015,.15+k*.12],[s*(.32+(k+1)*.003),-.015,.27+k*.12],.009,.009,head);}
 const tongue=new T.Group();tongue.position.set(0,-.025,1.03);head.add(tongue);const tongueMat=mat('#673a39');link(tongueMat,[0,0,0],[0,0,.35],.012,.009,tongue);for(const s of [-1,1])link(tongueMat,[0,0,.29],[s*.065,0,.43],.008,.002,tongue);finish(head);
 const positions=new Float32Array(ANACONDA_RINGS*(ANACONDA_SIDES+1)*3),normals=new Float32Array(positions.length),uv=new Float32Array(ANACONDA_RINGS*(ANACONDA_SIDES+1)*2),ix=[];
 for(let i=0;i<ANACONDA_RINGS;i++)for(let j=0;j<=ANACONDA_SIDES;j++){const t=i/(ANACONDA_RINGS-1),a=j/ANACONDA_SIDES*Math.PI*2,k=i*(ANACONDA_SIDES+1)+j;uv[k*2]=j/ANACONDA_SIDES;uv[k*2+1]=t;if(i<ANACONDA_RINGS-1&&j<ANACONDA_SIDES){const n=k+ANACONDA_SIDES+1;ix.push(k,k+1,n,k+1,n+1,n);}}
 const geo=geometry(new T.BufferGeometry());geo.setAttribute('position',new T.BufferAttribute(positions,3).setUsage(T.DynamicDrawUsage));geo.setAttribute('normal',new T.BufferAttribute(normals,3).setUsage(T.DynamicDrawUsage));geo.setAttribute('uv',new T.BufferAttribute(uv,2));geo.setIndex(ix);const size=512,pixels=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const u=x/size,t=y/size,row=Math.floor(t*19),v=t*19-row,center=row%2?.13:.87,delta=Math.abs(u-center),oval=Math.pow(Math.min(delta,1-delta)/.075,2)+Math.pow((v-.5)/.34,2),back=Math.pow(Math.min(u,1-u)/.07,2)+Math.pow((v-.54)/.28,2),isBelly=Math.cos(u*Math.PI*2)<-.25,isSpot=!isBelly&&(oval<1||(row%3===0&&back<1)),tint=isBelly?[161,149,102]:isSpot?[29,34,21]:[139,136,69],grain=Math.sin(x*2.7+y*.41)*3+Math.sin(y*.7+x*.1)*2;pixels.set([tint[0]+grain,tint[1]+grain,tint[2]+grain,255],(y*size+x)*4);}
 const hideMap=new T.DataTexture(pixels,size,size);hideMap.colorSpace=T.SRGBColorSpace;hideMap.wrapS=hideMap.wrapT=T.RepeatWrapping;hideMap.generateMipmaps=true;hideMap.minFilter=T.LinearMipmapLinearFilter;hideMap.needsUpdate=true;const bodyBump=map.clone();bodyBump.repeat.set(3,22);bodyBump.needsUpdate=true;const hideMaterial=mat('#ffffff',{map:hideMap,roughness:.7,bumpMap:bodyBump,bumpScale:.024});hideMaterial.addEventListener('dispose',()=>{hideMap.dispose();bodyBump.dispose();});const body=new T.Mesh(geo,hideMaterial);body.name='Continuous tapered anaconda hide';body.frustumCulled=false;g.add(body);const centers=Array.from({length:ANACONDA_RINGS},()=>({x:0,y:0,z:0,heading:0}));
 function update(trail,height,time,heading,clear=()=>true){
  for(let i=0;i<ANACONDA_RINGS;i++){const t=i/(ANACONDA_RINGS-1),c=sampleSnakeTrail(trail,t*ANACONDA_LENGTH),r=anacondaRadius(t);const wave=Math.sin(t*Math.PI*5-time*1.6)*Math.sin(t*Math.PI)*.24,nx=c.x+Math.cos(c.heading)*wave,nz=c.z-Math.sin(c.heading)*wave;if(clear(nx,nz)){c.x=nx;c.z=nz;}Object.assign(centers[i],c);centers[i].y=height(c.x,c.z)+r*.68+.025;}
  for(let i=0;i<ANACONDA_RINGS;i++){const t=i/(ANACONDA_RINGS-1),c=centers[i],r=anacondaRadius(t),before=centers[Math.max(0,i-2)],after=centers[Math.min(ANACONDA_RINGS-1,i+2)],dx=before.x-after.x,dz=before.z-after.z,dy=before.y-after.y,horizontal=Math.hypot(dx,dz)||1,h=Math.atan2(dx,dz),slope=dy/Math.hypot(horizontal,dy),lift=horizontal/Math.hypot(horizontal,dy),sideX=Math.cos(h),sideZ=-Math.sin(h),upX=-slope*Math.sin(h),upZ=-slope*Math.cos(h);c.heading=h;
   for(let j=0;j<=ANACONDA_SIDES;j++){const a=j/ANACONDA_SIDES*Math.PI*2,k=(i*(ANACONDA_SIDES+1)+j)*3,side=Math.sin(a)*r,up=Math.cos(a)*r*.68;positions[k]=c.x+sideX*side+upX*up;positions[k+1]=c.y+lift*up;positions[k+2]=c.z+sideZ*side+upZ*up;}
  }
  const first=centers[0],next=centers[3];head.position.set(first.x,first.y-.03,first.z);head.rotation.y=first.heading??heading;head.rotation.x=-Math.atan2(first.y-next.y,Math.hypot(first.x-next.x,first.z-next.z));const flick=time%4.8;tongue.visible=flick<.42;tongue.scale.z=.45+Math.sin(flick*28)*.25;geo.attributes.position.needsUpdate=true;geo.computeVertexNormals();return centers;
 }

 return {g,head,body,update,centers};
}

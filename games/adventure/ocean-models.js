// Species share anatomy and GPU resources across wild animals and named friends.
// Detail is in the silhouette, countershading and markings, not overlapping bodies.
const libraries=new WeakMap();
export function oceanModel(T,{geometry,mat,make,ball},kind){
 let library=libraries.get(geometry);if(!library){library=new Map();libraries.set(geometry,library);}
 const shared=(key,build)=>{if(!library.has(key))library.set(key,build());return library.get(key);};
 const g=new T.Group(),moving=[];g.name=kind+' · naturalist model';
 const material=(name,color,options={})=>shared(name,()=>mat(color,{roughness:.62,...options}));
 const skin=material('marine vertex skin','#ffffff',{vertexColors:true,roughness:.53}),eye=material('marine pupil','#111c1c',{roughness:.19}),glint=material('marine eye glint','#e5e6cf',{roughness:.15});
 const smooth=shared('marine sphere',()=>geometry(new T.SphereGeometry(1,28,18)));
 const shades={Octopus:[[.30,.115,.055],[.58,.34,.19]],'Sea turtle':[[.25,.34,.17],[.66,.65,.40]],Dolphin:[[.12,.24,.29],[.57,.66,.63]],'Reef shark':[[.29,.36,.37],[.75,.78,.70]],'Manta ray':[[.12,.21,.23],[.72,.75,.66]],'Reef fish':[[.75,.53,.14],[.92,.76,.37]]};
 const palette=shades[kind]||shades['Reef fish'];
 function painted(geo,key,markings=true){return shared(kind+key,()=>{
  const colors=[],p=geo.attributes.position;
  for(let i=0;i<p.count;i++){
   const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
   const light=palette[1],dark=palette[0],belly=key.endsWith(' painted')?0:kind==='Octopus'?Math.max(0,-y)*.28:Math.max(0,Math.min(1,(-y+.02)*2.1));
   const grain=Math.sin(x*71+Math.sin(z*43)*2)*Math.sin(y*59+z*39);
   const mottling=Math.sin(x*19+Math.sin(z*13)*2)*Math.sin(y*23-z*17);
   const variation=kind==='Octopus'?(mottling*.045+grain*.018):kind==='Sea turtle'?mottling*.035:kind==='Reef fish'&&Math.cos(z*37)>.68?-.17:grain*.012;
   for(let k=0;k<3;k++)colors.push(Math.max(.025,dark[k]*(1-belly)+light[k]*belly+(markings?variation:0)));
  }
  geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));return geometry(geo);
 });}
 const surface=()=>shared(kind+' sphere resource',()=>painted(new T.SphereGeometry(1,28,18),' sphere'));
 const body=(x,y,z,sx,sy,sz,parent=g)=>make(surface(),skin,x,y,z,sx,sy,sz,parent);
 function dot(m,x,y,z,sx,sy,sz,parent=g){return make(smooth,m,x,y,z,sx,sy,sz,parent);}
 function fin(points,parent=g,key='fin'){
  const geo=shared(kind+key,()=>{
   const shape=new T.Shape(),mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
   if(key==='tail'&&(kind==='Dolphin'||kind==='Reef shark')){
    shape.moveTo(0,.10);shape.bezierCurveTo(-.20,.10,-.49,.11,-.80,-.20);shape.bezierCurveTo(-.56,-.18,-.25,-.36,-.04,-.16);shape.lineTo(0,-.22);shape.lineTo(.04,-.16);shape.bezierCurveTo(.25,-.36,.56,-.18,.80,-.20);shape.bezierCurveTo(.49,.11,.20,.10,0,.10);shape.closePath();
   }else{
    const first=mid(points.at(-1),points[0]);shape.moveTo(...first);
    points.forEach((p,i)=>shape.quadraticCurveTo(...p,...mid(p,points[(i+1)%points.length])));shape.closePath();
   }
   return painted(new T.ExtrudeGeometry(shape,{depth:.028,bevelEnabled:true,bevelSegments:2,steps:1,curveSegments:7,bevelSize:.022,bevelThickness:.018}),key+' painted');
  });return make(geo,skin,0,0,0,1,1,1,parent);
 }
 function eyes(x,y,z,size=.04){
  for(const sign of [-1,1]){dot(eye,sign*x,y,z,size,size*.86,size*.58);dot(glint,sign*(x+.004),y+size*.3,z+size*.5,size*.21,size*.21,size*.12);}
 }
 if(kind==='Dolphin'||kind==='Reef shark'){
  // Flowing spindle with a narrower caudal peduncle and rounded melon.
  const geo=shared(kind+' spindle',()=>{
   const profile=kind==='Reef shark'?[[-1.52,.025],[-1.23,.07],[-.92,.13],[-.52,.25],[-.08,.35],[.42,.33],[.8,.24],[1.08,.12],[1.25,.015]]:[[-1.52,.025],[-1.23,.07],[-.92,.13],[-.52,.25],[-.08,.35],[.42,.33],[.70,.27],[.88,.235],[1.02,.15],[1.12,.085],[1.38,.062],[1.48,.009]];
   const rings=profile.map(([z,r])=>new T.Vector2(r,z));
   const curve=new T.SplineCurve(rings),shape=new T.LatheGeometry(curve.getPoints(64),32);shape.rotateX(Math.PI/2);shape.scale(1,.87,1);
   const p=shape.attributes.position;for(let i=0;i<p.count;i++)if(p.getZ(i)>.9)p.setY(i,p.getY(i)-Math.min(.07,(p.getZ(i)-.9)*.25));
   shape.computeVertexNormals();return painted(shape,' spindle paint');
  });make(geo,skin,0,0,0,1,1,1,g).name='Continuous streamlined body';
  eyes(kind==='Dolphin'?.205:.20,.055,.85,.032);
  const blow=material('dolphin blowhole','#354a49');dot(blow,0,.287,.48,.031,.009,.050);
  const dorsal=fin([[-.40,0],[-.02,.64],[.16,.57],[.11,.17],[.42,0]],g,'dorsal');dorsal.rotation.y=Math.PI/2;dorsal.position.set(0,.22,-.30);
  for(const sign of [-1,1]){
   const f=fin([[0,.12],[sign*.28,-.02],[sign*.79,-.38],[sign*.64,-.43],[sign*.12,-.14]],g,'pectoral'+sign);f.rotation.x=Math.PI/2;f.position.set(sign*.16,-.14,.26);
   if(kind==='Reef shark')for(let n=0;n<4;n++)dot(eye,sign*.29,-.02,.27-n*.08,.007,.066,.01);
  }
  const tail=new T.Group();tail.position.set(0,0,-1.44);g.add(tail);
  const fluke=fin([[0,.11],[-.78,-.21],[-.57,-.39],[-.16,-.29],[0,-.17],[.16,-.29],[.57,-.39],[.78,-.21]],tail,'tail');fluke.rotation.x=Math.PI/2;
  if(kind==='Reef shark')tail.rotation.z=Math.PI/2;moving.push(tail);
 }else if(kind==='Octopus'){
  const mantle=body(0,.25,-.25,.46,.58,.63);mantle.rotation.x=-.20;mantle.name='Mottled muscular mantle';
  body(0,-.07,.22,.37,.24,.40);
  const iris=material('octopus bronze iris','#ac9854'),cup=material('octopus sucker rim','#d29b78',{roughness:.81});
  for(const sign of [-1,1]){
   body(sign*.28,.10,.39,.13,.14,.16);
   dot(iris,sign*.32,.13,.49,.093,.092,.046);
   dot(eye,sign*.32,.13,.53,.067,.025,.015);
   dot(glint,sign*.33,.16,.545,.014,.012,.008);
  }
  const cupGeo=shared('octopus ring',()=>geometry(new T.TorusGeometry(1,.24,5,10)));
  for(let i=0;i<8;i++){
   const pivot=new T.Group();pivot.name='Tapered arm '+(i+1);pivot.rotation.y=i*Math.PI/4;g.add(pivot);moving.push(pivot);
   const length=1.46+(i%3)*.14,curl=.18+(i%4)*.09;
   const curve=new T.CatmullRomCurve3([new T.Vector3(0,-.16,.15),new T.Vector3(.05,-.26,.50),new T.Vector3(.12,-.31,length*.76),new T.Vector3(curl,-.22,length),new T.Vector3(curl+.12,-.07,length-.12)]);
   const arm=shared('octopus arm '+i,()=>{
    const tube=new T.TubeGeometry(curve,24,.14,8,false),p=tube.attributes.position;
    for(let j=0;j<=24;j++){const t=j/24,center=curve.getPointAt(t),radius=Math.pow(1-t,.95)*.94+.055;
     for(let k=0;k<=8;k++){const ix=j*9+k;p.setXYZ(ix,center.x+(p.getX(ix)-center.x)*radius,center.y+(p.getY(ix)-center.y)*radius,center.z+(p.getZ(ix)-center.z)*radius);}
    }tube.computeVertexNormals();return painted(tube,' arm '+i);
   });make(arm,skin,0,0,0,1,1,1,pivot);
   const cups=new T.InstancedMesh(cupGeo,cup,22),dummy=new T.Object3D();cups.name='Paired recessed suckers';
   for(let n=0;n<11;n++)for(let row=0;row<2;row++){
    const t=.12+n*.066,p=curve.getPointAt(t),size=.051*(1-t)+.012;dummy.position.set(p.x+(row?1:-1)*size*.76,p.y-.12*(1-t),p.z);dummy.rotation.set(Math.PI/2,0,0);dummy.scale.setScalar(size);dummy.updateMatrix();cups.setMatrixAt(n*2+row,dummy.matrix);
   }cups.castShadow=false;pivot.add(cups);
  }
 }else if(kind==='Sea turtle'){
  body(0,0,0,.54,.28,.73);body(0,-.14,0,.49,.11,.66);body(0,.015,.78,.17,.14,.29);
  const rim=material('turtle shell rim','#a49d62'),shell=material('turtle shell seams','#303d27');
  dot(rim,0,.01,0,.55,.19,.74);
  // Hexagonal growth plates are painted on one continuous curved carapace.
  // Fine seams and growth rings survive close inspection without floating tiles.
  const shellMaterial=shared('turtle patterned shell',()=>{
   const width=384,height=192,data=new Uint8Array(width*height*4),R=.17,edge=R*Math.sqrt(3)/2;
   for(let v=0;v<height;v++)for(let u=0;u<width;u++){
    const phi=(u+.5)/width*Math.PI*2,theta=(v+.5)/height*Math.PI,x=-Math.cos(phi)*Math.sin(theta)*.55,z=Math.sin(phi)*Math.sin(theta)*.73;
    const q=(Math.sqrt(3)/3*x-z/3)/R,r=2*z/(3*R),cube=[q,-q-r,r],rounded=cube.map(Math.round),errors=rounded.map((n,i)=>Math.abs(n-cube[i]));
    const largest=errors.indexOf(Math.max(...errors));rounded[largest]=-rounded[(largest+1)%3]-rounded[(largest+2)%3];
    const cx=R*Math.sqrt(3)*(rounded[0]+rounded[2]/2),cz=R*1.5*rounded[2],dx=x-cx,dz=z-cz;
    const d=Math.max(Math.abs(dx),Math.abs(dx*.5+dz*.8660254),Math.abs(dx*.5-dz*.8660254)),seam=d>edge-.008;
    const variation=((rounded[0]*13+rounded[2]*7)%5)*2,growth=Math.sin(d/edge*38)*2.1,grain=Math.sin(x*817+z*371)*1.4;
    const rgb=seam?[38,47,29]:[79+variation+growth+grain,91+variation+growth+grain,48+variation*.5+growth];
    const i=(v*width+u)*4;data.set([...rgb.map(n=>Math.max(0,Math.min(255,n))),255],i);
   }
   const texture=new T.DataTexture(data,width,height,T.RGBAFormat);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=T.RepeatWrapping;texture.generateMipmaps=true;texture.minFilter=T.LinearMipmapLinearFilter;texture.needsUpdate=true;
   const m=mat('#ffffff',{map:texture,roughness:.78});m.addEventListener('dispose',()=>texture.dispose());return m;
  });
  const shellGeo=shared('turtle continuous carapace',()=>geometry(new T.SphereGeometry(1,40,24)));
  make(shellGeo,shellMaterial,0,.09,0,.535,.255,.705,g).name='Continuous patterned carapace';
  for(const sign of [-1,1]){
   for(const front of [true,false]){
    const pivot=new T.Group();pivot.position.set(sign*.40,-.07,front?.34:-.40);g.add(pivot);
    const flipper=fin([[0,.12],[sign*.27,.18],[sign*(front?.77:.40),front?-.04:-.20],[sign*(front?.62:.34),-.19],[sign*.12,-.15]],pivot,'flipper'+sign+front);flipper.rotation.x=Math.PI/2;moving.push(pivot);
   }
  }eyes(.135,.075,.94,.025);body(0,-.06,-.76,.07,.05,.19);
 }else if(kind==='Manta ray'){
  body(0,0,0,.44,.15,.66);
  for(const sign of [-1,1]){
   const pivot=new T.Group();g.add(pivot);
   const wing=fin([[0,.57],[sign*.54,.47],[sign*1.62,-.16],[sign*1.45,-.33],[sign*.61,-.49],[0,-.62]],pivot,'wing'+sign);wing.rotation.x=Math.PI/2;moving.push(pivot);
   const horn=body(sign*.17,-.01,.69,.085,.075,.30);horn.rotation.y=-sign*.15;
  }eyes(.31,.075,.41,.025);
  const tail=shared('manta tail',()=>geometry(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(0,0,-.55),new T.Vector3(.04,-.02,-1.1),new T.Vector3(.10,0,-1.95)]),14,.018,6,false)));
  make(tail,material('manta tail material','#364744'),0,0,0,1,1,1,g);
 }else{
  body(0,0,0,.12,.22,.39);
  const tail=new T.Group();tail.position.z=-.36;g.add(tail);const f=fin([[0,0],[-.19,.22],[-.22,-.22]],tail,'tail');f.rotation.y=Math.PI/2;moving.push(tail);
  eyes(.106,.055,.24,.018);
 }
 g.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;}});
 return {g,moving};
}

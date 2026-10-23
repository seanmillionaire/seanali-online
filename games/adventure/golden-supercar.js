// Low, angular Lamborghini-inspired body, shared by every estate and the saved car.
export function createGoldenSupercar({T,scene,make,mat,geometry,box,ball,cylinder,model='lamborghini'}){
 const ferrari=model==='ferrari',root=new T.Group();root.name=ferrari?'Angelique’s purple Ferrari':'Angelique’s yellow Lamborghini';scene.add(root);
 const gold=mat(ferrari?'#bc36ff':'#ffd12e',{metalness:.45,roughness:.22,emissive:ferrari?'#68149b':'#765408',emissiveIntensity:.12}),edge=mat(ferrari?'#64219a':'#bc891c',{metalness:.74,roughness:.27}),carbon=mat('#192128',{roughness:.4}),glass=mat('#253f51',{metalness:.35,roughness:.13,transparent:true,opacity:.72,depthWrite:false}),chrome=mat('#e6edf4',{metalness:.60,roughness:.15}),rubber=mat('#171b21',{roughness:.95}),red=mat('#e83143',{emissive:'#d81822',emissiveIntensity:.75}),white=mat('#e9faff',{emissive:'#c9edff',emissiveIntensity:1.4});
 const p=(g,m,x,y,z,a,b,c,parent=root)=>make(g,m,x,y,z,a,b,c,parent),b=(m,x,y,z,a,h,c,parent=root)=>p(box,m,x,y,z,a,h,c,parent);
 function wedge(m,zs,widths,ys){const v=[],indices=[];for(let i=0;i<zs.length;i++)v.push(-widths[i],ys[i][0],zs[i],widths[i],ys[i][0],zs[i],-widths[i],ys[i][1],zs[i],widths[i],ys[i][1],zs[i]);for(let i=0;i<zs.length-1;i++){const a=i*4,n=a+4;indices.push(a,n,a+1,a+1,n,n+1,a+2,a+3,n+2,a+3,n+3,n+2,a,a+2,n,a+2,n+2,n,a+1,n+1,a+3,a+3,n+1,n+3);}indices.push(0,1,2,1,3,2);const n=(zs.length-1)*4;indices.push(n,n+2,n+1,n+1,n+2,n+3);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];g.setIndex(indices);g.computeVertexNormals();return p(geometry(g),m,0,0,0,1,1,1);}
 if(ferrari)wedge(gold,[-2.18,-1.9,-1.25,-.5,.35,1.2,1.85,2.22],[.75,1.02,1.14,1.12,1.10,1.03,.90,.68],[[-.24,.25],[-.30,.45],[-.31,.53],[-.30,.49],[-.30,.39],[-.28,.23],[-.23,.12],[-.15,.03]]);
 else wedge(gold,[-2.18,-1.65,.25,1.4,2.27],[.88,1.16,1.14,1.02,.83],[[-.30,.28],[-.31,.51],[-.30,.49],[-.31,.26],[-.23,.06]]);
 if(ferrari)wedge(glass,[-1.18,-.85,-.35,.12,.65],[.72,.77,.76,.73,.70],[[.46,.58],[.46,.93],[.45,1.04],[.40,.98],[.34,.40]]);
 else wedge(glass,[-1.12,-.69,.12,.85],[.83,.78,.75,.79],[[.46,.61],[.46,1.03],[.45,1.01],[.35,.45]]);
 b(gold,0,1.035,-.31,1.56,.065,.85);b(carbon,0,-.30,1.99,1.95,.09,.57);b(carbon,0,-.29,-1.92,2.08,.12,.62);
 for(const x of [-1,1]){
  b(edge,x*1.12,-.13,-.1,.12,.18,2.72);const intake=b(carbon,x*1.128,.29,-.65,.045,.30,.68);intake.rotation.x=-.18;
  b(gold,x*1.19,.62,.52,.24,.10,.30);b(glass,x*1.32,.63,.52,.025,.07,.22);
  b(edge,x*1.12,.17,.10,.018,.025,1.06);b(carbon,x*.63,-.06,2.14,.43,.15,.05);
  // Y-shaped headlight signatures and slim triple rear lamps.
  if(ferrari){const lamp=b(white,x*.73,.20,1.82,.055,.035,.43);lamp.rotation.y=x*.25;}else {b(white,x*.69,.14,1.94,.31,.035,.04);for(const slope of [-1,1]){const l=b(white,x*.69+slope*.085,.19,1.94,.035,.13,.035);l.rotation.z=slope*.65;}}
  if(ferrari){for(const offset of [.52,.80]){const lamp=p(cylinder,red,x*offset,.29,-2.12,.10,.035,.10);lamp.rotation.x=Math.PI/2;}}else for(let i=0;i<3;i++)b(red,x*(.53+i*.12),.29,-2.13,.07,.06,.035);
  if(!ferrari)b(carbon,x*.7,.61,-1.88,.08,.35,.12);
 }
 if(ferrari){b(edge,0,.45,-1.96,1.68,.06,.17);for(let i=0;i<3;i++)b(carbon,0,-.04-i*.055,2.15,1.15,.025,.04);}else{b(carbon,0,.83,-1.93,2.25,.08,.38);b(gold,0,.87,-1.93,2.18,.025,.34);}
 for(let i=0;i<6;i++)b(carbon,0,.52,-1.19-i*.095,1.31,.035,.046);
 for(const x of [-.65,-.32,0,.32,.65])b(carbon,x,-.28,-2.18,.045,.25,.28);
 b(chrome,0,-.02,-2.20,.57,.13,.03);b(edge,0,.29,1.70,.10,.025,.13);
 // Flush door cuts, glazing frames and layered intake vanes keep the silhouette crisp.
 for(const side of [-1,1]){
  b(carbon,side*1.146,.40,.15,.018,.022,1.18);b(chrome,side*1.15,.38,.08,.025,.035,.20);
  for(let i=0;i<4;i++)b(edge,side*1.16,.19+i*.055,-.65,.035,.018,.59);
  const pillar=b(carbon,side*.78,.75,.48,.035,.62,.045);pillar.rotation.x=-.82;
  b(carbon,side*.79,.76,-.88,.035,.50,.045);
 }
 const badge=new T.Shape();badge.moveTo(-.105,.10);badge.lineTo(.105,.10);badge.lineTo(.083,-.04);badge.lineTo(0,-.13);badge.lineTo(-.083,-.04);badge.closePath();
 const emblem=p(geometry(new T.ShapeGeometry(badge)),carbon,0,.33,1.63,1,1,1);emblem.rotation.x=-Math.PI/2;emblem.name=ferrari?'Black shield with white horse emblem':'Black shield with white bull emblem';
 // White horns and angular bull silhouette, readable without a downloaded logo.
 const ivory=mat('#ffffff',{roughness:.25,metalness:.25});
 if(ferrari){const body=b(ivory,0,.34,1.63,.028,.008,.095);body.rotation.y=-.4;b(ivory,.028,.34,1.58,.035,.008,.035);for(const x of [-1,1]){const leg=b(ivory,x*.025,.34,1.68,.018,.008,.065);leg.rotation.y=x*.6;}}else {b(ivory,0,.337,1.63,.10,.008,.045);for(const side of [-1,1]){b(ivory,side*.043,.34,1.60,.018,.009,.07);const horn=b(ivory,side*.068,.34,1.57,.045,.009,.012);horn.rotation.y=side*.6;}}
 const neon=mat('#b453ff',{emissive:'#a12cff',emissiveIntensity:6,roughness:.25});
 for(const side of [-1,1])b(neon,side*1.10,-.265,-.03,.035,.035,2.32);
 // A single soft radial texture gives underglow without adding dynamic lights.
 const n=32,data=new Uint8Array(n*n*4);for(let y=0;y<n;y++)for(let x=0;x<n;x++){const i=(y*n+x)*4,r=Math.hypot((x-15.5)/15.5,(y-15.5)/15.5);data[i]=160;data[i+1]=48;data[i+2]=255;data[i+3]=Math.pow(Math.max(0,1-r),1.3)*230;}
 const glowTexture=new T.DataTexture(data,n,n,T.RGBAFormat);glowTexture.needsUpdate=true;glowTexture.colorSpace=T.SRGBColorSpace;
 const glowMaterial=new T.MeshBasicMaterial({map:glowTexture,toneMapped:false,fog:false,transparent:true,depthWrite:false,blending:T.AdditiveBlending,side:T.DoubleSide});glowMaterial.addEventListener('dispose',()=>glowTexture.dispose());
 const underglow=p(geometry(new T.PlaneGeometry(1,1)),glowMaterial,0,-.64,0,6.8,8,1);underglow.rotation.x=-Math.PI/2;underglow.name='Violet neon underglow';
 const diamond=mat('#f4faff',{metalness:.85,roughness:.07,emissive:'#b8dfff',emissiveIntensity:.5}),brake=mat('#b12140',{metalness:.35,roughness:.43});
 const tireGeo=geometry(new T.CylinderGeometry(1,1,1,32)),shoulderGeo=geometry(new T.TorusGeometry(.39,.10,8,32));
 if(ferrari){const arch=geometry(new T.TorusGeometry(.53,.075,6,24,Math.PI));for(const side of [-1,1])for(const z of [-1.35,1.4]){const fender=p(arch,gold,side*1.20,-.20,z,1,1,1);fender.rotation.y=Math.PI/2;}}
 const glints=[],wheels=[];for(const side of [-1,1])for(const z of [-1.35,1.40]){
  const rig=new T.Group();rig.position.set(side*1.10,-.20,z);root.add(rig);wheels.push(rig);
  const tire=p(tireGeo,rubber,0,0,0,.49,.29,.49,rig);tire.rotation.z=Math.PI/2;for(const offset of [-.10,.10]){const shoulder=p(shoulderGeo,rubber,offset,0,0,1,1,1,rig);shoulder.rotation.y=Math.PI/2;}
  for(const [m,r,offset]of [[chrome,.405,.165],[carbon,.353,.19]]){const rim=p(cylinder,m,side*offset,0,0,r,.04,r,rig);rim.rotation.z=Math.PI/2;}
  const disc=p(cylinder,chrome,side*.20,0,0,.29,.025,.29,rig);disc.rotation.z=Math.PI/2;b(brake,side*.24,.05,-.23,.045,.20,.09,rig);
  for(let i=0;i<10;i++){const a=i*Math.PI/5,spoke=b(chrome,side*.223,Math.cos(a)*.20,Math.sin(a)*.20,.035,ferrari?.35:.31,ferrari?.025:.04,rig);spoke.rotation.x=-a+(ferrari?(i%2?.10:-.10):0);}
  const gems=new T.InstancedMesh(geometry(new T.OctahedronGeometry(.025,0)),diamond,20),matrix=new T.Matrix4();for(let i=0;i<20;i++){const a=i*Math.PI/10;matrix.makeTranslation(side*.246,Math.cos(a)*.367,Math.sin(a)*.367);gems.setMatrixAt(i,matrix);}gems.name='Diamond-cut rim highlights';rig.add(gems);
  for(let j=0;j<2;j++){const glint=b(white,side*.28,.25*(j?1:-1),.22*(j?1:-1),.012,.12,.012,rig);glint.name='Diamond rim glint';glints.push(glint);}
  for(let i=0;i<12;i++){const a=i*Math.PI/6;const tread=b(carbon,0,Math.cos(a)*.482,Math.sin(a)*.482,.29,.014,.065,rig);tread.rotation.x=-a;}
  const hub=p(cylinder,gold,side*.25,0,0,.085,.06,.085,rig);hub.rotation.z=Math.PI/2;
 }
 const flameMat=mat('#ff7018',{emissive:'#ff4e08',emissiveIntensity:2.8,transparent:true,opacity:.88,depthWrite:false}),coreMat=mat('#fff2a0',{emissive:'#ffdc7b',emissiveIntensity:3,transparent:true,opacity:.94,depthWrite:false}),cone=geometry(new T.ConeGeometry(1,1,10)),flames=[];
 for(const x of [-.42,.42]){const exhaust=p(cylinder,chrome,x,-.12,-2.22,.115,.23,.115);exhaust.rotation.x=Math.PI/2;const hole=p(cylinder,carbon,x,-.12,-2.35,.089,.025,.089);hole.rotation.x=Math.PI/2;const f=new T.Group();f.name='Rear exhaust flame';f.position.set(x,-.12,-2.36);root.add(f);const outer=p(cone,flameMat,0,0,-.5,.16,1,.16,f);outer.rotation.x=-Math.PI/2;const core=p(cone,coreMat,0,0,-.23,.085,.46,.085,f);core.rotation.x=-Math.PI/2;f.visible=false;flames.push(f);}
 let time=0;
 return {root,paint:gold,wheels,flames,dispose(){glowMaterial.dispose();root.traverse(o=>{if(o.isInstancedMesh)o.dispose();});},update(speed=0,dt=0){if(dt>0)time+=dt;const power=Math.min(1,Math.abs(speed)/52);glints.forEach((g,i)=>{const pulse=.3+Math.pow(Math.max(0,Math.sin(time*2.7+i*1.9)),10)*1.7;g.scale.y=.12*pulse;g.scale.z=.012*pulse;});for(const w of wheels)if(dt>0)w.rotation.x+=speed*dt/.49;for(let i=0;i<flames.length;i++){const f=flames[i];f.visible=Math.abs(speed)>3;f.scale.set(.7+power*.5,.7+power*.5,(.3+power*1.4)*(1+.15*Math.sin(time*39+i*2)));}}};
}


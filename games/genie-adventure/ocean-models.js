// Smooth silhouettes, countershading and articulated fins; no downloaded models or extra textures.
export function oceanModel(T,{geometry,mat,make,ball},kind){
 const g=new T.Group(),moving=[],skin=mat(kind==='Sea turtle'?'#526944':kind==='Manta ray'?'#364c58':kind==='Reef fish'?'#d6ae43':'#617e89',{roughness:.4}),underside=mat('#cbd5cb',{roughness:.55}),eye=mat('#102026',{roughness:.2});
 const smooth=geometry(new T.SphereGeometry(1,20,12));
 function fin(points,parent=g,material=skin){const shape=new T.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const geo=geometry(new T.ExtrudeGeometry(shape,{depth:.025,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.025,bevelThickness:.015}));return make(geo,material,0,0,0,1,1,1,parent);}
 if(kind==='Reef shark'||kind==='Dolphin'){
  const profile=[[-1.45,.035],[-1.1,.1],[-.7,.24],[-.2,.36],[.35,.34],[.8,.24],[1.08,.12],[1.25,.015]].map(([z,r])=>new T.Vector2(r,z));const body=make(geometry(new T.LatheGeometry(profile,24)),skin,0,0,0);g.add(body);body.rotation.x=Math.PI/2;
  make(smooth,underside,0,-.18,.1,.27,.1,.91,g);
  const dorsal=fin([[-.35,0],[.12,.7],[.23,.17],[.5,0]]);dorsal.rotation.y=Math.PI/2;dorsal.position.set(0,.22,-.25);
  for(const side of [-1,1]){const p=fin([[0,0],[side*.88,-.44],[side*.58,-.1],[0,.23]]);p.rotation.x=Math.PI/2;p.position.set(side*.2,-.12,.15);for(let n=0;n<(kind==='Reef shark'?4:0);n++){const slit=make(smooth,eye,side*.31,-.015,.15+n*.09,.008,.1,.012,g);slit.rotation.z=side*.2;}make(smooth,eye,side*.19,.055,.87,.038,.035,.025,g);}
  const tail=new T.Group();g.add(tail);tail.position.z=-1.33;const fluke=fin([[0,0],[-.24,.73],[.04,.5],[.16,.12],[.12,-.16],[-.2,-.48],[.1,-.35],[.27,0]],tail);fluke.rotation.y=Math.PI/2;if(kind==='Dolphin'){tail.rotation.z=Math.PI/2;make(smooth,skin,0,-.025,1.15,.13,.1,.38,g);}moving.push(tail);
 }else if(kind==='Manta ray'){
  make(smooth,skin,0,0,0,.5,.14,.7,g);make(smooth,underside,0,-.09,0,.45,.06,.65,g);
  for(const side of [-1,1]){const pivot=new T.Group();g.add(pivot);const wing=fin([[0,.55],[side*.65,.45],[side*1.65,-.35],[side*.65,-.45],[0,-.65]],pivot);wing.rotation.x=Math.PI/2;moving.push(pivot);make(smooth,skin,side*.2,0,.75,.09,.07,.35,g);make(smooth,eye,side*.35,.1,.35,.03,.03,.03,g);}
  const curve=new T.CatmullRomCurve3([new T.Vector3(0,0,-.5),new T.Vector3(.06,-.02,-1.3),new T.Vector3(.15,0,-2)]);make(geometry(new T.TubeGeometry(curve,12,.022,5,false)),skin,0,0,0,1,1,1,g);
 }else if(kind==='Sea turtle'){
  make(smooth,skin,0,0,0,.55,.25,.74,g);make(smooth,underside,0,-.16,0,.49,.08,.65,g);make(smooth,skin,0,.02,.82,.17,.13,.27,g);
  const scute=mat('#344933');for(let i=0;i<7;i++){const a=i*Math.PI/3;make(smooth,scute,i?Math.sin(a)*.3:0,.225-(i?.025:0),i?Math.cos(a)*.42:0,.15,.025,.19,g);}
  for(const side of [-1,1]){for(const end of [-1,1]){const f=make(smooth,skin,side*.54,-.07,end*.32,end>0?.5:.28,.035,.16,g);f.rotation.y=side*end*.55;moving.push(f);}make(smooth,eye,side*.115,.08,.94,.026,.026,.026,g);}
 }else{
  make(smooth,skin,0,0,0,.13,.22,.42,g);const tail=fin([[0,.2],[0,-.2],[-.3,0]]);tail.rotation.y=Math.PI/2;tail.position.z=-.37;moving.push(tail);for(const side of [-1,1]){make(smooth,eye,side*.11,.06,.23,.025,.025,.025,g);for(let j=0;j<3;j++)make(smooth,underside,side*.12,0,-.15+j*.14,.012,.18,.025,g);}
 }
 return {g,moving};
}

// Detailed static fittings are instanced by geometry/material per vessel.
export function shipDetails({T,geometry,mat,box,cylinder,ball},g,kind,len,w){
 const enamel=mat('#eeeae0',{roughness:.32}),steel=mat('#a6b8bd',{metalness:.7,roughness:.3}),glass=mat('#183b4e',{metalness:.35,roughness:.18}),teak=mat('#ae8356'),dark=mat('#26343c'),orange=mat('#d77136'),pipe=mat('#c4bd82'),foam=mat('#f4f6f0');
 const meshes=[];
 function part(geo,m,x,y,z,sx,sy,sz){const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);meshes.push(o);return o;}
 function rod(a,b,r=.035,m=steel){const va=new T.Vector3(...a),vb=new T.Vector3(...b),d=vb.clone().sub(va),p=va.add(vb).multiplyScalar(.5),o=part(cylinder,m,p.x,p.y,p.z,r,d.length(),r);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o;}
 function rail(points,y,h=.75){for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/1.25);for(let k=0;k<n;k++){const t=k/n,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;rod([x,y,z],[x,y+h,z],.028);}for(const dy of [h*.46,h])rod([a[0],y+dy,a[1]],[b[0],y+dy,b[1]],.025);}}
 // Narrow stern, parallel midbody and a pointed, rounded bow.
 const perimeter=[[-w*.41,-len*.48],[w*.41,-len*.48],[w*.47,-len*.35],[w*.47,len*.25],[w*.35,len*.39],[0,len*.48],[-w*.35,len*.39],[-w*.47,len*.25],[-w*.47,-len*.35],[-w*.41,-len*.48]];
 rail(perimeter,1.92,kind==='tanker'?.85:.66);
 for(const side of [-1,1]){
  for(const z of [-len*.40,len*.30]){part(cylinder,dark,side*w*.32,2,z,.14,.25,.14);rod([side*w*.32-.2,2.15,z],[side*w*.32+.2,2.15,z],.075,dark);}
  // Circular hull ports and a continuous dark boot stripe.
  for(let z=-len*.3;z<len*.25;z+=kind==='tanker'?3:1.25){const o=part(cylinder,glass,side*(w*.5+.015),1.05,z,.14,.035,.14);o.rotation.z=Math.PI/2;}
  part(box,dark,side*(w*.5-.01),.35,-len*.04,.045,.16,len*.58);
 }
 if(kind==='tanker'){
  // Rounded tank weather covers, service catwalks, ladders and manifolds.
  for(const z of [-10,-1,8]){
   part(cylinder,steel,0,6.98,z,.7,.12,.7);part(cylinder,dark,0,7.08,z,.32,.12,.32);
   for(const side of [-1,1]){rod([side*2.5,2.05,z],[side*2.5,6.25,z],.055);for(let y=2.3;y<6.2;y+=.34)rod([side*2.5-.25,y,z],[side*2.5+.25,y,z],.025);}
   for(const x of [-.8,.8]){rod([x,2.15,z-2.9],[x,2.15,z+2.9],.13,pipe);rod([x,2.15,z],[x,2.8,z],.13,pipe);part(cylinder,orange,x,2.9,z,.26,.07,.26);}
  }
  for(const x of [-3.25,3.25]){part(box,steel,x,2.12,-1,.55,.09,30);rail([[x,-14],[x,14]],2.18,.65);}
  // Individual bridge panes with mullions, bridge wings and aft lifeboats.
  for(const side of [-1,1]){
   for(let z=-19;z<=-15;z+=.8)for(let y=3.2;y<=6;y+=1.1)part(box,glass,side*3.025,y,z,.05,.5,.53);
   part(box,enamel,side*3.25,6.03,-15.2,1.3,.18,2);rail([[side*3.7,-16.1],[side*3.7,-14.3]],6.13,.65);
   const rescue=part(ball,orange,side*3.5,3.25,-19,.48,.48,1.65);rescue.name='Covered rescue boat';
   rod([side*2.8,2,-19.8],[side*2.8,4,-19.8],.07);rod([side*2.8,4,-19.8],[side*3.6,4,-19.8],.07);
  }
  for(let x=-2.4;x<=2.4;x+=.8)part(box,glass,x,6.2,-13.88,.58,.63,.05);
  rail([[-2.85,-19.8],[2.85,-19.8],[2.85,-14.2],[-2.85,-14.2],[-2.85,-19.8]],7,.65);
  for(let x=-1.5;x<=1.5;x+=1.5){part(cylinder,enamel,x,7.2,-15.5,.3,.5,.3);part(ball,enamel,x,7.6,-15.5,.4,.4,.4);}
  rod([0,7,-16],[0,10,-16],.07);rod([-1.5,9.2,-16],[1.5,9.2,-16],.045);part(box,enamel,0,9.5,-16,2.5,.18,.22);
  for(let z=15;z<19;z+=2){part(cylinder,steel,0,2.2,z,.6,.45,.6);rod([-1,2.3,z],[1,2.3,z],.17,dark);}
 }else{
  // Teak planking and an open aft lounge; upper decks have continuous rails.
  for(let x=-w*.37;x<w*.4;x+=.22)part(box,teak,x,1.86,-7,.025,.018,3.5);
  for(const x of [-1.3,1.3]){part(box,enamel,x,2.15,-7.5,.85,.5,1.6);part(box,foam,x,2.45,-7.5,.8,.16,1.45);const back=part(box,foam,x,2.73,-8.1,.8,.55,.16);back.rotation.x=-.22;}
  part(cylinder,teak,0,2.4,-7.3,.55,.1,.55);part(cylinder,steel,0,2.1,-7.3,.07,.6,.07);
  for(let deck=0;deck<3;deck++){
   const ww=w-deck*.8,zz=-deck,dl=12-deck*2,y=2.4+deck;
   rail([[-ww*.48,zz-dl*.47],[ww*.48,zz-dl*.47],[ww*.48,zz+dl*.32]],y+.55,.65);
   rail([[-ww*.48,zz-dl*.47],[-ww*.48,zz+dl*.32]],y+.55,.65);
   for(const side of [-1,1])for(let z=zz-dl*.35;z<zz+dl*.28;z+=.85)part(box,enamel,side*(ww/2+.025),y+.12,z,.055,.58,.055);
  }
  // Bow sun pads, swim platform, aft boarding ladder, navigation lights.
  for(const x of [-.65,.65]){part(box,teak,x,2.02,6.3,1.15,.18,2);part(box,foam,x,2.2,6.3,1.07,.22,1.9);part(box,foam,x,2.4,5.65,1.07,.25,.45);}
  part(box,teak,0,.7,-len*.49,w*.7,.15,.6);
  for(const x of [-.35,.35])rod([x,.6,-len*.5],[x,-.15,-len*.5],.035);for(const y of [0,.25,.5])rod([-.35,y,-len*.5],[.35,y,-len*.5],.035);
  for(const side of [-1,1]){part(ball,enamel,side*.85,5.8,-3,.42,.42,.42);part(ball,mat(side<0?'#c9483c':'#459772'),side*2.15,3.3,2,.09,.09,.09);}
  rod([0,5.4,-2],[0,6.9,-2],.055);part(box,enamel,0,6.65,-2,1.5,.12,.22);
 }
 // Instance fittings so added detail does not add a draw call per railing post.
 const batches=new Map();for(const m of meshes){const key=m.geometry.uuid+':'+m.material.uuid;if(!batches.has(key))batches.set(key,[]);batches.get(key).push(m);}
 for(const list of batches.values()){const batch=new T.InstancedMesh(list[0].geometry,list[0].material,list.length);batch.name='Instanced deck fittings';list.forEach((m,i)=>{m.updateMatrix();batch.setMatrixAt(i,m.matrix);});batch.castShadow=true;batch.receiveShadow=true;g.add(batch);}
}

export function shipWake({T,geometry},g,len,w,kind){
 const length=kind==='tanker'?42:32,geo=geometry(new T.PlaneGeometry(w*3.8,length));geo.rotateX(-Math.PI/2);geo.translate(0,.13,-len/2-length/2+1);
 const material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{time:{value:0},strength:{value:1}},vertexShader:`varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`varying vec2 v;uniform float time;uniform float strength;void main(){float aft=v.y;float x=abs(v.x-.5)*2.;float spread=.19+aft*.7;float edge=exp(-pow((x-spread)*30.,2.));float wash=exp(-x*x/(.018+aft*.09));float churn=.55+.25*sin(v.y*86.-time*7.+sin(v.x*49.)*2.)+.2*sin(v.x*110.+v.y*63.+time*4.);float fade=pow(1.-aft,1.1)*smoothstep(0.,.055,aft);float a=clamp((edge*.7+wash*.8)*churn*fade*strength,0.,.7);gl_FragColor=vec4(.83,.96,.94,a);}`});
 const wake=new T.Mesh(geo,material);wake.name='Animated propeller wash and spreading foam';wake.renderOrder=3;g.add(wake);return material;
}


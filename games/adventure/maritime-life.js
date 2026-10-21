import {marineWater,worldIslands,isletHeight} from './explore-state.js?v=213';
import {WORLD_BOUNDS} from './geography.js?v=213';
// Full-length footprints are checked before accepting a fishing circuit.
export function fishingHullClear(x,z,heading){
 if(Math.hypot(x/(WORLD_BOUNDS.x-5),z/(WORLD_BOUNDS.z-5))>=1)return false;
 return [-3,0,3].every(f=>[-.9,0,.9].every(s=>marineWater(x+Math.sin(heading)*f+Math.cos(heading)*s,z+Math.cos(heading)*f-Math.sin(heading)*s)));
}
export function fishingPose(route,t){const a=t/route.rx;return {x:route.x+Math.cos(a)*route.rx,z:route.z+Math.sin(a)*route.rz,heading:Math.atan2(-Math.sin(a)*route.rx,Math.cos(a)*route.rz)};}
let routes;
export function fishingRoutes(){
 if(routes)return routes;
 const anchors=[{x:0,z:75},{x:-100,z:60},{x:210,z:90},{x:390,z:130},...worldIslands.filter(p=>!['pizzaCity','colon','sunset','monkeyIslet'].includes(p.id)).map(p=>({x:p.x,z:p.z+(p.rz||10)+17}))];
 routes=[];
 for(const [i,p]of anchors.entries()){
  if(routes.length>=30)break;
  for(let j=0;j<8;j++){
   const a=j*2.4,r={x:p.x+Math.sin(a)*j*9,z:p.z+Math.cos(a)*j*9,rx:12+(i%3)*4,rz:7+(i%4)*2};
   if(routes.some(q=>Math.hypot(q.x-r.x,q.z-r.z)<q.rx+r.rx+8))continue;
   if(Array.from({length:128},(_,k)=>fishingPose(r,k/128*Math.PI*2*r.rx)).every(q=>fishingHullClear(q.x,q.z,q.heading))){routes.push({...r,kind:['panga','cayuco','cabin'][i%3],phase:i*2.4});break;}
  }
 }
 return routes;
}
export function createMaritimeLife({T,scene,make,mat,geometry,box,ball,cylinder}){
 const root=new T.Group();root.name='Panama coastal fishing fleet';scene.add(root);
 const white=mat('#e9e6d3'),wood=mat('#8a5737',{side:T.DoubleSide}),dark=mat('#263c41'),glass=mat('#456875'),steel=mat('#8c9590'),net=mat('#b7a789'),colors=['#318994','#ba6447','#e8c368'].map(c=>mat(c,{side:T.DoubleSide}));
 // Tapered open hull with raised gunwales and a distinct bow.
 const hull=geometry(new T.BufferGeometry()),pos=[],idx=[];
 for(const [z,w,y]of [[-1,.74,.25],[-.6,1,.27],[.35,.95,.30],[.85,.47,.43],[1.15,.02,.52]])for(const [x,h]of [[-w,y],[-w*.65,-.22],[w*.65,-.22],[w,y]])pos.push(x,h,z);
 for(let i=0;i<4;i++)for(let j=0;j<3;j++){const n=i*4+j;idx.push(n,n+4,n+1,n+1,n+4,n+5);}idx.push(0,1,2,0,2,3);hull.setAttribute('position',new T.Float32BufferAttribute(pos,3));hull.setIndex(idx);hull.computeVertexNormals();
 const vessels=fishingRoutes().map((r,i)=>{
  const g=new T.Group();g.name='Fishing '+r.kind+' '+(i+1);root.add(g);const canoe=r.kind==='cayuco',cabin=r.kind==='cabin',w=canoe?.48:cabin?.95:.8,l=canoe?2.6:cabin?2.7:2.2;
  const piece=(geo,m,x,y,z,sx,sy,sz)=>make(geo,m,x,y,z,sx,sy,sz,g);
  piece(hull,canoe?wood:colors[i%3],0,.18,0,w,1,l);
  piece(box,canoe?wood:white,0,.12,-.1,w*1.35,.12,l*1.4);
  for(const z of [-1.1,.1,1.1])piece(box,wood,0,.5,z,w*1.65,.12,.35);
  if(!canoe){piece(box,dark,0,.36,-l-.12,.44,.65,.45);piece(cylinder,steel,0,-.12,-l-.12,.065,.65,.065);}
  else{const paddle=piece(box,wood,w+.15,.4,0,.10,.07,3.8);paddle.rotation.y=.22;piece(box,wood,w+.52,.4,1.7,.3,.06,.65);}
  if(cabin){piece(box,white,0,1.12,.4,1.4,1.2,1.8);piece(box,glass,0,1.38,1.31,1.15,.43,.04);piece(box,white,0,1.8,.4,1.65,.12,2.1);piece(cylinder,steel,.6,2.3,.1,.025,1,.025);}
  else if(!canoe){for(const side of [-1,1])for(const z of [-.7,.8])piece(cylinder,steel,side*.65,1.12,z,.025,1.2,.025);piece(box,colors[(i+1)%3],0,1.74,.05,1.5,.08,1.9);}
  piece(box,white,-w*.35,.43,-.7,.55,.45,.7);piece(ball,net,w*.4,.42,-1.35,.32,.2,.4);
  // Seated fisher, brimmed sunhat and rod; no invented ceremonial clothing.
  piece(ball,colors[(i+1)%3],0,.85,-.45,.23,.33,.18);piece(ball,wood,0,1.28,-.43,.16,.20,.16);piece(cylinder,net,0,1.48,-.43,.29,.045,.29);
  const rod=piece(cylinder,dark,w*.45,1.2,-.45,.018,2.8,.018);rod.rotation.z=-.6;
  const wake=piece(box,white,0,-.03,-l-1.3,w*.8,.025,2);wake.material=mat('#c7e8df',{transparent:true,opacity:.35,depthWrite:false});wake.castShadow=false;
  return {g,r,d:r.phase*r.rx,t:i*7,wake};
 });
 function update(dt,active,{x=0,z=0,indoors=false}={}){
  root.visible=!indoors;
  for(const b of vessels){if(active){b.t+=dt;const fishing=b.t%100>65;if(!fishing)b.d+=dt*(b.r.kind==='cayuco'?1.1:2.3);b.wake.visible=!fishing;}const p=fishingPose(b.r,b.d);b.g.position.set(p.x,.06+Math.sin(b.t*1.4+b.r.phase)*.045,p.z);b.g.rotation.set(Math.sin(b.t*.8)*.018,p.heading,Math.sin(b.t*.9+b.r.phase)*.025);b.g.visible=Math.hypot(x-p.x,z-p.z)<180;}
 }
 function blocks(x,z){return vessels.some(b=>{const dx=x-b.g.position.x,dz=z-b.g.position.z,a=b.g.rotation.y;return Math.abs(dx*Math.cos(a)-dz*Math.sin(a))<2&&Math.abs(dx*Math.sin(a)+dz*Math.cos(a))<4;});}
 update(0,false);return {root,vessels,blocks,update,dispose(){scene.remove(root);}};
}

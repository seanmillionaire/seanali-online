import {AMADOR_MARINA_ROUTES} from './amador-marina-routes.js';
import {AMADOR_BERTHS,marinaPath,marinaPose,marinaLength} from './amador-marina.js';
import {sanBlasWaters} from './costa-arriba-layout.js';
import {shipDetails,shipWake} from './ship-details.js';
import {marineWater} from './explore-state.js';
import {WORLD_BOUNDS} from './geography.js';
export function shippingPose(r,distance){const a=distance/r.rx;return {x:r.x+Math.cos(a)*r.rx,z:r.z+Math.sin(a)*r.rz,heading:Math.atan2(-Math.sin(a)*r.rx,Math.cos(a)*r.rz)};}
export function shippingClear(x,z,heading,length,width){if(sanBlasWaters(x,z,Math.hypot(length,width)/2))return false;return [-length/2,0,length/2].every(f=>[-width/2,0,width/2].every(s=>{const px=x+Math.sin(heading)*f+Math.cos(heading)*s,pz=z+Math.cos(heading)*f-Math.sin(heading)*s;return Math.hypot(px/(WORLD_BOUNDS.x-8),pz/(WORLD_BOUNDS.z-8))<1&&marineWater(px,pz);}));}
let cached;
export function shippingRoutes(){
 if(cached)return cached;const result=[];
 for(const [i,[x,z]]of [[150,290],[420,340],[-320,170],[-210,-440],[430,-420],[680,40],[-580,-50],[80,440]].entries()){
  const kind=i%2?'yacht':'tanker',length=kind==='tanker'?44:19,width=kind==='tanker'?8:5;
  for(let k=0;k<16;k++){const a=k*2.4,r={x:x+Math.cos(a)*k*5,z:z+Math.sin(a)*k*5,rx:55,rz:32,kind,length,width};
   if(result.some(q=>Math.hypot(q.x-r.x,q.z-r.z)<150))continue;
   if(Array.from({length:360},(_,j)=>shippingPose(r,j/360*Math.PI*2*r.rx)).every(p=>shippingClear(p.x,p.z,p.heading,length,width))){result.push(r);break;}
  }
 }
 return cached=result;
}
export function yachtMarinaRoute(r,index){
 const origins=shippingRoutes().filter(q=>q.kind==='yacht').map((q,i)=>shippingPose(q,i===0?Math.PI*.5*q.rx:0));
 const berth=AMADOR_BERTHS[index],clear=(x,z,h,l,w)=>shippingClear(x,z,h,l,w)&&origins.every((p,i)=>i===index||Math.hypot(p.x-x,p.z-z)>32);
 const path=marinaPath(origins[index],{x:550,z:berth.z},clear);path.push(berth);return path;
}
export function createOceanShipping({T,scene,make,mat,geometry,ball,box,cylinder,waterMaterial}){
 const root=new T.Group();root.name='Open ocean · tankers and luxury yachts';scene.add(root);
 const navy=mat('#243f4c'),red=mat('#8e4539'),white=mat('#ecebe0'),glass=mat('#254c5b'),steel=mat('#9ca7a9'),wood=mat('#bfa47c'),yellow=mat('#cbb06b');
 const smoothBall=geometry(new T.SphereGeometry(1,24,16)),smoothCylinder=geometry(new T.CylinderGeometry(1,1,1,32));
 let yachtIndex=0;
 const ships=shippingRoutes().map((r,i)=>{
  const g=new T.Group();g.name=(r.kind==='tanker'?'LNG gas tanker':'Luxury motor yacht')+' '+(i+1);root.add(g);
  const p=(geo,m,x,y,z,w,h,d)=>make(geo,m,x,y,z,w,h,d,g),len=r.length,w=r.width;
  const outline=new T.Shape();outline.moveTo(-w*.43,-len/2);outline.lineTo(w*.43,-len/2);outline.lineTo(w/2,-len*.35);outline.lineTo(w/2,len*.26);outline.quadraticCurveTo(w*.43,len*.42,0,len/2);outline.quadraticCurveTo(-w*.43,len*.42,-w/2,len*.26);outline.lineTo(-w/2,-len*.35);outline.closePath();
  const hull=geometry(new T.ExtrudeGeometry(outline,{depth:1.7,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.18,bevelThickness:.12,curveSegments:12}));hull.rotateX(Math.PI/2);p(hull,r.kind==='tanker'?red:white,0,1.7,0,1,1,1);
  const deck=geometry(new T.ShapeGeometry(outline,12));deck.rotateX(Math.PI/2);p(deck,mat(r.kind==='tanker'?'#aeb9b4':'#bfa47c',{side:T.DoubleSide}),0,1.84,0,1,1,1);
  if(r.kind==='tanker'){
   for(const z of [-10,-1,8]){p(smoothCylinder,steel,0,3,z,3.05,2.3,3.05);p(smoothBall,white,0,4.2,z,3.05,2.8,3.05);for(const side of [-1,1])p(cylinder,yellow,side*3.3,2.45,z,.09,.9,.09);}
   p(box,white,0,4.4,-17,6,5,6);p(box,navy,0,7.3,-18,2,2,1.7);
   for(const side of [-1,1])for(let deck=0;deck<3;deck++){p(box,steel,side*3.1,2.8+deck*1.1,-17,.13,.08,6);}
   for(const side of [-1,1])p(box,steel,side*1.7,2.2,-1,.18,.18,28);
   for(const side of [-1,1]){p(box,steel,side*3.7,2.2,0,.12,.12,30);for(let z=-13;z<16;z+=3)p(cylinder,white,side*3.7,2.2,z,.035,.85,.035);}
  }else{
   function cabin(width,length,y,z,depth,material){const shape=new T.Shape(),a=width/2,b=length/2;shape.moveTo(-a,-b+.6);shape.quadraticCurveTo(-a,-b,0,-b);shape.quadraticCurveTo(a,-b,a,-b+.6);shape.lineTo(a,b-1.7);shape.quadraticCurveTo(a,b,a*.4,b);shape.lineTo(-a*.4,b);shape.quadraticCurveTo(-a,b,-a,b-1.7);shape.closePath();const geo=geometry(new T.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelSize:.08,bevelThickness:.06,bevelSegments:2,curveSegments:10,steps:1}));geo.rotateX(Math.PI/2);p(geo,material,0,y,z,1,1,1);}
   for(let deck=0;deck<3;deck++){const width=w-deck*.8,length=12-deck*2,y=2.4+deck; cabin(width,length,y+.45,-deck,.2,white);cabin(width-.15,length-.3,y+.2,-deck,.55,glass);cabin(width,length,y-.35,-deck,.15,white);}

   p(box,wood,0,2.1,6.5,3.6,.12,3);p(ball,white,0,5.7,-3,.45,.45,.45);p(box,navy,0,5.3,-1,2.5,.1,4);
  }
  p(cylinder,steel,0,5.7,len*.32,.065,4,.065);p(box,white,.4,7.1,len*.32,.8,.45,.025);
  shipDetails({T,geometry,mat,box,cylinder,ball:smoothBall},g,r.kind,len,w);
  const wake=shipWake({T,geometry},g,len,w,r.kind);
  if(r.kind==='yacht'){const index=yachtIndex++,path=AMADOR_MARINA_ROUTES[index];return {g,r,d:0,wake,path,total:marinaLength(path),heading:marinaPose(path,0).heading,direction:1,hold:45+index*65,berth:index};}
  return {g,r,d:i*75,wake};
 });
 let time=0,marinaTurn=0;
 function pose(b){return b.path?marinaPose(b.path,b.d):shippingPose(b.r,b.d);}
 function update(dt,active,{x=0,z=0,indoors=false}={}){
  const elapsed=Math.min(.2,Math.max(0,dt));if(active)time+=elapsed;root.visible=!indoors;
  for(const b of ships){
   if(active&&b.path&&b.berth===marinaTurn){
    if(b.hold>0)b.hold-=elapsed;
    else{const pace=b.d>b.total-65?2:4.8,next=Math.max(0,Math.min(b.total,b.d+elapsed*pace*b.direction)),p=marinaPose(b.path,next);
     // Conservative hull separation includes the player and tankers. Wait in
     // place when occupied; no nudging, despawning or skipped route segments.
     const clear=Math.hypot(p.x-x,p.z-z)>15&&ships.every(q=>q===b||Math.hypot(p.x-pose(q).x,p.z-pose(q).z)>(b.r.length+q.r.length)/2+4);
     const desired=p.heading+(b.direction<0&&b.d<b.total-40?Math.PI:0),delta=Math.atan2(Math.sin(desired-b.heading),Math.cos(desired-b.heading)),heading=b.heading+Math.sign(delta)*Math.min(Math.abs(delta),elapsed*.7);
     const current=pose(b);if(shippingClear(current.x,current.z,heading,b.r.length,b.r.width))b.heading=heading;
     if(clear&&Math.abs(delta)<.08&&shippingClear(p.x,p.z,b.heading,b.r.length,b.r.width))b.d=next;
     if(b.d===b.total&&b.direction===1){b.direction=-1;b.hold=100+b.berth*23;}
     else if(b.d===0&&b.direction===-1){b.direction=1;b.hold=70+b.berth*37;marinaTurn=(marinaTurn+1)%yachtIndex;}
    }
   }else if(active&&!b.path)b.d+=elapsed*2.4;
   b.wake.uniforms.time.value=time;const p=pose(b);b.g.position.set(p.x,.05+Math.sin(time*.55)*.025+(waterMaterial?.userData.surfaceHeight?.(p.x,p.z)||0),p.z);b.g.rotation.set(Math.sin(time*.4)*.005,b.heading??p.heading,Math.sin(time*.6)*.009);b.g.visible=Math.hypot(x-p.x,z-p.z)<360;
  }
 }
 function blocks(x,z,margin=1.3){return ships.some(b=>{const p=b.g.position,a=b.g.rotation.y,dx=x-p.x,dz=z-p.z;return Math.abs(dx*Math.cos(a)-dz*Math.sin(a))<b.r.width/2+margin&&Math.abs(dx*Math.sin(a)+dz*Math.cos(a))<b.r.length/2+margin;});}
 update(0,false);return {root,ships,blocks,update,dispose(){for(const b of ships)b.wake.dispose();root.traverse(o=>{if(o.isInstancedMesh)o.dispose();});scene.remove(root);}};
}


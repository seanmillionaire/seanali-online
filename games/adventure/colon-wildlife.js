import {COLON_OFFSET,freshwaterHabitat} from './geography.js?v=224';
const lakeWater=(isWater)=>(x,z)=>isWater(x,z)&&freshwaterHabitat(x+COLON_OFFSET.x,z+COLON_OFFSET.z);
export const BLACK_MONKEY_COUNT=28;
export const COAST_CROCODILE_COUNT=8;
export function monkeyJumpPhase(clock){const cycle=Math.floor(clock/3.2);return {cycle,open:clock%3.2<1.25};}
export function recordMonkeyJump(play,clock){
 if(!play.active)return {scored:false,complete:false};
 const cue=monkeyJumpPhase(clock-play.start);
 if(!cue.open||cue.cycle===play.lastCycle)return {scored:false,complete:false};
 play.lastCycle=cue.cycle;play.score++;
 const complete=play.score>=3;if(complete)play.active=false;
 return {scored:true,complete};
}
export function shoreCrocodilePose(index,time,isWater){
 isWater=lakeWater(isWater);
 const base=index*Math.PI*2/COAST_CROCODILE_COUNT+time*.045;
 for(let attempt=0;attempt<48;attempt++){
  const a=base+attempt*.04,x=(-10)+Math.cos(a)*32,z=(-125)+Math.sin(a)*29;
  const heading=Math.atan2(-Math.sin(a)*32,Math.cos(a)*29);
  let clear=true;
  for(const forward of [-4,0,3])for(const side of [-1.1,1.1]){
   if(!isWater(x+Math.sin(heading)*forward+Math.cos(heading)*side,z+Math.cos(heading)*forward-Math.sin(heading)*side))clear=false;
  }
  if(clear)return {x,z,heading};
 }
 // The relocated rainforest now borders a different Gatún lagoon. If the
 // former shoreline ring is dry, find a real navigable water corridor around
 // Monkey Island rather than spawning a crocodile on the new coastal land.
 for(let i=0;i<128;i++){
  const a=index*2.399963+i*.39+time*.012;
  const radius=19+(i%5)*2.2;
  const x=5+Math.cos(a)*radius,z=-95+Math.sin(a)*radius*.70;
  const heading=a+Math.PI/2;
  if([-4,0,3].every(forward=>[-1.1,1.1].every(side=>
   isWater(x+Math.sin(heading)*forward+Math.cos(heading)*side,
    z+Math.cos(heading)*forward-Math.sin(heading)*side))))return {x,z,heading};
 }
 return {x:5,z:-83,heading:Math.PI/2};
}
// Stateful local wandering: the ellipse is used only to find a safe spawn.
const angleDelta=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
const crocRandom=n=>{n.seed=(n.seed*1664525+1013904223)>>>0;return n.seed/4294967296;};
// Colón crocs remain in a narrow Gatún/shoreline habitat rather than deep ocean.
export function nearColonShore(x,z){
 const d=Math.hypot((x+10)/32,(z+125)/29);
 const lake=Math.hypot((x-5)/37,(z+95)/22);
 return (d>=.78&&d<=1.15)||(lake>=.28&&lake<=1.13);
}
export function crocodileClear(x,z,heading,isWater){
 isWater=lakeWater(isWater);
 if(!nearColonShore(x,z))return false;
 for(const forward of [-3.8,-1,1.5,2.4])for(const side of [-1.1,0,1.1])
  if(!isWater(x+Math.sin(heading)*forward+Math.cos(heading)*side,z+Math.cos(heading)*forward-Math.sin(heading)*side))return false;
 return true;
}
export function createCrocodileMotion(index,isWater,neighbors=[]){
 let p=shoreCrocodilePose(index,0,isWater),found=false;
 for(let i=0;i<128;i++){const candidate=shoreCrocodilePose(index,i*1.8,isWater);if(crocodileClear(candidate.x,candidate.z,candidate.heading,isWater)&&neighbors.every(n=>Math.hypot(n.x-candidate.x,n.z-candidate.z)>7)){p=candidate;found=true;break;}}
 // The freshwater crescent is narrow. Search its actual shoreline when the
 // old coastal ring cannot provide an independent, full-body-clear home.
 if(!found){let spacing=-1;
  for(let x=-30;x<=42;x+=2)for(let z=-125;z<=-70;z+=2)for(let i=0;i<8;i++){
   const candidate={x,z,heading:i*Math.PI/4};if(![0,2,4,6].every(d=>crocodileClear(x+Math.sin(candidate.heading)*d,z+Math.cos(candidate.heading)*d,candidate.heading,isWater)))continue;
   const distance=neighbors.length?Math.min(...neighbors.map(n=>Math.hypot(n.x-x,n.z-z))):100;
   if(distance>spacing){spacing=distance;p=candidate;}
  }
 }
 return {...p,seed:7817+index*7919,speed:0,goal:null,rest:0,attention:0,phase:index*1.71,travel:0,mode:'wander'};
}
export function stepCrocodile(n,dt,isWater,player=null,neighbors=[]){
 dt=Math.max(0,Math.min(.1,dt));if(!dt)return n;
 const distance=player?Math.hypot(player.x-n.x,player.z-n.z):Infinity;
 n.attention+=((distance<19?1:0)-n.attention)*(1-Math.exp(-dt*2));
 const mode=distance<(n.mode==='give-space'?9:7)?'give-space':distance<(n.mode==='watch'?21:18)?'watch':'wander';
 if(mode!==n.mode){n.mode=mode;n.goal=null;n.rest=0;}
 n.rest=Math.max(0,n.rest-dt);
 if(n.goal&&Math.hypot(n.goal.x-n.x,n.goal.z-n.z)<2){
  n.goal=null;if(mode==='wander'&&crocRandom(n)<.25)n.rest=.5+crocRandom(n)*1.8;
 }
 if(!n.goal&&n.rest===0){
  const base=mode==='give-space'?Math.atan2(n.x-player.x,n.z-player.z):n.heading;
  for(let i=0;i<16;i++){
   const a=base+(crocRandom(n)-.5)*(i<8?2.5:Math.PI*2),d=6+crocRandom(n)*12;
   const x=n.x+Math.sin(a)*d,z=n.z+Math.cos(a)*d;
   if(!nearColonShore(x,z))continue;
   if([.25,.5,.75,1].every(t=>crocodileClear(n.x+(x-n.x)*t,n.z+(z-n.z)*t,a,isWater))){n.goal={x,z};break;}
  }
 }
 let desired=n.goal?Math.atan2(n.goal.x-n.x,n.goal.z-n.z):n.heading;
 if(mode==='watch')desired+=angleDelta(Math.atan2(player.x-n.x,player.z-n.z),desired)*n.attention*.12;
 let sx=0,sz=0;
 for(const other of neighbors){if(other===n)continue;const d=Math.hypot(n.x-other.x,n.z-other.z);if(d>0&&d<6){sx+=(n.x-other.x)/d*(6-d);sz+=(n.z-other.z)/d*(6-d);}}
 if(sx||sz)desired=Math.atan2(Math.sin(desired)+sx*.22,Math.cos(desired)+sz*.22);
 const turn=Math.max(-dt*.65,Math.min(dt*.65,angleDelta(desired,n.heading)));
 const wanted=!n.goal||n.rest>0?0:mode==='give-space'?1.5:mode==='watch'?.45:.75+.28*Math.sin(n.phase*.21);
 n.speed+=(wanted-n.speed)*(1-Math.exp(-dt*1.4));
 const h=n.heading+turn,step=n.speed*dt,x=n.x+Math.sin(h)*step,z=n.z+Math.cos(h)*step;
 // Look ahead before the long body reaches a bank; never snap to a fallback pose.
 if(crocodileClear(x,z,h,isWater)&&crocodileClear(x+Math.sin(h)*1.2,z+Math.cos(h)*1.2,h,isWater)){
  n.x=x;n.z=z;n.heading=h;n.travel+=step;
 }else{
  n.speed*=Math.exp(-dt*5);n.goal=null;
  for(const sign of [1,-1]){const h=n.heading+sign*dt*.5;if(crocodileClear(n.x,n.z,h,isWater)){n.heading=h;break;}}
 }
 n.phase+=dt*(.7+n.speed*1.7);return n;
}
export function stepMonkey(m,dt,anchors){
 m.t+=Math.max(0,Math.min(dt,.1))/m.duration;
 if(m.t>=1){
  m.previous=m.a;m.a=m.b;m.t%=1;m.seed=(m.seed*1664525+1013904223)>>>0;
  const choices=anchors.map((p,i)=>({p,i,d:Math.hypot(p.x-m.a.x,p.z-m.a.z)+Math.abs(p.y-m.a.y)*.3})).filter(p=>p.d>1&&p.d<16&&p.p!==m.previous).sort((a,b)=>a.d-b.d).slice(0,6);
  m.b=choices.length?choices[m.seed%choices.length].p:anchors[(m.seed>>>8)%anchors.length];
  m.duration=Math.max(.8,Math.min(2.1,Math.hypot(m.b.x-m.a.x,m.b.z-m.a.z)/(6.5+(m.seed%23)/10)));
 }
 const t=m.t,e=t*t*(3-2*t),arc=Math.sin(t*Math.PI)*(1.5+(m.seed%4)*.35);
 return {x:m.a.x+(m.b.x-m.a.x)*e,z:m.a.z+(m.b.z-m.a.z)*e,y:m.a.y+(m.b.y-m.a.y)*e+arc,
  heading:Math.atan2(m.b.x-m.a.x,m.b.z-m.a.z),air:Math.sin(t*Math.PI),stride:t*Math.PI*2};
}
export function createColonWildlife({T,root,make,geometry,mat,ball,box,cylinder,cone,height,inWater,anchors}){
 const monkeyRoot=new T.Group();monkeyRoot.name='28 fast black rainforest monkeys';root.add(monkeyRoot);
 // Fine fur grain, shared by every monkey instead of expensive per-animal maps.
 const size=64,data=new Uint8Array(size*size*4);
 for(let i=0;i<size*size;i++){const v=42+((i*73+(i%size)*31)%39);data.set([v,v+2,v+4,255],i*4);}
 const furMap=new T.DataTexture(data,size,size);furMap.wrapS=furMap.wrapT=T.RepeatWrapping;furMap.needsUpdate=true;
 const fur=mat('#282d2d',{map:furMap,bumpMap:furMap,bumpScale:.035,roughness:.97}),skin=mat('#3d3f3b',{roughness:.85}),muzzle=mat('#55564b',{roughness:.87}),black=mat('#080c0b'),iris=mat('#ad823d'),shine=mat('#ebe4bf'),nail=mat('#62675e');
 const small=geometry(new T.SphereGeometry(1,10,8)),tailGeo=geometry(new T.CylinderGeometry(.045,.06,.3,6));
 const piece=(g,m,x,y,z,sx,sy,sz,parent)=>make(g,m,x,y,z,sx,sy,sz,parent);
 function limb(parent,x,y,z,length,upper=true){
  const pivot=new T.Group();pivot.position.set(x,y,z);parent.add(pivot);
  piece(cylinder,fur,0,-length*.46,0,.085,length,.085,pivot);
  const joint=piece(small,fur,0,-length,0,.105,.115,.105,pivot);
  const lower=new T.Group();lower.position.y=-length;lower.rotation.x=upper?-.35:.35;pivot.add(lower);
  piece(cylinder,fur,0,-length*.36,0,.065,length*.8,.065,lower);
  piece(small,skin,0,-length*.83,.055,.1,.07,.16,lower);
  for(let i=0;i<3;i++){const finger=piece(cylinder,skin,(i-1)*.045,-length*.85,.16,.018,.15,.018,lower);finger.rotation.x=Math.PI/2;}
  return {pivot,lower};
 }
 const monkeys=[];
 for(let i=0;i<BLACK_MONKEY_COUNT;i++){
  const g=new T.Group();g.name='Black monkey '+(i+1);g.userData.animal='black-monkey';monkeyRoot.add(g);
  const body=new T.Group();g.add(body);
  piece(ball,fur,0,.87,0,.27,.4,.23,body);piece(ball,fur,0,.61,-.06,.26,.22,.23,body);
  piece(small,skin,0,1.01,.2,.15,.25,.035,body); // exposed chest and throat
  const head=new T.Group();head.position.set(0,1.4,.08);body.add(head);
  piece(ball,fur,0,0,0,.26,.27,.24,head);piece(small,skin,0,-.035,.205,.19,.19,.065,head);
  piece(small,muzzle,0,-.105,.25,.125,.09,.07,head);
  for(const side of [-1,1]){
   piece(small,fur,side*.255,-.015,0,.105,.13,.065,head);piece(small,skin,side*.27,-.015,.04,.06,.085,.025,head);
   piece(small,black,side*.084,.018,.263,.055,.049,.025,head);piece(small,iris,side*.084,.018,.285,.029,.032,.012,head);
   piece(small,black,side*.084,.018,.296,.015,.022,.006,head);piece(small,shine,side*.075,.03,.3,.008,.009,.004,head);
   const brow=piece(small,fur,side*.087,.085,.25,.09,.037,.04,head);brow.rotation.z=side*-.16;
   piece(small,black,side*.034,-.07,.316,.014,.011,.008,head);
  }
  piece(box,black,0,-.145,.31,.11,.012,.013,head);
  const arms=[limb(body,-.26,1.16,.02,.39),limb(body,.26,1.16,.02,.39)];
  const legs=[limb(body,-.14,.58,-.02,.3,false),limb(body,.14,.58,-.02,.3,false)];
  const tail=[];
  let parent=body;
  for(let j=0;j<8;j++){const t=new T.Group();t.position.set(0,j===0?.6:0,j===0?-.21:-.25);parent.add(t);const mesh=piece(tailGeo,fur,0,0,-.12,1,1,1,t);mesh.rotation.x=Math.PI/2;tail.push(t);parent=t;}
  const group=i<19?anchors.main:anchors.monkey,start=group[(i*3)%group.length],next=group[(i*3+1)%group.length];
  const motion={a:start,b:next,t:(i*.17)%1,duration:1.2,seed:123+i*7919};
  const scale=.84+(i%5)*.055;g.scale.setScalar(scale);
  monkeys.push({g,body,head,arms,legs,tail,motion,group,index:i});
 }
 // Detailed, low-slung crocodiles live exclusively in water around Colón.
 const crocRoot=new T.Group();crocRoot.name='Gatún Lake crocodiles';root.add(crocRoot);
 const scaleData=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){const edge=x%8===0||y%6===0,v=edge?62:116+((x*7+y*11)%22);scaleData.set([v,v,v,255],(y*size+x)*4);}
 const scales=new T.DataTexture(scaleData,size,size);scales.wrapS=scales.wrapT=T.RepeatWrapping;scales.needsUpdate=true;
 const hide=mat('#657048',{map:scales,bumpMap:scales,bumpScale:.07,roughness:.88}),belly=mat('#909071',{roughness:.96}),ridge=mat('#3f4933'),tooth=mat('#d2c8a5'),crocEye=mat('#bf9c3f',{roughness:.4}),ripple=mat('#d1eeea',{transparent:true,opacity:.15,depthWrite:false});
 const wakeGeo=geometry(new T.TorusGeometry(1,.018,4,24)),crocs=[];
 for(let i=0;i<COAST_CROCODILE_COUNT;i++){
  const g=new T.Group();g.name='Gatún crocodile '+(i+1);g.userData.animal='coastal-crocodile';crocRoot.add(g);
  piece(ball,hide,0,.06,0,.56,.29,1.25,g);piece(ball,belly,0,-.1,.12,.43,.18,1.1,g);
  piece(ball,hide,0,.16,1.18,.39,.19,.6,g);piece(box,hide,0,.12,1.75,.51,.2,.93,g);
  const jaw=new T.Group();jaw.position.set(0,-.025,1.05);g.add(jaw);
  piece(box,belly,0,-.045,.7,.49,.12,1.16,jaw);
  for(const side of [-1,1]){
   piece(ball,hide,side*.27,.31,1.02,.17,.15,.2,g);piece(small,crocEye,side*.31,.36,1.09,.075,.065,.06,g);piece(small,black,side*.315,.37,1.142,.018,.052,.018,g);
   piece(small,black,side*.16,.25,2.13,.045,.02,.045,g);
   for(let t=0;t<7;t++){const fang=piece(cone,tooth,side*.245,.005,1.3+t*.13,.028,.11,.028,g);fang.rotation.z=Math.PI;}
   for(const z of [-.65,.65]){
    const hip=piece(ball,hide,side*.62,-.03,z,.38,.16,.19,g);hip.rotation.y=side*.45;
    piece(ball,hide,side*.82,-.12,z-.18,.18,.1,.26,g);
    for(let toe=0;toe<3;toe++){const claw=piece(cone,nail,side*(.75+toe*.075),-.16,z-.44,.024,.17,.024,g);claw.rotation.x=-Math.PI/2;}
   }
  }
  for(let row=0;row<3;row++)for(let k=0;k<8;k++)piece(cone,ridge,(row-1)*.24,.35,-.95+k*.25,.085,.16,.13,g);
  const tail=[];let parent=g;
  for(let j=0;j<5;j++){const rig=new T.Group();rig.position.z=j===0?-1.05:-.49;parent.add(rig);piece(ball,hide,0,0,-.2,.39-j*.058,.18-j*.025,.43,rig);piece(cone,ridge,0,.17-j*.025,-.22,.09,.16,.16,rig);tail.push(rig);parent=rig;}
  const wake=piece(wakeGeo,ripple,0,-.045,-.7,1,1.9,1,g);wake.rotation.x=-Math.PI/2;
  const scale=.85+(i%3)*.1;g.scale.setScalar(scale);crocs.push({g,tail,jaw,wake,index:i,nav:createCrocodileMotion(i,inWater,crocs.map(c=>c.nav))});
 }
 function update(dt,active,time,{player,playing=false,signal=false,reducedMotion=false}={}){
  const nearby=Math.hypot(player.x-(-10),player.z+(125))<100||Math.hypot(player.x-(10),player.z+(94))<80;
  monkeyRoot.visible=crocRoot.visible=nearby;if(!nearby)return;
  for(const m of monkeys){
   if(m.following&&!playing){
    m.group=Math.hypot(m.g.position.x-(10),m.g.position.z+(94))<14?anchors.monkey:anchors.main;
    m.motion.a={x:m.g.position.x,y:m.g.position.y,z:m.g.position.z};
    m.motion.b=m.group.reduce((a,b)=>Math.hypot(a.x-m.g.position.x,a.z-m.g.position.z)<Math.hypot(b.x-m.g.position.x,b.z-m.g.position.z)?a:b);
    m.motion.t=0;m.motion.duration=1.3;
   }
   m.following=playing&&m.index<3;
   const p=stepMonkey(m.motion,active?dt:0,m.group);
   if(playing&&m.index<3){
    const a=m.index*Math.PI*2/3,ease=Math.min(1,dt*7),tx=player.x+Math.sin(a)*2.5,tz=player.z+Math.cos(a)*2.5;
    p.x=m.g.position.x+((inWater(tx,tz)?player.x:tx)-m.g.position.x)*ease;
    p.z=m.g.position.z+((inWater(tx,tz)?player.z:tz)-m.g.position.z)*ease;
    const ty=height(p.x,p.z)+(signal&&!reducedMotion?Math.abs(Math.sin(time*Math.PI/1.25))*2:0);
    p.y=m.g.position.y+(ty-m.g.position.y)*ease;p.heading=Math.atan2(player.x-p.x,player.z-p.z);
   }
   m.g.position.set(p.x,p.y,p.z);m.g.rotation.y=p.heading;
   m.body.rotation.x=-.22+Math.sin(p.stride)*.13;
   m.arms.forEach((a,i)=>{a.pivot.rotation.x=-.45+Math.sin(p.stride+i*Math.PI)*.8;a.pivot.rotation.z=(i?1:-1)*(.2+p.air*.3);a.lower.rotation.x=-.4-p.air*.5;});
   m.legs.forEach((a,i)=>{a.pivot.rotation.x=Math.sin(p.stride+i*Math.PI)*.65;a.lower.rotation.x=.35+p.air*.5;});
   m.tail.forEach((t,j)=>{t.rotation.x=.14+Math.sin(time*5+j*.45+m.index)*.13;t.rotation.y=Math.sin(time*3+j*.5+m.index)*.13;});
   const nearPlayer=Math.hypot(player.x-p.x,player.z-p.z)<15;
   const look=nearPlayer?Math.max(-.8,Math.min(.8,angleDelta(Math.atan2(player.x-p.x,player.z-p.z),p.heading))):Math.sin(time*1.4+m.index)*.18;
   if(active)m.head.rotation.y+=(look-m.head.rotation.y)*(1-Math.exp(-dt*4));
   m.g.visible=Math.hypot(player.x-p.x,player.z-p.z)<65;
  }
  const neighbors=crocs.map(c=>c.nav);
  for(const c of crocs){
   const p=stepCrocodile(c.nav,active?dt:0,inWater,player,neighbors);c.g.position.set(p.x,-.03,p.z);c.g.rotation.y=p.heading;
   c.tail.forEach((t,j)=>t.rotation.y=Math.sin(p.phase-j*.65)*(.05+p.speed*.1));
   c.jaw.rotation.x=-.015-Math.max(0,Math.sin(p.phase*.2+c.index))*.025;
   c.wake.visible=p.speed>.2&&!reducedMotion;
   c.g.visible=Math.hypot(player.x-p.x,player.z-p.z)<75;
  }
 }
 return {update,monkeys,crocs,dispose(){furMap.dispose();scales.dispose();}};
}

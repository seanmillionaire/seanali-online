import {COLON_SITES,COLON_BRIDGE,bridgeDistance,buildColon,expandColon} from './colon-state.js?v=105';
import {addFood} from './explore-state.js?v=105';
export function createColonAdventure({T,scene,host,state,make,geometry,mat,box,ball,cylinder,cone,height,save,refresh,joy,tell}){
 const s=state.world,c=s.colon,es=state.lang==='es',say=(a,b)=>es?a:b;
 const root=new T.Group();root.name='Colón rainforest · Monkey Island';scene.add(root);
 const wood=mat('#846044'),bark=mat('#594d38'),green=mat('#327a46'),lime=mat('#73b553'),sand=mat('#eddeb1'),water=mat('#56bfca',{transparent:true,opacity:.85}),darkWater=mat('#3d7774'),banana=mat('#efd45e'),coconut=mat('#82614c'),cream=mat('#f2d8b0'),brown=mat('#79503b'),eye=mat('#263d32');
 const piece=(g,m,x,y,z,sx,sy,sz,parent=root)=>make(g,m,x,y,z,sx,sy,sz,parent);
 const paths=[[{x:91,z:-56},{x:122,z:-39}],[{x:101,z:-58},{x:112,z:-70}],[{x:101,z:-58},{x:108,z:-48}]];
 function lineDistance(x,z,a,b){const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);}
 // Wide footpaths remain free of trunks and dense foliage.
 for(const [a,b] of paths)for(let i=0;i<=30;i++){const t=i/30,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t;piece(cylinder,sand,x,height(x,z)+.025,z,1.25,.04,1.25).castShadow=false;}
 const crowns=[];
 for(let i=0;i<34;i++){
  const a=i*2.39996,r=.28+(i%5)*.125,x=110+Math.sin(a)*26*r,z=-56+Math.cos(a)*23*r;
  if(paths.some(([a,b])=>lineDistance(x,z,a,b)<2.8)||COLON_SITES.some(p=>Math.hypot(x-p.x,z-p.z)<3.5))continue;
  const y=height(x,z),h=7+i%4;
  piece(cylinder,bark,x,y+h/2,z,.35,h,.35);
  const crown=new T.Group();root.add(crown);
  for(const [u,v,w] of [[0,0,0],[-1.5,-.3,.5],[1.6,-.4,-.6]])piece(ball,i%2?green:lime,x+u,y+h+v,z+w,2.8,1.45,2.7,crown);
  crowns.push({g:crown,x,z});
  for(const side of [-1,1]){const vine=piece(cylinder,green,x+side*1.5,y+h-2,z,.045,4,.045);vine.rotation.z=side*.12;}
 }
 // Ferns line paths without occupying their walking surface.
 for(let i=0;i<40;i++){
  const a=i*2.4,r=.4+(i%4)*.12,x=110+Math.sin(a)*25*r,z=-56+Math.cos(a)*22*r;
  if(paths.some(([a,b])=>lineDistance(x,z,a,b)<2))continue;
  for(let leaf=0;leaf<4;leaf++){const f=piece(ball,green,x,height(x,z)+.4,z,.15,.65,.85);f.rotation.y=leaf*Math.PI/2;f.rotation.z=.7;}
 }
 const fruitTrees=[];
 const bananaSites=[[98,-51],[104,-46],[114,-50],[116,-62]],coconutSites=[[91,-57],[96,-69],[119,-71],[130,-53]];
 for(const [kind,sites] of [['banana',bananaSites],['coconut',coconutSites]])sites.forEach(([x,z],index)=>{
  const y=height(x,z),h=kind==='banana'?3.2:5.2;
  piece(cylinder,kind==='banana'?green:bark,x,y+h/2,z,kind==='banana'?.13:.22,h,kind==='banana'?.13:.22);
  for(let i=0;i<6;i++){const a=i*Math.PI/3,leaf=piece(ball,lime,x+Math.sin(a)*1.1,y+h,z+Math.cos(a)*1.1,.4,.12,2);leaf.rotation.y=a;}
  const fruits=[];for(let i=0;i<6;i++)fruits.push(piece(ball,kind==='banana'?banana:coconut,x+(i%3-1)*.25,y+h-.6-Math.floor(i/3)*.25,z+.1,kind==='banana'?.14:.23,kind==='banana'?.35:.25,.16));
  fruitTrees.push({kind,index,x,z,fruits});
 });
 const bridge=new T.Group();bridge.name='Walkable monkey canopy rope bridge';root.add(bridge);
 const broken=new T.Group();root.add(broken);
 const {a,b,y:bridgeY}=COLON_BRIDGE,dx=b.x-a.x,dz=b.z-a.z,length=Math.hypot(dx,dz),heading=Math.atan2(dx,dz);
 for(let i=0;i<=24;i++){
  const t=i/24,x=a.x+dx*t,z=a.z+dz*t;
  const plank=piece(box,wood,x,bridgeY-.12,z,2.8,.23,length/24+.02,bridge);plank.rotation.y=heading;
  if(i<3||i>21){const p=plank.clone();broken.add(p);}
  if(i%4===0)for(const side of [-1,1]){const px=x+Math.cos(heading)*side*1.45,pz=z-Math.sin(heading)*side*1.45;piece(cylinder,wood,px,bridgeY+.6,pz,.065,1.3,.065,bridge);}
 }
 for(const side of [-1,1]){const rope=piece(box,bark,(a.x+b.x)/2+Math.cos(heading)*side*1.45,bridgeY+1.1,(a.z+b.z)/2-Math.sin(heading)*side*1.45,.07,.07,length,bridge);rope.rotation.y=heading;}
 // Water pours beside the crossing, down the cliff into a sheltered pool.
 const falls=[];
 for(let i=0;i<5;i++){const f=piece(box,water,123.4+i*.4,1.9,-34.4, .32,4.1,.3);falls.push(f);}
 piece(ball,water,124,.08,-32,3.2,.12,2.6);
 // Mangrove lagoon and raised wooden viewing boardwalk, with safe reptiles.
 piece(ball,darkWater,97,height(97,-43)+.1,-43,4,.12,2.7);
 for(let i=0;i<16;i++){const t=i/15,x=92+t*11,z=-46.5,y=height(x,z)+.3;piece(box,wood,x,y,z,.8,.17,2);if(i%3===0)for(const side of [-1,1])piece(cylinder,wood,x,y+.6,z+side,.05,1.2,.05);}
 const animals=[];
 function reptile(kind,x,z,index){
  const g=new T.Group();g.name=kind;root.add(g);const scale=kind==='crocodile'?1.1:.65;
  piece(ball,green,0,.27,0,.5,.22,1.2,g);piece(ball,lime,0,.36,1.05,.3,.16,.45,g);
  for(const side of [-1,1]){piece(ball,eye,side*.18,.49,1.12,.045,.045,.045,g);for(const forward of [-.6,.6])piece(ball,green,side*.48,.12,forward,.3,.1,.15,g);}
  const tail=piece(cone,green,0,.2,-1.3,.35,1.4,.35,g);tail.rotation.x=Math.PI/2;
  g.scale.setScalar(scale);g.position.set(x,height(x,z)+.2,z);animals.push({g,x,z,index,kind});
 }
 reptile('crocodile',97,-43,0);reptile('crocodile',99,-42,1);reptile('iguana',118,-66,2);reptile('iguana',95,-64,3);
 for(let i=0;i<3;i++){
  const x=128+i*.9,z=-59+i*.6,g=new T.Group();g.name='Beach nesting turtle';root.add(g);
  piece(ball,green,0,.25,0,.55,.3,.7,g);piece(ball,lime,0,.25,.7,.18,.15,.2,g);
  for(const side of [-1,1])for(const front of [-.4,.4])piece(ball,lime,side*.5,.1,front,.3,.06,.15,g);
  g.position.set(x,height(x,z)+.05,z);
 }
 const monkeys=[];
 for(let i=0;i<7;i++){
  const g=new T.Group();g.name='Monkey Island canopy monkey';root.add(g);
  piece(ball,brown,0,.9,0,.28,.42,.23,g);piece(ball,brown,0,1.5,0,.3,.29,.27,g);piece(ball,cream,0,1.47,.2,.23,.2,.11,g);
  for(const side of [-1,1]){piece(ball,brown,side*.3,1.55,0,.14,.16,.1,g);piece(ball,eye,side*.085,1.53,.3,.035,.04,.025,g);const arm=piece(cylinder,brown,side*.38,.95,0,.07,.65,.07,g);arm.rotation.z=side*.55;piece(cylinder,brown,side*.14,.38,0,.075,.65,.075,g);}
  const tail=piece(geometry(new T.TorusGeometry(.32,.055,5,12,Math.PI*1.6)),brown,0,.7,-.4,1,1,1,g);tail.rotation.x=.5;
  monkeys.push({g,phase:i*1.7});
 }
 for(let i=0;i<7;i++){const a=i*2.4,x=130+Math.sin(a)*5,z=-25+Math.cos(a)*4,y=height(x,z);piece(cylinder,bark,x,y+3,z,.2,6,.2);const g=new T.Group();root.add(g);piece(ball,green,x,y+6,z,2,1,2,g);crowns.push({g,x,z});}
 const house=new T.Group();house.name='Player-built enterable Colón treehouse';root.add(house);
 const hy=height(101,-58);
 piece(cylinder,bark,101,hy+5,-58,.6,10,.6);
 for(const [x,z] of [[98,-60],[104,-60],[98,-56],[104,-56]])piece(cylinder,wood,x,hy+2,z,.14,4,.14,house);
 piece(box,wood,101,hy+4,-58,8,.35,7,house);
 piece(box,cream,101,hy+5.6,-59,6,3.1,4,house);piece(cone,green,101,hy+7.9,-59,5,1.7,4,house);
 for(let i=0;i<8;i++)piece(box,wood,101,hy+.5+i*.5,-53-i*.4,2,.18,.65,house);
 const extensions=new T.Group();house.add(extensions);
 piece(box,wood,106,hy+4,-58,3,.28,6,extensions);piece(box,cream,106,hy+5,-59,2.5,1.8,3,extensions);
 const second=new T.Group();house.add(second);piece(box,wood,97,hy+4,-58,2,.28,6,second);piece(box,banana,97,hy+4.7,-58,1.3,.3,2.6,second);
 const garden=new T.Group();root.add(garden);const gy=height(108,-48);
 piece(cylinder,wood,108,gy+.6,-48,.8,1.2,.8,garden);piece(cylinder,water,108,gy+1.22,-48,.73,.06,.73,garden);
 for(let i=0;i<10;i++){const a=i*Math.PI/5,x=108+Math.sin(a)*2,z=-48+Math.cos(a)*2;piece(ball,lime,x,height(x,z)+.35,z,.35,.6,.35,garden);piece(ball,i%2?banana:cream,x,height(x,z)+.95,z,.35,.18,.35,garden);}
 const lookout=new T.Group();root.add(lookout);const ly=height(112,-70);
 piece(box,wood,112,ly+.1,-70,6,.2,4,lookout);for(const side of [-1,1])piece(box,wood,112,ly+1,-70+side*2,6,.1,.1,lookout);
 const shells=[];for(let i=0;i<5;i++){const x=124+i*.8,z=-64+i;const m=piece(ball,cream,x,height(x,z)+.15,z,.3,.12,.25);shells.push({m,x,z,i});}
 const rainGeo=geometry(new T.BufferGeometry()),rainPositions=new Float32Array(210*3);
 for(let i=0;i<210;i++){rainPositions[i*3]=85+(i*17.31%51);rainPositions[i*3+1]=5+(i*2.77%15);rainPositions[i*3+2]=-80+(i*11.71%48);}
 rainGeo.setAttribute('position',new T.BufferAttribute(rainPositions,3));
 const rain=new T.Points(rainGeo,new T.PointsMaterial({color:'#c9edf2',size:.085,transparent:true,opacity:.72}));root.add(rain);
 const status=document.createElement('div');status.className='colon-status';status.hidden=true;host.append(status);
 let clock=0;
 function nearest(x,z){
  const fruit=fruitTrees.find(t=>c[t.kind][t.index]<6&&Math.hypot(x-t.x,z-t.z)<2.5);
  if(fruit)return {type:'fruit',...fruit};
  const shell=shells.find(t=>!c.shells.includes(t.i)&&Math.hypot(x-t.x,z-t.z)<1.5);if(shell)return {type:'shell',...shell};
  const site=COLON_SITES.find(p=>!c[p.id]&&Math.hypot(x-p.x,z-p.z)<3.8);return site?{type:'site',...site}:null;
 }
 function prompt(x,z){
  const p=nearest(x,z);if(!p)return null;
  if(p.type==='fruit')return (p.kind==='banana'?'🍌 ':'🥥 ')+say('Recoger fruta','Pick fruit');
  if(p.type==='shell')return '🐚 '+say('Recoger concha','Collect shell');
  return p.icon+' '+(es?p.es:p.en)+' · 🍌'+p.banana+' 🥥'+p.coconut;
 }
 function interact(x,z){
  const p=nearest(x,z);if(!p)return false;
  if(p.type==='fruit'){if(!addFood(s,p.kind,1))return true;c[p.kind][p.index]++;tell(say('¡Fruta recogida!','Fruit collected!'));}
  else if(p.type==='shell'){c.shells.push(p.i);tell(say('🐚 Una concha de Colón para tu colección.','🐚 A Colón shell for your collection.'));}
  else if(!buildColon(s,p.id)){tell(say('Primero completa el paso anterior. Necesitas ','Complete the previous step first. You need ')+'🍌 '+p.banana+' · 🥥 '+p.coconut);return true;}
  else{tell('✅ '+(es?p.es:p.en));joy.effect('finish');}
  save();refresh();return true;
 }
 function update(dt,active,{inside=false,cruising=false}={}){
  if(active)clock+=dt;
  const here=!inside&&!cruising&&(Math.hypot((s.x-110)/29,(s.z+56)/26)<1.1||Math.hypot(s.x-130,s.z+25)<12);
  status.hidden=!here;const raining=clock%62<31;
  if(here)status.textContent=(raining?'🌧️ ':'☀️ ')+say('Colón · Selva e Isla de los Monos','Colón · Rainforest & Monkey Island')+' · '+COLON_SITES.filter(p=>c[p.id]).length+'/4';
  rain.visible=here&&raining;if(rain.visible&&active){for(let i=0;i<210;i++){rainPositions[i*3+1]-=dt*10;if(rainPositions[i*3+1]<height(rainPositions[i*3],rainPositions[i*3+2]))rainPositions[i*3+1]=18;}rainGeo.attributes.position.needsUpdate=true;}
  for(const t of fruitTrees)t.fruits.forEach((f,i)=>f.visible=i>=c[t.kind][t.index]);
  for(const crown of crowns)crown.g.visible=!here||Math.hypot(s.x-crown.x,s.z-crown.z)>4;
  bridge.visible=c.bridge;broken.visible=!c.bridge;house.visible=c.treehouse;garden.visible=c.garden;lookout.visible=c.lookout;extensions.visible=c.level>=2;second.visible=c.level>=3;
  for(const t of shells)t.m.visible=!c.shells.includes(t.i);
  monkeys.forEach(({g,phase},i)=>{const a=clock*.4+phase,r=i%2?3.5:1.5;g.position.set(130+Math.sin(a)*r,height(130,-25)+(i%2?4.2:0)+Math.abs(Math.sin(clock*2+phase))*.3,-25+Math.cos(a)*r);g.rotation.y=a;});
  animals.forEach(({g,x,z,index,kind})=>{g.position.x=x+Math.sin(clock*.4+index)*.5;g.rotation.y=Math.sin(clock*.2+index)*.3;if(kind==='crocodile')g.position.y=height(x,z)+.2;});
  falls.forEach((f,i)=>f.material.opacity=.65+Math.sin(clock*3+i)*.12);
 }
 return {update,prompt,interact,canWalk:(x,z)=>c.bridge||bridgeDistance(x,z)>1.45||Math.hypot(x-122,z+39)<2,
  houses:()=>c.treehouse?[{id:'colon-treehouse',colonTreehouse:true,x:101,z:-58,es:'Mi casa del árbol de Colón',en:'My Colón jungle treehouse',icon:'🌳',theme:'play'}]:[],
  expand(){const ok=expandColon(s);if(ok){save();refresh();}return ok;},
  dispose(){status.remove();rain.material.dispose();scene.remove(root);}};
}

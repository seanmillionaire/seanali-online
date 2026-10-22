import {landAnimalModels} from './land-animal-models.js';
import {createColonWildlife,treeCanopyAnchor,monkeyJumpPhase,recordMonkeyJump} from './colon-wildlife.js?v=225';
import {COLON_SITES,COLON_BRIDGE,bridgeDistance,buildColon,expandColon} from './colon-state.js?v=225';
import {addFood,inWater as worldInWater,earnCoins} from './explore-state.js?v=225';
import {COLON_OFFSET} from './geography.js?v=225';
export function createColonAdventure({T,scene,host,state,make,geometry,mat,box,ball,cylinder,cone,height:worldHeight,save,refresh,joy,tell,forest:worldForest,motion=()=>true}){
 const {x:offsetX,z:offsetZ}=COLON_OFFSET;
 const height=(x,z)=>worldHeight(x+offsetX,z+offsetZ);
 const inWater=(x,z)=>worldInWater(x+offsetX,z+offsetZ);
 const s=state.world,c=s.colon,es=state.lang==='es',say=(a,b)=>es?a:b;
 const root=new T.Group();root.name='Colón rainforest · distant Monkey Island';
 root.position.set(offsetX,0,offsetZ);scene.add(root);
 const forestRoot=new T.Group();scene.add(forestRoot);
 const forest={addTree:(kind,x,z,scale,index)=>worldForest.addTree(kind,x+offsetX,z+offsetZ,scale,index,forestRoot)};
 const wood=mat('#846044'),bark=mat('#594d38'),green=mat('#327a46'),lime=mat('#73b553'),sand=mat('#eddeb1'),water=mat('#56bfca',{transparent:true,opacity:.85}),darkWater=mat('#3d7774'),banana=mat('#efd45e'),coconut=mat('#82614c'),cream=mat('#f2d8b0'),brown=mat('#79503b'),eye=mat('#263d32');
 const piece=(g,m,x,y,z,sx,sy,sz,parent=root)=>make(g,m,x,y,z,sx,sy,sz,parent);
 const paths=[[{x:(-29),z:(-125)},{x:(2),z:(-108)}],[{x:(-19),z:(-127)},{x:(-8),z:(-139)}],[{x:(-19),z:(-127)},{x:(-12),z:(-117)}]];
 function lineDistance(x,z,a,b){const dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a.x-t*dx,z-a.z-t*dz);}
 // Wide footpaths remain free of trunks and dense foliage.
 for(const [a,b] of paths)for(let i=0;i<=30;i++){const t=i/30,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t;piece(cylinder,sand,x,height(x,z)+.025,z,1.25,.04,1.25).castShadow=false;}
 const crowns=[],anchors={main:[],monkey:[]};
 for(let i=0;i<52;i++){
  const a=i*2.39996,r=.24+(i%6)*.12,x=(-10)+Math.sin(a)*26*r,z=(-125)+Math.cos(a)*23*r;
  if(paths.some(([a,b])=>lineDistance(x,z,a,b)<2.6)||COLON_SITES.some(p=>Math.hypot(x-p.x,z-p.z)<3))continue;
  const kind=i%9===0?'pine':i%7===0?'natural':'palm',scale=.9+(i%4)*.13;
  const tree=forest.addTree(kind,x,z,scale,i,root);crowns.push(tree);
  anchors.main.push(treeCanopyAnchor(tree,{x:offsetX,z:offsetZ}));
 }

 // Ferns line paths without occupying their walking surface.
 for(let i=0;i<40;i++){
  const a=i*2.4,r=.4+(i%4)*.12,x=(-10)+Math.sin(a)*25*r,z=(-125)+Math.cos(a)*22*r;
  if(paths.some(([a,b])=>lineDistance(x,z,a,b)<2))continue;
  for(let leaf=0;leaf<4;leaf++){const f=piece(ball,green,x,height(x,z)+.4,z,.15,.65,.85);f.rotation.y=leaf*Math.PI/2;f.rotation.z=.7;}
 }
 const fruitTrees=[];
 const bananaSites=[[(-22),(-120)],[(-16),(-115)],[(-6),(-119)],[(-4),(-131)]],coconutSites=[[(-29),(-126)],[(-24),(-138)],[(-1),(-140)],[(10),(-122)]];
 for(const [kind,sites] of [['banana',bananaSites],['coconut',coconutSites]])sites.forEach(([x,z],index)=>{
  const y=height(x,z),h=kind==='banana'?3.2:5.2;
  forest.addTree(kind==='banana'?'banana':'palm',x,z,kind==='banana'?1:.75,index+70,root);
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
 for(let i=0;i<5;i++){const f=piece(box,water,(3.4)+i*.4,1.9,(-103.4), .32,4.1,.3);falls.push(f);}
 piece(ball,water,(4),.08,(-101),3.2,.12,2.6);
 // Mangrove lagoon and raised wooden viewing boardwalk, with safe reptiles.
 piece(ball,darkWater,(-23),height((-23),(-112))+.1,(-112),4,.12,2.7);
 for(let i=0;i<16;i++){const t=i/15,x=(-28)+t*11,z=(-115.5),y=height(x,z)+.3;piece(box,wood,x,y,z,.8,.17,2);if(i%3===0)for(const side of [-1,1])piece(cylinder,wood,x,y+.6,z+side,.05,1.2,.05);}
 const animals=[];
 const land=landAnimalModels({T,geometry,mat,make,ball,cylinder});
 function reptile(kind,x,z,index){const {g}=land.reptile(root);g.scale.setScalar(.65);g.position.set(x,height(x,z)+.03,z);animals.push({g,x,z,index,kind});}
 reptile('iguana',-2,-135,2);reptile('iguana',-25,-133,3);
 for(let i=0;i<3;i++){const x=8+i*.9,z=-128+i*.6,{g}=land.turtle(root);g.position.set(x,height(x,z)+.02,z);}
 for(let i=0;i<10;i++){
  const a=i*2.4,x=(10)+Math.sin(a)*5,z=(-94)+Math.cos(a)*4;
  const tree=forest.addTree(i%6===0?'natural':'palm',x,z,.85+(i%3)*.12,i+100,root);crowns.push(tree);
  anchors.monkey.push(treeCanopyAnchor(tree,{x:offsetX,z:offsetZ}));
 }

 const wildlife=createColonWildlife({T,root,make,geometry,mat,ball,box,cylinder,cone,height,inWater,anchors});
 const house=new T.Group();house.name='Player-built enterable Colón treehouse';root.add(house);
 const hy=height((-19),(-127));
 // No stray rainforest tree in Panama City's old coordinates.
 for(const [x,z] of [[(-22),(-129)],[(-16),(-129)],[(-22),(-125)],[(-16),(-125)]])piece(cylinder,wood,x,hy+2,z,.14,4,.14,house);
 piece(box,wood,(-19),hy+4,(-127),8,.35,7,house);
 piece(box,cream,(-19),hy+5.6,(-128),6,3.1,4,house);piece(cone,green,(-19),hy+7.9,(-128),5,1.7,4,house);
 for(let i=0;i<8;i++)piece(box,wood,(-19),hy+.5+i*.5,(-122)-i*.4,2,.18,.65,house);
 const extensions=new T.Group();house.add(extensions);
 piece(box,wood,(-14),hy+4,(-127),3,.28,6,extensions);piece(box,cream,(-14),hy+5,(-128),2.5,1.8,3,extensions);
 const second=new T.Group();house.add(second);piece(box,wood,(-23),hy+4,(-127),2,.28,6,second);piece(box,banana,(-23),hy+4.7,(-127),1.3,.3,2.6,second);
 const garden=new T.Group();root.add(garden);const gy=height((-12),(-117));
 piece(cylinder,wood,(-12),gy+.6,(-117),.8,1.2,.8,garden);piece(cylinder,water,(-12),gy+1.22,(-117),.73,.06,.73,garden);
 for(let i=0;i<10;i++){const a=i*Math.PI/5,x=(-12)+Math.sin(a)*2,z=(-117)+Math.cos(a)*2;piece(ball,lime,x,height(x,z)+.35,z,.35,.6,.35,garden);piece(ball,i%2?banana:cream,x,height(x,z)+.95,z,.35,.18,.35,garden);}
 const lookout=new T.Group();root.add(lookout);const ly=height((-8),(-139));
 piece(box,wood,(-8),ly+.1,(-139),6,.2,4,lookout);for(const side of [-1,1])piece(box,wood,(-8),ly+1,(-139)+side*2,6,.1,.1,lookout);
 const shells=[];for(let i=0;i<5;i++){const x=(4)+i*.8,z=(-133)+i;const m=piece(ball,cream,x,height(x,z)+.15,z,.3,.12,.25);shells.push({m,x,z,i});}
 const DROP_COUNT=2200,rainGeo=geometry(new T.BufferGeometry()),rainPositions=new Float32Array(DROP_COUNT*6);
 for(let i=0;i<DROP_COUNT;i++){
  const k=i*6,x=(-36)+(i*17.31%54),y=7+(i*2.77%19),z=(-151)+(i*11.71%65);
  rainPositions.set([x,y,z,x-.22,y+1.15+(i%3)*.13,z+.08],k);
 }
 rainGeo.setAttribute('position',new T.BufferAttribute(rainPositions,3));
 const rain=new T.LineSegments(rainGeo,new T.LineBasicMaterial({color:'#c9e5e9',transparent:true,opacity:.6,depthWrite:false}));rain.name='Heavy Colón rain · 2200 streaks';root.add(rain);
 const splashGeo=geometry(new T.TorusGeometry(.4,.018,3,14)),splashMaterial=mat('#b8dedd',{transparent:true,opacity:.34,depthWrite:false}),splashes=new T.InstancedMesh(splashGeo,splashMaterial,32);root.add(splashes);
 const splashMatrix=new T.Matrix4(),splashRotation=new T.Quaternion().setFromEuler(new T.Euler(-Math.PI/2,0,0));
 const baseFog=scene.fog?.density,baseSky=scene.background?.clone(),stormSky=new T.Color('#829da6');
 const sun=scene.children.find(o=>o.isDirectionalLight),baseSun=sun?.intensity;
 const play={active:false,score:0,start:0,lastCycle:-1};
 function hereAt(x,z){return !inWater(x,z)&&(Math.hypot((x-(-10))/27,(z+(125))/24)<1.05||Math.hypot((x-(10))/9,(z+(94))/8)<1.05);}
 const status=document.createElement('div');status.className='colon-status';status.hidden=true;host.append(status);
 let clock=0;
 function nearest(x,z){
  const fruit=fruitTrees.find(t=>c[t.kind][t.index]<6&&Math.hypot(x-t.x,z-t.z)<2.5);
  if(fruit)return {type:'fruit',...fruit};
  const shell=shells.find(t=>!c.shells.includes(t.i)&&Math.hypot(x-t.x,z-t.z)<1.5);if(shell)return {type:'shell',...shell};
  const site=COLON_SITES.find(p=>!c[p.id]&&Math.hypot(x-p.x,z-p.z)<3.8);return site?{type:'site',...site}:null;
 }
 function prompt(x,z){
  if(play.active)return '🐒 '+say('Terminar juego','Stop monkey game')+' · '+play.score+'/3';
  const p=nearest(x,z);if(!p)return hereAt(x,z)&&!(c.treehouse&&Math.hypot(x-(-19),z+(127))<4.6)?'🐒 '+say('Jugar con los monos','Play with monkeys'):null;
  if(p.type==='fruit')return (p.kind==='banana'?'🍌 ':'🥥 ')+say('Recoger fruta','Pick fruit');
  if(p.type==='shell')return '🐚 '+say('Recoger concha','Collect shell');
  return p.icon+' '+(es?p.es:p.en)+' · 🍌'+p.banana+' 🥥'+p.coconut;
 }
 function interact(x,z){
  if(play.active){play.active=false;tell(say('🐒 ¡Los monos te esperan para jugar otra vez!','🐒 The monkeys will play with you again!'));return true;}
  const p=nearest(x,z);if(!p){
   if(!hereAt(x,z)||(c.treehouse&&Math.hypot(x-(-19),z+(127))<4.6))return false;
   play.active=true;play.score=0;play.start=clock;play.lastCycle=-1;
   tell(say('🐒 ¡Imita 3 saltos! Toca Saltar cuando los monos salten.','🐒 Copy 3 jumps! Tap Jump when the monkeys leap.'));return true;
  }
  if(p.type==='fruit'){if(!addFood(s,p.kind,1))return true;c[p.kind][p.index]++;tell(say('¡Fruta recogida!','Fruit collected!'));}
  else if(p.type==='shell'){c.shells.push(p.i);tell(say('🐚 Una concha de Colón para tu colección.','🐚 A Colón shell for your collection.'));}
  else if(!buildColon(s,p.id)){tell(say('Primero completa el paso anterior. Necesitas ','Complete the previous step first. You need ')+'🍌 '+p.banana+' · 🥥 '+p.coconut);return true;}
  else{tell('✅ '+(es?p.es:p.en));joy.effect('finish');}
  save();refresh();return true;
 }
 function update(dt,active,{inside=false,cruising=false}={}){
  if(active)clock+=dt;
  const localX=s.x-offsetX,localZ=s.z-offsetZ;
  const here=!inside&&!cruising&&(Math.hypot((localX+10)/29,(localZ+125)/26)<1.1||Math.hypot(localX-10,localZ+94)<12);
  status.hidden=!here;const raining=(scene.userData.regionalWeather?.rain??1)>.12,cue=monkeyJumpPhase(clock-play.start);
  if(here)status.textContent=(raining?'🌧️ ':'☀️ ')+say('Colón · Selva e Isla de los Monos','Colón · Rainforest & Monkey Island')+' · 🐒 28 · '+COLON_SITES.filter(p=>c[p.id]).length+'/4';
  if(here&&play.active)status.textContent='🐒 '+play.score+'/3 · '+(cue.open?say('¡SALTA AHORA!','JUMP NOW!'):say('Mira el próximo salto…','Watch the next jump…'));
  if(!here)play.active=false;
  rain.visible=false;splashes.visible=rain.visible;
  const storm=here&&raining,ease=Math.min(1,dt*2.5);
  if(rain.visible&&active&&motion()){
   for(let i=0;i<DROP_COUNT;i++){
    const k=i*6;rainPositions[k]-=dt*2.8;rainPositions[k+1]-=dt*23;
    if(rainPositions[k+1]<height(rainPositions[k],rainPositions[k+2])+.05){rainPositions[k]=-36+(i*17.31%54);rainPositions[k+1]=22+(i%7);}
    rainPositions[k+3]=rainPositions[k]-.22;rainPositions[k+4]=rainPositions[k+1]+1.15+(i%3)*.13;rainPositions[k+5]=rainPositions[k+2]+.08;
   }
   rainGeo.attributes.position.needsUpdate=true;
  }
  if(rain.visible)for(let i=0;i<32;i++){
   const x=(-30)+(i*8.73%42),z=(-145)+(i*5.91%52),scale=.15+((clock*1.8+i*.17)%1)*1.1;
   splashMatrix.compose(new T.Vector3(x,height(x,z)+.07,z),splashRotation,new T.Vector3(scale,scale,scale));splashes.setMatrixAt(i,splashMatrix);
  }
  splashes.instanceMatrix.needsUpdate=true;
  for(const t of fruitTrees)t.fruits.forEach((f,i)=>f.visible=i>=c[t.kind][t.index]);

  bridge.visible=c.bridge;broken.visible=!c.bridge;house.visible=c.treehouse;garden.visible=c.garden;lookout.visible=c.lookout;extensions.visible=c.level>=2;second.visible=c.level>=3;
  for(const t of shells)t.m.visible=!c.shells.includes(t.i);
  wildlife.update(dt,active,clock,{player:{...s,x:localX,z:localZ},playing:play.active,signal:play.active&&cue.open,reducedMotion:!motion()});
  animals.forEach(({g,x,z,index,kind})=>{g.position.x=x+Math.sin(clock*.4+index)*.5;g.rotation.y=Math.sin(clock*.2+index)*.3;if(kind==='crocodile')g.position.y=height(x,z)+.2;});
  falls.forEach((f,i)=>f.material.opacity=.65+Math.sin(clock*3+i)*.12);
 }
 function onPlayerJump(){
  const result=recordMonkeyJump(play,clock);if(!result.scored)return;joy.note(play.score,.2);
  if(result.complete){c.monkeyGames=Math.min(9999,c.monkeyGames+1);const coins=earnCoins(state,'colon-monkey-play');save();refresh();joy.effect('finish');tell(say('🐒 ¡Jugaste con los monos!','🐒 You played with the monkeys!')+(coins?' +'+coins+' 🪙':''));}
 }
 return {hazards:()=>wildlife.crocs.filter(c=>c.g.visible&&c.g.parent.visible).map(c=>({kind:'crocodile',x:c.g.position.x+offsetX,z:c.g.position.z+offsetZ,y:0,radius:.8,length:4.6,heading:c.g.rotation.y})),update,prompt:(x,z)=>prompt(x-offsetX,z-offsetZ),
  interact:(x,z)=>interact(x-offsetX,z-offsetZ),onPlayerJump,
  canWalk:(x,z)=>{x-=offsetX;z-=offsetZ;return c.bridge||bridgeDistance(x,z)>1.45||Math.hypot(x-2,z+108)<2;},
  houses:()=>c.treehouse?[{id:'colon-treehouse',colonTreehouse:true,x:(-59),z:(-247),es:'Mi casa del árbol de Colón',en:'My Colón jungle treehouse',icon:'🌳',theme:'play'}]:[],
  expand(){const ok=expandColon(s);if(ok){save();refresh();}return ok;},
  dispose(){status.remove();rain.material.dispose();wildlife.dispose();if(scene.fog&&baseFog!==undefined)scene.fog.density=baseFog;if(scene.background?.isColor&&baseSky)scene.background.copy(baseSky);if(sun)sun.intensity=baseSun;scene.remove(root,forestRoot);}};
}

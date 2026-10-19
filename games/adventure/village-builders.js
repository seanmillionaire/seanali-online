// Preserve all six completed construction projects off Gorgona's access road.
export const GORGONA_BUILDER_FINISHED={
 mateo:[[-15,-2],[-10,-2],[-5,-2]],
 sofia:[[7,-1],[12,-1],[18,-10]]
};
// Two self-directed builders in Gorgona. Their projects belong to the world, not Angelique's inventory.
export function createVillageBuilders({T,scene,host,state,make,mat,ball,box,cylinder,height,save,onTravel,language}){
 const es=language==='es',tr=(a,b)=>es?a:b;
 const specs=[
  {id:'mateo',name:'Mateo',icon:'🔨',x:-10,z:-7,away:{x:60,z:-60},shirt:'#ed9b48',roof:'#da7953',project:['cabaña comunitaria','community cabin']},
  {id:'sofia',name:'Sofía',icon:'⚙️',x:12,z:-6,away:{x:105,z:10},shirt:'#9c85d8',roof:'#74bad0',project:['taller de inventos','invention workshop']}
 ];
 state.world.builders??={};
 const progress=state.world.builders,labels=[],nodes=[],skin=mat('#c78d69'),hair=mat('#362b30'),pants=mat('#3c6281'),timber=mat('#9b6b44'),stone=mat('#8d958d'),glass=mat('#bce8ed');
 const nearby=(node)=>Math.hypot(state.world.x-node.g.position.x,state.world.z-node.g.position.z)<5.5;
 const el=(tag,cls,txt)=>{const v=document.createElement(tag);v.className=cls;v.textContent=txt;return v;};
 const button=(txt,action)=>{const v=el('button','friend-world-label',txt);v.type='button';v.addEventListener('click',action);host.append(v);labels.push(v);return v;};
 function build(spec){
  const g=new T.Group();g.name=spec.name+' · Village Builder';scene.add(g);
  // Match Angelique's world scale and construction language, with individual faces and clothes.
  const shirt=mat(spec.shirt),roof=mat(spec.roof),shorts=mat(spec.id==='mateo'?'#4c7890':'#5c6d99');
  const boots=mat('#534739'),darkEyes=mat('#263b40'),cheeks=mat('#d99a89');
  const skinTone=mat(spec.id==='mateo'?'#aa7955':'#ce9a77');
  const hairTone=mat(spec.id==='mateo'?'#2e2727':'#5b3527');
  const cloth=mat(spec.id==='mateo'?'#f7d6a1':'#e8d9ff');
  make(new T.CylinderGeometry(.24,.20,.58,12),shirt,0,1.06,0,1,1,1,g);
  make(new T.CylinderGeometry(.20,.32,.28,12),shirt,0,.76,0,1,1,1,g);
  make(ball,skinTone,0,1.57,0,.225,.275,.218,g);
  make(ball,hairTone,0,1.77,-.045,.235,.15,.22,g);
  make(ball,hairTone,0,1.68,-.17,.22,.15,.10,g);
  for(const sign of [-1,1]){
   make(ball,darkEyes,sign*.085,1.605,.205,.022,.03,.012,g);
   make(ball,cheeks,sign*.162,1.53,.163,.038,.02,.009,g);
   make(ball,skinTone,sign*.228,1.55,-.004,.034,.065,.036,g);
  }
  make(ball,mat('#9f655b'),0,1.485,.219,.055,.016,.012,g);
  // Back of hair has distinct shape; Sofia's tied hair stays attached as she walks.
  if(spec.id==='sofia'){
   make(ball,hairTone,0,1.62,-.235,.145,.20,.13,g);
   make(ball,hairTone,0,1.40,-.26,.095,.15,.095,g);
   make(ball,cloth,0,1.63,-.28,.105,.05,.06,g);
  }else{
   for(const px of [-.12,0,.12])make(ball,hairTone,px,1.82,.025,.09,.07,.13,g);
  }
  // Utility apron, collar, pockets, tool belt and grounded boots.
  make(box,cloth,0,1.12,.235,.32,.34,.04,g);
  make(box,boots,0,.81,.205,.47,.09,.14,g);
  for(const sign of [-1,1])make(box,cloth,sign*.19,.81,.245,.105,.115,.07,g);
  const legs=[-.13,.13].map(x=>{
   const leg=new T.Group();leg.position.set(x,.70,0);g.add(leg);
   make(cylinder,shorts,0,-.13,0,.12,.29,.12,leg);
   make(cylinder,skinTone,0,-.40,0,.075,.36,.075,leg);
   make(ball,boots,0,-.61,.065,.115,.085,.175,leg);
   return leg;
  });
  const arms=[-.31,.31].map(x=>{
   const pivot=new T.Group();pivot.position.set(x,1.29,0);g.add(pivot);
   make(cylinder,shirt,0,-.10,0,.105,.22,.105,pivot);
   make(cylinder,skinTone,0,-.32,0,.067,.31,.067,pivot);
   make(ball,skinTone,0,-.49,.015,.09,.095,.09,pivot);
   return pivot;
  });
  const heldTool=new T.Group();arms[1].add(heldTool);heldTool.position.set(0,-.50,.07);
  make(cylinder,timber,0,-.14,.02,.028,.34,.028,heldTool);
  make(box,stone,0,.035,.02,.26,.11,.12,heldTool);
  const tool=heldTool;
  // Real in-world supplies rather than floating abstract construction.
  const supplies=new T.Group();scene.add(supplies);supplies.position.set(spec.x-1.6,height(spec.x-1.6,spec.z+2.1),spec.z+2.1);
  for(let k=0;k<4;k++)make(box,timber,(k%2)*.27-.14,.10+Math.floor(k/2)*.20,0,.58,.16,.19,supplies);
  make(box,stone,.7,.17,.16,.5,.34,.48,supplies);
  const shadow=make(new T.CircleGeometry(.36,24),mat('#26362d',{transparent:true,opacity:.22,depthWrite:false}),0,.025,0,1,1,1,g);
  shadow.rotation.x=-Math.PI/2;
  const work=new T.Group();scene.add(work);work.position.set(spec.x+2.0,height(spec.x+2,spec.z)+.04,spec.z);
  const base=make(box,timber,0,.13,0,3.8,.26,3.0,work);
  const supports=[];
  for(const dx of [-1.55,1.55])for(const dz of [-1.2,1.2])supports.push(make(box,timber,dx,1.2,dz,.18,2.1,.18,work));
  const walls=[
   make(box,spec.id==='mateo'?timber:glass,0,1.15,-1.2,3.5,1.8,.15,work),
   make(box,timber,-1.55,1.15,0,.16,1.8,2.3,work),
   make(box,timber,1.55,1.15,0,.16,1.8,2.3,work)
  ];
  const roofParts=[make(box,roof,0,2.35,0,4.1,.28,3.25,work)];
  if(spec.id==='sofia'){
   const mast=make(cylinder,stone,0,3.0,0,.07,1.5,.07,work);
   const rotor=make(box,roof,0,3.7,0,2.0,.13,.15,work);roofParts.push(mast,rotor);
  }
  // Completed work remains visibly in the village after each construction cycle.
  const finished=new T.Group();scene.add(finished);
  const finishedSites=[];
  for(let i=0;i<3;i++){
   const site=new T.Group();finished.add(site);
   const [px,pz]=GORGONA_BUILDER_FINISHED[spec.id][i];site.position.set(px,height(px,pz)+.04,pz);
   make(box,timber,0,.12,0,2.5,.24,2.2,site);
   for(const dx of [-.95,.95])for(const dz of [-.8,.8])make(box,timber,dx,.87,dz,.15,1.4,.15,site);
   make(box,roof,0,1.67,0,2.85,.28,2.45,site);
   finishedSites.push(site);
  }
  const ferry=new T.Group();scene.add(ferry);
  make(box,mat('#af8253'),0,.24,0,1.7,.45,1.0,ferry);
  make(box,mat('#f0e4c5'),0,.7,-.2,.7,.6,.55,ferry);
  const label=button(spec.icon+' '+spec.name,()=>{if(nearby(node))show(node);else onTravel({x:node.g.position.x,z:node.g.position.z+2});});
  const node={spec,g,arms,legs,tool,ferry,supplies,work,finished,finishedSites,base,supports,walls,roofParts,label,clock:0,saveClock:0,stage:-1,cycle:Math.max(0,Number(progress[spec.id]?.cycle)||0),elapsed:Math.max(0,Number(progress[spec.id]?.elapsed)||0),lifeClock:Math.max(0,Number(progress[spec.id]?.lifeClock)||0)};
  nodes.push(node);return node;
 }
 let watcher=null,watchCard=null;
 function show(node){
  if(watcher===node){watcher=null;watchCard?.remove();watchCard=null;return;}
  watcher=node;watchCard?.remove();
  watchCard=el('div','builder-watch-card','');
  Object.assign(watchCard.style,{position:'absolute',left:'50%',top:'14%',transform:'translateX(-50%)',zIndex:'16',maxWidth:'min(90vw,320px)',padding:'12px 16px',borderRadius:'16px',background:'rgba(17,40,44,.90)',color:'white',fontSize:'16px',lineHeight:'1.4',textAlign:'center',pointerEvents:'auto',boxShadow:'0 8px 22px #0005'});
  const close=el('button','','×');Object.assign(close.style,{float:'right',fontSize:'24px',background:'transparent',color:'white',border:'0'});close.onclick=()=>{watcher=null;watchCard.remove();watchCard=null;};watchCard.append(close);
  const info=el('div','builder-watch-info','');watchCard.append(info);host.append(watchCard);paintCard();
 }
 function paintCard(){
  if(!watcher||!watchCard)return;
  const n=watcher,percent=Math.min(100,Math.round(n.elapsed/95*100));
  watchCard.querySelector('.builder-watch-info').textContent=n.spec.icon+' '+n.spec.name+' · '+n.spec.project[es?0:1]+'\n'+tr('Construyendo de verdad: ','Actually building: ')+percent+'% · '+tr('Proyecto ','Project ')+(n.cycle+1)+(nearby(n)?' · 👀':'');
  watchCard.querySelector('.builder-watch-info').style.whiteSpace='pre-line';
 }
 specs.forEach(build);
 function update(dt,time,active=true){
  // Work proceeds independently even if Angelique moves away or a menu is open.
  for(const n of nodes){
   if(active){n.elapsed+=Math.min(dt,.1);n.lifeClock+=Math.min(dt,.1);n.saveClock+=dt;}
   if(n.elapsed>=95){n.elapsed=0;n.cycle++;n.saveClock=5;}
   // Autonomous daily circuit: Gorgona -> ferry -> another island -> ferry home.
   const localTime=(n.lifeClock+(n.spec.id==='sofia'?75:0))%330;
   const outbound=localTime>=135&&localTime<162,returning=localTime>=297&&localTime<324;
   const travelling=outbound||returning,away=localTime>=162&&localTime<297;
   const home={x:n.spec.x,z:n.spec.z},remote=n.spec.away;
   const base=away||returning?remote:home;
   const ferryProgress=travelling?(localTime-(outbound?135:297))/27:0;
   const blend=ferryProgress*ferryProgress*(3-2*ferryProgress);
   const start=outbound?home:remote,end=outbound?remote:home;
   const sailX=start.x+(end.x-start.x)*blend,sailZ=start.z+(end.z-start.z)*blend;
   n.g.userData.travelling=travelling;n.g.userData.away=away;
   n.work.visible=n.supplies.visible=!travelling;
   n.ferry.visible=travelling;
   n.work.position.set(base.x+2,height(base.x+2,base.z)+.04,base.z);
   n.supplies.position.set(base.x-1.6,height(base.x-1.6,base.z+2.1),base.z+2.1);
   n.finishedSites.forEach((site,i)=>{const place=i===0?home:remote;site.position.set(place.x+(i%2)*4,height(place.x+(i%2)*4,place.z+5)+.04,place.z+5);});
   if(travelling){n.ferry.position.set(sailX,.18+Math.sin(time*2)*.06,sailZ);n.ferry.rotation.y=Math.atan2(end.x-start.x,end.z-start.z);}
   const portion=n.elapsed/95,stage=portion<.16?0:portion<.36?1:portion<.72?2:3;
   n.finishedSites.forEach((site,i)=>site.visible=n.cycle>i);
   n.base.visible=true;
   n.supports.forEach((part,i)=>{part.visible=stage>=1&&portion>(.16+i*.035);});
   n.walls.forEach((part,i)=>{part.visible=stage>=2&&portion>(.36+i*.10);});
   n.roofParts.forEach((part,i)=>{part.visible=stage>=3&&portion>(.72+i*.04);});
   // Builders commute between their supply piles and active construction sites.
   const trip=Math.sin(time*.48+(n.spec.id==='mateo'?0:1.7)),walking=Math.abs(trip)>.24;
   const x=base.x+trip*1.12,z=base.z+Math.cos(time*.48)*.45;
   if(travelling){n.g.position.set(sailX,n.ferry.position.y+.45,sailZ);n.g.rotation.y=n.ferry.rotation.y;}
   else {n.g.position.set(x,height(x,z),z);n.g.rotation.y=Math.atan2(base.x+2-x,base.z-z);}
   const stride=walking?Math.sin(time*5):0;
   n.legs.forEach((leg,i)=>leg.rotation.x=travelling?0:stride*(i?-.38:.38));
   n.arms.forEach((arm,i)=>arm.rotation.x=Math.sin(time*(walking?5:8)+i*Math.PI)*(walking?.22:.52));
   n.tool.rotation.z=Math.sin(time*8)*.18;
   if(n.saveClock>=5){progress[n.spec.id]={cycle:n.cycle,elapsed:n.elapsed,lifeClock:n.lifeClock};n.saveClock=0;save();}
   n.label.textContent=n.spec.icon+' '+n.spec.name+' · '+Math.round(portion*100)+'%';
   n.label.hidden=true; // screen-space position is set by projectLabels(camera)
  }
  if(watcher){if(!nearby(watcher)){watcher=null;watchCard?.remove();watchCard=null;}else paintCard();}
 }
 function projectLabels(camera){
  for(const n of nodes){
   const pos=n.g.position.clone();pos.y+=2.15;pos.project(camera);
   const distance=Math.hypot(state.world.x-n.g.position.x,state.world.z-n.g.position.z);
   const onscreen=distance<5.5&&pos.z>-1&&pos.z<1&&Math.abs(pos.x)<.82&&Math.abs(pos.y)<.80;
   n.label.hidden=!onscreen;
   if(onscreen){n.label.style.left=((pos.x+1)*50)+'%';n.label.style.top=((1-pos.y)*50)+'%';}
  }
 }
 function dispose(){for(const n of nodes){progress[n.spec.id]={cycle:n.cycle,elapsed:n.elapsed,lifeClock:n.lifeClock};scene.remove(n.g,n.work,n.finished,n.supplies,n.ferry);}labels.forEach(v=>v.remove());watchCard?.remove();save();}
 return {update,projectLabels,dispose};
}

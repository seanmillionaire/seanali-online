// Two self-directed builders in Gorgona. Their projects belong to the world, not Angelique's inventory.
export function createVillageBuilders({T,scene,host,state,make,mat,ball,box,cylinder,height,save,onTravel,language}){
 const es=language==='es',tr=(a,b)=>es?a:b;
 const specs=[
  {id:'mateo',name:'Mateo',icon:'🔨',x:-10,z:-7,shirt:'#ed9b48',roof:'#da7953',project:['cabaña comunitaria','community cabin']},
  {id:'sofia',name:'Sofía',icon:'⚙️',x:12,z:-6,shirt:'#9c85d8',roof:'#74bad0',project:['taller de inventos','invention workshop']}
 ];
 state.world.builders??={};
 const progress=state.world.builders,labels=[],nodes=[],skin=mat('#c78d69'),hair=mat('#362b30'),pants=mat('#3c6281'),timber=mat('#9b6b44'),stone=mat('#8d958d'),glass=mat('#bce8ed');
 const nearby=(node)=>Math.hypot(state.world.x-node.spec.x,state.world.z-node.spec.z)<5.5;
 const el=(tag,cls,txt)=>{const v=document.createElement(tag);v.className=cls;v.textContent=txt;return v;};
 const button=(txt,action)=>{const v=el('button','friend-world-label',txt);v.type='button';v.addEventListener('click',action);host.append(v);labels.push(v);return v;};
 function build(spec){
  const g=new T.Group();g.name=spec.name+' autonomous builder';scene.add(g);
  const shirt=mat(spec.shirt),roof=mat(spec.roof);
  make(ball,shirt,0,1.04,0,.38,.55,.27,g);
  make(ball,skin,0,1.78,0,.32,.35,.31,g);
  make(ball,hair,0,2.03,-.08,.34,.15,.3,g);
  for(const sign of [-1,1]){
   make(ball,hair,sign*.14,1.83,.292,.035,.05,.027,g);
   make(ball,pants,sign*.18,.45,0,.14,.4,.16,g);
  }
  const arms=[-1,1].map(sign=>{const pivot=new T.Group();pivot.position.set(sign*.40,1.37,0);g.add(pivot);make(ball,skin,sign*.13,-.32,0,.14,.39,.13,pivot);return pivot;});
  const tool=make(box,stone,.56,.59,.39,.34,.12,.12,g);
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
   site.position.set(spec.x+(i-1)*5,height(spec.x+(i-1)*5,spec.z-7)+.04,spec.z-7);
   make(box,timber,0,.12,0,2.5,.24,2.2,site);
   for(const dx of [-.95,.95])for(const dz of [-.8,.8])make(box,timber,dx,.87,dz,.15,1.4,.15,site);
   make(box,roof,0,1.67,0,2.85,.28,2.45,site);
   finishedSites.push(site);
  }
  const label=button(spec.icon+' '+spec.name,()=>{if(nearby(node))show(node);else onTravel({x:spec.x,z:spec.z+2});});
  const node={spec,g,arms,tool,work,finished,finishedSites,base,supports,walls,roofParts,label,clock:0,saveClock:0,stage:-1,cycle:Math.max(0,Number(progress[spec.id]?.cycle)||0),elapsed:Math.max(0,Number(progress[spec.id]?.elapsed)||0)};
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
   if(active){n.elapsed+=Math.min(dt,.1);n.saveClock+=dt;}
   if(n.elapsed>=95){n.elapsed=0;n.cycle++;n.saveClock=5;}
   const portion=n.elapsed/95,stage=portion<.16?0:portion<.36?1:portion<.72?2:3;
   n.finishedSites.forEach((site,i)=>site.visible=n.cycle>i);
   n.base.visible=true;
   n.supports.forEach((part,i)=>{part.visible=stage>=1&&portion>(.16+i*.035);});
   n.walls.forEach((part,i)=>{part.visible=stage>=2&&portion>(.36+i*.10);});
   n.roofParts.forEach((part,i)=>{part.visible=stage>=3&&portion>(.72+i*.04);});
   // Builders commute between their supply piles and active construction sites.
   const trip=Math.sin(time*.48+(n.spec.id==='mateo'?0:1.7)),walking=Math.abs(trip)>.24;
   const x=n.spec.x+trip*1.12,z=n.spec.z+Math.cos(time*.48)*.45;
   n.g.position.set(x,height(x,z),z);
   n.g.rotation.y=Math.atan2(n.spec.x+2-x,n.spec.z-z);
   n.arms.forEach((arm,i)=>arm.rotation.x=Math.sin(time*(walking?5:8)+i*Math.PI)*(walking?.28:.65));
   n.tool.rotation.z=Math.sin(time*8)*.18;
   if(n.saveClock>=5){progress[n.spec.id]={cycle:n.cycle,elapsed:n.elapsed};n.saveClock=0;save();}
   n.label.textContent=n.spec.icon+' '+n.spec.name+' · '+Math.round(portion*100)+'%';
   n.label.hidden=true; // screen-space position is set by projectLabels(camera)
  }
  if(watcher){if(!nearby(watcher)){watcher=null;watchCard?.remove();watchCard=null;}else paintCard();}
 }
 function projectLabels(camera){
  for(const n of nodes){
   const pos=n.g.position.clone();pos.y+=2.8;pos.project(camera);
   const onscreen=pos.z>-1&&pos.z<1&&Math.abs(pos.x)<1&&Math.abs(pos.y)<1;
   n.label.hidden=!onscreen;
   if(onscreen){n.label.style.left=((pos.x+1)*50)+'%';n.label.style.top=((1-pos.y)*50)+'%';}
  }
 }
 function dispose(){for(const n of nodes){progress[n.spec.id]={cycle:n.cycle,elapsed:n.elapsed};scene.remove(n.g,n.work,n.finished);}labels.forEach(v=>v.remove());watchCard?.remove();save();}
 return {update,projectLabels,dispose};
}

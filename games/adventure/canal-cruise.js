import {CRUISE_FARE,CRUISE_BOARD,CRUISE_DOCK,cruisePose,buyCruise,advanceCruise} from './cruise-route.js?v=188';
import {coinBalance} from './explore-state.js?v=188';
export function createCanalCruise({T,scene,host,state,make,mat,box,ball,cylinder,height,save,refresh,joy,tell}){
 const s=state.world,c=s.city.cruise,es=state.lang==='es',choose=(a,b)=>es?a:b;
 const root=new T.Group();root.name='Panama Canal · monumental locks and one ocean liner';scene.add(root);
 const white=mat('#fff7e6'),navy=mat('#16364e'),blue=mat('#58c6de'),gold=mat('#eac46f'),wood=mat('#b4875e'),stone=mat('#899d9f'),orange=mat('#f38c42'),dark=mat('#315665');
 const piece=(geo,m,x,y,z,sx,sy,sz,parent=root)=>make(geo,m,x,y,z,sx,sy,sz,parent);
 // Carved waterfront basin: two monumental lock walls, towers and open sea gates.
 piece(box,blue,(41),.04,(-70),42,.09,25);
 for(const side of [-1,1]){
  piece(box,stone,(40),1.3,(-70)+side*15,44,2.6,3);
  piece(box,white,(40),2.75,(-70)+side*15,44,.3,3.4);
  for(const x of [(22),(40),(60)]){
   piece(box,stone,x,4,(-70)+side*16,4,8,4);
   piece(box,blue,x,6.2,(-70)+side*16,4.2,2,4.2);
   piece(box,gold,x,7.6,(-70)+side*16,4.8,.4,4.8);
  }
 }
 // The original lock remains on the interior canal; boarding now takes place
 // at the connected Pacific waterfront entrance in Panama City.
 for(const side of [-1,1])piece(box,dark,(60),1.8,(-70)+side*12,1,3.6,5);
 const by=height(CRUISE_BOARD.x,CRUISE_BOARD.z);
 const bx=CRUISE_BOARD.x,bz=CRUISE_BOARD.z;
 piece(box,stone,bx,by-.1,bz,10,.3,10);
 piece(box,white,bx,by+3,bz,11,.4,8);
 for(const x of [bx-4,bx+4])for(const z of [bz-3,bz+3])piece(cylinder,gold,x,by+1.5,z,.15,3,.15);
 const signCanvas=document.createElement('canvas');signCanvas.width=1024;signCanvas.height=256;
 const ctx=signCanvas.getContext('2d');
 ctx.fillStyle='#16364e';ctx.fillRect(0,0,1024,256);ctx.textAlign='center';
 ctx.fillStyle='#ffe7a7';ctx.font='bold 58px sans-serif';ctx.fillText('CANAL DE PANAMÁ',512,90);
 ctx.fillStyle='#fff8e5';ctx.font='bold 43px sans-serif';ctx.fillText(choose('CRUCERO · 10 MONEDAS','GRAND CRUISE · 10 COINS'),512,165);
 ctx.font='30px sans-serif';ctx.fillText(choose('ESCLUSAS · CANAL DE PANAMÁ','LOCKS · PANAMA CANAL'),512,220);
 const signTexture=new T.CanvasTexture(signCanvas),signMaterial=new T.SpriteMaterial({map:signTexture,depthTest:false});
 const sign=new T.Sprite(signMaterial);sign.position.set(bx,by+7,bz);sign.scale.set(14,3.5,1);root.add(sign);
 // The only cruise ship: 34 units long, five decks and a broad open sun deck.
 const ship=new T.Group();ship.name='Angelique · enormous Panama cruise ship';root.add(ship);
 piece(box,navy,0,1.4,0,11,2.8,30,ship);
 piece(ball,navy,0,1.4,14.4,5.5,1.4,4,ship);
 piece(box,white,0,2.9,0,11.6,.6,30,ship);
 for(let deck=0;deck<4;deck++){
  const y=3.8+deck*1.35,len=26-deck*2.5;
  piece(box,white,0,y,-1,10-deck*.7,1.25,len,ship);
  piece(box,wood,0,y+.68,-1,10.7-deck*.7,.12,len+.6,ship);
  for(const side of [-1,1]){
   piece(box,gold,side*(5.2-deck*.35),y+.98,-1,.08,.5,len+.5,ship);
   for(let row=0;row<11-deck;row++)piece(box,blue,side*(5.01-deck*.35),y+.05,-len/2+1+row*2,.07,.56,1.35,ship);
  }
 }
 piece(box,blue,0,8.6,7.5,7.4,1,2.7,ship); // panoramic bridge
 for(const z of [-6,-9]){
  piece(cylinder,navy,0,9.2,z,1,2.3,1,ship);
  piece(cylinder,gold,0,10.1,z,1.08,.45,1.08,ship);
 }
 piece(box,blue,0,8.75,-8,3,.12,5,ship); // swimming pool
 for(const side of [-1,1])for(const z of [-9,-3,3,9]){
  piece(ball,orange,side*5.9,4.8,z,.8,.55,1.8,ship);
  piece(box,white,side*5.9,5.15,z,.95,.18,2,ship);
 }
 piece(cylinder,white,0,10.7,10,.09,5,.09,ship);
 piece(box,gold,.7,12.5,10,1.4,.8,.06,ship);
 const status=document.createElement('div');status.className='cruise-status';status.setAttribute('role','status');status.hidden=true;host.append(status);
 // A clear play court on the upper deck; passengers use ship-local coordinates.
 piece(box,wood,0,8.55,3,7.5,.12,7.2,ship);
 const beachBall=piece(ball,orange,0,9.1,3,.38,.38,.38,ship);beachBall.name='Friends upper-deck beach ball';
 const controls=document.createElement('div');controls.hidden=true;controls.setAttribute('aria-label',choose('Juegos en cubierta','Top deck games'));
 Object.assign(controls.style,{position:'absolute',bottom:'max(20px, env(safe-area-inset-bottom))',left:'16px',right:'16px',zIndex:'32',display:'flex',justifyContent:'center',gap:'10px',flexWrap:'wrap'});
 host.append(controls);
 let game='ball',playTime=0,autosave=0;
 const gameButtons=[];
 for(const [id,label]of [['ball',choose('⚽ Jugar a la pelota','⚽ Play ball')],['dance',choose('💃 Bailar con amigos','💃 Dance with friends')]]){
  const b=document.createElement('button');b.type='button';b.textContent=label;
  Object.assign(b.style,{minHeight:'48px',padding:'12px 16px',border:'2px solid #ffe7a7',borderRadius:'16px',background:'#16364e',color:'#fff8e5',fontSize:'17px',fontWeight:'800'});
  b.onclick=()=>{game=id;joy.gesture?.();joy.effect('friend');};controls.append(b);gameButtons.push([id,b]);
 }
 function deckPoint(x,z,y=0){const a=ship.rotation.y;return {x:ship.position.x+Math.cos(a)*x+Math.sin(a)*z,z:ship.position.z-Math.sin(a)*x+Math.cos(a)*z,y:ship.position.y+8.62+y};}
 function near(x,z){return Math.hypot(x-CRUISE_BOARD.x,z-CRUISE_BOARD.z)<8;}
 function board(){
  if(!buyCruise(c,coinBalance(state))){
   tell(choose('🚢 El crucero cuesta 10 🪙. Recoge bolsas de dinero en la ciudad.','🚢 The cruise costs 10 coins. Collect money bags in the city.'));return false;
  }
  playTime=0;game='ball';Object.assign(s,CRUISE_DOCK);save();refresh();joy.effect('boat');
  tell(choose('🚢 ¡Todos tus amigos a bordo! Jueguen en la cubierta mientras navegamos.','🚢 All your friends are aboard! Play on the top deck while we cruise.'));return true;
 }
 function update(dt,active){
  if(c.active&&active)playTime+=dt;
  const finished=advanceCruise(c,dt,active);
  const p=cruisePose(c.active?c.distance:0);
  ship.position.set(p.x,.12,p.z);
  // Smooth the vessel's heading while keeping the passenger fixed on deck.
  const turn=Math.atan2(Math.sin(p.heading-ship.rotation.y),Math.cos(p.heading-ship.rotation.y));
  ship.rotation.y+=turn*(dt===0?1:Math.min(1,dt*1.8));
  if(c.active){s.x=p.x;s.z=p.z;autosave+=active?dt:0;if(autosave>2){autosave=0;save();}}
  if(finished){Object.assign(s,CRUISE_BOARD);save();refresh();joy.effect('finish');tell(choose('🚢 ¡Vuelta completa! De regreso en el Canal de Panamá.','🚢 Full tour complete! Back at the Panama Canal.'));}
  host.classList.toggle('on-cruise',c.active);status.hidden=!c.active;controls.hidden=!c.active;controls.style.display=c.active?'flex':'none';
  for(const [id,b]of gameButtons)b.setAttribute('aria-pressed',String(id===game));
  beachBall.visible=c.active&&game==='ball';beachBall.position.set(Math.sin(playTime*1.4)*2,9.1+Math.abs(Math.sin(playTime*2.8))*1.1,3+Math.cos(playTime*1.4)*1.8);
  if(c.active)status.textContent='🚢 '+choose('Canal y Lago Gatún','Canal & Gatún Lake cruise')+' · '+Math.floor(p.progress*100)+'% · '+choose('🫶 Todos los amigos · Juegos en cubierta','🫶 All friends · Top deck play');
  const passenger=deckPoint(0,5.7,game==='dance'?Math.abs(Math.sin(playTime*4))*.25:0);
  return {active:c.active,finished,...passenger,heading:ship.rotation.y+(game==='dance'?Math.sin(playTime*3)*.5:0),game,playTime,playing:active,deckPoint};
 }
 update(0,false);
 return {near,board,update,isActive:()=>c.active,prompt:()=>choose('🚢 Crucero con todos tus amigos · 10 🪙','🚢 Cruise with all friends · 10 coins'),dispose(){host.classList.remove('on-cruise');status.remove();controls.remove();scene.remove(root);signMaterial.dispose();signTexture.dispose();}};
}

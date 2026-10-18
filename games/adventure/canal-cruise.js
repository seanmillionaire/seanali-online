import {CRUISE_FARE,CRUISE_BOARD,CRUISE_DOCK,cruisePose,buyCruise,advanceCruise} from './cruise-route.js?v=104';
import {coinBalance} from './explore-state.js?v=106';
export function createCanalCruise({T,scene,host,state,make,mat,box,ball,cylinder,height,save,refresh,joy,tell}){
 const s=state.world,c=s.city.cruise,es=state.lang==='es',choose=(a,b)=>es?a:b;
 const root=new T.Group();root.name='Panama Canal · monumental locks and one ocean liner';scene.add(root);
 const white=mat('#fff7e6'),navy=mat('#16364e'),blue=mat('#58c6de'),gold=mat('#eac46f'),wood=mat('#b4875e'),stone=mat('#899d9f'),orange=mat('#f38c42'),dark=mat('#315665');
 const piece=(geo,m,x,y,z,sx,sy,sz,parent=root)=>make(geo,m,x,y,z,sx,sy,sz,parent);
 // Carved waterfront basin: two monumental lock walls, towers and open sea gates.
 piece(box,blue,-43,.04,-74,42,.09,25);
 for(const side of [-1,1]){
  piece(box,stone,-44,1.3,-74+side*15,44,2.6,3);
  piece(box,white,-44,2.75,-74+side*15,44,.3,3.4);
  for(const x of [-62,-44,-24]){
   piece(box,stone,x,4,-74+side*16,4,8,4);
   piece(box,blue,x,6.2,-74+side*16,4.2,2,4.2);
   piece(box,gold,x,7.6,-74+side*16,4.8,.4,4.8);
  }
 }
 // Open lock gates and a promenade connect the existing city to the terminal.
 for(const side of [-1,1])piece(box,dark,-24,1.8,-74+side*12,1,3.6,5);
 const by=height(CRUISE_BOARD.x,CRUISE_BOARD.z);
 piece(box,stone,-65,by-.1,-56,10,.3,10);
 piece(box,white,-65,by+3,-56,11,.4,8);
 for(const x of [-69,-61])for(const z of [-59,-53])piece(cylinder,gold,x,by+1.5,z,.15,3,.15);
 const signCanvas=document.createElement('canvas');signCanvas.width=1024;signCanvas.height=256;
 const ctx=signCanvas.getContext('2d');
 ctx.fillStyle='#16364e';ctx.fillRect(0,0,1024,256);ctx.textAlign='center';
 ctx.fillStyle='#ffe7a7';ctx.font='bold 58px sans-serif';ctx.fillText('CANAL DE PANAMÁ',512,90);
 ctx.fillStyle='#fff8e5';ctx.font='bold 43px sans-serif';ctx.fillText(choose('CRUCERO · 10 MONEDAS','GRAND CRUISE · 10 COINS'),512,165);
 ctx.font='30px sans-serif';ctx.fillText(choose('UNA VUELTA POR TODO EL MAPA','ONE FULL TOUR AROUND THE MAP'),512,220);
 const signTexture=new T.CanvasTexture(signCanvas),signMaterial=new T.SpriteMaterial({map:signTexture,depthTest:false});
 const sign=new T.Sprite(signMaterial);sign.position.set(-65,by+7,-56);sign.scale.set(14,3.5,1);root.add(sign);
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
 for(const z of [-5,0]){
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
 let autosave=0;
 function near(x,z){return Math.hypot(x-CRUISE_BOARD.x,z-CRUISE_BOARD.z)<8;}
 function board(){
  if(!buyCruise(c,coinBalance(state))){
   tell(choose('🚢 El crucero cuesta 10 🪙. Recoge bolsas de dinero en la ciudad.','🚢 The cruise costs 10 coins. Collect money bags in the city.'));return false;
  }
  Object.assign(s,CRUISE_DOCK);save();refresh();joy.effect('boat');
  tell(choose('🚢 ¡Bienvenida a bordo! Una vuelta completa por todo Panamá.','🚢 Welcome aboard! One complete tour around all of Panama.'));return true;
 }
 function update(dt,active){
  const finished=advanceCruise(c,dt,active);
  const p=cruisePose(c.active?c.distance:0);
  ship.position.set(p.x,.12,p.z);
  // Smooth the vessel's heading while keeping the passenger fixed on deck.
  const turn=Math.atan2(Math.sin(p.heading-ship.rotation.y),Math.cos(p.heading-ship.rotation.y));
  ship.rotation.y+=turn*(dt===0?1:Math.min(1,dt*1.8));
  if(c.active){s.x=p.x;s.z=p.z;autosave+=active?dt:0;if(autosave>2){autosave=0;save();}}
  if(finished){Object.assign(s,CRUISE_BOARD);save();refresh();joy.effect('finish');tell(choose('🚢 ¡Vuelta completa! De regreso en el Canal de Panamá.','🚢 Full tour complete! Back at the Panama Canal.'));}
  host.classList.toggle('on-cruise',c.active);status.hidden=!c.active;
  if(c.active)status.textContent='🚢 '+choose('Crucero por Panamá','Panama grand cruise')+' · '+Math.floor(p.progress*100)+'% · '+choose('Una vuelta completa','One full map tour');
  return {active:c.active,finished,x:s.x+Math.sin(ship.rotation.y)*4,z:s.z+Math.cos(ship.rotation.y)*4,y:8.8,heading:ship.rotation.y};
 }
 update(0,false);
 return {near,board,update,isActive:()=>c.active,prompt:()=>choose('🚢 Crucero · 10 🪙','🚢 Cruise · 10 coins'),dispose(){host.classList.remove('on-cruise');status.remove();scene.remove(root);signMaterial.dispose();signTexture.dispose();}};
}

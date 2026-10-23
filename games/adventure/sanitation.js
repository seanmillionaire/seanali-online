import {routePose,trafficAdvance} from './panama-state.js';
import {placeGroundVehicle} from './vehicle-grounding.js';
import {trafficMoveClear,trafficJamStep} from './traffic-yield.js';
import {ownedCars} from './estate-cars.js';
import {coinBalance} from './explore-state.js';
import {sanitationModels} from './sanitation-models.js';
import {sanitationLayout} from './sanitation-routes.js';
import {createSanitationPanel} from './sanitation-panel.js';
import {normalizeSanitation,sanitationOpen,sanitationStation,advanceWaste,collectLitter,collectHousehold,depositSanitation,startSanitationShift,claimSanitationShift,buySanitationUpgrade,serviceStation,unloadSanitation,binCapacity} from './sanitation-state.js';
export function createSanitation(options){
 const {state,height,roadHeight=height,save,refresh,joy,tell,otherTraffic=()=>[]}=options;
 const s=state.world.sanitation=normalizeSanitation(state.world.sanitation),es=state.lang==='es',say=(a,b)=>es?a:b;
 const art=sanitationModels(options),routes=sanitationLayout(options),stations=[],vehicles=[];
 let lastInfo={indoors:true,protected:true},clock=0,saveTime=0,visualTime=0,selectedRoute=null,disposed=false;
 for(const r of routes){
  r.stops.forEach(p=>{sanitationStation(s,p.id);Object.assign(p,art.station(p));p.g.visible=false;stations.push(p);});
  r.line=art.routeLine(r.route);if(!r.stops.length)continue;
  const rec=s.trucks[r.id];rec.stop=Math.min(rec.stop,r.stops.length);rec.distance%=r.length;
  const v={...art.truck(r.ri,es?r.es:r.en),...r,distance:rec.distance,speed:r.road?6.4:3.4,bus:true};
  // Fresh trucks begin at a real depot, not in an intersection. Migrated vehicles retain their route position.
  if(rec.distance===0&&rec.cycles===0){v.distance=r.stops[0].distance;rec.distance=v.distance;}
  placeGroundVehicle(v.g,routePose(v.route,v.distance),roadHeight,'bus');v.g.visible=false;v.worker.g.visible=false;vehicles.push(v);
 }
 const activeVehicles=()=>vehicles.filter(v=>sanitationOpen(s,v.ri));
 const onFoot=()=>state.world.travelMode==='walk'&&!lastInfo.indoors&&!lastInfo.protected;
 function nearby(x,z){return stations.filter(p=>sanitationOpen(s,p.region)&&Math.hypot(x-p.x,z-p.z)<3.6).sort((a,b)=>Math.hypot(x-a.x,z-a.z)-Math.hypot(x-b.x,z-b.z))[0]||null;}
 function showRoute(ri){selectedRoute=Number.isInteger(ri)?ri:null;paint();}
 function announceUnlocked(before){for(const id of s.unlocked.filter(id=>!before.includes(id))){const r=routes.find(r=>r.id===id);tell('♻️ Nueva ruta: '+r.es,'♻️ New service route: '+r.en);}}
 function complete(before){announceUnlocked(before);save();refresh();paint();}
 function onAction(type,payload){
  if(disposed)return '';
  const before=[...s.unlocked];let message='';
  if(type==='start'){if(startSanitationShift(s))message=say('🧤 ¡Turno iniciado! Recoge y entrega 6 objetos.','🧤 Shift started! Collect and deliver 6 items.');}
  else if(type==='claim'){const coins=claimSanitationShift(s);if(coins){joy.effect('coin');message=say(`✅ Turno completo · +${coins} monedas.`,`✅ Shift complete · +${coins} coins.`);}}
  else if(type==='upgrade'){if(buySanitationUpgrade(s,payload,coinBalance(state)))message=say('🛠️ Mejora instalada.','🛠️ Equipment upgraded.');else message=say('No hay suficientes monedas o ya tienes esta mejora.','Not enough coins, or this upgrade is already installed.');}
  else{
   const p=nearby(state.world.x,state.world.z),id=typeof payload==='string'?payload:payload?.id;
   if(!onFoot()||!p||p.id!==id)return say('👣 Acércate a pie al punto de recogida.','👣 Walk up to this collection point first.');
   if(type==='pickup'){if(collectLitter(s,id,payload.index)){joy.effect('correct');message=say('🎒 Recogido. Elige el contenedor correcto.','🎒 Collected. Choose the correct bin.');}else message=say('La bolsa está llena o el equipo ya lo recogió.','Your bag is full, or the crew already collected that item.');}
   if(type==='household'){if(!p.depot&&collectHousehold(s,id,payload.kind)){joy.effect('correct');message=say('📦 Bolsa sellada. Llévala al centro de transferencia.','📦 Sealed bag collected. Deliver it to the transfer depot.');}}
   if(type==='deposit'){
    const result=depositSanitation(s,id,payload.index,payload.target,{depot:p.depot});
    if(result.ok){joy.effect('coin');message=say(`✅ +${result.coins} monedas · +1 aporte al barrio.`,`✅ +${result.coins} coins · +1 neighborhood contribution.`);}
    else message=({empty:say('No hay un objeto para depositar.','There is no item to deposit.'),'wrong-bin':say('💡 Los envases van en ♻️; los residuos en 🗑️. Conservas tu objeto.','💡 Containers go in ♻️; waste goes in 🗑️. You keep your item.'),'depot-only':say('🏭 Esta bolsa sellada se entrega en el centro.','🏭 Deliver this sealed bag to the depot.'),full:say('🚛 Contenedor lleno: solicita recogida o usa el centro.','🚛 Bin full: request collection or use the depot.')})[result.reason];
   }
   if(type==='request'){const v=vehicles.find(v=>v.ri===p.region),rec=s.trucks[routes[p.region].id];if(v&&rec.mode==='drive'){rec.stop=v.stops.indexOf(p);message=say('🚛 Solicitud recibida. El camión llegará por su ruta, respetando el tráfico.','🚛 Request received. The truck will follow its route and yield to traffic.');}else message=say('🚛 El equipo termina su parada antes de continuar.','🚛 The crew will finish its current stop before continuing.');}
  }
  complete(before);return message;
 }
 const ui=createSanitationPanel({...options,state,s,routes,stations,vehicles,nearby,onFoot,onAction,showRoute,balance:()=>coinBalance(state)});
 function paint(){
  for(const r of routes)r.line.visible=selectedRoute===r.ri&&sanitationOpen(s,r.ri)&&!lastInfo.indoors;
  for(const p of stations){const data=s.stations[p.id];p.g.visible=sanitationOpen(s,p.region)&&!lastInfo.indoors&&Math.hypot(lastInfo.x-p.x,lastInfo.z-p.z)<115;
   p.marker.visible=selectedRoute===p.region;p.planter.visible=data.beautified;
   p.litter.forEach((sprite,i)=>{sprite.visible=i<data.litter.length;if(sprite.visible)art.setLitter(sprite,data.litter[i]);});
   for(const k of ['waste','recycle'])p[k].lid.rotation.x=data.bins[k]>=binCapacity(s)?-.35:0;
  }
 }
 function update(dt,active,info){
  if(disposed)return;lastInfo=info;
  const step=active&&Number.isFinite(dt)?Math.min(.1,Math.max(0,dt)):0;clock+=step;
  advanceWaste(s,stations.filter(p=>sanitationOpen(s,p.region)).map(p=>p.id),step);
  const fleet=activeVehicles(),traffic=[...otherTraffic(),...fleet],owned=ownedCars(state.world.city);
  if(!info.indoors&&!info.protected)owned.push({x:info.x,z:info.z,length:.45,width:.45});
  for(const truck of vehicles){const rec=s.trucks[truck.id],enabled=sanitationOpen(s,truck.ri);truck.g.visible=enabled&&!info.indoors&&Math.hypot(info.x-truck.g.position.x,info.z-truck.g.position.z)<150;truck.worker.g.visible=false;if(!enabled)continue;
   const unloading=rec.stop>=truck.stops.length,target=unloading?truck.stops[0]:truck.stops[rec.stop];
   if(step){
    if(rec.mode==='service'||rec.mode==='unload'){
     const previous=rec.phase;rec.phase=Math.min(12,rec.phase+step);
     if(rec.mode==='service'&&previous<6&&rec.phase>=6){serviceStation(s,target.id,rec.load);save();}
     if(rec.phase>=12){const before=[...s.unlocked];if(rec.mode==='unload'){unloadSanitation(s,rec);rec.stop=0;}else rec.stop=rec.load.waste>=48||rec.load.recycle>=48?truck.stops.length:rec.stop+1;rec.phase=0;rec.mode='drive';rec.waiting=0;complete(before);}
    }else{
     const remaining=((target.distance-truck.distance)%truck.length+truck.length)%truck.length;
     if(remaining<.1){rec.mode=unloading?'unload':'service';rec.phase=0;rec.waiting=0;save();}
     else{
      const proposed=truck.road?truck.distance+step*truck.speed:trafficAdvance(truck,traffic,clock,step),limited=truck.distance+Math.min(remaining,Math.max(0,proposed-truck.distance)),next=trafficJamStep(truck,limited,traffic,owned,step,{red:!truck.road&&truck.trafficRedStopped});
      if(next!==truck.distance&&trafficMoveClear(truck,next,traffic,owned)){truck.distance=((next%truck.length)+truck.length)%truck.length;rec.distance=truck.distance;rec.waiting=0;}else rec.waiting=Math.min(120,rec.waiting+step);
     }
    }
   }
   const pose=routePose(truck.route,truck.distance);placeGroundVehicle(truck.g,pose,roadHeight,'bus');truck.beacon.emissiveIntensity=.3+(Math.sin(clock*7+truck.ri)>0?1.7:0);truck.hopper.rotation.x=rec.mode!=='drive'?Math.sin(rec.phase/12*Math.PI)*.5:0;
   // A shared validated footpath connects the curb-side door to the actual bin access.
   if(rec.mode!=='drive'&&truck.g.visible){const t=rec.phase<4?rec.phase/4:rec.phase>8?(12-rec.phase)/4:1,w=truck.worker,path=target.path,index=t*(path.length-1),a=path[Math.floor(index)],b=path[Math.min(path.length-1,Math.ceil(index))],f=index%1,x=a.x+(b.x-a.x)*f,z=a.z+(b.z-a.z)*f;w.g.visible=true;w.g.position.set(x,height(x,z),z);const next=path[Math.min(path.length-1,Math.floor(index)+1)];w.g.rotation.y=Math.atan2(next.x-a.x,next.z-a.z)+(rec.phase>8?Math.PI:0);w.animate(clock*7,t<1);w.legs.forEach((leg,i)=>leg.rotation.x=t<1?Math.sin(clock*7+i*Math.PI)*.35:0);truck.sack.visible=rec.mode==='unload'?rec.phase<6:rec.phase>=6;w.arms.forEach((arm,i)=>arm.rotation.x=t===1?-1:Math.sin(clock*7+i*Math.PI)*.4);
   }
  }
  visualTime+=Math.max(0,Number.isFinite(dt)?dt:0);if(visualTime>.2){visualTime=0;paint();}
  saveTime+=step;if(saveTime>=10){saveTime=0;save();}
 }
 function blocks(x,z){return stations.some(p=>sanitationOpen(s,p.region)&&((Math.abs(x-(p.x-.55))<.59||Math.abs(x-(p.x+.55))<.59)&&Math.abs(z-p.z)<.6||s.stations[p.id].beautified&&Math.abs(x-p.x)<1&&Math.abs(z-(p.z-.8))<.5));}
 return {vehicles,stations,routes,get activeVehicles(){return activeVehicles();},open:ui.open,requestCollection:id=>onAction('request',id),update,blocks,near:nearby,showRoute,
  prompt:(x,z)=>onFoot()&&nearby(x,z)?say('♻️ Usar contenedores','♻️ Use bins'):null,
  interact(x,z){if(!onFoot()||!nearby(x,z))return false;ui.open('near');return true;},
  dispose(){if(disposed)return;disposed=true;ui.dispose();art.dispose();}
 };
}

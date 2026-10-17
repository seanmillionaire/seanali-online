/* Pizza City — the largest island: real road grid, drivable mini car,
   walk-in pizzeria, and sixteen persistent 💰 money-bag pickups. */
export const CITY={x:-100,z:-74,rx:45,rz:38,restaurant:{x:-84,z:-60}};
export const MONEY_BAGS=Array.from({length:16},(_,i)=>{
 const a=i/16*Math.PI*2;
 const r=i%4===0?.62:i%3===0?.43:.77;
 return {id:'bag-'+i,x:CITY.x+Math.cos(a)*30*r,z:CITY.z+Math.sin(a)*26*r};
});
export function createPizzaCity({T,scene,camera,state,height,make,mat,geometry,ball,box,cylinder,cone,joy,save,refresh,tell}){
 const s=state.world,city=s.city,es=state.lang==='es';
 const group=new T.Group();group.name='Pizza City buildings, roads and money bags';scene.add(group);
 const asphalt=mat('#343f53',{roughness:.98}),pavement=mat('#c7d4d4'),line=mat('#f7e4a3'),white=mat('#f8f6ec'),
  grass=mat('#629d71'),pink=mat('#e9959f'),red=mat('#d75f55'),brick=mat('#e6b9a1'),roof=mat('#ba675d'),
  blue=mat('#6dbac6'),gold=mat('#ffe381',{emissive:'#ffd063',emissiveIntensity:.28}),wood=mat('#886755'),
  tire=mat('#282e38'),glass=mat('#a4d9e8',{metalness:.18,roughness:.27}),bagFabric=mat('#d4aa63'),drawstring=mat('#78512f');
 const piece=(geo,m,x,y,z,sx,sy,sz,parent=group)=>make(geo,m,x,y,z,sx,sy,sz,parent);
 const colorFrom=arr=>arr.map(col=>mat(col));
 const shopColors=colorFrom(['#aad4bf','#ecab7e','#b7bedf','#eadba7']);
 const road=((x,z,sz,sx,rotation=0)=>{const mesh=piece(box,asphalt,x,height(x,z)+.09,z,sx,.15,sz);mesh.rotation.y=rotation;mesh.castShadow=false;return mesh;});
 // Two intersecting paved streets plus a circular seaside boulevard.
 for(let t=-34;t<=34;t+=4){
  road(CITY.x+t,CITY.z,4.3,6.7,Math.PI/2);
  road(CITY.x,CITY.z+t*.94,4.4,6.8);
  if(Math.abs(t)>6&&t%8===-2){const d=piece(box,line,CITY.x+t,height(CITY.x+t,CITY.z)+.2,CITY.z,2,.035,.17);d.castShadow=false;}
 }
 const boulevard=[];
 for(let i=0;i<64;i++){
  const a=(i+.5)/64*2*Math.PI,x=CITY.x+Math.cos(a)*31,z=CITY.z+Math.sin(a)*26;
  const path=road(x,z,4.2,4.5,-Math.atan2(Math.cos(a)*31,-Math.sin(a)*26));
  boulevard.push(path);
  if(i%3===0){const p=piece(box,line,x,height(x,z)+.2,z,1.0,.025,.13);p.rotation.y=path.rotation.y;p.castShadow=false;}
 }
 // Square sidewalks and crossing stripes around the town center.
 for(const [u,v,w,d] of [[-15,-13,12,6],[16,-13,13,6],[-16,13,12,6],[17,13,13,6]]){
  const x=CITY.x+u,z=CITY.z+v;
  piece(box,pavement,x,height(x,z)+.09,z,w,.16,d).castShadow=false;
 }
 for(let k=0;k<6;k++){
  for(const side of [-1,1]){
   const x=CITY.x+side*5,z=CITY.z-3+k*1.2;
   piece(box,white,x,height(x,z)+.20,z,.32,.035,.69).castShadow=false;
  }
 }
 // City skyline: colorful little shops and townhouses; pizza is the only restaurant.
 const buildings=[
  [-25,-19,6,7,0],[-10,-20,5,7,1],[12,-20,6,7,2],[26,-12,6,6,3],
  [-25,18,6,6,2],[-11,20,7,7,0],[13,21,7,6,3],[26,17,6,6,1]
 ];
 for(let i=0;i<buildings.length;i++){
  const [ox,oz,w,d,ci]=buildings[i],x=CITY.x+ox,z=CITY.z+oz,y=height(x,z),m=shopColors[ci];
  piece(box,m,x,y+2.3,z,w,4.6,d);
  piece(box,i%2?wood:roof,x,y+4.8,z,w+.55,.6,d+.6);
  for(const side of [-1,1]){
   const front=piece(box,glass,x+side*w*.26,y+2.5,z+d*.505,w*.28,1.45,.07);
   front.castShadow=false;
   piece(box,wood,x+side*w*.26,y+2.5,z+d*.548,.12,1.51,.11).castShadow=false;
  }
  piece(box,wood,x,y+.95,z+d*.55,1.35,1.85,.09);
 }
 // Pizzeria: unmistakable red-and-white storefront with an entry courtyard.
 const sx=CITY.restaurant.x,sz=CITY.restaurant.z,sy=height(sx,sz);
 const restaurant=new T.Group();restaurant.name='🍕 Pizza Restaurant';restaurant.position.set(sx,sy,sz);group.add(restaurant);
 piece(box,brick,0,2.55,0,11,5.1,8,restaurant);
 piece(box,roof,0,5.3,0,11.7,.6,8.6,restaurant);
 piece(box,glass,-2,2.35,4.1,3.0,2.15,.16,restaurant).castShadow=false;
 piece(box,glass,2,2.35,4.1,3.0,2.15,.16,restaurant).castShadow=false;
 piece(box,wood,0,1.7,4.13,1.55,3.4,.14,restaurant);
 piece(box,pavement,0,.04,5.9,7,.12,4,restaurant).castShadow=false;
 for(let i=0;i<8;i++){
  piece(box,i%2?white:red,-5.2+i*1.49,4.4,4.48,1.50,.56,2.2,restaurant).castShadow=false;
 }
 const oven=new T.Group();oven.position.set(-1,.05,-1);restaurant.add(oven);
 piece(cylinder,wood,0,.65,0,1.9,.25,1.9,oven);
 piece(ball,red,0,1.17,0,1.17,.25,1.17,oven);
 piece(ball,gold,0,1.42,0,.48,.07,.48,oven);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;piece(ball,i%2?pink:roof,Math.sin(a)*.61,1.49,Math.cos(a)*.61,.13,.055,.14,oven);}
 // Real street furniture, street lamps, and palm-lined plazas.
 for(const [ox,oz] of [[-32,-14],[-17,-27],[18,-28],[30,-4],[-30,14],[8,29]]){
  const x=CITY.x+ox,z=CITY.z+oz,y=height(x,z);
  piece(cylinder,wood,x,y+2,z,.12,4,.12);
  piece(ball,gold,x,y+4.15,z,.48,.48,.48);
  piece(cylinder,grass,x,y+.12,z,1.12,.24,1.12);
 }
 // The ONE drivable car in Isla Aventura.
 const car=new T.Group();car.name='Only drivable car — Pizza City';scene.add(car);
 const carBlue=mat('#66bada',{metalness:.18,roughness:.45}),carShade=mat('#397f9d'),frontLight=mat('#ffefb8',{emissive:'#e8d479',emissiveIntensity:.5});
 piece(box,carBlue,0,.12,0,2.15,.75,3.6,car);
 piece(box,carShade,0,.66,-.35,1.85,.78,1.65,car);
 for(const side of [-1,1]){
  piece(box,glass,side*.94,.65,-.40,.05,.55,1.25,car);
  for(const z of [-1.15,1.18]){
   const wheel=piece(cylinder,tire,side*1.1,-.30,z,.42,.30,.42,car);
   wheel.rotation.z=Math.PI/2;
   const hub=piece(cylinder,pavement,side*1.31,-.30,z,.18,.31,.18,car);hub.rotation.z=Math.PI/2;
  }
  piece(ball,frontLight,side*.76,.13,1.84,.23,.18,.1,car);
  piece(ball,red,side*.76,.12,-1.85,.19,.13,.09,car);
 }
 piece(box,wood,0,1.1,-.44,.42,.1,.35,car);
 const updateCar=()=>{const p=city.car;car.position.set(p.x,height(p.x,p.z)+.72,p.z);car.rotation.y=p.heading||0;};updateCar();
 // Unicode emoji billboards belong to collectible bags, not abstract gemstones.
 const iconCanvas=document.createElement('canvas');iconCanvas.width=128;iconCanvas.height=128;
 const ctx=iconCanvas.getContext('2d');
 if(ctx){ctx.clearRect(0,0,128,128);ctx.font='94px "Apple Color Emoji","Segoe UI Emoji",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('💰',64,64);}
 const texture=new T.CanvasTexture(iconCanvas),spriteMaterial=new T.SpriteMaterial({map:texture,transparent:true,depthTest:false,depthWrite:false});
 // A giant pizza emoji above the restaurant is readable from the road.
 const pizzaCanvas=document.createElement('canvas');pizzaCanvas.width=128;pizzaCanvas.height=128;
 const pizzaContext=pizzaCanvas.getContext('2d');
 if(pizzaContext){pizzaContext.font='106px "Apple Color Emoji","Segoe UI Emoji",sans-serif';pizzaContext.textAlign='center';pizzaContext.textBaseline='middle';pizzaContext.fillText('🍕',64,64);}
 const pizzaTexture=new T.CanvasTexture(pizzaCanvas);
 const pizzaMaterial=new T.SpriteMaterial({map:pizzaTexture,transparent:true,depthTest:false,depthWrite:false});
 const pizzaSign=new T.Sprite(pizzaMaterial);pizzaSign.position.set(sx,sy+8.4,sz+4);
 pizzaSign.scale.set(5,5,1);pizzaSign.renderOrder=49;scene.add(pizzaSign);
 const bags=[];
 for(const b of MONEY_BAGS){
  if(city.bags.includes(b.id))continue;
  const root=new T.Group();root.position.set(b.x,height(b.x,b.z),b.z);root.name='💰 Money bag '+b.id;scene.add(root);
  piece(ball,bagFabric,0,.40,0,.5,.55,.36,root);
  piece(cylinder,drawstring,0,.83,0,.27,.16,.27,root);
  const icon=new T.Sprite(spriteMaterial);icon.position.set(0,1.78,0);icon.scale.set(2.2,2.2,1);icon.renderOrder=48;root.add(icon);
  bags.push({id:b.id,x:b.x,z:b.z,root,icon});
 }
 const status=document.createElement('div');status.className='pizza-city-status';status.hidden=true;
 status.setAttribute('aria-live','polite'); 
 const sign=document.createElement('div');sign.className='pizza-city-prompt';sign.textContent='🍕 '+(es?'Pizzería':'Pizza Place');sign.hidden=true;
 // Host is supplied by the caller to anchor UI on top of the WebGL canvas.
 function attach(host){if(host){host.append(status,sign);}}
 function isHere(x,z){return Math.hypot((x-CITY.x)/CITY.rx,(z-CITY.z)/CITY.rz)<1.0;}
 function nearCar(x,z){return Math.hypot(x-city.car.x,z-city.car.z)<4;}
 function canDrive(x,z){return Math.hypot((x-CITY.x)/CITY.rx,(z-CITY.z)/CITY.rz)<.87;}
 function hitCar(raycaster,x,z){return nearCar(x,z)||Math.hypot(x-city.car.x,z-city.car.z)<13&&raycaster.intersectObject(car,true).length>0;}
 function hitBag(raycaster,x,z){
  for(const bag of bags){
   if(Math.hypot(bag.x-x,bag.z-z)>45)continue;
   if(raycaster.intersectObject(bag.root,true).length)return {x:bag.x,z:bag.z,id:bag.id};
  }
  return null;
 }
 // Caller owns the coin-award function.
 let coinAward=()=>0;
 function setCoinAward(fn){coinAward=fn||(()=>0);}
 function order(){city.pizzas=Math.min(999,city.pizzas+1);const coins=coinAward('city-pizza');
  joy.effect('correct');save();refresh();
  tell((es?'🍕 ¡Pizza lista! ':'🍕 Fresh pizza! ')+(coins?' +3 🪙':''));return city.pizzas;}
 function update(dt,active,{x,z,driving=false,flying=false,indoors=false}={}){
  if(driving)updateCar();
  const here=isHere(x,z)&&!indoors;
  status.hidden=!here;
  if(here)status.textContent='💰 '+city.bags.length+'/'+MONEY_BAGS.length+'   🚙 '+(es?'Auto':'Car')+'   🍕 '+city.pizzas;
  sign.hidden=!here||Math.hypot(x-sx,z-sz)>16;
  if(!active||flying||indoors)return;
  for(let i=bags.length-1;i>=0;i--){
   const b=bags[i];b.icon.position.y=1.74+Math.sin(performance.now()*.003+i)*.16;
   if(Math.hypot(x-b.x,z-b.z)<(driving?2.6:1.6)&&!city.bags.includes(b.id)){
    city.bags.push(b.id);scene.remove(b.root);bags.splice(i,1);
    const coins=coinAward('city-'+b.id);
    save();refresh();joy.effect('coin');
    tell('💰 '+(es?'¡Bolsa de dinero!':'Money bag!')+' +'+coins+' 🪙');
   }
  }
 }
 function dispose(){status.remove();sign.remove();scene.remove(group,car,pizzaSign);for(const b of bags)scene.remove(b.root);spriteMaterial.dispose();texture.dispose();pizzaMaterial.dispose();pizzaTexture.dispose();}
 return {attach,update,nearCar,canDrive,hitCar,hitBag,updateCar,order,setCoinAward,isHere,car,dispose};
}

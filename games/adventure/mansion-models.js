import {botanicalGeometry} from './botanical-geometry.js?v=225';
import {HOME_WALLS} from './mansion-state.js?v=225';
export function mansionPalette({mat,surfaces}){return {wall:mat('#eee9de',{map:surfaces?.plaster,roughness:.8}),stone:mat('#c5c0b4',{roughness:.7}),wood:mat('#9b7653',{map:surfaces?.wood,roughness:.55}),glass:mat('#416578',{metalness:.25,roughness:.18}),white:mat('#faf7ef',{roughness:.45}),black:mat('#20292e',{roughness:.35}),gold:mat('#ac9561',{metalness:.7,roughness:.25}),fabric:mat('#d9a2c7',{roughness:1}),water:mat('#54bdc7',{metalness:.2,roughness:.15}),green:mat('#426c49'),steel:mat('#bac6ca',{metalness:.8,roughness:.22})};}
export function makeDog({T,make,box,ball,cylinder,mat},parent){const g=new T.Group();g.name='Coco · Angelique’s dog';parent.add(g);const fur=mat('#c49b66'),cream=mat('#e7d4ad'),dark=mat('#302820');const p=(geo,m,x,y,z,a,b,c)=>make(geo,m,x,y,z,a,b,c,g);p(ball,fur,0,.53,0,.28,.29,.55);p(ball,cream,0,.86,.38,.25,.26,.28);p(ball,cream,0,.76,.64,.17,.13,.19);p(ball,dark,0,.8,.81,.09,.07,.05);for(const x of [-.15,.15]){p(ball,dark,x,.94,.59,.035,.04,.035);p(ball,fur,x*1.65,.83,.32,.11,.25,.16);}const legs=[];for(const x of [-.19,.19])for(const z of [-.35,.3])legs.push(p(cylinder,fur,x,.25,z,.07,.45,.08));const tail=p(cylinder,fur,0,.67,-.64,.07,.5,.07);tail.rotation.x=-.9;return {g,legs,tail};}
export function mansionBase(height,lot){let y=0;for(let x=-13;x<=13;x+=6.5)for(let z=-12;z<=12;z+=6)y=Math.max(y,height(lot.x+x,lot.z+z));return y;}
export function exteriorMansion(o,lot,stage,style){const {T,scene,make,box,cylinder,ball,height}=o,m=mansionPalette(o),root=new T.Group();root.name='Angelique’s mansion · '+lot.id;root.position.set(lot.x,mansionBase(height,lot),lot.z);scene.add(root);const p=(geo,mat,x,y,z,a,b,c)=>make(geo,mat,x,y,z,a,b,c,root),b=(mat,x,y,z,a,b,c)=>p(box,mat,x,y,z,a,b,c);const wall=style==='sand'?o.mat('#d8c3a2'):m.wall;root.userData.wallMaterial=wall;
 b(m.stone,0,-3,0,27,6,25);b(m.stone,0,.12,0,27,.25,25);b(m.wood,0,.3,0,23,.3,20);
 const approach=height(lot.x,lot.z+17),rise=root.position.y+.46-approach;
 for(let i=0;i<7;i++){const top=rise*(1-i/7)+approach-root.position.y;b(m.stone,0,top-.22,12.65+i*.6,4.6,.44,.65);}
 if(stage===0){for(const x of [-11,11])for(const z of [-9,9])p(cylinder,m.gold,x,1,z,.1,2,.1);for(let i=0;i<7;i++)b(m.wood,-7+i*.45,.8,4,.3,1.1,3);return root;}
 for(const x of [-10,10])b(wall,x,2.1,0,.4,4.2,17);b(wall,0,2.1,-8.4,20,4.2,.4);
 for(const x of [-7,7])b(wall,x,1.95,7.9,6,3.9,.35);
 if(stage<2){for(const x of [-10,-5,0,5,10])p(cylinder,m.steel,x,4,0,.08,3,.08);return root;}
 b(m.stone,0,4.35,0,22,.32,18);b(m.white,-6,5,-3,8,.3,8);b(m.glass,6,3.2,-3,7,1.6,9);b(m.stone,6,4.2,-3,8,.2,10);
 for(const x of [-7,7]){b(m.glass,x,2.1,8.12,4.5,2.7,.07);for(const dx of [-2.3,0,2.3])b(m.gold,x+dx,2.1,8.2,.09,2.8,.09);}
 b(m.wood,0,1.7,8.3,2.3,3.2,.18);b(m.gold,.7,1.5,8.43,.08,.8,.08);b(m.stone,0,.3,10,5,.3,3);
 for(const x of [-3.8,3.8]){p(cylinder,m.stone,x,2.2,9,.2,4,.2);b(m.wood,x,4.3,9,1,.2,4);}
 b(m.white,0,4.5,9,10,.25,4);for(let x=-4.5;x<5;x+=.55)b(m.wood,x,4.75,9,.12,.18,4);
 if(stage<3)return root;
 b(m.stone,9,.45,10,6,.2,4);b(m.water,9,.58,10,5.3,.08,3.3);
 for(const x of [-11,11])for(const z of [-10,4]){b(m.stone,x,.5,z,1.6,1,1.6);p(ball,m.green,x,1.4,z,.9,1,.9);}

 // Clear private forecourt, driveway and tethered sightseeing balloon.
 for(let z=18;z<34;z+=2){const y=height(lot.x,lot.z+z)-root.position.y;b(m.stone,0,y+.03,z,4,.08,1.8);}const driveY=height(lot.x+16,lot.z+20)-root.position.y;b(m.stone,16,driveY-.08,20,6,.16,9);
 for(const x of [-22,22])for(let z=15;z<34;z+=5){b(m.white,x,.45,z,1.5,.9,1.5);p(ball,m.green,x,1.6,z,1,1.1,1);}
 const canopy=o.mat('#e992bf'),basket=o.mat('#aa784b');
 p(ball,canopy,-18,11,23,3.7,4.7,3.7);p(ball,m.white,-18,7.7,23,1.7,1.4,1.7);
 b(basket,-18,3,23,2.3,1.2,2);for(const dx of [-.9,.9])for(const dz of [-.8,.8])p(cylinder,m.gold,-18+dx,5,23+dz,.025,3.7,.025);
 for(const dx of [-2,2]){const rope=p(cylinder,m.white,-18+dx,2,23,.025,4,.025);rope.rotation.z=dx*.2;}
 if(stage<4)return root;
 for(const x of [-8,-6]){b(m.wood,x,.7,10,1.4,.18,2.8);b(m.white,x,.9,10,1.2,.2,2.6);}
 b(m.black,-7,2,-8.65,4,2,.15);for(let i=0;i<8;i++)b(m.gold,-8.8+i*.5,2,-8.78,.05,1.9,.1);
 return root;}
export function mansionInterior(o,cfg,onUse){const {T,scene,make,box,cylinder,ball}=o,m=mansionPalette(o),root=new T.Group();root.name='Private mansion · six connected rooms';root.position.set(0,0,280);root.visible=false;scene.add(root);const p=(geo,mat,x,y,z,a,b,c)=>make(geo,mat,x,y,z,a,b,c,root),b=(mat,x,y,z,a,b,c)=>p(box,mat,x,y,z,a,b,c),props=[];
 function spot(id,x,z,en,es){props.push({id,x,z,enName:en,esName:es,fn:()=>onUse(id)});}
 // Cutaway roof gives a clear third-person view; walls and doorways remain solid.
 b(m.stone,0,-.15,0,30,.3,29);for(const x of [-9,9])for(const z of [-9,0,9])b(m.wood,x,.015,z,11.6,.025,8.5);
 for(const x of [-15,15])b(m.wall,x,1.6,0,.25,3.2,29);for(const x of [-8.5,8.5])b(m.wall,x,1.6,-14.5,13,3.2,.25);
 const partitions=[];for(const wall of HOME_WALLS)partitions.push(b(m.wall,wall.x,.7,wall.z,wall.w,1.4,wall.d));const ceiling=b(m.white,0,3.65,0,30,.2,29);ceiling.visible=false;
 // Trim, glazing and framed outdoor views.
 for(const x of [-10,0,10]){b(m.gold,x,2,-14.3,3.8,2,.08);b(m.glass,x,2,-14.2,3.6,1.8,.08);b(m.white,x,2,-14.1,.05,1.85,.06);}
 for(let z=-12;z<=12;z+=3)b(m.gold,0,.035,z,.035,.025,2.8);
 // Kitchen: cabinets, marble island, sink, hob, oven and refrigerator.
 b(m.white,-12,1,-12,3,2,2);b(m.stone,-12,2.05,-12,3.2,.15,2.2);b(m.steel,-12,2.15,-12,.9,.08,.8);p(cylinder,m.steel,-12,2.4,-12.5,.045,.6,.045);
 b(m.white,-9,1,-7,5,2,1.5);b(m.stone,-9,2.05,-7,5.2,.16,1.7);b(m.black,-8.7,2.16,-7,1.5,.04,1);for(const x of [-9.1,-8.3])for(const z of [-7.25,-6.75])p(cylinder,m.steel,x,2.21,z,.2,.035,.2);
 b(m.black,-9,1,-6.22,1.4,1.1,.08);b(m.steel,-5,1.7,-12,1.6,3.4,1.5);b(m.black,-5,1.7,-11.22,.025,3.2,.035);spot('cook',-7,-9,'Cook in the kitchen','Cocinar en la cocina');
 // Dining room: table, chairs and pendant lighting.
 b(m.wood,9,1.1,-9,5,.2,2.5);for(const x of [7,11])for(const z of [-10.9,-7.1]){b(m.fabric,x,.65,z,.9,.2,.9);b(m.fabric,x,1.1,z+(z<-9?-.4:.4),.9,.9,.15);for(const dx of [-.32,.32])p(cylinder,m.gold,x+dx,.3,z,.045,.6,.045);}
 for(const x of [8,10])p(cylinder,m.white,x,1.24,-9,.4,.04,.4);p(ball,m.gold,9,3.5,-9,.7,.25,.7);spot('dine',7,-7,'Serve and eat a meal','Servir y comer');
 // Bedroom: upholstered king bed, side tables and reading nook.
 b(m.wood,-10,.45,0,4,.8,5);b(m.white,-10,1,0,3.8,.35,4.8);b(m.fabric,-10,1.2,.7,3.85,.18,3.2);b(m.fabric,-10,1.5,-2.4,4.2,2,.25);for(const x of [-11,-9])b(m.white,x,1.3,-1.6,1.5,.25,.8);
 for(const x of [-13,-7]){b(m.wood,x,.6,-1.5,1,.9,1);p(cylinder,m.gold,x,1.3,-1.5,.04,.6,.04);p(ball,m.white,x,1.7,-1.5,.35,.25,.35);}spot('rest',-6,1,'Rest in your bedroom','Descansar en tu habitación');
 // A real computer desk: screen, tower, keyboard, mouse and desk chair.
 b(m.white,-7,1.05,-3.5,3.2,.18,1.25);for(const x of [-8.3,-5.7])b(m.gold,x,.5,-3.5,.08,1,.8);
 b(m.gold,-7,1.5,-3.85,.14,.8,.12);b(m.white,-7,2,-3.85,1.8,1.1,.12);
 b(o.mat('#9bcee5',{emissive:'#55788b',emissiveIntensity:.3}),-7,2,-3.77,1.62,.91,.03);
 b(m.fabric,-7,1.18,-3.2,1.2,.08,.35);for(let i=0;i<12;i++)b(m.white,-7.5+i*.09,1.23,-3.2,.055,.025,.22);
 p(ball,m.gold,-6,1.2,-3.2,.12,.045,.17);b(m.fabric,-6.6,.55,-2.3,1,.16,.8);spot('computer',-5.5,-2,'💻 Play on my computer','💻 Jugar en mi computadora');
 // Favourite things: plush bunny, books, jewellery and a star cushion.
 p(ball,m.fabric,-10.9,1.6,-1.5,.27,.32,.2);p(ball,m.white,-10.9,1.95,-1.5,.22,.2,.18);
 for(const x of [-11.03,-10.77])p(ball,m.white,x,2.2,-1.5,.06,.23,.06);
 for(let i=0;i<5;i++)b(i%2?m.fabric:m.white,-12.9+i*.14,1.15,-1.5,.11,.48,.5);

 // Walk-in wardrobe: hanging rails, dresses, drawers and a mirror.
 b(m.wood,13,1.6,0,2,3.2,7);for(let z=-2.8;z<3;z+=.7){b(m.fabric,11.9,1.9,z,.12,1.8,.45);p(cylinder,m.gold,11.9,2.9,z,.04,.3,.04);}b(m.glass,14.72,1.8,-1,.08,3,2.3);b(m.white,9,.5,1,2,.8,1.4);spot('wardrobe',9,-1,'Choose an outfit','Elegir ropa');
 // Games lounge with couch, Xbox-style console and a large screen.
 b(m.fabric,-12,.65,10,2,1.1,4);b(m.fabric,-13,1.3,10,.4,1.6,4.3);b(m.wood,-5,.5,10,1,.8,4.2);const screen=b(m.black,-4.6,2.1,10,.15,2.6,4);screen.name='Mansion games screen';b(m.glass,-4.49,2.1,10,.05,2.35,3.75);b(m.black,-5,1.25,8.7,.5,.8,.5);p(ball,o.mat('#65b540',{emissive:'#65b540',emissiveIntensity:.4}),-4.72,1.4,8.7,.04,.04,.04);spot('xbox',-8,9,'Play Xbox in the lounge','Jugar Xbox en la sala');
 // Spa bathroom and laundry nook.
 b(m.white,11,.7,8,4,1.2,3);b(m.water,11,1.33,8,3.4,.04,2.4);b(m.stone,12,1,12.5,3,1.5,1);p(cylinder,m.white,12,1.8,12.5,.5,.15,.4);b(m.glass,12,2.4,13.1,2,1,.05);spot('bath',8,8,'Use the spa bath','Usar el baño spa');
 b(m.white,5,1.2,12.2,1.6,2.4,1.4);const washer=p(cylinder,m.glass,5,1.2,11.45,.55,.07,.55);washer.rotation.x=Math.PI/2;spot('laundry',5,10.5,'Wash and fold clothes','Lavar y doblar ropa');
 // Entry and dog’s own corner.
 b(m.fabric,0,.04,10,4,.07,5);p(cylinder,m.gold,1.7,.2,11,.42,.15,.42);p(cylinder,m.water,1.7,.29,11,.34,.04,.34);b(m.fabric,-1.5,.18,11,1.6,.3,1.8);spot('dog',0,10,'Care for Coco','Cuidar a Coco');b(m.white,1.8,.8,7,1.2,.14,1);b(m.gold,1.8,.4,7,.12,.8,.12);b(m.black,1.8,.92,7,.28,.06,.5);spot('phone',0,7,'📱 Call my friends','📱 Llamar a mis amigas');spot('lights',0,-11,'Switch house lights','Cambiar luces');
 const lamps=[];for(const x of [-8,8])for(const z of [-9,0,9]){const light=new T.PointLight('#fff1d6',5,15,1.6);light.position.set(x,3,z);root.add(light);lamps.push(light);}
 const meal=p(cylinder,m.white,10,1.3,-9,.45,.1,.45);meal.name='Prepared meal';make(ball,m.green,0,1.3,0,.65,1.4,.65,meal);
 const fetchBall=p(ball,o.mat('#d98e48'),0,.15,5,.16,.16,.16);fetchBall.name='Dog fetch ball';fetchBall.visible=false;
 const steam=[];for(let i=0;i<5;i++){const puff=p(ball,o.mat('#ffffff',{transparent:true,opacity:.22,depthWrite:false}),10+i*.35,2,8,.22,.3,.22);puff.visible=false;steam.push(puff);}
 // Rugs, upholstery, cabinet hardware and framed art make each room distinct.
 const rug=o.mat('#b3a7a0',{roughness:1}),rose=o.mat('#bc8f87',{roughness:1});
 b(rug,-10,.04,0,6.4,.04,7);b(rug,-9,.04,9,8,.04,6);b(m.fabric,9,.04,-9,8,.04,5.5);
 for(const z of [8.6,10.1,11.4]){p(ball,m.fabric,-11.75,1.18,z,.65,.27,.6);p(ball,rose,-12.45,1.5,z,.28,.38,.4);}
 for(const x of [-12.8,-11.7,-10.6])b(m.gold,x,1.4,-10.96,.25,.055,.06);
 for(const x of [-10.8,-9.8,-8.8,-7.8])b(m.gold,x,1.4,-6.2,.3,.06,.06);
 for(const z of [-2.4,-1.1,.2,1.5,2.8]){b(m.wood,11.9,.65,z,.2,1.1,.9);b(m.gold,11.76,.8,z,.08,.06,.4);}
 for(const x of [-13,13])for(const z of [-11.7,-.5,10.7]){b(m.gold,x,2.15,z,1.25,1.5,.13);b(rose,x,2.15,z+.08,1.08,1.3,.06);p(ball,m.fabric,x,2.25,z+.13,.35,.4,.02);}
 for(const x of [-9,9]){b(m.gold,x,3,-14.03,4.2,.08,.08);for(const side of [-1,1])b(m.fabric,x+side*2,2,-13.95,.35,2.5,.12);}
 for(const z of [-12,0,12]){p(cylinder,m.gold,0,3.3,z,.06,.5,.06);p(ball,m.white,0,3.05,z,.45,.2,.45);}
 // Layered landscaped grounds frame the open dollhouse and its pool.
 const foliage=botanicalGeometry(T,o.geometry,'natural'),leaf=o.mat('#ffffff',{vertexColors:true,roughness:.85,side:T.DoubleSide});
 b(o.mat('#608159'),0,-.35,-12,62,.3,67);
 for(let i=0;i<14;i++){const x=i<7?-22:22,z=-36+(i%7)*8;p(cylinder,m.wood,x,2.2,z,.28,4.4,.28);p(foliage,leaf,x,4.6,z,.72,.72,.72);}
 for(let i=0;i<7;i++){const x=-21+i*7;p(cylinder,m.wood,x,2.2,-41,.25,4.4,.25);p(foliage,leaf,x,4.8,-41,.85,.85,.85);}
 // Private pool garden is connected through the central glass doors.
 const pink=o.mat('#e9b5cf',{roughness:.65}),tile=o.mat('#f8e9e4',{roughness:.4});
 b(tile,0,-.16,-25,30,.3,22);b(m.white,0,-.25,-26,21,.2,12);
 const poolWater=b(o.mat('#39bad2',{transparent:true,opacity:.78,roughness:.13,metalness:.18}),0,.12,-26,20.2,.08,11);
 poolWater.name='Private swimming pool';
 for(const x of [-10.5,10.5])b(m.white,x,.22,-26,.45,.45,12.4);for(const z of [-32,-20])b(m.white,0,.22,z,21.4,.45,.45);
 // Broad submerged steps let Angelique walk in and out without a teleport.
 for(let i=0;i<4;i++)b(m.white,0,.05-i*.12,-20.4-i*.45,3,.18,.48);
 for(const x of [-13,13])for(const z of [-25,-30]){b(m.gold,x,.3,z,.9,.6,2.5);b(pink,x,.65,z,1.4,.18,3);const back=b(pink,x,.95,z-.95,1.4,.18,1);back.rotation.x=-.55;}
 for(const x of [-14,14])for(const z of [-18,-34]){p(cylinder,m.white,x,.5,z,.6,1,.6);p(ball,m.green,x,1.6,z,.8,1,.8);p(ball,pink,x,2.1,z,.45,.3,.45);}
 for(let x=-13;x<=13;x+=2){p(cylinder,m.gold,x,.65,-35.5,.04,1.3,.04);}b(m.gold,0,1.3,-35.5,28,.05,.05);
 for(const x of [-2,2]){b(m.gold,x,1.6,-14.5,.08,3.2,.1);b(m.glass,x*1.8,1.6,-14.5,3,2.7,.05);}
 for(let i=0;i<10;i++){const a=i*Math.PI/5;p(ball,pink,11+Math.cos(a)*.65,.3,-18+Math.sin(a)*.65,.21,.14,.21);}
 spot('pool',0,-18,'🏊 Swim in my pool','🏊 Nadar en mi piscina');
 // Poolside refreshments, sun umbrellas and floating rings.
 for(const x of [-11,11]){p(cylinder,m.gold,x,1.9,-22,.055,3.8,.055);p(ball,pink,x,3.9,-22,2.3,.35,2.3);b(m.white,x,.7,-18,1.5,.12,1.5);p(cylinder,m.gold,x,.35,-18,.08,.7,.08);for(const dx of [-.3,.3])p(cylinder,pink,x+dx,.92,-18,.12,.35,.12);}
 const ring=o.geometry(new T.TorusGeometry(.7,.16,8,24));const float=p(ring,pink,4,.27,-28,1,1,1);float.rotation.x=Math.PI/2;
 // Pool play: additional floating rings, a shaded daybed, and poolside shower.
 for(const [x,z]of [[-5,-28],[1,-30]]){const r=p(ring,pink,x,.27,z,1,1,1);r.rotation.x=Math.PI/2;}
 b(m.wood,12,.3,-33,3,.5,3);b(pink,12,.65,-33,2.8,.2,2.8);
 for(const x of [10.7,13.3])p(cylinder,m.gold,x,2,-34,.055,4,.055);b(pink,12,4,-33,3.3,.12,3.3);
 p(cylinder,m.steel,-13,1.8,-33,.06,3.6,.06);b(m.steel,-12.7,3.6,-33,.7,.08,.5);
 const beachBall=p(ball,o.mat('#f5cf59'),-3,.45,-24,.45,.45,.45);beachBall.name='Pool beach ball';
 // Dressing-room vanity and warm rose accents give the home its dream-house character.
 b(m.white,6,.85,1.7,2,.14,1);b(m.gold,6,1.8,2.1,1.8,1.5,.07);b(m.glass,6,1.8,2.04,1.55,1.25,.04);
 for(const x of [5.3,6.7])for(const y of [1.3,1.8,2.3])p(ball,m.white,x,y,1.98,.065,.065,.065);
 for(let i=0;i<4;i++)p(cylinder,i%2?pink:m.gold,5.5+i*.3,1,1.7,.07,.22,.07);
 for(const x of [-14.7,14.7])for(const z of [-12,-8,0,8,12])b(pink,x,.15,z,.08,.25,2.5);
 const dog=makeDog(o,root);dog.g.position.set(-1.5,0,11);
 return {root,props,cfg,bounds:{x:14.5,z:35.5},dog,lamps,meal,fetchBall,steam,washer,partitions,ceiling};}

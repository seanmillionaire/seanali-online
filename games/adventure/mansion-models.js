import {HOME_WALLS} from './mansion-state.js?v=213';
export function mansionPalette({mat,surfaces}){return {wall:mat('#eee9de',{map:surfaces?.plaster,roughness:.8}),stone:mat('#c5c0b4',{roughness:.7}),wood:mat('#9b7653',{map:surfaces?.wood,roughness:.55}),glass:mat('#416578',{metalness:.25,roughness:.18}),white:mat('#faf7ef',{roughness:.45}),black:mat('#20292e',{roughness:.35}),gold:mat('#ac9561',{metalness:.7,roughness:.25}),fabric:mat('#b7a7c5',{roughness:1}),water:mat('#54bdc7',{metalness:.2,roughness:.15}),green:mat('#426c49'),steel:mat('#bac6ca',{metalness:.8,roughness:.22})};}
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
 if(stage<4)return root;
 for(const x of [-8,-6]){b(m.wood,x,.7,10,1.4,.18,2.8);b(m.white,x,.9,10,1.2,.2,2.6);}
 b(m.black,-7,2,-8.65,4,2,.15);for(let i=0;i<8;i++)b(m.gold,-8.8+i*.5,2,-8.78,.05,1.9,.1);
 return root;}
export function mansionInterior(o,cfg,onUse){const {T,scene,make,box,cylinder,ball}=o,m=mansionPalette(o),root=new T.Group();root.name='Private mansion · six connected rooms';root.position.set(0,0,280);root.visible=false;scene.add(root);const p=(geo,mat,x,y,z,a,b,c)=>make(geo,mat,x,y,z,a,b,c,root),b=(mat,x,y,z,a,b,c)=>p(box,mat,x,y,z,a,b,c),props=[];
 function spot(id,x,z,en,es){props.push({id,x,z,enName:en,esName:es,fn:()=>onUse(id)});}
 // Cutaway roof gives a clear third-person view; walls and doorways remain solid.
 b(m.stone,0,-.15,0,30,.3,29);for(const x of [-9,9])for(const z of [-9,0,9])b(m.wood,x,.015,z,11.6,.025,8.5);
 for(const x of [-15,15])b(m.wall,x,1.6,0,.25,3.2,29);b(m.wall,0,1.6,-14.5,30,3.2,.25);
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
 for(const x of [8,10])p(cylinder,m.white,x,1.24,-9,.4,.04,.4);p(ball,m.gold,9,3.5,-9,.7,.25,.7);spot('dine',6,-9,'Serve and eat a meal','Servir y comer');
 // Bedroom: upholstered king bed, side tables and reading nook.
 b(m.wood,-10,.45,0,4,.8,5);b(m.white,-10,1,0,3.8,.35,4.8);b(m.fabric,-10,1.2,.7,3.85,.18,3.2);b(m.fabric,-10,1.5,-2.4,4.2,2,.25);for(const x of [-11,-9])b(m.white,x,1.3,-1.6,1.5,.25,.8);
 for(const x of [-13,-7]){b(m.wood,x,.6,-1.5,1,.9,1);p(cylinder,m.gold,x,1.3,-1.5,.04,.6,.04);p(ball,m.white,x,1.7,-1.5,.35,.25,.35);}spot('rest',-6,1,'Rest in your bedroom','Descansar en tu habitación');
 // Walk-in wardrobe: hanging rails, dresses, drawers and a mirror.
 b(m.wood,13,1.6,0,2,3.2,7);for(let z=-2.8;z<3;z+=.7){b(m.fabric,11.9,1.9,z,.12,1.8,.45);p(cylinder,m.gold,11.9,2.9,z,.04,.3,.04);}b(m.glass,6,1.8,-3.9,2.3,3,.08);b(m.white,9,.5,1,2,.8,1.4);spot('wardrobe',9,-1,'Choose an outfit','Elegir ropa');
 // Games lounge with couch, Xbox-style console and a large screen.
 b(m.fabric,-12,.65,10,2,1.1,4);b(m.fabric,-13,1.3,10,.4,1.6,4.3);b(m.wood,-5,.5,10,1,.8,4.2);const screen=b(m.black,-4.6,2.1,10,.15,2.6,4);screen.name='Mansion games screen';b(m.glass,-4.49,2.1,10,.05,2.35,3.75);b(m.black,-5,1.25,8.7,.5,.8,.5);p(ball,o.mat('#65b540',{emissive:'#65b540',emissiveIntensity:.4}),-4.72,1.4,8.7,.04,.04,.04);spot('xbox',-8,9,'Play Xbox in the lounge','Jugar Xbox en la sala');
 // Spa bathroom and laundry nook.
 b(m.white,11,.7,8,4,1.2,3);b(m.water,11,1.33,8,3.4,.04,2.4);b(m.stone,12,1,12.5,3,1.5,1);p(cylinder,m.white,12,1.8,12.5,.5,.15,.4);b(m.glass,12,2.4,13.1,2,1,.05);spot('bath',8,8,'Use the spa bath','Usar el baño spa');
 b(m.white,5,1.2,12.2,1.6,2.4,1.4);const washer=p(cylinder,m.glass,5,1.2,11.45,.55,.07,.55);washer.rotation.x=Math.PI/2;spot('laundry',5,10.5,'Wash and fold clothes','Lavar y doblar ropa');
 // Entry and dog’s own corner.
 b(m.fabric,0,.04,10,4,.07,5);p(cylinder,m.gold,1.7,.2,11,.42,.15,.42);p(cylinder,m.water,1.7,.29,11,.34,.04,.34);b(m.fabric,-1.5,.18,11,1.6,.3,1.8);spot('dog',0,10,'Care for Coco','Cuidar a Coco');spot('lights',0,-11,'Switch house lights','Cambiar luces');
 const lamps=[];for(const x of [-8,8])for(const z of [-9,0,9]){const light=new T.PointLight('#fff1d6',5,15,1.6);light.position.set(x,3,z);root.add(light);lamps.push(light);}
 const meal=p(cylinder,m.white,10,1.3,-9,.45,.1,.45);meal.name='Prepared meal';p(ball,m.green,10,1.45,-9,.3,.15,.3);
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
 const dog=makeDog(o,root);dog.g.position.set(-1.5,0,11);
 return {root,props,cfg,bounds:{x:14.5,z:13.5},dog,lamps,meal,fetchBall,steam,washer,partitions,ceiling};}

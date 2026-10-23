import {GYM_HEIGHT} from './mansion-floors.js';
export function mansionStairs(o,parent,m,outside=false){const {T,make,box,cylinder}=o,g=new T.Group();g.name='Walkable mansion staircase';parent.add(g);const stairGlass=o.mat('#92bac3',{transparent:true,opacity:.22,roughness:.18,depthWrite:false});const b=(mat,x,y,z,w,h,d)=>make(box,mat,x,y,z,w,h,d,g);
 // Bottom landing opens from the ground-floor foyer; the top landing enters the gym.
 b(m.stone,-16.8,-.12,13,5.6,.24,2);b(m.stone,outside?-15.65:-16.8,GYM_HEIGHT-.12,-1,outside?7.9:5.6,.24,2);if(outside){b(m.wood,-13.5,GYM_HEIGHT+.08,-1,1,.16,1.8);b(m.wood,-12.5,GYM_HEIGHT+.255,-1,1,.19,1.8);}
 for(let i=0;i<24;i++){const h=(i+1)*GYM_HEIGHT/24,z=12-(i+.5)*.5;b(m.wood,-17.4,h-.09,z,3,.18,.51);}
 for(const x of [-18.8,-16])for(const z of [0,6,12]){const h=(12-z)*GYM_HEIGHT/12;b(m.steel,x,(h-3.1)/2,z,.16,h+2.9,.22);}
 for(const x of [-19,-15.8]){for(let i=0;i<=12;i++){const z=12-i,y=i*GYM_HEIGHT/12;make(cylinder,m.gold,x,y+.53,z,.035,1.06,.035,g);}const rail=b(m.gold,x,GYM_HEIGHT/2+1.08,6,.07,.07,Math.hypot(12,GYM_HEIGHT));rail.rotation.x=Math.atan2(GYM_HEIGHT,12);}
 for(const x of [-19.5,-15.35])b(stairGlass,x,2.5,6,.07,4.8,10);
 return g;}
export function mansionGym(o,parent,m,onUse=()=>{},outside=false){const {T,make,box,ball,cylinder,geometry,mat}=o,root=new T.Group();root.name=outside?'Exterior mansion gym':'Upstairs panoramic gym';root.position.y=outside?4.55:GYM_HEIGHT;parent.add(root);const p=(geo,ma,x,y,z,a,b,c,par=root)=>make(geo,ma,x,y,z,a,b,c,par),b=(ma,x,y,z,w,h,d,par=root)=>p(box,ma,x,y,z,w,h,d,par);
 const charcoal=mat('#26343b',{roughness:.82}),rose=mat('#e5a6c6',{roughness:.7}),teal=mat('#3baab5',{roughness:.75}),mirror=mat('#9cbfc8',{metalness:.6,roughness:.12}),blue=mat('#76d9ec',{emissive:'#4fc5dd',emissiveIntensity:.5}),oak=mat('#c3a57f',{roughness:.7}),glass=mat('#87bec8',{transparent:true,opacity:.25,metalness:.1,roughness:.18,depthWrite:false});
 b(oak,0,-.14,0,30,.28,29);for(let x=-14;x<15;x+=1.5)b(m.wood,x,.008,0,.025,.012,28.8);
 // Panoramic glass, brass rails and mirror wall frame the upstairs studio.
 b(m.wall,0,1.65,-14.5,30,3.3,.18);for(const x of [-9,-3,3,9])b(mirror,x,1.65,-14.37,5.7,2.7,.06);
 b(glass,15,1.6,0,.12,3.2,29);for(const [z,d]of [[-8.5,12],[7.5,14]])b(glass,-15,1.6,z,.12,3.2,d);
 b(glass,0,1.6,14.5,30,3.2,.12);for(const x of [-15,-9,-3,3,9,15]){b(m.gold,x,1.7,14.6,.07,3.4,.08);b(m.gold,x,1.7,-14.4,.07,3.4,.08);}
 const ceiling=new T.Group();ceiling.name='Roof with accessible hatch';root.add(ceiling);ceiling.visible=outside;
 // A real opening above the ladder, rather than a solid roof over its entrance.
 for(const [x,z,w,d]of [[-8.1,0,13.8,29],[8.1,0,13.8,29],[0,-2.875,2.4,23.25],[0,12.875,2.4,3.25]])b(m.white,x,3.55,z,w,.18,d,ceiling);
 for(const x of [-1.25,1.25])b(m.gold,x,3.7,10,.10,.3,2.5);b(m.gold,0,3.7,11.25,2.6,.3,.10);
 const hatch=b(m.glass,-1.35,4.4,10,.12,1.55,2.3);hatch.name='Open rooftop hatch';
 for(const x of [-.6,.6])b(m.steel,x,1.75,10,.09,3.5,.09);for(let i=0;i<10;i++)b(m.steel,0,.2+i*.34,10,1.2,.06,.09);
 for(const x of [-10,0,10]){b(charcoal,x,3.38,0,.09,.12,25);for(const z of [-8,0,8])b(blue,x,3.32,z,2.7,.025,.24);}
 // Full treadmill with belt rollers, incline deck, controls and handrails.
 const treadmill=new T.Group();treadmill.name='Interactive treadmill';treadmill.position.set(-8,0,-6);root.add(treadmill);
 b(charcoal,0,.18,0,2.2,.36,4,treadmill);b(m.steel,0,.27,0,1.98,.10,3.8,treadmill);b(charcoal,0,.34,0,1.55,.07,3.65,treadmill);
 const slats=[];for(let i=0;i<12;i++)slats.push(b(m.steel,0,.385,-1.65+i*.30,1.48,.012,.035,treadmill));
 for(const x of [-1,1]){b(rose,x,.75,-1.45,.12,1.3,.12,treadmill);b(m.steel,x,1.35,-.85,.09,.09,1.2,treadmill);}b(charcoal,0,1.48,-1.45,2,.48,.28,treadmill);b(blue,0,1.52,-1.27,.87,.28,.025,treadmill);for(const x of [-.7,-.5,.5,.7])p(ball,x<0?rose:teal,x,1.50,-1.27,.065,.06,.025,treadmill);
 // A second display treadmill, elliptical trainer and a neatly organized weight wall.
 const spare=treadmill.clone(true);spare.name='Guest treadmill';spare.position.x=-4.5;root.add(spare);
 for(const z of [3,6.5]){for(const x of [-13.1,-12.3])p(cylinder,m.steel,x,.65,z,.055,1.3,.055);b(charcoal,-12.7,1.1,z,1.5,.12,2.5);for(let i=0;i<3;i++){const zz=z-.8+i*.8;p(cylinder,m.steel,-12.7,1.3,zz,.045,.6,.045).rotation.z=Math.PI/2;for(const x of [-13.05,-12.35])p(cylinder,charcoal,x,1.3,zz,.19,.13,.19).rotation.z=Math.PI/2;}}
 // Yoga mats, exercise balls, towels and a refreshment station.
 const yogaMat=b(teal,7,.025,-7,3,.05,4.2);yogaMat.name='Interactive yoga mat';b(rose,7,.025,3,3,.05,4.2);b(rose,2,.025,-7,2.7,.05,4.2);
 for(const [x,z]of [[10,4],[12,4]])p(ball,x===10?rose:teal,x,.7,z,.7,.7,.7);
 b(m.white,11.8,.8,9.5,4,1.6,1.5);b(m.gold,11.8,1.66,9.5,4.15,.08,1.6);for(let i=0;i<4;i++){b(m.white,10.5+i*.45,1.78,9.4,.35,.12,.65);p(cylinder,teal,12.5,1.95,9.5,.14,.5,.14);}
 for(const x of [-12,12]){p(cylinder,m.white,x,.55,-12,.55,1.1,.55);p(ball,m.green,x,1.5,-12,.8,1.1,.8);}
 b(charcoal,3,2.1,-14.20,4,1.25,.10);b(blue,3,2.1,-14.13,3.7,.95,.035);
 const props=[{id:'roof',x:0,z:8,floor:1,enName:'🪜 Go onto the roof',esName:'🪜 Subir a la azotea',fn:()=>onUse('roof')},{id:'treadmill',x:-8,z:-2.8,floor:1,enName:'🏃 Treadmill rhythm run',esName:'🏃 Carrera en cinta',fn:()=>onUse('treadmill')},{id:'yoga',x:7,z:-4.8,floor:1,enName:'🧘 Yoga balance',esName:'🧘 Equilibrio de yoga',fn:()=>onUse('yoga')},{id:'stairsDown',x:-14,z:-1,floor:1,enName:'⬇️ Walk downstairs',esName:'⬇️ Bajar las escaleras',fn:()=>onUse('stairsDown')}];
 return {root,ceiling,props,slats,treadmill,yogaMat};}


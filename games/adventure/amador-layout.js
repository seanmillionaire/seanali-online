export const AMADOR_SHIFT=60;
// One placement contract for scenery, collisions, tree exclusions and parking.
export const AMADOR_VENUES=[
 {id:'fish',x:394,z:91,w:7,d:5,en:'Pacific Fish Kitchen',es:'Pescado del Pacífico',sign:'PESCADO · FISH',color:'#45a8b4',food:'fishPlate'},
 {id:'pizza',x:430,z:108,w:6,d:4,en:'Causeway Pizza',es:'Pizza de la Calzada',sign:'PIZZA · AMADOR',color:'#dc6c48',food:'pizza'},
 {id:'juice',x:445,z:143,w:6,d:4,en:'Sunset Juice Bar',es:'Bar de Jugos del Atardecer',sign:'JUGOS · JUICE BAR',color:'#caa23e',food:'raspao'}
].map(v=>({...v,z:v.z+AMADOR_SHIFT}));
export const AMADOR_BENCHES=[[420,110],[435,145],[453,180]].map(([x,z])=>({x:x-10,z:z+AMADOR_SHIFT}));
export const SHOW_CARS=[
 {id:'turquoise',name:'Brisa Turbo',paint:'#16bcb4',accent:'#f4df75',wing:true},
 {id:'violet',name:'Noche Violeta',paint:'#8049bf',accent:'#e7a8ec',wing:true},
 {id:'orange',name:'Sol Naranja',paint:'#ee7834',accent:'#202c40',wing:false},
 {id:'blue',name:'Azul Pacífico',paint:'#2378cd',accent:'#ebdfca',wing:false}
];
export const AMADOR_BAYS=SHOW_CARS.map((c,i)=>({id:c.id,x:461,z:174+AMADOR_SHIFT+i*4,heading:-Math.PI/2}));
export const amadorEvening=hour=>hour>=17&&hour<23;
export const amadorReserved=(x,z,pad=0)=>AMADOR_BENCHES.some(p=>Math.hypot(x-p.x,z-p.z)<2+pad)||AMADOR_VENUES.some(p=>Math.abs(x-p.x)<p.w/2+pad+2&&Math.abs(z-p.z)<p.d/2+pad+5)||(x>447-pad&&x<467+pad&&z>167+AMADOR_SHIFT-pad&&z<193+AMADOR_SHIFT+pad);
export const amadorBlocked=(x,z,pad=.32)=>AMADOR_BENCHES.some(p=>Math.abs(x-p.x)<1.25+pad&&Math.abs(z-p.z)<.4+pad)||AMADOR_VENUES.some(p=>(Math.abs(x-p.x)<p.w/2+pad&&Math.abs(z-p.z)<p.d/2+pad)||[-1,1].some(side=>Math.abs(x-p.x-side*(p.w/2-1))<.7+pad&&Math.abs(z-p.z-p.d/2-3)<1.15+pad));
export function normalizeShowFleet(raw){return SHOW_CARS.map(c=>{const s=Array.isArray(raw)?raw.find(s=>s?.id===c.id):null;return {id:c.id,distance:Number.isFinite(s?.distance)?Math.max(0,Math.min(20000,s.distance)):0,parked:s?.parked!==false};});}

// Only points on the former Amador land/road move; Contadora and its estate do not.
export function migrateAmador(raw){
 if(!raw||raw.amadorLayoutVersion===1)return raw;
 const oldIslands=[[397,80,24,21],[420,110,14,12],[435,145,14,13],[453,180,17,14]],road=[[390,-20],[405,70],[420,110],[435,145],[453,180]];
 const move=p=>{if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.z))return p;const {x,z}=p;if(x<380||x>472||z< -20||z>196)return p;const on=oldIslands.some(([cx,cz,rx,rz])=>Math.hypot((x-cx)/rx,(z-cz)/rz)<1)||road.slice(1).some((q,i)=>{const a=road[i],dx=q[0]-a[0],dz=q[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz)<9;});return on?{...p,z:z+AMADOR_SHIFT*Math.max(0,Math.min(1,(z+20)/90))}:p;};
 const next={...move(raw),amadorLayoutVersion:1,showFleet:normalizeShowFleet()};if(raw.city)next.city={...raw.city,car:move(raw.city.car),parkedCar:move(raw.city.parkedCar)};if(raw.boat)next.boat=move(raw.boat);if(raw.estate)next.estate={...raw.estate,buildings:Array.isArray(raw.estate.buildings)?raw.estate.buildings.map(move):raw.estate.buildings};if(raw.builders)next.builders=Object.fromEntries(Object.entries(raw.builders).map(([id,b])=>[id,{...b,completed:Array.isArray(b?.completed)?b.completed.map(move):b?.completed}]));return next;
}

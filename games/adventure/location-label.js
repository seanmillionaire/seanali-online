import {mainlandContains,canalWater,gatunWater} from './geography.js?v=155';
import {CITY_HOSPITAL} from './volcano-safety.js?v=155';
import {worldIslands,roadDistance,HIGHWAY_WIDTH} from './explore-state.js?v=155';
const mainland=[
 {id:'gorgona',x:0,z:0,rx:21,rz:15,icon:'🏖️',es:'Playa Gorgona',en:'Gorgona Beach'},
 {id:'volcanTown',x:-155,z:-32,rx:15,rz:13,icon:'🏘️',es:'Volcán · Chiriquí',en:'Volcán Town · Chiriquí'}
];
const icons={islet:'🦋',wilds:'🌴',coconutCoast:'🏖️',sunset:'🌋',crystalCove:'🏝️',pizzaCity:'🏙️',colon:'🌧️',monkeyIslet:'🐒'};
const places=[...mainland,{id:'boquete',x:-112,z:-32,rx:13,rz:12,icon:'🌿',es:'Boquete · Chiriquí',en:'Boquete · Chiriquí'},...worldIslands];
export function locationLabel(x,z,lang='es',{cruising=false,interior=null,tower=false}={}){
 const es=lang==='es',name=p=>p[es?'es':'en'],label=p=>(p.icon||icons[p.id]||'🏝️')+' '+name(p);
 if(Math.hypot(x-CITY_HOSPITAL.spawn.x,z-CITY_HOSPITAL.spawn.z)<4)return '🏥 '+(es?'Hospital · Ciudad de Panamá':'Hospital · Panama City');
 if(interior)return '🏠 '+interior;
 if(tower)return '🗼 '+(es?'Faro · Playa Gorgona':'Lighthouse · Gorgona Beach');
 const monkey=worldIslands.find(p=>p.id==='monkeyIslet');if(Math.hypot((x-monkey.x)/monkey.rx,(z-monkey.z)/monkey.rz)<=1)return label(monkey);
 if(gatunWater(x,z))return '🐒 '+(es?'Lago Gatún · Isla de los Monos':'Gatún Lake · Monkey Island');
 if(cruising&&z< -145)return '🌊 '+(es?'Mar Caribe · Colón':'Caribbean Sea · Colón');
 if(cruising&&z<=-115)return '🌊 '+(es?'Frente a Colón':'Off Colón');
 if(canalWater(x,z)&&Math.hypot(x+10,z+125)>32)return '🚢 '+(es?'Canal de Panamá':'Panama Canal');
 // Prefer small named places over a larger overlapping region.
 const inside=places.filter(p=>Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)<=1).sort((a,b)=>a.rx*a.rz-b.rx*b.rz)[0];
 if(inside)return label(inside);
 if(!cruising&&roadDistance(x,z)<HIGHWAY_WIDTH/2+1){
  const route=x< -30?(es?'Gorgona · Volcán · Barú':'Gorgona · Volcán · Barú'):z< -65?'Gorgona · Colón':(es?'Ciudad de Panamá · Gorgona':'Panama City · Gorgona');
  return '🛣️ '+route;
 }
 if(mainlandContains(x,z)&&!cruising)return '🇵🇦 '+(es?'Panamá · Tierra firme':'Panama · Mainland');
 const nearest=places.reduce((best,p)=>{
  const d=Math.max(0,Math.hypot(x-p.x,z-p.z)-Math.max(p.rx,p.rz));
  return !best||d<best.distance?{place:p,distance:d}:best;
 },null).place;
 return (cruising?'🚢 ':'🌊 ')+(es?'Frente a ':'Off ')+name(nearest);
}

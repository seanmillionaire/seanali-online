import {freewayDistance} from './city-freeway-layout.js';
import {gorgonaShoreZ} from './gorgona-shore.js';
import {districtNeighborhood} from './expanded-districts.js';
import {jungleContains} from './east-jungle-layout.js';
import {mainlandContains,canalWater,gatunWater} from './geography.js?v=225';
import {CITY_HOSPITAL} from './volcano-safety.js?v=225';
import {worldIslands,roadDistance,HIGHWAY_WIDTH} from './explore-state.js?v=225';
const mainland=[
 {id:"costaArriba",x:110,z:-399,rx:110,rz:66,icon:"🏘️",es:"Costa Arriba · Colón",en:"Costa Arriba · Colón"},
 {id:'chame',x:-35,z:-3,rx:118,rz:55,icon:'🌴',es:'Chame · Panamá Oeste',en:'Chame · Panamá Oeste'},
 {id:'volcanTown',x:-385,z:-30,rx:15,rz:13,icon:'🏘️',es:'Volcán · Chiriquí',en:'Volcán Town · Chiriquí'}
];
const icons={islet:'🦋',wilds:'🌴',coconutCoast:'🏖️',sunset:'🌋',crystalCove:'🏝️',pizzaCity:'🏙️',colon:'🌴',monkeyIslet:'🐒'};
const places=[...mainland,{id:'boquete',x:-289,z:-79,rx:47,rz:50,icon:'🌿',es:'Boquete · Chiriquí',en:'Boquete · Chiriquí'},...worldIslands];
export function locationLabel(x,z,lang='es',{cruising=false,interior=null,tower=false}={}){
 if(x> -188&&x< -64&&z> -430&&z< -360)return '🛍️ Margarita · Colón 2000';
 const es=lang==='es',name=p=>p[es?'es':'en'],label=p=>(p.icon||icons[p.id]||'🏝️')+' '+name(p);
 if(!interior&&!tower&&!cruising&&freewayDistance(x,z)<9)return es?'🛣️ Anillo de la Ciudad · Crucero':'🛣️ City Freeway · Cruise Loop';
 if(!interior&&!tower&&districtNeighborhood(x,z)==='panama-east')return '🌆 Costa del Este · '+(es?'Ciudad de Panamá':'Panama City');
 if(jungleContains(x,z)&&x>490)return es?'🌳 Darién · Selva del Este':'🌳 Darién · Eastern Jungle';
 if(Math.hypot(x-CITY_HOSPITAL.spawn.x,z-CITY_HOSPITAL.spawn.z)<4)return '🏥 '+(es?'Hospital · Ciudad de Panamá':'Hospital · Panama City');
 if(interior)return '🏠 '+interior;
 if(tower)return '🗼 '+(es?'Faro · Isla Grande':'Lighthouse · Isla Grande');
 const monkey=worldIslands.find(p=>p.id==='monkeyIslet');if(Math.hypot((x-monkey.x)/monkey.rx,(z-monkey.z)/monkey.rz)<=1)return label(monkey);
 if(gatunWater(x,z))return '🐒 '+(es?'Lago Gatún · Isla de los Monos':'Gatún Lake · Monkey Island');
 if(cruising&&z< -145)return '🌊 '+(es?'Mar Caribe · Colón':'Caribbean Sea · Colón');
 if(cruising&&z<=-115)return '🌊 '+(es?'Frente a Colón':'Off Colón');
 if(canalWater(x,z)&&Math.hypot(x+10,z+125)>32)return '🚢 '+(es?'Canal de Panamá':'Panama Canal');
 // Gorgona names the shoreline; Chame names the surrounding mainland.
 if(x>=-104&&x<=112){const shore=gorgonaShoreZ(x);if(z>=Math.max(7,shore-10)&&z<=shore+3)return es?'🏖️ Playa Gorgona · Chame':'🏖️ Gorgona Beach · Chame';}
 // Prefer small named places over a larger overlapping region.
 const inside=places.filter(p=>Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)<=1).sort((a,b)=>a.rx*a.rz-b.rx*b.rz)[0];
 if(inside)return label(inside);
 if(!cruising&&roadDistance(x,z)<HIGHWAY_WIDTH/2+1){
  const route=x< -30?(es?'Chame · Volcán · Barú':'Chame · Volcán · Barú'):z< -65?'Chame · Colón':(es?'Ciudad de Panamá · Chame':'Panama City · Chame');
  return '🛣️ '+route;
 }
 if(mainlandContains(x,z)&&!cruising)return '🇵🇦 '+(es?'Panamá · Tierra firme':'Panama · Mainland');
 const nearest=places.reduce((best,p)=>{
  const d=Math.max(0,Math.hypot(x-p.x,z-p.z)-Math.max(p.rx,p.rz));
  return !best||d<best.distance?{place:p,distance:d}:best;
 },null).place;
 return (cruising?'🚢 ':'🌊 ')+(es?'Frente a ':'Off ')+name(nearest);
}

import {worldIslands,roadDistance,HIGHWAY_WIDTH} from './explore-state.js?v=140';
const mainland=[
 {id:'gorgona',x:0,z:0,rx:21,rz:15,icon:'🏖️',es:'Playa Gorgona',en:'Gorgona Beach'},
 {id:'volcanTown',x:-80,z:45,rx:15,rz:13,icon:'🏘️',es:'Volcán · Chiriquí',en:'Volcán Town · Chiriquí'}
];
const icons={islet:'🦋',wilds:'🌴',coconutCoast:'🏖️',sunset:'🌋',crystalCove:'🏝️',pizzaCity:'🏙️',colon:'🌧️',monkeyIslet:'🐒'};
const places=[...mainland,...worldIslands];
export function locationLabel(x,z,lang='es',{cruising=false,interior=null,tower=false}={}){
 const es=lang==='es',name=p=>p[es?'es':'en'],label=p=>(p.icon||icons[p.id]||'🏝️')+' '+name(p);
 if(interior)return '🏠 '+interior;
 if(tower)return '🗼 '+(es?'Faro · Playa Gorgona':'Lighthouse · Gorgona Beach');
 if(x>=-72&&x<=-19&&z>=-91&&z<=-52)return '🚢 '+(es?'Canal de Panamá':'Panama Canal');
 // Prefer small named places over a larger overlapping region.
 const inside=places.filter(p=>Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)<=1).sort((a,b)=>a.rx*a.rz-b.rx*b.rz)[0];
 if(inside)return label(inside);
 if(!cruising&&roadDistance(x,z)<HIGHWAY_WIDTH/2+1){
  const route=z>0&&x< -30?(es?'Gorgona · Volcán · Barú':'Gorgona · Volcán · Barú'):x>20?'Gorgona · Colón':(es?'Ciudad de Panamá · Gorgona':'Panama City · Gorgona');
  return '🛣️ '+route;
 }
 const nearest=places.reduce((best,p)=>{
  const d=Math.max(0,Math.hypot(x-p.x,z-p.z)-Math.max(p.rx,p.rz));
  return !best||d<best.distance?{place:p,distance:d}:best;
 },null).place;
 return (cruising?'🚢 ':'🌊 ')+(es?'Frente a ':'Off ')+name(nearest);
}

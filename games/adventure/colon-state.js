export const COLON_SITES=[
 {id:'bridge',x:(2),z:(-108),icon:'🌉',es:'Reparar el puente de los monos',en:'Repair the monkey bridge',banana:3,coconut:2},
 {id:'garden',x:(-12),z:(-117),icon:'🌱',es:'Restaurar el jardín de lluvia',en:'Restore the rain garden',banana:2,coconut:1},
 {id:'treehouse',x:(-19),z:(-127),icon:'🌳',es:'Construir la casa del árbol',en:'Build the jungle treehouse',banana:3,coconut:2},
 {id:'lookout',x:(-8),z:(-139),icon:'🌊',es:'Abrir el mirador de la cascada',en:'Open the waterfall lookout',banana:0,coconut:0}
];
export const COLON_BRIDGE={a:{x:(2),z:(-108)},b:{x:(10),z:(-94)},width:2.8,y:3.8};
export function bridgeDistance(x,z){
 const {a,b}=COLON_BRIDGE,dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));
 return Math.hypot(x-a.x-dx*t,z-a.z-dz*t);
}
export function normalizeColon(raw){
 const count=v=>Number.isFinite(v)?Math.max(0,Math.min(6,Math.floor(v))):0;
 const s={level:1,monkeyGames:Number.isFinite(raw?.monkeyGames)?Math.max(0,Math.min(9999,Math.floor(raw.monkeyGames))):0,banana:Array.from({length:4},(_,i)=>count(raw?.banana?.[i])),coconut:Array.from({length:4},(_,i)=>count(raw?.coconut?.[i])),shells:[]};
 for(let i=0;i<COLON_SITES.length;i++){const key=COLON_SITES[i].id;s[key]=raw?.[key]===true&&(i===0||s[COLON_SITES[i-1].id]);}
 s.level=s.treehouse&&Number.isFinite(raw?.level)?Math.max(1,Math.min(3,Math.floor(raw.level))):1;
 s.shells=[...new Set((Array.isArray(raw?.shells)?raw.shells:[]).filter(n=>Number.isInteger(n)&&n>=0&&n<5))];
 return s;
}
export function buildColon(world,id){
 const site=COLON_SITES.find(p=>p.id===id),c=world.colon;
 if(!site||!c||c[id])return false;
 const i=COLON_SITES.indexOf(site);if(i>0&&!c[COLON_SITES[i-1].id])return false;
 if(world.food.banana<site.banana||world.food.coconut<site.coconut)return false;
 world.food.banana-=site.banana;world.food.coconut-=site.coconut;c[id]=true;return true;
}
export function expandColon(world){
 const c=world.colon;if(!c?.treehouse||c.level>=3||world.food.banana<3||world.food.coconut<2)return false;
 world.food.banana-=3;world.food.coconut-=2;c.level++;return true;
}


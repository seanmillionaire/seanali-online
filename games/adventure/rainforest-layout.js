// Compressed game geography. Water masks, terrain and animal habitats agree.
export const CHIRIQUI_FALL={id:'chiriqui',x:-461,z:-83,top:18,width:9,pool:{x:-461,z:-65,rx:13,rz:10}};
export const DARIEN_FALL={id:'darien',x:734,z:-146,top:9,width:6,pool:{x:734,z:-131,rx:11,rz:8}};
export const RAINFOREST_FALLS=[CHIRIQUI_FALL,DARIEN_FALL];
export const JUNGLE_PONDS=[{x:602,z:-126,rx:13,rz:9},{x:650,z:-153,rx:13,rz:10},DARIEN_FALL.pool,{x:747,z:-67,rx:12,rz:10}];
export const DARIEN_RIVERS=[[[734,-131],[719,-120],[702,-100],[704,-77],[684,-56],[692,-34],[676,-10],[681,15]],[[650,-153],[670,-146],[688,-129],[702,-100]]];
const segments=DARIEN_RIVERS.flatMap(path=>path.slice(1).map((b,i)=>({a:path[i],b})));
export const chiriquiContains=(x,z)=>Math.hypot((x+444)/43,(z+80)/43)<1+.025*Math.sin(z*.22);
export function inlandWaterDistance(x,z){
 if(x< -410){const p=CHIRIQUI_FALL.pool;return Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)*Math.min(p.rx,p.rz)-Math.min(p.rx,p.rz);}
 if(x<570||x>780||z< -176||z>30)return Infinity;
 let d=Infinity;
 for(const p of JUNGLE_PONDS)d=Math.min(d,(Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)-1)*Math.min(p.rx,p.rz));
 for(const {a,b}of segments){const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));d=Math.min(d,Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t)-3.8);}
 return d;
}
export const inlandFreshwater=(x,z)=>inlandWaterDistance(x,z)<0;
export function rainforestTerrain(x,z,base){
 let h=base;
 if(chiriquiContains(x,z)){const dx=Math.abs(x-CHIRIQUI_FALL.x),back=Math.max(0,Math.min(1,(-85-z)/5)),ridge=Math.max(0,1-(dx/25)**4);h=Math.max(h,1.15+17*back*ridge);}
 if(x>718&&x<753&&z> -170&&z< -146)h=Math.max(h,3+6*Math.max(0,1-((x-734)/20)**4));
 // Walkable grotto behind the curtain, approached around the pool's west bank.
 if(Math.hypot((x+461)/10,(z+80)/5)<1&&z> -85)h=.68;
 if(x> -474&&x< -469&&z> -82&&z< -55)h=Math.min(h,.75);
 const d=inlandWaterDistance(x,z);
 if(d<0)return -.22;
 if(d<3.5){const t=d/3.5,s=t*t*(3-2*t);h=.025+(h-.025)*s;}
 return h;
}
const access=[[-408,-8],[-436,-28],[-477,-45],[-477,-78],[-468,-80]];
export function waterfallTrailClear(x,z){for(let i=1;i<access.length;i++){const a=access[i-1],b=access[i],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));if(Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t)<3.4)return false;}return true;}
export const natureSiteClear=(x,z,r=0)=>inlandWaterDistance(x,z)>3+r&&!RAINFOREST_FALLS.some(p=>Math.hypot((x-p.x)/(18+r),(z-p.z)/(15+r))<1);
export const WATERFALL_CRYSTALS=Array.from({length:36},(_,i)=>({id:i,x:-468+(i%9)*1.7,z:-82+Math.floor(i/9)*1.15}));
const n=v=>Math.max(0,Math.min(999999,Math.floor(Number(v)||0)));
export function normalizeWaterfall(raw){return {diamonds:n(raw?.diamonds),coins:n(raw?.coins),elapsed:Math.max(0,Math.min(90,Number(raw?.elapsed)||0)),claimed:[...new Set((Array.isArray(raw?.claimed)?raw.claimed:[]).filter(i=>Number.isInteger(i)&&i>=0&&i<36))]};}
export function claimWaterfall(world,id){const w=world.waterfall??=normalizeWaterfall();if(!WATERFALL_CRYSTALS.some(p=>p.id===id)||w.claimed.includes(id))return false;w.claimed.push(id);w.diamonds=Math.min(999999,w.diamonds+3);w.coins=Math.min(999999,w.coins+5);if(world.estate)world.estate.charms=Math.min(9999,world.estate.charms+2);return true;}
export function replenishWaterfall(world,dt){const w=world.waterfall??=normalizeWaterfall();if(!w.claimed.length)return false;w.elapsed+=Math.max(0,Math.min(.1,dt));if(w.elapsed<90)return false;w.elapsed=0;w.claimed=[];return true;}


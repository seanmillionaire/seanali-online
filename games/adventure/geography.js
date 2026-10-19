// North is -Z and east is +X. Distances are compressed for play, not a scale map.
export const GEOGRAPHY_VERSION=1;
export const WORLD_BOUNDS={x:350,z:240};
export const DESTINATIONS={
 home:{old:[0,0],at:[0,0]},pizzaCity:{old:[-100,-74],at:[120,-50]},
 colon:{old:[110,-56],at:[-10,-125]},monkeyIslet:{old:[130,-25],at:[10,-94]},
 wilds:{old:[16,-112],at:[-105,-135]},sunset:{old:[-110,49],at:[-135,-55]},
 islet:{old:[60,-60],at:[90,25]},coconutCoast:{old:[105,10],at:[200,50]},
 crystalCove:{old:[10,100],at:[205,-130]},canal:{old:[-44,-74],at:[40,-70]},
 volcanTown:{old:[-80,45],at:[-155,-32]},boquete:{old:[-80,45],at:[-112,-32]}
};
export function movePoint(id,x,z){const p=DESTINATIONS[id];return {x:x+p.at[0]-p.old[0],z:z+p.at[1]-p.old[1]};}
const legacyRegions=[['home',21,16],['pizzaCity',58,48],['colon',26,23],['monkeyIslet',8,7],['wilds',24,25],['sunset',38,34],['islet',12,10],['coconutCoast',23,19],['crystalCove',60,50]];
export function moveLegacyPoint(x,z){
 let id='home',distance=Infinity;
 for(const [key,rx,rz]of legacyRegions){const p=DESTINATIONS[key].old,d=Math.max(0,Math.hypot((x-p[0])/rx,(z-p[1])/rz)-1);if(d<distance){distance=d;id=key;}}
 return movePoint(id,x,z);
}
export const MAINLAND_OUTLINE=[[-190,-95],[-150,-110],[-95,-95],[-45,-145],[-10,-143],[30,-115],[90,-110],[145,-85],[190,-75],[260,-75],[265,-40],[200,-15],[145,-12],[115,-14],[65,-8],[15,9],[-15,9],[-45,10],[-90,8],[-145,-5],[-185,-30]];
export const CANAL_WATERWAY=[[40,-70],[15,-70],[5,-75],[-30,-85],[-55,-105],[-58,-130],[-55,-165]];
export function segmentDistance(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));return Math.hypot(x-a[0]-dx*t,z-a[1]-dz*t);}
export function canalWater(x,z){return (x>20&&x<62&&Math.abs(z+70)<13)||CANAL_WATERWAY.slice(1).some((p,i)=>segmentDistance(x,z,CANAL_WATERWAY[i],p)<23);}
export function gatunWater(x,z){return z>-115&&(x<30||z< -78)&&Math.hypot((x-5)/65,(z+95)/30)<1;}
export function mainlandContains(x,z){let inside=false;const p=MAINLAND_OUTLINE;for(let i=0,j=p.length-1;i<p.length;j=i++){if((p[i][1]>z)!==(p[j][1]>z)&&x<(p[j][0]-p[i][0])*(z-p[i][1])/(p[j][1]-p[i][1])+p[i][0])inside=!inside;}return inside;}
export function migrateGeography(raw){
 if(!raw||raw.geographyVersion===GEOGRAPHY_VERSION)return raw;
 const moved={...raw,geographyVersion:GEOGRAPHY_VERSION,worldVersion:3};
 if(Number.isFinite(raw.x)&&Number.isFinite(raw.z))Object.assign(moved,moveLegacyPoint(raw.x,raw.z));
 if(raw.boat)moved.boat={...raw.boat,...moveLegacyPoint(raw.boat.x,raw.boat.z)};
 if(raw.city){moved.city={...raw.city};if(raw.city.car)moved.city.car={...raw.city.car,...movePoint('pizzaCity',raw.city.car.x,raw.city.car.z)};if(raw.city.cruise)moved.city.cruise={...raw.city.cruise,distance:0};}
 if(raw.estate)moved.estate={...raw.estate,buildings:(raw.estate.buildings||[]).map(b=>({...b,...moveLegacyPoint(b.x,b.z)}))};
 return moved;
}

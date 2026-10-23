import {TRAFFIC_ROUTES,routePose} from './panama-state.js';
import {trafficLoop} from './world-ambience.js';
import {HIGHWAY_CURVES,inWater,roadDistance,HIGHWAY_WIDTH} from './explore-state.js';
import {highwayLane} from './highway-layout.js';
import {cityPropSite,CITY_ALL_PLOTS} from './city-layout.js';
import {regionalBlocked} from './regional-layout.js';
import {ruralBlocks} from './rural-towns.js';
import {estateBlocked} from './estate.js';
import {homeReserved} from './mansion-state.js';
import {districtVehicleBlocked} from './expanded-districts.js';
export const SANITATION_DEFINITIONS=[
 {id:'city',es:'Ciudad de Panamá',en:'Panama City',crew:'Marisol'},
 {id:'gorgona',es:'Gorgona',en:'Gorgona',road:'gorgonaBeachAccess',crew:'Luis'},
 {id:'colon',es:'Colón',en:'Colón',road:'cityToColon',crew:'Ana'},
 {id:'chiriqui',es:'Chiriquí',en:'Chiriquí',road:'cityToBaru',crew:'Carlos'},
 {id:'east',es:'Panamá Este',en:'East Panama',road:'panamaEast',crew:'Rosa'}
];
export function sanitationLayout({state,height,roadHeight=height,forest={trees:[]}}){
 const claimed=[];
 function clear(x,z,margin=.6){
  return !inWater(x,z)&&!regionalBlocked(x,z,state.world,margin)&&!ruralBlocks(x,z,margin)&&!estateBlocked(state.world,x,z)&&!homeReserved(x,z,margin)&&!districtVehicleBlocked(x,z)&&!CITY_ALL_PLOTS.some(p=>p.solid!==false&&Math.abs(x-p.x)<p.w/2+margin&&Math.abs(z-p.z)<p.d/2+margin)&&!forest.trees.some(t=>Math.hypot(t.x-x,t.z-z)<margin+(t.scale||1)*.3);
 }
 function siteClear(q){return clear(q.x,q.z,1.1)&&[[1,0],[-1,0],[0,1],[0,-1]].every(([a,b])=>clear(q.x+a,q.z+b,.2)&&Math.abs(height(q.x+a,q.z+b)-height(q.x,q.z))<.6)&&!claimed.some(p=>Math.hypot(q.x-p.x,q.z-p.z)<5);}
 function workerPath(p,q){
  const d=Math.hypot(p.x-q.x,p.z-q.z)||1;q={x:q.x+(p.x-q.x)/d*1.4,z:q.z+(p.z-q.z)/d*1.4};
  // Leave the curb-side door, never walk through the truck or another traffic lane.
  const start={x:p.x+Math.cos(p.heading)*1.7,z:p.z-Math.sin(p.heading)*1.7},n=Math.ceil(Math.hypot(q.x-start.x,q.z-start.z)/.5),points=[];
  if(Math.abs(roadHeight(p.x,p.z)-height(start.x,start.z))>1)return null;
  let previous=height(start.x,start.z);
  for(let i=0;i<=n;i++){const t=n?i/n:1,x=start.x+(q.x-start.x)*t,z=start.z+(q.z-start.z)*t,y=height(x,z);if(!clear(x,z,.35)||Math.abs(y-previous)>.45)return null;previous=y;points.push({x,z});}
  return points;
 }
 return SANITATION_DEFINITIONS.map((definition,ri)=>{
  const road=definition.road,route=road?trafficLoop(HIGHWAY_CURVES[road],(x,z)=>highwayLane(road,1,x,z)):TRAFFIC_ROUTES[0],length=routePose(route,0).length,stops=[];
  for(let j=0;j<4;j++){
   let found=null;
   for(let attempt=0;attempt<32&&!found;attempt++){
    const distance=length*(.04+j*.23+attempt*.005),pose=routePose(route,distance);
    for(const offset of [4.4,5.6,7,9]){
     let q={x:pose.x+Math.cos(pose.heading)*offset,z:pose.z-Math.sin(pose.heading)*offset};
     if(!road)q=cityPropSite(q.x,q.z,1.1);
     if(!q||!siteClear(q)||Math.hypot(q.x-pose.x,q.z-pose.z)>13||(road&&roadDistance(q.x,q.z)<HIGHWAY_WIDTH/2+1))continue;
     const path=workerPath(pose,q);if(path){found={id:definition.id+'-'+j,region:ri,...q,distance,path,depot:j===0};break;}
    }
   }
   if(found){claimed.push(found);stops.push(found);}
  }
  // The first valid stop is the transfer depot even if the first candidate was obstructed.
  if(stops.length){stops.forEach(p=>p.depot=false);stops[0].depot=true;}
  return {...definition,ri,route,length,stops};
 });
}

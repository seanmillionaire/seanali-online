import {canalWater} from './geography.js?v=211';
import {HIGHWAY_CURVES,HIGHWAY_WIDTH,bridgeDeckHeight,terrainHeight,isletHeight} from './explore-state.js?v=211';
import {roadRibbon,surfaceMesh} from './road-surfaces.js?v=211';
// Water stays at sea level; the road is a separate supported span above it.
export function createCanalBridges({T,scene,geometry,mat,make,box}){
 const root=new T.Group();root.name='Canal highway bridges · open shipping clearance';scene.add(root);
 const concrete=mat('#a5aaa5',{roughness:.92}),metal=mat('#819799',{metalness:.35,roughness:.6});
 for(const id of ['cityToGorgona','cityToColon']){
  const path=HIGHWAY_CURVES[id],raised=(x,z)=>bridgeDeckHeight(x,z)>terrainHeight(x,z)+.5;
  root.add(surfaceMesh(T,geometry,roadRibbon(path,HIGHWAY_WIDTH+.3,isletHeight,{lift:-.55,include:raised}),concrete,id+' bridge underside'));
  for(const side of [-1,1]){
   const edge=roadRibbon(path,.25,(x,z)=>isletHeight(x,z)+.95,{offset:side*(HIGHWAY_WIDTH/2+.1),include:raised});
   root.add(surfaceMesh(T,geometry,edge,metal,id+' bridge parapet'));
  }
  let last=null;
  for(let i=1;i<path.length;i++){
   const [x,z]=path[i],prev=path[i-1],y=isletHeight(x,z);if(!raised(x,z)||last&&Math.hypot(x-last[0],z-last[1])<8)continue;last=[x,z];
   const angle=Math.atan2(x-prev[0],z-prev[1]);
   for(const side of [-1,1]){
    const px=x+Math.cos(angle)*side*(HIGHWAY_WIDTH/2+.1),pz=z-Math.sin(angle)*side*(HIGHWAY_WIDTH/2+.1);
    make(box,metal,px,y+.5,pz,.16,1.2,.16,root);
    // Piers only on dry banks. No concrete columns inside the navigable canal.
    if(!canalWater(px,pz)){const ground=terrainHeight(px,pz),h=y-ground-.55;if(h>1)make(box,concrete,px,ground+h/2,pz,.8,h,1.5,root);}
   }
  }
 }
 return root;
}

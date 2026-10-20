// Irregular forests across Panama. Deterministic and safely off roads.
import {mainlandContains,canalWater,gatunWater} from './geography.js?v=171';
import {worldIslands,isletHeight,roadDistance,HIGHWAY_WIDTH,volcanoTrailPoint} from './explore-state.js?v=171';

export const FOREST_PATCHES=[
 {id:'gorgona-inland',x:27,z:-37,rx:27,rz:18,n:125,biome:'tropical'},
 {id:'gorgona-west',x:-5,z:-42,rx:27,rz:21,n:115,biome:'tropical'},
 {id:'gorgona-hills',x:-31,z:-34,rx:26,rz:19,n:110,biome:'tropical'},
 {id:'pacific-valley',x:51,z:-49,rx:22,rz:19,n:104,biome:'tropical'},
 {id:'pacific-grove',x:25,z:-75,rx:27,rz:19,n:105,biome:'tropical'},
 {id:'colon-jungle',x:-5,z:-114,rx:22,rz:21,n:92,biome:'tropical'},
 {id:'canal-rainforest',x:66,z:-104,rx:23,rz:15,n:90,biome:'tropical'},
 {id:'west-canopy',x:-54,z:-58,rx:35,rz:25,n:140,biome:'tropical'},
 {id:'mountain-foot',x:-93,z:-55,rx:30,rz:24,n:120,biome:'mixed'},
 {id:'western-valley',x:-128,z:-85,rx:36,rz:22,n:118,biome:'mixed'},
 {id:'western-mountain',x:-159,z:-70,rx:28,rz:21,n:114,biome:'montane'},
 {id:'baru-east',x:-103,z:-21,rx:22,rz:15,n:108,biome:'montane'},
 {id:'baru-south',x:-135,z:-81,rx:29,rz:19,n:102,biome:'montane'},
 {id:'baru-west',x:-164,z:-48,rx:21,rz:22,n:106,biome:'montane'},
 {id:'cloud-forest',x:-138,z:-56,rx:32,rz:26,n:140,biome:'montane'},
 {id:'bocas-jungle',x:-105,z:-135,rx:23,rz:22,n:115,biome:'island',island:'wilds'},
 {id:'bocas-north',x:-113,z:-145,rx:14,rz:12,n:55,biome:'island',island:'wilds'},
 {id:'colon-forest',x:-13,z:-127,rx:18,rz:15,n:65,biome:'island',island:'colon'}
];
export const FOREST_CLEARINGS=[
 {x:0,z:0,r:19}, // Gorgona homes and beach
 {x:21,z:1,r:7}, // Town terminus of coastal road
 {x:32,z:-14,r:8}, // Inland highway turnoff
 {x:66,z:-65,r:10}, // Canal viewpoints
 {x:-155,z:-32,r:10}, // Volcán village
 {x:-112,z:-32,r:7}, // Boquete
 {x:-19,z:-127,r:13}, // Colón buildable treehouse
 {x:-105,z:-135,r:6} // Bocas gathering hub
];
const trail=Array.from({length:85},(_,i)=>volcanoTrailPoint(i/84));
function nearTrail(x,z){
 for(let i=1;i<trail.length;i++){
  const a=trail[i-1],b=trail[i],dx=b.x-a.x,dz=b.z-a.z,len2=dx*dx+dz*dz;
  const t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(len2||1)));
  if(Math.hypot(x-a.x-t*dx,z-a.z-t*dz)<5.5)return true;
 }
 return false;
}
export function forestSiteClear(x,z,biome='tropical'){
 // Reserve room for the entire giant tree crown, not just its trunk, along
 // asphalt, town entrances, hiking routes and shorelines.
 if(roadDistance(x,z)<HIGHWAY_WIDTH/2+11.5)return false;
 if(FOREST_CLEARINGS.some(p=>Math.hypot(x-p.x,z-p.z)<p.r))return false;
 if(Math.hypot((x-120)/65,(z+50)/55)<1.09)return false;
 const onMainland=mainlandContains(x,z);
 const onForestIsland=worldIslands.some(land=>
  (land.id==='wilds'||land.id==='colon'||land.id==='sunset') &&
  Math.hypot((x-land.x)/land.rx,(z-land.z)/land.rz)<.91);
 if(!onMainland&&!onForestIsland)return false;
 if(canalWater(x,z)||gatunWater(x,z))return false;
 if(nearTrail(x,z))return false;
 if(isletHeight(x,z)<.48)return false;
 if(biome==='island'&&!onForestIsland)return false;
 return true;
}
export function planForestPatches(density=1){
 const output=[],factor=Math.min(1,Math.max(.25,Number(density)||1));
 let seed=943017;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(const patch of FOREST_PATCHES){
  const target=Math.round(patch.n*factor);
  let placed=0;
  // Feathered, warped patch outlines. No hard rectangles or artificial circles.
  for(let attempt=0;attempt<target*13&&placed<target;attempt++){
   const a=random()*Math.PI*2,r=Math.sqrt(random()),
    shape=.86+.14*Math.sin(a*3+patch.x*.05)+.09*Math.cos(a*7+patch.z*.17),
    x=patch.x+Math.cos(a)*r*patch.rx*shape+(random()-.5)*3.8,
    z=patch.z+Math.sin(a)*r*patch.rz*shape+(random()-.5)*3.8;
   if(!forestSiteClear(x,z,patch.biome))continue;
   if(r>.82&&random()<(r-.82)*2.1)continue;
   const roll=random();
   const kind=patch.biome==='montane'?(roll<.76?'pine':'natural')
    :patch.biome==='mixed'?(roll<.48?'pine':roll<.82?'natural':'palm')
    :patch.biome==='island'?(roll<.28?'palm':roll<.90?'natural':'pine')
    :(roll<.38?'palm':roll<.91?'natural':'pine');
   const size=kind==='pine'?1.7+random()*1.65:kind==='palm'?1.65+random()*1.3:1.65+random()*1.45;
   output.push({x,z,kind,size,heading:random()*Math.PI*2,tint:random(),patch:patch.id});
   placed++;
  }
 }
 return output;
}

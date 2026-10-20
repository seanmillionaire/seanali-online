// Irregular, mixed Panamanian understory and canopy. Gaps are intentional.
import {mainlandContains,canalWater,gatunWater} from './geography.js?v=178';
import {worldIslands,isletHeight,roadDistance,HIGHWAY_WIDTH,volcanoTrailPoint} from './explore-state.js?v=178';
export const FOREST_PATCHES=[
 {id:'gorgona-palm-grove',x:18,z:-36,rx:27,rz:20,n:54,biome:'tropical'},
 {id:'gorgona-rainforest',x:-23,z:-46,rx:29,rz:23,n:48,biome:'tropical'},
 {id:'pacific-riverside',x:52,z:-72,rx:25,rz:25,n:44,biome:'tropical'},
 {id:'canal-tropical',x:59,z:-111,rx:23,rz:19,n:36,biome:'tropical'},
 {id:'western-rainforest',x:-66,z:-63,rx:33,rz:28,n:55,biome:'mixed'},
 {id:'pacific-coast',x:-25,z:-104,rx:25,rz:20,n:41,biome:'tropical'},
 {id:'mountain-cloudforest',x:-110,z:-76,rx:32,rz:23,n:54,biome:'montane'},
 {id:'baru-highlands',x:-155,z:-73,rx:31,rz:23,n:58,biome:'montane'},
 {id:'baru-foothills',x:-104,z:-19,rx:21,rz:15,n:37,biome:'mixed'},
 {id:'bocas-jungle',x:-109,z:-141,rx:23,rz:22,n:45,biome:'island'},
 {id:'colon-grove',x:-13,z:-126,rx:21,rz:18,n:34,biome:'island'}
];
export const FOREST_CLEARINGS=[
 {x:0,z:0,r:19},{x:21,z:1,r:7},{x:32,z:-14,r:8},
 {x:66,z:-65,r:10},{x:-155,z:-32,r:10},{x:-112,z:-32,r:7},
 {x:-19,z:-127,r:13},{x:-105,z:-135,r:7}
];
const trail=Array.from({length:85},(_,i)=>volcanoTrailPoint(i/84));
function nearTrail(x,z){
 for(let i=1;i<trail.length;i++){
  const a=trail[i-1],b=trail[i],dx=b.x-a.x,dz=b.z-a.z,n=dx*dx+dz*dz;
  const t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(n||1)));
  if(Math.hypot(x-a.x-t*dx,z-a.z-t*dz)<5.8)return true;
 }return false;
}
export function forestSiteClear(x,z,biome='tropical'){
 if(roadDistance(x,z)<HIGHWAY_WIDTH/2+10)return false;
 if(FOREST_CLEARINGS.some(p=>Math.hypot(x-p.x,z-p.z)<p.r))return false;
 if(Math.hypot((x-120)/67,(z+50)/57)<1.09)return false;
 // Giant rainforest canopy belongs inland, never on offshore beaches.
 if(worldIslands.some(p=>p.id!=='sunset'&&Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)<1.07))return false;
 const land=mainlandContains(x,z);
 const island=worldIslands.some(p=>(p.id==='wilds'||p.id==='colon'||p.id==='sunset')&&
  Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)<.90);
 if(!land&&!island||canalWater(x,z)||gatunWater(x,z)||nearTrail(x,z)||isletHeight(x,z)<.48)return false;
 return biome!=='island'||island;
}
export function planForestPatches(density=1){
 const plants=[],factor=Math.max(.25,Math.min(1,Number(density)||1));
 let seed=943017;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(const patch of FOREST_PATCHES){
  const target=Math.round(patch.n*factor);
  // Three broad woodland lobes with open meadows between them.
  const groves=Array.from({length:3},(_,j)=>{
   const a=j*2.399963+patch.x*.025;
   return {x:patch.x+Math.cos(a)*patch.rx*.27,z:patch.z+Math.sin(a)*patch.rz*.25};
  });
  // Allocate separate slots for tall canopy and smaller understory FIRST.
  // This prevents ferns winning every spacing check in dense locations.
  for(let slot=0;slot<target;slot++){
   const understory=slot%5===3||slot%5===4;
   const roll=random();
   const kind=understory?'fern':patch.biome==='montane'?(roll<.52?'pine':roll<.92?'natural':'palm')
    :patch.biome==='mixed'?(roll<.25?'pine':roll<.75?'natural':'palm')
    :patch.biome==='island'?(roll<.06?'pine':roll<.55?'natural':'palm')
    :(roll<.09?'pine':roll<.57?'natural':'palm');
   const scaleRoll=random(),size=kind==='fern'?.55+scaleRoll*.85:kind==='palm'?.80+scaleRoll*1.50:
    kind==='pine'?.90+scaleRoll*1.55:.77+scaleRoll*1.65;
   for(let tries=0;tries<52;tries++){
    const lobe=groves[Math.floor(random()*groves.length)],a=random()*Math.PI*2,r=Math.sqrt(random());
    const shape=.83+.12*Math.sin(a*3+patch.x*.06)+.08*Math.cos(a*7+patch.z*.13);
    const x=lobe.x+Math.cos(a)*r*patch.rx*.64*shape+(random()-.5)*1.4;
    const z=lobe.z+Math.sin(a)*r*patch.rz*.64*shape+(random()-.5)*1.4;
    if(!forestSiteClear(x,z,patch.biome)||r>.87&&random()<.4)continue;
    const clearance=kind==='fern'?2.7:3.3+size*1.12;
    if(plants.some(t=>Math.hypot(t.x-x,t.z-z)<clearance+(t.kind==='fern'?0:.9)))continue;
    plants.push({x,z,kind,size,heading:random()*Math.PI*2,tint:random(),patch:patch.id});
    break;
   }
  }
 }
 return plants;
}

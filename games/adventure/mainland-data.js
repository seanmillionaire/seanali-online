import {iconicLandHeight} from './iconic-layout.js';
import {inlandFreshwater} from './rainforest-layout.js';
import {jungleContains} from './east-jungle-layout.js';
import {costaContains} from './costa-arriba-layout.js';
import {MAINLAND_EAST,cityX,mainlandContains,canalWater,gatunWater,homeShoreRadius,WORLD_EXTENT,freshwaterHabitat} from './geography.js';
import {clipLandTriangle,shorelineTiles,coastDistanceField} from './terrain-surface.js';
import {worldIslands,terrainHeight} from './explore-state.js';
import {createStartupSampler} from './startup-queries.js';
export function buildMainlandData(){const initialTerrain=createStartupSampler(terrainHeight,25000);
  const mainlandVertices=[],mainlandUV=[];
  const dryMainland=(x,z)=>(mainlandContains(x,z)||iconicLandHeight(x,z)>0)&&!canalWater(x,z)&&!gatunWater(x,z)&&!inlandFreshwater(x,z);
  const inland=(x,z)=>dryMainland(x,z)&&Math.hypot(x/20,z/14)>.90&&!worldIslands.some(p=>Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)<.90);
  // Overlap the existing region meshes slightly from below: no empty moat or z-fighting.
  // Subdivide waterline edges fivefold to remove blocky land endings without
  // multiplying all inland polygons; clip the final boundary precisely.
  for(let x=-493;x<MAINLAND_EAST+1;x+=3)for(let z=x>520?-216:-456;z<(x>=373&&x<=472?258:54);z+=3)
  if(z>=-167||(x>=-125&&x<=80)||(z>=-280&&x>=40&&x<=400)||costaContains(x,z)||jungleContains(x,z))for(const [sx,sz,size] of shorelineTiles(x,z,3,inland,5)){
   const corners=[[sx,0,sz],[sx+size,0,sz],[sx,0,sz+size],[sx+size,0,sz+size]];
   for(const tri of [[0,2,1],[1,2,3]]){
    const vertices=clipLandTriangle(tri.map(i=>corners[i]),inland);
    const emit=(px,py,pz)=>{mainlandVertices.push(px,py,pz);mainlandUV.push(px*.18,pz*.18);};
    for(const [px,,pz] of vertices)emit(px,Math.max(.025,initialTerrain(px,pz)-.075),pz);
    // Close the exposed shore down to the seabed instead of leaving a floating sheet.
    for(let k=0;k<vertices.length;k+=3)for(let e=0;e<3;e++){
     const a=vertices[k+e],b=vertices[k+(e+1)%3],dx=b[0]-a[0],dz=b[2]-a[2],len=Math.hypot(dx,dz);
     if(len<.001)continue;
     const mx=(a[0]+b[0])/2,mz=(a[2]+b[2])/2,nx=-dz/len*.015,nz=dx/len*.015;
     if(dryMainland(mx+nx,mz+nz)===dryMainland(mx-nx,mz-nz))continue;
     const ay=Math.max(.025,initialTerrain(a[0],a[2])-.075),by=Math.max(.025,initialTerrain(b[0],b[2])-.075);
     for(const v of [[a[0],ay,a[2]],[a[0],-1.4,a[2]],[b[0],by,b[2]],[b[0],by,b[2]],[a[0],-1.4,a[2]],[b[0],-1.4,b[2]]])emit(...v);
    }
   }
  }
  initialTerrain.release();
  // The mainland also shows between the city's organic edge and its streets.
  // Select a material per existing triangle, without moving land or collision heights.
  const cityLand=worldIslands.find(p=>p.id==='pizzaCity');
  const mainlandIndices=[[],[]];
  for(let i=0;i<mainlandVertices.length;i+=9){
   const x=(mainlandVertices[i]+mainlandVertices[i+3]+mainlandVertices[i+6])/3,
    z=(mainlandVertices[i+2]+mainlandVertices[i+5]+mainlandVertices[i+8])/3;
   // Curved district edges replace the old square asphalt cutouts while
   // keeping the downtown highway and every saved structure in place.
   const eastCoast=Math.hypot((x-cityX(216))/61,(z+51)/41),
    colonCoast=Math.min(Math.hypot((x+55)/35,(z+246)/26),Math.hypot((x-7)/43,(z+249)/29));
   const eastEdge=.99+.022*Math.sin(x*.21+z*.14),
    colonEdge=1+.024*Math.cos(x*.24-z*.16);
   const urban=Math.hypot((x-cityLand.x)/cityLand.rx,(z-cityLand.z)/cityLand.rz)<=1||
    eastCoast<eastEdge||colonCoast<colonEdge;
   mainlandIndices[urban?1:0].push(i/3,i/3+1,i/3+2);
  }
  // Two draw groups preserve every triangle while keeping mobile rendering cheap.
return {positions:new Float32Array(mainlandVertices),uv:new Float32Array(mainlandUV),indices:new Uint32Array([...mainlandIndices[0],...mainlandIndices[1]]),firstCount:mainlandIndices[0].length};}

export function buildCoastData(){const coast=coastDistanceField((x,z)=>terrainHeight(x,z)>0||Math.hypot(x/20,z/14)<homeShoreRadius(Math.atan2(z/14,x/20)),512,448,WORLD_EXTENT);for(let j=0;j<coast.height;j++)for(let i=0;i<coast.width;i++){const x=WORLD_EXTENT.left+(i+.5)*WORLD_EXTENT.width/coast.width,z=WORLD_EXTENT.top+(j+.5)*WORLD_EXTENT.height/coast.height;coast.pixels[(j*coast.width+i)*4+1]=freshwaterHabitat(x,z)?255:0;}return coast;}


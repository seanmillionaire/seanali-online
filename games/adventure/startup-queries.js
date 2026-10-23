// Exact, temporary caches: no quantization of terrain or collision coordinates.
export function createStartupSampler(sample,limit=180000){let cache=new Map(),count=0;const query=(x,z)=>{if(!cache)return sample(x,z);let row=cache.get(x);if(row?.has(z))return row.get(z);const value=sample(x,z);if(count<limit){if(!row){row=new Map();cache.set(x,row);}row.set(z,value);count++;}return value;};query.release=()=>{cache=null;};return query;}
// Preserve the original node-based intersection paint rule without scanning
// every node on every highway for each dash and edge stripe.
export function createRoadPaintQuery(paths,width){const cells=new Map(),size=16;for(const [id,path]of Object.entries(paths))for(const [x,z]of path){const k=Math.floor(x/size)+','+Math.floor(z/size);if(!cells.has(k))cells.set(k,[]);cells.get(k).push({id,x,z,r:width(id,x,z)/2+.3});}return id=>(x,z)=>{const ix=Math.floor(x/size),iz=Math.floor(z/size);for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)for(const p of cells.get((ix+dx)+','+(iz+dz))||[])if(p.id!==id&&Math.hypot(x-p.x,z-p.z)<p.r)return false;return true;};}


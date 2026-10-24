// Small city-only A*: use the same collision predicate as walking, including buildings.
export function cityChapterRoute(from,to,clear){
 const minX=Math.floor(Math.min(from.x,to.x)-14),maxX=Math.ceil(Math.max(from.x,to.x)+14),minZ=Math.floor(Math.min(from.z,to.z)-14),maxZ=Math.ceil(Math.max(from.z,to.z)+14),width=maxX-minX+1;
 const key=(x,z)=>(z-minZ)*width+x-minX,cache=new Map();
 function free(x,z){if(x<minX||x>maxX||z<minZ||z>maxZ)return false;const k=key(x,z);if(!cache.has(k))cache.set(k,clear(x,z));return cache.get(k);}
 function segmentClear(a,b){const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.25));for(let i=1;i<=steps;i++){const t=i/steps;if(!clear(a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t))return false;}return true;}
 let start=null;for(let r=0;r<=4&&!start;r++)for(let dz=-r;dz<=r&&!start;dz++)for(let dx=-r;dx<=r;dx++){const x=Math.round(from.x)+dx,z=Math.round(from.z)+dz;if(free(x,z)&&segmentClear(from,{x,z})){start={x,z};break;}}
 if(!start)return [];
 const queue=[],cost=new Map([[key(start.x,start.z),0]]),came=new Map(),nodes=new Map(),closed=new Set();
 function push(v){queue.push(v);let i=queue.length-1;while(i){const p=(i-1)>>1;if(queue[p].f<=v.f)break;queue[i]=queue[p];i=p;}queue[i]=v;}
 function pop(){const first=queue[0],last=queue.pop();if(queue.length){let i=0;while(i*2+1<queue.length){let j=i*2+1;if(j+1<queue.length&&queue[j+1].f<queue[j].f)j++;if(queue[j].f>=last.f)break;queue[i]=queue[j];i=j;}queue[i]=last;}return first;}
 const sk=key(start.x,start.z);nodes.set(sk,start);push({...start,k:sk,f:0});
 while(queue.length){const p=pop();if(closed.has(p.k))continue;closed.add(p.k);if(Math.hypot(p.x-to.x,p.z-to.z)<(to.arrivalRadius??4.25)){const path=[];let k=p.k;while(k!==sk){path.unshift(nodes.get(k));k=came.get(k);}if(Math.hypot(from.x-start.x,from.z-start.z)>.15)path.unshift(start);return path.length?path:[start];}
 for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,z=p.z+dz,k=key(x,z);if(closed.has(k)||!free(x,z)||!segmentClear(p,{x,z}))continue;const g=cost.get(p.k)+1;if(g>=(cost.get(k)??Infinity))continue;cost.set(k,g);came.set(k,p.k);nodes.set(k,{x,z});push({x,z,k,f:g+Math.hypot(x-to.x,z-to.z)});}}
 return [];
}

// Sliding a few millimetres beside a vehicle is not progress toward a waypoint.
export function createRouteProgressWatch(){
 let waypoint=null,best=Infinity,stalled=0;
 return {reset(){waypoint=null;best=Infinity;stalled=0;},blocked(point,x,z,dt){
  if(!point||dt<=0)return false;const distance=Math.hypot(point.x-x,point.z-z);
  if(point!==waypoint||distance<best-.15){waypoint=point;best=distance;stalled=0;return false;}
  stalled+=Math.min(.1,dt);if(stalled<1.2)return false;best=distance;stalled=0;return true;
 }};
}

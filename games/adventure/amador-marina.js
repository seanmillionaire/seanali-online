// Fixed berths for the existing four ocean yachts. No fleet creation here.
export const AMADOR_BERTHS=Array.from({length:4},(_,i)=>({x:510,z:250+i*30,heading:Math.PI/2}));
export function amadorDock(x,z){return (x>=465&&x<=487&&Math.abs(z-240)<=1.3)||(Math.abs(x-486)<=1.3&&z>=239&&z<=365)||(x>=486&&x<=521&&Math.abs(z-364)<=1.1)||AMADOR_BERTHS.some(b=>x>=486&&x<=521&&Math.abs(z-b.z+6)<=1.1);}
// A conservative square protects the full hull through turns. The search is
// bounded to the authored world and runs once per fixed route, never per frame.
export function marinaPath(from,to,clear){
 const step=12,key=(x,z)=>x+','+z,grid=p=>({x:Math.round(p.x/step)*step,z:Math.round(p.z/step)*step});
 const safe=(x,z)=>clear(x,z,0,24,24),segment=(a,b)=>{const n=Math.ceil(Math.hypot(a.x-b.x,a.z-b.z)/2);for(let i=0;i<=n;i++)if(!safe(a.x+(b.x-a.x)*i/Math.max(1,n),a.z+(b.z-a.z)*i/Math.max(1,n)))return false;return true;};
 const start=grid(from),end=grid(to);if(!segment(from,start)||!segment(end,to))throw Error('Marina endpoint clearance');
 const queue=[start],parents=new Map([[key(start.x,start.z),null]]),points=new Map([[key(start.x,start.z),start]]);let found=false;
 for(let i=0;i<queue.length;i++){const p=queue[i],pk=key(p.x,p.z);if(p.x===end.x&&p.z===end.z){found=true;break;}for(const [dx,dz]of [[step,0],[-step,0],[0,step],[0,-step]]){const q={x:p.x+dx,z:p.z+dz},k=key(q.x,q.z);if(parents.has(k)||!safe(q.x,q.z)||!segment(p,q))continue;parents.set(k,pk);points.set(k,q);queue.push(q);}}
 if(!found)throw Error('No water-only approach to Amador');
 const path=[];for(let k=key(end.x,end.z);k;k=parents.get(k))path.push(points.get(k));path.reverse();path.unshift(from);path.push(to);
 const simple=[path[0]];for(let i=0;i<path.length-1;){let j=path.length-1;while(j>i+1&&!segment(path[i],path[j]))j--;simple.push(path[j]);i=j;}return simple;
}
export function marinaPose(path,distance){let left=distance;for(let i=1;i<path.length;i++){const a=path[i-1],b=path[i],len=Math.hypot(b.x-a.x,b.z-a.z);if(left<=len||i===path.length-1){const t=Math.min(1,left/Math.max(.001,len));return {x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,heading:Math.atan2(b.x-a.x,b.z-a.z)};}left-=len;}return {...path[0],heading:0};}
export const marinaLength=path=>path.slice(1).reduce((n,p,i)=>n+Math.hypot(p.x-path[i].x,p.z-path[i].z),0);

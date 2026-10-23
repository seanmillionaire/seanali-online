// Find a nearby usable endpoint, never accepting only an object's center.
export function findClearPlacement(origin,clear,{radius=.45,maxRadius=80,step=.75,headings=null}={}){
 const valid=p=>headings?clear(p):[[0,0],[radius,0],[-radius,0],[0,radius],[0,-radius]].every(([x,z])=>clear(p.x+x,p.z+z));
 const at=(x,z)=>{for(const heading of headings||[origin.heading]){const p={x,z,...(heading==null?{}:{heading})};if(valid(p))return p;}return null;};
 let point=at(origin.x,origin.z);if(point)return point;
 for(let r=step;r<=maxRadius;r+=step){const count=Math.max(16,Math.ceil(Math.PI*2*r/step));for(let i=0;i<count;i++){const a=i/count*Math.PI*2;point=at(origin.x+Math.sin(a)*r,origin.z+Math.cos(a)*r);if(point)return point;}}
 return null;
}

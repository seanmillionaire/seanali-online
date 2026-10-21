// Oriented vehicle footprints: keep adjacent lanes open and stop crossing hulls.
export function vehicleOverlap(a,b,margin=.18){
 const axes=[a.heading||0,b.heading||0].flatMap(h=>[[Math.sin(h),Math.cos(h)],[Math.cos(h),-Math.sin(h)]]);
 const radius=(v,axis)=>{const h=v.heading||0;return Math.abs(axis[0]*Math.sin(h)+axis[1]*Math.cos(h))*(v.length||2.25)+Math.abs(axis[0]*Math.cos(h)-axis[1]*Math.sin(h))*(v.width||.95);};
 return axes.every(axis=>Math.abs((a.x-b.x)*axis[0]+(a.z-b.z)*axis[1])<radius(a,axis)+radius(b,axis)+margin);
}
export function trafficFootprint(v){return {x:v.g.position.x,z:v.g.position.z,heading:v.g.rotation.y,length:v.bus?4.8:1.8,width:v.bus?1.15:.9};}

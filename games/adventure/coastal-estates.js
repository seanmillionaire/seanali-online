// Fictional discovery estates. Deliberately absent from map destinations and signs.
// Local +Z faces the sea. Architecture and collision use the same footprints.
// Preserve all three designs while placements await the owner's decision.
// Darién placements were rejected. Margarita, Colón is a proposal, not a site.
export const COASTAL_ESTATE_DESIGNS=Object.freeze([
 {id:'cliff-court',style:'court',color:'#eee5ce',placement:null,proposedArea:'Margarita, Colón'},
 {id:'pearl-terraces',style:'terraces',color:'#f5eee2',placement:{x:540,z:127,facing:1}},
 {id:'sunset-pavilions',style:'pavilions',color:'#d4a77f',placement:null}
]);
export const COASTAL_ESTATES=Object.freeze(COASTAL_ESTATE_DESIGNS.filter(p=>p.placement).map(p=>({...p,...p.placement})));
export const estateLocal=(p,x,z)=>({x:(x-p.x)*p.facing,z:(z-p.z)*p.facing});
export const coastalEstateReserved=(x,z,pad=0)=>COASTAL_ESTATES.some(p=>{const q=estateLocal(p,x,z);return Math.abs(q.x)<21+pad&&q.z>-17-pad&&q.z<28+pad;});
export function estateVolumes(p){
 if(p.style==='court')return [{x:-12,z:-3,w:9,d:16,h:10},{x:12,z:-3,w:9,d:16,h:10},{x:0,z:-10,w:16,d:7,h:12}];
 if(p.style==='terraces')return [{x:-9,z:-5,w:14,d:15,h:9},{x:8,z:-8,w:17,d:10,h:6},{x:9,z:0,w:9,d:7,h:3.2}];
 return [{x:-12,z:-7,w:10,d:10,h:8},{x:1,z:-10,w:12,d:7,h:6},{x:13,z:-5,w:8,d:13,h:10}];
}

export function estateGroundPlan(p,height){
 const ground=(x,z)=>height(p.x+x*p.facing,p.z+z*p.facing);
 let base=0;for(let x=-19;x<=19;x+=3.8)for(let z=-15;z<=18;z+=3.3)base=Math.max(base,ground(x,z));base+=.18;
 let dockEnd=24;while(dockEnd<65&&ground(0,dockEnd)>0)dockEnd+=2;dockEnd+=5;
 return {base,dockEnd};
}
export function estateDockSurface(p,plan,x,z){const q=estateLocal(p,x,z);if(Math.abs(q.x)<4&&Math.abs(q.z-plan.dockEnd)<2)return .89;if(Math.abs(q.x)>1.3||q.z<17.5||q.z>plan.dockEnd)return -Infinity;return plan.base+.36+(.87-plan.base-.36)*(q.z-17.5)/(plan.dockEnd-17.5);}

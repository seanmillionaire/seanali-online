// Paired dancers travel together around the gathering, alternating small hops.
export function gunaDancePose(time,pair,side=0){
 const angle=pair*Math.PI*2/3+time*.22,radius=3+side*.48,beat=time*5.2;
 return {x:Math.cos(angle)*radius,z:Math.sin(angle)*radius,heading:-angle,hop:Math.abs(Math.sin(beat))*.075,beat};
}

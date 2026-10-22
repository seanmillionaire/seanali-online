// Repair only submerged saved structures near the shifted Guna Yala archipelago.
// IDs, levels, costs and ownership stay intact; valid sites never move.
export function repairCoastalSites(world,{islands,inWater}){
 const buildings=world.estate?.buildings||[],radius={cottage:2.8,market:3.4,villa:4.4,castle:6.8};let count=0;
 const dry=(x,z,r)=>[[0,0],[-r,-r],[-r,r],[r,-r],[r,r]].every(([dx,dz])=>!inWater(x+dx,z+dz));
 for(const b of buildings){const r=(radius[b.type]||3)+.5;if(b.x<380||b.z> -280||b.z< -560||dry(b.x,b.z,r))continue;
  const choices=islands.filter(p=>p.guna||p.id==='crystalCove').sort((a,c)=>Math.hypot(a.x-b.x,a.z-b.z)-Math.hypot(c.x-b.x,c.z-b.z));let found=null;
  for(const land of choices){for(let n=0;n<60;n++){const a=n*2.39996,d=n===0?0:Math.sqrt(n/60)*Math.min(land.rx,land.rz)*.55,x=land.x+Math.cos(a)*d,z=land.z+Math.sin(a)*d;if(dry(x,z,r)&&buildings.every(other=>other===b||Math.hypot(x-other.x,z-other.z)>r+(radius[other.type]||3)+1)){found={x,z};break;}}if(found)break;}
  if(found){Object.assign(b,found);count++;}
 }
 return count;
}

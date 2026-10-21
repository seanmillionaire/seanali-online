// Compressed Costa Arriba, east of Colón; existing saved landmarks stay put.
export const COSTA_LAND=[{x:35,z:-380,rx:40,rz:39},{x:95,z:-392,rx:68,rz:39},{x:153,z:-408,rx:50,rz:37}];
export const costaContains=(x,z)=>COSTA_LAND.some(p=>Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz)<1+.018*Math.sin(x*.23+z*.17));
export const COSTA_ROAD=[[24,-351],[50,-373],[80,-388],[114,-401],[150,-410],[176,-419],[176,-437]];
export const CARIBBEAN_COLORS=['#00cfc4','#ff6840','#ffdc16','#ff409e','#168bff','#83df22','#f13c42','#ab48f0'];
export const COSTA_HOMES=[[58,-398],[81,-409],[107,-421],[134,-431],[65,-361],[96,-383],[133,-386],[156,-392],[50,-386],[110,-359],[145,-376]].map(([x,z],i)=>({id:'costa-home-'+i,x,z,w:7.8,d:7.4,floors:i%3===0?2:1,heading:i<4||i===8?0:Math.PI,color:CARIBBEAN_COLORS[i%8]}));
export const ISLA_GRANDE={id:'islaGrande',x:175,z:-502,rx:64,rz:42,h:9,ox:175,oz:-473,spread:1,en:'Isla Grande · Colón',es:'Isla Grande · Colón'};
export const GRANDE_HOMES=Array.from({length:24},(_,i)=>{const a=i*Math.PI*2/24+.06+Math.sin(i*1.7)*.025,scale=.65+(i%4)*.045;return {id:'grande-home-'+i,x:175+Math.cos(a)*(49+Math.sin(i*1.3)*1.3),z:-502+Math.sin(a)*(31+Math.cos(i*1.9)*.7),w:scale*(Math.abs(Math.sin(a))*8.2+Math.abs(Math.cos(a))*7.9),d:scale*(Math.abs(Math.cos(a))*8.2+Math.abs(Math.sin(a))*7.9),floors:i%7===0?2:1,heading:Math.PI/2-a,scale,color:CARIBBEAN_COLORS[(i+2)%8]};});
export const CARIBBEAN_HOMES=[...COSTA_HOMES,...GRANDE_HOMES];
export const CRISTO_REEF={x:175,z:-453};
export const COSTA_PIER={x:176,z:-444,w:2.5,d:15};
export const costaDock=(x,z)=>Math.abs(x-COSTA_PIER.x)<COSTA_PIER.w/2&&Math.abs(z-COSTA_PIER.z)<COSTA_PIER.d/2||Math.abs(x-175)<1.2&&z> -461.5&&z< -455.5;
export const costaBlocked=(x,z,margin=.32)=>CARIBBEAN_HOMES.some(p=>Math.abs(x-p.x)<p.w/2+margin&&Math.abs(z-p.z)<p.d/2+margin)||Math.hypot(x-CRISTO_REEF.x,z-CRISTO_REEF.z)<1.4+margin;
export const costaClearing=(x,z,margin=4)=>CARIBBEAN_HOMES.some(p=>Math.abs(x-p.x)<p.w/2+margin&&Math.abs(z-p.z)<p.d/2+margin)||costaDock(x,z);
// Keep incidental vessels out of the entire Guna Yala archipelago, not just its hub.
export const sanBlasWaters=(x,z,margin=0)=>Math.hypot((x-530)/(235+margin),(z+425)/(165+margin))<1;

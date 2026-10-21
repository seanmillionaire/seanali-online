// A clear warning zone precedes contact. Rides and indoor rooms protect the player.
export function wildlifeEncounter(player,animals,{protected:protectedMode=false}={}){
 if(protectedMode)return null;
 let warning=null;
 for(const a of animals){
  if(Math.abs((player.y||0)-(a.y||0))>2.2)continue;
  const dx=player.x-a.x,dz=player.z-a.z,heading=a.heading||0;
  const along=Math.max(-(a.length||0)/2,Math.min((a.length||0)/2,dx*Math.sin(heading)+dz*Math.cos(heading)));
  const distance=Math.hypot(dx-Math.sin(heading)*along,dz-Math.cos(heading)*along),radius=a.radius||1;
  if(distance<radius+.35)return {kind:a.kind,hit:true,distance};
  if(distance<radius+8&&(!warning||distance<warning.distance))warning={kind:a.kind,hit:false,distance};
 }
 return warning;
}
export const SAFETY_LESSONS={
 shark:{icon:'🦈',en:'Give sharks space. Leave the water calmly and tell an adult.',es:'Dale espacio al tiburón. Sal del agua con calma y avisa a un adulto.'},
 crocodile:{icon:'🐊',en:'Stay back from crocodiles and lake edges. Watch from a safe distance.',es:'Aléjate de los cocodrilos y del borde del lago. Observa desde lejos.'},
 snake:{icon:'🐍',en:'Never touch a wild snake. Step back and tell an adult.',es:'Nunca toques una serpiente silvestre. Aléjate y avisa a un adulto.'}
};

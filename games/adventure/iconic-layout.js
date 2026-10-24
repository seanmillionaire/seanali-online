// Stylized, compressed relationships; never a replacement geography transform.
// References: tourism authority, Biomuseo and Patronato Panamá Viejo (see GAME_DESIGN).
export const ICONIC_PLACES=[
 {id:'canal',kind:'mainland',x:325,z:-17,icon:'🚢',en:'Panama Canal · Cruise terminal',es:'Canal de Panamá · Terminal de cruceros'},
 {id:'boquete',kind:'mainland',x:-290,z:-50,icon:'🌿',en:'Boquete · Chiriquí',es:'Boquete · Chiriquí'},
 {id:'amador',kind:'mainland',landmark:true,x:403,z:93,icon:'🎨',en:'Amador Causeway · Biomuseo',es:'Calzada de Amador · Biomuseo',factEn:'Four islands are joined by the causeway. The colorful Biomuseo tells how Panama connects life between two continents.',factEs:'La calzada une cuatro islas. El colorido Biomuseo cuenta cómo Panamá conecta la vida de dos continentes.'},
 {id:'panamaViejo',kind:'mainland',landmark:true,x:478,z:-18,icon:'🏛️',en:'Panamá Viejo · Cathedral ruins',es:'Panamá Viejo · Ruinas de la catedral',factEn:'This stone tower belongs to the original Panama City. Walk around the ruins and look for the open arches.',factEs:'Esta torre de piedra pertenece a la ciudad original de Panamá. Pasea entre las ruinas y busca los arcos abiertos.'},
 {id:'elValle',kind:'mainland',landmark:true,x:-170,z:-72,icon:'⛰️',en:'El Valle de Antón · Crater town',es:'El Valle de Antón · Pueblo del cráter',factEn:'El Valle is a town inside an old volcanic crater. Explore the market and look up at the green rim around you.',factEs:'El Valle es un pueblo dentro de un antiguo cráter volcánico. Explora el mercado y mira las montañas verdes que te rodean.'}
];
export const AMADOR_ROAD=[[345,-35],[370,-35],[390,-20],[405,70],[420,110],[435,145],[453,180]];
export const AMADOR_ISLANDS=[{x:397,z:80,rx:24,rz:21},{x:420,z:110,rx:14,rz:12},{x:435,z:145,rx:14,rz:13},{x:453,z:180,rx:17,rz:14}];
const distance2=(x,z,a,b)=>{const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz)));return (x-a[0]-dx*t)**2+(z-a[1]-dz*t)**2;};
export function iconicLandHeight(x,z){
 if(x<375||x>470||z< -25||z>196)return 0;
 let h=0;for(const p of AMADOR_ISLANDS){const r=Math.hypot((x-p.x)/p.rx,(z-p.z)/p.rz);if(r<1)h=Math.max(h,Math.min(1.5,(1-r)*8));}
 for(let i=2;i<AMADOR_ROAD.length;i++){const d2=distance2(x,z,AMADOR_ROAD[i-1],AMADOR_ROAD[i]);if(d2<81)h=Math.max(h,Math.min(1.5,(9-Math.sqrt(d2))*.75));}return h;
}
export function valleyRelief(x,z){
 const dx=(x+170)/38,dz=(z+72)/25,r=Math.hypot(dx,dz);if(r>1.2)return 0;
 const a=Math.atan2(dz,dx),ridge=19*Math.exp(-(((r-.94)/.10)**2))*(1+.13*Math.sin(5*a)+.07*Math.cos(9*a));return 1.1+ridge;
}
export const ICONIC_VOLUMES=[
 {id:'biomuseo',x:385,z:80,w:17,d:12,h:7},
 {id:'cathedral',x:470,z:-31,w:8,d:8,h:22},
 ...[-1,1].flatMap(side=>[-1,0,1].map((n)=>({id:'valle-house',x:-170+side*12,z:-72+n*8,w:7,d:6,h:4.3})))
];
export const iconicReserved=(x,z,pad=0)=>ICONIC_VOLUMES.some(p=>Math.abs(x-p.x)<p.w/2+pad&&Math.abs(z-p.z)<p.d/2+pad)||(Math.abs(x+170)<26+pad&&Math.abs(z+72)<19+pad)||(Math.abs(x-478)<22+pad&&Math.abs(z+28)<20+pad);
export const ICONIC_SMALL_SOLIDS=[...Array.from({length:6},(_,i)=>({x:458,z:-31+i*3.8,w:1.4,d:1.3})),...Array.from({length:6},(_,i)=>({x:448,z:-31+i*3.8,w:1.6,d:2.1})),...[-7,7].flatMap(dx=>[-7,7].map(dz=>({x:-170+dx,z:-72+dz,w:3.8,d:1.7})))];
const iconicSolids=[...ICONIC_VOLUMES,...ICONIC_SMALL_SOLIDS];
export const iconicBlocked=(x,z,pad=.32)=>iconicSolids.some(p=>Math.abs(x-p.x)<p.w/2+pad&&Math.abs(z-p.z)<p.d/2+pad);

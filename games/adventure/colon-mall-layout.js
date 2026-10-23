export const COLON_MALL={x:-124,z:-404,y:3.8,levelHeight:6};
// One connected arrival lane; no abandoned elevated spur beyond the entrance.
export const MARGARITA_ROAD=[[-72,-372],[-86,-373],[-102,-376],[-116,-380],[-124,-384]];
export const MALL_SHOPS=Array.from({length:6},(_,i)=>({id:i,x:-159+i*14,z:-404,w:13,d:14,name:['🍦 Heladería','👗 Moda Caribe','🎧 Tecnología','🎁 Recuerdos','👟 Deportes','🎬 Cine Caribe'][i]}));
export const mallClearing=(x,z,m=0)=>x> -180-m&&x< -76+m&&z> -422-m&&z< -379+m;
export function mallGround(x,z){const dx=Math.max(0,Math.abs(x+124)-55),dz=Math.max(0,Math.abs(z+398)-28),d=Math.hypot(dx,dz),t=Math.max(0,Math.min(1,1-d/24));return 3.8*t*t*(3-2*t);}
export const MALL_WALLS=MALL_SHOPS.flatMap(p=>[{x:p.x,z:-411,w:13,d:.4},{x:p.x-6.5,z:-404,w:.4,d:14},{x:p.x+6.5,z:-404,w:.4,d:14},{x:p.x-4.3,z:-397,w:4.4,d:.25},{x:p.x+4.3,z:-397,w:4.4,d:.25}]);
export const mallBlocked=(x,z,m=.32)=>MALL_WALLS.some(p=>Math.abs(x-p.x)<p.w/2+m&&Math.abs(z-p.z)<p.d/2+m);
export const insideMall=(x,z)=>x> -177&&x< -78&&z> -414&&z< -387;
export const MALL_LIFT={x:-172,z:-392};


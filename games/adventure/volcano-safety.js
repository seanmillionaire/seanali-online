import {volcanoRelief} from './explore-state.js?v=156';
export const BARU={x:-135,z:-55,rx:38,rz:34};
export const LAVA_POOLS=[{dx:0,dz:0,radius:4.35,lift:9,crater:true},{dx:-5,dz:-3,radius:1.35,lift:.45},{dx:2,dz:-7,radius:1.25,lift:.4}];
export const CITY_HOSPITAL={x:105,z:-39,spawn:{x:105,z:-34.5}};
export function lavaPoolPose(pool,height,x=BARU.x,z=BARU.z){
 const px=x+pool.dx,pz=z+pool.dz;
 return {x:px,z:pz,y:(pool.crater?volcanoRelief(0,0):height(px,pz))+pool.lift,radius:pool.radius,rz:pool.radius*.88};
}
export function touchesLava(x,y,z,height){
 if(Math.abs(x-BARU.x)>10||Math.abs(z-BARU.z)>10)return false;
 return LAVA_POOLS.some(pool=>{const p=lavaPoolPose(pool,height);return Math.hypot((x-p.x)/p.radius,(z-p.z)/p.rz)<1&&y<=p.y+.3;});
}
export function returnToHospital(world){Object.assign(world,CITY_HOSPITAL.spawn);world.flight=0;world.growth=1;return CITY_HOSPITAL.spawn;}
export function createCityHospital({T,scene,make,mat,box,height}){
 const root=new T.Group();root.name='Panama City Hospital · lava rescue arrival';scene.add(root);
 const {x,z}=CITY_HOSPITAL,y=height(x,z),white=mat('#f3f6ee'),blue=mat('#367e9b'),glass=mat('#9cdae4'),red=mat('#d6413c');
 const part=(m,px,py,pz,w,h,d)=>make(box,m,px,py,pz,w,h,d,root);
 part(white,x,y+2.3,z,6,4.6,5);part(blue,x,y+4.7,z,6.4,.3,5.4);
 part(glass,x,y+1.4,z+2.55,1.6,2.8,.1);part(blue,x,y+3.25,z+2.8,5.2,.4,1.1);
 for(const side of [-1,1])part(glass,x+side*2,y+2,z+2.55,1.1,1.5,.1);
 part(white,x,y+.06,z+4,5,.12,3);part(red,x,y+4.2,z+2.67,.28,.85,.12);part(red,x,y+4.2,z+2.68,.85,.28,.12);
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#24647d';ctx.fillRect(0,0,512,128);ctx.fillStyle='#ffffff';ctx.textAlign='center';ctx.font='bold 62px sans-serif';ctx.fillText('HOSPITAL',256,85);
 const texture=new T.CanvasTexture(canvas),material=new T.SpriteMaterial({map:texture,depthTest:false});const sign=new T.Sprite(material);sign.position.set(x,y+5.7,z+2.7);sign.scale.set(6,1.5,1);root.add(sign);
 return {root,dispose(){scene.remove(root);texture.dispose();material.dispose();}};
}

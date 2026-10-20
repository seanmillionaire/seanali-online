// Large-scale city growth beyond the old circular downtown and a separate
// Colón urban waterfront. Retain the original quests, lots and saved locations.
import {mainlandContains,canalWater,gatunWater} from './geography.js?v=175';
export const EXPANDED_DISTRICTS=[
 {id:'panama-east',name:'Panama City · Eastern neighborhoods',cx:207,cz:-49,xs:[174,185,196,207,218,229,240,251],zs:[-78,-66,-54,-42,-30,-18],color:'#bcc9c5'},
 {id:'colon-port',name:'Colón · Caribbean city and port',cx:-19,cz:-127,xs:[-36,-27,-18,-9,0,9],zs:[-145,-136,-127,-118,-109],color:'#e2bf9d'}
];
export const DISTRICT_ROADS={
 panamaEast:[[163,-61],[175,-61],[181,-57],[197,-57],[213,-57],[229,-57],[245,-57]],
 colonAccess:[[-10,-125],[-17,-131],[-27,-134],[-32,-132]]
};
export function districtGround(x,z){return mainlandContains(x,z)&&!canalWater(x,z)&&!gatunWater(x,z);}
export function districtBuildings(){
 const plots=[];
 for(const region of EXPANDED_DISTRICTS){
  const occupied=[];
  for(let i=0;i<region.xs.length-1;i++)for(let j=0;j<region.zs.length-1;j++){
   const x=(region.xs[i]+region.xs[i+1])/2,z=(region.zs[j]+region.zs[j+1])/2;
   if(!districtGround(x,z))continue;
   const h=region.id==='panama-east'?3.8+((i*5+j*3)%5)*2.7:2.7+((i*2+j*4)%4)*1.6;
   plots.push({district:region.id,x,z,w:5.2,d:5.5,h,style:(i*7+j*3)%5});
  }
 }
 return plots;
}
export function createExtendedDistricts({T,scene,make,mat,box,cylinder,height}){
 const group=new T.Group();group.name='Panama City east boroughs and Colón Caribbean waterfront';scene.add(group);
 const colors=['#e3c3a2','#d5dfd6','#e5d5ab','#a7c5d1','#dbb7b0'].map(c=>mat(c,{roughness:.94}));
 const asphalt=mat('#343c43',{roughness:1}),lines=mat('#f0d588'),sidewalk=mat('#b4b8b0'),window=mat('#7595a2',{roughness:.28}),roof=mat('#675c55');
 const sea=mat('#397e89',{roughness:.73}),dock=mat('#997457');
 const put=(geo,m,x,y,z,w,h,d)=>{const o=make(geo,m,x,y,z,w,h,d,group);o.castShadow=false;return o;};
 // Only draw street asphalt on actual dry terrain. Existing highway remains
 // the arterial road and nothing is placed over Gorgona or Monkey Island.
 for(const area of EXPANDED_DISTRICTS){
  for(const x of area.xs)for(let z=area.zs[0];z<=area.zs.at(-1);z+=2){
   if(!districtGround(x,z))continue;
   const y=height(x,z);put(box,asphalt,x,y+.045,z,6.7,.085,2.1);
   if(Math.round(z/2)%7===0)put(box,lines,x,y+.098,z,.13,.018,1.0);
  }
  for(const z of area.zs)for(let x=area.xs[0];x<=area.xs.at(-1);x+=2){
   if(!districtGround(x,z))continue;
   const y=height(x,z);put(box,asphalt,x,y+.047,z,2.1,.085,6.7);
   if(Math.round(x/2)%7===0)put(box,lines,x,y+.102,z,1.0,.018,.13);
  }
 }
 const count={city:0,colon:0};
 for(const b of districtBuildings()){
  const y=height(b.x,b.z),material=colors[b.style];
  put(box,sidewalk,b.x,y+.08,b.z,b.w+2,.14,b.d+2);
  put(box,material,b.x,y+b.h/2+.15,b.z,b.w,b.h,b.d);
  put(box,roof,b.x,y+b.h+.28,b.z,b.w+.35,.33,b.d+.35);
  for(let row=0;row<Math.max(1,Math.floor(b.h/2.4));row++)for(const dx of [-1.9,0,1.9]){
   put(box,window,b.x+dx,y+1.5+row*2.35,b.z+b.d/2+.07,1.1,.84,.12);
  }
  count[b.district==='colon-port'?'colon':'city']++;
 }
 // Port promenades, freight sheds and lighthouse beacons give Colón a
 // recognizable coastal identity independent of the inland Monkey Island park.
 for(let i=0;i<5;i++){
  const x=-32+i*7,z=-143,y=height(x,-137);
  if(!districtGround(x,-137))continue;
  put(box,dock,x,y+.13,-140,6,.25,5);
  put(box,sea,x,y+1.9,-140,4.3,3.5,3.1);
 }
 const lighthouseX=-30,lighthouseZ=-139,lighthouseY=height(lighthouseX,lighthouseZ);
 if(districtGround(lighthouseX,lighthouseZ)){
  put(cylinder,colors[0],lighthouseX,lighthouseY+5,lighthouseZ,1.5,10,1.5);
  put(cylinder,lines,lighthouseX,lighthouseY+10.3,lighthouseZ,2.4,.75,2.4);
 }
 return {group,count};
}

import {createFruitEmojis} from './fruit-emojis.js';
import {landAnimalModels} from './land-animal-models.js';
import {animalBuilder} from './animal-craft.js';
import {roadDistance,inWater} from './explore-state.js';
import {ruralBlocks} from './rural-towns.js';
import {homeReserved} from './mansion-state.js';
export function createChiriquiLife(o){
 const {T,scene,mat,make,ball,box,cylinder,height,forest,state}=o,root=new T.Group();root.name='Chiriquí · farms and countryside wildlife';scene.add(root);
 const {p,link,finish}=animalBuilder(o),land=landAnimalModels(o),brown=mat('#856044'),cream=mat('#e8ddbf'),black=mat('#292d26'),red=mat('#bd352a'),gold=mat('#c5a04d'),green=mat('#4c6540'),wood=mat('#897352');
 const safe=(x,z,r=1)=>!inWater(x,z)&&roadDistance(x,z)>12+r&&!ruralBlocks(x,z,r)&&!homeReserved(x,z,r+2)&&!(state.world.estate?.buildings||[]).some(b=>Math.hypot(b.x-x,b.z-z)<r+7)&&Math.abs(height(x+r,z)-height(x-r,z))<r*.65;
 const sites=[];for(let z=-95;z<65;z+=22)for(let x=-445;x<-275;x+=24)if(safe(x,z,3)&&!forest?.trees.some(t=>Math.hypot(t.x-x,t.z-z)<3))sites.push({x,z});
 const crops=createFruitEmojis(T);const animals=[],farms=sites.filter((s,i)=>i%9===0).slice(0,4);
 function animal(kind,site,index){const g=kind==='iguana'?land.reptile(root).g:new T.Group();if(!g.parent)root.add(g);g.name='Chiriquí '+kind;const legs=[],segments=[];
  if(kind==='cow'||kind==='rooster'){const size=kind==='cow'?2.7:1.05;const icon=crops.sprite(kind,0,size*.48,0,size,g);g.userData.nativeEmoji=kind;icon.name='Native '+kind+' appearance';}
  if(kind==='snake'){for(let j=0;j<18;j++){const segment=p(j%4===0?brown:green,0,.065,j*.07,.055*(1-j/21),.05*(1-j/21),.07,g);segments.push(segment);}p(green,0,.07,-.07,.068,.045,.10,g);for(const side of [-1,1])p(black,side*.05,.095,-.12,.012,.012,.014,g);}
  if(kind==='iguana')g.scale.setScalar(.65);else if(kind!=='snake')finish(g);
  g.position.set(site.x,height(site.x,site.z)+.03,site.z);animals.push({g,kind,...site,index,legs,segments});
 }
 for(const [i,s]of sites.entries())animal(i%2?'snake':'iguana',s,i);
 for(const [i,f]of farms.entries()){
  // Open-sided shelter and vegetable rows leave an open approach from the road.
  for(const dx of [-2,2])for(const dz of [-1.5,1.5])make(cylinder,wood,f.x+dx,height(f.x+dx,f.z+dz)+1.2,f.z+dz,.09,2.4,.09,root);
  make(box,mat('#9e7960'),f.x,height(f.x,f.z)+2.5,f.z,4.8,.15,3.8,root);
  for(let j=0;j<3;j++)for(let k=0;k<5;k++){const x=f.x-3+j*.7,z=f.z+3+k*.5;if(safe(x,z)){const y=height(x,z);make(ball,green,x,y+.18,z,.23,.23,.23,root);crops.sprite('strawberry',x,y+.36,z,.48,root);}}
  for(let row=0;row<3;row++)for(let k=0;k<6;k++){const x=f.x+4+row*1.25,z=f.z-4+k*1.3;if(safe(x,z,1)){const y=height(x,z);make(cylinder,wood,x,y+.4,z,.06,.8,.06,root);make(ball,green,x,y+.8,z,.55,.7,.55,root);for(const dx of [-.36,.36])make(ball,red,x+dx,y+.7,z+.36,.07,.07,.07,root);if(k===0)crops.sprite('coffee',x,y+1.7,z,.7,root);}}
  for(let j=0;j<6;j++){const x=f.x+Math.sin(j*2.4)*5,z=f.z+Math.cos(j*2.4)*5;if(safe(x,z,2))animal(j<3?'cow':'rooster',{x,z},i*6+j);}
 }
 let time=0;return {root,animals,farms,update(dt,active,info){root.visible=!info.indoors&&info.x< -230;if(!root.visible||!active)return;time+=Math.min(dt,.1);for(const a of animals){a.g.visible=Math.hypot(a.x-info.x,a.z-info.z)<100;if(!a.g.visible)continue;const near=Math.hypot(a.g.position.x-info.x,a.g.position.z-info.z)<3,phase=(a.phase=(a.phase??a.index)+Math.min(dt,.1)*(near&&a.kind!=='cow'?2:1)),range=a.kind==='cow'?1.2:1.8,nx=a.x+Math.sin(phase*.23)*range,nz=a.z+Math.cos(phase*.23)*range;if(safe(nx,nz)){a.g.position.set(nx,height(nx,nz)+.03,nz);a.g.rotation.y=phase*.23+Math.PI/2;}a.legs.forEach((l,i)=>l.rotation.x=Math.sin(phase*2+i*Math.PI)*.15);a.segments.forEach((s,i)=>s.position.x=Math.sin(phase*3-i*.45)*.10);if(a.kind==='rooster')a.g.position.y+=Math.max(0,Math.sin(phase*4))*.025;}},dispose(){land.dispose();crops.dispose();scene.remove(root);}};
}

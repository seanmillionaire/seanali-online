import {createResidentRoutine} from './resident-routine.js';
import {pedestrianSpace} from './pedestrian-space.js';
import {residentStyle} from './regional-residents.js';
import {cityPropClear} from './city-layout.js';
import {createHuman} from './character-model.js';
import {inWater,roadDistance} from './explore-state.js';
import {regionalBlocked} from './regional-layout.js';
import {findClearPlacement} from './safe-placement.js';
// Small social circles away from traffic, water, trees and building footprints.
export function createParkinGatherings(o){
 const {T,scene,geometry,make,mat,box,cylinder,height,forest,state}=o;
 const root=new T.Group();root.name="Parkin’ · beach and neighborhood gatherings";scene.add(root);
 const pedestrians=pedestrianSpace(scene);const groups=[],colors=['#de8f46','#358e96','#b64f73','#e3c971','#5e8e62','#7169a1'];let time=0;
 const safe=(x,z)=>(x<285||z< -130||z>25||cityPropClear(x,z,.65))&&!inWater(x,z)&&!regionalBlocked(x,z)&&roadDistance(x,z)>8&&!forest?.trees?.some(t=>Math.hypot(x-t.x,z-t.z)<2.5);
 for(const [id,origin]of [{x:-68,z:12},{x:360,z:-73},{x:-46,z:-355}].entries()){
  const center=findClearPlacement(origin,(x,z)=>safe(x,z),{radius:2.5,maxRadius:40,step:1});if(!center)continue;
  const group=new T.Group();group.name=id===0?"Parkin’ en la playa":"Parkin’ del barrio";root.add(group);const actors=[];
  for(let i=0;i<6;i++){const angle=i*Math.PI/3+id*.45,r=2+(i%2)*.3,x=center.x+Math.sin(angle)*r,z=center.z+Math.cos(angle)*r;if(!safe(x,z))continue;
   const h=createHuman(o,{...residentStyle(x,z,83+id*13+i),index:83+id*13+i,gender:i%2?'man':'woman',skinTone:(i+id*2)%7,beach:id===0,beachHair:['short','bun','curls','long','short','bun'][i],beachWear:i%3===1?'sundress':'tee-shorts',outfitColor:colors[(i+id)%6],pantsColor:['#344f65','#c4aa81','#6d5548'][i%3]});h.g.name=(i%2?'Man':'Woman')+" · Parkin’ friend";h.g.position.set(x,height(x,z),z);h.g.rotation.y=angle+Math.PI;group.add(h.g);h.batch();const actor={...h,angle,index:i};actor.routine=createResidentRoutine(actor,{seed:1200+id*71+i*137,home:{x,z},height,radius:2.3,speed:.6,clear:(px,pz)=>safe(px,pz)&&Math.hypot(px-center.x,pz-center.z)>1.3});pedestrians.add(actor);actors.push(actor);
  }
  const wood=mat('#a78255'),cool=mat(id===0?'#4e9fae':'#d99554');make(box,wood,center.x,height(center.x,center.z)+.55,center.z,1.1,.12,.8,group);for(const side of [-1,1])make(box,wood,center.x+side*.42,height(center.x,center.z)+.26,center.z,.07,.52,.65,group);
  make(box,cool,center.x+.55,height(center.x+.55,center.z+.65)+.22,center.z+.65,.55,.44,.4,group);
  for(let i=0;i<3;i++)make(cylinder,mat(colors[i]),center.x+(i-1)*.23,height(center.x,center.z)+.70,center.z,.055,.18,.055,group);
  groups.push({group,center,actors});
 }
 return {root,groups,update(dt,active){if(active)time+=Math.min(dt,.1);for(const {group,center,actors}of groups){group.visible=Math.hypot(state.world.x-center.x,state.world.z-center.z)<100;if(!group.visible)continue;for(const a of actors){a.routine.update(dt,active,(x,z)=>actors.some(b=>b!==a&&Math.hypot(x-b.g.position.x,z-b.g.position.z)<.85)||Math.hypot(x-state.world.x,z-state.world.z)<.75);}}},dispose(){for(const g of groups)for(const a of g.actors)pedestrians.remove(a);scene.remove(root);}};
}

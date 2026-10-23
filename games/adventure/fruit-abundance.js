import {fruitSiteId} from './fruit-site-ids.js';
import {snakeCorridorContains} from './east-jungle-layout.js';
import {worldIslands,HIGHWAY_CURVES,roadDistance,inWater,isletHeight} from './explore-state.js?v=225';
import {homeReserved} from './mansion-state.js?v=225';
import {regionalClearing} from './regional-layout.js?v=225';
import {ruralBlocks} from './rural-towns.js?v=225';
import {botanicalGeometry} from './botanical-geometry.js?v=225';
import {createFruitEmojis} from './fruit-emojis.js';
export const MANGO_VARIETIES=[{name:'red',color:'#c74535'},{name:'green',color:'#70a32b'},{name:'yellow',color:'#efc53b'}];
export function fruitGroves(){
 const sites=[];
 const offer=(x,z,kind,region)=>{if(snakeCorridorContains(x,z)||inWater(x,z)||isletHeight(x,z)<.4||roadDistance(x,z)<17||homeReserved(x,z,7)||regionalClearing(x,z,6)||ruralBlocks(x,z,7)||sites.some(p=>Math.hypot(p.x-x,p.z-z)<5.5))return;
  sites.push({id:fruitSiteId(kind,x,z),kind,x,z,region,scale:kind==='banana'?.9:1+(sites.length%4)*.09});};
 const road=HIGHWAY_CURVES.cityToBaru;
 for(let i=1;i<road.length;i++){const a=road[i-1],b=road[i],dx=b[0]-a[0],dz=b[1]-a[1],len=Math.hypot(dx,dz);for(let d=0;d<len;d+=13)for(const side of [-1,1]){const x=a[0]+dx*d/len-dz/len*(22+(i%2)*9)*side,z=a[1]+dz*d/len+dx/len*(22+(i%2)*9)*side;if(x> -405&&x<265)offer(x,z,['mango','banana','coconut'][(sites.length+i)%3],'countryside');}}
 for(const land of worldIslands.filter(p=>!['pizzaCity','sunset','monkeyIslet','colon'].includes(p.id))){
  const n=land.guna?4:land.id==='islaGrande'?28:20;
  for(let i=0;i<n;i++){const a=i*2.399963,r=.32+(i%4)*.105;offer(land.x+Math.cos(a)*land.rx*r,land.z+Math.sin(a)*land.rz*r,land.guna?'coconut':['banana','coconut','mango'][i%3],land.id);}
 }
 for(let i=0;i<40;i++)offer(535+(i%8)*27,-145+Math.floor(i/8)*30,['banana','mango','coconut'][i%3],'jungle');
 // Roadside banana gardens are visible throughout Colón and Costa Arriba.
 for(let z=-419;z<=-337;z+=9)for(let x=-86;x<=206;x+=9){const i=Math.round((x+86)/9)+Math.round((z+419)/9);offer(x+(i%3)*.7,z,i%6<4?'banana':i%6===4?'coconut':'mango',x<20?'colon':'costaArriba');}
 return sites;
}
// Tree crowns and hundreds of harvestable fruit clusters share GPU batches.
export function createFruitAbundance({T,scene,geometry,mat,ball,cylinder,height,state}){
 const root=new T.Group();root.name='Abundant Panama fruit groves';scene.add(root);const sites=fruitGroves().filter(p=>Math.hypot(p.x-530,p.z+430)>8&&!(state?.world?.estate?.buildings||[]).some(b=>Math.hypot(p.x-b.x,p.z-b.z)<10)),batches=new Map(),dummy=new T.Object3D(),resources=[];
 const emojis=createFruitEmojis(T),fruitBatches=new Map();
 const bark=mat('#806344'),leaf=mat('#ffffff',{vertexColors:true,side:T.DoubleSide,roughness:.8});
 const crowns=Object.fromEntries(['palm','banana','natural'].map(k=>[k,botanicalGeometry(T,geometry,k)]));
 function part(g,m,x,y,z,w,h,d,ry=0){const key=g.uuid+m.uuid+Math.floor(x/64)+","+Math.floor(z/64);if(!batches.has(key))batches.set(key,{g,m,items:[]});const b=batches.get(key),item={x,y,z,w,h,d,ry,visible:true};b.items.push(item);return item;}
 const foodTrees=[];
 for(const [i,p]of sites.entries()){
  const ground=height(p.x,p.z),s=p.scale,kind=p.kind==='coconut'?'palm':p.kind==='mango'?'natural':'banana',h=kind==='palm'?7:kind==='natural'?6:3.1;
  part(cylinder,bark,p.x,ground+h*s/2,p.z,.27*s,h*s,.27*s);part(crowns[kind],leaf,p.x,ground+h*s,p.z,s,s,s,i*2.4);
  const fruits=[];
  for(let j=0;j<(p.kind==='banana'?12:18);j++){// Hanging bunches sit below and beyond the leaves, rather than inside the crown.
   const cluster=Math.floor(j/3),slot=j%3,a=cluster*Math.PI/3+i*.37;
   const ring=p.kind==='mango'?2.65:p.kind==='banana'?1.15:1.05;
   const x=p.x+(Math.cos(a)*ring+Math.cos(a+Math.PI/2)*(slot-1)*.48)*s;
   const z=p.z+(Math.sin(a)*ring+Math.sin(a+Math.PI/2)*(slot-1)*.48)*s;
   const y=ground+(h-(p.kind==='mango'?1.15:1.45)-slot*.48)*s;
   const item={x,y,z,size:(p.kind==='banana'?.92:.84)*s,visible:true};if(!fruitBatches.has(p.kind))fruitBatches.set(p.kind,[]);fruitBatches.get(p.kind).push(item);
   fruits.push(item);
  }
  if(p.kind==='coconut')for(let j=0;j<4;j++){const x=p.x+1.25+j*.65,z=p.z+1.15;fruitBatches.get('coconut').push({x,y:height(x,z)+.4,z,size:.72,visible:true});}
  foodTrees.push({...p,fruits});
 }
 for(const b of batches.values()){const mesh=new T.InstancedMesh(b.g,b.m,b.items.length);mesh.name='Batched fruit grove trees';
  b.items.forEach((item,index)=>{const put=()=>{dummy.position.set(item.x,item.y,item.z);dummy.rotation.set(0,item.ry,0);dummy.scale.set(item.visible?item.w:0,item.visible?item.h:0,item.visible?item.d:0);dummy.updateMatrix();mesh.setMatrixAt(index,dummy.matrix);mesh.instanceMatrix.needsUpdate=true;};put();Object.defineProperty(item,'visible',{get(){return this.shown!==false;},set(v){this.shown=!!v;put();},configurable:true});item.getWorldPosition=target=>target.set(item.x,item.y,item.z);});mesh.computeBoundingSphere();root.add(mesh);
 }
 for(const [kind,items]of fruitBatches)emojis.batch(kind,items,root);
 root.userData.solidTrees=sites.map(p=>({...p,size:p.scale}));
 return {root,foodTrees,update(indoors){root.visible=!indoors;},dispose(){scene.remove(root);emojis.dispose();resources.forEach(x=>x.dispose());}};
}

import {snakeCorridorContains} from './east-jungle-layout.js';
import {worldIslands,HIGHWAY_CURVES,roadDistance,inWater,isletHeight} from './explore-state.js?v=225';
import {homeReserved} from './mansion-state.js?v=225';
import {regionalClearing} from './regional-layout.js?v=225';
import {ruralBlocks} from './rural-towns.js?v=225';
import {botanicalGeometry} from './botanical-geometry.js?v=225';
import {createNatureDecor} from './nature-decor.js?v=225';
export const MANGO_VARIETIES=[{name:'red',color:'#c74535'},{name:'green',color:'#70a32b'},{name:'yellow',color:'#efc53b'}];
export function fruitGroves(){
 const sites=[];
 const offer=(x,z,kind,region)=>{if(snakeCorridorContains(x,z)||inWater(x,z)||isletHeight(x,z)<.4||roadDistance(x,z)<17||homeReserved(x,z,7)||regionalClearing(x,z,6)||ruralBlocks(x,z,7)||sites.some(p=>Math.hypot(p.x-x,p.z-z)<5.5))return;
  sites.push({id:kind+(1000+sites.length),kind,x,z,region,scale:kind==='banana'?.9:1+(sites.length%4)*.09});};
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
 const root=new T.Group();root.name='Abundant Panama fruit groves';scene.add(root);const sites=fruitGroves().filter(p=>!(state?.world?.estate?.buildings||[]).some(b=>Math.hypot(p.x-b.x,p.z-b.z)<10)),batches=new Map(),dummy=new T.Object3D(),resources=[];
 const bark=mat('#806344'),leaf=mat('#ffffff',{vertexColors:true,side:T.DoubleSide,roughness:.8}),yellow=mat('#ffdb18',{vertexColors:true,roughness:.7}),green=mat('#8fc62f'),mango=MANGO_VARIETIES.map(v=>mat(v.color,{roughness:.58})),brown=mat('#805331'),white=mat('#fff7e5');
 const crowns=Object.fromEntries(['palm','banana','natural'].map(k=>[k,botanicalGeometry(T,geometry,k)])),banana=geometry(createNatureDecor(T,g=>g)(7)),half=geometry(new T.SphereGeometry(1,10,6,0,Math.PI*2,Math.PI/2,Math.PI/2));
 function part(g,m,x,y,z,w,h,d,ry=0){const key=g.uuid+m.uuid;if(!batches.has(key))batches.set(key,{g,m,items:[]});const b=batches.get(key),item={x,y,z,w,h,d,ry,visible:true};b.items.push(item);return item;}
 const foodTrees=[];
 for(const [i,p]of sites.entries()){
  const ground=height(p.x,p.z),s=p.scale,kind=p.kind==='coconut'?'palm':p.kind==='mango'?'natural':'banana',h=kind==='palm'?7:kind==='natural'?6:3.1;
  part(cylinder,bark,p.x,ground+h*s/2,p.z,.27*s,h*s,.27*s);part(crowns[kind],leaf,p.x,ground+h*s,p.z,s,s,s,i*2.4);
  const fruits=[];
  for(let j=0;j<(p.kind==='banana'?12:18);j++){const a=j*2.399963,ring=p.kind==='mango'?1.7+(j%3)*.5:.42+(j%3)*.16,x=p.x+Math.cos(a)*ring*s,z=p.z+Math.sin(a)*ring*s,y=ground+(h-(p.kind==='mango'?.4:1.05)-(j%4)*.27)*s;
   const item=part(p.kind==='banana'?banana:ball,p.kind==='banana'?yellow:p.kind==='mango'?mango[(i+j)%mango.length]:green,x,y,z,p.kind==='banana'?.9:.28,p.kind==='banana'?1.0:.36,p.kind==='banana'?.9:.28,a);
   fruits.push(item);
  }
  if(p.kind==='coconut')for(let j=0;j<4;j++){const x=p.x+1.5+j*.36,z=p.z+1.15,y=height(x,z)+.18;if(j<2)part(ball,brown,x,y,z,.24,.27,.24);else{part(half,brown,x,y,z,.28,.28,.28);part(cylinder,white,x,y+.015,z,.245,.025,.245);part(cylinder,brown,x,y+.031,z,.10,.027,.10);}}
  foodTrees.push({...p,fruits});
 }
 for(const b of batches.values()){const mesh=new T.InstancedMesh(b.g,b.m,b.items.length);mesh.name='Batched '+(b.m===yellow?'ripe banana bunches':mango.includes(b.m)?MANGO_VARIETIES[mango.indexOf(b.m)].name+' mango fruit':b.m===green?'green coconuts':b.m===white?'split coconut flesh':'fruit grove detail');
  b.items.forEach((item,index)=>{const put=()=>{dummy.position.set(item.x,item.y,item.z);dummy.rotation.set(0,item.ry,0);dummy.scale.set(item.visible?item.w:0,item.visible?item.h:0,item.visible?item.d:0);dummy.updateMatrix();mesh.setMatrixAt(index,dummy.matrix);mesh.instanceMatrix.needsUpdate=true;};put();Object.defineProperty(item,'visible',{get(){return this.shown!==false;},set(v){this.shown=!!v;put();},configurable:true});item.getWorldPosition=target=>target.set(item.x,item.y,item.z);});mesh.computeBoundingSphere();root.add(mesh);
 }
 root.userData.solidTrees=sites.map(p=>({...p,size:p.scale}));
 return {root,foodTrees,update(indoors){root.visible=!indoors;},dispose(){scene.remove(root);resources.forEach(x=>x.dispose());}};
}

import {createFruitEmojis} from './fruit-emojis.js';
import {COLON_MALL,MALL_SHOPS,MALL_WALLS,insideMall,MALL_LIFT} from './colon-mall-layout.js';
export function createColonMall(o){
 const {T,scene,make,mat,box,cylinder,geometry,models}=o,root=new T.Group();root.name='Margarita · Plaza del Sol waterfront shopping';scene.add(root);const goods=createFruitEmojis(T),textures=[];const sign=(parent,text,x,h,z,w,d)=>{if(typeof document==='undefined')return new T.Group();const c=document.createElement('canvas');c.width=1024;c.height=192;const ctx=c.getContext('2d');ctx.fillStyle='#f4f3eb';ctx.fillRect(0,0,1024,192);ctx.fillStyle='#145776';ctx.font='bold 76px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,96,980);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;textures.push(texture);return make(box,mat('#ffffff',{map:texture}),x,h,z,w,d,.04,parent);};const y=COLON_MALL.y,people=[],roofs=[],occluders=[],levels=[],white=mat('#f2f0e8',{roughness:.7}),glass=mat('#5996ad',{transparent:true,opacity:.48,roughness:.15,metalness:.25}),blue=mat('#16708b'),tile=mat('#c8c7bc'),metal=mat('#b6c4c7',{metalness:.7,roughness:.25});
 let floor=0;const building=new T.Group();root.add(building);
 const part=(m,x,h,z,w,d,l)=>{const mesh=make(box,m,x,y+h,z,w,d,l,building);if(h>=4.5||z===-397)occluders.push(mesh);return mesh;};
 part(tile,-124,.04,-394,104,.08,36);
 for(const p of MALL_WALLS)part(p.z===-397?glass:white,p.x,2.3,p.z,p.w,4.6,p.d);
 for(const p of MALL_SHOPS){
  part(blue,p.x,4.7,-397,13,.55,.4);occluders.push(sign(building,p.name,p.x,y+4.7,-396.75,11,.85));
  roofs.push({mesh:part(white,p.x,5,-404,13,.18,14),x:p.x});
  sign(building,"🚪 EXIT ↓",p.x+4.5,y+2.8,-397.2,2,.45).rotation.y=Math.PI;
  for(const x of [p.x-5.8,p.x+5.8]){part(metal,x,2.6,-393,.14,5.2,.14);part(blue,x,1,-406,1.1,2,7);for(let k=0;k<4;k++)part(white,x,1+k*.5,-406,1.4,.07,7);}
  for(const side of [-1,1])for(let k=0;k<6;k++){const kind=[['coconut','mango'],['dress','bag'],['headphones','laptop'],['teddy','gift'],['shoe','shirt'],['gift','teddy']][p.id][k%2];goods.sprite(kind,p.x+side*4.9,y+1.3+(k%2)*.7,-408+Math.floor(k/2)*1.5,.7,building);}
  // Open doorways and real visible display stock; no facade teleport.
  sign(building,['🍦 🥭 🥥','👗 👕 👜','🎧 📱 💻','🇵🇦 🎁 🧸','👟 ⚽ 🧢','🎬 🍿 🎟️'][p.id],p.x,y+2.3,-410.65,9,1.9);
  part(white,p.x+3.7,.55,-407,2,1.1,1.5);
  const cashier=models.person(building,p.x+3.7,y,-409,30+p.id);cashier.g.rotation.y=0;
  // Tensile canopy silhouette, shared simple geometry rather than texture downloads.
  const g=geometry(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute([p.x-7,y+5.2,-397,p.x,y+7,-394,p.x+7,y+5.2,-397,p.x-7,y+5.2,-397,p.x,y+7,-394,p.x-7,y+5.2,-390,p.x-7,y+5.2,-390,p.x,y+7,-394,p.x+7,y+5.2,-390,p.x+7,y+5.2,-390,p.x,y+7,-394,p.x+7,y+5.2,-397],3));g.computeVertexNormals();const canopy=new T.Mesh(g,mat('#fffaf1',{side:T.DoubleSide}));building.add(canopy);occluders.push(canopy);
 }
 occluders.push(sign(building,'PLAZA DEL SOL · DUTY FREE',-124,y+7.5,-393,29,2.2));
 for(const x of [-170,-78]){part(metal,x,2.6,-381,.15,5.2,.15);occluders.push(sign(root,'MARGARITA → PLAZA DEL SOL',x,y+4.9,-380.8,9,1.2));}
 // Clone the furnished retail floor: six shops on each level, 3x original floor area.
 for(const mesh of occluders)if(mesh)mesh.userData.mallOverhead=true;for(const r of roofs)r.mesh.userData.mallRoofX=r.x;
 const upper=building.clone(true);upper.position.y=6;root.add(upper);levels.push(building,upper);
 for(const level of levels){const gy=level===upper?6:0;for(const x of [-176,-77])make(box,metal,x,y+gy+1,-392,.12,2,24,root);}
 const lift=new T.Group();root.add(lift);make(box,blue,MALL_LIFT.x,y+.08,MALL_LIFT.z,5,.16,5,lift);sign(lift,'↕ ASCENSOR / LIFT',MALL_LIFT.x,y+3,MALL_LIFT.z-2.2,5,.7);sign(lift,'↕ ASCENSOR / LIFT',MALL_LIFT.x,y+9,MALL_LIFT.z-2.2,5,.7);
 // Cinema seating and a wall screen on both floors.
 for(const level of levels){const gy=level===upper?6:0;make(box,mat('#10202d'),-89,y+2.6,-410.6,9,3,.12,level);for(let row=0;row<3;row++)for(let seat=0;seat<4;seat++){make(box,mat('#913b52'),-93+seat*2,y+.6,-408+row*2,1.3,1.1,.8,level===upper?upper:building);}}
 for(let i=0;i<36;i++){

  const shop=MALL_SHOPS[i%6],lane=(i%3-1)*.7,start={x:shop.x+lane,z:-386+(i%4)*1.1},h=models.person(root,start.x,y+(i>=18?6:0),start.z,50+i);
  const route=[start,{x:shop.x+lane,z:-395},{x:shop.x+lane,z:-400},{x:shop.x+lane,z:-405},{x:shop.x+lane,z:-400},{x:shop.x+lane,z:-395},start];people.push({floor:i>=18?1:0,h,route,index:1,wait:i*.31,phase:i,pace:.7+(i%5)*.12,visits:0});
 }
 let clock=0;return {root,people,shops:MALL_SHOPS,get floor(){return floor;},surface(x,z){return floor&&insideMall(x,z)?y+6:-Infinity;},near(x,z){if(Math.hypot(x-MALL_LIFT.x,z-MALL_LIFT.z)<3)return {type:'mall',activity:'lift'};const shop=MALL_SHOPS.find(p=>Math.abs(x-p.x)<5&&z< -399&&z> -410);return shop?{type:'mall',activity:shop.id===0?'icecream':shop.id===1||shop.id===4?'clothes':shop.id===5?'cinema':'browse'}:null;},changeFloor(){floor=1-floor;return floor;},update(dt,active,info){if(floor&&!insideMall(info.x,info.z))floor=0;upper.visible=!(floor===0&&insideMall(info.x,info.z));root.visible=!info.indoors&&Math.hypot(info.x+124,info.z+398)<180;for(const mesh of occluders)if(mesh)mesh.visible=!insideMall(info.x,info.z);for(const r of roofs)r.mesh.visible=!(Math.abs(info.x-r.x)<8&&info.z< -394&&info.z> -414);upper.traverse(mesh=>{if(mesh.userData.mallOverhead)mesh.visible=!(floor===1&&insideMall(info.x,info.z));});if(!active||!root.visible)return;dt=Math.min(.1,dt);clock+=dt;for(const p of people){p.h.g.visible=!(floor===0&&insideMall(info.x,info.z)&&p.floor===1);let moving=false;const pos=p.h.g.position;if(p.wait>0)p.wait-=dt;else{const q=p.route[p.index],dx=q.x-pos.x,dz=q.z-pos.z,d=Math.hypot(dx,dz);if(d<.06){p.index=(p.index+1)%p.route.length;p.wait=p.index===4?5+p.phase%7:p.index===1?2+p.phase%3:0;p.visits++;}else{const step=Math.min(d,p.pace*dt),nx=pos.x+dx/d*step,nz=pos.z+dz/d*step;if(Math.hypot(nx-info.x,nz-info.z)>.8){pos.set(nx,y+p.floor*6,nz);p.h.g.rotation.y=Math.atan2(dx,dz);p.phase+=step*6;moving=true;}}}p.h.animate(p.phase,moving);p.h.legs.forEach((l,i)=>l.rotation.x=moving?Math.sin(p.phase+i*Math.PI)*.34:0);p.h.arms.forEach((a,i)=>a.rotation.x=moving?-Math.sin(p.phase+i*Math.PI)*.2:-.12+Math.sin(clock+i+p.phase)*.03);}},dispose(){goods.dispose();textures.forEach(t=>t.dispose());scene.remove(root);}};
}


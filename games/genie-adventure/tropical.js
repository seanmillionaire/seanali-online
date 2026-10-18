import {islandPoint} from './explore-state.js?v=genie2';
/* One shared photographic atlas; textured cutouts keep the natural detail inexpensive on phones. */
export function createTropical({T,scene,camera,height,geometry,mat,make,ball,renderer,surfaces=null}){
 const temp=new T.Vector3();let loaded=false;const textures=[],cards=[],wildlife=[],atlas=new T.TextureLoader().load('/games/adventure/tropical-atlas.png',()=>{loaded=true;cards.forEach(c=>c.visible=true);if(renderer)renderer.shadowMap.needsUpdate=true;});textures.push(atlas);atlas.colorSpace=T.SRGBColorSpace;atlas.anisotropy=4;
 const tileGeometries=[],tileMaterials=[];
 for(let tile=0;tile<16;tile++){
  const g=geometry(new T.PlaneGeometry(1,1));g.translate(0,.5,0);const uv=g.attributes.uv,col=tile%4,row=Math.floor(tile/4);for(let i=0;i<uv.count;i++)uv.setXY(i,(col+.012+uv.getX(i)*.976)/4,(3-row+.012+uv.getY(i)*.976)/4);tileGeometries.push(g);tileMaterials.push(mat('#ffffff',{map:atlas,alphaTest:.25,side:T.DoubleSide,roughness:.9}));
 }
 function card(tile,x,y,z,w,h,parent=scene){const g=new T.Group();g.position.set(x,y,z);parent.add(g);const m=make(tileGeometries[tile],tileMaterials[tile],0,0,0,w,h,1,g);g.visible=loaded;cards.push(g);return g;}
 // Fine mineral grain, weathering, and broad tonal variation share a small procedural texture.
 const size=256,data=new Uint8Array(size*size*4);let seed=17;for(let y=0;y<size;y++)for(let x=0;x<size;x++){seed=(seed*1664525+1013904223)>>>0;const grain=(seed/4294967296-.5)*40,broad=Math.sin(x*.037+Math.sin(y*.03))*18+Math.sin(y*.13+x*.07)*8,v=Math.max(50,Math.min(255,188+grain+broad)),i=(y*size+x)*4;data[i]=v;data[i+1]=v;data[i+2]=v;data[i+3]=255;}
 const grain=new T.DataTexture(data,size,size,T.RGBAFormat);grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.magFilter=T.LinearFilter;grain.minFilter=T.LinearMipmapLinearFilter;grain.generateMipmaps=true;grain.needsUpdate=true;textures.push(grain);
 let randomSeed=91;const random=()=>{randomSeed=(randomSeed*1664525+1013904223)>>>0;return randomSeed/4294967296;};
 // Sculpted palms: curved trunks and individual tapered leaflets, sharing one canopy mesh.
 const foodTrees=[],palms=[],bark=mat('#807052',{map:surfaces?.wood||grain,bumpMap:surfaces?.wood||grain,bumpScale:.08}),frond=mat('#397b39',{side:T.DoubleSide,roughness:.78,vertexColors:true}),coconut=mat('#807347',{roughness:.95});
 const leafPoints=[],leafColors=[];
 const addTri=(a,b,c,tone)=>{for(const p of [a,b,c]){leafPoints.push(...p);leafColors.push(.65*tone,tone,.55*tone);}};
 for(let f=0;f<9;f++){
  const angle=f*Math.PI*2/9,length=2.5+(f%3)*.25;
  const point=(t,side=0)=>{const r=t*length;return [Math.cos(angle)*r-Math.sin(angle)*side,.38*Math.sin(t*Math.PI)-t*t*.9,Math.sin(angle)*r+Math.cos(angle)*side];};
  for(let j=1;j<15;j++){const t=j/15,width=.48*Math.sin(t*Math.PI)**.6;for(const side of [-1,1]){const a=point(t-.035),b=point(Math.min(.99,t+.17),side*width),c=point(t+.035);addTri(a,b,c,.75+(j%3)*.1);}}
 }
 const canopyGeometry=geometry(new T.BufferGeometry());canopyGeometry.setAttribute('position',new T.Float32BufferAttribute(leafPoints,3));canopyGeometry.setAttribute('color',new T.Float32BufferAttribute(leafColors,3));canopyGeometry.computeVertexNormals();
 function palm(x,z,scale,fruiting=false){const root=new T.Group();root.name=fruiting?'Coconut palm':'Coastal palm';root.position.set(x,height(x,z)-.06,z);root.rotation.y=random()*Math.PI*2;root.scale.setScalar(scale);scene.add(root);const curve=new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3(.12,1.8,0),new T.Vector3(.45,3.6,.12),new T.Vector3(.8,5.1,.2)]);make(geometry(new T.TubeGeometry(curve,10,.13,7,false)),bark,0,0,0,1,1,1,root);const crown=make(canopyGeometry,frond,.8,5.1,.2,1,1,1,root);const fruits=[];for(let n=0;n<(fruiting?6:0);n++){const a=n*Math.PI/3;fruits.push(make(ball,coconut,.8+Math.cos(a)*.32,4.8-(n%2)*.15,.2+Math.sin(a)*.32,.22,.27,.22,root));}if(fruiting)foodTrees.push({id:'coconut'+palms.length,kind:'coconut',x,z,fruits});palms.push({root,crown,phase:random()*6});}
 // Open sight lines, coconut groves, banana plants, coastal ferns, and exposed limestone.
 for(let i=0;i<31;i++){let x=(random()-.5)*34,z=(random()-.5)*21;if((x/18)**2+(z/12)**2>.9||(x>0&&x<9&&z>-4)||Math.hypot(x-11,z-7)<3||Math.hypot(x+1,z+5)<3)continue;const scale=.8+random()*.5;palm(x,z,scale);}
 for(let i=0;i<18;i++){const a=i*2.4,r=7+random()*7,x=Math.sin(a)*r,z=Math.cos(a)*r*.6;if((x>1&&x<9&&z>-2)||Math.hypot(x-11,z-7)<3)continue;card(i%3===0?1:2,x,height(x,z)-.03,z,i%3===0?3.6:1.8,i%3===0?4.2:1.4);}
 for(let i=0;i<14;i++){const a=i/14*Math.PI*2,x=Math.cos(a)*18,z=Math.sin(a)*12;card(3,x,height(x,z)-.08,z,1.2+random()*1.4,.7+random());}
 for(let i=0;i<7;i++){const a=i*2.4,{x,z}=islandPoint('islet',24+Math.sin(a)*2,-8+Math.cos(a)*1.5);card(15,x,height(x,z),z,1.4,1.2);}
 for(let i=0;i<12;i++){const {x,z}=islandPoint('wilds',-9+(i%4)*6,-37+Math.floor(i/4)*7);card(1,x,height(x,z),z,3.2,3.8);const fruits=[];for(let n=0;n<6;n++)fruits.push(card(7,x+(n%3-.8)*.25,height(x,z)+2.1-Math.floor(n/3)*.3,z+.2,.5,.65));foodTrees.push({id:'banana'+i,kind:'banana',x,z,fruits});}
 for(const [tile,x,z,w,h] of [[8,-5,11,1.2,.8],[9,14,8,.7,.5],[10,-15,5,1.2,1.7],[11,-10,-6,1.1,1.1],[9,8,11,.6,.4],[8,-13,8,1,.7]]){const g=card(tile,x,height(x,z)+.02,z,w,h);wildlife.push({g,x,z,tile,phase:random()*6});}
 // Reef cover stays photographic; swimming animals use articulated 3D models.
 for(let i=0;i<7;i++)card(14,-6+i*2,-.9,15+(i%2)*2,1.3,1);
 let impact={x:0,z:0,strength:0,phase:0};
 return {card,palm,grain,foodTrees,setImpact(x,z,strength,phase){impact={x,z,strength,phase};},update(time){for(const p of palms){const d=Math.hypot(p.root.position.x-impact.x,p.root.position.z-impact.z),wave=Math.sin(impact.phase-d*.45)*impact.strength*Math.max(0,1-d/16);p.root.rotation.z=wave*.1;p.root.rotation.x=wave*.06;p.crown.rotation.z=Math.sin(time*.65+p.phase)*.025;p.crown.rotation.x=Math.cos(time*.5+p.phase)*.018;}for(const g of cards){const p=g.getWorldPosition(temp);g.rotation.y=Math.atan2(camera.position.x-p.x,camera.position.z-p.z)-(g.parent?.rotation.y||0);}for(const a of wildlife){const swimming=a.tile===12,speed=swimming?.6:.08;a.g.position.x=a.x+Math.sin(time*speed+a.phase)*(swimming?1.2:.35);a.g.position.z=a.z+Math.cos(time*speed+a.phase)*(swimming?.5:.2);if(!swimming)a.g.position.y=height(a.g.position.x,a.g.position.z)+.02+Math.abs(Math.sin(impact.phase))*impact.strength*Math.max(0,1-Math.hypot(a.x-impact.x,a.z-impact.z)/14)*1.3;}},dispose(){textures.forEach(t=>t.dispose());}};
}

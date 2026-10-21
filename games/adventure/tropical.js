import {createNatureDecor} from './nature-decor.js?v=224';
import {oceanModel} from './ocean-models.js?v=224';
import {createNaturalTrees} from './natural-trees.js?v=224';
import {islandPoint} from './explore-state.js?v=224';
/* Shared sculpted props and botanical meshes, consistently lit from every angle. */
export function createTropical({T,scene,camera,height,geometry,mat,make,ball,renderer,surfaces=null}){
 const forest=createNaturalTrees({T,geometry,mat,make,height,scene,surfaces});
 const textures=[],wildlife=[],specimen=createNatureDecor(T,geometry),propMaterial=mat('#ffffff',{vertexColors:true,roughness:.87,side:T.DoubleSide});
 function card(tile,x,y,z,w,h,parent=scene){
  const g=new T.Group();g.position.set(x,y,z);g.rotation.y=(x*.71+z*.37)%6.283;parent.add(g);
  if(tile===8||tile===12||tile===13){
   const model=oceanModel(T,{geometry,mat,make,ball},tile===8?'Sea turtle':'Reef fish');g.add(model.g);
   model.g.position.y=tile===8?h*.30:h*.5;model.g.scale.set(w/(tile===8?1.8:.3),h/(tile===8?.7:.5),w/(tile===8?1.8:.3));
  }else make(specimen(tile),propMaterial,0,0,0,w,h,w,g);
  g.name='Natural specimen '+tile;if(tile===3)g.userData.solidRock=true;return g;
 }
 // Fine mineral grain, weathering, and broad tonal variation share a small procedural texture.
 const size=256,data=new Uint8Array(size*size*4);let seed=17;for(let y=0;y<size;y++)for(let x=0;x<size;x++){seed=(seed*1664525+1013904223)>>>0;const grain=(seed/4294967296-.5)*40,broad=Math.sin(x*.037+Math.sin(y*.03))*18+Math.sin(y*.13+x*.07)*8,v=Math.max(50,Math.min(255,188+grain+broad)),i=(y*size+x)*4;data[i]=v;data[i+1]=v;data[i+2]=v;data[i+3]=255;}
 const grain=new T.DataTexture(data,size,size,T.RGBAFormat);grain.wrapS=grain.wrapT=T.RepeatWrapping;grain.magFilter=T.LinearFilter;grain.minFilter=T.LinearMipmapLinearFilter;grain.generateMipmaps=true;grain.needsUpdate=true;textures.push(grain);
 let randomSeed=91;const random=()=>{randomSeed=(randomSeed*1664525+1013904223)>>>0;return randomSeed/4294967296;};
 // Sculpted palms: curved trunks and individual tapered leaflets, sharing one canopy mesh.
 const foodTrees=[],palms=[],coconut=mat('#807347',{roughness:.95});
 function palm(x,z,scale,fruiting=false){
 const tree=forest.addTree('palm',x,z,scale*.85,palms.length),root=tree.root,crown=tree.crown,tip=tree.tip,fruits=[];
 for(let n=0;n<(fruiting?6:0);n++){const a=n*Math.PI/3;fruits.push(make(ball,coconut,tip.x+Math.cos(a)*.32,tip.y-.35-(n%2)*.15,tip.z+Math.sin(a)*.32,.22,.27,.22,root));}
 if(fruiting)foodTrees.push({id:'coconut'+palms.length,kind:'coconut',x,z,fruits});
 palms.push({root,crown,phase:random()*6});return tree;
 }
 // Open sight lines, coconut groves, banana plants, coastal ferns, and exposed limestone.
 for(let i=0;i<10;i++){let x=(random()-.5)*34,z=(random()-.5)*21;if(Math.hypot(x+10,z+7)<6||Math.hypot(x-12,z+6)<6||(x/18)**2+(z/12)**2>.9||(x>0&&x<9&&z>-4)||Math.hypot(x-11,z-7)<3||Math.hypot(x+1,z+5)<3)continue;const scale=.8+random()*.5;palm(x,z,scale);}
 for(let i=0;i<12;i++){const a=i*2.4,r=7+random()*7,x=Math.sin(a)*r,z=Math.cos(a)*r*.6;if((x>1&&x<9&&z>-2)||Math.hypot(x-11,z-7)<3)continue;card(i%3===0?1:2,x,height(x,z)-.03,z,i%3===0?3.6:1.8,i%3===0?4.2:1.4);}
 for(let i=0;i<9;i++){const a=i/9*Math.PI*2,x=Math.cos(a)*18,z=Math.sin(a)*12;card(3,x,height(x,z)-.08,z,1.2+random()*1.4,.7+random());}
 for(let i=0;i<7;i++){const a=i*2.4,{x,z}=islandPoint('islet',24+Math.sin(a)*2,-8+Math.cos(a)*1.5);card(15,x,height(x,z),z,1.4,1.2);}
 for(let i=0;i<12;i++){const {x,z}=islandPoint('wilds',-9+(i%4)*6,-37+Math.floor(i/4)*7);forest.addTree('banana',x,z,.7,i);const fruits=[];for(let n=0;n<6;n++)fruits.push(card(7,x+(n%3-.8)*.25,height(x,z)+2.1-Math.floor(n/3)*.3,z+.2,.5,.65));foodTrees.push({id:'banana'+i,kind:'banana',x,z,fruits});}
 for(const [tile,x,z,w,h] of [[9,14,8,.7,.5],[10,-15,5,.9,1.5],[11,-10,-6,.85,1],[9,8,11,.6,.4]]){const g=card(tile,x,height(x,z)+.02,z,w,h);wildlife.push({g,x,z,tile,phase:random()*6});}
 // Sculpted coral stands below the clear shallows; swimmers remain articulated.
 for(let i=0;i<7;i++){const a=i*2.399963,x=(i<4?-10:14)+Math.cos(a)*(1+i%3*.6),z=(i<4?22:24)+Math.sin(a)*(1+i%2*.7);card(14,x,-1.2,z,.65+(i%3)*.18,.38+(i%3)*.13);}
 let impact={x:0,z:0,strength:0,phase:0};
 return {card,palm,forest,grain,foodTrees,setImpact(x,z,strength,phase){impact={x,z,strength,phase};},update(time){forest.update(time);for(const p of palms){const d=Math.hypot(p.root.position.x-impact.x,p.root.position.z-impact.z),wave=Math.sin(impact.phase-d*.45)*impact.strength*Math.max(0,1-d/16);p.root.rotation.z=wave*.1;p.root.rotation.x=wave*.06;p.crown.rotation.z=Math.sin(time*.65+p.phase)*.025;p.crown.rotation.x=Math.cos(time*.5+p.phase)*.018;}for(const a of wildlife){const swimming=a.tile===12,speed=swimming?.6:.08;a.g.position.x=a.x+(swimming?Math.sin(time*speed+a.phase)*1.2:0);a.g.position.z=a.z+(swimming?Math.cos(time*speed+a.phase)*.5:0);if(!swimming)a.g.rotation.y=a.phase+Math.sin(time*.23+a.phase)*.035;if(!swimming)a.g.position.y=height(a.g.position.x,a.g.position.z)+.02+Math.abs(Math.sin(impact.phase))*impact.strength*Math.max(0,1-Math.hypot(a.x-impact.x,a.z-impact.z)/14)*1.3;}},dispose(){textures.forEach(t=>t.dispose());}};
}

export function setHumanAge(h,age='adult',index=0){const g=h.g||h;g.userData.ageGroup=age;g.userData.child=age==='kid';g.scale.setScalar(age==='kid'?.90+(index%3)*.045:1.24+(index%3)*.035);return h;}
// Shared, articulated expedition characters. All dimensions are in world metres.
// Geometry and fabric maps are cached per renderer, not rebuilt for every visitor.
const libraries=new WeakMap();
export function createHuman({T,geometry,mat,make}, {index=0,gender=null,ageGroup='adult',hero=false,police=false,beach=false,skinTone=null,outfitColor=null,pantsColor=null,beachWear='tee-shorts',beachHair=null,mobilityAid=null}={}){
 const woman=gender?gender==='woman':hero||(!police&&index%2===1);if(!beachHair){beachHair=['short','bun','curls','long','short','curls'][index%6];}
 let lib=libraries.get(geometry);if(!lib){lib=new Map();libraries.set(geometry,lib);}
 const shared=(key,build)=>{if(!lib.has(key))lib.set(key,build());return lib.get(key);};
 const sphere=shared('human sphere',()=>geometry(new T.SphereGeometry(1,16,12))),cylinder=shared('human tapered limb',()=>geometry(new T.CylinderGeometry(.82,1,1,12))),box=shared('human box',()=>geometry(new T.BoxGeometry()));
 const fabric=shared('woven cloth',()=>{const size=64,data=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4,v=224+((x%3===0?9:0)+(y%3===0?-13:0));data.set([v,v,v,255],i);}const t=new T.DataTexture(data,size,size,T.RGBAFormat);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(6,6);t.needsUpdate=true;return t;});
 const color=(key,c,extra={})=>shared(key,()=>mat(c,{roughness:.8,...extra}));
 const tones=['#efc6a3','#d2a582','#b98562','#ad7854','#8b6046','#75503c','#50392e'],tone=skinTone!==null?tones[Math.max(0,Math.min(6,skinTone))]:['#b98562','#d2a582','#8b6046','#ad7854','#75503c'][index%5];const skin=color('skin '+tone,tone,{roughness:.62});
 const outfit=color('outfit '+(outfitColor||'')+(beach?'beach'+index%7:hero?'hero':police?'uniform':index%7),outfitColor||(beach?['#e6a64f','#41a9ac','#c75c72','#447eae','#e6d0aa','#6c9f71','#b36d43'][index%7]:hero?'#6d777e':police?'#273e52':['#697b78','#b1a58b','#526777','#8c7666','#7c856c','#667080','#a99677'][index%7]),{map:fabric,bumpMap:fabric,bumpScale:.008});
 const pants=color('trousers '+(pantsColor||'')+(beach?'beach'+beachWear+index%3:hero?'hero':index%3),pantsColor||(beach?(beachWear==='swimsuit'?['#e6a64f','#41a9ac','#c75c72','#447eae','#e6d0aa','#6c9f71','#b36d43'][index%7]:['#277f8a','#d27054','#495c8c'][index%3]):hero?'#34474c':['#464b4d','#677063','#50596a'][index%3]),{map:fabric,bumpMap:fabric,bumpScale:.008});
 const hair=color('hair '+(ageGroup==='elder'?'silver':index%3),ageGroup==='elder'?'#b8b7af':['#302a25','#44362b','#201e1b'][index%3],{roughness:.96}),boots=color('walking boots','#3d3831',{roughness:.92}),sole=color('shoe soles','#202624'),ivory=color('eye sclera','#c8bbae'),iris=color('eye iris','#34362c',{roughness:.4}),lip=color('lips '+index%3,'#8d5c4b'),stitch=color('seams','#b4b4a4'),metal=color('belt buckle','#8a8e87',{metalness:.55,roughness:.4});
 shared('fabric texture owner',()=>{outfit.addEventListener('dispose',()=>fabric.dispose());return true;});
 const g=new T.Group();g.name=hero?'Angelique':'Detailed local character';g.userData.appearance={skin:tone,beachWear,beachHair,gender:woman?'woman':'man'};setHumanAge(g,hero?'kid':ageGroup,index);
 if(!hero&&!police){g.scale.x*=.89+(index%5)*.055;g.scale.z*=.94+(index%4)*.04;g.scale.y*=.96+(index%7)*.014;}
 const part=(geo,m,x,y,z,w,h,d,parent=g)=>make(geo,m,x,y,z,w,h,d,parent);
 const torso=shared('anatomical torso',()=>{const points=[[.095,-.25],[.14,-.20],[.175,-.02],[.205,.15],[.19,.22],[.10,.27]].map(([r,y])=>new T.Vector2(r,y));const geo=new T.LatheGeometry(points,18);geo.scale(1,1,.63);return geometry(geo);});
 part(torso,outfit,0,1.115,0,1,1,1);
 part(sphere,pants,0,.86,-.005,.175,.12,.115);
 part(cylinder,skin,0,1.405,0,.062,.12,.062);
 if(!hero&&!police&&index%6===2){part(sphere,hair,0,1.49,.069,.098,.068,.08);}
 // Cranium, tapered jaw, ears, brow, nose and recessed eyes use restrained proportions.
 part(sphere,skin,0,1.60,.006,.124,.173,.116);part(sphere,skin,0,1.495,.037,.093,.072,.086);
 part(sphere,hair,0,1.689,-.025,.129,.10,.113);
 if(!hero&&beachHair==='curls')for(let i=0;i<12;i++){const a=i*2.39996;part(sphere,hair,Math.cos(a)*.10,1.70+(i%3)*.026,-.03+Math.sin(a)*.085,.047,.043,.044);}
 if(!hero&&['long','bun'].includes(beachHair)){part(sphere,hair,0,1.52,-.10,.11,.19,.055);if(beachHair==='bun')part(sphere,hair,0,1.79,-.035,.074,.063,.067);}
 if((beach&&beachWear==='sundress')||(!hero&&!police&&!beach&&woman&&index%3===0)){const skirt=shared('beach sundress skirt',()=>geometry(new T.LatheGeometry([new T.Vector2(.22,.64),new T.Vector2(.20,.75),new T.Vector2(.14,.94)],16)));part(skirt,outfit,0,0,0,1,1,.75);}

 for(const side of [-1,1]){
  part(sphere,skin,side*.125,1.583,.003,.023,.039,.024);
  part(sphere,ivory,side*.046,1.620,.112,.025,.012,.006);
  part(sphere,iris,side*.046,1.620,.118,.010,.010,.004);
  const brow=part(box,hair,side*.046,1.648,.112,.048,.008,.009);brow.rotation.z=side*-.05;
  part(sphere,hair,side*.114,1.632,-.041,.018,.065,.055);
 }
 part(sphere,skin,0,1.579,.127,.020,.035,.032);part(sphere,lip,0,1.527,.113,.035,.005,.004);
 // Shirt opening, collar, shoulder seams and pocket follow the body instead of floating.
 if(!beach||beachWear==='tee-shorts')part(box,stitch,0,1.2,.133,.009,.23,.005);for(const side of [-1,1]){if(beach&&beachWear!=='tee-shorts')continue;const collar=part(box,outfit,side*.056,1.35,.066,.10,.02,.11);collar.rotation.z=side*.27;}
 part(box,outfit,-.10,1.16,.132,.09,.095,.008);part(box,stitch,-.10,1.204,.139,.09,.004,.004);
 part(box,boots,0,.895,.111,.30,.027,.018);part(box,metal,0,.897,.126,.035,.035,.008);
 const legs=[],knees=[],arms=[],elbows=[];
 for(const side of [-1,1]){
  const leg=new T.Group();leg.position.set(side*.092,.86,0);g.add(leg);legs.push(leg);
  if(beach){part(cylinder,skin,0,-.18,0,.075,.36,.078,leg);if(beachWear==='tee-shorts')part(cylinder,pants,0,-.10,0,.087,.22,.089,leg);}else part(cylinder,pants,0,-.18,0,.086,.36,.088,leg);part(sphere,beach?skin:pants,0,-.35,0,.070,.070,.070,leg);
  const knee=new T.Group();knee.position.y=-.36;leg.add(knee);knees.push(knee);
  part(cylinder,hero||beach?skin:pants,0,-.18,0,.055,.35,.061,knee);part(sphere,beach?skin:boots,0,-.40,.055,.080,.075,.15,knee);part(box,beach?skin:sole,0,-.46,.052,.145,.028,.24,knee);
  for(let j=0;j<(beach?0:3);j++)part(box,stitch,0,-.365+j*.017,.16,.085,.006,.006,knee);
  const arm=new T.Group();arm.position.set(side*.205,1.31,0);arm.rotation.z=side*-.055;g.add(arm);arms.push(arm);
  part(cylinder,beach&&beachWear!=='tee-shorts'?skin:outfit,0,-.07,0,.075,.16,.077,arm);part(cylinder,skin,0,-.195,0,.050,.22,.052,arm);
  const elbow=new T.Group();elbow.position.y=-.28;arm.add(elbow);elbows.push(elbow);part(sphere,skin,0,0,0,.048,.048,.048,elbow);part(cylinder,skin,0,-.12,.004,.039,.24,.043,elbow);part(sphere,skin,0,-.265,.016,.043,.068,.027,elbow);
 }
 const ponytail=new T.Group();ponytail.position.set(0,1.69,-.105);g.add(ponytail);ponytail.visible=hero;
 if(hero){part(sphere,hair,0,-.12,-.03,.060,.16,.059,ponytail);part(sphere,hair,0,-.28,-.01,.044,.10,.041,ponytail);
  // Canvas day pack, straps, zip and rolled side pockets.
  const pack=color('hero canvas pack','#857a5a',{map:fabric,bumpMap:fabric,bumpScale:.012});part(sphere,pack,0,1.14,-.16,.15,.23,.085);part(box,boots,0,1.16,-.245,.008,.24,.008);
  for(const side of [-1,1]){part(box,pack,side*.13,1.17,.112,.029,.33,.016);part(sphere,pack,side*.13,1.08,-.18,.045,.095,.05);}
 }
 const hat=new T.Group();hat.position.y=1.79;g.add(hat);hat.visible=police;
 const hatMaterial=hero?mat('#91815e',{roughness:.94}):police?outfit:color('straw hat','#a99470',{roughness:.96});part(cylinder,hatMaterial,0,0,0,.18,.018,.17,hat);part(cylinder,hatMaterial,0,.048,-.01,.115,.085,.11,hat);
 if(police){part(box,metal,-.11,1.21,.14,.028,.042,.007);part(box,metal,0,.058,.108,.028,.025,.008,hat);}
 // Merge rigid pieces within each joint by material; elbows and knees stay articulated.
 function batch(parent){for(const child of [...parent.children])if(child.isGroup)batch(child);
  const groups=new Map();for(const child of [...parent.children])if(child.isMesh){child.updateMatrix();let list=groups.get(child.material);if(!list)groups.set(child.material,list=[]);list.push(child);}
  for(const [material,parts]of groups){if(parts.length<2)continue;
   const key='human rigid '+parts.map(m=>m.geometry.id+':'+m.matrix.elements.join(',')).join('|');
   const merged=shared(key,()=>{const positions=[],normals=[],uvs=[],indices=[];let offset=0;
    for(const mesh of parts){const data=mesh.geometry.clone().applyMatrix4(mesh.matrix),a=data.attributes;positions.push(...a.position.array);normals.push(...a.normal.array);if(a.uv)uvs.push(...a.uv.array);else uvs.push(...Array(a.position.count*2).fill(0));
     const ix=data.index?.array||Array.from({length:a.position.count},(_,i)=>i);for(const i of ix)indices.push(offset+i);offset+=a.position.count;data.dispose();}
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('normal',new T.Float32BufferAttribute(normals,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geo.setIndex(indices);return geometry(geo);
   });
   parts.forEach(mesh=>parent.remove(mesh));make(merged,material,0,0,0,1,1,1,parent);
  }
 }
 batch(g);
 g.userData.humanRig={knees,elbows};
 if(mobilityAid){const aid=new T.Group();aid.name=mobilityAid==='walker'?'Walking frame':'Walking stick';g.add(aid);if(mobilityAid==='walker'){for(const x of [-.27,.27]){for(const z of [.25,.6])part(cylinder,metal,x,.42,z,.018,.84,.018,aid);part(box,metal,x,.84,.425,.025,.025,.38,aid);}part(box,metal,0,.6,.6,.56,.025,.025,aid);}else{part(cylinder,boots,.3,.43,.2,.018,.86,.018,aid);part(box,boots,.3,.87,.24,.035,.03,.13,aid);}g.userData.mobilityAid=mobilityAid;}
 return {g,legs,arms,knees,elbows,ponytail,hat,batch:()=>batch(g),materials:{skin,outfit,pants,hair},animate(phase,moving=true){knees.forEach((k,i)=>k.rotation.x=moving?Math.max(0,-Math.sin(phase+i*Math.PI))*.55:0);elbows.forEach(e=>e.rotation.x=-.15);}};
}


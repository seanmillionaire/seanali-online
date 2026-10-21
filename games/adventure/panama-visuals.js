import {CITY_BARRIO_PLOTS} from './city-layout.js?v=225';
// Panama street art direction: shared materials and GPU batches for small details.
export function createPanamaVisuals({T,scene,make,mat,geometry,box,ball,cylinder,height,surfaces,models,renderer,sun}){
 const root=new T.Group();root.name='Panama architectural craftsmanship';scene.add(root);
 const batches=new Map(),geometries=[],textures=[],iron=mat('#33434a',{metalness:.45,roughness:.54}),trim=mat('#e8ddc2',{map:surfaces?.plaster}),ochre=mat('#c49461',{map:surfaces?.plaster}),terracotta=mat('#b3775e',{map:surfaces?.roof}),blue=mat('#508899'),wood=mat('#705441',{map:surfaces?.wood}),leaf=mat('#3f7544');
 function put(g,m,x,y,z,w,h,d){let byMat=batches.get(g);if(!byMat)batches.set(g,byMat=new Map());let a=byMat.get(m);if(!a)byMat.set(m,a=[]);a.push([x,y,z,w,h,d]);}
 const buildings=[];scene.updateMatrixWorld(true);const v=new T.Vector3(),q=new T.Quaternion(),sc=new T.Vector3(),matrix=new T.Matrix4(),world=new T.Matrix4();
 for(const group of scene.children.filter(o=>/Casco Viejo · Panama City|Panama City moving traffic/.test(o.name))){group.traverse(o=>{if(!o.isMesh||o.geometry!==box)return;const read=m=>{m.decompose(v,q,sc);if(sc.x>=3.8&&sc.x<=9&&sc.y>=2.8&&sc.y<15&&sc.z>=3&&sc.z<9&&Math.abs(q.y)<.01)buildings.push({x:v.x,y:v.y-sc.y/2,z:v.z,w:sc.x,h:sc.y,d:sc.z});};if(o.isInstancedMesh){for(let i=0;i<o.count;i++){o.getMatrixAt(i,matrix);world.multiplyMatrices(o.matrixWorld,matrix);read(world);}}else read(o.matrixWorld);});}
 const seen=new Set();for(const [i,b]of buildings.entries()){const key=b.x.toFixed(1)+','+b.z.toFixed(1);if(seen.has(key))continue;seen.add(key);const {x,y,z,w,h,d}=b,front=z+d/2+.06;
  // Plinth, cornices and distinct plaster edges anchor each facade.
  put(box,ochre,x,y+.28,front,w,.5,.09);for(const side of [-1,1])put(box,trim,x+side*(w/2-.12),y+h/2,front,.17,h,.15);
  for(let floor=1;floor*2.15+1.45<h;floor++){const fy=y+floor*2.15;put(box,trim,x,fy,front,w+.08,.12,.19);for(const sign of [-1,1]){const wx=x+sign*w*.27;put(box,wood,wx,fy+.8,front+.1,.95,1.1,.09);for(const edge of [-1,1]){put(box,trim,wx+edge*.54,fy+.8,front+.16,.09,1.25,.12);for(let k=0;k<5;k++)put(box,iron,wx+edge*.25,fy+.42+k*.15,front+.18,.39,.025,.06);}if(floor===1){put(box,trim,wx,fy-.04,front+.47,1.6,.13,.95);put(box,iron,wx,fy+.59,front+.88,1.6,.055,.055);for(let k=0;k<7;k++)put(box,iron,wx-.69+k*.23,fy+.29,front+.88,.035,.6,.035);put(box,terracotta,wx+.47,fy+.14,front+.56,.3,.22,.3);put(ball,leaf,wx+.47,fy+.4,front+.56,.31,.26,.25);}}}
  // Ground floor shutters, rainwater pipe, air conditioner and a striped awning.
  put(cylinder,iron,x+w/2-.27,y+h/2,front+.18,.055,h,.055);if(i%2===0){put(box,trim,x-w*.26,y+1.38,front+.26,1,.5,.4);for(let k=0;k<5;k++)put(box,iron,x-w*.26,y+1.22+k*.075,front+.48,.8,.02,.025);}
  const awning=i%3===0?blue:terracotta;for(let k=0;k<8;k++)put(box,k%2?trim:awning,x-w*.36+(k+.5)*w*.09,y+2.05,front+.49,w*.09,.09,.98);
  // Patched corrugated sections and rooftop water tanks stay below the skyline.
  if(h<6&&i%3===0){for(let k=0;k<11;k++)put(box,iron,x-w*.45+k*w*.09,y+h+.16,z,.035,.07,d*.92);put(cylinder,iron,x+w*.24,y+h+.55,z-.35,.42,.8,.42);}
 }
 // A readable corner shop beside the raspao stop, with a shaded real doorway.
 const shopPlot=CITY_BARRIO_PLOTS[0];const shop=models.sign(root,'ABARROTERÍA • EL BARRIO',shopPlot.x,height(shopPlot.x,shopPlot.z)+2.3,shopPlot.z+2.2,3.7,.43);shop.name='Hand-painted neighborhood shop sign';
 for(const [i,{x,z}] of CITY_BARRIO_PLOTS.slice(0,3).entries()){const y=height(x,z);for(const sign of [-1,1])put(cylinder,iron,x+sign*1.5,y+3.4,z+.5,.045,6.8,.045);const cable=new T.CatmullRomCurve3([new T.Vector3(x-1.5,y+6.7,z+.5),new T.Vector3(x,y+6.25,z+.5),new T.Vector3(x+1.5,y+6.7,z+.5)]),g=geometry(new T.TubeGeometry(cable,8,.014,3,false));make(g,iron,0,0,0,1,1,1,root);}
 // Shared soft contact shade works on mobile where real shadow maps are disabled.
 const canvas=document.createElement('canvas');canvas.width=canvas.height=64;const ctx=canvas.getContext('2d'),gradient=ctx.createRadialGradient(32,32,3,32,32,31);gradient.addColorStop(0,'rgba(27,42,36,.35)');gradient.addColorStop(1,'rgba(27,42,36,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,64,64);const shade=new T.CanvasTexture(canvas);textures.push(shade);const shadeMat=mat('#ffffff',{map:shade,transparent:true,depthWrite:false,roughness:1,polygonOffset:true,polygonOffsetFactor:-1});const plane=geometry(new T.PlaneGeometry(1,1));for(const b of buildings){const shadow=make(plane,shadeMat,b.x,height(b.x,b.z)+.19,b.z,b.w+2,b.d+2,1,root);shadow.rotation.x=-Math.PI/2;shadow.castShadow=false;}
 for(const [geo,materials]of batches)for(const [material,items]of materials){const mesh=new T.InstancedMesh(geo,material,items.length),dummy=new T.Object3D();mesh.name='Batched Panama facade details';mesh.castShadow=false;mesh.receiveShadow=true;items.forEach(([x,y,z,w,h,d],i)=>{dummy.position.set(x,y,z);dummy.scale.set(w,h,d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});mesh.instanceMatrix.needsUpdate=true;root.add(mesh);}
 return {update(x,z,indoors){root.visible=!indoors;},dispose(){scene.remove(root);textures.forEach(t=>t.dispose());}};
}

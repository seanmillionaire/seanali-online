export const PURPLE_APARTMENT={x:-122,z:-103,floors:40,floorHeight:2.4,width:8,depth:5.6};
export function createPurpleApartment({T,group,make,mat,box,height}){
 const p=PURPLE_APARTMENT,root=new T.Group();root.name='One enormous purple apartment tower · 40 floors';root.position.set(p.x,height(p.x,p.z),p.z);group.add(root);
 const purple=mat('#7730bf',{roughness:.7}),violet=mat('#a85be0',{roughness:.65}),deep=mat('#462075'),trim=mat('#d1b3ef'),glass=mat('#9dc7dd',{metalness:.35,roughness:.23}),warm=mat('#ffe8af',{emissive:'#ffce70',emissiveIntensity:.45}),dark=mat('#30334b');
 const piece=(m,x,y,z,w,h,d)=>make(box,m,x,y,z,w,h,d,root),h=p.floors*p.floorHeight;
 piece(deep,0,1.4,0,p.width,2.8,p.depth);piece(purple,0,3+h/2,0,p.width-.4,h,p.depth-.3);
 // Strong purple corner columns and alternating violet bays preserve the color at a distance.
 for(const side of [-1,1]){piece(violet,side*3.58,3+h/2,0,.5,h,p.depth-.1);piece(deep,side*1.24,3+h/2,2.72,.32,h,.13);}
 const details=[];
 for(let f=0;f<p.floors;f++){const y=4.1+f*p.floorHeight;details.push({m:trim,x:0,y:y+1.17,z:2.77,w:7.8,h:.10,d:.18});
  for(const side of [-1,1])for(let col=0;col<4;col++)details.push({m:(f*7+col)%11===0?warm:glass,x:-2.65+col*1.76,y,z:side*2.69,w:1.18,h:1.48,d:.08});
  for(const side of [-1,1])for(const z of [-1.35,1.35])details.push({m:(f+Math.round(z))%9===0?warm:glass,x:side*3.83,y,z,w:.08,h:1.48,d:1.35});
  if(f%3===0){details.push({m:deep,x:0,y:y-.82,z:2.88,w:6.7,h:.14,d:.42});details.push({m:trim,x:0,y:y-.47,z:3.05,w:6.7,h:.48,d:.06});}
 }
 // Hundreds of apartment windows use a few instanced draws.
 const dummy=new T.Object3D();for(const m of [trim,glass,warm,deep]){const rows=details.filter(d=>d.m===m);const mesh=new T.InstancedMesh(box,m,rows.length);mesh.name='Purple apartment windows and balconies';mesh.castShadow=false;rows.forEach((v,i)=>{dummy.position.set(v.x,v.y,v.z);dummy.scale.set(v.w,v.h,v.d);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});root.add(mesh);}
 piece(deep,0,h+3.35,0,8,.7,5.6);piece(violet,0,h+4.2,0,6.7,1.1,4.5);piece(purple,0,h+5.1,0,4.6,.7,3.4);
 piece(dark,0,1.25,2.83,2.3,2.5,.13);for(const side of [-1,1])piece(glass,side*.57,1.25,2.93,1.0,2.25,.06);piece(trim,0,2.85,3.05,3.4,.2,.9);
 root.userData={floors:p.floors,height:h+5.45,landmark:'purple-apartment'};return root;
}

import {worldIslands} from './explore-state.js?v=genie2';

// Dress the existing terrain and engine as floating realms. Coordinates and
// collision geometry stay shared with the cloned quests and building system.
export function dressCosmos(T,{scene,geometry,mat,make,ball,cone,motion}){
  const group=new T.Group();group.name='Cosmic orbits';scene.add(group);
  scene.background=new T.Color('#293c60');scene.fog=new T.FogExp2('#293c60',.0013);
  const colors=['#8e70ce','#44b9c5','#cda65d','#bd617e','#629cde','#9366cd','#6b80b5'];
  const tinted=new Set();
  scene.traverse(o=>{
    if(/Ocean wildlife/i.test(o.name))o.visible=false;
    const colors=o.geometry?.attributes?.color;
    if(colors&&!tinted.has(o.geometry)){tinted.add(o.geometry);const c=new T.Color(),h={};for(let i=0;i<colors.count;i++){c.fromBufferAttribute(colors,i);c.getHSL(h);c.setHSL(.64+(h.h*.25),Math.max(.22,h.s*.7),Math.max(.46,h.l));colors.setXYZ(i,c.r,c.g,c.b);}colors.needsUpdate=true;}
    if(!o.isMesh||!o.material)return;
    for(const m of Array.isArray(o.material)?o.material:[o.material]){
      if(!m.color||m.userData.cosmic)continue;m.userData.cosmic=true;
      const hsl={};m.color.getHSL(hsl);
      if(hsl.h>.16&&hsl.h<.48){m.color.setHSL(.69+(hsl.h-.16)*.35,Math.max(.25,hsl.s),Math.max(.2,hsl.l));}
      if(m.vertexColors)m.color.set('#f2edff');
      if(m.emissive&&hsl.s>.22){m.emissive.copy(m.color);m.emissiveIntensity=.22;}
    }
    // The ocean shader and seabed become open space. The gameplay surface
    // boundaries are retained, with automatic magic flight at their edges.
    if(o.material.isShaderMaterial&&o.material.uniforms?.wakePosition)o.visible=false;
    if(o.geometry?.type==='PlaneGeometry'&&o.geometry.parameters.width>=340)o.visible=false;
    if(/cloud|sailboat|Ocean wildlife/i.test(o.name))o.visible=false;
  });
  const realms=[{x:0,z:0,rx:20,rz:14},...worldIslands];
  const rings=[];
  realms.forEach((p,i)=>{
    const mineral=mat(colors[i],{roughness:.8,metalness:.25});
    const underside=make(cone,mineral,p.x,-p.rx*.23,p.z,p.rx*.91,p.rx*.48,p.rz*.91,group);underside.rotation.z=Math.PI;
    const r=make(geometry(new T.TorusGeometry(1,.009,5,96)),mat(colors[i],{emissive:colors[i],emissiveIntensity:1.1,transparent:true,opacity:.65,depthWrite:false}),p.x,-.8,p.z,p.rx*1.36,p.rz*1.36,1,group);r.rotation.x=Math.PI/2-.16;r.rotation.y=i*.18;rings.push(r);
  });
  let seed=817;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const positions=[];for(let i=0;i<1000;i++){const a=random()*Math.PI*2,r=210+random()*200;positions.push(Math.cos(a)*r,random()*230-45,Math.sin(a)*r);}
  const stars=new T.Points(geometry(new T.BufferGeometry()),new T.PointsMaterial({color:'#d2d3ff',size:.65,sizeAttenuation:true,fog:false}));stars.geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));group.add(stars);
  const planets=[];
  for(const [x,y,z,r,c]of [[-160,86,-190,29,'#8e74d3'],[145,65,-150,21,'#c99756'],[90,95,160,15,'#4c9da8']]){
    const planet=make(ball,mat(c,{emissive:c,emissiveIntensity:.15,roughness:.7}),x,y,z,r,r,r,group);planets.push(planet);
    const orbit=make(geometry(new T.TorusGeometry(r*1.65,r*.018,6,80)),mat(c,{emissive:c,emissiveIntensity:.6,transparent:true,opacity:.65}),0,0,0,1,1,1,planet);orbit.scale.setScalar(1/r);orbit.rotation.x=1.15;orbit.rotation.y=.35;
  }
  return {update(time){if(!motion())return;stars.rotation.y=time*.001;rings.forEach((r,i)=>r.material.opacity=.48+Math.sin(time*.6+i)*.14);},dispose(){scene.remove(group);stars.material.dispose();}};
}

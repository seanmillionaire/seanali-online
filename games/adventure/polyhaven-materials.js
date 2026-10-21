// The same full-resolution local CC0 maps, applied once per material set.
// Keep procedural fallbacks visible while all three channels load in parallel.
const MATERIALS=['sand','grass','stone','asphalt','wood'];
export function installPolyHavenMaterials(T,{surfaces,scene,materials,renderer,redraw}){
 let disposed=false;const loaded=new Set(),loader=new T.TextureLoader(),all=new Set(materials);
 scene.traverse(o=>{if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])all.add(m);});
 const anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 for(const kind of MATERIALS){
  const original=surfaces[kind];if(!original)continue;
  const matched=[...all].filter(m=>m.map===original||m.bumpMap===original);
  Promise.all(['diff','nor_gl','rough'].map(channel=>new Promise(resolve=>{
   loader.load(`/games/adventure/assets/terrain/${kind}-${channel}.webp`,texture=>{
    if(disposed){texture.dispose();resolve(null);return;}
    texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.colorSpace=channel==='diff'?T.SRGBColorSpace:T.NoColorSpace;texture.anisotropy=anisotropy;texture.minFilter=T.LinearMipmapLinearFilter;loaded.add(texture);resolve(texture);
   },undefined,()=>resolve(null));
  }))).then(([diff,normal,rough])=>{
   if(disposed)return;
   for(const m of matched){
    if(diff){if(m.map===original){m.map=diff;if(kind==='asphalt')m.color?.set('#ffffff');}if(m.bumpMap===original)m.bumpMap=null;}
    if(normal){m.normalMap=normal;m.normalScale?.set(.65,.65);}if(rough)m.roughnessMap=rough;
    if(diff||normal||rough)m.needsUpdate=true;
   }
   if(diff){for(const m of all){const uniforms=m.userData.landscapeUniforms;if(uniforms)for(const u of Object.values(uniforms))if(u.value===original)u.value=diff;}surfaces[kind]=diff;}
   redraw();
  });
 }
 return {dispose(){disposed=true;for(const t of loaded)t.dispose();loaded.clear();}};
}

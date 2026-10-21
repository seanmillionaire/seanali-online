// Optimized local copies of CC0 Poly Haven maps; see assets/terrain/README.md.
// The game is playable during loading, with deterministic procedural fallbacks.
const MATERIALS=['sand','grass','stone','asphalt','wood'];
export function installPolyHavenMaterials(T,{surfaces,scene,materials,renderer,redraw}){
 let disposed=false;const loaded=new Set(),loader=new T.TextureLoader();
 const anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 const candidates=()=>{const all=new Set(materials);scene.traverse(o=>{if(o.material)for(const m of Array.isArray(o.material)?o.material:[o.material])all.add(m);});return all;};
 for(const kind of MATERIALS){
  const original=surfaces[kind];if(!original)continue;
  const matched=new Set();
  for(const m of candidates())if(m.map===original||m.bumpMap===original)matched.add(m);
  for(const [channel,property]of [['diff','map'],['nor_gl','normalMap'],['rough','roughnessMap']]){
   loader.load(`/games/adventure/assets/terrain/${kind}-${channel}.webp`,texture=>{
    if(disposed){texture.dispose();return;}
    texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.colorSpace=channel==='diff'?T.SRGBColorSpace:T.NoColorSpace;texture.anisotropy=anisotropy;texture.minFilter=T.LinearMipmapLinearFilter;loaded.add(texture);
    for(const m of candidates()){
     let dirty=false;
     if(channel==='diff'){
      if(m.map===original){m.map=texture;dirty=true;if(kind==='asphalt')m.color?.set('#ffffff');}
      // Height and tangent-normal maps are different physical quantities.
      if(m.bumpMap===original){m.bumpMap=null;dirty=true;}
      const uniforms=m.userData.landscapeUniforms;if(uniforms)for(const u of Object.values(uniforms))if(u.value===original)u.value=texture;
     }
     if(matched.has(m)&&channel!=='diff'){m[property]=texture;dirty=true;if(channel==='nor_gl')m.normalScale?.set(.65,.65);}
     if(dirty)m.needsUpdate=true;
    }
    if(channel==='diff')surfaces[kind]=texture;redraw();
   },undefined,()=>{});
  }
 }
 return {dispose(){disposed=true;for(const t of loaded)t.dispose();loaded.clear();}};
}

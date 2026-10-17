// Free CC0 environment textures by Poly Haven: https://polyhaven.com/
// Loaded only after the playable procedural Three.js world is ready.
// Every download is optional; on timeout/error the original procedural art stays.
// 1K maps avoid shipping 4K/8K textures to mobile players.
const BASE='https://dl.polyhaven.org/file/ph-assets/Textures/png/1k/';
const MATERIALS=[
  ['sand','aerial_beach_01'],   // https://polyhaven.com/a/aerial_beach_01
  ['grass','aerial_grass_rock'], // https://polyhaven.com/a/aerial_grass_rock
  ['stone','aerial_rocks_02'],  // https://polyhaven.com/a/aerial_rocks_02
  ['asphalt','aerial_asphalt_01'] // https://polyhaven.com/a/aerial_asphalt_01
];
export function installPolyHavenMaterials(T,{surfaces,scene,materials,renderer,redraw}){
  let disposed=false;
  const loaded=new Set();
  const loader=new T.TextureLoader();
  loader.setCrossOrigin('anonymous');
  if(globalThis.navigator?.connection?.saveData)return {dispose(){disposed=true;}};
  const maxAnisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
  for(const [kind,slug] of MATERIALS){
    const original=surfaces[kind];
    if(!original)continue;
    const url=BASE+slug+'/'+slug+'_diff_1k.png';
    loader.load(url,texture=>{
      if(disposed){texture.dispose();return;}
      texture.wrapS=texture.wrapT=T.RepeatWrapping;
      texture.colorSpace=T.SRGBColorSpace;
      texture.minFilter=T.LinearMipmapLinearFilter;
      texture.magFilter=T.LinearFilter;
      texture.anisotropy=maxAnisotropy;
      texture.generateMipmaps=true;
      texture.needsUpdate=true;
      // Replace only references to this exact procedural surface. Other
      // colors, world positions, hitboxes and gameplay are untouched.
      const candidates=new Set(materials);
      scene.traverse(object=>{
        if(!object.material)return;
        for(const material of Array.isArray(object.material)?object.material:[object.material]){
          candidates.add(material);
        }
      });
      for(const material of candidates){
        if(!material || (!material.map && !material.bumpMap))continue;
        let changed=false;
        if(material.map===original){material.map=texture;changed=true;}
        if(material.bumpMap===original){material.bumpMap=texture;changed=true;}
        if(changed)material.needsUpdate=true;
      }
      surfaces[kind]=texture;
      loaded.add(texture);
      redraw();
    },undefined,()=>{
      // Missing/CDN-blocked texture is nonfatal: keep the existing surface.
      console.info('[Panamá Aventura] Using built-in '+kind+' texture');
    });
  }
  return {dispose(){disposed=true;for(const texture of loaded)texture.dispose();loaded.clear();}};
}

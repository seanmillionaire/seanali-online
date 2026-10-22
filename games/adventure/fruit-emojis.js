// Native color emoji, drawn once per fruit type. No downloaded artwork or sculpted fruit.
export const FRUIT_EMOJIS=Object.freeze({banana:'🍌',coconut:'🥥',mango:'🥭',pineapple:'🍍'});
export const FRUIT_TILES=Object.freeze({4:'coconut',5:'mango',6:'pineapple',7:'banana'});
export function createFruitEmojis(T){
 const textures=new Map(),materials=new Map(),sprites=new Map(),meshes=[],geometries=[];
 function texture(kind){
  if(textures.has(kind))return textures.get(kind);
  if(!FRUIT_EMOJIS[kind])throw Error('Unknown fruit '+kind);
  let tex;
  if(typeof document!=='undefined'){
   const canvas=document.createElement('canvas');canvas.width=canvas.height=128;
   const ctx=canvas.getContext('2d');ctx.clearRect(0,0,128,128);ctx.font='100px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(FRUIT_EMOJIS[kind],64,68,116);tex=new T.CanvasTexture(canvas);
  }else tex=new T.DataTexture(new Uint8Array([255,255,255,0]),1,1);
  tex.colorSpace=T.SRGBColorSpace;tex.needsUpdate=true;tex.name=FRUIT_EMOJIS[kind]+' native fruit emoji';textures.set(kind,tex);return tex;
 }
 function sprite(kind,x,y,z,size,parent){
  if(!sprites.has(kind))sprites.set(kind,new T.SpriteMaterial({map:texture(kind),transparent:true,depthTest:true,depthWrite:false,toneMapped:false}));
  const s=new T.Sprite(sprites.get(kind));s.name=FRUIT_EMOJIS[kind]+' '+kind;s.userData.fruitEmoji=kind;s.position.set(x,y,z);s.scale.set(size,size,1);parent?.add(s);return s;
 }
 function batch(kind,items,parent){
  const material=new T.MeshBasicMaterial({map:texture(kind),transparent:true,alphaTest:.04,depthTest:true,depthWrite:false,toneMapped:false,side:T.DoubleSide});
  // Each instance faces the camera on the GPU; thousands of fruits need only three draws.
  material.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>',`
   vec4 mvPosition = modelViewMatrix * vec4(instanceMatrix[3].xyz, 1.0);
   vec2 fruitScale = vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz));
   fruitScale *= vec2(length(modelMatrix[0].xyz), length(modelMatrix[1].xyz));
   mvPosition.xy += position.xy * fruitScale;
   gl_Position = projectionMatrix * mvPosition;
  `);};material.customProgramCacheKey=()=> 'native-fruit-billboard-v1';materials.set(kind,material);
  const geometry=new T.PlaneGeometry(1,1);geometries.push(geometry);const mesh=new T.InstancedMesh(geometry,material,items.length),dummy=new T.Object3D();mesh.name=FRUIT_EMOJIS[kind]+' batched native '+kind+' emojis';mesh.userData.fruitEmoji=kind;
  items.forEach((item,index)=>{let visible=item.visible!==false;const put=()=>{dummy.position.set(item.x,item.y,item.z);dummy.scale.setScalar(visible?item.size:0);dummy.updateMatrix();mesh.setMatrixAt(index,dummy.matrix);mesh.instanceMatrix.needsUpdate=true;};put();Object.defineProperty(item,'visible',{get:()=>visible,set(v){visible=!!v;put();},configurable:true});item.getWorldPosition=target=>{target.set(item.x,item.y,item.z);return parent.localToWorld(target);};});
  // Never shrink bounds after harvesting, so restoring a fruit remains visible.
  mesh.computeBoundingSphere();parent.add(mesh);meshes.push(mesh);return mesh;
 }
 return {sprite,batch,dispose(){for(const m of meshes){m.removeFromParent();m.dispose();}for(const m of [...materials.values(),...sprites.values()])m.dispose();for(const t of textures.values())t.dispose();for(const g of geometries)g.dispose();}};
}

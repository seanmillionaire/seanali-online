import {regionalPalette} from './regional-palette.js?v=224';
// World-space material blending preserves every existing terrain/collision vertex.
export function landscapeMaterial({T,mat,surfaces,vertexColors=true,base='grass',region='mainland'}){
 const palette=regionalPalette(region);
 const material=mat('#ffffff',{vertexColors,map:surfaces[base],bumpMap:null,roughness:.96});
 material.userData.landscape=true;
 material.onBeforeCompile=shader=>{
  Object.assign(shader.uniforms,{landSand:{value:surfaces.sand},landGrass:{value:surfaces.grass},landRock:{value:surfaces.stone},regionalGreen:{value:new T.Color(palette.green)},regionalSand:{value:new T.Color(palette.sand)}});
  material.userData.landscapeUniforms=shader.uniforms;
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 landscapePosition;\nvarying vec3 landscapeNormal;');
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nlandscapePosition=(modelMatrix*vec4(transformed,1.0)).xyz;\nlandscapeNormal=normalize(mat3(modelMatrix)*normal);');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 landscapePosition;\nvarying vec3 landscapeNormal;\nuniform sampler2D landSand;\nuniform sampler2D landGrass;\nuniform sampler2D landRock;\nuniform vec3 regionalGreen;\nuniform vec3 regionalSand;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`
   vec2 terrainUV=landscapePosition.xz*.14;
   float shore=1.-smoothstep(.22,1.75,landscapePosition.y);
   float rock=smoothstep(.23,.66,1.-abs(landscapeNormal.y));
   float variation=.5+.5*sin(landscapePosition.x*.31+sin(landscapePosition.z*.24)*2.)*cos(landscapePosition.z*.19);
   float beach=shore;
   ${region==='mainland'?`beach=max(shore*.15,smoothstep(-1.,11.,landscapePosition.z)*(1.-smoothstep(72.,110.,abs(landscapePosition.x+20.))));`:''}
   #ifdef USE_COLOR
    beach=max(beach,smoothstep(.018,.14,vColor.r-vColor.g));
   #endif
   vec3 grass=texture2D(landGrass,terrainUV).rgb;
   float luminance=dot(grass,vec3(.2126,.7152,.0722));grass=mix(grass,regionalGreen*(.50+luminance*.95),.76);
   vec3 sand=texture2D(landSand,terrainUV*.8).rgb; sand=mix(sand,regionalSand*(.68+dot(sand,vec3(.333))*.55),.42);
   vec3 weights=pow(abs(landscapeNormal),vec3(4.));weights/=max(.001,weights.x+weights.y+weights.z);
   vec3 stone=texture2D(landRock,landscapePosition.zy*.095).rgb*weights.x+texture2D(landRock,landscapePosition.xz*.095).rgb*weights.y+texture2D(landRock,landscapePosition.xy*.095).rgb*weights.z;
   // Mixed light/dark volcanic sand belongs to the Pacific Gorgona shore.
   float gorgona=(1.-smoothstep(65.,100.,abs(landscapePosition.x+20.)))*(1.-smoothstep(20.,45.,abs(landscapePosition.z)));
   float mineral=.5+.5*sin(landscapePosition.z*1.9+sin(landscapePosition.x*.09)*2.);
   vec3 volcanic=mix(vec3(.22,.235,.23),vec3(.65,.60,.49),mineral*.72+.12);
   sand=mix(sand,volcanic,gorgona*.76);
   vec3 surface=mix(grass,sand,beach);
   surface=mix(surface,stone,rock*.88);
   float wet=1.-smoothstep(.08,.55,landscapePosition.y);
   surface*=mix(1.,.64,wet)*( .91+variation*.14);
   diffuseColor.rgb*=surface;
  `).replace('#include <color_fragment>','').replace('#include <normal_fragment_maps>',`
   #ifdef USE_NORMALMAP_TANGENTSPACE
    vec3 absN=abs(landscapeNormal);
    vec2 detailUV=absN.y>.5?landscapePosition.xz:absN.x>absN.z?landscapePosition.zy:landscapePosition.xy;
    detailUV*=.14;
    mat3 terrainTbn=getTangentFrame(-vViewPosition,normal,detailUV);
    vec3 terrainN=texture2D(normalMap,detailUV).xyz*2.-1.;terrainN.xy*=normalScale;
    normal=normalize(terrainTbn*terrainN);
   #endif
  `);
 };
 material.customProgramCacheKey=()=>`panama-landscape-${base}-${region}`;
 return material;
}

// Shared fractured rock variants: broad planar faces, chipped shoulders and
// layered mineral colors, rather than scaled spheres. No textures/downloads.
export function ruggedRockGeometry(T,geometry,seed=0){
 const count=7+(seed%3),vertices=[],colors=[],uv=[],levels=[[-.55,.70],[-.12,1],[.39,.78],[.65,.46+(seed%3)*.10]],rings=[],color=new T.Color();
 const noise=n=>{const v=Math.sin(n*127.1+seed*73.7)*43758.5453;return v-Math.floor(v);};
 for(let k=0;k<4;k++)rings.push(Array.from({length:count},(_,i)=>{const a=i*Math.PI*2/count+(noise(i+11)-.5)*.20,r=levels[k][1]*(.84+noise(i*7+k)*.28);return [Math.cos(a)*r+k*.055,levels[k][0]+(noise(i*13+k)-.5)*.16,Math.sin(a)*r-k*.04];}));
 function tri(a,b,c,index){const shade=.86+noise(index+37)*.20;const base=['#899080','#a19e8b','#7f8979','#989b8c','#909784'][(seed+index)%5];color.set(base).multiplyScalar(shade);for(const p of [a,b,c]){vertices.push(...p);uv.push((p[0]+p[2])*.65,p[1]*.75+p[2]*.18);colors.push(color.r,color.g,color.b);}}
 for(let k=0;k<3;k++)for(let i=0;i<count;i++){const j=(i+1)%count;tri(rings[k][i],rings[k+1][i],rings[k][j],k*count*2+i*2);tri(rings[k][j],rings[k+1][i],rings[k+1][j],k*count*2+i*2+1);}
 const top=[.15,.74,-.12];for(let i=0;i<count;i++)tri(rings[3][i],top,rings[3][(i+1)%count],100+i);
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();g.computeBoundingSphere();g.userData.fracturedRock=true;return geometry(g);
}

export function ruggedRockSurface(T){const size=128,color=new Uint8Array(size*size*4),bump=new Uint8Array(size*size*4),noise=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};for(let y=0;y<size;y++)for(let x=0;x<size;x++){const grit=noise(x,y),broad=noise(Math.floor(x/9),Math.floor(y/9)),seam=Math.abs(Math.sin(x*.11+y*.17+Math.sin(y*.08)*1.5))<.055,v=185+grit*35+broad*16-(seam?48:0),i=(y*size+x)*4;color.set([v,v+2,v-4,255],i);const h=140+grit*70-(seam?60:0);bump.set([h,h,h,255],i);}const create=(data,srgb)=>{const t=new T.DataTexture(data,size,size,T.RGBAFormat);t.wrapS=t.wrapT=T.RepeatWrapping;t.colorSpace=srgb?T.SRGBColorSpace:T.NoColorSpace;t.generateMipmaps=true;t.minFilter=T.LinearMipmapLinearFilter;t.needsUpdate=true;return t;};return {color:create(color,true),bump:create(bump,false)};}

// A shared botanical vocabulary for near trees and instanced woodland.
// Folded laminae, tapered tips and pale midribs carry detail without alpha cards.
export function botanicalGeometry(T,geometry,kind,distant=false){
 const p=[],c=[],uv=[],indices=[];
 function twig(from,to,radius){
  const a=new T.Vector3(...from),b=new T.Vector3(...to),direction=b.clone().sub(a).normalize();
  const side=new T.Vector3().crossVectors(direction,Math.abs(direction.y)>.94?new T.Vector3(1,0,0):new T.Vector3(0,1,0)).normalize(),cross=new T.Vector3().crossVectors(direction,side),start=p.length/3;
  const sides=distant?4:5;
  for(let end=0;end<2;end++)for(let k=0;k<sides;k++){
   const angle=k*Math.PI*2/sides,r=radius*(end?.38:1),point=(end?b:a).clone().addScaledVector(side,Math.cos(angle)*r).addScaledVector(cross,Math.sin(angle)*r);
   p.push(point.x,point.y,point.z);c.push(.17,.125,.070);uv.push(k/sides,end);
   if(!end){const next=(k+1)%sides;indices.push(start+k,start+next,start+sides+k,start+next,start+sides+next,start+sides+k);}
  }
 }
 function leaf(origin,angle,length,width,lift,drop,hue,sections=distant?1:5){
  const start=p.length/3,dx=Math.sin(angle),dz=Math.cos(angle),sx=Math.cos(angle),sz=-Math.sin(angle);
  if(sections===1){
   const mid=[origin[0]+dx*length*.48,origin[1]+lift-drop*.23,origin[2]+dz*length*.48];
   const vertices=[origin,[mid[0]-sx*width,mid[1]-width*.25,mid[2]-sz*width],mid,[mid[0]+sx*width,mid[1]-width*.25,mid[2]+sz*width],[origin[0]+dx*length,origin[1]-drop,origin[2]+dz*length]];
   for(let i=0;i<vertices.length;i++){p.push(...vertices[i]);uv.push(...[[.5,0],[0,.48],[.5,.48],[1,.48],[.5,1]][i]);const light=i===2?1.12:.90;c.push(hue[0]*light*.40,hue[1]*light*.59,hue[2]*light*.36);}
   indices.push(start,start+1,start+2,start+2,start+1,start+4,start,start+2,start+3,start+2,start+4,start+3);return;
  }
  for(let j=0;j<=sections;j++){
   const t=j/sections,w=width*Math.pow(Math.sin(Math.PI*t),.78),r=length*t;
   const y=origin[1]+lift*Math.sin(Math.PI*t)-drop*t*t;
   for(const side of [-1,0,1]){
    p.push(origin[0]+dx*r+sx*w*side,y-Math.abs(side)*w*.25,origin[2]+dz*r+sz*w*side);
    uv.push((side+1)/2,t);
    const light=(side===0?1.14:.89)+(1-t)*.07;
    c.push(hue[0]*light*.40,hue[1]*light*.59,hue[2]*light*.36);
   }
   if(j<sections){const a=start+j*3,b=a+3;indices.push(a,b,a+1,a+1,b,b+1,a+1,b+1,a+2,a+2,b+1,b+2);}
  }
 }
 const green=(i)=>[[.12,.24,.09],[.16,.30,.11],[.23,.38,.13],[.13,.27,.10],[.32,.47,.17],[.43,.57,.23]][i%6];
 if(kind==='palm'){
  // Unequal frond lengths and elevations break the radial pinwheel silhouette.
  for(let f=0;f<(distant?10:15);f++){
   const a=f*2.399963,L=3.25+(f%4)*.27,rise=.75+(f%3)*.31,drop=1.1+(f%4)*.15;
   const n=distant?11:21;
   for(let k=1;k<n;k++){
    const t=k/n,r=L*t,o=[Math.sin(a)*r,rise*Math.sin(Math.PI*t)-drop*t*t,Math.cos(a)*r];
    const reach=(.15+.74*Math.sin(Math.PI*t))*(1-.18*t);
    for(const side of [-1,1])leaf(o,a+side*(1.09+t*.18),reach,.085+(1-t)*.045,.04,.18,green(f+k));
   }
   leaf([0,0,0],a,L,.025,rise,drop,[.48,.52,.24],distant?4:12);
  }
  // Upright new spears at the heart of the crown.
  for(let i=0;i<3;i++)leaf([0,.03,0],i*2.4,.7,.1,.65,-.55,[.42,.54,.26]);
 }else if(kind==='banana'){
  for(let i=0;i<11;i++){
   const a=i*2.399963,L=2.15+(i%3)*.24;
   leaf([0,(i%3)*.12,0],a,L,.49,.48,.69,green(i),distant?8:12);
  }
 }else if(kind==='fern'){
  for(let f=0;f<(distant?8:12);f++){
   const a=f*2.399963,L=1.2+(f%3)*.2;
   const stem=t=>[Math.sin(a)*L*t,.12+.73*Math.sin(t*Math.PI*.75)-.25*t,Math.cos(a)*L*t];
   for(let k=0;k<6;k++)twig(stem(k/6),stem((k+1)/6),.012*(1-k/8));
   for(let k=1;k<(distant?5:9);k++){
    const t=k/(distant?5:9),o=[Math.sin(a)*L*t,.12+.73*Math.sin(t*Math.PI*.75)-.25*t,Math.cos(a)*L*t];
    for(const side of [-1,1])leaf(o,a+side*1.1,.40*Math.sin(Math.PI*t)+.04,.045,.025,.09,green(f+k),distant?1:3);
   }
  }
 }else if(kind==='pine'){
  for(let tier=0;tier<(distant?11:13);tier++){
   const y=2.4+tier*(distant?.84:.67),reach=(1-tier/14)*2.65;
   for(let b=0;b<(distant?6:7);b++){
    const a=b*Math.PI*2/7+tier*.54;
    twig([0,y,0],[Math.sin(a)*reach,y-.34,Math.cos(a)*reach],.035*(1-tier/15));
    for(let k=1;k<=(distant?4:6);k++){
     const t=k/(distant?5:6),o=[Math.sin(a)*reach*t,y-.34*t,Math.cos(a)*reach*t];
     for(const side of [-1,1])leaf(o,a+side*1.0,.45*(1-t*.4),.12,.07,.06,[.22+(tier%3)*.025,.34+(b%3)*.025,.23],distant?1:3);
    }
   }
  }
 }else{
  // Leaves grow from branching sprays, with overlapping layers and small gaps between boughs.
  for(let b=0;b<(distant?72:88);b++){
   const a=b*2.399963,r=.65+(b%5)*.44,y=1.5*Math.sin(b*1.8)+(b%3)*.36;
   const start=[Math.sin(a)*r,y,Math.cos(a)*r],end=[Math.sin(a)*(r+.6),y+.2,Math.cos(a)*(r+.6)];
   twig([0,-1.8,0],start,.034+(b%3)*.007);twig(start,end,.022);
   for(let k=0;k<(distant?9:12);k++){
    const u=k/(distant?9:12),spread=(k%2?1:-1)*(.48+u*.4);
    const o=[Math.sin(a)*(r+u*.55),y+u*.18,Math.cos(a)*(r+u*.55)];
    leaf(o,a+spread,(distant?.92:.85)+(k%3)*.14,(distant?.48:.43)+(b%3)*.035,.16,(b%4-1)*.22,green(b+k));
   }
  }
 }
 const g=geometry(new T.BufferGeometry());g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('color',new T.Float32BufferAttribute(c,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();
 g.name=kind+' folded leaves and midribs';return g;
}

// One small leaf surface per forest system, with a continuous midrib, branching
// veins and quiet mottling. It follows each folded leaf rather than a billboard.
export function leafSurface(T){
 const size=128,pixels=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const u=x/(size-1),v=y/(size-1),side=Math.abs(u-.5),vein=v*11-side*3.2;
  const secondary=Math.abs(vein-Math.round(vein))<.035?15:0;
  const midrib=side<.018?24:0,mottle=Math.sin(x*.39+y*.27)*Math.sin(y*.61-x*.17)*4;
  const value=Math.round(218-side*24+secondary+midrib+mottle),i=(y*size+x)*4;
  pixels[i]=pixels[i+1]=pixels[i+2]=Math.max(0,Math.min(255,value));pixels[i+3]=255;
 }
 const texture=new T.DataTexture(pixels,size,size,T.RGBAFormat);texture.colorSpace=T.SRGBColorSpace;texture.generateMipmaps=true;texture.minFilter=T.LinearMipmapLinearFilter;texture.magFilter=T.LinearFilter;texture.needsUpdate=true;return texture;
}

// Merge static parts once; branching forest trunks still require one draw batch.
export function mergeNatureGeometry(T,geometry,parts){
 const points=[],normals=[],colors=[];
 for(const {geo,matrix,color}of parts){
  const g=(geo.index?geo.toNonIndexed():geo.clone());if(matrix)g.applyMatrix4(matrix);
  for(const v of g.attributes.position.array)points.push(v);for(const v of g.attributes.normal.array)normals.push(v);
  if(g.attributes.color)for(const v of g.attributes.color.array)colors.push(v);
  else{const tint=new T.Color(color||'#ffffff');for(let i=0;i<g.attributes.position.count;i++)colors.push(tint.r,tint.g,tint.b);}
  g.dispose();
 }
 const result=geometry(new T.BufferGeometry());result.setAttribute('position',new T.Float32BufferAttribute(points,3));result.setAttribute('normal',new T.Float32BufferAttribute(normals,3));result.setAttribute('color',new T.Float32BufferAttribute(colors,3));return result;
}


// Isla Aventura procedural material library: no external downloads or paid assets.
// Reused compact DataTextures. Mipmapped and deterministic on every visit.
export function createSurfaceTextures(T){
 const size=256,resources=[];
 function frac(x){return x-Math.floor(x);}
 function hash(x,y,seed){return frac(Math.sin(x*127.1+y*311.7+seed*74.7)*43758.5453123);}
 function noise(x,y,seed){
  const a=Math.floor(x),b=Math.floor(y),fx=x-a,fy=y-b;
  const u=fx*fx*(3-2*fx),v=fy*fy*(3-2*fy);
  const tl=hash(a,b,seed),tr=hash(a+1,b,seed),bl=hash(a,b+1,seed),br=hash(a+1,b+1,seed);
  return (tl+(tr-tl)*u)*(1-v)+(bl+(br-bl)*u)*v;
 }
 function fractal(x,y,seed){
  return noise(x,y,seed)*.53+noise(x*2.13,y*2.13,seed+3)*.28+
   noise(x*4.19,y*4.19,seed+7)*.13+noise(x*9.1,y*9.1,seed+13)*.06;
 }
 function create(kind,seed){
  const bytes=new Uint8Array(size*size*4);
  const put=(i,r,g,b)=>{bytes[i]=Math.max(0,Math.min(255,r));bytes[i+1]=Math.max(0,Math.min(255,g));bytes[i+2]=Math.max(0,Math.min(255,b));bytes[i+3]=255;};
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){
   const u=x/size,v=y/size,large=fractal(u*5,v*5,seed),fine=noise(x*.72,y*.72,seed+19);
   let value=214+(large-.5)*49+(fine-.5)*20,red=value,green=value,blue=value;
   if(kind==='sand'){
    const fleck=hash(x,y,seed+5),dunes=Math.sin(u*18+noise(u*3,v*3,seed)*4+v*3)*5;
    value=226+(large-.5)*29+(fine-.5)*26+dunes;
    if(fleck>.982)value-=48;
    if(fleck<.015)value+=18;
    red=value+4;green=value+2;blue=value-5;
   }else if(kind==='grass'){
    const blade=noise(u*70+v*7,v*92,seed);
    const bladeShade=blade>.71?13:blade<.21?-16:0;
    value=213+(large-.5)*50+(fine-.5)*25+bladeShade;
    red=value-12;green=value+12;blue=value-18;
   }else if(kind==='wood'){
    const grain=Math.sin(u*69+noise(u*3,v*6,seed)*8+
      Math.sin(v*16+u*8)*1.1);
    const knots=Math.exp(-((u-.34)**2*170+(v-.7)**2*400))*35;
    value=205+(large-.5)*21+grain*20+(fine-.5)*12-knots;
    red=value+13;green=value-3;blue=value-13;
   }else if(kind==='stone'){
    const joints=Math.min(frac((u+(Math.floor(v*8)%2)*.07)*8),1-frac((u+(Math.floor(v*8)%2)*.07)*8));
    const horizontal=Math.min(frac(v*8),1-frac(v*8));
    const crack=(horizontal<.025||joints<.016)?-48:0;
    value=218+(large-.5)*40+(fine-.5)*20+crack;
    red=value+2;green=value+4;blue=value+6;
   }else if(kind==='asphalt'){
    const pebble=hash(x,y,seed+6),aggregate=pebble>.96?35:pebble<.07?-24:0;
    value=219+(large-.5)*20+(fine-.5)*37+aggregate;
    red=value;green=value+1;blue=value+2;
   }else if(kind==='roof'){
    const rows=Math.floor(v*12),offset=rows%2?.045:0;
    const grout=(frac(v*12)<.07||frac((u+offset)*7)<.035)?-39:0;
    value=216+(large-.5)*26+(fine-.5)*19+grout;
    red=value+7;green=value-2;blue=value-7;
   }else if(kind==='plaster'){
    const grit=hash(x,y,seed+4)>.98?-23:0;
    value=228+(large-.5)*14+(fine-.5)*14+grit;
    red=value+2;green=value+1;blue=value;
   }
   put((y*size+x)*4,red,green,blue);
  }
  const texture=new T.DataTexture(bytes,size,size,T.RGBAFormat);
  texture.wrapS=texture.wrapT=T.RepeatWrapping;
  texture.minFilter=T.LinearMipmapLinearFilter;
  texture.magFilter=T.LinearFilter;
  texture.generateMipmaps=true;
  texture.colorSpace=T.SRGBColorSpace;
  texture.anisotropy=4;
  texture.needsUpdate=true;resources.push(texture);
  return texture;
 }
 const surfaces={sand:create('sand',11),grass:create('grass',23),wood:create('wood',31),
  stone:create('stone',43),asphalt:create('asphalt',53),
  roof:create('roof',67),plaster:create('plaster',79)};
 return {...surfaces,dispose(){for(const texture of resources)texture.dispose();}};
}

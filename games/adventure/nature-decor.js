import {botanicalGeometry,mergeNatureGeometry} from './botanical-geometry.js?v=225';
// Replaces photographic billboard props with coherent, lit three-dimensional
// specimens. Each finished prop is one shared geometry and one material draw.
export function createNatureDecor(T,geometry){
 const cache=new Map(),up=new T.Vector3(0,1,0);
 return function specimen(tile){
  if(cache.has(tile))return cache.get(tile);
  const parts=[],temporary=[];
  const add=(geo,color,x=0,y=0,z=0,sx=1,sy=sx,sz=sx,rx=0,ry=0,rz=0)=>{
   temporary.push(geo);parts.push({geo,color,matrix:new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromEuler(new T.Euler(rx,ry,rz)),new T.Vector3(sx,sy,sz))});
  };
  const sphere=(color,x,y,z,sx,sy,sz)=>add(new T.SphereGeometry(1,14,10),color,x,y,z,sx,sy,sz);
  const stem=(from,to,r,color)=>{
   const a=new T.Vector3(...from),b=new T.Vector3(...to),v=b.clone().sub(a),geo=new T.CylinderGeometry(r*.66,r,v.length(),6);temporary.push(geo);
   parts.push({geo,color,matrix:new T.Matrix4().compose(a.add(b).multiplyScalar(.5),new T.Quaternion().setFromUnitVectors(up,v.normalize()),new T.Vector3(1,1,1))});
  };
  if(tile===0||tile===1||tile===2){
   const kind=tile===1?'banana':tile===0?'palm':'fern';
   const leaves=botanicalGeometry(T,g=>g,kind,true);add(leaves,null,0,kind==='banana'?1.8:0,0);
   if(kind==='banana')stem([0,0,0],[0,1.85,0],.11,'#7b8951');
  }else if(tile===3){
   const rock=new T.IcosahedronGeometry(1,2),p=rock.attributes.position;
   for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),n=1+.09*Math.sin(x*9+z*5)*Math.cos(y*7);p.setXYZ(i,x*n,y*n,z*n);}rock.computeVertexNormals();
   add(rock,'#8f9484',0,.35,0,1,.65,.77);sphere('#76836a',-.23,.77,-.12,.45,.055,.28);
  }else if(tile===9){
   sphere('#ac6749',0,.23,0,.33,.17,.25);
   for(const sign of [-1,1]){
    for(let i=0;i<4;i++){const z=(i-1.5)*.13;stem([sign*.22,.19,z],[sign*.45,.19,z-.05],.023,'#b37754');stem([sign*.45,.19,z-.05],[sign*.54,.01,z+.07],.018,'#b37754');}
    stem([sign*.20,.23,.12],[sign*.37,.34,.34],.04,'#ac6749');sphere('#bd8057',sign*.38,.36,.38,.13,.10,.13);sphere('#dbc28c',sign*.36,.38,.49,.065,.035,.09);
    stem([sign*.12,.3,.12],[sign*.13,.42,.14],.023,'#ac6749');sphere('#26352d',sign*.13,.44,.15,.039,.045,.031);
   }
  }else if(tile===10||tile===11){
   const heron=tile===10,color=heron?'#adb7ad':'#24302a',pale=heron?'#d9dbca':'#d4b53e';
   sphere(color,0,.66,-.08,.18,.27,.35);sphere(pale,0,.66,.18,.13,.22,.075);
   if(heron){const neck=new T.CatmullRomCurve3([new T.Vector3(0,.81,.12),new T.Vector3(0,1.0,-.03),new T.Vector3(0,1.18,.18),new T.Vector3(0,1.38,.20)]);add(new T.TubeGeometry(neck,18,.052,8,false),pale);sphere(color,0,1.41,.24,.105,.10,.15);add(new T.ConeGeometry(.042,.43,10),'#a68f53',0,1.40,.53,1,1,1,Math.PI/2);}
   else{sphere(color,0,1.0,.12,.17,.18,.18);sphere('#8aa84e',0,1.00,.42,.10,.12,.30);sphere('#b45d3e',0,.985,.64,.068,.085,.10);sphere('#d2b751',0,.90,.43,.083,.025,.23);}
   for(const sign of [-1,1]){for(let feather=0;feather<5;feather++)sphere(heron?'#8e9c91':'#35473a',sign*(.16+feather*.006),.73-feather*.032,-.03-feather*.05,.045,.13,.21);sphere('#171f1b',sign*(heron?.082:.137),heron?1.44:1.04,heron?.31:.235,.017,.021,.011);const x=sign*.08;stem([x,.45,-.04],[x,.23,-.08],.017,'#73785c');stem([x,.23,-.08],[x,.06,.04],.012,'#73785c');for(let toe=0;toe<3;toe++)stem([x,.06,.04],[x+(toe-1)*.035,.015,.16],.009,'#73785c');}
   for(let i=-2;i<=2;i++)sphere(color,i*.027,.44,-.40,.035,.033,.24-Math.abs(i)*.02);
  }else if(tile===14){
   for(let i=0;i<11;i++){
    const a=i*2.399963,x=Math.sin(a)*(.16+i%3*.08),z=Math.cos(a)*(.16+i%3*.08),y=.40+(i%4)*.15;
    stem([0,0,0],[x,y,z],.045,'#bd9e80');sphere('#d1b99a',x,y,z,.068,.084,.066);
    stem([x*.5,y*.5,z*.5],[x+.16,y*.86,z+.10],.025,'#c6a78a');
   }
  }else if(tile===15){
   add(botanicalGeometry(T,g=>g,'natural',true),null,0,.32,0,.19,.25,.19);
   for(let i=0;i<3;i++){
    const x=Math.sin(i*2.4)*.32,z=Math.cos(i*2.4)*.30,y=.65+(i%2)*.16;stem([x*.3,0,z*.3],[x,y,z],.022,'#627143');
    for(let k=0;k<5;k++){const a=k*Math.PI*2/5;add(new T.SphereGeometry(1,12,8),'#b96c59',x+Math.sin(a)*.13,y+Math.cos(a)*.13,z,.12,.17,.035,0,0,-a);}
    stem([x,y,z],[x+.02,y+.04,z+.22],.012,'#d8bc6a');sphere('#c3a34e',x+.02,y+.04,z+.22,.027,.025,.025);
   }
  }else{
   sphere('#6e7c4b',0,.16,0,.28,.15,.35);
  }
  const result=mergeNatureGeometry(T,geometry,parts);for(const geo of temporary)geo.dispose();result.computeBoundingBox();
  const box=result.boundingBox,size=new T.Vector3(),center=new T.Vector3();box.getSize(size);box.getCenter(center);
  result.translate(-center.x,-box.min.y,-center.z);result.scale(1/Math.max(.01,size.x),1/Math.max(.01,size.y),1/Math.max(.01,size.x));
  result.name='Sculpted natural prop '+tile;cache.set(tile,result);return result;
 };
}

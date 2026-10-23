import {createHuman,setHumanAge} from './character-model.js';
// Regional everyday wardrobes; a mix of natural hair, locs, wraps and short cuts.
export function createCostaResident({T,make,mat,geometry,ball,cylinder},index=0){
 const styles=['locs','wrap','curls','short','locs','wrap','curls','short'];
 const style=styles[index%styles.length],dress=index%4===1;
 const h=createHuman({T,make,mat,geometry},{index,skinTone:4+index%3,beach:true,beachWear:dress?'sundress':'tee-shorts',beachHair:style==='curls'?'curls':'short',outfitColor:['#dfac35','#169b98','#cf684e','#efe3bb','#47875a','#c64372','#4598b4','#e7bd5a'][index%8],pantsColor:['#3f5265','#775337','#e5cf9e'][index%3]});
 h.g.name='Costa Arriba Caribbean resident';h.g.userData.appearance.regionalStyle=style;
 const hair=h.materials.hair,colors=['#c44435','#e4b940','#36865b'].map(c=>mat(c,{roughness:.96}));
 const put=(g,m,x,y,z,w,ht,d)=>make(g,m,x,y,z,w,ht,d,h.g);
 if(style==='locs'){
  for(let k=0;k<15;k++){const a=k/15*Math.PI*2,x=Math.sin(a)*.13,z=-.025+Math.cos(a)*.11,length=.22+(k%4)*.055;
   const lock=put(cylinder,hair,x,1.65-length/2,z,.019,length,.019);lock.rotation.z=Math.sin(a)*-.16;
   put(ball,hair,x+Math.sin(a)*.025,1.65-length,z,.022,.028,.022);
  }
  if(index%8===0)for(let k=0;k<3;k++)put(cylinder,colors[k],0,1.73+k*.025,-.02,.139,.028,.125);
 }
 if(style==='wrap'){put(ball,colors[index%3],0,1.73,-.025,.151,.125,.133);put(ball,colors[(index+1)%3],.09,1.81,-.065,.075,.08,.065);}
 // A narrow woven waist sash accents the coastal dresses.
 if(dress)for(let k=0;k<3;k++)put(cylinder,colors[k],0,.91+k*.025,0,.149,.024,.112);
 setHumanAge(h,index%5===3?'kid':'adult',index);h.batch();return h;
}


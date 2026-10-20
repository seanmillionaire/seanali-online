/* Lightweight, stylized-natural animal detailing. Mesh primitives, no downloads.
   Rig returns animate() to articulate feathers/flippers based on movement and flight. */
export function createAnimalDetails({T,id,root,make,mat,geometry,ball,cone,cylinder}){
 const sphere=(m,x,y,z,sx,sy,sz,p=root)=>make(ball,m,x,y,z,sx,sy,sz,p);
 const primitive=(g,m,x,y,z,sx,sy,sz,p=root)=>make(g,m,x,y,z,sx,sy,sz,p);
 const shades=(c)=>mat(c,{roughness:.72});
 const animateParts=[];
 const matte=shades('#213c3f'),highlight=shades('#fff1d0');
 if(id==='pip'){
  const scute=shades('#566b38'),edge=shades('#b3ad71'),pattern=shades('#788950'),flipper=shades('#6c945d');
  // Raised, patterned tortoise-like dome with a rim and visible scutes.
  sphere(edge,0,.20,0,.63,.30,.81);
  sphere(scute,0,.35,0,.56,.35,.69);
  sphere(pattern,0,.53,-.13,.31,.14,.33);
  for(let i=0;i<6;i++){
   const a=i*Math.PI/3;
   const plate=sphere(i%2?scute:pattern,Math.sin(a)*.37,.48,Math.cos(a)*.47,.19,.105,.23);
   plate.rotation.y=a;
   sphere(edge,Math.sin(a)*.37,.55,Math.cos(a)*.47,.07,.025,.08);
  }
  const neck=sphere(flipper,0,.02,.88,.23,.20,.39);
  sphere(flipper,0,.06,1.17,.23,.24,.28);
  for(const sign of [-1,1]){
   const eye=sphere(matte,sign*.185,.18,1.33,.048,.052,.035);
   sphere(highlight,sign*.19,.2,1.361,.014,.015,.012);
   // Strong leading flippers and tiny fingernails.
   const front=sphere(flipper,sign*.58,-.06,.48,.48,.075,.25);
   front.rotation.y=-sign*.52;
   for(let k=0;k<3;k++)sphere(edge,sign*(.87+k*.10),-.075,.62-k*.08,.045,.035,.072);
  }
  sphere(flipper,0,-.05,-.80,.13,.10,.32);
 }
 if(id==='dori'){
  const blu=shades('#5d8793'),blueLight=shades('#91b4bb'),pearl=shades('#dde7e0');
  const upper=shades('#466875');
  // Dolphin melon, bottle-shaped rostrum, blowhole, jaw and caudal flukes.
  sphere(blu,0,.19,.67,.36,.28,.54);
  sphere(blueLight,0,.12,1.03,.24,.16,.43);
  sphere(pearl,0,-.055,1.07,.23,.065,.35);
  sphere(matte,0,.41,.33,.052,.026,.09); // blowhole
  for(const sign of [-1,1]){
   sphere(matte,sign*.265,.21,.84,.045,.044,.026);
   sphere(highlight,sign*.273,.225,.861,.012,.012,.012);
   const fin=sphere(upper,sign*.52,-.09,.05,.54,.09,.21);
   fin.rotation.y=sign*.42;fin.rotation.z=-sign*.13;
  }
  const dorsal=primitive(geometry(new T.ConeGeometry(.38,.95,5)),upper,0,.60,-.45,.6,.98,.33);
  dorsal.rotation.x=-.27;
  const tailGroup=new T.Group();tailGroup.position.set(0,-.05,-1.5);root.add(tailGroup);
  for(const sign of [-1,1]){
   const fluke=sphere(upper,sign*.42,0,-.18,.51,.075,.23,tailGroup);
   fluke.rotation.y=sign*.36;fluke.rotation.z=sign*.08;
  }
  animateParts.push((t,movement)=>{tailGroup.rotation.x=Math.sin(t*8)*(movement?.28:.12);root.rotation.z=movement?Math.sin(t*1.7)*.035:0;});
 }
 if(id==='mila'||id==='ollie'){
  const parrot=id==='mila';
  const primary=shades(parrot?'#1f876a':'#a7b6ca');
  const light=shades(parrot?'#86cf5e':'#e4e9df');
  const contrast=shades(parrot?'#efbd56':'#7f8da6');
  const dark=shades(parrot?'#1d5d59':'#53677e');
  const bright=shades(parrot?'#f2d178':'#f7f4ec');
  const wings=[];
  const body=sphere(primary,0,1.09,-.10,parrot?.54:.45,parrot?.64:.78,.41);
  // Distinctive breast bib and long fan of real feather-shaped meshes.
  sphere(light,0,1.02,.23,.32,.50,.17);
  for(let i=-2;i<=2;i++){
   const tail=sphere(i%2?contrast:primary,i*.14,.73,-.60-Math.abs(i)*.06,.11,.15,.9-Math.abs(i)*.12);
   tail.rotation.x=.35;tail.rotation.z=i*.14;
  }
  for(const sign of [-1,1]){
   const pivot=new T.Group();pivot.position.set(sign*.46,1.32,-.17);root.add(pivot);
   // Feathers span outward in the wing's local coordinate system.
   const humerus=sphere(primary,sign*.55,-.06,0,.67,.16,.31,pivot);
   humerus.rotation.z=sign*-.12;
   const tip=new T.Group();tip.position.set(sign*.92,-.04,0);pivot.add(tip);
   for(let j=0;j<9;j++){
    const f=sphere(j%3===0?contrast:j%2?primary:light,sign*(.25+j*.135),-.07-j*.016,-.22-(j%3)*.04,.14,.065,.66-j*.029,tip);
    f.rotation.y=sign*(.14+j*.075);f.rotation.z=-sign*.11;
   }
   for(let j=0;j<6;j++){
    const cover=sphere(j%2?primary:light,sign*(.18+j*.18),.06,-.05,.20,.073,.32,tip);
    cover.rotation.y=sign*j*.12;
   }
   wings.push({pivot,tip,sign});
  }
  // Head detailing: bright eyes, arched brows, crest, segmented beak.
  for(const sign of [-1,1]){
   sphere(bright,sign*.205,parrot?1.82:2.12,.53,.105,.11,.06);
   sphere(dark,sign*.212,parrot?1.825:2.125,.585,.055,.067,.025);
   sphere(highlight,sign*.23,parrot?1.855:2.155,.61,.019,.023,.013);
   sphere(primary,sign*.25,parrot?1.96:2.27,-.03,.16,.22,.10);
  }
  if(parrot){
   for(let i=0;i<3;i++){
    const crest=sphere(i===1?contrast:primary,(i-1)*.16,2.1+((i+1)%2)*.15,-.08,.09,.33,.13);
    crest.rotation.z=(i-1)*.3;
   }
   sphere(bright,0,1.50,.72,.18,.16,.29);
  }else{
   sphere(light,0,2.39,-.13,.31,.13,.25);
   sphere(bright,0,1.81,.53,.28,.15,.32);
  }
  animateParts.push((t,movement,flying)=>{
   const phase=t*(flying?8.6:movement?4.2:2.1);
   const sweep=flying?Math.sin(phase)*.65+.17:Math.sin(phase)*.10+.17;
   for(const w of wings){
    // Wings lift by rotation about each shoulder; tips lag for a natural stroke.
    w.pivot.rotation.z=w.sign*(.22+sweep);
    w.pivot.rotation.x=flying?Math.sin(phase+.35)*.11:0;
    w.tip.rotation.z=w.sign*(flying?Math.sin(phase-.8)*.34:-.09);
   }
   body.rotation.x=flying?Math.sin(t*1.7)*.04:0;
  });
 }
 if(id==='luna'){
  const red=shades('#a9654c'),shell=shades('#bf8260'),sand=shades('#dac295'),joint=shades('#855842'),walkingLegs=[];
  sphere(shell,0,.57,-.07,.71,.36,.62);
  for(let i=0;i<7;i++){
   const a=Math.PI*(i/8+.1);
   sphere(red,Math.cos(a)*.55,.75,Math.sin(a)*.35-.12,.12,.09,.19);
  }
  for(const sign of [-1,1]){
   sphere(shell,sign*.275,.94,.42,.065,.22,.065);
   sphere(sand,sign*.275,1.12,.48,.11,.13,.09);
   // Four segmented legs on either side; tapered claws with pincers.
   for(let i=0;i<4;i++){
    const thigh=sphere(joint,sign*(.60+i*.10),.21,.42-i*.30,.22,.10,.14);
    thigh.rotation.z=sign*.4;
    const shin=sphere(red,sign*(.83+i*.1),.10,.42-i*.30,.19,.07,.08);
    walkingLegs.push({thigh,shin,sign,i});
   }
   sphere(shell,sign*1.1,.60,.38,.35,.23,.26);
   for(const side of [-1,1]){
    const pincer=sphere(sand,sign*(1.34+(side*.13)),.64,.57,.18,.11,.22);
    pincer.rotation.y=side*.3;
   }
   sphere(matte,sign*.275,1.17,.53,.065,.095,.04);
   sphere(highlight,sign*.28,1.20,.567,.02,.026,.014);
  }
  animateParts.push((t,movement)=>{
   const step=movement?10:1.7;
   root.rotation.z=Math.sin(t*step)*(movement?.045:.008);
   for(const leg of walkingLegs){
    const stagger=leg.i%2?Math.PI:0;
    const gait=Math.sin(t*step+stagger+(leg.sign>0?Math.PI:0));
    leg.thigh.rotation.z=leg.sign*(.36+gait*(movement?.22:.035));
    leg.shin.rotation.x=gait*(movement?.23:.025);
   }
  });
 }
 return {animate:(t,{moving=false,flying=false}={})=>animateParts.forEach(fn=>fn(t,moving,flying))};
}

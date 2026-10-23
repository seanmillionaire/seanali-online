import {worldClock} from './world-clock.js';
import {createFruitEmojis} from './fruit-emojis.js';
import {createHuman,setHumanAge} from './character-model.js';
import {CONGO_GATHERING,DIABLO_ROUTES} from './costa-arriba-layout.js';
import {congoBeat} from './congo-rhythm.js';
// Separate unhurried approach / watch / retreat cycles, independent of the dance beat.
export function diabloCreep(route,time){const cycle=((time+route.offset)%route.period)/route.period;
 const raw=cycle<.38?0:cycle<.61?(cycle-.38)/.23:cycle<.70?1:cycle<.91?1-(cycle-.70)/.21:0;
 const t=raw*raw*(3-2*raw),points=[route.from,...(route.via?[route.via]:[]),route.to],lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));let distance=t*lengths.reduce((a,b)=>a+b,0),segment=0;
 while(segment<lengths.length-1&&distance>lengths[segment])distance-=lengths[segment++];const a=points[segment],b=points[segment+1],u=distance/lengths[segment],retreat=cycle>.70&&cycle<.91;
 return {x:a[0]+(b[0]-a[0])*u,z:a[1]+(b[1]-a[1])*u,moving:(cycle>.38&&cycle<.61)||retreat,hiding:cycle<.38||cycle>.91,heading:Math.atan2(b[0]-a[0],b[1]-a[1])+(retreat?Math.PI:0)};
}
// Grounded stepping phrases, low knee pulses and alternating drum strokes.
export function congoDancePose(beat,role='dancer',phase=0){
 if(role==='diablo'){const t=beat+phase,gesture=Math.pow(Math.max(0,Math.sin(t*.83)),5);return {lift:gesture*.025,sway:Math.sin(t*.7)*.04,step:gesture*.18,travel:Math.sin(t*.38)*.22,advance:gesture*.13,turn:Math.sin(t*.63)*.35,lean:.04+gesture*.19,arm:-.18-gesture*.5,elbow:-.45};}
 if(role==='family'){const t=beat+phase;return {lift:.008*Math.sin(t*2),sway:Math.sin(t*1.3)*.04,step:Math.sin(t*2)*.06,travel:Math.sin(t*.6)*.07,advance:Math.sin(t*.4)*.04,turn:Math.sin(t*.4)*.12,lean:0,arm:-.55-Math.sin(t*2)*.12,elbow:-1};}
 const a=(beat+phase)*Math.PI*2,pulse=Math.sin(a)*.78+Math.sin(a*2)*.22,drummer=role==='drummer';
 // Four shared counts: step right, settle, step left, settle. Ease into each foot plant.
 const count=((beat+phase)%4+4)%4,index=Math.floor(count),u=Math.max(0,Math.min(1,((count-index)-.16)/.68)),ease=u*u*(3-2*u),marks=[0,.30,0,-.30,0],side=marks[index]+(marks[index+1]-marks[index])*ease;
 return {lift:drummer?0:Math.abs(pulse)*.018,sway:drummer?Math.sin(a/2)*.035:-side*.17,step:pulse*(drummer?.04:.16),
  travel:drummer?0:side,advance:drummer?0:Math.sin(a/2)*.045,
  turn:drummer?0:Math.sin(a/4)*.16,lean:drummer?.12:.025+Math.cos(a)*.02,
  arm:drummer?-.9+Math.sin(a)*.48:-.30+Math.sin(a/2)*.16,elbow:drummer?-.75:-.7-Math.cos(a/2)*.25};
}
// Sweep the front semicircle in sixteen counts, then return without a turn snap.
export function congoPartnerArc(beat){
 const angle=Math.PI/2*Math.sin(beat*Math.PI/16),radius=1.15;
 return {x:Math.sin(angle)*radius,z:-Math.cos(angle)*radius,heading:-angle};
}
// A permanent community gathering: original modeled costumes, no photo textures.
export function createCongoGathering({T,scene,make,mat,geometry,box,ball,cylinder,height,surfaces,state,joy={},motion=()=>true}){
 const place=CONGO_GATHERING,root=new T.Group();root.name='Costa Arriba · Diablos y Congos youth gathering';scene.add(root);
 const red=mat('#c82c27',{roughness:.86}),black=mat('#292322',{roughness:.95}),gold=mat('#cda84f',{metalness:.48,roughness:.5}),ivory=mat('#e5d6b9'),wood=mat('#775039',{map:surfaces?.wood,roughness:.94}),skin=mat('#cdb48b',{roughness:.97}),stone=mat('#b9aa8d',{bumpMap:surfaces?.stone,bumpScale:.04,roughness:.98});
 const cloth=['#e9b83b','#167f92','#c43d74','#519d50'].map(c=>mat(c,{roughness:.9,side:T.DoubleSide}));
 const cone=geometry(new T.ConeGeometry(1,1,9)),maskGeo=geometry(new T.SphereGeometry(1,14,10));
 const horn=geometry(new T.ConeGeometry(.052,.40,10));const hp=horn.attributes.position;for(let i=0;i<hp.count;i++){const y=(hp.getY(i)+.2)/.4;hp.setX(i,hp.getX(i)+y*y*.13);}hp.needsUpdate=true;horn.computeVertexNormals();
 const piece=(g,m,x,y,z,w,h,d,parent)=>make(g,m,x,y,z,w,h,d,parent);
 // A low, irregularly edged stone dancing court; every vertex meets the terrain.
 const vertices=[place.x,height(place.x,place.z)+.14,place.z],indices=[],segments=48,rings=12;
 for(let ring=1;ring<=rings;ring++)for(let i=0;i<segments;i++){const a=i/segments*Math.PI*2,r=place.radius*ring/rings*(1+Math.sin(i*2.1)*.025),x=place.x+Math.sin(a)*r,z=place.z+Math.cos(a)*r;vertices.push(x,height(x,z)+.14,z);if(ring===1)indices.push(0,1+i,1+(i+1)%segments);else {const outer=1+(ring-1)*segments,inner=outer-segments,j=(i+1)%segments;indices.push(inner+i,outer+i,outer+j,inner+i,outer+j,inner+j);}}
 const floor=geometry(new T.BufferGeometry());floor.setAttribute('position',new T.Float32BufferAttribute(vertices,3));floor.setIndex(indices);floor.computeVertexNormals();const court=piece(floor,stone,0,0,0,1,1,1,root);court.material.side=T.DoubleSide;
 // Red and black masks: eye openings, brows, sculpted snout, teeth, curved horns and cloth fringe.
 function mask(h,index){const m=new T.Group();m.name='Handcrafted Diablo de Congo mask';m.position.set(0,1.61,.10);h.g.add(m);
  piece(maskGeo,index%2?black:red,0,0,0,.157,.20,.13,m);piece(maskGeo,black,0,-.075,.12,.102,.067,.035,m);
  for(const side of [-1,1]){piece(maskGeo,black,side*.064,.035,.115,.044,.028,.025,m);const brow=piece(box,gold,side*.065,.08,.125,.09,.014,.012,m);brow.rotation.z=side*-.25;const tooth=piece(cone,ivory,side*.053,-.055,.15,.027,.08,.025,m);tooth.rotation.z=Math.PI;const hornMesh=piece(horn,index%2?red:black,side*.11,.31,-.015,side,1,1,m);hornMesh.rotation.z=side*-.28;for(let k=0;k<4;k++){const fringe=piece(box,index%2?red:black,side*(.13+k*.009),-.20-k*.015,-.04,.028,.28,.025,m);fringe.rotation.z=side*(.1+k*.1);}}
  piece(maskGeo,red,0,-.005,.15,.055,.035,.058,m);
  for(let k=0;k<8;k++){const a=k/8*Math.PI*2;piece(ball,gold,Math.cos(a)*.12,Math.sin(a)*.16,.09,.012,.012,.012,m);}
  const cape=piece(box,index%2?red:black,0,1.06,-.15,.47,.72,.035,h.g);cape.rotation.x=-.1;
  for(let i=0;i<7;i++){const fr=piece(box,i%2?red:black,(i-3)*.061,.67,-.13,.05,.24,.025,h.g);fr.rotation.z=(i-3)*.055;}
  for(const leg of h.knees)for(let k=0;k<5;k++)piece(ball,gold,Math.sin(k*1.4)*.065,-.28,Math.cos(k*1.4)*.06,.024,.027,.024,leg);
  for(const arm of h.elbows)piece(cylinder,red,0,-.12,0,.051,.25,.054,arm);
 }
 const actors=[],colors=['#e9b83b','#167f92','#c43d74'];
 const cast=[
  ...DIABLO_ROUTES.map(route=>({role:'diablo',dx:route.from[0]-place.x,dz:route.from[1]-place.z,route})),
  ...[-3,-1,1,3].map(dx=>({role:'drummer',dx,dz:-4.6})),
  ...[[ -3.1,-.8,.35],[1.6,2.7,-.6],[3.8,-2.0,.9]].flatMap(([cx,cz,heading],pair)=>[false,true].map(woman=>({role:'congo',dx:cx+(woman?0:-Math.sin(heading)*1.15),dz:cz+(woman?0:-Math.cos(heading)*1.15),woman,pair,center:{x:place.x+cx,z:place.z+cz},danceHeading:heading}))),
  ...[[-4.7,3.4,false],[-3.6,4.5,false],[-4.8,4.6,true],[-3.5,3.4,true]].map(([dx,dz,child])=>({role:'family',dx,dz,child}))
 ];
 for(const [i,person]of cast.entries()){
  const {role,woman=false,pair=0,child=false}=person,p={x:place.x+person.dx,z:place.z+person.dz};
  const h=createHuman({T,make,mat,geometry},{index:i+4,gender:woman?'woman':'man',skinTone:4+i%3,outfitColor:role==='diablo'?'#c82c27':role==='congo'?colors[pair]:role==='drummer'?'#f1c957':colors[i%3],pantsColor:role==='diablo'?(i%2?'#322625':'#b52624'):'#4a3431'});
  h.g.name=role==='diablo'?'Diablo de Congo · side performer':role==='drummer'?'Congo hand drummer':role==='family'?(child?'Watching family · child':'Watching family · adult'):woman?'Congo woman · paired dancer':'Congo man · paired dancer';h.g.userData.congoRole=role;h.g.userData.pair=role==='congo'?pair:null;setHumanAge(h,child?'kid':'adult',i);h.g.position.set(p.x,height(p.x,p.z)+.14,p.z);h.g.rotation.y=role==='drummer'?0:role==='congo'?(woman?Math.PI:0):Math.atan2(place.x-p.x,place.z-p.z);root.add(h.g);
  if(role==='diablo')mask(h,i);
  if(role==='congo'&&woman){for(let k=0;k<6;k++){const sector=geometry(new T.CylinderGeometry(.17,.46,.62,14,1,true,k*Math.PI/3,Math.PI/3));piece(sector,cloth[(k+i)%4],0,.70,0,1,1,1,h.g);}for(let k=0;k<5;k++)piece(ball,cloth[(k+i)%4],(k-2)*.045,1.77,-.015,.045,.035,.04,h.g);}
  if(role==='congo'&&!woman){for(let k=0;k<3;k++)piece(box,cloth[(pair+k)%4],0,1.08+k*.08,.14,.34,.028,.015,h.g);piece(box,cloth[pair],0,.90,.04,.36,.12,.24,h.g);}
  if(role==='drummer'){const drum=new T.Group();drum.name='Rope-tension wooden Congo hand drum';drum.scale.setScalar(h.g.scale.y);root.add(drum);drum.position.set(p.x,height(p.x,p.z)+.14,p.z+.58);piece(cylinder,wood,0,.56,0,.32,1.02,.32,drum);piece(cylinder,skin,0,1.08,0,.34,.035,.34,drum);for(const y of [.10,1.02]){const rim=piece(cylinder,black,0,y,0,.335,.035,.335,drum);rim.name='Drum rim';}for(let k=0;k<12;k++){const a=k*Math.PI/6;piece(cylinder,ivory,Math.sin(a)*.325,.58,Math.cos(a)*.325,.009,.84,.009,drum);}}
  h.batch();actors.push({...h,...p,baseY:h.g.position.y,heading:h.g.rotation.y,role,child,pair,woman,route:person.route,center:person.center,danceHeading:person.danceHeading,phase:i*.17,rate:role==='diablo'?.45+i*.035:role==='family'?.6:role==='drummer'?1+(i%2)*.5:1});
 }
 // A shared refreshment table beside the watching family; the main approach stays open.
 const fruitArt=createFruitEmojis(T),tx=place.x+4.6,tz=place.z+3.2,ty=height(tx,tz)+.14;
 piece(box,wood,tx,ty+.72,tz,1.6,.12,.9,root);
 for(const side of [-1,1])piece(cylinder,wood,tx+side*.6,ty+.34,tz,.065,.68,.065,root);
 for(let i=0;i<5;i++)fruitArt.sprite('banana',tx-.48+(i%3)*.23,ty+.95+Math.floor(i/3)*.17,tz-.12+(i%2)*.18,.44,root);
 for(let i=0;i<3;i++)fruitArt.sprite('coconut',tx+.25+(i%2)*.3,ty+.94+Math.floor(i/2)*.16,tz+.06,.4,root);
 // A banner is visible from the Costa Arriba road, with an unobstructed approach.
 const banner=new T.Group();root.add(banner);const by=height(place.x,place.z-6);
 for(const side of [-1,1])piece(cylinder,wood,place.x+side*6,by+2,place.z-6,.07,4,.07,banner);
 let texture,signMaterial;
 if(typeof document!=='undefined'){const c=document.createElement('canvas');c.width=1024;c.height=160;const ctx=c.getContext('2d');ctx.fillStyle='#73372b';ctx.fillRect(0,0,1024,160);ctx.fillStyle='#ffe6aa';ctx.font='bold 64px system-ui';ctx.textAlign='center';ctx.fillText('🥁 DIABLOS Y CONGOS',512,100);texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;signMaterial=mat('#fff',{map:texture,side:T.DoubleSide,roughness:.9});piece(box,signMaterial,place.x,by+3.4,place.z-6,11,1.7,.03,banner);}
 let joined=false,time=0,joinBlend=0,lastAvatar=null,lastSongTime=null,audioDrift=0;
 const open=()=>!worldClock(state?.world?.dayTime).night;
 const near=(x,z)=>open()&&Math.hypot(x-place.x,z-place.z)<10;
 function leave(){joined=false;joy.setCongoDancing?.(false);if(lastAvatar)lastAvatar.rotation.z=0;}
 function interact(){if(!open()){leave();return false;}if(joined){leave();return false;}joined=true;joinBlend=0;joy.setCongoDancing?.(true);joy.gesture?.();joy.focusCongo?.();return true;}
 function clock(){const song=joy.soundtrackStatus;return song?.key==='congo'&&song.playing?congoBeat(song.time+audioDrift):time*1.8;}
 function update(dt,active,info){root.visible=open()&&!info.indoors&&Math.hypot(info.x-place.x,info.z-place.z)<150;if(joined&&(!near(info.x,info.z)||info.indoors))leave();if(!active)return;if(active){time+=dt;if(joined)joinBlend=Math.min(1,joinBlend+dt/ .65);const song=joy.soundtrackStatus;if(song?.key==='congo'&&song.playing){audioDrift=lastSongTime===song.time?audioDrift+dt*1.1:0;lastSongTime=song.time;}else{audioDrift=0;lastSongTime=null;}}if(!root.visible)return;const beat=clock();for(const p of actors){const local=(p.role==='family'?time*1.25+p.phase:p.role==='congo'?beat*(1+p.pair*.035)+p.pair*2.7:p.role==='drummer'?beat+(p.phase>.9?.5:0):beat*p.rate+p.phase),v=congoDancePose(local,p.role);if(!motion()){v.lift=0;v.sway*=.3;}p.g.position.x=p.x+Math.cos(p.heading)*v.travel+Math.sin(p.heading)*v.advance;p.g.position.z=p.z-Math.sin(p.heading)*v.travel+Math.cos(p.heading)*v.advance;if(p.role==='congo'){p.g.position.x=p.x+v.travel;p.g.position.z=p.z+Math.cos(p.heading)*v.advance;}p.g.position.y=height(p.g.position.x,p.g.position.z)+(p.role==='diablo'?0:.14)+v.lift;p.g.rotation.x=v.lean;p.g.rotation.z=v.sway;p.g.rotation.y=p.heading+v.turn;if(p.role==='congo'){const angle=p.danceHeading,arc=congoPartnerArc(local),dx=v.travel+(p.woman?0:arc.x),dz=-v.advance+(p.woman?0:arc.z);p.g.position.x=p.center.x+Math.cos(angle)*dx+Math.sin(angle)*dz;p.g.position.z=p.center.z-Math.sin(angle)*dx+Math.cos(angle)*dz;p.g.position.y=height(p.g.position.x,p.g.position.z)+.14+v.lift;p.g.rotation.y=angle+(p.woman?Math.PI+arc.heading*.45:arc.heading);if(!p.woman)p.g.rotation.x=.12+Math.cos(local*Math.PI*2)*.025;}if(p.route){const creep=diabloCreep(p.route,time);const distance=p.lastCreep?Math.hypot(creep.x-p.lastCreep.x,creep.z-p.lastCreep.z):0;p.lastCreep={x:creep.x,z:creep.z};p.stride=(p.stride||p.phase)+distance*10;p.creeping=creep.moving&&distance>.00001;p.g.position.set(creep.x,height(creep.x,creep.z),creep.z);p.g.rotation.y=creep.moving?creep.heading:Math.atan2(place.x-creep.x,place.z-creep.z)+Math.sin(time*.7+p.phase)*.16;p.hiding=creep.hiding;const stalk=time*(2.1+p.phase*.07)+p.phase;p.g.rotation.x=.26+(creep.hiding?.12:.03)+Math.sin(stalk*.43)*.025;p.g.rotation.z=Math.sin(stalk)*.045;v.step=p.creeping?Math.sin(p.stride)*.65:Math.sin(stalk)*.08;v.arm=-.45-Math.max(0,Math.sin(stalk*.7))*.3;v.elbow=-.8;}for(let i=0;i<2;i++){p.legs[i].rotation.x=p.role==='family'?v.step*(i?1:-1):p.role==='diablo'?v.step*(i?1:-1):p.role==='congo'?v.step*(i?-1:1):Math.sin((local+i*.5)*Math.PI*2)*(p.role==='drummer'?.035:p.woman?.23:.16);p.knees[i].rotation.x=p.role==='congo'?Math.max(0,-v.step*(i?-1:1))*1.2:.06;p.arms[i].rotation.x=p.role==='drummer'?-.9+Math.sin((local+i*.5)*Math.PI*2)*.48:v.arm+(i===0?.09:-.09);p.arms[i].rotation.z=(i===0?-1:1)*.22;p.elbows[i].rotation.x=v.elbow+(p.role==='congo'?Math.sin(time*.7+p.phase+i)*.045:0);if(p.role==='diablo'){p.legs[i].rotation.x=(p.hiding?-1.04:-.77)+v.step*(i?1:-1)*.45;p.knees[i].rotation.x=(p.hiding?1.65:1.24)+Math.max(0,Math.sin((p.creeping?p.stride:time*2.1+p.phase)+i*Math.PI))*(p.creeping?.48:.10);p.arms[i].rotation.x+=i?-.12:.12;}if(p.role==='congo'&&!p.woman){p.legs[i].rotation.x=-.48+v.step*(i?-1:1);p.knees[i].rotation.x=.86+Math.max(0,-v.step*(i?-1:1))*.6;}if(p.role==='congo'&&!p.woman&&i===0){p.arms[i].rotation.x=-2.35+Math.sin(local*Math.PI)*.12;p.arms[i].rotation.z=-.30;p.elbows[i].rotation.x=-.45;}}if(p.role==='diablo'||(p.role==='congo'&&!p.woman)){p.g.updateMatrixWorld(true);const low=Math.min(...p.knees.map(k=>k.localToWorld(new T.Vector3(0,-.47,.05)).y));p.g.position.y+=height(p.g.position.x,p.g.position.z)+.015-low;}}}
 function pose({avatar,arms,legs,moving,allowed=true}){if(!joined)return false;if(moving||!allowed){leave();return false;}lastAvatar=avatar;const beat=clock(),v=congoDancePose(beat);if(!motion()){v.lift=0;v.sway*=.3;}const blend=joinBlend*joinBlend*(3-2*joinBlend);avatar.position.x+=v.travel*blend;avatar.position.y+=v.lift*blend;avatar.rotation.y=Math.PI+v.turn*blend;avatar.rotation.z=v.sway*blend;arms.forEach((a,i)=>{a.rotation.x+=(v.arm+(i?-.14:.14)-a.rotation.x)*blend;});legs.forEach((l,i)=>{l.rotation.x+=(v.step*(i?-1:1)-l.rotation.x)*blend;});return true;}
 return {surface:(x,z)=>Math.hypot(x-place.x,z-place.z)<place.radius?height(x,z)+.14:-Infinity,root,actors,near,interact,leave,pose,update,get joined(){return joined;},get phase(){return clock();},dispose(){leave();fruitArt.dispose();texture?.dispose();scene.remove(root);}};
}


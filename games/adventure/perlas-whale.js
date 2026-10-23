import {animalLoft} from './animal-craft.js';
import {marineWater} from './explore-state.js';
export const PERLAS_WHALE_HOME={x:560,z:125,radius:115};
export function whaleHabitat(x,z){return Math.hypot(x-560,z-125)<115&&marineWater(x,z);}
export function createPerlasWhale({T,scene,whaleRoute=null}){
 const g=new T.Group();g.name=whaleRoute?.name||'Las Perlas · giant humpback whale';scene.add(g);const geometries=[],materials=[];
 const mat=color=>{const m=new T.MeshStandardMaterial({color,roughness:.68});materials.push(m);return m;},skin=mat('#344650'),belly=mat('#bac8ca'),eye=mat('#121c22'),spray=mat('#e4f3f4');
 function part(m,x,y,z,a,b,c,parent=g){const geo=new T.SphereGeometry(1,24,16);geometries.push(geo);const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.scale.set(a,b,c);o.castShadow=true;parent.add(o);return o;}
 const bodyGeo=animalLoft(T,g=>{geometries.push(g);return g;},[[-9,0,.15,.16],[-7,0,.65,.6],[-4,0,1.5,1.25],[0,0,2.1,1.6],[4,.05,1.9,1.4],[6,.1,1.6,1.1],[7.7,.05,.8,.65],[8.3,0,.04,.04]],96);const body=new T.Mesh(bodyGeo,skin);body.castShadow=true;g.add(body);part(belly,0,-1.08,2,1.65,.55,4.9);
 for(const side of [-1,1]){part(eye,side*1.58,.24,6.1,.13,.13,.13);const fin=part(belly,side*2,-.6,2.1,3.2,.18,.78);fin.rotation.z=side*.15;fin.rotation.y=side*-.48;for(let i=0;i<6;i++)part(belly,side*(.4+i*.17),.85-i*.08,6.7+i*.13,.09,.07,.09);}
 const dorsal=part(skin,0,1.5,-2,.24,.8,.9);dorsal.rotation.x=-.45;const tail=new T.Group();tail.position.z=-6.7;g.add(tail);part(skin,0,0,-1,.75,.65,2.2,tail);for(const side of [-1,1]){const fluke=part(skin,side*1.7,0,-2.6,2.1,.16,.9,tail);fluke.rotation.y=side*.25;}
 const blow=new T.Group();blow.position.set(0,1.2,4.2);g.add(blow);for(let i=0;i<14;i++)part(spray,Math.sin(i*2.4)*i*.035,i*.24,Math.cos(i*2.4)*i*.035,.07+i*.017,.13,.07+i*.017,blow);
 let time=whaleRoute?.phase||0,heading=0;g.position.set(610,-1,180);if(whaleRoute){const p=coibaWhalePose(whaleRoute,time);g.position.set(p.x,-1,p.z);}
 return {g,update(dt,active,info){if(active){time+=Math.min(.1,Math.max(0,dt));if(whaleRoute){const p=coibaWhalePose(whaleRoute,time);g.position.x=p.x;g.position.z=p.z;heading=p.heading;}else{const nx=g.position.x+Math.sin(heading)*dt*2,nz=g.position.z+Math.cos(heading)*dt*2;if(whaleHabitat(nx,nz)&&whaleHabitat(nx+Math.sin(heading)*12,nz+Math.cos(heading)*12)){g.position.x=nx;g.position.z=nz;}else heading+=dt*.7;}g.rotation.y=heading;const cycle=time%48;g.position.y=cycle<20?-.9+Math.sin(time*.6)*.15:-.9-Math.sin((cycle-20)/28*Math.PI)*7;g.rotation.x=Math.sin(time*.13)*.035;tail.rotation.x=Math.sin(time*1.5)*.16;blow.visible=cycle>5&&cycle<7;blow.scale.setScalar(.6+(cycle%2)*.35);}g.visible=!info.indoors&&Math.hypot(info.x-g.position.x,info.z-g.position.z)<250;},dispose(){g.removeFromParent();geometries.forEach(x=>x.dispose());materials.forEach(x=>x.dispose());}};
}

// Two separate open-water loops south of Coiba, off Chiriquí.
export const COIBA_WHALE_ROUTES=[
 {name:'Coiba · western humpback',x:-535,z:245,radius:24,phase:0},
 {name:'Coiba · eastern humpback',x:-425,z:245,radius:26,phase:19}
];
export function coibaWhalePose(route,time){const a=time*1.6/route.radius;return {x:route.x+Math.cos(a)*route.radius,z:route.z+Math.sin(a)*route.radius,heading:-a};}

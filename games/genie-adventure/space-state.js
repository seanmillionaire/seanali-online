export const SAVE_KEY='genie-adventure-v1';
export const PLANETS=[
 {id:'shells',name:'Aster',visitor:'Pip',radius:135,center:[0,0,0],color:'#899eb2',light:'#bce7ff',kind:'rock',wish:'Guide the lost travellers home',wishEs:'Guía a los viajeros de vuelta a casa',task:'Recover the three navigation signals',taskEs:'Recupera las tres señales de navegación'},
 {id:'picnic',name:'Verdan',visitor:'Mila',radius:155,center:[6800,800,-5700],color:'#4c998e',light:'#a6ffdc',kind:'cloud',wish:'Return energy to a fading world',wishEs:'Devuelve la energía a un mundo que se apaga',task:'Recover the three energy fragments',taskEs:'Recupera los tres fragmentos de energía'},
 {id:'seed',name:'Ember',visitor:'Ollie',radius:120,center:[-7200,-700,-4900],color:'#bc7057',light:'#ffd0a5',kind:'rock',wish:'Bring a silent biosphere back to life',wishEs:'Devuelve la vida a una biosfera silenciosa',task:'Recover the three living seeds',taskEs:'Recupera las tres semillas de vida'},
 {id:'song',name:'Auralis',visitor:'Luna',radius:145,center:[8100,-900,6200],color:'#8372b4',light:'#dfc4ff',kind:'bands',wish:'Restore the frequency of the stars',wishEs:'Restaura la frecuencia de las estrellas',task:'Recover the three resonance fragments',taskEs:'Recupera los tres fragmentos de resonancia'},
 {id:'care',name:'Nivea',visitor:'Sol',radius:125,center:[-6600,1400,6500],color:'#87b6c8',light:'#d1f5ff',kind:'ice',wish:'Protect the life beneath the ice',wishEs:'Protege la vida bajo el hielo',task:'Recover the three shield fragments',taskEs:'Recupera los tres fragmentos del escudo'},
 {id:'light',name:'Solara',visitor:'Nova',radius:170,center:[900,2300,-12300],color:'#c09861',light:'#ffe8ac',kind:'bands',wish:'Reconnect the outer system',wishEs:'Reconecta el sistema exterior',task:'Recover the three beacon fragments',taskEs:'Recupera los tres fragmentos del faro'}
];
export const FRAGMENT_SITES=[[-26,-23],[29,-17],[4,32]];
export const planetById=id=>PLANETS.find(p=>p.id===id)||PLANETS[0];
const finite=(n,fallback=0)=>Number.isFinite(n)?n:fallback;
export function normalizeSpace(raw){
 const planet=planetById(raw?.planet).id,mode=['walk','orbit','flight'].includes(raw?.mode)?raw.mode:'orbit';
 const p=planetById(planet),fallback=[p.center[0],p.center[1]+p.radius+115,p.center[2]+70];
 const position=Array.isArray(raw?.position)&&raw.position.length===3?raw.position.map((n,i)=>Math.max(-30000,Math.min(30000,finite(n,fallback[i])))):fallback;
 const local=Array.isArray(raw?.local)?[Math.max(-p.radius,Math.min(p.radius,finite(raw.local[0]))),Math.max(-p.radius,Math.min(p.radius,finite(raw.local[1],22)))]:[0,22];
 const surface=Array.isArray(raw?.surface)&&raw.surface.length===3&&raw.surface.every(Number.isFinite)?raw.surface:[local[0]/p.radius,Math.sqrt(Math.max(.01,1-(local[0]/p.radius)**2-(local[1]/p.radius)**2)),local[1]/p.radius];
 return {version:1,planet,mode,position,local,surface,yaw:finite(raw?.yaw),orbit:finite(raw?.orbit)};
}
export function normalize(raw){
 const source=raw&&raw.version===1?raw:{};const old=source.world||{},granted=[...new Set((Array.isArray(old.wishes?.granted)?old.wishes.granted:[]).filter(id=>PLANETS.some(p=>p.id===id)))];
 const fragments=Object.fromEntries(PLANETS.map(p=>[p.id,[...new Set((Array.isArray(old.wishes?.fragments?.[p.id])?old.wishes.fragments[p.id]:[]).filter(n=>[0,1,2].includes(n)))]]));
 return {...source,version:1,started:source.started===true,lang:source.lang==='es'?'es':'en',sound:source.sound!==false,motion:source.motion!==false,world:{...old,wishes:{granted,fragments},space:normalizeSpace(old.space)}};
}
export const fresh=()=>normalize(null);
export function collectFragment(state,id,index){
 const w=state.world,p=w.space;if(p.mode!=='walk'||p.planet!==id||p.surface[1]<.5||w.wishes.granted.includes(id)||![0,1,2].includes(index))return false;
 const site=FRAGMENT_SITES[index];if(Math.hypot(p.local[0]-site[0],p.local[1]-site[1])>4||w.wishes.fragments[id].includes(index))return false;
 w.wishes.fragments[id].push(index);return true;
}
export function grantPlanetWish(state,id){
 const w=state.world,p=w.space;if(p.mode!=='walk'||p.planet!==id||p.surface[1]<.5||Math.hypot(...p.local)>9||w.wishes.fragments[id].length!==3||w.wishes.granted.includes(id))return false;
 w.wishes.granted.push(id);return true;
}
// Screen-right and screen-up, projected onto the current movement surface.
// The same transform is used by keyboard, touch joystick, and visual tests.
export function screenMotion(T,camera,normal,x,y){
 const right=new T.Vector3().setFromMatrixColumn(camera.matrixWorld,0).projectOnPlane(normal).normalize();
 const forward=new T.Vector3().crossVectors(normal,right).normalize();
 return right.multiplyScalar(x).addScaledVector(forward,-y).clampLength(0,1);
}

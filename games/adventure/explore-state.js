// Exploration is independent of lesson order. Every place is open from the start.
export const explorePlaces=[
 {id:'pip',x:4,z:9,icon:'🐢',es:'Pip · la tortuga',en:'Pip · the sea turtle',kind:'friend'},
 {id:'mila',x:-8,z:5,icon:'🦜',es:'Mila · picnic tropical',en:'Mila · tropical picnic',kind:'friend'},
 {id:'ollie',x:-9,z:-7,icon:'🪶',es:'Ollie · bosque brillante',en:'Ollie · glow grove',kind:'friend'},
 {id:'luna',x:7,z:1,icon:'🦀',es:'Luna · música',en:'Luna · music',kind:'friend'},
 {id:'garden',x:11,z:7,icon:'🌸',es:'Jardín de mariposas',en:'Butterfly garden',kind:'garden'},
 {id:'beacon',x:-1,z:-2.5,icon:'✦',es:'El faro de los deseos',en:'Wishing lighthouse',kind:'beacon'},
 {id:'bounce',x:-4,z:6,icon:'🍄',es:'Seta saltarina',en:'Bouncy mushroom',kind:'bounce'},
 {id:'balloon',x:5,z:-7,icon:'🎈',es:'Viaje en globo',en:'Balloon ride',kind:'balloon'},
 {id:'boat',x:7,z:12,icon:'⛵',es:'Paseo en barco',en:'Boat ride',kind:'boat'},
 {id:'wardrobe',x:-15,z:3,icon:'🎩',es:'Mi estilo',en:'My style',kind:'wardrobe'},
 {id:'chest',x:-15,z:-1,icon:'🎁',es:'Cofre escondido',en:'Hidden chest',kind:'chest'}
];
export const exploreItems=[
 ...[[-12,-2],[-10,-2],[-8,-2],[-12,0],[-8,0]].map(([x,z],i)=>({id:'fruit'+i,x,z,kind:'fruit',tile:[5,4,6,7,5][i],es:['mango','coco','piña','plátanos','mango'][i],en:['mango','coconut','pineapple','bananas','mango'][i]})),
 ...[[-12,-6],[-10,-9],[-6,-8],[-5,-5],[-13,-4]].map(([x,z],i)=>({id:'glow'+i,x,z,kind:'glow',es:'luciérnaga',en:'firefly'})),
 ...[[2,11],[-3,11],[-9,9],[-15,5],[-17,0],[-14,-7],[-7,-11],[2,-11],[10,-9],[15,-4],[17,2],[14,8]].map(([x,z],i)=>({id:'shell'+i,x,z,kind:'shell',es:'concha',en:'shell'}))
];
export function freshExplore(){return {x:4,z:10,collected:[],badges:[],hat:0,pet:false,flowers:0};}
export function normalizeExplore(raw){const s=freshExplore();if(!raw||typeof raw!=='object')return s;const ids=new Set(exploreItems.map(x=>x.id));s.collected=[...new Set(Array.isArray(raw.collected)?raw.collected.filter(x=>ids.has(x)):[])];s.badges=[...new Set(Array.isArray(raw.badges)?raw.badges.filter(x=>['picnic','glow','song','garden','treasure','beacon','balloon','boat'].includes(x)):[])];if(Number.isFinite(raw.x)&&Number.isFinite(raw.z)&&(raw.x/18.7)**2+(raw.z/12.5)**2<=1.02){s.x=raw.x;s.z=raw.z;}s.hat=Number.isInteger(raw.hat)?Math.max(0,Math.min(6,raw.hat)):0;s.pet=raw.pet===true;s.flowers=Math.max(0,Math.min(6,Math.floor(Number(raw.flowers)||0)));return s;}
export function collectExplore(s,id){if(!exploreItems.some(x=>x.id===id)||s.collected.includes(id))return false;s.collected.push(id);return true;}
export function badgeExplore(s,id){if(s.badges.includes(id))return false;s.badges.push(id);return true;}
export function countExplore(s,kind){return s.collected.filter(id=>exploreItems.find(x=>x.id===id)?.kind===kind).length;}
// Small navigation grid: a tap walks around cottages instead of through them.
export const worldObstacles=[[-10,5,1.55],[-13,2,1.3],[10,2,1.55],[12,-1,1.2],[9,-4,1.1],[-1,-5,1.5]];
export function walkable(x,z){return (x/18.7)**2+(z/12.5)**2<=1&&worldObstacles.every(([a,b,r])=>Math.hypot(x-a,z-b)>r+.3);}
export function islandPath(from,to){
 const nodes=[];for(let z=-12;z<=12;z++)for(let x=-18;x<=18;x++)if(walkable(x,z))nodes.push({x,z,key:x+','+z});
 const nearest=p=>nodes.reduce((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)<Math.hypot(b.x-p.x,b.z-p.z)?a:b);
 const start=nearest(from),goal=nearest(to),map=new Map(nodes.map(n=>[n.key,n])),open=[start.key],cost=new Map([[start.key,0]]),came=new Map(),closed=new Set();
 while(open.length){open.sort((a,b)=>(cost.get(a)+Math.hypot(map.get(a).x-goal.x,map.get(a).z-goal.z))-(cost.get(b)+Math.hypot(map.get(b).x-goal.x,map.get(b).z-goal.z)));const key=open.shift(),n=map.get(key);if(key===goal.key){const route=[];let k=key;while(k!==start.key){route.unshift({x:map.get(k).x,z:map.get(k).z});k=came.get(k);}if(walkable(to.x,to.z))route.push(to);return route;}closed.add(key);for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const next=(n.x+dx)+','+(n.z+dz);if(!map.has(next)||closed.has(next))continue;const c=cost.get(key)+1;if(c<(cost.get(next)??Infinity)){cost.set(next,c);came.set(next,key);if(!open.includes(next))open.push(next);}}}return [];
}
// One suggested adventure at a time, alternating places so learning feels like exploring.
export function nextIslandAdventure(state){
 const places=['pip','mila','ollie','luna','garden','beacon'],regions=['harbor','market','jungle','music','garden','summit'];
 const ids=Array.from({length:8},(_,i)=>regions.map(r=>`${r}-${i}`)).flat();
 const completed={...state.completed,...state.islandLessons?.completed},attempts=state.islandLessons?.attempts||{};
 const id=ids.find(id=>attempts[id])||ids.find(id=>!completed[id]);if(!id)return null;
 const region=regions.indexOf(id.split('-')[0]);return {id,region,place:places[region],done:ids.filter(id=>completed[id]).length,resuming:!!attempts[id]};
}
// Fixed rewards keep the wallet explainable and prevent repeat-click farming.
export const islandShop=[{id:'coral',cost:15,hat:4,es:'Sombrero coral',en:'Coral hat'},{id:'ocean',cost:30,hat:5,es:'Sombrero océano',en:'Ocean hat'},{id:'sunshine',cost:45,hat:6,es:'Sombrero sol',en:'Sunshine hat'}];
export function coinValue(id){if(/^(harbor|market|jungle|music|garden|summit)-[0-7]$/.test(id))return 10;if(/^flower-[1-6]$/.test(id))return 2;if(['picnic','glow','song'].includes(id))return 15;if(id==='beacon')return 25;if(id==='pet')return 3;if(exploreItems.some(i=>i.id===id))return 1;return 0;}
export function normalizeWallet(raw){const rewards=[...new Set(Array.isArray(raw?.rewards)?raw.rewards.filter(id=>typeof id==='string'&&coinValue(id)>0):[])];let balance=rewards.reduce((n,id)=>n+coinValue(id),0);const items=[];for(const id of Array.isArray(raw?.items)?raw.items:[]){const item=islandShop.find(x=>x.id===id);if(item&&!items.includes(id)&&balance>=item.cost){items.push(id);balance-=item.cost;}}return {rewards,items};}
export function coinBalance(state){const w=state.wallet||{rewards:[],items:[]};return w.rewards.reduce((n,id)=>n+coinValue(id),0)-w.items.reduce((n,id)=>n+(islandShop.find(x=>x.id===id)?.cost||0),0);}
export function earnCoins(state,id){state.wallet??=normalizeWallet(null);const amount=coinValue(id);if(!amount||state.wallet.rewards.includes(id))return 0;state.wallet.rewards.push(id);return amount;}
export function syncWallet(state){state.wallet=normalizeWallet(state.wallet);for(const id of Object.keys({...state.completed,...state.islandLessons?.completed}))earnCoins(state,id);for(let i=1;i<=(state.world?.flowers||0);i++)earnCoins(state,'flower-'+i);for(const id of state.world?.badges||[])earnCoins(state,id);for(const id of state.world?.collected||[])earnCoins(state,id);if(state.world?.pet)earnCoins(state,'pet');return state.wallet;}
export function buyIslandItem(state,id){const item=islandShop.find(x=>x.id===id);if(!item)return false;state.wallet??=normalizeWallet(null);if(state.wallet.items.includes(id)){state.world.hat=item.hat;return true;}if(coinBalance(state)<item.cost)return false;state.wallet.items.push(id);state.world.hat=item.hat;return true;}

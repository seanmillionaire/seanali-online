import assert from 'node:assert/strict';
import {ICONIC_PLACES,ICONIC_VOLUMES,AMADOR_ISLANDS,iconicBlocked,valleyRelief} from '../games/adventure/iconic-layout.js';
import {explorePlaces,MAINLAND_ROADS,HIGHWAY_CURVES,inWater,isletHeight,roadDistance,earnCoins,coinBalance} from '../games/adventure/explore-state.js';
import {fresh,normalize} from '../games/adventure/state.js';
import {cityAccess} from '../games/adventure/city-chapter-state.js';
import {loadGameMode} from '../games/adventure/game-mode.js';
for(const p of ICONIC_PLACES){assert.equal(explorePlaces.filter(q=>q.id===p.id).length,1);assert(!inWater(p.x,p.z),p.id+' dry arrival');assert(!iconicBlocked(p.x,p.z),p.id+' clear arrival');assert(p.en&&p.es);}
for(const name of ['amador','panamaViejo','elValle']){const road=MAINLAND_ROADS[name];assert(Object.entries(MAINLAND_ROADS).some(([id,nodes])=>id!==name&&nodes.some(p=>p[0]===road[0][0]&&p[1]===road[0][1])),name+' joins existing road');for(const [x,z]of HIGHWAY_CURVES[name])assert(!inWater(x,z),name+' dry connected road');}
for(const p of ICONIC_VOLUMES)for(const dx of [-p.w/2,0,p.w/2])for(const dz of [-p.d/2,0,p.d/2]){assert(roadDistance(p.x+dx,p.z+dz)>4.8,p.id+' lane clearance');assert(isletHeight(p.x+dx,p.z+dz)>0);}
assert(valleyRelief(-208,-72)>valleyRelief(-170,-72)+10);assert.equal(AMADOR_ISLANDS.length,4);
const state=fresh();state.cityChapter=null;const before=coinBalance(state);for(const p of ICONIC_PLACES.filter(p=>p.landmark)){assert.equal(earnCoins(state,'landmark-'+p.id),6);assert.equal(earnCoins(state,'landmark-'+p.id),0);}const restored=normalize(JSON.parse(JSON.stringify(state)));assert.equal(coinBalance(restored),before+18);assert.equal(earnCoins(restored,'landmark-elValle'),0);
const storage={getItem:()=>null,setItem(){}};const story=loadGameMode(storage,'story'),admin=loadGameMode(storage,'admin');for(const p of ICONIC_PLACES){assert(cityAccess(admin,p.x,p.z));if(p.id!=='canal')assert(!cityAccess(story,p.x,p.z),p.id+' remains story gated');}
console.log('PASS five map destinations, connected dry approaches, building lane clearance, four causeway islands, crater relief, one-time shared-wallet rewards, save/reload and story/admin gates');

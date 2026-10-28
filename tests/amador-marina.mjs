import {AMADOR_MARINA_ROUTES} from '../games/adventure/amador-marina-routes.js';
import assert from 'node:assert/strict';
import {shippingRoutes,shippingPose,shippingClear} from '../games/adventure/ocean-shipping.js';
import {AMADOR_BERTHS,marinaPath,marinaLength,marinaPose,amadorDock} from '../games/adventure/amador-marina.js';
import {migrateAmador,AMADOR_SHIFT} from '../games/adventure/amador-layout.js';
import {DESTINATIONS} from '../games/adventure/geography.js';
const yachts=shippingRoutes().filter(r=>r.kind==='yacht');assert.equal(yachts.length,4);
const lengths=[];
for(const [i,r]of yachts.entries()){
 const path=AMADOR_MARINA_ROUTES[i];const length=marinaLength(path);lengths.push(length);
 for(let d=0;d<=length;d+=.5){const p=marinaPose(path,d);assert(shippingClear(p.x,p.z,p.heading,19,5),'hull stays in water '+i+' '+d);assert(!amadorDock(p.x,p.z),'dock clear');}
 assert.deepEqual({...marinaPose(path,length),heading:Math.PI/2},{...AMADOR_BERTHS[i]});
}
assert.deepEqual(DESTINATIONS.coconutCoast.at,[560,125]);
const old={x:453,z:180,city:{car:{x:435,z:145}},boat:{x:560,z:125}};const migrated=migrateAmador(old);assert.equal(migrated.z,180+AMADOR_SHIFT);assert.equal(migrated.city.car.z,145+AMADOR_SHIFT);assert.deepEqual(migrated.boat,old.boat);assert.deepEqual(migrateAmador(migrated),migrated);assert.equal(old.z,180);
console.log('PASS four existing yacht routes, conservative hull clearance, separate berths, Contadora identity, idempotent old-save relocation',lengths);

const built=migrateAmador({estate:{buildings:[{id:'saved',x:453,z:180},{id:'mansion',x:540,z:127}]}});assert.equal(built.estate.buildings[0].z,240);assert.equal(built.estate.buildings[1].z,127);

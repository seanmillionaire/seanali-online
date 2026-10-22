import assert from 'node:assert/strict';
import {freshExplore,normalizeExplore} from '../games/adventure/explore-state.js';
import {ensureEstateCars,selectEstateCar,ownedCars,nearestEstateCar} from '../games/adventure/estate-cars.js';
import {HOME_LOTS,homeYard} from '../games/adventure/mansion-state.js';
import {canDriveOnLand} from '../games/adventure/pizza-city.js';
import {createWorldCollision} from '../games/adventure/world-collision.js';
import {vehicleOverlap} from '../games/adventure/vehicle-contact.js';
import {createGoldenSupercar} from '../games/adventure/golden-supercar.js';
import * as T from '../games/adventure/vendor/three.module.min.js';
const s=freshExplore();assert.equal(s.city.car.model,'lamborghini');assert.equal(s.city.parkedCar.model,'ferrari');
const original={...s.city.car};assert(selectEstateCar(s.city,'ferrari'));s.city.car.x=348;s.city.car.z=-50;s.city.car.heading=1.2;
assert.deepEqual(s.city.parkedCar,original,'selection retains other position');
const reload=normalizeExplore(JSON.parse(JSON.stringify(s)));assert.equal(reload.city.car.model,'ferrari');assert.equal(reload.city.car.x,348);assert.equal(reload.city.car.heading,1.2);assert.equal(reload.city.parkedCar.model,'lamborghini');assert(selectEstateCar(reload.city,'lamborghini'));assert.equal(reload.city.car.x,original.x);
const legacy=freshExplore();delete legacy.city.car.model;delete legacy.city.parkedCar;const migrated=normalizeExplore(legacy);assert.equal(migrated.city.car.model,'lamborghini');assert.equal(migrated.city.parkedCar.model,'ferrari');assert.equal(migrated.city.car.x,original.x);
for(const lot of HOME_LOTS){const slots=homeYard(lot).cars;const state={world:freshExplore()};state.world.mansion={...state.world.mansion,lot:lot.id,stage:4};const solids=createWorldCollision({state});for(const p of Object.values(slots)){assert(canDriveOnLand(p.x,p.z),lot.id+' dry parking');assert(solids.clear(p.x,p.z),lot.id+' clear parking');}assert(!vehicleOverlap({...slots.lamborghini,width:1.3,length:2.4},{...slots.ferrari,width:1.3,length:2.4}));Object.assign(s.city.car,slots.lamborghini,{model:'lamborghini'});Object.assign(s.city.parkedCar,slots.ferrari,{model:'ferrari'});assert.equal(nearestEstateCar(s.city,slots.ferrari.x,slots.ferrari.z).model,'ferrari');}
const scene=new T.Scene(),make=(g,m,x,y,z,a,b,c,parent=scene)=>{const o=new T.Mesh(g,m);o.position.set(x,y,z);o.scale.set(a,b,c);parent.add(o);return o;},opts={T,scene,make,mat:(color,extra)=>new T.MeshStandardMaterial({color,...extra}),geometry:g=>g,box:new T.BoxGeometry(),ball:new T.SphereGeometry(),cylinder:new T.CylinderGeometry()};
const l=createGoldenSupercar(opts),f=createGoldenSupercar({...opts,model:'ferrari'});assert.equal(l.paint.color.getHexString(),'ffd12e');assert.equal(f.paint.color.getHexString(),'bc36ff');assert(f.root.name.includes('Ferrari'));assert(f.root.getObjectByName('Black shield with white horse emblem'));assert.notEqual(l.root.children.length,f.root.children.length,'distinct body, lighting and wing geometry');for(const car of [l,f]){assert.equal(car.wheels.length,4);car.update(40,1/60);assert(car.flames.every(p=>p.visible));}scene.updateMatrixWorld(true);scene.traverse(o=>assert(o.matrixWorld.elements.every(Number.isFinite)));
console.log('PASS two distinct models, six clear parking bays, separate selection/positions, legacy and current save reloads, nearest-car choice and flames on both');

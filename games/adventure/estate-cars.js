import {cityX} from './geography.js';
// The active car remains city.car for older driving, delivery and save consumers.
// The other owned car keeps its independent position when the driver switches.
export const ESTATE_CARS=['lamborghini','ferrari'];
export const carName=(id,es=false)=>id==='ferrari'?(es?'Ferrari morado':'Purple Ferrari'):(es?'Lamborghini amarillo':'Yellow Lamborghini');
export function ensureEstateCars(city,fallback={x:cityX(107),z:-50}){
 city.car.model=city.car.model==='ferrari'?'ferrari':'lamborghini';
 const other=city.car.model==='ferrari'?'lamborghini':'ferrari',p=city.parkedCar;
 city.parkedCar={model:other,x:Number.isFinite(p?.x)?p.x:fallback.x,z:Number.isFinite(p?.z)?p.z:fallback.z,heading:Number.isFinite(p?.heading)?p.heading:0};
 return [city.car,city.parkedCar];
}
export function ownedCars(city){return [city.car,city.parkedCar].filter(Boolean);}
export function selectEstateCar(city,model){if(city.car.model===model)return false;if(city.parkedCar?.model!==model)return false;[city.car,city.parkedCar]=[city.parkedCar,city.car];return true;}
export function nearestEstateCar(city,x,z,radius=4){return ownedCars(city).filter(p=>Math.hypot(x-p.x,z-p.z)<radius).sort((a,b)=>Math.hypot(x-a.x,z-a.z)-Math.hypot(x-b.x,z-b.z))[0]||null;}

import assert from 'node:assert/strict';
import {residentStyle} from '../games/adventure/regional-residents.js';
for(const [x,z,name] of [[120,-419,'Caribbean'],[-230,-200,'Caribbean'],[-385,-18,'Chiriquí'],[350,-60,'Panamá City'],[530,-425,'Guna Yala'],[-55,-8,'Pacific coast']]){
 const variants=Array.from({length:8},(_,i)=>residentStyle(x,z,i));assert(variants.every(p=>p.region===name));assert(new Set(variants.map(p=>p.skinTone)).size>=3);assert(new Set(variants.map(p=>p.outfitColor)).size===4);assert(variants.every(p=>p.beach===(name!=='Chiriquí'&&name!=='Panamá City')));
}
console.log('PASS six regional locations, varied appearances and climate-appropriate wardrobes');

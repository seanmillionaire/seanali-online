import assert from 'node:assert/strict';
import {mansionAccess,MANSION_ROOF_HEIGHT} from '../games/adventure/mansion-access.js';
import {normalizeMansion,HOME_LOTS} from '../games/adventure/mansion-state.js';
for(const lot of HOME_LOTS){let previous=0;for(let z=14;z>=-1.8;z-=.1){const a=mansionAccess(-17.4,z);assert(a?.stairs,lot.id+' walkable exterior stair');assert(Math.abs(a.height-previous)<.04,'continuous climb');previous=a.height;}for(let x=-17.4;x<-11.5;x+=.1)assert(mansionAccess(x,-1),'upper landing connects to door');assert(!mansionAccess(0,0),'walls remain solid');assert.equal(mansionAccess(0,8,true).height,MANSION_ROOF_HEIGHT);assert(!mansionAccess(12,8,true),'roof rail blocks edge');}
assert(normalizeMansion({rooftop:true}).rooftop);assert(!normalizeMansion({}).rooftop);
console.log('PASS exterior stair and door continuity, roof landing bounds and saved roof access across all estates');

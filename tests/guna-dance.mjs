import assert from 'node:assert/strict';
import {gunaDancePose} from '../games/adventure/guna-dance.js';
for(let t=0;t<60;t+=.1){const poses=[];for(let pair=0;pair<3;pair++){const a=gunaDancePose(t,pair,-1),b=gunaDancePose(t,pair,1);assert(Math.abs(Math.hypot(a.x-b.x,a.z-b.z)-.96)<1e-8);assert.equal(a.heading,b.heading);assert(a.hop>=0&&a.hop<=.075);poses.push(a,b);}for(let i=0;i<poses.length;i++)for(let j=i+1;j<poses.length;j++)assert(Math.hypot(poses[i].x-poses[j].x,poses[i].z-poses[j].z)>.9);}
const a=gunaDancePose(0,0,-1),b=gunaDancePose(8,0,-1);assert(Math.hypot(a.x-b.x,a.z-b.z)>3);assert(Math.sin(gunaDancePose(.2,0).beat)*Math.sin(gunaDancePose(.8,0).beat)<0);
console.log('PASS paired circle travel, alternating hop beat, small hops and dancer spacing');

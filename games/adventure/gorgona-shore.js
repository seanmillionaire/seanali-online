import {mainlandContains,homeShoreRadius} from './geography.js';
const shores=new Map();
export function gorgonaShoreZ(x){const key=Math.round(x*2)/2;if(shores.has(key))return shores.get(key);let last=12;for(let z=12;z<40;z+=.25){const home=Math.hypot(key/20,z/14)<homeShoreRadius(Math.atan2(z/14,key/20));if(mainlandContains(key,z)||home)last=z;}shores.set(key,last);return last;}
export function gorgonaShoreHeight(x,z,h){if(x<-106||x>112||z<12||z>40)return h;const t=Math.max(0,Math.min(1,(gorgonaShoreZ(x)-z)/6)),s=t*t*(3-2*t);return Math.min(h,.03+1.07*s);}

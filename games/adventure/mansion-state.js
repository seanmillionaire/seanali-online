import {MALL_OUTFITS} from './mall-shopping.js';
import {stairAccess,floorAt,floorHeight,upperCanWalk} from './mansion-floors.js?v=236';
import {normalizeHomeDay} from './home-activities.js?v=225';
export const HOME_LOTS=[
 {id:'gorgona',x:-122,z:-16,en:'Chame Garden Estate',es:'Residencia Jardín de Chame',description:'A private tropical garden close to the Pacific coast.',descripcion:'Un jardín tropical privado cerca de la costa del Pacífico.'},
 {id:'boquete',x:-291,z:-98,en:'Boquete Highland Estate',es:'Residencia de las Tierras Altas',description:'A quiet green hillside retreat near Boquete.',descripcion:'Un refugio verde y tranquilo cerca de Boquete.'},
 {id:'city',x:439,z:-36,en:'Panama City Residence',es:'Residencia de Ciudad de Panamá',description:'City living with a landscaped courtyard and private terrace.',descripcion:'Vida urbana con jardín y terraza privada.'}
];
export const HOME_STAGES=[['Foundation & utilities','Cimientos y servicios'],['Walls, windows & roof','Paredes, ventanas y techo'],['Kitchen & bathrooms','Cocina y baños'],['Furniture & finishing','Muebles y acabados']];
export const HOME_OUTFITS=[...MALL_OUTFITS,{id:'lavender',en:'Lavender day dress',es:'Vestido lavanda',color:'#b8a6d7'},{id:'linen',en:'Ivory linen outfit',es:'Conjunto de lino marfil',color:'#ece4d4'},{id:'evening',en:'Rose evening dress',es:'Vestido rosa',color:'#bf738e'},{id:'swim',en:'Turquoise swim outfit',es:'Traje de baño turquesa',color:'#42bfd0'},{id:'party',en:'Pink party dress',es:'Vestido de fiesta rosa',color:'#e994bd'},{id:'pajamas',en:'Blue pajamas',es:'Pijama azul',color:'#79afc8'}];
const n=v=>Math.max(0,Math.min(999999,Math.floor(Number(v)||0)));
export function normalizeMansion(raw){const lot=HOME_LOTS.some(l=>l.id===raw?.lot)?raw.lot:null;return {rooftop:raw?.rooftop===true,drivewayReady:raw?.drivewayReady===true,version:3,gym:{runs:n(raw?.gym?.runs),yoga:n(raw?.gym?.yoga),bestRun:Math.min(8,n(raw?.gym?.bestRun)),bestYoga:Math.min(6,n(raw?.gym?.bestYoga))},day:normalizeHomeDay(raw?.day,raw?.plates),lot,method:['buy','immediate'].includes(raw?.method)?raw.method:'build',stage:lot?Math.min(4,n(raw?.stage)):0,spent:n(raw?.spent),style:raw?.style==='sand'?'sand':'pearl',outfit:HOME_OUTFITS.some(o=>o.id===raw?.outfit)?raw.outfit:'lavender',meals:n(raw?.meals),plates:Math.min(20,n(raw?.plates)),rest:n(raw?.rest),showers:n(raw?.showers),laundry:n(raw?.laundry),gameBest:n(raw?.gameBest),memoryWins:n(raw?.memoryWins),dogName:typeof raw?.dogName==='string'?raw.dogName.replace(/[<>]/g,'').slice(0,18)||'Coco':'Coco',dogCare:n(raw?.dogCare),dogPlays:n(raw?.dogPlays),dogFollowing:raw?.dogFollowing!==false,lights:raw?.lights!==false};}
export function homeAvailable(world,id){const lot=HOME_LOTS.find(l=>l.id===id);return !!lot&&!(world.estate?.buildings||[]).some(b=>Math.abs(b.x-lot.x)<21&&Math.abs(b.z-lot.z)<20);}
export function chooseHome(world,id,method,balance){const h=world.mansion;if(h.lot||!homeAvailable(world,id)||!['buy','build','immediate'].includes(method))return false;const cost=method==='buy'?100:0;if(balance<cost)return false;h.lot=id;h.method=method;h.stage=method==='build'?0:4;h.spent+=cost;return true;}
export function constructHome(world,balance){const h=world.mansion;if(!h.lot||h.stage>=4||balance<20)return false;h.spent+=20;h.stage++;return true;}
export function homeLot(world){return HOME_LOTS.find(l=>l.id===world?.mansion?.lot)||null;}
export function homeReady(world){return !!homeLot(world)&&world.mansion.stage===4;}
export function homeReserved(x,z,margin=0){return HOME_LOTS.some(l=>Math.abs(x-l.x)<24+margin&&z-l.z> -18-margin&&z-l.z<38+margin);}
// Central hall and real door gaps connect six rooms. Furniture stays solid.
export const HOME_WALLS=[...[-3,3].flatMap(x=>[[-14,-10.4],[-7.6,-1.4],[1.4,7.6],[10.4,14]].map(([a,b])=>({x,z:(a+b)/2,w:.22,d:b-a}))),...[-4.5,4.5].flatMap(z=>[-9,9].map(x=>({x,z,w:12,d:.22})))];
export const HOME_FURNITURE=[{x:-7,z:-3.5,w:3.2,d:1.25},{x:6,z:1.7,w:2,d:1},{x:-12,z:-12,w:3,d:2},{x:-9,z:-7,w:5,d:1.5},{x:9,z:-9,w:5,d:2.5},{x:-10,z:0,w:4,d:5},{x:13,z:0,w:2,d:7},{x:-12,z:10,w:2,d:4},{x:11,z:8,w:4,d:3},{x:12,z:12.5,w:3,d:1}];
export function homeCanWalk(x,z,floor=0){if(stairAccess(x,z,floor))return true;if(floor===1)return upperCanWalk(x,z);return Math.abs(x)<14.55&&z<13.55&&z> -35.55&&![...HOME_WALLS,...HOME_FURNITURE].some(b=>Math.abs(x-b.x)<b.w/2+.28&&Math.abs(z-b.z)<b.d/2+.28);}
export function homeMove(x,z,dx,dz,floor=0){const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.15));for(let i=0;i<steps;i++){if(homeCanWalk(x+dx/steps,z,floor))x+=dx/steps;if(homeCanWalk(x,z+dz/steps,floor))z+=dz/steps;floor=floorAt(x,z,floor);}return {x,z,floor,y:floorHeight(x,z,floor)};}
export function homePath(from,to){
 const start={x:Math.round(from.x*2)/2,z:Math.round(from.z*2)/2,floor:from.floor===1?1:0},goal={x:Math.round(to.x*2)/2,z:Math.round(to.z*2)/2,floor:to.floor===1?1:0};if(!homeCanWalk(goal.x,goal.z,goal.floor))return [];
 const key=p=>p.x+','+p.z+','+p.floor,queue=[start],seen=new Map([[key(start),null]]);let found=null;
 for(let i=0;i<queue.length;i++){const p=queue[i];if(key(p)===key(goal)){found=p;break;}for(const [dx,dz]of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){const q=homeMove(p.x,p.z,dx,dz,p.floor),k=key(q);if(!seen.has(k)&&Math.abs(q.x-p.x-dx)<1e-6&&Math.abs(q.z-p.z-dz)<1e-6){seen.set(k,p);queue.push(q);}}}
 const path=[];while(found&&seen.get(key(found))){path.unshift(found);found=seen.get(key(found));}return path;
}

// City estate meets the coast: keep the driveway and balloon on its dry side.
export function homeYard(lot){const city=lot.id==='city',car={x:lot.x+(city?-23:16),z:lot.z+(city?14.5:20),heading:city?-Math.PI/2:lot.id==='boquete'?0:Math.PI};return {car,cars:{lamborghini:car,ferrari:{x:city?car.x:car.x+6,z:city?car.z-8:car.z,heading:city?-Math.PI/2:lot.id==='boquete'?0:Math.PI}},balloon:{x:lot.x+(city?-19:-18),z:lot.z+(city?-8:23)}};}

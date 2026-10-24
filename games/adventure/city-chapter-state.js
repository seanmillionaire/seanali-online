// Only fresh saves opt in. Absence in an older save means unrestricted legacy play.
export const CITY_START={x:360,z:-67};
export const CHAPTER_PLACES={welcome:CITY_START,market:{x:390,z:-48},kitchen:{x:360,z:-40},delivery:{x:392,z:-40},shelter:{x:360,z:-41},finish:CITY_START};
export const CITY_MISSIONS=[['📱','Mi teléfono mágico','My magical phone'],['🗺️','Encuentra el mercado','Find the market'],['🥭','Comida para vivir','Food for life'],['♻️','Panamá limpio','Keep Panama beautiful'],['🪙','Mi primer trabajo','My first job'],['🌦️','Lista para la lluvia','Ready for rain'],['🏆','¡Lista para explorar!','Ready to explore!']];
export function freshCityChapter(){return {version:1,step:0,stage:0,opened:[],moved:0,parcel:0,sortedBase:0,serviceBase:0,station:null,earned:0,umbrella:false,weatherTime:0,started:false};}
export function normalizeCityChapter(raw){if(!raw||raw.version!==1)return null;const s=freshCityChapter();for(const k of ['step','stage','moved','parcel','sortedBase','serviceBase','earned','weatherTime'])s[k]=Math.max(0,Math.min(k==='step'?7:1e8,Number(raw[k])||0));s.step=Math.floor(s.step);s.stage=Math.min([0,1,3,1,2,0,0,0][s.step],Math.floor(s.stage));s.parcel=Math.min(3,Math.floor(s.parcel));s.opened=[...new Set((Array.isArray(raw.opened)?raw.opened:[]).filter(v=>['closed','phone','map','bag','food','work','wallet','weather','friends','home','progress','settings'].includes(v)))];s.station=/^city-[0-3]$/.test(raw.station)?raw.station:null;s.arrivalSeen=raw.arrivalSeen!==false;s.started=raw.started===true;s.umbrella=raw.umbrella===true;return s;}
export const cityChapterActive=state=>!!state.cityChapter&&state.cityChapter.step<7&&!state.adminMode;
export function cityAccess(state,x,z){
 if(!state.cityChapter||state.adminMode)return true;
 if(state.cityChapter.arrivalSeen===false&&x>=280&&x<=365&&z>=-75&&z<=-58)return true;
 // The new causeway is an exploration reward, outside the first city lesson.
 if(state.cityChapter.step<7&&x>375&&z>-6)return false;
 if(x>=294&&x<=435&&z>=-106&&z<=5)return true;
 if(state.cityChapter.step<7)return false;
 // The mainland road to Gorgona opens with Chapter 1. Later festival chapters unlock the country.
 if(x>=-25&&x<=435&&z>=-90&&z<=30)return true;
 return (state.world.campaign?.chapter||0)>0;
}
export function advanceCityChapter(state){const c=state.cityChapter;if(!cityChapterActive(state))return false;c.step++;c.stage=0;return true;}

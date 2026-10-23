// Food inspiration: https://es.tourismpanama.com/cultura-cocina/gustos-de-panama/
// Sancocho ingredients: https://www.telemetro.com/cocina/2019/03/17/plato-debe-faltar-mesa-panamenos/1051414.html
// Saved, bounded household progress. Cooking is a game, not a real-world recipe timer.
export const INGREDIENTS={chicken:['🍗','Pollo','Chicken'],rice:['🍚','Arroz','Rice'],plantain:['🍌','Plátano','Plantain'],yam:['🥔','Ñame','Yam'],corn:['🌽','Maíz','Corn'],culantro:['🌿','Culantro','Culantro'],pepper:['🫑','Pimentón','Sweet pepper'],carrot:['🥕','Zanahoria','Carrot'],oil:['🫙','Aceite','Oil']};
export const RECIPES=[
 {id:'sancocho',icon:'🍲',es:'Sancocho panameño',en:'Panamanian sancocho',ingredients:['chicken','yam','corn','culantro'],prep:['🚿 Lavar los vegetales','🚿 Wash the vegetables'],cut:['🔪 Cortar ñame y maíz','🔪 Cut yam and corn'],cook:['🥘 Cocer a fuego lento','🥘 Simmer the soup'],seconds:8},
 {id:'arroz',icon:'🍛',es:'Arroz con pollo',en:'Arroz con pollo',ingredients:['chicken','rice','pepper','carrot'],prep:['🚿 Lavar arroz y vegetales','🚿 Rinse rice and vegetables'],cut:['🔪 Picar los vegetales','🔪 Chop the vegetables'],cook:['🥘 Cocinar y mezclar','🥘 Cook and stir'],seconds:7},
 {id:'patacones',icon:'🍌',es:'Patacones doraditos',en:'Golden patacones',ingredients:['plantain','oil'],prep:['🍌 Pelar los plátanos','🍌 Peel the plantains'],cut:['🔪 Cortar los plátanos','🔪 Slice the plantains'],cook:['🍳 Freír, aplastar y dorar','🍳 Fry, flatten and brown'],seconds:6}
];
const count=(x,max=9999)=>Math.min(max,Math.max(0,Math.floor(Number(x)||0)));
export const recipeById=id=>RECIPES.find(r=>r.id===id);
export function normalizeHomeDay(raw,legacyPlates=0){
 const pantry=Object.fromEntries(Object.keys(INGREDIENTS).map(k=>[k,raw?.pantry?count(raw.pantry[k],12):4]));
 const cooking=recipeById(raw?.cooking?.id)?{id:raw.cooking.id,stage:count(raw.cooking.stage,4),added:[...new Set((Array.isArray(raw.cooking.added)?raw.cooking.added:[]).filter(k=>recipeById(raw.cooking.id).ingredients.includes(k)))],work:count(raw.cooking.work,4)}:null;
 return {pantry,cooking,meals:(Array.isArray(raw?.meals)?raw.meals:Array(count(legacyPlates,20)).fill('arroz')).filter(recipeById).slice(0,20),carrying:recipeById(raw?.carrying)?raw.carrying:null,eaten:count(raw?.eaten),swims:count(raw?.swims),restaurant:count(raw?.restaurant),trips:count(raw?.trips),friends:(Array.isArray(raw?.friends)?raw.friends:[]).filter(x=>['sofia','mia','lucia'].includes(x)).slice(0,3),outing:['restaurant','sanblas'].includes(raw?.outing)?raw.outing:null,arcade:{blocks:count(raw?.arcade?.blocks),monsters:count(raw?.arcade?.monsters),bowling:count(raw?.arcade?.bowling,300)}};
}
export function startRecipe(day,id){if(!recipeById(id)||day.meals.length+(day.carrying?1:0)>=20)return false;if(day.cooking)return day.cooking.id===id;day.cooking={id,stage:0,added:[],work:0};return true;}
export function addIngredient(day,key){const c=day.cooking,r=recipeById(c?.id);if(!r||c.stage!==0||!r.ingredients.includes(key)||c.added.includes(key)||day.pantry[key]<1)return false;day.pantry[key]--;c.added.push(key);if(c.added.length===r.ingredients.length){c.stage=1;c.work=0;}return true;}
export function prepRecipe(day){const c=day.cooking;if(!c||![1,2].includes(c.stage))return false;c.work++;if(c.work>=4){c.stage++;c.work=0;}return true;}
export function finishHeat(day){if(day.cooking?.stage!==3)return false;day.cooking.stage=4;return true;}
export function plateRecipe(day){if(day.cooking?.stage!==4||day.meals.length+(day.carrying?1:0)>=20)return false;day.meals.push(day.cooking.id);day.cooking=null;return true;}
export function takeMeal(day){if(day.carrying||!day.meals.length)return false;day.carrying=day.meals.shift();return true;}
export function eatMeal(day){if(!day.carrying)return false;day.carrying=null;day.eaten++;return true;}
export const inHomePool=(x,z)=>Math.abs(x)<10.1&&z< -20.5&&z> -31.5;


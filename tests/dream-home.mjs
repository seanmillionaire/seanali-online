import assert from 'node:assert/strict';
import {normalizeHomeDay,RECIPES,startRecipe,addIngredient,prepRecipe,finishHeat,plateRecipe,takeMeal,eatMeal,inHomePool} from '../games/adventure/home-activities.js';
import {normalizeMansion,homePath,homeCanWalk} from '../games/adventure/mansion-state.js';
import {createBlocks,createBowling,bowlingScore} from '../games/adventure/home-arcade.js';
for(const recipe of RECIPES){const d=normalizeHomeDay();assert(startRecipe(d,recipe.id));assert(!plateRecipe(d));assert(!finishHeat(d));assert(!addIngredient(d,'fake'));for(const k of recipe.ingredients){assert(addIngredient(d,k));assert(!addIngredient(d,k));assert.equal(d.pantry[k],3);}for(let i=0;i<8;i++)assert(prepRecipe(d));assert.equal(d.cooking.stage,3);assert(!prepRecipe(d));assert(finishHeat(d));assert(plateRecipe(d));assert(!plateRecipe(d));assert(takeMeal(d));assert(!takeMeal(d));assert.equal(d.carrying,recipe.id);assert.deepEqual(normalizeHomeDay(JSON.parse(JSON.stringify(d))),d);assert(eatMeal(d));assert(!eatMeal(d));assert.equal(d.eaten,1);}
const legacy=normalizeMansion({lot:'gorgona',stage:4,plates:2});assert.equal(legacy.day.meals.length,2);assert.deepEqual(normalizeMansion(legacy),legacy);assert.equal(normalizeHomeDay({pantry:{rice:-2},meals:['bad'],carrying:'fake'}).pantry.rice,0);
for(const [x,z]of [[-5.5,-2],[7,-7],[0,-18],[0,-24],[11,-25],[0,7]]){assert(homeCanWalk(x,z));assert(homePath({x:0,z:12},{x,z}).length,'new station reachable '+x+','+z);}assert(inHomePool(0,-24));assert(!inHomePool(11,-25));assert(!homeCanWalk(0,-36));
const b=createBlocks(()=>.5);b.piece={shape:[[1]],x:0,y:17};b.board[17]=[0,1,1,1,1,1,1,1,1,1];b.tick();assert.equal(b.lines,1);assert.equal(b.score,100);assert(b.board[0].every(x=>x===0));b.piece={shape:[[1,1],[1,1]],x:0,y:0};assert(!b.move(-1,0));b.rotate();assert(b.valid(b.piece));b.drop();assert(b.score>100);
assert.equal(bowlingScore(Array(12).fill(10)),300);assert.equal(bowlingScore(Array(21).fill(5)),150);assert.equal(bowlingScore(Array(20).fill(0)),0);
let g=createBowling();for(let i=0;i<12;i++)g.throw(10);assert(g.over);assert.equal(bowlingScore(g.rolls),300);
g=createBowling();for(let i=0;i<20;i++)g.throw(0);assert(g.over);assert.equal(g.rolls.length,20);
g=createBowling();g.throw(7);assert.equal(g.pins.filter(Boolean).length,3);g.throw(3);assert.equal(g.frame,2);assert.equal(g.pins.filter(Boolean).length,10);
console.log('PASS 3 complete recipes, pantry costs, no duplicate meals, save migration, new rooms/pool reachable, block collisions/line clear, bowling strike/spare/gutter rules');

import assert from 'node:assert/strict';
import {createRenderBudget} from '../games/adventure/render-budget.js';
for(const compact of [false,true])for(const ratio of [.8,1,2,3]){
 const budget=createRenderBudget({compact,ratio});
 for(let i=0;i<500;i++){budget.sample(40,50,i*50);assert(budget.settings.pixelRatio>=1);assert(budget.settings.pixelRatio<=2);}
 assert.equal(budget.settings.tier,0);assert.equal(budget.settings.shadows,false);
 for(let i=500;i<2500;i++)budget.sample(4,16,i*16+25000);
 assert.equal(budget.settings.tier,compact?1:2);
 assert.equal(budget.settings.pixelRatio,Math.min(Math.max(1,ratio),compact?1.5:2));
}
console.log('PASS clarity floor and adaptive overload/recovery for desktop/mobile at four screen densities');

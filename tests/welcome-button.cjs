// Regression: the bilingual welcome button must always be text, not [object Object].
// Run with: node tests/welcome-button.cjs
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const src=fs.readFileSync(path.join(__dirname,'../games/adventure/app.js'),'utf8');
const start=src.indexOf('const enter=button(');
const end=src.indexOf(",'primary enter-world',arrive);",start);
assert(start!==-1&&end!==-1,'welcome Play button expression must exist');
const expression=src.slice(start+'const enter=button('.length,end);
const evaluate=new Function('returning','text','tr','return ('+expression+');');
const text=(es,en)=>({es,en});
for(const [lang,returning,expected] of [
 ['es',false,'🎮 ¡Vamos a jugar!'],
 ['en',false,'🎮 Let’s Play!'],
 ['es',true,'🎮 Volver a jugar'],
 ['en',true,'🎮 Keep Playing']
]){
 const label=evaluate(returning,text,obj=>obj[lang]);
 assert.equal(label,expected,'localized '+lang+' returning='+returning);
 assert(!label.includes('[object Object]'),'button must not stringify a locale object');
}
console.log('PASS: four welcome-button combinations render readable text');

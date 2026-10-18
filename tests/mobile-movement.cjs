const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(__dirname+'/../games/adventure/explore.js','utf8');
const buttons=[];
function button(){return {attrs:{},dataset:{},captures:new Set(),setAttribute(k,v){this.attrs[k]=v},setPointerCapture(id){this.captures.add(id)},hasPointerCapture(id){return this.captures.has(id)},releasePointerCapture(id){this.captures.delete(id);this.onlostpointercapture?.({pointerId:id})}}}
const context=vm.createContext({makeEl:()=>({setAttribute(){},append(b){buttons.push(b)}}),btn:button,say:(es,en)=>en,paused:()=>false,panel:{hidden:true},joy:{gesture(){}},keys:new Set(),stick:{x:1,z:1},knob:{style:{}},pad:button(),targetPoint:{x:1},route:[1]});
vm.runInContext(source.slice(source.indexOf('const directionPointers='),source.indexOf(" const instructions="))+source.slice(source.indexOf('function releaseDirection(e)'),source.indexOf(" document.addEventListener('keydown'")),context);
function event(id){return {pointerId:id,button:0,preventDefault(){},stopPropagation(){}}}
const up=buttons[0],right=buttons[3];
up.onpointerdown(event(1));right.onpointerdown(event(2));
assert.equal(up.attrs['aria-pressed'],'true');assert.equal(right.attrs['aria-pressed'],'true');
up.onpointercancel(event(1));assert.equal(up.attrs['aria-pressed'],'false');assert.equal(right.attrs['aria-pressed'],'true');
right.onlostpointercapture(event(2));assert.equal(right.attrs['aria-pressed'],'false');
up.onpointerdown(event(3));up.onpointerdown(event(4));up.onpointerup(event(3));
assert.equal(up.attrs['aria-pressed'],'true');up.onpointerup(event(4));assert.equal(up.attrs['aria-pressed'],'false');
context.keys.add('ArrowUp');up.onpointerdown(event(5));up.onpointerup(event(5));assert(context.keys.has('ArrowUp'),'touch release must preserve physical key');
up.onpointerdown(event(6));vm.runInContext('blur()',context);
assert.equal(up.attrs['aria-pressed'],'false');assert.equal(context.keys.size,0);assert.equal(context.stick.x,0);assert.equal(context.targetPoint,null);assert.equal(context.route.length,0);
for(const [w,h] of [[320,568],[375,667],[390,844],[430,932],[568,320],[844,390],[768,1024],[1280,800]]){
 const actionWidth=h<=520?132:Math.min(152,Math.max(130,w*.4));
 assert(8+136<w-10-actionWidth,'movement/actions separated at '+w+'x'+h);
 assert(h-(h<=520?62:79)-136>=0,'D-pad visible at '+w+'x'+h);
}
console.log('PASS pointer release/cancel/lost capture, multiple fingers, keyboard isolation, reset, eight viewport geometry models');

// Regression checks for mobile controller collisions (no browser dependency).
// Run: node tests/mobile-controls.cjs
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const css=fs.readFileSync(path.join(__dirname,'../games/adventure/mobile-play.css'),'utf8');
const js=fs.readFileSync(path.join(__dirname,'../games/adventure/explore.js'),'utf8');
const tail=css.slice(css.indexOf('/* Mobile control grid'));
assert(tail.length>2500,'mobile control-zone CSS must exist');
assert.match(tail,/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/,'four independent nav columns');
assert.match(tail,/bottom:var\(--game-dock-bottom\)!important/,'nav anchored to viewport bottom');
assert.equal((tail.match(/bottom:var\(--game-control-bottom\)!important/g)||[]).length,2,
 'joystick and actions use same bottom line, above dock');
assert.match(tail,/--game-control-bottom:calc\(var\(--game-dock-bottom\) \+ var\(--game-dock-height\) \+ 14px\)/);
assert.match(tail,/--game-control-bottom:calc\(var\(--game-dock-bottom\) \+ var\(--game-dock-height\) \+ 9px\)/);
assert.match(tail,/flex-flow:row wrap/,'action buttons wrap upward instead of overlapping dock');
assert.match(tail,/flex:0 0 calc\(\(100% - 6px\)\/2\)/,'at most two action columns');
assert.match(tail,/max-height:62px!important/,'action buttons capped for deterministic space');
assert.match(tail,/pointer:coarse/,'landscape phones wider than 780px use phone controls');
assert.match(tail,/\.explore-actions\[hidden\]/,'loading fallback hides controls');
assert.match(js,/setDockLabel\(dockMap,'🗺️'/,'map retains icon-and-caption');
assert.match(js,/setDockLabel\(dockBuild,'🏰'/,'build retains icon-and-caption');
assert.match(js,/setDockLabel\(dockFriend,companion\?'🏡':'🫶'/,'friend/return home kept');
assert.match(js,/setDockLabel\(dockMore,'☰'/,'more retained');
const dimensions=[[320,568],[375,667],[390,844],[430,932],[568,320],[667,375],[844,390],[932,430]];
for(const [w,h] of dimensions){
 const compact=h<=520,navHeight=compact?49:58,safe=compact?4:7;
 const navTop=h-safe-navHeight,controlsBottom=h-(safe+navHeight+(compact?9:14));
 const stickHeight=compact?68:Math.min(96,Math.max(80,.22*w));
 const actionHeight=compact?2*50+5:2*62+6; // worst case, four visible buttons
 assert(controlsBottom<navTop,'controls above nav at '+w+'x'+h);
 assert(controlsBottom-actionHeight>=0,'actions remain on-screen at '+w+'x'+h);
 const stickWidth=compact?68:Math.min(96,Math.max(80,.22*w));
 const actionsWidth=compact?132:Math.min(152,Math.max(130,.4*w));
 assert(12+stickWidth < w-10-actionsWidth,'joystick/action horizontally separate at '+w+'x'+h);
}
console.log('PASS mobile action/nav/joystick zones, four stacked buttons, short landscape, friend return, 8 viewport models');

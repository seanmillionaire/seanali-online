// Run: node tests/world-map.cjs
// Deterministic regression checks for the original live-position Panama world map.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
class FakeNode{
 constructor(tag){this.tag=tag;this.children=[];this.attributes={};this.listeners={};this.className='';this.hidden=false;this.style={};this.textContent='';this.classList={add:(...names)=>{this.className=[...new Set([...this.className.split(' ').filter(Boolean),...names])].join(' ');},remove:(...names)=>{this.className=this.className.split(' ').filter(n=>!names.includes(n)).join(' ');}};}
 append(...nodes){this.children.push(...nodes);for(const n of nodes)n.parent=this;}
 replaceChildren(...nodes){this.children=[];this.append(...nodes);}
 setAttribute(k,v){this.attributes[k]=String(v);if(k==='class')this.className=String(v);}
 getAttribute(k){return this.attributes[k]??null;}
 addEventListener(k,cb){(this.listeners[k]??=[]).push(cb);}
 click(){for(const cb of this.listeners.click||[])cb({preventDefault(){}});}
 keydown(key){for(const cb of this.listeners.keydown||[])cb({key,preventDefault(){}});}
 focus(){this.focused=true;}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this);}
 all(){return [this,...this.children.flatMap(n=>n.all())];}
 byClass(s){return this.all().find(n=>n.className.split(' ').includes(s));}
 byTag(tag){return this.all().filter(n=>n.tag===tag);}
}
(async()=>{
 const filename=path.join(__dirname,'../games/adventure/world-map.js');
 const src=fs.readFileSync(filename,'utf8').replace(/^export\s+/gm,'');
 const scope={document:{createElement:tag=>new FakeNode(tag),createElementNS:(_,tag)=>new FakeNode(tag)},performance:{now:()=>Date.now()}};
 vm.runInNewContext(src+'\nthis.factory=createWorldMap;',scope);
 // Guard against the mobile regression that pointed Map at the text-only list.
 const explore=fs.readFileSync(path.join(__dirname,'../games/adventure/explore.js'),'utf8');
 const styles=fs.readFileSync(path.join(__dirname,'../games/adventure/mobile-play.css'),'utf8');
 assert.match(explore,/const dockMap=btn\([^\n]*adventureMap\.open\(\)/,'Map dock opens graphical map');
 assert.doesNotMatch(explore,/const dockMap=btn\([^\n]*showDiscover\(\)/,'Map dock never routes to list');
 assert.match(styles,/body\[data-scene="explore"\] \.island-map-mini\s*\{\s*display:grid!important/,'mobile mini-map visible');
 const host=new FakeNode('div'),panel=new FakeNode('section');
 const world={x:4,z:10},islands=[{id:'islet',x:72,z:30,rx:24,rz:19,es:'Isla Mariposa',en:'Butterfly Island'}];
 const places=[{id:'pip',x:4,z:10,kind:'friend'},{id:'islet',x:72,z:30,kind:'islet'}];
 const visits=[];let opening=0;
 const map=scope.factory({host,panel,world,islands,places,language:'en',onTravel:p=>visits.push(p),onOpen:()=>opening++});
 const mini=host.byClass('island-map-mini');
 assert(mini,'mini map visible in DOM');
 const miniSvg=mini.byTag('svg')[0];
 assert(miniSvg,'mini is visual SVG, not a list');
 assert.match(miniSvg.byClass('island-map-player').getAttribute('transform'),/translate\(4 10\)/);
 mini.click();
 assert.equal(opening,1);
 assert.equal(panel.hidden,false);
 assert(panel.className.includes('island-map-open'));
 assert(panel.byClass('island-map-frame').byTag('svg').length===1,'full map with clickable islands');
 assert(panel.byClass('island-map-you-are').textContent.includes('YOU ARE HERE'));
 const placesToggle=panel.byClass('island-map-places');
 assert(placesToggle,'secondary destination list exists');
 assert(!placesToggle.attributes.open,'list is collapsed by default');
 world.x=72;world.z=30;map.update(true,Math.PI/2);
 const fullSvg=panel.byClass('island-map-frame').byTag('svg')[0];
 assert.match(fullSvg.byClass('island-map-player').getAttribute('transform'),/translate\(72 30\)/);
 assert.match(miniSvg.byClass('island-map-player').getAttribute('transform'),/translate\(72 30\)/);
 assert(fullSvg.byClass('island-map-player').all().some(n=>String(n.getAttribute('transform')).includes('rotate(90)')),'pointer heading turns');
 assert(panel.byClass('island-map-you-are').textContent.includes('Butterfly Island'));
 const zoom=panel.byClass('island-map-controls').children;
 assert.equal(zoom.length,4);
 zoom[1].click();assert(!fullSvg.getAttribute('viewBox').includes('-175 -155 350 310'),'zoom in works');
 zoom[2].click();assert(fullSvg.getAttribute('viewBox').includes('72'),'center on player works');
 zoom[3].click();assert.equal(fullSvg.getAttribute('viewBox'),'-175 -155 350 310','all islands works');
 const island=fullSvg.all().find(n=>n.getAttribute('data-island')==='islet');
 assert(island,'clickable island exists');
 island.click();assert.equal(visits.length,1);assert.equal(visits[0].id,'islet');
 assert.equal(panel.hidden,true,'tap island closes map for navigation');
 assert.equal(world.x,72,'map itself never teleports or corrupts player state');
 map.dispose();assert(!host.children.includes(mini),'mini cleans up on exit');
 console.log('PASS world map: mini-map pointer, full map, live location, heading, zoom, recenter, collapsible places, travel, cleanup');
})().catch(e=>{console.error(e);process.exitCode=1});

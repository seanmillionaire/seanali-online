const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
(async()=>{
 const T=await import('../games/adventure/vendor/three.module.min.js');
 const read=f=>fs.readFileSync(__dirname+'/../games/adventure/'+f,'utf8').replace(/^import .*$/gm,'').replaceAll('export ','');
 const elements=[];const element=()=>({style:{},hidden:false,children:[],setAttribute(k,v){this[k]=v},append(n){this.children.push(n)},remove(){this.removed=true},getContext(){return {fillRect(){},fillText(){}}}});
 const document={createElement(){const e=element();elements.push(e);return e;}};
 const host={...element(),classList:{toggle(){},remove(){}}},scene=new T.Scene();
 const state={lang:'en',world:{city:{cruise:{active:false,tickets:0,completed:0,distance:0}}}};
 const ctx=vm.createContext({T,document,host,scene,state,assert,coinBalance:()=>100,height:()=>0,save(){},refresh(){},joy:{effect(){},gesture(){}},tell(){},mat:c=>new T.MeshBasicMaterial({color:c}),box:new T.BoxGeometry(),ball:new T.SphereGeometry(1,8,6),cylinder:new T.CylinderGeometry(1,1,1,8),make:(geo,m,x,y,z,sx,sy,sz,parent)=>{const n=new T.Mesh(geo,m);n.position.set(x,y,z);n.scale.set(sx,sy,sz);parent.add(n);return n;}});
 vm.runInContext(read('cruise-route.js')+'\n'+read('canal-cruise.js')+'\nvar ride=createCanalCruise({T,scene,host,state,make,mat,box,ball,cylinder,height,save,refresh,joy,tell});',ctx);
 const run=s=>vm.runInContext(s,ctx);
 assert.equal(run('ride.board()'),true);assert.equal(run('ride.board()'),false);
 run('var p=ride.update(.1,true)');assert.ok(Math.abs(run('state.world.city.cruise.distance')-.7)<1e-9);
 const controls=elements.find(e=>e['aria-label']==='Top deck games');assert(controls&&!controls.hidden);assert.equal(controls.children.length,2);
 controls.children[1].onclick();run('p=ride.update(.1,true)');assert.equal(run('p.game'),'dance');
 run('var before=state.world.city.cruise.distance;ride.update(.1,false)');assert.equal(run('state.world.city.cruise.distance'),run('before'));
 // Exercise the real friend placement branch with every species through a turn.
 const src=read('wildlife-friends.js'),start=src.indexOf('if(cruise?.active){'),end=src.indexOf('  const following=friends.companion;',start);
 const nodes=new Map(['pip','dori','mila','ollie','luna','kai'].map(id=>[id,{f:{id},g:new T.Group(),moving:[],other:{walkers:[]},home:{x:0,z:0}}]));
 ctx.nodes=nodes;ctx.labels=Array.from({length:6},()=>({hidden:false}));ctx.height=()=>0;
 run('var placeFriends=function(cruise){'+src.slice(start,end)+'};placeFriends(p);');
 for(const n of nodes.values()){assert(n.onCruise&&n.g.visible);assert(n.g.position.y>8.6);assert(n.g.position.distanceTo(new T.Vector3(run('p.x'),run('p.y'),run('p.z')))<8);}
 assert(ctx.labels.every(l=>l.hidden));
 run('state.world.city.cruise.distance=CRUISE_LENGTH-.01;p=ride.update(.1,true);placeFriends(p)');
 assert.equal(run('p.active'),false);assert.equal(run('state.world.city.cruise.completed'),1);assert(controls.hidden);
 for(const n of nodes.values())assert.equal(n.onCruise,false);
 run('ride.dispose()');assert(controls.removed);assert.equal(scene.children.length,0);
 console.log('PASS group boarding, six friends on deck, game switching, moving ship, pause, 10Hz timing, return and cleanup');
})().catch(e=>{console.error(e);process.exitCode=1});

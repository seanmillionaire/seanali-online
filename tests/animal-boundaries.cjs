const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm');
(async()=>{
 const {animalClear,recoverAnimal,animalStep,waterFriend}=await import('../games/adventure/animal-boundaries.js');
 const {MAINLAND_ROADS,inWater}=await import('../games/adventure/explore-state.js');
 for(const id of ['pip','dori']){
  assert(animalClear(id,8,24,3.3),'safe recovery home');
  for(const points of Object.values(MAINLAND_ROADS))for(const [x,z]of points){
   assert.equal(animalClear(id,x,z),false,'road must be blocked');
   const p=recoverAnimal(id,x,z,3.3);assert(animalClear(id,p.x,p.z,3.3),'recover old road saves');
   const next=animalStep(id,p.x,p.z,x,z,3.3);assert(animalClear(id,next.x,next.z,3.3),'ride cannot reach road');
  }
  assert.equal(animalClear(id,-100,-74),false,'city');
 }
 assert.equal(animalClear('dori',4,9),false,'dolphin cannot follow onto beach');
 assert.equal(waterFriend('kai'),false);
 // Execute the actual friend update while calling/following Angelique inland.
 const source=fs.readFileSync(__dirname+'/../games/adventure/wildlife-friends.js','utf8');
 const update=source.slice(source.indexOf(' function update(dt,active,'),source.indexOf('\n function ride(id,'));
 const T=await import('../games/adventure/vendor/three.module.min.js');
 const list=['pip','dori'].map(id=>({id})),nodes=new Map(list.map(f=>[f.id,{f,g:new T.Group(),home:{x:8,z:24},moving:[],other:{},cheer:0}]));
 const context=vm.createContext({document:{hidden:false},motion:()=>true,time:0,nodes,islandFriends:list,friends:{companion:'dori',called:['pip'],completed:[]},s:{x:-100,z:-74,flight:10},mounted:null,height:()=>0,waterFriend,animalClear,recoverAnimal,animalStep,camera:new T.PerspectiveCamera(),temp:new T.Vector3(),labels:[{},{}],directory:{},say:(a,b)=>b});
 vm.runInContext(update,context);
 for(const mode of ['walk','house','fly','boat','swim']){
  vm.runInContext(`for(let i=0;i<120;i++)update(.1,true,{mode:'${mode}',inside:${mode==='house'},roomPosition:{x:-100,y:3,z:-74}})`,context);
  for(const [id,n]of nodes){assert(animalClear(id,n.g.position.x,n.g.position.z));if(id==='dori'){assert(inWater(n.g.position.x,n.g.position.z));assert(n.g.position.y<1);}}
 }
 console.log('PASS water-only dolphin, beach turtle road/city exclusion, call/follow/house/flight, road-save recovery and mounted boundary steps');
})().catch(e=>{console.error(e);process.exitCode=1});

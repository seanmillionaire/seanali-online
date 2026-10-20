const assert=require('node:assert/strict'),path=require('node:path'),{pathToFileURL}=require('node:url');
(async()=>{
 const base=path.resolve(__dirname,'../games/adventure');
 const T=await import(pathToFileURL(path.join(base,'vendor/three.module.min.js')));
 const {createNaturalTrees}=await import(pathToFileURL(path.join(base,'natural-trees.js')));
 const scene=new T.Scene(),geometry=g=>g,mat=(color,options)=>new T.MeshStandardMaterial({color,...options});
 const make=(g,m,x,y,z,sx,sy,sz,parent=scene)=>{const mesh=new T.Mesh(g,m);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;};
 const forest=createNaturalTrees({T,scene,geometry,mat,make,height:()=>0});
 const palm=forest.addTree('palm',0,0),pine=forest.addTree('pine',30,0,1.4),natural=forest.addTree('natural',50,0),banana=forest.addTree('banana',70,0);
 assert.equal(palm.crown.geometry.type,'BufferGeometry');assert(palm.crown.geometry.index,'folded leaves share vertices for smooth shading');assert(palm.crown.geometry.attributes.color,'leaf midribs carry botanical color detail');
 assert.equal(palm.root.children.find(o=>o.isInstancedMesh).count,15,'palm bark rings');
 assert(pine.tip.y*pine.scale>10,'large pine silhouette');
 assert(banana.crown.position.y<4,'banana plants remain distinct from tall trees');
 for(const tree of [palm,pine,natural,banana])assert([...tree.crown.geometry.attributes.position.array].every(Number.isFinite));
 forest.focus(palm.root.position.x,palm.root.position.z,new T.Vector3(palm.root.position.x,24,palm.root.position.z+32));for(let i=0;i<20;i++)forest.update(i*.016);
 assert(palm.crown.material.opacity<.3,'nearby foliage fades for the player camera');
 assert(natural.crown.material.opacity>.95,'distant foliage stays solid');
 console.log('PASS detailed fronds, instanced trunk rings, large pines, banana plants, shared valid foliage geometry and camera visibility');
})().catch(e=>{console.error(e);process.exit(1)});

const assert=require('node:assert/strict'),fs=require('fs');
(async()=>{
 const {locationLabel}=await import('../games/adventure/location-label.js');
 const {worldIslands}=await import('../games/adventure/explore-state.js');
 const {cruisePose,CRUISE_LENGTH}=await import('../games/adventure/cruise-route.js');
 for(const p of worldIslands.filter(p=>!p.guna)){
  assert(locationLabel(p.x,p.z,'en').includes(p.en),p.id+' English location');
  assert(locationLabel(p.x,p.z,'es').includes(p.es),p.id+' Spanish location');
 }
 assert(locationLabel(4,9,'en').includes('Gorgona'));
 assert(locationLabel(-80,45,'en').includes('Volcán Town'));
 assert(locationLabel(-44,-74,'en',{cruising:true}).includes('Panama Canal'));
 assert.equal(locationLabel(4,9,'en',{tower:true}),'🗼 Lighthouse · Gorgona Beach');
 assert.equal(locationLabel(4,9,'en',{interior:'Beach Cottage'}),'🏠 Beach Cottage');
 const labels=new Set();for(let i=0;i<=500;i++){const p=cruisePose(CRUISE_LENGTH*i/500),label=locationLabel(p.x,p.z,'en',{cruising:true});assert(label&&!label.includes('undefined'));labels.add(label);}
 assert(labels.size>=5,'tour updates location along its route');
 const source=fs.readFileSync(__dirname+'/../games/adventure/explore.js','utf8');
 assert.equal((source.match(/setText\(title,/g)||[]).length,1,'travel modes cannot overwrite the location bar');
 assert(source.includes('setText(title,locationLabel(s.x,s.z,state.lang,{cruising,'));
 console.log('PASS named locations in both languages, Gorgona, canal, towns, interiors, 501 cruise positions and one shared location bar across travel modes');
})().catch(e=>{console.error(e);process.exitCode=1});

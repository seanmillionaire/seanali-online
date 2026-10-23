// Everyday regional wardrobes, not a single appearance assigned to an ethnicity.
export function residentStyle(x,z,index=0){
 const Caribbean=z< -170&&x<210,highland=x< -260,guna=z< -300&&x>210,city=x>285&&z>-130&&z<25;
 const region=Caribbean?'Caribbean':highland?'Chiriquí':guna?'Guna Yala':city?'Panamá City':'Pacific coast';
 const colors=Caribbean?['#dba836','#249e9c','#ce694e','#e7d6ad']:highland?['#689482','#b47855','#548496','#b24b62']:guna?['#c44c59','#e0b342','#427b9c','#785682']:city?['#d7c4a4','#577c9e','#af5765','#4a8976']:['#dfb957','#579c9a','#bf6b55','#e6d5b2'];
 const n=Math.abs(index)%24,elder=city&&n>=22;
 return {region,index,gender:n%2?'woman':'man',ageGroup:elder?'elder':'adult',mobilityAid:elder?(n===22?'cane':'walker'):null,community:city?['Chinese Panamanian','Colombian Panamanian','Panamanian'][Math.floor(n/2)%3]:region,skinTone:Caribbean?4+index%3:guna?2+index%3:index%7,outfitColor:colors[index%colors.length],pantsColor:['#40546b','#6b5945','#d1bc92'][index%3],beach:!city&&!highland,beachHair:['short','curls','bun','long'][index%4],beachWear:index%4===2?'sundress':'tee-shorts'};
}


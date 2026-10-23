// Local +Z is forward. Each model's actual tire bottoms and low body edges
// share one road-following pose, independent of the direction of travel.
export const VEHICLE_GROUND_PROFILES={
 utility:{track:1,rear:-1.38,front:1.38,tireBottom:0,halfWidth:1.12,halfLength:2.3,bodyBottom:.44},
 jeep:{track:1.03,rear:-1.18,front:1.30,tireBottom:0,halfWidth:1.12,halfLength:2.15,bodyBottom:.47},
 supercar:{track:1.10,rear:-1.35,front:1.40,tireBottom:-.69,halfWidth:1.16,halfLength:2.30,bodyBottom:-.35},
 sedan:{track:.83,rear:-1.02,front:1.04,tireBottom:.01,halfWidth:.84,halfLength:1.72,bodyBottom:.44},
 bus:{track:1.22,rear:-2.30,front:2.43,tireBottom:0,halfWidth:1.20,halfLength:3.82,bodyBottom:.30}
};
for(const p of Object.values(VEHICLE_GROUND_PROFILES)){
 p.contacts=[-p.track,p.track].flatMap(x=>[p.rear,p.front].map(z=>[x,p.tireBottom,z]));
 p.underside=[-p.halfWidth,0,p.halfWidth].flatMap(x=>[-p.halfLength,0,p.halfLength].map(z=>[x,p.bodyBottom,z]));
 p.support=[...p.contacts,...p.underside];
}
export function vehicleGroundPose(x,z,heading,surface,profile=VEHICLE_GROUND_PROFILES.sedan){
 const h=Number.isFinite(heading)?heading:0,c=Math.cos(h),s=Math.sin(h),p=profile;
 const sample=(across,along)=>surface(x+c*across+s*along,z-s*across+c*along);
 const lf=sample(-p.track,p.front),rf=sample(p.track,p.front),lr=sample(-p.track,p.rear),rr=sample(p.track,p.rear);
 const across=(rf+rr-lf-lr)/(4*p.track),along=(lf+rf-lr-rr)/(2*(p.front-p.rear));
 const pitch=-Math.atan(along),cp=Math.cos(pitch),sp=Math.sin(pitch),roll=Math.atan(across*cp),cr=Math.cos(roll),sr=Math.sin(roll);
 // YXZ: yaw in the world, then pitch and bank in the vehicle's own axes.
 const right=[c*cr+s*sp*sr,cp*sr,-s*cr+c*sp*sr],up=[-c*sr+s*sp*cr,cp*cr,s*sr+c*sp*cr],forward=[s*cp,-sp,c*cp];
 let y=-Infinity;
 for(const [px,py,pz] of p.support){
  const dx=right[0]*px+up[0]*py+forward[0]*pz,dy=right[1]*px+up[1]*py+forward[1]*pz,dz=right[2]*px+up[2]*py+forward[2]*pz;
  y=Math.max(y,surface(x+dx,z+dz)-dy+.025);
 }
 return {x,y,z,heading:h,pitch,roll};
}
export function placeGroundVehicle(root,pose,surface,kind='sedan'){
 const p=vehicleGroundPose(pose.x,pose.z,pose.heading,surface,VEHICLE_GROUND_PROFILES[kind]);
 root.position.set(p.x,p.y,p.z);root.rotation.set(p.pitch,p.heading,p.roll,'YXZ');
 return p;
}


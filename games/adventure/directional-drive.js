// A movement command means "go there" in world/screen directions, not gas/steering.
export function driveByDirection(car,dx,dz,previousSpeed,dt,fast,canDrive,facingHeading=null){
 const length=Math.hypot(dx,dz),force=Math.min(1,length);
 if(force<=.12||dt<=0)return 0;
 const vx=dx/length,vz=dz/length,desired=(fast?52:32)*force;
 const heading=facingHeading??Math.atan2(vx,vz);
 // Hold the control to build speed; short taps stay gentle instead of jumping to cruise.
 const change=desired-previousSpeed,rate=change>=0?(fast?19:12):40;
 const speed=previousSpeed+Math.sign(change)*Math.min(Math.abs(change),rate*Math.min(.1,dt));
 const distance=speed*dt,steps=Math.max(1,Math.ceil(distance/.15)),step=distance/steps;
 for(let i=0;i<steps;i++){
  const nx=car.x+vx*step,nz=car.z+vz*step;
  if(!canDrive(nx,nz,heading,car))return 0;
  car.heading=heading;
  car.x=nx;car.z=nz;
 }
 return speed;
}

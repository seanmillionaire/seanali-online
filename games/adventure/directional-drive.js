export const DRIVE_SPEED={normal:32,fast:78,normalOverdrive:70,fastOverdrive:112,normalAcceleration:12,fastAcceleration:42};
const overdrives=new WeakMap();
export const driveOverdrive=car=>overdrives.get(car)?.active===true;
export const resetOverdrive=car=>overdrives.delete(car);
// A movement command means "go there" in world/screen directions, not gas/steering.
export function driveByDirection(car,dx,dz,previousSpeed,dt,fast,canDrive,facingHeading=null,secretGear=false){
 dt=Math.min(Math.max(0,dt),1/30);
 const length=Math.hypot(dx,dz),force=Math.min(1,length);
 if(force<=.12||dt<=0){resetOverdrive(car);return 0;}
 const vx=dx/length,vz=dz/length,base=fast?DRIVE_SPEED.fast:DRIVE_SPEED.normal;
 const forward=vx*Math.sin(car.heading||0)+vz*Math.cos(car.heading||0)>.7;
 let boost=overdrives.get(car)||{held:0,active:false};
 if(!secretGear||force<.98||!forward||previousSpeed<base*.94){boost={held:0,active:false};}
 else{boost.held+=Math.min(.1,dt);boost.active=boost.held>=2.5;}
 overdrives.set(car,boost);
 const desired=(boost.active?(fast?DRIVE_SPEED.fastOverdrive:DRIVE_SPEED.normalOverdrive):base)*force;
 const heading=facingHeading??Math.atan2(vx,vz);
 // Hold the control to build speed; short taps stay gentle instead of jumping to cruise.
 const change=desired-previousSpeed,rate=change>=0?(boost.active?(fast?30:16):fast?DRIVE_SPEED.fastAcceleration:DRIVE_SPEED.normalAcceleration):(fast?60:40);
 const speed=previousSpeed+Math.sign(change)*Math.min(Math.abs(change),rate*Math.min(.1,dt));
 const distance=speed*dt,steps=Math.max(1,Math.ceil(distance/.15)),step=distance/steps;
 for(let i=0;i<steps;i++){
  const nx=car.x+vx*step,nz=car.z+vz*step;
  if(!canDrive(nx,nz,heading,car)){resetOverdrive(car);return 0;}
  car.heading=heading;
  car.x=nx;car.z=nz;
 }
 return speed;
}


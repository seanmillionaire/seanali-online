// A movement command means "go there" in world/screen directions, not gas/steering.
export function driveByDirection(car,dx,dz,previousSpeed,dt,fast,canDrive){
 const length=Math.hypot(dx,dz),force=Math.min(1,length);
 if(force<=.12||dt<=0)return 0;
 const vx=dx/length,vz=dz/length,desired=(fast?27:15)*force;
 car.heading=Math.atan2(vx,vz);
 const speed=previousSpeed+(desired-previousSpeed)*Math.min(1,dt*7);
 const nx=car.x+vx*speed*dt,nz=car.z+vz*speed*dt;
 if(!canDrive(nx,nz))return 0;
 car.x=nx;car.z=nz;return speed;
}

// A chase view follows the car heading, including after reversing direction.
export function drivingCameraPose(x,y,z,heading,phone=false){const back=phone?19:17,up=phone?12:10,lead=5;return {x:x-Math.sin(heading)*back,y:y+up,z:z-Math.cos(heading)*back,lookX:x+Math.sin(heading)*lead,lookY:y+1.4,lookZ:z+Math.cos(heading)*lead};}

// Screen-relative chase controls: up goes forward, down reverses, left/right steer.
export function chaseDriveInput(dx,dz,heading,dt){const steer=Math.max(-1,Math.min(1,dx));let throttle=Math.max(-1,Math.min(1,-dz));if(Math.abs(throttle)<.12&&Math.abs(steer)>.12)throttle=.32;const next=heading-steer*Math.sign(throttle||1)*Math.min(.1,dt)*1.7;return {x:Math.sin(next)*throttle,z:Math.cos(next)*throttle,heading:next};}

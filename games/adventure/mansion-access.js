// Exterior walk surfaces share the actual stair, landing and roof dimensions.
export const MANSION_ROOF_HEIGHT=8.19;
export function mansionAccess(dx,dz,rooftop=false){
 if(rooftop)return Math.abs(dx)<11.4&&Math.abs(dz)<11?{height:MANSION_ROOF_HEIGHT,roof:true}:null;
 if(dx> -19.1&&dx< -15.7&&dz> -1.9&&dz<=14)return {height:4.2*Math.max(0,Math.min(1,(12-dz)/12)),stairs:true};
 if(dx> -19.1&&dx< -15.7&&dz>=14&&dz<19)return {ramp:(dz-14)/5,stairs:true};
 if(dx> -16&&dx< -11.4&&dz> -1.9&&dz<-.1)return {height:4.2+.35*Math.max(0,Math.min(1,(dx+14)/2)),stairs:true};
 return null;
}

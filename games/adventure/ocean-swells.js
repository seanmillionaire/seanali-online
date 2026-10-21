// Broad sets rise offshore, then settle; ports, freshwater and shorelines stay calm.
export const SWELL_RADIUS=115;
export function offshoreExposure(x,z,shoreDistance,freshwater=false){
 const smooth=(a,b,v)=>{const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t);};
 return freshwater?0:smooth(35,60,shoreDistance)*smooth(110,165,Math.hypot(x-360,z+50));
}
export function swellSet(time){return .35+2.5*Math.max(0,Math.sin(time*.045))**4;}
export function swellHeight(x,z,time,focus,shoreDistance,freshwater=false){
 const d=Math.hypot(x-focus.x,-z-focus.y),t=Math.max(0,Math.min(1,(d-85)/30)),fade=1-t*t*(3-2*t),a=Math.sin(x*.24-z*.11-time*1.85),b=Math.sin(x*-.11-z*.29-time*1.43);
 return swellSet(time)*(a*.8+b*.38+Math.max(0,a)**5*.38)*offshoreExposure(x,z,shoreDistance,freshwater)*fade;
}
export const SWELL_GLSL=`
 uniform vec2 oceanFocus;uniform float swellPass;
 float smoothExposure(vec2 p){
  vec2 world=vec2(p.x,-p.y);
  vec4 coast=texture2D(coastMap,(world+vec2(900.,760.))/vec2(1800.,1520.));
  return smoothstep(35.,60.,coast.r*64.)*(1.-step(.1,coast.g))*smoothstep(110.,165.,length(world-vec2(360.,-50.)));
 }
 float patchMask(vec2 p){return 1.-smoothstep(85.,115.,length(p-oceanFocus));}
 float largeSwell(vec2 p){
  float set=.35+2.5*pow(max(0.,sin(time*.045)),4.);
  float a=sin(p.x*.24+p.y*.11-time*1.85);
  float b=sin(p.x*-.11+p.y*.29-time*1.43);
  return set*(a*.8+b*.38+pow(max(0.,a),5.)*.38);
 }
`;

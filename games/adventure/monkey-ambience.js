// Short, naturally pitched field-recorded calls with quiet gaps between them.
export function createMonkeyAmbience(joy){
 let wait=0,source=null,call=0;
 function stop(){if(source?.stop){try{source.stop();}catch{}}source=null;}
 return {update(dt,near,active){
  if(!near||!active){stop();wait=0;return;}
  wait-=Math.max(0,Math.min(dt,.1));if(wait>0)return;
  stop();source=joy.recordedSound('howler-monkey',{volume:.32,rate:1,offset:(call%3)*7,duration:6,defer:false});
  if(source){call++;wait=20+(call%3)*4;}else wait=1;
 },dispose:stop};
}

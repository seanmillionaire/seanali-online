// Thumb-relative input stays saturated beyond the ring. Native pointer capture
// is backed by window listeners so leaving the pad never ends a held gesture.
export function joystickVector(dx,dz,radius){
 const distance=Math.hypot(dx,dz),length=distance/Math.max(1,radius);
 if(length<=.1)return {x:0,z:0};
 let x=dx/distance,z=dz/distance;
 // A soft cardinal guide filters thumb wobble without blocking deliberate turns.
 const major=Math.max(Math.abs(x),Math.abs(z)),minor=Math.min(Math.abs(x),Math.abs(z)),ratio=minor/major;
 const t=Math.max(0,Math.min(1,(ratio-.14)/.18)),guide=t*t*(3-2*t);
 if(Math.abs(x)>Math.abs(z))z*=guide;else x*=guide;
 const norm=Math.hypot(x,z),strength=Math.min(1,(length-.1)/.7)**.8;
 return {x:x/norm*strength,z:z/norm*strength};
}
export function createTouchJoystick({pad,knob,onStart=()=>{},enabled=()=>true,eventTarget=window}){
 let pointer=null,origin=null,radius=44,target={x:0,z:0},current={x:0,z:0};
 function paint(){knob.style.transform=`translate(${current.x*radius*.65}px,${current.z*radius*.65}px)`;}
 function reset(){const id=pointer;pointer=null;origin=null;target={x:0,z:0};current={x:0,z:0};knob.style.transform='';pad.classList.remove('stick-held');if(id!==null&&pad.hasPointerCapture?.(id))pad.releasePointerCapture(id);}
 function move(e){
  if(e.pointerId!==pointer)return;
  if(!enabled()){reset();return;}
  e.preventDefault();
  if(e.pointerType==='mouse'&&e.buttons===0){reset();return;}
  target=joystickVector(e.clientX-origin.x,e.clientY-origin.z,radius);
 }
 function start(e){
  if(e.button!==0||pointer!==null||!enabled())return;
  e.preventDefault();e.stopPropagation();
  const rect=pad.getBoundingClientRect();radius=Math.max(30,Math.min(rect.width,rect.height)*.40);
  pointer=e.pointerId;origin={x:e.clientX,z:e.clientY};target={x:0,z:0};current={x:0,z:0};pad.classList.add('stick-held');
  // Some tablet browsers temporarily lose capture. Keep the gesture alive via
  // global events until that same finger lifts, is cancelled, or the game blurs.
  try{pad.setPointerCapture(e.pointerId);}catch{}
  onStart();
 }
 function end(e){if(e.pointerId===pointer)reset();}
 function context(e){e.preventDefault();}
 pad.addEventListener('pointerdown',start);
 pad.addEventListener('contextmenu',context);
 eventTarget.addEventListener('pointermove',move,{capture:true,passive:false});
 eventTarget.addEventListener('pointerup',end,true);
 eventTarget.addEventListener('pointercancel',end,true);
 return {reset,read(dt){
  if(pointer===null||!enabled()){if(pointer!==null)reset();return {x:0,z:0};}
  const ease=1-Math.exp(-Math.max(0,dt)*22);
  current.x+=(target.x-current.x)*ease;current.z+=(target.z-current.z)*ease;
  if(!target.x&&!target.z)current={x:0,z:0};
  paint();return {...current};
 },dispose(){reset();pad.removeEventListener('pointerdown',start);pad.removeEventListener('contextmenu',context);eventTarget.removeEventListener('pointermove',move,true);eventTarget.removeEventListener('pointerup',end,true);eventTarget.removeEventListener('pointercancel',end,true);}};
}


// Pure bounded arrival policy: audio failure never traps the player.
export function arrivalSequence({elapsed,story,motion,audio,heard=false}){
 const playing=audio?.kind==='morning'&&audio.playing;
 heard=heard||playing;
 const cameraDuration=motion?(story?8:1.2):.1;
 const progress=Math.min(1,elapsed/cameraDuration);
 const waiting=story&&elapsed<300&&!audio?.error&&(playing||(!heard&&elapsed<8)||audio?.pending&&elapsed<8);
 return {heard,progress,done:progress>=1&&!waiting};
}

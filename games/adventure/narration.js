export function preferredVoice(voices,lang,uri=''){
 const matches=voices.filter(v=>v.lang.toLowerCase().startsWith(lang));
 const score=v=>(/premium|enhanced|natural|neural/i.test(v.name)?100:0)+(/siri|google|samantha|monica|paulina|ava/i.test(v.name)?30:0)+(v.localService?20:0)+(v.default?5:0);
 return matches.find(v=>v.voiceURI===uri)||matches.sort((a,b)=>score(b)-score(a))[0]||null;
}
export function createNarrator({getState,joy,environment=globalThis}){
 return function speak(message,{interrupt=true,manual=false}={}){
  const state=getState(),synth=environment.speechSynthesis;
  if((joy.morningExclusive&&!manual)||(!state.narration&&!manual)||!state.sound||environment.document?.hidden||!synth)return false;
  try{if(!interrupt&&(synth.speaking||synth.pending))return false;if(interrupt)synth.cancel();joy.duck?.();const text=typeof message==='string'?message:message?.[state.lang]||'',name=state.playerName||'Angelique';
   const words=(text.includes('Angelique')?text.replaceAll('Angelique',name):name+', '+text).replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu,'');
   const u=new environment.SpeechSynthesisUtterance(words);u.lang=state.lang==='es'?'es-PA':'en-US';const voices=synth.getVoices();u.voice=preferredVoice(voices,state.lang,state.voiceURI);u.rate=.96;synth.speak(u);return true;
  }catch{return false;}
 };
}

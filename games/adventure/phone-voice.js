// Listening only begins after the player presses the microphone. No recording is stored.
export function voiceCommand(text){
 const s=text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 for(const [key,words]of Object.entries({close:['close','cerrar','guardar'],map:['map','mapa'],mission:['mission','mision','next','siguiente'],bag:['bag','backpack','mochila'],work:['work','trabajo','recycle','reciclar','limpieza'],weather:['weather','tiempo','clima'],phone:['phone','telefono'],help:['help','ayuda']}))if(words.some(w=>new RegExp('\\b'+w+'\\b').test(s)))return key;
 return null;
}
export function createPhoneVoice({state,save,speak,shell,panel,actions}){
 let recognition=null,removeVoiceListener=()=>{};const es=()=>state.lang==='es',say=(a,b)=>es()?a:b;
 function stop(){recognition?.abort();recognition=null;}
 function open(){stop();removeVoiceListener();shell(say('🎙️ Habla con Pip','🎙️ Talk to Pip'));
 const add=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;panel.append(e);return e;};
 const label=add('label',say('¿Cómo te llamas?','What is your name?')),name=document.createElement('input');name.value=state.playerName||'Angelique';name.maxLength=24;name.autocomplete='given-name';name.setAttribute('aria-label',label.textContent);label.append(name);
 const saveName=add('button',say('✨ Guardar mi nombre','✨ Save my name'));saveName.className='chapter-action';saveName.onclick=()=>{state.playerName=name.value.replace(/[<>\r\n]/g,'').trim().slice(0,24)||'Angelique';save();speak(say('¡Vamos a explorar juntos!','Let’s explore together!'),{manual:true});};
 const narrate=add('button',say('🔊 Narración: ','🔊 Narration: ')+(state.narration===false?'—':'✓'));narrate.className='chapter-action';narrate.onclick=()=>{state.narration=state.narration===false;save();open();};
 const voiceLabel=add('label',say('Voz de Pip','Pip’s voice')),voices=document.createElement('select');voices.setAttribute('aria-label',voiceLabel.textContent);voiceLabel.append(voices);
 const loadVoices=()=>{voices.replaceChildren();const auto=document.createElement('option');auto.value='';auto.textContent=say('✨ Mejor voz disponible','✨ Best available voice');voices.append(auto);for(const v of (window.speechSynthesis?.getVoices()||[]).filter(v=>v.lang.startsWith(state.lang))){const option=document.createElement('option');option.value=v.voiceURI;option.textContent=v.name+(v.localService?' · ⚡':' · ☁️');voices.append(option);}voices.value=state.voiceURI||'';};loadVoices();window.speechSynthesis?.addEventListener('voiceschanged',loadVoices);removeVoiceListener=()=>window.speechSynthesis?.removeEventListener('voiceschanged',loadVoices);
 voices.onchange=()=>{state.voiceURI=voices.value;save();speak(say('Soy Pip. ¡Vamos a descubrir Panamá!','I’m Pip. Let’s discover Panama!'),{manual:true});};
 const preview=add('button',say('▶️ Escuchar voz','▶️ Preview voice'));preview.onclick=()=>speak(say('Soy Pip. ¡Vamos a descubrir Panamá!','I’m Pip. Let’s discover Panama!'),{manual:true});
 add('p',say('Di: mapa, siguiente misión, mochila, trabajo o clima.','Say: map, next mission, bag, work, or weather.'));
 const status=add('p','');status.setAttribute('role','status');
 const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
 const mic=add('button',say('🎙️ Toca para hablar','🎙️ Tap to speak'));mic.className='chapter-action';
 if(!Recognition){mic.disabled=true;status.textContent=say('Usa los dibujos abajo. Este navegador no reconoce voz.','Use the pictures below. This browser does not support voice input.');}
 else mic.onclick=()=>{if(recognition){stop();mic.textContent=say('🎙️ Toca para hablar','🎙️ Tap to speak');return;}window.speechSynthesis?.cancel();recognition=new Recognition();recognition.lang=es()?'es-PA':'en-US';recognition.continuous=false;recognition.interimResults=false;mic.textContent=say('⏹️ Dejar de escuchar','⏹️ Stop listening');status.textContent=say('Te escucho… El navegador puede usar internet para reconocer tu voz.','Listening… Your browser may use the internet to recognize speech.');recognition.onresult=e=>{const key=voiceCommand(e.results[0][0].transcript);if(key&&actions[key]){stop();actions[key]();}else status.textContent=say('Prueba «mapa» o toca un dibujo.','Try “map” or tap a picture.');};recognition.onerror=()=>{status.textContent=say('No pude escuchar. Toca un dibujo o vuelve a intentar.','Could not listen. Tap a picture or try again.');};recognition.onend=()=>{recognition=null;mic.textContent=say('🎙️ Toca para hablar','🎙️ Tap to speak');};try{recognition.start();}catch{stop();status.textContent=say('Prueba los dibujos.','Try the pictures.');}};
 for(const [key,icon,label]of [['map','🗺️',say('Mapa','Map')],['mission','🎯',say('Siguiente','Next')],['work','♻️',say('Trabajo','Work')],['weather','🌦️',say('Clima','Weather')]]){const b=add('button',icon+' '+label);b.className='chapter-action';b.onclick=()=>{stop();actions[key]();};}
 }
 const observe=new MutationObserver(()=>{if(panel.hidden||!panel.querySelector('input[autocomplete="given-name"]'))stop();});observe.observe(panel,{childList:true,attributes:true,attributeFilter:['hidden']});
 const hide=()=>{if(document.hidden)stop();};document.addEventListener('visibilitychange',hide);
 return {open,dispose(){stop();removeVoiceListener();observe.disconnect();document.removeEventListener('visibilitychange',hide);}};
}

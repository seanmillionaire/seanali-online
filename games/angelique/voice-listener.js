(() => {
  const isAngeliqueGame = location.pathname.startsWith('/games/angelique/') && location.pathname !== '/games/angelique/';
  if (!isAngeliqueGame || window.AngeliqueVoiceListenerLoaded) return;
  window.AngeliqueVoiceListenerLoaded = true;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const style = document.createElement('style');
  style.textContent = `
    .angelique-mic{position:fixed;left:14px;bottom:14px;z-index:9999;border:3px solid #8b2d7b;border-radius:999px;background:linear-gradient(180deg,#ffe5f5,#ff62b7);color:#28123f;font:900 16px/1 Arial,sans-serif;padding:13px 15px;box-shadow:0 7px 0 rgba(0,0,0,.26);cursor:pointer}
    .angelique-mic.listening{background:linear-gradient(180deg,#d5fff0,#34d17a);animation:micPulse .8s infinite alternate}
    .angelique-voice-box{position:fixed;left:14px;bottom:74px;z-index:9998;width:min(360px,calc(100vw - 28px));background:#fff6e6;color:#28123f;border:4px solid #8b2d7b;border-radius:24px;padding:14px;box-shadow:0 18px 40px rgba(0,0,0,.35);font-family:Arial,sans-serif;font-weight:900;line-height:1.22;display:none}
    .angelique-voice-box.show{display:block}
    .angelique-voice-box small{display:block;margin-top:8px;font-size:13px;opacity:.8}
    @keyframes micPulse{from{transform:scale(1)}to{transform:scale(1.06)}}
  `;
  document.head.appendChild(style);

  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9ñ\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function words(text) {
    return normalize(text).split(' ').filter(w => w.length > 2 && !['que','los','las','una','uno','con','para','del','por','son','como','esta','este','tiene','tienen'].includes(w));
  }

  function scoreMatch(spoken, option) {
    const s = words(spoken);
    const o = words(option);
    if (!s.length || !o.length) return 0;
    let hits = 0;
    o.forEach(w => {
      if (s.includes(w) || s.some(sw => sw.includes(w) || w.includes(sw))) hits++;
    });
    return hits / Math.max(3, Math.min(o.length, 8));
  }

  const mic = document.createElement('button');
  mic.className = 'angelique-mic';
  mic.textContent = '🎙️ Responder';
  const box = document.createElement('div');
  box.className = 'angelique-voice-box';
  box.innerHTML = '🎙️ Toca el micrófono y di la respuesta en voz alta.<small>Funciona mejor en Chrome o Safari con permiso de micrófono.</small>';
  document.body.appendChild(box);
  document.body.appendChild(mic);

  function show(message) {
    box.innerHTML = message;
    box.classList.add('show');
  }

  function chooseFromSpeech(transcript) {
    const answerButtons = Array.from(document.querySelectorAll('.answer')).filter(btn => !btn.disabled && btn.offsetParent !== null);
    if (!answerButtons.length) {
      show('🎙️ Te escuché: “' + transcript + '”<small>No veo respuestas para elegir ahora.</small>');
      return;
    }

    const command = normalize(transcript);
    if (command.includes('cantar') && document.getElementById('singBtn')) {
      document.getElementById('singBtn').click();
      show('🎵 Te escuché: “' + transcript + '”<small>Activé la rima para memorizar.</small>');
      return;
    }

    let best = { btn: null, score: 0 };
    answerButtons.forEach(btn => {
      const s = scoreMatch(transcript, btn.textContent);
      if (s > best.score) best = { btn, score: s };
    });

    if (best.btn && best.score >= 0.22) {
      show('🎙️ Te escuché: “' + transcript + '”<small>Elegí: ' + best.btn.textContent.slice(0, 90) + '...</small>');
      setTimeout(() => best.btn.click(), 450);
    } else {
      show('🎙️ Te escuché: “' + transcript + '”<small>No estoy segura. Di palabras clave de la respuesta, como “sexual”, “asexual”, “estambre”, “pistilo”, “huevo” o “vientre”.</small>');
    }
  }

  if (!SpeechRecognition) {
    mic.onclick = () => show('🎙️ Tu navegador no tiene reconocimiento de voz aquí.<small>Prueba Chrome o Safari, o responde tocando los botones.</small>');
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  recognition.onstart = () => {
    mic.classList.add('listening');
    mic.textContent = '🎙️ Escuchando...';
    show('🎙️ Estoy escuchando. Di la respuesta en voz alta.');
  };

  recognition.onend = () => {
    mic.classList.remove('listening');
    mic.textContent = '🎙️ Responder';
  };

  recognition.onerror = () => {
    show('🎙️ No pude escuchar bien.<small>Permite el micrófono y prueba otra vez.</small>');
  };

  recognition.onresult = event => {
    const transcript = Array.from(event.results[0]).map(r => r.transcript).join(' ');
    chooseFromSpeech(transcript);
  };

  mic.onclick = () => {
    try { recognition.start(); } catch (e) { recognition.stop(); setTimeout(() => recognition.start(), 150); }
  };
})();

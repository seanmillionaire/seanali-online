(() => {
  const isAngeliqueGame = location.pathname.startsWith('/games/angelique/') && location.pathname !== '/games/angelique/';
  if (!isAngeliqueGame || window.AngeliqueQuestionReaderLoaded) return;
  window.AngeliqueQuestionReaderLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    .angelique-listen{position:fixed;left:14px;bottom:14px;z-index:9999;border:3px solid #8b2d7b;border-radius:999px;background:linear-gradient(180deg,#d5fff0,#34d17a);color:#28123f;font:900 16px/1 Arial,sans-serif;padding:13px 15px;box-shadow:0 7px 0 rgba(0,0,0,.26);cursor:pointer}
    .angelique-listen.reading{background:linear-gradient(180deg,#ffe5f5,#ff62b7);animation:readPulse .8s infinite alternate}
    .angelique-audio-box{position:fixed;left:14px;bottom:74px;z-index:9998;width:min(360px,calc(100vw - 28px));background:#fff6e6;color:#28123f;border:4px solid #8b2d7b;border-radius:24px;padding:14px;box-shadow:0 18px 40px rgba(0,0,0,.35);font-family:Arial,sans-serif;font-weight:900;line-height:1.22;display:none}
    .angelique-audio-box.show{display:block}
    .angelique-audio-box small{display:block;margin-top:8px;font-size:13px;opacity:.8}
    @keyframes readPulse{from{transform:scale(1)}to{transform:scale(1.06)}}
  `;
  document.head.appendChild(style);

  const btn = document.createElement('button');
  btn.className = 'angelique-listen';
  btn.textContent = '🔊 Leer pregunta';
  const box = document.createElement('div');
  box.className = 'angelique-audio-box';
  box.innerHTML = '🔊 Toca para escuchar la pregunta, la rima y las opciones.<small>Usa la misma voz ElevenLabs de los otros juegos.</small>';
  document.body.appendChild(box);
  document.body.appendChild(btn);

  let activeAudio = null;

  function visibleText(selector) {
    const el = document.querySelector(selector);
    return el && el.offsetParent !== null ? (el.textContent || '').trim() : '';
  }

  function currentQuestionText() {
    const question = visibleText('#question') || visibleText('.question');
    const chant = visibleText('#chant') || visibleText('.chant') || visibleText('.lesson');
    const helper = visibleText('#helper') || visibleText('.helper');
    const answers = Array.from(document.querySelectorAll('.answer'))
      .filter(btn => btn.offsetParent !== null)
      .slice(0, 3)
      .map((btn, i) => 'Opción ' + (i + 1) + ': ' + (btn.textContent || '').trim())
      .filter(Boolean)
      .join('. ');

    return [question, chant, answers, helper]
      .filter(Boolean)
      .join('. ')
      .replace(/👉/g, '')
      .replace(/🔁|🎵|📘|🏆/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function setReading(on) {
    btn.classList.toggle('reading', !!on);
    btn.textContent = on ? '🔊 Leyendo...' : '🔊 Leer pregunta';
  }

  function pickSpanishVoice() {
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    return voices.find(v => /^es/i.test(v.lang) && /female|mujer|paulina|monica|maria|luciana|sabina/i.test(v.name))
      || voices.find(v => /^es/i.test(v.lang))
      || voices[0];
  }

  function browserFallback(text) {
    if (!window.speechSynthesis) {
      box.innerHTML = '🔊 No pude usar ElevenLabs ni el lector del navegador.<small>Prueba de nuevo en Chrome, Safari o Edge.</small>';
      box.classList.add('show');
      setReading(false);
      return;
    }
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = pickSpanishVoice();
    if (voice) u.voice = voice;
    u.lang = voice && voice.lang ? voice.lang : 'es-ES';
    u.rate = 0.9;
    u.pitch = 1.05;
    u.volume = 1;
    u.onend = () => setReading(false);
    u.onerror = () => setReading(false);
    speechSynthesis.speak(u);
  }

  async function elevenSpeak(text) {
    setReading(true);
    try {
      if (window.speechSynthesis) speechSynthesis.cancel();
      if (activeAudio) {
        try { activeAudio.pause(); activeAudio.currentTime = 0; } catch (e) {}
      }
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('tts failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      activeAudio = new Audio(url);
      activeAudio.onended = () => { setReading(false); URL.revokeObjectURL(url); };
      activeAudio.onerror = () => { setReading(false); URL.revokeObjectURL(url); };
      await activeAudio.play();
    } catch (e) {
      browserFallback(text);
    }
  }

  btn.onclick = () => {
    const text = currentQuestionText();
    if (!text) {
      box.innerHTML = '🔊 No encontré la pregunta todavía.<small>Espera un segundo y toca otra vez.</small>';
      box.classList.add('show');
      return;
    }
    box.innerHTML = '🔊 Leyendo con ElevenLabs.<small>Escucha y luego toca la respuesta.</small>';
    box.classList.add('show');
    elevenSpeak(text);
  };

  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = pickSpanishVoice;
  }
})();

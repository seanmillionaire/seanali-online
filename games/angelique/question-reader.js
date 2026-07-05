(() => {
  const isAngeliqueGame = location.pathname.startsWith('/games/angelique/') && location.pathname !== '/games/angelique/';
  if (!isAngeliqueGame || window.AngeliqueQuestionReaderLoaded) return;
  window.AngeliqueQuestionReaderLoaded = true;

  if (!document.querySelector('script[src^="/games/angelique/wrong-effect.js"]')) {
    const wrong = document.createElement('script');
    wrong.src = '/games/angelique/wrong-effect.js?v=1';
    document.head.appendChild(wrong);
  }

  const style = document.createElement('style');
  style.textContent = `
    .angelique-listen{position:fixed;left:14px;bottom:14px;z-index:9999;border:3px solid #8b2d7b;border-radius:999px;background:linear-gradient(180deg,#d5fff0,#34d17a);color:#28123f;font:900 16px/1 Arial,sans-serif;padding:13px 15px;box-shadow:0 7px 0 rgba(0,0,0,.26);cursor:pointer}
    .angelique-listen.reading{background:linear-gradient(180deg,#ffe5f5,#ff62b7);animation:readPulse .8s infinite alternate}
    .angelique-audio-box{position:fixed;left:14px;bottom:74px;z-index:9998;width:min(390px,calc(100vw - 28px));max-height:52vh;overflow:auto;background:#fff6e6;color:#28123f;border:4px solid #8b2d7b;border-radius:24px;padding:14px;box-shadow:0 18px 40px rgba(0,0,0,.35);font-family:Arial,sans-serif;font-weight:900;line-height:1.28;display:none}
    .angelique-audio-box.show{display:block}
    .angelique-audio-box small{display:block;margin-top:8px;font-size:13px;opacity:.8}
    .read-title{font-size:15px;margin-bottom:8px;color:#8b2d7b}
    .read-words{font-size:20px;line-height:1.55;text-align:left;background:#fff;border:3px solid #ffcf3d;border-radius:18px;padding:11px;color:#28123f}
    .read-word{display:inline-block;margin:2px 1px;padding:1px 3px;border-radius:7px;transition:.08s ease;background:transparent}
    .read-word.active{background:#ffcf3d;color:#101436;transform:scale(1.08);box-shadow:0 2px 0 rgba(0,0,0,.16)}
    .read-word.done{background:#d5fff0;color:#101436}
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
  let highlightTimer = null;
  let activeUrl = null;

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

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));
  }

  function stopHighlight() {
    if (highlightTimer) clearInterval(highlightTimer);
    highlightTimer = null;
    box.querySelectorAll('.read-word.active').forEach(w => w.classList.remove('active'));
  }

  function buildReadAlong(text) {
    const words = text.split(/\s+/).filter(Boolean);
    box.innerHTML = '<div class="read-title">🔊 Lee con la voz</div><div class="read-words">' + words.map((word, i) => '<span class="read-word" data-i="' + i + '">' + escapeHtml(word) + '</span>').join(' ') + '</div><small>Las palabras se iluminan para que Angelique pueda seguir la lectura.</small>';
    box.classList.add('show');
    return words.length;
  }

  function startHighlight(durationSeconds, wordCount) {
    stopHighlight();
    const words = Array.from(box.querySelectorAll('.read-word'));
    if (!words.length) return;
    const totalMs = Math.max(3200, (durationSeconds || 0) * 1000 || wordCount * 430);
    const stepMs = Math.max(120, totalMs / words.length);
    let index = -1;
    highlightTimer = setInterval(() => {
      if (index >= 0 && words[index]) {
        words[index].classList.remove('active');
        words[index].classList.add('done');
      }
      index++;
      if (index >= words.length) {
        stopHighlight();
        return;
      }
      words[index].classList.add('active');
      words[index].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }, stepMs);
  }

  function pickSpanishVoice() {
    const voices = window.speechSynthesis ? speechSynthesis.getVoices() : [];
    return voices.find(v => /^es/i.test(v.lang) && /female|mujer|paulina|monica|maria|luciana|sabina/i.test(v.name))
      || voices.find(v => /^es/i.test(v.lang))
      || voices[0];
  }

  function browserFallback(text, wordCount) {
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
    const estimated = Math.max(3.2, wordCount * 0.45);
    u.onstart = () => startHighlight(estimated, wordCount);
    u.onend = () => { stopHighlight(); setReading(false); };
    u.onerror = () => { stopHighlight(); setReading(false); };
    speechSynthesis.speak(u);
  }

  async function elevenSpeak(text, wordCount) {
    setReading(true);
    try {
      if (window.speechSynthesis) speechSynthesis.cancel();
      if (activeAudio) {
        try { activeAudio.pause(); activeAudio.currentTime = 0; } catch (e) {}
      }
      if (activeUrl) {
        try { URL.revokeObjectURL(activeUrl); } catch (e) {}
        activeUrl = null;
      }
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('tts failed');
      const blob = await res.blob();
      activeUrl = URL.createObjectURL(blob);
      activeAudio = new Audio(activeUrl);
      activeAudio.onloadedmetadata = () => startHighlight(activeAudio.duration, wordCount);
      activeAudio.onplay = () => {
        if (!highlightTimer) startHighlight(activeAudio.duration, wordCount);
      };
      activeAudio.onended = () => { stopHighlight(); setReading(false); };
      activeAudio.onerror = () => { stopHighlight(); setReading(false); };
      await activeAudio.play();
    } catch (e) {
      browserFallback(text, wordCount);
    }
  }

  btn.onclick = () => {
    const text = currentQuestionText();
    if (!text) {
      box.innerHTML = '🔊 No encontré la pregunta todavía.<small>Espera un segundo y toca otra vez.</small>';
      box.classList.add('show');
      return;
    }
    const wordCount = buildReadAlong(text);
    elevenSpeak(text, wordCount);
  };

  if (window.speechSynthesis) {
    speechSynthesis.onvoiceschanged = pickSpanishVoice;
  }
})();

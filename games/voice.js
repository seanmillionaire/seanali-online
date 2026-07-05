(() => {
  function loadSharedGameScripts() {
    const scripts = [
      { global: 'SeanGameAppViewReady', src: '/games/app-view.js' },
      { global: 'SeanGameBreadcrumbsReady', src: '/games/breadcrumbs.js' },
      { global: 'SeanGameLangReady', src: '/games/lang.js' }
    ];

    scripts.forEach(item => {
      if (window[item.global] || document.querySelector(`script[src="${item.src}"]`)) return;
      const script = document.createElement('script');
      script.src = item.src;
      script.defer = true;
      document.body.appendChild(script);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSharedGameScripts);
  } else {
    loadSharedGameScripts();
  }
})();

window.SeanGameVoice = (() => {
  let enabled = true;
  let currentAudio = null;
  let currentUrl = null;
  let currentController = null;
  let speakId = 0;

  function currentLang() {
    return localStorage.getItem('seanGameLang') === 'es' ? 'es-ES' : 'en-US';
  }

  function pickBrowserVoice(langCode) {
    if (!('speechSynthesis' in window)) return null;
    const voices = speechSynthesis.getVoices ? speechSynthesis.getVoices() : [];
    if (!voices.length) return null;
    const base = langCode.slice(0, 2).toLowerCase();
    return voices.find(v => v.lang === langCode) || voices.find(v => v.lang && v.lang.toLowerCase().startsWith(base)) || null;
  }

  function isGuidanceText(text) {
    const t = String(text || '').toLowerCase();
    return [
      'try again',
      'listen again',
      'almost',
      'answer:',
      'the answer was',
      'wrong',
      'missed',
      'intenta',
      'escucha otra vez',
      'casi',
      'respuesta:',
      'la respuesta era',
      'incorrecto',
      'buen intento'
    ].some(phrase => t.includes(phrase));
  }

  function shouldSpeak(text, options = {}) {
    if (options.force === true || options.guidance === true) return true;
    if (options.mode === 'guidance') return true;
    if (options.mode === 'silent') return false;
    return isGuidanceText(text);
  }

  function hardStop() {
    speakId++;

    if (currentController) {
      currentController.abort();
      currentController = null;
    }

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      currentAudio = null;
    }

    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
      currentUrl = null;
    }

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  async function elevenSpeak(text, options = {}) {
    const cleanText = String(text || '').trim();
    if (!enabled || !cleanText) return false;
    if (!shouldSpeak(cleanText, options)) return false;

    hardStop();
    const myId = speakId;
    currentController = new AbortController();

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        signal: currentController.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          voice_id: options.voice_id,
          model_id: options.model_id
        })
      });

      if (myId !== speakId || !enabled) return false;
      if (!res.ok) throw new Error('ElevenLabs voice unavailable');

      const blob = await res.blob();
      if (myId !== speakId || !enabled) return false;

      currentUrl = URL.createObjectURL(blob);
      currentAudio = new Audio(currentUrl);
      currentAudio.onended = () => {
        if (currentUrl) URL.revokeObjectURL(currentUrl);
        currentUrl = null;
        currentAudio = null;
      };

      if ('speechSynthesis' in window) speechSynthesis.cancel();
      await currentAudio.play();
      return true;
    } catch (error) {
      if (error && error.name === 'AbortError') return false;
      if (myId !== speakId || !enabled) return false;
      console.warn('SeanGameVoice: premium voice unavailable. Browser fallback disabled.');
      return options.allowBrowserFallback === true ? browserSpeak(cleanText, myId, options.lang) : false;
    } finally {
      if (myId === speakId) currentController = null;
    }
  }

  function browserSpeak(text, myId = speakId, forcedLang) {
    if (!enabled || myId !== speakId || !('speechSynthesis' in window)) return false;
    speechSynthesis.cancel();
    const langCode = forcedLang || currentLang();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    const voice = pickBrowserVoice(langCode);
    if (voice) utterance.voice = voice;
    utterance.rate = langCode.startsWith('es') ? 0.92 : 0.96;
    utterance.pitch = 1.08;
    utterance.onend = () => {
      if (myId === speakId) speechSynthesis.cancel();
    };
    speechSynthesis.speak(utterance);
    return true;
  }

  function speak(text, options = {}) {
    return elevenSpeak(text, options);
  }

  function guidance(text, options = {}) {
    return elevenSpeak(text, { ...options, guidance: true });
  }

  function force(text, options = {}) {
    return elevenSpeak(text, { ...options, force: true });
  }

  function stop() {
    hardStop();
  }

  function setEnabled(value) {
    enabled = Boolean(value);
    if (!enabled) hardStop();
    return enabled;
  }

  function toggle() {
    return setEnabled(!enabled);
  }

  function isEnabled() {
    return enabled;
  }

  return { speak, guidance, force, stop, toggle, setEnabled, isEnabled };
})();

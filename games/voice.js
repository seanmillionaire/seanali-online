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

  const SESSION_KEY = 'seanGameVoiceSession:v2';
  const DEVICE_KEY = 'seanGameVoiceDeviceCache:v2';
  const COUNT_KEY = 'seanGameVoiceElevenCount:' + new Date().toISOString().slice(0, 10);
  const MAX_ELEVEN_CALLS_PER_DEVICE_DAY = 24;
  const MAX_PREMIUM_PHRASES_PER_GAME_SESSION = 12;
  const cache = new Map();
  const pending = new Map();

  const canned = {
    en: {
      correct: 'Correct, you got it!',
      incorrect: 'Incorrect.',
      tryagain: 'Try again.',
      look: 'Look first. Then choose.',
      next: 'Next move.'
    },
    es: {
      correct: '¡Correcto, lo tienes!',
      incorrect: 'Incorrecto.',
      tryagain: 'Intenta otra vez.',
      look: 'Mira primero. Luego elige.',
      next: 'Siguiente movimiento.'
    }
  };

  function currentLang() {
    return localStorage.getItem('seanGameLang') === 'es' ? 'es-ES' : 'en-US';
  }

  function langShort(langCode = currentLang()) {
    return String(langCode || '').toLowerCase().startsWith('es') ? 'es' : 'en';
  }

  function normalize(text) {
    return String(text || '')
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[!¡]+/g, '!')
      .replace(/[.]+$/g, '.')
      .toLowerCase();
  }

  function phraseKey(text, langCode = currentLang()) {
    return langShort(langCode) + ':' + normalize(text);
  }

  function canonicalPhrase(text, langCode = currentLang()) {
    const t = normalize(text);
    const lang = langShort(langCode);
    if (/^(correct|correcto|¡correcto|bien|good|yes)/i.test(t) || t.includes('you got it') || t.includes('lo tienes')) return canned[lang].correct;
    if (/^(incorrect|incorrecto|wrong|no)/i.test(t)) return canned[lang].incorrect;
    if (t.includes('try again') || t.includes('intenta')) return canned[lang].tryagain;
    if (t.includes('look first') || t.includes('mira primero')) return canned[lang].look;
    if (t.includes('next move') || t.includes('siguiente')) return canned[lang].next;
    return String(text || '').trim();
  }

  function loadDeviceCache() {
    try {
      const data = JSON.parse(localStorage.getItem(DEVICE_KEY) || '{}');
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string' && value.startsWith('data:audio/')) cache.set(key, value);
      });
    } catch (e) {}
  }

  function saveDeviceCache() {
    try {
      const data = {};
      [...cache.entries()].slice(-40).forEach(([key, value]) => {
        if (typeof value === 'string' && value.startsWith('data:audio/')) data[key] = value;
      });
      localStorage.setItem(DEVICE_KEY, JSON.stringify(data));
    } catch (e) {}
  }

  function getSession() {
    try {
      const path = location.pathname.replace(/\/+$/, '/') || '/';
      const now = Date.now();
      let data = JSON.parse(sessionStorage.getItem(SESSION_KEY) || '{}');
      if (!data.startedAt || data.path !== path || now - data.startedAt > 1000 * 60 * 90) {
        data = { path, startedAt: now, premiumKeys: [], calls: 0 };
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
      }
      return data;
    } catch (e) {
      return { path: location.pathname, startedAt: Date.now(), premiumKeys: [], calls: 0 };
    }
  }

  function saveSession(data) {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch (e) {}
  }

  function deviceCallCount() {
    return Number(localStorage.getItem(COUNT_KEY) || 0);
  }

  function bumpDeviceCallCount() {
    const next = deviceCallCount() + 1;
    localStorage.setItem(COUNT_KEY, String(next));
    return next;
  }

  function canUsePremium(key) {
    if (cache.has(key)) return true;
    const session = getSession();
    if (!session.premiumKeys.includes(key) && session.premiumKeys.length >= MAX_PREMIUM_PHRASES_PER_GAME_SESSION) return false;
    if (deviceCallCount() >= MAX_ELEVEN_CALLS_PER_DEVICE_DAY) return false;
    return true;
  }

  function markPremiumKey(key) {
    const session = getSession();
    if (!session.premiumKeys.includes(key)) session.premiumKeys.push(key);
    session.calls = Number(session.calls || 0) + 1;
    saveSession(session);
    bumpDeviceCallCount();
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
      'correct', 'incorrect', 'you got it', 'try again', 'listen again', 'almost', 'answer:', 'the answer was', 'wrong', 'missed',
      'correcto', 'incorrecto', 'lo tienes', 'intenta', 'escucha otra vez', 'casi', 'respuesta:', 'la respuesta era', 'buen intento'
    ].some(phrase => t.includes(phrase));
  }

  function shouldSpeak(text, options = {}) {
    if (options.force === true || options.guidance === true) return true;
    if (options.mode === 'guidance') return true;
    if (options.mode === 'silent') return false;
    return isGuidanceText(text);
  }

  function stopPlaybackOnly() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      currentAudio = null;
    }
    if (currentUrl) {
      URL.revokeObjectURL(currentUrl);
      currentUrl = null;
    }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  function hardStop() {
    speakId++;
    if (currentController) {
      currentController.abort();
      currentController = null;
    }
    stopPlaybackOnly();
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result || ''));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function playDataUrl(dataUrl, myId) {
    if (!enabled || myId !== speakId) return false;
    stopPlaybackOnly();
    currentAudio = new Audio(dataUrl);
    currentAudio.onended = () => { currentAudio = null; };
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    await currentAudio.play();
    return true;
  }

  async function fetchPremiumAudio(cleanText, key, options = {}) {
    if (pending.has(key)) return pending.get(key);
    const promise = (async () => {
      currentController = new AbortController();
      const res = await fetch('/api/tts', {
        method: 'POST',
        signal: currentController.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, voice_id: options.voice_id, model_id: options.model_id })
      });
      if (!res.ok) throw new Error('ElevenLabs voice unavailable');
      const blob = await res.blob();
      const dataUrl = await blobToDataUrl(blob);
      cache.set(key, dataUrl);
      saveDeviceCache();
      markPremiumKey(key);
      return dataUrl;
    })().finally(() => {
      pending.delete(key);
      currentController = null;
    });
    pending.set(key, promise);
    return promise;
  }

  async function elevenSpeak(text, options = {}) {
    const langCode = options.lang || currentLang();
    const cleanText = canonicalPhrase(text, langCode);
    if (!enabled || !cleanText) return false;
    if (!shouldSpeak(cleanText, options)) return false;

    hardStop();
    const myId = speakId;
    const key = phraseKey(cleanText, langCode);

    try {
      const cached = cache.get(key);
      if (cached) return playDataUrl(cached, myId);

      if (!canUsePremium(key)) {
        return browserSpeak(cleanText, myId, langCode);
      }

      const dataUrl = await fetchPremiumAudio(cleanText, key, options);
      if (myId !== speakId || !enabled) return false;
      return playDataUrl(dataUrl, myId);
    } catch (error) {
      if (error && error.name === 'AbortError') return false;
      if (myId !== speakId || !enabled) return false;
      console.warn('SeanGameVoice: premium voice unavailable or capped. Using browser voice.');
      return browserSpeak(cleanText, myId, langCode);
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
    utterance.onend = () => { if (myId === speakId) speechSynthesis.cancel(); };
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

  function preload(texts = [], options = {}) {
    const list = Array.isArray(texts) ? texts : [texts];
    return Promise.allSettled(list.map(t => {
      const langCode = options.lang || currentLang();
      const cleanText = canonicalPhrase(t, langCode);
      const key = phraseKey(cleanText, langCode);
      if (cache.has(key) || !canUsePremium(key)) return Promise.resolve(false);
      return fetchPremiumAudio(cleanText, key, options);
    }));
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

  function stats() {
    const session = getSession();
    return { enabled, cachedPhrases: cache.size, sessionPremiumPhrases: session.premiumKeys.length, sessionCalls: session.calls || 0, deviceCallsToday: deviceCallCount(), maxDeviceCallsToday: MAX_ELEVEN_CALLS_PER_DEVICE_DAY };
  }

  loadDeviceCache();
  setTimeout(() => preload(['Correct, you got it!', 'Incorrect.', 'Try again.', '¡Correcto, lo tienes!', 'Incorrecto.', 'Intenta otra vez.']), 350);

  return { speak, guidance, force, preload, stop, toggle, setEnabled, isEnabled, stats };
})();

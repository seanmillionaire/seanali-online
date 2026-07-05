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
      return browserSpeak(cleanText, myId);
    } finally {
      if (myId === speakId) currentController = null;
    }
  }

  function browserSpeak(text, myId = speakId) {
    if (!enabled || myId !== speakId || !('speechSynthesis' in window)) return false;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.92;
    utterance.pitch = 1.12;
    utterance.onend = () => {
      if (myId === speakId) speechSynthesis.cancel();
    };
    speechSynthesis.speak(utterance);
    return true;
  }

  function speak(text, options = {}) {
    return elevenSpeak(text, options);
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

  return { speak, stop, toggle, setEnabled, isEnabled };
})();

window.SeanGameVoice = (() => {
  let enabled = true;
  let currentAudio = null;

  async function elevenSpeak(text, options = {}) {
    if (!enabled) return false;
    const cleanText = String(text || '').trim();
    if (!cleanText) return false;

    try {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText,
          voice_id: options.voice_id,
          model_id: options.model_id
        })
      });

      if (!res.ok) throw new Error('ElevenLabs voice unavailable');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      currentAudio = new Audio(url);
      currentAudio.onended = () => URL.revokeObjectURL(url);
      await currentAudio.play();
      return true;
    } catch (error) {
      return browserSpeak(cleanText);
    }
  }

  function browserSpeak(text) {
    if (!enabled || !('speechSynthesis' in window)) return false;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.92;
    utterance.pitch = 1.12;
    speechSynthesis.speak(utterance);
    return true;
  }

  function speak(text, options = {}) {
    return elevenSpeak(text, options);
  }

  function stop() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }

  function toggle() {
    enabled = !enabled;
    if (!enabled) stop();
    return enabled;
  }

  function isEnabled() {
    return enabled;
  }

  return { speak, stop, toggle, isEnabled };
})();

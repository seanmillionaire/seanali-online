(() => {
  if (location.pathname.replace(/\/+$/, '/') === '/games/' || window.GameMistakeReaderLoaded) return;
  window.GameMistakeReaderLoaded = true;

  let last = 0;
  let audio = null;
  let url = null;
  let stopTimer = null;
  const spoken = new WeakSet();

  function clean(value) {
    return String(value || '').replace(/👉|🔁|🎵|📘|🏆|⭐|🔥|🧠|✅|❌|🇵🇦|🇨🇦|🇹🇹/g, '').replace(/\s+/g, ' ').trim();
  }

  function read(selector) {
    const el = document.querySelector(selector);
    return el ? clean(el.textContent) : '';
  }

  function firstSentence(value) {
    const text = clean(value);
    const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    return parts[0] || text;
  }

  function buildLine(button) {
    const helper = firstSentence(read('#helper,.helper,#mind,.mind,.feedback,.lesson,.hint'));
    const question = firstSentence(read('#question,.question,#twister,.prompt'));
    const lesson = helper || question || 'Look again.';
    return clean('Try again. ' + lesson).slice(0, 105);
  }

  function stopAudio() {
    if (stopTimer) clearTimeout(stopTimer);
    stopTimer = null;
    if (audio) {
      try { audio.pause(); audio.currentTime = 0; } catch (e) {}
    }
    if (url) {
      try { URL.revokeObjectURL(url); } catch (e) {}
      url = null;
    }
  }

  async function speak(text) {
    if (!text) return;
    try {
      stopAudio();
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) return;
      const blob = await res.blob();
      url = URL.createObjectURL(blob);
      audio = new Audio(url);
      audio.onended = stopAudio;
      await audio.play();
      stopTimer = setTimeout(stopAudio, 2600);
    } catch (e) {}
  }

  function handle(button) {
    if (!button || spoken.has(button)) return;
    const now = Date.now();
    if (now - last < 900) return;
    spoken.add(button);
    last = now;
    setTimeout(() => speak(buildLine(button)), 200);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.answer,button');
    if (!button) return;
    if (!button.classList.contains('bad') && !button.classList.contains('wrong')) stopAudio();
    setTimeout(() => {
      if (button.classList.contains('bad') || button.classList.contains('wrong')) handle(button);
    }, 60);
  }, true);

  new MutationObserver(() => {
    document.querySelectorAll('.answer.bad,.bad,.wrong').forEach(handle);
  }).observe(document.body, { childList: true, subtree: true });
})();

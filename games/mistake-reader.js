(() => {
  if (location.pathname.replace(/\/+$/, '/') === '/games/' || window.GameMistakeReaderLoaded) return;
  window.GameMistakeReaderLoaded = true;

  let last = 0;
  let audio = null;
  let url = null;
  let stopTimer = null;
  const spoken = new WeakSet();

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
      stopTimer = setTimeout(stopAudio, 1400);
    } catch (e) {}
  }

  function feedbackLine(type) {
    const isEs = localStorage.getItem('seanGameLang') === 'es';
    if (type === 'correct') return isEs ? '¡Correcto, lo tienes!' : 'Correct, you got it!';
    return isEs ? 'Incorrecto.' : 'Incorrect.';
  }

  function handle(button, type) {
    if (!button || spoken.has(button)) return;
    const now = Date.now();
    if (now - last < 700) return;
    spoken.add(button);
    last = now;
    setTimeout(() => speak(feedbackLine(type)), 120);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.answer,button,.choice');
    if (!button) return;
    if (!button.classList.contains('bad') && !button.classList.contains('wrong')) stopAudio();
    setTimeout(() => {
      if (button.classList.contains('bad') || button.classList.contains('wrong')) handle(button, 'wrong');
      if (button.classList.contains('good') || button.classList.contains('correct')) handle(button, 'correct');
    }, 80);
  }, true);

  new MutationObserver(() => {
    document.querySelectorAll('.answer.bad,.bad,.wrong').forEach(button => handle(button, 'wrong'));
    document.querySelectorAll('.answer.good,.good,.correct').forEach(button => handle(button, 'correct'));
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
})();

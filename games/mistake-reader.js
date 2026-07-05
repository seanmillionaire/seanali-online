(() => {
  if (location.pathname.replace(/\/+$/, '/') === '/games/' || window.GameMistakeReaderLoaded) return;
  window.GameMistakeReaderLoaded = true;

  let last = 0;
  let audio = null;
  let url = null;
  const spoken = new WeakSet();

  function clean(value) {
    return String(value || '').replace(/👉|🔁|🎵|📘|🏆|⭐|🔥|🧠|✅|❌|🇵🇦|🇨🇦|🇹🇹/g, '').replace(/\s+/g, ' ').trim();
  }

  function read(selector) {
    const el = document.querySelector(selector);
    return el ? clean(el.textContent) : '';
  }

  function buildLine(button) {
    const picked = button ? clean(button.textContent) : '';
    const helper = read('#helper,.helper,#mind,.mind,.feedback,.lesson,.hint');
    const question = read('#question,.question,#twister,.prompt');
    const lesson = helper || question || 'Look again and try again.';
    return clean('Try again. ' + (picked ? 'You picked ' + picked + '. ' : '') + lesson).slice(0, 260);
  }

  async function speak(text) {
    if (!text) return;
    try {
      if (audio) {
        try { audio.pause(); audio.currentTime = 0; } catch (e) {}
      }
      if (url) {
        try { URL.revokeObjectURL(url); } catch (e) {}
        url = null;
      }
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) return;
      const blob = await res.blob();
      url = URL.createObjectURL(blob);
      audio = new Audio(url);
      audio.onended = () => {
        try { if (url) URL.revokeObjectURL(url); } catch (e) {}
        url = null;
      };
      await audio.play();
    } catch (e) {}
  }

  function handle(button) {
    if (!button || spoken.has(button)) return;
    const now = Date.now();
    if (now - last < 900) return;
    spoken.add(button);
    last = now;
    setTimeout(() => speak(buildLine(button)), 280);
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.answer,button');
    if (!button) return;
    setTimeout(() => {
      if (button.classList.contains('bad') || button.classList.contains('wrong')) handle(button);
    }, 60);
  }, true);

  new MutationObserver(() => {
    document.querySelectorAll('.answer.bad,.bad,.wrong').forEach(handle);
  }).observe(document.body, { childList: true, subtree: true });
})();

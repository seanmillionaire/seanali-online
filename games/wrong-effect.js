(() => {
  if (location.pathname.replace(/\/+$/, '/') === '/games/' || window.GameWrongEffectLoaded) return;
  window.GameWrongEffectLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    body.game-wrong-shake{animation:gameWrongShake .28s linear 1!important;background-color:#ff2b2b!important}
    .answer.bad,.bad{background:linear-gradient(180deg,#ff3d3d,#b40020)!important;color:#fff!important;border-color:#2b0010!important;box-shadow:0 8px 0 #4b0012!important;text-shadow:0 2px 0 rgba(0,0,0,.35)!important;animation:gameBadPop .32s ease 1!important}
    .game-wrong-flash{position:fixed;inset:0;z-index:99997;pointer-events:none;background:radial-gradient(circle,#ff0000 0%,rgba(255,0,0,.42) 35%,rgba(255,0,0,0) 75%);opacity:0;animation:gameFlash .36s ease-out 1}
    .game-wrong-msg{position:fixed;left:50%;top:38%;transform:translate(-50%,-50%) scale(.78);z-index:99998;background:#2b0010;color:#fff;border:5px solid #ffcf3d;border-radius:26px;padding:18px 22px;text-align:center;font:900 28px/1.05 Arial,sans-serif;box-shadow:0 16px 38px rgba(0,0,0,.42);animation:gameWrongMsg .74s ease forwards;text-shadow:0 3px 0 rgba(0,0,0,.35)}
    .game-wrong-msg small{display:block;font-size:15px;margin-top:7px;color:#ffd9e8}
    @keyframes gameWrongShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(3px)}}
    @keyframes gameBadPop{0%{transform:scale(1)}45%{transform:scale(1.04) rotate(-1deg)}100%{transform:scale(1)}}
    @keyframes gameFlash{0%,55%{opacity:.72}100%{opacity:0}}
    @keyframes gameWrongMsg{0%{opacity:0;transform:translate(-50%,-50%) scale(.72)}18%,70%{opacity:1;transform:translate(-50%,-50%) scale(1.02)}100%{opacity:0;transform:translate(-50%,-68%) scale(.9)}}
  `;
  document.head.appendChild(style);

  let last = 0;
  let lastQuestion = '';
  const processed = new WeakSet();

  function currentQuestion() {
    const q = document.querySelector('#question,.question,#twister,.prompt');
    return q ? (q.textContent || '').trim() : '';
  }

  function resetIfNewQuestion() {
    const q = currentQuestion();
    if (q && q !== lastQuestion) {
      lastQuestion = q;
      document.querySelectorAll('.game-wrong-msg,.game-wrong-flash').forEach(el => el.remove());
      document.body.classList.remove('game-wrong-shake');
    }
  }

  function heavyWrongSound() {
    try {
      if (window.SeanGameSounds && window.SeanGameSounds.wrong) window.SeanGameSounds.wrong();
    } catch (e) {}
  }

  function flash() {
    const f = document.createElement('div');
    f.className = 'game-wrong-flash';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 420);
  }

  function message() {
    const old = document.querySelector('.game-wrong-msg');
    if (old) old.remove();
    const m = document.createElement('div');
    m.className = 'game-wrong-msg';
    m.innerHTML = 'NOPE. WRONG ONE.<small>Look again. Try smarter.</small>';
    document.body.appendChild(m);
    setTimeout(() => m.remove(), 820);
  }

  function trigger(button) {
    if (!button || processed.has(button)) return;
    processed.add(button);
    const now = Date.now();
    if (now - last < 650) return;
    last = now;
    document.body.classList.remove('game-wrong-shake');
    void document.body.offsetWidth;
    document.body.classList.add('game-wrong-shake');
    setTimeout(() => document.body.classList.remove('game-wrong-shake'), 320);
    heavyWrongSound();
    flash();
    message();
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('.answer,button');
    if (!button) return;
    setTimeout(() => {
      resetIfNewQuestion();
      if (button.classList.contains('bad') || button.classList.contains('wrong')) trigger(button);
    }, 40);
  }, true);

  const observer = new MutationObserver(() => {
    resetIfNewQuestion();
    document.querySelectorAll('.answer.bad,.bad,.wrong').forEach(btn => trigger(btn));
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();

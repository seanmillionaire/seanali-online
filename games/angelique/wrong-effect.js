(() => {
  if (!location.pathname.startsWith('/games/angelique/') || window.AngeliqueWrongEffectLoaded) return;
  window.AngeliqueWrongEffectLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    body.angelique-wrong-shake{animation:agWrongShake .34s linear 1!important;background-color:#ff2b2b!important}
    .answer.bad{background:linear-gradient(180deg,#ff3d3d,#b40020)!important;color:#fff!important;border-color:#2b0010!important;box-shadow:0 8px 0 #4b0012!important;text-shadow:0 2px 0 rgba(0,0,0,.35)!important;animation:agBadPop .42s ease 1!important}
    .ag-wrong-flash{position:fixed;inset:0;z-index:99997;pointer-events:none;background:radial-gradient(circle,#ff0000 0%,rgba(255,0,0,.5) 35%,rgba(255,0,0,0) 75%);opacity:0;animation:agFlash .46s ease-out 1}
    .ag-wrong-msg{position:fixed;left:50%;top:38%;transform:translate(-50%,-50%) scale(.78);z-index:99998;background:#2b0010;color:#fff;border:5px solid #ffcf3d;border-radius:26px;padding:18px 22px;text-align:center;font:900 28px/1.05 Arial,sans-serif;box-shadow:0 16px 38px rgba(0,0,0,.42);animation:agWrongMsg .88s ease forwards;text-shadow:0 3px 0 rgba(0,0,0,.35)}
    .ag-wrong-msg small{display:block;font-size:15px;margin-top:7px;color:#ffd9e8}
    @keyframes agWrongShake{0%,100%{transform:translateX(0)}15%{transform:translateX(-10px)}30%{transform:translateX(9px)}45%{transform:translateX(-7px)}60%{transform:translateX(6px)}75%{transform:translateX(-3px)}}
    @keyframes agBadPop{0%{transform:scale(1)}45%{transform:scale(1.06) rotate(-1deg)}100%{transform:scale(1)}}
    @keyframes agFlash{0%,65%{opacity:.85}100%{opacity:0}}
    @keyframes agWrongMsg{0%{opacity:0;transform:translate(-50%,-50%) scale(.72)}16%,72%{opacity:1;transform:translate(-50%,-50%) scale(1.04)}100%{opacity:0;transform:translate(-50%,-72%) scale(.9)}}
  `;
  document.head.appendChild(style);

  let last = 0;

  function heavyWrongSound() {
    try {
      if (window.SeanGameSounds && window.SeanGameSounds.wrong) {
        window.SeanGameSounds.wrong();
        setTimeout(() => window.SeanGameSounds.wrong(), 90);
      }
    } catch (e) {}
  }

  function flash() {
    const f = document.createElement('div');
    f.className = 'ag-wrong-flash';
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 520);
  }

  function message() {
    const old = document.querySelector('.ag-wrong-msg');
    if (old) old.remove();
    const m = document.createElement('div');
    m.className = 'ag-wrong-msg';
    m.innerHTML = 'NOPE. WRONG ONE.<small>Look at the rhyme. Try again.</small>';
    document.body.appendChild(m);
    setTimeout(() => m.remove(), 950);
  }

  function trigger() {
    const now = Date.now();
    if (now - last < 900) return;
    last = now;
    document.body.classList.remove('angelique-wrong-shake');
    void document.body.offsetWidth;
    document.body.classList.add('angelique-wrong-shake');
    setTimeout(() => document.body.classList.remove('angelique-wrong-shake'), 380);
    heavyWrongSound();
    flash();
    message();
  }

  const observer = new MutationObserver(() => {
    if (document.querySelector('.answer.bad')) trigger();
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
})();

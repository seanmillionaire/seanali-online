(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/elements/' || window.ElementsClueBarLoaded) return;
  window.ElementsClueBarLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    .elements-clue{font-size:18px;line-height:1.18;font-weight:900;margin:8px 0 10px;background:linear-gradient(180deg,#e8fbff,#b8f2ff);color:#101436;border:4px solid #00a7c9;border-radius:20px;padding:11px;text-align:left;box-shadow:0 6px 0 rgba(0,0,0,.14)}
    .elements-clue b{color:#005d73}
    #lesson,.lesson{color:#ffffff!important;background:#101436!important;opacity:1!important;text-shadow:0 2px 0 rgba(0,0,0,.6)!important;border-color:#00d4ff!important}
    #lesson *,.lesson *{color:#ffffff!important;opacity:1!important}
    #choices .choice,#choices button.choice{min-height:78px!important;padding:18px 16px 18px 64px!important;border:4px solid #101436!important;text-align:left!important;position:relative!important;font-size:clamp(18px,5vw,23px)!important;line-height:1.08!important}
    #choices .choice::before{content:attr(data-choice-label);position:absolute;left:13px;top:50%;transform:translateY(-50%);width:36px;height:36px;border:4px solid #101436;border-radius:50%;background:#ffc83d;color:#101436;display:flex;align-items:center;justify-content:center;font-weight:900;box-shadow:0 3px 0 rgba(0,0,0,.22)}
    #choices .choice::after{content:'›';position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:34px;font-weight:900;color:#101436;opacity:.75}
    #choices .choice:hover,#choices .choice:focus{outline:7px solid rgba(255,200,61,.55)!important;transform:scale(1.015)}
    #choices .choice.good{outline:7px solid rgba(52,209,122,.6)!important}
    #choices .choice.bad{outline:7px solid rgba(255,59,48,.5)!important}
    @media(max-width:390px){.elements-clue{font-size:16px;padding:10px}#choices .choice,#choices button.choice{min-height:70px!important;padding-left:58px!important}}
  `;
  document.head.appendChild(style);

  const fixes = new Map([
    ['Thunofr', 'Thunder'], ['Thunor', 'Thunder'], ['Thundr', 'Thunder'],
    ['Watre', 'Water'], ['Wtaer', 'Water'], ['Erath', 'Earth'], ['Eath', 'Earth'],
    ['Fiire', 'Fire'], ['Fier', 'Fire'], ['Ari', 'Air'], ['Tsunammi', 'Tsunami'],
    ['Volano', 'Volcano'], ['Volcanco', 'Volcano']
  ]);

  function clean(value) { return String(value || '').replace(/\s+/g, ' ').trim(); }

  function buildClue() {
    const topic = clean(document.querySelector('#topic')?.textContent);
    if (/ice/i.test(topic)) return 'Think: cold water you can hold.';
    if (/earth|tierra/i.test(topic)) return 'Think: ground, roots, rocks.';
    if (/water|agua/i.test(topic)) return 'Think: rain, rivers, flow.';
    if (/air|aire/i.test(topic)) return 'Think: breath, wind, clouds.';
    if (/fire|sun|fuego|sol/i.test(topic)) return 'Think: heat, light, warmth.';
    if (/weather|clima/i.test(topic)) return 'Think: sky changes.';
    return 'Look at the emoji scene. Pick the best match.';
  }

  function ensureBar() {
    let clue = document.querySelector('#elementsClue');
    const scene = document.querySelector('#scene');
    if (!scene) return null;
    if (!clue) {
      clue = document.createElement('div');
      clue.id = 'elementsClue';
      clue.className = 'elements-clue';
      scene.insertAdjacentElement('afterend', clue);
    }
    return clue;
  }

  function forceVisible() {
    document.querySelectorAll('#lesson,.lesson,div').forEach(el => {
      const text = clean(el.textContent);
      if (!/choose the best answer/i.test(text)) return;
      el.style.color = '#ffffff';
      el.style.background = '#101436';
      el.style.opacity = '1';
      el.style.textShadow = '0 2px 0 rgba(0,0,0,.6)';
    });
  }

  function fixSpellingAndLabels() {
    document.querySelectorAll('#choices button,.choice').forEach((btn, i) => {
      if (!btn.classList.contains('choice')) return;
      if (!btn.dataset.choiceLabel) btn.dataset.choiceLabel = ['A','B','C','D'][i] || String(i + 1);
      const raw = clean(btn.textContent);
      const noLabel = raw.replace(/^[A-D]\s+/, '');
      const fixed = fixes.get(noLabel);
      if (fixed) btn.textContent = fixed;
      btn.setAttribute('aria-label', 'Answer ' + btn.dataset.choiceLabel + ': ' + clean(btn.textContent));
    });
  }

  function update() {
    const clue = ensureBar();
    if (clue) clue.innerHTML = '<b>Quick clue:</b> ' + buildClue();
    forceVisible();
    fixSpellingAndLabels();
  }

  update();
  setInterval(update, 300);
  new MutationObserver(update).observe(document.body, { childList: true, subtree: true, characterData: true });
})();

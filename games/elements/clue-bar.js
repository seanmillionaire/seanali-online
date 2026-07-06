(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/elements/' || window.ElementsClueBarLoaded) return;
  window.ElementsClueBarLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    .elements-clue{font-size:18px;line-height:1.18;font-weight:900;margin:8px 0 10px;background:linear-gradient(180deg,#e8fbff,#b8f2ff);color:#101436;border:4px solid #00a7c9;border-radius:20px;padding:11px;text-align:left;box-shadow:0 6px 0 rgba(0,0,0,.14)}
    .elements-clue b{color:#005d73}
    #lesson,.lesson{color:white!important;background:#101436!important}
    @media(max-width:390px){.elements-clue{font-size:16px;padding:10px}}
  `;
  document.head.appendChild(style);

  function clean(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function buildClue() {
    const topic = clean(document.querySelector('#topic')?.textContent);
    if (/ice/i.test(topic)) return 'Ice is water in a solid form.';
    if (/earth|tierra/i.test(topic)) return 'Think soil, rocks, roots, and ground.';
    if (/water|agua/i.test(topic)) return 'Think rivers, rain, oceans, and flow.';
    if (/air|aire/i.test(topic)) return 'Think wind, breath, clouds, and movement.';
    if (/fire|sun|fuego|sol/i.test(topic)) return 'Think heat, light, energy, and warmth.';
    if (/weather|clima/i.test(topic)) return 'Think sun, clouds, wind, rain, and change.';
    return 'Look at the emoji scene, then choose the best answer.';
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

  function update() {
    const clue = ensureBar();
    if (!clue) return;
    clue.innerHTML = '<b>Quick clue:</b> ' + buildClue();
  }

  update();
  new MutationObserver(update).observe(document.body, { childList: true, subtree: true, characterData: true });
})();

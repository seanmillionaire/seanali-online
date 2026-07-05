(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/elements/' || window.ElementsClueBarLoaded) return;
  window.ElementsClueBarLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    .elements-clue{font-size:18px;line-height:1.18;font-weight:900;margin:8px 0 10px;background:linear-gradient(180deg,#e8fbff,#b8f2ff);color:#101436;border:4px solid #00a7c9;border-radius:20px;padding:11px;text-align:left;box-shadow:0 6px 0 rgba(0,0,0,.14)}
    .elements-clue b{color:#005d73}
    @media(max-width:390px){.elements-clue{font-size:16px;padding:10px}}
  `;
  document.head.appendChild(style);

  const clueMap = {
    Earth: 'Earth = soil, rocks, roots, minerals, and stability.',
    Tierra: 'Tierra = suelo, rocas, raíces, minerales y estabilidad.',
    Water: 'Water = flow, rivers, clouds, oceans, and life inside bodies.',
    Agua: 'Agua = movimiento, ríos, nubes, océanos y vida en el cuerpo.',
    Air: 'Air = oxygen, wind, breath, seeds, and weather movement.',
    Aire: 'Aire = oxígeno, viento, respiración, semillas y clima.',
    'Fire / Sun': 'Fire and Sun = heat, light, energy, cooking, and growth.',
    'Fuego / Sol': 'Fuego y Sol = calor, luz, energía, comida y crecimiento.',
    Weather: 'Weather = sun, water, air, clouds, pressure, and change.',
    Clima: 'Clima = sol, agua, aire, nubes, presión y cambio.',
    Storms: 'Storms move heat, pressure, water, and wind to balance the sky.',
    Tormentas: 'Las tormentas mueven calor, presión, agua y viento.',
    Tsunami: 'A tsunami starts when the ocean is pushed by a big movement below.',
    Volcano: 'A volcano shows Earth has heat and pressure inside.',
    'Volcán': 'Un volcán muestra calor y presión dentro de la Tierra.',
    'Nature Balance': 'Nature balance means air, water, soil, plants, animals, and sun work together.',
    'Equilibrio Natural': 'El equilibrio natural une aire, agua, suelo, plantas, animales y sol.'
  };

  function clean(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function buildClue() {
    const topic = clean(document.querySelector('#topic')?.textContent);
    const lesson = clean(document.querySelector('#lesson')?.textContent);
    const mapped = clueMap[topic];
    if (mapped) return mapped;
    if (lesson && !/choose|elige/i.test(lesson)) return lesson;
    return 'Quick clue: look at the emoji scene, then connect it to the element.';
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

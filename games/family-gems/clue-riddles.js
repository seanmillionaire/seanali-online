(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/family-gems/' || window.FamilyGemsClueRiddlesLoaded) return;
  window.FamilyGemsClueRiddlesLoaded = true;

  const riddles = {
    'Which country is known for the canal that connects two oceans?': '🚪 Think: doorway. Water on both sides. Big shortcut.',
    'Which country is connected to snow, maple leaves, wide land, and your origin story?': '❄️ Think: cold air. Huge space. Quiet beginning.',
    'Which country is famous for steelpan, Carnival rhythm, and Caribbean fire?': '🥁 Think: loud music. Bright clothes. Dancing streets.',
    'Where can you live close to beaches, tropical rain, jungle, and city energy?': '🌴 Think: warm rain. Green hills. Ocean near home.',
    'Which country uses the maple leaf as one of its strongest symbols?': '🍂 Think: one leaf. Simple symbol. Cold feeling.',
    'Where was the steelpan born?': '🎵 Think: metal sound. Happy rhythm. Island party.',
    'Which country is known for rich rainforest animals like sloths, monkeys, and tropical birds?': '🦥 Think: slow animal. Loud birds. Deep green trees.',
    'Which country is deeply connected to hockey, winter sports, and cold-weather toughness?': '🏒 Think: ice. Skates. Cold game. Strong legs.',
    'Which country is known for doubles, roti, curry, and bold island flavor?': '🌶️ Think: spicy food. Warm bread. Street snack.',
    'Which country feels like a bridge between North America, South America, the Caribbean, and the world?': '🌉 Think: small bridge. Many worlds meet.',
    'Which country is known for huge forests, lakes, mountains, and northern wilderness?': '🏔️ Think: big quiet land. Lakes. Mountains. Trees.',
    'Which country is linked to Carnival costumes, soca music, and big celebration energy?': '🎭 Think: costumes. Drums. Color. Celebration.'
  };

  function clean(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function currentRiddle() {
    const q = clean(document.querySelector('#question')?.textContent);
    return riddles[q] || '👀 Look at the picture feeling. Then choose.';
  }

  function updateGem() {
    const gem = document.querySelector('#gem');
    const helper = document.querySelector('#helper');
    if (!gem) return;

    const helperText = clean(helper?.textContent);
    const answered = /✅|unlocked/i.test(helperText);
    if (answered) return;

    gem.innerHTML = '<b>Gem clue:</b> ' + currentRiddle();
  }

  updateGem();
  new MutationObserver(updateGem).observe(document.body, { childList: true, subtree: true, characterData: true });
})();

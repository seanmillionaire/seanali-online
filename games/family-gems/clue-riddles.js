(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/family-gems/' || window.FamilyGemsClueRiddlesLoaded) return;
  window.FamilyGemsClueRiddlesLoaded = true;

  const riddles = {
    'Which country is known for the canal that connects two oceans?': 'A narrow path. Two huge waters. One world shortcut.',
    'Which country is connected to snow, maple leaves, wide land, and your origin story?': 'Cold air. Big space. A red leaf. A beginning place.',
    'Which country is famous for steelpan, Carnival rhythm, and Caribbean fire?': 'Metal becomes music. Streets become color. The island moves.',
    'Where can you live close to beaches, tropical rain, jungle, and city energy?': 'Warm rain. Ocean air. Green hills. City lights nearby.',
    'Which country uses the maple leaf as one of its strongest symbols?': 'One red leaf can tell the whole story.',
    'Where was the steelpan born?': 'A drum made from metal. A sound that feels like sunshine.',
    'Which country is known for rich rainforest animals like sloths, monkeys, and tropical birds?': 'Slow animals, loud birds, green trees, and tropical mystery.',
    'Which country is deeply connected to hockey, winter sports, and cold-weather toughness?': 'Ice, speed, sticks, skates, and cold-weather grit.',
    'Which country is known for doubles, roti, curry, and bold island flavor?': 'Street food. Spice. Warm bread. Big island flavor.',
    'Which country feels like a bridge between North America, South America, the Caribbean, and the world?': 'A small doorway between many worlds.',
    'Which country is known for huge forests, lakes, mountains, and northern wilderness?': 'Huge land. Quiet lakes. Tall mountains. Endless trees.',
    'Which country is linked to Carnival costumes, soca music, and big celebration energy?': 'Costumes, drums, dancing, color, and celebration power.'
  };

  function clean(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function currentRiddle() {
    const q = clean(document.querySelector('#question')?.textContent);
    return riddles[q] || 'Look at the feeling, symbol, sound, or place. Then choose the country.';
  }

  function updateGem() {
    const gem = document.querySelector('#gem');
    const helper = document.querySelector('#helper');
    if (!gem) return;

    const text = clean(gem.textContent);
    const helperText = clean(helper?.textContent);
    const answered = /✅|unlocked|Correct answer/i.test(helperText);
    if (answered) return;

    gem.innerHTML = '<b>Gem clue:</b> ' + currentRiddle();
  }

  updateGem();
  new MutationObserver(updateGem).observe(document.body, { childList: true, subtree: true, characterData: true });
})();

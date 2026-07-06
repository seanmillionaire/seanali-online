(() => {
  if (window.BuddyGuideHelpLoaded) return;
  window.BuddyGuideHelpLoaded = true;

  const NAME_KEY = 'seanGameUserName';
  const MAP_PROGRESS_KEY = 'seanGameMapProgress:v1';
  const path = location.pathname.replace(/\/+$/, '/') || '/';
  let userName = localStorage.getItem(NAME_KEY) || '';

  const help = {
    '/games/': ['Pick a portal.', 'Tap Play.', 'Finish one round.'],
    '/games/isla-aventura/': ['Read mission.', 'Tap the best move.', 'Win treasure.'],
    '/games/mirror/': ['Read the first line.', 'Pick one thought.', 'Clear the mirror.'],
    '/games/math-race/': ['Read problem.', 'Count groups.', 'Tap answer.'],
    '/games/math-dissector/': ['Get paper.', 'Copy board.', 'Tap matching answer.'],
    '/games/piano/': ['Listen.', 'Repeat keys.', 'Try freestyle.'],
    '/games/elements/': ['Read clue.', 'Look icons.', 'Pick element.'],
    '/games/family-gems/': ['Read clue.', 'Feel picture.', 'Pick country.'],
    '/games/tongue-twister/': ['Pick letter.', 'Say it.', 'Try smoother.'],
    '/games/food-groups/': ['Look food.', 'Read question.', 'Pick answer.'],
    '/games/beats/': ['Tap pad.', 'Add sound.', 'Make beat.'],
    '/games/family/': ['Read moment.', 'Pick help.', 'Practice kindness.'],
    '/games/money/': ['Read choice.', 'Think smart.', 'Tap answer.'],
    '/games/selva/': ['Read fact.', 'True or false?', 'Tap answer.']
  };

  const titles = {
    '/games/': 'Game Wall 🎮',
    '/games/isla-aventura/': 'Isla Aventura 🏝️',
    '/games/mirror/': 'The Mirror 🪞',
    '/games/math-race/': 'Math Race 🚗',
    '/games/math-dissector/': 'Math Dissector 🧠',
    '/games/piano/': 'Piano Patterns 🎹',
    '/games/elements/': 'Nature Elements 🌎',
    '/games/family-gems/': 'Family Gems 💎',
    '/games/tongue-twister/': 'Tongue Twister 🌀',
    '/games/food-groups/': 'Natural Food 🥑',
    '/games/beats/': 'Beat Maker 🥁',
    '/games/family/': 'Family Habits 👨‍👩‍👧',
    '/games/money/': 'Money Tips 💰',
    '/games/selva/': 'Selva Quiz 🌿'
  };

  const style = document.createElement('style');
  style.textContent = `
    .buddy-smart-modal{position:fixed;inset:0;background:rgba(16,20,54,.58);display:none;align-items:center;justify-content:center;padding:14px;z-index:10000;font-family:Arial,sans-serif}.buddy-smart-modal.show{display:flex}.buddy-smart-box{width:min(440px,100%);background:linear-gradient(180deg,#fff6e6,#e8fbff);border:5px solid #101436;border-radius:30px;padding:18px;color:#101436;box-shadow:0 18px 0 rgba(0,0,0,.25),0 0 40px rgba(255,200,61,.45)}.buddy-smart-head{display:flex;align-items:center;gap:10px;background:linear-gradient(90deg,#ff62b7,#ffc83d,#34d17a,#00d4ff);border:4px solid #101436;border-radius:22px;padding:10px;font-size:25px;font-weight:900}.buddy-smart-controller{border:0;background:transparent;font-size:32px;line-height:1;cursor:pointer;padding:0 2px;filter:drop-shadow(0 3px 0 rgba(0,0,0,.22));transition:.15s}.buddy-smart-controller:active{transform:scale(.9) translateY(2px)}.buddy-smart-list{background:#fff;border:4px solid #ffc83d;border-radius:22px;margin:12px 0;padding:14px 14px 14px 38px;display:grid;gap:8px;box-shadow:0 7px 0 rgba(0,0,0,.14)}.buddy-smart-list li{font-size:21px;line-height:1.08;font-weight:900}.buddy-smart-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}.buddy-smart-actions button{border:4px solid #101436;border-radius:20px;padding:14px 10px;font-size:19px;font-weight:900;box-shadow:0 7px 0 rgba(0,0,0,.25)}.buddy-smart-close{background:linear-gradient(180deg,#fff26f,#ffc83d);color:#101436}.buddy-smart-tip{background:linear-gradient(180deg,#d9ffe9,#34d17a);color:#101436}.buddy-smart-note{font-size:17px;font-weight:900;text-align:center;background:#f4ecff;border:3px solid #7d4cff;border-radius:16px;padding:9px}.buddy-name-label{font-size:25px;font-weight:900;line-height:1.1;text-align:center;margin:4px 0 10px}.buddy-name-input{width:100%;border:5px solid #101436;border-radius:22px;padding:20px 14px;font-size:30px;font-weight:900;text-align:center;background:#fff;color:#101436;box-sizing:border-box;min-height:78px}.buddy-name-input::placeholder{font-size:22px;color:#777}@media(max-width:430px){.buddy-smart-list li{font-size:19px}.buddy-smart-actions{grid-template-columns:1fr}.buddy-smart-head{font-size:21px}.buddy-name-input{font-size:28px;min-height:82px}}
  `;
  document.head.appendChild(style);

  const modal = document.createElement('div');
  modal.className = 'buddy-smart-modal';
  document.body.appendChild(modal);

  function safeName() {
    return (userName || localStorage.getItem(NAME_KEY) || '').trim();
  }

  function unlockFullMap() {
    localStorage.setItem(MAP_PROGRESS_KEY, '99');
    localStorage.setItem('seanGameMapUnlockedAll:v1', 'true');
    const note = modal.querySelector('.buddy-smart-note');
    if (note) note.textContent = '🔓 Full map unlocked.';
    try { if (window.SeanGameSounds && SeanGameSounds.unlock) SeanGameSounds.unlock(); } catch(e) {}
    if (path === '/games/') setTimeout(() => location.reload(), 500);
  }

  function bindControllerUnlock() {
    const btn = modal.querySelector('.buddy-smart-controller');
    if (btn) btn.onclick = unlockFullMap;
  }

  function head(title) {
    return '<div class="buddy-smart-head"><button class="buddy-smart-controller" type="button" aria-label="Unlock full map" title="Unlock full map">🎮</button><span>' + title + '</span></div>';
  }

  function renderNameAsk() {
    modal.innerHTML = '<div class="buddy-smart-box">' + head('Buddy Guide') + '<div class="buddy-smart-note"><div class="buddy-name-label">What is your name?</div><input class="buddy-name-input" maxlength="24" placeholder="Type name here" value=""></div><div class="buddy-smart-actions"><button class="buddy-smart-close">Skip</button><button class="buddy-smart-tip">Save</button></div></div>';
    bindControllerUnlock();
    const input = modal.querySelector('.buddy-name-input');
    const save = () => {
      const name = input.value.trim();
      if (name) {
        userName = name;
        localStorage.setItem(NAME_KEY, name);
      }
      renderHelp();
    };
    modal.querySelector('.buddy-smart-tip').onclick = save;
    modal.querySelector('.buddy-smart-close').onclick = renderHelp;
    input.addEventListener('keydown', e => { if (e.key === 'Enter') save(); });
    setTimeout(() => input.focus(), 50);
  }

  function renderHelp(extra) {
    const steps = help[path] || ['Read.', 'Choose.', 'Try again.'];
    const title = titles[path] || 'Game Help 🎮';
    const name = safeName();
    const greeting = name ? 'Next move, ' + name + ': look first, tap second.' : 'Look first. Tap second.';
    modal.innerHTML = '<div class="buddy-smart-box">' + head(title) + '<ol class="buddy-smart-list">' + steps.map(s => '<li>' + s + '</li>').join('') + '</ol><div class="buddy-smart-note">' + (extra || greeting) + '</div><div class="buddy-smart-actions"><button class="buddy-smart-close">Got it</button><button class="buddy-smart-tip">Tip</button></div></div>';
    bindControllerUnlock();
    modal.querySelector('.buddy-smart-close').onclick = () => modal.classList.remove('show');
    modal.querySelector('.buddy-smart-tip').onclick = () => renderHelp('Slow down. Find the glow. Then tap.');
  }

  function openSmartGuide() {
    if (!safeName()) renderNameAsk();
    else renderHelp();
    modal.classList.add('show');
  }

  document.addEventListener('click', event => {
    const btn = event.target.closest('.guide-robot-button');
    if (!btn) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    openSmartGuide();
  }, true);

  modal.addEventListener('click', event => {
    if (event.target === modal) modal.classList.remove('show');
  });

  window.BuddyGuideHelp = { open: openSmartGuide, getName: safeName, unlockFullMap };
})();

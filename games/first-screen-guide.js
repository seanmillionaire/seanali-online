(() => {
  if (window.GameFirstScreenGuideLoaded) return;
  window.GameFirstScreenGuideLoaded = true;

  const path = location.pathname.replace(/\/+$/, '/') || '/';
  if (path === '/games/' || path.startsWith('/games/piano/') || path.startsWith('/games/beats/')) return;

  const guide = {
    '/games/mirror/': {
      title: 'Start Here 🪞',
      steps: ['1️⃣ Read this life moment.', '2️⃣ Pick the kind thought.', '3️⃣ Clear the mirror. ✨'],
      focus: '#situation,.situation'
    },
    '/games/math-race/': {
      title: 'Start Here 🚗',
      steps: ['1️⃣ Read the math problem.', '2️⃣ Count the groups.', '3️⃣ Tap the right number.'],
      focus: '#question,.question'
    },
    '/games/math-dissector/': {
      title: 'Start Here 🧠',
      steps: ['1️⃣ Read the top problem.', '2️⃣ Use paper if needed.', '3️⃣ Tap the best answer.'],
      focus: '#question,.question,.problem'
    },
    '/games/elements/': {
      title: 'Start Here 🌎',
      steps: ['1️⃣ Read the nature clue.', '2️⃣ Look at the icons.', '3️⃣ Pick the element.'],
      focus: '#question,.question,.clue,.prompt'
    },
    '/games/family-gems/': {
      title: 'Start Here 💎',
      steps: ['1️⃣ Read the country clue.', '2️⃣ Look for the picture clue.', '3️⃣ Pick the country.'],
      focus: '#question,.question,.clue,.prompt'
    },
    '/games/tongue-twister/': {
      title: 'Start Here 🌀',
      steps: ['1️⃣ Pick a letter.', '2️⃣ Say it out loud.', '3️⃣ Try to say it smoother.'],
      focus: '#twister,.twister,.prompt,.question'
    },
    '/games/food-groups/': {
      title: 'Start Here 🥑',
      steps: ['1️⃣ Look at the food.', '2️⃣ Read the question.', '3️⃣ Pick what helps the body.'],
      focus: '#question,.question,.food,.prompt'
    },
    '/games/family/': {
      title: 'Start Here 👨‍👩‍👧',
      steps: ['1️⃣ Read the family moment.', '2️⃣ Think: what helps?', '3️⃣ Pick the kind choice.'],
      focus: '#question,.question,.prompt,.situation'
    },
    '/games/money/': {
      title: 'Start Here 💰',
      steps: ['1️⃣ Read the money choice.', '2️⃣ Ask: need or want?', '3️⃣ Tap the smart answer.'],
      focus: '#question,.question,.prompt,.principle'
    },
    '/games/selva/': {
      title: 'Start Here 🌿',
      steps: ['1️⃣ Read the jungle fact.', '2️⃣ Think true or false.', '3️⃣ Tap your answer.'],
      focus: '#question,.question,.prompt'
    }
  };

  const data = guide[path];
  if (!data) return;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes gameFocusPulse{0%,100%{box-shadow:0 0 0 0 rgba(255,200,61,.95),0 7px 0 rgba(0,0,0,.22);transform:translateX(-50%) scale(1)}50%{box-shadow:0 0 0 12px rgba(255,200,61,0),0 7px 0 rgba(0,0,0,.22);transform:translateX(-50%) scale(1.035)}}
    @keyframes gameFocusPulsePlain{0%,100%{box-shadow:0 0 0 0 rgba(255,200,61,.95),0 7px 0 rgba(0,0,0,.22);transform:scale(1)}50%{box-shadow:0 0 0 12px rgba(255,200,61,0),0 7px 0 rgba(0,0,0,.22);transform:scale(1.035)}}
    .game-start-guide{margin:12px auto 0;max-width:520px;background:#fff;border:4px solid #34d17a;border-radius:22px;padding:10px;box-shadow:0 7px 0 rgba(0,0,0,.2);text-align:left;color:#101436;font-family:Arial,sans-serif}.game-start-title{text-align:center;font-size:20px;font-weight:900;margin-bottom:8px}.game-start-list{display:grid;gap:6px}.game-start-step{background:#f1fff3;border:2px solid #34d17a;border-radius:14px;padding:8px 10px;font-size:17px;font-weight:900;line-height:1.1}.game-focus-target{outline:5px solid #ffc83d!important;outline-offset:4px!important;animation:gameFocusPulsePlain 1.35s ease-in-out infinite!important;position:relative;z-index:6}.question.game-focus-target,.hint.game-focus-target{animation:gameFocusPulse 1.35s ease-in-out infinite!important}.game-focus-arrow{position:fixed;left:50%;top:118px;transform:translateX(-50%);z-index:9998;background:#ffc83d;border:4px solid #101436;border-radius:999px;padding:8px 13px;font-size:18px;font-weight:900;color:#101436;box-shadow:0 6px 0 rgba(0,0,0,.24);pointer-events:none;animation:bobArrow 1.05s ease-in-out infinite}@keyframes bobArrow{50%{transform:translateX(-50%) translateY(8px)}}@media(max-width:430px){.game-start-step{font-size:15px}.game-start-title{font-size:18px}.game-focus-arrow{top:104px;font-size:15px}}
  `;
  document.head.appendChild(style);

  function addGuide() {
    const top = document.querySelector('.top') || document.querySelector('header') || document.body;
    if (!top || document.querySelector('.game-start-guide')) return;
    const box = document.createElement('div');
    box.className = 'game-start-guide';
    box.innerHTML = '<div class="game-start-title">' + data.title + '</div><div class="game-start-list">' + data.steps.map(s => '<div class="game-start-step">' + s + '</div>').join('') + '</div>';
    top.appendChild(box);
  }

  function focusFirstThing() {
    const target = document.querySelector(data.focus);
    if (!target) return;
    target.classList.add('game-focus-target');
    if (!document.querySelector('.game-focus-arrow')) {
      const arrow = document.createElement('div');
      arrow.className = 'game-focus-arrow';
      arrow.textContent = '👇 Read here first';
      document.body.appendChild(arrow);
      setTimeout(() => arrow.remove(), 5200);
    }
    setTimeout(() => target.classList.remove('game-focus-target'), 8000);
  }

  function introJingle() {
    const play = () => {
      if (window.SeanGameSounds && window.SeanGameSounds.jingle) window.SeanGameSounds.jingle();
      window.removeEventListener('pointerdown', play);
      window.removeEventListener('click', play);
    };
    window.addEventListener('pointerdown', play, { once: true, passive: true });
    window.addEventListener('click', play, { once: true, passive: true });
  }

  function run() {
    addGuide();
    setTimeout(focusFirstThing, 350);
    introJingle();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

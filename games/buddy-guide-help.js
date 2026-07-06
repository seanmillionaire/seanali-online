(() => {
  if (window.BuddyGuideHelpLoaded) return;
  window.BuddyGuideHelpLoaded = true;

  const path = location.pathname.replace(/\/+$/, '/') || '/';
  const help = {
    '/games/': ['Pick one game card.', 'Tap the yellow Play button.', 'Finish one round, then try another game.'],
    '/games/math-race/': ['Read the math problem.', 'Think of the multiplication fact.', 'Tap the answer fast.'],
    '/games/math-dissector/': ['Get paper and pen first.', 'Copy the stacked problem.', 'Do the work on paper, then choose the matching answer.'],
    '/games/piano/': ['Start a pattern and listen.', 'Tap the keys in the same order.', 'Use Freestyle to just play chords.'],
    '/games/elements/': ['Read the nature clue.', 'Choose the element that fits.', 'Read the small lesson after each answer.'],
    '/games/family-gems/': ['Read the country clue.', 'Choose the country.', 'Collect the country gems.'],
    '/games/tongue-twister/': ['Pick a letter.', 'Say the sentence out loud three times.', 'Try another letter and speak smoother.'],
    '/games/food-groups/': ['Read the food question.', 'Pick the healthy answer.', 'Read the body clue after each tap.'],
    '/games/beats/': ['Tap a sound pad.', 'Try two or three sounds together.', 'Make your own little beat.'],
    '/games/family/': ['Read the family situation.', 'Pick the helpful choice.', 'Practice kindness and teamwork.'],
    '/games/money/': ['Read the money choice.', 'Ask if it is a need, want, save, or goal.', 'Tap the smart money answer.'],
    '/games/selva/': ['Read the jungle fact.', 'Choose true or false.', 'Learn the animal clue.'],
    '/games/angelique/': ['Pick today’s assignment first.', 'Play one school game.', 'Replay until it feels easy.'],
    '/games/angelique/reproduccion/': ['Read the question fast.', 'Tap A or B.', 'Use the turbo hint when stuck.']
  };

  const titles = {
    '/games/': 'Game Wall 🎮',
    '/games/math-race/': 'Math Race 🚗',
    '/games/math-dissector/': 'Math Dissector 🧠',
    '/games/piano/': 'Piano Patterns 🎹',
    '/games/elements/': 'Nature Elements 🌎',
    '/games/family-gems/': 'Country Gems 💎',
    '/games/tongue-twister/': 'Tongue Twister 🌀',
    '/games/food-groups/': 'Natural Food 🥑',
    '/games/beats/': 'Beat Maker 🥁',
    '/games/family/': 'Family Habits 👨‍👩‍👧',
    '/games/money/': 'Money Tips 💰',
    '/games/selva/': 'Selva Quiz 🌿',
    '/games/angelique/': 'School Games 💛',
    '/games/angelique/reproduccion/': 'Repro Rush ⚡'
  };

  const style = document.createElement('style');
  style.textContent = `
    .buddy-smart-modal{position:fixed;inset:0;background:rgba(16,20,54,.58);display:none;align-items:center;justify-content:center;padding:14px;z-index:10000;font-family:Arial,sans-serif}.buddy-smart-modal.show{display:flex}.buddy-smart-box{width:min(440px,100%);background:linear-gradient(180deg,#fff6e6,#e8fbff);border:5px solid #101436;border-radius:30px;padding:18px;color:#101436;box-shadow:0 18px 0 rgba(0,0,0,.25),0 0 40px rgba(255,200,61,.45)}.buddy-smart-head{display:flex;align-items:center;gap:10px;background:linear-gradient(90deg,#ff62b7,#ffc83d,#34d17a,#00d4ff);border:4px solid #101436;border-radius:22px;padding:10px;font-size:25px;font-weight:900}.buddy-smart-list{background:#fff;border:4px solid #ffc83d;border-radius:22px;margin:12px 0;padding:14px 14px 14px 38px;display:grid;gap:10px;box-shadow:0 7px 0 rgba(0,0,0,.14)}.buddy-smart-list li{font-size:20px;line-height:1.15;font-weight:900}.buddy-smart-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}.buddy-smart-actions button{border:4px solid #101436;border-radius:20px;padding:14px 10px;font-size:19px;font-weight:900;box-shadow:0 7px 0 rgba(0,0,0,.25)}.buddy-smart-close{background:linear-gradient(180deg,#fff26f,#ffc83d);color:#101436}.buddy-smart-tip{background:linear-gradient(180deg,#d9ffe9,#34d17a);color:#101436}.buddy-smart-note{font-size:17px;font-weight:900;text-align:center;background:#f4ecff;border:3px solid #7d4cff;border-radius:16px;padding:9px}@media(max-width:430px){.buddy-smart-list li{font-size:18px}.buddy-smart-actions{grid-template-columns:1fr}.buddy-smart-head{font-size:21px}}
  `;
  document.head.appendChild(style);

  const modal = document.createElement('div');
  modal.className = 'buddy-smart-modal';
  document.body.appendChild(modal);

  function render(extra) {
    const steps = help[path] || ['Read the question or clue.', 'Tap the best answer or button.', 'Learn from mistakes, then try again.'];
    const title = titles[path] || 'Game Help 🎮';
    modal.innerHTML = '<div class="buddy-smart-box"><div class="buddy-smart-head"><span>🤖</span><span>' + title + '</span></div><ol class="buddy-smart-list">' + steps.map(s => '<li>' + s + '</li>').join('') + '</ol><div class="buddy-smart-note">' + (extra || 'One step at a time. You got this. ⭐') + '</div><div class="buddy-smart-actions"><button class="buddy-smart-close">✅ Got it</button><button class="buddy-smart-tip">💡 Tip</button></div></div>';
    modal.querySelector('.buddy-smart-close').onclick = () => modal.classList.remove('show');
    modal.querySelector('.buddy-smart-tip').onclick = () => render('Slow down, look for the clue, then tap. 🧠');
  }

  function openSmartGuide() {
    render();
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

  window.BuddyGuideHelp = { open: openSmartGuide };
})();

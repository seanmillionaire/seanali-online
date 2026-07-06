(() => {
  if (window.GamePolishLoaded) return;
  window.GamePolishLoaded = true;

  const path = location.pathname.replace(/\/+$/, '/') || '/';

  const css = document.createElement('style');
  css.textContent = `
    .choice,.answer{position:relative!important;text-align:left!important;padding-left:88px!important;padding-right:18px!important}
    .choice[data-choice-label]::before,.answer[data-choice-label]::before{content:attr(data-choice-label);position:absolute;left:12px;top:50%;transform:translateY(-50%);width:34px;height:34px;border:3px solid #101436;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#ffc83d;color:#101436;font-size:18px;font-weight:900;box-shadow:0 3px 0 rgba(0,0,0,.2)}
    .choice::after,.answer::after{content:'👉';position:absolute;left:51px;right:auto;top:50%;transform:translateY(-50%);font-size:22px;opacity:.95;pointer-events:none}
    .game-progress-meter ~ .xp,.game-progress-meter ~ .barBox,.game-progress-meter ~ .progress,.game-progress-meter ~ .progressBox{display:none!important}
    .xp,.barBox,.progress,.progressBox,.meter,.xpbar{display:none!important}
    .game-progress-meter{display:block!important}
    body[data-game-polish="elements"] .lesson{color:#fff!important;background:#101436!important;text-shadow:0 1px 0 rgba(0,0,0,.25)!important}
    body[data-game-polish="elements"] .topic,body[data-game-polish="elements"] .lesson{font-weight:900!important}
    body[data-game-polish="family-gems"] .helper{display:none!important}
    body[data-game-polish="family-gems"] .barBox{display:none!important}
    body[data-game-polish="family-gems"] .gem{font-size:18px!important;line-height:1.15!important}
    body[data-game-polish="mirror"] #situation{position:relative!important;outline:5px solid #ffc83d!important;outline-offset:4px!important}
    body[data-game-polish="mirror"] #situation::before{content:'👀 Read this';display:block;background:#ffc83d;color:#101436;border:3px solid #101436;border-radius:999px;padding:6px 10px;margin:0 auto 8px;width:max-content;max-width:100%;font-size:17px;font-weight:900;animation:eyeBob 1s ease-in-out infinite}
    @keyframes eyeBob{50%{transform:translateY(5px)}}
    body[data-game-polish="tongue-twister"] .helper,body[data-game-polish="tongue-twister"] #helper,body[data-game-polish="tongue-twister"] .prompt{font-size:18px!important;line-height:1.12!important}
    body[data-game-polish="food"] .food-followup{background:#fff;border:4px solid #34d17a;border-radius:20px;margin:12px 0;padding:12px;font-size:19px;font-weight:900;line-height:1.12;text-align:left;box-shadow:0 6px 0 rgba(0,0,0,.16)}
    body[data-game-polish="food"] .food-followup b{display:block;margin-bottom:6px;color:#101436}
    @media(max-width:430px){.choice,.answer{padding-left:80px!important;padding-right:14px!important}.choice[data-choice-label]::before,.answer[data-choice-label]::before{width:30px;height:30px;font-size:16px}.choice::after,.answer::after{left:46px;font-size:19px}}
  `;
  document.head.appendChild(css);

  const labels = ['A','B','C','D','E','F'];
  function labelOptions(root = document) {
    root.querySelectorAll('.choices,.answers').forEach(group => {
      [...group.querySelectorAll('.choice,.answer,button')].forEach((btn, i) => {
        if (!btn.matches('.choice,.answer')) return;
        if (!btn.dataset.choiceLabel) btn.dataset.choiceLabel = labels[i] || String(i + 1);
      });
    });
  }

  function setGameBody() {
    if (path.includes('/elements/')) document.body.dataset.gamePolish = 'elements';
    if (path.includes('/family-gems/')) document.body.dataset.gamePolish = 'family-gems';
    if (path.includes('/mirror/')) document.body.dataset.gamePolish = 'mirror';
    if (path.includes('/tongue-twister/')) document.body.dataset.gamePolish = 'tongue-twister';
    if (path.includes('/food-groups/')) document.body.dataset.gamePolish = 'food';
  }

  function hideOldProgressBars() {
    document.querySelectorAll('.xp,.barBox,.progress,.progressBox,.meter,.xpbar').forEach(el => {
      if (!el.classList.contains('game-progress-meter')) el.style.display = 'none';
    });
  }

  const vagueGems = [
    'Look for a place that connects big waters and big worlds.',
    'Look for cold air, wide land, and a red symbol.',
    'Look for island rhythm, bright color, and music from metal.',
    'Look for warm rain, ocean air, green hills, and city lights.',
    'Look for one simple red leaf.',
    'Look for metal that turns into sunshine music.',
    'Look for sloths, monkeys, birds, and deep green forest.',
    'Look for ice, skates, sticks, speed, and winter grit.',
    'Look for spice, warm bread, street food, and bold flavor.',
    'Look for a small doorway between many worlds.',
    'Look for huge lakes, tall mountains, and endless trees.',
    'Look for costumes, drums, color, and celebration power.'
  ];

  function polishFamilyGems() {
    const gem = document.querySelector('#gem');
    const round = parseInt(document.querySelector('#round')?.textContent || '1', 10) || 1;
    const helper = document.querySelector('#helper');
    if (helper && /Correct answer:/i.test(helper.textContent)) helper.textContent = 'Try again. Look at the clue picture.';
    if (!gem) return;
    const helperText = helper?.textContent || '';
    if (/✅|unlocked/i.test(helperText)) return;
    gem.innerHTML = '<b>Gem clue:</b> ' + (vagueGems[(round - 1) % vagueGems.length] || 'Look at the symbol, sound, food, place, or feeling.');
  }

  function polishTongueTwister() {
    const candidates = ['#helper','.helper','#prompt','.prompt','#instruction','.instruction'];
    candidates.forEach(sel => {
      const el = document.querySelector(sel);
      if (!el) return;
      const t = el.textContent.trim();
      if (t.length > 70) el.textContent = '1️⃣ Pick a letter. 2️⃣ Say it out loud. 3️⃣ Try again smoother.';
    });
  }

  function polishFood() {
    const helper = document.querySelector('#helper,.helper,#lesson,.lesson');
    const feedback = document.querySelector('#feedback,.feedback');
    const good = document.querySelector('.choice.good,.answer.good,.correct');
    if (!good || document.querySelector('.food-followup')) return;
    const box = document.createElement('div');
    box.className = 'food-followup';
    box.innerHTML = '<b>🥥 Part 2:</b> What can you make with this food?<br>🥤 Drink · 🍲 Meal · 🧁 Treat';
    (feedback || helper || good.parentElement).insertAdjacentElement('afterend', box);
    setTimeout(() => box.remove(), 2600);
  }

  function run() {
    setGameBody();
    hideOldProgressBars();
    labelOptions();
    if (path.includes('/family-gems/')) polishFamilyGems();
    if (path.includes('/tongue-twister/')) polishTongueTwister();
    if (path.includes('/food-groups/')) polishFood();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  new MutationObserver(() => {
    clearTimeout(window.__gamePolishTimer);
    window.__gamePolishTimer = setTimeout(run, 60);
  }).observe(document.documentElement, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class','style'] });
})();

(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/traffic-town/' || window.TrafficTownDriveGuideLoaded) return;
  window.TrafficTownDriveGuideLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    .drive-next{outline:8px solid rgba(255,59,48,.72)!important;background:#ffc83d!important;animation:driveNextPulse .8s ease-in-out infinite!important;transform:scale(1.08)}
    .drive-step-card{margin-top:10px;background:#fff;border:5px solid #ff3b30;border-radius:22px;padding:10px;text-align:center;font-size:20px;font-weight:900;line-height:1.1;color:#101436;box-shadow:0 7px 0 rgba(0,0,0,.18)}
    .drive-step-card b{display:block;background:#ffc83d;border:3px solid #101436;border-radius:16px;padding:7px;margin-bottom:7px}
    @keyframes driveNextPulse{50%{box-shadow:0 0 0 14px rgba(255,200,61,0),0 7px 0 #101436}}
  `;
  document.head.appendChild(style);

  function center(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function getTarget() {
    const car = document.querySelector('#car');
    const targets = [...document.querySelectorAll('.thing.guide:not(.done)')];
    if (!car || !targets.length) return null;
    const c = center(car);
    let best = null, dist = Infinity;
    targets.forEach(t => {
      const p = center(t);
      const d = Math.abs(p.x - c.x) + Math.abs(p.y - c.y);
      if (d < dist) { dist = d; best = t; }
    });
    return best ? { car, target: best } : null;
  }

  function direction() {
    const data = getTarget();
    if (!data) return null;
    const c = center(data.car), t = center(data.target);
    const dx = t.x - c.x, dy = t.y - c.y;
    if (Math.abs(dx) < 14 && Math.abs(dy) < 14) return null;
    if (Math.abs(dx) >= Math.abs(dy)) return dx > 0 ? 'right' : 'left';
    return dy > 0 ? 'down' : 'up';
  }

  function arrowText(dir) {
    return ({ left:'← Left', right:'→ Right', up:'↑ Up', down:'↓ Down' })[dir] || 'the glowing goal';
  }

  function missionText() {
    const arrow = document.querySelector('#guideArrow')?.textContent || '';
    if (/pick/i.test(arrow)) return 'First: drive to the pickup.';
    if (/goal/i.test(arrow)) return 'Now: drive to the glowing goal.';
    return 'Drive to the glowing guide.';
  }

  function ensureCard() {
    let card = document.querySelector('#driveStepCard');
    const pad = document.querySelector('.pad');
    if (!pad) return null;
    if (!card) {
      card = document.createElement('div');
      card.id = 'driveStepCard';
      card.className = 'drive-step-card';
      pad.insertAdjacentElement('beforebegin', card);
    }
    return card;
  }

  function setHint(text) {
    const hint = document.querySelector('#hint');
    if (hint) hint.textContent = text;
    const prompt = document.querySelector('#prompt');
    if (prompt && /Use the arrows|Drive|Pick up|Collect|Park|Road sign/i.test(prompt.textContent || '')) {
      prompt.textContent = text;
    }
  }

  function updateGuide() {
    const dir = direction();
    document.querySelectorAll('.arrow').forEach(btn => btn.classList.remove('drive-next'));
    const card = ensureCard();
    if (!dir) {
      if (card) card.innerHTML = '<b>👀 Next move</b>Drive to the glowing guide.';
      return;
    }
    const btn = document.querySelector('.arrow[data-move="' + dir + '"]');
    if (btn) btn.classList.add('drive-next');
    const text = missionText() + ' Tap ' + arrowText(dir) + '.';
    if (card) card.innerHTML = '<b>👀 Next move</b>' + text;
    const hint = document.querySelector('#hint');
    if (hint) hint.textContent = text;
  }

  document.addEventListener('click', e => {
    const btn = e.target.closest('.arrow[data-move]');
    if (!btn) return;
    const dir = direction();
    if (!dir) return;
    const picked = btn.dataset.move;
    if (picked !== dir) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      const text = 'Not that way. Tap ' + arrowText(dir) + ' toward the glowing guide.';
      setHint(text);
      const card = ensureCard();
      if (card) card.innerHTML = '<b>👀 Next move</b>' + text;
      try { if (window.SeanGameSounds && SeanGameSounds.softWrong) SeanGameSounds.softWrong(); } catch(err) {}
    }
  }, true);

  document.addEventListener('keydown', e => {
    const keyMap = { ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down' };
    const picked = keyMap[e.key];
    if (!picked) return;
    const dir = direction();
    if (!dir || picked === dir) return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const text = 'Wrong arrow. Press ' + arrowText(dir) + ' toward the glowing guide.';
    setHint(text);
    const card = ensureCard();
    if (card) card.innerHTML = '<b>👀 Next move</b>' + text;
  }, true);

  setInterval(updateGuide, 180);
  new MutationObserver(() => setTimeout(updateGuide, 60)).observe(document.body, { childList:true, subtree:true, attributes:true, characterData:true });
  setTimeout(updateGuide, 300);
})();

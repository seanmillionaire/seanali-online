(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/mirror/' || window.MirrorLevelTwoLoaded) return;
  window.MirrorLevelTwoLoaded = true;

  let active = false;
  let round = 0;
  let score = 0;
  const total = 6;
  const labels = ['A','B','C'];

  const rounds = [
    {
      s: 'Your friend cancels plans.',
      a: ['I can ask again later.', 'They do not care.', 'I should ignore them.'],
      good: 0,
      lesson: 'Pause first. Then choose a calm thought.'
    },
    {
      s: 'You lose a game.',
      a: ['I can learn one move.', 'I am terrible.', 'I will never play again.'],
      good: 0,
      lesson: 'Losing can teach the next move.'
    },
    {
      s: 'Someone laughs nearby.',
      a: ['Maybe it is not about me.', 'They are laughing at me.', 'I must get mad.'],
      good: 0,
      lesson: 'Your mind does not need to guess danger.'
    },
    {
      s: 'The work takes longer.',
      a: ['Long can still be okay.', 'This means I failed.', 'I should rush badly.'],
      good: 0,
      lesson: 'Slow work can still be strong work.'
    },
    {
      s: 'You feel jealous.',
      a: ['That shows what I want.', 'I should hate them.', 'I can never have that.'],
      good: 0,
      lesson: 'Jealousy can become a clue, not a fight.'
    },
    {
      s: 'Your dream feels far.',
      a: ['One small step counts.', 'It is impossible.', 'I should forget it.'],
      good: 0,
      lesson: 'Far dreams move closer with tiny steps.'
    }
  ];

  const $ = id => document.getElementById(id);
  function sound(name) { try { if (window.SeanGameSounds && SeanGameSounds[name]) SeanGameSounds[name](); } catch(e) {} }
  function speak(text) { try { if (window.SeanGameVoice && SeanGameVoice.speak) SeanGameVoice.speak(text); } catch(e) {} }
  function shuffle(items) {
    return items.map((value, index) => ({ value, index, sort: Math.random() })).sort((a,b) => a.sort - b.sort);
  }
  function setHud() {
    const r = $('round');
    if (r) {
      r.textContent = Math.min(round + 1, total);
      if (r.nextSibling && r.nextSibling.nodeType === Node.TEXT_NODE) r.nextSibling.nodeValue = '/' + total;
    }
    const mind = $('mind');
    const heart = $('heart');
    const energy = $('energy');
    if (mind) mind.textContent = score;
    if (heart) heart.textContent = Math.max(0, score - 5);
    if (energy) energy.textContent = Math.max(0, score - 10);
  }
  function popup(text) {
    const p = $('popup');
    if (!p) return;
    p.textContent = text;
    p.classList.remove('show');
    void p.offsetWidth;
    p.classList.add('show');
  }
  function render() {
    active = true;
    setHud();
    const item = rounds[round];
    const mirror = $('mirror');
    if (mirror) { mirror.className = 'mirror foggy'; mirror.textContent = '🌫️'; }
    if ($('situation')) $('situation').textContent = item.s;
    if ($('prompt')) $('prompt').textContent = 'Level 2: Think deeper.';
    if ($('feedback')) $('feedback').textContent = 'Pick the thought that helps most.';
    const reward = $('reward');
    if (reward) reward.className = 'reward';
    const choices = $('choices');
    if (!choices) return;
    choices.innerHTML = '';
    shuffle(item.a).forEach((choice, pos) => {
      const btn = document.createElement('button');
      btn.className = 'choice';
      btn.dataset.choiceLabel = labels[pos];
      btn.textContent = choice;
      btn.onclick = () => pick(btn, item, choice === item.a[item.good]);
      choices.appendChild(btn);
    });
  }
  function pick(btn, item, ok) {
    document.querySelectorAll('#choices .choice').forEach(b => b.disabled = true);
    if (ok) {
      btn.classList.add('good');
      score += 10;
      const mirror = $('mirror');
      if (mirror) { mirror.className = 'mirror clear'; mirror.textContent = '🪞'; }
      if ($('feedback')) $('feedback').textContent = item.lesson;
      const reward = $('reward');
      if (reward) { reward.className = 'reward show'; reward.innerHTML = '🌟 Level 2 clear<br><small>' + item.lesson + '</small>'; }
      popup('Level 2 clear ✨');
      sound('correct');
      speak('Correct, you got it!');
      setTimeout(() => {
        round += 1;
        if (round >= total) finishLevelTwo();
        else render();
      }, 1500);
    } else {
      btn.classList.add('bad');
      if ($('feedback')) $('feedback').textContent = 'Incorrect. Try another thought.';
      popup('Incorrect.');
      sound('wrong');
      speak('Incorrect.');
      setTimeout(() => {
        document.querySelectorAll('#choices .choice').forEach(b => { b.disabled = false; b.classList.remove('bad'); });
      }, 900);
    }
    setHud();
  }
  function finishLevelTwo() {
    const mirror = $('mirror');
    if (mirror) { mirror.className = 'mirror clear'; mirror.textContent = '🏆'; }
    if ($('situation')) $('situation').textContent = 'Level 2 complete!';
    if ($('prompt')) $('prompt').textContent = '';
    if ($('feedback')) $('feedback').textContent = 'You finished the deeper mirror path.';
    const reward = $('reward');
    if (reward) { reward.className = 'reward show'; reward.innerHTML = '🏆 Deep Mirror Badge<br>🧠 Score: ' + score; }
    const choices = $('choices');
    if (choices) choices.innerHTML = '<button class="choice" data-choice-label="A" onclick="location.reload()">🔁 Start over</button>';
    sound('levelUp');
  }
  function addLevelTwoButton() {
    if (active) return;
    const text = ($('situation')?.textContent || '') + ' ' + ($('feedback')?.textContent || '');
    if (!/Genie Mode|Reality Level|inside/i.test(text)) return;
    const choices = $('choices');
    if (!choices || choices.querySelector('.mirror-level-two-btn')) return;
    choices.innerHTML = '<button class="choice mirror-level-two-btn" data-choice-label="A">🚀 Start Level 2</button><button class="choice" data-choice-label="B" onclick="location.reload()">🔁 Start over</button>';
    choices.querySelector('.mirror-level-two-btn').onclick = () => { round = 0; score = 0; render(); };
    if ($('feedback')) $('feedback').textContent = 'Level 1 done. Now try Level 2.';
  }
  setInterval(addLevelTwoButton, 500);
})();

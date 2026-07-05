(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/piano/' || window.PianoFreestyleLoaded) return;
  window.PianoFreestyleLoaded = true;

  let freestyle = false;
  let ctx = null;
  const freq = { C:261.63, D:293.66, E:329.63, F:349.23, G:392, A:440, B:493.88, C2:523.25 };
  const major = { C:['C','E','G'], D:['D','F','A'], E:['E','G','B'], F:['F','A','C2'], G:['G','B','D'], A:['A','C2','E'], B:['B','D','F'], C2:['C2','E','G'] };

  function audio() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(a, hz, start, dur, type, vol) {
    const osc = a.createOscillator();
    const gain = a.createGain();
    osc.type = type || 'triangle';
    osc.frequency.setValueAtTime(hz, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(vol, start + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(gain);
    gain.connect(a.destination);
    osc.start(start);
    osc.stop(start + dur + 0.04);
  }

  function playChord(note, dur = 620) {
    try {
      const a = audio();
      const now = a.currentTime;
      const chord = major[note] || [note];
      chord.forEach((n, i) => tone(a, freq[n] || freq.C, now + i * 0.018, dur / 1000, i === 0 ? 'triangle' : 'sine', i === 0 ? 0.20 : 0.105));
      tone(a, (freq[note] || freq.C) / 2, now, dur / 1000, 'sine', 0.055);
    } catch (e) {}
  }

  try {
    window.soundNote = playChord;
    if (typeof soundNote !== 'undefined') soundNote = playChord;
  } catch (e) {}

  const style = document.createElement('style');
  style.textContent = `
    .freestyle-toggle{border:0;border-radius:17px;padding:13px 8px;font-size:15px;font-weight:900;background:linear-gradient(180deg,#fff26f,#ffc83d);box-shadow:0 6px 0 #9b5d00;color:#101436}
    .freestyle-toggle.on{background:linear-gradient(180deg,#d7b9ff,#7d4cff);color:#fff;box-shadow:0 6px 0 #371870}
    body.piano-freestyle .guideStatus{background:#fff4c7!important;border-color:#ffc83d!important}
    body.piano-freestyle .noteBubble{background:#fff!important}
    body.piano-freestyle .key{background:#fffdf6}
  `;
  document.head.appendChild(style);

  function noteFromKey(button) {
    const keys = Array.from(document.querySelectorAll('.key'));
    const i = keys.indexOf(button);
    return ['C','D','E','F','G','A','B','C2'][i] || (button.textContent.trim() === 'C' && i > 0 ? 'C2' : button.textContent.trim());
  }

  function setStatus() {
    const status = document.querySelector('#guideStatus');
    const teaching = document.querySelector('#teaching');
    if (freestyle) {
      if (status) {
        status.className = 'guideStatus turn';
        status.textContent = 'Freestyle Mode: tap any key. Every note plays as a full chord.';
      }
      if (teaching) teaching.textContent = 'No pattern to follow. Just play, listen, and make your own sound.';
    }
  }

  function installToggle() {
    if (document.querySelector('#freestyleBtn')) return;
    const controls = document.querySelector('.controls');
    if (!controls) return;
    const btn = document.createElement('button');
    btn.id = 'freestyleBtn';
    btn.className = 'freestyle-toggle';
    btn.textContent = '🎹 Freestyle';
    btn.onclick = () => {
      freestyle = !freestyle;
      document.body.classList.toggle('piano-freestyle', freestyle);
      btn.classList.toggle('on', freestyle);
      btn.textContent = freestyle ? '🎹 Freestyle ON' : '🎹 Freestyle';
      setStatus();
    };
    controls.appendChild(btn);
  }

  document.addEventListener('click', event => {
    if (!freestyle) return;
    const key = event.target.closest('.key');
    if (!key) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    const note = noteFromKey(key);
    key.classList.add('active');
    playChord(note, 740);
    setTimeout(() => key.classList.remove('active'), 220);
    setStatus();
  }, true);

  function boot() {
    installToggle();
    if (freestyle) setStatus();
  }

  boot();
  new MutationObserver(boot).observe(document.body, { childList: true, subtree: true });
})();

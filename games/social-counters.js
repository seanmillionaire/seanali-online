(() => {
  if (window.GameSocialCountersLoaded) return;
  window.GameSocialCountersLoaded = true;

  const seeds = {
    '/games/math-race/': { likes: 128, shares: 34 },
    '/games/math-dissector/': { likes: 96, shares: 21 },
    '/games/piano/': { likes: 214, shares: 48 },
    '/games/elements/': { likes: 177, shares: 39 },
    '/games/family-gems/': { likes: 143, shares: 31 },
    '/games/tongue-twister/': { likes: 188, shares: 42 },
    '/games/food-groups/': { likes: 121, shares: 27 },
    '/games/beats/': { likes: 239, shares: 57 },
    '/games/family/': { likes: 104, shares: 24 },
    '/games/money/': { likes: 167, shares: 36 },
    '/games/selva/': { likes: 132, shares: 29 }
  };

  const css = document.createElement('style');
  css.textContent = `
    .social-proof{margin-top:14px;background:#fff;border:2px solid #d8dde8;border-radius:18px;overflow:hidden;color:#1f2937;font-family:Arial,sans-serif;box-shadow:0 4px 0 rgba(0,0,0,.08)}
    .social-row{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 11px;font-size:14px;font-weight:800;color:#526071;border-bottom:1px solid #edf0f5}
    .social-faces{display:flex;align-items:center;gap:5px;white-space:nowrap}.social-bubble{width:24px;height:24px;border-radius:999px;display:inline-flex;align-items:center;justify-content:center;border:2px solid #fff;margin-left:-7px;font-size:12px;box-shadow:0 1px 2px rgba(0,0,0,.18)}.social-bubble:first-child{margin-left:0}.social-like{background:#1877f2;color:#fff}.social-heart{background:#f02849;color:#fff}.social-star{background:#f7b928;color:#111}
    .social-counts{white-space:nowrap}.social-actions{display:grid;grid-template-columns:1fr 1fr}.social-btn{appearance:none;border:0;background:#fff;padding:12px 8px;font-size:16px;font-weight:900;color:#344054;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px}.social-btn:first-child{border-right:1px solid #edf0f5}.social-btn:hover,.social-btn.active{background:#f0f6ff;color:#1877f2}.social-btn:active{transform:scale(.98)}.social-toast{position:fixed;left:50%;bottom:92px;transform:translateX(-50%);background:#101436;color:#fff;border:3px solid #ffc83d;border-radius:999px;padding:11px 16px;font-size:15px;font-weight:900;z-index:10050;box-shadow:0 8px 24px rgba(0,0,0,.28);opacity:0;pointer-events:none;transition:.2s}.social-toast.show{opacity:1;bottom:106px}@media(max-width:430px){.social-row{font-size:13px}.social-btn{font-size:15px;padding:11px 6px}}
  `;
  document.head.appendChild(css);

  const toast = document.createElement('div');
  toast.className = 'social-toast';
  document.body.appendChild(toast);

  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 1200);
  }

  function num(n) {
    return Number(n).toLocaleString();
  }

  function titleFor(card) {
    return (card.querySelector('.title')?.textContent || 'Game').trim();
  }

  function keyFor(href) {
    try { return new URL(href, location.origin).pathname.replace(/\/+$/, '/') || '/'; }
    catch(e) { return href; }
  }

  function readState(key, base) {
    const saved = JSON.parse(localStorage.getItem('gameSocial:' + key) || '{}');
    return {
      likes: Number.isFinite(saved.likes) ? saved.likes : base.likes,
      shares: Number.isFinite(saved.shares) ? saved.shares : base.shares,
      liked: Boolean(saved.liked)
    };
  }

  function saveState(key, state) {
    localStorage.setItem('gameSocial:' + key, JSON.stringify(state));
  }

  document.querySelectorAll('.grid .card[href]').forEach(card => {
    if (card.querySelector('.social-proof')) return;
    const key = keyFor(card.getAttribute('href'));
    const base = seeds[key] || { likes: 88, shares: 19 };
    const state = readState(key, base);

    const box = document.createElement('div');
    box.className = 'social-proof';
    box.innerHTML = `
      <div class="social-row">
        <div class="social-faces"><span class="social-bubble social-like">👍</span><span class="social-bubble social-heart">❤</span><span class="social-bubble social-star">⭐</span><span class="social-like-text"></span></div>
        <div class="social-counts"><span class="share-count"></span> shares</div>
      </div>
      <div class="social-actions">
        <button class="social-btn like-btn" type="button">👍 Like</button>
        <button class="social-btn share-btn" type="button">↗ Share</button>
      </div>`;

    const likeText = box.querySelector('.social-like-text');
    const shareText = box.querySelector('.share-count');
    const likeBtn = box.querySelector('.like-btn');
    const shareBtn = box.querySelector('.share-btn');

    function render() {
      likeText.textContent = `${num(state.likes)} likes`;
      shareText.textContent = num(state.shares);
      likeBtn.classList.toggle('active', state.liked);
      likeBtn.textContent = state.liked ? '👍 Liked' : '👍 Like';
    }

    box.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
    });

    likeBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      if (!state.liked) {
        state.likes += 1;
        state.liked = true;
        showToast('Liked ' + titleFor(card) + ' 👍');
      } else {
        state.likes = Math.max(base.likes, state.likes - 1);
        state.liked = false;
        showToast('Like removed');
      }
      saveState(key, state);
      render();
    });

    shareBtn.addEventListener('click', async e => {
      e.preventDefault();
      e.stopPropagation();
      const url = new URL(card.getAttribute('href'), location.origin).href;
      state.shares += 1;
      saveState(key, state);
      render();
      const title = titleFor(card) + ' on Sean Ali Games';
      try {
        if (navigator.share) await navigator.share({ title, url });
        else await navigator.clipboard.writeText(url);
        showToast('Share link ready ↗');
      } catch(err) {
        showToast('Share counted ↗');
      }
    });

    render();
    card.appendChild(box);
  });
})();

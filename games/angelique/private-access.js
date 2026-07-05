(() => {
  const path = location.pathname.replace(/\/+$/, '/');
  if (!path.startsWith('/games/angelique/') || window.AngeliquePrivateAccessLoaded) return;
  window.AngeliquePrivateAccessLoaded = true;

  const key = 'angelique_private_ok';
  const open = sessionStorage.getItem(key) === 'yes';
  if (open) return;

  const style = document.createElement('style');
  style.textContent = `
    body.angelique-locked{overflow:hidden!important}
    .angelique-lock{position:fixed;inset:0;z-index:2147483647;background:radial-gradient(circle at top,#ffe66d,transparent 30%),linear-gradient(135deg,#ff62b7,#7d4cff,#101436);display:flex;align-items:center;justify-content:center;padding:18px;font-family:Arial,sans-serif;color:#101436}
    .angelique-lock-box{width:min(430px,100%);background:#fff6e6;border:5px solid #101436;border-radius:30px;box-shadow:0 18px 0 rgba(0,0,0,.28);padding:22px;text-align:center}
    .angelique-lock-box h1{margin:0 0 8px;font-size:34px;line-height:1;color:#101436}
    .angelique-lock-box p{margin:0 0 14px;font-size:18px;line-height:1.2;font-weight:900;color:#28123f}
    .angelique-lock-box input{width:100%;border:4px solid #101436;border-radius:18px;padding:16px;text-align:center;font-size:28px;font-weight:900;background:#fff;color:#101436;outline:none}
    .angelique-lock-box button{width:100%;border:0;border-radius:18px;padding:16px;margin-top:12px;background:linear-gradient(180deg,#fff26f,#ffc83d);color:#101436;font-size:22px;font-weight:900;box-shadow:0 7px 0 #9b5d00;cursor:pointer}
    .angelique-lock-error{min-height:24px;margin-top:10px;font-size:16px;font-weight:900;color:#b40020}
  `;
  document.head.appendChild(style);
  document.documentElement.classList.add('angelique-locked-root');
  document.body.classList.add('angelique-locked');

  const lock = document.createElement('div');
  lock.className = 'angelique-lock';
  lock.innerHTML = '<div class="angelique-lock-box"><h1>🔒 Angelique</h1><p>Private school games. Enter the code.</p><input id="angeliqueCode" inputmode="numeric" autocomplete="off" placeholder="Code"><button id="angeliqueUnlock">Unlock 💛</button><div class="angelique-lock-error" id="angeliqueError"></div></div>';
  document.body.appendChild(lock);

  const input = lock.querySelector('#angeliqueCode');
  const error = lock.querySelector('#angeliqueError');
  function unlock() {
    if ((input.value || '').trim() === '777') {
      sessionStorage.setItem(key, 'yes');
      document.body.classList.remove('angelique-locked');
      lock.remove();
      return;
    }
    error.textContent = 'Wrong code. Try again.';
    input.value = '';
    input.focus();
  }

  lock.querySelector('#angeliqueUnlock').onclick = unlock;
  input.addEventListener('keydown', e => { if (e.key === 'Enter') unlock(); });
  setTimeout(() => input.focus(), 80);
})();

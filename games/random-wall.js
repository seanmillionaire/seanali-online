(() => {
  if (window.GameWallRandomizerLoaded) return;
  window.GameWallRandomizerLoaded = true;

  function addCartridgeStyle() {
    if (document.getElementById('game-cartridge-style')) return;
    const style = document.createElement('style');
    style.id = 'game-cartridge-style';
    style.textContent = `
      .kicker{font-size:16px!important}
      .game-cartridge{position:relative;overflow:hidden;background:linear-gradient(180deg,#fffbe8 0,#fffbe8 72%,#e8e1c7 72%,#d8ceb0 100%)!important;border-radius:20px 20px 28px 28px!important;border-width:5px!important;border-color:#101436!important;padding-top:54px!important;box-shadow:0 14px 0 rgba(0,0,0,.22),inset 0 0 0 3px rgba(255,255,255,.55)!important}
      .game-cartridge:before{content:'GAME CARD';position:absolute;left:0;right:0;top:0;height:39px;background:linear-gradient(90deg,#ff3b30,#ffcc00,#34d17a,#00c7ff,#7d4cff);border-bottom:5px solid #101436;display:flex;align-items:center;justify-content:center;color:#101436;font-size:13px;font-weight:900;letter-spacing:1.8px;text-shadow:0 1px 0 rgba(255,255,255,.45)}
      .game-cartridge:after{content:'';position:absolute;right:15px;top:49px;width:46px;height:9px;background:#101436;border-radius:999px;box-shadow:-58px 0 0 #101436;opacity:.22}
      .game-cartridge .emoji{width:92px;height:92px;display:flex;align-items:center;justify-content:center;margin:0 0 10px;background:radial-gradient(circle at 35% 25%,#fff,#e8fbff 55%,#d7b9ff);border:4px solid #101436;border-radius:22px;box-shadow:0 7px 0 rgba(0,0,0,.2);font-size:56px!important}
      .game-cartridge .title{background:#101436;color:#fff;border-radius:14px;padding:9px 11px;margin:8px 0 9px!important;display:inline-block;line-height:1;box-shadow:0 4px 0 rgba(0,0,0,.18)}
      .game-cartridge .play{border:3px solid #101436;border-radius:14px!important;background:linear-gradient(180deg,#fff26f,#ffc83d)!important;color:#101436!important}
      .game-cartridge .desc{background:#fff;border:3px solid rgba(16,20,54,.16);border-radius:14px;padding:10px;min-height:72px}
      @media(max-width:430px){.game-cartridge{padding-top:50px!important}.game-cartridge .emoji{width:78px;height:78px;font-size:48px!important}.game-cartridge:before{height:36px;font-size:12px}}
    `;
    document.head.appendChild(style);
  }

  function restoreTopLine() {
    const kicker = document.querySelector('.kicker');
    if (kicker) kicker.textContent = 'Mini game portals';
  }

  function cartridgeCards() {
    document.querySelectorAll('.grid .card[href]').forEach(card => card.classList.add('game-cartridge'));
  }

  function shuffle(cards) {
    const arr = [...cards];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function randomizeWall() {
    const grid = document.querySelector('.grid');
    if (!grid) return;
    const cards = [...grid.querySelectorAll('.card[href]')];
    if (cards.length < 2) return;
    shuffle(cards).forEach(card => grid.appendChild(card));
  }

  function run() {
    addCartridgeStyle();
    restoreTopLine();
    randomizeWall();
    cartridgeCards();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();

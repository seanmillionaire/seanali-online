(() => {
  if (window.GameWallRandomizerLoaded) return;
  window.GameWallRandomizerLoaded = true;

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

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', randomizeWall);
  else randomizeWall();
})();

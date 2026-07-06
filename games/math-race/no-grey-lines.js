(() => {
  if (window.MathRaceNoGreyLinesLoaded) return;
  window.MathRaceNoGreyLinesLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    .mark.ghost,
    .grp .mark.ghost,
    .ghost,
    [class*="ghost"],
    .mark[style*="gray"],
    .mark[style*="grey"],
    .mark[style*="c7c7c7"] {
      background:#252525!important;
      background-color:#252525!important;
      color:#252525!important;
      opacity:1!important;
      filter:none!important;
      mix-blend-mode:normal!important;
    }
    .grp .mark,
    .visual .mark,
    .marks .mark,
    .mark {
      opacity:1!important;
      filter:none!important;
    }
  `;
  document.head.appendChild(style);

  function killGrey() {
    document.querySelectorAll('.mark.ghost,.grp .mark.ghost,.ghost,[class*="ghost"]').forEach(el => {
      el.classList.remove('ghost');
      el.style.background = '#252525';
      el.style.backgroundColor = '#252525';
      el.style.opacity = '1';
      el.style.filter = 'none';
    });
    document.querySelectorAll('.mark').forEach(el => {
      const bg = getComputedStyle(el).backgroundColor;
      if (/199|200|201|202|203|204|205|206|207|208|209|210|211|212|213|214|215|216|217|218|219|220/.test(bg)) {
        el.style.background = '#252525';
        el.style.backgroundColor = '#252525';
      }
      el.style.opacity = '1';
      el.style.filter = 'none';
    });
  }

  killGrey();
  setInterval(killGrey, 250);
  new MutationObserver(killGrey).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class','style'] });
})();

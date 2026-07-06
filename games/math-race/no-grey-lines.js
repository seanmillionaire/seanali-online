(() => {
  if (window.MathRaceNoGreyLinesLoaded) return;
  window.MathRaceNoGreyLinesLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    .mark.ghost,
    .grp .mark.ghost {
      background:#252525!important;
      opacity:1!important;
      filter:none!important;
    }
  `;
  document.head.appendChild(style);
})();

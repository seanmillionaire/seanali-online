(() => {
  if (location.pathname.replace(/\/+$/, '/') !== '/games/family-gems/' || window.CountryGemsNameLoaded) return;
  window.CountryGemsNameLoaded = true;

  document.title = document.title.replace(/Family Gems/g, 'Country Gems');

  function rename() {
    document.querySelectorAll('h1,.tag,#country,.manual h2,.reward,.helper,.gem,.sub').forEach(el => {
      if (!el || !el.textContent) return;
      el.innerHTML = el.innerHTML
        .replace(/Family Gems/g, 'Country Gems')
        .replace(/Family Roots/g, 'Country Gems')
        .replace(/Family Roots badge/g, 'Country Gems badge')
        .replace(/Family Map/g, 'Country Map')
        .replace(/family memory lesson/g, 'country memory lesson')
        .replace(/family story/g, 'country story')
        .replace(/family gem/g, 'country gem')
        .replace(/family gems/g, 'country gems');
    });
  }

  rename();
  new MutationObserver(rename).observe(document.body, { childList: true, subtree: true, characterData: true });
})();

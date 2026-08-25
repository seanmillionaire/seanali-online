(function () {
  "use strict";

  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-gps-announcement]");
    if (!link) return;

    var details = {
      placement: "announcement_bar",
      page_path: window.location.pathname
    };

    try {
      if (typeof window.fbq === "function") {
        window.fbq("trackCustom", "DreamLifeGPSClick", details);
      }
    } catch (error) {
      // Tracking must never interrupt navigation.
    }

    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "dream_life_gps_click",
        placement: details.placement,
        page_path: details.page_path
      });
    } catch (error) {
      // Tracking must never interrupt navigation.
    }
  });
})();

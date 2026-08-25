(() => {
  let previouslyHidden = [];

  window.addEventListener("beforeprint", () => {
    previouslyHidden = Array.from(document.querySelectorAll(".guided-final-section-body[hidden]"));
    previouslyHidden.forEach((section) => section.removeAttribute("hidden"));
  });

  window.addEventListener("afterprint", () => {
    previouslyHidden.forEach((section) => section.setAttribute("hidden", ""));
    previouslyHidden = [];
  });
})();

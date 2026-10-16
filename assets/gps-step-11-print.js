(() => {
  const reportId = "gps-print-report";
  const text = selector => document.querySelector(selector)?.textContent?.trim() || "";
  const element = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content) node.textContent = content;
    return node;
  };
  const labeledCopy = (parent, label, copy) => {
    if (!copy) return;
    const section = element("section", "gps-print-copy");
    section.append(element("p", "gps-print-label", label), element("p", "gps-print-copy-text", copy));
    parent.append(section);
  };
  const buildReport = () => {
    document.getElementById(reportId)?.remove();
    if (!document.querySelector('[data-summary="goal"]')) return;
    const name = document.querySelector('[data-first-name]')?.getAttribute('data-first-name') || "Your";
    const report = element("article", "gps-print-report");
    report.id = reportId;
    const header = element("header", "gps-print-header");
    const brand = element("div", "gps-print-brand");
    const brandCopy = element("div");
    brandCopy.append(element("b", "", "DREAM LIFE GPS"), element("span", "", "Created by Sean Ali"));
    brand.append(brandCopy);
    header.append(brand, element("time", "gps-print-date", new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date())));
    report.append(header);
    const hero = element("section", "gps-print-hero");
    hero.append(element("p", "gps-print-eyebrow", "MY DAILY REMINDER"), element("h1", "", name === "Your" ? "Your Dream Life Map" : `${name}’s Dream Life Map`), element("p", "gps-print-intro", "The life I want, in my own words. A direction I can return to every day."));
    const compass = document.querySelector('img[data-north-star-compass]');
    if (compass) { const visual = element("div", "gps-print-emblem"); visual.append(compass.cloneNode(true)); hero.append(visual); }
    report.append(hero);
    const goal = element("section", "gps-print-destination");
    goal.append(element("p", "gps-print-label", "WHAT I WANT"), element("h2", "", text('[data-summary="goal"]')));
    report.append(goal);
    const snapshot = element("div", "gps-print-snapshot");
    labeledCopy(snapshot, "WHAT A BETTER DAY LOOKS LIKE", text('[data-summary="future"]'));
    labeledCopy(snapshot, "WHY IT MATTERS TO ME", text('[data-summary="reason"]'));
    report.append(snapshot);
    const step = text('[data-summary="step"]');
    if (step) { const next = element("section", "gps-print-destination"); labeledCopy(next, "MY NEXT SMALL STEP", step); report.append(next); }
    const guidance = element("section", "gps-print-moves");
    guidance.append(element("p", "gps-print-label", "KEEP MY DIRECTION CLOSE"));
    const list = element("div", "gps-print-move-list");
    [
      ["KEEP IT VISIBLE", "Print it or save it.", "Put this summary on the fridge or beside my bed. Keep my North Star on my phone or somewhere I will see it."],
      ["LOOK DAILY", "Take a quiet moment.", "Read my words each day and remember what matters to me."],
      ["ONE SMALL STEP", "Let it fit my life.", "Ask: What is one thing I can do today in this direction? It can be small and fit the energy I have."],
    ].forEach(([label, title, copy], i) => {
      const item = element("article", "gps-print-move");
      const body = element("div");
      body.append(element("span", "", label), element("h3", "", title), element("p", "", copy));
      item.append(element("i", "", String(i + 1)), body); list.append(item);
    });
    guidance.append(list); report.append(guidance);
    const footer = element("footer", "gps-print-close");
    footer.append(element("b", "", "My direction can grow with me."), element("p", "", "I can return and update my tools whenever my life changes."), element("span", "", "seanali.online/gps"));
    report.append(footer); document.body.append(report);
  };
  window.addEventListener("beforeprint", buildReport);
  window.addEventListener("afterprint", () => document.getElementById(reportId)?.remove());
})();

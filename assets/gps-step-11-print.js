(() => {
  const REPORT_ID = "gps-print-report";
  const NAME_KEY = "dream-life-gps-first-name";

  const cleanText = (value) => (value || "").replace(/\s+/g, " ").trim();

  const textFrom = (selector, fallback = "", root = document) => {
    const value = cleanText(root.querySelector(selector)?.textContent);
    return value || fallback;
  };

  const safeName = (value) => {
    const trimmed = cleanText(value).slice(0, 40);
    try {
      return trimmed.replace(/[^\p{L}\p{M}' -]/gu, "").trim();
    } catch {
      return trimmed.replace(/[^A-Za-z' -]/g, "").trim();
    }
  };

  const rememberName = (value) => {
    const name = safeName(value);
    if (!name) return;
    try {
      window.sessionStorage.setItem(NAME_KEY, name);
    } catch {
      // The report still falls back to the visible greeting.
    }
  };

  const nameFromGreeting = () => {
    const greeting = textFrom(".personal-greeting");
    const match = greeting.match(/Good (?:morning|afternoon|evening),\s*(.+?)(?:\s+[—-]\s+|$)/i);
    return safeName(match?.[1] || "");
  };

  const getFirstName = () => {
    const currentInput = document.querySelector("#guided-name");
    if (currentInput instanceof HTMLInputElement && currentInput.value) {
      rememberName(currentInput.value);
      return safeName(currentInput.value);
    }

    try {
      const stored = safeName(window.sessionStorage.getItem(NAME_KEY) || "");
      if (stored) return stored;
    } catch {
      // Use the greeting next.
    }

    return nameFromGreeting() || "Your";
  };

  const createElement = (tag, className, content) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content) element.textContent = content;
    return element;
  };

  const addLabeledCopy = (parent, label, copy) => {
    if (!copy) return;
    const section = createElement("section", "gps-print-copy");
    section.append(createElement("p", "gps-print-label", label));
    section.append(createElement("p", "gps-print-copy-text", copy));
    parent.append(section);
  };

  const reportDate = () => new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const buildReport = () => {
    document.getElementById(REPORT_ID)?.remove();

    const finalPlan = document.querySelector(".guided-final-plan");
    if (!finalPlan) return;

    const name = getFirstName();
    const isNamed = name !== "Your";
    const goal = textFrom(
      ".guided-final-result p b",
      textFrom(".guided-vision-scene > p", "Build a life that feels like mine")
    );
    const why = textFrom(
      ".guided-final-context > div:nth-child(2) b",
      "This is worth moving now"
    );
    const dream = textFrom(
      ".guided-clarity-narrative p",
      textFrom(".guided-vision-scene > p")
    );
    const focus = textFrom(
      ".guided-final-context > div:first-child b",
      "The work closest to my goal"
    );
    const result = textFrom(
      ".guided-final-result h2",
      "Move one visible result forward in the next seven days"
    );

    const actions = Array.from(document.querySelectorAll(".guided-simple-checklist article"))
      .slice(0, 3)
      .map((article, index) => ({
        number: index + 1,
        timing: textFrom("span", "NEXT", article),
        title: textFrom("h2", "", article),
        action: textFrom("p", "", article),
      }));

    const report = createElement("article", "gps-print-report");
    report.id = REPORT_ID;

    const header = createElement("header", "gps-print-header");
    const brand = createElement("div", "gps-print-brand");
    const logo = document.createElement("img");
    logo.src = "/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png";
    logo.alt = "";
    const brandCopy = createElement("div");
    brandCopy.append(createElement("b", "", "DREAM LIFE GPS"));
    brandCopy.append(createElement("span", "", "Created by Sean Ali"));
    brand.append(logo, brandCopy);
    header.append(brand, createElement("time", "gps-print-date", reportDate()));
    report.append(header);

    const hero = createElement("section", "gps-print-hero");
    hero.append(createElement("p", "gps-print-eyebrow", "YOUR PERSONAL ROUTE"));
    hero.append(createElement("h1", "", isNamed ? `${name}’s Dream Life GPS` : "Your Dream Life GPS"));
    hero.append(createElement(
      "p",
      "gps-print-intro",
      isNamed
        ? `${name}, this is the life you described and the next three moves to bring it closer.`
        : "This is the life you described and the next three moves to bring it closer."
    ));
    report.append(hero);

    const destination = createElement("section", "gps-print-destination");
    destination.append(createElement("p", "gps-print-label", "YOUR DESTINATION"));
    destination.append(createElement("h2", "", goal));
    report.append(destination);

    const snapshot = createElement("div", "gps-print-snapshot");
    addLabeledCopy(snapshot, "WHY THIS MATTERS", why);
    addLabeledCopy(snapshot, "YOUR DREAM-LIFE PICTURE", dream);
    report.append(snapshot);

    const resultSection = createElement("section", "gps-print-result");
    const resultCopy = createElement("div");
    resultCopy.append(createElement("p", "gps-print-label", "YOUR NEXT 7-DAY RESULT"));
    resultCopy.append(createElement("h2", "", result));
    const focusCopy = createElement("div", "gps-print-focus");
    focusCopy.append(createElement("span", "", "FOCUS"));
    focusCopy.append(createElement("b", "", focus));
    resultSection.append(resultCopy, focusCopy);
    report.append(resultSection);

    const moves = createElement("section", "gps-print-moves");
    moves.append(createElement("p", "gps-print-label", "YOUR THREE MOVES"));
    const moveList = createElement("div", "gps-print-move-list");
    actions.forEach((action) => {
      const item = createElement("article", "gps-print-move");
      item.append(createElement("i", "", String(action.number)));
      const copy = createElement("div");
      copy.append(createElement("span", "", action.timing));
      if (action.title) copy.append(createElement("h3", "", action.title));
      copy.append(createElement("p", "", action.action));
      item.append(copy);
      moveList.append(item);
    });
    moves.append(moveList);
    report.append(moves);

    const close = createElement("footer", "gps-print-close");
    close.append(createElement("b", "", "Start with move #1"));
    close.append(createElement("p", "", "Keep this page where you can see it. Check it again in seven days."));
    close.append(createElement("span", "", "seanali.online/gps"));
    report.append(close);

    document.body.append(report);
  };

  document.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.id === "guided-name") {
      rememberName(target.value);
    }
  });

  window.addEventListener("beforeprint", buildReport);
  window.addEventListener("afterprint", () => {
    document.getElementById(REPORT_ID)?.remove();
  });
})();

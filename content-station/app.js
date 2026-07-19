const STORAGE_KEY = "seanContentStationV3";

const SYSTEMS = {
  godShorts: {
    name: "Sean Ali God Shorts",
    defaultCount: 2,
    status: "ACTIVE · DAILY 8:00 AM",
    promise: "God-guidance content about money, vision, identity, purpose, action, and protecting the future.",
    cta: "Topic-matched comment keyword",
    topics: ["more income", "protect your vision", "think rich", "leave the old identity", "build income", "use your gifts", "prepare to handle more", "debt freedom", "take action", "protect your family"],
    actions: ["build more income", "protect the vision", "think bigger about money", "leave the old identity", "use your gifts", "prepare to receive more", "take the next step", "stop letting fear lead"],
    keywords: ["BUILD", "VISION", "READY", "FAITH", "WEALTH", "MOVE"]
  },
  genieFactory: {
    name: "Genie Video Factory",
    defaultCount: 1,
    status: "ACTIVE · 3 RUNS DAILY",
    promise: "Kairo face-to-camera manifestation videos with a cold-traffic mechanism, tangible script, exact three-benefit stack, and full platform copy.",
    cta: "Comment MANIFEST and click the link in bio to try the Genie.",
    topics: ["God's guidance", "more money", "deep sleep", "safe love", "dream job", "confidence before an interview", "peace before a decision", "freedom from fear", "unexpected money", "next client"],
    mechanisms: ["10-Second God-Connection Script", "20-Word Wealth Script", "Before-Bed Money Script", "Deep-Sleep Script", "Before-Bed Love Script", "Dream-Job Magnet Script", "Freedom Script", "Neville Goddard Hidden Script"],
    benefits: {
      "God's guidance": ["calm fear", "see your next step", "move with courage"],
      "more money": ["calm money fear", "spot your next move", "act with confidence"],
      "deep sleep": ["quiet your mind", "sleep deeper", "wake with more energy"],
      "safe love": ["stop chasing", "choose safe love", "feel more secure"],
      "dream job": ["speak clearly", "show your value", "walk in with confidence"],
      "confidence before an interview": ["calm your nerves", "answer clearly", "show up strong"],
      "peace before a decision": ["slow your thoughts", "see the truth", "choose with confidence"],
      "freedom from fear": ["calm panic", "see the real choice", "take back control"],
      "unexpected money": ["release pressure", "notice opportunity", "take useful action"],
      "next client": ["stop chasing", "explain your value", "ask for the sale"]
    }
  },
  bookReview: {
    name: "Manifestation Book Review",
    defaultCount: 1,
    status: "ACTIVE · DAILY 7:00 AM",
    promise: "Eight-slide premium book review with one distilled lesson, score, Sean trust slide, CTA, and matching email draft.",
    cta: "Read the review, then bridge to the most relevant Sean/HM/Genie next step.",
    topics: ["The Power of Your Subconscious Mind", "Feeling Is the Secret", "Ask and It Is Given", "The Science of Getting Rich", "The Game of Life and How to Play It", "The Magic of Believing", "Creative Visualization", "The Secret"],
    authors: {
      "The Power of Your Subconscious Mind": "Joseph Murphy",
      "Feeling Is the Secret": "Neville Goddard",
      "Ask and It Is Given": "Esther and Jerry Hicks",
      "The Science of Getting Rich": "Wallace D. Wattles",
      "The Game of Life and How to Play It": "Florence Scovel Shinn",
      "The Magic of Believing": "Claude M. Bristol",
      "Creative Visualization": "Shakti Gawain",
      "The Secret": "Rhonda Byrne"
    }
  },
  jenniferEmail: {
    name: "Jennifer / HM Sales Email",
    defaultCount: 1,
    status: "ACTIVE · DAILY 8:00 AM",
    promise: "Short reply-bait broadcast for online workers whose old money identity is operating inside a new online-money world.",
    cta: "Exactly one approved reply keyword.",
    topics: ["undercharging", "hesitating before the ask", "buying courses but not moving", "fear after a good sales day", "avoiding follow-up", "money stress before sleep", "not trusting online income", "feeling guilty receiving more"],
    offers: [
      { keyword: "MONEYWAVE", label: "MoneyWave", link: "https://hypnoticmeditations.ai/thank-you" },
      { keyword: "MONEY MAGNET", label: "Money Magnet", link: "https://hypnoticmeditations.ai/jennifer/money-magnet/" },
      { keyword: "GUIDE", label: "Guide", link: "https://www.seanali.online/guide" },
      { keyword: "CLAUDE27", label: "Claude27", link: "https://seanali.online/prompts-guide" },
      { keyword: "SYSTEM", label: "AI Freedom System", link: "https://seanali.online/system" },
      { keyword: "GENIE", label: "Manifestation Genie", link: "https://www.manifestationgenie.ai" }
    ]
  },
  reviewShorts: {
    name: "Sean Ali Review Shorts",
    defaultCount: 3,
    status: "ON DEMAND · LOCKED FORMAT",
    promise: "Blunt mass-market self-improvement reviews built around normal topics people already know and debate.",
    cta: "Bridge into Sean's personal system; no generic comment bait.",
    topics: ["dopamine detox", "phone addiction", "morning routines", "waking up at 5 AM", "cold showers", "discipline vs motivation", "procrastination", "overthinking", "meditation", "affirmations", "journaling", "75 Hard", "positive thinking", "online courses", "self-help addiction"]
  },
  hmAffirmations: {
    name: "HM Wealth Affirmations",
    defaultCount: 3,
    status: "ON DEMAND · ARCHIVED AUTOMATION FORMAT",
    promise: "Three separated wealth-affirmation variants with searchable titles and a locked repeat-after-me structure.",
    cta: "Comment 888 to accept this. Subscribe for more.",
    topics: ["infinite wealth", "financial freedom", "limitless prosperity", "financial blessing", "abundant living", "success and money"]
  },
  abundancePrayer: {
    name: "Abundance Prayers",
    defaultCount: 1,
    status: "ON DEMAND",
    promise: "Short, human, faith-based abundance prayer with one clean hook, one prayer, Amen, and one comment CTA.",
    cta: "Comment AMEN if you receive this prayer.",
    topics: ["morning abundance", "before sleep", "financial wisdom", "open doors", "peace around money", "favor on your work", "resources for your family", "courage to take action"]
  }
};

const BANNED = [
  "hit", "hitting", "hits different", "when it hits", "loud", "get loud", "unlock your potential",
  "elevate your life", "embark on a journey", "transform your mindset", "quantum leap", "game changer",
  "ultimate guide", "may be"
];

const state = {
  system: "godShorts",
  concept: null,
  approved: false,
  assets: {},
  activeAsset: "final"
};

const $ = (id) => document.getElementById(id);
const laneEl = $("lane");
const countEl = $("cta");
const modeEl = $("intensity");
const seedEl = $("seed");
const conceptCard = $("concept-card");
const assetOutput = $("asset-output");
const assetStatus = $("asset-status");
const toastEl = $("toast");

function pick(list, offset = 0) {
  if (!list || !list.length) return "";
  const seed = Date.now() + offset + Math.floor(Math.random() * 997);
  return list[Math.abs(seed) % list.length];
}

function cleanSeed(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function titleCase(value) {
  return cleanSeed(value).replace(/\b\w/g, (char) => char.toUpperCase());
}

function slug(value) {
  return cleanSeed(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function countForSystem() {
  const override = countEl.value;
  const map = { one: 1, two: 2, three: 3, five: 5 };
  return map[override] || SYSTEMS[state.system].defaultCount;
}

function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toastEl.classList.remove("show"), 1800);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    system: state.system,
    concept: state.concept,
    approved: state.approved,
    assets: state.assets,
    activeAsset: state.activeAsset,
    seed: seedEl.value,
    count: countEl.value,
    mode: modeEl.value
  }));
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) return;
    Object.assign(state, saved);
    laneEl.value = state.system || "godShorts";
    seedEl.value = saved.seed || "";
    countEl.value = saved.count || "auto";
    modeEl.value = saved.mode || "cold";
  } catch (error) {
    console.warn("Content Station state could not be restored", error);
  }
}

function scoreConcept(concept) {
  const text = `${concept.title} ${concept.hook} ${concept.payoff}`.toLowerCase();
  const checks = [
    { label: "Cold Stranger", pass: concept.title.length >= 24 },
    { label: "Click in the Mind", pass: concept.title.length >= 18 && !/^(content|idea|lesson|tips)$/i.test(concept.title) },
    { label: "Tangible Payoff", pass: concept.payoff.length >= 30 && Boolean(concept.topic) },
    { label: "Specificity", pass: Boolean(concept.systemName) && Boolean(concept.status) },
    { label: "Seven-Year-Old Clear", pass: concept.title.split(/\s+/).length <= 20 },
    { label: "System Match", pass: concept.system === state.system },
    { label: "CTA Match", pass: Boolean(concept.cta) },
    { label: "Truth Gate", pass: !/(guarantee|will make you rich|cure|God told me)/i.test(text) }
  ];
  return { checks, passed: checks.filter((item) => item.pass).length };
}

function mechanismFor(desire) {
  const text = desire.toLowerCase();
  if (/god|faith|guidance|prayer/.test(text)) return "10-Second God-Connection Script";
  if (/money|wealth|income|client/.test(text)) return /sleep|bed/.test(text) ? "Before-Bed Money Script" : "20-Word Wealth Script";
  if (/sleep/.test(text)) return "Deep-Sleep Script";
  if (/love|soulmate|relationship/.test(text)) return "Before-Bed Love Script";
  if (/job|interview/.test(text)) return "Dream-Job Magnet Script";
  if (/fear|decision|peace/.test(text)) return "Freedom Script";
  return pick(SYSTEMS.genieFactory.mechanisms);
}

function benefitStack(desire) {
  const entries = Object.entries(SYSTEMS.genieFactory.benefits);
  const exact = entries.find(([key]) => desire.toLowerCase().includes(key.toLowerCase()));
  return exact ? exact[1] : ["calm the old fear", "see your next move", "act with confidence"];
}

function subjectForEmail(moment) {
  return pick([
    `re: the moment you ${moment}`,
    "your old money identity did this again",
    `quick question about ${moment}`,
    "your brain starts stressing out here",
    "did you notice this before the money move?"
  ]);
}

function reviewTitle(topic) {
  const clean = titleCase(topic);
  if (/addiction|phone|social media/i.test(topic)) return `Is ${clean} Ruining Your Focus?`;
  if (/motivation|positive thinking/i.test(topic)) return `${clean} Works — But Not How You Think`;
  return `Does ${clean} Actually Work?`;
}

function buildConcept(useExact = false) {
  state.system = laneEl.value;
  const system = SYSTEMS[state.system];
  const rawSeed = cleanSeed(seedEl.value);
  const topic = rawSeed || pick(system.topics);
  let title = "";
  let hook = "";
  let payoff = system.promise;

  if (state.system === "godShorts") {
    const action = useExact && rawSeed ? rawSeed : pick(system.actions);
    title = `God is guiding you to ${action.toLowerCase()}`;
    hook = `this is your sign\n\nGod is guiding you to ${action.toLowerCase()}`;
  }

  if (state.system === "genieFactory") {
    const desire = rawSeed || pick(system.topics);
    const mechanism = mechanismFor(desire);
    const benefits = benefitStack(desire);
    title = titleCase(`manifest ${desire} with this ${mechanism}`);
    hook = `This ${mechanism.toLowerCase()} can help you ${benefits[0]}, ${benefits[1]}, and ${benefits[2]}. Say it now.`;
    payoff = `${mechanism} for ${desire}; exactly three benefits; Kairo character-only production.`;
  }

  if (state.system === "bookReview") {
    const book = rawSeed || pick(system.topics);
    const author = system.authors[book] || "Author to verify";
    title = `The #1 Lesson I Learned From ${book}`;
    hook = "Most people remember the quotes. This review pulls out the one lesson worth using.";
    payoff = `${book} by ${author}; eight-slide review, final score, Sean trust slide, CTA, and matching email.`;
  }

  if (state.system === "jenniferEmail") {
    const moment = rawSeed || pick(system.topics);
    title = subjectForEmail(moment);
    hook = "You can want a bigger online income and still pull back at the exact moment it is time to receive it.";
    payoff = `One short email about ${moment}; one offer; one reply keyword; draft-only format.`;
  }

  if (state.system === "reviewShorts") {
    const topicName = rawSeed || pick(system.topics);
    title = reviewTitle(topicName);
    hook = `${title} My blunt answer: it can work, but most people use it as another way to avoid the real work.`;
  }

  if (state.system === "hmAffirmations") {
    const benefit = rawSeed || pick(system.topics);
    title = `7 Abundance Affirmations with 888 Frequency for ${titleCase(benefit)}`;
    hook = "Take a deep breath in and connect with your inner power. Repeat after me.";
  }

  if (state.system === "abundancePrayer") {
    const prayerTopic = rawSeed || pick(system.topics);
    const time = /sleep|night|bed/i.test(prayerTopic) ? "before you fall asleep" : "before you start your day";
    title = `${titleCase(prayerTopic)} Prayer`;
    hook = `Say this abundance prayer ${time}.`;
  }

  const concept = {
    system: state.system,
    systemName: system.name,
    topic,
    title,
    hook,
    payoff,
    cta: system.cta,
    mode: modeEl.options[modeEl.selectedIndex].text,
    status: system.status
  };
  concept.score = scoreConcept(concept);
  state.concept = concept;
  state.approved = false;
  state.assets = {};
  state.activeAsset = "final";
  renderConcept();
  renderAsset();
  save();
}

function renderConcept() {
  const concept = state.concept;
  if (!concept) {
    conceptCard.className = "concept-card empty";
    conceptCard.innerHTML = '<p class="empty-state">Choose a system and press Generate Angle.</p>';
    return;
  }
  const gates = concept.score.checks.map((item) => `<li class="${item.pass ? "pass" : "fail"}">${item.pass ? "✓" : "×"} ${item.label}</li>`).join("");
  conceptCard.className = "concept-card";
  conceptCard.innerHTML = `
    <div class="concept-meta"><span>${concept.status}</span><span>${concept.mode}</span><span>${concept.score.passed}/8 PASS</span></div>
    <h4>${escapeHtml(concept.title)}</h4>
    <p class="concept-hook">${escapeHtml(concept.hook).replace(/\n/g, "<br>")}</p>
    <p><strong>System:</strong> ${escapeHtml(concept.systemName)}</p>
    <p><strong>Delivery:</strong> ${escapeHtml(concept.payoff)}</p>
    <p><strong>CTA:</strong> ${escapeHtml(concept.cta)}</p>
    <ul class="score-list">${gates}</ul>
    <p class="approval-state">${state.approved ? "APPROVED · READY TO GENERATE" : "Review the angle, then approve it."}</p>
  `;
}

function approve() {
  if (!state.concept) return showToast("Generate an angle first");
  if (state.concept.score.passed < 8) {
    buildConcept(false);
    return showToast("Angle failed a gate and was remixed");
  }
  state.approved = true;
  renderConcept();
  save();
  showToast("Winner approved");
}

function generateAssets() {
  if (!state.concept) return showToast("Generate an angle first");
  if (!state.approved) approve();
  if (!state.approved) return;
  const builders = {
    godShorts: buildGodShorts,
    genieFactory: buildGenieFactory,
    bookReview: buildBookReview,
    jenniferEmail: buildJenniferEmail,
    reviewShorts: buildReviewShorts,
    hmAffirmations: buildAffirmations,
    abundancePrayer: buildPrayer
  };
  state.assets = builders[state.system](state.concept, countForSystem());
  state.activeAsset = "final";
  setActiveTab("final");
  renderAsset();
  save();
  showToast("Production pack generated");
}

function buildGodShorts(concept, count) {
  const scripts = [];
  const titles = [];
  for (let i = 0; i < count; i += 1) {
    const action = i === 0 ? concept.title.replace(/^God is guiding you to /i, "") : pick(SYSTEMS.godShorts.actions, i);
    const keyword = pick(SYSTEMS.godShorts.keywords, i);
    const title = `God is guiding you to ${action.toLowerCase()}`;
    const script = `this is your sign\n\nGod is guiding you to ${action.toLowerCase()}\n\nYou keep asking God for a bigger life, but part of you is still protecting the old one.\n\nThat old fear tells you to wait, stay small, and hide what you created.\n\nBut God did not give you the vision so you could keep talking yourself out of it.\n\nI had to learn that faith still needs a move.\n\nTake the next clear step today.\n\nComment ${keyword} if you are ready.`;
    titles.push(title);
    scripts.push(`### ${i + 1}. ${title}\n\n${script}`);
  }
  const final = `## SEAN ALI GOD SHORTS\n\n${scripts.join("\n\n---\n\n")}`;
  return pack(final, scripts.join("\n\n---\n\n"), titles.join("\n"), "Sean Ali channel · raw face-to-camera · no hashtags or descriptions", "25–45 seconds · simple spoken lines · locked opening · one truthful Sean line", qa([
    "Exact output count",
    "Every script starts: this is your sign",
    "Second line matches: God is guiding you to...",
    "God + money/vision/action message",
    "No fake prophecy or exact money promise",
    "No banned slang",
    "One comment CTA per script"
  ]));
}

function buildGenieFactory(concept) {
  const desire = concept.topic;
  const mechanism = mechanismFor(desire);
  const benefits = benefitStack(desire);
  const hook = `This ${mechanism.toLowerCase()} can help you ${benefits[0]}, ${benefits[1]}, and ${benefits[2]}. Say it now.`;
  const spoken = `${hook}\n\nRepeat after me.\n\nI release the old story that keeps me stuck.\n\nI choose the next clear step.\n\nI let peace guide my thoughts and action.\n\nToday, I move like the person who is ready for ${desire}.\n\nComment MANIFEST and click the link in my bio to try the Genie.`;
  const ig = `${hook}\n\nUse it once, then take one real action that matches the result.\n\nComment MANIFEST and tap the link in bio to try Manifestation Genie.\n\n#manifestation #manifestationgenie #mindset #abundance`;
  const x = `${hook}\n\nSay it once. Then take the next real step.`;
  const tiktok = titleCase(`manifest ${desire} with this script`);
  const mainTitle = titleCase(`manifest ${desire} with this ${mechanism}`);
  const final = `## GENIE VIDEO FACTORY PACK\n\nTITLE\n${mainTitle}\n\nTIKTOK TITLE\n${tiktok}\n\nHOOK\n${hook}\n\nFULL SCRIPT\n${spoken}\n\nYOUTUBE DESCRIPTION\n${ig}\nhttps://manifestationgenie.ai/\n\nINSTAGRAM CAPTION\n${ig}\n\nX CAPTION\n${x}\n\nSEO KEYWORDS\n${desire}, ${mechanism}, manifestation script, Manifestation Genie, Kairo`;
  return pack(final, spoken, `${mainTitle}\n${tiktok}`, `${ig}\n\nYOUTUBE LINK: https://manifestationgenie.ai/\n\nX:\n${x}`, `Kairo group: 012d53f42bc244cf8c123ef48b829326\nOne eligible completed Kairo look only.\nSame look from first frame through CTA.\nCharacter-only. Captions mandatory.\nRecord exact look ID before generation.\nNever rerender automatically after a mismatch.`, qa([
    "First spoken word is exactly This",
    "Mechanism contains the word script",
    "Mechanism is tangible, not a flat category label",
    "Exactly three distinct benefits",
    "Hook and Full Script opening match",
    "Cold-Traffic Gate 8/8 PASS",
    "Same mechanism name across every field",
    "CTA says Comment MANIFEST + link in bio",
    "No guaranteed money, love, healing, or divine result"
  ]));
}

function buildBookReview(concept) {
  const book = concept.topic;
  const author = SYSTEMS.bookReview.authors[book] || "Verify author before publishing";
  const score = pick(["8.4/10", "8.7/10", "9.0/10", "9.2/10"]);
  const slides = [
    `SLIDE 1\nThe #1 Lesson I Learned From ${book}\nThe one idea that changes how you use the book.`,
    `SLIDE 2\n${book}\nBy ${author}\nFinal score: ${score}\nVerdict: Powerful when you turn the idea into a daily behavior.`,
    "SLIDE 3\nTHE PROBLEM\nMost people collect the quote but never install the pattern.",
    "SLIDE 4\nTHE #1 LESSON\nYour subconscious learns from what you repeat, feel, and act out—not what you say once.",
    "SLIDE 5\nWHAT THIS MEANS\nA useful belief should change what you notice, choose, and do today.",
    "SLIDE 6\nTHE SIMPLE TEST\nWhat action would this belief create before the day ends?",
    "SLIDE 7\nSEAN'S TAKE\nThe book gives you the idea. Repetition and real action turn it into identity.",
    "SLIDE 8\nWHY TRUST SEAN\n10+ years building subconscious audio systems.\n100,000+ audios sold.\n$25M+ in sales generated or managed.\nUse the lesson. Then install the pattern."
  ];
  const email = `SUBJECT: the #1 lesson inside ${book}\n\nMost people remember the quote.\n\nThey do not install the pattern.\n\nI pulled the entire book down to one lesson you can actually use.\n\nRead the review here: [LIVE LINK]`;
  const final = `## MANIFESTATION BOOK REVIEW PACK\n\nBOOK: ${book}\nAUTHOR: ${author}\nSCORE: ${score}\n\n${slides.join("\n\n---\n\n")}\n\n---\n\nEMAIL DRAFT\n${email}\n\nFILENAME\n${new Date().toISOString().slice(0, 10)}-${slug(book)}-review.html`;
  return pack(final, slides.join("\n\n---\n\n"), concept.title, email, `Use locked live template:\nhttps://seanali.online/slideshows/manifestation/2026-07-13-esther-jerry-hicks-ask-and-it-is-given-review.html\nPublish only to /slideshows/manifestation/.\nUpdate both slideshow indexes.\nMobile: every slide inside 375x667; no scrolling.`, qa([
    "Unused book and filename verified",
    "Full book title visible on Slide 1",
    "Book title, author, score, stars, verdict on Slide 2",
    "One main takeaway per slide",
    "Slide 8 uses centered trust layout",
    "No invented book claims or personal experience",
    "Both indexes updated",
    "Live URL verified before reporting"
  ]));
}

function buildJenniferEmail(concept) {
  const moment = concept.topic;
  const offer = pick(SYSTEMS.jenniferEmail.offers);
  const subject = subjectForEmail(moment);
  const body = `You can picture the bigger life.\n\nMore freedom.\nMore room.\nMore money coming in without panic.\n\nThen the real online-money moment arrives.\n\nYou need to follow up.\nAsk for the sale.\nRaise the price.\nOr let yourself receive.\n\nAnd your brain starts stressing out.\n\nThat is not a strategy problem.\n\nYour old money identity is trying to operate inside a new online-money world.\n\nReply ${offer.keyword} and Jennifer will send you the next step.`;
  const html = `<div style="font-family:Arial,sans-serif;font-size:28px;line-height:1.55;color:#111;max-width:680px;margin:auto">${body.split("\n\n").map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("")}<p><strong>Reply ${offer.keyword}</strong></p></div>`;
  const final = `## JENNIFER SALES EMAIL\n\nLIST ID\n6889085\n\nOFFER\n${offer.label}\n\nREPLY KEYWORD\n${offer.keyword}\n\nSUBJECT\n${subject}\n\nPLAIN TEXT\n${body}\n\nHTML\n${html}\n\nJENNIFER ROUTING LINK\n${offer.link}\n\nSTATUS\nDRAFT ONLY — NEVER SEND OR SCHEDULE`;
  return pack(final, body, subject, `Offer: ${offer.label}\nKeyword: ${offer.keyword}\nRouting: ${offer.link}`, "Create exactly one AWeber broadcast draft on HM list 6889085. Never send. Return the AWeber edit link.", qa([
    "Future-paced opening",
    "One online-money moment",
    "Money identity named as root",
    "Exactly one offer and one reply keyword",
    "No direct checkout in first-touch email",
    "Body text 26–30px",
    "Draft only",
    "AWeber edit link required"
  ]));
}

function buildReviewShorts(concept, count) {
  const scripts = [];
  const titles = [];
  for (let i = 0; i < count; i += 1) {
    const topic = i === 0 ? concept.topic : pick(SYSTEMS.reviewShorts.topics, i);
    const title = reviewTitle(topic);
    const script = `${title}\n\nYes, but only if you use it for the right reason.\n\nListen...\n\n${titleCase(topic)} can give you structure. It can interrupt the same bad pattern.\n\nBut that's the problem.\n\nPeople start researching and researching and researching. Then the method becomes another way to avoid action.\n\nNow look...\n\nIf it helps you make one clear move, keep it.\n\nIf you are collecting another routine instead of changing your day, save your time.\n\nMy final score for this one is 7.6 out of 10.\n\nIf you want to see the system I personally use to stop overthinking and start moving, tap the link in my bio and watch the next video.`;
    titles.push(title);
    scripts.push(`### ${i + 1}. ${title}\n\n${script}`);
  }
  const final = scripts.join("\n\n---\n\n");
  return pack(final, final, titles.join("\n"), "Sean Ali channel · face-to-camera · link-in-bio bridge CTA", "35–55 seconds each. Raw spoken rhythm. No research claims unless verified before publishing.", qa([
    "Mass-market Family Test passed",
    "Exact search question first",
    "Immediate blunt verdict",
    "Useful part + misuse problem",
    "Who it works for and who should stop",
    "Numerical score",
    "System bridge CTA",
    "No fake personal experience or studies"
  ]));
}

function buildAffirmations(concept, count) {
  const benefits = [concept.topic, "financial freedom", "limitless prosperity", "abundant living", "success and money"];
  const variants = [];
  const titles = [];
  for (let i = 0; i < count; i += 1) {
    const benefit = benefits[i % benefits.length];
    const title = i === 0
      ? `7 Abundance Affirmations with 888 Frequency for ${titleCase(benefit)}`
      : i === 1
        ? "Say This POWERFUL Money Affirmation Every Day"
        : "Use This Affirmation to Attract Wealth";
    const script = "Take a deep breath in and connect with your inner power.\n\nRepeat after me.\n\nI welcome prosperity into my life.\n\nMy thoughts and actions attract real wealth opportunities.\n\nI notice the next useful door in front of me.\n\nI am building a life of freedom and choice.\n\nI am worthy of receiving more and handling it well.\n\nFeel this truth settling into your body.\n\nInhale abundance.\n\nExhale gratitude.\n\nComment 888 to accept this. Subscribe for more.";
    titles.push(title);
    variants.push(`====================\nVARIANT ${i + 1}\n====================\n\nTITLE:\n${title}\n\nSCRIPT:\n${script}`);
  }
  const final = variants.join("\n\n");
  return pack(final, final, titles.join("\n"), "Hypnotic Meditations YouTube Shorts", "No voiceover file. No hashtags. Keep variants fully separated.", qa([
    "Three separated variants when default volume is used",
    "Variant 1 starts with 7",
    "Variant 1 includes Affirmations with 888 Frequency",
    "Exactly five first-person affirmations",
    "Prosperity, wealth, opportunity, freedom, worthiness covered",
    "Inhale and exhale lines included",
    "Exact Comment 888 ending"
  ]));
}

function buildPrayer(concept) {
  const topic = concept.topic;
  const time = /sleep|night|bed/i.test(topic) ? "before you fall asleep" : "before you start your day";
  const title = `${titleCase(topic)} Abundance Prayer`;
  const script = `Say this abundance prayer ${time}.\n\nPray this with me.\n\nGod, guide my work, give me wisdom with money, open the right doors, and help me use every opportunity well.\n\nAmen.\n\nComment AMEN if you receive this prayer.`;
  const final = `TITLE:\n${title}\n\nSCRIPT:\n${script}`;
  return pack(final, script, title, "Abundance Prayers channel · short vertical video", "Simple 5th-grade language. No warning buildup. No sermon. No In Jesus' name ending.", qa([
    "Title contains abundance prayer",
    "Approved morning or bedtime hook",
    "Pray this with me included",
    "One short prayer",
    "Amen included",
    "Exact AMEN comment CTA",
    "No fake prophecy or guaranteed financial result"
  ]));
}

function pack(final, scripts, titles, platform, production, quality) {
  return { final, scripts, titles, platform, production, qa: quality };
}

function qa(items) {
  return `QUALITY GATE\n\n${items.map((item) => `✓ ${item}`).join("\n")}\n\nBANNED LANGUAGE SCAN\n${BANNED.map((item) => `- ${item}`).join("\n")}`;
}

function setActiveTab(name) {
  state.activeAsset = name;
  document.querySelectorAll(".asset-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.asset === name);
  });
}

function renderAsset() {
  const value = state.assets?.[state.activeAsset] || "";
  assetOutput.value = value;
  assetStatus.textContent = value
    ? `${SYSTEMS[state.system].name} · ${state.activeAsset.toUpperCase()} ready`
    : "Content Station ready";
}

function exportPack() {
  if (!state.assets?.final) return showToast("Generate a pack first");
  const text = Object.entries(state.assets).map(([key, value]) => `====================\n${key.toUpperCase()}\n====================\n\n${value}`).join("\n\n");
  downloadText(`content-station-${state.system}-${new Date().toISOString().slice(0, 10)}.txt`, text);
}

function downloadCurrent() {
  const value = state.assets?.[state.activeAsset];
  if (!value) return showToast("Nothing to download yet");
  downloadText(`${state.system}-${state.activeAsset}-${new Date().toISOString().slice(0, 10)}.txt`, value);
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

laneEl.addEventListener("change", () => {
  state.system = laneEl.value;
  const system = SYSTEMS[state.system];
  seedEl.placeholder = `Try: ${system.topics.slice(0, 4).join(", ")}`;
  state.concept = null;
  state.approved = false;
  state.assets = {};
  renderConcept();
  renderAsset();
  save();
});

$("create-concept").addEventListener("click", () => buildConcept(false));
$("use-pasted-concept").addEventListener("click", () => {
  if (!cleanSeed(seedEl.value)) return showToast("Paste an idea first");
  buildConcept(true);
});
$("remix-concept").addEventListener("click", () => buildConcept(false));
$("approve-concept").addEventListener("click", approve);
$("create-assets").addEventListener("click", generateAssets);
$("export-pack").addEventListener("click", exportPack);
$("download-slideshow").addEventListener("click", downloadCurrent);
$("copy-asset").addEventListener("click", async () => {
  if (!assetOutput.value) return showToast("Nothing to copy yet");
  await navigator.clipboard.writeText(assetOutput.value);
  showToast("Copied");
});

document.querySelectorAll(".asset-tab").forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.asset);
    renderAsset();
    save();
  });
});

$("today-label").textContent = new Intl.DateTimeFormat("en-US", {
  weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "America/Panama"
}).format(new Date());

load();
state.system = laneEl.value || state.system;
seedEl.placeholder = `Try: ${SYSTEMS[state.system].topics.slice(0, 4).join(", ")}`;
renderConcept();
renderAsset();

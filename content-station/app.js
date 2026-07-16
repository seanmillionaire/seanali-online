const STORAGE_KEY = "seanContentPrinterV1";

const SEAN_CONTENT_BRAIN = {
  source: "content-station/brain",
  operatorBeliefs: {
    revenueFilters: [
      "Does this help acquire customers?",
      "Does this help customers spend more?",
      "Does this increase retention, trust, or LTV?"
    ],
    principles: [
      "Revenue first",
      "New customers daily",
      "Increase customer spend",
      "AI first",
      "Systems over tiny files",
      "Raw over corporate",
      "High persuasion",
      "Real delivery"
    ]
  },
  voice: {
    style: ["direct", "simple", "short lines", "kitchen table", "operator, not guru", "raw over polished"],
    avoid: ["AI tone", "corporate tone", "guru language", "therapy language", "long paragraphs", "motivational fluff"]
  },
  sourceDocs: {
    installedFrom: "Google Drive / DOCS",
    folderUrl: "https://drive.google.com/drive/folders/1DUlbDuvPaalp_eF3WAAIQjHwXlAokFKg",
    installedAt: "2026-06-17",
    localFiles: ["brain/source-index.md", "brain/sean-story.md"],
    files: [
      { title: "sean personal branding.txt", id: "1yx8nV2rzCelF_JQK6KVV9LATVqnXyIc-", role: "identity installation and founder positioning" },
      { title: "sean story.txt", id: "1A_usu_FDknqa0y6YAwEYUcvohNH3nMso", role: "origin story and human proof" },
      { title: "Sean origin for brain training and mindset.txt", id: "1DOeIy1v0KB4txS5n0R13WJhGg8wUFc57", role: "private ritual and before-sleep money visualization" },
      { title: "content to pull from.txt", id: "1Qh04nXFZFvdMHKvp7WiDza9-FXFK5f2E", role: "email style and money-stress positioning" },
      { title: "sean short form content style.txt", id: "1DspNet-GQVczfiHiuffhlv8dBPXMaK2F", role: "short-form kitchen-table voice" },
      { title: "WHO IS SEAN ALI.txt", id: "1nVY0MxQXKk1Hb2Bn5mK7PIJO1ULLJnpx", role: "full founder story and ecosystem" }
    ]
  },
  seanStory: {
    position: "Sean helps ambitious people remove the internal brake that keeps them stuck.",
    category: "Identity Installation",
    authorityProof: [
      "10+ years developing subconscious reprogramming audio systems",
      "15+ years using audio, theta, hypnosis, and visualization as private operator tools",
      "100,000+ audio programs/customers served through Hypnotic Meditations",
      "paid acquisition and direct-response experience behind major manifestation brands"
    ],
    originBeats: [
      "Canada single-parent home, scarcity, stress, and survival energy around him",
      "cancer diagnosis at 15 gave him perspective early",
      "computers, internet, and music became the escape route",
      "first online sale proved the internet could create freedom",
      "first money visualization before sleep showed him the mind could be trained before sleep",
      "Panama became proof that internal shift plus internet leverage could create freedom"
    ],
    signatureLines: [
      "Before this was a product, it was Sean's private ritual.",
      "Most people are not lazy. They are internally blocked.",
      "You are not broken. You are patterned. And patterns can be changed.",
      "You do not have to inherit the future you were born into.",
      "Every day your brain is practicing who you are. Sean changes what it is practicing."
    ],
    contentRule: "Every concept and asset needs at least one Sean-source proof beat: story, private ritual, authority, founder observation, customer/system proof, or Panama/freedom proof.",
    avoidFrames: ["random manifestation account", "generic Neville lesson", "theta theory lecture", "spiritual guru", "corporate wellness"]
  },
  contentRules: {
    titleRequirements: [
      { key: "number", label: "Number", pattern: "\\b\\d+\\b|#\\d" },
      { key: "clickbait", label: "Clickbait", pattern: "\\b(secret|hidden|nobody|strange|why|signs|watch what happens|mistake|truth|coming|closer|faster|fails|fail|stops|miracle|dangerous|untold|leaked|real|warning|exposed|insane|easy|changed|stole|stop|pov|proof|replace|broke|wrong|confirmation|increase|doors|opening|shifting)\\b" },
      { key: "outcome", label: "Outcome", pattern: "\\b(money|wealth|millionaire|income|success|freedom|sleep|miracle|breakthrough|clear|calm|confidence|panama|ai|business|leverage|operator|rich|reality|timeline|season|territory|capacity|blessing|expansion)\\b" },
      { key: "timeframe", label: "Timeframe", pattern: "\\b(tonight|morning|before sleep|before bed|7 days|7 minute|one hour|100-year|today|this week|2026|next \\d+ days|in \\d+ days|in \\d+ minutes|in panama|after leaving|after 100 years)\\b" }
    ],
    naturalTitleRule: "Timeframes must read naturally. Do not bolt tonight onto the end.",
    formula: ["pattern interrupt", "problem nobody says out loud", "new belief", "proof or example", "simple next step", "CTA"]
  },
  validationTeam: {
    maxScore: 60,
    publishLine: 42,
    validators: [
      { key: "mrbeast", name: "MrBeast", question: "Would millions care?" },
      { key: "hormozi", name: "Hormozi", question: "Does this create demand?" },
      { key: "dan", name: "Dan", question: "Does this build authority?" },
      { key: "tai", name: "Tai", question: "Existing market?" },
      { key: "sean", name: "Sean", question: "Proud in 5 years?" },
      { key: "market", name: "Market", question: "Would a stranger search today?" }
    ]
  },
  searchTerms: [
    "neville", "goddard", "think and grow rich", "wallace wattles", "science of getting rich",
    "manifestation", "law of attraction", "theta", "binaural", "panama", "ai", "money",
    "wealth", "sleep", "book", "signs", "identity", "freedom"
  ],
  viralTerms: [
    "secret", "hidden", "nobody", "wrong", "why", "how", "signs", "mistake", "truth",
    "before", "tonight", "morning", "millionaire", "watch", "stops", "fails", "changed",
    "warning", "exposed", "leaked", "insane", "easy", "stole", "dangerous", "confirmation",
    "increase", "expanding", "territory", "doors", "season", "timeline", "swiftly"
  ],
  trendTerms: [
    "ai", "money", "wealth", "manifestation", "neville", "sleep", "operator", "freedom",
    "panama", "identity", "book", "100-year", "law of attraction"
  ],
  humanTerms: [
    "most people", "you", "if ", "why", "nobody", "real", "wrong", "feel", "tonight",
    "before sleep", "what", "stop", "this is for you", "type in the comments", "comment"
  ],
  slideshowStyle: {
    preferredSlideCount: 13,
    structure: [
      "Big curiosity title",
      "Hidden problem",
      "Kitchen-table explanation",
      "Sean story beat",
      "Big shift",
      "Why this clicks",
      "7-minute move",
      "What changes",
      "Sean/Neville frame",
      "One move",
      "Recap",
      "Final question",
      "CTA"
    ]
  },
  assetQuality: {
    minimumSlides: 10,
    preferredSlides: 13,
    shortsMinimumAngles: 7,
    checks: ["specific pain", "curiosity", "belief shift", "CTA", "matches selected concept", "does not sound generic"]
  },
  bannedLanguage: [
    "unlock your potential",
    "elevate your life",
    "embark on a journey",
    "transform your mindset",
    "manifestation made easy",
    "tap into abundance",
    "quantum leap into success",
    "unleash your power",
    "step into greatness",
    "create the life of your dreams",
    "high vibration",
    "limitless potential",
    "in today's fast-paced world",
    "game changer",
    "ultimate guide",
    "I hope this email finds you well",
    "Neville mistake",
    "the promise is not more theory",
    "stop rehearsing the problem"
  ],
  offers: {
    genie: {
      useFor: ["manifestation", "Neville Goddard", "assumption", "imagination", "identity", "daily ritual"],
      cta: "Talk To The Genie"
    },
    moneyflow: {
      useFor: ["money stress", "wealth identity", "financial pressure", "before sleep", "money feeling"],
      cta: "Play Money Flow tonight"
    },
    newsletter: {
      useFor: ["education", "operator stories", "freedom", "books", "long-term trust"],
      cta: "Get the next lesson"
    },
    aiFreedom: {
      useFor: ["AI income", "online business", "offers", "funnels", "content systems", "distribution"],
      cta: "Join the AI Freedom System"
    }
  }
};

const sourcePatterns = {
  neville: {
    lane: "Neville Wealth",
    promise: "wealth starts changing when you rehearse the end instead of the problem",
    mechanism: "living from the end",
    proof: "Neville called it living from the end. Sean calls it rehearsing your future before it arrives.",
    titleSeeds: [
      "Neville Goddard: Expect Large Amounts Of Money Tonight",
      "Neville Goddard: Listen To This Once Before Sleep Tonight",
      "Neville Goddard: Use This 7 Minute Wealth Technique",
      "Neville Goddard: Fall Asleep Feeling Wealth",
      "Neville Goddard: The Millionaire Mind Exercise"
    ],
    hooks: [
      "Most people think they have a money problem. Neville would say they have a rehearsal problem.",
      "If you keep rehearsing stress, do not be shocked when stress feels normal.",
      "Neville's wealth secret was not wishing. It was living from the end before the result arrived."
    ]
  },
  wealthBooks: {
    lane: "Hidden Wealth Books",
    promise: "old wealth books get attention because they make timeless money ideas feel newly useful",
    mechanism: "book, opinion, story, modern application",
    proof: "The book gets the click. Sean's interpretation gets the subscriber.",
    titleSeeds: [
      "The 3 Wealth Secrets Hidden in Think and Grow Rich",
      "This 100-Year-Old Wealth Book Predicted AI",
      "The Science of Getting Rich Was Right About Everything",
      "The Wealth Secret Buried for 100 Years",
      "This Book Creates Millionaires (Nobody Reads It)"
    ],
    hooks: [
      "Most people collect quotes from wealth books instead of extracting the rule.",
      "This book is old, but the money lesson is still uncomfortable today.",
      "The book gets the click. The interpretation gets the subscriber."
    ]
  },
  manifestationWrong: {
    lane: "Manifestation Wrong",
    promise: "manifestation gets cleaner when people stop forcing belief and correct the missing piece",
    mechanism: "correction hook",
    proof: "Correction content wins because it explains why something people already tried did not work.",
    titleSeeds: [
      "The Real Reason Manifestation Stops Working",
      "Why Visualization Works Sometimes and Fails Other Times",
      "Why Your Vision Board Isn't Working",
      "The Missing Piece in Neville Goddard",
      "The Truth About Law of Attraction"
    ],
    hooks: [
      "You are not crazy for noticing that manifestation works sometimes and fails other times.",
      "Most people do not need another technique. They need to fix the part they keep skipping.",
      "The mistake is not wanting the result. The mistake is practicing the opposite state all day."
    ]
  },
  sleep: {
    lane: "Before Sleep",
    promise: "your last inner scene tonight becomes the feeling you carry into tomorrow",
    mechanism: "the before-sleep ritual",
    proof: "The biggest titles win with sleep, tonight, morning, one hour, and miracle language.",
    titleSeeds: [
      "Listen To This Once Before Sleep Tonight",
      "It's Coming Tonight",
      "Sleep Miracle: Fall Asleep Feeling This",
      "Do Nothing But This Before Bed Tonight",
      "Listen Every Morning For 7 Days"
    ],
    hooks: [
      "Before sleep tonight, do not replay the problem.",
      "Your last feeling tonight matters more than another ten minutes of scrolling.",
      "If it was already handled, how would you fall asleep?"
    ]
  },
  manifestation: {
    lane: "Neville Manifestation",
    promise: "manifestation gets stronger when the viewer stops forcing belief and changes the state they keep practicing",
    mechanism: "state rehearsal",
    proof: "Neville gets the search. Sean's plain-English frame makes it practical: what you rehearse changes what you do.",
    titleSeeds: [
      "The Problem With Manifestation Nobody Talks About",
      "Same Vision. Same Belief. Different Result. Why?",
      "Manifestation Is Not Magic. It Is Probability.",
      "Stop Asking If It Guarantees Success",
      "What You Rehearse Changes What You Do"
    ],
    hooks: [
      "Sometimes you visualize and it happens. Sometimes nothing moves. That gap matters.",
      "Manifestation does not guarantee the result. It changes what you notice and what you do.",
      "Stop asking if it guarantees success. Ask what it consistently does to you."
    ]
  },
  theta: {
    lane: "Theta Audio Ritual",
    promise: "press play and enter a calm, creative state without forcing meditation",
    mechanism: "theta waves and binaural beats",
    proof: "No hard meditation. Put on headphones, press play, and float into a calm creative zone.",
    titleSeeds: [
      "Theta Waves Made As Easy As Pie",
      "Put On Headphones And Float Into Calm",
      "The 10 Minute Audio Ritual For Calm Ideas",
      "Binaural Beats Explained So Simply",
      "Listen Tonight And Wake Up Clearer"
    ],
    hooks: [
      "No hard meditation. No fancy words. Put on headphones and press play.",
      "Theta is the calm zone between wide awake and deep sleep.",
      "Think of binaural beats like training wheels for meditation."
    ]
  },
  operator: {
    lane: "AI Business",
    promise: "AI business content shows ambitious people how one operator can use AI systems for leverage, speed, and revenue",
    mechanism: "AI operator system",
    proof: "Sean's operator edge is the mix of media buying, funnels, AI systems, offers, and direct response.",
    titleSeeds: [
      "I Used AI To Replace 5 Hours Of Work In 2026",
      "WARNING: AI Won't Make You Money In 2026 Unless You Fix This",
      "Claude Code + YouTube = The AI Money System Nobody Is Using",
      "The 7 AI Operator Moves I Would Use To Build From Zero In 2026",
      "Why 99% Of AI Business Advice Keeps Beginners Broke"
    ],
    hooks: [
      "After you spend real money on ads, cute business advice stops working.",
      "Most people want the dream. Operators learn to love the boring thing that works.",
      "If I had to rebuild from zero, I would start with distribution."
    ]
  },
  freedom: {
    lane: "Panama Untold",
    promise: "Panama content uses location, danger, lifestyle proof, and hidden local details to borrow attention",
    mechanism: "local story, hidden detail, freedom lesson",
    proof: "Panama is proof. The point is not travel. The point is building a life outside the default script.",
    titleSeeds: [
      "Why I Left Canada",
      "Why I Live in Panama",
      "The Hidden Cost of Chasing Money",
      "Why I Chose Freedom Over Status",
      "The One Skill That Gives You Freedom"
    ],
    hooks: [
      "At some point, looking successful is not the same as being free.",
      "The goal was never to look successful. The goal was to own my time.",
      "The internet changed the game, but most people still live by the old rules."
    ]
  },
  signs: {
    lane: "Signs Series",
    promise: "signs content is easy to binge because it helps people diagnose what is changing",
    mechanism: "numbered recognition hooks",
    proof: "Signs content works because the viewer checks themselves against every point.",
    titleSeeds: [
      "3 Signs Success Is Closer Than You Think",
      "5 Signs Your Money Pattern Is Changing",
      "3 Signs Your Manifestation Is Working",
      "7 Signs The Result Is Getting Closer",
      "3 Signs Your Identity Is Changing"
    ],
    hooks: [
      "If these signs are showing up, something is shifting.",
      "Most people miss the early signs because they only look for the final result.",
      "The result usually starts quietly before it becomes obvious."
    ]
  },
  nobodyTalks: {
    lane: "Nobody Talks About This",
    promise: "nobody-talks-about-this angles create curiosity by naming the part people feel but rarely say",
    mechanism: "unsaid truth",
    proof: "This format works because it promises relief from confusion, not another generic tip.",
    titleSeeds: [
      "The Money Secret Nobody Talks About",
      "The Problem With Success Nobody Talks About",
      "The Hidden Cost of Ambition",
      "The Real Reason Most People Stay Broke",
      "The Part of Neville Goddard Everyone Ignores"
    ],
    hooks: [
      "There is a part of success people avoid saying out loud.",
      "Most advice skips the part that actually makes the whole thing hard.",
      "This is not the popular answer, but it is the useful one."
    ]
  },
  oldWealth: {
    lane: "Wallace Wattles",
    promise: "old money principles feel powerful when connected to today's internet, AI, and creator economy",
    mechanism: "old principle, modern proof",
    proof: "A 100-year-old wealth idea becomes new when Sean shows how it applies to AI, attention, and online leverage.",
    titleSeeds: [
      "A 100-Year-Old Wealth Secret That Still Works",
      "The Wealth Law Hidden Since 1910",
      "Wallace Wattles Predicted Modern Success",
      "The Millionaire Lesson Buried in an Old Book",
      "The Secret Law of Wealth"
    ],
    hooks: [
      "This idea is over 100 years old, and the internet made it more true.",
      "Old wealth books were not talking about AI, but they were talking about leverage.",
      "The principle is old. The application is new."
    ]
  },
  identity: {
    lane: "Identity Installation",
    promise: "results become easier to repeat when the future self stops feeling foreign",
    mechanism: "identity rehearsal",
    proof: "Sean's long-term moat is helping people install the future before they live it.",
    titleSeeds: [
      "The Identity Shift Behind Every Breakthrough",
      "Identity Beats Motivation Every Time",
      "The Future Self Exercise That Changed My Life",
      "Install the Future Before You Live It",
      "Confidence Is a Rehearsal Problem"
    ],
    hooks: [
      "Motivation fades when the new identity still feels fake.",
      "You do not rise to a future that feels foreign.",
      "The future self has to become familiar before the result repeats."
    ]
  }
};

const ctas = {
  auto: {
    name: "Auto by lane",
    action: "Auto by lane",
    url: "",
    line: ""
  },
  genie: {
    name: "Manifestation Genie",
    action: "Talk To The Genie",
    url: "https://manifestationgenie.ai/",
    line: "Ask the Genie what you are rehearsing today and get your next ritual."
  },
  moneyflow: {
    name: "Money Flow",
    action: "Play Money Flow Tonight",
    url: "https://hypnoticmeditations.ai/pages/moneyflow",
    line: "Play Money Flow before sleep and rehearse wealth instead of stress."
  },
  newsletter: {
    name: "Sean's Newsletter",
    action: "Get The Next Lesson",
    url: "https://seanali.online",
    line: "Get Sean's next mindset, wealth, and success lesson."
  }
};

const recommendedCtas = {
  neville: "genie",
  wealthBooks: "newsletter",
  manifestationWrong: "genie",
  sleep: "moneyflow",
  manifestation: "genie",
  theta: "newsletter",
  operator: "newsletter",
  freedom: "newsletter",
  signs: "genie",
  nobodyTalks: "newsletter",
  oldWealth: "newsletter",
  identity: "genie"
};

const creativeBanks = {
  neville: {
    outcomes: ["large amounts of money", "money tonight", "the money shift", "millionaire confidence", "wealth before sleep"],
    timeframes: ["before sleep tonight", "for 7 minutes tonight", "every morning for 7 days", "tonight", "before your day starts"],
    actions: ["listen to this once", "fall asleep feeling this", "use this wealth technique", "rehearse this money scene", "create the feeling first"],
    tensions: [
      "Most people wait for money to arrive before they feel different.",
      "Most people rehearse the problem and call it being realistic.",
      "Most people know Neville's words but miss the state.",
      "Most people visualize the desire while still feeling the absence.",
      "This is going to feel like confirmation if your old money season has felt too small.",
      "The next level cannot land while your nervous system keeps rejecting more."
    ],
    titleTemplates: [
      "🚨 3 Signs This Is Your Money Confirmation Tonight",
      "Your Money Season Is Expanding In The Next 7 Days",
      "Type INCREASE If You Feel This 7 Day Neville Money Shift",
      "Neville Goddard: The 7 Minute Money Secret Before Sleep",
      "Neville Goddard: Use This {number} Minute Money Secret Before Bed",
      "Neville Goddard: 3 Hidden Money Feelings To Fall Asleep With",
      "Neville Goddard's Strange 7 Minute Money Technique Before Sleep",
      "Neville Goddard: 7 Signs Money Is Coming Faster Than You Think",
      "Neville Goddard: The 7 Minute Millionaire Mind Secret",
      "Neville Goddard: Create The Money Feeling Before You Sleep",
      "Neville Goddard: 3 Reasons People Fail To Manifest Money",
      "Neville Goddard: 7 Minutes Before Sleep To Attract Money",
      "Neville Goddard: Expect Large Amounts Of Money In 1 Hour"
    ],
    hookTemplates: [
      "This is going to feel like confirmation for you today.",
      "Your old money season could not hold the version you are becoming.",
      "Type INCREASE if you can feel the next level opening.",
      "{tension} Neville would say you are rehearsing the wrong end.",
      "If {outcome} was already normal, you would not be chasing it. You would be living from it.",
      "Here is the part most people miss: the feeling has to become normal before the result feels real.",
      "Before you ask where the money is, ask what state you keep practicing."
    ],
    promiseTemplates: [
      "move the viewer from money stress into the feeling that their capacity is expanding",
      "make {outcome} feel like a confirmation, not another lesson",
      "use Neville's living-from-the-end method to rehearse {outcome} until it feels normal",
      "stop rehearsing lack and start practicing the state that matches {outcome}",
      "make {outcome} feel familiar before it shows up"
    ],
    rituals: [
      "Say it out loud: my capacity is expanding. Then rehearse the new money scene.",
      "Type INCREASE, then choose the one money scene your old identity could not hold.",
      "Build one short end scene and sit in it for seven minutes.",
      "Before sleep, feel the relief of the result already handled.",
      "In the morning, rehearse the person who already moved differently."
    ]
  },
  wealthBooks: {
    outcomes: ["Think and Grow Rich", "The Science of Getting Rich", "Psycho-Cybernetics", "The Secret of the Ages", "the wealth book nobody reads"],
    timeframes: ["after 100 years", "in the AI age", "in 12 minutes", "before your next money move", "today"],
    actions: ["predicted this", "explains this", "got this right", "buried this", "changes everything"],
    tensions: [
      "Most people read old wealth books for quotes instead of rules.",
      "The book is old, but the money lesson is still alive.",
      "The useful part is not the quote. It is the operating principle.",
      "This is not a book summary. It is the part you can actually use."
    ],
    titleTemplates: [
      "The {number} Wealth Secrets Hidden in {outcome} Today",
      "This 100-Year-Old Wealth Book {action}",
      "The Money Secret Hidden in {outcome} for 100 Years",
      "The 7 Wealth Secrets Buried for 100 Years",
      "This 100-Year-Old Book Creates Millionaires (Nobody Reads It)",
      "The 3 Millionaire Lessons Nobody Talks About Today",
      "I Found a 100-Year-Old Wealth Rule Hidden in an Old Book"
    ],
    hookTemplates: [
      "{tension} That is why this still matters.",
      "The book gets the click, but the Sean Ali interpretation gets the subscriber.",
      "If you read this like motivation, you miss the money rule.",
      "This old idea makes more sense now than it did when I first heard it."
    ],
    promiseTemplates: [
      "extract the useful money rule from {outcome}",
      "turn an old wealth book into a modern operating principle",
      "show how {outcome} applies to AI, attention, offers, and leverage"
    ],
    rituals: [
      "Book, opinion, Sean story, modern application, CTA.",
      "Pull one principle and show exactly how an operator would use it today.",
      "End with one action the viewer can test this week."
    ]
  },
  manifestationWrong: {
    outcomes: ["manifestation", "visualization", "your vision board", "Neville's method", "law of attraction"],
    timeframes: ["today", "before you try again", "when nothing is moving", "for 7 days", "before sleep"],
    actions: ["stop doing this", "fix this missing piece", "ask this instead", "test this", "watch this mistake"],
    tensions: [
      "The technique is not always the problem. The way people use it is.",
      "Sometimes the result does not move because the practice is too vague.",
      "A vision board can become another way to stare at what is missing.",
      "People want the result, then practice the opposite state all day."
    ],
    titleTemplates: [
      "The Real Reason Manifestation Stops Working",
      "Why Manifestation Works Sometimes and Fails Other Times",
      "The Manifestation Mistake Nobody Talks About",
      "Neville Goddard: The Missing Piece Most People Skip",
      "The Truth About Law Of Attraction",
      "Why Your Vision Board Isn't Working",
      "Stop Doing This If You Want Manifestation To Work",
      "7 Manifestation Mistakes That Delay Money Tonight",
      "3 Hidden Reasons Manifestation Fails Before Sleep"
    ],
    hookTemplates: [
      "{tension} That is the correction.",
      "You are not wrong for noticing inconsistent results. The gap is the lesson.",
      "Correction content wins because it names the mistake people already feel.",
      "Most people do not need another technique. They need to use the current one correctly."
    ],
    promiseTemplates: [
      "show the missing piece that makes {outcome} feel inconsistent",
      "turn {outcome} into a cleaner daily practice",
      "explain why {outcome} fails when the viewer keeps practicing the opposite state"
    ],
    rituals: [
      "Name the technique, name the mistake, give one replacement.",
      "Use one practical money or business example so it feels real.",
      "Close with a 7-day test."
    ]
  },
  sleep: {
    outcomes: ["the answer", "the money shift", "a calmer morning", "the thing you asked for", "a sleep miracle"],
    timeframes: ["tonight", "before sleep", "in the morning", "for 7 nights", "before your head hits the pillow"],
    actions: ["listen to this once", "fall asleep feeling this", "do nothing but this", "stop replaying this", "try this"],
    tensions: [
      "Most people use the last ten minutes of the day to replay the problem.",
      "The state you sleep in becomes the state you wake up inside.",
      "Before sleep is where the noise finally gets quiet enough to plant something better.",
      "You do not need a long ritual. You need the right final feeling."
    ],
    titleTemplates: [
      "Listen To This Once Before Sleep Tonight",
      "It's Coming Tonight",
      "Sleep Miracle: {action} Tonight",
      "{number} Minutes Before Sleep To Feel {outcome}",
      "Before Sleep Tonight: {action}",
      "Fall Asleep Feeling This And Watch What Happens",
      "Do Nothing But This Before Bed Tonight",
      "Listen Every Morning For 7 Days"
    ],
    hookTemplates: [
      "{tension} Tonight, give your mind a better final scene.",
      "If it was already done, how would you fall asleep tonight?",
      "Your final feeling tonight is not random. It is a rehearsal.",
      "Do not take the problem to sleep. Take the end."
    ],
    promiseTemplates: [
      "use the last minutes before sleep to rehearse {outcome}",
      "wake up closer to the state you practiced before sleep",
      "replace the nightly replay with a simple end-scene ritual"
    ],
    rituals: [
      "Choose one sentence: it is handled. Breathe until it feels normal.",
      "Pick one tiny scene from after the result and fall asleep there.",
      "Put headphones on, lower the lights, and stop negotiating with the problem."
    ]
  },
  manifestation: {
    outcomes: ["better results", "a different pattern", "more useful action", "a higher probability", "the next real move"],
    timeframes: ["today", "this week", "before you quit", "before your next attempt", "for 7 days"],
    actions: ["ask this instead", "stop asking this", "rehearse this", "test this", "watch this pattern"],
    tensions: [
      "Same vision. Same belief. Different result.",
      "Reality does not bend to wishes alone.",
      "Visualization is not the guarantee. It is the primer.",
      "The market does not reward belief. It rewards behavior that repeats.",
      "This is confirmation if the old version of you has felt too small for what is coming.",
      "Sometimes the old identity cannot carry the new reality."
    ],
    titleTemplates: [
      "🚨 3 Signs This Is Your Confirmation: Your Reality Is Expanding",
      "Type INCREASE If Your New Season Is Opening",
      "3 Signs Your Timeline Is Shifting This Week",
      "Your Old Identity Cannot Hold This Next Blessing",
      "The Problem With Manifestation Nobody Talks About",
      "The Manifestation Rule Nobody Explains",
      "Why Manifestation Works Sometimes And Fails Other Times",
      "Stop Asking If Manifestation Guarantees {outcome}",
      "The Law Of Attraction Mistake Most People Make",
      "Same Vision. Same Belief. Different Result. Why?",
      "Manifestation Is Not Magic. It Is Probability.",
      "7 Manifestation Rules That Make Money Feel Closer Tonight",
      "3 Hidden Reasons Manifestation Works Faster Before Sleep"
    ],
    hookTemplates: [
      "This is going to feel like confirmation for you today.",
      "You are not stuck. You are being moved into a bigger season.",
      "Type INCREASE if your reality has felt like it is stretching.",
      "The old environment could not hold the new version of you.",
      "{tension} That is the part most people skip.",
      "The useful question is not will this guarantee success. It is what does this consistently do to me?",
      "Manifestation gets cleaner when you stop selling magic and start tracking behavior.",
      "What you rehearse changes what you notice. What you notice changes what you do."
    ],
    promiseTemplates: [
      "turn this into a confirmation-style short about expansion, capacity, and the next timeline",
      "make the viewer feel the old season closing and the new one opening",
      "turn manifestation into a practical behavior system that raises probability",
      "use visualization to direct attention, choices, and follow-through",
      "stop treating manifestation like magic and start using it as leverage"
    ],
    rituals: [
      "Open with confirmation, name the expansion, then tell them to comment INCREASE.",
      "Say: my reality is expanding. Then choose one action from the new version.",
      "Write the outcome, then write the behavior it should create today.",
      "Ask: what would this belief make me notice, say, and do?",
      "Rehearse the next action, not just the fantasy result."
    ]
  },
  theta: {
    outcomes: ["calm", "clear ideas", "better sleep", "creative flow", "a quieter night"],
    timeframes: ["in 10 minutes", "tonight", "before bed", "this morning", "after one session"],
    actions: ["put on headphones", "press play", "listen once", "try this simple audio ritual", "float into this"],
    tensions: [
      "No hard meditation. No fancy words.",
      "Most people think meditation has to be difficult.",
      "Theta is the space between wide awake and deep sleep.",
      "Sometimes the easiest ritual is just pressing play."
    ],
    titleTemplates: [
      "Theta Waves: Listen Before Sleep And Wake Up With {outcome}",
      "Binaural Beats For Sleep: {action} {timeframe}",
      "The {number} Minute Theta Audio Ritual For {outcome}",
      "Put On Headphones Before Bed And Feel {outcome}",
      "Theta Audio Ritual: Wake Up With {outcome}",
      "The Hidden 7 Minute Theta Ritual For Better Sleep",
      "3 Reasons Binaural Beats Feel Stronger Before Sleep"
    ],
    hookTemplates: [
      "{tension} Just put on headphones and let the sound do the first move.",
      "Theta is not complicated. It is the calm zone your mind already knows.",
      "Think of binaural beats as training wheels for meditation.",
      "If your mind will not slow down, stop forcing it. Guide it."
    ],
    promiseTemplates: [
      "use a simple audio ritual to enter {outcome} without forcing meditation",
      "let sound guide you into {outcome}",
      "make meditation feel easy enough to actually use"
    ],
    rituals: [
      "Put on headphones, press play, and let the first two minutes settle you.",
      "Use the track before bed or before creative work.",
      "Do not try to meditate perfectly. Just listen."
    ]
  },
  operator: {
    outcomes: ["AI leverage", "a one-person content system", "online revenue", "automation", "the operator advantage"],
    timeframes: ["in 2026", "after 10 years", "from zero", "after the first sale", "when ads get expensive"],
    actions: ["rebuild from zero", "learn this the hard way", "stop doing this", "choose this instead", "watch this mistake"],
    tensions: [
      "Most people want business to feel exciting. Operators respect boring leverage.",
      "After real ad spend, cute advice stops working.",
      "The dream is freedom. The work is distribution.",
      "Most people do not need more ideas. They need one offer people actually want."
    ],
    titleTemplates: [
      "WARNING: AI Won't Make You Money In 2026 Unless You Fix This",
      "I Used AI To Replace 5 Hours Of Work In 2026",
      "Claude Code + YouTube: The AI Money System Nobody Is Using In 2026",
      "The 7 AI Operator Moves I Would Use To Build From Zero In 2026",
      "I Built A One-Person AI Content Machine In 3 Steps Today",
      "Why 99% Of AI Business Advice Keeps Beginners Broke In 2026",
      "How I Would Rebuild From Zero With AI To Make Money In 2026",
      "The 3 Operator Secrets Nobody Talks About In 2026",
      "7 Hidden AI Money Lessons I Would Use In 2026"
    ],
    hookTemplates: [
      "{tension} That lesson cost money.",
      "If I had to rebuild today, I would not start where most people start.",
      "The operator lesson is simple: attention first, offer second, system third.",
      "Most people romanticize freedom until they see the reps required."
    ],
    promiseTemplates: [
      "turn Sean's operator experience into a practical lesson about {outcome}",
      "show what actually matters when someone is trying to build online",
      "make the viewer trust Sean's business judgment through a specific story"
    ],
    rituals: [
      "Tell the story, name the expensive lesson, then give the rule.",
      "Use one operator contrast: dreamers talk, operators ship.",
      "End with one simple action that creates leverage today."
    ]
  },
  freedom: {
    outcomes: ["freedom", "time ownership", "a life outside the system", "internet leverage", "status-free success"],
    timeframes: ["after leaving Canada", "in Panama", "in the new economy", "before chasing status", "once money is not enough"],
    actions: ["choose this instead", "leave this behind", "build this first", "stop chasing this", "protect this"],
    tensions: [
      "At some point, looking successful is not the same as being free.",
      "The hidden cost of chasing money is forgetting what the money was for.",
      "The internet gave people leverage, but most still live like they need permission.",
      "Freedom is not a vibe. It is a system."
    ],
    titleTemplates: [
      "Why I Left Canada",
      "Why I Live in Panama",
      "The Hidden Cost of Chasing Money",
      "Why I Chose {outcome} Over Status",
      "The One Skill That Gives You {outcome}",
      "7 Hidden Freedom Lessons I Learned in Panama in 2026",
      "The 3 Freedom Skills I Would Build First in 2026"
    ],
    hookTemplates: [
      "{tension} That is why this lane matters.",
      "I did not build online to impress people. I built online to own my time.",
      "Panama is not the point. The point is what the internet makes possible.",
      "Freedom starts when the default script stops looking attractive."
    ],
    promiseTemplates: [
      "turn Sean's lifestyle proof into a practical lesson about {outcome}",
      "make freedom feel concrete instead of vague",
      "show why internet leverage changes the rules"
    ],
    rituals: [
      "Contrast the default path with the freedom path.",
      "Name the tradeoff, then show the system that makes the choice possible.",
      "Close with the one skill the viewer should build next."
    ]
  },
  signs: {
    outcomes: ["success getting closer", "the money pattern changing", "the new identity taking root", "manifestation working", "the next level becoming normal"],
    timeframes: ["right now", "this week", "before the result appears", "in the next 7 days", "when things feel weird"],
    actions: ["notice these", "watch for these", "stop ignoring these", "track these", "pay attention to these"],
    tensions: [
      "The result often starts as a sign before it becomes a number.",
      "Most people miss progress because they only look for the final result.",
      "The early signs are usually subtle, but they matter.",
      "If you know what to watch for, the process feels less random."
    ],
    titleTemplates: [
      "{number} Signs {outcome}",
      "{number} Signs Your Manifestation Is Working",
      "{number} Signs Money Is Getting Closer",
      "{number} Signs to Watch For {timeframe}",
      "{number} Signs The Result Is Closer Than You Think",
      "{number} Signs Your Identity Is Changing",
      "7 Hidden Signs Money Is Getting Closer This Week",
      "3 Signs Your Manifestation Is Working Tonight"
    ],
    hookTemplates: [
      "{tension} Here is what to look for.",
      "If these signs are showing up, do not dismiss them.",
      "This is not the result yet. It is the pattern changing.",
      "Signs content works because people want to recognize themselves."
    ],
    promiseTemplates: [
      "give the viewer a simple checklist for recognizing {outcome}",
      "turn vague progress into clear signs they can track",
      "make the process feel visible before the final result arrives"
    ],
    rituals: [
      "List the signs quickly, then explain what each one means.",
      "Make every sign recognizable in one sentence.",
      "End by telling the viewer what to do if they see two or more signs."
    ]
  },
  nobodyTalks: {
    outcomes: ["money", "success", "ambition", "manifestation", "wealth"],
    timeframes: ["today", "when it gets real", "before the breakthrough", "after the result", "when nobody is watching"],
    actions: ["talk about this", "notice this", "stop ignoring this", "understand this", "admit this"],
    tensions: [
      "The part nobody talks about is usually the part everyone feels.",
      "Most advice skips the uncomfortable part.",
      "This is not popular, but it is useful.",
      "The easy version gets views. The honest version builds trust."
    ],
    titleTemplates: [
      "The {outcome} Secret Nobody Talks About",
      "The Problem With {outcome} Nobody Talks About",
      "The Hidden Cost of {outcome}",
      "The Real Reason Most People Stay Broke",
      "What Nobody Tells You About {outcome}",
      "The Wealth Truth Nobody Wants To Admit",
      "The Money Pattern Nobody Talks About",
      "7 Money Secrets Nobody Talks About Tonight",
      "3 Hidden Wealth Patterns to Watch This Week"
    ],
    hookTemplates: [
      "{tension} That is why this matters.",
      "There is a part of {outcome} people avoid saying out loud.",
      "If you have felt this but never had words for it, this is the video.",
      "Nobody-talks-about-this works when the viewer feels exposed in a useful way."
    ],
    promiseTemplates: [
      "name the unsaid truth around {outcome} in plain language",
      "make the viewer feel seen without making it soft",
      "turn the uncomfortable part into a practical lesson"
    ],
    rituals: [
      "State the unsaid truth, explain why people avoid it, then give the useful move.",
      "Do not soften the first line.",
      "Close with one decision the viewer can make today."
    ]
  },
  oldWealth: {
    outcomes: ["modern success", "online money", "AI leverage", "the millionaire lesson", "the wealth law"],
    timeframes: ["since 1910", "after 100 years", "in the AI age", "right now", "before the market changes"],
    actions: ["predicted this", "still works", "explains this", "buried this", "proves this"],
    tensions: [
      "Old money principles look outdated until the economy changes and proves them again.",
      "This was written before AI, but the leverage lesson is obvious now.",
      "Most people want new tactics while ignoring old principles.",
      "The principle did not expire. The application changed."
    ],
    titleTemplates: [
      "A 100-Year-Old Wealth Secret That {action}",
      "The Wealth Law Hidden {timeframe}",
      "Wallace Wattles {action}",
      "{outcome} Buried in an Old Book",
      "The Secret Law of Wealth"
    ],
    hookTemplates: [
      "{tension} That is the whole angle.",
      "This idea is old, but it explains the new economy better than most new advice.",
      "The principle is old. The internet made it louder.",
      "If Wallace Wattles saw AI, this is the part he would recognize."
    ],
    promiseTemplates: [
      "connect an old wealth principle to {outcome}",
      "make a 100-year-old idea feel urgent today",
      "show why timeless money principles still matter"
    ],
    rituals: [
      "Open with the old principle, then translate it into today's creator economy.",
      "Use one modern example: AI, offers, attention, or distribution.",
      "Close with the rule the viewer should apply today."
    ]
  },
  identity: {
    outcomes: ["the future self", "confidence", "the new identity", "the next version", "a breakthrough"],
    timeframes: ["before it happens", "for 7 days", "every morning", "when motivation fades", "before the result repeats"],
    actions: ["install this", "rehearse this", "practice this", "make this familiar", "choose this"],
    tensions: [
      "Motivation fades when the new identity still feels fake.",
      "You do not rise to a future that feels unfamiliar.",
      "Confidence is not a speech. It is a rehearsal.",
      "The future self has to feel normal before the result repeats."
    ],
    titleTemplates: [
      "The Identity Shift Behind Every Breakthrough",
      "Identity Beats Motivation Every Time",
      "The Future Self Exercise That Changed My Life",
      "{action} {outcome} {timeframe}",
      "Confidence Is a Rehearsal Problem",
      "7 Hidden Identity Shifts That Create Confidence This Week",
      "3 Future Self Signs to Watch for Tonight"
    ],
    hookTemplates: [
      "{tension} That is why identity comes first.",
      "The goal is not to hype yourself up. The goal is to make the future feel familiar.",
      "If the next version feels fake, you will keep drifting back to the current one.",
      "Identity installation is rehearsing the person before the life fully matches."
    ],
    promiseTemplates: [
      "make {outcome} feel familiar enough to act from",
      "turn identity into a daily rehearsal instead of a vague idea",
      "show why the next version must become normal first"
    ],
    rituals: [
      "Write one sentence the next version would believe, then act on it once today.",
      "Rehearse the posture, decision, and standard of the next version.",
      "Before checking results, ask what the future self would do next."
    ]
  }
};

const numbers = ["7", "3", "10", "1"];

const conceptCard = document.querySelector("#concept-card");
const output = document.querySelector("#asset-output");
const assetStatus = document.querySelector("#asset-status");
const toast = document.querySelector("#toast");

let state = {
  concept: null,
  approved: false,
  activeAsset: "slideshow",
  assets: {},
  generation: 0
};

function selected(id) {
  return document.querySelector(`#${id}`).value;
}

function clean(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function pick(list, offset = 0) {
  return list[Math.abs((state.generation || 0) + offset) % list.length];
}

function pickFrom(list, base, offset = 0) {
  return list[Math.abs((base || 0) + offset) % list.length];
}

function randomInt(max) {
  const limit = Math.max(1, Number(max) || 1);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] % limit;
  }
  return Math.floor(Math.random() * limit);
}

function randomItem(list) {
  return list[randomInt(list.length)];
}

function createConcept() {
  state.generation = (state.generation || 0) + 1 + randomInt(97);
  const laneKey = selected("lane");
  const intensity = selected("intensity");
  const selectedCtaKey = selected("cta");
  const ctaKey = selectedCtaKey === "auto" ? recommendedCtas[laneKey] : selectedCtaKey;
  const source = sourcePatterns[laneKey];
  const cta = ctas[ctaKey];
  const seed = clean(document.querySelector("#seed").value);
  const generated = selectValidatedConcept({ laneKey, source, intensity, seed });

  state.concept = {
    laneKey,
    ctaKey,
    selectedCtaKey,
    intensity,
    title: generated.title,
    hook: generated.hook,
    promise: generated.promise,
    mechanism: generated.mechanism,
    proof: source.proof,
    ritual: generated.ritual,
    outcome: generated.outcome,
    tension: generated.tension,
    validation: generated.validation,
    recentTitles: [generated.title],
    cta: cta.action,
    ctaLine: cta.line,
    ctaUrl: cta.url,
    sourceLane: source.lane
  };
  state.approved = false;
  state.assets = {};
  renderConcept();
  renderAsset();
  saveState();
  showToast("Concept created");
  document.querySelector("#confirm").scrollIntoView({ behavior: "smooth" });
}

function usePastedIdea() {
  const manualText = String(document.querySelector("#seed").value || "").trim();
  if (!manualText) return showToast("Paste an idea first");

  state.generation = (state.generation || 0) + 1 + randomInt(97);
  const laneKey = selected("lane");
  const intensity = selected("intensity");
  const selectedCtaKey = selected("cta");
  const ctaKey = selectedCtaKey === "auto" ? recommendedCtas[laneKey] : selectedCtaKey;
  const source = sourcePatterns[laneKey];
  const cta = ctas[ctaKey];
  const generated = buildManualConcept({ laneKey, source, intensity, manualText });

  state.concept = {
    laneKey,
    ctaKey,
    selectedCtaKey,
    intensity,
    manual: true,
    pastedIdea: manualText,
    title: generated.title,
    hook: generated.hook,
    promise: generated.promise,
    mechanism: generated.mechanism,
    proof: source.proof,
    ritual: generated.ritual,
    outcome: generated.outcome,
    tension: generated.tension,
    validation: generated.validation,
    recentTitles: [generated.title],
    cta: cta.action,
    ctaLine: cta.line,
    ctaUrl: cta.url,
    sourceLane: source.lane
  };
  state.approved = false;
  state.assets = {};
  renderConcept();
  renderAsset();
  saveState();
  showToast("Pasted idea scored");
  document.querySelector("#confirm").scrollIntoView({ behavior: "smooth" });
}

function buildManualConcept({ laneKey, source, intensity, manualText }) {
  const bank = creativeBanks[laneKey] || genericCreativeBank(source);
  const parsed = parseManualIdea(manualText, source);
  const outcome = extractOutcome(manualText, bank);
  const timeframe = extractTimeframe(manualText, bank);
  const action = extractAction(manualText, bank);
  const tension = parsed.notes || pickFrom(bank.tensions, state.generation || 0, 4);
  const hook = parsed.notes
    ? parsed.notes
    : `Here is the simple angle: ${parsed.title}. Make it about ${outcome}, not theory.`;
  const promise = parsed.promise || `turn ${outcome} into a simple ${timeframe} move people can try`;
  const ritual = parsed.ritual || fillTemplate(pickFrom(bank.rituals, state.generation || 0, 9), { outcome, timeframe, action, tension, number: "7" });
  const candidate = {
    title: parsed.title,
    hook,
    promise,
    mechanism: source.mechanism,
    ritual,
    outcome,
    tension
  };
  return {
    ...candidate,
    validation: scoreConcept(candidate, { laneKey, source, intensity, seed: manualText })
  };
}

function parseManualIdea(manualText, source) {
  const rawLines = String(manualText || "")
    .split(/\n+/)
    .map((line) => clean(line))
    .filter(Boolean);
  const readLabel = (label) => {
    const line = rawLines.find((item) => new RegExp(`^${label}\\s*:`, "i").test(item));
    return line ? clean(line.replace(new RegExp(`^${label}\\s*:\\s*`, "i"), "")) : "";
  };
  const firstLine = clean((rawLines[0] || source.titleSeeds[0]).replace(/^title\s*:\s*/i, ""));
  const firstSentence = firstLine.split(/(?<=[.!?])\s+/)[0];
  const title = clean(firstSentence).replace(/[.!?]+$/, "");
  const remainingLines = rawLines.slice(1).filter((line) => !/^(hook|promise|ritual)\s*:/i.test(line));

  return {
    title: title || source.titleSeeds[0],
    notes: clean(readLabel("hook") || remainingLines.join(" ")),
    promise: clean(readLabel("promise")),
    ritual: clean(readLabel("ritual"))
  };
}

function buildFreshConcept({ laneKey, source, intensity, seed, offset = 0 }) {
  const bank = creativeBanks[laneKey] || genericCreativeBank(source);
  const base = (state.generation || 0) + offset;
  const outcome = seed ? extractOutcome(seed, bank) : pickFrom(bank.outcomes, base, 1);
  const timeframe = seed ? extractTimeframe(seed, bank) : pickFrom(bank.timeframes, base, 2);
  const action = seed ? extractAction(seed, bank) : pickFrom(bank.actions, base, 3);
  const tension = pickFrom(bank.tensions, base, 4);
  const number = pickFrom(numbers, base, 5);
  const titleTemplate = intensity === "closest"
    ? source.titleSeeds[base % source.titleSeeds.length]
    : pickFrom(bank.titleTemplates, base, intensity === "clean" ? 4 : 6);
  const rawTitle = seed && intensity !== "closest"
    ? titleFromSeed(seed, source, { outcome, timeframe, action })
    : fillTemplate(titleTemplate, { outcome, timeframe, action, tension, number });
  const title = toHeadlineCase(seed ? rawTitle : hotTitle(rawTitle, { laneKey, outcome, timeframe, action, number, base, intensity }));
  const hook = seed
    ? `${clean(seed).replace(/[.!?]+$/, "")}. The fresh angle is ${outcome}, not another explanation.`
    : fillTemplate(pickFrom(bank.hookTemplates, base, 7), { outcome, timeframe, action, tension, number });
  const promise = fillTemplate(pickFrom(bank.promiseTemplates, base, 8), { outcome, timeframe, action, tension, number });
  const ritual = fillTemplate(pickFrom(bank.rituals, base, 9), { outcome, timeframe, action, tension, number });

  return {
    title,
    hook,
    promise,
    mechanism: source.mechanism,
    ritual,
    outcome,
    tension
  };
}

function hotTitle(rawTitle, { laneKey, outcome, timeframe, action, number, base, intensity }) {
  if (intensity === "clean") return rawTitle;
  const n = number || pickFrom(numbers, base, 1);
  const hot = {
    neville: [
      `🚨 ${n} Signs This Is Your Money Confirmation Before Sleep Tonight`,
      `Type INCREASE If This ${n} Day Neville Money Shift Is For You`,
      `Your Money Territory Is Expanding In The Next ${n} Days`,
      `Neville Goddard: ${n} Signs Your Money Season Is Opening`,
      `Neville Goddard: The Strange ${n} Minute Money Secret Before Sleep`,
      `Neville Goddard WARNING: Stop Rehearsing Money Stress Tonight`,
      `The ${n} Neville Money Signs Nobody Talks About Before Sleep`,
      `Neville Goddard: This Hidden Money State Changes Everything Tonight`,
      `Neville's ${n}-Minute Wealth Method That Feels Almost Too Easy`
    ],
    manifestation: [
      `🚨 ${n} Signs This Is Your Confirmation: Your Reality Is Expanding This Week`,
      `Type INCREASE If Your Timeline Is Shifting This Week`,
      `${n} Signs The Universe Is Moving You Into A Bigger Season`,
      `Your Old Identity Cannot Hold This Next Blessing In ${n} Days`,
      `This Is Why Doors Are Opening For You In ${n} Days`,
      `Neville Goddard WARNING: This Manifestation Mistake Delays Everything`,
      `The ${n} Hidden Manifestation Rules Nobody Explains Before Sleep`,
      `Why Manifestation Fails Fast When You Skip This Tonight`,
      `Neville's Strange State Secret That Changes Everything`,
      `Stop Forcing Belief: Do This ${n} Minutes Before Sleep`
    ],
    oldWealth: [
      `🚨 This 100-Year Wealth Secret Is Back In 2026`,
      `Type MONEY If This Old Wealth Law Makes Sense Now`,
      `Wallace Wattles EXPOSED: The 100-Year Wealth Secret Nobody Uses`,
      `The ${n} Wallace Wattles Money Rules That Still Work In 2026`,
      `This 100-Year-Old Wealth Law Predicted AI Money`,
      `Wallace Wattles WARNING: Most People Read This Wrong`,
      `The Hidden Science Of Getting Rich Lesson That Changes Everything`
    ],
    operator: [
      `🚨 Stop Using AI Like A Toy In 2026`,
      `Type AI If You Want The One-Person Content Machine`,
      `I Stole Back ${n} Hours With This AI Operator System`,
      `I Used AI To Replace ${n} Hours Of Work In 2026`,
      `Claude Code + YouTube: The AI Business Secret Nobody Is Using In 2026`,
      `WARNING: AI Won't Make You Money In 2026 Unless You Fix This First`,
      `The ${n} AI Operator Moves I Would Use To Build From Zero In 2026`,
      `I Built A One-Person AI Content Machine In ${n} Steps Today`,
      `This Easy AI System Changed How I Create Content In 2026`,
      `The REAL AI Business Playbook Nobody Shows Beginners In 2026`
    ],
    freedom: [
      `🚨 Panama Is Not What They Show You In 2026`,
      `Type FREEDOM If The Default Life Feels Too Small`,
      `Panama Untold: ${n} Secrets Tourists Never See In 2026`,
      `WARNING: Don't Move To Panama In 2026 Until You See This`,
      `The Hidden Panama Freedom Lesson Nobody Talks About In 2026`,
      `I Found The Panama Secret That Changed My View Of Money In Panama`,
      `${n} Panama Truths That Made The Default Life Look Insane In 2026`
    ]
  }[laneKey] || [];
  return hot[Math.abs(base || 0) % hot.length] || rawTitle;
}

function selectValidatedConcept(args, options = {}) {
  const excludedTitles = new Set((options.excludeTitles || []).map(normalizeTitle));
  const candidates = Array.from({ length: 72 }, (_, index) => {
    const candidate = buildFreshConcept({ ...args, offset: index });
    return {
      ...candidate,
      validation: scoreConcept(candidate, args)
    };
  });
  const available = candidates.filter((candidate) => !excludedTitles.has(normalizeTitle(candidate.title)));
  const pool = available.length ? available : candidates;
  const ranked = pool.sort((a, b) => {
    if (Number(b.validation.pass) !== Number(a.validation.pass)) return Number(b.validation.pass) - Number(a.validation.pass);
    if (b.validation.total !== a.validation.total) return b.validation.total - a.validation.total;
    if (b.validation.preference.score !== a.validation.preference.score) return b.validation.preference.score - a.validation.preference.score;
    return b.title.length - a.title.length;
  });
  const best = ranked[0];
  const publishable = ranked.filter((candidate) =>
    candidate.validation.pass &&
    candidate.validation.total >= Math.max(SEAN_CONTENT_BRAIN.validationTeam.publishLine, best.validation.total - 4) &&
    candidate.validation.preference.score >= Math.max(0, best.validation.preference.score - 1)
  );
  const strongPool = publishable.length >= 4 ? publishable.slice(0, 18) : ranked.slice(0, Math.min(18, ranked.length));
  return randomItem(strongPool);
}

function normalizeTitle(title) {
  return String(title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function scoreConcept(candidate, { laneKey, source, intensity, seed }) {
  const title = candidate.title || "";
  const hook = candidate.hook || "";
  const combined = `${title} ${hook} ${candidate.promise || ""}`.toLowerCase();
  const titleLower = title.toLowerCase();

  const searchTerms = SEAN_CONTENT_BRAIN.searchTerms;
  const viralTerms = SEAN_CONTENT_BRAIN.viralTerms;
  const trendTerms = SEAN_CONTENT_BRAIN.trendTerms;
  const humanTerms = SEAN_CONTENT_BRAIN.humanTerms;
  const laneTerms = laneQualityTerms(laneKey, source);
  const profile = contentPreferenceProfile({ title, combined });

  const searchHits = countMatches(combined, searchTerms) + countMatches(combined, laneTerms);
  let search = 4 + searchHits;
  if (source.titleSeeds.some((seedTitle) => titleLower.includes(seedTitle.toLowerCase().slice(0, 14)))) search += 1;
  if (seed && includesAny(combined, clean(seed).toLowerCase().split(" ").filter((word) => word.length > 5).slice(0, 3))) search += 1;

  let virality = 3 + countMatches(combined, viralTerms);
  if (profile.hasNumber) virality += 2;
  if (/[():]/.test(title)) virality += 1;
  if (profile.hasTimeframe) virality += 2;
  if (profile.hasOutcome) virality += 1;

  let likability = 4 + countMatches(combined, humanTerms);
  if (title.length >= 38 && title.length <= 78) likability += 2;
  if (hook.length >= 70 && hook.length <= 170) likability += 1;
  if (title.length > 92) likability -= 3;
  if (/\b(undefined|null|nan)\b/i.test(combined)) likability -= 6;
  if (/\s{2,}/.test(title)) likability -= 2;

  let trending = 3 + countMatches(combined, trendTerms);
  if (intensity === "strong") trending += 1;
  if (/\b2026|ai|panama|operator|identity\b/i.test(combined)) trending += 2;

  search = clamp10(search);
  virality = clamp10(virality);
  likability = clamp10(likability);
  trending = clamp10(trending);

  const validators = warRoomValidators({
    title,
    hook,
    combined,
    searchTerms,
    viralTerms,
    trendTerms,
    humanTerms,
    laneTerms,
    source,
    laneKey,
    profile,
    search,
    virality,
    likability,
    trending
  });
  const total = validators.reduce((sum, validator) => sum + validator.score, 0);
  const bannedHits = bannedLanguageHits(combined);
  const pass = total >= SEAN_CONTENT_BRAIN.validationTeam.publishLine && profile.passed && profile.naturalTitle && !bannedHits.length;
  const reasons = validationReasons({ title, hook, combined, validators, total, laneKey, profile, pass });

  return {
    search: validators.find((validator) => validator.key === "market")?.score || search,
    virality: validators.find((validator) => validator.key === "mrbeast")?.score || virality,
    likability: validators.find((validator) => validator.key === "sean")?.score || likability,
    trending: validators.find((validator) => validator.key === "tai")?.score || trending,
    validators,
    preference: profile,
    total,
    max: SEAN_CONTENT_BRAIN.validationTeam.maxScore,
    threshold: SEAN_CONTENT_BRAIN.validationTeam.publishLine,
    pass,
    verdict: pass ? "PASS: publish candidate" : "FAIL: remix before publishing",
    reasons
  };
}

function contentPreferenceProfile({ title, combined }) {
  const titleLower = String(title || "").toLowerCase();
  const naturalTitle = isNaturalTitle(title);
  const checks = [
    ...SEAN_CONTENT_BRAIN.contentRules.titleRequirements.map((requirement) => ({
      key: requirement.key,
      label: requirement.label,
      passed: new RegExp(requirement.pattern, "i").test(requirement.key === "outcome" || requirement.key === "timeframe" ? titleLower : title)
    })),
    { key: "natural", label: "Reads Naturally", passed: naturalTitle }
  ];
  const requiredChecks = checks.filter((check) => check.key !== "natural");
  const score = requiredChecks.filter((check) => check.passed).length;
  return {
    checks,
    score,
    hasNumber: checks.find((check) => check.key === "number").passed,
    hasClickbait: checks.find((check) => check.key === "clickbait").passed,
    hasOutcome: checks.find((check) => check.key === "outcome").passed,
    hasTimeframe: checks.find((check) => check.key === "timeframe").passed,
    naturalTitle,
    passed: requiredChecks.every((check) => check.passed)
  };
}

function isNaturalTitle(title) {
  const value = String(title || "").trim();
  const lower = value.toLowerCase();
  const awkwardEndings = [
    /\bmanifest money tonight$/i,
    /\bmake money tonight$/i,
    /\bwealth tonight$/i,
    /\bconfidence tonight$/i,
    /\bsuccess tonight$/i,
    /\bfreedom tonight$/i,
    /\bfeel .* tonight$/i,
    /\bfails? .* tonight$/i,
    /\bhidden .* tonight$/i
  ];
  if (awkwardEndings.some((pattern) => pattern.test(value))) return false;
  if (/\btonight\b/i.test(value)) {
    return /\bbefore sleep tonight\b|\bbefore bed tonight\b|\blisten tonight\b|\bit'?s coming tonight\b|\bin 1 hour\b/i.test(lower);
  }
  return true;
}

function warRoomValidators({ title, hook, combined, searchTerms, viralTerms, trendTerms, humanTerms, laneTerms, source, laneKey, profile, search, virality, likability, trending }) {
  const curiosityHits = countMatches(combined, viralTerms);
  const marketHits = countMatches(combined, searchTerms) + countMatches(combined, laneTerms);
  const problemHits = countMatches(combined, ["problem", "pain", "wrong", "mistake", "fails", "stops", "broke", "stress", "missing", "stop"]);
  const mechanismHits = countMatches(combined, ["method", "technique", "law", "ritual", "exercise", "secret", "rule", "system", source.mechanism.toLowerCase().split(" ")[0]]);
  const authorityHits = countMatches(combined, ["managed", "$100,000", "10 years", "learned", "neville", "goddard", "wattles", "think and grow rich", "operator", "sean"]);
  const authenticityHits = countMatches(combined, humanTerms) + countMatches(combined, ["true", "real", "useful", "lesson", "practice", "today"]);
  const validatorMeta = Object.fromEntries(SEAN_CONTENT_BRAIN.validationTeam.validators.map((validator) => [validator.key, validator]));

  return [
    {
      key: "mrbeast",
      name: validatorMeta.mrbeast.name,
      question: validatorMeta.mrbeast.question,
      score: clamp10(virality + (profile.hasOutcome ? 1 : 0)),
      verdict: curiosityHits >= 2 || profile.hasClickbait ? "Broad click pull" : "Needs more curiosity"
    },
    {
      key: "hormozi",
      name: validatorMeta.hormozi.name,
      question: validatorMeta.hormozi.question,
      score: clamp10(4 + problemHits + mechanismHits + (profile.hasOutcome ? 2 : 0)),
      verdict: problemHits && mechanismHits ? "Problem plus mechanism" : "Needs sharper demand"
    },
    {
      key: "dan",
      name: validatorMeta.dan.name,
      question: validatorMeta.dan.question,
      score: clamp10(4 + authorityHits + (laneKey === "operator" ? 2 : 0) + (title.length >= 35 ? 1 : 0)),
      verdict: authorityHits ? "Trust signal present" : "Needs more credibility"
    },
    {
      key: "tai",
      name: validatorMeta.tai.name,
      question: validatorMeta.tai.question,
      score: clamp10(trending + (marketHits >= 3 ? 2 : 0)),
      verdict: marketHits >= 3 ? "Borrows existing attention" : "Market may be small"
    },
    {
      key: "sean",
      name: validatorMeta.sean.name,
      question: validatorMeta.sean.question,
      score: clamp10(likability + authenticityHits + (title.length <= 85 ? 1 : -1)),
      verdict: authenticityHits >= 2 ? "Feels useful and true" : "Needs more Sean signal"
    },
    {
      key: "market",
      name: validatorMeta.market.name,
      question: validatorMeta.market.question,
      score: clamp10(search + (profile.hasTimeframe ? 1 : 0) + (profile.hasOutcome ? 1 : 0)),
      verdict: marketHits >= 3 ? "Search demand present" : "Needs search demand"
    }
  ];
}

function laneQualityTerms(laneKey, source) {
  const laneName = (source.lane || "").toLowerCase().split(/\W+/).filter((word) => word.length > 3);
  return {
    neville: ["neville", "goddard", "wealth", "sleep", "end"],
    wealthBooks: ["book", "wealth", "rich", "wattles", "millionaire"],
    manifestationWrong: ["manifestation", "visualization", "law", "wrong", "missing"],
    sleep: ["sleep", "tonight", "morning", "before", "listen"],
    manifestation: ["manifestation", "probability", "visualization", "result"],
    theta: ["theta", "binaural", "audio", "headphones", "sleep"],
    operator: ["operator", "business", "ai", "automation", "system", "leverage"],
    freedom: ["freedom", "panama", "living", "tourists", "hidden", "local"],
    signs: ["signs", "closer", "working", "watch"],
    nobodyTalks: ["nobody", "talks", "secret", "problem", "real"],
    oldWealth: ["wealth", "100-year", "wattles", "wallace", "science", "rich"],
    identity: ["identity", "future", "confidence", "rehearsal"]
  }[laneKey] || laneName;
}

function validationReasons({ title, hook, combined, validators, total, laneKey, profile, pass }) {
  const reasons = [];
  const weakValidators = validators.filter((validator) => validator.score < 7).map((validator) => validator.name);
  const bannedHits = bannedLanguageHits(combined);
  if (pass) reasons.push(`War Room: passes the ${SEAN_CONTENT_BRAIN.validationTeam.publishLine}/${SEAN_CONTENT_BRAIN.validationTeam.maxScore} publish line.`);
  if (profile.passed) reasons.push("Sean preference: number, clickbait, outcome, and timeframe all present.");
  if (!profile.passed) reasons.push(`Sean preference missing: ${profile.checks.filter((check) => !check.passed).map((check) => check.label).join(", ")}.`);
  if (!profile.naturalTitle) reasons.push("Language: timeframe feels bolted on. Remix.");
  if (bannedHits.length) reasons.push(`Banned language: ${bannedHits.join(", ")}.`);
  if (weakValidators.length) reasons.push(`Watch: ${weakValidators.join(", ")} scored under 7.`);
  if (/\bmoney|wealth|sleep|tonight|morning|ai|panama|neville|manifestation|signs\b/i.test(combined)) {
    reasons.push("Demand: anchored to something people already care about.");
  }
  if (title.length > 85) reasons.push("Watch: title is a little long.");
  if (hook.length < 55) reasons.push("Watch: hook may need more tension.");
  if (total < SEAN_CONTENT_BRAIN.validationTeam.publishLine) reasons.push(`Team note: remix this ${sourcePatterns[laneKey]?.lane || "lane"} concept.`);
  return reasons.slice(0, 4);
}

function countMatches(text, terms) {
  return terms.reduce((total, term) => total + (text.includes(term.toLowerCase()) ? 1 : 0), 0);
}

function bannedLanguageHits(text) {
  const value = String(text || "").toLowerCase();
  return SEAN_CONTENT_BRAIN.bannedLanguage.filter((phrase) => value.includes(phrase.toLowerCase())).slice(0, 3);
}

function includesAny(text, terms) {
  return terms.some((term) => term && text.includes(term));
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function clamp10(value) {
  return Math.max(0, Math.min(10, Math.round(value)));
}

function genericCreativeBank(source) {
  const lane = source.lane;
  const shortLane = lane.replace(/\s*\/\s*/g, " ");
  return {
    outcomes: [
      source.promise,
      `the ${shortLane.toLowerCase()} lesson`,
      "a useful shift",
      "a sharper decision",
      "the next move"
    ],
    timeframes: ["today", "this week", "in 12 minutes", "for 7 days", "before the next move"],
    actions: ["explain this", "stop missing this", "use this", "watch this", "apply this"],
    tensions: source.hooks,
    titleTemplates: [
      source.titleSeeds[0],
      `${shortLane}: {action} {timeframe}`,
      `The {number} ${shortLane} Lessons Most People Miss`,
      `Why ${shortLane} Changes {outcome}`,
      `${source.titleSeeds[1] || source.titleSeeds[0]}`
    ],
    hookTemplates: [
      "{tension}",
      `Most people misunderstand ${shortLane}. The useful part is what it changes next.`,
      `This is not just content about ${shortLane}. It is a practical rule people can test.`,
      "The angle is not the information. The angle is the promise."
    ],
    promiseTemplates: [
      `turn ${shortLane} into a practical content angle around {outcome}`,
      "make the idea useful enough for someone to try today",
      "connect the concept to a real decision, ritual, or next move"
    ],
    rituals: [
      "State the claim, give Sean's opinion, show the modern application, then close with one action.",
      "Use one clear example so the idea feels practical, not theoretical.",
      "End with one thing the viewer can do today."
    ]
  };
}

function titleByIntensity(source, intensity) {
  if (intensity === "closest") return source.titleSeeds[2] || source.titleSeeds[0];
  if (intensity === "clean") return source.titleSeeds[source.titleSeeds.length - 1];
  return source.titleSeeds[0];
}

function titleFromSeed(seed, source, parts = {}) {
  if (/neville/i.test(seed)) return seed.replace(/[.!?]+$/, "");
  if (/sleep|tonight|bed/i.test(seed)) return "Neville Goddard: Do This Before Sleep Tonight";
  if (/money|wealth|rich|million|lottery/i.test(seed)) return `Neville Goddard: ${parts.action || "Rehearse This"} For ${parts.outcome || "Wealth"}`;
  return `${source.lane}: ${seed.replace(/[.!?]+$/, "")}`;
}

function extractOutcome(seed, bank) {
  const value = clean(seed).toLowerCase();
  return bank.outcomes.find((item) => value.includes(item.toLowerCase().split(" ")[0])) || bank.outcomes[0];
}

function extractTimeframe(seed, bank) {
  const value = clean(seed).toLowerCase();
  return bank.timeframes.find((item) => value.includes(item.toLowerCase().split(" ")[0])) || bank.timeframes[0];
}

function extractAction(seed, bank) {
  const value = clean(seed).toLowerCase();
  return bank.actions.find((item) => value.includes(item.toLowerCase().split(" ")[0])) || bank.actions[0];
}

function fillTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] || "");
}

function titleCase(value) {
  return String(value || "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function toHeadlineCase(value) {
  const keepLower = new Set(["a", "an", "and", "as", "at", "before", "but", "by", "for", "from", "in", "into", "of", "on", "or", "the", "to", "with"]);
  const keepUpper = new Set(["AI", "CTA", "POV", "STOP", "WARNING", "EXPOSED", "REAL"]);
  const exactCase = {
    youtube: "YouTube",
    tiktok: "TikTok",
    claude: "Claude",
    ai: "AI",
    pov: "POV",
    stop: "STOP",
    warning: "WARNING",
    exposed: "EXPOSED",
    real: "REAL"
  };
  return String(value || "")
    .split(" ")
    .map((word, index) => {
      if (/^#?\d/.test(word) || /^[A-Z]{2,}$/.test(word)) return word;
      const [lead, core, tail] = word.match(/^([^A-Za-z0-9]*)(.*?)([^A-Za-z0-9]*)$/)?.slice(1) || ["", word, ""];
      if (!core) return word;
      const lower = core.toLowerCase();
      if (exactCase[lower]) return `${lead}${exactCase[lower]}${tail}`;
      if (keepUpper.has(core.toUpperCase())) return `${lead}${core.toUpperCase()}${tail}`;
      if (index > 0 && keepLower.has(lower)) return `${lead}${lower}${tail}`;
      return `${lead}${core.charAt(0).toUpperCase()}${core.slice(1).toLowerCase()}${tail}`;
    })
    .join(" ")
    .replace(/\bNeville\b/g, "Neville")
    .replace(/\bGoddard\b/g, "Goddard")
    .replace(/\bTheta\b/g, "Theta")
    .replace(/\bbefore Sleep\b/g, "Before Sleep")
    .replace(/\bbefore Bed\b/g, "Before Bed")
    .replace(/\b1 Minutes\b/g, "1 Minute")
    .replace(/\b1 Days\b/g, "1 Day")
    .replace(/\b1 Signs\b/g, "1 Sign")
    .replace(/\b1 Steps\b/g, "1 Step")
    .replace(/\b1 Rules\b/g, "1 Rule")
    .replace(/\b1 Hidden Manifestation Rules\b/g, "1 Hidden Manifestation Rule")
    .replace(/\b1 Neville Money Signs\b/g, "1 Neville Money Sign")
    .replace(/(:\s+)([a-z])/g, (_, lead, letter) => `${lead}${letter.toUpperCase()}`);
}

function remixConcept() {
  if (!state.concept) return createConcept();
  state.generation = (state.generation || 0) + 1 + randomInt(97);
  const source = sourcePatterns[state.concept.laneKey];
  const currentTitle = state.concept.title;
  const recentTitles = Array.isArray(state.concept.recentTitles) ? state.concept.recentTitles : [currentTitle];
  const generated = selectValidatedConcept({
    laneKey: state.concept.laneKey,
    source,
    intensity: state.concept.intensity,
    seed: clean(document.querySelector("#seed").value)
  }, {
    excludeTitles: recentTitles
  });
  state.concept = {
    ...state.concept,
    ...generated,
    recentTitles: [...recentTitles, generated.title].slice(-24)
  };
  state.approved = false;
  state.assets = {};
  renderConcept();
  renderAsset();
  saveState();
  showToast("Concept remixed");
}

function approveConcept() {
  if (!state.concept) return showToast("Create a concept first");
  state.approved = true;
  renderConcept();
  saveState();
  showToast("Concept confirmed");
  document.querySelector("#assets").scrollIntoView({ behavior: "smooth" });
}

function renderConcept() {
  if (!state.concept) {
    conceptCard.className = "concept-card empty";
    conceptCard.innerHTML = `<p class="empty-state">Press Print Angle.</p>`;
    return;
  }
  const c = state.concept;
  const winnerPack = buildWinnerPack(c);
  const blueprint = contentBlueprint(c);
  const v = c.validation || {
    total: 0,
    max: 60,
    threshold: 42,
    pass: false,
    verdict: "Not checked",
    validators: [],
    preference: { checks: [], score: 0, passed: false },
    reasons: ["Create or remix the concept to run the growth check."]
  };
  const validators = v.validators || [];
  const preferenceChecks = v.preference?.checks || [];
  conceptCard.className = "concept-card";
  conceptCard.innerHTML = `
    <div class="concept-meta">
      <span class="pill">${c.sourceLane}</span>
      <span class="pill">${state.approved ? "Confirmed" : "Needs approval"}</span>
      <span class="pill">${c.cta}</span>
      <span class="pill money-pill">${v.pass ? "PASS" : "FAIL"} ${v.total}/${v.max || 60}</span>
    </div>
    <h4 class="concept-title">${escapeHtml(c.title)}</h4>
    <div class="validation-card">
      <div>
        <strong>Content War Room</strong>
        <p>${escapeHtml(v.verdict)} · publish line ${v.threshold || 42}/${v.max || 60}</p>
      </div>
      <div class="war-room-graph">
        ${validators.map((validator) => `
          <div class="validator-row ${validator.score >= 7 ? "pass" : "fail"}">
            <div>
              <strong>${escapeHtml(validator.name)}</strong>
              <small>${escapeHtml(validator.question)}</small>
            </div>
            <div class="bar-track" aria-label="${escapeHtml(validator.name)} score ${validator.score} out of 10">
              <span style="width: ${Math.max(6, validator.score * 10)}%"></span>
            </div>
            <b>${validator.score}/10</b>
          </div>
        `).join("")}
      </div>
      <div class="score-math">
        <strong>Score Math</strong>
        <span>${validators.map((validator) => validator.score).join(" + ")} = ${v.total}/${v.max || 60}</span>
      </div>
      <div class="preference-checks">
        ${preferenceChecks.map((check) => `
          <span class="${check.passed ? "pass" : "fail"}">${check.passed ? "PASS" : "FAIL"} · ${escapeHtml(check.label)}</span>
        `).join("")}
      </div>
      <ul>${(v.reasons || []).map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>
    </div>
    <div class="concept-grid">
      <div class="mini-card"><strong>Hook</strong><p>${escapeHtml(c.hook)}</p></div>
      <div class="mini-card"><strong>Promise</strong><p>${escapeHtml(c.promise)}</p></div>
      <div class="mini-card"><strong>Mechanism</strong><p>${escapeHtml(c.mechanism)}</p></div>
      <div class="mini-card story-proof-card"><strong>Sean Story Proof</strong><p>${escapeHtml(blueprint.story.card)}</p></div>
    </div>
    <div class="winner-pack">
      <div class="winner-pack-head">
        <div>
          <strong>Winner Format Pack</strong>
          <p>YouTube title angles, thumbnail prompts, TikTok titles, and email subjects for this exact concept.</p>
        </div>
        <span>Screenshot Style</span>
      </div>
      <div class="winner-pack-grid">
        <div class="pack-card title-rules-card">
          <strong>Viral Title Rules</strong>
          <ol>${winnerPack.titleRules.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
        </div>
        <div class="pack-card">
          <strong>YouTube Video Titles</strong>
          <ol>${winnerPack.youtubeTitles.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
        </div>
        <div class="pack-card">
          <strong>TikTok Titles</strong>
          <ol>${winnerPack.tiktokTitles.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
        </div>
        <div class="pack-card">
          <strong>Email Subject Lines</strong>
          <ol>${winnerPack.emailSubjects.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
        </div>
        <div class="pack-card thumbnail-prompts">
          <strong>Thumbnail Full Prompts</strong>
          ${winnerPack.thumbnailPrompts.map((item) => `
            <div class="prompt-card">
              <b>${escapeHtml(item.name)}</b>
              <small>Overlay: ${escapeHtml(item.overlay)}</small>
              <p>${escapeHtml(item.prompt)}</p>
            </div>
          `).join("")}
        </div>
      </div>
    </div>
    <div class="mini-card"><strong>Source Proof</strong><p>${escapeHtml(c.proof)}</p></div>
  `;
}

function createAssets() {
  if (!state.concept) return showToast("Create a concept first");
  if (!state.approved) return showToast("Confirm the concept first");
  state.assets = buildAssets(state.concept);
  state.activeAsset = "slideshow";
  renderAssetTabs();
  renderAsset();
  saveState();
  showToast("Asset batch created");
}

function buildAssets(c) {
  return {
    slideshow: buildSlideshowHtml(c),
    shorts: buildShorts(c),
    ig: buildInstagram(c),
    blog: buildBlog(c),
    broadcast: buildBroadcast(c),
    followup: buildFollowup(c)
  };
}

function contentBlueprint(c) {
  const outcome = cleanOutcome(c.outcome);
  const titleOutcome = titleOutcomePhrase(c.title, outcome);
  const lane = c.sourceLane || "Content Printer";
  const isNeville = c.laneKey === "neville";
  const mainClaim = isNeville
    ? `This is not about knowing more Neville. It is about making ${outcome} feel normal before you see it.`
    : `This is not another idea to collect. It is a simple way to make ${outcome} feel practical today.`;
  const hook = isNeville
    ? `Most people do not have a Neville problem. They have a ${outcome} rehearsal problem.`
    : c.hook;
  const pain = isNeville
    ? [
      "You say you want more money.",
      "Then you spend the day feeling tense about money.",
      "That is the loop.",
      "The feeling becomes familiar.",
      "The better result still feels far away."
    ]
    : [
      "You already understand the idea.",
      "But understanding does not always change behavior.",
      "The content has to make the next move feel obvious.",
      "That is where the money is."
    ];
  const shift = isNeville
    ? [
      "Neville called it living from the end.",
      "Plain English: practice the version of you who already got the result.",
      "Not for ten hours.",
      "For a few focused minutes.",
      "Especially before sleep."
    ]
    : [
      "Borrow the attention.",
      "Make the promise clear.",
      "Show the simple mechanism.",
      "Give one move they can try today."
    ];
  const ritual = isNeville
    ? [
      "Tonight, pick one tiny money scene.",
      "Make it boringly normal.",
      "A paid bill.",
      "A calm bank account.",
      "A message that says the money landed.",
      "Feel the relief for 7 minutes.",
      "Then sleep from that place."
    ]
    : [
      c.ritual,
      "Keep it simple.",
      "Make it easy enough to do today.",
      "Do not turn it into homework."
    ];

  const blueprint = {
    title: c.title,
    lane,
    isNeville,
    outcome,
    titleOutcome,
    hook,
    mainClaim,
    pain,
    shift,
    ritual,
    proof: c.proof,
    cta: c.cta,
    ctaLine: c.ctaLine,
    ctaUrl: c.ctaUrl
  };
  blueprint.story = storyForConcept(c, blueprint);
  return blueprint;
}

function storyForConcept(c, b) {
  const text = `${c.title} ${c.hook} ${c.promise} ${b.outcome} ${b.lane}`.toLowerCase();
  const story = SEAN_CONTENT_BRAIN.seanStory;
  const isMoney = /money|wealth|millionaire|income|cash|paid|bill/.test(text);
  const isSleep = /sleep|tonight|bed|morning|theta|audio|ritual/.test(text);
  const isFreedom = /freedom|panama|internet|business|operator/.test(text);
  const isIdentity = /identity|future|success|confidence|stuck|sabotage|programming/.test(text);

  if (c.laneKey === "operator") {
    return {
      card: "Sean's operator story is media buying, funnels, offers, AI systems, and direct response. AI is leverage, not the business.",
      shortProof: "Sean has built content, funnels, offers, ads, and AI systems from the operator side.",
      authority: "Direct-response marketer, media buyer, AI systems builder, and founder.",
      origin: "The first online sale proved money could come from creation, not permission.",
      signature: "AI is not the business. AI is the leverage.",
      plainClaim: "AI only works when the operator gives it a clear job."
    };
  }

  if (c.laneKey === "freedom") {
    return {
      card: "Sean's freedom story runs from Canada scarcity to online sales to Panama proof. The point is not travel. The point is internal shift plus internet leverage.",
      shortProof: "Sean used computers, offers, ads, and AI systems to turn the internet into a freedom vehicle.",
      authority: "Direct-response marketer, media buyer, AI systems builder, and founder.",
      origin: "The first online sale proved money could come from creation, not survival.",
      signature: "You do not have to inherit the future you were born into.",
      plainClaim: "Freedom starts when your daily system stops feeding the old life."
    };
  }

  if (isMoney || isSleep || b.isNeville) {
    return {
      card: "Before this was a product, it was Sean's private before-sleep ritual for making money feel safer and more normal.",
      shortProof: "Sean used this kind of before-sleep money rehearsal privately before it ever became Hypnotic Meditations.",
      authority: "10+ years building subconscious audio systems. 100,000+ audio programs/customers served.",
      origin: "One night Sean rehearsed money landing before sleep and realized the mind could be trained in that window.",
      signature: "Before this was a product, it was Sean's private ritual.",
      plainClaim: "Money does not just need a strategy. It has to feel safe enough to move toward."
    };
  }

  if (isFreedom) {
    return {
      card: "Sean's freedom story runs from Canada scarcity to online sales to Panama proof. The point is not travel. The point is internal shift plus internet leverage.",
      shortProof: "Sean used computers, offers, ads, and AI systems to turn the internet into a freedom vehicle.",
      authority: "Direct-response marketer, media buyer, AI systems builder, and founder.",
      origin: "The first online sale proved money could come from creation, not survival.",
      signature: "You do not have to inherit the future you were born into.",
      plainClaim: "Freedom starts when your daily system stops feeding the old life."
    };
  }

  if (isIdentity) {
    return {
      card: "Sean's source docs call this Identity Installation: rehearse a better future until it feels normal.",
      shortProof: "Sean's core belief: most people are not lazy. They are internally blocked.",
      authority: "15+ years using audio, theta, hypnosis, visualization, funnels, and AI from the operator side.",
      origin: "Cancer gave Sean perspective. Meditation gave him vision. The internet gave him the vehicle.",
      signature: "You are not broken. You are patterned. And patterns can be changed.",
      plainClaim: "The internal brake is the real problem."
    };
  }

  return {
    card: story.position,
    shortProof: "Sean turns hidden internal patterns into simple rituals people can actually use.",
    authority: story.authorityProof[0],
    origin: story.originBeats[0],
    signature: story.signatureLines[1],
    plainClaim: "Part of you wants more. Another part still thinks success is dangerous."
  };
}

function buildWinnerPack(c) {
  const b = contentBlueprint(c);
  const outcome = titleCase(b.titleOutcome || b.outcome || "money");
  const lowerOutcome = (b.titleOutcome || b.outcome || "money").toLowerCase();
  const lanePack = laneWinnerPack(c, b, outcome, lowerOutcome);

  const titleRules = [
    "Every title needs at least one viral device: WARNING, EXPOSED, secret, nobody, real, stop, why, mistake, proof, or danger.",
    "Use number, timeframe, and payoff wherever possible: 7 moves, 5 hours, 2026, before sleep, today, money, leverage.",
    "TikTok titles should feel native: POV, STOP, [save this], emoji, caps word, direct warning, or comment-bait.",
    "YouTube titles need a curiosity gap plus clear payoff. Never use a soft topic label.",
    "No soft education titles like 'What I learned about freedom' unless the hook is sharpened into a click."
  ];

  return {
    titleRules,
    youtubeTitles: uniq([b.title, ...lanePack.youtubeTitles]).slice(0, 8),
    tiktokTitles: uniq(lanePack.tiktokTitles).slice(0, 10),
    emailSubjects: uniq(lanePack.emailSubjects).slice(0, 10),
    thumbnailPrompts: lanePack.thumbnailPrompts
  };
}

function laneWinnerPack(c, b, outcome, lowerOutcome) {
  const title = b.title;
  const lane = c.laneKey;
  const baseCreator = "16:9 YouTube thumbnail, Sean Ali photo-realistic cutout, direct-response creator style, high contrast, mobile-readable, one clear focal point, bold 3-5 word overlay, no tiny text, no fake logos.";
  const cleanOutcomeTitle = outcome.replace(/\bBefore Sleep\b/i, "Before Sleep");

  if (lane === "freedom") {
    return {
      youtubeTitles: [
        "Panama Untold: 7 Secrets Tourists Never See In 2026",
        "WARNING: Don't Move To Panama In 2026 Until You See This",
        "The Hidden Panama Freedom Lesson Nobody Talks About",
        "I Found The Panama Secret That Changed My View Of Money",
        "7 Panama Truths That Make The Default Life Look Insane",
        "Why Panama Feels Dangerous To People Who Need Permission",
        "The REAL Reason I Built My Life In Panama",
        "Nobody Tells You This About Living In Panama"
      ],
      tiktokTitles: [
        "Panama is NOT what people think 🌴",
        "WARNING: don't move to Panama yet",
        "3 Panama secrets tourists miss",
        "POV: you stop needing permission",
        "Nobody tells you this about Panama",
        "The freedom lesson hidden in Panama",
        "I left the default script [Panama]",
        "Panama looks easy... until this",
        "This Panama truth changed me",
        "Tourists miss this completely"
      ],
      emailSubjects: [
        "don't move to Panama yet",
        "the Panama secret",
        "tourists miss this",
        "freedom is not a vibe",
        "I did not move for beaches",
        "nobody tells you this part"
      ],
      thumbnailPrompts: [
        {
          name: "Map Secret",
          overlay: "PANAMA SECRET",
          prompt: `${baseCreator} Show Sean on the right, simplified Panama map on the left, one glowing location pin, tropical city skyline and ocean background, warm yellow and blue contrast. Overlay text: "PANAMA SECRET". No arrows except one clean map pin.`
        },
        {
          name: "Tourists Miss This",
          overlay: "TOURISTS MISS THIS",
          prompt: `${baseCreator} Split-screen thumbnail: left side crowded tourist beach, right side quiet Panama city/ocean view with Sean looking serious. Use one red X over the tourist side and one green check over the hidden side. Overlay text: "TOURISTS MISS THIS".`
        },
        {
          name: "Freedom Proof",
          overlay: "FREEDOM PROOF",
          prompt: `${baseCreator} Sean standing by laptop with Panama skyline behind him, passport and laptop visual, clean sunlit background, strong orange/yellow headline. Overlay text: "FREEDOM PROOF". No arrow spam.`
        }
      ]
    };
  }

  if (lane === "operator") {
    return {
      youtubeTitles: [
        "I Used AI To Replace 5 Hours Of Work (No Team)",
        "Claude Code + YouTube = The AI Money System Nobody Is Using",
        "WARNING: AI Won't Make You Money Unless You Fix This First",
        "The 7 AI Operator Moves I Would Use To Build From Zero In 2026",
        "I Built A One-Person AI Content Machine In 3 Steps",
        "This Easy AI System Changed How I Create Content Forever",
        "Why 99% Of AI Business Advice Keeps Beginners Broke",
        "The REAL AI Business Playbook Nobody Shows Beginners"
      ],
      tiktokTitles: [
        "AI replaced 5 hours of work 😳",
        "POV: you become a 1-person media company",
        "STOP using AI like a toy",
        "WARNING: AI won't save a weak offer",
        "I would build THIS first in 2026",
        "Claude made content easy now [steal this]",
        "The AI operator move nobody talks about",
        "This is why beginners stay broke with AI",
        "I wish I knew this before using AI",
        "One person + AI system = unfair"
      ],
      emailSubjects: [
        "AI replaced 5 hours",
        "steal this AI workflow",
        "AI won't save this",
        "one person, unfair leverage",
        "what I would build first in 2026",
        "Claude made this too easy",
        "the AI operator move",
        "most AI advice is backwards"
      ],
      thumbnailPrompts: [
        {
          name: "AI Dashboard",
          overlay: "AI DID THIS",
          prompt: `${baseCreator} Sean pointing at a clean laptop dashboard showing generated assets, Claude-style chat window, content calendar, and green completion checks. Overlay text: "AI DID THIS". Use blue, black, white, and green. No arrows, one clean highlight glow.`
        },
        {
          name: "One Person System",
          overlay: "1 PERSON SYSTEM",
          prompt: `${baseCreator} Show Sean centered with five small work tasks behind him turning into one AI workflow diagram. Use simple blocks: idea, script, email, post, asset. Overlay text: "1 PERSON SYSTEM".`
        },
        {
          name: "Fix AI Workflow",
          overlay: "FIX THIS",
          prompt: `${baseCreator} Left side messy AI tabs and scattered notes, right side clean operator dashboard. Sean serious face in middle. Overlay text: "FIX THIS". Use one contrast line, no arrows.`
        }
      ]
    };
  }

  if (lane === "oldWealth") {
    return {
      youtubeTitles: [
        "Wallace Wattles EXPOSED: The 100-Year Wealth Secret Nobody Uses",
        "The Science Of Getting Rich Predicted The AI Money Era",
        "This Old Wealth Book Was Right About Modern Leverage",
        "7 Wallace Wattles Money Rules That Still Work In 2026",
        "The Wealth Law Hidden In Plain Sight Since 1910",
        "WARNING: Most People Read Wallace Wattles Wrong",
        "The 100-Year Money Idea That Makes AI Make Sense",
        "I Found The Hidden Wealth Rule Everyone Skips"
      ],
      tiktokTitles: [
        "This 100-year wealth law still works 😳",
        "Wallace Wattles was early",
        "Old book, new money secret",
        "The AI age made this book louder",
        "3 wealth rules people skipped",
        "Nobody reads this part correctly",
        "The old money law is back",
        "I found the hidden rule [save this]",
        "Most people read this book wrong",
        "This is not a book summary"
      ],
      emailSubjects: [
        "this 100-year money rule",
        "Wallace was early",
        "old book, new leverage",
        "the wealth law still works",
        "not a book summary",
        "the part people skipped",
        "AI made this obvious"
      ],
      thumbnailPrompts: [
        {
          name: "Old Book",
          overlay: "100-YEAR SECRET",
          prompt: `${baseCreator} Show old leather wealth book on the left, Sean on the right holding laptop, simple gold light beam between old book and modern AI dashboard. Overlay text: "100-YEAR SECRET". No arrows.`
        },
        {
          name: "Book To AI",
          overlay: "OLD LAW NEW MONEY",
          prompt: `${baseCreator} Split old book page texture with clean AI dashboard. Sean points at the connection between old principle and modern leverage. Overlay text: "OLD LAW NEW MONEY".`
        },
        {
          name: "Wallace Was Right",
          overlay: "WATTLES WAS RIGHT",
          prompt: `${baseCreator} Minimal thumbnail: book cover style background, Sean serious expression, one gold checkmark, bold white/yellow overlay. Overlay text: "WATTLES WAS RIGHT".`
        }
      ]
    };
  }

  if (lane === "manifestation") {
    return {
      youtubeTitles: [
        "Neville Goddard WARNING: This Manifestation Mistake Delays Everything",
        "Why Manifestation Works Sometimes And Fails Other Times",
        "Neville Goddard: Stop Forcing Belief And Do This Tonight",
        "The Missing Piece In Manifestation Before Sleep",
        "7 Neville Manifestation Mistakes That Delay The Result",
        "The Truth About Living From The End Nobody Explains",
        "Neville's Strange State Secret That Most People Skip",
        "Manifestation Fails Fast When You Skip This"
      ],
      tiktokTitles: [
        "🚨 this is your confirmation",
        "TYPE INCREASE if this is for you",
        "Your reality is expanding rn 😳",
        "POV: the old version can't hold this",
        "3 signs your timeline is shifting",
        "STOP forcing it. Become it.",
        "The old season is closing [watch]",
        "Your capacity is getting bigger",
        "This is why doors are opening",
        "Comment INCREASE if you felt that"
      ],
      emailSubjects: [
        "the part Neville people skip",
        "stop forcing belief",
        "why it works sometimes",
        "the state comes first",
        "before sleep, fix this",
        "living from the end",
        "are you checking again?"
      ],
      thumbnailPrompts: [
        {
          name: "Neville Book",
          overlay: "STATE FIRST",
          prompt: `${baseCreator} Simple Neville-style thumbnail: old book on left, Sean on right, one glowing word STATE in the middle. White background, red/orange accent, one clean contrast line. Overlay text: "STATE FIRST".`
        },
        {
          name: "Stop Forcing",
          overlay: "STOP FORCING",
          prompt: `${baseCreator} Sean with serious face, old notebook labeled desire vs state, red X on forcing, green check on feeling normal. Overlay text: "STOP FORCING". Minimal arrows.`
        },
        {
          name: "Missing Piece",
          overlay: "MISSING PIECE",
          prompt: `${baseCreator} Puzzle-piece visual over a simple Neville book and sleep/night background, Sean pointing calmly. Overlay text: "MISSING PIECE".`
        }
      ]
    };
  }

  return {
    youtubeTitles: [
      `Neville Goddard: The Strange 7 Minute Money Secret Before Sleep`,
      `Neville Goddard WARNING: Stop Rehearsing Money Stress Tonight`,
      `Neville Goddard's Strange 7 Minute Money Technique`,
      `The Neville Money Law Most People Skip`,
      `7 Neville Money Signs To Watch Before Sleep`,
      `Neville Goddard: Make ${cleanOutcome(lowerOutcome)} Feel Normal Tonight`,
      `The Wealth Feeling Neville Said To Practice Before Sleep`,
      `Neville Goddard: Money Starts Here`,
      `Expect Large Amounts Of Money? Neville Said Start Here`
    ],
    tiktokTitles: [
      "🚨 this is your money confirmation",
      "TYPE INCREASE if money is shifting",
      "Your money territory is expanding 💰",
      "POV: money finally feels normal",
      "3 money signs to watch tonight",
      "STOP rehearsing money stress",
      "Neville was right about this 😳",
      "The old money season is closing",
      "This before sleep trick is wild",
      "Comment INCREASE if this hit"
    ],
    emailSubjects: [
      "the 7 minute money feeling",
      "Neville before sleep",
      "money has to feel safe",
      "what are you rehearsing?",
      "try this tonight",
      "the wealth state",
      "before sleep, do this"
    ],
    thumbnailPrompts: [
      {
        name: "Neville Money Secret",
        overlay: "7-MIN MONEY SECRET",
        prompt: `${baseCreator} Simple Neville wealth thumbnail: old book on the left, Sean on the right, warm money glow in the middle, one bold headline. Overlay text: "7-MIN MONEY SECRET". No arrow spam, no circles.`
      },
      {
        name: "Before Sleep",
        overlay: "BEFORE SLEEP",
        prompt: `${baseCreator} Sean beside a dark nightstand/laptop scene, subtle moon icon, old Neville book, calm money notification glow. Overlay text: "BEFORE SLEEP". One clean visual idea.`
      },
      {
        name: "Money State",
        overlay: "MONEY STATE",
        prompt: `${baseCreator} Sean holding a simple card that says STATE, background split between stress and calm bank account. Overlay text: "MONEY STATE". Minimal design.`
      }
    ]
  };
}

function cleanOutcome(outcome) {
  const value = clean(outcome).toLowerCase();
  if (!value || value === "the result you keep waiting for") return "more money";
  if (value.includes("large amounts")) return "large amounts of money";
  if (value.includes("money")) return value;
  if (value.includes("wealth")) return value;
  if (value.includes("millionaire")) return value;
  return value;
}

function titleOutcomePhrase(title, fallback) {
  const value = String(title || "").toLowerCase();
  if (value.includes("money")) return "money";
  if (value.includes("wealth")) return "wealth";
  if (value.includes("millionaire")) return "millionaire confidence";
  if (value.includes("sleep")) return "better sleep";
  if (value.includes("freedom")) return "freedom";
  return fallback || "the outcome";
}

function uniq(items) {
  return [...new Set(items.filter(Boolean))];
}

function titleEmoji(value) {
  if (/money|wealth|millionaire|income|cash/.test(value)) return "💰";
  if (/sleep|night|calm/.test(value)) return "🌙";
  if (/freedom|panama/.test(value)) return "🌴";
  if (/identity|confidence|success/.test(value)) return "🧠";
  return "⚡";
}

function laneHashtags(laneKey) {
  return {
    neville: "#NevilleGoddard #Manifestation #MoneyMindset #BeforeSleep #LivingFromTheEnd #SeanAli",
    manifestation: "#NevilleGoddard #Manifestation #LawOfAssumption #LivingFromTheEnd #MindsetShift #SeanAli",
    oldWealth: "#WallaceWattles #ScienceOfGettingRich #WealthMindset #MoneyLessons #SeanAli",
    operator: "#AIBusiness #AISystems #ContentSystems #OperatorMindset #OnlineBusiness #SeanAli",
    freedom: "#PanamaUntold #PanamaLife #FreedomLifestyle #DigitalEntrepreneur #SeanAli"
  }[laneKey] || "#SeanAli #ContentStrategy #OnlineBusiness";
}

function buildSlideshowHtml(c) {
  const b = contentBlueprint(c);
  const slides = manifestationSlides(c, b).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${escapeHtml(c.title)} · Slideshow by Sean Ali</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<style>
${manifestationDeckCss()}
</style>
</head>
<body>
<div class="presentation">
  <div class="slides-container" id="slidesContainer">
${slides}
  </div>
  <div class="progress-bar"><div class="progress-fill" id="progressFill"></div></div>
  <div class="nav-controls">
    <button class="nav-btn" id="prevSlideBtn" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
    <div class="counter" id="slideCounter">1 / 9</div>
    <button class="nav-btn" id="nextSlideBtn" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
  </div>
</div>
<script>
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevSlideBtn');
const nextBtn = document.getElementById('nextSlideBtn');
const counter = document.getElementById('slideCounter');
const progressFill = document.getElementById('progressFill');
let currentIdx = 0;
const totalSlides = slides.length;
function updateSlides() {
  slides.forEach((slide, idx) => slide.classList.toggle('active', idx === currentIdx));
  counter.innerText = (currentIdx + 1) + ' / ' + totalSlides;
  progressFill.style.width = (((currentIdx + 1) / totalSlides) * 100) + '%';
}
function goToSlide(index) {
  if (index < 0) index = totalSlides - 1;
  if (index >= totalSlides) index = 0;
  currentIdx = index;
  updateSlides();
}
prevBtn.addEventListener('click', () => goToSlide(currentIdx - 1));
nextBtn.addEventListener('click', () => goToSlide(currentIdx + 1));
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault();
    goToSlide(currentIdx - 1);
  } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
    e.preventDefault();
    goToSlide(currentIdx + 1);
  }
});
let touchStartX = 0;
const container = document.querySelector('.presentation');
container.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
container.addEventListener('touchend', (e) => {
  if (!touchStartX) return;
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 40) {
    if (diff > 0) goToSlide(currentIdx - 1);
    else goToSlide(currentIdx + 1);
  }
  touchStartX = 0;
}, { passive: true });
updateSlides();
</script>
</body>
</html>`;
}

function manifestationSlides(c, b) {
  const outcome = titleCase(b.titleOutcome);
  const pain = b.pain.slice(0, 4);
  const ritual = b.ritual.slice(0, 5);
  const shift = b.shift.slice(0, 4);
  const title = headlineWithEmphasis(b.title, b.titleOutcome);
  const frameTitle = b.isNeville ? "Living From The End" : "Make The Promise Obvious";
  const frameSubhead = b.isNeville
    ? "Plain English: rehearse the result until it stops feeling far away."
    : "Borrow attention, make the promise clear, and give one move.";

  return [
    `<div class="slide active" data-index="0">
      <div class="slide-content">
        <div class="eyebrow">${escapeHtml(b.lane)} · SEAN ALI</div>
        <h1 class="big-title">${title}</h1>
        <div class="subhead">${escapeHtml(c.hook)}</div>
        <div class="accent-rule"></div>
        <div class="icon-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px,1fr));">
          ${iconCard("fas fa-bolt", "The Click", `People care about ${b.titleOutcome}.`)}
          ${iconCard("fas fa-brain", "The Shift", "Make the future feel normal first.")}
          ${iconCard("fas fa-fingerprint", "Sean Proof", b.story.shortProof)}
        </div>
      </div>
    </div>`,
    `<div class="slide" data-index="1">
      <div class="slide-content">
        <div class="eyebrow">🚨 EVER NOTICE?</div>
        <h1 class="big-title">You want <em>${escapeHtml(outcome)}</em>.<br>But your body keeps practicing the opposite.</h1>
        <div class="subhead">${escapeHtml(pain.join(" "))}</div>
        <div class="accent-rule"></div>
        <div class="icon-grid">
          ${iconCard("fas fa-chart-line", "The Desire", `The result is ${b.titleOutcome}.`)}
          ${iconCard("fas fa-chart-simple", "The Loop", "The old feeling still runs the day.")}
        </div>
      </div>
    </div>`,
    `<div class="slide" data-index="2">
      <div class="slide-content">
        <div class="eyebrow">⚖️ THE DISTINCTION</div>
        <h1 class="big-title">There is the <em>wish</em><br>and the <em>state.</em></h1>
        <div class="subhead">${escapeHtml(b.mainClaim)} ${escapeHtml(b.story.plainClaim)}</div>
        <div class="split-2col">
          <div class="col"><h3><i class="fas fa-ban"></i> The old loop</h3>
            <div class="list-icon-stack">
              ${listItem("fas fa-hourglass-half", "Waiting for the result to change your feeling")}
              ${listItem("fas fa-cloud-moon", "Checking, forcing, and replaying lack")}
              ${listItem("fas fa-arrow-down", "Making the old state feel familiar")}
            </div>
          </div>
          <div class="col"><h3><i class="fas fa-check-circle"></i> The better move</h3>
            <div class="list-icon-stack">
              ${listItem("fas fa-eye", "Pick the end scene")}
              ${listItem("fas fa-redo-alt", "Rehearse it until it feels normal")}
              ${listItem("fas fa-chart-line", "Move from the new state")}
            </div>
          </div>
        </div>
      </div>
    </div>`,
    `<div class="slide" data-index="3">
      <div class="slide-content">
        <div class="eyebrow">🧠 WHAT THIS ACTUALLY DOES</div>
        <h1 class="big-title">It changes what you <em>notice</em><br>and what you do next.</h1>
        <div class="subhead">${escapeHtml(c.promise)} ${escapeHtml(b.story.origin)}</div>
        <div class="icon-grid">
          ${iconCard("fas fa-bullseye", "Directs Attention", "Your mind starts filtering for the new result.")}
          ${iconCard("fas fa-lightbulb", "Notices Moves", "You spot options you were ignoring.")}
          ${iconCard("fas fa-fire", "Builds Stamina", "The result stops feeling impossible.")}
          ${iconCard("fas fa-shield-alt", "Handles Doubt", "You return to the state faster.")}
          ${iconCard("fas fa-sync-alt", "Repeats Better", "The future self becomes familiar.")}
        </div>
      </div>
    </div>`,
    `<div class="slide slide-dark" data-index="4">
      <div class="slide-content">
        <div class="eyebrow">🔁 THE CHAIN REACTION</div>
        <h1 class="big-title">What feels normal →<br>changes what you <em>do</em>.</h1>
        <div class="subhead" style="margin-bottom: 1rem;">What you do → changes your odds.</div>
        <div class="accent-rule"></div>
        <div class="icon-grid" style="margin-top: 1rem;">
          ${iconCard("fas fa-eye", "State shapes action", "The feeling becomes the filter.")}
          ${iconCard("fas fa-chart-line", "Action compounds", "Clean moves stack into real results.")}
        </div>
      </div>
    </div>`,
    `<div class="slide" data-index="5">
      <div class="slide-content">
        <div class="eyebrow">📚 5 HARD TRUTHS</div>
        <h1 class="big-title">${escapeHtml(outcome)} doesn't change<br>from <em>wishing</em> alone</h1>
        <div class="truth-deck">
          ${truthItem("01", "fas fa-eye", "Attention directs behavior", "Focus changes what you see.")}
          ${truthItem("02", "fas fa-redo-alt", "Repetition changes identity", "Rehearse it until it feels normal.")}
          ${truthItem("03", "fas fa-chart-simple", "Behavior compounds", "Small moves stack.")}
          ${truthItem("04", "fas fa-dice-d6", "More attempts = more luck", "Volume increases probability.")}
          ${truthItem("05", "fas fa-scale-balanced", "Reality audits belief", "The result shows the real state.")}
        </div>
        <div class="subhead" style="margin-top: 1rem;">${escapeHtml(b.proof)} ${escapeHtml(b.story.authority)}</div>
      </div>
    </div>`,
    `<div class="slide" data-index="6">
      <div class="slide-content">
        <div class="eyebrow">💡 RETHINKING THE FRAMEWORK</div>
        <h1 class="big-title">${escapeHtml(frameTitle.split(" ")[0])} over <em>forcing</em></h1>
        <div class="split-2col">
          <div class="col"><i class="fas fa-ban" style="font-size: 2.4rem; color: var(--accent); display: block; text-align: center;"></i><h3>❌ Don't do this</h3>
            <div class="list-icon-stack">
              ${listItem("fas fa-cloud-moon", "Try to force belief while feeling lack")}
              ${listItem("fas fa-hourglass-half", "Check every five minutes")}
            </div>
          </div>
          <div class="col"><i class="fas fa-check-circle" style="font-size: 2.4rem; color: var(--accent); display: block; text-align: center;"></i><h3>✅ Do this instead</h3>
            <div class="list-icon-stack">
              ${shift.slice(0, 2).map((item, index) => listItem(index ? "fas fa-chart-simple" : "fas fa-brain", item)).join("")}
            </div>
          </div>
        </div>
        <div class="subhead" style="margin-top: 1.5rem;">${escapeHtml(frameSubhead)} ${escapeHtml(b.story.signature)}</div>
      </div>
    </div>`,
    `<div class="slide slide-dark" data-index="7">
      <div class="slide-content">
        <div class="eyebrow">🔥 THE REAL SECRET</div>
        <h1 class="big-title">Stop asking:<br>“Where is my <em>${escapeHtml(outcome)}</em>?”</h1>
        <div class="accent-rule"></div>
        <h2 style="font-family: 'Syne', sans-serif; font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 700; margin: 1rem 0;">Start asking:</h2>
        <div class="big-title" style="font-size: clamp(2rem,5vw,3rem); color: var(--accent);">“What am I rehearsing right now?”</div>
        <div class="subhead" style="margin-top: 1.5rem;">${escapeHtml(ritual.join(" "))} ${escapeHtml(b.story.plainClaim)}</div>
      </div>
    </div>`,
    `<div class="slide slide-accent" data-index="8">
      <div class="slide-content">
        <div class="eyebrow" style="color: rgba(255,255,245,0.9);">🧠 RUN THE RITUAL</div>
        <h1 class="big-title">${escapeHtml(b.cta)}<br><em>Tonight.</em></h1>
        <div class="icon-grid" style="margin: 1.8rem 0;">
          ${accentCard("fas fa-eye", "Pick the scene", "One clear end result")}
          ${accentCard("fas fa-dumbbell", "Feel it normal", "Seven focused minutes")}
          ${accentCard("fas fa-chart-line", "Move different", "Let the state lead")}
        </div>
        <div class="subhead" style="color: #FFF6EA;">👇 ${escapeHtml(b.ctaLine)}</div>
        <div class="accent-rule" style="background: rgba(255,255,200,0.5);"></div>
        <div class="deck-footer">${escapeHtml(b.ctaUrl || "seanali.online")} · Sean Ali</div>
      </div>
    </div>`
  ];
}

function headlineWithEmphasis(title, emphasis) {
  const safeTitle = escapeHtml(title);
  const phrase = clean(emphasis);
  if (!phrase) return safeTitle;
  const index = safeTitle.toLowerCase().indexOf(escapeHtml(phrase).toLowerCase());
  if (index === -1) return safeTitle;
  return `${safeTitle.slice(0, index)}<em>${safeTitle.slice(index, index + phrase.length)}</em>${safeTitle.slice(index + phrase.length)}`;
}

function iconCard(icon, title, text) {
  return `<div class="icon-card"><i class="${escapeHtml(icon)}"></i><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>`;
}

function accentCard(icon, title, text) {
  return `<div class="icon-card accent-icon-card"><i class="${escapeHtml(icon)}"></i><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div>`;
}

function listItem(icon, text) {
  return `<div class="list-item-icon"><i class="${escapeHtml(icon)}"></i><span>${escapeHtml(text)}</span></div>`;
}

function truthItem(number, icon, title, text) {
  return `<div class="truth-item"><div class="truth-num">${escapeHtml(number)}</div><i class="${escapeHtml(icon)} truth-icon"></i><h4>${escapeHtml(title)}</h4><p>${escapeHtml(text)}</p></div>`;
}

function manifestationDeckCss() {
  return `*{margin:0;padding:0;box-sizing:border-box}:root{--bg-light:#FEFCF7;--ink:#161513;--ink-soft:#3A3631;--accent:#E34D2B;--accent-hover:#C13E1F;--gray-line:#E9E3D9;--slide-max-width:1200px}body{background:#1a1816;font-family:'DM Sans',sans-serif;overflow:hidden;height:100vh;width:100vw}.presentation{position:relative;width:100%;height:100%;background:var(--bg-light);overflow:hidden}.slides-container{position:relative;width:100%;height:100%}.slide{position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:opacity .45s cubic-bezier(.2,.9,.4,1.1),visibility 0s linear .45s;background:var(--bg-light);overflow-y:auto;padding:2rem}.slide.active{opacity:1;visibility:visible;transition:opacity .45s cubic-bezier(.2,.9,.4,1.1),visibility 0s linear 0s;z-index:10}.slide::-webkit-scrollbar{width:5px}.slide::-webkit-scrollbar-track{background:#E2DCD1}.slide::-webkit-scrollbar-thumb{background:var(--accent);border-radius:6px}.slide-content{max-width:var(--slide-max-width);width:100%;margin:0 auto;text-align:center;padding:1rem .5rem}.eyebrow{font-family:'Syne',sans-serif;font-weight:700;letter-spacing:.2em;text-transform:uppercase;font-size:clamp(.7rem,2.5vw,.9rem);color:var(--accent);margin-bottom:1.2rem;display:inline-block}h1,.big-title{font-family:'Syne',sans-serif;font-weight:700;font-size:clamp(2.8rem,8vw,5.2rem);line-height:1.12;letter-spacing:-.02em;color:var(--ink);margin-bottom:1rem;overflow-wrap:normal;word-break:normal}.big-title em{font-style:normal;color:var(--accent)}.subhead{font-size:clamp(1rem,3vw,1.4rem);color:var(--ink-soft);max-width:760px;margin:0 auto 1.8rem auto;font-weight:450}.accent-rule{width:70px;height:3px;background:var(--accent);margin:1rem auto 1.8rem auto;border:0;border-radius:6px}.icon-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:2rem;margin:2rem 0 1rem}.icon-card{background:#fff;border-radius:2rem;padding:1.8rem 1rem;text-align:center;box-shadow:0 6px 14px rgba(0,0,0,.02),0 2px 4px rgba(0,0,0,.02);border:1px solid var(--gray-line);transition:transform .2s}.icon-card:hover{transform:translateY(-4px)}.icon-card i,.icon-card .big-icon{font-size:2.8rem;color:var(--accent);margin-bottom:.8rem;display:inline-block}.icon-card h3{font-family:'Syne',sans-serif;font-weight:700;font-size:1.6rem;margin-bottom:.5rem;color:var(--ink)}.icon-card p{font-size:.95rem;line-height:1.4;color:var(--ink-soft)}.split-2col{display:flex;flex-wrap:wrap;gap:1.8rem;margin-top:2rem;text-align:left}.col{flex:1;min-width:260px;background:#fff;border-radius:1.8rem;padding:1.8rem;border:1px solid var(--gray-line)}.col h3{font-family:'Syne',sans-serif;font-size:1.7rem;font-weight:700;margin-bottom:1rem;text-align:center}.list-icon-stack{display:flex;flex-direction:column;gap:1rem}.list-item-icon{display:flex;align-items:center;gap:1rem;background:#FCF9F2;padding:.8rem 1rem;border-radius:1.2rem}.list-item-icon i{font-size:1.8rem;width:2.2rem;color:var(--accent)}.list-item-icon span{font-weight:500;font-size:1.05rem}.truth-deck{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:1.5rem;margin:2rem 0}.truth-item{background:#fff;border-radius:1.6rem;padding:1.4rem .8rem;text-align:center;border:1px solid var(--gray-line)}.truth-num{font-family:'Syne',sans-serif;font-size:2.2rem;font-weight:700;color:var(--accent);opacity:.65}.truth-icon{font-size:2.3rem;margin:.6rem 0;display:block}.truth-item h4{font-family:'Syne',sans-serif;font-size:1.3rem;font-weight:700;margin-bottom:.5rem}.truth-item p{font-size:.9rem;color:#49453F}.slide-dark{background:#181714}.slide-dark .big-title,.slide-dark h1,.slide-dark h3,.slide-dark .eyebrow,.slide-dark .subhead{color:#FEFCF7}.slide-dark .big-title em{color:#FFB39F}.slide-dark .subhead{color:#CBC6BE}.slide-dark .icon-card{background:#2A2723;border-color:#45403A;color:#fff}.slide-dark .icon-card h3{color:#fff}.slide-dark .icon-card p{color:#D6D1C8}.slide-dark .col{background:#23201D;border-color:#3E3A35}.slide-dark .list-item-icon{background:#322E29}.slide-dark .truth-item{background:#23201D;border-color:#45403A;color:#F0EDE5}.slide-accent{background:var(--accent);color:#fff}.slide-accent .slide-content{padding-bottom:5.6rem}.slide-accent .big-title,.slide-accent h1,.slide-accent .eyebrow,.slide-accent .subhead{color:#fff}.slide-accent .big-title{font-size:clamp(2.5rem,7vw,5rem)}.slide-accent .big-title em,.slide-accent h1 em{color:#FFF6D9;text-shadow:0 2px 0 rgba(0,0,0,.12)}.slide-accent .subhead{color:#FFF6EA}.slide-accent .accent-rule{background:rgba(255,255,255,.55)}.slide-accent .accent-icon-card{background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.28);box-shadow:none;color:#fff}.slide-accent .accent-icon-card i{color:#FFF6D9;opacity:1}.slide-accent .accent-icon-card h3{color:#fff;text-shadow:0 1px 0 rgba(0,0,0,.08)}.slide-accent .accent-icon-card p{color:#FFF3E4;font-weight:600}.slide-accent .deck-footer{font-family:'Syne',sans-serif;margin-top:1rem;font-size:.8rem;letter-spacing:1px;font-weight:700;color:#FFF6EA}.nav-controls{position:fixed;bottom:1.8rem;left:0;right:0;display:flex;justify-content:center;gap:1rem;z-index:30;background:rgba(22,21,19,.7);backdrop-filter:blur(12px);width:fit-content;margin:0 auto;padding:.6rem 1.4rem;border-radius:60px;border:1px solid rgba(255,255,220,.15)}.nav-btn{background:rgba(0,0,0,.5);border:none;font-size:1.6rem;cursor:pointer;color:#F5EFE5;width:44px;height:44px;border-radius:40px;display:inline-flex;align-items:center;justify-content:center;transition:all .2s}.nav-btn:hover{background:var(--accent);color:#fff}.counter{font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;letter-spacing:.05em;background:rgba(0,0,0,.6);padding:0 1rem;border-radius:40px;display:flex;align-items:center;color:#F0EADE}.progress-bar{position:fixed;bottom:0;left:0;width:100%;height:3px;background:#332E29;z-index:40}.progress-fill{height:100%;width:0%;background:var(--accent);transition:width .3s ease}@media(max-width:640px){.slide{padding:1.2rem}.icon-card h3{font-size:1.3rem}.slide-accent .big-title{font-size:clamp(2.2rem,12vw,3.4rem)}}`;
}

function buildShorts(c) {
  const b = contentBlueprint(c);
  const f = assetAudienceFrame(c, b);
  return `YOUTUBE SHORTS COPY PACK
Concept: ${c.title}
Lane: ${b.lane}
CTA: ${c.cta}

Copy each script directly into your recorder or teleprompter.

==============================
SHORT 1: PROMISE HOOK
==============================
Title: ${c.title}
On-screen hook:
${f.hook}

Voiceover script:
${f.short1}

Caption:
${c.ctaLine}

==============================
SHORT 2: CONTRARIAN TAKE
==============================
Title: ${f.short2Title}
On-screen hook:
${f.short2Hook}

Voiceover script:
${f.short2}

Caption:
${c.ctaLine}

==============================
SHORT 3: KITCHEN TABLE
==============================
Title: ${f.short3Title}
On-screen hook:
${f.short3Hook}

Voiceover script:
${f.short3}

Caption:
${c.ctaLine}

==============================
SHORT 4: STORY PROOF
==============================
Title: ${f.short4Title}
On-screen hook:
${f.short4Hook}

Voiceover script:
${f.short4}

Caption:
${c.ctaLine}

==============================
SHORT 5: COMMENT BAIT
==============================
Title: ${f.short5Title}
On-screen hook:
${f.short5Hook}

Voiceover script:
${f.short5}

Caption:
${f.commentBait}

==============================
SHORT 6: MYTH BUST / RESET
==============================
Title: ${f.short6Title}
On-screen hook:
${f.short6Hook}

Voiceover script:
${f.short6}

Caption:
${c.ctaLine}

==============================
SHORT 7: SIMPLE ACTION
==============================
Title: ${f.short7Title}
On-screen hook:
${f.short7Hook}

Voiceover script:
${f.short7}

Caption:
${c.ctaLine}`;
}

function buildInstagram(c) {
  const b = contentBlueprint(c);
  const f = assetAudienceFrame(c, b);
  const tags = laneHashtags(c.laneKey);
  return `INSTAGRAM COPY PACK
Concept: ${c.title}
Lane: ${b.lane}

Copy each "Caption to paste" block directly into Instagram.

==============================
POST 1: FEED CAPTION
==============================
Caption to paste:
${c.title}

${f.ig1}

${c.ctaLine}

First comment to paste:
${f.firstComment}

Hashtags to paste:
${tags}

==============================
POST 2: CAROUSEL
==============================

Slide 1:
${c.title}

Slide 2:
${f.carousel2}

Slide 3:
${f.carousel3}

Slide 4:
${f.carousel4}

Slide 5:
${f.carousel5}

Caption:
${f.ig2}

First comment to paste:
${c.ctaLine}

Hashtags to paste:
${tags}

==============================
POST 3: REEL CAPTION
==============================
Caption to paste:
${f.ig3}

First comment to paste:
${f.firstComment}

Hashtags to paste:
${tags}`;
}

function buildBlog(c) {
  const b = contentBlueprint(c);
  const f = assetAudienceFrame(c, b);
  return `VLOG / LOOM EXECUTION PLAN
Concept: ${c.title}
Lane: ${b.lane}

Video title:
${c.title}

Format:
Raw Loom or selfie video. Kitchen table simple. No overproduced edit.

Core promise:
${c.promise}

Copy-ready run of show:

1. Cold open
Say:
"${c.title}"

Then say:
"${f.hook}"

2. Show the problem
Say:
"${f.vlogProblem}"

3. Show the mechanism
Say:
"${f.vlogMechanism}"

4. Sean proof beat
Say:
"${f.vlogProof}"

5. Make it useful
Say:
"${f.vlogAction}"

6. Close
Say:
"${f.vlogClose}"

Shot list:
- Sean on camera
- One screen share or visual proof
- One simple note card with the main phrase
- One CTA screen

CTA line to paste:
${c.ctaLine}`;
}

function buildBroadcast(c) {
  const b = contentBlueprint(c);
  const f = assetAudienceFrame(c, b);
  const subjects = buildWinnerPack(c).emailSubjects.slice(0, 5);
  return `EMAIL BROADCAST COPY
Concept: ${c.title}
Lane: ${b.lane}

Choose one subject:
${subjects.map((subject, index) => `${index + 1}. ${subject}`).join("\n")}

Preview text to paste:
${f.preview}

Body to paste:
${f.email}

Sean

${c.ctaUrl}`;
}

function buildFollowup(c) {
  const b = contentBlueprint(c);
  const f = assetAudienceFrame(c, b);
  return `EMAIL FOLLOW-UP COPY
Concept: ${c.title}
Lane: ${b.lane}

Choose one subject:
1. quick follow up
2. what did you rehearse?
3. the part people miss

Preview text to paste:
${f.followPreview}

Body to paste:
Quick follow up.

Yesterday I sent you this idea:

${c.title}

The part most people miss is this:

${f.followLesson}

It is not supposed to be complicated.

${f.followAction}

So let me ask you:

${f.followQuestion}

Sean`;
}

function assetAudienceFrame(c, b) {
  const ritual = b.ritual.filter(Boolean);
  const oneMove = ritual[0] || c.ritual || "Do the simple move today.";
  const secondMove = ritual[1] || "Keep it simple enough to repeat.";
  const thirdMove = ritual[2] || "Do not turn it into a debate.";
  const proof = b.story.shortProof;

  if (c.laneKey === "freedom") {
    return {
      hook: c.hook,
      short1: `Panama is not just a pretty backdrop.\nIt is a pattern interrupt.\nYou see how many people are still living by rules they never chose.\nThen you ask a better question:\nWhat would my life look like if I stopped needing permission?\nThat is the real Panama lesson.`,
      short2Title: "Panama is not the point",
      short2Hook: "Panama is not the point. Freedom is.",
      short2: `People think the story is beaches.\nIt is not.\nThe story is what happens when you build enough leverage to choose your environment.\nDifferent city.\nDifferent pace.\nDifferent standard.\nYou start seeing the default life from the outside.`,
      short3Title: "Kitchen table Panama truth",
      short3Hook: "Here is the part tourists miss.",
      short3: `If we were sitting at the table, I would say it plainly.\nPanama did not make me free.\nIt showed me what freedom costs.\nYou still need income.\nYou still need discipline.\nYou still need a system.\nThe location is proof, not the plan.`,
      short4Title: "Why I left the default script",
      short4Hook: "I did not leave for a vacation.",
      short4: `I left because the old script felt too small.\nCanada taught me survival.\nThe internet gave me leverage.\nPanama gave me space to see what I was building.\nThat is the lesson.\nYou do not need a new country first.\nYou need a new operating system.`,
      short5Title: "Panama comment bait",
      short5Hook: "Would you ever leave the default path?",
      short5: `Most people say they want freedom.\nBut they still want everyone to approve the move.\nThat is not freedom.\nThat is permission with better branding.\nComment PANAMA if you want the real breakdown.`,
      short6Title: "Travel content is lying",
      short6Hook: "Most Panama videos miss the useful part.",
      short6: `They show beaches.\nThey show condos.\nThey show cost of living.\nThat is fine.\nBut the real question is this:\nWhat kind of person can actually build a life there?\nThat is the content I care about.`,
      short7Title: "One action",
      short7Hook: "Before you move anywhere, build this.",
      short7: `Build portable income.\nBuild a simple routine.\nBuild the ability to work without being watched.\nThen the city becomes a choice.\nNot an escape.`,
      commentBait: "Comment PANAMA if you want the real version.",
      firstComment: "Comment PANAMA and I will make the next one more specific.",
      ig1: `${c.hook}\n\nPanama is not the point.\n\nFreedom is.\n\nThe useful question is not where should I move?\n\nThe useful question is:\nwhat system would let me choose where I live?`,
      ig2: `Panama is proof.\n\nNot because life is perfect there.\n\nBecause it shows what internet leverage can make possible when you stop living by the default script.`,
      ig3: `Nobody tells you this about Panama.\n\nThe place does not make you free.\n\nYour system does.\n\nThe location just reveals whether you actually built one.`,
      carousel2: "Panama is not the plan.",
      carousel3: "Panama is proof that the default script can be interrupted.",
      carousel4: "Build portable income first. Then choose the room you want to think from.",
      carousel5: "Freedom is not a vibe. It is a system.",
      preview: "Panama is not really about Panama.",
      email: `Panama is not really about Panama.\n\nIt is about permission.\n\nMost people wait for permission to build the life they actually want.\n\nPermission from family.\nPermission from the market.\nPermission from the version of themselves that still wants to play safe.\n\nBut freedom does not start when you move.\n\nIt starts when you build a system that lets you choose.\n\nThat is why Panama matters to me.\n\nNot because it is perfect.\n\nBecause it is proof.\n\nReply and tell me this:\n\nif money was handled, where would you actually want to live?`,
      followPreview: "The location is not the shortcut.",
      followLesson: "The location is proof, not the plan.",
      followAction: "Build portable income. Build a simple daily system. Then choose where you want to think from.",
      followQuestion: "where would you live if you stopped needing permission?",
      vlogProblem: "Most Panama content shows the surface. Beaches, condos, cost of living. The real story is freedom, leverage, and what it takes to live outside the default script.",
      vlogMechanism: "Panama works as content because it gives people a concrete symbol for freedom. Then you redirect that attention into systems, income, and identity.",
      vlogProof: b.story.origin,
      vlogAction: "Show one Panama visual, then explain the system behind the lifestyle: portable income, daily discipline, and internet leverage.",
      vlogClose: "If you could live anywhere, what system would you need to build first?"
    };
  }

  if (c.laneKey === "operator") {
    return {
      hook: c.hook,
      short1: `AI is not the business.\nAI is the leverage.\nBig difference.\nIf your offer is weak, AI just helps you make weak stuff faster.\nBut if the idea is clear, AI can turn one person into a real content machine.`,
      short2Title: "AI is not magic",
      short2Hook: "Stop using AI like a toy.",
      short2: `Most people open AI and ask for random ideas.\nThat is why the output feels random.\nOperators use AI inside a system.\nOne input.\nClear rules.\nSpecific output.\nThen repeat.`,
      short3Title: "Kitchen table AI",
      short3Hook: "Here is the kitchen table AI rule.",
      short3: `Do not ask AI to save your business.\nAsk it to remove one bottleneck.\nOne script.\nOne email.\nOne content batch.\nOne workflow.\nThat is how leverage becomes real.`,
      short4Title: "Operator proof",
      short4Hook: "After real ad spend, cute advice stops working.",
      short4: `When you have paid for attention, you stop worshipping fancy ideas.\nYou care about what gets clicked.\nWhat gets watched.\nWhat gets bought.\nThat is why AI has to be tied to revenue, not novelty.`,
      short5Title: "AI comment bait",
      short5Hook: "What would you automate first?",
      short5: `If AI could remove 5 hours from your week, what would you give it?\nContent?\nEmail?\nResearch?\nScripts?\nStart there.\nComment AI if you want my operator stack.`,
      short6Title: "AI myth bust",
      short6Hook: "AI will not fix unclear thinking.",
      short6: `AI multiplies the operator.\nIt does not replace the operator.\nIf you give it vague inputs, you get vague outputs.\nIf you give it a system, it becomes leverage.`,
      short7Title: "One AI action",
      short7Hook: "Try this before buying another tool.",
      short7: `Pick one repeat task.\nWrite the exact output you want.\nGive AI three examples.\nMake it produce one usable draft.\nThat is the start of a system.`,
      commentBait: "Comment AI if you want the operator stack.",
      firstComment: "Comment AI and I will break down the workflow.",
      ig1: `${c.hook}\n\nAI is not the business.\n\nAI is the leverage.\n\nIf the offer is unclear, AI gives you more unclear output.\n\nIf the system is clear, one person can move faster than a small team.`,
      ig2: `Most people use AI for random prompts.\n\nOperators use AI for repeatable output.\n\nThat is the whole difference.`,
      ig3: `Stop asking AI for magic.\n\nGive it a job.\nGive it examples.\nGive it rules.\nMake it produce something you can actually publish.`,
      carousel2: "AI is leverage, not the business.",
      carousel3: "Weak input creates weak output faster.",
      carousel4: "One repeatable workflow beats 100 random prompts.",
      carousel5: "Sean = operator. AI = production layer.",
      preview: "AI is not the business.",
      email: `AI is not the business.\n\nAI is the leverage.\n\nThat sounds obvious, but most people miss it.\n\nThey open a tool.\nAsk for ideas.\nGet something generic.\nThen blame the tool.\n\nThe real problem is the input.\n\nNo offer.\nNo angle.\nNo examples.\nNo rules.\n\nAn operator does it differently.\n\nOne clear job.\nOne repeatable output.\nOne system that saves time every week.\n\nThat is where AI gets useful.\n\nReply and tell me:\n\nwhat is the one task you would remove from your week first?`,
      followPreview: "AI needs a job.",
      followLesson: "AI multiplies the operator. It does not replace the operator.",
      followAction: "Pick one repeat task. Give AI examples. Make it produce a usable draft.",
      followQuestion: "what task should AI take off your plate first?",
      vlogProblem: "Most people are using AI randomly. They open a tool, ask for ideas, and wonder why it sounds generic.",
      vlogMechanism: "The mechanism is an operator workflow: clear input, examples, rules, output, revision.",
      vlogProof: "Sean's background is media buying, funnels, offers, direct response, and AI systems. That is why the AI angle has to connect to revenue.",
      vlogAction: "Screen share one AI workflow turning a rough idea into a script, email, and post.",
      vlogClose: "What is one job you want AI to own every week?"
    };
  }

  if (c.laneKey === "oldWealth") {
    return {
      hook: c.hook,
      short1: `Wallace Wattles was not writing about AI.\nBut he was writing about leverage.\nThat is why the idea still matters.\nOld principle.\nNew economy.\nSame human pattern.`,
      short2Title: "Old book, new money",
      short2Hook: "This is not a book summary.",
      short2: `Most people read old wealth books for quotes.\nThat is the wrong move.\nYou want the rule underneath the quote.\nThen you test it in the current economy.`,
      short3Title: "Kitchen table Wattles",
      short3Hook: "Here is the simple Wallace Wattles lesson.",
      short3: `Do not worship the book.\nExtract the rule.\nA thought is not valuable until it changes behavior.\nA wealth idea is not useful until it changes what you build, sell, or repeat.`,
      short4Title: "100-year proof",
      short4Hook: "The principle did not expire.",
      short4: `The tools changed.\nThe market changed.\nThe internet changed.\nBut attention, belief, action, and repetition still matter.\nThat is why old wealth books keep coming back.`,
      short5Title: "Book comment bait",
      short5Hook: "Have you read this book?",
      short5: `Most people say they want wealth.\nBut they never study how wealthy people think, choose, and repeat.\nComment WATTLES if you want the simple breakdown.`,
      short6Title: "Book myth bust",
      short6Hook: "Old does not mean useless.",
      short6: `Old advice can be useless.\nBut old principles can be powerful.\nThe test is simple:\ndoes it still change behavior today?`,
      short7Title: "One wealth action",
      short7Hook: "Pull one rule from the book.",
      short7: `Do not read ten chapters.\nTake one rule.\nApply it to your offer, content, or daily standard.\nThat is how a book becomes leverage.`,
      commentBait: "Comment WATTLES if you want the simple breakdown.",
      firstComment: "Comment WATTLES and I will do the next rule.",
      ig1: `${c.hook}\n\nThis is not about worshipping old books.\n\nIt is about extracting rules that still change behavior today.\n\nOld principle.\nNew tools.\nSame money pattern.`,
      ig2: `Wallace Wattles is useful when you stop treating him like a quote machine.\n\nFind the rule.\nApply it to the current economy.\nThat is the move.`,
      ig3: `The AI age did not kill old wealth principles.\n\nIt made the useful ones louder.\n\nLeverage changed.\nHuman behavior did not.`,
      carousel2: "Do not collect quotes.",
      carousel3: "Extract the rule underneath the quote.",
      carousel4: "Apply it to offers, attention, AI, and repetition.",
      carousel5: "Old principle. New economy.",
      preview: "old book, new money lesson",
      email: `I do not care about old books because they are old.\n\nI care when the rule still works.\n\nWallace Wattles was writing in a different world.\n\nNo AI.\nNo creator economy.\nNo paid ads.\nNo internet leverage.\n\nBut some of the patterns are still alive.\n\nThought changes behavior.\nBehavior changes output.\nRepeated output changes the result.\n\nThat is not mystical.\n\nThat is practical.\n\nReply and tell me:\n\nwhat old wealth book should I break down next?`,
      followPreview: "the rule matters more than the quote",
      followLesson: "The useful part is not the quote. It is the behavior the quote creates.",
      followAction: "Take one rule and apply it to your offer, content, or daily standard.",
      followQuestion: "what book should I break down next?",
      vlogProblem: "Most people treat old wealth books like quote collections, not operating manuals.",
      vlogMechanism: "The mechanism is extraction: old principle, modern application, one behavior change.",
      vlogProof: "Sean's angle is not book summary. It is operator interpretation.",
      vlogAction: "Show the book, pull one rule, apply it to AI/content/offers today.",
      vlogClose: "What old wealth rule are you actually using?"
    };
  }

  const manifestationFrame = c.laneKey === "manifestation";
  return {
    hook: c.hook,
    short1: `🚨 This is going to feel like confirmation for you today.\n\nYour old season could not hold the version you are becoming.\nMore room is opening.\nMore capacity is opening.\nMore money can feel normal now.\n\nType INCREASE if you feel this.`,
    short2Title: manifestationFrame ? "Your reality is expanding" : "Your money season is expanding",
    short2Hook: manifestationFrame ? "Your reality is expanding." : "Your money season is expanding.",
    short2: `Sometimes life cannot bring bigger blessings into smaller versions of us.\nNot because it is not meant for you.\nBecause your capacity had to stretch first.\nThat is the shift.\nThe old identity could not carry the new result.`,
    short3Title: "Kitchen table confirmation",
    short3Hook: "Here is the simple version.",
    short3: `If we were sitting at the table, I would say it plain.\nStop asking if it is coming.\nStart becoming the person who can hold it.\nMore room.\nMore ideas.\nMore receiving.\nMore movement.\nThat is the whole signal.`,
    short4Title: "Sean proof",
    short4Hook: "Before this was content, Sean used it privately.",
    short4: `${proof}\n\nThat matters because this is not random spiritual content.\nIt is a practice for changing the state you keep returning to.`,
    short5Title: "Comment bait",
    short5Hook: "Type INCREASE if this is for you.",
    short5: `If this hit you, do not scroll past it.\nType INCREASE.\nNot for the algorithm.\nFor the decision.\nYou are telling your mind:\nI can hold more now.`,
    short6Title: "Neville myth bust",
    short6Hook: "Neville was not telling you to sit around.",
    short6: `This is not lazy wishing.\nIt is state practice.\nYou feel the end first.\nThen you notice different options.\nThen you move differently.\nThat is the practical part.`,
    short7Title: "One action",
    short7Hook: "Say this before sleep tonight.",
    short7: `My capacity is expanding.\nMy old season is complete.\nI can hold more money, more ideas, and more movement now.\nThen sleep from that version.\nNo checking after.`,
    commentBait: "Type INCREASE if this is for you.",
    firstComment: "Type INCREASE if your reality is expanding.",
    ig1: `🚨 This is your confirmation.\n\nThe old season was not punishment.\nIt was capacity training.\n\nMore room is opening.\nMore receiving is opening.\nMore movement is opening.\n\nType INCREASE if this landed.`,
    ig2: `Sometimes the old identity cannot carry the new reality.\n\nSo life stretches you.\nMoves you.\nRepositions you.\n\nNot to punish you.\nTo prepare you.`,
    ig3: `Before sleep tonight:\n\nSay this once.\n\nMy capacity is expanding.\nMy next season can hold more.\nI am allowed to receive more.\n\nThen stop negotiating with the old version.`,
    carousel2: "Your old season could not hold the new version.",
    carousel3: "Your capacity is expanding.",
    carousel4: "More room. More receiving. More movement.",
    carousel5: "Type INCREASE if this is for you.",
    preview: "this is your confirmation",
    email: `Most people think they have a money problem.\n\nI do not think they do.\n\nI think they have a rehearsal problem.\n\nEvery day they rehearse stress.\nThey rehearse waiting.\nThey rehearse the version of themselves that still does not have it.\n\nThen they wonder why the result feels far away.\n\nNeville talked about this constantly.\n\nLive from the end.\n\nPlain English:\npractice the feeling of the result before the result gets here.\n\nSo let me ask you:\n\nwhat are you rehearsing today?\n\nReply and tell me.`,
    followPreview: "did you catch yourself rehearsing it?",
    followLesson: "If you keep checking for the result, you are practicing the question, not the answer.",
    followAction: `${oneMove} ${secondMove} ${thirdMove}`,
    followQuestion: "what did you catch yourself rehearsing today?",
    vlogProblem: "Most people say they want the result, then spend the day practicing the feeling of not having it.",
    vlogMechanism: "Neville called it living from the end. Sean's plain-English frame is rehearsal: make the result feel normal first.",
    vlogProof: proof,
    vlogAction: `${oneMove} ${secondMove} ${thirdMove}`,
    vlogClose: "What are you rehearsing today?"
  };
}

function setActiveAsset(asset) {
  state.activeAsset = asset;
  renderAssetTabs();
  renderAsset();
  saveState();
}

function renderAssetTabs() {
  document.querySelectorAll(".asset-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.asset === state.activeAsset);
  });
}

function renderAsset() {
  output.value = state.assets[state.activeAsset] || "";
  assetStatus.textContent = state.assets[state.activeAsset] ? `Printed: ${assetName(state.activeAsset)}` : "Content printer idle";
}

function assetName(key) {
  return {
    slideshow: "YouTube Slideshow HTML",
    shorts: "YT Shorts",
    ig: "IG Captions",
    blog: "Vlog Plan",
    broadcast: "Email Broadcast",
    followup: "Email Follow Up"
  }[key] || key;
}

async function copyCurrentAsset() {
  if (!output.value.trim()) return showToast("No asset to copy yet");
  await copyText(output.value);
  showToast("Asset copied");
}

function downloadSlideshow() {
  const html = state.assets.slideshow;
  if (!html) return showToast("Create assets first");
  downloadText("youtube-slideshow.html", html, "text/html");
}

function exportPack() {
  if (!Object.keys(state.assets).length) return showToast("Create assets first");
  const pack = Object.entries(state.assets)
    .map(([key, value]) => `===== ${assetName(key).toUpperCase()} =====\n\n${value}`)
    .join("\n\n");
  downloadText(`sean-content-pack-${new Date().toISOString().slice(0, 10)}.txt`, pack, "text/plain");
}

function downloadText(filename, text, type) {
  const blob = new Blob([text], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    document.body.appendChild(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored) state = { ...state, ...stored };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
  renderConcept();
  renderAssetTabs();
  renderAsset();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1700);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.querySelector("#today-label").textContent = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric"
}).format(new Date());

document.querySelector("#use-pasted-concept").addEventListener("click", usePastedIdea);
document.querySelector("#create-concept").addEventListener("click", createConcept);
document.querySelector("#remix-concept").addEventListener("click", remixConcept);
document.querySelector("#approve-concept").addEventListener("click", approveConcept);
document.querySelector("#create-assets").addEventListener("click", createAssets);
document.querySelector("#copy-asset").addEventListener("click", copyCurrentAsset);
document.querySelector("#download-slideshow").addEventListener("click", downloadSlideshow);
document.querySelector("#export-pack").addEventListener("click", exportPack);

document.querySelectorAll(".asset-tab").forEach((button) => {
  button.addEventListener("click", () => setActiveAsset(button.dataset.asset));
});

document.querySelectorAll(".step-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".step-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

loadState();

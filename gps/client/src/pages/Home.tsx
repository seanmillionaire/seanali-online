/**
 * Wayfinder's Atlas — Dream Life GPS.
 * The page uses ink-blue route rails, parchment map panels, Compass Orange waypoints,
 * and plain language so every interaction creates a decision, answer, or rough plan.
 */
import { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, Compass, DollarSign, Flag, MapPin,
  Sparkles, Target, TrendingUp, Users, Wallet, X,
} from "lucide-react";

type BuildView = "setup" | "questions" | "north";
type Lens = "time" | "wealth" | "freedom" | "impact" | "mastery";
type ImpactId = "family" | "health" | "home" | "time" | "adventure" | "team" | "giving" | "growth";

const lifeLenses: { id: Lens; title: string; line: string; icon: typeof Compass }[] = [
  { id: "time", title: "More time", line: "A life with room to breathe.", icon: Compass },
  { id: "wealth", title: "More wealth", line: "More money and more choices.", icon: DollarSign },
  { id: "freedom", title: "More freedom", line: "More say over your days.", icon: Flag },
  { id: "impact", title: "More impact", line: "Help more people in a real way.", icon: Users },
  { id: "mastery", title: "More mastery", line: "Get great at work that matters.", icon: Sparkles },
];

const impactAreas: { id: ImpactId; emoji: string; title: string; line: string }[] = [
  { id: "family", emoji: "❤️", title: "Family & love", line: "More calm time and stronger memories." },
  { id: "health", emoji: "🌿", title: "Health & energy", line: "More rest, strength, and care." },
  { id: "home", emoji: "🏡", title: "Home & comfort", line: "A home that feels safe and easy." },
  { id: "time", emoji: "⏳", title: "Time & choice", line: "More say over how your days feel." },
  { id: "adventure", emoji: "✈️", title: "New experiences", line: "New places, fun, and room to explore." },
  { id: "team", emoji: "🤝", title: "Your team", line: "More wins and better lives together." },
  { id: "giving", emoji: "🌎", title: "People you help", line: "More good reaching beyond your work." },
  { id: "growth", emoji: "🚀", title: "Who you become", line: "More courage, skill, and belief." },
];

const questionSets: Record<Lens, ((vision: string, people: string) => string)[]> = {
  time: [
    (vision) => `If "${vision}" gave you more time, what would a normal Tuesday look like?`,
    (vision) => `What would you stop doing if "${vision}" was already working?`,
    (_, people) => `How would ${people} feel the change in your day-to-day life?`,
    (vision) => `What bold choice would make "${vision}" happen sooner?`,
  ],
  wealth: [
    (vision) => `If "${vision}" made money feel easy, what would you be able to say yes to?`,
    (vision) => `What would you build bigger if "${vision}" worked ten times better than planned?`,
    (_, people) => `How would ${people} live differently because of that money?`,
    (vision) => `What new level of work would "${vision}" ask from you?`,
  ],
  freedom: [
    (vision) => `If "${vision}" gave you real freedom, what would you no longer accept?`,
    (vision) => `What choice would become possible if "${vision}" was true?`,
    (_, people) => `How would ${people} know you had more freedom?`,
    (vision) => `What brave boundary would protect "${vision}"?`,
  ],
  impact: [
    (vision) => `If "${vision}" worked at its best, whose life would be better?`,
    (vision) => `What bigger problem could "${vision}" help solve?`,
    (_, people) => `What would ${people} say changed because you did this work?`,
    (vision) => `What would you do if you knew "${vision}" could help far more people?`,
  ],
  mastery: [
    (vision) => `If "${vision}" made you great at your craft, what would you be known for?`,
    (vision) => `What hard skill would "${vision}" make worth practicing every week?`,
    (_, people) => `How would ${people} benefit when you did your best work?`,
    (vision) => `What would a world-class version of "${vision}" look like?`,
  ],
};

const moneyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function shortMoney(value: number) {
  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000) return `${sign}$${(absolute / 1_000_000).toFixed(absolute % 1_000_000 ? 1 : 0)}M`;
  if (absolute >= 1_000) return `${sign}$${(absolute / 1_000).toFixed(absolute % 1_000 ? 0 : 0)}K`;
  return `${sign}${moneyFormat.format(absolute)}`;
}

export default function Home() {
  const [phase, setPhase] = useState<"build" | "realize">("build");
  const [buildView, setBuildView] = useState<BuildView>("setup");
  const [vision, setVision] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [lens, setLens] = useState<Lens>("wealth");
  const [impacts, setImpacts] = useState<ImpactId[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [monthlyRevenue, setMonthlyRevenue] = useState(1_000_000);
  const [profitMargin, setProfitMargin] = useState(50);
  const [commissionRate, setCommissionRate] = useState(5);
  const [takeHomeRate, setTakeHomeRate] = useState(30);
  const [guideActive, setGuideActive] = useState(false);

  const personPhrase = beneficiary.trim() || "the people you care about";
  const questionPersonPhrase = beneficiary.trim()
    ? beneficiary.trim().replace(/^./, (character) => character.toLowerCase())
    : "the people you care about";
  const questions = useMemo(
    () => questionSets[lens].map((question) => question(vision.trim(), questionPersonPhrase)),
    [lens, questionPersonPhrase, vision],
  );
  const currentQuestion = questions[questionIndex];
  const currentAnswer = answers[questionIndex] ?? "";
  const selectedLens = lifeLenses.find((item) => item.id === lens) ?? lifeLenses[0];
  const selectedImpactAreas = impactAreas.filter((area) => impacts.includes(area.id));
  const impactTitles = selectedImpactAreas.map((area) => area.title.toLowerCase());
  const impactFuture = impactTitles.length === 0
    ? "Pick every part of life you want success to touch. There is no wrong mix."
    : impactTitles.length === 1
      ? `${selectedImpactAreas[0].title} is part of the future you are building. Add more areas to see how the pieces work together.`
      : impactTitles.length === 2
        ? `Picture it: more room for ${impactTitles[0]} and ${impactTitles[1]}. Your success can support both at the same time.`
        : `Picture it: more room for ${impactTitles.slice(0, -1).join(", ")}, and ${impactTitles.at(-1)}. This win reaches far beyond one number.`;

  const money = useMemo(() => {
    const profit = monthlyRevenue * (profitMargin / 100);
    const commission = monthlyRevenue * (commissionRate / 100);
    const takeHome = profit * (takeHomeRate / 100);
    const retained = profit - commission - takeHome;
    return { profit, commission, takeHome, retained };
  }, [commissionRate, monthlyRevenue, profitMargin, takeHomeRate]);

  const guide = phase === "build"
    ? buildView === "setup"
      ? { title: "Write the dream", message: "Write what you want to make true. Then choose the kind of change you want most.", button: "Ask the questions" }
      : buildView === "questions"
        ? questionIndex === 0
          ? { title: "Map your future", message: "Tap every part of life you want your success to improve. Watch the future picture grow.", button: "See the possibilities" }
          : { title: "Answer the big question", message: "Use your own words. A real answer helps you see a new path.", button: questionIndex === questions.length - 1 ? "See my North Star" : "Next question" }
        : { title: "Read your North Star", message: "This is the bigger picture you just made. Take it with you to the money map.", button: "Plot the numbers" }
    : { title: "Move the numbers", message: "Slide one number at a time. Watch what changes for profit, payouts, and the business.", button: "Keep exploring" };

  const goBuild = (view: BuildView = "setup") => { setPhase("build"); setBuildView(view); };
  const goRealize = () => setPhase("realize");
  const next = () => {
    if (phase === "build" && buildView === "setup") {
      if (vision.trim()) setBuildView("questions");
      return;
    }
    if (phase === "build" && buildView === "questions") {
      if (questionIndex === 0) {
        if (impacts.length) setQuestionIndex(1);
        return;
      }
      if (!currentAnswer.trim()) return;
      if (questionIndex === questions.length - 1) setBuildView("north");
      else setQuestionIndex((current) => current + 1);
      return;
    }
    if (phase === "build" && buildView === "north") {
      goRealize();
    }
  };
  const back = () => {
    if (phase === "realize") return goBuild("north");
    if (buildView === "north") return setBuildView("questions");
    if (buildView === "questions") {
      if (questionIndex === 0) setBuildView("setup");
      else setQuestionIndex((current) => current - 1);
    }
  };
  const setScenario = (revenue: number, margin: number, commission: number, takeHome: number) => {
    setMonthlyRevenue(revenue); setProfitMargin(margin); setCommissionRate(commission); setTakeHomeRate(takeHome);
  };
  const reset = () => {
    setPhase("build"); setBuildView("setup"); setVision(""); setBeneficiary(""); setLens("wealth"); setImpacts([]);
    setQuestionIndex(0); setAnswers({}); setMonthlyRevenue(1_000_000); setProfitMargin(50); setCommissionRate(5); setTakeHomeRate(30); setGuideActive(false);
  };

  const footerAction = phase === "build"
    ? buildView === "setup" ? "Ask the questions" : buildView === "questions" ? questionIndex === 0 ? "See the possibilities" : questionIndex === questions.length - 1 ? "See my North Star" : "Next question" : "Plot the numbers"
    : "Keep exploring";
  const footerDisabled = phase === "build" && (buildView === "setup" ? !vision.trim() : buildView === "questions" ? questionIndex === 0 ? !impacts.length : !currentAnswer.trim() : false);

  return <div className="simple-gps min-h-screen">
    <aside className="simple-rail phase-rail">
      <div className="simple-brand"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="Dream Life GPS" /><div><b>Dream Life</b><span>GPS / YOUR LIFE MAP</span></div></div>
      <div className="rail-copy"><p>YOUR TWO PHASES</p><h2>Gain clarity.<br />See the numbers.</h2></div>
      <nav className="phase-navigation" aria-label="Dream Life GPS phases">
        <button className={`phase-button ${phase === "build" ? "now" : ""}`} onClick={() => goBuild()}><span>01</span><div><b>Dream Building</b><small>Write the dream. Gain clarity.</small></div></button>
        <button className={`phase-button ${phase === "realize" ? "now" : ""}`} onClick={goRealize}><span>02</span><div><b>Dream Realization</b><small>Move numbers. See trade-offs.</small></div></button>
      </nav>
      <div className="rail-footer"><Compass size={18} /><p>{phase === "build" ? "Name the life you want." : "See what the numbers change."}</p></div>
    </aside>

    <main className="simple-main">
      <header className="simple-topbar">
        <div className="mobile-brand"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="" /><b>DREAM LIFE <em>GPS</em></b></div>
        <div className="phase-readout"><span>NOW</span><b>{phase === "build" ? "DREAM BUILDING" : "DREAM REALIZATION"}</b></div>
        <div className="top-message"><span className="tiny-dot" />{phase === "build" ? "Gain clarity" : "See trade-offs"}</div>
        <button className={`guide-launch-button ${guideActive ? "active" : ""}`} onClick={() => setGuideActive((value) => !value)} aria-pressed={guideActive}>{guideActive ? <X size={17} /> : <Compass size={17} />}<span>{guideActive ? "Exit guide" : "Guide me"}</span></button>
      </header>

      <section className="simple-canvas">
        {guideActive && <aside className="guide-panel" aria-label="Guided focus walkthrough"><div className="guide-panel-top"><span><Compass size={16} /> YOUR GUIDE</span><button onClick={() => setGuideActive(false)} aria-label="Exit guided focus"><X size={16} /></button></div><div className="guide-count">{phase === "build" ? "DREAM BUILDING" : "DREAM REALIZATION"}</div><h2>{guide.title}</h2><p>{guide.message}</p><button className="guide-next-button" onClick={next} disabled={footerDisabled}>{guide.button}<ArrowRight size={16} /></button><small>Leave any time.</small></aside>}

        {phase === "build" && buildView === "setup" && <div className="screen inquiry-start simple-enter">
          <div className="intro-hero inquiry-hero" style={{ backgroundImage: "linear-gradient(90deg, rgba(14,40,57,.98), rgba(14,40,57,.77) 52%, rgba(14,40,57,.12)), url('/manus-storage/dream-life-gps-hero_5e4ca605.jpg')" }}><div className="level-stamp">DREAM BUILDING</div><div className="big-compass" aria-hidden="true"><Compass size={39} /><span>N</span><i /><i /></div><p>START WITH A BIGGER QUESTION</p><h1>What do you want<br />to make true?</h1><span>Write it your way. We will help you look at it from a new angle.</span></div>
          <div className={`inquiry-board ${guideActive ? "guide-focus" : ""}`}>
            <div className="board-title"><div><p>YOUR STARTING POINT</p><h2>Give the dream a name.</h2></div><span><MapPin size={14} /> First waypoint</span></div>
            <label className="inquiry-field"><span>WHAT DO YOU WANT TO MAKE TRUE?</span><textarea value={vision} onChange={(event) => setVision(event.target.value)} placeholder="Example: I want to build a business that gives my family more freedom." rows={3} autoFocus /></label>
            <label className="inquiry-field"><span>WHO GETS A BETTER LIFE WHEN THIS WORKS? <em>Optional</em></span><input value={beneficiary} onChange={(event) => setBeneficiary(event.target.value)} placeholder="My family, my team, my customers..." /></label>
            <div className="lens-title"><p>WHAT DO YOU WANT MORE OF?</p><small>Pick the feeling you want the dream to create.</small></div>
            <div className="lens-grid">{lifeLenses.map((item) => { const Icon = item.icon; const picked = lens === item.id; return <button key={item.id} onClick={() => setLens(item.id)} className={`lens-card ${picked ? "picked" : ""}`} aria-pressed={picked}><span><Icon size={20} /></span><div><b>{item.title}</b><small>{item.line}</small></div>{picked && <i><Check size={14} /></i>}</button>; })}</div>
          </div>
        </div>}

        {phase === "build" && buildView === "questions" && (questionIndex === 0 ? <div className="screen impact-screen simple-enter">
          <div className="simple-heading"><span className="level-stamp ink">DREAM BUILDING</span><p>STEP 1 OF 4</p><h1>See the life<br />you are building.</h1><small>Tap every area you want your success to lift. Pick more than one.</small></div>
          <article className={`impact-map-card ${guideActive ? "guide-focus" : ""}`}><div className="impact-map-top"><div><span className="impact-map-stamp">YOUR FUTURE IMPACT</span><h2>Where could this win make life better?</h2></div><span className="impact-count">{impacts.length} picked</span></div><div className="impact-grid">{impactAreas.map((area) => { const picked = impacts.includes(area.id); return <button key={area.id} type="button" className={`impact-card ${picked ? "picked" : ""}`} onClick={() => setImpacts((current) => picked ? current.filter((id) => id !== area.id) : [...current, area.id])} aria-pressed={picked}><span className="impact-emoji" aria-hidden="true">{area.emoji}</span><div><b>{area.title}</b><small>{area.line}</small></div>{picked && <i><Check size={15} /></i>}</button>; })}</div><div className={`future-blend ${impacts.length ? "ready" : ""}`}><div><Sparkles size={19} /><span>FUTURE POSSIBILITY</span></div><p>{impactFuture}</p></div></article>
        </div> : <div className="screen question-screen simple-enter">
          <div className="simple-heading"><span className="level-stamp ink">DREAM BUILDING</span><p>BIG QUESTION {questionIndex + 1} OF {questions.length}</p><h1>Think bigger.</h1><small>There is no perfect answer. Write the one that feels honest.</small></div>
          <article className={`question-card ${guideActive ? "guide-focus" : ""}`}><div className="question-route"><span className="done">01</span><i className="done" /><span className={questionIndex >= 1 ? "done" : ""}>02</span><i className={questionIndex >= 2 ? "done" : ""} /><span className={questionIndex >= 2 ? "done" : ""}>03</span><i className={questionIndex >= 3 ? "done" : ""} /><span className={questionIndex >= 3 ? "done" : ""}>04</span></div><div className="question-stamp"><Sparkles size={17} /> YOUR NEW ANGLE</div><h2>{currentQuestion}</h2><label className="answer-field"><span>YOUR ANSWER</span><textarea value={currentAnswer} onChange={(event) => setAnswers((current) => ({ ...current, [questionIndex]: event.target.value }))} placeholder="Write what comes up for you..." rows={6} autoFocus /></label><div className="question-note"><Compass size={16} /><p>Keep it simple. Your own words are the point.</p></div></article>
        </div>)}

        {phase === "build" && buildView === "north" && <div className="screen north-screen simple-enter">
          <div className="simple-heading"><span className="level-stamp ink">DREAM BUILDING</span><p>YOUR NORTH STAR</p><h1>Here is the bigger picture.</h1><small>Use this to keep the money plan pointed at the life you want.</small></div>
          <article className={`north-card ${guideActive ? "guide-focus" : ""}`}><div className="north-top"><div><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="" /><b>DREAM LIFE GPS</b></div><span>FIELD NOTE</span></div><div className="north-vision"><Flag size={22} /><div><p>WHAT YOU WANT TO MAKE TRUE</p><h2>{vision}</h2><small>{selectedLens.title} for {personPhrase}.</small></div></div><div className="north-impact-summary"><span>THE LIFE THIS WIN COULD TOUCH</span><div>{selectedImpactAreas.map((area) => <b key={area.id}><i>{area.emoji}</i>{area.title}</b>)}</div><p>{impactFuture}</p></div><div className="north-answers">{questions.slice(1).map((question, index) => <div key={question}><span>0{index + 2}</span><p>{question}</p><b>{answers[index + 1]}</b></div>)}</div><div className="north-bottom"><Sparkles size={19} /><p><b>Your direction is clear enough to test with numbers.</b> Now see what the business would need to support it.</p></div></article>
        </div>}

        {phase === "realize" && <div className="screen money-map-screen simple-enter">
          <div className="money-hero money-map-hero"><div><span className="level-stamp">DREAM REALIZATION</span><p>MOVE THE NUMBERS</p><h1>See the trade-offs.</h1><small>{vision.trim() ? `Test what it could take to support: “${vision.trim()}”` : "Move the sliders and see what changes."}</small></div><div className="money-numbers"><div><span><DollarSign size={18} /> REVENUE</span><b>{shortMoney(monthlyRevenue)}</b><small>each month</small></div><div><span><TrendingUp size={18} /> PROFIT</span><b>{shortMoney(money.profit)}</b><small>before payouts</small></div></div></div>
          <div className={`money-map-board ${guideActive ? "guide-focus" : ""}`}>
            <div className="money-board-heading"><div><p>ROUGH MONEY MAP</p><h2>Move a slider. Watch the path change.</h2></div><button onClick={reset}>Start a new map</button></div>
            <div className="scenario-row" aria-label="Planning scenarios"><span>QUICK MAPS</span><button onClick={() => setScenario(500_000, 35, 3, 20)}>Build</button><button className="picked" onClick={() => setScenario(1_000_000, 50, 5, 30)}>Target</button><button onClick={() => setScenario(1_500_000, 55, 7, 35)}>Stretch</button></div>
            <div className="slider-list">
              <label className="money-slider"><div><span>MONTHLY REVENUE</span><b>{shortMoney(monthlyRevenue)}</b></div><input type="range" min="100000" max="2000000" step="25000" value={monthlyRevenue} onChange={(event) => setMonthlyRevenue(Number(event.target.value))} aria-label="Monthly revenue" /><small><span>$100K</span><span>$2M</span></small></label>
              <label className="money-slider"><div><span>PROFIT MARGIN</span><b>{profitMargin}%</b></div><input type="range" min="10" max="70" step="1" value={profitMargin} onChange={(event) => setProfitMargin(Number(event.target.value))} aria-label="Profit margin" /><small><span>10%</span><span>70%</span></small></label>
              <label className="money-slider"><div><span>COMMISSION / BONUS</span><b>{commissionRate}% of revenue</b></div><input type="range" min="0" max="20" step="1" value={commissionRate} onChange={(event) => setCommissionRate(Number(event.target.value))} aria-label="Commission or bonus rate" /><small><span>0%</span><span>20%</span></small></label>
              <label className="money-slider"><div><span>PERSONAL TAKE-HOME</span><b>{takeHomeRate}% of profit</b></div><input type="range" min="5" max="75" step="1" value={takeHomeRate} onChange={(event) => setTakeHomeRate(Number(event.target.value))} aria-label="Personal take-home rate" /><small><span>5%</span><span>75%</span></small></label>
            </div>
            <div className="money-route"><div className="route-node revenue"><span><DollarSign size={17} /></span><p>REVENUE</p><b>{shortMoney(monthlyRevenue)}</b><small>{moneyFormat.format(monthlyRevenue)} / month</small></div><i /><div className="route-node profit"><span><TrendingUp size={17} /></span><p>PROFIT BEFORE PAYOUTS</p><b>{shortMoney(money.profit)}</b><small>{profitMargin}% of revenue</small></div><i /><div className="route-node commission"><span><Users size={17} /></span><p>COMMISSION / BONUS</p><b>{shortMoney(money.commission)}</b><small>{commissionRate}% of revenue</small></div><div className="route-node take-home"><span><Wallet size={17} /></span><p>YOUR TAKE-HOME</p><b>{shortMoney(money.takeHome)}</b><small>{takeHomeRate}% of profit</small></div><div className={`route-node retained ${money.retained < 0 ? "short" : ""}`}><span><Target size={17} /></span><p>{money.retained < 0 ? "SHORT IN BUSINESS" : "LEFT IN BUSINESS"}</p><b>{shortMoney(money.retained)}</b><small>{money.retained < 0 ? "Payouts are above profit." : "After both payouts."}</small></div></div>
            <div className="money-warning"><MapPin size={17} /><p><b>Rough planning only.</b> These are not tax, payroll, or legal numbers. Real payouts can change with taxes, debt, team pay, and other costs.</p></div>
          </div>
        </div>}
      </section>
      <footer className="simple-footer"><button className="soft-button" onClick={back} disabled={phase === "build" && buildView === "setup"}><ArrowLeft size={17} /> Back</button><p><MapPin size={14} /> {phase === "build" ? "Gain clarity" : "Move the money map"}</p>{phase === "realize" ? <button className="go-button" onClick={reset}>Start new map<Compass size={17} /></button> : <button className="go-button" onClick={next} disabled={footerDisabled}>{footerAction}<ArrowRight size={17} /></button>}</footer>
      <span className="sr-only" aria-live="polite">{guideActive ? `${guide.title}. ${guide.message}` : ""}</span>
    </main>
  </div>;
}

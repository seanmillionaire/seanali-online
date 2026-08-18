/**
 * Wayfinder's Atlas — Dream Life GPS.
 * The page uses ink-blue route rails, parchment map panels, Compass Orange waypoints,
 * and plain language so every interaction creates a decision, answer, or rough plan.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, ArrowRight, Check, Compass, DollarSign, Flag, MapPin,
  Mic, MicOff, Sparkles, Target, TrendingUp, Users, Wallet, X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { findStatedMonthlyIncome } from "@/lib/incomePlan";
import "../personalization.css";
import "../income-plan.css";
import "../income-plan-polish.css";

type BuildView = "welcome" | "setup" | "questions" | "north";
type Lens = "time" | "wealth" | "freedom" | "impact" | "mastery";
type ImpactId = "family" | "health" | "home" | "time" | "adventure" | "team" | "giving" | "growth";
type Commitment = "steady" | "serious" | "allIn";
type VoiceFieldId = "name" | "location" | "vision" | "beneficiary" | "answer";

type BrowserSpeechEvent = {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type BrowserSpeechRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: BrowserSpeechEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  }
}

type VoiceInputProps = {
  fieldId: VoiceFieldId;
  label: string;
  optional?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  rows?: number;
  autoFocus?: boolean;
  activeField: VoiceFieldId | null;
  status: { field: VoiceFieldId | null; message: string };
  voiceAvailable: boolean;
  onStart: (field: VoiceFieldId) => void;
  onStop: () => void;
  className: "inquiry-field" | "answer-field";
};

function VoiceInput({ fieldId, label, optional = false, value, onChange, placeholder, multiline = false, rows, autoFocus = false, activeField, status, voiceAvailable, onStart, onStop, className }: VoiceInputProps) {
  const listening = activeField === fieldId;
  const inputId = `dream-life-${fieldId}`;
  const hint = listening
    ? "Listening now. Speak naturally, then pause."
    : status.field === fieldId && status.message
      ? status.message
      : voiceAvailable
        ? "Tap the microphone to speak your answer."
        : "Voice input is not available in this browser. You can type instead.";

  return <div className={`${className} voice-field ${listening ? "is-listening" : ""}`}>
    <label htmlFor={inputId}>{label}{optional && <em> Optional</em>}</label>
    <div className="voice-entry">
      {multiline
        ? <textarea id={inputId} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={rows} autoFocus={autoFocus} />
        : <input id={inputId} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoFocus={autoFocus} />}
      <button type="button" className="voice-button" onClick={() => listening ? onStop() : onStart(fieldId)} aria-pressed={listening} aria-label={listening ? "Stop voice input" : `Speak your answer for ${label}`} title={listening ? "Stop listening" : "Speak your answer"}>
        {listening ? <MicOff size={18} /> : <Mic size={18} />}
      </button>
    </div>
    <p className="voice-hint" aria-live="polite"><Mic size={13} /> {hint}</p>
  </div>;
}

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

const commitmentOptions: { id: Commitment; title: string; hours: string; line: string; blocks: number; days: number; move: string }[] = [
  { id: "steady", title: "I am starting steady", hours: "4 focused hours a week", line: "I want a real plan that fits around my life.", blocks: 4, days: 4, move: "Give one clear money move your full attention each day." },
  { id: "serious", title: "I am serious", hours: "8 focused hours a week", line: "I will make this a strong part of my week.", blocks: 8, days: 5, move: "Protect two clear money moves on most workdays." },
  { id: "allIn", title: "I am all in", hours: "15 focused hours a week", line: "I am ready to make this my main push right now.", blocks: 15, days: 6, move: "Start each day with the highest-value money move first." },
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

export default function Home() {
  const [phase, setPhase] = useState<"build" | "realize">("build");
  const [buildView, setBuildView] = useState<BuildView>("welcome");
  const [userName, setUserName] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [vision, setVision] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [cleanedVision, setCleanedVision] = useState("");
  const [cleanedBeneficiary, setCleanedBeneficiary] = useState("");
  const [lens, setLens] = useState<Lens>("wealth");
  const [impacts, setImpacts] = useState<ImpactId[]>([]);
  const [incomeTarget, setIncomeTarget] = useState(10000);
  const [commitment, setCommitment] = useState<Commitment>("serious");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [rawAnswers, setRawAnswers] = useState<Record<number, string>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [guideActive, setGuideActive] = useState(false);
  const [activeVoiceField, setActiveVoiceField] = useState<VoiceFieldId | null>(null);
  const [voiceStatus, setVoiceStatus] = useState<{ field: VoiceFieldId | null; message: string }>({ field: null, message: "" });
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const voiceAvailable = typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  const cleanAnswer = trpc.cleanAnswer.useMutation();

  const polishedVision = cleanedVision || vision;
  const polishedBeneficiary = cleanedBeneficiary || beneficiary;
  const personPhrase = polishedBeneficiary.trim() || "the people you care about";
  const questionPersonPhrase = polishedBeneficiary.trim()
    ? polishedBeneficiary.trim().replace(/^./, (character) => character.toLowerCase())
    : "the people you care about";
  const questions = useMemo(
    () => questionSets[lens].map((question) => question(polishedVision.trim(), questionPersonPhrase)),
    [lens, polishedVision, questionPersonPhrase],
  );
  const currentQuestion = questions[questionIndex];
  const currentAnswer = rawAnswers[questionIndex] ?? "";
  const selectedLens = lifeLenses.find((item) => item.id === lens) ?? lifeLenses[0];
  const selectedImpactAreas = impactAreas.filter((area) => impacts.includes(area.id));
  const impactTitles = selectedImpactAreas.map((area) => area.title.toLowerCase());
  const selectedCommitment = commitmentOptions.find((option) => option.id === commitment) ?? commitmentOptions[1];
  const weeklyIncomeTarget = Math.round(incomeTarget / 4);
  const dailyIncomeTarget = Math.round(weeklyIncomeTarget / selectedCommitment.days);
  const formatMoney = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
  const northStarText = [polishedVision, ...Object.values(answers)].join(" ");
  const statedMonthlyTarget = findStatedMonthlyIncome(northStarText);
  const focusAnswer = answers[3] || answers[2] || answers[1] || polishedVision;
  const lensMoneyMove: Record<Lens, string> = {
    wealth: "Make one clear offer, sales, client, or campaign move that can bring money in.",
    time: "Protect a money block by removing one low-value task from your day.",
    freedom: "Choose one money move that gives you more control over your work and time.",
    impact: "Show one clear result your work creates for the people you want to help.",
    mastery: "Practice the one skill that makes your work more valuable this week.",
  };
  const impactPlanLine = selectedImpactAreas.length
    ? `This plan is also for ${selectedImpactAreas.map((area) => area.title.toLowerCase()).join(", ")}.`
    : `This plan is for ${personPhrase}.`;
  const impactFuture = impactTitles.length === 0
    ? "Pick every part of life you want success to touch. There is no wrong mix."
    : impactTitles.length === 1
      ? `${selectedImpactAreas[0].title} is part of the future you are building. Add more areas to see how the pieces work together.`
      : impactTitles.length === 2
        ? `Picture it: more room for ${impactTitles[0]} and ${impactTitles[1]}. Your success can support both at the same time.`
        : `Picture it: more room for ${impactTitles.slice(0, -1).join(", ")}, and ${impactTitles.at(-1)}. This win reaches far beyond one number.`;

  const greetingTime = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const headerGreeting = userName.trim() && userLocation.trim()
    ? `${greetingTime}, ${userName.trim()} — building from ${userLocation.trim()}`
    : "Set your compass";

  const updateVoiceField = (field: VoiceFieldId, value: string) => {
    if (field === "name") setUserName(value);
    else if (field === "location") setUserLocation(value);
    else if (field === "vision") { setVision(value); setCleanedVision(""); }
    else if (field === "beneficiary") { setBeneficiary(value); setCleanedBeneficiary(""); }
    else setRawAnswers((current) => ({ ...current, [questionIndex]: value }));
  };

  const stopVoice = () => {
    const stoppedField = activeVoiceField;
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setActiveVoiceField(null);
    if (stoppedField) setVoiceStatus({ field: stoppedField, message: "Voice input stopped. You can keep typing." });
  };

  const startVoice = (field: VoiceFieldId) => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceStatus({ field, message: "Voice input is not available here. You can type instead." });
      return;
    }
    recognitionRef.current?.abort();
    const currentValue = field === "name" ? userName : field === "location" ? userLocation : field === "vision" ? vision : field === "beneficiary" ? beneficiary : currentAnswer;
    const startingText = currentValue.trim() ? `${currentValue.trim()} ` : "";
    const recognition = new Recognition();
    recognition.lang = navigator.language || "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const spoken = Array.from(event.results).slice(event.resultIndex).map((result) => result[0]?.transcript ?? "").join("").trim();
      updateVoiceField(field, spoken ? `${startingText}${spoken}` : startingText.trim());
    };
    recognition.onerror = (event) => {
      if (recognitionRef.current !== recognition) return;
      recognitionRef.current = null;
      setActiveVoiceField(null);
      setVoiceStatus({ field, message: event.error === "not-allowed" ? "Microphone permission is off. Allow it in your browser, then try again." : "I could not hear that. Try again or type your answer." });
    };
    recognition.onend = () => {
      if (recognitionRef.current !== recognition) return;
      recognitionRef.current = null;
      setActiveVoiceField(null);
      setVoiceStatus({ field, message: "Voice input paused. Tap the microphone to keep going." });
    };
    recognitionRef.current = recognition;
    setActiveVoiceField(field);
    setVoiceStatus({ field, message: "Listening now. Speak naturally, then pause." });
    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setActiveVoiceField(null);
      setVoiceStatus({ field, message: "Voice input is busy. Please try again." });
    }
  };

  useEffect(() => () => recognitionRef.current?.abort(), []);

  const guide = phase === "build"
    ? buildView === "welcome"
      ? { title: "Set your compass", message: "Tell me your name and where you are today. Your map will greet you from there.", button: "Begin Dream Building" }
      : buildView === "setup"
      ? { title: "Write the dream", message: "Write what you want to make true. Then choose the kind of change you want most.", button: "Ask the questions" }
      : buildView === "questions"
        ? questionIndex === 0
          ? { title: "Map your future", message: "Tap every part of life you want your success to improve. Watch the future picture grow.", button: "See the possibilities" }
          : { title: "Answer the big question", message: "Use your own words. A real answer helps you see a new path.", button: questionIndex === questions.length - 1 ? "See my North Star" : "Next question" }
        : { title: "Read your North Star", message: "This is the bigger picture you just made. Take it with you to your vision board.", button: "Build the picture" }
    : { title: "Make the money plan", message: "Set the monthly income you want. Then choose how much focused work you are ready to give it.", button: "Start a new plan" };

  const goBuild = (view?: BuildView) => { setPhase("build"); setBuildView(view ?? (userName.trim() && userLocation.trim() ? "setup" : "welcome")); };
  const goRealize = () => setPhase("realize");
  const next = () => {
    stopVoice();
    if (cleanAnswer.isPending) return;
    if (phase === "build" && buildView === "welcome") {
      if (userName.trim() && userLocation.trim()) setBuildView("setup");
      return;
    }
    if (phase === "build" && buildView === "setup") {
      if (!vision.trim()) return;
      const rawVision = vision.trim();
      const rawBeneficiary = beneficiary.trim();
      void (async () => {
        let nextVision = rawVision;
        let nextBeneficiary = rawBeneficiary;
        try {
          nextVision = (await cleanAnswer.mutateAsync({
            rawAnswer: rawVision,
            question: "What do you want to make true?",
          })).cleanedAnswer;
          if (rawBeneficiary) {
            nextBeneficiary = (await cleanAnswer.mutateAsync({
              rawAnswer: rawBeneficiary,
              question: "Who gets a better life when this works?",
            })).cleanedAnswer;
          }
        } catch {
          // The original words remain the source of truth if a cleanup call cannot finish.
        }
        setCleanedVision(nextVision);
        setCleanedBeneficiary(nextBeneficiary);
        setBuildView("questions");
      })();
      return;
    }
    if (phase === "build" && buildView === "questions") {
      if (questionIndex === 0) {
        if (impacts.length) setQuestionIndex(1);
        return;
      }
      if (!currentAnswer.trim()) return;
      const rawAnswer = currentAnswer.trim();
      const question = currentQuestion;
      void (async () => {
        let cleanedAnswer = rawAnswer;
        try {
          cleanedAnswer = (await cleanAnswer.mutateAsync({ rawAnswer, question })).cleanedAnswer;
        } catch {
          // The original answer stays in place if the connection is not available.
        }
        setAnswers((current) => ({ ...current, [questionIndex]: cleanedAnswer }));
        if (questionIndex === questions.length - 1) setBuildView("north");
        else setQuestionIndex((current) => current + 1);
      })();
      return;
    }
    if (phase === "build" && buildView === "north") {
      goRealize();
    }
  };
  const back = () => {
    stopVoice();
    if (phase === "realize") return goBuild("north");
    if (buildView === "north") return setBuildView("questions");
    if (buildView === "questions") {
      if (questionIndex === 0) setBuildView("setup");
      else setQuestionIndex((current) => current - 1);
    }
    if (buildView === "setup") setBuildView("welcome");
  };
  const reset = () => {
    setPhase("build"); setBuildView("setup"); setVision(""); setBeneficiary(""); setLens("wealth"); setImpacts([]);
    setCleanedVision(""); setCleanedBeneficiary(""); setIncomeTarget(10000); setCommitment("serious"); setQuestionIndex(0); setRawAnswers({}); setAnswers({}); setGuideActive(false); stopVoice();
  };

  const footerAction = phase === "build"
    ? buildView === "welcome" ? "Begin Dream Building" : buildView === "setup" ? "Ask the questions" : buildView === "questions" ? questionIndex === 0 ? "See the possibilities" : cleanAnswer.isPending ? "Making it clear" : questionIndex === questions.length - 1 ? "See my North Star" : "Next question" : "Plan my income"
    : "Start a new plan";
  const footerDisabled = cleanAnswer.isPending || (phase === "build" && (buildView === "welcome" ? !userName.trim() || !userLocation.trim() : buildView === "setup" ? !vision.trim() : buildView === "questions" ? questionIndex === 0 ? !impacts.length : !currentAnswer.trim() : false));

  return <div className="simple-gps min-h-screen">
    <aside className="simple-rail phase-rail">
      <div className="simple-brand"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="Dream Life GPS" /><div><b>Dream Life</b><span>GPS / YOUR LIFE MAP</span></div></div>
      <div className="rail-copy"><p>YOUR TWO PHASES</p><h2>Gain clarity.<br />Build the picture.</h2></div>
      <nav className="phase-navigation" aria-label="Dream Life GPS phases">
        <button className={`phase-button ${phase === "build" ? "now" : ""}`} onClick={() => goBuild()}><span>01</span><div><b>Dream Building</b><small>Write the dream. Gain clarity.</small></div></button>
        <button className={`phase-button ${phase === "realize" ? "now" : ""}`} onClick={goRealize}><span>02</span><div><b>Dream Realization</b><small>Plan the income. Make it real.</small></div></button>
      </nav>
      <div className="rail-footer"><Compass size={18} /><p>{phase === "build" ? "Name the life you want." : "Make the income you are building."}</p></div>
      <div className="creator-signature"><span>Created by</span><b>Sean Ali</b></div>
    </aside>

    <main className="simple-main">
      <header className="simple-topbar">
        <div className="mobile-brand"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="" /><b>DREAM LIFE <em>GPS</em></b></div>
        <div className="phase-readout"><span>NOW</span><b>{phase === "build" ? "DREAM BUILDING" : "DREAM REALIZATION"}</b></div>
        <div className="top-message personal-greeting" aria-live="polite"><span className="tiny-dot" />{headerGreeting}</div>
        <button className={`guide-launch-button ${guideActive ? "active" : ""}`} onClick={() => setGuideActive((value) => !value)} aria-pressed={guideActive}>{guideActive ? <X size={17} /> : <Compass size={17} />}<span>{guideActive ? "Exit guide" : "Guide me"}</span></button>
      </header>

      <section className="simple-canvas">
        {guideActive && <aside className="guide-panel" aria-label="Guided focus walkthrough"><div className="guide-panel-top"><span><Compass size={16} /> YOUR GUIDE</span><button onClick={() => setGuideActive(false)} aria-label="Exit guided focus"><X size={16} /></button></div><div className="guide-count">{phase === "build" ? "DREAM BUILDING" : "DREAM REALIZATION"}</div><h2>{guide.title}</h2><p>{guide.message}</p><button className="guide-next-button" onClick={next} disabled={footerDisabled}>{guide.button}<ArrowRight size={16} /></button><small>Leave any time.</small></aside>}

        {phase === "build" && buildView === "welcome" && <div className="screen inquiry-start simple-enter">
          <div className="intro-hero inquiry-hero" style={{ backgroundImage: "linear-gradient(90deg, rgba(14,40,57,.98), rgba(14,40,57,.77) 52%, rgba(14,40,57,.12)), url('/manus-storage/dream-life-gps-hero_5e4ca605.jpg')" }}><div className="level-stamp">WELCOME TO DREAM LIFE GPS</div><div className="big-compass" aria-hidden="true"><Compass size={39} /><span>N</span><i /><i /></div><p>START WHERE YOU ARE</p><h1>Set your<br />starting point.</h1><span>I will use this to make your map feel like it is yours.</span></div>
          <div className={`inquiry-board ${guideActive ? "guide-focus" : ""}`}>
            <div className="board-title"><div><p>YOUR STARTING POINT</p><h2>Tell me where you are today.</h2></div><span><MapPin size={14} /> First waypoint</span></div>
            <VoiceInput fieldId="name" label="WHAT SHOULD I CALL YOU?" value={userName} onChange={setUserName} placeholder="Your first name" autoFocus activeField={activeVoiceField} status={voiceStatus} voiceAvailable={voiceAvailable} onStart={startVoice} onStop={stopVoice} className="inquiry-field" />
            <VoiceInput fieldId="location" label="WHERE ARE YOU BUILDING FROM TODAY?" value={userLocation} onChange={setUserLocation} placeholder="Example: Austin, Texas" activeField={activeVoiceField} status={voiceStatus} voiceAvailable={voiceAvailable} onStart={startVoice} onStop={stopVoice} className="inquiry-field" />
            <div className="welcome-note"><MapPin size={17} /><p>Your location is only used to greet you here. It is not a GPS check.</p></div>
          </div>
        </div>}

        {phase === "build" && buildView === "setup" && <div className="screen inquiry-start simple-enter">
          <div className="intro-hero inquiry-hero" style={{ backgroundImage: "linear-gradient(90deg, rgba(14,40,57,.98), rgba(14,40,57,.77) 52%, rgba(14,40,57,.12)), url('/manus-storage/dream-life-gps-hero_5e4ca605.jpg')" }}><div className="level-stamp">DREAM BUILDING</div><div className="big-compass" aria-hidden="true"><Compass size={39} /><span>N</span><i /><i /></div><p>START WITH A BIGGER QUESTION</p><h1>What do you want<br />to make true?</h1><span>Write it your way. I will help you look at it from a new angle.</span></div>
          <div className={`inquiry-board ${guideActive ? "guide-focus" : ""}`}>
            <div className="board-title"><div><p>YOUR STARTING POINT</p><h2>Give the dream a name.</h2></div><span><MapPin size={14} /> First waypoint</span></div>
            <VoiceInput fieldId="vision" label="WHAT DO YOU WANT TO MAKE TRUE?" value={vision} onChange={(value) => { setVision(value); setCleanedVision(""); }} placeholder="Example: I want to build a business that gives my family more freedom." multiline rows={3} autoFocus activeField={activeVoiceField} status={voiceStatus} voiceAvailable={voiceAvailable} onStart={startVoice} onStop={stopVoice} className="inquiry-field" />
            <VoiceInput fieldId="beneficiary" label="WHO GETS A BETTER LIFE WHEN THIS WORKS?" optional value={beneficiary} onChange={(value) => { setBeneficiary(value); setCleanedBeneficiary(""); }} placeholder="My family, my team, my customers..." activeField={activeVoiceField} status={voiceStatus} voiceAvailable={voiceAvailable} onStart={startVoice} onStop={stopVoice} className="inquiry-field" />
            <div className="lens-title"><p>WHAT DO YOU WANT MORE OF?</p><small>Pick the feeling you want the dream to create.</small></div>
            <div className="lens-grid">{lifeLenses.map((item) => { const Icon = item.icon; const picked = lens === item.id; return <button key={item.id} onClick={() => setLens(item.id)} className={`lens-card ${picked ? "picked" : ""}`} aria-pressed={picked}><span><Icon size={20} /></span><div><b>{item.title}</b><small>{item.line}</small></div>{picked && <i><Check size={14} /></i>}</button>; })}</div>
          </div>
        </div>}

        {phase === "build" && buildView === "questions" && (questionIndex === 0 ? <div className="screen impact-screen simple-enter">
          <div className="simple-heading"><span className="level-stamp ink">DREAM BUILDING</span><p>STEP 1 OF 4</p><h1>See the life<br />you are building.</h1><small>Tap every area you want your success to lift. Pick more than one.</small></div>
          <article className={`impact-map-card ${guideActive ? "guide-focus" : ""}`}><div className="impact-map-top"><div><span className="impact-map-stamp">YOUR FUTURE IMPACT</span><h2>Where could this win make life better?</h2></div><span className="impact-count">{impacts.length} picked</span></div><div className="impact-grid">{impactAreas.map((area) => { const picked = impacts.includes(area.id); return <button key={area.id} type="button" className={`impact-card ${picked ? "picked" : ""}`} onClick={() => setImpacts((current) => picked ? current.filter((id) => id !== area.id) : [...current, area.id])} aria-pressed={picked}><span className="impact-emoji" aria-hidden="true">{area.emoji}</span><div><b>{area.title}</b><small>{area.line}</small></div>{picked && <i><Check size={15} /></i>}</button>; })}</div><div className={`future-blend ${impacts.length ? "ready" : ""}`}><div><Sparkles size={19} /><span>FUTURE POSSIBILITY</span></div><p>{impactFuture}</p></div></article>
        </div> : <div className="screen question-screen simple-enter">
          <div className="simple-heading"><span className="level-stamp ink">DREAM BUILDING</span><p>BIG QUESTION {questionIndex + 1} OF {questions.length}</p><h1>Think bigger.</h1><small>There is no perfect answer. Write the one that feels honest.</small></div>
          <article className={`question-card ${guideActive ? "guide-focus" : ""}`}><div className="question-route"><span className="done">01</span><i className="done" /><span className={questionIndex >= 1 ? "done" : ""}>02</span><i className={questionIndex >= 2 ? "done" : ""} /><span className={questionIndex >= 2 ? "done" : ""}>03</span><i className={questionIndex >= 3 ? "done" : ""} /><span className={questionIndex >= 3 ? "done" : ""}>04</span></div><div className="question-stamp"><Sparkles size={17} /> YOUR NEW ANGLE</div><h2>{currentQuestion}</h2><VoiceInput fieldId="answer" label="YOUR ANSWER" value={currentAnswer} onChange={(value) => setRawAnswers((current) => ({ ...current, [questionIndex]: value }))} placeholder="Write what comes up for you..." multiline rows={6} autoFocus activeField={activeVoiceField} status={voiceStatus} voiceAvailable={voiceAvailable} onStart={startVoice} onStop={stopVoice} className="answer-field" /><div className="question-note">{cleanAnswer.isPending ? <><Sparkles size={16} /><p>Making your answer clear while keeping it yours...</p></> : <><Compass size={16} /><p>Keep it simple. Your own words are the point.</p></>}</div></article>
        </div>)}

        {phase === "build" && buildView === "north" && <div className="screen north-screen simple-enter">
          <div className="simple-heading"><span className="level-stamp ink">DREAM BUILDING</span><p>YOUR NORTH STAR</p><h1>Here is the bigger picture.</h1><small>Use this to keep the money plan pointed at the life you want.</small></div>
          <article className={`north-card ${guideActive ? "guide-focus" : ""}`}><div className="north-top"><div><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="" /><b>DREAM LIFE GPS</b></div><span>FIELD NOTE</span></div><div className="north-vision"><Flag size={22} /><div><p>WHAT YOU WANT TO MAKE TRUE</p><h2>{polishedVision}</h2>{polishedVision !== vision && <small className="answer-source">Your words: “{vision}”</small>}<small>{selectedLens.title} for {personPhrase}.</small></div></div><div className="north-impact-summary"><span>THE LIFE THIS WIN COULD TOUCH</span><div>{selectedImpactAreas.map((area) => <b key={area.id}><i>{area.emoji}</i>{area.title}</b>)}</div><p>{impactFuture}</p></div><div className="north-answers">{questions.slice(1).map((question, index) => { const answerIndex = index + 1; const rawAnswer = rawAnswers[answerIndex] ?? ""; const cleanedAnswer = answers[answerIndex] ?? rawAnswer; return <div key={question}><span>0{answerIndex + 1}</span><p>{question}</p><b>{cleanedAnswer}</b>{cleanedAnswer !== rawAnswer && <small className="answer-source">Your words: “{rawAnswer}”</small>}</div>; })}</div><div className="north-bottom"><Sparkles size={19} /><p><b>Your direction is clear enough to picture.</b> Now turn it into a money target and a clear work plan.</p></div></article>
        </div>}

        {phase === "realize" && <div className="screen income-plan-screen simple-enter">
          <div className="income-plan-hero" style={{ backgroundImage: "linear-gradient(90deg, rgba(14,40,57,.97), rgba(14,40,57,.72) 53%, rgba(14,40,57,.12)), url('/manus-storage/dream-life-gps-hero_5e4ca605.jpg')" }}><div><span className="level-stamp">DREAM REALIZATION</span><p>TURN THE DREAM INTO A MONEY PLAN</p><h1>Make the money<br />you want.</h1><small>{polishedVision.trim() ? `Now give “${polishedVision.trim()}” a clear income target and a work plan that fits your commitment.` : "Set an income target, then choose the work level you are ready to give it."}</small></div><div className="income-target-mark" aria-hidden="true"><DollarSign size={36} /><span>GO</span></div></div>
          <div className={`income-plan ${guideActive ? "guide-focus" : ""}`}>
            <div className="income-plan-heading"><div><p>YOUR INCOME ROUTE</p><h2>What do you want to make each month?</h2></div><button onClick={reset}>Start a new plan</button></div>
            <section className="income-target-panel"><div className="income-target-copy"><span><Target size={16} /> MONTHLY INCOME TARGET</span><p>This is a planning number, not a promise. Pick the amount you want your work to create.</p>{statedMonthlyTarget !== null && <button type="button" className="north-star-recommendation" onClick={() => setIncomeTarget(statedMonthlyTarget)}><Sparkles size={14} /> I found {formatMoney(statedMonthlyTarget)} in your Dream Building words. Use this starting point.</button>}</div><label className="target-number" htmlFor="income-target"><span>$</span><input id="income-target" type="number" min="0" step="500" value={incomeTarget || ""} onChange={(event) => setIncomeTarget(Math.max(0, Number(event.target.value) || 0))} aria-label="Monthly income target" /><small>/ month</small></label><div className="income-presets" aria-label="Quick income target choices">{[5000, 10000, 25000, 50000].map((amount) => <button key={amount} type="button" className={incomeTarget === amount ? "picked" : ""} onClick={() => setIncomeTarget(amount)}>{formatMoney(amount)}</button>)}</div><input className="income-range" type="range" min="1000" max="100000" step="1000" value={Math.min(Math.max(incomeTarget || 1000, 1000), 100000)} onChange={(event) => setIncomeTarget(Number(event.target.value))} aria-label="Adjust monthly income target" /><div className="income-breakdown"><div><span>MONTHLY</span><b>{formatMoney(incomeTarget)}</b></div><div><span>WEEKLY</span><b>{formatMoney(weeklyIncomeTarget)}</b></div><div><span>FOCUS DAY</span><b>{formatMoney(dailyIncomeTarget)}</b><small>{selectedCommitment.days} days a week</small></div></div></section>
            <section className="commitment-panel"><div className="income-section-title"><div><p>YOUR COMMITMENT LEVEL</p><h3>How much focused work are you ready to give this?</h3></div><span>{selectedCommitment.hours}</span></div><div className="commitment-grid">{commitmentOptions.map((option) => { const picked = commitment === option.id; return <button key={option.id} type="button" className={`commitment-card ${picked ? "picked" : ""}`} onClick={() => setCommitment(option.id)} aria-pressed={picked}><span>{option.id === "steady" ? "01" : option.id === "serious" ? "02" : "03"}</span><div><b>{option.title}</b><small>{option.line}</small><em>{option.hours}</em></div>{picked && <i><Check size={15} /></i>}</button>; })}</div></section>
            <section className="action-route"><div className="income-section-title"><div><p><TrendingUp size={15} /> YOUR NEXT MONEY MOVES</p><h3>A route that matches your commitment.</h3></div><span>{selectedCommitment.blocks} focus blocks</span></div><p className="route-note">This route supports <b>“{polishedVision || "the life you named"}.”</b> {impactPlanLine} Keep it simple: do the work, track what happens, and adjust.</p><div className="route-steps"><article><span>01</span><div><b>Choose one money move</b><p>{lensMoneyMove[lens]}</p></div></article><article><span>02</span><div><b>Hit the weekly target</b><p>Work toward {formatMoney(weeklyIncomeTarget)} this week. Break it into offers, sales, clients, campaigns, or work that fits your role.</p></div></article><article><span>03</span><div><b>Use the focus you named</b><p>{focusAnswer ? `You said: “${focusAnswer}”` : "Review what brought money in, keep what worked, and choose the next move before the week ends."}</p></div></article></div></section>
            <aside className="income-commitment-note"><Wallet size={20} /><p><b>{selectedCommitment.title} means this:</b> {selectedCommitment.hours}, {selectedCommitment.blocks} protected focus blocks, and one simple weekly review. {impactPlanLine} That is the commitment you chose.</p></aside>
          </div>
        </div>}
      </section>
      <footer className="simple-footer"><button className="soft-button" onClick={back} disabled={phase === "build" && buildView === "setup"}><ArrowLeft size={17} /> Back</button><p><MapPin size={14} /> {phase === "build" ? "Gain clarity" : "Hit your income target"}</p>{phase === "realize" ? <button className="go-button" onClick={reset}>Start new plan<Compass size={17} /></button> : <button className="go-button" onClick={next} disabled={footerDisabled}>{footerAction}<ArrowRight size={17} /></button>}</footer>
      <span className="sr-only" aria-live="polite">{guideActive ? `${guide.title}. ${guide.message}` : ""}</span>
    </main>
  </div>;
}

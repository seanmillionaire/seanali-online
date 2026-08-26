/** A simple, locked path: get clear on the life you want, then take one useful step. */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, Compass, MapPin, Mic, MicOff, Printer, Sparkles, Target, Volume2, VolumeX, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { findStatedMonthlyIncome } from "@/lib/incomePlan";
import { canAdvanceStep, commitments, createFinalChecklist, createNextAction, getRoleName, getWeeklyNumbers, roles, type CommitmentId, type RoleId } from "@/lib/guidedJourney";
import { mergeVoiceTranscript } from "@/lib/voiceTranscript";
import { canPlayProgressiveSound, cueForAdvance, soundCues, type SoundCue } from "@/lib/progressiveSound";
import { buildClarityPrintoutFallback, dreamDayScenes, type ClarityPrintout, type DreamDaySceneId } from "@shared/clarityPrintout";
import "../personalization.css";
import "../guided-flow.css";
import "../guided-flow-fix.css";
import "../guided-flow-panel.css";
import "../guided-sound.css";

type Step = "name" | "location" | "success" | "benefits" | "future" | "whyNow" | "summary" | "role" | "responsibility" | "commitment" | "action";
type BenefitId = "family" | "health" | "calm" | "time" | "freedom" | "work" | "giving" | "growth";
type VoiceField = "name" | "location" | "otherRole" | "success" | "future" | "whyNow" | "responsibility" | "weeklyResult" | "dreamDetail";
type FinalSectionId = "vision" | "dream" | "plan";

type SpeechResultEvent = { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognitionLike = { lang: string; continuous: boolean; interimResults: boolean; onresult: ((event: SpeechResultEvent) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null; start: () => void; abort: () => void };
type SpeechConstructor = new () => SpeechRecognitionLike;

declare global { interface Window { SpeechRecognition?: SpeechConstructor; webkitSpeechRecognition?: SpeechConstructor } }

const steps: Step[] = ["name", "location", "success", "benefits", "future", "whyNow", "summary", "role", "responsibility", "commitment", "action"];
const benefits: { id: BenefitId; emoji: string; title: string; impact: string }[] = [
  { id: "family", emoji: "❤️", title: "Give my family more", impact: "giving my family more" }, { id: "health", emoji: "💪", title: "A stronger body", impact: "a stronger body and more energy" },
  { id: "calm", emoji: "🏆", title: "More respect", impact: "more respect" }, { id: "time", emoji: "✈️", title: "See more of the world", impact: "seeing more of the world" },
  { id: "freedom", emoji: "🕊️", title: "Real freedom", impact: "real freedom with my time" }, { id: "work", emoji: "📈", title: "Bigger wins at work", impact: "bigger wins at work" },
  { id: "giving", emoji: "💸", title: "More money", impact: "more money in my pocket" }, { id: "growth", emoji: "🚀", title: "Build something big", impact: "building something I am proud of" },
];

const stepHelp: Record<Step, { title: string; message: string; next: string }> = {
  name: { title: "Start here", message: "Your first name lets me make this feel personal.", next: "Next" },
  location: { title: "One small detail", message: "A city or place is enough. It only changes your greeting.", next: "Next" },
  success: { title: "Name the picture", message: "Success can mean money, work, family, freedom, health, or all of it together.", next: "Next" },
  benefits: { title: "Make it personal", message: "Pick the parts of life you want your success to improve.", next: "Next" },
  future: { title: "Picture it", message: "One honest answer is enough. Think about what a better day could feel like.", next: "Next" },
  whyNow: { title: "Find your reason", message: "This will help you remember why the work matters when a day feels hard.", next: "Build my clear picture" },
  summary: { title: "Check your clear picture", message: "Read this. Go back if any part does not feel right yet.", next: "Take action" },
  role: { title: "Your work matters", message: "Your role helps me give you a next action that fits real work.", next: "Next" },
  responsibility: { title: "Name your work focus", message: "Pick the result you can help move right now.", next: "Next" },
  commitment: { title: "Commit to one result", message: "Choose one visible result for the next seven days, then make room to create it.", next: "Build my clarity printout" },
  action: { title: "See what you are building", message: "Read your near-future picture. Then keep the next useful move close.", next: "Start over" },
};

function formatMoney(amount: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount); }

function VoiceField({ id, label, value, setValue, multiline = false, autoFocus, active, note, start, stop }: { id: VoiceField; label: string; value: string; setValue: (value: string) => void; multiline?: boolean; autoFocus?: boolean; active: VoiceField | null; note: string; start: (field: VoiceField) => void; stop: () => void }) {
  const listening = active === id;
  const inputId = `guided-${id}`;
  return <div className="guided-field"><label htmlFor={inputId}>{label}</label><div className="guided-input-wrap">{multiline ? <textarea id={inputId} value={value} onChange={(event) => setValue(event.target.value)} autoFocus={autoFocus} placeholder="Type it or use the microphone..." /> : <input id={inputId} value={value} onChange={(event) => setValue(event.target.value)} autoFocus={autoFocus} placeholder="Type it or use the microphone..." />}<button type="button" className={`guided-mic ${listening ? "listening" : ""}`} onClick={() => listening ? stop() : start(id)} aria-label={listening ? "Stop voice input" : "Speak your answer"}>{listening ? <MicOff size={20} /> : <Mic size={20} />}</button></div><p className="guided-voice-note"><Mic size={16} /> {note}</p></div>;
}

function ClarityChecklist({ title = "WHAT YOU ARE BUILDING", items }: { title?: string; items: string[] }) {
  return <aside className="guided-checklist"><span>{title}</span><div>{items.map((item) => <p key={item}><Check size={18} />{item}</p>)}</div></aside>;
}

function PersonalizingIndicator() {
  return <div className="guided-personalizing" role="status" aria-live="polite" aria-label="Making your answer clear and personal">
    <div className="guided-personalizing-orbit" aria-hidden="true"><span /><span /><span /><Compass size={34} /></div>
    <p>MAKING THIS CLEAR FOR YOU</p>
    <b>I am turning your words into a clear picture.</b>
    <small>This takes a moment. I am keeping what you meant and making the next step feel personal.</small>
  </div>;
}

function DreamDaySceneSelector({ value, onChange }: { value: DreamDaySceneId; onChange: (scene: DreamDaySceneId) => void }) {
  return <fieldset className="guided-dream-scene-selector">
    <legend>CHOOSE THE KIND OF DAY YOU WANT TO STEP INTO</legend>
    <p>This is not a picture maker. It helps your words feel more like your real life.</p>
    <div className="guided-dream-scene-grid">
      {dreamDayScenes.map((scene) => <button type="button" key={scene.id} data-dream-scene={scene.id} className={value === scene.id ? "picked" : ""} onClick={() => onChange(scene.id)} aria-pressed={value === scene.id}>
        <span aria-hidden="true">{scene.emoji}</span><div><b>{scene.title}</b><small>{scene.line}</small></div>{value === scene.id && <i><Check size={18} /></i>}
      </button>)}
    </div>
  </fieldset>;
}

function FinalScreenSection({ sectionId, eyebrow, title, summary, open, onToggle, children }: { sectionId: FinalSectionId; eyebrow: string; title: string; summary: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  const contentId = `final-section-${sectionId}`;
  return <section className={`guided-final-section ${open ? "open" : ""}`} data-final-section={sectionId}>
    <button type="button" className="guided-final-section-toggle" onClick={onToggle} aria-expanded={open} aria-controls={contentId}>
      <span>{eyebrow}</span><h2>{title}</h2><p>{summary}</p><ChevronDown size={23} aria-hidden="true" />
    </button>
    <div id={contentId} className="guided-final-section-body" aria-hidden={!open}>{children}</div>
  </section>;
}

export default function Home() {
  const [step, setStep] = useState<Step>("name");
  const [userName, setUserName] = useState(() => window.localStorage.getItem("dream-life-gps-name") || "");
  const [location, setLocation] = useState("");
  const [success, setSuccess] = useState("");
  const [cleanSuccess, setCleanSuccess] = useState("");
  const [selectedBenefits, setSelectedBenefits] = useState<BenefitId[]>([]);
  const [future, setFuture] = useState("");
  const [cleanFuture, setCleanFuture] = useState("");
  const [whyNow, setWhyNow] = useState("");
  const [cleanWhyNow, setCleanWhyNow] = useState("");
  const [role, setRole] = useState<RoleId | null>(null);
  const [otherRole, setOtherRole] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [cleanResponsibility, setCleanResponsibility] = useState("");
  const [weeklyResult, setWeeklyResult] = useState("");
  const [cleanWeeklyResult, setCleanWeeklyResult] = useState("");
  const [commitment, setCommitment] = useState<CommitmentId>("solid");
  const [helpOpen, setHelpOpen] = useState(false);
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [dreamScene, setDreamScene] = useState<DreamDaySceneId>("celebration");
  const [dreamDetail, setDreamDetail] = useState("");
  const [clarityPrintout, setClarityPrintout] = useState<ClarityPrintout | null>(null);
  const [clarityError, setClarityError] = useState("");
  const [openFinalSections, setOpenFinalSections] = useState<Record<FinalSectionId, boolean>>({ vision: true, dream: false, plan: false });
  const [soundEnabled, setSoundEnabled] = useState(() => window.localStorage.getItem("dream-life-gps-sound") !== "off");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [activeVoice, setActiveVoice] = useState<VoiceField | null>(null);
  const [voiceNote, setVoiceNote] = useState("Tap the microphone to speak your answer.");
  const recognition = useRef<SpeechRecognitionLike | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const keepListening = useRef(false);
  const capturedVoice = useRef<{ field: VoiceField; value: string } | null>(null);
  const cleanAnswer = trpc.cleanAnswer.useMutation();
  const createClarityPrintout = trpc.createClarityPrintout.useMutation();

  const stepIndex = steps.indexOf(step);
  const isClearPhase = stepIndex <= steps.indexOf("summary");
  const pickedBenefits = benefits.filter((item) => selectedBenefits.includes(item.id));
  const benefitNames = pickedBenefits.map((item) => item.impact);
  const successText = cleanSuccess || success;
  const futureText = cleanFuture || future;
  const whyNowText = cleanWhyNow || whyNow;
  const responsibilityText = cleanResponsibility || responsibility;
  const weeklyResultText = cleanWeeklyResult || weeklyResult;
  const suggestedTarget = findStatedMonthlyIncome([successText, futureText].join(" "));
  const weekly = suggestedTarget !== null ? getWeeklyNumbers(suggestedTarget, commitment) : null;
  const actionPlan = useMemo(() => role ? createNextAction({ role, otherRole, commitment, success: successText, responsibility: responsibilityText, weeklyResult: weeklyResultText, impactNames: benefitNames, whyNow: whyNowText }) : null, [role, otherRole, commitment, successText, responsibilityText, weeklyResultText, benefitNames.join("|"), whyNowText]);
  const finalChecklist = actionPlan ? createFinalChecklist(actionPlan) : [];
  const clarityInput = useMemo(() => ({ success: successText, benefits: pickedBenefits.map((benefit) => benefit.title), future: futureText, whyNow: whyNowText, responsibility: responsibilityText, nearTermResult: weeklyResultText, dreamScene, dreamDetail }), [successText, pickedBenefits.map((benefit) => benefit.title).join("|"), futureText, whyNowText, responsibilityText, weeklyResultText, dreamScene, dreamDetail]);
  const clarityFallback = useMemo(() => buildClarityPrintoutFallback(clarityInput), [clarityInput]);
  const currentClarityPrintout = clarityPrintout ?? clarityFallback;
  const greetingTime = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const greeting = userName.trim() && location.trim() ? `${greetingTime}, ${userName.trim()} — building from ${location.trim()}` : "One step at a time";
  const currentHelp = stepHelp[step];
  const soundIsActive = canPlayProgressiveSound(soundEnabled, prefersReducedMotion);

  const valueForVoice = (field: VoiceField) => ({ name: userName, location, otherRole, success, future, whyNow, responsibility, weeklyResult, dreamDetail }[field]);
  const setVoiceValue = (field: VoiceField, value: string) => {
    if (field === "name") setUserName(value);
    if (field === "location") setLocation(value);
    if (field === "otherRole") setOtherRole(value);
    if (field === "success") { setSuccess(value); setCleanSuccess(""); }
    if (field === "future") { setFuture(value); setCleanFuture(""); }
    if (field === "whyNow") { setWhyNow(value); setCleanWhyNow(""); }
    if (field === "responsibility") { setResponsibility(value); setCleanResponsibility(""); }
    if (field === "weeklyResult") { setWeeklyResult(value); setCleanWeeklyResult(""); }
    if (field === "dreamDetail") { setDreamDetail(value); setClarityPrintout(null); }
  };
  const stopVoice = () => { keepListening.current = false; recognition.current?.abort(); recognition.current = null; capturedVoice.current = null; setActiveVoice(null); };
  const beginVoiceSegment = (field: VoiceField, base: string) => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    const instance = new Recognition(); instance.lang = navigator.language || "en-US"; instance.continuous = true; instance.interimResults = true;
    const continueAfterPause = () => {
      const held = capturedVoice.current?.field === field ? capturedVoice.current.value : base;
      window.setTimeout(() => { if (!keepListening.current || recognition.current) return; beginVoiceSegment(field, held); }, 250);
    };
    instance.onresult = (event) => { const combined = mergeVoiceTranscript(base, event.results); capturedVoice.current = { field, value: combined }; setVoiceValue(field, combined); };
    instance.onerror = (event) => {
      if (recognition.current !== instance) return;
      recognition.current = null;
      if (event.error === "no-speech" && keepListening.current) { setVoiceNote("Still listening. Keep going when you are ready."); continueAfterPause(); return; }
      keepListening.current = false; setActiveVoice(null);
      setVoiceNote(event.error === "not-allowed" ? "Please allow microphone access, then try again." : "I could not hear that. Try again or type your answer.");
    };
    instance.onend = () => { if (recognition.current !== instance) return; recognition.current = null; if (!keepListening.current) { setActiveVoice(null); return; } setVoiceNote("Still listening. Keep going when you are ready."); continueAfterPause(); };
    recognition.current = instance; setActiveVoice(field); setVoiceNote("Listening now. Speak naturally. I will keep your words when you pause.");
    try { instance.start(); } catch { recognition.current = null; keepListening.current = false; setActiveVoice(null); setVoiceNote("Voice input is busy. Please try again."); }
  };
  const startVoice = (field: VoiceField) => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setVoiceNote("Voice input is not available here. You can type instead."); return; }
    recognition.current?.abort(); keepListening.current = true;
    const base = valueForVoice(field).trim(); capturedVoice.current = { field, value: base }; beginVoiceSegment(field, base);
  };
  useEffect(() => () => recognition.current?.abort(), []);
  useEffect(() => () => { void audioContext.current?.close(); }, []);
  useEffect(() => { window.localStorage.setItem("dream-life-gps-sound", soundEnabled ? "on" : "off"); }, [soundEnabled]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(media.matches);
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);
  const playSound = (cue: SoundCue) => {
    if (!soundIsActive) return;
    const AudioContextConstructor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextConstructor) return;
    const context = audioContext.current ?? new AudioContextConstructor();
    audioContext.current = context;
    if (context.state === "suspended") void context.resume();
    soundCues[cue].forEach((tone) => {
      const startsAt = context.currentTime + tone.delay;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(tone.frequency, startsAt);
      gain.gain.setValueAtTime(0.0001, startsAt);
      gain.gain.exponentialRampToValueAtTime(tone.volume, startsAt + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + tone.duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(startsAt);
      oscillator.stop(startsAt + tone.duration + 0.02);
    });
  };

  const canContinue = canAdvanceStep({ step, userName, location, role, otherRole, success, benefitCount: selectedBenefits.length, future, whyNow, responsibility, weeklyResult, isCleaning: isPersonalizing });
  const cleanupDetails: Partial<Record<Step, { raw: string; question: string; apply: (value: string) => void }>> = {
    success: { raw: success, question: "What does success look like for you?", apply: setCleanSuccess },
    future: { raw: future, question: "If this worked, what would be better in your life?", apply: setCleanFuture },
    whyNow: { raw: whyNow, question: "Why is this worth doing now?", apply: setCleanWhyNow },
    responsibility: { raw: responsibility, question: "What result are you responsible for right now?", apply: setCleanResponsibility },
    commitment: { raw: weeklyResult, question: "What result can you commit to in the next 7 days?", apply: setCleanWeeklyResult },
  };
  const move = (direction: "next" | "back") => {
    const position = steps.indexOf(step); setHelpOpen(false); stopVoice();
    if (direction === "back") { if (position > 0) { setStep(steps[position - 1]); playSound("back"); } return; }
    if (!canContinue) return;
    const cleanup = cleanupDetails[step];
    const alreadyCleaned = (step === "success" && Boolean(cleanSuccess)) || (step === "future" && Boolean(cleanFuture)) || (step === "whyNow" && Boolean(cleanWhyNow)) || (step === "responsibility" && Boolean(cleanResponsibility)) || (step === "commitment" && Boolean(cleanWeeklyResult));
    if (cleanup && alreadyCleaned) { setStep(steps[position + 1]); playSound(cueForAdvance(position, position + 1)); return; }
    if (cleanup) {
      setIsPersonalizing(true);
      void (async () => {
        let cleaned = cleanup.raw.trim();
        try {
          const response = await Promise.race([
            cleanAnswer.mutateAsync({ rawAnswer: cleaned, question: cleanup.question }),
            new Promise<null>((resolve) => window.setTimeout(() => resolve(null), 12_000)),
          ]);
          if (response) cleaned = response.cleanedAnswer;
        } catch { /* Keep the person’s own words if cleanup cannot finish. */ }
        cleanup.apply(cleaned);
        setIsPersonalizing(false);
        setStep(steps[position + 1]);
        playSound(cueForAdvance(position, position + 1));
      })();
      return;
    }
    if (step === "action") { playSound("back"); reset(); return; }
    if (position < steps.length - 1) { setStep(steps[position + 1]); playSound(cueForAdvance(position, position + 1)); }
  };
  const reset = () => { stopVoice(); setStep("name"); setUserName(""); setLocation(""); setSuccess(""); setCleanSuccess(""); setSelectedBenefits([]); setFuture(""); setCleanFuture(""); setWhyNow(""); setCleanWhyNow(""); setRole(null); setOtherRole(""); setResponsibility(""); setCleanResponsibility(""); setWeeklyResult(""); setCleanWeeklyResult(""); setCommitment("solid"); setDreamScene("celebration"); setDreamDetail(""); setClarityPrintout(null); setClarityError(""); setOpenFinalSections({ vision: true, dream: false, plan: false }); setHelpOpen(false); };
  const printFinalPlan = () => {
    setOpenFinalSections({ vision: true, dream: true, plan: true });
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => window.print()));
  };
  const writeClarityPrintout = () => {
    if (createClarityPrintout.isPending) return;
    setClarityError("");
    void createClarityPrintout.mutateAsync(clarityInput).then((printout) => { setClarityPrintout(printout); playSound("payoff"); }).catch(() => {
      setClarityPrintout(clarityFallback);
      setClarityError("Your printout is already here in your own words. You can add more detail and try again when you want.");
      playSound("error");
    });
  };
  const toggleBenefit = (id: BenefitId) => { setSelectedBenefits((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); playSound("select"); };
  const toggleFinalSection = (sectionId: FinalSectionId) => { setOpenFinalSections((current) => ({ ...current, [sectionId]: !current[sectionId] })); playSound("select"); };
  const handleGuidedInputKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing || !(event.target instanceof HTMLInputElement)) return;
    event.preventDefault();
    move("next");
  };

  const renderStep = () => {
    if (step === "name") return <><p className="guided-kicker"><Compass size={18} /> STEP 1 OF 11 · START</p><h1>What’s your first name?</h1><p className="guided-intro">I’ll use it to make this feel like it is for you.</p><VoiceField id="name" label="YOUR FIRST NAME" value={userName} setValue={setUserName} autoFocus active={activeVoice} note={voiceNote} start={startVoice} stop={stopVoice} /></>;
    if (step === "location") return <><p className="guided-kicker"><MapPin size={18} /> STEP 2 OF 11 · START</p><h1>Where are you today?</h1><p className="guided-intro">A city or place is enough. This is only for your greeting.</p><VoiceField id="location" label="YOUR CITY OR PLACE" value={location} setValue={setLocation} autoFocus active={activeVoice} note={voiceNote} start={startVoice} stop={stopVoice} /><div className="guided-privacy-note"><MapPin size={20} /><span>I do not check your location. I only use the words you type here.</span></div></>;
    if (step === "success") return <><p className="guided-kicker"><Target size={18} /> STEP 3 OF 11 · GET CLEAR</p><h1>What does success look like for you?</h1><p className="guided-intro">Say it your way. It can be about money, work, family, freedom, health, or all of it together.</p><VoiceField id="success" label="MY PICTURE OF SUCCESS" value={success} setValue={setSuccess} multiline autoFocus active={activeVoice} note={isPersonalizing ? "Making your words clear while keeping them yours..." : voiceNote} start={startVoice} stop={stopVoice} /><ClarityChecklist items={["You are giving your work a clear direction.", "You do not need the perfect words to begin."]} /></>;
    if (step === "benefits") return <><p className="guided-kicker"><Sparkles size={18} /> STEP 4 OF 11 · GET CLEAR</p><h1>What do you want more of in your life?</h1><p className="guided-intro">Pick every benefit you want this success to create. Pick more than one if you want.</p><div className="guided-impact-grid">{benefits.map((item) => <button type="button" key={item.id} className={`guided-impact ${selectedBenefits.includes(item.id) ? "picked" : ""}`} onClick={() => toggleBenefit(item.id)} aria-pressed={selectedBenefits.includes(item.id)}><span>{item.emoji}</span><b>{item.title}</b>{selectedBenefits.includes(item.id) && <Check size={19} />}</button>)}</div><ClarityChecklist items={["You can see who and what this success helps.", "This gives your daily work a deeper reason."]} /></>;
    if (step === "future") return <><p className="guided-kicker"><Sparkles size={18} /> STEP 5 OF 11 · GET CLEAR</p><h1>If this worked, what would be better in your life?</h1><p className="guided-intro">Picture a better day. Think about your time, your people, your health, or the work you want to do.</p><VoiceField id="future" label="THE BRIGHTER FUTURE I WANT" value={future} setValue={setFuture} multiline autoFocus active={activeVoice} note={isPersonalizing ? "Making your words clear while keeping them yours..." : voiceNote} start={startVoice} stop={stopVoice} /><ClarityChecklist items={["You are making the future easier to picture.", "A clear picture can help you stay steady on hard days."]} /></>;
    if (step === "whyNow") return <><p className="guided-kicker"><Compass size={18} /> STEP 6 OF 11 · GET CLEAR</p><h1>Why is this worth doing now?</h1><p className="guided-intro">Keep it simple. What makes this important enough to work on today instead of someday?</p><VoiceField id="whyNow" label="MY REASON TO START NOW" value={whyNow} setValue={setWhyNow} multiline autoFocus active={activeVoice} note={isPersonalizing ? "Making your words clear while keeping them yours..." : voiceNote} start={startVoice} stop={stopVoice} /><ClarityChecklist items={["You are naming the reason this work matters.", "You will bring this reason with you into the action plan."]} /></>;
    if (step === "summary") return <><p className="guided-kicker"><Check size={18} /> STEP 7 OF 11 · GET CLEAR</p><h1>Here is the life you are working toward.</h1><p className="guided-intro">Read this slowly. Go back if any part does not feel right yet.</p><div className="guided-summary"><article className="guided-summary-item"><span>WHAT SUCCESS LOOKS LIKE</span><b>{successText}</b>{cleanSuccess && cleanSuccess !== success && <small>Your words: “{success}”</small>}</article><article className="guided-summary-item"><span>WHAT YOU WANT MORE OF</span><b>{pickedBenefits.map((item) => `${item.emoji} ${item.title}`).join(" · ")}</b></article><article className="guided-summary-item"><span>WHAT GETS BETTER</span><b>{futureText}</b>{cleanFuture && cleanFuture !== future && <small>Your words: “{future}”</small>}</article><article className="guided-summary-item"><span>WHY NOW</span><b>{whyNowText}</b>{cleanWhyNow && cleanWhyNow !== whyNow && <small>Your words: “{whyNow}”</small>}</article></div><ClarityChecklist title="YOU ARE CLEARER NOW" items={["You know what success means to you.", "You can see what gets better when it works.", "You have a reason to keep going when work feels hard."]} /></>;
    if (step === "role") return <><p className="guided-kicker"><Compass size={18} /> STEP 8 OF 11 · TAKE ACTION</p><h1>What kind of work do you do?</h1><p className="guided-intro">Pick the closest fit. I will use this to give you a useful next action.</p><div className="guided-roles">{roles.map((item) => <button type="button" key={item.id} className={`guided-choice ${role === item.id ? "picked" : ""}`} onClick={() => { setRole(item.id); playSound("select"); }} aria-pressed={role === item.id}><span className="guided-emoji">{item.emoji}</span><span><b>{item.title}</b><small>{item.line}</small></span>{role === item.id && <i><Check size={16} /></i>}</button>)}</div>{role === "other" && <VoiceField id="otherRole" label="TELL ME WHAT YOU DO" value={otherRole} setValue={setOtherRole} autoFocus active={activeVoice} note={voiceNote} start={startVoice} stop={stopVoice} />}</>;
    if (step === "responsibility") return <><p className="guided-kicker"><Target size={18} /> STEP 9 OF 11 · TAKE ACTION</p><h1>What result are you responsible for right now?</h1><p className="guided-intro">Name the result you can help move. It might be leads, sales, clearer work, faster delivery, happier customers, or your own words.</p><VoiceField id="responsibility" label="THE RESULT I CAN HELP MOVE" value={responsibility} setValue={setResponsibility} multiline autoFocus active={activeVoice} note={isPersonalizing ? "Making your words clear while keeping them yours..." : voiceNote} start={startVoice} stop={stopVoice} /><ClarityChecklist items={["You are narrowing your attention to one useful result.", "Your plan will focus on work you can actually influence."]} /></>;
    if (step === "commitment") return <><p className="guided-kicker"><Compass size={18} /> STEP 10 OF 11 · TAKE ACTION</p><h1>What result can I commit to in the next 7 days?</h1><p className="guided-intro">Make it real and easy to see. At my next check-in, what will be different because I did the work?</p><VoiceField id="weeklyResult" label="AT MY NEXT CHECK-IN, THIS IS TRUE" value={weeklyResult} setValue={setWeeklyResult} multiline autoFocus active={activeVoice} note={isPersonalizing ? "Making your result clear while keeping it yours..." : voiceNote} start={startVoice} stop={stopVoice} /><ClarityChecklist title="A GOOD SEVEN-DAY RESULT" items={["I can see proof that it happened.", "It connects to the work I can influence.", "It is small enough to move this week."]} /><div className="guided-result-anchor"><Target size={21} /><span>{suggestedTarget ? <>Your bigger picture is <b>{formatMoney(suggestedTarget)}</b> each month. This is the one result that moves it forward this week.</> : <>This is one visible result that moves your bigger picture forward this week.</>}</span></div><div className="guided-commitment-heading"><span>HOW MUCH ROOM WILL I MAKE FOR IT?</span><p>Pick the level that gives this result a real chance soon.</p></div><div className="guided-commitments">{commitments.map((item) => <button type="button" key={item.id} className={`guided-commitment ${commitment === item.id ? "picked" : ""}`} onClick={() => { setCommitment(item.id); playSound("select"); }} aria-pressed={commitment === item.id}><span>{item.id === "small" ? "01" : item.id === "solid" ? "02" : "03"}</span><div><b>{item.title}</b><small>{item.line}</small><em>{item.hours}</em></div>{commitment === item.id && <i><Check size={19} /></i>}</button>)}</div></>;
    if (!actionPlan || !role) return null;
    return <>
      <p className="guided-kicker"><Check size={18} /> STEP 11 OF 11 · TAKE ACTION</p>
      <h1>Here is the life I am building.</h1>
      <p className="guided-intro">This is your clarity printout. Read the first part now. Open the rest only when it helps.</p>
      <FinalScreenSection sectionId="vision" eyebrow="MY CLEAR PICTURE" title={currentClarityPrintout.title} summary="A short near-future picture, built from my own words." open={openFinalSections.vision} onToggle={() => toggleFinalSection("vision")}>
        <div className="guided-vision-scene"><span>A DAY I AM BUILDING</span><p>{currentClarityPrintout.opening}</p><div><Compass size={21} /><b>{currentClarityPrintout.anchor}</b></div></div>
      </FinalScreenSection>
      <FinalScreenSection sectionId="dream" eyebrow="ADD MY DREAM-DAY DETAILS" title="Make this picture feel more like me" summary="Choose a kind of day, add what I can see, then let the words become clearer." open={openFinalSections.dream} onToggle={() => toggleFinalSection("dream")}>
        <section className="guided-clarity-writer" aria-labelledby="clarity-writer-title">
          <header><span><Sparkles size={17} /> MY DREAM DAY</span><h2 id="clarity-writer-title">What kind of day am I moving toward?</h2><p>Pick what feels closest. Then add one small detail that makes it mine.</p></header>
          <DreamDaySceneSelector value={dreamScene} onChange={(scene) => { setDreamScene(scene); setClarityPrintout(null); playSound("select"); }} />
          <VoiceField id="dreamDetail" label="ONE DETAIL I CAN SEE, HEAR, OR FEEL" value={dreamDetail} setValue={(value) => { setDreamDetail(value); setClarityPrintout(null); }} multiline active={activeVoice} note={voiceNote} start={startVoice} stop={stopVoice} />
          <div className="guided-clarity-writer-action"><button type="button" onClick={writeClarityPrintout} disabled={createClarityPrintout.isPending} aria-busy={createClarityPrintout.isPending}>{createClarityPrintout.isPending ? "Adding detail to my printout…" : "Make my picture clearer"}</button><small>It uses my words and the details I choose. It does not make a fake story about my life.</small>{clarityError && <p role="status">{clarityError}</p>}</div>
          <article className="guided-clarity-narrative" aria-live="polite"><span>{currentClarityPrintout.source === "ai" ? "MY WORDS, MADE CLEARER" : "MY WORDS"}</span><p>{currentClarityPrintout.scene}</p></article>
        </section>
      </FinalScreenSection>
      <FinalScreenSection sectionId="plan" eyebrow="MY NEXT MOVES" title="The work that brings this closer" summary={`The next proof I am looking for: ${actionPlan.weeklyResult}`} open={openFinalSections.plan} onToggle={() => toggleFinalSection("plan")}>
        <section className="guided-final-plan">
          <div className="guided-print-meta"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="" /><span>Dream Life GPS</span><b>Created by Sean Ali</b></div>
          <header className="guided-final-result"><span>THE NEXT PROOF I AM LOOKING FOR</span><h2>{actionPlan.weeklyResult}</h2><p>This moves me toward: <b>{actionPlan.clearPicture}</b></p></header>
          <section className="guided-printout-copy"><span>MY NEAR-FUTURE PICTURE</span><h2>{currentClarityPrintout.title}</h2><p>{currentClarityPrintout.opening}</p><p>{currentClarityPrintout.scene}</p></section>
          <div className="guided-final-context"><div><span>MY WORK FOCUS</span><b>{responsibilityText}</b></div><div><span>WHY THIS MATTERS</span><b>{actionPlan.whyNow || actionPlan.impact}</b></div></div>
          <div className="guided-simple-checklist">{finalChecklist.map((item, index) => <article key={item.label}><i aria-hidden="true">{index + 1}</i><div><span>{item.label}</span><h2>{item.title}</h2><p>{item.action}</p></div></article>)}</div>
          <div className="guided-final-close"><Check size={20} /><p>At my next check-in, I look at what moved. I keep what worked. Then I choose the next useful result.</p></div>
          <button type="button" className="guided-print-button" onClick={printFinalPlan}><Printer size={20} /> Print or save as PDF</button>
        </section>
      </FinalScreenSection>
    </>;
  };

  const nextLabel = isPersonalizing ? "Making it clear..." : stepHelp[step].next;
  return <div className="simple-gps guided-shell"><aside className="simple-rail guided-rail"><div className="simple-brand"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="Dream Life GPS" /><div><b>Dream Life</b><span>GPS / YOUR LIFE MAP</span></div></div><div className="rail-copy"><p>YOUR SIMPLE PATH</p><h2>Get clear.<br />Take the steps.</h2></div><div className="guided-phase-list" aria-label="Your progress"><div className={`guided-phase ${isClearPhase ? "current" : "done"}`}><span>{isClearPhase ? "01" : <Check size={18} />}</span><div><b>Get clear</b><small>Know what you want and why it matters.</small></div></div><div className={`guided-phase ${!isClearPhase ? "current" : ""}`}><span>02</span><div><b>Take action</b><small>Turn that clear picture into a useful move.</small></div></div></div><div className="rail-footer"><Compass size={21} /><p>One step at a time.</p></div><button type="button" className="guided-sound-toggle" onClick={() => setSoundEnabled((enabled) => !enabled)} aria-pressed={soundIsActive} aria-label={prefersReducedMotion ? "Sound is off because your device prefers reduced motion" : soundIsActive ? "Turn progress sounds off" : "Turn progress sounds on"} title={prefersReducedMotion ? "Progress sounds are off because your device prefers reduced motion." : undefined} disabled={prefersReducedMotion}>{soundIsActive ? <Volume2 size={17} /> : <VolumeX size={17} />}{soundIsActive ? "Sound on" : "Sound off"}</button><div className="creator-signature"><span>Created by</span><b>Sean Ali</b></div></aside><main className="guided-main"><header className="guided-topbar"><div className="mobile-brand"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="" /><b>DREAM LIFE <em>GPS</em></b></div><div className="guided-top-progress"><span>STEP {stepIndex + 1} OF {steps.length}</span><i style={{ "--step-progress": `${((stepIndex + 1) / steps.length) * 100}%` } as React.CSSProperties} /><b>{isClearPhase ? "GET CLEAR" : "TAKE ACTION"}</b></div><div className="top-message personal-greeting" aria-live="polite"><span className="tiny-dot" />{greeting}</div><button type="button" className="guided-help" onClick={() => setHelpOpen((open) => !open)}>{helpOpen ? <X size={19} /> : <Compass size={19} />} {helpOpen ? "Close" : "Need help?"}</button></header>{helpOpen && <aside className="guided-help-panel" aria-live="polite"><span>HELP FOR THIS STEP</span><b>{currentHelp.title}</b><p>{currentHelp.message}</p></aside>}<section className="guided-content"><article className="guided-card" key={step} onKeyDown={handleGuidedInputKeyDown}>{isPersonalizing ? <PersonalizingIndicator /> : renderStep()}</article></section><footer className="guided-footer"><button type="button" className="guided-button secondary" onClick={() => move("back")} disabled={stepIndex === 0 || isPersonalizing}><ArrowLeft size={20} /> Back</button><span className="guided-footer-note">{isPersonalizing ? "Making your next step personal." : stepIndex < steps.length - 1 ? "Finish this step to unlock the next one." : "Your next move is ready."}</span><button type="button" className="guided-button" onClick={() => move("next")} disabled={!canContinue}>{nextLabel}{step !== "action" && <ArrowRight size={20} />}</button></footer></main></div>;
}

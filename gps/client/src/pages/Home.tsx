/** A simple, locked path: get clear, then take one useful next action. */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Compass, MapPin, Mic, MicOff, Sparkles, Target, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { findStatedMonthlyIncome } from "@/lib/incomePlan";
import { canAdvanceStep, commitments, createNextAction, getRoleName, getWeeklyNumbers, roles, type CommitmentId, type RoleId } from "@/lib/guidedJourney";
import { mergeVoiceTranscript } from "@/lib/voiceTranscript";
import "../personalization.css";
import "../guided-flow.css";
import "../guided-flow-fix.css";

type Step = "name" | "location" | "role" | "goal" | "impact" | "change" | "summary" | "income" | "commitment" | "action";
type ImpactId = "family" | "health" | "home" | "time" | "adventure" | "team" | "giving" | "growth";
type VoiceField = "name" | "location" | "otherRole" | "goal" | "change";

type SpeechResultEvent = { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognitionLike = { lang: string; continuous: boolean; interimResults: boolean; onresult: ((event: SpeechResultEvent) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null; start: () => void; abort: () => void };
type SpeechConstructor = new () => SpeechRecognitionLike;

declare global { interface Window { SpeechRecognition?: SpeechConstructor; webkitSpeechRecognition?: SpeechConstructor } }

const steps: Step[] = ["name", "location", "role", "goal", "impact", "change", "summary", "income", "commitment", "action"];
const impacts: { id: ImpactId; emoji: string; title: string }[] = [
  { id: "family", emoji: "❤️", title: "Family & love" }, { id: "health", emoji: "🌿", title: "Health & energy" },
  { id: "home", emoji: "🏡", title: "Home & comfort" }, { id: "time", emoji: "⏳", title: "More time" },
  { id: "adventure", emoji: "✈️", title: "New experiences" }, { id: "team", emoji: "🤝", title: "Your team" },
  { id: "giving", emoji: "🌎", title: "People you help" }, { id: "growth", emoji: "🚀", title: "Who you become" },
];

const stepHelp: Record<Step, { title: string; message: string; next: string }> = {
  name: { title: "Start here", message: "Your first name lets me make this feel personal.", next: "Next" },
  location: { title: "One small detail", message: "A city or place is enough. It only changes your greeting.", next: "Next" },
  role: { title: "Your work matters", message: "Your role helps me give you a next action that fits your real work.", next: "Next" },
  goal: { title: "Say what you want", message: "Speak or type it in your own words. It does not need to sound perfect.", next: "Next" },
  impact: { title: "Make it personal", message: "Pick the parts of life you want this goal to help.", next: "Next" },
  change: { title: "Picture the change", message: "One honest answer is enough.", next: "Next" },
  summary: { title: "Check your goal", message: "Read this. Go back if you want to change something.", next: "Make my plan" },
  income: { title: "Pick a planning number", message: "This is not a promise. It is a number to work toward.", next: "Next" },
  commitment: { title: "Keep it real", message: "Choose time you can actually protect this week.", next: "Show my next action" },
  action: { title: "Take one step", message: "Start with the first action today. Then check in on Friday.", next: "Start over" },
};

function formatMoney(amount: number) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount); }

function VoiceField({ id, label, value, setValue, multiline = false, autoFocus, active, note, start, stop }: { id: VoiceField; label: string; value: string; setValue: (value: string) => void; multiline?: boolean; autoFocus?: boolean; active: VoiceField | null; note: string; start: (field: VoiceField) => void; stop: () => void }) {
  const listening = active === id;
  const inputId = `guided-${id}`;
  return <div className="guided-field"><label htmlFor={inputId}>{label}</label><div className="guided-input-wrap">{multiline ? <textarea id={inputId} value={value} onChange={(event) => setValue(event.target.value)} autoFocus={autoFocus} placeholder="Type it or use the microphone..." /> : <input id={inputId} value={value} onChange={(event) => setValue(event.target.value)} autoFocus={autoFocus} placeholder="Type it or use the microphone..." />}<button type="button" className={`guided-mic ${listening ? "listening" : ""}`} onClick={() => listening ? stop() : start(id)} aria-label={listening ? "Stop voice input" : "Speak your answer"}>{listening ? <MicOff size={17} /> : <Mic size={17} />}</button></div><p className="guided-voice-note"><Mic size={12} /> {note}</p></div>;
}

export default function Home() {
  const [step, setStep] = useState<Step>("name");
  const [userName, setUserName] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState<RoleId | null>(null);
  const [otherRole, setOtherRole] = useState("");
  const [goal, setGoal] = useState("");
  const [cleanGoal, setCleanGoal] = useState("");
  const [selectedImpacts, setSelectedImpacts] = useState<ImpactId[]>([]);
  const [change, setChange] = useState("");
  const [cleanChange, setCleanChange] = useState("");
  const [incomeTarget, setIncomeTarget] = useState(10000);
  const [commitment, setCommitment] = useState<CommitmentId>("solid");
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeVoice, setActiveVoice] = useState<VoiceField | null>(null);
  const [voiceNote, setVoiceNote] = useState("Tap the microphone to speak your answer.");
  const recognition = useRef<SpeechRecognitionLike | null>(null);
  const keepListening = useRef(false);
  const capturedVoice = useRef<{ field: VoiceField; value: string } | null>(null);
  const cleanAnswer = trpc.cleanAnswer.useMutation();

  const stepIndex = steps.indexOf(step);
  const isClearPhase = stepIndex <= steps.indexOf("summary");
  const suggestedTarget = findStatedMonthlyIncome([cleanGoal || goal, cleanChange || change].join(" "));
  const pickedImpacts = impacts.filter((item) => selectedImpacts.includes(item.id));
  const impactNames = pickedImpacts.map((item) => item.title.toLowerCase());
  const goalText = cleanGoal || goal;
  const changeText = cleanChange || change;
  const weekly = getWeeklyNumbers(incomeTarget, commitment);
  const actionPlan = useMemo(() => role ? createNextAction({ role, otherRole, commitment, goal: goalText, impactNames }) : null, [role, otherRole, commitment, goalText, impactNames.join("|")]);
  const greetingTime = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const greeting = userName.trim() && location.trim() ? `${greetingTime}, ${userName.trim()} — building from ${location.trim()}` : "One step at a time";
  const currentHelp = stepHelp[step];

  const valueForVoice = (field: VoiceField) => ({ name: userName, location, otherRole, goal, change }[field]);
  const setVoiceValue = (field: VoiceField, value: string) => {
    if (field === "name") setUserName(value);
    if (field === "location") setLocation(value);
    if (field === "otherRole") setOtherRole(value);
    if (field === "goal") { setGoal(value); setCleanGoal(""); }
    if (field === "change") { setChange(value); setCleanChange(""); }
  };
  const stopVoice = () => { keepListening.current = false; recognition.current?.abort(); recognition.current = null; capturedVoice.current = null; setActiveVoice(null); };
  const beginVoiceSegment = (field: VoiceField, base: string) => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return;
    const instance = new Recognition(); instance.lang = navigator.language || "en-US"; instance.continuous = true; instance.interimResults = true;
    const continueAfterPause = () => {
      const held = capturedVoice.current?.field === field ? capturedVoice.current.value : base;
      window.setTimeout(() => {
        if (!keepListening.current || recognition.current) return;
        beginVoiceSegment(field, held);
      }, 250);
    };
    instance.onresult = (event) => {
      const combined = mergeVoiceTranscript(base, event.results);
      capturedVoice.current = { field, value: combined };
      setVoiceValue(field, combined);
    };
    instance.onerror = (event) => {
      if (recognition.current !== instance) return;
      recognition.current = null;
      if (event.error === "no-speech" && keepListening.current) { setVoiceNote("Still listening. Keep going when you are ready."); continueAfterPause(); return; }
      keepListening.current = false;
      setActiveVoice(null);
      setVoiceNote(event.error === "not-allowed" ? "Please allow microphone access, then try again." : "I could not hear that. Try again or type your answer.");
    };
    instance.onend = () => {
      if (recognition.current !== instance) return;
      recognition.current = null;
      if (!keepListening.current) { setActiveVoice(null); return; }
      setVoiceNote("Still listening. Keep going when you are ready.");
      continueAfterPause();
    };
    recognition.current = instance; setActiveVoice(field); setVoiceNote("Listening now. Speak naturally. I will keep your words when you pause.");
    try { instance.start(); } catch { recognition.current = null; keepListening.current = false; setActiveVoice(null); setVoiceNote("Voice input is busy. Please try again."); }
  };
  const startVoice = (field: VoiceField) => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setVoiceNote("Voice input is not available here. You can type instead."); return; }
    recognition.current?.abort();
    keepListening.current = true;
    const base = valueForVoice(field).trim();
    capturedVoice.current = { field, value: base };
    beginVoiceSegment(field, base);
  };
  useEffect(() => () => recognition.current?.abort(), []);

  const canContinue = canAdvanceStep({ step, userName, location, role, otherRole, goal, impactCount: selectedImpacts.length, change, incomeTarget, isCleaning: cleanAnswer.isPending });
  const move = (direction: "next" | "back") => { const position = steps.indexOf(step); setHelpOpen(false); stopVoice(); if (direction === "back") { if (position > 0) setStep(steps[position - 1]); return; } if (!canContinue) return; if (step === "goal" || step === "change") { const raw = step === "goal" ? goal.trim() : change.trim(); const question = step === "goal" ? "What do you want to make happen?" : "What would change if this worked?"; void (async () => { let cleaned = raw; try { cleaned = (await cleanAnswer.mutateAsync({ rawAnswer: raw, question })).cleanedAnswer; } catch { /* Keep the person’s own words when cleanup cannot finish. */ } if (step === "goal") setCleanGoal(cleaned); else setCleanChange(cleaned); setStep(steps[position + 1]); })(); return; } if (step === "action") { reset(); return; } if (position < steps.length - 1) setStep(steps[position + 1]); };
  const reset = () => { stopVoice(); setStep("name"); setUserName(""); setLocation(""); setRole(null); setOtherRole(""); setGoal(""); setCleanGoal(""); setSelectedImpacts([]); setChange(""); setCleanChange(""); setIncomeTarget(10000); setCommitment("solid"); setHelpOpen(false); };
  const toggleImpact = (id: ImpactId) => setSelectedImpacts((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const renderStep = () => {
    if (step === "name") return <><p className="guided-kicker"><Compass size={15} /> STEP 1 OF 10 · GET CLEAR</p><h1>What’s your first name?</h1><p className="guided-intro">I’ll use it to make this feel like it is for you.</p><VoiceField id="name" label="YOUR FIRST NAME" value={userName} setValue={setUserName} autoFocus active={activeVoice} note={voiceNote} start={startVoice} stop={stopVoice} /></>;
    if (step === "location") return <><p className="guided-kicker"><MapPin size={15} /> STEP 2 OF 10 · GET CLEAR</p><h1>Where are you today?</h1><p className="guided-intro">A city or place is enough. This is only for your greeting.</p><VoiceField id="location" label="YOUR CITY OR PLACE" value={location} setValue={setLocation} autoFocus active={activeVoice} note={voiceNote} start={startVoice} stop={stopVoice} /><div className="guided-privacy-note"><MapPin size={16} /><span>I do not check your location. I only use the words you type here.</span></div></>;
    if (step === "role") return <><p className="guided-kicker"><Compass size={15} /> STEP 3 OF 10 · GET CLEAR</p><h1>What kind of work do you do?</h1><p className="guided-intro">Pick the closest fit. I will use this to give you a helpful next action.</p><div className="guided-roles">{roles.map((item) => <button type="button" key={item.id} className={`guided-choice ${role === item.id ? "picked" : ""}`} onClick={() => setRole(item.id)} aria-pressed={role === item.id}><span className="guided-emoji">{item.emoji}</span><span><b>{item.title}</b><small>{item.line}</small></span>{role === item.id && <i><Check size={12} /></i>}</button>)}</div>{role === "other" && <VoiceField id="otherRole" label="TELL ME WHAT YOU DO" value={otherRole} setValue={setOtherRole} autoFocus active={activeVoice} note={voiceNote} start={startVoice} stop={stopVoice} />}</>;
    if (step === "goal") return <><p className="guided-kicker"><Target size={15} /> STEP 4 OF 10 · GET CLEAR</p><h1>What do you want to make happen?</h1><p className="guided-intro">Say it your way. It can be about money, work, your life, or all three.</p><VoiceField id="goal" label="YOUR GOAL" value={goal} setValue={setGoal} multiline autoFocus active={activeVoice} note={cleanAnswer.isPending ? "Making your words clear while keeping them yours..." : voiceNote} start={startVoice} stop={stopVoice} /></>;
    if (step === "impact") return <><p className="guided-kicker"><Sparkles size={15} /> STEP 5 OF 10 · GET CLEAR</p><h1>Why does this matter to you?</h1><p className="guided-intro">Pick every part of life you want this goal to help. Pick more than one if you want.</p><div className="guided-impact-grid">{impacts.map((item) => <button type="button" key={item.id} className={`guided-impact ${selectedImpacts.includes(item.id) ? "picked" : ""}`} onClick={() => toggleImpact(item.id)} aria-pressed={selectedImpacts.includes(item.id)}><span>{item.emoji}</span><b>{item.title}</b>{selectedImpacts.includes(item.id) && <Check size={14} />}</button>)}</div></>;
    if (step === "change") return <><p className="guided-kicker"><Sparkles size={15} /> STEP 6 OF 10 · GET CLEAR</p><h1>What would change if this worked?</h1><p className="guided-intro">Think about your day, the people you care about, or the work you want to do.</p><VoiceField id="change" label="WHAT WOULD CHANGE?" value={change} setValue={setChange} multiline autoFocus active={activeVoice} note={cleanAnswer.isPending ? "Making your words clear while keeping them yours..." : voiceNote} start={startVoice} stop={stopVoice} /></>;
    if (step === "summary") return <><p className="guided-kicker"><Check size={15} /> STEP 7 OF 10 · GET CLEAR</p><h1>Here is your clear goal.</h1><p className="guided-intro">This is what you are working toward. You can go back if it does not feel right yet.</p><div className="guided-summary"><article className="guided-summary-item"><span>WHAT YOU WANT</span><b>{goalText}</b>{cleanGoal && cleanGoal !== goal && <small>Your words: “{goal}”</small>}</article><article className="guided-summary-item"><span>WHY IT MATTERS</span><b>{pickedImpacts.map((item) => `${item.emoji} ${item.title}`).join(" · ")}</b></article><article className="guided-summary-item"><span>WHAT WOULD CHANGE</span><b>{changeText}</b>{cleanChange && cleanChange !== change && <small>Your words: “{change}”</small>}</article></div></>;
    if (step === "income") return <><p className="guided-kicker"><Target size={15} /> STEP 8 OF 10 · TAKE ACTION</p><h1>How much do you want to make each month?</h1><p className="guided-intro">This is a planning number, not a promise. You can change it any time.</p><div className="guided-income">{suggestedTarget !== null && <button type="button" className="guided-recommendation" onClick={() => setIncomeTarget(suggestedTarget)}><Sparkles size={15} /> You mentioned {formatMoney(suggestedTarget)}. Use it as your starting number.</button>}<label className="guided-income-number" htmlFor="income-target"><span>$</span><input id="income-target" type="number" min="0" step="500" value={incomeTarget || ""} onChange={(event) => setIncomeTarget(Math.max(0, Number(event.target.value) || 0))} aria-label="Monthly income target" /></label><div className="guided-presets">{[5000, 10000, 25000, 50000].map((amount) => <button type="button" key={amount} className={incomeTarget === amount ? "picked" : ""} onClick={() => setIncomeTarget(amount)}>{formatMoney(amount)}</button>)}</div><div className="guided-simple-note"><Target size={16} /><span>That is about <b>{formatMoney(weekly.weekly)}</b> each week. You do not have to do it all at once.</span></div></div></>;
    if (step === "commitment") return <><p className="guided-kicker"><Compass size={15} /> STEP 9 OF 10 · TAKE ACTION</p><h1>How much time can you give this each week?</h1><p className="guided-intro">Choose what you can really protect. A smaller honest plan is better than a big plan you cannot keep.</p><div className="guided-commitments">{commitments.map((item) => <button type="button" key={item.id} className={`guided-commitment ${commitment === item.id ? "picked" : ""}`} onClick={() => setCommitment(item.id)} aria-pressed={commitment === item.id}><span>{item.id === "small" ? "01" : item.id === "solid" ? "02" : "03"}</span><div><b>{item.title}</b><small>{item.line}</small><em>{item.hours}</em></div></button>)}</div></>;
    if (!actionPlan || !role) return null;
    return <><p className="guided-kicker"><Check size={15} /> STEP 10 OF 10 · TAKE ACTION</p><h1>Here is what to do today.</h1><p className="guided-intro">This plan fits your work as a {getRoleName(role, otherRole)} and the time you said you can give it.</p><div className="guided-action-card"><span className="guided-kicker">YOUR GOAL: {formatMoney(incomeTarget)} EACH MONTH</span><h2>Start with one useful move.</h2><p>{actionPlan.impact}</p><div className="guided-action-context"><span>WHAT I AM WORKING TOWARD</span><b>{goalText}</b><p>{changeText}</p></div><div className="guided-action-list"><article><span>DO THIS TODAY</span><b>{actionPlan.today}</b></article><article><span>DO THIS THIS WEEK</span><b>{actionPlan.thisWeek}</b><p>Planning number: {formatMoney(weekly.weekly)} this week. About {formatMoney(weekly.focusDay)} on each focus day.</p></article><article><span>CHECK THIS ON FRIDAY</span><b>{actionPlan.friday}</b></article></div></div></>;
  };

  const nextLabel = cleanAnswer.isPending ? "Making it clear..." : stepHelp[step].next;
  return <div className="simple-gps guided-shell"><aside className="simple-rail guided-rail"><div className="simple-brand"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="Dream Life GPS" /><div><b>Dream Life</b><span>GPS / YOUR LIFE MAP</span></div></div><div className="rail-copy"><p>YOUR SIMPLE PATH</p><h2>Get clear.<br />Take one step.</h2></div><div className="guided-phase-list" aria-label="Your progress"><div className={`guided-phase ${isClearPhase ? "current" : "done"}`}><span>{isClearPhase ? "01" : <Check size={14} />}</span><div><b>Get clear</b><small>Know what you want and why it matters.</small></div></div><div className={`guided-phase ${!isClearPhase ? "current" : ""}`}><span>02</span><div><b>Take action</b><small>Pick one useful move for today.</small></div></div></div><div className="rail-footer"><Compass size={18} /><p>One step at a time.</p></div><div className="creator-signature"><span>Created by</span><b>Sean Ali</b></div></aside><main className="guided-main"><header className="guided-topbar"><div className="mobile-brand"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="" /><b>DREAM LIFE <em>GPS</em></b></div><div className="guided-top-progress"><span>STEP {stepIndex + 1} OF {steps.length}</span><i style={{ "--step-progress": `${((stepIndex + 1) / steps.length) * 100}%` } as React.CSSProperties} /><b>{isClearPhase ? "GET CLEAR" : "TAKE ACTION"}</b></div><div className="top-message personal-greeting" aria-live="polite"><span className="tiny-dot" />{greeting}</div><button type="button" className="guided-help" onClick={() => setHelpOpen((open) => !open)}>{helpOpen ? <X size={15} /> : <Compass size={15} />} {helpOpen ? "Close" : "Need help?"}</button></header>{helpOpen && <aside className="guided-help-panel" aria-live="polite"><span>HELP FOR THIS STEP</span><b>{currentHelp.title}</b><p>{currentHelp.message}</p></aside>}<section className="guided-content"><article className="guided-card" key={step}>{renderStep()}</article></section><footer className="guided-footer"><button type="button" className="guided-button secondary" onClick={() => move("back")} disabled={stepIndex === 0}><ArrowLeft size={16} /> Back</button><span className="guided-footer-note">{stepIndex < steps.length - 1 ? "Finish this step to unlock the next one." : "Your next move is ready."}</span><button type="button" className="guided-button" onClick={() => move("next")} disabled={!canContinue}>{nextLabel}{step !== "action" && <ArrowRight size={16} />}</button></footer></main></div>;
}

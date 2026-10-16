/** A simple, locked path: get clear on the life you want, then take one useful step. */
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Compass, Download, MapPin, Mic, MicOff, Printer, Sparkles, Target, Volume2, VolumeX, X } from "lucide-react";
import { mergeVoiceTranscript } from "@/lib/voiceTranscript";
import { canPlayProgressiveSound, cueForAdvance, soundCues, type SoundCue } from "@/lib/progressiveSound";
import "../personalization.css";
import "../guided-flow.css";
import "../guided-flow-fix.css";
import "../guided-flow-panel.css";
import "../guided-sound.css";
import "../dream-life-emblem.css";
import "../friendly-quiz.css";
import "../final-screen.css";
import { compassImageUrl, createPersonalizedCompass, downloadCompassImage } from "@/lib/compassDownload";
import { DownloadGate } from "@/components/DownloadGate";
import { clearDownloadSession, readDownloadSession, saveDownloadSession, signupReturnParam } from "@/lib/downloadGate";

type Step = "name" | "location" | "success" | "benefits" | "future" | "whyNow" | "summary" | "responsibility" | "action";
type BenefitId = "family" | "health" | "calm" | "time" | "freedom" | "work" | "giving" | "growth" | "other";
type VoiceField = "name" | "location" | "success" | "future" | "whyNow" | "responsibility";

type SpeechResultEvent = { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }>> };
type SpeechRecognitionLike = { lang: string; continuous: boolean; interimResults: boolean; onresult: ((event: SpeechResultEvent) => void) | null; onerror: ((event: { error: string }) => void) | null; onend: (() => void) | null; start: () => void; abort: () => void };
type SpeechConstructor = new () => SpeechRecognitionLike;

declare global { interface Window { SpeechRecognition?: SpeechConstructor; webkitSpeechRecognition?: SpeechConstructor } }

const steps: Step[] = ["name", "location", "success", "benefits", "future", "whyNow", "summary", "responsibility", "action"];
const benefits: { id: BenefitId; emoji: string; title: string }[] = [
  { id: "family", emoji: "❤️", title: "Connection & loved ones" },
  { id: "health", emoji: "🌿", title: "Health & energy" },
  { id: "calm", emoji: "☀️", title: "Peace of mind" },
  { id: "time", emoji: "☕", title: "Time for myself" },
  { id: "freedom", emoji: "🕊️", title: "Freedom & adventure" },
  { id: "work", emoji: "🎨", title: "Meaningful work or hobbies" },
  { id: "giving", emoji: "🏡", title: "Financial peace" },
  { id: "growth", emoji: "🌱", title: "Learning & growing" },
  { id: "other", emoji: "✦", title: "Something else that matters to me" },
];

const stepHelp: Record<Step, { title: string; message: string; next: string }> = {
  name: { title: "Start here", message: "Your first name lets me make this feel personal.", next: "Next" },
  location: { title: "One small detail", message: "A city or place is enough. It only changes your greeting.", next: "Next" },
  success: { title: "Name the picture", message: "Success can mean money, work, family, freedom, health, or all of it together.", next: "Next" },
  benefits: { title: "Make it personal", message: "Pick the parts of life you want your success to improve.", next: "Next" },
  future: { title: "Picture it", message: "One honest answer is enough. Think about what a better day could feel like.", next: "Next" },
  whyNow: { title: "Find your reason", message: "This helps you remember what matters to you.", next: "Build my clear picture" },
  summary: { title: "Check your clear picture", message: "Read this. Go back if any part does not feel right yet.", next: "Take action" },
  responsibility: { title: "One small step", message: "Choose something that fits your life. You can also leave this blank for now.", next: "Get my tools" },
  action: { title: "Keep your tools close", message: "Print your summary, save your North Star, and look at them daily.", next: "Start over" },
};


function VoiceField({ id, label, value, setValue, multiline = false, autoFocus, active, note, start, stop }: { id: VoiceField; label: string; value: string; setValue: (value: string) => void; multiline?: boolean; autoFocus?: boolean; active: VoiceField | null; note: string; start: (field: VoiceField) => void; stop: () => void }) {
  const listening = active === id;
  const inputId = `guided-${id}`;
  return <div className="guided-field"><label htmlFor={inputId}>{label}</label><div className="guided-input-wrap">{multiline ? <textarea id={inputId} value={value} onChange={(event) => setValue(event.target.value)} autoFocus={autoFocus} placeholder="Type it or use the microphone..." /> : <input id={inputId} value={value} onChange={(event) => setValue(event.target.value)} autoFocus={autoFocus} placeholder="Type it or use the microphone..." />}<button type="button" className={`guided-mic ${listening ? "listening" : ""}`} onClick={() => listening ? stop() : start(id)} aria-label={listening ? "Stop voice input" : "Speak your answer"}>{listening ? <MicOff size={20} /> : <Mic size={20} />}</button></div><p className="guided-voice-note"><Mic size={16} /> {note}</p></div>;
}

function ClarityChecklist({ title = "WHAT YOU ARE BUILDING", items }: { title?: string; items: string[] }) {
  return <aside className="guided-checklist"><span>{title}</span><div>{items.map((item) => <p key={item}><Check size={18} />{item}</p>)}</div></aside>;
}

export default function Home() {
  const [resumed] = useState(() => {
    try { return readDownloadSession(window.sessionStorage, window.location.href); }
    catch { return null; }
  });
  const draft = resumed?.draft;
  const [downloadsUnlocked, setDownloadsUnlocked] = useState(resumed?.unlocked ?? false);
  const [welcome, setWelcome] = useState(!resumed);
  const [startingPoint, setStartingPoint] = useState(draft?.startingPoint ?? "");
  const [furthestStep, setFurthestStep] = useState(resumed ? steps.length - 1 : 0);
  const [step, setStep] = useState<Step>(resumed ? "action" : "name");
  const [userName, setUserName] = useState(() => draft?.userName ?? window.localStorage.getItem("dream-life-gps-name") ?? "");
  const [location, setLocation] = useState(draft?.location ?? "");
  const [success, setSuccess] = useState(draft?.success ?? "");
  const [selectedBenefits, setSelectedBenefits] = useState<BenefitId[]>(draft?.selectedBenefits ?? []);
  const [future, setFuture] = useState(draft?.future ?? "");
  const [whyNow, setWhyNow] = useState(draft?.whyNow ?? "");
  const [responsibility, setResponsibility] = useState(draft?.personalStep ?? "");
  const [helpOpen, setHelpOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => window.localStorage.getItem("dream-life-gps-sound") !== "off");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [activeVoice, setActiveVoice] = useState<VoiceField | null>(null);
  const [voiceNote, setVoiceNote] = useState("Tap the microphone to speak your answer.");
  const [compassSaving, setCompassSaving] = useState(false);
  const [compassError, setCompassError] = useState("");
  const [personalCompass, setPersonalCompass] = useState("");
  useEffect(() => {
    if (step !== "action") return;
    let cancelled = false;
    setPersonalCompass("");
    setCompassError("");
    void createPersonalizedCompass(userName, success).then((image) => {
      if (!cancelled) setPersonalCompass(image);
    }).catch(() => { if (!cancelled) setCompassError("Your image couldn't load. You can still print your plan, or go back and try again."); });
    return () => { cancelled = true; };
  }, [step, userName, success]);
  const saveCompass = async () => {
    if (compassSaving) return;
    setCompassSaving(true);
    setCompassError("");
    try {
      await downloadCompassImage(personalCompass);
    } catch {
      setCompassError("The compass could not be saved. Please try again.");
    } finally { setCompassSaving(false); }
  };
  const recognition = useRef<SpeechRecognitionLike | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const keepListening = useRef(false);
  const capturedVoice = useRef<{ field: VoiceField; value: string } | null>(null);

  const stepIndex = steps.indexOf(step);
  useEffect(() => { setFurthestStep((previous) => Math.max(previous, stepIndex)); }, [stepIndex]);
  const pickedBenefits = benefits.filter((item) => selectedBenefits.includes(item.id));
  const successText = success;
  const futureText = future;
  const whyNowText = whyNow;
  const greetingTime = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";
  const greeting = userName.trim() && location.trim() ? `${greetingTime}, ${userName.trim()} — building from ${location.trim()}` : "One step at a time";
  const currentHelp = stepHelp[step];
  const soundIsActive = canPlayProgressiveSound(soundEnabled, prefersReducedMotion);
  const saveDraftForSignup = (token: string) => {
    saveDownloadSession(window.sessionStorage, {
      userName, location, startingPoint, success, cleanSuccess: "", selectedBenefits,
      future, cleanFuture: "", whyNow, cleanWhyNow: "", personalStep: responsibility,
      role: "other", otherRole: "", responsibility: "", cleanResponsibility: "",
      weeklyResult: "", cleanWeeklyResult: "", commitment: "small",
      dreamScene: "calm", dreamDetail: "", clarityPrintout: null,
    }, token, downloadsUnlocked);
  };
  useEffect(() => {
    if (!resumed?.returned) return;
    try { saveDownloadSession(window.sessionStorage, resumed.draft, resumed.token, true); } catch { /* The current page still has the restored map. */ }
    const url = new URL(window.location.href);
    url.searchParams.delete(signupReturnParam);
    window.history.replaceState(window.history.state, "", url.href);
  }, [resumed]);

  const valueForVoice = (field: VoiceField) => ({ name: userName, location, success, future, whyNow, responsibility }[field]);
  const setVoiceValue = (field: VoiceField, value: string) => {
    const setters = { name: setUserName, location: setLocation, success: setSuccess, future: setFuture, whyNow: setWhyNow, responsibility: setResponsibility };
    setters[field](value);
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

  const requiredAnswers: Partial<Record<Step, string>> = { name: userName, success, future, whyNow };
  const canContinue = step === "benefits" ? selectedBenefits.length > 0 : !(step in requiredAnswers) || Boolean(requiredAnswers[step]?.trim());
  const move = (direction: "next" | "back") => {
    const position = steps.indexOf(step); setHelpOpen(false); stopVoice();
    if (direction === "back") { if (position > 0) { setStep(steps[position - 1]); playSound("back"); } return; }
    if (!canContinue) return;
    if (position < steps.length - 1) {
      const next = steps[position + 1]; setStep(next);
      playSound(next === "action" ? "finale" : cueForAdvance(position, position + 1));
    }
  };
  const reset = () => { stopVoice(); setStep("name"); setUserName(""); setLocation(""); setSuccess(""); setSelectedBenefits([]); setFuture(""); setWhyNow(""); setResponsibility(""); setCompassError(""); setHelpOpen(false); };
  const printFinalPlan = () => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => window.print()));
  };
  const toggleBenefit = (id: BenefitId) => { setSelectedBenefits((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]); playSound("select"); };
  const handleGuidedInputKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing || !(event.target instanceof HTMLInputElement)) return;
    event.preventDefault();
    move("next");
  };

  const renderStep = () => {
    if (welcome) return <>
      <p className="guided-kicker"><Compass size={18} /> DREAM LIFE GPS</p>
      <h1>Let's find a little more direction.</h1>
      <p className="guided-intro">Hey, I'm Sean. I'm glad you're here. <span className="quiz-welcome-extra">You don't need your whole life figured out. </span>Let's start with where you are today.</p>
      <fieldset className="quiz-start"><legend>What feels most like you right now?</legend>
        {[
          { title: "I have a dream, but I don't know where to start.", note: "Find my first step", icon: Compass },
          { title: "I'm doing a lot, but I want a clearer direction.", note: "Find my direction", icon: Target },
          { title: "I'm ready for a fresh start.", note: "Start my fresh chapter", icon: Sparkles },
        ].map(({ title, note, icon: Icon }) => <button type="button" key={title} onClick={() => { setStartingPoint(title); setWelcome(false); playSound("select"); }}><Icon size={23} /><span><b>{title}</b><small>{note}</small></span><ArrowRight size={20} /></button>)}
      </fieldset>
      <p className="quiz-reassurance"><Check size={17} /> No right or wrong answers. Just what feels true for you.</p>
    </>;
    if (step === "name") return <><p className="guided-kicker"><Compass size={18} /> LET'S GET TO KNOW YOU</p><h1>First, what should I call you?</h1><p className="guided-intro">{startingPoint === "I'm ready for a fresh start." ? "A fresh start can begin with one small step. I'm glad you're taking this one." : startingPoint === "I'm doing a lot, but I want a clearer direction." ? "Let's give all that effort a direction that feels right for you." : "You don't need to know every step yet. We'll start with the life you want."}</p><VoiceField id="name" label="Your first name" value={userName} setValue={setUserName} autoFocus active={activeVoice} note={voiceNote} start={startVoice} stop={stopVoice} /><p className="quiz-reassurance"><Check size={17} /> A first name is enough. We'll take this one question at a time.</p></>;
    if (step === "location") return <><p className="guided-kicker"><MapPin size={18} /> STEP 2 OF 9 · START</p><h1>Where are you today?</h1><p className="guided-intro">A city or place is enough. This is only for your greeting, and you can skip it.</p><VoiceField id="location" label="YOUR CITY OR PLACE (OPTIONAL)" value={location} setValue={setLocation} autoFocus active={activeVoice} note={voiceNote} start={startVoice} stop={stopVoice} /><div className="guided-privacy-note"><MapPin size={20} /><span>I do not check your location. I only use the words you type here.</span></div></>;
    if (step === "success") return <><p className="guided-kicker"><Target size={18} /> STEP 3 OF 9 · GET CLEAR</p><h1>What does success look like for you?</h1><p className="guided-intro">It might be feeling peaceful, spending time with people you love, enjoying retirement, learning something, or a dream of your own.</p><VoiceField id="success" label="MY PICTURE OF SUCCESS" value={success} setValue={setSuccess} multiline autoFocus active={activeVoice} note={voiceNote} start={startVoice} stop={stopVoice} /><ClarityChecklist items={["You are giving your life a direction that matters to you.", "You do not need the perfect words to begin."]} /></>;
    if (step === "benefits") return <><p className="guided-kicker"><Sparkles size={18} /> STEP 4 OF 9 · GET CLEAR</p><h1>What do you want more of in your life?</h1><p className="guided-intro">Pick what matters to you. You can choose more than one, or choose something else.</p><div className="guided-impact-grid">{benefits.map((item) => <button type="button" key={item.id} className={`guided-impact ${selectedBenefits.includes(item.id) ? "picked" : ""}`} onClick={() => toggleBenefit(item.id)} aria-pressed={selectedBenefits.includes(item.id)}><span>{item.emoji}</span><b>{item.title}</b>{selectedBenefits.includes(item.id) && <Check size={19} />}</button>)}</div><ClarityChecklist items={["You can see who and what this success helps.", "There is no one right kind of dream."]} /></>;
    if (step === "future") return <><p className="guided-kicker"><Sparkles size={18} /> STEP 5 OF 9 · GET CLEAR</p><h1>If this worked, what would be better in your life?</h1><p className="guided-intro">Picture a better day. Think about your time, your people, your health, or something you love doing.</p><VoiceField id="future" label="THE BRIGHTER FUTURE I WANT" value={future} setValue={setFuture} multiline autoFocus active={activeVoice} note={voiceNote} start={startVoice} stop={stopVoice} /><ClarityChecklist items={["You are making the future easier to picture.", "A clear picture can help you stay steady on hard days."]} /></>;
    if (step === "whyNow") return <><p className="guided-kicker"><Compass size={18} /> STEP 6 OF 9 · GET CLEAR</p><h1>Why is this worth doing now?</h1><p className="guided-intro">Keep it simple. Why does this matter to you at this point in your life?</p><VoiceField id="whyNow" label="MY REASON TO START NOW" value={whyNow} setValue={setWhyNow} multiline autoFocus active={activeVoice} note={voiceNote} start={startVoice} stop={stopVoice} /><ClarityChecklist items={["You are naming what matters to you.", "Your summary will keep this reason close."]} /></>;
    if (step === "summary") return <><p className="guided-kicker"><Check size={18} /> STEP 7 OF 9 · GET CLEAR</p><h1>Here is the life you are working toward.</h1><p className="guided-intro">Read this slowly. Go back if any part does not feel right yet.</p><div className="guided-summary"><article className="guided-summary-item"><span>WHAT SUCCESS LOOKS LIKE</span><b>{successText}</b></article><article className="guided-summary-item"><span>WHAT YOU WANT MORE OF</span><b>{pickedBenefits.map((item) => `${item.emoji} ${item.title}`).join(" · ")}</b></article><article className="guided-summary-item"><span>WHAT GETS BETTER</span><b>{futureText}</b></article><article className="guided-summary-item"><span>WHY NOW</span><b>{whyNowText}</b></article></div><ClarityChecklist title="YOU ARE CLEARER NOW" items={["You know what success means to you.", "You can see what gets better when it works.", "Your tools will remind you of what matters to you."]} /></>;
    if (step === "responsibility") return <><p className="guided-kicker"><Target size={18} /> ONE SMALL STEP</p><h1>What's one small step you could take?</h1><p className="guided-intro">Something that fits your life: call someone, make time for a hobby, take a gentle walk, or choose your own step. It's okay if you're not sure yet.</p><VoiceField id="responsibility" label="MY NEXT SMALL STEP (OPTIONAL)" value={responsibility} setValue={setResponsibility} multiline autoFocus active={activeVoice} note={voiceNote} start={startVoice} stop={stopVoice} /><p className="quiz-reassurance"><Check size={17} /> Leave this blank if you want to decide later. Your tools are ready either way.</p></>;
    return <>
      <header className="gps-tools-intro">
        <h1>{userName.trim().split(/\s+/)[0]}, your tools are ready.</h1>
        <p>I made these from your words. Save them, print them, and put them somewhere you'll see every day.</p>
      </header>
      <div className="gps-tools" aria-label="Your downloads">
        <section className="gps-tool-card guided-final-plan" aria-labelledby="gps-summary-title">
          <span className="gps-tool-number">01 · YOUR PERSONAL SUMMARY</span>
          <h2 id="gps-summary-title">The life you want, in your words.</h2>
          <div className="gps-final-downloads"><button type="button" onClick={printFinalPlan}><Printer size={20} /> Print / save my summary</button></div>
          <dl className="gps-tool-summary">
            <div><dt>What I want</dt><dd data-summary="goal">{success}</dd></div>
            <div><dt>What a better day looks like</dt><dd data-summary="future">{future}</dd></div>
            <div><dt>Why it matters to me</dt><dd data-summary="reason">{whyNow}</dd></div>
            {responsibility.trim() && <div><dt>My next small step</dt><dd data-summary="step">{responsibility}</dd></div>}
          </dl>
        </section>
        <section className="gps-tool-card" aria-labelledby="gps-compass-title">
          <span className="gps-tool-number">02 · YOUR NORTH STAR</span>
          <h2 id="gps-compass-title">A daily reminder of your direction.</h2>
          <div className="gps-final-downloads"><button type="button" onClick={() => void saveCompass()} disabled={compassSaving || !personalCompass}><Download size={20} />{compassSaving ? "Saving..." : "Download my North Star"}</button></div>
          <figure className="gps-north-star">
            <img src={personalCompass || compassImageUrl} width={1254} height={1374} data-north-star-compass data-first-name={userName.trim().split(/\s+/)[0]} alt={`A North Star personalized for ${userName.trim().split(/\s+/)[0]}: ${success}`} />
          </figure>
          {compassError && <p role="alert">{compassError}</p>}
        </section>
      </div>
      <section className="gps-use-tools" aria-labelledby="gps-use-title">
        <h2 id="gps-use-title">Here's what to do with your tools.</h2>
        <ol><li><b>Print them or save them.</b> Put your summary on the fridge or beside your bed. Keep your North Star on your phone or somewhere you'll see it.</li><li><b>Look at them every day.</b> Take a quiet moment to read your words and remember what matters to you.</li><li><b>Choose one small step.</b> Ask yourself, “What's one thing I can do today in this direction?” Let it fit your energy and your life.</li></ol>
        <p>That's enough for today. You can come back and update your tools whenever your life changes.</p>
      </section>
      <p className="gps-free-note">Both tools are free, with or without email signup.</p>
      <DownloadGate name={userName} unlocked={downloadsUnlocked} onSignup={saveDraftForSignup} />

    </>;
  };

  const nextLabel = stepHelp[step].next;
  const progress = welcome ? 0 : Math.round((stepIndex / (steps.length - 1)) * 100);
  const milestones = [
    { title: "A little about you", note: "Your starting point", start: 0, end: 1 },
    { title: "The life you want", note: "What matters and why", start: 2, end: 5 },
    { title: "Your clear picture", note: "Bring your answers together", start: 6, end: 6 },
    { title: "Your next steps", note: "Something that fits your life", start: 7, end: 7 },
    { title: "Your two tools", note: "Something to keep with you", start: 8, end: 8 },
  ];
  const goBack = () => {
    if (stepIndex === 0) { stopVoice(); setWelcome(true); }
    else move("back");
  };
  const startAgain = () => {
    try { clearDownloadSession(window.sessionStorage); } catch { /* Reset the current journey even if storage is unavailable. */ }
    setDownloadsUnlocked(false); reset(); setWelcome(true); setStartingPoint(""); setFurthestStep(0);
  };
  return <div className="simple-gps guided-shell">
    <aside className="simple-rail guided-rail" aria-label="Your Dream Life journey">
      <a className="simple-brand" href="/"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="" /><b>Dream Life GPS</b></a>
      <div className="quiz-rail-welcome"><h2>{userName.trim() && !welcome ? `This is your space, ${userName.trim()}.` : "A little clarity. A step forward."}</h2><p>You don't have to have it all figured out to begin.</p></div>
      <nav className="quiz-journey" aria-label="Your progress">
        {milestones.map((item, index) => {
          const current = stepIndex >= item.start && stepIndex <= item.end;
          const done = !welcome && stepIndex > item.end;
          return <button type="button" key={item.title} className={current ? "current" : done ? "done" : ""} aria-current={current ? "step" : undefined} disabled={welcome || furthestStep < item.start} onClick={() => { stopVoice(); setStep(steps[item.start]); }}>
            <span>{done ? <Check size={17} /> : index + 1}</span><div><b>{item.title}</b><small>{item.note}</small></div>
          </button>;
        })}
      </nav>
      <div className="quiz-rail-footer"><p>Created by Sean Ali</p></div>
    </aside>
    <main className="guided-main">
      <header className="guided-topbar">
        <div className="quiz-mobile-brand"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="" /><b>Dream Life GPS</b></div>
        <div className="guided-top-progress"><span>{welcome ? "LET'S BEGIN" : step === "action" ? "YOUR TOOLS ARE READY" : `STEP ${stepIndex + 1} OF ${steps.length}`}</span><i role="progressbar" aria-label="Your journey" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} style={{ "--step-progress": `${progress}%` } as React.CSSProperties} /></div>
        <div className="top-message personal-greeting" aria-live="polite">{welcome ? "One small step is enough." : greeting}</div>
        <button type="button" className="guided-sound-toggle" onClick={() => setSoundEnabled((enabled) => !enabled)} aria-pressed={soundIsActive} aria-label={soundIsActive ? "Turn progress sounds off" : "Turn progress sounds on"} title={prefersReducedMotion ? "Progress sounds are off with reduced motion." : soundIsActive ? "Turn progress sounds off" : "Turn progress sounds on"} disabled={prefersReducedMotion}>{soundIsActive ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
        <button type="button" className="guided-help" onClick={() => setHelpOpen((open) => !open)} aria-expanded={helpOpen} aria-controls="quiz-help" aria-label={helpOpen ? "Close help" : "Need a hand?"} title={helpOpen ? "Close help" : "Need a hand?"}>{helpOpen ? <X size={19} /> : <Compass size={19} />} <span>{helpOpen ? "Close" : "Need a hand?"}</span></button>
      </header>
      {helpOpen && <aside id="quiz-help" className="guided-help-panel" aria-live="polite"><b>{welcome ? "Start wherever you are." : currentHelp.title}</b><p>{welcome ? "Choose the answer that feels closest today. You can go back and change your answers as we go." : currentHelp.message}</p></aside>}
      <section className="guided-content" key={welcome ? "welcome" : step}><article className={`guided-card ${welcome ? "quiz-welcome" : step === "action" ? "gps-final-screen" : ""}`} onKeyDown={handleGuidedInputKeyDown}>{renderStep()}</article></section>
      <footer className="guided-footer">
        {!welcome && <button type="button" className="guided-button secondary" onClick={goBack} ><ArrowLeft size={20} /> Back</button>}
        <span className="guided-footer-note">{welcome ? "A little space to think about you." : step === "action" ? "Keep this picture close." : "Take your time. Your words are enough."}</span>
        {!welcome && <button type="button" className={`guided-button${step === "action" ? " secondary" : ""}`} onClick={() => step === "action" ? startAgain() : move("next")} disabled={!canContinue}>{nextLabel}{step !== "action" && <ArrowRight size={20} />}</button>}
      </footer>
    </main>
  </div>;
}

/**
 * DREAM LIFE GPS — Simple Trail edition.
 * Plain eighth-grade language, visual play, and small actions that feel easy to start.
 */
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Backpack,
  Check,
  Compass,
  DollarSign,
  Flag,
  Gamepad2,
  Heart,
  Map,
  MapPin,
  Mountain,
  PartyPopper,
  Plane,
  Sparkles,
  Target,
  TentTree,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";

type Role = "Creative" | "Ads" | "Products" | "Words" | "Design" | "Team";
type SlotId = "skill" | "week" | "score";

const steps = [
  { number: "01", title: "Pick", hint: "Choose a dream" },
  { number: "02", title: "Play", hint: "Pick your job" },
  { number: "03", title: "Build", hint: "Make your path" },
  { number: "04", title: "Results", hint: "Set the big goal" },
  { number: "05", title: "Spot", hint: "Find the rock" },
  { number: "06", title: "Go", hint: "Get your plan" },
];

const dreamCards = [
  { id: "travel", title: "Travel more", line: "Work from cool places.", icon: Plane, tone: "orange" },
  { id: "time", title: "Own my time", line: "Make room for what matters.", icon: TentTree, tone: "green" },
  { id: "family", title: "Be with my people", line: "Have more time at home.", icon: Users, tone: "blue" },
  { id: "health", title: "Feel strong", line: "Have energy for my life.", icon: Heart, tone: "pink" },
  { id: "craft", title: "Get really good", line: "Grow a skill I am proud of.", icon: Sparkles, tone: "yellow" },
];

const roleCards: { id: Role; title: string; line: string; icon: typeof Target }[] = [
  { id: "Creative", title: "Make ideas", line: "I help make fresh ads.", icon: Sparkles },
  { id: "Ads", title: "Run ads", line: "I help the right people see them.", icon: Target },
  { id: "Products", title: "Build products", line: "I help make things people want.", icon: Backpack },
  { id: "Words", title: "Write words", line: "I make ideas easy to understand.", icon: Map },
  { id: "Design", title: "Make it clear", line: "I make things look and feel simple.", icon: Zap },
  { id: "Team", title: "Help the team", line: "I keep people moving together.", icon: Users },
];

const routePieces = [
  { id: "skill", title: "Get better", line: "Practice one small skill.", icon: Sparkles, color: "mint" },
  { id: "week", title: "Do the work", line: "Take one good step each week.", icon: Zap, color: "orange" },
  { id: "score", title: "Look at the score", line: "See if your step helped.", icon: Target, color: "blue" },
];

const roleIdeas: Record<Role, { skill: string; work: string; score: string }> = {
  Creative: { skill: "Learn why a great first 3 seconds work", work: "Make 3 new ideas this week", score: "Count how many people keep watching" },
  Ads: { skill: "Learn to spot a winning ad", work: "Try 3 small ad tests this week", score: "See which ad brings good sales" },
  Products: { skill: "Learn what people get stuck on", work: "Fix 1 small hard part this week", score: "See if more people finish the step" },
  Words: { skill: "Learn to say the big idea simply", work: "Write 5 new opening lines", score: "See which line gets more clicks" },
  Design: { skill: "Learn to make the next step easy to see", work: "Make 2 clearer designs", score: "See which design helps people move" },
  Team: { skill: "Learn to make the next step clear", work: "Help one person make a simple plan", score: "Ask what got easier this week" },
};

const roadBlocks = [
  { id: "dream", title: "I am not sure what I want.", small: "My dream is still blurry.", icon: Compass },
  { id: "path", title: "I do not know my next step.", small: "I need a tiny plan.", icon: MapPin },
  { id: "skill", title: "I need to get better first.", small: "One skill needs practice.", icon: Backpack },
  { id: "go", title: "I keep stopping.", small: "I need to keep going.", icon: Mountain },
];

const bigMonthStandards = [
  { id: "one", title: "Do the big thing first", line: "Start with the move that can help money most today.", icon: Target },
  { id: "finish", title: "Finish what matters", line: "Do not hop between little jobs. Finish the important one.", icon: Check },
  { id: "score", title: "Keep score", line: "Look at revenue, profit, and what is working every day.", icon: Trophy },
  { id: "team", title: "Help the team move", line: "Talk straight, solve problems fast, and keep people moving.", icon: Users },
];

const roleMoneyMoves: Record<Role, string> = {
  Creative: "Make the strongest new ad idea you can today.",
  Ads: "Put your best ad in front of more of the right people.",
  Products: "Fix the one place where people stop before buying.",
  Words: "Write the one message that makes buying feel easy.",
  Design: "Make the next buying step easier to see and use.",
  Team: "Make the next important job clear and easy to follow.",
};

const guideCues = [
  { title: "Pick your dream", message: "Start here. Tap the dream card that sounds best to you.", button: "Go to your player" },
  { title: "Pick your player", message: "Now tap the card that feels most like your job.", button: "Build your path" },
  { title: "Build your path", message: "Pick a bright card. Then tap an empty spot on the map. Do that three times.", button: "Set your big-month focus" },
  { title: "Set your big-month focus", message: "Look at the big goal, then pick the work habit you need most today.", button: "Find the big rock" },
  { title: "Find the big rock", message: "Tap the thing that is getting in your way right now. Keep it simple.", button: "See your little plan" },
  { title: "Look at your little plan", message: "Check your tiny win. That is the only thing you need to do first.", button: "Finish guide" },
];

function titleForPiece(pieceId: string, role: Role) {
  const roleIdea = roleIdeas[role];
  if (pieceId === "skill") return roleIdea.skill;
  if (pieceId === "week") return roleIdea.work;
  return roleIdea.score;
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [dream, setDream] = useState("travel");
  const [role, setRole] = useState<Role>("Ads");
  const [activePiece, setActivePiece] = useState<string | null>(null);
  const [slots, setSlots] = useState<Record<SlotId, string | null>>({ skill: null, week: null, score: null });
  const [block, setBlock] = useState("path");
  const [moneyFocus, setMoneyFocus] = useState("one");
  const [celebrate, setCelebrate] = useState(false);
  const [guideActive, setGuideActive] = useState(false);
  const [guideCue, setGuideCue] = useState(0);

  const currentDream = dreamCards.find((item) => item.id === dream) ?? dreamCards[0];
  const currentBlock = roadBlocks.find((item) => item.id === block) ?? roadBlocks[1];
  const routeIsBuilt = Object.values(slots).every(Boolean);
  const progress = (step / (steps.length - 1)) * 100;
  const currentMoneyFocus = bigMonthStandards.find((item) => item.id === moneyFocus) ?? bigMonthStandards[0];

  const tinyWin = useMemo(() => {
    if (block === "dream") return "Write down one thing you want more of in your life.";
    if (block === "skill") return `Spend 20 minutes on ${roleIdeas[role].skill.toLowerCase()}.`;
    if (block === "go") return "Do one small work step before you change your plan.";
    return roleIdeas[role].work;
  }, [block, role]);

  const placePiece = (slot: SlotId) => {
    if (!activePiece) return;
    setSlots((oldSlots) => ({ ...oldSlots, [slot]: activePiece }));
    setActivePiece(null);
  };

  const goToStep = (nextStep: number) => {
    setStep(nextStep);
  };
  const next = () => goToStep(Math.min(steps.length - 1, step + 1));
  const back = () => goToStep(Math.max(0, step - 1));
  const reset = () => {
    setStep(0);
    setSlots({ skill: null, week: null, score: null });
    setCelebrate(false);
    setGuideActive(false);
    setGuideCue(0);
  };
  const startGuide = () => {
    setGuideCue(step);
    setGuideActive(true);
  };
  const moveGuideForward = () => {
    if (guideCue === guideCues.length - 1) {
      setGuideActive(false);
      return;
    }
    const nextCue = guideCue + 1;
    setGuideCue(nextCue);
    goToStep(nextCue);
  };

  return (
    <div className="simple-gps min-h-screen">
      <aside className="simple-rail">
        <div className="simple-brand">
          <img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="Dream Life GPS" />
          <div><b>Dream Life</b><span>GPS / YOUR LIFE MAP</span></div>
        </div>
        <div className="rail-copy"><p>YOUR LITTLE ADVENTURE</p><h2>Pick a dream.<br />Take a step.<br />Keep going.</h2></div>
        <nav className="simple-steps" aria-label="Your Dream Life GPS steps">
          <i className="step-line"><em style={{ height: `${progress}%` }} /></i>
          {steps.map((item, index) => <button className={`simple-step ${index === step ? "now" : ""} ${index < step ? "done" : ""}`} onClick={() => goToStep(index)} key={item.title}><span>{index < step ? <Check size={13} /> : item.number}</span><div><b>{item.title}</b><small>{item.hint}</small></div></button>)}
        </nav>
        <div className="rail-footer"><Gamepad2 size={18} /><p>This is not a test. Just try things and learn.</p></div>
      </aside>

      <main className="simple-main">
        <header className="simple-topbar">
          <div className="mobile-brand"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="" /><b>DREAM LIFE <em>GPS</em></b></div>
          <div className="step-readout"><span>YOUR PATH</span><div><i style={{ width: `${Math.max(progress, 5)}%` }} /></div><b>{step + 1} / {steps.length}</b></div>
          <div className="top-message"><span className="tiny-dot" />You are building your path</div>
          <button className={`guide-launch-button ${guideActive ? "active" : ""}`} onClick={() => guideActive ? setGuideActive(false) : startGuide()} aria-pressed={guideActive}>{guideActive ? <X size={17} /> : <Compass size={17} />}<span>{guideActive ? "Exit guide" : "Guide me"}</span></button>
        </header>

        <section className="simple-canvas">
          {guideActive && <aside className="guide-panel" aria-label="Guided focus walkthrough"><div className="guide-panel-top"><span><Compass size={16} /> YOUR GUIDE</span><button onClick={() => setGuideActive(false)} aria-label="Exit guided focus"><X size={16} /></button></div><div className="guide-count">STEP {guideCue + 1} OF {guideCues.length}</div><h2>{guideCues[guideCue].title}</h2><p>{guideCues[guideCue].message}</p><div className="guide-dots">{guideCues.map((item, index) => <i className={index === guideCue ? "now" : index < guideCue ? "done" : ""} key={item.title} />)}</div><button className="guide-next-button" onClick={moveGuideForward}>{guideCues[guideCue].button}<ArrowRight size={16} /></button><small>You can leave the guide any time.</small></aside>}
          {step === 0 && <div className="screen intro-screen simple-enter">
            <div className="intro-hero" style={{ backgroundImage: "linear-gradient(90deg, rgba(14,40,57,.98), rgba(14,40,57,.77) 52%, rgba(14,40,57,.12)), url('/manus-storage/dream-life-gps-hero_5e4ca605.jpg')" }}>
              <div className="level-stamp">STEP 1</div><div className="big-compass" aria-hidden="true"><Compass size={39} /><span>N</span><i /><i /></div>
              <p>FIRST, PICK A DREAM</p><h1>What do you want<br />more of?</h1><span>Pick one card. You can change it later.</span>
            </div>
            <div className="dream-board">
              <div className="board-title"><div><p>YOUR DREAM CARDS</p><h2>Choose the one that feels best.</h2></div><span><MapPin size={16} /> Put a pin on it</span></div>
              <div className={`dream-cards ${guideActive && guideCue === 0 ? "guide-focus" : ""}`}>{dreamCards.map((card) => { const Icon = card.icon; const selected = dream === card.id; return <button onClick={() => setDream(card.id)} className={`dream-card ${card.tone} ${selected ? "picked" : ""}`} key={card.id}><span className="dream-icon"><Icon size={22} /></span><b>{card.title}</b><small>{card.line}</small>{selected && <i><Check size={14} /></i>}</button>; })}</div>
              <div className="simple-callout"><span className="mini-pin"><MapPin size={17} /></span><p><b>Your dream:</b> {currentDream.title}. Great. Now we will make a tiny path toward it.</p></div>
            </div>
          </div>}

          {step === 1 && <div className="screen player-screen simple-enter">
            <div className="simple-heading"><span className="level-stamp ink">STEP 2</span><p>NOW PICK YOUR PLAYER</p><h1>What do you help with?</h1><small>There are no wrong answers. Pick the closest one.</small></div>
            <div className={`player-map ${guideActive && guideCue === 1 ? "guide-focus" : ""}`} style={{ backgroundImage: "linear-gradient(105deg, rgba(255,253,248,.98), rgba(255,253,248,.76)), url('/manus-storage/dream-life-gps-atlas_7f8f78a7.jpg')" }}>
              {roleCards.map((card, index) => { const Icon = card.icon; return <button className={`player-card ${role === card.id ? "picked" : ""}`} onClick={() => setRole(card.id)} key={card.id}><span>0{index + 1}</span><Icon size={24} /><b>{card.title}</b><small>{card.line}</small>{role === card.id && <i><Check size={13} /> Picked</i>}</button>; })}
            </div>
            <div className="role-bubble"><span><PartyPopper size={20} /></span><p><b>You picked: {role}.</b> Nice. Now let’s make a simple path for your job.</p></div>
          </div>}

          {step === 2 && <div className="screen build-screen simple-enter">
            <div className="build-side" style={{ backgroundImage: "linear-gradient(170deg, rgba(17,42,58,.99), rgba(17,42,58,.78)), url('/manus-storage/dream-life-gps-atlas_7f8f78a7.jpg')" }}>
              <span className="level-stamp">STEP 3</span><p>BUILD YOUR PATH</p><h1>Drag the 3 cards onto your map.</h1><small>Or tap a card, then tap an empty spot. Easy.</small><div className="drop-hint"><ArrowRight size={18} /> Pick, drop, done.</div>
            </div>
            <div className="build-board">
              <div className={`piece-tray ${guideActive && guideCue === 2 ? "guide-focus" : ""}`}><p>YOUR 3 PATH CARDS</p><div>{routePieces.map((piece) => { const Icon = piece.icon; const used = Object.values(slots).includes(piece.id); return <button key={piece.id} draggable={!used} onDragStart={() => setActivePiece(piece.id)} onClick={() => !used && setActivePiece(piece.id)} className={`route-piece ${piece.color} ${activePiece === piece.id ? "held" : ""} ${used ? "used" : ""}`}><Icon size={22} /><b>{piece.title}</b><small>{used ? "On your map" : piece.line}</small></button>; })}</div></div>
              <div className="path-map">
                <div className="path-start"><span>YOU ARE HERE</span><b>{role}</b></div>
                <svg viewBox="0 0 600 370" aria-hidden="true"><path d="M60 290 C135 290 149 100 255 152 S385 324 510 86" fill="none" stroke="#FF6B35" strokeDasharray="10 11" strokeWidth="4" /><circle cx="60" cy="290" r="10" fill="#FFFDF8" stroke="#FF6B35" strokeWidth="4" /><circle cx="510" cy="86" r="10" fill="#FF6B35" stroke="#FFFDF8" strokeWidth="4" /></svg>
                {(["skill", "week", "score"] as SlotId[]).map((slot, index) => { const pieceId = slots[slot]; const piece = routePieces.find((item) => item.id === pieceId); const Icon = piece?.icon ?? MapPin; return <button key={slot} onDragOver={(event) => event.preventDefault()} onDrop={() => placePiece(slot)} onClick={() => placePiece(slot)} className={`map-drop drop-${index} ${piece ? "filled" : ""}`}><span>{piece ? <Icon size={20} /> : "+"}</span><div><small>{index === 0 ? "FIRST" : index === 1 ? "THEN" : "LAST"}</small><b>{piece ? piece.title : "Drop a card here"}</b>{piece && <em>{titleForPiece(piece.id, role)}</em>}</div></button>; })}
                <div className="path-goal"><Flag size={18} /><span>YOUR DREAM</span><b>{currentDream.title}</b></div>
              </div>
              <div className={`path-message ${routeIsBuilt ? "ready" : ""}`}>{routeIsBuilt ? <><Check size={18} /><p><b>Nice work. Your path is built.</b> You do not need a huge plan. You just need these 3 small things.</p></> : <><MapPin size={18} /><p><b>Start with the bright cards.</b> Put all 3 on your map.</p></>}</div>
            </div>
          </div>}

          {step === 3 && <div className="screen money-screen simple-enter">
            <div className="money-hero"><div><span className="level-stamp">STEP 4</span><p>MONEY + RESULTS</p><h1>Big months are built on purpose.</h1><small>When the goal gets big, stay calm, clear, and ready to do the important work.</small></div><div className="money-numbers"><div><span><DollarSign size={18} /> REVENUE GOAL</span><b>$1M</b><small>in one month</small></div><div><span><Trophy size={18} /> PROFIT GOAL</span><b>$500K</b><small>in one month</small></div></div></div>
            <div className="money-board"><div className="money-intro"><p>THE BIG-MONTH MINDSET</p><h2>Keep this in your head:</h2><blockquote>“I do the hard thing first. I keep score. I help the team move.”</blockquote></div><div className={`money-standard-grid ${guideActive && guideCue === 3 ? "guide-focus" : ""}`}>{bigMonthStandards.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setMoneyFocus(item.id)} className={`money-standard ${moneyFocus === item.id ? "picked" : ""}`}><span><Icon size={20} /></span><div><b>{item.title}</b><small>{item.line}</small></div>{moneyFocus === item.id && <i><Check size={14} /></i>}</button>; })}</div><div className="money-move"><div><span><Zap size={22} /></span><p>YOUR BIG MOVE TODAY</p><h3>{roleMoneyMoves[role]}</h3><small><b>Your focus:</b> {currentMoneyFocus.title}. This is how a big month gets built: one important move at a time.</small></div><Target size={32} /></div></div>
          </div>}

          {step === 4 && <div className="screen block-screen simple-enter">
            <div className="block-hero" style={{ backgroundImage: "linear-gradient(100deg, rgba(14,40,57,.98), rgba(14,40,57,.68)), url('/manus-storage/dream-life-gps-checkpoint_6586c299.jpg')" }}><span className="level-stamp">STEP 5</span><p>FIND THE BIG ROCK</p><h1>What is making this hard right now?</h1><small>Pick the one that feels most true. No shame. We all get stuck.</small></div>
            <div className="block-board"><div className={`rock-list ${guideActive && guideCue === 4 ? "guide-focus" : ""}`}>{roadBlocks.map((item) => { const Icon = item.icon; return <button className={`rock-card ${block === item.id ? "picked" : ""}`} onClick={() => setBlock(item.id)} key={item.id}><span><Icon size={22} /></span><div><b>{item.title}</b><small>{item.small}</small></div>{block === item.id && <i><Check size={14} /></i>}</button>; })}</div><div className="rock-answer"><div className="answer-icon"><currentBlock.icon size={30} /></div><p>YOUR NEXT MOVE</p><h2>Let’s move this rock.</h2><b>{currentBlock.small}</b><span>{tinyWin}</span><div><MapPin size={17} /> Just do this one small thing first.</div></div></div>
          </div>}

          {step === 5 && <div className="screen plan-screen simple-enter">
            <div className="simple-heading plan-heading"><span className="level-stamp ink">STEP 6</span><p>YOUR LITTLE PLAN</p><h1>You are ready to go.</h1><small>Save this in your head. Or come back when you need it.</small></div>
            <article className="little-plan">
              <div className="plan-top"><div><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="" /><b>DREAM LIFE GPS</b></div><span>MY LITTLE PLAN</span></div>
              <div className="plan-dream"><span><Plane size={19} /></span><div><p>THE DREAM I PICKED</p><h2>{currentDream.title}</h2><small>{currentDream.line}</small></div><Flag size={29} /></div>
              <div className="plan-path"><p>MY 3 SMALL PATH STEPS</p>{routePieces.map((piece, index) => { const Icon = piece.icon; const selected = slots[(["skill", "week", "score"] as SlotId[])[index]]; return <div key={piece.id} className={`plan-step ${selected ? "good" : ""}`}><span>0{index + 1}</span><Icon size={19} /><div><b>{piece.title}</b><small>{selected ? titleForPiece(selected, role) : piece.line}</small></div>{selected && <Check size={17} />}</div>; })}</div>
              <div className="tiny-win"><span><Zap size={20} /></span><div><p>MY TINY WIN THIS WEEK</p><b>{tinyWin}</b></div></div>
              <div className="plan-bottom"><span>REMEMBER</span><p>Pick a dream. Take a step. Keep going.</p><Compass size={24} /></div>
            </article>
            <div className={`celebrate-row ${guideActive && guideCue === 5 ? "guide-focus" : ""}`}><button onClick={() => setCelebrate(true)}><PartyPopper size={18} /> I am ready</button><p>{celebrate ? "Nice. Your first tiny step starts now." : "You do not need to do everything today."}</p></div>
          </div>}
        </section>

        <footer className="simple-footer"><button className="soft-button" onClick={back} disabled={step === 0}><ArrowLeft size={17} /> Back</button><p><MapPin size={14} /> {steps[step].title} <ArrowRight size={13} /> {step === steps.length - 1 ? "Go" : steps[step + 1]?.title}</p>{step < steps.length - 1 ? <button className="go-button" onClick={next}>{step === 2 && !routeIsBuilt ? "Keep building" : "Next little step"}<ArrowRight size={17} /></button> : <button className="go-button" onClick={reset}>Try a new dream<Compass size={17} /></button>}</footer>
        <span className="sr-only" aria-live="polite">{guideActive ? `Guide step ${guideCue + 1}. ${guideCues[guideCue].message}` : ""}</span>
      </main>
    </div>
  );
}

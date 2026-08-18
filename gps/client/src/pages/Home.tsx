/**
 * DREAM LIFE GPS — Two Phase edition.
 * Every visible prompt is either a choice, a commitment, or the next useful move.
 */
import { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, Backpack, Check, Compass, DollarSign, Flag, Heart, Map,
  MapPin, Mountain, PartyPopper, Plane, Sparkles, Target, TentTree, Trophy, Users, X, Zap,
} from "lucide-react";

type Role = "Creative" | "Ads" | "Products" | "Words" | "Design" | "Team";
type SlotId = "skill" | "week" | "score";
type BuildView = "dream" | "role";
type RealizeView = "target" | "standard" | "route" | "block" | "move";

const dreamCards = [
  { id: "travel", title: "Travel more", line: "Work from cool places.", icon: Plane, tone: "orange" },
  { id: "time", title: "Own my time", line: "Make room for what matters.", icon: TentTree, tone: "green" },
  { id: "family", title: "Be with my people", line: "Have more time at home.", icon: Users, tone: "blue" },
  { id: "health", title: "Feel strong", line: "Have energy for my life.", icon: Heart, tone: "pink" },
  { id: "craft", title: "Get really good", line: "Grow a skill I am proud of.", icon: Sparkles, tone: "yellow" },
];

const roleCards: { id: Role; title: string; line: string; icon: typeof Target }[] = [
  { id: "Creative", title: "Make ideas", line: "Fresh ads and angles.", icon: Sparkles },
  { id: "Ads", title: "Run ads", line: "Put strong work in front of people.", icon: Target },
  { id: "Products", title: "Build products", line: "Make buying easier.", icon: Backpack },
  { id: "Words", title: "Write words", line: "Make the idea clear.", icon: Map },
  { id: "Design", title: "Make it clear", line: "Make the next step obvious.", icon: Zap },
  { id: "Team", title: "Move the team", line: "Keep the work moving.", icon: Users },
];

const routePieces = [
  { id: "skill", title: "Get better", line: "Practice one skill.", icon: Sparkles, color: "mint" },
  { id: "week", title: "Do the work", line: "Take the key action.", icon: Zap, color: "orange" },
  { id: "score", title: "Keep score", line: "See if it worked.", icon: Target, color: "blue" },
];

const roleIdeas: Record<Role, { skill: string; work: string; score: string; moneyMove: string }> = {
  Creative: { skill: "Learn what makes a strong first 3 seconds", work: "Make 3 new ad ideas", score: "See which idea keeps attention", moneyMove: "Make the strongest new ad idea you can today." },
  Ads: { skill: "Learn to spot a winning ad", work: "Run 3 small ad tests", score: "See which ad brings good sales", moneyMove: "Put your best ad in front of more right people." },
  Products: { skill: "Learn where people get stuck", work: "Fix 1 hard buying step", score: "See if more people finish", moneyMove: "Fix the one place where people stop before buying." },
  Words: { skill: "Learn to say the big idea simply", work: "Write 5 opening lines", score: "See which line gets clicks", moneyMove: "Write the one message that makes buying feel easy." },
  Design: { skill: "Learn to make the next step easy to see", work: "Make 2 clearer designs", score: "See which design helps people move", moneyMove: "Make the next buying step easy to see and use." },
  Team: { skill: "Learn to make the next step clear", work: "Help one person make a plan", score: "Ask what got easier", moneyMove: "Make the next important job clear and easy to follow." },
};

const standards = [
  { id: "first", title: "Do the big thing first", line: "Start with the move that can help money most.", icon: Target },
  { id: "finish", title: "Finish what matters", line: "Stay on the important job.", icon: Check },
  { id: "score", title: "Keep score", line: "Check revenue, profit, and what works.", icon: Trophy },
  { id: "team", title: "Move the team", line: "Make the next job clear.", icon: Users },
];

const blocks = [
  { id: "dream", title: "The dream is blurry", line: "I need a clearer outcome.", icon: Compass },
  { id: "path", title: "The next move is unclear", line: "I need one useful action.", icon: MapPin },
  { id: "skill", title: "A skill is missing", line: "I need to practice first.", icon: Backpack },
  { id: "go", title: "I keep stopping", line: "I need to finish the key move.", icon: Mountain },
];

function titleForPiece(pieceId: string, role: Role) {
  const idea = roleIdeas[role];
  if (pieceId === "skill") return idea.skill;
  if (pieceId === "week") return idea.work;
  return idea.score;
}

export default function Home() {
  const [phase, setPhase] = useState<"build" | "realize">("build");
  const [buildView, setBuildView] = useState<BuildView>("dream");
  const [realizeView, setRealizeView] = useState<RealizeView>("target");
  const [dream, setDream] = useState("travel");
  const [role, setRole] = useState<Role>("Ads");
  const [activePiece, setActivePiece] = useState<string | null>(null);
  const [slots, setSlots] = useState<Record<SlotId, string | null>>({ skill: null, week: null, score: null });
  const [standard, setStandard] = useState("first");
  const [block, setBlock] = useState("path");
  const [targetLocked, setTargetLocked] = useState(false);
  const [started, setStarted] = useState(false);
  const [guideActive, setGuideActive] = useState(false);

  const currentDream = dreamCards.find((item) => item.id === dream) ?? dreamCards[0];
  const currentStandard = standards.find((item) => item.id === standard) ?? standards[0];
  const currentBlock = blocks.find((item) => item.id === block) ?? blocks[1];
  const routeIsBuilt = Object.values(slots).every(Boolean);
  const currentView = phase === "build" ? buildView : realizeView;
  const guide = phase === "build"
    ? buildView === "dream"
      ? { title: "Choose the dream", message: "Pick the outcome you want most.", button: "Choose your role" }
      : { title: "Choose your role", message: "Pick where you create the most value.", button: "Make it real" }
    : realizeView === "target"
      ? { title: "Lock the target", message: "Commit to the month you want to create.", button: "Choose the standard" }
      : realizeView === "standard"
        ? { title: "Choose the standard", message: "Pick the work habit you need most now.", button: "Map the work" }
        : realizeView === "route"
          ? { title: "Map the work", message: "Put three useful moves on the map.", button: "Clear the block" }
          : realizeView === "block"
            ? { title: "Clear the block", message: "Pick the one thing slowing you down.", button: "See your first move" }
            : { title: "Take the first move", message: "Do this first. Do it today.", button: "Finish guide" };

  const tinyWin = useMemo(() => {
    if (block === "dream") return "Write the one outcome you want most.";
    if (block === "skill") return `Spend 20 minutes on ${roleIdeas[role].skill.toLowerCase()}.`;
    if (block === "go") return "Finish one important work step before changing the plan.";
    return roleIdeas[role].work;
  }, [block, role]);

  const goBuild = (view: BuildView) => { setPhase("build"); setBuildView(view); };
  const goRealize = (view: RealizeView) => { setPhase("realize"); setRealizeView(view); };
  const next = () => {
    if (phase === "build" && buildView === "dream") return goBuild("role");
    if (phase === "build") return goRealize("target");
    if (realizeView === "target") return goRealize("standard");
    if (realizeView === "standard") return goRealize("route");
    if (realizeView === "route") return goRealize("block");
    if (realizeView === "block") return goRealize("move");
    setGuideActive(false);
  };
  const back = () => {
    if (phase === "build" && buildView === "role") return goBuild("dream");
    if (phase === "realize" && realizeView === "target") return goBuild("role");
    if (realizeView === "standard") return goRealize("target");
    if (realizeView === "route") return goRealize("standard");
    if (realizeView === "block") return goRealize("route");
    if (realizeView === "move") return goRealize("block");
  };
  const placePiece = (slot: SlotId) => {
    if (!activePiece) return;
    setSlots((old) => ({ ...old, [slot]: activePiece }));
    setActivePiece(null);
  };
  const reset = () => {
    setPhase("build"); setBuildView("dream"); setRealizeView("target"); setSlots({ skill: null, week: null, score: null });
    setTargetLocked(false); setStarted(false); setGuideActive(false);
  };

  const footerAction = phase === "build"
    ? buildView === "dream" ? "Choose your role" : "Make it real"
    : realizeView === "target" ? "Choose the standard" : realizeView === "standard" ? "Map the work" : realizeView === "route" ? "Clear the block" : realizeView === "block" ? "See your first move" : "Finish";

  return <div className="simple-gps min-h-screen">
    <aside className="simple-rail phase-rail">
      <div className="simple-brand"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="Dream Life GPS" /><div><b>Dream Life</b><span>GPS / YOUR LIFE MAP</span></div></div>
      <div className="rail-copy"><p>YOUR TWO PHASES</p><h2>Build the dream.<br />Make it real.</h2></div>
      <nav className="phase-navigation" aria-label="Dream Life GPS phases">
        <button className={`phase-button ${phase === "build" ? "now" : ""}`} onClick={() => goBuild("dream")}><span>01</span><div><b>Dream Building</b><small>Choose the life and role.</small></div></button>
        <button className={`phase-button ${phase === "realize" ? "now" : ""}`} onClick={() => goRealize("target")}><span>02</span><div><b>Dream Realization</b><small>Set the target. Take the move.</small></div></button>
      </nav>
      <div className="rail-footer"><Compass size={18} /><p>{phase === "build" ? "Choose what you are building." : "Take the next useful move."}</p></div>
    </aside>

    <main className="simple-main">
      <header className="simple-topbar">
        <div className="mobile-brand"><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="" /><b>DREAM LIFE <em>GPS</em></b></div>
        <div className="phase-readout"><span>NOW</span><b>{phase === "build" ? "DREAM BUILDING" : "DREAM REALIZATION"}</b></div>
        <div className="top-message"><span className="tiny-dot" />{phase === "build" ? "Choose clearly" : "Move clearly"}</div>
        <button className={`guide-launch-button ${guideActive ? "active" : ""}`} onClick={() => setGuideActive((value) => !value)} aria-pressed={guideActive}>{guideActive ? <X size={17} /> : <Compass size={17} />}<span>{guideActive ? "Exit guide" : "Guide me"}</span></button>
      </header>

      <section className="simple-canvas">
        {guideActive && <aside className="guide-panel" aria-label="Guided focus walkthrough"><div className="guide-panel-top"><span><Compass size={16} /> YOUR GUIDE</span><button onClick={() => setGuideActive(false)} aria-label="Exit guided focus"><X size={16} /></button></div><div className="guide-count">{phase === "build" ? "DREAM BUILDING" : "DREAM REALIZATION"}</div><h2>{guide.title}</h2><p>{guide.message}</p><button className="guide-next-button" onClick={next}>{guide.button}<ArrowRight size={16} /></button><small>Leave any time.</small></aside>}

        {phase === "build" && buildView === "dream" && <div className="screen intro-screen simple-enter">
          <div className="intro-hero" style={{ backgroundImage: "linear-gradient(90deg, rgba(14,40,57,.98), rgba(14,40,57,.77) 52%, rgba(14,40,57,.12)), url('/manus-storage/dream-life-gps-hero_5e4ca605.jpg')" }}><div className="level-stamp">DREAM BUILDING</div><div className="big-compass" aria-hidden="true"><Compass size={39} /><span>N</span><i /><i /></div><p>CHOOSE THE OUTCOME</p><h1>What do you want<br />to build?</h1><span>Pick one.</span></div>
          <div className="dream-board"><div className="board-title"><div><p>CHOOSE ONE</p><h2>Pick your dream.</h2></div></div><div className={`dream-cards ${guideActive ? "guide-focus" : ""}`}>{dreamCards.map((card) => { const Icon = card.icon; const selected = dream === card.id; return <button onClick={() => setDream(card.id)} className={`dream-card ${card.tone} ${selected ? "picked" : ""}`} key={card.id}><span className="dream-icon"><Icon size={22} /></span><b>{card.title}</b><small>{card.line}</small>{selected && <i><Check size={14} /></i>}</button>; })}</div></div>
        </div>}

        {phase === "build" && buildView === "role" && <div className="screen player-screen simple-enter">
          <div className="simple-heading"><span className="level-stamp ink">DREAM BUILDING</span><p>CHOOSE YOUR LANE</p><h1>Where do you help build it?</h1></div>
          <div className={`player-map ${guideActive ? "guide-focus" : ""}`} style={{ backgroundImage: "linear-gradient(105deg, rgba(255,253,248,.98), rgba(255,253,248,.76)), url('/manus-storage/dream-life-gps-atlas_7f8f78a7.jpg')" }}>{roleCards.map((card, index) => { const Icon = card.icon; return <button className={`player-card ${role === card.id ? "picked" : ""}`} onClick={() => setRole(card.id)} key={card.id}><span>0{index + 1}</span><Icon size={24} /><b>{card.title}</b><small>{card.line}</small>{role === card.id && <i><Check size={13} /> Picked</i>}</button>; })}</div>
        </div>}

        {phase === "realize" && realizeView === "target" && <div className="screen target-screen simple-enter">
          <div className="money-hero"><div><span className="level-stamp">DREAM REALIZATION</span><p>LOCK THE TARGET</p><h1>Set the month.</h1><small>Set the level. Then act at that level.</small></div><div className="money-numbers"><div><span><DollarSign size={18} /> REVENUE</span><b>$1M</b><small>this month</small></div><div><span><Trophy size={18} /> PROFIT</span><b>$500K</b><small>this month</small></div></div></div>
          <div className={`target-lock ${guideActive ? "guide-focus" : ""}`}><div><p>YOUR COMMITMENT</p><h2>{targetLocked ? "Target locked." : "I will act at the level this target needs."}</h2></div><button onClick={() => setTargetLocked(true)} className={targetLocked ? "locked" : ""}>{targetLocked ? <><Check size={17} /> Target locked</> : <><Target size={17} /> Lock the target</>}</button></div>
        </div>}

        {phase === "realize" && realizeView === "standard" && <div className="screen standards-screen simple-enter">
          <div className="simple-heading standards-heading"><span className="level-stamp ink">DREAM REALIZATION</span><p>CHOOSE YOUR STANDARD</p><h1>What needs your attention now?</h1></div>
          <div className="money-board"><blockquote className="money-mantra">Do the hard thing first. Keep score. Move the team.</blockquote><div className={`money-standard-grid ${guideActive ? "guide-focus" : ""}`}>{standards.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => setStandard(item.id)} className={`money-standard ${standard === item.id ? "picked" : ""}`}><span><Icon size={20} /></span><div><b>{item.title}</b><small>{item.line}</small></div>{standard === item.id && <i><Check size={14} /></i>}</button>; })}</div><div className="money-move"><div><span><Zap size={22} /></span><p>YOUR MOVE TODAY</p><h3>{roleIdeas[role].moneyMove}</h3><small><b>Focus:</b> {currentStandard.title}.</small></div><Target size={32} /></div></div>
        </div>}

        {phase === "realize" && realizeView === "route" && <div className="screen build-screen simple-enter">
          <div className="build-side" style={{ backgroundImage: "linear-gradient(170deg, rgba(17,42,58,.99), rgba(17,42,58,.78)), url('/manus-storage/dream-life-gps-atlas_7f8f78a7.jpg')" }}><span className="level-stamp">DREAM REALIZATION</span><p>MAP THE WORK</p><h1>Choose three moves.</h1><small>Pick a card. Put it on the map.</small></div>
          <div className="build-board"><div className={`piece-tray ${guideActive ? "guide-focus" : ""}`}><p>YOUR THREE MOVES</p><div>{routePieces.map((piece) => { const Icon = piece.icon; const used = Object.values(slots).includes(piece.id); return <button key={piece.id} draggable={!used} onDragStart={() => setActivePiece(piece.id)} onClick={() => !used && setActivePiece(piece.id)} className={`route-piece ${piece.color} ${activePiece === piece.id ? "held" : ""} ${used ? "used" : ""}`}><Icon size={22} /><b>{piece.title}</b><small>{used ? "On the map" : piece.line}</small></button>; })}</div></div><div className="path-map"><div className="path-start"><span>YOUR ROLE</span><b>{role}</b></div><svg viewBox="0 0 600 370" aria-hidden="true"><path d="M60 290 C135 290 149 100 255 152 S385 324 510 86" fill="none" stroke="#FF6B35" strokeDasharray="10 11" strokeWidth="4" /><circle cx="60" cy="290" r="10" fill="#FFFDF8" stroke="#FF6B35" strokeWidth="4" /><circle cx="510" cy="86" r="10" fill="#FF6B35" stroke="#FFFDF8" strokeWidth="4" /></svg>{(["skill", "week", "score"] as SlotId[]).map((slot, index) => { const pieceId = slots[slot]; const piece = routePieces.find((item) => item.id === pieceId); const Icon = piece?.icon ?? MapPin; return <button key={slot} onDragOver={(event) => event.preventDefault()} onDrop={() => placePiece(slot)} onClick={() => placePiece(slot)} className={`map-drop drop-${index} ${piece ? "filled" : ""}`}><span>{piece ? <Icon size={20} /> : "+"}</span><div><small>{index === 0 ? "FIRST" : index === 1 ? "THEN" : "LAST"}</small><b>{piece ? piece.title : "Drop a card here"}</b>{piece && <em>{titleForPiece(piece.id, role)}</em>}</div></button>; })}<div className="path-goal"><Flag size={18} /><span>DREAM</span><b>{currentDream.title}</b></div></div><div className={`path-message ${routeIsBuilt ? "ready" : ""}`}>{routeIsBuilt ? <><Check size={18} /><p><b>Route mapped.</b> Use these moves.</p></> : <><MapPin size={18} /><p><b>Build the route.</b> Put three cards on the map.</p></>}</div></div>
        </div>}

        {phase === "realize" && realizeView === "block" && <div className="screen block-screen simple-enter">
          <div className="block-hero" style={{ backgroundImage: "linear-gradient(100deg, rgba(14,40,57,.98), rgba(14,40,57,.68)), url('/manus-storage/dream-life-gps-checkpoint_6586c299.jpg')" }}><span className="level-stamp">DREAM REALIZATION</span><p>CLEAR THE BLOCK</p><h1>What is slowing you down?</h1><small>Pick the main block.</small></div>
          <div className="block-board"><div className={`rock-list ${guideActive ? "guide-focus" : ""}`}>{blocks.map((item) => { const Icon = item.icon; return <button className={`rock-card ${block === item.id ? "picked" : ""}`} onClick={() => setBlock(item.id)} key={item.id}><span><Icon size={22} /></span><div><b>{item.title}</b><small>{item.line}</small></div>{block === item.id && <i><Check size={14} /></i>}</button>; })}</div><div className="rock-answer"><div className="answer-icon"><currentBlock.icon size={30} /></div><p>NEXT MOVE</p><h2>Move this first.</h2><b>{currentBlock.line}</b><span>{tinyWin}</span></div></div>
        </div>}

        {phase === "realize" && realizeView === "move" && <div className="screen plan-screen simple-enter">
          <div className="simple-heading plan-heading"><span className="level-stamp ink">DREAM REALIZATION</span><p>TAKE THE FIRST MOVE</p><h1>Do this first.</h1></div>
          <article className="little-plan"><div className="plan-top"><div><img src="/manus-storage/dream-life-gps-compass-logo_8c9f0a20.png" alt="" /><b>DREAM LIFE GPS</b></div><span>FIRST MOVE</span></div><div className="plan-dream"><span><Plane size={19} /></span><div><p>YOUR DREAM</p><h2>{currentDream.title}</h2><small>{currentDream.line}</small></div><Flag size={29} /></div><div className="plan-path"><p>YOUR ROUTE</p>{routePieces.map((piece, index) => { const Icon = piece.icon; const selected = slots[(["skill", "week", "score"] as SlotId[])[index]]; return <div key={piece.id} className={`plan-step ${selected ? "good" : ""}`}><span>0{index + 1}</span><Icon size={19} /><div><b>{piece.title}</b><small>{selected ? titleForPiece(selected, role) : piece.line}</small></div>{selected && <Check size={17} />}</div>; })}</div><div className="tiny-win"><span><Zap size={20} /></span><div><p>DO THIS FIRST</p><b>{tinyWin}</b></div></div><div className="plan-bottom"><p>Do this today.</p><Compass size={24} /></div></article>
          <div className={`celebrate-row ${guideActive ? "guide-focus" : ""}`}><button onClick={() => setStarted(true)}><PartyPopper size={18} /> Start my move</button><p>{started ? "Move started." : ""}</p></div>
        </div>}
      </section>
      <footer className="simple-footer"><button className="soft-button" onClick={back} disabled={phase === "build" && buildView === "dream"}><ArrowLeft size={17} /> Back</button><p><MapPin size={14} /> {phase === "build" ? "Build the dream" : "Make it real"}</p>{phase === "realize" && realizeView === "move" ? <button className="go-button" onClick={reset}>Start again<Compass size={17} /></button> : <button className="go-button" onClick={next}>{footerAction}<ArrowRight size={17} /></button>}</footer>
      <span className="sr-only" aria-live="polite">{guideActive ? `${guide.title}. ${guide.message}` : ""}</span>
    </main>
  </div>;
}

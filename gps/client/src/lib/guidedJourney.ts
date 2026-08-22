export type RoleId = "mediaBuyer" | "creativeStrategist" | "copywriter" | "designer" | "productBuilder" | "operations" | "teamLead" | "other";
export type CommitmentId = "small" | "solid" | "full";

export type RoleOption = { id: RoleId; title: string; line: string; emoji: string };
export type CommitmentOption = { id: CommitmentId; title: string; hours: string; line: string; blocks: number; days: number };
export type NextActionPlan = { roleName: string; today: string; thisWeek: string; nextCheckIn: string; impact: string; workFocus: string; clearPicture: string; weeklyResult: string; commitmentHours: string; whyNow: string; blocks: number };
export type FinalVisionScene = { title: string; scene: string; anchor: string };

export const roles: RoleOption[] = [
  { id: "mediaBuyer", title: "Media buyer", line: "I run ads and watch results.", emoji: "📈" },
  { id: "creativeStrategist", title: "Creative strategist", line: "I find strong ideas and angles.", emoji: "💡" },
  { id: "copywriter", title: "Copywriter", line: "I write words that help people act.", emoji: "✍️" },
  { id: "designer", title: "Designer", line: "I make things clear and useful to look at.", emoji: "🎨" },
  { id: "productBuilder", title: "Product builder", line: "I make products or improve them.", emoji: "🛠️" },
  { id: "operations", title: "Operations", line: "I make the work run better.", emoji: "⚙️" },
  { id: "teamLead", title: "Team lead", line: "I help people do great work together.", emoji: "🤝" },
  { id: "other", title: "Something else", line: "My work is different from these choices.", emoji: "➜" },
];

export const commitments: CommitmentOption[] = [
  { id: "small", title: "A small win", hours: "4 focused hours this week", line: "I will move this forward without overloading my week.", blocks: 4, days: 4 },
  { id: "solid", title: "A real win", hours: "8 focused hours this week", line: "I will make progress I can clearly see soon.", blocks: 8, days: 5 },
  { id: "full", title: "A major win", hours: "15 focused hours this week", line: "I will make this result my main work this week.", blocks: 15, days: 6 },
];

type ActionTemplate = { today: string; thisWeek: string; nextCheckIn: string };

const actionTemplates: Record<RoleId, ActionTemplate> = {
  mediaBuyer: {
    today: "Open your best campaign. Pick one weak spot that could bring in more leads or sales. Make that one change today.",
    thisWeek: "Spend your focus blocks checking results, fixing the weak spot, and choosing one clear test for next week.",
    nextCheckIn: "Write down which ad, audience, or offer moved the number most. Keep it or change it next week.",
  },
  creativeStrategist: {
    today: "Pick one real customer problem. Write one clear angle that speaks to it, then ask one person for feedback.",
    thisWeek: "Use your focus blocks to turn the strongest angle into a simple brief, message, or campaign idea.",
    nextCheckIn: "Keep the angle that got the clearest response. Drop the one that felt vague or weak.",
  },
  copywriter: {
    today: "Pick one offer, page, or email. Rewrite the headline so a real person can quickly see why it matters.",
    thisWeek: "Use your focus blocks to tighten the message, add one clear next step, and get feedback from a real reader.",
    nextCheckIn: "Write down which words got people to read, reply, click, or buy. Use that learning next week.",
  },
  designer: {
    today: "Pick one page, ad, or offer that should help people act. Make one change that makes the next step easier to see.",
    thisWeek: "Use your focus blocks to improve the clearest path from looking to taking action.",
    nextCheckIn: "Check what people noticed, clicked, or got stuck on. Keep the clearest design move.",
  },
  productBuilder: {
    today: "Pick one customer problem that is getting in the way. Write the smallest useful fix and take the first step on it today.",
    thisWeek: "Use your focus blocks to build, test, or show the fix to the people who need it.",
    nextCheckIn: "Write down what worked for the customer and what still needs a better answer.",
  },
  operations: {
    today: "Find one slowdown that wastes time, money, or energy. Fix the smallest useful part of it today.",
    thisWeek: "Use your focus blocks to make that work simpler, clearer, or easier to repeat.",
    nextCheckIn: "Check what got faster, cleaner, or less costly. Choose the next bottleneck.",
  },
  teamLead: {
    today: "Talk with one person about the work that matters most this week. Agree on one clear result and one next step.",
    thisWeek: "Use your focus blocks to remove a blocker, give useful feedback, and keep the team close to the goal.",
    nextCheckIn: "Ask what moved forward, what got stuck, and what needs a clear owner next week.",
  },
  other: {
    today: "Pick the one task most likely to bring in money or move your goal forward. Put time on your calendar and start it today.",
    thisWeek: "Use your focus blocks on the work closest to a customer, sale, useful result, or important promise.",
    nextCheckIn: "Write down what moved the goal forward. Do more of that next week and less of what did not help.",
  },
};

export function getRoleName(role: RoleId, otherRole: string) {
  if (role === "other" && otherRole.trim()) return otherRole.trim();
  return roles.find((item) => item.id === role)?.title ?? "your role";
}

export function getWeeklyNumbers(target: number, commitment: CommitmentId) {
  const selected = commitments.find((item) => item.id === commitment) ?? commitments[1];
  const weekly = Math.round(target / 4);
  return { weekly, focusDay: Math.round(weekly / selected.days), selected };
}

export function formatBenefitSentence(impactNames: string[]) {
  const unique = Array.from(new Set(impactNames.map((item) => item.trim()).filter(Boolean)));
  if (!unique.length) return "This supports the life you want.";
  const hasFamilyTime = unique.includes("more time with family");
  const benefits = unique.map((item) => item === "more time" && hasFamilyTime ? "more time for yourself" : item);
  const list = benefits.length === 1 ? benefits[0] : benefits.length === 2 ? `${benefits[0]} and ${benefits[1]}` : `${benefits.slice(0, -1).join(", ")}, and ${benefits.at(-1)}`;
  return `This supports the life you pictured: ${list}.`;
}

export function createNextAction(input: { role: RoleId; otherRole: string; commitment: CommitmentId; success: string; responsibility: string; weeklyResult: string; impactNames: string[]; whyNow: string }): NextActionPlan {
  const template = actionTemplates[input.role];
  const selected = commitments.find((item) => item.id === input.commitment) ?? commitments[1];
  const responsibility = input.responsibility.trim();
  const impact = formatBenefitSentence(input.impactNames);
  return {
    roleName: getRoleName(input.role, input.otherRole),
    today: template.today,
    thisWeek: `${template.thisWeek} You chose ${selected.hours.toLowerCase()}.`,
    nextCheckIn: template.nextCheckIn,
    impact,
    workFocus: responsibility ? `Your work focus: ${responsibility}` : "Your work focus: choose the result closest to your goal.",
    clearPicture: input.success.trim() || "Build the life you want.",
    weeklyResult: input.weeklyResult.trim() || responsibility || "I have moved one clear result forward.",
    commitmentHours: selected.hours,
    whyNow: input.whyNow.trim(),
    blocks: selected.blocks,
  };
}

export function createFinalChecklist(action: Pick<NextActionPlan, "today" | "thisWeek" | "nextCheckIn">) {
  return [
    { label: "TODAY", title: "Make one useful move.", action: action.today },
    { label: "THIS WEEK", title: "Keep the work moving.", action: action.thisWeek },
    { label: "NEXT CHECK-IN", title: "Look at the proof.", action: action.nextCheckIn },
  ];
}

function visionSentence(value: string, fallback: string) {
  const clean = (value.trim() || fallback.trim()).replace(/[.!?]+$/, "");
  return clean ? `${clean}.` : "";
}

function visionList(items: string[]) {
  const unique = Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
  if (unique.length === 0) return "the life I want";
  if (unique.length === 1) return unique[0];
  if (unique.length === 2) return `${unique[0]} and ${unique[1]}`;
  return `${unique.slice(0, -1).join(", ")}, and ${unique.at(-1)}`;
}

export function createFinalVisionScene(input: { success: string; benefits: string[]; future: string; whyNow: string; responsibility: string; weeklyResult: string }): FinalVisionScene {
  const result = visionSentence(input.weeklyResult, "I have moved one clear result forward");
  const future = input.future.trim();
  const responsibility = input.responsibility.trim();
  const reason = input.whyNow.trim();
  const success = input.success.trim();
  const lifeLine = future
    ? `I can feel what this opens up: ${visionSentence(future, "")}`
    : `I am making more room for ${visionList(input.benefits)}.`;
  const workLine = responsibility
    ? `I stayed locked in on the work that mattered: “${responsibility.replace(/[.!?]+$/, "").trim()}.”`
    : "I used my energy on the work I can control.";

  return {
    title: "Picture a day not far from now.",
    scene: `A day not far from now, ${result} The proof is in front of me. ${workLine} ${lifeLine}`,
    anchor: reason
      ? `Before I start, I remember: ${visionSentence(reason, "")}`
      : success
        ? `Before I start, I remember what I am building: ${visionSentence(success, "")}`
        : "Before I start, I remember: one clear move today can change what happens next.",
  };
}

export function canAdvanceStep(input: { step: string; userName: string; location: string; role: RoleId | null; otherRole: string; success: string; benefitCount: number; future: string; whyNow: string; responsibility: string; weeklyResult: string; isCleaning: boolean }) {
  if (input.isCleaning) return false;
  if (input.step === "name") return Boolean(input.userName.trim());
  if (input.step === "location") return Boolean(input.location.trim());
  if (input.step === "success") return Boolean(input.success.trim());
  if (input.step === "benefits") return input.benefitCount > 0;
  if (input.step === "future") return Boolean(input.future.trim());
  if (input.step === "whyNow") return Boolean(input.whyNow.trim());
  if (input.step === "role") return Boolean(input.role) && (input.role !== "other" || Boolean(input.otherRole.trim()));
  if (input.step === "responsibility") return Boolean(input.responsibility.trim());
  if (input.step === "commitment") return Boolean(input.weeklyResult.trim());
  return true;
}

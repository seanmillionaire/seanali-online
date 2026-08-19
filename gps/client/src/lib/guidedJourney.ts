export type RoleId = "mediaBuyer" | "creativeStrategist" | "copywriter" | "designer" | "productBuilder" | "operations" | "teamLead" | "other";
export type CommitmentId = "small" | "solid" | "full";

export type RoleOption = { id: RoleId; title: string; line: string; emoji: string };
export type CommitmentOption = { id: CommitmentId; title: string; hours: string; line: string; blocks: number; days: number };

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
  { id: "small", title: "Small start", hours: "4 focused hours each week", line: "I want to start without burning out.", blocks: 4, days: 4 },
  { id: "solid", title: "Solid push", hours: "8 focused hours each week", line: "I can make this a real part of my week.", blocks: 8, days: 5 },
  { id: "full", title: "Full push", hours: "15 focused hours each week", line: "I am ready to make this my main focus right now.", blocks: 15, days: 6 },
];

type ActionTemplate = { today: string; thisWeek: string; friday: string };

const actionTemplates: Record<RoleId, ActionTemplate> = {
  mediaBuyer: {
    today: "Open your best campaign. Pick one weak spot that could bring in more leads or sales. Make that one change today.",
    thisWeek: "Spend your focus blocks checking results, fixing the weak spot, and choosing one clear test for next week.",
    friday: "Write down which ad, audience, or offer moved the number most. Keep it or change it next week.",
  },
  creativeStrategist: {
    today: "Pick one real customer problem. Write one clear angle that speaks to it, then ask one person for feedback.",
    thisWeek: "Use your focus blocks to turn the strongest angle into a simple brief, message, or campaign idea.",
    friday: "Keep the angle that got the clearest response. Drop the one that felt vague or weak.",
  },
  copywriter: {
    today: "Pick one offer, page, or email. Rewrite the headline so a real person can quickly see why it matters.",
    thisWeek: "Use your focus blocks to tighten the message, add one clear next step, and get feedback from a real reader.",
    friday: "Write down which words got people to read, reply, click, or buy. Use that learning next week.",
  },
  designer: {
    today: "Pick one page, ad, or offer that should help people act. Make one change that makes the next step easier to see.",
    thisWeek: "Use your focus blocks to improve the clearest path from looking to taking action.",
    friday: "Check what people noticed, clicked, or got stuck on. Keep the clearest design move.",
  },
  productBuilder: {
    today: "Pick one customer problem that is getting in the way. Write the smallest useful fix and take the first step on it today.",
    thisWeek: "Use your focus blocks to build, test, or show the fix to the people who need it.",
    friday: "Write down what worked for the customer and what still needs a better answer.",
  },
  operations: {
    today: "Find one slowdown that wastes time, money, or energy. Fix the smallest useful part of it today.",
    thisWeek: "Use your focus blocks to make that work simpler, clearer, or easier to repeat.",
    friday: "Check what got faster, cleaner, or less costly. Choose the next bottleneck.",
  },
  teamLead: {
    today: "Talk with one person about the work that matters most this week. Agree on one clear result and one next step.",
    thisWeek: "Use your focus blocks to remove a blocker, give useful feedback, and keep the team close to the goal.",
    friday: "Ask what moved forward, what got stuck, and what needs a clear owner next week.",
  },
  other: {
    today: "Pick the one task most likely to bring in money or move your goal forward. Put time on your calendar and start it today.",
    thisWeek: "Use your focus blocks on the work closest to a customer, sale, useful result, or important promise.",
    friday: "Write down what moved the goal forward. Do more of that next week and less of what did not help.",
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

export function createNextAction(input: { role: RoleId; otherRole: string; commitment: CommitmentId; success: string; responsibility: string; impactNames: string[]; whyNow: string }) {
  const template = actionTemplates[input.role];
  const selected = commitments.find((item) => item.id === input.commitment) ?? commitments[1];
  const responsibility = input.responsibility.trim();
  const impact = formatBenefitSentence(input.impactNames);
  return {
    roleName: getRoleName(input.role, input.otherRole),
    today: template.today,
    thisWeek: `${template.thisWeek} You chose ${selected.hours.toLowerCase()}.`,
    friday: template.friday,
    impact,
    workFocus: responsibility ? `Your work focus: ${responsibility}` : "Your work focus: choose the result closest to your goal.",
    clearPicture: input.success.trim() || "Build the life you want.",
    whyNow: input.whyNow.trim(),
    blocks: selected.blocks,
  };
}

export function canAdvanceStep(input: { step: string; userName: string; location: string; role: RoleId | null; otherRole: string; success: string; benefitCount: number; future: string; whyNow: string; responsibility: string; isCleaning: boolean }) {
  if (input.isCleaning) return false;
  if (input.step === "name") return Boolean(input.userName.trim());
  if (input.step === "location") return Boolean(input.location.trim());
  if (input.step === "success") return Boolean(input.success.trim());
  if (input.step === "benefits") return input.benefitCount > 0;
  if (input.step === "future") return Boolean(input.future.trim());
  if (input.step === "whyNow") return Boolean(input.whyNow.trim());
  if (input.step === "role") return Boolean(input.role) && (input.role !== "other" || Boolean(input.otherRole.trim()));
  if (input.step === "responsibility") return Boolean(input.responsibility.trim());
  return true;
}

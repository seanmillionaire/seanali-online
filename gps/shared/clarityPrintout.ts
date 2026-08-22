export type DreamDaySceneId = "celebration" | "calm" | "family" | "freedom";

export type ClarityPrintoutInput = {
  success: string;
  benefits: string[];
  future: string;
  whyNow: string;
  responsibility: string;
  nearTermResult: string;
  dreamScene: DreamDaySceneId;
  dreamDetail: string;
};

export type ClarityPrintout = {
  title: string;
  opening: string;
  scene: string;
  anchor: string;
  source: "ai" | "my-words";
};

export const dreamDayScenes: { id: DreamDaySceneId; emoji: string; title: string; line: string; sceneLine: string }[] = [
  { id: "celebration", emoji: "🥂", title: "A real celebration", line: "I pause and take in a win.", sceneLine: "I am taking in a real win with the people I want around me." },
  { id: "calm", emoji: "☀️", title: "A calm morning", line: "I start my day with room to breathe.", sceneLine: "My day starts slow, my mind is clear, and I have room to breathe." },
  { id: "family", emoji: "❤️", title: "Time with my people", line: "I am fully there with the people I love.", sceneLine: "I am sharing an easy, present moment with the people I love." },
  { id: "freedom", emoji: "🕊️", title: "Freedom to choose", line: "My time feels like it belongs to me.", sceneLine: "I look at my day and get to choose where my time and energy go." },
];

function cleanSentence(value: string, fallback: string) {
  const clean = (value.trim() || fallback).replace(/[.!?]+$/, "");
  return clean ? `${clean}.` : "";
}

function list(items: string[]) {
  const unique = Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
  if (!unique.length) return "the life I want";
  if (unique.length === 1) return unique[0];
  if (unique.length === 2) return `${unique[0]} and ${unique[1]}`;
  return `${unique.slice(0, -1).join(", ")}, and ${unique.at(-1)}`;
}

export function buildClarityPrintoutFallback(input: ClarityPrintoutInput): ClarityPrintout {
  const scene = dreamDayScenes.find((item) => item.id === input.dreamScene) ?? dreamDayScenes[0];
  const success = cleanSentence(input.success, "I am building a life that feels like mine");
  const future = cleanSentence(input.future, `I have more room for ${list(input.benefits)}`);
  const workFocus = cleanSentence(input.responsibility, "I stay with the work I can control");
  const result = cleanSentence(input.nearTermResult, "I can see one clear result moving forward");
  const reason = cleanSentence(input.whyNow, "This matters to me now");
  const detail = input.dreamDetail.trim() ? ` I can see it clearly: ${cleanSentence(input.dreamDetail, "")}` : "";

  return {
    title: "A DAY I AM BUILDING",
    opening: `Not far from now, I wake up knowing this is becoming real: ${success}`,
    scene: `${scene.sceneLine}${detail} I can feel what this work has made room for: ${future}`,
    anchor: `I get there by staying close to the work that matters: ${workFocus} The next proof I can see is: ${result} I remember why I started: ${reason}`,
    source: "my-words",
  };
}

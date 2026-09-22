export type EmblemTheme = "freedom" | "family" | "health" | "wealth" | "peace" | "growth" | "purpose" | "travel";
export type EmblemScene = "celebration" | "home" | "nature" | "city" | "ocean" | "sunrise";
export type DreamLifeEmblemSpec = {
  primaryTheme: EmblemTheme;
  secondaryThemes: EmblemTheme[];
  scene: EmblemScene;
  anchor: string;
};
export type DreamLifeEmblemInput = {
  success: string;
  future: string;
  whyNow: string;
  selectedBenefits: string[];
  dreamScene: string;
  dreamDetail: string;
};

const themes: Record<EmblemTheme, { words: RegExp; anchor: string }> = {
  freedom: { words: /\b(freedom|free|own terms|my terms|choose|choice|my time)\b/i, anchor: "Life On My Terms" },
  family: { words: /\b(family|kids|children|wife|husband|partner|home|relationships?|love)\b/i, anchor: "Present For My People" },
  health: { words: /\b(body|health|healthy|strong|stronger|fit|fitness|energy)\b/i, anchor: "Strong And Well" },
  wealth: { words: /\b(money|income|abundance|wealth|wealthy|financial|business|wins at work)\b/i, anchor: "Building Lasting Wealth" },
  peace: { words: /\b(calm|peace|peaceful|present|relaxed|quiet|rest)\b/i, anchor: "Room For Peace" },
  growth: { words: /\b(growth|grow|improve|become|evolve|learn|build something)\b/i, anchor: "Room To Grow" },
  purpose: { words: /\b(calling|purpose|impact|meaningful|create|creative|creativity|respect|help others)\b/i, anchor: "Living With Purpose" },
  travel: { words: /\b(travel|world|beach|adventure|explore|exploring)\b/i, anchor: "A World To Explore" },
};

function sceneFrom(input: DreamLifeEmblemInput): EmblemScene {
  // A concrete detail takes precedence over the broad day selector.
  const detail = input.dreamDetail;
  if (/\b(beach|ocean|sea|waves?|coast)\b/i.test(detail)) return "ocean";
  if (/\b(city|skyline|apartment)\b/i.test(detail)) return "city";
  if (/\b(mountain|forest|nature|trees?|garden)\b/i.test(detail)) return "nature";
  if (/\b(home|house|kitchen)\b/i.test(detail)) return "home";
  const scenes: Record<string, EmblemScene> = { celebration: "celebration", family: "home", calm: "sunrise", freedom: "sunrise", beach: "ocean", ocean: "ocean", city: "city", home: "home", nature: "nature", sunrise: "sunrise" };
  return scenes[input.dreamScene] ?? "sunrise";
}

export function buildDreamLifeEmblemSpec(input: DreamLifeEmblemInput): DreamLifeEmblemSpec {
  // Use only destination answers. Each field votes once per theme so repeating
  // a word cannot overwhelm a person's other answers. Benefits are visible labels,
  // not legacy IDs ("calm" currently means "More respect" in the questionnaire).
  const fields = [[input.success, 3], [input.future, 3], [input.whyNow, 1], [input.dreamDetail, 2], ...input.selectedBenefits.map(value => [value, 2])] as [string, number][];
  const ranked = (Object.keys(themes) as EmblemTheme[]).map(theme => ({
    theme, score: fields.reduce((score, [value, weight]) => score + (themes[theme].words.test(value) ? weight : 0), 0),
  })).filter(item => item.score > 0).sort((a, b) => b.score - a.score);
  const fallback: EmblemTheme = input.dreamScene === "family" ? "family" : input.dreamScene === "calm" ? "peace" : "freedom";
  const primaryTheme = ranked[0]?.theme ?? fallback;
  const secondaryThemes = ranked.slice(1, 3).map(item => item.theme);
  const anchor = primaryTheme === "freedom" && secondaryThemes.includes("family") ? "Freedom For Family"
    : primaryTheme === "freedom" && secondaryThemes.includes("peace") ? "Free And Present"
    : themes[primaryTheme].anchor;
  return { primaryTheme, secondaryThemes, scene: sceneFrom(input), anchor };
}

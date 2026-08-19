export type SpeechResultLike = ArrayLike<{ transcript?: string }>;

export function mergeVoiceTranscript(base: string, results: ArrayLike<SpeechResultLike>) {
  const spoken = Array.from(results)
    .map((item) => item[0]?.transcript ?? "")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  return [base.trim(), spoken].filter(Boolean).join(" ");
}

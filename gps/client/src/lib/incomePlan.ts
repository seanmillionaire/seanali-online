/** Finds a monthly money goal stated in a user’s Dream Building words. */
export function findStatedMonthlyIncome(text: string): number | null {
  if (/\bmillion[-\s]dollar months?\b/i.test(text)) return 1_000_000;

  const match = text.match(/\$?\s*(\d[\d,]*(?:\.\d+)?)\s*(k|thousand|m|million)?(?:\s*(?:a|per))?\s*(?:month|monthly|mo\b)/i);
  if (!match) return null;

  const amount = Number(match[1].replace(/,/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const scale = match[2]?.toLowerCase();
  if (scale === "m" || scale === "million") return amount * 1_000_000;
  if (scale === "k" || scale === "thousand") return amount * 1_000;
  return amount;
}

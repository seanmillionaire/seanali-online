export type SoundCue = "select" | "advance" | "milestone" | "finale" | "payoff" | "back" | "error";

export type Tone = {
  frequency: number;
  delay: number;
  duration: number;
  volume: number;
};

export const soundCues: Record<SoundCue, Tone[]> = {
  select: [{ frequency: 392, delay: 0, duration: 0.06, volume: 0.035 }],
  advance: [{ frequency: 523.25, delay: 0, duration: 0.08, volume: 0.04 }],
  milestone: [
    { frequency: 523.25, delay: 0, duration: 0.09, volume: 0.04 },
    { frequency: 659.25, delay: 0.1, duration: 0.12, volume: 0.045 },
  ],
  finale: [
    { frequency: 523.25, delay: 0, duration: 0.1, volume: 0.04 },
    { frequency: 659.25, delay: 0.11, duration: 0.12, volume: 0.045 },
    { frequency: 783.99, delay: 0.25, duration: 0.18, volume: 0.05 },
  ],
  payoff: [
    { frequency: 659.25, delay: 0, duration: 0.1, volume: 0.04 },
    { frequency: 783.99, delay: 0.12, duration: 0.12, volume: 0.045 },
    { frequency: 1046.5, delay: 0.26, duration: 0.2, volume: 0.05 },
  ],
  back: [{ frequency: 293.66, delay: 0, duration: 0.07, volume: 0.028 }],
  error: [
    { frequency: 220, delay: 0, duration: 0.07, volume: 0.025 },
    { frequency: 196, delay: 0.09, duration: 0.09, volume: 0.026 },
  ],
};

export function canPlayProgressiveSound(soundEnabled: boolean, prefersReducedMotion: boolean) {
  return soundEnabled && !prefersReducedMotion;
}

export function cueForAdvance(fromStepIndex: number, toStepIndex: number): SoundCue {
  if (toStepIndex === 10) return "finale";
  if (toStepIndex === 6) return "milestone";
  if (toStepIndex > fromStepIndex) return "advance";
  return "select";
}

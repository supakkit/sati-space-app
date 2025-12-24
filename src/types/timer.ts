export type TimerPhase = "idle" | "warmup" | "deep" | "cooldown" | "completed";

export interface MeditationConfig {
  totalDuration: number; // in seconds
  warmupDuration: number; // in seconds (Start Music)
  cooldownDuration: number; // in seconds (End Music)
}

export interface TimerState {
  remainingTime: number; // in seconds
  elapsedTime: number; // in seconds
  phase: TimerPhase;
  isRunning: boolean;
}

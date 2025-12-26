import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MeditationConfig, TimerPhase, TimerState } from "../types/timer";

const TICK_RATE = 1000; // 1 second
const START_FADE_OUT = 5; // 5 seconds

export function useMeditationTimer(config: MeditationConfig) {
  const [state, setState] = useState<TimerState>({
    remainingTime: config.totalDuration,
    elapsedTime: 0,
    phase: "idle",
    isRunning: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePhase = (
    elapsed: number,
    cfg: MeditationConfig
  ): TimerPhase => {
    if (elapsed >= cfg.totalDuration) return "completed";
    if (elapsed < cfg.warmupDuration) return "warmup";
    if (elapsed >= cfg.totalDuration - START_FADE_OUT) return "ending";
    if (elapsed >= cfg.totalDuration - cfg.cooldownDuration) return "cooldown";
    return "deep";
  };

  const startTimer = useCallback(() => {
    if (state.phase === "completed" || state.remainingTime <= 0) {
      resetTimer();
    }
    setState((prev) => ({
      ...prev,
      isRunning: true,
      phase: prev.phase === "idle" ? "warmup" : prev.phase,
    }));
  }, []);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setState((prev) => ({ ...prev, isRunning: false }));
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setState({
      remainingTime: config.totalDuration,
      elapsedTime: 0,
      phase: "idle",
      isRunning: false,
    });
  }, [config.totalDuration]);

  const updateTimer = useCallback(() => {
    setState((prev) => {
      const newElapsed = prev.elapsedTime + 1;
      const newRemaining = prev.remainingTime - 1;

      if (newRemaining <= 0) {
        // Timer Finished
        if (timerRef.current) clearInterval(timerRef.current);
        return {
          ...prev,
          elapsedTime: config.totalDuration,
          remainingTime: 0,
          phase: "completed",
          isRunning: false,
        };
      }

      return {
        ...prev,
        elapsedTime: newElapsed,
        remainingTime: newRemaining,
        phase: calculatePhase(newElapsed, config),
      };
    });
  }, [config]);

  // Main Timer Effect
  useEffect(() => {
    if (state.isRunning && state.remainingTime > 0) {
      timerRef.current = setInterval(updateTimer, TICK_RATE);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.isRunning, config]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = useMemo(
    () => state.elapsedTime / config.totalDuration,
    [state.elapsedTime, config.totalDuration]
  );

  return {
    ...state,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
    progress,
  };
}

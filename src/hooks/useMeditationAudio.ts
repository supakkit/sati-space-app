import { AudioSource, useAudioPlayer } from "expo-audio";
import { TimerPhase } from "../types/timer";
import { BELL_SOUND } from "../constants/sound";
import { useEffect, useRef } from "react";

const MAX_MUSIC_VOLUME = 0.7;
const MAX_BELL_VOLUME = 1;

type PropsType = {
  phase: TimerPhase;
  isRunning: boolean;
  soundSource: AudioSource;
};

export function useMeditationAudio({
  phase,
  isRunning,
  soundSource,
}: PropsType) {
  const musicPlayer = useAudioPlayer(soundSource);
  const bellPlayer = useAudioPlayer(soundSource ? BELL_SOUND.asset : null);

  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMusicPreparedRef = useRef(false);
  const isRunningRef = useRef(isRunning);

  const clearFade = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  const prepareMusic = () => {
    if (!musicPlayer) return;

    clearFade();

    musicPlayer.pause();
    musicPlayer.seekTo(0);
    musicPlayer.loop = true;
    musicPlayer.volume = 0;
  };

  const playBell = async () => {
    if (!bellPlayer) return;

    bellPlayer.volume = MAX_BELL_VOLUME;
    bellPlayer.seekTo(0);
    bellPlayer.play();

    await new Promise((resolve) => setTimeout(resolve, 1500));
  };

  const fadeInMusic = () => {
    if (!musicPlayer) return;

    clearFade();

    let vol = 0;
    let started = false;
    fadeIntervalRef.current = setInterval(() => {
      if (!started) {
        musicPlayer.play();
        started = true;
      }

      vol += 0.05;
      if (vol >= MAX_MUSIC_VOLUME) {
        vol = MAX_MUSIC_VOLUME;
        clearFade();
      }

      musicPlayer.volume = vol;
    }, 500);
  };

  const fadeOutMusic = () => {
    if (!musicPlayer) return Promise.resolve();

    clearFade();

    return new Promise<void>((resolve) => {
      let vol = musicPlayer.volume;

      fadeIntervalRef.current = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0) {
          vol = 0;
          musicPlayer.volume = 0;
          clearFade();
          musicPlayer.pause();
          resolve();
        } else {
          musicPlayer.volume = vol;
        }
      }, 200);
    });
  };

  const stopMusic = () => {
    if (!musicPlayer) return;

    clearFade();
    musicPlayer.pause();
    musicPlayer.volume = 0;
    isMusicPreparedRef.current = false;
  };

  // Effect: Handle prepare music player
  useEffect(() => {
    if (!musicPlayer || !isRunning) return;
    if (isMusicPreparedRef.current) return;

    prepareMusic();
    isMusicPreparedRef.current = true;
  }, [musicPlayer, isRunning]);

  useEffect(() => {
    if (!musicPlayer) return;

    isRunningRef.current = isRunning;

    if (!isRunning) {
      clearFade();
      musicPlayer.pause();
      return;
    }
  }, [isRunning]);

  // Effect: Handle Phase Changes
  useEffect(() => {
    if (!musicPlayer || !bellPlayer) return;

    let cancelled = false;

    const run = async () => {
      if (!isRunningRef.current && phase !== "completed") {
        stopMusic();
        return;
      }

      switch (phase) {
        case "warmup":
          await playBell();

        case "cooldown":
          if (cancelled || !isRunningRef.current) return;
          fadeInMusic();
          break;

        case "deep":
          fadeOutMusic();
          break;

        case "ending":
          await fadeOutMusic();
          break;

        case "completed":
          stopMusic();
          await playBell();
          break;

        case "idle":
        default:
          stopMusic();
          break;
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [phase]);

  // Cleanup
  useEffect(() => {
    return () => {
      clearFade();
    };
  }, []);

  const resumeIfNeeded = () => {
    if (!musicPlayer) return;
    if (!isMusicPreparedRef.current) return;

    // Resume from pause (no reset, no bell)
    fadeInMusic();
  };

  return {
    resumeIfNeeded,
  };
}

import { renderHook, act } from "@testing-library/react-native";
import { useMeditationAudio } from "../useMeditationAudio";
import { AudioPlayer, AudioSource, useAudioPlayer } from "expo-audio";
import { TimerPhase } from "../../types/timer";

const createMockAudioPlayer = (): Partial<AudioPlayer> => ({
  play: jest.fn(),
  pause: jest.fn(),
  seekTo: jest.fn(),
  volume: 0,
  loop: false,
});

const mockedUseAudioPlayer = jest.mocked(useAudioPlayer);

let musicPlayer: AudioPlayer;
let bellPlayer: AudioPlayer;

const soundSource = { uri: "music.mp3" } as AudioSource;

type PropsType = {
  phase: TimerPhase;
  isRunning: boolean;
  soundSource: AudioSource;
};

describe("useMeditationAudio", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    musicPlayer = createMockAudioPlayer() as AudioPlayer;
    bellPlayer = createMockAudioPlayer() as AudioPlayer;

    mockedUseAudioPlayer
      .mockReturnValueOnce(musicPlayer)
      .mockReturnValueOnce(bellPlayer);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("prepares music when running starts", () => {
    const { result } = renderHook(() =>
      useMeditationAudio({
        phase: "warmup",
        isRunning: true,
        soundSource,
      })
    );

    expect(musicPlayer.pause).toHaveBeenCalled();
    expect(musicPlayer.seekTo).toHaveBeenCalledWith(0);
    expect(musicPlayer.loop).toBe(true);
    expect(musicPlayer.volume).toBe(0);
  });

  it("plays bell on warmup", async () => {
    renderHook(() =>
      useMeditationAudio({
        phase: "warmup",
        isRunning: true,
        soundSource,
      })
    );

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(bellPlayer.seekTo).toHaveBeenCalledWith(0);
    expect(bellPlayer.play).toHaveBeenCalled();
    expect(bellPlayer.volume).toBe(1);
  });

  it("fades in music on cooldown", () => {
    renderHook(() =>
      useMeditationAudio({
        phase: "cooldown",
        isRunning: true,
        soundSource,
      })
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(musicPlayer.play).toHaveBeenCalled();
    expect(musicPlayer.volume).toBeGreaterThan(0);
  });

  it("fades out music on ending", async () => {
    const { rerender } = renderHook(
      (props: PropsType) => useMeditationAudio(props),
      {
        initialProps: {
          phase: "cooldown",
          isRunning: true,
          soundSource,
        },
      }
    );

    const MAX_VOLUME = 0.7;
    musicPlayer.volume = MAX_VOLUME;

    rerender({
      phase: "ending",
      isRunning: true,
      soundSource,
    });

    act(() => {
      jest.advanceTimersByTime(200 * 20);
    });

    expect(musicPlayer.pause).toHaveBeenCalled();
    expect(musicPlayer.volume).toBeLessThan(MAX_VOLUME);
  });

  it("stops music and plays bell on completed", async () => {
    renderHook(() =>
      useMeditationAudio({
        phase: "completed",
        isRunning: true,
        soundSource,
      })
    );

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(musicPlayer.pause).toHaveBeenCalled();
    expect(bellPlayer.play).toHaveBeenCalled();
  });

  it("pauses music when isRunning becomes false", () => {
    const { rerender } = renderHook(
      (props: PropsType) => useMeditationAudio(props),
      {
        initialProps: {
          phase: "cooldown",
          isRunning: true,
          soundSource,
        },
      }
    );

    rerender({
      phase: "cooldown",
      isRunning: false,
      soundSource,
    });

    expect(musicPlayer.pause).toHaveBeenCalled();
  });

  it("resumes music without reset using resumeIfNeeded", () => {
    const { result } = renderHook(() =>
      useMeditationAudio({
        phase: "cooldown",
        isRunning: true,
        soundSource,
      })
    );

    act(() => {
      result.current.resumeIfNeeded();
      jest.advanceTimersByTime(500);
    });

    expect(musicPlayer.play).toHaveBeenCalled();
    expect(musicPlayer.volume).toBeGreaterThan(0);
  });
});

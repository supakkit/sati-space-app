import { renderHook, act } from '@testing-library/react-native';
import { useMeditationTimer } from '../useMeditationTimer';

const config = {
  totalDuration: 30,
  warmupDuration: 10,
  cooldownDuration: 10,
};

describe('useMeditationTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useMeditationTimer(config));

    expect(result.current.remainingTime).toBe(30);
    expect(result.current.elapsedTime).toBe(0);
    expect(result.current.phase).toBe('idle');
    expect(result.current.isRunning).toBe(false);
    expect(result.current.progress).toBe(0);
  });

  it('starts the timer and enters warmup phase', () => {
    const { result } = renderHook(() => useMeditationTimer(config));

    act(() => {
      result.current.startTimer();
    });

    expect(result.current.isRunning).toBe(true);
    expect(result.current.phase).toBe('warmup');
  });

  it('ticks every second and updates elapsed and remaining time', () => {
    const { result } = renderHook(() => useMeditationTimer(config));

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      jest.advanceTimersByTime(3 * 1000); // 3 seconds
    });

    expect(result.current.elapsedTime).toBe(3);
    expect(result.current.remainingTime).toBe(27);
  });

  it('transitions through phases correctly', () => {
    const { result } = renderHook(() => useMeditationTimer(config));

    act(() => {
      result.current.startTimer();
    });

    // After warmup (10s)
    act(() => {
      jest.advanceTimersByTime(10 * 1000);
    });
    expect(result.current.phase).toBe('deep');

    // Enter cooldown
    act(() => {
      jest.advanceTimersByTime(10 * 1000);
    });
    expect(result.current.phase).toBe('cooldown');

    // Enter ending (last 5 seconds)
    act(() => {
      jest.advanceTimersByTime(5 * 1000);
    });
    expect(result.current.phase).toBe('ending');

    // Enter completed
    act(() => {
      jest.advanceTimersByTime(5 * 1000);
    });
    expect(result.current.phase).toBe('completed');
  });

  it('pauses the timer', () => {
    const { result } = renderHook(() => useMeditationTimer(config));

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.pauseTimer();
    });

    const elapsedBeforePause = result.current.elapsedTime;

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(result.current.elapsedTime).toBe(elapsedBeforePause);
    expect(result.current.isRunning).toBe(false);
  });

  it('resumes after pause', () => {
    const { result } = renderHook(() => useMeditationTimer(config));

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    act(() => {
      result.current.pauseTimer();
    });

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.elapsedTime).toBe(4);
    expect(result.current.isRunning).toBe(true);
  });

  it('completes the timer correctly', () => {
    const { result } = renderHook(() => useMeditationTimer(config));

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      jest.advanceTimersByTime(30 * 1000);
    });

    expect(result.current.remainingTime).toBe(0);
    expect(result.current.elapsedTime).toBe(30);
    expect(result.current.phase).toBe('completed');
    expect(result.current.isRunning).toBe(false);
  });

  it('resets the timer', () => {
    const { result } = renderHook(() => useMeditationTimer(config));

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      jest.advanceTimersByTime(4 * 1000);
    });

    act(() => {
      result.current.resetTimer();
    });

    expect(result.current.remainingTime).toBe(30);
    expect(result.current.elapsedTime).toBe(0);
    expect(result.current.phase).toBe('idle');
    expect(result.current.isRunning).toBe(false);
  });

  it('formats time correctly', () => {
    const { result } = renderHook(() => useMeditationTimer(config));

    expect(result.current.formatTime(0)).toBe('0:00');
    expect(result.current.formatTime(5)).toBe('0:05');
    expect(result.current.formatTime(65)).toBe('1:05');
  });

  it('calculates progress correctly', () => {
    const { result } = renderHook(() => useMeditationTimer(config));

    act(() => {
      result.current.startTimer();
    });

    act(() => {
      jest.advanceTimersByTime(15 * 1000);
    });

    expect(result.current.progress).toBe(0.5);
  });
});

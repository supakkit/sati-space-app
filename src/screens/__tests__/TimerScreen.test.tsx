import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import TimerScreen from "../TimerScreen";

jest.mock("../../hooks/useMeditationTimer");

jest.mock("../../hooks/useMeditationAudio");

jest.mock("../../utils/storage", () => ({
  saveSession: jest.fn(),
}));

import { useMeditationTimer } from "../../hooks/useMeditationTimer";
import { useMeditationAudio } from "../../hooks/useMeditationAudio";
import { saveSession } from "../../utils/storage";
import { TimerPhase } from "../../types/timer";

jest.mock("react-native-circular-progress", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    AnimatedCircularProgress: ({ children }: any) => (
      <View>{children(() => null)}</View>
    ),
  };
});

const mockUseMeditationTimer = useMeditationTimer as jest.MockedFunction<
  typeof useMeditationTimer
>;

const mockUseMeditationAudio = useMeditationAudio as jest.MockedFunction<
  typeof useMeditationAudio
>;

const mockTotalTime = 10 * 1000;
const mockElapsedTime = 700;
const baseTimerState = {
  elapsedTime: mockElapsedTime,
  remainingTime: mockTotalTime - mockElapsedTime,
  phase: "idle" as TimerPhase,
  isRunning: false,
  startTimer: jest.fn(),
  pauseTimer: jest.fn(),
  resetTimer: jest.fn(),
  formatTime: jest.fn(() => "5:00"),
  progress: 0,
};

beforeEach(() => {
  jest.clearAllMocks();

  mockUseMeditationTimer.mockReturnValue(baseTimerState);
  mockUseMeditationAudio.mockReturnValue({
    resumeIfNeeded: jest.fn(),
  });
});

it("renders initial timer screen", () => {
  const { getByText } = render(
    <TimerScreen
      soundName="Rain"
      soundSource={null as any}
      onExit={jest.fn()}
    />
  );

  expect(getByText("Ready to Begin")).toBeTruthy();
  expect(getByText("5:00")).toBeTruthy();
  expect(getByText("Start")).toBeTruthy();
});

it("starts timer and resumes audio", () => {
  const resumeIfNeeded = jest.fn();

  mockUseMeditationAudio.mockReturnValue({ resumeIfNeeded });

  const { getByText } = render(
    <TimerScreen
      soundName="Rain"
      soundSource={null as any}
      onExit={jest.fn()}
    />
  );

  fireEvent.press(getByText("Start"));

  expect(baseTimerState.startTimer).toHaveBeenCalled();
  expect(resumeIfNeeded).toHaveBeenCalled();
});

it("shows pause button when running and pauses timer", () => {
  mockUseMeditationTimer.mockReturnValue({
    ...baseTimerState,
    isRunning: true,
    phase: "deep",
  } as any);

  const { getByText } = render(
    <TimerScreen
      soundName="Rain"
      soundSource={null as any}
      onExit={jest.fn()}
    />
  );

  fireEvent.press(getByText("Pause"));

  expect(baseTimerState.pauseTimer).toHaveBeenCalled();
});

it("saves session and exits when completed", async () => {
  const onExit = jest.fn();

  mockUseMeditationTimer.mockReturnValue({
    ...baseTimerState,
    phase: "completed",
    isRunning: false,
  } as any);

  (saveSession as jest.Mock).mockResolvedValue({});

  const { getByText } = render(
    <TimerScreen
      soundName="Rain"
      soundSource={null as any}
      onExit={onExit}
      initialConfig={{
        totalDuration: mockTotalTime,
        warmupDuration: Math.floor(mockTotalTime / 3),
        cooldownDuration: Math.floor(mockTotalTime / 3),
      }}
    />
  );

  fireEvent.press(getByText("Save Session"));

  await waitFor(() => {
    expect(saveSession).toHaveBeenCalledWith({
      duration: mockTotalTime,
      soundName: "Rain",
    });

    expect(onExit).toHaveBeenCalled();
  });
});

it("calls onExit when close button is pressed", () => {
  const onExit = jest.fn();

  const { getByTestId } = render(
    <TimerScreen soundName="Rain" soundSource={null as any} onExit={onExit} />
  );

  fireEvent.press(getByTestId("icon-close"));

  expect(onExit).toHaveBeenCalled();
});

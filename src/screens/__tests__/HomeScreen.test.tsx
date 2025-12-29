import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import HomeScreen from "../HomeScreen";

jest.mock("../TimerScreen", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return function MockTimerScreen({ onExit }: { onExit: () => void }) {
    return React.createElement(Text, { onPress: onExit }, "TIMER_SCREEN");
  };
});

jest.mock("../HistoryScreen", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return function MockHistoryScreen({ onExit }: { onExit: () => void }) {
    return React.createElement(Text, { onPress: onExit }, "HISTORY_SCREEN");
  };
});

jest.mock("../../components/SoundPickerModal", () => {
  return () => null;
});

jest.mock("../../components/SavePresetModal", () => {
  return () => null;
});

jest.mock("../../utils/storage", () => ({
  getStats: jest.fn(),
  getPresets: jest.fn(),
  savePreset: jest.fn(),
  deletePreset: jest.fn(),
}));

import { getStats, getPresets, deletePreset } from "../../utils/storage";

beforeEach(() => {
  jest.clearAllMocks();

  (getStats as jest.Mock).mockResolvedValue({
    totalSessions: 3,
    totalMinutes: 45,
  });

  (getPresets as jest.Mock).mockResolvedValue([]);
});

it("renders app title and stats", async () => {
  const { getByText, getByTestId } = render(<HomeScreen />);

  await waitFor(() => {
    expect(getByTestId("logo")).toBeTruthy();
    expect(getByText("3")).toBeTruthy();
    expect(getByText("45")).toBeTruthy();
  });
});

it("shows empty preset state", async () => {
  const { getByText } = render(<HomeScreen />);

  await waitFor(() => {
    expect(getByText("No presets saved")).toBeTruthy();
  });
});

it("renders presets from storage", async () => {
  (getPresets as jest.Mock).mockResolvedValueOnce([
    {
      id: "1",
      name: "Morning",
      totalDuration: 600,
      warmupDuration: 60,
      cooldownDuration: 60,
      soundId: "rain",
    },
  ]);

  const { getByText } = render(<HomeScreen />);

  await waitFor(() => {
    expect(getByText("Morning")).toBeTruthy();
  });
});

it("opens timer screen when Begin Session is pressed", async () => {
  const { getByText } = render(<HomeScreen />);

  await waitFor(() => {
    fireEvent.press(getByText("Begin Session"));
  });

  expect(getByText("TIMER_SCREEN")).toBeTruthy();
});

it("opens history screen when stats are pressed", async () => {
  const { getByText } = render(<HomeScreen />);

  await waitFor(() => {
    fireEvent.press(getByText("Sessions"));
  });

  expect(getByText("HISTORY_SCREEN")).toBeTruthy();
});

it("deletes preset on long press", async () => {
  (getPresets as jest.Mock).mockResolvedValueOnce([
    {
      id: "1",
      name: "Evening",
      totalDuration: 600,
      warmupDuration: 60,
      cooldownDuration: 60,
      soundId: "rain",
    },
  ]);

  const { getByText } = render(<HomeScreen />);

  await waitFor(() => {
    fireEvent(getByText("Evening"), "onLongPress");
  });

  expect(deletePreset).toHaveBeenCalledWith("1");
});

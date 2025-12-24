import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, SPACING } from "../constants/theme";
import { globalStyles } from "../styles/global-styles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { MeditationConfig, TimerPhase } from "../types/timer";
import { useMeditationTimer } from "../hooks/useMeditationTimer";

const getPhaseLabel = (phase: TimerPhase) => {
  switch (phase) {
    case "idle":
      return "Ready to Begin";
    case "warmup":
      return "Warm Up";
    case "deep":
      return "Deep Meditation";
    case "cooldown":
      return "Cool Down";
    case "completed":
      return "Session Complete";
  }
};

const getPhaseColor = (phase: TimerPhase) => {
  switch (phase) {
    case "warmup":
      return COLORS.secondary;
    case "deep":
      return COLORS.primary;
    case "cooldown":
      return COLORS.secondary;
    default:
      return COLORS.text;
  }
};

const { width } = Dimensions.get("window");

const DEFAULT_CONFIG: MeditationConfig = {
  totalDuration: 5 * 60, // 5 mins total
  warmupDuration: 60, // 1 min warmup
  cooldownDuration: 60, // 1 min cooldown
};

type PropsType = {
  initialConfig?: MeditationConfig;
  onExit: () => void;
};

export default function TimerScreen({
  initialConfig = DEFAULT_CONFIG,
  onExit,
}: PropsType) {
  const {
    remainingTime,
    phase,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
    progress,
  } = useMeditationTimer(initialConfig);

  const handleSaveSession = (totalDuration: number) => {};

  return (
    <View style={globalStyles.container}>
      {/* Exit */}
      <TouchableOpacity onPress={onExit} style={globalStyles.closeButton}>
        <Text style={globalStyles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Main Timer Display */}
      <AnimatedCircularProgress
        rotation={0}
        size={width * 0.7}
        width={4}
        fill={progress * 100} // dynamic value (0-100)
        tintColor={COLORS.primary}
        backgroundColor={COLORS.surface}
        style={styles.timerCircle}
      >
        {() => (
          <>
            <Text style={[styles.phaseText, { color: getPhaseColor(phase) }]}>
              {getPhaseLabel(phase)}
            </Text>
            <Text style={styles.timeText}>{formatTime(remainingTime)}</Text>
          </>
        )}
      </AnimatedCircularProgress>

      {/* Control */}
      <View style={styles.controls}>
        {!isRunning && phase !== "completed" && (
          <TouchableOpacity style={styles.mainButton} onPress={startTimer}>
            <Text style={styles.mainButtonText}>
              {true ? "Start" : "Resume"}
            </Text>
          </TouchableOpacity>
        )}

        {isRunning && (
          <TouchableOpacity style={styles.secondaryButton} onPress={pauseTimer}>
            <Text style={styles.secondaryButtonText}>Pause</Text>
          </TouchableOpacity>
        )}

        {phase === "completed" && (
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => handleSaveSession(initialConfig.totalDuration)}
          >
            <Text style={styles.mainButtonText}>Save Session</Text>
          </TouchableOpacity>
        )}

        {phase !== "idle" && phase !== "completed" && (
          <TouchableOpacity style={styles.resetButton} onPress={resetTimer}>
            <Text style={styles.resetButtonText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timerCircle: {
    marginBottom: SPACING.xl,
  },
  phaseText: {
    fontSize: 18,
    marginBottom: SPACING.sm,
    fontWeight: 500,
    letterSpacing: 1,
  },
  timeText: {
    fontSize: 64,
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
    fontWeight: 200,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  mainButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 30,
    minWidth: 140,
    alignItems: "center",
  },
  mainButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 600,
  },
  secondaryButton: {
    borderWidth: 1,
    backgroundColor: COLORS.textSecondary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 30,
    minWidth: 140,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 600,
  },
  resetButton: {
    padding: SPACING.md,
  },
  resetButtonText: {
    color: COLORS.textSecondary,
    fontSize: 18,
  },
});

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { COLORS, SPACING } from "../constants/theme";
import { globalStyles } from "../styles/global-styles";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { MeditationConfig, TimerPhase } from "../types/timer";
import { useMeditationTimer } from "../hooks/useMeditationTimer";
import { AudioSource } from "expo-audio";
import { useMeditationAudio } from "../hooks/useMeditationAudio";
import { Ionicons } from "@expo/vector-icons";
import { saveSession } from "../utils/storage";
import { useResponsiveScale } from "../utils/responsive";

const { scale } = useResponsiveScale();

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

const DEFAULT_CONFIG: MeditationConfig = {
  totalDuration: 5 * 60, // 5 mins total
  warmupDuration: 60, // 1 min warmup
  cooldownDuration: 60, // 1 min cooldown
};

type PropsType = {
  initialConfig?: MeditationConfig;
  soundName: string;
  soundSource: AudioSource;
  onExit: () => void;
};

export default function TimerScreen({
  initialConfig = DEFAULT_CONFIG,
  soundName,
  soundSource,
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

  // Audio Control
  const { resumeIfNeeded } = useMeditationAudio({
    phase,
    isRunning,
    soundSource,
  });

  const { width, height } = useWindowDimensions();

  return (
    <View style={globalStyles.container}>
      {/* Exit */}
      <TouchableOpacity onPress={onExit} style={globalStyles.closeButton}>
        <Ionicons name="close" size={24 * scale} color={COLORS.text} />
      </TouchableOpacity>

      <View
        style={[
          styles.timerContainer,
          { flexDirection: width > height ? "row" : "column" },
        ]}
      >
        {/* Main Timer Display */}
        <AnimatedCircularProgress
          rotation={0}
          size={Math.min(width, height) * 0.8}
          width={4 * scale}
          fill={progress * 100} // dynamic value (0-100)
          tintColor={COLORS.primary}
          backgroundColor={COLORS.surface}
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
        <View
          style={[
            styles.controls,
            { flexDirection: width > height ? "column" : "row" },
          ]}
        >
          {!isRunning && phase !== "completed" && (
            <TouchableOpacity
              style={styles.mainButton}
              onPress={() => {
                startTimer();
                resumeIfNeeded();
              }}
            >
              <Text style={styles.mainButtonText}>
                {phase === "idle" ? "Start" : "Resume"}
              </Text>
            </TouchableOpacity>
          )}

          {isRunning && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={pauseTimer}
            >
              <Text style={styles.secondaryButtonText}>Pause</Text>
            </TouchableOpacity>
          )}

          {phase === "completed" && (
            <TouchableOpacity
              style={styles.mainButton}
              onPress={async () => {
                await saveSession({
                  duration: initialConfig.totalDuration,
                  soundName,
                });
                onExit();
              }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: SPACING.xl * scale,
  },
  phaseText: {
    fontSize: 18 * scale,
    marginBottom: SPACING.sm * scale,
    fontWeight: 500,
    letterSpacing: 1 * scale,
  },
  timeText: {
    fontSize: 64 * scale,
    letterSpacing: 1 * scale,
    color: COLORS.text,
    fontVariant: ["tabular-nums"],
    fontWeight: 200,
  },
  controls: {
    alignItems: "center",
    gap: SPACING.md * scale,
  },
  mainButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md * scale,
    paddingHorizontal: SPACING.lg * scale,
    borderRadius: 30 * scale,
    minWidth: 140 * scale,
    alignItems: "center",
  },
  mainButtonText: {
    color: COLORS.background,
    fontSize: 18 * scale,
    letterSpacing: 1 * scale,
    fontWeight: 600,
  },
  secondaryButton: {
    backgroundColor: COLORS.textSecondary,
    paddingVertical: SPACING.md * scale,
    paddingHorizontal: SPACING.lg * scale,
    borderRadius: 30 * scale,
    minWidth: 140 * scale,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 18 * scale,
    letterSpacing: 1 * scale,
    fontWeight: 600,
  },
  resetButton: {
    padding: SPACING.md * scale,
  },
  resetButtonText: {
    color: COLORS.textSecondary,
    fontSize: 18 * scale,
    letterSpacing: 1 * scale,
  },
});

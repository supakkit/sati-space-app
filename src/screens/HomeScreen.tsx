import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, SPACING } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { globalStyles } from "../styles/global-styles";
import { useEffect, useState } from "react";
import TimerScreen from "./TimerScreen";
import SoundPickerModal from "../components/SoundPickerModal";
import { CUSTOM_SOUND, SOUND_LIBRARY, SoundOption } from "../constants/sound";
import SavePresetModal from "../components/SavePresetModal";
import { deletePreset, getPresets, Preset, savePreset } from "../utils/storage";
import HistoryScreen from "./HistoryScreen";

const DURATION_OPTIONS = [
  { label: "2m", value: 2 * 60 },
  { label: "5m", value: 5 * 60 },
  { label: "10m", value: 10 * 60 },
  { label: "20m", value: 20 * 60 },
  { label: "30m", value: 30 * 60 },
  { label: "45m", value: 45 * 60 },
  { label: "1h", value: 60 * 60 },
  { label: "1h15m", value: 75 * 60 },
  { label: "1h30m", value: 90 * 60 },
  { label: "2h", value: 120 * 60 },
];

export default function HomeScreen() {
  const [showTimer, setShowTimer] = useState(false);
  const [showSoundPicker, setShowSoundPicker] = useState(false);
  const [showSavePreset, setShowSavePreset] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Config Timer State
  const [totalDuration, setTotalDuration] = useState(20 * 60);
  const [warmupDuration, setWarmupDuration] = useState(5 * 60);
  const [cooldownDuration, setCooldownDuration] = useState(60);

  const [selectedSound, setSelectedSound] = useState<SoundOption>({
    ...SOUND_LIBRARY[0],
  });

  const [presets, setPresets] = useState<Preset[]>([]);

  useEffect(() => {
    loadPresets();
  }, []);

  const loadPresets = async () => {
    const presets = await getPresets();
    setPresets(presets);
  };

  const handleSavePreset = async (name: string) => {
    await savePreset({
      name,
      totalDuration,
      warmupDuration,
      cooldownDuration,
      soundId: selectedSound.id,
      customSoundUri:
        selectedSound.id === CUSTOM_SOUND
          ? selectedSound.asset ?? undefined
          : undefined,
      customSoundName:
        selectedSound.id === CUSTOM_SOUND ? selectedSound.name : undefined,
    });
    loadPresets();
  };

  const handleLoadPreset = (preset: Preset) => {
    const sound: SoundOption = { ...SOUND_LIBRARY[0] };

    if (preset.soundId === CUSTOM_SOUND) {
      sound.id = preset.soundId;
      sound.name = preset.customSoundName || CUSTOM_SOUND;
      sound.asset = preset.customSoundUri || null;
    } else {
      const { id, name, asset } = getSound(preset.soundId);
      if (id && name && asset) {
        sound.id = id;
        sound.name = name;
        sound.asset = asset;
      }
    }

    setTotalDuration(preset.totalDuration);
    setWarmupDuration(preset.warmupDuration);
    setCooldownDuration(preset.cooldownDuration);
    setSelectedSound(sound);
  };

  const getSound = (soundId: string) => {
    const sound = SOUND_LIBRARY.find((s) => s.id === soundId);
    return { ...sound };
  };

  const handleDeletePreset = async (id: string) => {
    await deletePreset(id);
    loadPresets();
  };

  const handleSetDuration = (seconds: number) => {
    setTotalDuration(seconds);
    if (seconds <= warmupDuration + cooldownDuration) {
      setWarmupDuration(60);
      setCooldownDuration(60);
    }
  };

  const handleSetWarmupDuration = () => {
    let nextDuration = 0;
    if (warmupDuration === 0) nextDuration = 60;
    else if (warmupDuration === 60) nextDuration = 3 * 60;
    else if (warmupDuration === 3 * 60) nextDuration = 5 * 60;
    else if (warmupDuration === 5 * 60) nextDuration = 10 * 60;
    else if (warmupDuration === 10 * 60) nextDuration = 15 * 60;
    else if (warmupDuration === 15 * 60) nextDuration = 30 * 60;
    else nextDuration = 0;

    if (nextDuration < totalDuration - cooldownDuration)
      setWarmupDuration(nextDuration);
    else setWarmupDuration(0);
  };

  const handleSetCooldownDuration = () => {
    let nextDuration = 0;
    if (cooldownDuration === 0) nextDuration = 60;
    else if (cooldownDuration === 60) nextDuration = 2 * 60;
    else if (cooldownDuration === 2 * 60) nextDuration = 3 * 60;
    else if (cooldownDuration === 3 * 60) nextDuration = 5 * 60;
    else nextDuration = 0;
    if (nextDuration < totalDuration - warmupDuration)
      setCooldownDuration(nextDuration);
    else setCooldownDuration(0);
  };

  if (showTimer) {
    return (
      <TimerScreen
        initialConfig={{
          totalDuration,
          warmupDuration,
          cooldownDuration,
        }}
        soundName={selectedSound.name}
        soundSource={selectedSound.asset}
        onExit={() => setShowTimer(false)}
      />
    );
  }

  if (showHistory) {
    return <HistoryScreen onClose={() => setShowHistory(false)} />;
  }

  return (
    <View style={globalStyles.container}>
      <SoundPickerModal
        visible={showSoundPicker}
        onClose={() => setShowSoundPicker(false)}
        selectedSound={selectedSound}
        onSelectSound={setSelectedSound}
      />

      <SavePresetModal
        visible={showSavePreset}
        onSave={handleSavePreset}
        onClose={() => setShowSavePreset(false)}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Sati Space</Text>
        <Text style={styles.subtitle}>Find your inner peace</Text>

        {/* Stats Section */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowHistory(true)}
        >
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>1</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Presets Selector */}
        <View style={globalStyles.section}>
          <View style={styles.presetHeader}>
            <Text style={[globalStyles.sectionTitle, styles.presetTitle]}>
              Presets
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowSavePreset(true)}
            >
              <Text style={styles.presetAddButton}>+ Save Current</Text>
            </TouchableOpacity>
          </View>

          {presets.length === 0 && (
            <View style={styles.presetNoItemContainer}>
              <Text style={styles.presetNoItemText}>No presets saved</Text>
            </View>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={globalStyles.scrollChipContainer}
          >
            {presets.map((preset) => (
              <TouchableOpacity
                key={preset.id}
                activeOpacity={0.8}
                style={[globalStyles.chip, styles.presetItem]}
                onPress={() => handleLoadPreset(preset)}
                onLongPress={() => handleDeletePreset(preset.id)}
              >
                <Text style={globalStyles.chipText}>{preset.name}</Text>
                <View style={globalStyles.chipActiveBadge} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Duration Selector */}
        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionTitle}>Duration</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={globalStyles.scrollChipContainer}
          >
            {DURATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.label}
                activeOpacity={0.8}
                style={[
                  globalStyles.chip,
                  totalDuration === option.value && globalStyles.chipActive,
                ]}
                onPress={() => handleSetDuration(option.value)}
              >
                <Text
                  style={[
                    globalStyles.chipText,
                    true && globalStyles.chipTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sound Selector */}
        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionTitle}>Ambient Sound</Text>
          <TouchableOpacity
            style={globalStyles.selectBox}
            activeOpacity={0.8}
            onPress={() => setShowSoundPicker(true)}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={[
                  globalStyles.iconCircle,
                  {
                    backgroundColor: true ? COLORS.primary : "transparent",
                    borderWidth: true ? 0 : 1,
                    borderColor: COLORS.textSecondary,
                  },
                ]}
              >
                <Ionicons
                  name="folder-open"
                  size={18}
                  color={true ? COLORS.background : COLORS.textSecondary}
                />
              </View>
              <Text numberOfLines={1} style={globalStyles.selectBoxText}>
                {selectedSound.name}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={COLORS.textSecondary}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Music Timing Config */}
        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionTitle}>Music Flow Config</Text>
          <View style={globalStyles.row}>
            {/* Start / Warmup Config */}
            <TouchableOpacity
              style={styles.infoBox}
              onPress={handleSetWarmupDuration}
            >
              <Text style={styles.infoLabel}>Start (tap)</Text>
              <Text style={styles.infoValue}>
                {Math.floor(warmupDuration / 60)}m
              </Text>
            </TouchableOpacity>

            <View style={styles.lineSpacer} />

            {/* Middle */}
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Deep Silence</Text>
              <Text style={styles.infoValue}>
                {Math.floor(
                  (totalDuration - warmupDuration - cooldownDuration) / 60
                )}
                m
              </Text>
            </View>

            <View style={styles.lineSpacer} />

            {/* End / Cooldown Config */}
            <TouchableOpacity
              style={styles.infoBox}
              onPress={handleSetCooldownDuration}
            >
              <Text style={styles.infoLabel}>End (tap)</Text>
              <Text style={styles.infoValue}>
                {Math.floor(cooldownDuration / 60)}m
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={globalStyles.section}>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => setShowTimer(true)}
          >
            <Text style={styles.startButtonText}>Begin Session</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    width: "100%",
    padding: SPACING.lg,
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: 300,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg * 2,
    letterSpacing: 2,
  },

  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 20,
    gap: SPACING.xl,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginTop: 4,
  },

  presetHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  presetTitle: {
    marginBottom: 0,
    textAlign: "left",
    marginLeft: 0,
  },
  presetAddButton: {
    color: COLORS.primary,
    fontWeight: 600,
    marginLeft: SPACING.sm,
  },
  presetNoItemContainer: {
    alignItems: "center",
  },
  presetNoItemText: {
    color: COLORS.textSecondary,
    fontStyle: "italic",
  },
  presetItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  infoBox: {
    alignItems: "center",
  },
  infoLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 500,
  },
  lineSpacer: {
    width: 20,
    height: 1,
    backgroundColor: COLORS.surface,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl * 2,
    borderRadius: 30,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: 600,
  },
});

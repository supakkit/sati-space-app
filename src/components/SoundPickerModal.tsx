import { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING } from "../constants/theme";
import { globalStyles } from "../styles/global-styles";
import { CUSTOM_SOUND, SOUND_LIBRARY } from "../constants/sound";
import { AudioSource, useAudioPlayer } from "expo-audio";

const PREVIEW_DURATION = 10; // seconds

type PropsType = {
  visible: boolean;
  onClose: () => void;
  selectedSoundId: string;
  onSelect: (id: string) => void;
  // onPickCustom: () => void;
  customSoundName?: string | null;
  customSoundSource?: AudioSource;
};

export default function SoundPickerModal({
  visible,
  onClose,
  selectedSoundId,
  onSelect,
  // onPickCustom,
  customSoundName,
  customSoundSource,
}: PropsType) {
  const [currentSoundId, setCurrentSoundId] = useState<string>(
    selectedSoundId || SOUND_LIBRARY[0].id
  );
  const [currentSound, setCurrentSound] = useState<AudioSource | null>(null);

  const player = useAudioPlayer(currentSound);

  useEffect(() => {
    if (!currentSound) return;
    player.play();
  }, [currentSound]);

  const playPreview = (soundId: string, source: AudioSource) => {
    setCurrentSound(source);
  };

  const stopPreview = () => {
    player.pause();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.headerTitle}>Select Ambient Sound</Text>
          <ScrollView style={styles.list}>
            {SOUND_LIBRARY.map((sound) => (
              <View
                key={sound.id}
                style={[
                  styles.item,
                  currentSoundId === sound.id && styles.itemActive,
                ]}
              >
                <TouchableOpacity
                  style={styles.itemMain}
                  onPress={() => {
                    playPreview(sound.id, sound.asset);
                    setCurrentSoundId(sound.id);
                  }}
                >
                  {/* {console.log("sound:", sound)} */}
                  <Ionicons
                    name={
                      currentSoundId === sound.id
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color={
                      currentSoundId === sound.id
                        ? COLORS.primary
                        : COLORS.textSecondary
                    }
                  />
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.itemText,
                      currentSoundId === sound.id && styles.itemTextActive,
                    ]}
                  >
                    {sound.name}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.divider} />

            <View
              style={[
                styles.item,
                currentSoundId === CUSTOM_SOUND && styles.itemActive,
              ]}
            >
              <TouchableOpacity
                style={styles.itemMain}
                onPress={() => {
                  stopPreview();
                }}
              >
                <Ionicons
                  name={
                    currentSoundId === CUSTOM_SOUND
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={20}
                  color={
                    currentSoundId === CUSTOM_SOUND
                      ? COLORS.primary
                      : COLORS.textSecondary
                  }
                />
                <View>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.itemText,
                      currentSoundId === CUSTOM_SOUND && styles.itemTextActive,
                    ]}
                  >
                    Custom Audio File
                  </Text>
                  {customSoundName && (
                    <Text numberOfLines={1} style={styles.subText}>
                      {customSoundName}
                    </Text>
                  )}
                </View>

                <Ionicons
                  name="folder-open-outline"
                  size={18}
                  color={COLORS.textSecondary}
                  style={{ marginLeft: "auto" }}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
          <View style={globalStyles.actions}>
            <TouchableOpacity
              style={globalStyles.buttonCancel}
              onPress={() => {
                stopPreview();
                onClose();
              }}
            >
              <Text style={globalStyles.buttonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.buttonSave}
              onPress={() => {
                onSelect(currentSoundId);
                stopPreview();
                onClose();
              }}
            >
              <Text style={globalStyles.buttonTextSave}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  dropdownContainer: {
    width: "100%",
    maxHeight: "60%",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    color: COLORS.textSecondary,
    fontSize: 18,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  list: {
    width: "100%",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
  },
  itemActive: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  itemMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  itemText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    maxWidth: 280,
  },
  itemTextActive: {
    color: COLORS.text,
    fontWeight: 600,
  },
  subText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    opacity: 0.7,
    maxWidth: 200,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: SPACING.sm,
  },
  previewButton: {
    padding: SPACING.sm,
  },
});

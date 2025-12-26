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
import { CUSTOM_SOUND, SOUND_LIBRARY, SoundOption } from "../constants/sound";
import { useAudioPlayer } from "expo-audio";
import * as DocumentPicker from "expo-document-picker";

type PropsType = {
  visible: boolean;
  onClose: () => void;
  selectedSound: SoundOption;
  onSelectSound: (sound: SoundOption) => void;
};

export default function SoundPickerModal({
  visible,
  onClose,
  selectedSound,
  onSelectSound,
}: PropsType) {
  const [currentSound, setCurrentSound] = useState<SoundOption>(selectedSound);

  const player = useAudioPlayer(currentSound.asset);

  // Effect: Handle Playing
  useEffect(() => {
    if (visible && currentSound.asset) {
      player.play();
    }
  }, [currentSound.asset, visible, player]);

  // Effect: Handle Global Cleanup
  useEffect(() => {
    return () => {
      try {
        if (player) {
          player.pause();
        }
      } catch {}
    };
  }, [visible, player]);

  const stopPreview = () => {
    if (!player) return;

    try {
      player.pause();
      player.seekTo(0);
    } catch {}
  };

  // Helper: Pick Local Audio
  const pickCustomAudio = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (res.assets && res.assets.length > 0) {
        const file = res.assets[0];
        setCurrentSound({
          id: CUSTOM_SOUND,
          name: file.name,
          asset: file.uri,
        });
      }
    } catch (err) {
      console.error("Document Picker Error", err);
    }
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
                  currentSound.id === sound.id && styles.itemActive,
                ]}
              >
                <TouchableOpacity
                  style={styles.itemMain}
                  onPress={() => {
                    setCurrentSound({
                      id: sound.id,
                      name: sound.name,
                      asset: sound.asset,
                    });
                  }}
                >
                  <Ionicons
                    name={
                      currentSound.id === sound.id
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color={
                      currentSound.id === sound.id
                        ? COLORS.primary
                        : COLORS.textSecondary
                    }
                  />
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.itemText,
                      currentSound.id === sound.id && styles.itemTextActive,
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
                currentSound.id === CUSTOM_SOUND && styles.itemActive,
              ]}
            >
              <TouchableOpacity
                style={styles.itemMain}
                onPress={() => {
                  stopPreview();
                  pickCustomAudio();
                }}
              >
                <Ionicons
                  name={
                    currentSound.id === CUSTOM_SOUND
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={20}
                  color={
                    currentSound.id === CUSTOM_SOUND
                      ? COLORS.primary
                      : COLORS.textSecondary
                  }
                />
                <View>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.itemText,
                      currentSound.id === CUSTOM_SOUND && styles.itemTextActive,
                    ]}
                  >
                    Custom Audio File
                  </Text>
                  {currentSound.id === CUSTOM_SOUND && (
                    <Text numberOfLines={1} style={styles.subText}>
                      {currentSound.name}
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
                stopPreview();
                onSelectSound(currentSound);
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

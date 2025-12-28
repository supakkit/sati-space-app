import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "../styles/global-styles";
import { COLORS, SPACING } from "../constants/theme";
import { useState } from "react";
import { useResponsiveScale } from "../utils/responsive";

const { scale } = useResponsiveScale();

type PropsType = {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
};

export default function SavePresetModal({
  visible,
  onClose,
  onSave,
}: PropsType) {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName("");
      onClose();
    }
  };
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={globalStyles.overlay}>
        <View style={styles.container}>
          <Text style={globalStyles.modalHeaderTitle}>Save Preset</Text>
          <Text style={globalStyles.modalSubtitle}>
            Give your session configuration a name
          </Text>

          <TextInput
            style={styles.input}
            placeholder="e.g. Morning Focus"
            placeholderTextColor={COLORS.textSecondary}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <View style={globalStyles.actions}>
            <TouchableOpacity
              style={globalStyles.buttonCancel}
              onPress={onClose}
            >
              <Text style={globalStyles.buttonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={globalStyles.buttonSave}
              onPress={handleSave}
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
  container: {
    width: "100%",
    maxWidth: 640,
    backgroundColor: COLORS.surface,
    padding: SPACING.lg * scale,
    borderRadius: 20 * scale,
  },
  input: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
    padding: SPACING.md * scale,
    borderRadius: 12 * scale,
    fontSize: 16 * scale,
    letterSpacing: 1 * scale,
    marginBottom: SPACING.sm * scale,
  },
});

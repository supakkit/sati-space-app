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
          <Text style={styles.title}>Save Preset</Text>
          <Text style={styles.subtitle}>
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

          <View style={styles.actions}>
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
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 20,
  },
  title: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.background,
    color: COLORS.text,
    padding: SPACING.md,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: SPACING.xl,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.md,
  },
});

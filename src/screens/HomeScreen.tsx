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

export default function HomeScreen() {
  return (
    <View style={globalStyles.container}>
      <ScrollView contentContainerStyle={globalStyles.content}>
        <Text style={globalStyles.title}>Sati Space</Text>
        <Text style={globalStyles.subtitle}>Find your inner peace</Text>

        {/* Stats Section */}
        <TouchableOpacity activeOpacity={0.8}>
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
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={styles.presetAddButton}>+ Save Current</Text>
            </TouchableOpacity>
          </View>

          {false && (
            <View style={styles.presetNoItemContainer}>
              <Text style={styles.presetNoItemText}>No presets saved</Text>
            </View>
          )}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={globalStyles.scrollChipContainer}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={[globalStyles.chip, styles.presetItem]}
            >
              <Text style={globalStyles.chipText}>Morning vibe</Text>
              <View style={globalStyles.chipActiveBadge} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[globalStyles.chip, styles.presetItem]}
            >
              <Text style={globalStyles.chipText}>Morning vibe</Text>
              <View style={globalStyles.chipActiveBadge} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[globalStyles.chip, styles.presetItem]}
            >
              <Text style={globalStyles.chipText}>Morning vibe</Text>
              <View style={globalStyles.chipActiveBadge} />
            </TouchableOpacity>
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
            <TouchableOpacity
              activeOpacity={0.8}
              style={[globalStyles.chip, true && globalStyles.chipActive]}
            >
              <Text style={[globalStyles.chipText, true && globalStyles.chipTextActive]}>
                5m
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={[globalStyles.chip]}>
              <Text style={globalStyles.chipText}>30m</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Sound Selector */}
        <View style={globalStyles.section}>
          <Text style={globalStyles.sectionTitle}>Ambient Sound</Text>
          <TouchableOpacity style={globalStyles.selectBox} activeOpacity={0.8}>
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
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Harum.
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
            <TouchableOpacity style={styles.infoBox}>
              <Text style={styles.infoLabel}>Start (tap)</Text>
              <Text style={styles.infoValue}>5m</Text>
            </TouchableOpacity>

            <View style={styles.lineSpacer} />

            {/* Middle */}
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Deep Silence</Text>
              <Text style={styles.infoValue}>5m</Text>
            </View>

            <View style={styles.lineSpacer} />

            {/* End / Cooldown Config */}
            <TouchableOpacity style={styles.infoBox}>
              <Text style={styles.infoLabel}>End (tap)</Text>
              <Text style={styles.infoValue}>1m</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={globalStyles.section}>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Begin Session</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, SPACING } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Sati Space</Text>
        <Text style={styles.subtitle}>Find your inner peace</Text>

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
        <View style={styles.section}>
          <View style={styles.presetHeader}>
            <Text style={[styles.sectionTitle, styles.presetTitle]}>
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
            contentContainerStyle={styles.scrollChipContainer}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.chip, styles.presetItem]}
            >
              <Text style={styles.chipText}>Morning vibe</Text>
              <View style={styles.chipActiveBadge} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.chip, styles.presetItem]}
            >
              <Text style={styles.chipText}>Morning vibe</Text>
              <View style={styles.chipActiveBadge} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.chip, styles.presetItem]}
            >
              <Text style={styles.chipText}>Morning vibe</Text>
              <View style={styles.chipActiveBadge} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Duration Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollChipContainer}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.chip, true && styles.chipActive]}
            >
              <Text style={[styles.chipText, true && styles.chipTextActive]}>
                5m
              </Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.8} style={[styles.chip]}>
              <Text style={styles.chipText}>30m</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Sound Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ambient Sound</Text>
          <TouchableOpacity style={styles.selectBox} activeOpacity={0.8}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View
                style={[
                  styles.iconCircle,
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
              <Text numberOfLines={1} style={styles.selectBoxText}>
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Music Flow Config</Text>
          <View style={styles.row}>
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

        <View style={styles.section}>
          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>Begin Session</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "100%",
    padding: SPACING.lg,
    alignItems: "center",
    backgroundColor: "black",
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
  section: {
    width: "100%",
    marginBottom: SPACING.xl,
    // paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  scrollChipContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  chip: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.surface,
    backgroundColor: "transparent",
    marginBottom: SPACING.sm,
  },
  chipActive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  chipTextActive: {
    color: COLORS.text,
    fontWeight: 600,
  },
  chipActiveBadge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
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

  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 16,
  },
  selectBoxText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 500,
    width: 200,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.md,
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

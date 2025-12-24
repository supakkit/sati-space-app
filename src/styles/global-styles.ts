import { StyleSheet } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

export const globalStyles = StyleSheet.create({
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

  closeButton: {
    position: 'absolute',
    top: 60,
    right: 30,
    padding: 10,
  },
  closeText: {
    color: COLORS.textSecondary,
    fontSize: 24,
  },
});

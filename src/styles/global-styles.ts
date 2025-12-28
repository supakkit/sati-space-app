import { StyleSheet } from "react-native";
import { COLORS, SPACING } from "../constants/theme";
import { useResponsiveScale } from "../utils/responsive";

const { scale } = useResponsiveScale();

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    width: "100%",
    marginBottom: SPACING.lg * scale,
  },
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 14 * scale,
    letterSpacing: 1 * scale,
    textTransform: "uppercase",
    marginBottom: SPACING.md * scale,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.md * scale,
  },

  scrollChipContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md * scale,
    paddingHorizontal: SPACING.sm * scale,
  },
  chip: {
    paddingVertical: SPACING.sm * scale,
    paddingHorizontal: SPACING.lg * scale,
    borderRadius: 20 * scale,
    borderWidth: 1 * scale,
    borderColor: COLORS.surface,
    backgroundColor: "transparent",
    marginBottom: SPACING.sm * scale,
  },
  chipActive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.primary,
  },
  chipText: {
    color: COLORS.textSecondary,
    fontSize: 16 * scale,
    letterSpacing: 1 * scale,
  },
  chipTextActive: {
    color: COLORS.text,
    fontWeight: 600,
  },
  chipActiveBadge: {
    width: 6 * scale,
    height: 6 * scale,
    borderRadius: 3 * scale,
    backgroundColor: COLORS.primary,
  },

  selectBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    padding: SPACING.md * scale,
    borderRadius: 16 * scale,
  },
  selectBoxText: {
    color: COLORS.text,
    fontSize: 16 * scale,
    letterSpacing: 1 * scale,
    fontWeight: 500,
    maxWidth: 200 * scale,
  },
  iconCircle: {
    width: 32 * scale,
    height: 32 * scale,
    borderRadius: 16 * scale,
    justifyContent: "center",
    alignItems: "center",
  },

  closeButton: {
    position: "absolute",
    top: 60,
    right: 30,
    padding: 10 * scale,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.md * scale,
    marginTop: SPACING.md * scale,
  },
  buttonCancel: {
    paddingVertical: SPACING.sm * scale,
    paddingHorizontal: SPACING.md * scale,
  },
  buttonTextCancel: {
    color: COLORS.textSecondary,
    fontSize: 16 * scale,
    letterSpacing: 1 * scale,
  },
  buttonSave: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm * scale,
    paddingHorizontal: SPACING.xl * scale,
    borderRadius: 20 * scale,
  },
  buttonTextSave: {
    color: COLORS.background,
    fontSize: 16 * scale,
    letterSpacing: 1 * scale,
    fontWeight: 600,
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.lg * scale,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalHeaderTitle: {
    color: COLORS.textSecondary,
    fontSize: 18 * scale,
    letterSpacing: 1 * scale,
    textAlign: "center",
    textTransform: "uppercase",
    paddingHorizontal: SPACING.lg * scale,
    marginBottom: SPACING.sm * scale,
  },
  modalSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14 * scale,
    letterSpacing: 1 * scale,
    textAlign: "center",
    marginBottom: SPACING.lg * scale,
  },
});

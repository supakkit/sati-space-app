import { Dimensions } from "react-native";

const DESIGN_WIDTH = 412;

export const useResponsiveScale = () => {
  const { width, height } = Dimensions.get("window");
  const isTablet = Math.min(width, height) >= 600;

  const scale =
    isTablet ? Math.min(width / DESIGN_WIDTH, 1.4) : 1;

  return { scale, isTablet };
};

import { StatusBar } from "expo-status-bar";
import HomeScreen from "./src/screens/HomeScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { COLORS } from "./src/constants/theme";
import TimerScreen from "./src/screens/TimerScreen";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      {/* <HomeScreen /> */}
      <TimerScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

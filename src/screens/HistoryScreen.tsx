import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { globalStyles } from "../styles/global-styles";
import { COLORS, SPACING } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { ContributionGraph } from "react-native-chart-kit";
import { getSessions, MeditationSession } from "../utils/storage";
import { useEffect, useState } from "react";

const { width } = Dimensions.get("window");

type PropsType = {
  onClose: () => void;
};

export default function HistoryScreen({ onClose }: PropsType) {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [commitsData, setCommitsData] = useState<
    { date: string; count: number }[]
  >([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getSessions();
    setSessions(data);

    // Only count unique active days
    const uniqueDays = new Set<string>();

    data.forEach((session) => {
      const date = new Date(session.timestamp).toISOString().split("T")[0];
      uniqueDays.add(date);
    });

    const chartData = Array.from(uniqueDays).map((date) => ({
      date: date,
      count: 1, // We only care if active or not
    }));

    setCommitsData(chartData);
  };

  const renderItem = ({ item }: { item: MeditationSession }) => {
    const date = new Date(item.timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

    return (
      <View style={styles.historyItem}>
        <View>
          <Text style={styles.historyDate}>{date}</Text>
          <Text style={styles.historySound}>{item.soundName}</Text>
        </View>
        <Text style={styles.historyDuration}>
          {Math.floor(item.duration / 60)}m
        </Text>
      </View>
    );
  };
  return (
    <View style={[globalStyles.container, { justifyContent: "flex-start" }]}>
      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {false ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No sessions yet. Start your journey!
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={globalStyles.section}>
            <Text style={globalStyles.sectionTitle}>Activity</Text>
            <ContributionGraph
              values={commitsData}
              endDate={new Date()}
              numDays={100}
              width={width - SPACING.lg * 2}
              height={220}
              chartConfig={{
                backgroundColor: COLORS.background,
                backgroundGradientFrom: COLORS.surface,
                backgroundGradientTo: COLORS.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(164, 212, 174, ${opacity})`, // primary color variant
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              style={{
                borderRadius: 16,
                justifyContent: "center",
              }}
              gutterSize={2}
              squareSize={18}
              tooltipDataAttrs={() => ({})}
            />
          </View>

          <FlatList
            data={sessions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <Text style={globalStyles.sectionTitle}>Sessions</Text>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
    paddingTop: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  title: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: 600,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 12,
  },
  historyDate: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "500",
  },
  historySound: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
    textTransform: "capitalize",
  },
  historyDuration: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.md,
    paddingTop: 0,
  },
});

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { globalStyles } from "../styles/global-styles";
import { COLORS, SPACING } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { ContributionGraph } from "react-native-chart-kit";
import { getSessions, MeditationSession } from "../utils/storage";
import { useEffect, useState } from "react";
import { useResponsiveScale } from "../utils/responsive";

const { scale } = useResponsiveScale();

type PropsType = {
  onClose: () => void;
};

export default function HistoryScreen({ onClose }: PropsType) {
  const [sessions, setSessions] = useState<MeditationSession[]>([]);
  const [commitsData, setCommitsData] = useState<
    { date: string; count: number }[]
  >([]);

  const { width, height } = useWindowDimensions();

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
          <Ionicons name="close" size={24 * scale} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {sessions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            No sessions yet. Start your journey!
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.historyContainer,
            {
              flexDirection: width > height ? "row" : "column",
            },
            width > height
              ? {
                  justifyContent: "space-evenly",
                  width: "100%",
                }
              : null,
          ]}
        >
          <View>
            <Text style={globalStyles.sectionTitle}>Activity</Text>
            <ContributionGraph
              values={commitsData}
              endDate={new Date()}
              numDays={105}
              width={(20 * 17 + SPACING.lg * 2) * scale}
              height={220 * scale}
              chartConfig={{
                backgroundColor: COLORS.background,
                backgroundGradientFrom: COLORS.surface,
                backgroundGradientTo: COLORS.surface,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(164, 212, 174, ${opacity})`, // primary color variant
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                propsForLabels: {
                  fontSize: 16 * scale,
                  fontWeight: 700,
                  letterSpacing: 1 * scale,
                },
              }}
              style={{
                borderRadius: 16 * scale,
                justifyContent: "center",
              }}
              gutterSize={2 * scale}
              squareSize={18 * scale}
              tooltipDataAttrs={() => ({})}
            />
          </View>

          <View>
            <Text style={globalStyles.sectionTitle}>Sessions</Text>
            <FlatList
              data={sessions}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              style={styles.list}
              contentContainerStyle={styles.listContent}
            />
          </View>
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
    padding: SPACING.lg * scale,
    paddingTop: SPACING.xl * scale,
    borderBottomWidth: 1 * scale,
    borderBottomColor: COLORS.surface,
  },
  title: {
    fontSize: 24 * scale,
    letterSpacing: 1 * scale,
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
    fontSize: 16 * scale,
    letterSpacing: 1 * scale,
  },
  historyContainer: {
    flex: 1,
    gap: SPACING.md * scale,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: SPACING.md * scale,
    marginBottom: SPACING.sm * scale,
    borderRadius: 12 * scale,
  },
  historyDate: {
    color: COLORS.text,
    fontSize: 16 * scale,
    fontWeight: 500,
    letterSpacing: 1 * scale,
  },
  historySound: {
    color: COLORS.textSecondary,
    fontSize: 12 * scale,
    marginTop: 2 * scale,
    textTransform: "capitalize",
    letterSpacing: 1 * scale,
  },
  historyDuration: {
    color: COLORS.primary,
    fontSize: 18 * scale,
    fontWeight: 600,
    letterSpacing: 1 * scale,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: SPACING.md * scale,
    paddingTop: 0,
    minWidth: 300 * scale,
  },
});

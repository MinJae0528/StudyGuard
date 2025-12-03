import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useStudyRecordStore } from "../../src/store/studyRecordStore";

const AllStudyRecordsPresenter: React.FC = () => {
  const { getTodayRecords } = useStudyRecordStore();
  const todayRecords = getTodayRecords().sort(
    (a, b) => b.timestamp - a.timestamp
  ); // 최신순 정렬

  // 시간을 간단한 형식으로 포맷팅
  const formatTimeShort = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  // 시간을 시:분 형식으로 포맷팅 (시간 표시용)
  const formatTimeDisplay = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // 시간을 HH:MM 형식으로 포맷팅 (시작 시간 표시용)
  const formatStartTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  if (todayRecords.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📚 전체 학습 기록</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={styles.emptyText}>아직 학습 기록이 없습니다</Text>
          <Text style={styles.emptySubtext}>공부를 시작해보세요!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 전체 학습 기록</Text>
        <Text style={styles.subtitle}>
          총 {todayRecords.length}개의 학습 기록
        </Text>
      </View>

      <FlatList
        data={todayRecords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        renderItem={({ item: record }) => (
          <View style={styles.recordItem}>
            <View style={styles.recordContent}>
              <Text
                style={styles.recordSubject}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {record.subject}
              </Text>
              <View style={styles.recordMeta}>
                <Text style={styles.recordTime}>
                  {formatTimeShort(record.duration)}
                </Text>
                <Text style={styles.recordStartTime}>
                  시작: {formatStartTime(record.timestamp)}
                </Text>
              </View>
            </View>
            <View style={styles.recordTimeDisplay}>
              <Text style={styles.timeDisplayText}>
                {formatTimeDisplay(record.duration)}
              </Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001F3F",
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: "#001F3F",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#A8C5C7",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "white",
    fontWeight: "500",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#A8C5C7",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#7A9E9F",
  },
  recordContent: {
    flex: 1,
    marginRight: 12,
    minWidth: 0,
  },
  recordSubject: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    marginBottom: 6,
  },
  recordMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  recordTime: {
    fontSize: 14,
    color: "#A8C5C7",
    fontWeight: "500",
  },
  recordStartTime: {
    fontSize: 12,
    color: "#7A9E9F",
    fontStyle: "italic",
  },
  recordTimeDisplay: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeDisplayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});

export default AllStudyRecordsPresenter;


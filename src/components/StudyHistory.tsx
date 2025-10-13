import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useStudyRecordStore } from "../store/studyRecordStore";

const StudyHistory: React.FC = () => {
  const { getTodayRecords, getTotalStudyTimeToday } = useStudyRecordStore();
  const todayRecords = getTodayRecords();
  const totalTimeToday = getTotalStudyTimeToday();

  // 시간을 시:분:초 형식으로 포맷팅
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    } else if (minutes > 0) {
      return `${minutes}분 ${secs}초`;
    } else {
      return `${secs}초`;
    }
  };

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

  if (todayRecords.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📚 나의 학습 기록</Text>
          <Text style={styles.subtitle}>오늘의 학습 현황</Text>
        </View>

        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={styles.emptyText}>아직 학습 기록이 없습니다</Text>
          <Text style={styles.emptySubtext}>공부를 시작해보세요!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📚 나의 학습 기록</Text>
        <Text style={styles.subtitle}>오늘의 학습 현황</Text>
      </View>

      {/* 오늘 총 학습 시간 */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryContent}>
          <Text style={styles.summaryLabel}>오늘 총 학습 시간</Text>
          <Text style={styles.summaryTime}>{formatTime(totalTimeToday)}</Text>
        </View>
        <View style={styles.summaryIcon}>
          <Text style={styles.iconText}>⏰</Text>
        </View>
      </View>

      {/* 학습 기록 목록 */}
      <View style={styles.recordsSection}>
        <Text style={styles.recordsTitle}>
          학습 기록 ({todayRecords.length}개)
        </Text>
        <ScrollView
          style={styles.recordsList}
          showsVerticalScrollIndicator={false}
        >
          {todayRecords.map((record, index) => (
            <View key={record.id} style={styles.recordItem}>
              <View style={styles.recordContent}>
                <Text style={styles.recordSubject}>{record.subject}</Text>
                <Text style={styles.recordTime}>
                  {formatTimeShort(record.duration)}
                </Text>
              </View>
              <View style={styles.recordTimeDisplay}>
                <Text style={styles.timeDisplayText}>
                  {formatTimeDisplay(record.duration)}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#A8C5C7",
  },
  emptyState: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#A8C5C7",
  },
  summaryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#A8C5C7",
    marginBottom: 4,
  },
  summaryTime: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  summaryIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    padding: 12,
  },
  iconText: {
    fontSize: 24,
  },
  recordsSection: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  recordsList: {
    maxHeight: 200,
  },
  recordItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    marginBottom: 8,
  },
  recordContent: {
    flex: 1,
  },
  recordSubject: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    marginBottom: 2,
  },
  recordTime: {
    fontSize: 14,
    color: "#A8C5C7",
  },
  recordTimeDisplay: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timeDisplayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});

export default StudyHistory;

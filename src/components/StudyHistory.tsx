import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useStudyRecordStore } from "../store/studyRecordStore";

const StudyHistory: React.FC = () => {
  const navigation = useNavigation();
  const { getTodayRecords, getTotalStudyTimeToday } = useStudyRecordStore();
  const todayRecords = getTodayRecords().sort(
    (a, b) => b.timestamp - a.timestamp
  ); // 최신순 정렬
  const totalTimeToday = getTotalStudyTimeToday();
  const displayedRecords = todayRecords.slice(0, 3); // 최대 3개만 표시
  const hasMoreRecords = todayRecords.length > 3;

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
      <TouchableOpacity
        style={styles.recordsSection}
        onPress={() => {
          if (hasMoreRecords || todayRecords.length > 0) {
            navigation.navigate("AllStudyRecords" as never);
          }
        }}
        activeOpacity={hasMoreRecords || todayRecords.length > 0 ? 0.7 : 1}
        disabled={todayRecords.length === 0}
      >
        <View style={styles.recordsHeader}>
          <Text style={styles.recordsTitle}>
            학습 기록 ({todayRecords.length}개)
          </Text>
          {(hasMoreRecords || todayRecords.length > 0) && (
            <Text style={styles.viewAllText}>전체 보기 →</Text>
          )}
        </View>
        <View style={styles.recordsListContainer}>
          {displayedRecords.map((record) => (
            <View key={record.id} style={styles.recordItem}>
              <View style={styles.recordContent}>
                <Text
                  style={styles.recordSubject}
                  numberOfLines={1}
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
          ))}
        </View>
      </TouchableOpacity>
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
  recordsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recordsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  viewAllText: {
    fontSize: 14,
    color: "#A8C5C7",
    fontWeight: "500",
  },
  recordsListContainer: {
    gap: 8,
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
    borderLeftWidth: 3,
    borderLeftColor: "#7A9E9F", // study-secondary 색상으로 구분선 추가
  },
  recordContent: {
    flex: 1,
    marginRight: 8, // 시간 표시와의 간격
    minWidth: 0, // 텍스트 오버플로우 방지
  },
  recordSubject: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    marginBottom: 4,
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
    paddingVertical: 6,
  },
  timeDisplayText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});

export default StudyHistory;

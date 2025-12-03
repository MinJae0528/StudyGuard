import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useStudyRecordStore } from "../../src/store/studyRecordStore";
import { useStreakStore } from "../../src/store/streakStore";
import { useGoalStore } from "../../src/store/goalStore";

const MyInfoPresenter = () => {
  const { getTotalStudyTime, records } = useStudyRecordStore();
  const { getStreakInfo } = useStreakStore();
  const { getTodayGoalProgress } = useGoalStore();

  const totalStudyTime = getTotalStudyTime();
  const streakInfo = getStreakInfo();
  const dailyGoal = getTodayGoalProgress();

  // 총 학습일 계산 (고유한 날짜 수)
  const uniqueDates = new Set(records.map((r) => r.date));
  const totalStudyDays = uniqueDates.size;

  // 시간 포맷팅
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  // 최근 학습 기록 (최근 5개)
  const recentRecords = records
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 프로필 섹션 */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.userName}>StudyGuard 사용자</Text>
          <Text style={styles.userEmail}>학습을 시작해보세요!</Text>
        </View>

        {/* 통계 카드 */}
        <View style={styles.cardContainer}>
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>📊 나의 학습 통계</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{totalStudyDays}</Text>
                <Text style={styles.statLabel}>총 학습일</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, styles.statNumberSuccess]}>
                  {formatTime(totalStudyTime)}
                </Text>
                <Text style={styles.statLabel}>총 학습시간</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, styles.statNumberWarning]}>
                  {streakInfo.currentStreak}
                </Text>
                <Text style={styles.statLabel}>연속 학습일</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 최근 활동 */}
        <View style={styles.cardContainer}>
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>🕐 최근 활동</Text>
            {recentRecords.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📚</Text>
                <Text style={styles.emptyStateText}>
                  아직 학습 기록이 없습니다
                </Text>
                <Text style={styles.emptyStateSubtext}>공부를 시작해보세요!</Text>
              </View>
            ) : (
              <View style={styles.recentRecordsContainer}>
                {recentRecords.map((record) => (
                  <View key={record.id} style={styles.recentRecordItem}>
                    <View style={styles.recentRecordContent}>
                      <Text style={styles.recentRecordSubject}>
                        {record.subject}
                      </Text>
                      <Text style={styles.recentRecordDate}>
                        {new Date(record.timestamp).toLocaleDateString("ko-KR", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                    <Text style={styles.recentRecordTime}>
                      {formatTime(record.duration)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* 오늘의 목표 진행률 */}
        {dailyGoal.goal && (
          <View style={styles.cardContainer}>
            <View style={styles.statCard}>
              <Text style={styles.cardTitle}>🎯 오늘의 목표</Text>
              <View style={styles.goalContainer}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalLabel}>일일 학습 목표</Text>
                  <Text style={styles.goalProgress}>
                    {formatTime(dailyGoal.goal.targetTime)}
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${Math.min(dailyGoal.progress, 100)}%` },
                    ]}
                  />
                </View>
                <Text style={styles.goalProgressText}>
                  {dailyGoal.progress.toFixed(0)}% 달성
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001F3F", // 남색 배경
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 160, // 바텀 탭 공간 확보
  },
  profileSection: {
    backgroundColor: "white",
    padding: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  avatarContainer: {
    width: 96,
    height: 96,
    backgroundColor: "#001F3F", // study-primary
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  cardContainer: {
    padding: 16,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#001F3F", // study-primary
  },
  statNumberSuccess: {
    color: "#5F9EA0", // study-success
  },
  statNumberWarning: {
    color: "#D4A574", // study-warning
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyStateText: {
    color: "#6B7280",
    fontSize: 14,
  },
  emptyStateSubtext: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 4,
  },
  goalContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  goalProgress: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#001F3F", // study-primary
  },
  progressBarContainer: {
    backgroundColor: "#E5E7EB",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    backgroundColor: "#001F3F", // study-primary
    height: "100%",
  },
  recentRecordsContainer: {
    gap: 8,
  },
  recentRecordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 8,
  },
  recentRecordContent: {
    flex: 1,
  },
  recentRecordSubject: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  recentRecordDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  recentRecordTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "#001F3F",
  },
  goalProgressText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
});

export default MyInfoPresenter;

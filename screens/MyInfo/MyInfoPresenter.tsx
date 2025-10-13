import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const MyInfoPresenter = () => {
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
          <Text style={styles.userName}>사용자 이름</Text>
          <Text style={styles.userEmail}>user@example.com</Text>
        </View>

        {/* 통계 카드 */}
        <View style={styles.cardContainer}>
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>📊 나의 학습 통계</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>총 학습일</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, styles.statNumberSuccess]}>
                  0h
                </Text>
                <Text style={styles.statLabel}>총 학습시간</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, styles.statNumberWarning]}>
                  0
                </Text>
                <Text style={styles.statLabel}>평균 집중도</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 최근 활동 */}
        <View style={styles.cardContainer}>
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>🕐 최근 활동</Text>
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📚</Text>
              <Text style={styles.emptyStateText}>
                아직 학습 기록이 없습니다
              </Text>
              <Text style={styles.emptyStateSubtext}>공부를 시작해보세요!</Text>
            </View>
          </View>
        </View>

        {/* 목표 설정 */}
        <View style={styles.cardContainer}>
          <View style={styles.statCard}>
            <Text style={styles.cardTitle}>🎯 학습 목표</Text>
            <View style={styles.goalContainer}>
              <View style={styles.goalHeader}>
                <Text style={styles.goalLabel}>일일 학습 목표</Text>
                <Text style={styles.goalProgress}>0 / 2시간</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: "0%" }]} />
              </View>
            </View>
            <TouchableOpacity style={styles.goalButton}>
              <Text style={styles.goalButtonText}>목표 설정하기</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  goalButton: {
    backgroundColor: "#001F3F", // study-primary
    paddingVertical: 12,
    borderRadius: 12,
  },
  goalButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
});

export default MyInfoPresenter;

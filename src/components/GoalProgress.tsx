import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useGoalStore } from "../store/goalStore";
import { useStudyRecordStore } from "../store/studyRecordStore";
import { usePremiumStore } from "../store/premiumStore";
import { NotificationService } from "../services/NotificationService";

interface GoalProgressProps {
  type: "daily" | "weekly" | "monthly";
  onPress?: () => void;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ type, onPress }) => {
  const { getTodayGoalProgress, getWeeklyGoalProgress, getMonthlyGoalProgress } = useGoalStore();
  const { getTotalStudyTimeToday, getWeeklyStats, getMonthlyStats } = useStudyRecordStore();
  const { checkPremiumStatus } = usePremiumStore();
  
  // 시연용: 프리미엄 체크 제거
  // 일일 목표는 무료, 주간/월간 목표는 프리미엄
  // const isPremium = type === "daily" ? true : checkPremiumStatus();
  const isPremium = true; // 시연용: 항상 프리미엄으로 설정
  const isPremiumFeature = type === "weekly" || type === "monthly";

  let progressData;
  let actualTime = 0;

  if (type === "daily") {
    progressData = getTodayGoalProgress();
    actualTime = getTotalStudyTimeToday();
  } else if (type === "weekly") {
    progressData = getWeeklyGoalProgress();
    const weeklyStats = getWeeklyStats(0);
    actualTime = weeklyStats.totalTime;
  } else {
    progressData = getMonthlyGoalProgress();
    const monthlyStats = getMonthlyStats(0);
    actualTime = monthlyStats.totalTime;
  }

  const achievementShown = useRef(false);

  // 목표 달성 체크 (실제 학습 시간 업데이트 시)
  useEffect(() => {
    if (progressData.goal && isPremium) {
      const { checkGoalAchievement } = useGoalStore.getState();
      checkGoalAchievement(type, actualTime);
      
      // 목표 달성 시 알림 (한 번만)
      if (progressData.achieved && !achievementShown.current && actualTime > 0) {
        achievementShown.current = true;
        
        // 로컬 알림
        NotificationService.sendImmediateNotification(
          "🎉 목표 달성!",
          `${getTypeLabel()}를 달성했습니다! 정말 대단해요!`
        );
        
        // 앱 내 알림
        Alert.alert(
          "🎉 목표 달성!",
          `${getTypeLabel()}를 달성했습니다!\n\n정말 대단해요! 계속해서 좋은 습관을 유지해보세요.`,
          [{ text: "확인", style: "default" }]
        );
      } else if (!progressData.achieved) {
        achievementShown.current = false;
      }
    }
  }, [actualTime, type, isPremium, progressData.achieved]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  const getTypeLabel = () => {
    switch (type) {
      case "daily":
        return "일일 목표";
      case "weekly":
        return "주간 목표";
      case "monthly":
        return "월간 목표";
    }
  };

  if (!isPremium) {
    return (
      <TouchableOpacity
        style={[styles.container, styles.locked]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{getTypeLabel()}</Text>
          <Text style={styles.lockBadge}>프리미엄</Text>
        </View>
        <View style={styles.lockContent}>
          <Text style={styles.lockText}>프리미엄을 구독하여 목표를 설정하세요</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (!progressData.goal) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {isPremiumFeature && !isPremium && (
              <Text style={styles.premiumIcon}>✨</Text>
            )}
            <Text style={styles.title}>{getTypeLabel()}</Text>
          </View>
          <View style={styles.headerRight}>
            {isPremiumFeature && !isPremium && (
              <Text style={styles.lockBadge}>프리미엄</Text>
            )}
            <Text style={styles.setGoalText}>목표 설정하기 →</Text>
          </View>
        </View>
        <View style={styles.emptyContent}>
          <Text style={styles.emptyText}>
            {isPremiumFeature && !isPremium
              ? "프리미엄을 구독하여 목표를 설정하세요"
              : "목표를 설정하여 동기부여를 높이세요"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  const progress = progressData.progress;
  const achieved = progressData.achieved;

  return (
    <TouchableOpacity
      style={[styles.container, achieved && styles.containerAchieved]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {isPremiumFeature && !isPremium && (
            <Text style={styles.premiumIcon}>✨</Text>
          )}
          <Text style={styles.title}>{getTypeLabel()}</Text>
        </View>
        <View style={styles.headerRight}>
          {isPremiumFeature && !isPremium && (
            <Text style={styles.lockBadge}>프리미엄</Text>
          )}
          {achieved && <Text style={styles.achievedBadge}>🎉 달성!</Text>}
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: achieved ? "#4CAF50" : "#7A9E9F",
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {progress.toFixed(0)}% ({formatTime(actualTime)} / {formatTime(progressData.goal.targetTime)})
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  containerAchieved: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.5)",
  },
  locked: {
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  premiumIcon: {
    fontSize: 16,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  lockBadge: {
    fontSize: 10,
    fontWeight: "600",
    color: "#D4A574",
    backgroundColor: "rgba(212, 165, 116, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  achievedBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4CAF50",
  },
  setGoalText: {
    fontSize: 12,
    color: "#A8C5C7",
  },
  lockContent: {
    paddingVertical: 8,
  },
  lockText: {
    fontSize: 12,
    color: "#A8C5C7",
  },
  emptyContent: {
    paddingVertical: 8,
  },
  emptyText: {
    fontSize: 12,
    color: "#A8C5C7",
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#A8C5C7",
  },
});

export default GoalProgress;


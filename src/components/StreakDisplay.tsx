import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useStreakStore } from "../store/streakStore";
import { usePremiumStore } from "../store/premiumStore";

interface StreakDisplayProps {
  onPress?: () => void;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ onPress }) => {
  const { getStreakInfo } = useStreakStore();
  const { checkPremiumStatus } = usePremiumStore();
  // 시연용: 프리미엄 체크 제거
  // const isPremium = checkPremiumStatus();
  const isPremium = true; // 시연용: 항상 프리미엄으로 설정

  const streakInfo = getStreakInfo();

  if (!isPremium) {
    return (
      <TouchableOpacity
        style={[styles.container, styles.locked]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <Text style={styles.emoji}>🔥</Text>
          <View style={styles.textContainer}>
            <Text style={styles.label}>연속 학습일</Text>
            <Text style={styles.lockText}>프리미엄 기능</Text>
          </View>
        </View>
        <Text style={styles.lockBadge}>프리미엄</Text>
      </TouchableOpacity>
    );
  }

  const { currentStreak, longestStreak, isStreakActive, daysUntilNextMilestone } = streakInfo;

  return (
    <TouchableOpacity
      style={[styles.container, isStreakActive && styles.containerActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>
          {currentStreak >= 100 ? "💯" : currentStreak >= 50 ? "🔥" : currentStreak >= 30 ? "⭐" : "✨"}
        </Text>
        <View style={styles.textContainer}>
          <Text style={styles.label}>연속 학습일</Text>
          <Text style={styles.streakNumber}>{currentStreak}일</Text>
          {longestStreak > currentStreak && (
            <Text style={styles.longestStreak}>최장: {longestStreak}일</Text>
          )}
        </View>
      </View>
      {daysUntilNextMilestone > 0 && daysUntilNextMilestone <= 10 && (
        <View style={styles.milestoneBadge}>
          <Text style={styles.milestoneText}>
            {currentStreak + daysUntilNextMilestone}일까지 {daysUntilNextMilestone}일 남음
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  containerActive: {
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 193, 7, 0.5)",
  },
  locked: {
    opacity: 0.7,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#A8C5C7",
    marginBottom: 4,
  },
  streakNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  longestStreak: {
    fontSize: 12,
    color: "#A8C5C7",
    marginTop: 2,
  },
  lockText: {
    fontSize: 12,
    color: "#A8C5C7",
    marginTop: 4,
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
  milestoneBadge: {
    backgroundColor: "rgba(255, 193, 7, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  milestoneText: {
    fontSize: 10,
    color: "#FFC107",
    fontWeight: "600",
  },
});

export default StreakDisplay;


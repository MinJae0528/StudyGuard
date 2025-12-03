import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { useGoalStore } from "../store/goalStore";
import { usePremiumStore } from "../store/premiumStore";
import { useStudyRecordStore } from "../store/studyRecordStore";

interface GoalSettingModalProps {
  visible: boolean;
  type: "daily" | "weekly" | "monthly";
  onClose: () => void;
}

const GoalSettingModal: React.FC<GoalSettingModalProps> = ({
  visible,
  type,
  onClose,
}) => {
  const { getActiveGoal, setDailyGoal, setWeeklyGoal, setMonthlyGoal } = useGoalStore();
  const { checkPremiumStatus } = usePremiumStore();
  
  // 시연용: 프리미엄 체크 제거
  // 일일 목표는 무료, 주간/월간 목표는 프리미엄
  // const isPremium = type === "daily" ? true : checkPremiumStatus();
  const isPremium = true; // 시연용: 항상 프리미엄으로 설정
  const isPremiumFeature = type === "weekly" || type === "monthly";

  const currentGoal = getActiveGoal(type);
  const [hours, setHours] = useState(
    currentGoal ? Math.floor(currentGoal.targetTime / 3600).toString() : "0"
  );
  const [minutes, setMinutes] = useState(
    currentGoal ? Math.floor((currentGoal.targetTime % 3600) / 60).toString() : "0"
  );

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

  const handleSave = () => {
    // 프리미엄 체크
    if (isPremiumFeature && !isPremium) {
      Alert.alert(
        "프리미엄 기능",
        `${getTypeLabel()} 설정은 프리미엄 기능입니다.\n프리미엄을 구독하여 이용해보세요.`
      );
      return;
    }

    const hoursNum = parseInt(hours) || 0;
    const minutesNum = parseInt(minutes) || 0;
    const totalSeconds = hoursNum * 3600 + minutesNum * 60;

    if (totalSeconds === 0) {
      Alert.alert("오류", "목표 시간을 입력해주세요.");
      return;
    }

    try {
      console.log(`[GoalSettingModal] 목표 설정 시도: type=${type}, totalSeconds=${totalSeconds}, isPremium=${isPremium}, isPremiumFeature=${isPremiumFeature}`);
      
      if (type === "daily") {
        setDailyGoal(totalSeconds);
        console.log("[GoalSettingModal] 일일 목표 설정 완료");
        // 목표 설정 후 즉시 진행률 업데이트
        const { checkGoalAchievement } = useGoalStore.getState();
        const { getTotalStudyTimeToday } = useStudyRecordStore.getState();
        setTimeout(() => {
          checkGoalAchievement("daily", getTotalStudyTimeToday());
        }, 100);
      } else if (type === "weekly") {
        console.log("[GoalSettingModal] 주간 목표 설정 시도");
        setWeeklyGoal(totalSeconds);
        console.log("[GoalSettingModal] 주간 목표 설정 완료");
        // 설정된 목표 확인
        const savedGoal = useGoalStore.getState().getActiveGoal("weekly");
        console.log("[GoalSettingModal] 저장된 주간 목표:", savedGoal);
        // 목표 설정 후 즉시 진행률 업데이트
        const { checkGoalAchievement } = useGoalStore.getState();
        const { getWeeklyStats } = useStudyRecordStore.getState();
        setTimeout(() => {
          const weeklyStats = getWeeklyStats(0);
          checkGoalAchievement("weekly", weeklyStats.totalTime);
        }, 100);
      } else {
        console.log("[GoalSettingModal] 월간 목표 설정 시도");
        setMonthlyGoal(totalSeconds);
        console.log("[GoalSettingModal] 월간 목표 설정 완료");
        // 설정된 목표 확인
        const savedGoal = useGoalStore.getState().getActiveGoal("monthly");
        console.log("[GoalSettingModal] 저장된 월간 목표:", savedGoal);
        // 목표 설정 후 즉시 진행률 업데이트
        const { checkGoalAchievement } = useGoalStore.getState();
        const { getMonthlyStats } = useStudyRecordStore.getState();
        setTimeout(() => {
          const monthlyStats = getMonthlyStats(0);
          checkGoalAchievement("monthly", monthlyStats.totalTime);
        }, 100);
      }

      Alert.alert("성공", `${getTypeLabel()}이 설정되었습니다!`);
      onClose();
    } catch (error) {
      console.error("[GoalSettingModal] 목표 설정 오류:", error);
      Alert.alert("오류", "목표 설정 중 오류가 발생했습니다.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{getTypeLabel()} 설정</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          {isPremiumFeature && !isPremium && (
            <View style={styles.premiumNotice}>
              <Text style={styles.premiumText}>
                {getTypeLabel()} 설정은 프리미엄 기능입니다.
              </Text>
            </View>
          )}

          <ScrollView style={styles.content}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>시간</Text>
              <TextInput
                style={styles.input}
                value={hours}
                onChangeText={setHours}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor="#7A9E9F"
              />
              <Text style={styles.unit}>시간</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>분</Text>
              <TextInput
                style={styles.input}
                value={minutes}
                onChangeText={setMinutes}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor="#7A9E9F"
              />
              <Text style={styles.unit}>분</Text>
            </View>

            <View style={styles.preview}>
              <Text style={styles.previewLabel}>설정할 목표</Text>
              <Text style={styles.previewValue}>
                {parseInt(hours) || 0}시간 {parseInt(minutes) || 0}분
              </Text>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButton,
                isPremiumFeature && !isPremium && styles.disabledButton,
              ]}
              onPress={handleSave}
              disabled={isPremiumFeature && !isPremium}
            >
              <Text style={styles.saveButtonText}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#001F3F",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  closeButton: {
    fontSize: 24,
    color: "#A8C5C7",
  },
  premiumNotice: {
    backgroundColor: "rgba(212, 165, 116, 0.2)",
    padding: 12,
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 8,
  },
  premiumText: {
    fontSize: 12,
    color: "#D4A574",
    textAlign: "center",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: "white",
    width: 60,
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    color: "white",
    fontSize: 18,
    marginHorizontal: 12,
  },
  unit: {
    fontSize: 16,
    color: "#A8C5C7",
    width: 40,
  },
  preview: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  previewLabel: {
    fontSize: 12,
    color: "#A8C5C7",
    marginBottom: 8,
  },
  previewValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  saveButton: {
    backgroundColor: "#7A9E9F",
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default GoalSettingModal;


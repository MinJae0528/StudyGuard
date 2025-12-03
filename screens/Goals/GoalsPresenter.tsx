import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import GoalProgress from "../../src/components/GoalProgress";
import GoalSettingModal from "../../src/components/GoalSettingModal";

const GoalsPresenter = () => {
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [goalModalType, setGoalModalType] = useState<
    "daily" | "weekly" | "monthly"
  >("daily");

  const handleGoalPress = (type: "daily" | "weekly" | "monthly") => {
    setGoalModalType(type);
    setGoalModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>목표 설정</Text>
        <Text style={styles.subtitle}>일일, 주간, 월간 목표를 설정하세요</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 일일 목표 */}
        <GoalProgress type="daily" onPress={() => handleGoalPress("daily")} />

        {/* 주간 목표 */}
        <GoalProgress type="weekly" onPress={() => handleGoalPress("weekly")} />

        {/* 월간 목표 */}
        <GoalProgress
          type="monthly"
          onPress={() => handleGoalPress("monthly")}
        />
      </ScrollView>

      {/* 목표 설정 모달 */}
      <GoalSettingModal
        visible={goalModalVisible}
        type={goalModalType}
        onClose={() => setGoalModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001F3F", // 남색 배경
  },
  header: {
    backgroundColor: "#001F3F", // study-primary
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#A8C5C7", // study-accent
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 160, // 바텀 탭 공간 확보
  },
});

export default GoalsPresenter;


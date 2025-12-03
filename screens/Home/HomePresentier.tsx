import React from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";
import StudyTimer from "../../src/components/StudyTimer";
import StreakDisplay from "../../src/components/StreakDisplay";

const HomePresenter = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>StudyGuard</Text>
        <Text style={styles.subtitle}>휴식 중독 해결을 위한 학습 관리</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 스트릭 표시 */}
        <StreakDisplay onPress={() => {}} />

        {/* 타이머 */}
        <StudyTimer />
      </ScrollView>
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

export default HomePresenter;

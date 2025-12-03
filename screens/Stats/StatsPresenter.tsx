import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import WeeklyStats from "../../src/components/WeeklyStats";
import MonthlyStats from "../../src/components/MonthlyStats";

interface StatsPresenterProps {
  selectedTab: "weekly" | "monthly";
  weekOffset: number;
  monthOffset: number;
  onTabChange: (tab: "weekly" | "monthly") => void;
  onPreviousPeriod: () => void;
  onNextPeriod: () => void;
  onResetPeriod: () => void;
}

const StatsPresenter: React.FC<StatsPresenterProps> = ({
  selectedTab,
  weekOffset,
  monthOffset,
  onTabChange,
  onPreviousPeriod,
  onNextPeriod,
  onResetPeriod,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 통계 및 리포트</Text>
        <Text style={styles.subtitle}>학습 패턴을 분석해보세요</Text>
      </View>

      {/* 탭 선택 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "weekly" && styles.tabActive]}
          onPress={() => onTabChange("weekly")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "weekly" && styles.tabTextActive,
            ]}
          >
            주간
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "monthly" && styles.tabActive]}
          onPress={() => onTabChange("monthly")}
        >
          <Text
            style={[
              styles.tabText,
              selectedTab === "monthly" && styles.tabTextActive,
            ]}
          >
            월간
          </Text>
        </TouchableOpacity>
      </View>

      {/* 기간 네비게이션 */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onPreviousPeriod}
        >
          <Text style={styles.navButtonText}>◀ 이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onResetPeriod}
        >
          <Text style={styles.navButtonText}>오늘</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navButton}
          onPress={onNextPeriod}
          disabled={
            (selectedTab === "weekly" && weekOffset >= 0) ||
            (selectedTab === "monthly" && monthOffset >= 0)
          }
        >
          <Text
            style={[
              styles.navButtonText,
              ((selectedTab === "weekly" && weekOffset >= 0) ||
                (selectedTab === "monthly" && monthOffset >= 0)) &&
                styles.navButtonTextDisabled,
            ]}
          >
            다음 ▶
          </Text>
        </TouchableOpacity>
      </View>

      {/* 통계 내용 */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {selectedTab === "weekly" ? (
          <WeeklyStats weekOffset={weekOffset} />
        ) : (
          <MonthlyStats monthOffset={monthOffset} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001F3F",
  },
  header: {
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
    color: "#A8C5C7",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: "#7A9E9F",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#A8C5C7",
  },
  tabTextActive: {
    color: "white",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  navButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
  navButtonTextDisabled: {
    color: "#7A9E9F",
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
});

export default StatsPresenter;



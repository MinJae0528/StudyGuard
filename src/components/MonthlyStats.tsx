import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useStudyRecordStore, MonthlyStats } from "../store/studyRecordStore";
import { usePremiumStore } from "../store/premiumStore";

interface MonthlyStatsProps {
  monthOffset?: number;
}

const MonthlyStatsComponent: React.FC<MonthlyStatsProps> = ({
  monthOffset = 0,
}) => {
  const { getMonthlyStats } = useStudyRecordStore();
  // 시연을 위해 프리미엄 체크 제거
  // const { checkPremiumStatus } = usePremiumStore();
  // const isPremium = checkPremiumStatus();
  const isPremium = true; // 시연용: 항상 프리미엄으로 설정

  const stats: MonthlyStats = getMonthlyStats(monthOffset);

  // 시간 포맷팅
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  // 날짜 포맷팅 (MM/DD)
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
  };

  // 월 이름 가져오기
  const getMonthName = () => {
    const now = new Date();
    const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const month = targetDate.getMonth() + 1;
    const year = targetDate.getFullYear();
    return `${year}년 ${month}월`;
  };

  // 일별 데이터 배열 생성 (주 단위로 그룹화)
  const dayData = Object.entries(stats.days)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, time]) => ({
      date,
      time,
      displayDate: formatDate(date),
      day: new Date(date).getDate(),
    }));

  // 최대 시간 계산 (그래프용)
  const maxTime = Math.max(...dayData.map((d) => d.time), 1);

  // 주 단위로 그룹화
  const weeks: { [week: number]: typeof dayData } = {};
  dayData.forEach((day) => {
    const date = new Date(day.date);
    const weekStart = new Date(date);
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    weekStart.setDate(diff);
    const weekKey = weekStart.getTime();
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = [];
    }
    weeks[weekKey].push(day);
  });

  if (!isPremium) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📅 월간 통계</Text>
          <Text style={styles.subtitle}>{getMonthName()}</Text>
        </View>
        <View style={styles.premiumLock}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockText}>프리미엄 기능입니다</Text>
          <Text style={styles.lockSubtext}>
            주간/월간 통계를 보려면 프리미엄을 구독하세요
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>📅 월간 통계</Text>
        <Text style={styles.subtitle}>{getMonthName()} ({stats.month})</Text>
      </View>

      {/* 요약 카드 */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>총 학습 시간</Text>
          <Text style={styles.summaryValue}>{formatTime(stats.totalTime)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>학습 횟수</Text>
          <Text style={styles.summaryValue}>{stats.recordCount}회</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>평균 시간</Text>
          <Text style={styles.summaryValue}>
            {formatTime(stats.averageTime)}
          </Text>
        </View>
      </View>

      {/* 일별 히트맵 */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>일별 학습 시간</Text>
        <View style={styles.heatmap}>
          {dayData.map((day) => {
            // 시간에 따른 색상 강도 계산
            const intensity = Math.min(day.time / maxTime, 1);
            const opacity = 0.3 + intensity * 0.7;
            const backgroundColor = `rgba(122, 158, 159, ${opacity})`;

            return (
              <View key={day.date} style={styles.heatmapDay}>
                <View
                  style={[
                    styles.heatmapCell,
                    { backgroundColor },
                    day.time === 0 && styles.heatmapCellEmpty,
                  ]}
                >
                  <Text style={styles.heatmapDayNumber}>{day.day}</Text>
                </View>
                {day.time > 0 && (
                  <Text style={styles.heatmapTime}>
                    {formatTime(day.time)}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* 주간 요약 */}
      <View style={styles.weeklySummary}>
        <Text style={styles.weeklySummaryTitle}>주간 요약</Text>
        {Object.entries(weeks)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([weekKey, days]) => {
            const weekTotal = days.reduce((sum, d) => sum + d.time, 0);
            const weekStart = new Date(Number(weekKey));
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);

            return (
              <View key={weekKey} style={styles.weeklyItem}>
                <Text style={styles.weeklyDate}>
                  {weekStart.getMonth() + 1}/{weekStart.getDate()} ~{" "}
                  {weekEnd.getMonth() + 1}/{weekEnd.getDate()}
                </Text>
                <Text style={styles.weeklyTime}>{formatTime(weekTotal)}</Text>
              </View>
            );
          })}
      </View>
    </ScrollView>
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
  premiumLock: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
  },
  lockIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  lockText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    marginBottom: 8,
  },
  lockSubtext: {
    fontSize: 14,
    color: "#A8C5C7",
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#A8C5C7",
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  chartContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 16,
  },
  heatmap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  heatmapDay: {
    width: "14%",
    aspectRatio: 1,
    margin: "0.5%",
    alignItems: "center",
    justifyContent: "center",
  },
  heatmapCell: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  heatmapCellEmpty: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  heatmapDayNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  heatmapTime: {
    fontSize: 8,
    color: "#A8C5C7",
    marginTop: 2,
  },
  weeklySummary: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  weeklySummaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
  },
  weeklyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  weeklyDate: {
    fontSize: 14,
    color: "#A8C5C7",
  },
  weeklyTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
});

export default MonthlyStatsComponent;



import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useStudyRecordStore, WeeklyStats } from "../store/studyRecordStore";
import { usePremiumStore } from "../store/premiumStore";

interface WeeklyStatsProps {
  weekOffset?: number;
}

const WeeklyStatsComponent: React.FC<WeeklyStatsProps> = ({
  weekOffset = 0,
}) => {
  const { getWeeklyStats, getStatsByDateRange } = useStudyRecordStore();
  // 시연을 위해 프리미엄 체크 제거
  // const { checkPremiumStatus } = usePremiumStore();
  // const isPremium = checkPremiumStatus();
  const isPremium = true; // 시연용: 항상 프리미엄으로 설정

  // 주의 날짜 범위 계산 (일요일부터 토요일까지)
  const getWeekRange = () => {
    const now = new Date();
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + weekOffset * 7);

    // 현재 날짜의 요일 (0=일요일, 1=월요일, ..., 6=토요일)
    const dayOfWeek = targetDate.getDay();

    // 일요일까지의 차이 계산
    // 일요일(0)이면 0일, 월요일(1)이면 -1일, 화요일(2)이면 -2일, ..., 토요일(6)이면 -6일
    const daysToSunday = -dayOfWeek;

    const sunday = new Date(targetDate);
    sunday.setDate(targetDate.getDate() + daysToSunday);
    sunday.setHours(0, 0, 0, 0);

    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    return {
      start: sunday, // 일요일
      end: saturday, // 토요일
    };
  };

  const weekRange = getWeekRange();
  
  // 일요일부터 토요일까지의 통계 데이터 가져오기
  const rangeStats = getStatsByDateRange(weekRange.start, weekRange.end);
  
  // 주 번호 계산 (표시용)
  const stats: WeeklyStats = getWeeklyStats(weekOffset);

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

  // 요일 가져오기
  const getDayName = (dateStr: string): string => {
    const date = new Date(dateStr);
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return days[date.getDay()];
  };

  const weekStartStr = `${
    weekRange.start.getMonth() + 1
  }/${weekRange.start.getDate()}`;
  const weekEndStr = `${
    weekRange.end.getMonth() + 1
  }/${weekRange.end.getDate()}`;

  // 일별 데이터 배열 생성 (일요일부터 토요일까지 순서대로)
  const dayData = [];
  const currentDate = new Date(weekRange.start); // 일요일부터 시작
  for (let i = 0; i < 7; i++) {
    // 로컬 시간 기준으로 날짜 문자열 생성 (UTC 변환 방지)
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const dateStr = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const time = rangeStats.days[dateStr] || 0;
    dayData.push({
      date: dateStr,
      time,
      displayDate: formatDate(dateStr),
      dayName: getDayName(dateStr),
    });
    // 다음 날로 이동
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // 최대 시간 계산 (그래프용)
  const maxTime = Math.max(...dayData.map((d) => d.time), 1);

  if (!isPremium) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📊 주간 통계</Text>
          <Text style={styles.subtitle}>
            {weekStartStr} ~ {weekEndStr}
          </Text>
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 주간 통계</Text>
        <Text style={styles.subtitle}>
          {weekStartStr} ~ {weekEndStr} ({stats.week})
        </Text>
      </View>

      {/* 요약 카드 */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>총 학습 시간</Text>
          <Text style={styles.summaryValue}>{formatTime(rangeStats.totalTime)}</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>학습 횟수</Text>
          <Text style={styles.summaryValue}>{rangeStats.recordCount}회</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>평균 시간</Text>
          <Text style={styles.summaryValue}>
            {formatTime(rangeStats.averageTime)}
          </Text>
        </View>
      </View>

      {/* 일별 그래프 */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>일별 학습 시간</Text>
        <View style={styles.chart}>
          {dayData.map((day, index) => (
            <View key={day.date} style={styles.chartBarContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.chartBar,
                    {
                      height: `${(day.time / maxTime) * 100}%`,
                      minHeight: day.time > 0 ? 8 : 0,
                    },
                  ]}
                />
              </View>
              <Text style={styles.barLabel}>{day.dayName}</Text>
              <Text style={styles.barTime}>
                {day.time > 0 ? formatTime(day.time) : "-"}
              </Text>
            </View>
          ))}
        </View>
      </View>
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
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 16,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 200,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  barWrapper: {
    width: "80%",
    height: 150,
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  chartBar: {
    width: "100%",
    backgroundColor: "#7A9E9F",
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    color: "#A8C5C7",
    marginBottom: 4,
  },
  barTime: {
    fontSize: 10,
    color: "white",
    textAlign: "center",
  },
});

export default WeeklyStatsComponent;

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

  // 해당 월의 첫 날과 마지막 날 계산
  const now = new Date();
  const targetDate = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // 첫 날의 요일 계산 (0=일요일, 1=월요일, ...)
  const firstDay = new Date(year, month, 1);
  const firstDayOfWeek = firstDay.getDay(); // 0(일) ~ 6(토)
  
  // 일별 데이터 배열 생성 (해당 월의 날짜만)
  const dayData = [];
  
  // 첫 주의 빈 칸 추가 (일요일부터 시작하도록)
  // 예: 첫 날이 수요일(3)이면 일요일(0)부터 수요일(3)까지 빈 칸 3개 추가
  for (let i = 0; i < firstDayOfWeek; i++) {
    dayData.push({
      date: "",
      time: 0,
      displayDate: "",
      day: 0,
      isEmpty: true,
    });
  }
  
  // 해당 월의 날짜들 추가
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDate = new Date(year, month, i);
    // 로컬 시간대를 고려하여 날짜 문자열 생성 (toISOString()은 UTC로 변환하므로 문제 발생)
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
    const time = stats.days[dateStr] || 0;
    
    dayData.push({
      date: dateStr,
      time,
      displayDate: formatDate(dateStr),
      day: i,
      isEmpty: false,
    });
  }

  // 최대 시간 계산 (그래프용)
  const maxTime = Math.max(...dayData.map((d) => d.time), 1);

  // 주 단위로 그룹화 (해당 월의 날짜만 포함)
  const weeks: { [week: number]: typeof dayData } = {};
  dayData.forEach((day) => {
    // 빈 칸은 제외
    if (day.isEmpty || !day.date) {
      return;
    }
    
    // 날짜가 해당 월에 속하는지 확인
    const date = new Date(day.date);
    if (date.getMonth() !== month) {
      return;
    }
    
    // 일요일부터 토요일까지의 주 범위 계산
    const dayOfWeek = date.getDay();
    const daysToSunday = -dayOfWeek;
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() + daysToSunday);
    weekStart.setHours(0, 0, 0, 0);
    
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
        {/* 요일 헤더 */}
        <View style={styles.weekdayHeader}>
          {["일", "월", "화", "수", "목", "금", "토"].map((dayName) => (
            <View key={dayName} style={styles.weekdayHeaderCell}>
              <Text style={styles.weekdayHeaderText}>{dayName}</Text>
            </View>
          ))}
        </View>
        <View style={styles.heatmap}>
          {dayData.map((day, index) => {
            // 빈 칸인 경우
            if (day.isEmpty) {
              return (
                <View key={`empty-${index}`} style={styles.heatmapDay}>
                  <View style={styles.heatmapCellEmpty} />
                </View>
              );
            }
            
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
            // 해당 월의 날짜만 필터링
            const monthDays = days.filter((d) => {
              if (!d.date) return false;
              const date = new Date(d.date);
              return date.getMonth() === month;
            });
            
            if (monthDays.length === 0) {
              return null;
            }
            
            const weekTotal = monthDays.reduce((sum, d) => sum + d.time, 0);
            
            // 해당 월의 범위
            const monthStart = new Date(year, month, 1);
            const monthEnd = new Date(year, month + 1, 0);
            monthEnd.setHours(23, 59, 59, 999);
            
            // 주의 시작일 계산 (일요일)
            const weekStart = new Date(Number(weekKey));
            
            // 해당 월의 날짜 중 가장 빠른 날짜와 가장 늦은 날짜 찾기
            const datesInMonth = monthDays
              .map((d) => new Date(d.date))
              .filter((d) => !isNaN(d.getTime()))
              .sort((a, b) => a.getTime() - b.getTime());
            
            if (datesInMonth.length === 0) {
              return null;
            }
            
            const actualStart = datesInMonth[0];
            const actualEnd = datesInMonth[datesInMonth.length - 1];
            
            // 유효한 날짜인지 확인
            if (isNaN(actualStart.getTime()) || isNaN(actualEnd.getTime())) {
              return null;
            }

            return (
              <View key={weekKey} style={styles.weeklyItem}>
                <Text style={styles.weeklyDate}>
                  {actualStart.getMonth() + 1}/{actualStart.getDate()} ~{" "}
                  {actualEnd.getMonth() + 1}/{actualEnd.getDate()}
                </Text>
                <Text style={styles.weeklyTime}>{formatTime(weekTotal)}</Text>
              </View>
            );
          })
          .filter((item) => item !== null)}
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
  weekdayHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekdayHeaderCell: {
    flex: 1,
    alignItems: "center",
  },
  weekdayHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A8C5C7",
  },
  heatmap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  heatmapDay: {
    width: "14.28%", // 100% / 7 = 정확히 7개씩 한 줄
    aspectRatio: 1,
    marginBottom: 8, // 하단 여백만
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



import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  useStudyRecordStore,
  WeeklyStats,
  MonthlyStats,
} from "../store/studyRecordStore";

type ReportType = "weekly" | "monthly";

const StatisticsReport: React.FC = () => {
  const [reportType, setReportType] = useState<ReportType>("weekly");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const { getWeeklyStats, getMonthlyStats } = useStudyRecordStore();

  const weeklyStats = getWeeklyStats(weekOffset);
  const monthlyStats = getMonthlyStats(monthOffset);

  // 시간 포맷팅 (초를 시:분 형식으로)
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  // 시간 포맷팅 (간단한 형식)
  const formatTimeShort = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // 주간 리포트 렌더링
  const renderWeeklyReport = (stats: WeeklyStats) => {
    const weekDates = Object.keys(stats.days).sort();
    const weekStart = weekDates[0] ? new Date(weekDates[0]) : new Date();
    const weekEnd = weekDates[weekDates.length - 1]
      ? new Date(weekDates[weekDates.length - 1])
      : new Date();

    return (
      <View style={styles.reportContainer}>
        {/* 주간 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setWeekOffset(weekOffset - 1)}
            style={styles.navButton}
          >
            <Text style={styles.navButtonText}>← 이전 주</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.periodTitle}>
              {weekStart.toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
              })}{" "}
              -{" "}
              {weekEnd.toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
              })}
            </Text>
            <Text style={styles.periodSubtitle}>{stats.week}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setWeekOffset(weekOffset + 1)}
            style={styles.navButton}
            disabled={weekOffset >= 0}
          >
            <Text
              style={[
                styles.navButtonText,
                weekOffset >= 0 && styles.navButtonDisabled,
              ]}
            >
              다음 주 →
            </Text>
          </TouchableOpacity>
        </View>

        {/* 주간 요약 통계 */}
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>총 학습 시간</Text>
            <Text style={styles.summaryValue}>
              {formatTime(stats.totalTime)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>학습 세션</Text>
            <Text style={styles.summaryValue}>{stats.recordCount}회</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>평균 학습 시간</Text>
            <Text style={styles.summaryValue}>
              {formatTime(stats.averageTime)}
            </Text>
          </View>
        </View>

        {/* 일별 상세 통계 */}
        <View style={styles.dailyStatsContainer}>
          <Text style={styles.sectionTitle}>일별 학습 시간</Text>
          {weekDates.map((date) => {
            const dayDate = new Date(date);
            const dayName = dayDate.toLocaleDateString("ko-KR", {
              weekday: "short",
            });
            const dayNumber = dayDate.getDate();
            const time = stats.days[date];

            return (
              <View key={date} style={styles.dailyStatItem}>
                <View style={styles.dailyStatLeft}>
                  <Text style={styles.dailyStatDay}>{dayName}</Text>
                  <Text style={styles.dailyStatDate}>{dayNumber}일</Text>
                </View>
                <View style={styles.dailyStatRight}>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${Math.min(
                            (time / (stats.totalTime || 1)) * 100,
                            100
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.dailyStatTime}>
                    {formatTimeShort(time)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // 월간 리포트 렌더링
  const renderMonthlyReport = (stats: MonthlyStats) => {
    const monthDate = new Date(stats.month + "-01");
    const monthName = monthDate.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
    });

    // 가장 많이 학습한 날 찾기
    const maxDayTime = Math.max(...Object.values(stats.days));
    const maxDay = Object.keys(stats.days).find(
      (date) => stats.days[date] === maxDayTime
    );

    return (
      <View style={styles.reportContainer}>
        {/* 월간 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => setMonthOffset(monthOffset - 1)}
            style={styles.navButton}
          >
            <Text style={styles.navButtonText}>← 이전 달</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.periodTitle}>{monthName}</Text>
            <Text style={styles.periodSubtitle}>{stats.month}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setMonthOffset(monthOffset + 1)}
            style={styles.navButton}
            disabled={monthOffset >= 0}
          >
            <Text
              style={[
                styles.navButtonText,
                monthOffset >= 0 && styles.navButtonDisabled,
              ]}
            >
              다음 달 →
            </Text>
          </TouchableOpacity>
        </View>

        {/* 월간 요약 통계 */}
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>총 학습 시간</Text>
            <Text style={styles.summaryValue}>
              {formatTime(stats.totalTime)}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>학습 세션</Text>
            <Text style={styles.summaryValue}>{stats.recordCount}회</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>평균 학습 시간</Text>
            <Text style={styles.summaryValue}>
              {formatTime(stats.averageTime)}
            </Text>
          </View>
        </View>

        {/* 월간 인사이트 */}
        {stats.totalTime > 0 && (
          <View style={styles.insightsContainer}>
            <Text style={styles.sectionTitle}>이번 달 인사이트</Text>
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>가장 많이 학습한 날</Text>
              <Text style={styles.insightValue}>
                {maxDay
                  ? new Date(maxDay).toLocaleDateString("ko-KR", {
                      month: "long",
                      day: "numeric",
                    })
                  : "-"}
              </Text>
              <Text style={styles.insightSubValue}>
                {maxDay ? formatTime(stats.days[maxDay]) : ""}
              </Text>
            </View>
            <View style={styles.insightItem}>
              <Text style={styles.insightLabel}>일평균 학습 시간</Text>
              <Text style={styles.insightValue}>
                {formatTime(
                  Math.floor(
                    stats.totalTime /
                      Object.keys(stats.days).filter(
                        (date) => stats.days[date] > 0
                      ).length || 1
                  )
                )}
              </Text>
            </View>
          </View>
        )}

        {/* 일별 학습 시간 그래프 (간단한 바 차트) */}
        <View style={styles.dailyStatsContainer}>
          <Text style={styles.sectionTitle}>일별 학습 시간</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.chartContainer}>
              {Object.keys(stats.days)
                .sort()
                .map((date) => {
                  const dayDate = new Date(date);
                  const dayNumber = dayDate.getDate();
                  const time = stats.days[date];
                  const maxTime = Math.max(...Object.values(stats.days)) || 1;
                  const height = (time / maxTime) * 100;

                  return (
                    <View key={date} style={styles.chartBar}>
                      <View
                        style={[
                          styles.chartBarFill,
                          { height: `${height}%` },
                        ]}
                      />
                      <Text style={styles.chartBarLabel}>{dayNumber}</Text>
                      {time > 0 && (
                        <Text style={styles.chartBarValue}>
                          {formatTimeShort(time)}
                        </Text>
                      )}
                    </View>
                  );
                })}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 리포트 타입 선택 탭 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            reportType === "weekly" && styles.tabActive,
          ]}
          onPress={() => {
            setReportType("weekly");
            setWeekOffset(0);
          }}
        >
          <Text
            style={[
              styles.tabText,
              reportType === "weekly" && styles.tabTextActive,
            ]}
          >
            주간 리포트
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            reportType === "monthly" && styles.tabActive,
          ]}
          onPress={() => {
            setReportType("monthly");
            setMonthOffset(0);
          }}
        >
          <Text
            style={[
              styles.tabText,
              reportType === "monthly" && styles.tabTextActive,
            ]}
          >
            월간 리포트
          </Text>
        </TouchableOpacity>
      </View>

      {/* 리포트 내용 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {reportType === "weekly"
          ? renderWeeklyReport(weeklyStats)
          : renderMonthlyReport(monthlyStats)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001F3F",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
  },
  tabTextActive: {
    color: "white",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  reportContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  navButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navButtonText: {
    fontSize: 14,
    color: "#A8C5C7",
    fontWeight: "500",
  },
  navButtonDisabled: {
    opacity: 0.3,
  },
  headerCenter: {
    alignItems: "center",
  },
  periodTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  periodSubtitle: {
    fontSize: 14,
    color: "#A8C5C7",
  },
  summaryCards: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  dailyStatsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  dailyStatItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dailyStatLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minWidth: 80,
  },
  dailyStatDay: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    width: 30,
  },
  dailyStatDate: {
    fontSize: 14,
    color: "#A8C5C7",
  },
  dailyStatRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginLeft: 16,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#7A9E9F",
    borderRadius: 4,
  },
  dailyStatTime: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    minWidth: 50,
    textAlign: "right",
  },
  insightsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  insightItem: {
    marginBottom: 16,
  },
  insightLabel: {
    fontSize: 14,
    color: "#A8C5C7",
    marginBottom: 4,
  },
  insightValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 2,
  },
  insightSubValue: {
    fontSize: 14,
    color: "#7A9E9F",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 200,
    paddingVertical: 16,
  },
  chartBar: {
    alignItems: "center",
    marginHorizontal: 4,
    minWidth: 40,
  },
  chartBarFill: {
    width: 30,
    backgroundColor: "#7A9E9F",
    borderRadius: 4,
    marginBottom: 8,
    minHeight: 4,
  },
  chartBarLabel: {
    fontSize: 12,
    color: "#A8C5C7",
    marginBottom: 4,
  },
  chartBarValue: {
    fontSize: 10,
    color: "#7A9E9F",
    marginTop: 4,
  },
});

export default StatisticsReport;


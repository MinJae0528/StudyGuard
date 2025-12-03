import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useStudyRecordStore } from "../../src/store/studyRecordStore";
import { usePremiumStore } from "../../src/store/premiumStore";

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: string;
  onPress: () => void;
  highlight?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  subtitle,
  badge,
  onPress,
  highlight = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.menuItem, highlight && styles.menuItemHighlight]}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <Text style={styles.menuIcon}>{icon}</Text>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Text style={styles.menuArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

interface MorePresenterProps {
  onNavigateToMyInfo: () => void;
  onNavigateToStats: () => void;
}

const MorePresenter: React.FC<MorePresenterProps> = ({
  onNavigateToMyInfo,
  onNavigateToStats,
}) => {
  const { getTotalStudyTime, records } = useStudyRecordStore();
  const { checkPremiumStatus } = usePremiumStore();
  const isPremium = checkPremiumStatus();

  const totalStudyTime = getTotalStudyTime();
  const totalRecords = records.length;

  // 시간 포맷팅
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}시간 ${minutes}분`;
    }
    return `${minutes}분`;
  };

  const handleShowAppInfo = () => {
    Alert.alert(
      "StudyGuard",
      "휴식 중독 해결을 위한 스마트 학습 관리 앱\n\n버전: 1.0.0\n\n© 2025 All rights reserved",
      [{ text: "확인", style: "default" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>더보기</Text>
          <Text style={styles.headerSubtitle}>
            학습 통계와 설정을 확인하세요
          </Text>
        </View>

        {/* 통계 요약 카드 */}
        <View style={styles.statsCard}>
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{formatTime(totalStudyTime)}</Text>
            <Text style={styles.statsLabel}>총 학습 시간</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>{totalRecords}</Text>
            <Text style={styles.statsLabel}>학습 기록</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsItem}>
            <Text style={styles.statsValue}>
              {isPremium ? "프리미엄" : "무료"}
            </Text>
            <Text style={styles.statsLabel}>구독 상태</Text>
          </View>
        </View>

        {/* 주요 기능 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주요 기능</Text>
          <View style={styles.sectionContent}>
            <MenuItem
              icon="📊"
              title="통계 및 리포트"
              subtitle="주간/월간 학습 통계 확인"
              // 시연용: 프리미엄 배지 제거
              // badge={isPremium ? undefined : "프리미엄"}
              onPress={onNavigateToStats}
              highlight={true}
            />
            <MenuItem
              icon="👤"
              title="내 정보"
              subtitle="프로필 및 학습 현황"
              onPress={onNavigateToMyInfo}
            />
          </View>
        </View>

        {/* 학습 기록 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>학습 기록</Text>
          <View style={styles.sectionContent}>
            <View style={styles.infoCard}>
              <Text style={styles.infoText}>
                📚 학습 기록은 홈 화면에서 확인할 수 있습니다.
              </Text>
              <Text style={styles.infoSubtext}>
                오늘의 학습 시간과 과목별 기록을 실시간으로 확인하세요.
              </Text>
            </View>
          </View>
        </View>

        {/* 앱 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>앱 정보</Text>
          <View style={styles.sectionContent}>
            <MenuItem
              icon="ℹ️"
              title="앱 정보"
              subtitle="버전 및 저작권 정보"
              onPress={handleShowAppInfo}
            />
          </View>
        </View>

        {/* 앱 버전 정보 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>StudyGuard v1.0.0</Text>
          <Text style={styles.footerText}>© 2025 All rights reserved</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001F3F", // 남색 배경
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 160, // 바텀 탭 공간 확보
  },
  header: {
    backgroundColor: "#001F3F", // study-primary
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#A8C5C7", // study-accent
  },
  // 통계 요약 카드
  statsCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 8,
  },
  statsItem: {
    flex: 1,
    alignItems: "center",
  },
  statsDivider: {
    width: 1,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 8,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    color: "#A8C5C7",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#A8C5C7",
    paddingHorizontal: 24,
    paddingVertical: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: "transparent",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 12,
  },
  menuItemHighlight: {
    backgroundColor: "rgba(122, 158, 159, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(122, 158, 159, 0.5)",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#A8C5C7",
  },
  badge: {
    backgroundColor: "#D4A574",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white",
  },
  menuArrow: {
    color: "#A8C5C7",
    fontSize: 18,
  },
  // 정보 카드
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "white",
    marginBottom: 8,
  },
  infoSubtext: {
    fontSize: 12,
    color: "#A8C5C7",
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 32,
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#7A9E9F",
    marginTop: 4,
  },
});

export default MorePresenter;

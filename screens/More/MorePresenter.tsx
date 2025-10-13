import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.menuItem}
      activeOpacity={0.7}
    >
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuTitle}>{title}</Text>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );
};

interface MorePresenterProps {
  onNavigateToMyInfo: () => void;
}

const MorePresenter: React.FC<MorePresenterProps> = ({
  onNavigateToMyInfo,
}) => {
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
          <Text style={styles.headerSubtitle}>설정 및 정보를 관리하세요</Text>
        </View>

        {/* 사용자 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>사용자</Text>
          <View style={styles.sectionContent}>
            <MenuItem icon="👤" title="내 정보" onPress={onNavigateToMyInfo} />
          </View>
        </View>

        {/* 앱 설정 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>설정</Text>
          <View style={styles.sectionContent}>
            <MenuItem
              icon="🔔"
              title="알림 설정"
              onPress={() => console.log("알림 설정")}
            />
            <MenuItem
              icon="🎨"
              title="테마 설정"
              onPress={() => console.log("테마 설정")}
            />
            <MenuItem
              icon="⏰"
              title="기본 휴식 시간 설정"
              onPress={() => console.log("기본 휴식 시간")}
            />
          </View>
        </View>

        {/* 통계 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>기록</Text>
          <View style={styles.sectionContent}>
            <MenuItem
              icon="📊"
              title="학습 통계"
              onPress={() => console.log("학습 통계")}
            />
            <MenuItem
              icon="📅"
              title="학습 기록"
              onPress={() => console.log("학습 기록")}
            />
          </View>
        </View>

        {/* 정보 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>정보</Text>
          <View style={styles.sectionContent}>
            <MenuItem
              icon="ℹ️"
              title="앱 정보"
              onPress={() => console.log("앱 정보")}
            />
            <MenuItem
              icon="📝"
              title="개인정보 처리방침"
              onPress={() => console.log("개인정보 처리방침")}
            />
            <MenuItem
              icon="📄"
              title="이용약관"
              onPress={() => console.log("이용약관")}
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
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sectionContent: {
    backgroundColor: "transparent",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "white",
  },
  menuArrow: {
    color: "#A8C5C7",
    fontSize: 18,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginBottom: 32,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 4,
  },
});

export default MorePresenter;

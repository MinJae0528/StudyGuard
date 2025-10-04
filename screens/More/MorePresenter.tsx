import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

interface MenuItemProps {
  icon: string;
  title: string;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, title, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center bg-white px-5 py-4 border-b border-gray-200"
      activeOpacity={0.7}
    >
      <Text className="text-2xl mr-4">{icon}</Text>
      <Text className="flex-1 text-base font-medium text-gray-800">
        {title}
      </Text>
      <Text className="text-gray-400 text-lg">›</Text>
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
    <ScrollView className="flex-1 bg-study-bg">
      {/* 헤더 */}
      <View className="bg-study-primary pt-12 pb-6 px-6">
        <Text className="text-3xl font-bold text-white mb-2">더보기</Text>
        <Text className="text-sm text-study-accent">
          설정 및 정보를 관리하세요
        </Text>
      </View>

      {/* 사용자 정보 섹션 */}
      <View className="mt-4">
        <Text className="text-xs font-semibold text-gray-500 px-5 py-2">
          사용자
        </Text>
        <View className="bg-white">
          <MenuItem icon="👤" title="내 정보" onPress={onNavigateToMyInfo} />
        </View>
      </View>

      {/* 앱 설정 섹션 */}
      <View className="mt-4">
        <Text className="text-xs font-semibold text-gray-500 px-5 py-2">
          설정
        </Text>
        <View className="bg-white">
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
      <View className="mt-4">
        <Text className="text-xs font-semibold text-gray-500 px-5 py-2">
          기록
        </Text>
        <View className="bg-white">
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
      <View className="mt-4 mb-8">
        <Text className="text-xs font-semibold text-gray-500 px-5 py-2">
          정보
        </Text>
        <View className="bg-white">
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
      <View className="px-6 py-4">
        <Text className="text-center text-xs text-gray-400">
          StudyGuard v1.0.0
        </Text>
        <Text className="text-center text-xs text-gray-400 mt-1">
          © 2025 All rights reserved
        </Text>
      </View>
    </ScrollView>
  );
};

export default MorePresenter;

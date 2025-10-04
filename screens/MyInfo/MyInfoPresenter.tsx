import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";

const MyInfoPresenter = () => {
  return (
    <ScrollView className="flex-1 bg-study-bg">
      {/* 프로필 섹션 */}
      <View className="bg-white p-6 items-center border-b border-gray-200">
        <View className="w-24 h-24 bg-study-primary rounded-full items-center justify-center mb-4">
          <Text className="text-5xl">👤</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-800 mb-1">
          사용자 이름
        </Text>
        <Text className="text-sm text-gray-500">user@example.com</Text>
      </View>

      {/* 통계 카드 */}
      <View className="p-4">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            📊 나의 학습 통계
          </Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-3xl font-bold text-study-primary">0</Text>
              <Text className="text-sm text-gray-600 mt-1">총 학습일</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="items-center">
              <Text className="text-3xl font-bold text-study-success">0h</Text>
              <Text className="text-sm text-gray-600 mt-1">총 학습시간</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="items-center">
              <Text className="text-3xl font-bold text-study-warning">0</Text>
              <Text className="text-sm text-gray-600 mt-1">평균 집중도</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 최근 활동 */}
      <View className="p-4">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            🕐 최근 활동
          </Text>
          <View className="items-center py-8">
            <Text className="text-4xl mb-2">📚</Text>
            <Text className="text-gray-500 text-sm">
              아직 학습 기록이 없습니다
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              공부를 시작해보세요!
            </Text>
          </View>
        </View>
      </View>

      {/* 목표 설정 */}
      <View className="p-4 pb-8">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            🎯 학습 목표
          </Text>
          <View className="bg-gray-50 rounded-xl p-4 mb-3">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm font-semibold text-gray-700">
                일일 학습 목표
              </Text>
              <Text className="text-sm font-bold text-study-primary">
                0 / 2시간
              </Text>
            </View>
            <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
              <View
                className="bg-study-primary h-full"
                style={{ width: "0%" }}
              />
            </View>
          </View>
          <TouchableOpacity className="bg-study-primary py-3 rounded-xl">
            <Text className="text-center text-white font-semibold">
              목표 설정하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default MyInfoPresenter;

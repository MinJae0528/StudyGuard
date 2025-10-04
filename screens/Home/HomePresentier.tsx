import React from "react";
import { View, Text } from "react-native";
import StudyTimer from "../../src/components/StudyTimer";

const HomePresenter = () => {
  return (
    <View className="flex-1 bg-study-bg">
      <View className="bg-study-primary pt-12 pb-6 px-6">
        <Text className="text-3xl font-bold text-white mb-1">StudyGuard</Text>
        <Text className="text-sm text-study-accent">
          휴식 중독 해결을 위한 학습 관리
        </Text>
      </View>
      <StudyTimer />
    </View>
  );
};

export default HomePresenter;

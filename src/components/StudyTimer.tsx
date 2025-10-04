import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { useTimerStore } from "../store/timerStore";
import { NotificationService } from "../services/NotificationService";
import RestTimeModal from "./RestTimeModal";

const StudyTimer: React.FC = () => {
  const {
    isStudying,
    studyTime,
    isResting,
    restTimeMinutes,
    startStudy,
    pauseStudy,
    stopStudy,
    resetTimer,
  } = useTimerStore();

  const [displayTime, setDisplayTime] = useState("00:00:00");
  const [showRestModal, setShowRestModal] = useState(false);

  // 시간을 시:분:초 형식으로 포맷팅
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 타이머 업데이트
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isStudying) {
      interval = setInterval(() => {
        const { startTime } = useTimerStore.getState();
        if (startTime) {
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          const totalTime = studyTime + elapsed;
          setDisplayTime(formatTime(totalTime));
        }
      }, 1000);
    } else {
      setDisplayTime(formatTime(studyTime));
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isStudying, studyTime]);

  // 공부 중단 시 알림 스케줄링
  useEffect(() => {
    if (!isStudying && studyTime > 0 && isResting) {
      // 설정된 시간(분) 후 복귀 알림 스케줄링
      const delaySeconds = restTimeMinutes * 60;
      NotificationService.scheduleReturnNotification(delaySeconds);

      Alert.alert(
        "휴식 모드",
        `${restTimeMinutes}분 후 공부 복귀 알림이 설정되었습니다.`,
        [{ text: "확인", style: "default" }]
      );
    }
  }, [isStudying, isResting, studyTime, restTimeMinutes]);

  const handleStart = async () => {
    // 알림 권한 요청
    await NotificationService.registerForPushNotificationsAsync();
    startStudy();
  };

  const handlePause = () => {
    pauseStudy();
  };

  const handleStop = () => {
    // 휴식 시간 선택 모달 표시
    setShowRestModal(true);
  };

  const handleRestTimeConfirm = (minutes: number) => {
    stopStudy(minutes);
  };

  const handleReturnToStudy = () => {
    Alert.alert("공부 복귀", "휴식을 종료하고 다시 공부를 시작하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "공부 시작",
        style: "default",
        onPress: () => {
          // 알림 취소 후 공부 시작
          NotificationService.cancelAllNotifications();
          startStudy();
        },
      },
    ]);
  };

  const handleReset = () => {
    Alert.alert("타이머 리셋", "타이머를 초기화하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "리셋",
        style: "destructive",
        onPress: () => {
          resetTimer();
          NotificationService.cancelAllNotifications();
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-study-bg px-6 pt-6 pb-8">
      {/* 휴식 시간 선택 모달 */}
      <RestTimeModal
        visible={showRestModal}
        onClose={() => setShowRestModal(false)}
        onConfirm={handleRestTimeConfirm}
      />

      {/* 상태 표시 */}
      <View className="mb-6">
        <Text className="text-center text-lg font-semibold text-study-primary mb-2">
          {isStudying ? "📚 공부 중" : isResting ? "😴 휴식 중" : "⏸️ 대기 중"}
        </Text>
        {isResting && (
          <Text className="text-center text-sm text-study-warning mt-1">
            {restTimeMinutes}분 휴식 중 (알림 예약됨)
          </Text>
        )}
      </View>

      {/* 시간 표시 영역 */}
      <View className="bg-white rounded-3xl p-8 mb-8 shadow-lg border border-gray-100">
        <Text className="text-center text-6xl font-bold text-study-primary mb-4">
          {displayTime}
        </Text>
        <Text className="text-center text-lg text-study-secondary">
          누적 공부 시간
        </Text>
      </View>

      {/* 버튼 영역 */}
      <View className="space-y-4">
        {/* 휴식 중일 때: 공부 복귀 버튼 */}
        {isResting && (
          <TouchableOpacity
            onPress={handleReturnToStudy}
            className="py-4 px-8 rounded-2xl bg-study-primary shadow-sm"
            activeOpacity={0.8}
          >
            <Text className="text-center text-xl font-bold text-white">
              📚 공부 복귀
            </Text>
          </TouchableOpacity>
        )}

        {/* 휴식 중이 아닐 때: 시작/일시정지 버튼 */}
        {!isResting && (
          <TouchableOpacity
            onPress={isStudying ? handlePause : handleStart}
            className={`py-4 px-8 rounded-2xl shadow-sm ${
              isStudying ? "bg-study-warning" : "bg-study-primary"
            }`}
            activeOpacity={0.8}
          >
            <Text className="text-center text-xl font-bold text-white">
              {isStudying ? "⏸️ 일시정지" : "▶️ 시작"}
            </Text>
          </TouchableOpacity>
        )}

        {/* 휴식 시작 버튼 */}
        {studyTime > 0 && !isResting && (
          <TouchableOpacity
            onPress={handleStop}
            className="py-4 px-8 rounded-2xl bg-study-secondary shadow-sm"
            activeOpacity={0.8}
          >
            <Text className="text-center text-xl font-bold text-white">
              😴 휴식 시작
            </Text>
          </TouchableOpacity>
        )}

        {/* 리셋 버튼 */}
        {studyTime > 0 && (
          <TouchableOpacity
            onPress={handleReset}
            className="py-3 px-6 rounded-xl bg-study-accent shadow-sm"
            activeOpacity={0.8}
          >
            <Text className="text-center text-lg font-semibold text-white">
              🔄 리셋
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 상태 정보 */}
      <View className="mt-8 bg-white rounded-xl p-4 border border-study-accent/30">
        <Text className="text-center text-sm text-study-secondary">
          💡 팁: 휴식 시작 시 원하는 시간을 설정하면 해당 시간 후 복귀 알림이
          발송됩니다
        </Text>
      </View>
    </View>
  );
};

export default StudyTimer;

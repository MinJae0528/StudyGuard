import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useTimerStore } from "../store/timerStore";
import { NotificationService } from "../services/NotificationService";
import { useStudyRecordStore } from "../store/studyRecordStore";
import StudyMemoModal from "./StudyMemoModal";
import RestTimeModal from "./RestTimeModal";
import StudyHistory from "./StudyHistory";

const StudyTimer: React.FC = () => {
  const {
    isStudying,
    studyTime,
    isResting,
    restTimeMinutes,
    isRestTimeOver,
    restRemainingTime,
    startStudy,
    pauseStudy,
    stopStudy,
    resetTimer,
    checkRestTimeOver,
    updateRestTime,
  } = useTimerStore();

  const [displayTime, setDisplayTime] = useState("00:00:00");
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [showRestModal, setShowRestModal] = useState(false);
  const [currentStudyTime, setCurrentStudyTime] = useState(0);

  const restAlertShown = useRef(false);
  const restOverAlertShown = useRef(false);

  const { addRecord } = useStudyRecordStore();

  // 앱 시작 시 알림 권한 요청 (한 번만)
  useEffect(() => {
    const requestPermission = async () => {
      const hasPermission =
        await NotificationService.registerForPushNotificationsAsync();
      if (hasPermission) {
        console.log("알림 권한이 이미 승인되어 있거나 새로 승인되었습니다.");
      }
    };
    requestPermission();
  }, []);

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

  // 휴식 시간 카운트다운 업데이트
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isResting) {
      interval = setInterval(() => {
        updateRestTime();
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isResting, updateRestTime]);

  // 휴식 시작 시 플래그 리셋
  useEffect(() => {
    if (isResting) {
      restAlertShown.current = false;
      restOverAlertShown.current = false;
    }
  }, [isResting]);

  // 휴식 시작 알림 (한 번만)
  useEffect(() => {
    if (!isStudying && studyTime > 0 && isResting && !restAlertShown.current) {
      restAlertShown.current = true;
      Alert.alert(
        "휴식 모드",
        `${restTimeMinutes}분 휴식이 시작되었습니다.\n휴식이 끝나면 알림이 울립니다! 📱`,
        [{ text: "확인", style: "default" }]
      );
    }
  }, [isStudying, isResting, studyTime, restTimeMinutes]);

  // 휴식 시간이 끝났을 때 로컬 알림 발송 + 앱 내 알림 (한 번만)
  useEffect(() => {
    if (
      isRestTimeOver &&
      isResting &&
      restRemainingTime === 0 &&
      !restOverAlertShown.current
    ) {
      restOverAlertShown.current = true;

      // 로컬 알림 즉시 발송
      NotificationService.sendImmediateNotification(
        "🔔 StudyGuard",
        "휴식 시간이 끝났습니다! 다시 공부를 시작해보세요 📚"
      );
      console.log("휴식 종료 로컬 알림 발송!");

      // 앱 내 알림
      Alert.alert(
        "휴식 시간 종료",
        "설정된 휴식 시간이 끝났습니다. 공부를 시작하시겠습니까?",
        [
          { text: "나중에", style: "cancel" },
          {
            text: "공부 시작",
            style: "default",
            onPress: () => startStudy(),
          },
        ]
      );
    }
  }, [isRestTimeOver, isResting, restRemainingTime, startStudy]);

  const handleStart = () => {
    // 휴식 중에서 공부 시작할 때 확인 메시지
    if (isResting) {
      Alert.alert(
        "새로운 공부 시작",
        "휴식을 종료하고 새로운 공부를 시작하시겠습니까?",
        [
          { text: "취소", style: "cancel" },
          {
            text: "공부 시작",
            style: "default",
            onPress: () => {
              startStudy();
            },
          },
        ]
      );
    } else {
      // 일반적인 공부 시작
      startStudy();
    }
  };

  const handleStopMeasurement = () => {
    // 현재 학습 시간 저장
    const { startTime } = useTimerStore.getState();
    let elapsed = 0;
    if (startTime) {
      elapsed = Math.floor((Date.now() - startTime) / 1000);
    }
    const totalTime = studyTime + elapsed;
    setCurrentStudyTime(totalTime);

    // 측정 종료 시 메모 입력 모달 표시
    setShowMemoModal(true);
  };

  const handleMemoConfirm = (subject: string) => {
    // 학습 기록 저장
    addRecord(subject, currentStudyTime);

    // 휴식시간 설정 모달 표시 (타이머 초기화는 하지 않음)
    setShowRestModal(true);
  };

  const handleRestTimeConfirm = async (minutes: number) => {
    // 휴식 모드로 전환 (알림은 타이머가 0초가 될 때 발송)
    stopStudy(minutes);
    console.log(
      `${minutes}분 휴식 시작. 타이머가 0초가 되면 알림이 발송됩니다.`
    );
  };

  const handleReturnToStudy = () => {
    Alert.alert("공부 복귀", "휴식을 종료하고 다시 공부를 시작하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "공부 시작",
        style: "default",
        onPress: () => {
          // Expo Go에서는 알림 기능이 제한됨
          // NotificationService.cancelAllNotifications();
          startStudy();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 공부 내용 메모 모달 */}
      <StudyMemoModal
        visible={showMemoModal}
        onClose={() => setShowMemoModal(false)}
        onConfirm={handleMemoConfirm}
        studyDuration={currentStudyTime}
      />

      {/* 휴식 시간 선택 모달 */}
      <RestTimeModal
        visible={showRestModal}
        onClose={() => setShowRestModal(false)}
        onConfirm={handleRestTimeConfirm}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 상태 표시 (2가지 상태 카드) */}
        <View style={styles.statusCardsContainer}>
          <View
            style={[styles.statusCard, isStudying && styles.statusCardActive]}
          >
            <Text
              style={[
                styles.statusEmoji,
                isStudying && styles.statusEmojiActive,
              ]}
            >
              📚
            </Text>
            <Text
              style={[
                styles.statusLabel,
                isStudying && styles.statusLabelActive,
              ]}
            >
              공부 중
            </Text>
          </View>

          <View
            style={[styles.statusCard, isResting && styles.statusCardActive]}
          >
            <Text
              style={[
                styles.statusEmoji,
                isResting && styles.statusEmojiActive,
              ]}
            >
              😴
            </Text>
            <Text
              style={[
                styles.statusLabel,
                isResting && styles.statusLabelActive,
              ]}
            >
              휴식 중
            </Text>
          </View>
        </View>

        {/* 시간 표시 영역 */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {isResting ? formatTime(restRemainingTime) : displayTime}
          </Text>
          <Text style={styles.timeLabel}>
            {isResting ? "남은 휴식 시간" : "현재 세션"}
          </Text>
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonContainer}>
          {/* 공부 중일 때: 측정 종료 버튼 */}
          {isStudying && (
            <TouchableOpacity
              onPress={handleStopMeasurement}
              style={[styles.button, styles.warningButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>⏹️ 측정 종료</Text>
            </TouchableOpacity>
          )}

          {/* 공부 중이 아닐 때: 공부 시작 버튼 (휴식 중이어도 가능) */}
          {!isStudying && (
            <TouchableOpacity
              onPress={handleStart}
              style={[styles.button, styles.startButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>▶️ 공부 시작</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* 학습 기록 */}
        <StudyHistory />

        {/* 상태 정보 */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            💡 팁: 휴식 시간이 끝나면 알림이 울립니다. 백그라운드에서도
            작동해요!
          </Text>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 160, // 바텀 탭 공간 확보
  },
  statusCardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 24,
  },
  statusCard: {
    width: 120,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  statusCardActive: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderColor: "#7A9E9F",
  },
  statusEmoji: {
    fontSize: 32,
    marginBottom: 8,
    opacity: 0.5,
  },
  statusEmojiActive: {
    opacity: 1,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.5)",
  },
  statusLabelActive: {
    color: "white",
  },
  timeContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 32,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  timeText: {
    textAlign: "center",
    fontSize: 60,
    fontWeight: "bold",
    color: "#001F3F", // study-primary
    marginBottom: 16,
  },
  timeLabel: {
    textAlign: "center",
    fontSize: 18,
    color: "#7A9E9F", // study-secondary
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: "#7A9E9F", // study-secondary로 변경하여 가시성 개선
  },
  startButton: {
    backgroundColor: "#4CAF50", // 초록색으로 시작 버튼 강조
  },
  secondaryButton: {
    backgroundColor: "#7A9E9F", // study-secondary
  },
  warningButton: {
    backgroundColor: "#D4A574", // study-warning
  },
  accentButton: {
    backgroundColor: "#A8C5C7", // study-accent
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  infoContainer: {
    marginTop: 32,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#A8C5C7", // study-accent with opacity
  },
  infoText: {
    textAlign: "center",
    fontSize: 14,
    color: "#7A9E9F", // study-secondary
  },
});

export default StudyTimer;

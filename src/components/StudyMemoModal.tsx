import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";

interface StudyMemoModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (subject: string, skipRest?: boolean) => void;
  onCompleteEnd?: () => void;
  studyDuration: number; // 학습 시간 (초)
}

const StudyMemoModal: React.FC<StudyMemoModalProps> = ({
  visible,
  onClose,
  onConfirm,
  onCompleteEnd,
  studyDuration,
}) => {
  const [subject, setSubject] = useState("");

  // 시간을 시:분:초 형식으로 포맷팅
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}시간 ${minutes}분 ${secs}초`;
    } else if (minutes > 0) {
      return `${minutes}분 ${secs}초`;
    } else {
      return `${secs}초`;
    }
  };

  // 빠른 선택 옵션들
  const quickSubjects = [
    "수학",
    "영어",
    "국어",
    "과학",
    "사회",
    "코딩",
    "독서",
    "시험준비",
    "과제",
    "복습",
  ];

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (visible) {
      setSubject("");
    }
  }, [visible]);

  const handleQuickSelect = (selectedSubject: string) => {
    setSubject(selectedSubject);
  };

  const handleConfirm = () => {
    if (subject.trim()) {
      onConfirm(subject.trim());
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <View style={styles.modalContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              bounces={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* 헤더 */}
              <View style={styles.header}>
                <Text style={styles.title}>📝 공부 내용 기록</Text>
                <Text style={styles.subtitle}>
                  {formatTime(studyDuration)} 동안 무엇을 공부하셨나요?
                </Text>
              </View>

              {/* 학습 시간 표시 */}
              <View style={styles.durationContainer}>
                <Text style={styles.durationLabel}>학습 시간</Text>
                <Text style={styles.durationText}>
                  {formatTime(studyDuration)}
                </Text>
              </View>

              {/* 직접 입력 영역 */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>공부 내용 입력</Text>
                <TextInput
                  value={subject}
                  onChangeText={setSubject}
                  placeholder="예: 수학 문제집 3단원"
                  style={styles.textInput}
                  placeholderTextColor="#9CA3AF"
                  multiline
                  maxLength={50}
                />
                <Text style={styles.characterCount}>{subject.length}/50</Text>
              </View>

              {/* 빠른 선택 옵션 */}
              <View style={styles.quickSelectSection}>
                <Text style={styles.quickSelectLabel}>빠른 선택</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.quickSelectContainer}
                >
                  {quickSubjects.map((quickSubject) => (
                    <TouchableOpacity
                      key={quickSubject}
                      onPress={() => handleQuickSelect(quickSubject)}
                      style={[
                        styles.quickSelectButton,
                        subject === quickSubject &&
                          styles.quickSelectButtonSelected,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.quickSelectButtonText,
                          subject === quickSubject &&
                            styles.quickSelectButtonTextSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {quickSubject}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* 버튼 영역 */}
              <View style={styles.buttonSection}>
                <TouchableOpacity
                  onPress={handleConfirm}
                  disabled={!subject.trim()}
                  style={[
                    styles.confirmButton,
                    !subject.trim() && styles.confirmButtonDisabled,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>
                    기록하고 휴식 설정하기
                  </Text>
                </TouchableOpacity>

                {onCompleteEnd && (
                  <TouchableOpacity
                    onPress={() => {
                      if (subject.trim()) {
                        onConfirm(subject.trim(), true);
                        onClose(); // 모달 닫기
                      } else {
                        onCompleteEnd();
                        onClose(); // 모달 닫기
                      }
                    }}
                    style={styles.completeEndButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.completeEndButtonText}>
                      기록하고 종료
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={onClose}
                  style={styles.cancelButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    width: "92%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  scrollContent: {
    paddingBottom: 8,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#374151",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#6B7280",
  },
  durationContainer: {
    backgroundColor: "#EBF8FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  durationLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  durationText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#001F3F",
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#374151",
    minHeight: 80,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "right",
    marginTop: 4,
  },
  quickSelectSection: {
    marginBottom: 20,
  },
  quickSelectLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  quickSelectContainer: {
    flexDirection: "row",
  },
  quickSelectButton: {
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "white",
  },
  quickSelectButtonSelected: {
    backgroundColor: "#001F3F",
    borderColor: "#001F3F",
  },
  quickSelectButtonText: {
    fontWeight: "500",
    color: "#374151",
    fontSize: 14,
  },
  quickSelectButtonTextSelected: {
    color: "white",
  },
  buttonSection: {
    gap: 12,
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#001F3F",
  },
  confirmButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  confirmButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  completeEndButton: {
    backgroundColor: "#6B7280",
    paddingVertical: 14,
    borderRadius: 12,
  },
  completeEndButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 12,
    borderRadius: 12,
  },
  cancelButtonText: {
    textAlign: "center",
    color: "#374151",
    fontWeight: "600",
  },
});

export default StudyMemoModal;

import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";

interface RestTimeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
  onCompleteEnd?: () => void;
  isExtendedRest?: boolean; // 추가 휴식 시간 모드 (1-5분만)
}

const RestTimeModal: React.FC<RestTimeModalProps> = ({
  visible,
  onClose,
  onConfirm,
  onCompleteEnd,
  isExtendedRest = false,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState(1);
  const [inputValue, setInputValue] = useState("1");

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (visible) {
      setSelectedMinutes(1);
      setInputValue("1");
    }
  }, [visible]);

  // 빠른 선택 옵션 (추가 휴식 시간 모드일 때는 1-5분만)
  const quickOptions = isExtendedRest ? [1, 2, 3, 4, 5] : [1, 5, 10, 15, 20, 25, 30, 45, 60];
  const maxMinutes = isExtendedRest ? 5 : 60;
  const minMinutes = 1;

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const num = parseInt(text, 10);
    if (!isNaN(num) && num >= minMinutes && num <= maxMinutes) {
      setSelectedMinutes(num);
    }
  };

  const handleQuickSelect = (minutes: number) => {
    setSelectedMinutes(minutes);
    setInputValue(minutes.toString());
  };

  const handleConfirm = () => {
    const finalMinutes = Math.max(minMinutes, Math.min(maxMinutes, selectedMinutes));
    onConfirm(finalMinutes);
    onClose();
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
                <Text style={styles.title}>
                  {isExtendedRest ? "⏱️ 추가 휴식 시간" : "⏱️ 휴식 시간 설정"}
                </Text>
                <Text style={styles.subtitle}>
                  {isExtendedRest
                    ? "1분부터 5분까지만 추가 휴식 시간을 설정할 수 있습니다"
                    : "1분부터 60분까지 설정 가능합니다"}
                </Text>
              </View>

              {/* 직접 입력 영역 */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>시간 직접 입력</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    value={inputValue}
                    onChangeText={handleInputChange}
                    keyboardType="number-pad"
                    maxLength={isExtendedRest ? 1 : 2}
                    placeholder="1"
                    style={styles.textInput}
                    placeholderTextColor="#9CA3AF"
                  />
                  <Text style={styles.inputUnit}>분</Text>
                </View>
                {(parseInt(inputValue) < minMinutes ||
                  parseInt(inputValue) > maxMinutes ||
                  isNaN(parseInt(inputValue))) &&
                  inputValue !== "" && (
                    <Text style={styles.errorText}>
                      {minMinutes}분에서 {maxMinutes}분 사이의 숫자를 입력해주세요
                    </Text>
                  )}
              </View>

              {/* 빠른 선택 옵션 */}
              <View style={styles.quickSelectSection}>
                <Text style={styles.quickSelectLabel}>빠른 선택</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.quickSelectContainer}
                >
                  {quickOptions.map((minutes) => (
                    <TouchableOpacity
                      key={minutes}
                      onPress={() => handleQuickSelect(minutes)}
                      style={[
                        styles.quickSelectButton,
                        selectedMinutes === minutes &&
                          styles.quickSelectButtonSelected,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.quickSelectButtonText,
                          selectedMinutes === minutes &&
                            styles.quickSelectButtonTextSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {minutes}분
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* 버튼 영역 */}
              <View style={styles.buttonSection}>
                <TouchableOpacity
                  onPress={handleConfirm}
                  disabled={selectedMinutes < minMinutes || selectedMinutes > maxMinutes}
                  style={[
                    styles.confirmButton,
                    (selectedMinutes < minMinutes || selectedMinutes > maxMinutes) &&
                      styles.confirmButtonDisabled,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.confirmButtonText}>
                    {selectedMinutes >= minMinutes && selectedMinutes <= maxMinutes
                      ? `${selectedMinutes}분 ${isExtendedRest ? "추가 휴식" : "휴식"} 시작`
                      : "시간을 입력해주세요"}
                  </Text>
                </TouchableOpacity>

                {onCompleteEnd && (
                  <TouchableOpacity
                    onPress={onCompleteEnd}
                    style={styles.completeEndButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.completeEndButtonText}>
                      휴식 없이 종료
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

              {/* 안내 메시지 */}
              <View style={styles.infoSection}>
                <Text style={styles.infoText}>
                  💡 휴식이 끝나면 알림이 울립니다!
                </Text>
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
    marginBottom: 24,
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
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#001F3F", // study-primary
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#001F3F", // study-primary
  },
  inputUnit: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6B7280",
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: "#C87072", // study-danger
    marginTop: 8,
    textAlign: "center",
  },
  quickSelectSection: {
    marginBottom: 24,
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
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
  },
  quickSelectButtonSelected: {
    backgroundColor: "#001F3F", // study-primary
    borderColor: "#001F3F",
  },
  quickSelectButtonText: {
    fontWeight: "600",
    color: "#374151",
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
    backgroundColor: "#001F3F", // study-primary
  },
  confirmButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  confirmButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
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
  infoSection: {
    marginTop: 16,
    backgroundColor: "#EBF8FF",
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    fontSize: 12,
    textAlign: "center",
    color: "#7A9E9F", // study-secondary
  },
});

export default RestTimeModal;

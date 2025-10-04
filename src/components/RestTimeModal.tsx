import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  TextInput,
  Keyboard,
} from "react-native";

interface RestTimeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (minutes: number) => void;
}

const RestTimeModal: React.FC<RestTimeModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [inputValue, setInputValue] = useState("5");

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (visible) {
      setSelectedMinutes(5);
      setInputValue("5");
    }
  }, [visible]);

  // 빠른 선택 옵션 (5분 단위)
  const quickOptions = [5, 10, 15, 20, 25, 30, 45, 60];

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const num = parseInt(text, 10);
    if (!isNaN(num) && num >= 1 && num <= 60) {
      setSelectedMinutes(num);
    }
  };

  const handleQuickSelect = (minutes: number) => {
    setSelectedMinutes(minutes);
    setInputValue(minutes.toString());
  };

  const handleConfirm = () => {
    const finalMinutes = Math.max(1, Math.min(60, selectedMinutes));
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
      <Pressable
        className="flex-1 bg-black/50 justify-center items-center"
        onPress={onClose}
      >
        <Pressable
          className="bg-white rounded-3xl p-6 w-11/12 max-w-md"
          onPress={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-center text-gray-800 mb-2">
              ⏱️ 휴식 시간 설정
            </Text>
            <Text className="text-sm text-center text-gray-600">
              1분부터 60분까지 설정 가능합니다
            </Text>
          </View>

          {/* 직접 입력 영역 */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              시간 직접 입력
            </Text>
            <View className="flex-row items-center bg-gray-50 rounded-xl border-2 border-study-primary px-4 py-3">
              <TextInput
                value={inputValue}
                onChangeText={handleInputChange}
                keyboardType="number-pad"
                maxLength={2}
                placeholder="5"
                className="flex-1 text-3xl font-bold text-center text-study-primary"
                placeholderTextColor="#9CA3AF"
              />
              <Text className="text-xl font-semibold text-gray-600 ml-2">
                분
              </Text>
            </View>
            {(parseInt(inputValue) < 1 ||
              parseInt(inputValue) > 60 ||
              isNaN(parseInt(inputValue))) &&
              inputValue !== "" && (
                <Text className="text-xs text-study-danger mt-2 text-center">
                  1분에서 60분 사이의 숫자를 입력해주세요
                </Text>
              )}
          </View>

          {/* 빠른 선택 옵션 */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-3">
              빠른 선택
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row"
            >
              {quickOptions.map((minutes) => (
                <TouchableOpacity
                  key={minutes}
                  onPress={() => handleQuickSelect(minutes)}
                  className={`mr-2 px-4 py-2 rounded-lg border-2 ${
                    selectedMinutes === minutes
                      ? "bg-study-primary border-study-primary"
                      : "bg-white border-gray-300"
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`font-semibold ${
                      selectedMinutes === minutes
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {minutes}분
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 버튼 영역 */}
          <View className="space-y-3">
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={selectedMinutes < 1 || selectedMinutes > 60}
              className={`py-4 rounded-xl ${
                selectedMinutes >= 1 && selectedMinutes <= 60
                  ? "bg-study-primary"
                  : "bg-gray-300"
              }`}
              activeOpacity={0.8}
            >
              <Text className="text-center text-white font-bold text-lg">
                {selectedMinutes >= 1 && selectedMinutes <= 60
                  ? `${selectedMinutes}분 휴식 시작`
                  : "시간을 입력해주세요"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-200 py-3 rounded-xl"
              activeOpacity={0.8}
            >
              <Text className="text-center text-gray-700 font-semibold">
                취소
              </Text>
            </TouchableOpacity>
          </View>

          {/* 안내 메시지 */}
          <View className="mt-4 bg-blue-50 rounded-lg p-3">
            <Text className="text-xs text-center text-study-secondary">
              💡 설정한 시간이 지나면 복귀 알림을 보내드립니다
            </Text>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default RestTimeModal;

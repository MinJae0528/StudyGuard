import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import MainStack from "./stack/MainStack";
import SplashScreen from "./src/components/SplashScreen";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 앱 초기화 로직 (필요시)
    const initializeApp = async () => {
      // 여기에 앱 초기화 로직 추가 가능
      // 예: 데이터 로딩, 설정 로드 등
    };

    initializeApp();
  }, []);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#001F3F" />
      <MainStack />
    </NavigationContainer>
  );
}

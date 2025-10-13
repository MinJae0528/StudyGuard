import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // 2초 후 메인 앱으로 전환

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* 로고 이미지 */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/StudyGuard_Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* 로딩 인디케이터 */}
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001F3F", // 전체 배경을 남색으로
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 300,
    height: 200,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60,
  },
});

export default SplashScreen;

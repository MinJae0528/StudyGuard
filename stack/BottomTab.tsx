import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from "@react-navigation/bottom-tabs";
import {
  Text,
  Platform,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Home from "../screens/Home";
import More from "../screens/More";

const Tabs = createBottomTabNavigator();

// 커스텀 탭 바 컴포넌트
const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        flexDirection: "row",
        height: Platform.OS === "ios" ? 100 : 90,
        backgroundColor: "#FFFFFF",
        borderTopColor: "#E5E7EB",
        borderTopWidth: 1,
        marginBottom: 10,
      }}
    >
      {/* 홈 탭 (왼쪽 절반) */}
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 40 : 20,
        }}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={{ fontSize: 24, marginBottom: 4 }}>🏠</Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: state.index === 0 ? "#001F3F" : "#7A9E9F",
          }}
        >
          홈
        </Text>
      </TouchableOpacity>

      {/* 중앙 구분선 */}
      <View
        style={{
          width: 1,
          backgroundColor: "#E5E7EB",
          marginVertical: 20,
        }}
      />

      {/* 더보기 탭 (오른쪽 절반) */}
      <TouchableOpacity
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 40 : 20,
        }}
        onPress={() => navigation.navigate("More")}
      >
        <Text style={{ fontSize: 24, marginBottom: 4 }}>☰</Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: state.index === 1 ? "#001F3F" : "#7A9E9F",
          }}
        >
          더보기
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const BottomTab = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="Home" component={Home} />
      <Tabs.Screen name="More" component={More} />
    </Tabs.Navigator>
  );
};

export default BottomTab;

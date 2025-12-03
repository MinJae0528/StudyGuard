import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "./BottomTab";
import MyInfo from "../screens/MyInfo";
import Stats from "../screens/Stats";
import AllStudyRecords from "../screens/AllStudyRecords";

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#001F3F",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {/* 첫 번째 자동으로 보여지는 화면 = BottomTab */}
      <Stack.Screen
        name="BottomTab"
        component={BottomTab}
        options={{ headerShown: false }}
      />
      {/* 내 정보 상세 화면 */}
      <Stack.Screen
        name="MyInfo"
        component={MyInfo}
        options={{ title: "내 정보" }}
      />
      {/* 통계 및 리포트 화면 */}
      <Stack.Screen
        name="Stats"
        component={Stats}
        options={{ title: "통계 및 리포트" }}
      />
      {/* 전체 학습 기록 화면 */}
      <Stack.Screen
        name="AllStudyRecords"
        component={AllStudyRecords}
        options={{ title: "전체 학습 기록" }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;

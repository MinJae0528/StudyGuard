import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import More from "../screens/More";

const Tabs = createBottomTabNavigator();

const BottomTab = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#001F3F",
        tabBarInactiveTintColor: "#7A9E9F",
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: "홈",
          tabBarIcon: ({ color, size }) => (
            <span style={{ fontSize: size, color }}>🏠</span>
          ),
        }}
      />
      <Tabs.Screen
        name="More"
        component={More}
        options={{
          tabBarLabel: "더보기",
          tabBarIcon: ({ color, size }) => (
            <span style={{ fontSize: size, color }}>☰</span>
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default BottomTab;

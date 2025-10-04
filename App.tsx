import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React from "react";
import MainStack from "./stack/MainStack";
import "./global.css";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <MainStack />
    </NavigationContainer>
  );
}

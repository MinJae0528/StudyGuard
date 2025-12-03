import React from "react";
import { useNavigation } from "@react-navigation/native";
import MorePresenter from "./MorePresenter";

const MoreContainer = () => {
  const navigation = useNavigation<any>();

  const handleNavigateToMyInfo = () => {
    navigation.navigate("MyInfo");
  };

  const handleNavigateToStats = () => {
    navigation.navigate("Stats");
  };

  return (
    <MorePresenter
      onNavigateToMyInfo={handleNavigateToMyInfo}
      onNavigateToStats={handleNavigateToStats}
    />
  );
};

export default MoreContainer;

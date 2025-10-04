import React from "react";
import { useNavigation } from "@react-navigation/native";
import MorePresenter from "./MorePresenter";

const MoreContainer = () => {
  const navigation = useNavigation<any>();

  const handleNavigateToMyInfo = () => {
    navigation.navigate("MyInfo");
  };

  return <MorePresenter onNavigateToMyInfo={handleNavigateToMyInfo} />;
};

export default MoreContainer;

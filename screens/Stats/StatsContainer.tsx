import React, { useState } from "react";
import StatsPresenter from "./StatsPresenter";

const StatsContainer = () => {
  const [selectedTab, setSelectedTab] = useState<"weekly" | "monthly">("weekly");
  const [weekOffset, setWeekOffset] = useState(0);
  const [monthOffset, setMonthOffset] = useState(0);

  const handleTabChange = (tab: "weekly" | "monthly") => {
    setSelectedTab(tab);
  };

  const handlePreviousPeriod = () => {
    if (selectedTab === "weekly") {
      setWeekOffset(weekOffset - 1);
    } else {
      setMonthOffset(monthOffset - 1);
    }
  };

  const handleNextPeriod = () => {
    if (selectedTab === "weekly") {
      setWeekOffset(weekOffset + 1);
    } else {
      setMonthOffset(monthOffset + 1);
    }
  };

  const handleResetPeriod = () => {
    if (selectedTab === "weekly") {
      setWeekOffset(0);
    } else {
      setMonthOffset(0);
    }
  };

  return (
    <StatsPresenter
      selectedTab={selectedTab}
      weekOffset={weekOffset}
      monthOffset={monthOffset}
      onTabChange={handleTabChange}
      onPreviousPeriod={handlePreviousPeriod}
      onNextPeriod={handleNextPeriod}
      onResetPeriod={handleResetPeriod}
    />
  );
};

export default StatsContainer;



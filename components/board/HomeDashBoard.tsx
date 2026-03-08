import React from "react";
import { ScrollView } from "react-native";
import RunSummaryBoard from "./HomeDashBoardItem/RunSummaryBoard";
import WalkScoreBoard from "./HomeDashBoardItem/WalkScoreBoard";

const HomeDashBoard = () => {
  return (
    <ScrollView className=" bg-gray-100">
      <RunSummaryBoard />
      <WalkScoreBoard />
    </ScrollView>
  );
};

export default HomeDashBoard;

import React from "react";
import { Text } from "react-native";
import { Pressable } from "../ui/pressable";

const Tabs = [
  { label: "주간", value: "weekly" },
  { label: "월간", value: "monthly" },
  { label: "연간", value: "yearly" },
];

interface ChartTapButtonProps {
  handleSelectChart: (chart: string) => void;
  label: string;
  isActive?: boolean;
}
const ChartTapButton = ({
  handleSelectChart,
  label,
  isActive,
}: ChartTapButtonProps) => {
  return (
    <Pressable
      onPress={() =>
        handleSelectChart(
          Tabs.find((tab) => tab.label === label)?.value || "weekly",
        )
      }
      className={`${isActive ? "border-b-2 border-blue-500" : ""} px-4 py-2`}
    >
      {({ pressed }) => (
        <Text
          style={{
            color: isActive ? "#3b82f6" : pressed ? "#1e40af" : "#000000",
            fontWeight: isActive ? "bold" : "normal",
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default ChartTapButton;

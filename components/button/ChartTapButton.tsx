import { Text } from "@/components/ui/text";
import React from "react";
import { Pressable } from "../ui/pressable";

interface ChartTapButtonProps {
  handleSelectChart: (chart: string) => void;
  label: string;
  value: string;
  isActive?: boolean;
}

const ChartTapButton = ({
  handleSelectChart,
  label,
  value,
  isActive,
}: ChartTapButtonProps) => {
  return (
    <Pressable
      onPress={() => handleSelectChart(value)}
      className="z-10 flex-1 items-center rounded-xl py-2.5"
      style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
    >
      <Text
        className={`text-sm font-semibold ${
          isActive ? "text-white" : "text-gray-500"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default ChartTapButton;

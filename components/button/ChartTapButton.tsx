import React from "react";
import { Text } from "@/components/ui/text";
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
      className={`flex-1 items-center rounded-xl py-2.5 ${
        isActive ? "bg-[#F25857]" : "bg-transparent"
      }`}
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

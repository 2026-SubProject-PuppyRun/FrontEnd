import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { WeightPeriod } from "@/types/weight";
import { View } from "react-native";

const PERIODS: { label: string; value: WeightPeriod }[] = [
  { label: "1개월", value: "1m" },
  { label: "3개월", value: "3m" },
  { label: "6개월", value: "6m" },
  { label: "1년", value: "1y" },
];

interface WeightPeriodTabsProps {
  period: WeightPeriod;
  onChange: (period: WeightPeriod) => void;
}

const WeightPeriodTabs = ({ period, onChange }: WeightPeriodTabsProps) => (
  <View className="mb-4 flex-row rounded-2xl bg-[#F7F7F7] p-1">
    {PERIODS.map((item) => {
      const isActive = period === item.value;
      return (
        <Pressable
          key={item.value}
          onPress={() => onChange(item.value)}
          className={`flex-1 items-center rounded-xl py-2.5 ${
            isActive ? "bg-[#F25857]" : "bg-transparent"
          }`}
          style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
        >
          <Text
            className={`text-xs font-semibold ${
              isActive ? "text-white" : "text-gray-500"
            }`}
          >
            {item.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

export default WeightPeriodTabs;

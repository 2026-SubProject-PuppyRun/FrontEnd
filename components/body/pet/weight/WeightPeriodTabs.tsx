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
  <View className="mx-4 mt-4 flex-row justify-around">
    {PERIODS.map((item) => {
      const isActive = period === item.value;
      return (
        <Pressable
          key={item.value}
          onPress={() => onChange(item.value)}
          className={`px-3 py-2 ${isActive ? "border-b-2 border-primary-500" : ""}`}
        >
          <Text
            className={`text-sm ${isActive ? "font-bold text-primary-500" : "text-gray-600"}`}
          >
            {item.label}
          </Text>
        </Pressable>
      );
    })}
  </View>
);

export default WeightPeriodTabs;

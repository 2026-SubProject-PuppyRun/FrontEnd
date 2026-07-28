import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

interface ChartData {
  value: number;
  label: string;
  color: string;
}

const dummyData = [
  { value: 40, label: "PuppyA", color: "#F25857" },
  { value: 30, label: "PuppyB", color: "#FFB3B2" },
  { value: 20, label: "PuppyC", color: "#0D0F1B" },
];

const CompareChart = () => {
  const [data, setData] = useState<ChartData[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const totalValue = data ? data.reduce((sum, item) => sum + item.value, 0) : 0;

  useEffect(() => {
    setData(dummyData);
  }, []);

  if (!data) return null;

  const selectedItem = data[selectedIndex];

  return (
    <View className="flex-row items-center justify-center rounded-3xl bg-white p-5 shadow-sm">
      <PieChart
        data={data}
        donut
        sectionAutoFocus
        radius={88}
        innerRadius={58}
        innerCircleColor="#FFFFFF"
        focusOnPress
        toggleFocusOnPress={false}
        onPress={(_item: ChartData, index: number) => {
          setSelectedIndex(index);
        }}
        selectedIndex={selectedIndex}
        centerLabelComponent={() => {
          if (!selectedItem || totalValue === 0) return null;
          const percentage = Math.round(
            (selectedItem.value / totalValue) * 100,
          );
          return (
            <View className="items-center justify-center">
              <Text className="text-xl font-bold text-[#0D0F1B]">
                {percentage}%
              </Text>
              <Text className="text-sm text-gray-500">{selectedItem.label}</Text>
            </View>
          );
        }}
      />
      <View className="ml-4 gap-3">
        {data.map((item, index) => (
          <View key={index} className="flex-row items-center">
            <View
              style={{ backgroundColor: item.color }}
              className="mr-2.5 h-3.5 w-3.5 rounded-full"
            />
            <Text
              className={`text-sm ${
                selectedIndex === index
                  ? "font-bold text-[#0D0F1B]"
                  : "text-gray-500"
              }`}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CompareChart;

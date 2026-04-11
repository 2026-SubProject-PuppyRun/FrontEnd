import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

interface ChartData {
  value: number;
  label: string;
  color: string;
}

const dummyData = [
  { value: 40, label: "PuppyA", color: "#FF6384" },
  { value: 30, label: "PuppyB", color: "#36A2EB" },
  { value: 20, label: "PuppyC", color: "#FFCE56" },
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
    <View className="mx-4 flex-row items-center justify-center rounded-lg bg-white p-4">
      <PieChart
        data={data}
        donut
        sectionAutoFocus
        radius={90}
        innerRadius={60}
        innerCircleColor={"#ffffff"}
        focusOnPress
        toggleFocusOnPress={false}
        onPress={(item: ChartData, index: number) => {
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
              <Text className="text-lg font-bold text-black">
                {percentage}%
              </Text>
              <Text className="text-black">{selectedItem.label}</Text>
            </View>
          );
        }}
      />
      <View className="ml-4 gap-2 space-y-2">
        {data.map((item, index) => (
          <View key={index} className="flex-row items-center">
            <View
              style={{ backgroundColor: item.color }}
              className="mr-2 h-4 w-4 rounded-full"
            />
            <Text
              className={
                selectedIndex === index
                  ? "font-bold text-black"
                  : "text-gray-600"
              }
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

import React from "react";
import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";

const ChartSkeleton = () => {
  const dummyHeights = ["h-16", "h-32", "h-24", "h-40", "h-20", "h-28", "h-36"];

  return (
    <View className="mb-6 mt-8 h-56 w-full px-6">
      <View className="flex-1 flex-row items-end justify-between border-b border-gray-200 pb-2">
        {dummyHeights.map((h, index) => (
          <View key={index} className="items-center">
            <Skeleton
              variant="rounded"
              className={`mb-2 w-6 rounded-md ${h}`}
              startColor="bg-gray-300"
            />
            <Skeleton
              variant="rounded"
              className="h-3 w-5 rounded-full"
              startColor="bg-gray-300"
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default ChartSkeleton;

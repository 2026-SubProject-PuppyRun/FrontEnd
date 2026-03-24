import React from "react";
import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";

const WalkScoreSkeleton = () => {
  return (
    <View className="m-4 gap-4">
      <Skeleton
        variant="rounded"
        className="h-16 w-full"
        startColor="bg-gray-200"
      />
      <Skeleton
        variant="rounded"
        className="h-52 w-full"
        startColor="bg-gray-200"
      />
      <Skeleton
        variant="rounded"
        className="h-20 w-full"
        startColor="bg-gray-200"
      />
      <Skeleton
        variant="rounded"
        className="h-40 w-full"
        startColor="bg-gray-200"
      />
    </View>
  );
};

export default WalkScoreSkeleton;

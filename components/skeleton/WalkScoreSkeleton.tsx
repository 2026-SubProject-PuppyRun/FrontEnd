import React from "react";
import { View } from "react-native";
import { Skeleton } from "../ui/skeleton";

const WalkScoreSkeleton = () => {
  return (
    <View className="gap-4 px-6 pb-4">
      <Skeleton variant="rounded" className="h-5 w-32" startColor="bg-gray-200" />
      <Skeleton
        variant="rounded"
        className="h-16 w-full rounded-3xl"
        startColor="bg-gray-200"
      />
      <Skeleton
        variant="rounded"
        className="h-52 w-full rounded-3xl"
        startColor="bg-gray-200"
      />
      <Skeleton
        variant="rounded"
        className="h-28 w-full rounded-3xl"
        startColor="bg-gray-200"
      />
      <Skeleton
        variant="rounded"
        className="h-36 w-full rounded-3xl"
        startColor="bg-gray-200"
      />
    </View>
  );
};

export default WalkScoreSkeleton;

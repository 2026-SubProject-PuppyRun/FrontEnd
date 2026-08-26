import { RUN_SUMMARY_CARD_HEIGHT } from "@/components/board/HomeDashBoard/RunSummaryBoard";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { View } from "react-native";

const BOX_BORDER_COLOR = "rgba(13, 15, 27, 0.14)";
const PHOTO_WIDTH = 100;
const PHOTO_HEIGHT = 132;

const FieldSkeleton = () => (
  <View className="min-w-0 flex-1">
    <Skeleton
      variant="rounded"
      className="h-2.5 w-14 rounded-sm"
      startColor="bg-gray-200"
    />
    <Skeleton
      variant="rounded"
      className="mt-2 h-4 w-16 rounded-sm"
      startColor="bg-gray-200"
    />
  </View>
);

const RunSummarySkeleton = () => {
  return (
    <View
      className="rounded-3xl p-1.5"
      style={{
        height: RUN_SUMMARY_CARD_HEIGHT,
        backgroundColor: "rgba(242, 88, 87, 0.12)",
        borderWidth: 1,
        borderColor: BOX_BORDER_COLOR,
      }}
    >
      <View
        className="h-full flex-col overflow-hidden rounded-2xl bg-white"
        style={{
          borderWidth: 1,
          borderColor: BOX_BORDER_COLOR,
        }}
      >
        <View
          className="flex-row items-center justify-between border-b px-4 pb-2.5 pt-3"
          style={{ borderColor: BOX_BORDER_COLOR }}
        >
          <View className="min-w-0 flex-1 pr-2">
            <Skeleton
              variant="rounded"
              className="h-3 w-28 rounded-sm"
              startColor="bg-gray-200"
            />
            <Skeleton
              variant="rounded"
              className="mt-2 h-2.5 w-24 rounded-sm"
              startColor="bg-gray-200"
            />
          </View>
          <Skeleton
            variant="rounded"
            className="h-3 w-12 rounded-sm"
            startColor="bg-gray-200"
          />
        </View>

        <View className="flex-1 justify-center px-3 py-3">
          <View className="flex-row items-start gap-3">
            <Skeleton
              variant="rounded"
              className="shrink-0 rounded-sm"
              startColor="bg-gray-200"
              style={{ width: PHOTO_WIDTH, height: PHOTO_HEIGHT }}
            />

            <View className="min-w-0 flex-1 gap-3">
              <View className="flex-row gap-3">
                <FieldSkeleton />
                <FieldSkeleton />
              </View>
              <View className="flex-row items-end gap-3">
                <FieldSkeleton />
                <View className="min-w-0 flex-1">
                  <Skeleton
                    variant="rounded"
                    className="h-2.5 w-10 rounded-sm"
                    startColor="bg-gray-200"
                  />
                  <Skeleton
                    variant="rounded"
                    className="mt-2 h-4 w-20 rounded-sm"
                    startColor="bg-gray-200"
                  />
                </View>
              </View>
            </View>
          </View>
        </View>

        <View
          className="border-t px-4 py-2"
          style={{
            borderColor: BOX_BORDER_COLOR,
            backgroundColor: "#FAFAFA",
          }}
        >
          <Skeleton
            variant="rounded"
            className="h-2 w-48 rounded-sm"
            startColor="bg-gray-200"
          />
        </View>
      </View>
    </View>
  );
};

export default RunSummarySkeleton;

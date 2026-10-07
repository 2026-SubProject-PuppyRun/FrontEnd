import { getRunSummaryLayout } from "@/components/board/HomeDashBoard/RunSummaryBoard";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useWindowDimensions, View } from "react-native";

const BOX_BORDER_COLOR = "rgba(13, 15, 27, 0.14)";

const FieldSkeleton = () => (
  <View className="min-w-0 flex-1">
    <Skeleton
      variant="rounded"
      className="h-2 w-10 rounded-sm"
      startColor="bg-gray-200"
    />
    <Skeleton
      variant="rounded"
      className="mt-1.5 h-3.5 w-12 rounded-sm"
      startColor="bg-gray-200"
    />
  </View>
);

const RunSummarySkeleton = () => {
  const { width: windowWidth } = useWindowDimensions();
  const layout = getRunSummaryLayout(windowWidth);

  return (
    <View
      className="rounded-3xl p-1.5"
      style={{
        height: layout.cardHeight,
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
          className="flex-row items-center justify-between border-b px-4 pb-2 pt-2.5"
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
              className="mt-1.5 h-2.5 w-24 rounded-sm"
              startColor="bg-gray-200"
            />
          </View>
          <Skeleton
            variant="rounded"
            className="h-3 w-12 rounded-sm"
            startColor="bg-gray-200"
          />
        </View>

        <View className="flex-1 justify-center px-3 py-2.5">
          <View
            className="flex-row items-stretch"
            style={{ gap: layout.gap }}
          >
            <Skeleton
              variant="rounded"
              className="shrink-0 self-center rounded-sm"
              startColor="bg-gray-200"
              style={{
                width: layout.photoWidth,
                height: layout.photoHeight,
              }}
            />

            <View
              className="min-w-0 flex-1 justify-between"
              style={{ gap: layout.gap }}
            >
              <View
                className="flex-row items-center"
                style={{ gap: layout.gap }}
              >
                <View className="min-w-0 flex-1">
                  <Skeleton
                    variant="rounded"
                    className="h-2 w-10 rounded-sm"
                    startColor="bg-gray-200"
                  />
                  <Skeleton
                    variant="rounded"
                    className="mt-1.5 h-4 w-24 rounded-sm"
                    startColor="bg-gray-200"
                  />
                </View>
                <Skeleton
                  variant="rounded"
                  className="shrink-0 rounded-full"
                  startColor="bg-gray-200"
                  style={{
                    width: layout.spriteBoxSize,
                    height: layout.spriteBoxSize,
                  }}
                />
              </View>

              <View className="w-full flex-row" style={{ gap: layout.gap }}>
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
              </View>
            </View>
          </View>
        </View>

        <View
          className="border-t px-4 py-1.5"
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

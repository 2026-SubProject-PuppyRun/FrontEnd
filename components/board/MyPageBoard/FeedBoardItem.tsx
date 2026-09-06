import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, useWindowDimensions } from "react-native";

interface FeedBoardItemProps {
  id: string;
  contents?: string;
  imgUrl?: string;
}

const FeedBoardItem = (item: FeedBoardItemProps) => {
  const { id, imgUrl } = item;
  const width = useWindowDimensions().width;
  const gap = 6;
  const horizontalPad = 24;
  const itemWidth = (width - horizontalPad * 2 - gap * 2) / 3;
  const router = useRouter();

  return (
    <Pressable
      style={{
        width: itemWidth,
        aspectRatio: 4 / 5,
        marginBottom: gap,
        borderRadius: 12,
        overflow: "hidden",
      }}
      onPress={() => router.push(`/mypage/feed/${id}`)}
    >
      <Image
        source={{ uri: imgUrl }}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: "#FFFFFF",
        }}
        contentFit="cover"
        transition={200}
      />
    </Pressable>
  );
};

export default FeedBoardItem;

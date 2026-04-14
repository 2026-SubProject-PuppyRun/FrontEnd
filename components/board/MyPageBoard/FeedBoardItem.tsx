import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, Text, useWindowDimensions } from "react-native";

interface FeedBoardItemProps {
  id: string;
  contents?: string;
  imgUrl?: string;
}

const FeedBoardItem = (item: FeedBoardItemProps) => {
  const { id, contents, imgUrl } = item;
  const width = useWindowDimensions().width;
  const itemWidth = width / 3;
  const router = useRouter();

  return (
    <Pressable
      style={{ width: itemWidth, aspectRatio: 4 / 5, padding: 2 }}
      onPress={() => router.push(`/mypage/feed/${id}`)}
    >
      <Image
        source={{ uri: imgUrl }}
        style={{
          flex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: "#f1f5f9",
        }}
        contentFit="cover"
        transition={200}
      />

      <Text
        style={{ position: "absolute", bottom: 5, left: 5, color: "white" }}
      >
        {id}
      </Text>
    </Pressable>
  );
};

export default FeedBoardItem;

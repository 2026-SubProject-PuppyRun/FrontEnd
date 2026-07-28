import FeedBoardItem from "@/components/board/MyPageBoard/FeedBoardItem";
import MyPageProfileCard from "@/components/board/MyPageBoard/MyPageProfileCard";
import UserBoard from "@/components/board/MyPageBoard/UserBoard";
import { Text } from "@/components/ui/text";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { View } from "react-native";

const dummyFeedList = [
  {
    id: "1",
    content: "첫 번째 피드입니다.",
    imgUrl: "https://picsum.photos/1080/1350?random=1",
  },
  {
    id: "2",
    content: "두 번째 피드입니다.",
    imgUrl: "https://picsum.photos/1080/1350?random=2",
  },
  {
    id: "3",
    content: "세 번째 피드입니다.",
    imgUrl: "https://picsum.photos/1080/1350?random=3",
  },
  {
    id: "4",
    content: "네 번째 피드입니다.",
    imgUrl: "https://picsum.photos/1080/1350?random=4",
  },
  {
    id: "5",
    content: "다섯 번째 피드입니다.",
    imgUrl: "https://picsum.photos/1080/1350?random=5",
  },
  {
    id: "6",
    content: "여섯 번째 피드입니다.",
    imgUrl: "https://picsum.photos/1080/1350?random=6",
  },
];

const loadMoreDummyFeedList = [
  {
    id: "7",
    content: "일곱 번째 피드입니다.",
    imgUrl: "https://picsum.photos/1080/1350?random=7",
  },
  {
    id: "8",
    content: "여덟 번째 피드입니다.",
    imgUrl: "https://picsum.photos/1080/1350?random=8",
  },
  {
    id: "9",
    content: "아홉 번째 피드입니다.",
    imgUrl: "https://picsum.photos/1080/1350?random=9",
  },
  {
    id: "10",
    content: "열 번째 피드입니다.",
    imgUrl: "https://picsum.photos/1080/1350?random=10",
  },
  {
    id: "11",
    content: "열한 번째 피드입니다.",
    imgUrl: "https://picsum.photos/1080/1350?random=11",
  },
  {
    id: "12",
    content: "열두 번째 피드입니다.",
    imgUrl: "https://picsum.photos/1080/1350?random=12",
  },
];

const MyPageBody = () => {
  const [feedList, setFeedList] = useState(dummyFeedList);

  const loadFeedList = async () => {
    const fetchLoadFeedList = () =>
      new Promise((resolve) => {
        setTimeout(() => resolve(loadMoreDummyFeedList), 1000);
      });

    const newFeedList = await fetchLoadFeedList();
    setFeedList((prevFeedList) => [
      ...prevFeedList,
      ...(newFeedList as typeof dummyFeedList),
    ]);
  };

  const ListHeader = (
    <>
      <MyPageProfileCard />
      <UserBoard />
      <View className="mx-2 mb-3 mt-1">
        <Text className="text-base font-semibold text-[#0D0F1B]">
          산책 기록
        </Text>
        <Text className="mt-0.5 text-sm text-gray-500">
          최근 산책 인증샷을 모아봤어요
        </Text>
      </View>
    </>
  );

  return (
    <View className="flex-1">
      <FlashList
        ListHeaderComponent={ListHeader}
        data={feedList}
        renderItem={({ item }) => <FeedBoardItem {...item} />}
        onEndReached={loadFeedList}
        onEndReachedThreshold={0.5}
        numColumns={3}
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 24 }}
      />
    </View>
  );
};

export default MyPageBody;

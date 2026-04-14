import FeedDetailBody from "@/components/body/FeedDetailBody";
import Header from "@/components/header/Header";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

export interface FeedDetail {
  id: string;
  contents?: string;
  title?: string;
  selfieImgUrl: string;
  routeImgUrl: string;
  pace: string;
  distance: number;
  duration: number;
  date: Date;
}

const FeedDetailIndex = () => {
  const id = useLocalSearchParams().id;
  const [feedDetail, setFeedDetail] = useState<FeedDetail | null>(null);

  const dummyFeedDetail: FeedDetail = {
    id: `${id}`,
    selfieImgUrl: "https://picsum.photos/1080/1350?random=1",
    routeImgUrl: "https://picsum.photos/1080/1350?random=2",
    pace: "10'00\"",
    distance: 5000,
    duration: 3000,
    date: new Date(),
    title: "멍멍이와 함께한 즐거운 러닝",
    contents:
      "오늘은 멍멍이와 함께 공원에서 러닝을 했어요! 날씨도 좋고, 멍멍이도 신나서 정말 즐거운 시간이었답니다. 앞으로도 자주 함께 달려야겠어요!",
  };
  useEffect(() => {
    const fetchFeedDetail = async () => {
      setFeedDetail(dummyFeedDetail);
    };
    fetchFeedDetail();
  }, []);

  const runDate =
    feedDetail?.date.getFullYear() +
    ". " +
    ((feedDetail?.date.getMonth() || 0) + 1) +
    ". " +
    feedDetail?.date.getDate();

  if (!feedDetail) {
    return (
      <View className="flex-1 items-center justify-center">
        <Spinner size="large" />
      </View>
    );
  }
  return (
    <View>
      <Header title={runDate + " 산책" || ""}>
        <Button>
          <ButtonText>공유하기</ButtonText>
        </Button>
      </Header>
      <FeedDetailBody {...feedDetail} />
    </View>
  );
};

export default FeedDetailIndex;

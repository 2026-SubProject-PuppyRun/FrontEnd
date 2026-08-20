import FeedBoardItem from "@/components/board/MyPageBoard/FeedBoardItem";
import MyPageProfileCard from "@/components/board/MyPageBoard/MyPageProfileCard";
import UserBoard from "@/components/board/MyPageBoard/UserBoard";
import { Text } from "@/components/ui/text";
import { useTrackingListQuery } from "@/util/api";
import { FlashList } from "@shopify/flash-list";
import { ActivityIndicator, RefreshControl, View } from "react-native";

const MyPageBody = () => {
  const {
    data: feedList = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useTrackingListQuery();

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

  const ListEmpty = (
    <View className="items-center justify-center py-12">
      {isLoading ? (
        <ActivityIndicator color="#F25857" />
      ) : isError ? (
        <Text
          className="text-center text-sm text-gray-500"
          onPress={() => refetch()}
        >
          피드를 불러오지 못했어요.{"\n"}탭해서 다시 시도해 주세요.
        </Text>
      ) : (
        <Text className="text-center text-sm text-gray-400">
          아직 산책 기록이 없어요
        </Text>
      )}
    </View>
  );

  return (
    <View className="flex-1">
      <FlashList
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        data={feedList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeedBoardItem {...item} />}
        numColumns={3}
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 24 }}
        refreshing={isFetching && !isLoading}
        onRefresh={refetch}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor="#F25857"
            colors={["#F25857"]}
          />
        }
        // TODO: 무한 스크롤 추가 예정
      />
    </View>
  );
};

export default MyPageBody;

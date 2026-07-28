import FeedRunStats from "@/components/board/MyPageBoard/FeedRunStats";
import SelfieAndRouteSwiper from "@/components/swiper/SelfieAndRouteSwiper";
import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { CheckCircleIcon, EditIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { FeedDetail } from "@/types/feed";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

interface FeedDetailBodyProps extends FeedDetail {}

const FeedDetailBody = (props: FeedDetailBodyProps) => {
  const [editForm, setEditForm] = useState({
    title: props.title || "",
    contents: props.contents || "",
  });

  const router = useRouter();
  const { showToast } = useCustomToast();

  const handleSubmit = async () => {
    const payload = {
      title: editForm.title,
      contents: editForm.contents,
    };

    console.log("저장 데이터:", payload);
    showToast({ message: "피드가 저장되었습니다!", icon: CheckCircleIcon });

    router.back();
  };

  return (
    <>
      <View className="mx-6 mb-4 mt-2 rounded-3xl bg-white px-5 py-4 shadow-sm">
        <Text className="mb-2 text-sm font-semibold text-gray-500">제목</Text>
        <Input variant="underlined" className="border-outline-200">
          <InputField
            placeholder="제목을 입력해주세요..."
            value={editForm.title}
            onChangeText={(text) =>
              setEditForm((prev) => ({ ...prev, title: text }))
            }
            className="text-[#0D0F1B]"
          />
          <InputSlot className="pl-3">
            <InputIcon as={EditIcon} />
          </InputSlot>
        </Input>
      </View>

      <SelfieAndRouteSwiper
        routeImgUrl={props.routeImgUrl}
        selfieImgUrl={props.selfieImgUrl}
      />

      <FeedRunStats
        pace={props.pace}
        distance={props.distance}
        duration={props.duration}
      />

      <View className="mx-6 mt-4 rounded-3xl bg-white px-5 py-4 shadow-sm">
        <Text className="mb-2 text-sm font-semibold text-gray-500">일기</Text>
        <Textarea className="min-h-[140px] border-0 bg-transparent " size="md">
          <TextareaInput
            placeholder="산책 내용을 작성해주세요..."
            placeholderTextColor="#9CA3AF"
            value={editForm.contents}
            onChangeText={(text) =>
              setEditForm((prev) => ({ ...prev, contents: text }))
            }
            multiline
            textAlignVertical="top"
            className="min-h-[120px] text-base"
            style={{ color: "#0D0F1B" }}
          />
        </Textarea>
      </View>

      <View className="mx-6 mb-8 mt-6">
        <RedButtonSurface
          borderRadius={30}
          backgroundColor="#F25857"
          shadowPadding={8}
          hostStyle={{ width: "100%" }}
          style={{ width: "100%", height: 64 }}
        >
          <Pressable
            onPress={handleSubmit}
            className="h-full w-full items-center justify-center"
            style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
          >
            <Text className="text-lg font-semibold text-white">저장 하기</Text>
          </Pressable>
        </RedButtonSurface>
      </View>
    </>
  );
};

export default FeedDetailBody;

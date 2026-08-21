import SelfieRouteCard from "@/components/swiper/SelfieRouteCard";
import AlarmSetSwitch from "@/components/switch/AlarmSetSwitch";
import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { CheckCircleIcon, CloseIcon, EditIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { FeedDetail, FeedVisibility } from "@/types/feed";
import {
  ApiError,
  useUpdateTrackingVisibilityMutation,
} from "@/util/api";
import { formatTime } from "@/util/run/formatTime";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

interface FeedDetailBodyProps extends FeedDetail {}

const FeedDetailBody = (props: FeedDetailBodyProps) => {
  const [editForm, setEditForm] = useState({
    title: props.title || "",
    contents: props.contents || "",
  });
  const [isPublic, setIsPublic] = useState(props.visibility === "PUBLIC");

  const router = useRouter();
  const { showToast } = useCustomToast();
  const updateVisibilityMutation = useUpdateTrackingVisibilityMutation();
  const isSubmitting = updateVisibilityMutation.isPending;

  const handleSubmit = async () => {
    if (isSubmitting) return;

    const visibility: FeedVisibility = isPublic ? "PUBLIC" : "PRIVATE";

    try {
      await updateVisibilityMutation.mutateAsync({
        trackingId: props.id,
        visibility,
      });

      showToast({ message: "피드가 저장되었습니다!", icon: CheckCircleIcon });
      router.back();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "공개 여부 저장에 실패했습니다.";
      showToast({ message, icon: CloseIcon });
    }
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
            editable={!isSubmitting}
            className="text-[#0D0F1B]"
          />
          <InputSlot className="pl-3">
            <InputIcon as={EditIcon} />
          </InputSlot>
        </Input>
      </View>

      <SelfieRouteCard
        route={props.route}
        routeImgUrl={props.routeImgUrl}
        selfieImgUrl={props.selfieImgUrl}
        captureRoute={false}
        stats={{
          pace: props.pace,
          distanceLabel: `${(props.distance / 1000).toFixed(2)}km`,
          timeLabel: formatTime(props.duration),
        }}
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
            editable={!isSubmitting}
            multiline
            textAlignVertical="top"
            className="min-h-[120px] text-base"
            style={{ color: "#0D0F1B" }}
          />
        </Textarea>
      </View>

      <View className="mx-6 mt-4 rounded-3xl bg-white px-5 py-4 shadow-sm">
        <AlarmSetSwitch
          alarmName="루트 공개"
          description={
            isPublic
              ? "추천 루트에 이 산책 루트가 노출될 수 있어요"
              : "비공개로 두면 추천 루트에 노출되지 않아요"
          }
          isEnabled={isPublic}
          onToggle={() => setIsPublic((prev) => !prev)}
          disabled={isSubmitting}
        />
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
            disabled={isSubmitting}
            className="h-full w-full items-center justify-center"
            style={({ pressed }) =>
              pressed || isSubmitting ? { opacity: 0.85 } : undefined
            }
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-lg font-semibold text-white">저장 하기</Text>
            )}
          </Pressable>
        </RedButtonSurface>
      </View>
    </>
  );
};

export default FeedDetailBody;

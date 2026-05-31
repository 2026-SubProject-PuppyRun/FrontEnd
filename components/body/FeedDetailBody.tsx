import { FeedDetail } from "@/app/(tabs)/mypage/feed/[id]";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { formatTime } from "@/util/run";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import SelfieAndRouteSwiper from "../swiper/SelfieAndRouteSwiper";
import { Button, ButtonText } from "../ui/button";
import { HStack } from "../ui/hstack";
import { CheckCircleIcon } from "../ui/icon";
import { Input, InputField } from "../ui/input";
import { Text } from "../ui/text";
import { Textarea, TextareaInput } from "../ui/textarea";
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

    // TODO: 서버 전송
  };

  return (
    <ScrollView>
      <Input className="m-4" variant="underlined" size="xl">
        <InputField
          className="text-black"
          type="text"
          value={editForm.title}
          onChangeText={(text: string) =>
            setEditForm((prev) => ({ ...prev, title: text }))
          }
        />
      </Input>

      <SelfieAndRouteSwiper
        routeImgUrl={props.routeImgUrl}
        selfieImgUrl={props.selfieImgUrl}
      />
      <HStack space="xl" className=" self-center py-4">
        <Text size="3xl" className="text-black">
          {props.pace}
        </Text>
        <Text size="3xl" className="text-black">
          {((props.distance ?? 0) / 1000).toFixed(2)}km
        </Text>
        <Text size="3xl" className="text-black">
          {formatTime(props.duration ?? 0)}
        </Text>
      </HStack>
      <Textarea className="border-0 bg-transparent px-4" size="xl">
        <TextareaInput
          className="!text-black"
          value={editForm.contents}
          onChangeText={(text: string) =>
            setEditForm((prev) => ({ ...prev, contents: text }))
          }
        />
      </Textarea>
      <Button className="m-4" size="lg" onPress={handleSubmit}>
        <ButtonText>저장하기</ButtonText>
      </Button>
    </ScrollView>
  );
};

export default FeedDetailBody;

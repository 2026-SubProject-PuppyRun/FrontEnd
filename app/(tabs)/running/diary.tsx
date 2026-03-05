import RunResultBoard from "@/components/board/RunResultBoard";
import Header from "@/components/header/Header";
import CustomAlert from "@/components/modal/CustomAlert";
import SelfieAndRouteSwiper from "@/components/swiper/SelfieAndRouteSwiper";
import { Button, ButtonText } from "@/components/ui/button";
import { EditIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { useRunStore } from "@/store/useRunStore";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Diary = () => {
  const insets = useSafeAreaInsets();
  const runData = useRunStore((state) => state.runData);

  const year = runData?.stopTime?.getFullYear() ?? new Date().getFullYear();
  const month = runData?.stopTime
    ? runData.stopTime.getMonth() + 1
    : new Date().getMonth() + 1;
  const day = runData?.stopTime?.getDate() ?? new Date().getDate();

  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const navigation = useNavigation();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const isSubmitRef = useRef(false);

  const onFormSubmit = async () => {
    try {
      isSubmitRef.current = true;
      await useRunStore.getState().submitRunData(title, contents);
      useRunStore.getState().resetRunData();
      router.replace("/");
    } catch (error) {
      console.error("데이터 제출 실패:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (isSubmitRef.current) return;
      e.preventDefault();
      setShowAlert(true);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-white">
      <Header>
        <Button onPress={onFormSubmit}>
          <ButtonText>저장 하기</ButtonText>
        </Button>
      </Header>
      <View className="mx-4">
        <Text className=" text-lx font-semibold">
          {`${year}.${month}.${day}`} 산책
        </Text>
        <Input variant="underlined">
          <InputField
            placeholder="제목을 입력해주세요..."
            value={title}
            onChangeText={setTitle}
            className="text-black"
          />
          <InputSlot className="pl-3">
            <InputIcon as={EditIcon} />
          </InputSlot>
        </Input>
      </View>
      <SelfieAndRouteSwiper />
      <RunResultBoard />
      <Textarea style={{ borderWidth: 0, borderColor: "transparent" }}>
        <TextareaInput
          placeholder="오늘의 산책 일기를 작성해주세요..."
          value={contents}
          onChangeText={setContents}
          style={{ color: "#000000" }}
        />
      </Textarea>
      <CustomAlert
        showAlertDialog={showAlert}
        handleClose={() => setShowAlert(false)}
        title="일기 작성종료"
        description="일기 작성을 정말 종료하시겠습니까? 기록은 임시 저장 됩니다."
        onConfirm={() => {
          isSubmitRef.current = true;
          useRunStore.getState().submitRunData(title, contents);
          useRunStore.getState().resetRunData();
          router.replace("/");
        }}
        confirmText="종료"
        cancelText="취소"
      />
    </View>
  );
};

export default Diary;

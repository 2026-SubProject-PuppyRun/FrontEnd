import DiaryRunStats from "@/components/board/RunBoard/DiaryRunStats";
import Header from "@/components/header/Header";
import CustomAlert from "@/components/modal/CustomAlert";
import SelfieAndRouteSwiper from "@/components/swiper/SelfieAndRouteSwiper";
import RedButtonSurface from "@/components/ui/RedButtonSurface";
import { EditIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import useNonNavbar from "@/hooks/use-non-navbar";
import { useRunStore } from "@/store/useRunStore";
import { useNavigation, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
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

  useNonNavbar();

  const onFormSubmit = async () => {
    try {
      isSubmitRef.current = true;
      await useRunStore.getState().submitRunData(title, contents);
      useRunStore.getState().resetRunData();
      router.replace("/");
    } catch (error) {
      console.error("데이터 제출 실패:", error);
      isSubmitRef.current = false;
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
    <View
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-[#F7F7F7]"
    >
      <Header showLogo logoWidth={189} logoHeight={50} />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-6"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="mx-6 mb-4 mt-4 rounded-3xl bg-white px-5 py-4 shadow-sm">
            <Text className="mb-2 text-base font-semibold text-[#0D0F1B]">
              {`${year}.${month}.${day}`} 산책
            </Text>
            <Input variant="underlined" className="border-outline-200">
              <InputField
                placeholder="제목을 입력해주세요..."
                value={title}
                onChangeText={setTitle}
                className="text-[#0D0F1B]"
              />
              <InputSlot className="pl-3">
                <InputIcon as={EditIcon} />
              </InputSlot>
            </Input>
          </View>

          <SelfieAndRouteSwiper />
          <DiaryRunStats />

          <View className="mx-6 mt-4 rounded-3xl bg-white px-5 py-4 shadow-sm">
            <Textarea
              className="min-h-[140px] border-0 bg-transparent"
              size="md"
            >
              <TextareaInput
                placeholder="오늘의 산책 일기를 작성해주세요..."
                placeholderTextColor="#9CA3AF"
                value={contents}
                onChangeText={setContents}
                multiline
                textAlignVertical="top"
                className="min-h-[120px] text-base"
                style={{ color: "#0D0F1B" }}
              />
            </Textarea>
          </View>
        </ScrollView>

        <View className="w-full px-6 pb-8 pt-2">
          <RedButtonSurface
            borderRadius={30}
            backgroundColor="#F25857"
            shadowPadding={8}
            hostStyle={{ width: "100%" }}
            style={{ width: "100%", height: 64 }}
          >
            <Pressable
              onPress={onFormSubmit}
              className="h-full w-full items-center justify-center"
              style={({ pressed }) => (pressed ? { opacity: 0.85 } : undefined)}
            >
              <Text className="text-lg font-semibold text-white">
                저장 하기
              </Text>
            </Pressable>
          </RedButtonSurface>
        </View>
      </KeyboardAvoidingView>

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

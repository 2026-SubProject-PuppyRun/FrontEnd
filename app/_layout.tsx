import "@/tasks/backgroundLocationTask";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import CustomAlert from "@/components/modal/CustomAlert";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { DUMMY_PET_LIST } from "@/constants/dummyPetList";
import { usePetStore } from "@/store/usePetStore";
import { getFirebaseMessaging, initFCM } from "@/util/notification";
import notifee from "@notifee/react-native";
import { onMessage } from "@react-native-firebase/messaging";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Device from "expo-device";
import { useEffect, useState } from "react";
import { Linking } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function RootLayout() {
  const queryClient = new QueryClient();
  const setPetList = usePetStore((state) => state.setPetList);
  const [modalVisible, setModalVisible] = useState(false);
  const dummyBreedSignature = DUMMY_PET_LIST.map((p) => p.breedCode).join(",");

  useEffect(() => {
    const fetchPetList = async () => {
      // Todo API 연동 — 연동 전까지 더미 데이터 사용
      setPetList(DUMMY_PET_LIST, DUMMY_PET_LIST.length);
    };
    async function requestNotificationPermission() {
      const settings = await notifee.requestPermission();
      if (settings.authorizationStatus === 0) {
        // TODO: 유저에게 권한이 필요하다는 안내 모달 띄우기
        setModalVisible(true);
      }
    }
    requestNotificationPermission();
    fetchPetList();

    let unsubscribeForeground: (() => void) | undefined;

    if (Device.isDevice) {
      initFCM().catch((error) => {
        console.warn("FCM 초기화 실패:", error);
      });

      try {
        unsubscribeForeground = onMessage(
          getFirebaseMessaging(),
          async (remoteMessage) => {
            console.log("💌 [포그라운드] 수신됨:", remoteMessage);

            const channelId = await notifee.createChannel({
              id: "default",
              name: "Default Channel",
              importance: 4,
            });

            await notifee.displayNotification({
              title: remoteMessage.notification?.title,
              body: remoteMessage.notification?.body,
              android: {
                channelId,
                smallIcon: "ic_launcher",
                pressAction: {
                  id: "default",
                },
              },
            });
          },
        );
      } catch (error) {
        console.warn("FCM 포그라운드 리스너 등록 실패:", error);
      }
    }

    return () => {
      unsubscribeForeground?.();
    };
  }, [setPetList, dummyBreedSignature]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <GluestackUIProvider mode="dark">
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }} />
            <CustomAlert
              showAlertDialog={modalVisible}
              handleClose={() => setModalVisible(false)}
              title="알림 권한이 필요해요"
              description="퍼피런에서 알림을 받으려면 권한이 필요해요. 설정에서 권한을 허용해주세요."
              confirmText="설정으로 이동"
              cancelText="취소"
              onConfirm={() => {
                Linking.openSettings();
                setModalVisible(false);
              }}
            />
          </GestureHandlerRootView>
        </GluestackUIProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

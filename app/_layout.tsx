import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import CustomAlert from "@/components/modal/CustomAlert";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { Pet, usePetStore } from "@/store/usePetStore";
import { initFCM } from "@/util/initFCM";
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging"; // ★ 추가
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Device from "expo-device";
import { useEffect, useState } from "react";
import { Linking } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function RootLayout() {
  const queryClient = new QueryClient();
  const setPetList = usePetStore((state) => state.setPetList);
  const [modalVisible, setModalVisible] = useState(false);

  const dummyPetList: Pet[] = [
    {
      petId: "30f5151a-eb6e-4f15-9ed1-30fd15ed8e09",
      name: "두부",
      birthYear: "2021-05-20T00:00:00",
      weight: 4.5,
      color: "#FFFFF0",
      profileImageUrl: "https://picsum.photos/200/200?random=1",
      breedCode: "101",
      badgeCode: "000",
      gender: "M",
      isNeutered: true,
    },
    {
      petId: "d4563324-17d6-477e-a326-bd3d94ee50cd",
      name: "누렁이",
      birthYear: "2024-05-20T00:00:00",
      weight: 4.2,
      color: "#CD853F",
      profileImageUrl: "https://picsum.photos/200/200?random=2",
      breedCode: "101",
      badgeCode: "000",
      gender: "F",
      isNeutered: false,
    },
  ];

  useEffect(() => {
    const fetchPetList = async () => {
      //Todo API 연동
      setPetList(dummyPetList, 2);
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

    if (Device.isDevice) {
      initFCM();
    }

    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
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
    });

    return unsubscribe;
  }, []);

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
              description="푸푸런에서 알림을 받으려면 권한이 필요해요. 설정에서 권한을 허용해주세요."
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

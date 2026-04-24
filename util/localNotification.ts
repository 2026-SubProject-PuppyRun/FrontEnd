import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from "@notifee/react-native";

export interface LocalNotificationOptions {
  body: string;
  smallIcon: string;
}

export const scheduleLocalNotification = async (
  title: string,
  date: Date,
  options: LocalNotificationOptions,
  channelName: string,
) => {
  //1. 채널 생성
  const ChannelId = await notifee.createChannel({
    id: channelName,
    name: channelName,
    sound: "default",
    importance: AndroidImportance.DEFAULT,
  });
  //2. 알림 트리거 설정
  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    repeatFrequency: RepeatFrequency.WEEKLY,
  };
  //3. 알림 예약 요청
  const notificationId = await notifee.createTriggerNotification(
    {
      title,
      body: options.body,
      android: {
        channelId: ChannelId,
        smallIcon: options.smallIcon,
        importance: AndroidImportance.DEFAULT,
      },
      ios: {
        sound: "default",
      },
    },
    trigger,
  );
  return notificationId;
};

export const deleteLocalNotification = async (notificationId: string) => {
  await notifee.cancelNotification(notificationId);
};

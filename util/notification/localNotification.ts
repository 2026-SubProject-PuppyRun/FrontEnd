import notifee, {
  AndroidImportance,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from "@notifee/react-native";
import {
  APP_NOTIFICATION_COLOR,
  APP_NOTIFICATION_LARGE_ICON,
  APP_NOTIFICATION_SMALL_ICON,
} from "./androidNotificationIcon";

export const LOCAL_ALARM_CHANNEL_ID = "puppyrun_alarm_channel";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export interface LocalNotificationOptions {
  body: string;
  smallIcon?: string;
}

export type ScheduledLocalAlarm = {
  notificationId: string;
  title: string;
  dayOfWeek: string;
  time: Date;
};

export const scheduleLocalNotification = async (
  title: string,
  date: Date,
  options: LocalNotificationOptions,
  channelName: string = LOCAL_ALARM_CHANNEL_ID,
) => {
  const ChannelId = await notifee.createChannel({
    id: channelName,
    name: channelName,
    sound: "default",
    importance: AndroidImportance.DEFAULT,
  });

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    repeatFrequency: RepeatFrequency.WEEKLY,
  };

  const notificationId = await notifee.createTriggerNotification(
    {
      title,
      body: options.body,
      android: {
        channelId: ChannelId,
        smallIcon: options.smallIcon ?? APP_NOTIFICATION_SMALL_ICON,
        largeIcon: APP_NOTIFICATION_LARGE_ICON,
        color: APP_NOTIFICATION_COLOR,
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

/** Notifee에 예약된 로컬 알람 목록 */
export const getScheduledLocalAlarms = async (): Promise<
  ScheduledLocalAlarm[]
> => {
  const triggers = await notifee.getTriggerNotifications();

  const alarms = triggers
    .filter(({ trigger, notification }) => {
      if (trigger.type !== TriggerType.TIMESTAMP) return false;
      const channelId = notification.android?.channelId;
      return !channelId || channelId === LOCAL_ALARM_CHANNEL_ID;
    })
    .map(({ notification, trigger }) => {
      const timestamp = (trigger as TimestampTrigger).timestamp;
      const time = new Date(timestamp);
      const body = (notification.body ?? "").trim();
      const titleText = (notification.title ?? "").trim();

      return {
        notificationId: notification.id ?? "",
        title: body || titleText || "알람",
        dayOfWeek: DAY_LABELS[time.getDay()],
        time,
      } satisfies ScheduledLocalAlarm;
    })
    .filter((alarm) => Boolean(alarm.notificationId));

  return alarms.sort((a, b) => {
    const dayA = DAY_LABELS.indexOf(a.dayOfWeek as (typeof DAY_LABELS)[number]);
    const dayB = DAY_LABELS.indexOf(b.dayOfWeek as (typeof DAY_LABELS)[number]);
    if (dayA !== dayB) return dayA - dayB;
    return a.time.getTime() - b.time.getTime();
  });
};

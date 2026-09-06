/** Android 알림에 쓰는 앱 아이콘 (largeIcon) */
export const APP_NOTIFICATION_LARGE_ICON = require("@/assets/images/icon.png");

/** status bar용 drawable 리소스 이름 (withNotificationIcon 플러그인이 생성) */
export const APP_NOTIFICATION_SMALL_ICON = "notification_icon";

export const APP_NOTIFICATION_COLOR = "#F25857";

export const androidNotificationIcons = {
  smallIcon: APP_NOTIFICATION_SMALL_ICON,
  largeIcon: APP_NOTIFICATION_LARGE_ICON,
  color: APP_NOTIFICATION_COLOR,
} as const;

const {
  AndroidConfig,
  withAndroidColors,
  withAndroidManifest,
  withDangerousMod,
} = require("expo/config-plugins");
const { generateImageAsync } = require("@expo/image-utils");
const { existsSync, mkdirSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const ANDROID_RES_PATH = "android/app/src/main/res";
const ICON_NAME = "notification_icon";
const NOTIFICATION_COLOR = "#F25857";

/** Android status bar 알림 아이콘 기준 크기(dp) */
const BASELINE_SIZE = 24;

const DENSITIES = [
  { folder: "drawable-mdpi", scale: 1 },
  { folder: "drawable-hdpi", scale: 1.5 },
  { folder: "drawable-xhdpi", scale: 2 },
  { folder: "drawable-xxhdpi", scale: 3 },
  { folder: "drawable-xxxhdpi", scale: 4 },
];

const withNotificationIconDrawables = (config, icon) =>
  withDangerousMod(config, [
    "android",
    async (modConfig) => {
      const { projectRoot } = modConfig.modRequest;
      const src = resolve(projectRoot, icon);

      await Promise.all(
        DENSITIES.map(async ({ folder, scale }) => {
          const folderPath = resolve(projectRoot, ANDROID_RES_PATH, folder);
          if (!existsSync(folderPath)) {
            mkdirSync(folderPath, { recursive: true });
          }

          const size = BASELINE_SIZE * scale;
          const { source } = await generateImageAsync(
            { projectRoot, cacheType: "puppyrun-notification-icon" },
            {
              src,
              width: size,
              height: size,
              resizeMode: "contain",
              backgroundColor: "transparent",
            },
          );

          writeFileSync(resolve(folderPath, `${ICON_NAME}.png`), source);
        }),
      );

      return modConfig;
    },
  ]);

const withFirebaseDefaultNotificationIcon = (config) =>
  withAndroidManifest(config, (modConfig) => {
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(
      modConfig.modResults,
    );
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      application,
      "com.google.firebase.messaging.default_notification_icon",
      `@drawable/${ICON_NAME}`,
    );
    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      application,
      "com.google.firebase.messaging.default_notification_color",
      "@color/notification_color",
    );
    return modConfig;
  });

const withNotificationColor = (config) =>
  withAndroidColors(config, (modConfig) => {
    modConfig.modResults = AndroidConfig.Colors.assignColorValue(
      modConfig.modResults,
      {
        name: "notification_color",
        value: NOTIFICATION_COLOR,
      },
    );
    return modConfig;
  });

/**
 * notifee / FCM 알림 아이콘을 앱 아이콘 기준으로 맞춘다.
 *
 * - drawable/notification_icon: status bar smallIcon
 * - Firebase default_notification_icon / color: 백그라운드 시스템 푸시
 */
const withNotificationIcon = (config, { icon } = {}) => {
  if (!icon) return config;

  let next = withNotificationIconDrawables(config, icon);
  next = withNotificationColor(next);
  next = withFirebaseDefaultNotificationIcon(next);
  return next;
};

module.exports = withNotificationIcon;

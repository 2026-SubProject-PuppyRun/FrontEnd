const { generateImageAsync } = require("@expo/image-utils");
const { withDangerousMod } = require("expo/config-plugins");
const { existsSync, mkdirSync, writeFileSync } = require("fs");
const { resolve } = require("path");

const ANDROID_RES_PATH = "android/app/src/main/res";
const ICON_NAME = "notification_icon";

/** Android 알림 아이콘 기준 크기(dp) */
const BASELINE_SIZE = 24;

const DENSITIES = [
  { folder: "drawable-mdpi", scale: 1 },
  { folder: "drawable-hdpi", scale: 1.5 },
  { folder: "drawable-xhdpi", scale: 2 },
  { folder: "drawable-xxhdpi", scale: 3 },
  { folder: "drawable-xxxhdpi", scale: 4 },
];

/**
 * notifee의 smallIcon으로 쓸 아이콘을 density별 drawable 폴더에 생성.
 *
 * expo-notifications는 firebase-messaging 버전을 하드코딩해
 * @react-native-firebase/messaging과 충돌하므로 아이콘 생성만 직접 처리한다.
 */
const withNotificationIcon = (config, { icon } = {}) => {
  if (!icon) return config;

  return withDangerousMod(config, [
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
};

module.exports = withNotificationIcon;

module.exports = {
  expo: {
    name: "PuppyRun_FE",
    slug: "PuppyRun_FE",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "puppyrunfe",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.puppyrun",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
      googleServicesFile: "./google-services.json",
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.puppyrun",
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
      // googleServicesFile: "./GoogleService-Info.plist",
    },

    plugins: [
      "expo-router",
      "@react-native-firebase/app",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "expo-location",
        {
          locationWhenInUsePermission:
            "앱 사용 중 위치 접근을 허용하시겠습니까?",
          locationAlwaysAndWhenInUsePermission:
            "앱이 백그라운드에서도 위치를 사용할 수 있도록 허용하시겠습니까?",
          isAndroidBackgroundLocationEnabled: true,
          isAndroidForegroundServiceEnabled: true,
        },
      ],
      // [
      //   "react-native-maps",
      //   {
      //     iosGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      //     androidGoogleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      //   },
      // ],
      [
        "expo-build-properties",
        {
          android: {
            useFirebaseAndroidCore: true,
          },
        },
      ],
    ],
    ignoreWarnings: [
      "SafeAreaView has been deprecated and will be removed in a future release. Please use 'react-native-safe-area-context' instead. See https://github.com/th3rdwave/react-native-safe-area-context",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      eas: {
        projectId: "348e8009-69db-4728-9bcd-70956396ead3",
      },
    },
  },
};

const { withProjectBuildGradle } = require("expo/config-plugins");

const withNotifeeBuildGradle = (config) => {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      let buildGradle = config.modResults.contents;
      const notifeeMaven = `maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }`;

      if (!buildGradle.includes(notifeeMaven)) {
        buildGradle = buildGradle.replace(
          /allprojects\s*\{\s*repositories\s*\{/,
          `allprojects {\n  repositories {\n    ${notifeeMaven}`,
        );
      }

      config.modResults.contents = buildGradle;
    }
    return config;
  });
};

module.exports = withNotifeeBuildGradle;

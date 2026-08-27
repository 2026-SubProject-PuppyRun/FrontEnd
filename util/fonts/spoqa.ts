/** expo-font에 등록한 스포카 한 산스 네오 family 이름 */
export const SPOQA_FONTS = {
  thin: "SpoqaHanSansNeo-Thin",
  light: "SpoqaHanSansNeo-Light",
  regular: "SpoqaHanSansNeo-Regular",
  medium: "SpoqaHanSansNeo-Medium",
  bold: "SpoqaHanSansNeo-Bold",
} as const;

/** useFonts()에 넘길 맵 (TTF subset — 앱에 필요한 경량 파일) */
export const spoqaFontMap = {
  [SPOQA_FONTS.thin]: require("@/assets/fonts/SpoqaHanSansNeo_all/SpoqaHanSansNeo_TTF_subset/SpoqaHanSansNeo-Thin.ttf"),
  [SPOQA_FONTS.light]: require("@/assets/fonts/SpoqaHanSansNeo_all/SpoqaHanSansNeo_TTF_subset/SpoqaHanSansNeo-Light.ttf"),
  [SPOQA_FONTS.regular]: require("@/assets/fonts/SpoqaHanSansNeo_all/SpoqaHanSansNeo_TTF_subset/SpoqaHanSansNeo-Regular.ttf"),
  [SPOQA_FONTS.medium]: require("@/assets/fonts/SpoqaHanSansNeo_all/SpoqaHanSansNeo_TTF_subset/SpoqaHanSansNeo-Medium.ttf"),
  [SPOQA_FONTS.bold]: require("@/assets/fonts/SpoqaHanSansNeo_all/SpoqaHanSansNeo_TTF_subset/SpoqaHanSansNeo-Bold.ttf"),
};

/**
 * RN은 커스텀 폰트에서 fontWeight만으로 Bold 파일을 고르지 못함.
 * className / bold prop 기준으로 family를 고른다.
 */
export const resolveSpoqaFontFamily = (
  className?: string,
  bold?: boolean,
): string => {
  const cn = className ?? "";

  if (bold || /\bfont-(bold|extrabold|black|extrablack)\b/.test(cn)) {
    return SPOQA_FONTS.bold;
  }
  if (/\bfont-(semibold|medium)\b/.test(cn)) {
    return SPOQA_FONTS.medium;
  }
  if (/\bfont-light\b/.test(cn)) {
    return SPOQA_FONTS.light;
  }
  if (/\bfont-thin\b/.test(cn)) {
    return SPOQA_FONTS.thin;
  }

  return SPOQA_FONTS.regular;
};

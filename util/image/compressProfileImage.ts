import * as ImageManipulator from "expo-image-manipulator";

const PROFILE_MAX_WIDTH = 1080;
const PROFILE_COMPRESS = 0.7;

/**
 * 프로필 업로드용 이미지 리사이즈·압축 (JPEG).
 * 서버 "사진 사이즈가 큽니다" 반려를 줄이기 위함.
 */
export const compressProfileImage = async (uri: string): Promise<string> => {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: PROFILE_MAX_WIDTH } }],
    {
      compress: PROFILE_COMPRESS,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );
  return result.uri;
};

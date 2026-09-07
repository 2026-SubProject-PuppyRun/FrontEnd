import * as ImageManipulator from "expo-image-manipulator";

const PROFILE_MAX_WIDTH = 720;
const PROFILE_COMPRESS = 0.5;

/**
 * 업로드용 이미지 리사이즈·압축 (JPEG).
 * 프로필·셀피 등 서버 용량 제한 회피용.
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

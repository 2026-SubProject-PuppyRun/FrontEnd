import { appendJsonRequestPart } from "../core/appendJsonRequestPart";
import { apiDelete, apiPostForm, apiPut } from "../core/client";

/** 일기 weather — 값은 모두 문자열 코드 */
export type DiaryWeather = {
  temp: string;
  sky: string;
  pty: string;
};

/** POST /diaries 의 request JSON 파트 */
export type CreateDiaryRequest = {
  tracking_id: string;
  writing_time: string;
  title: string;
  content: string;
  weather: DiaryWeather;
};

/** PUT /diaries/{id} — 일기 수정 요청 */
export type UpdateDiaryRequest = {
  title: string;
  content: string;
  weather: DiaryWeather;
};

/** 일기 수정 응답 */
export type UpdateDiaryResponse = {
  diary_id: string;
  tracking_id: string;
  writing_time: string;
  title: string;
  content: string;
  weather: DiaryWeather;
};

export type UpdateDiaryParams = {
  diaryId: string;
  title: string;
  content: string;
  weather: DiaryWeather;
};

export type DiaryImage = {
  uri: string;
  name?: string;
  type?: string;
};

export type CreateDiaryParams = {
  request: CreateDiaryRequest;
  images?: DiaryImage[];
};

/** 일기 등록 응답 */
export type CreateDiaryResponse = {
  diary_id: string;
  tracking_id: string;
  writing_time: string;
  title: string;
  content: string;
  weather: DiaryWeather;
};

const guessImageMeta = (uri: string, index: number) => {
  const lower = uri.toLowerCase();
  if (lower.includes(".png")) {
    return { name: `image_${index}.png`, type: "image/png" };
  }
  if (lower.includes(".webp")) {
    return { name: `image_${index}.webp`, type: "image/webp" };
  }
  if (lower.includes(".heic") || lower.includes(".heif")) {
    return { name: `image_${index}.heic`, type: "image/heic" };
  }
  return { name: `image_${index}.jpg`, type: "image/jpeg" };
};

/**
 * 산책 일기 등록
 * POST /diaries (multipart/form-data)
 * - request: 일기 JSON
 * - images: 업로드 파일
 */
export const createDiary = ({
  request,
  images = [],
}: CreateDiaryParams) => {
  const formData = new FormData();
  appendJsonRequestPart(formData, request, "request");

  images.forEach((image, index) => {
    const meta = guessImageMeta(image.uri, index);
    formData.append("images", {
      uri: image.uri,
      name: image.name ?? meta.name,
      type: image.type ?? meta.type,
    } as unknown as Blob);
  });

  return apiPostForm<CreateDiaryResponse>("/diaries", formData);
};

/**
 * 산책 일기 수정
 * PUT /diaries/{id}
 */
export const updateDiary = (
  diaryId: string,
  request: UpdateDiaryRequest,
) =>
  apiPut<UpdateDiaryResponse>(
    `/diaries/${encodeURIComponent(diaryId)}`,
    request,
  );

/**
 * 산책 일기 삭제
 * DELETE /diaries/{id}
 */
export const deleteDiary = (diaryId: string) =>
  apiDelete<void>(`/diaries/${encodeURIComponent(diaryId)}`);

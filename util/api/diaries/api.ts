import { apiDelete, apiPost, apiPut } from "../core/client";

/** 일기 weather — 값은 모두 문자열 코드 */
export type DiaryWeather = {
  temp: string;
  sky: string;
  pty: string;
};

/** POST /diaries 요청 JSON */
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

/** 일기 등록 응답 */
export type CreateDiaryResponse = {
  diary_id: string;
  tracking_id: string;
  writing_time: string;
  title: string;
  content: string;
  weather: DiaryWeather;
};

/**
 * 산책 일기 등록
 * POST /diaries (application/json)
 */
export const createDiary = (request: CreateDiaryRequest) =>
  apiPost<CreateDiaryResponse>("/diaries", request);

/**
 * 산책 일기 수정
 * PUT /diaries/{id}
 */
export const updateDiary = (diaryId: string, request: UpdateDiaryRequest) =>
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

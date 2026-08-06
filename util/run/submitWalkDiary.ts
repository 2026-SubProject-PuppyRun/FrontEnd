import { createDiary, type CreateDiaryResponse } from "@/util/api/diaries";
import { useRunStore } from "@/store/useRunStore";
import { useWeatherStore } from "@/store/useWeatherStore";

const pad = (n: number) => String(n).padStart(2, "0");

/** LocalDateTime 포맷: 2026-08-02T11:00:00 */
export const formatLocalDateTime = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

const toImageParts = (...uris: (string | null | undefined)[]) =>
  uris
    .filter((uri): uri is string => Boolean(uri))
    .map((uri) => ({ uri }));

/**
 * 러닝 세션 → 산책 일기 등록
 * POST /diaries (multipart) — request JSON + images
 */
export const submitWalkDiary = async (
  title: string,
  content: string,
): Promise<CreateDiaryResponse> => {
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle) {
    throw new Error("제목을 입력해 주세요.");
  }
  if (trimmedTitle.length > 100) {
    throw new Error("제목은 100자 이하로 입력해 주세요.");
  }
  if (!trimmedContent) {
    throw new Error("일기 내용을 입력해 주세요.");
  }

  const runData = useRunStore.getState().runData;
  const trackingId = runData?.trackingId;
  if (!trackingId) {
    throw new Error("트래킹 정보가 없습니다. 셀피를 먼저 저장해 주세요.");
  }

  const weather = useWeatherStore.getState().current;

  return createDiary({
    request: {
      tracking_id: trackingId,
      writing_time: formatLocalDateTime(new Date()),
      title: trimmedTitle,
      content: trimmedContent,
      weather: {
        temp: weather.temp != null ? String(Math.round(weather.temp)) : "0",
        sky: weather.sky != null ? String(weather.sky) : "1",
        pty: weather.pty != null ? String(weather.pty) : "0",
      },
    },
    images: toImageParts(runData.selfie, runData.routeImg),
  });
};

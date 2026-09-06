import { createDiary, type CreateDiaryResponse } from "@/util/api/diaries";
import { usePetStore } from "@/store/usePetStore";
import { useRunStore } from "@/store/useRunStore";
import { useWeatherStore } from "@/store/useWeatherStore";

const pad = (n: number) => String(n).padStart(2, "0");

/** LocalDateTime 포맷: 2026-08-02T11:00:00 */
export const formatLocalDateTime = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

/** 나중에 작성용 임시 일기 — 날짜 제목 + 함께한 반려견 이름 */
export const buildDeferredDiaryDraft = () => {
  const { runData, selectedPetIds } = useRunStore.getState();
  const petList = usePetStore.getState().petList ?? [];
  const date = runData?.stopTime ?? new Date();

  const title = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()} 산책`;

  const petIds =
    selectedPetIds.length > 0
      ? selectedPetIds
      : petList.map((pet) => pet.petId).filter(Boolean);

  const names = petIds
    .map((id) => petList.find((pet) => pet.petId === id)?.name?.trim())
    .filter((name): name is string => Boolean(name));

  const content =
    names.length === 0
      ? "나중에 일기를 작성할 예정입니다."
      : names.length === 1
        ? `${names[0]}와 함께한 산책`
        : `${names.join(", ")}와 함께한 산책`;

  return { title, content };
};

/**
 * 러닝 세션 → 산책 일기 등록
 * POST /diaries (application/json)
 */
export const submitWalkDiary = async (
  title: string,
  content: string,
): Promise<CreateDiaryResponse> => {
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (trimmedTitle.length > 100) {
    throw new Error("제목은 100자 이하로 입력해 주세요.");
  }

  const runData = useRunStore.getState().runData;
  const trackingId = runData?.trackingId;
  if (!trackingId) {
    throw new Error("트래킹 정보가 없습니다. 셀피를 먼저 저장해 주세요.");
  }

  const weather = useWeatherStore.getState().current;

  return createDiary({
    tracking_id: trackingId,
    writing_time: formatLocalDateTime(new Date()),
    title: trimmedTitle,
    content: trimmedContent,
    weather: {
      temp: weather.temp != null ? String(Math.round(weather.temp)) : "0",
      sky: weather.sky != null ? String(weather.sky) : "1",
      pty: weather.pty != null ? String(weather.pty) : "0",
    },
  });
};

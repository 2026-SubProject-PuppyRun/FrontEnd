import { usePetStore } from "@/store/usePetStore";
import { useRunStore } from "@/store/useRunStore";
import {
  getTrackingId,
  saveTracking,
  type SaveTrackingResponse,
} from "@/util/api/tracking";
import { formatLocalDateTime } from "@/util/run/submitWalkDiary";

const buildPath = (
  route: { latitude: number; longitude: number }[],
  durationSec: number,
) => {
  if (route.length === 0) return [];
  if (route.length === 1) {
    return [{ lat: route[0].latitude, lng: route[0].longitude, time: 0 }];
  }

  return route.map((coord, index) => ({
    lat: coord.latitude,
    lng: coord.longitude,
    time: Math.round((index / (route.length - 1)) * durationSec),
  }));
};

/** "10'30''" → "10'30" (백엔드 Min'Sec 형식) */
const toAveragePace = (pace: string | undefined) => {
  if (!pace) return "0'00";
  return pace.replace(/''+$/, "").replace(/"$/, "") || "0'00";
};

/**
 * 셀피 촬영 직후 산책 기록을 백엔드에 저장.
 * POST /tracking — request JSON + images(셀피)
 */
export const submitWalkTracking = async (
  selfieUri?: string | null,
): Promise<SaveTrackingResponse> => {
  const { runData } = useRunStore.getState();
  const route = runData?.route ?? [];

  if (route.length === 0) {
    throw new Error("저장할 산책 경로가 없습니다.");
  }

  const petList = usePetStore.getState().petList ?? [];
  // const petIdList = petList.map((pet) => pet.petId).filter(Boolean); 
  const petIdList = ["d1f01c51-fabf-4e14-9831-32a182ca752a"]; // 참여한 반려견 더미 데이터
  if (petIdList.length === 0) {
    throw new Error("산책에 참여한 반려견 정보가 없습니다.");
  }

  const duration = runData.totalTime ?? 0;
  const distance = Math.round(runData.distance ?? 0);
  const endedAt = runData.stopTime ?? new Date();
  const startedAt = new Date(endedAt.getTime() - duration * 1000);
  const selfie = selfieUri ?? runData.selfie;

  // 실제 HTTP: POST {BASE_URL}/tracking (multipart)
  console.log("[submitWalkTracking] 서버로 산책 기록 전송 시작");
  const response = await saveTracking({
    request: {
      started_at: formatLocalDateTime(startedAt),
      ended_at: formatLocalDateTime(endedAt),
      visibility: "PRIVATE",
      distance,
      average_pace: toAveragePace(runData.averagePace ?? runData.pace),
      path: buildPath(route, duration),
      pet_id_list: petIdList,
      rest_periods: [],
    },
    images: selfie ? [{ uri: selfie }] : [],
  });
  console.log("[submitWalkTracking] 서버 응답:", response);

  const trackingId = getTrackingId(response);
  if (trackingId) {
    useRunStore.getState().addRunData({ trackingId });
  }

  return response;
};

import type { FeedDetail } from "@/types/feed";
import type { TrackingDetailResponse } from "./api";

/** "6'30" → "6'30''" (앱 표시 형식) */
const toDisplayPace = (pace: string | undefined) => {
  if (!pace) return "0'00''";
  if (pace.endsWith("''")) return pace;
  if (pace.includes("'")) return `${pace}''`;
  return pace;
};

/** GET /tracking/{id} → 피드 상세 UI 모델 */
export const mapTrackingDetailToFeedDetail = (
  tracking: TrackingDetailResponse,
): FeedDetail => {
  const images = [...(tracking.tracking_images ?? [])].sort(
    (a, b) => a.order - b.order,
  );
  const diary = tracking.diary_info;
  const dateSource = diary?.writing_time || tracking.started_at;

  return {
    id: tracking.id,
    title: diary?.title,
    contents: diary?.content,
    selfieImgUrl: images[0]?.image ?? "",
    routeImgUrl: images[1]?.image,
    route: (tracking.path ?? []).map((point) => ({
      latitude: point.lat,
      longitude: point.lng,
    })),
    pace: toDisplayPace(tracking.average_pace),
    distance: tracking.distance ?? 0,
    duration: tracking.duration ?? 0,
    date: dateSource ? new Date(dateSource) : new Date(),
    diaryId: diary?.diary_id,
    weather: diary?.weather
      ? {
          temp: diary.weather.temp,
          sky: diary.weather.sky_code,
          pty: diary.weather.pty_code,
        }
      : undefined,
    pets: (tracking.pet_list ?? []).map((pet) => ({
      petId: pet.pet_id,
      name: pet.name,
      profileImageUrl: pet.profile_image,
      color: pet.theme_color,
    })),
  };
};

import { appendJsonRequestPart } from "../core/appendJsonRequestPart";
import { apiGet, apiPostForm } from "../core/client";

export type TrackingPathPoint = {
  lat: number;
  lng: number;
  /** 시작 시점부터 경과 초 */
  time: number;
};

export type TrackingRestPeriod = {
  start_time: string;
  end_time: string;
  duration_second: number;
};

/**
 * POST /tracking 의 request JSON 파트
 */
export type SaveTrackingRequest = {
  started_at: string;
  ended_at: string;
  visibility: "PRIVATE" | "PUBLIC";
  distance: number;
  path: TrackingPathPoint[];
  average_pace: string;
  pet_id_list: string[];
  rest_periods: TrackingRestPeriod[];
};

export type SaveTrackingResponse = {
  tracking_id?: string;
  id?: string;
  [key: string]: unknown;
};

export type TrackingImage = {
  uri: string;
  name?: string;
  type?: string;
};

export type SaveTrackingParams = {
  request: SaveTrackingRequest;
  images?: TrackingImage[];
};

/** GET /tracking — 피드 목록 아이템 */
export type TrackingFeedItem = {
  id: string;
  featured_image: string;
  /** @deprecated 백엔드에서 제거 예정 */
  path?: TrackingPathPoint[];
};

export type TrackingListResponse = {
  tracking_list: TrackingFeedItem[];
};

/** 피드 그리드(FeedBoardItem)용 매핑 */
export type TrackingFeedCard = {
  id: string;
  imgUrl: string;
};

/** GET /tracking/{id} — 피드 상세 */
export type TrackingDetailImage = {
  order: number;
  image: string;
};

export type TrackingDetailWeather = {
  temp: string;
  sky_code: string;
  pty_code: string;
};

export type TrackingDetailDiaryInfo = {
  diary_id: string;
  writing_time: string;
  title: string;
  content: string;
  weather: TrackingDetailWeather;
};

export type TrackingDetailPet = {
  pet_id: string;
  name: string;
  profile_image: string;
  theme_color: string;
};

export type TrackingDetailResponse = {
  id: string;
  started_at: string;
  ended_at: string;
  duration: number;
  visibility: "PRIVATE" | "PUBLIC";
  distance: number;
  tracking_images: TrackingDetailImage[];
  average_pace: string;
  path: TrackingPathPoint[];
  diary_info?: TrackingDetailDiaryInfo | null;
  pet_list: TrackingDetailPet[];
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
 * 피드용 산책 기록 목록 조회
 * GET /tracking
 *
 * @example
 * const { tracking_list } = await getTrackingList();
 */
export const getTrackingList = () =>
  apiGet<TrackingListResponse>("/tracking");

/**
 * 산책 기록 상세 조회 (피드 상세)
 * GET /tracking/{id}
 */
export const getTrackingById = (trackingId: string) =>
  apiGet<TrackingDetailResponse>(`/tracking/${trackingId}`);

/** tracking_list → 피드 카드 목록 (path 미사용) */
export const mapTrackingListToFeedCards = (
  response: TrackingListResponse,
): TrackingFeedCard[] =>
  (response.tracking_list ?? []).map((item) => ({
    id: item.id,
    imgUrl: item.featured_image,
  }));

/**
 * 산책 기록 저장
 * POST /tracking (multipart/form-data)
 */
export const saveTracking = ({
  request,
  images = [],
}: SaveTrackingParams) => {
  console.log("[saveTracking] request:", JSON.stringify(request, null, 2));
  console.log(
    "[saveTracking] images:",
    images.map((image) => image.uri),
  );

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

  return apiPostForm<SaveTrackingResponse>("/tracking", formData);
};

export const getTrackingId = (response: SaveTrackingResponse) =>
  response.tracking_id ??
  (typeof response.id === "string" ? response.id : null);

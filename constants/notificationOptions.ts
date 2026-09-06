export const NOTIFICATION_OPTION_CODES = [
  "SYS_001",
  "ACT_001",
  "ACT_002",
  "MKT_001",
] as const;

export type NotificationOptionCode =
  (typeof NOTIFICATION_OPTION_CODES)[number];

export const NOTIFICATION_OPTION_LABELS: Record<
  NotificationOptionCode,
  string
> = {
  SYS_001: "전체 공지사항",
  ACT_001: "일일 산책 리마인더",
  ACT_002: "주간 산책 목표 달성",
  MKT_001: "이벤트·프로모션 안내",
};

/** 차트 스크롤 좌우 padding 24×2 */
export const CHART_SCROLL_INSET = 48;
/** 차트 카드 padding p-5 = 20×2 */
export const CHART_CARD_PADDING = 40;

export type ChartLayout = {
  contentWidth: number;
  isCompact: boolean;
  radarSize: number;
  pieRadius: number;
  pieInnerRadius: number;
  barWidth: number;
  barSpacing: number;
  monthlySpacing: number;
};

export const getChartLayout = (windowWidth: number): ChartLayout => {
  const contentWidth = Math.max(
    200,
    windowWidth - CHART_SCROLL_INSET - CHART_CARD_PADDING,
  );
  const isCompact = contentWidth < 280;

  return {
    contentWidth,
    isCompact,
    radarSize: Math.min(280, Math.max(200, contentWidth - 4)),
    pieRadius: isCompact ? 70 : 88,
    pieInnerRadius: isCompact ? 46 : 58,
    barWidth: isCompact ? 16 : 22,
    barSpacing: isCompact ? 12 : 18,
    monthlySpacing: Math.max(
      22,
      Math.min(36, Math.floor((contentWidth - 48) / 12)),
    ),
  };
};

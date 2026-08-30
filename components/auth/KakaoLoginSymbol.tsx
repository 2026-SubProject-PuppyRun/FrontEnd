import Svg, { Rect } from "react-native-svg";

type KakaoLoginSymbolProps = {
  size?: number;
};

/** 카카오 로그인 심볼 (꼬리 없는 말풍선, #000000) */
const KakaoLoginSymbol = ({ size = 18 }: KakaoLoginSymbolProps) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Rect x="1" y="1" width="16" height="16" rx="4" fill="#000000" />
  </Svg>
);

export default KakaoLoginSymbol;

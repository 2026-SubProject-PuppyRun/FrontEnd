import Svg, { Defs, Image, Pattern, Rect, Use } from "react-native-svg";
import { RUN_LOGO_IMAGE_DATA } from "./runLogoImageData";

type RunLogoSvgProps = {
  width?: number;
  height?: number;
};

const RunLogoSvg = ({ width = 189, height = 50 }: RunLogoSvgProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 189 50" fill="none">
      <Defs>
        <Pattern
          id="pattern0_1302_642"
          patternContentUnits="objectBoundingBox"
          width={1}
          height={1}
        >
          <Use
            href="#image0_1302_642"
            transform="matrix(0.000856898 0 0 0.00323907 0 -0.00205656)"
          />
        </Pattern>
        <Image
          id="image0_1302_642"
          width={1167}
          height={310}
          preserveAspectRatio="none"
          xlinkHref={RUN_LOGO_IMAGE_DATA}
        />
      </Defs>
      <Rect width={189} height={50} fill="url(#pattern0_1302_642)" />
    </Svg>
  );
};

export default RunLogoSvg;

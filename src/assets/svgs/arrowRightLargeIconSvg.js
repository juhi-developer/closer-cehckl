import * as React from "react"
import Svg, { Path } from "react-native-svg"

const ArrowRightLargeIconSvg = (props) => (
  <Svg
    width={28}
    height={28}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M16.836 6.919 23.918 14l-7.082 7.082M4.084 14h19.635"
      stroke="#124698"
      strokeWidth={2}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
)

export default ArrowRightLargeIconSvg;

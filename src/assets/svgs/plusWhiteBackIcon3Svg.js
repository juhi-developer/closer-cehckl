import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg"

const PlusWhiteBackIcon3Svg = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    fill="none"
    {...props}
  >
    <Circle
      cx={14}
      cy={14}
      r={13}
      fill="#fff"
      stroke="#D8E7F8"
      strokeWidth={2}
    />
    <Path
      stroke="#124698"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.558 13.982h10.889M14.002 19.427V8.538"
    />
  </Svg>
)
export default PlusWhiteBackIcon3Svg;
